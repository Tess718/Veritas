import React, { useState, useEffect } from 'react';
import { RWAAsset, WalletState } from '../types';
import { verifyFractionContract, VerificationResult } from '../lib/verifyContract';
import { ShieldAlert, Check, X, RefreshCw, AlertCircle, Building2, MapPin, DollarSign, Layers } from 'lucide-react';

interface AdminPanelProps {
  wallet: WalletState;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ wallet }) => {
  const adminAddress = '0xA4D0349DdeffEe42Afb019105cB55912F7b8e848'.toLowerCase();
  const currentAddress = (wallet.address || '').toLowerCase();
  const isAdmin = currentAddress === adminAddress;

  const [pendingAssets, setPendingAssets] = useState<RWAAsset[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [verifications, setVerifications] = useState<{ [addr: string]: VerificationResult }>({});
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchPending = async () => {
    if (!isAdmin) return;
    setIsLoading(true);
    setError(null);
    try {
      const apiHost = ((import.meta as any).env && (import.meta as any).env.VITE_API_URL) || 'http://localhost:3001';
      const response = await fetch(`${apiHost}/api/assets/pending`);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      if (data) {
        const formatted = data.map((item: any) => ({
          id: item._id || item.id,
          name: item.name,
          category: item.category,
          categoryName: item.categoryName,
          location: item.location,
          totalValueUSD: Number(item.totalValueUSD),
          fractionPriceBOT: Number(item.fractionPriceBOT),
          fractionPriceUSDT: Number(item.fractionPriceUSDT),
          totalFractions: Number(item.totalFractions),
          availableFractions: Number(item.availableFractions),
          apy: Number(item.apy),
          image: item.imageUrl,
          riskScore: item.riskScore,
          telemetryType: item.telemetryType,
          telemetryCurrentValue: item.telemetryCurrentValue,
          telemetryUnit: item.telemetryUnit,
          verifier: item.verifier,
          spvDocumentHash: item.spvDocumentHash,
          contractAddress: item.contractAddress,
          description: item.description,
          features: item.features || [],
          status: item.status,
          submitterAddress: item.submitterAddress
        }));
        setPendingAssets(formatted);

        // Verify all pending contracts on-chain in background
        for (const asset of formatted) {
          verifyFractionContract(asset.contractAddress).then((result) => {
            setVerifications((prev) => ({ ...prev, [asset.contractAddress]: result }));
          });
        }
      }
    } catch (err: any) {
      console.error('Error fetching pending assets:', err);
      setError(err.message || 'Failed to fetch pending assets.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, [wallet.address]);

  const handleDecision = async (id: string, contractAddr: string, decision: 'live' | 'rejected') => {
    setProcessingId(id);
    try {
      const apiHost = ((import.meta as any).env && (import.meta as any).env.VITE_API_URL) || 'http://localhost:3001';
      const endpoint = decision === 'live' ? `/api/assets/approve/${id}` : `/api/assets/reject/${id}`;
      
      const response = await fetch(`${apiHost}${endpoint}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      setPendingAssets((prev) => prev.filter((a) => a.id !== id));
      alert(`Asset submission successfully ${decision === 'live' ? 'approved & listed live' : 'rejected'}.`);
    } catch (err: any) {
      console.error('Error processing asset decision:', err);
      alert(`Error processing decision: ${err.message}`);
    } finally {
      setProcessingId(null);
    }
  };

  // Lock Screen for Non-Admin Wallets
  if (!isAdmin) {
    return (
      <div className="py-16 max-w-2xl mx-auto px-4 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
          <ShieldAlert className="w-8 h-8 animate-pulse" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-extrabold text-white">403 Access Denied</h2>
          <p className="text-xs text-gray-400 font-mono">
            This panel is protected and restricted to the admin address:
          </p>
          <code className="block bg-black/60 px-3 py-2 rounded-xl text-cyan-300 text-xs font-mono select-all max-w-md mx-auto border border-white/5 break-all">
            0xA4D0349DdeffEe42Afb019105cB55912F7b8e848
          </code>
        </div>
        <div className="p-4 rounded-2xl border border-white/5 bg-white/5 text-xs text-gray-400 font-sans max-w-md mx-auto leading-relaxed">
          {wallet.isConnected ? (
            <span>Connected wallet: <code className="text-white break-all">{wallet.address}</code> is unauthorized. Connect the admin wallet to view pending listings.</span>
          ) : (
            <span>Please connect your EVM wallet to verify administration status.</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-purple-400 uppercase tracking-widest mb-1">
            <span className="w-2 h-2 rounded-full bg-purple-400"></span>
            <span>Platform Governance</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Admin Review Panel</h1>
          <p className="text-xs text-gray-400 font-sans mt-1">
            Audit submitted RWA fractional tokens and verify their deployment parameters on BOT Chain.
          </p>
        </div>

        <button
          onClick={fetchPending}
          disabled={isLoading}
          className="px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 text-xs font-mono flex items-center space-x-1.5 transition-all text-gray-300 disabled:opacity-40"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh List</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-300 text-xs font-mono flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Pending Items List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((n) => (
            <div key={n} className="glass-card h-48 rounded-2xl animate-pulse bg-white/5 border border-white/10" />
          ))}
        </div>
      ) : pendingAssets.length > 0 ? (
        <div className="space-y-6">
          {pendingAssets.map((asset) => {
            const verification = verifications[asset.contractAddress];

            return (
              <div
                key={asset.id}
                className="glass-card rounded-2xl border border-purple-500/30 overflow-hidden bg-gradient-to-r from-surface via-surface to-purple-950/10 flex flex-col md:flex-row gap-6 p-6"
              >
                {/* Left: Thumbnail & Base info */}
                <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden bg-black/40 border border-white/10 shrink-0 flex items-center justify-center relative">
                  {asset.image ? (
                    <img src={asset.image} alt={asset.name} className="w-full h-full object-cover" />
                  ) : (
                    <Building2 className="w-12 h-12 text-gray-600" />
                  )}
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-bold font-mono bg-purple-500/20 text-purple-300 border border-purple-500/40">
                    {asset.categoryName}
                  </span>
                </div>

                {/* Center: Details */}
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span>{asset.name}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono uppercase">
                        Pending Approval
                      </span>
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400 mt-1 font-mono">
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{asset.location}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>Valuation: ${(asset.totalValueUSD).toLocaleString()}</span>
                      </span>
                      <span className="text-purple-300">APY: {asset.apy}%</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-black/30 border border-white/5 font-mono text-[11px] space-y-2">
                    <div>
                      Contract: <code className="text-cyan-300 break-all">{asset.contractAddress}</code>
                    </div>
                    {/* Live On-Chain verification badge */}
                    {verification ? (
                      <div className={`flex items-center space-x-1.5 font-sans ${
                        verification.isValid ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {verification.isValid ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>On-Chain Verified: {verification.name} ({verification.symbol}) • Supply: {Number(verification.totalSupply).toLocaleString()} fractions</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-4 h-4" />
                            <span>On-Chain Check Failed: {verification.error}</span>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="text-gray-500 flex items-center space-x-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-ping"></span>
                        <span>Verifying contract deployment state...</span>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-gray-300 font-sans leading-relaxed line-clamp-2">
                    {asset.description}
                  </p>
                </div>

                {/* Right: Actions */}
                <div className="w-full md:w-48 shrink-0 flex flex-row md:flex-col justify-center gap-3">
                  <button
                    onClick={() => handleDecision(asset.id, asset.contractAddress, 'live')}
                    disabled={processingId !== null}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase transition-all flex items-center justify-center space-x-1.5 text-xs"
                  >
                    <Check className="w-4 h-4 text-black" />
                    <span>Approve</span>
                  </button>

                  <button
                    onClick={() => handleDecision(asset.id, asset.contractAddress, 'rejected')}
                    disabled={processingId !== null}
                    className="flex-1 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-bold uppercase transition-all flex items-center justify-center space-x-1.5 text-xs"
                  >
                    <X className="w-4 h-4" />
                    <span>Reject</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-card p-16 rounded-2xl text-center max-w-md mx-auto space-y-3">
          <Layers className="w-10 h-10 text-gray-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Pending Submissions</h3>
          <p className="text-xs text-gray-400 font-sans">All submitted RWA asset proposals have been successfully audited and processed.</p>
        </div>
      )}

    </div>
  );
};
