import React, { useState } from 'react';
import { Shield, Cpu, Layers, TrendingUp, ArrowRight, ArrowUpRight, Heart, Sparkles, Zap } from 'lucide-react';
import GradientWaves from './GradientWaves';

interface HeroProps {
  onExploreMarketplace: () => void;
  onLaunchAIPilot: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreMarketplace, onLaunchAIPilot }) => {
  const [activeFilter, setActiveFilter] = useState<'featured' | 'popular'>('featured');

  return (
    <div className="relative overflow-hidden bg-[#060709] text-white pt-8 pb-16 md:pt-12 md:pb-20 border-b border-white/10">
      {/* Dynamic WebGL GradientWaves Background */}
      <div className="absolute inset-0 z-0 pointer-events-auto">
        <GradientWaves
          horizonColor="#181534"
          waveColor="#00E575"
          crestColor="#00F2FE"
          speed={0.45}
          amplitude={2.8}
          waveScale={0.65}
          waveRatio={0.9}
          swell={35}
          turbulence={20}
          tilt={1.11}
          zoom={1.0}
          height={5.2}
          fogDepth={28}
          detail="high"
          brightness={1.3}
          opacity={1.0}
          mouseInteraction={true}
          parallaxStrength={0.6}
          grain={true}
          grainIntensity={0.04}
        />
        {/* Soft bottom fade to seamlessly blend into page content */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#060709] via-transparent to-[#060709]/20 pointer-events-none" />
      </div>

      {/* Ambient background glow */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-gradient-to-tr from-cyan-500/10 via-emerald-500/10 to-purple-600/10 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Decorative Vector Doodles matching reference design */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        {/* Starburst / Asterisk ✻ (Top-Left) */}
        <div className="absolute top-6 left-6 md:left-10 text-white/35">
          <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0L13.5 8.5L22 7L15.5 13L21 20L13 16.5L12 24L11 16.5L3 20L8.5 13L2 7L10.5 8.5L12 0Z" />
          </svg>
        </div>

        {/* Wireframe Diamond / Isometric doodle (Top-Left) */}
        <div className="absolute top-28 left-8 md:left-20 text-white/20 hidden sm:block">
          <svg className="w-14 h-14" viewBox="0 0 60 60" fill="none" stroke="currentColor" strokeWidth="1.2">
            <polygon points="30,5 55,20 55,45 30,58 5,45 5,20" />
            <line x1="30" y1="5" x2="30" y2="58" />
            <line x1="5" y1="20" x2="30" y2="33" />
            <line x1="55" y1="20" x2="30" y2="33" />
          </svg>
        </div>

        {/* Loop / Swirl line doodle (Bottom-Left) */}
        <div className="absolute bottom-44 left-6 md:left-16 text-white/25 hidden md:block">
          <svg className="w-24 h-14" viewBox="0 0 100 50" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M5 35 C 25 10, 45 45, 65 20 C 78 5, 88 30, 95 15" />
          </svg>
        </div>

        {/* Curved flourish doodle (Center-Right) */}
        <div className="absolute top-36 right-8 md:right-28 text-white/25 hidden sm:block">
          <svg className="w-24 h-16" viewBox="0 0 90 60" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M5 38 C 25 12, 45 48, 70 18 C 78 8, 86 22, 82 32" />
          </svg>
        </div>

        {/* Far Right Loop Doodle */}
        <div className="absolute bottom-48 right-8 md:right-16 text-white/20 hidden sm:block">
          <svg className="w-16 h-12" viewBox="0 0 70 40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M5 25 C 20 5, 40 35, 60 15" />
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        

        {/* Main Hero Headline */}
        <div className="text-center max-w-5xl mx-auto space-y-6 pt-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[62px] font-extrabold tracking-tight text-white leading-[1.18] sm:leading-[1.14]">
            <span className="inline-block">Real-World Asset</span>{' '}
            <span className="inline-flex items-center justify-center align-middle mx-1 sm:mx-2 w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-[#00E575]/15 border border-[#00E575]/50 text-[#00E575] shadow-lg shadow-[#00E575]/20 -translate-y-1">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 fill-[#00E575]" />
            </span>{' '}
            <br className="hidden md:inline" />
            <span className="relative inline-block mt-1 md:mt-0">
              <span className="gradient-text">Fractionalization</span>
              {/* Hand-drawn organic yellow brush underline */}
              <svg className="absolute -bottom-2 sm:-bottom-2.5 left-0 w-full h-2.5 sm:h-3 text-[#FFE600]/80" viewBox="0 0 100 10" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round">
                <path d="M 3 6 C 30 2, 70 2, 97 6" />
              </svg>
            </span>{' '}
            <span className="inline-block whitespace-nowrap">on BOT Chain</span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Fractionalize real physical assets—compute clusters, green energy grids, commercial real estate, and treasury reserves—backed by on-chain yield distribution and live hardware telemetry.
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
            <button
              onClick={onExploreMarketplace}
              className="px-8 py-3.5 rounded-full text-xs sm:text-sm font-bold bg-white text-black hover:bg-gray-100 hover:shadow-white/20 shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 group w-full sm:w-auto"
            >
              <span>Explore RWA Marketplace</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-black" />
            </button>
            <button
              onClick={onLaunchAIPilot}
              className="px-8 py-3.5 rounded-full text-xs sm:text-sm font-bold text-white bg-[#161618] hover:bg-[#222226] border border-white/20 hover:border-white/40 transition-all duration-300 flex items-center justify-center space-x-2 w-full sm:w-auto group"
            >
              <Cpu className="w-4 h-4 text-purple-400 group-hover:rotate-12 transition-transform" />
              <span>Launch Yield Strategy Co-Pilot</span>
            </button>
          </div>
        </div>

        {/* Section Header: Explore Marketplace & Filter Pill */}
        <div className="mt-16 md:mt-20 pt-8 border-t border-white/10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* Card 1: Catalog Valuation */}
            <div 
              onClick={onExploreMarketplace}
              className="bg-[#0C0E17]/80 hover:bg-[#121624]/90 border border-white/[0.08] hover:border-[#00E575]/40 text-white p-6 rounded-[2rem] flex flex-col justify-between space-y-6 shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group select-none relative overflow-hidden"
            >
              <div className="absolute -top-10 -right-10 w-28 h-28 bg-[#00E575]/10 rounded-full blur-2xl pointer-events-none group-hover:bg-[#00E575]/20 transition-all"></div>

              {/* Top Row: Icon squircle & Rating badge */}
              <div className="flex items-center justify-between relative z-10">
                <div className="w-11 h-11 rounded-2xl bg-black flex items-center justify-center border border-white/10 shadow-sm">
                  <Layers className="w-5 h-5 text-[#00E575]" />
                </div>
                <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-[#00E575]/15 border border-[#00E575]/30 text-xs font-bold text-[#00E575]">
                  <Heart className="w-3.5 h-3.5 fill-[#00E575] text-[#00E575]" />
                  <span>4.9</span>
                </div>
              </div>

              {/* Title & Valuation */}
              <div className="space-y-3 relative z-10">
                <h3 className="text-xl font-extrabold tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                  Catalog Valuation
                </h3>

                <div className="flex items-baseline justify-between pt-1">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block font-mono">Total Assets</span>
                    <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/10 text-gray-300 text-[11px] font-mono">
                      4 Active
                    </div>
                  </div>
                  <div className="text-3xl font-black text-white tracking-tight font-mono">
                    $24.5M
                  </div>
                </div>
              </div>

              {/* Bottom Row: Subtitle & Get Button */}
              <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between relative z-10">
                <span className="text-xs font-medium text-gray-400">
                  4 Active Vault Categories
                </span>
                <div className="px-4 py-1.5 rounded-full bg-white hover:bg-gray-100 text-black text-xs font-bold flex items-center space-x-1 group-hover:scale-105 transition-transform">
                  <span>Get</span>
                  <ArrowUpRight className="w-3 h-3 text-black" />
                </div>
              </div>
            </div>

            {/* Card 2: Average Asset APY */}
            <div 
              onClick={onExploreMarketplace}
              className="bg-[#0C0E17]/80 hover:bg-[#121624]/90 border border-white/[0.08] hover:border-[#FFE600]/40 text-white p-6 rounded-[2rem] flex flex-col justify-between space-y-6 shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group select-none relative overflow-hidden"
            >
              <div className="absolute -top-10 -right-10 w-28 h-28 bg-[#FFE600]/10 rounded-full blur-2xl pointer-events-none group-hover:bg-[#FFE600]/20 transition-all"></div>

              {/* Top Row: Icon squircle & Rating badge */}
              <div className="flex items-center justify-between relative z-10">
                <div className="w-11 h-11 rounded-2xl bg-black flex items-center justify-center border border-white/10 shadow-sm">
                  <TrendingUp className="w-5 h-5 text-[#FFE600]" />
                </div>
                <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-[#FFE600]/15 border border-[#FFE600]/30 text-xs font-bold text-[#FFE600]">
                  <Heart className="w-3.5 h-3.5 fill-[#FFE600] text-[#FFE600]" />
                  <span>5.0</span>
                </div>
              </div>

              {/* Title & APY */}
              <div className="space-y-3 relative z-10">
                <h3 className="text-xl font-extrabold tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                  Average Asset APY
                </h3>

                <div className="flex items-baseline justify-between pt-1">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block font-mono">Yield Stream</span>
                    <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/10 text-gray-300 text-[11px] font-mono">
                      BOT Native
                    </div>
                  </div>
                  <div className="text-3xl font-black text-[#00E575] tracking-tight font-mono">
                    10.0%
                  </div>
                </div>
              </div>

              {/* Bottom Row: Subtitle & Get Button */}
              <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between relative z-10">
                <span className="text-xs font-medium text-gray-400">
                  Streamed BOT Distributions
                </span>
                <div className="px-4 py-1.5 rounded-full bg-white hover:bg-gray-100 text-black text-xs font-bold flex items-center space-x-1 group-hover:scale-105 transition-transform">
                  <span>Get</span>
                  <ArrowUpRight className="w-3 h-3 text-black" />
                </div>
              </div>
            </div>

            {/* Card 3: Hardware Telemetry */}
            <div 
              onClick={onExploreMarketplace}
              className="bg-[#0C0E17]/80 hover:bg-[#121624]/90 border border-white/[0.08] hover:border-cyan-500/40 text-white p-6 rounded-[2rem] flex flex-col justify-between space-y-6 shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group select-none relative overflow-hidden"
            >
              <div className="absolute -top-10 -right-10 w-28 h-28 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-cyan-500/20 transition-all"></div>

              {/* Top Row: Icon squircle & Rating badge */}
              <div className="flex items-center justify-between relative z-10">
                <div className="w-11 h-11 rounded-2xl bg-black flex items-center justify-center border border-white/10 shadow-sm">
                  <Cpu className="w-5 h-5 text-cyan-400" />
                </div>
                <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-xs font-bold text-cyan-300">
                  <Heart className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
                  <span>4.8</span>
                </div>
              </div>

              {/* Title & Hardware Telemetry */}
              <div className="space-y-3 relative z-10">
                <h3 className="text-xl font-extrabold tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                  Hardware Telemetry
                </h3>

                <div className="flex items-baseline justify-between pt-1">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block font-mono">IoT Oracles</span>
                    <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/10 text-gray-300 text-[11px] font-mono">
                      Connected
                    </div>
                  </div>
                  <div className="text-3xl font-black text-cyan-300 tracking-tight font-mono">
                    Active
                  </div>
                </div>
              </div>

              {/* Bottom Row: Subtitle & Get Button */}
              <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between relative z-10">
                <span className="text-xs font-medium text-gray-400">
                  Live Oracle Updates
                </span>
                <div className="px-4 py-1.5 rounded-full bg-white hover:bg-gray-100 text-black text-xs font-bold flex items-center space-x-1 group-hover:scale-105 transition-transform">
                  <span>Get</span>
                  <ArrowUpRight className="w-3 h-3 text-black" />
                </div>
              </div>
            </div>

            {/* Card 4: Asset Verification */}
            <div 
              onClick={onExploreMarketplace}
              className="bg-[#0C0E17]/80 hover:bg-[#121624]/90 border border-white/[0.08] hover:border-purple-500/40 text-white p-6 rounded-[2rem] flex flex-col justify-between space-y-6 shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group select-none relative overflow-hidden"
            >
              <div className="absolute -top-10 -right-10 w-28 h-28 bg-purple-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-purple-500/20 transition-all"></div>

              {/* Top Row: Icon squircle & Rating badge */}
              <div className="flex items-center justify-between relative z-10">
                <div className="w-11 h-11 rounded-2xl bg-black flex items-center justify-center border border-white/10 shadow-sm">
                  <Shield className="w-5 h-5 text-purple-400" />
                </div>
                <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-xs font-bold text-purple-300">
                  <Heart className="w-3.5 h-3.5 fill-purple-400 text-purple-400" />
                  <span>5.0</span>
                </div>
              </div>

              {/* Title & Verification */}
              <div className="space-y-3 relative z-10">
                <h3 className="text-xl font-extrabold tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                  Asset Verification
                </h3>

                <div className="flex items-baseline justify-between pt-1">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block font-mono">Legal Structure</span>
                    <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/10 text-gray-300 text-[11px] font-mono">
                      Audited
                    </div>
                  </div>
                  <div className="text-2xl font-black text-white tracking-tight font-mono">
                    SPV Backed
                  </div>
                </div>
              </div>

              {/* Bottom Row: Subtitle & Get Button */}
              <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between relative z-10">
                <span className="text-xs font-medium text-gray-400">
                  Audited Financial Documentation
                </span>
                <div className="px-4 py-1.5 rounded-full bg-white hover:bg-gray-100 text-black text-xs font-bold flex items-center space-x-1 group-hover:scale-105 transition-transform">
                  <span>Get</span>
                  <ArrowUpRight className="w-3 h-3 text-black" />
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

