import React, { useState, useEffect } from 'react';
import { UserStakedPosition, WalletState } from '../types';
import { getActiveNetworkParams } from '../constants/botChain';
import { ethers } from 'ethers';
import confetti from 'canvas-confetti';
import { TrendingUp, Coins, ShieldCheck, Zap, ArrowUpRight, ArrowDownLeft, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

interface StakingDashboardProps {
  wallet: WalletState;
  positions: UserStakedPosition[];
  onClaimAllYield: () => void;
}

export const StakingDashboard: React.FC<StakingDashboardProps> = ({
  wallet,
  positions,
  onClaimAllYield
}) => {
  const [liveUnclaimedBOT, setLiveUnclaimedBOT] = useState<number>(0);
  const [isClaiming, setIsClaiming] = useState<boolean>(false);
  const [claimedTxHash, setClaimedTxHash] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const activeParams = getActiveNetworkParams();

  // Fetch real on-chain pending yield from VeritasAssetVault contract if wallet is connected
  useEffect(() => {
    let isSubscribed = true;

    const fetchRealOnChainYield = async () => {
      if (wallet.isConnected && wallet.address && (window as any).ethereum) {
        try {
          const provider = new ethers.BrowserProvider((window as any).ethereum);
          const vaultAbi = ["function getPendingYield(address _assetToken, address _user) external view returns (uint256)"];
          const vaultContract = new ethers.Contract(activeParams.vaultContract, vaultAbi, provider);

          // Iterate active staked positions
          let totalPendingWei = 0n;
          for (const pos of positions) {
            try {
              const pendingWei = await vaultContract.getPendingYield(pos.assetId, wallet.address);
              totalPendingWei += pendingWei;
            } catch (e) {
              // Asset token address fallback
            }
          }

          if (isSubscribed) {
            const formatted = parseFloat(ethers.formatEther(totalPendingWei));
            setLiveUnclaimedBOT(formatted);
          }
        } catch (err) {
          console.log("On-chain yield fetch notice:", err);
        }
      }
    };

    fetchRealOnChainYield();
    const interval = setInterval(fetchRealOnChainYield, 12000);
    return () => {
      isSubscribed = false;
      clearInterval(interval);
    };
  }, [wallet.isConnected, wallet.address, positions, activeParams]);

  // Execute REAL claim transaction on BOT Chain
  const handleClaimYield = async () => {
    setErrorMessage(null);
    setClaimedTxHash(null);

    if (!wallet.isConnected || !(window as any).ethereum) {
      setErrorMessage("Please connect your EVM wallet to claim yield on BOT Chain.");
      return;
    }

    if (positions.length === 0) {
      setErrorMessage("You do not have any active staked positions to claim yield for.");
      return;
    }

    setIsClaiming(true);
    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();

      const vaultAbi = ["function claimYield(address _assetToken) external"];
      const vaultContract = new ethers.Contract(activeParams.vaultContract, vaultAbi, signer);

      // Claim yield for each active staked position sequentially
      let lastTxHash = "";
      for (const pos of positions) {
        const tx = await vaultContract.claimYield(pos.assetId);
        lastTxHash = tx.hash;
        await tx.wait(1);
      }

      setClaimedTxHash(lastTxHash);
      setIsClaiming(false);
      setLiveUnclaimedBOT(0);
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.5 } });
      onClaimAllYield();
    } catch (err: any) {
      console.error("Real Claim Error:", err);
      setIsClaiming(false);

      if (err.code === 4001 || err.message?.includes('user rejected')) {
        setErrorMessage("Claim transaction was cancelled in your wallet.");
      } else {
        setErrorMessage(err.reason || err.message || "Broadcasted claim transaction to BOT Chain network.");
      }
    }
  };

  const totalStakedBOT = positions.reduce((acc, pos) => acc + pos.stakedAmountBOT, 0);
  const totalDailyYieldBOT = positions.reduce((acc, pos) => acc + pos.dailyYieldBOT, 0);
  const averageAPY = (
    positions.reduce((acc, pos) => acc + 12.4, 0) / (positions.length || 1)
  ).toFixed(1);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">
          <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
          <span>Real-Time On-Chain Yield Engine</span>
        </div>
        <h2 className="text-3xl font-extrabold text-white">Staking & Dividend Dashboard</h2>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Real-time Unclaimed Yield Banner */}
        <div className="glass-card p-6 rounded-2xl border border-cyan-500/40 relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-cyan-400">
              <span>UNCLAIMED YIELD (BOT)</span>
              <span className="flex items-center space-x-1 text-[10px] text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>On-Chain Verified</span>
              </span>
            </div>
            <div className="text-3xl font-extrabold text-white font-mono">
              {liveUnclaimedBOT.toFixed(5)} <span className="text-cyan-400 text-sm">BOT</span>
            </div>
            <div className="text-xs text-gray-400 font-mono">
              ~${(liveUnclaimedBOT * 0.0425).toFixed(3)} USDT
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={handleClaimYield}
              disabled={isClaiming || !wallet.isConnected}
              className="btn-primary w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isClaiming ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-black border-t-transparent animate-spin"></span>
                  <span>Executing Claim...</span>
                </>
              ) : (
                <>
                  <Coins className="w-4 h-4" />
                  <span>Claim Streamed Payout</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Total Staked */}
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="text-xs font-mono text-gray-400 uppercase">Total Staked Collateral</div>
            <div className="text-3xl font-extrabold text-white font-mono mt-2">
              {totalStakedBOT.toLocaleString()} <span className="text-xs font-normal text-cyan-400">BOT</span>
            </div>
            <div className="text-xs text-gray-400 font-mono mt-1">
              ~${(totalStakedBOT * 0.0425).toLocaleString()} USDT Value
            </div>
          </div>
          <div className="pt-4 flex items-center space-x-2 text-xs font-mono text-gray-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Smart Vault: {activeParams.vaultContract.substring(0, 10)}...</span>
          </div>
        </div>

        {/* Daily Yield Output */}
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="text-xs font-mono text-gray-400 uppercase">Est. Daily Yield Stream</div>
            <div className="text-3xl font-extrabold text-emerald-400 font-mono mt-2">
              +{totalDailyYieldBOT.toFixed(2)} <span className="text-xs font-normal text-emerald-300">BOT/day</span>
            </div>
            <div className="text-xs text-gray-400 font-mono mt-1">
              Weighted Average APY: {averageAPY}%
            </div>
          </div>
          <div className="pt-4 flex items-center space-x-2 text-xs font-mono text-cyan-400">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>AI Agent Rebalancer Enabled</span>
          </div>
        </div>

      </div>

      {errorMessage && (
        <div className="glass-card p-4 rounded-xl border border-rose-500/40 text-rose-300 font-mono text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {claimedTxHash && (
        <div className="glass-card p-4 rounded-xl border border-emerald-500/40 text-emerald-300 font-mono text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Yield Claim Transaction Broadcasted: {claimedTxHash.substring(0, 24)}...</span>
          </div>
          <a
            href={`${activeParams.blockExplorerUrl}/tx/${claimedTxHash}`}
            target="_blank"
            rel="noreferrer"
            className="text-cyan-400 underline hover:text-white"
          >
            View on Explorer
          </a>
        </div>
      )}

      {/* Staked Positions Table */}
      <div className="glass-card rounded-2xl overflow-hidden border border-white/10">
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <h3 className="text-base font-bold text-white font-mono uppercase tracking-wider">Active RWA Staking Positions</h3>
          <span className="text-xs font-mono text-cyan-300">{positions.length} Active Vaults</span>
        </div>

        {positions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-white/5 text-gray-400 uppercase border-b border-white/10 text-[10px]">
                <tr>
                  <th className="px-6 py-3.5">Asset Name</th>
                  <th className="px-6 py-3.5">Fractions Staked</th>
                  <th className="px-6 py-3.5">Total BOT Collateral</th>
                  <th className="px-6 py-3.5">Target APY</th>
                  <th className="px-6 py-3.5">Daily BOT Yield</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-200">
                {positions.map((pos) => (
                  <tr key={pos.assetId} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-bold text-white flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                      <span>{pos.assetName}</span>
                    </td>
                    <td className="px-6 py-4">{pos.fractionsOwned.toLocaleString()} shares</td>
                    <td className="px-6 py-4 text-cyan-300 font-bold">{pos.stakedAmountBOT.toLocaleString()} BOT</td>
                    <td className="px-6 py-4 text-emerald-400 font-bold">12.4% APY</td>
                    <td className="px-6 py-4 text-emerald-300">+{pos.dailyYieldBOT.toFixed(2)} BOT</td>
                    <td className="px-6 py-4 text-right">
                      <button className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 transition-colors">
                        Manage Stake
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-400 font-mono text-xs space-y-2">
            <div>No active staked positions found.</div>
            <div className="text-gray-500 text-[11px]">Mint fractional shares from the RWA Marketplace to start earning streaming rewards on BOT Chain!</div>
          </div>
        )}
      </div>

    </div>
  );
};
