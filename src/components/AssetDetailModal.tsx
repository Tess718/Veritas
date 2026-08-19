import React, { useState } from 'react';
import { RWAAsset, WalletState } from '../types';
import { TelemetryChart } from './TelemetryChart';
import { getActiveNetworkParams } from '../constants/botChain';
import { ethers } from 'ethers';
import confetti from 'canvas-confetti';
import { X, ShieldCheck, ExternalLink, Calculator, FileText, CheckCircle2, Zap, AlertCircle, ArrowRight } from 'lucide-react';

interface AssetDetailModalProps {
  asset: RWAAsset | null;
  wallet: WalletState;
  onClose: () => void;
  onPurchaseSuccess: (asset: RWAAsset, fractions: number, totalBOT: number) => void;
}

export const AssetDetailModal: React.FC<AssetDetailModalProps> = ({
  asset,
  wallet,
  onClose,
  onPurchaseSuccess
}) => {
  if (!asset) return null;

  const [activeTab, setActiveTab] = useState<'overview' | 'telemetry' | 'calculator' | 'legal'>('overview');
  const [purchaseFractions, setPurchaseFractions] = useState<number>(10);
  const [paymentCurrency, setPaymentCurrency] = useState<'BOT' | 'USDT'>('BOT');
  const [isMinting, setIsMinting] = useState<boolean>(false);
  const [mintTxHash, setMintTxHash] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const activeParams = getActiveNetworkParams();
  const totalCostBOT = purchaseFractions * asset.fractionPriceBOT;
  const totalCostUSDT = purchaseFractions * asset.fractionPriceUSDT;
  const estimatedAnnualYieldBOT = (totalCostBOT * (asset.apy / 100)).toFixed(2);
  const estimatedMonthlyYieldBOT = ((totalCostBOT * (asset.apy / 100)) / 12).toFixed(2);

  // REAL Smart Contract Execution on BOT Chain via Ethers.js v6
  const handleMintFraction = async () => {
    setErrorMessage(null);
    setMintTxHash(null);

    if (!wallet.isConnected || !(window as any).ethereum) {
      setErrorMessage("Please connect your EVM wallet to execute on BOT Chain!");
      return;
    }

    setIsMinting(true);
    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();

      if (paymentCurrency === 'USDT') {
        // USDT purchase flow (requires approval)
        const usdtAbi = [
          "function approve(address spender, uint256 amount) external returns (bool)",
          "function allowance(address owner, address spender) external view returns (uint256)"
        ];
        const vaultAbi = [
          "function purchaseFractionsWithUSDT(address _assetToken, uint256 _fractionsToBuy, uint256 _pricePerFractionUSDT) external"
        ];

        const usdtContract = new ethers.Contract(activeParams.usdtContract, usdtAbi, signer);
        const vaultContract = new ethers.Contract(activeParams.vaultContract, vaultAbi, signer);

        // Convert USDT float amounts to 18 decimal places (standard for BOT USDT)
        const totalCostUSDTWei = ethers.parseUnits(totalCostUSDT.toFixed(18), 18);
        const pricePerFractionUSDTWei = ethers.parseUnits(asset.fractionPriceUSDT.toFixed(18), 18);

        // 1. Check existing allowance
        const currentAllowance = await usdtContract.allowance(wallet.address, activeParams.vaultContract);

        if (currentAllowance < totalCostUSDTWei) {
          setErrorMessage("Approving USDT spent allowance in wallet...");
          const approveTx = await usdtContract.approve(activeParams.vaultContract, totalCostUSDTWei);
          await approveTx.wait(1);
          setErrorMessage("USDT spent approved successfully! Sending purchase transaction...");
        }

        // 2. Buy fractions
        const tx = await vaultContract.purchaseFractionsWithUSDT(
          asset.contractAddress,
          purchaseFractions,
          pricePerFractionUSDTWei
        );

        setMintTxHash(tx.hash);
        await tx.wait(1);

        setIsMinting(false);
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        onPurchaseSuccess(asset, purchaseFractions, totalCostBOT);
      } else {
        // Native BOT purchase flow
        const vaultAbi = [
          "function purchaseFractionsWithBOT(address _assetToken, uint256 _fractionsToBuy, uint256 _pricePerFractionBOT) external payable"
        ];

        const vaultContract = new ethers.Contract(activeParams.vaultContract, vaultAbi, signer);

        // Convert BOT float amounts to wei safely
        const totalCostWei = ethers.parseEther(totalCostBOT.toFixed(18));
        const pricePerFractionWei = ethers.parseEther(asset.fractionPriceBOT.toFixed(18));

        // Send transaction
        const tx = await vaultContract.purchaseFractionsWithBOT(
          asset.contractAddress,
          purchaseFractions,
          pricePerFractionWei,
          { value: totalCostWei }
        );

        setMintTxHash(tx.hash);
        await tx.wait(1);

        setIsMinting(false);
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        onPurchaseSuccess(asset, purchaseFractions, totalCostBOT);
      }
    } catch (err: any) {
      console.error("Real Contract Execution Error:", err);
      setIsMinting(false);
      
      // Handle user rejection or RPC fallback display
      if (err.code === 4001 || err.message?.includes('user rejected')) {
        setErrorMessage("Transaction was cancelled in your wallet.");
      } else {
        let errMsg = err.reason || err.message || "Transaction broadcasted to BOT Chain network.";
        if (paymentCurrency === 'USDT') {
          // Prettify error to reflect selected currency
          errMsg = errMsg.replace(/BOT/g, 'USDT');
        }
        setErrorMessage(errMsg);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="glass-card max-w-4xl w-full rounded-2xl border border-white/15 overflow-hidden shadow-2xl relative my-8 animate-in fade-in zoom-in duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header Banner */}
        <div className="relative h-56 w-full overflow-hidden bg-surface">
          <img src={asset.image} alt={asset.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#101422] via-[#101422]/60 to-black/30"></div>
          
          <div className="absolute bottom-4 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-2">
            <div>
              <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 mb-1">
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 border border-cyan-500/40">{asset.categoryName}</span>
                <span>•</span>
                <span>{asset.location}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white">{asset.name}</h2>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono font-bold text-sm">
                {asset.apy}% APY
              </span>
              <span className="px-3 py-1 rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-300 font-mono font-bold text-sm">
                Rating {asset.riskScore}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-white/10 bg-white/5 px-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-3 text-xs font-mono font-semibold transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'overview' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Overview & Specifications
          </button>
          <button
            onClick={() => setActiveTab('telemetry')}
            className={`px-4 py-3 text-xs font-mono font-semibold transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'telemetry' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Live IoT Telemetry
          </button>
          <button
            onClick={() => setActiveTab('calculator')}
            className={`px-4 py-3 text-xs font-mono font-semibold transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'calculator' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Yield Calculator & ROI
          </button>
          <button
            onClick={() => setActiveTab('legal')}
            className={`px-4 py-3 text-xs font-mono font-semibold transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'legal' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Legal SPV & Contracts
          </button>
        </div>

        {/* Modal Body Grid */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Tab Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-gray-300 uppercase tracking-wider font-mono">Asset Summary</h4>
                  <p className="text-xs text-gray-300 leading-relaxed mt-1 font-sans">{asset.description}</p>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-gray-300 uppercase tracking-wider font-mono mb-2">Key Protocol Features</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {asset.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center space-x-2 p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-200">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                    <div className="text-[10px] text-gray-400 font-mono uppercase">Contract Address</div>
                    <div className="text-xs font-mono text-cyan-300 truncate mt-1">{asset.contractAddress}</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                    <div className="text-[10px] text-gray-400 font-mono uppercase">Verified Oracle</div>
                    <div className="text-xs font-mono text-emerald-400 truncate mt-1">{asset.verifier}</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'telemetry' && (
              <div className="space-y-4">
                <p className="text-xs text-gray-300 font-sans">
                  Real-time IoT sensors transmit cryptographic state proofs directly onto BOT Chain every 15 seconds.
                </p>
                <TelemetryChart
                  telemetryType={asset.telemetryType}
                  unit={asset.telemetryUnit}
                  currentValue={asset.telemetryCurrentValue}
                  verifier={asset.verifier}
                />
              </div>
            )}

            {activeTab === 'calculator' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                  <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400">
                    <Calculator className="w-4 h-4" />
                    <span className="uppercase font-bold">Interactive Earnings Forecast</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-black/40 border border-white/10">
                      <div className="text-[10px] text-gray-400 font-mono uppercase">Estimated Monthly Payout</div>
                      <div className="text-lg font-bold text-emerald-400 font-mono mt-1">
                        {estimatedMonthlyYieldBOT} BOT
                      </div>
                      <div className="text-[10px] text-gray-500 font-mono">~${(parseFloat(estimatedMonthlyYieldBOT) * 0.0425).toFixed(2)} USDT</div>
                    </div>

                    <div className="p-3 rounded-lg bg-black/40 border border-white/10">
                      <div className="text-[10px] text-gray-400 font-mono uppercase">Estimated Annual Yield</div>
                      <div className="text-lg font-bold text-cyan-400 font-mono mt-1">
                        {estimatedAnnualYieldBOT} BOT
                      </div>
                      <div className="text-[10px] text-gray-500 font-mono">~${(parseFloat(estimatedAnnualYieldBOT) * 0.0425).toFixed(2)} USDT</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'legal' && (
              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2">
                  <div className="text-gray-400">DocuSign IPFS Legal Audit Hash:</div>
                  <div className="text-cyan-300 break-all bg-black/50 p-2 rounded border border-white/10 text-[11px]">
                    {asset.spvDocumentHash}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div>
                    <div className="text-white font-bold">BOT Chain Explorer Contract</div>
                    <div className="text-gray-400 text-[10px]">Verified bytecode on {activeParams.blockExplorerUrl}</div>
                  </div>
                  <a
                    href={`${activeParams.blockExplorerUrl}/address/${asset.contractAddress}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center space-x-1 hover:bg-cyan-500/30 transition-colors"
                  >
                    <span>View on Scan</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Real On-Chain Minting Sidebar */}
          <div className="glass-panel p-5 rounded-xl border border-cyan-500/30 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="pb-3 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">Mint Fractions</h3>
                <span className="text-[11px] font-mono text-emerald-400">Available: {asset.availableFractions.toLocaleString()}</span>
              </div>

              {/* Currency Selector */}
              <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-black/40 border border-white/10">
                <button
                  onClick={() => setPaymentCurrency('BOT')}
                  className={`py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                    paymentCurrency === 'BOT' ? 'bg-cyan-500 text-black' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Pay with BOT
                </button>
                <button
                  onClick={() => setPaymentCurrency('USDT')}
                  className={`py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                    paymentCurrency === 'USDT' ? 'bg-emerald-500 text-black' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Pay with USDT
                </button>
              </div>

              {/* Input Shares */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-gray-400">Fractions to Purchase:</label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max={asset.availableFractions}
                    value={purchaseFractions}
                    onChange={(e) => setPurchaseFractions(Math.max(1, parseInt(e.target.value) || 1))}
                    className="glass-input w-full px-3 py-2 rounded-xl text-sm font-mono text-white font-bold"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-gray-400">Shares</span>
                </div>
              </div>

              {/* Total Summary */}
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2 font-mono text-xs">
                <div className="flex justify-between text-gray-400">
                  <span>Price / Fraction:</span>
                  <span className="text-white font-bold">
                    {paymentCurrency === 'BOT' ? `${asset.fractionPriceBOT} BOT` : `$${asset.fractionPriceUSDT} USDT`}
                  </span>
                </div>
                <div className="flex justify-between text-gray-400 pt-1 border-t border-white/10">
                  <span>Total Amount:</span>
                  <span className="text-cyan-300 font-extrabold text-sm">
                    {paymentCurrency === 'BOT' ? `${totalCostBOT.toLocaleString()} BOT` : `$${totalCostUSDT.toLocaleString()} USDT`}
                  </span>
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 font-mono text-[11px] flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {mintTxHash && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-[11px] space-y-1">
                  <div className="flex items-center space-x-1 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Transaction Confirmed!</span>
                  </div>
                  <a
                    href={`${activeParams.blockExplorerUrl}/tx/${mintTxHash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="truncate text-cyan-400 underline block text-[10px]"
                  >
                    View TX: {mintTxHash}
                  </a>
                </div>
              )}
            </div>

            {/* Mint Action Button */}
            <button
              onClick={handleMintFraction}
              disabled={isMinting}
              className="btn-primary w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50"
            >
              {isMinting ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-black border-t-transparent animate-spin"></span>
                  <span>Executing on BOT Chain...</span>
                </>
              ) : (
                <>
                  <span>Mint Shares On-Chain</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
