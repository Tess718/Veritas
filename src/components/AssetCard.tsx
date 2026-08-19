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
        return <Cpu className="w-4 h-4 text-[#00E575]" />;
      case 'solar_farm':
        return <Zap className="w-4 h-4 text-[#FFE600]" />;
      case 'real_estate':
        return <Building2 className="w-4 h-4 text-purple-400" />;
      case 'treasury':
        return <Landmark className="w-4 h-4 text-cyan-400" />;
      default:
        return <Cpu className="w-4 h-4 text-[#00E575]" />;
    }
  };

  const fundedPercentage = Math.round(((asset.totalFractions - asset.availableFractions) / asset.totalFractions) * 100);

  return (
    <div 
      onClick={() => onSelect(asset)}
      className="bg-[#0C0E17]/80 hover:bg-[#121624]/90 border border-white/[0.08] hover:border-white/20 rounded-[2rem] overflow-hidden flex flex-col justify-between transition-all duration-300 shadow-xl hover:-translate-y-1 cursor-pointer group select-none"
    >
      <div>
        {/* Card Header Image */}
        <div className="relative h-56 w-full overflow-hidden bg-black/40">
          <img
            src={asset.image}
            alt={asset.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C0E17] via-transparent to-black/50"></div>
          
          {/* Top Badges */}
          <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-xs font-medium text-white shadow-sm">
              {getCategoryIcon()}
              <span>{asset.categoryName}</span>
            </div>
            
            <div className="px-3 py-1.5 rounded-full bg-[#00E575]/15 backdrop-blur-md border border-[#00E575]/30 text-xs font-mono font-bold text-[#00E575] flex items-center space-x-1 shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{asset.riskScore} Rating</span>
            </div>
          </div>

          {/* Bottom Floating Telemetry Indicator */}
          <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-xs font-mono text-gray-300 px-3.5 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/10 shadow-md">
            <div className="flex items-center space-x-1.5">
              <Activity className="w-3.5 h-3.5 text-[#00E575] animate-pulse" />
              <span className="text-gray-400">{asset.telemetryType}:</span>
            </div>
            <span className="text-white font-bold">{asset.telemetryCurrentValue} {asset.telemetryUnit}</span>
          </div>
        </div>

        {/* Card Content Body */}
        <div className="p-6 space-y-5">
          <div>
            <div className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">{asset.location}</div>
            <h3 className="text-lg font-extrabold text-white group-hover:text-cyan-300 transition-colors line-clamp-1 mt-0.5">
              {asset.name}
            </h3>
          </div>

          {/* Financial Highlights */}
          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
            <div>
              <div className="text-[10px] uppercase font-mono text-gray-400">Total Valuation</div>
              <div className="text-base font-extrabold text-white font-mono mt-0.5">
                ${(asset.totalValueUSD / 1000000).toFixed(2)}M
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-mono text-gray-400">Target APY</div>
              <div className="text-base font-extrabold text-[#00E575] font-mono mt-0.5">
                {asset.apy}% / yr
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-gray-400">Tokenized Supply Funded</span>
              <span className="text-white font-bold">{fundedPercentage}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#00E575] via-cyan-400 to-blue-500 rounded-full transition-all duration-1000"
                style={{ width: `${fundedPercentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[11px] font-mono text-gray-400 pt-0.5">
              <span>{asset.availableFractions.toLocaleString()} shares</span>
              <span className="text-gray-300">{asset.fractionPriceBOT} BOT (${asset.fractionPriceUSDT})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="px-6 pb-6 pt-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(asset);
          }}
          className="w-full py-3 px-5 rounded-full bg-white hover:bg-gray-100 text-black font-bold text-xs transition-all duration-300 flex items-center justify-center space-x-1.5 shadow-lg shadow-white/5 active:scale-95 group-hover:shadow-white/10"
        >
          <span>Inspect & Mint Share</span>
          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-black" />
        </button>
      </div>
    </div>
  );
};

