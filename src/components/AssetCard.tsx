import React from 'react';
import { RWAAsset } from '../types';
import { ShieldCheck, Cpu, Zap, Building2, Landmark, ArrowUpRight, Activity } from 'lucide-react';

interface AssetCardProps {
  asset: RWAAsset;
  onSelect: (asset: RWAAsset) => void;
}

export const AssetCard: React.FC<AssetCardProps> = ({ asset, onSelect }) => {
  const getCategoryIcon = () => {
    switch (asset.category) {
      case 'depin_gpu':
        return <Cpu className="w-4 h-4 text-cyan-400" />;
      case 'solar_farm':
        return <Zap className="w-4 h-4 text-emerald-400" />;
      case 'real_estate':
        return <Building2 className="w-4 h-4 text-purple-400" />;
      case 'treasury':
        return <Landmark className="w-4 h-4 text-amber-400" />;
      default:
        return <Cpu className="w-4 h-4 text-cyan-400" />;
    }
  };

  const fundedPercentage = Math.round(((asset.totalFractions - asset.availableFractions) / asset.totalFractions) * 100);

  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col justify-between group">
      <div>
        {/* Card Header Image */}
        <div className="relative h-48 w-full overflow-hidden bg-surface">
          <img
            src={asset.image}
            alt={asset.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090B10] via-transparent to-black/40"></div>
          
          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-xs font-mono text-white">
              {getCategoryIcon()}
              <span>{asset.categoryName}</span>
            </div>
            
            <div className="px-2.5 py-1 rounded-lg bg-emerald-500/20 backdrop-blur-md border border-emerald-500/40 text-xs font-mono font-bold text-emerald-300 flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{asset.riskScore} Rating</span>
            </div>
          </div>

          {/* Bottom Floating Telemetry Indicator */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-gray-300 px-3 py-1.5 rounded-lg bg-black/70 backdrop-blur-md border border-white/10">
            <div className="flex items-center space-x-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span className="text-gray-400">{asset.telemetryType}:</span>
            </div>
            <span className="text-white font-bold">{asset.telemetryCurrentValue} {asset.telemetryUnit}</span>
          </div>
        </div>

        {/* Card Content Body */}
        <div className="p-5 space-y-4">
          <div>
            <div className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">{asset.location}</div>
            <h3 className="text-lg font-extrabold text-white group-hover:text-cyan-300 transition-colors line-clamp-1 mt-0.5">
              {asset.name}
            </h3>
          </div>

          {/* Financial Highlights */}
          <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
            <div>
              <div className="text-[10px] uppercase font-mono text-gray-400">Total Valuation</div>
              <div className="text-sm font-extrabold text-white font-mono mt-0.5">
                ${(asset.totalValueUSD / 1000000).toFixed(2)}M
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-mono text-gray-400">Target APY</div>
              <div className="text-sm font-extrabold text-emerald-400 font-mono mt-0.5">
                {asset.apy}% / year
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-gray-400">Tokenized Supply Funded</span>
              <span className="text-cyan-300 font-bold">{fundedPercentage}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-1000"
                style={{ width: `${fundedPercentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[10px] font-mono text-gray-500">
              <span>{asset.availableFractions.toLocaleString()} shares available</span>
              <span>Price: {asset.fractionPriceBOT} BOT (${asset.fractionPriceUSDT})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="px-5 pb-5 pt-1 border-t border-white/5">
        <button
          onClick={() => onSelect(asset)}
          className="w-full py-2.5 px-4 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold text-xs transition-all flex items-center justify-center space-x-2 group-hover:border-cyan-500/60"
        >
          <span>Inspect & Mint Share</span>
          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
