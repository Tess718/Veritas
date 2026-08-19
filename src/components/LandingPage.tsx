import React from 'react';
import { Hero } from './Hero';
import { RWAAsset, ActiveTabType } from '../types';
import { AssetCard } from './AssetCard';
import { ShieldCheck, Zap, ArrowRight, Layers, Lock, Bot, CheckCircle2, Activity } from 'lucide-react';

interface LandingPageProps {
  assets: RWAAsset[];
  onNavigateTab: (tab: ActiveTabType) => void;
  onSelectAsset: (asset: RWAAsset) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  assets,
  onNavigateTab,
  onSelectAsset
}) => {
  const featuredAssets = assets.slice(0, 3);

  const workflowSteps = [
    {
      step: '01',
      title: 'Physical Asset Legal Tokenization',
      description: 'Physical assets (DePIN GPUs, Solar Grids, Real Estate) are held in legally audited Special Purpose Vehicles (SPVs) and fractionalized into ERC-20 token shares.',
      icon: <Lock className="w-5 h-5 text-cyan-400" />
    },
    {
      step: '02',
      title: 'Verified IoT Telemetry Stream',
      description: 'On-site IoT hardware sensors transmit continuous compute, energy, and occupancy telemetry data directly onto BOT Chain.',
      icon: <Activity className="w-5 h-5 text-emerald-400" />
    },
    {
      step: '03',
      title: 'Yield Optimization & Vault Rebalancing',
      description: 'The strategy co-pilot evaluates telemetry parameters and optimizes staking vault rates to maximize yield output.',
      icon: <Bot className="w-5 h-5 text-purple-400" />
    },
    {
      step: '04',
      title: 'Streamed Dividend Distributions',
      description: 'Stakers earn real-time yield streaming natively in BOT tokens, with instant on-chain claimability.',
      icon: <Zap className="w-5 h-5 text-amber-400" />
    }
  ];

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Header Section */}
      <Hero
        onExploreMarketplace={() => onNavigateTab('marketplace')}
        onLaunchAIPilot={() => onNavigateTab('ai-pilot')}
      />

      {/* Protocol Workflow Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
            <Layers className="w-3.5 h-3.5" />
            <span>Architecture Overview</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white">How Veritas RWA Operates</h2>
          <p className="text-sm text-gray-400 font-sans">
            Bridge physical revenue-generating infrastructure with BOT Chain smart contracts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {workflowSteps.map((item, idx) => (
            <div key={idx} className="glass-card p-6 rounded-2xl border border-white/10 space-y-4 relative group hover:border-cyan-500/40 transition-all">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  {item.icon}
                </div>
                <span className="text-2xl font-black font-mono text-white/20 group-hover:text-cyan-400/40 transition-colors">
                  {item.step}
                </span>
              </div>
              <h3 className="text-base font-bold text-white leading-snug">{item.title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed font-sans">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured RWA Assets Preview Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 uppercase tracking-widest mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>On-Chain Vault Preview</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">Featured RWA Assets</h2>
          </div>

          <button
            onClick={() => onNavigateTab('marketplace')}
            className="btn-primary px-5 py-2.5 rounded-xl text-xs font-bold tracking-wide flex items-center space-x-2 self-start sm:self-auto"
          >
            <span>Open Dedicated Marketplace</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredAssets.map((asset) => (
            <AssetCard key={asset.id} asset={asset} onSelect={onSelectAsset} />
          ))}
        </div>
      </section>

      {/* Yield Co-Pilot Feature Highlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-3xl p-8 md:p-10 border border-purple-500/30 bg-gradient-to-br from-purple-950/30 via-[#0D0B18] to-cyan-950/20 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-5">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-mono">
                <Bot className="w-3.5 h-3.5" />
                <span>Strategy Co-Pilot</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                Transparent Yield Strategy Co-Pilot
              </h2>
              <p className="text-sm text-gray-300 font-sans leading-relaxed">
                YieldBot is powered directly by Google Gemini LLM, evaluating real-time RWA asset vault data, APY targets, and hardware telemetry parameters to provide deep natural language strategy analysis and interactive portfolio guidance.
              </p>

              <div className="space-y-2 text-xs font-mono text-gray-300 pt-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Direct Google Gemini 1.5/2.0 Flash LLM Integration</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Smart Contract Rebalancing Parameter Support</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Client-Side Local Storage Privacy — Secure API Key Connection</span>
                </div>
              </div>

              <div className="pt-3">
                <button
                  onClick={() => onNavigateTab('ai-pilot')}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-lg shadow-purple-500/20 flex items-center space-x-2"
                >
                  <span>Launch Yield Co-Pilot</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4 font-mono text-xs bg-black/40">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center space-x-2 text-purple-300 font-bold">
                  <Bot className="w-4 h-4" />
                  <span>Yield Strategy Terminal</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px]">Active</span>
              </div>

              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-200 text-[11px] space-y-1">
                <div className="font-bold text-white">Engine Mode: Google Gemini LLM</div>
                <div className="text-gray-400 text-[10px]">Evaluating 4 RWA asset streams on BOT Chain...</div>
              </div>

              <div className="space-y-2 text-gray-300 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-gray-400">Weighted Average Target Yield:</span>
                  <span className="text-emerald-400 font-bold">11.94% APY</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Oracle Telemetry Status:</span>
                  <span className="text-cyan-400">Verified Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
