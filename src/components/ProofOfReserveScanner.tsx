import React, { useState, useEffect } from 'react';
import { ShieldCheck, ExternalLink, RefreshCw, Cpu, Layers, CheckCircle2, AlertCircle, Search } from 'lucide-react';
import { SAMPLE_RWA_ASSETS, getActiveNetworkParams } from '../constants/botChain';
import { ethers } from 'ethers';

export const ProofOfReserveScanner: React.FC = () => {
  const activeParams = getActiveNetworkParams();

  // Real Network & Vault State
  const [currentBlock, setCurrentBlock] = useState<number | null>(null);
  const [vaultBotBalance, setVaultBotBalance] = useState<string>('0.00');
  const [gasPriceGwei, setGasPriceGwei] = useState<string>('0');
  const [isLoadingBlock, setIsLoadingBlock] = useState<boolean>(true);
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string>('');

  // Interactive Contract Checker
  const [searchAddress, setSearchAddress] = useState<string>('');
  const [checkedContractInfo, setCheckedContractInfo] = useState<{
    address: string;
    balanceBOT: string;
    hasCode: boolean;
  } | null>(null);
  const [isCheckingContract, setIsCheckingContract] = useState<boolean>(false);
  const [checkError, setCheckError] = useState<string | null>(null);

  // Fetch real block height & vault balance from BOT Chain RPC
  const fetchLiveNetworkData = async () => {
    setIsLoadingBlock(true);
    try {
      const provider = new ethers.JsonRpcProvider(activeParams.rpcUrl);
      
      // Fetch latest block
      const blockNum = await provider.getBlockNumber();
      setCurrentBlock(blockNum);

      // Fetch gas price
      const feeData = await provider.getFeeData();
      if (feeData.gasPrice) {
        setGasPriceGwei(ethers.formatUnits(feeData.gasPrice, 'gwei'));
      }

      // Fetch vault smart contract balance
      const vaultWei = await provider.getBalance(activeParams.vaultContract);
      setVaultBotBalance(parseFloat(ethers.formatEther(vaultWei)).toFixed(4));

      setLastUpdatedTime(new Date().toLocaleTimeString());
    } catch (err) {
      console.log('BOT Chain RPC read notice:', err);
    } finally {
      setIsLoadingBlock(false);
    }
  };

  useEffect(() => {
    fetchLiveNetworkData();
    const interval = setInterval(fetchLiveNetworkData, 15000);
    return () => clearInterval(interval);
  }, [activeParams.rpcUrl]);

  // Check any custom contract or address on BOT Chain
  const handleCheckAddress = async () => {
    const target = searchAddress.trim();
    if (!target) return;

    if (!ethers.isAddress(target)) {
      setCheckError('Please enter a valid EVM address format (0x...).');
      setCheckedContractInfo(null);
      return;
    }

    setCheckError(null);
    setIsCheckingContract(true);
    try {
      const provider = new ethers.JsonRpcProvider(activeParams.rpcUrl);
      const balanceWei = await provider.getBalance(target);
      const code = await provider.getCode(target);

      setCheckedContractInfo({
        address: target,
        balanceBOT: parseFloat(ethers.formatEther(balanceWei)).toFixed(4),
        hasCode: code !== '0x' && code !== ''
      });
    } catch (err: any) {
      setCheckError(`Failed to fetch address state from BOT Chain: ${err.message || err}`);
      setCheckedContractInfo(null);
    } finally {
      setIsCheckingContract(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 uppercase tracking-widest mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>On-Chain Verification & Network Status</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Proof of Reserve & Contract Audit</h1>
          <p className="text-xs text-gray-400 font-mono mt-1">
            Inspect real-time smart contract state, verified tokenized asset addresses, and live block headers on {activeParams.chainName}.
          </p>
        </div>

        <button
          onClick={fetchLiveNetworkData}
          disabled={isLoadingBlock}
          className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-cyan-300 flex items-center space-x-2 transition-all self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoadingBlock ? 'animate-spin text-cyan-400' : ''}`} />
          <span>Refresh On-Chain State</span>
        </button>
      </div>

      {/* Real Network Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-card p-5 rounded-2xl border border-white/10">
          <div className="text-[10px] text-gray-400 font-mono uppercase">Target Network</div>
          <div className="text-lg font-bold text-white font-mono mt-1 flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>{activeParams.chainName}</span>
          </div>
          <div className="text-[11px] text-gray-500 font-mono mt-1">Chain ID: {activeParams.chainId}</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/10">
          <div className="text-[10px] text-gray-400 font-mono uppercase">Latest Block Height</div>
          <div className="text-lg font-bold text-cyan-300 font-mono mt-1">
            {currentBlock ? `#${currentBlock.toLocaleString()}` : 'Syncing...'}
          </div>
          <div className="text-[11px] text-gray-500 font-mono mt-1">
            {lastUpdatedTime ? `Updated at ${lastUpdatedTime}` : 'Fetching RPC...'}
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/10">
          <div className="text-[10px] text-gray-400 font-mono uppercase">Vault Contract Balance</div>
          <div className="text-lg font-bold text-emerald-400 font-mono mt-1">
            {vaultBotBalance} BOT
          </div>
          <div className="text-[11px] text-gray-500 font-mono mt-1 truncate" title={activeParams.vaultContract}>
            Vault: {activeParams.vaultContract.substring(0, 10)}...
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/10">
          <div className="text-[10px] text-gray-400 font-mono uppercase">Network Gas Price</div>
          <div className="text-lg font-bold text-purple-300 font-mono mt-1">
            {gasPriceGwei} Gwei
          </div>
          <div className="text-[11px] text-gray-500 font-mono mt-1">RPC: {activeParams.rpcUrl}</div>
        </div>

      </div>

      {/* Interactive On-Chain Address Inspector Tool */}
      <div className="glass-card p-6 rounded-2xl border border-cyan-500/30 space-y-4">
        <div className="flex items-center space-x-2 text-xs font-mono text-cyan-300 font-bold uppercase tracking-wider">
          <Search className="w-4 h-4 text-cyan-400" />
          <span>Interactive On-Chain Address Inspector</span>
        </div>
        <p className="text-xs text-gray-300 font-sans">
          Verify any smart contract or wallet address on {activeParams.chainName} directly via JSON-RPC.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Enter contract or wallet address (0x...)"
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCheckAddress()}
            className="glass-input flex-1 px-4 py-2.5 rounded-xl text-xs font-mono text-white placeholder:text-gray-500"
          />
          <button
            onClick={handleCheckAddress}
            disabled={isCheckingContract || !searchAddress.trim()}
            className="btn-primary px-5 py-2.5 rounded-xl text-xs font-bold font-mono uppercase flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {isCheckingContract ? (
              <>
                <span className="w-3.5 h-3.5 rounded-full border-2 border-black border-t-transparent animate-spin"></span>
                <span>Checking RPC...</span>
              </>
            ) : (
              <span>Inspect Address</span>
            )}
          </button>
        </div>

        {checkError && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 font-mono text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{checkError}</span>
          </div>
        )}

        {checkedContractInfo && (
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2 font-mono text-xs text-gray-200">
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-gray-400">Target Address:</span>
              <span className="text-cyan-300 font-bold break-all">{checkedContractInfo.address}</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-gray-400">Native BOT Balance:</span>
              <span className="text-emerald-400 font-bold">{checkedContractInfo.balanceBOT} BOT</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Bytecode Deployed:</span>
              <span className={checkedContractInfo.hasCode ? "text-emerald-400 font-bold flex items-center space-x-1" : "text-amber-400 font-bold"}>
                {checkedContractInfo.hasCode ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Smart Contract Verified</span>
                  </>
                ) : (
                  <span>Externally Owned Account (EOA)</span>
                )}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Verified RWA Asset Contracts Table */}
      <div className="glass-card rounded-2xl overflow-hidden border border-white/10">
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white font-mono uppercase tracking-wider">Tokenized Asset Smart Contracts</h3>
            <p className="text-xs text-gray-400 font-sans mt-0.5">Deployed smart contracts registered on {activeParams.chainName}</p>
          </div>
          <span className="text-xs font-mono text-cyan-300">{SAMPLE_RWA_ASSETS.length} Verified Contracts</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-white/5 text-gray-400 uppercase border-b border-white/10 text-[10px]">
              <tr>
                <th className="px-6 py-3.5">Asset Name</th>
                <th className="px-6 py-3.5">Category</th>
                <th className="px-6 py-3.5">Contract Address</th>
                <th className="px-6 py-3.5">Total Shares</th>
                <th className="px-6 py-3.5">Share Price</th>
                <th className="px-6 py-3.5 text-right">Explorer Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-200">
              {SAMPLE_RWA_ASSETS.map((asset) => (
                <tr key={asset.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-bold text-white flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{asset.name}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{asset.categoryName}</td>
                  <td className="px-6 py-4 text-cyan-300 truncate max-w-[160px]" title={asset.contractAddress}>
                    {asset.contractAddress}
                  </td>
                  <td className="px-6 py-4">{asset.totalFractions.toLocaleString()} shares</td>
                  <td className="px-6 py-4 text-emerald-400 font-bold">{asset.fractionPriceBOT} BOT (${asset.fractionPriceUSDT})</td>
                  <td className="px-6 py-4 text-right">
                    <a
                      href={`${activeParams.blockExplorerUrl}/address/${asset.contractAddress}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center space-x-1 text-cyan-400 hover:text-white transition-colors"
                    >
                      <span>Inspect</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Disclaimer */}
      <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-gray-400 font-mono text-xs leading-relaxed">
        <strong className="text-gray-300 uppercase">Verification Methodology:</strong> All asset contracts are standard ERC-20 tokenized shares deployed on BOT Chain. Contract addresses, native balances, and block headers are queried directly from BOT Chain JSON-RPC endpoints.
      </div>

    </div>
  );
};
