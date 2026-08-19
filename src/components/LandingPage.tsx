import React from 'react';
import { Hero } from './Hero';
import { RWAAsset, ActiveTabType } from '../types';
import { AssetCard } from './AssetCard';
import { ArrowRight, ArrowUpRight, Layers, Lock, Bot, CheckCircle2, Activity, Zap, Sparkles } from 'lucide-react';

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
      icon: <Lock className="w-5 h-5 text-[#00E575]" />
    },
    {
      step: '02',
      title: 'Verified IoT Telemetry Stream',
      description: 'On-site IoT hardware sensors transmit continuous compute, energy, and occupancy telemetry data directly onto BOT Chain.',
      icon: <Activity className="w-5 h-5 text-[#FFE600]" />
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
      icon: <Zap className="w-5 h-5 text-cyan-400" />
    }
  ];

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Header Section */}
      <Hero
        onExploreMarketplace={() => onNavigateTab('marketplace')}
        onLaunchAIPilot={() => onNavigateTab('ai-pilot')}
      />

      {/* Protocol Workflow Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-white/90 text-xs font-mono shadow-sm">
            <Layers className="w-3.5 h-3.5 text-[#00E575]" />
            <span>Architecture Overview</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How Veritas RWA Operates
          </h2>
          <p className="text-sm sm:text-base text-gray-400 font-sans max-w-xl mx-auto leading-relaxed">
            Bridge physical revenue-generating infrastructure with BOT Chain smart contracts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {workflowSteps.map((item, idx) => (
            <div 
              key={idx} 
              className="bg-[#0C0E17]/80 hover:bg-[#121624]/90 border border-white/[0.08] hover:border-white/20 p-7 rounded-[2rem] space-y-5 relative group transition-all duration-300 shadow-xl hover:-translate-y-1 select-none"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center border border-white/10 shadow-sm">
                  {item.icon}
                </div>
                <span className="text-2xl font-black font-mono text-white/20 group-hover:text-white/80 transition-colors">
                  {item.step}
                </span>
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-bold text-white leading-snug group-hover:text-cyan-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed font-sans">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured RWA Assets Preview Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-5">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 text-xs font-mono text-[#00E575] uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-[#00E575] animate-pulse"></span>
              <span>On-Chain Vault Preview</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Featured RWA Assets
            </h2>
          </div>

          <button
            onClick={() => onNavigateTab('marketplace')}
            className="px-5 py-2.5 rounded-full bg-white hover:bg-gray-100 text-black font-bold text-xs transition-all duration-300 flex items-center space-x-2 self-start sm:self-auto shadow-md shadow-white/5 active:scale-95 group"
          >
            <span>Open Dedicated Marketplace</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-black" />
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
        <div className="rounded-[2.5rem] p-8 sm:p-12 border border-white/[0.08] bg-gradient-to-br from-purple-950/20 via-[#0B0C14] to-[#07080E] relative overflow-hidden shadow-2xl backdrop-blur-2xl">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center relative z-10">
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30 text-xs font-mono shadow-sm">
                <Bot className="w-3.5 h-3.5" />
                <span>Strategy Co-Pilot</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight tracking-tight">
                Transparent Yield Strategy Co-Pilot
              </h2>
              <p className="text-sm text-gray-300 font-sans leading-relaxed">
                YieldBot is powered directly by Google Gemini LLM, evaluating real-time RWA asset vault data, APY targets, and hardware telemetry parameters to provide deep natural language strategy analysis and interactive portfolio guidance.
              </p>

              <div className="space-y-3 text-xs font-mono text-gray-300 pt-1">
                <div className="flex items-center space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#00E575] shrink-0" />
                  <span>Direct Google Gemini 1.5/2.0 Flash LLM Integration</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#00E575] shrink-0" />
                  <span>Smart Contract Rebalancing Parameter Support</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#00E575] shrink-0" />
                  <span>Client-Side Local Storage Privacy — Secure API Key Connection</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onNavigateTab('ai-pilot')}
                  className="px-7 py-3.5 rounded-full bg-white hover:bg-gray-100 text-black font-bold text-xs tracking-wider uppercase transition-all duration-300 shadow-xl shadow-white/5 flex items-center space-x-2 active:scale-95 group"
                >
                  <span>Launch Yield Co-Pilot</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-black" />
                </button>
              </div>
            </div>

            <div className="rounded-[2rem] p-7 border border-white/[0.08] space-y-4 font-mono text-xs bg-[#0E101C]/90 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
                <div className="flex items-center space-x-2 text-purple-300 font-bold">
                  <Bot className="w-4 h-4 text-purple-400" />
                  <span>Yield Strategy Terminal</span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#00E575]/15 border border-[#00E575]/30 text-[#00E575] text-[10px] font-bold">
                  Active
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-200 text-xs space-y-1">
                <div className="font-bold text-white">Engine Mode: Google Gemini LLM</div>
                <div className="text-gray-400 text-[11px]">Evaluating 4 RWA asset streams on BOT Chain...</div>
              </div>

              <div className="space-y-2.5 text-gray-300 text-xs pt-1">
                <div className="flex justify-between items-center p-2 rounded-xl bg-white/[0.02]">
                  <span className="text-gray-400">Weighted Average Target Yield:</span>
                  <span className="text-[#00E575] font-bold">11.94% APY</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-xl bg-white/[0.02]">
                  <span className="text-gray-400">Oracle Telemetry Status:</span>
                  <span className="text-cyan-400 font-semibold">Verified Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

