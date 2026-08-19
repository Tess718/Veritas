import React from 'react';
import { Shield, Sparkles, Cpu, Layers, TrendingUp, ArrowRight } from 'lucide-react';

interface HeroProps {
  onExploreMarketplace: () => void;
  onLaunchAIPilot: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreMarketplace, onLaunchAIPilot }) => {
  return (
    <div className="relative overflow-hidden pt-8 pb-12 md:pt-12 md:pb-16 border-b border-white/10">
      {/* Glow background effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-500/20 via-blue-600/15 to-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        


        {/* Main Headline */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
            Real-World Asset <span className="gradient-text">Fractionalization</span> on BOT Chain
          </h1>
          <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Fractionalize real physical assets—compute clusters, green energy grids, commercial real estate, and treasury reserves—backed by on-chain yield distribution and live hardware telemetry.
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={onExploreMarketplace}
              className="btn-primary px-8 py-3.5 rounded-xl text-sm font-bold tracking-wide flex items-center space-x-2 group w-full sm:w-auto justify-center"
            >
              <span>Explore RWA Marketplace</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={onLaunchAIPilot}
              className="px-8 py-3.5 rounded-xl text-sm font-bold tracking-wide text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 transition-all flex items-center space-x-2 w-full sm:w-auto justify-center"
            >
              <Cpu className="w-4 h-4 text-purple-400" />
              <span>Launch Yield Strategy Co-Pilot</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-8 border-t border-white/10">
          <div className="glass-card p-5 rounded-2xl text-center">
            <div className="flex items-center justify-center space-x-1.5 text-cyan-400 mb-1">
              <Layers className="w-4 h-4" />
              <span className="text-xs uppercase font-mono text-gray-400">Catalog Valuation</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">$24.5M</div>
            <div className="text-[11px] text-emerald-400 font-mono mt-1">4 Active Vault Categories</div>
          </div>

          <div className="glass-card p-5 rounded-2xl text-center">
            <div className="flex items-center justify-center space-x-1.5 text-emerald-400 mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs uppercase font-mono text-gray-400">Average Asset APY</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">10.0%</div>
            <div className="text-[11px] text-gray-400 font-mono mt-1">Streamed BOT Distributions</div>
          </div>

          <div className="glass-card p-5 rounded-2xl text-center">
            <div className="flex items-center justify-center space-x-1.5 text-purple-400 mb-1">
              <Cpu className="w-4 h-4" />
              <span className="text-xs uppercase font-mono text-gray-400">Hardware Telemetry</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">Active</div>
            <div className="text-[11px] text-cyan-400 font-mono mt-1">Live Oracle Updates</div>
          </div>

          <div className="glass-card p-5 rounded-2xl text-center">
            <div className="flex items-center justify-center space-x-1.5 text-amber-400 mb-1">
              <Shield className="w-4 h-4 text-amber-400" />
              <span className="text-xs uppercase font-mono text-gray-400">Asset Verification</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">SPV Backed</div>
            <div className="text-[11px] text-gray-400 font-mono mt-1">Audited Financial Documentation</div>
          </div>
        </div>

      </div>
    </div>
  );
};
