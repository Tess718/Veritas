import React, { useState, useEffect } from 'react';
import { RWAAsset, AssetCategory, WalletState } from '../types';
import { AssetCard } from './AssetCard';
import { AssetSubmissionModal } from './AssetSubmissionModal';
import { useToast } from '../context/ToastContext';
import { Search, Filter, Cpu, Zap, Building2, Landmark, Layers, ChevronRight, Home, PlusCircle, ArrowUpRight } from 'lucide-react';

interface AssetMarketplaceProps {
  assets: RWAAsset[]; // Hardcoded fallback assets
  onSelectAsset: (asset: RWAAsset) => void;
  wallet: WalletState;
}

export const AssetMarketplace: React.FC<AssetMarketplaceProps> = ({ assets, onSelectAsset, wallet }) => {
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'apy' | 'valuation' | 'risk'>('apy');

  const [liveAssets, setLiveAssets] = useState<RWAAsset[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);
  const toast = useToast();

  // Fetch live approved assets from Backend API on mount
  const fetchLiveAssets = async () => {
    setIsLoading(true);
    try {
      const apiHost = ((import.meta as any).env && (import.meta as any).env.VITE_API_URL) || 'http://localhost:3001';
      const response = await fetch(`${apiHost}/api/assets`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      if (data && data.length > 0) {
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
        setLiveAssets(formatted);
      } else {
        setLiveAssets([]);
      }
    } catch (err) {
      console.warn('Backend fetch failed, falling back to static RWA assets:', err);
      setLiveAssets([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveAssets();
  }, []);

  // Combine live dynamic assets with hardcoded fallback assets
  const allAssets = liveAssets.length > 0 ? liveAssets : assets;

  const categories: { id: AssetCategory | 'all'; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All RWA Assets', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'depin_gpu', label: 'DePIN AI Compute', icon: <Cpu className="w-3.5 h-3.5 text-[#00E575]" /> },
    { id: 'solar_farm', label: 'Green Energy Grid', icon: <Zap className="w-3.5 h-3.5 text-[#FFE600]" /> },
    { id: 'real_estate', label: 'Prime Real Estate', icon: <Building2 className="w-3.5 h-3.5 text-purple-400" /> },
    { id: 'treasury', label: 'U.S. T-Bills', icon: <Landmark className="w-3.5 h-3.5 text-cyan-400" /> },
  ];

  const filteredAssets = allAssets
    .filter((asset) => {
      const matchesCategory = selectedCategory === 'all' || asset.category === selectedCategory;
      const matchesSearch =
        asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.categoryName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'apy') return b.apy - a.apy;
      if (sortBy === 'valuation') return b.totalValueUSD - a.totalValueUSD;
      return a.riskScore.localeCompare(b.riskScore);
    });

  const totalMarketValuation = allAssets.reduce((acc, curr) => acc + curr.totalValueUSD, 0);

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Streamlined Clean Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center space-x-2 text-xs font-mono text-[#00E575] uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-[#00E575] animate-pulse"></span>
            <span>BOT Chain Vaults</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            RWA Fractional Marketplace
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 font-sans max-w-xl">
            Inspect and trade verified physical asset shares backed by live IoT telemetry and legal SPV documentation.
          </p>
        </div>

        {/* List Your Asset CTA */}
        <button
          onClick={() => {
            if (!wallet.isConnected) {
              toast.warning('Please connect your EVM wallet to submit an asset.');
            } else {
              setIsSubmitModalOpen(true);
            }
          }}
          className="px-5 py-2.5 rounded-full bg-white hover:bg-gray-100 text-black font-bold text-xs flex items-center space-x-1.5 transition-all shadow-md shadow-white/5 active:scale-95 self-start md:self-auto group shrink-0"
        >
          <PlusCircle className="w-4 h-4 text-black" />
          <span>List Your Asset</span>
          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-black" />
        </button>
      </div>

      {/* Minimalist Controls Bar: Category Pills + Search + Sort */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        
        {/* Compact Category Switcher (Matching Hero Filter Pill Style) */}
        <div className="flex items-center p-1 rounded-full bg-[#12141c] border border-white/10 overflow-x-auto scrollbar-none self-start lg:self-auto max-w-full">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 select-none flex items-center space-x-1.5 ${
                  isActive
                    ? 'bg-white text-black font-bold shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {cat.icon}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Search & Sort Controls */}
        <div className="flex items-center gap-2.5 self-end lg:self-auto w-full sm:w-auto">
          
          {/* Search Pill */}
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-1.5 rounded-full bg-[#12141c] border border-white/10 hover:border-white/20 focus:border-white/40 text-xs text-white placeholder:text-gray-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Sort Pill */}
          <div className="flex items-center space-x-1 px-3 py-1.5 rounded-full bg-[#12141c] border border-white/10 hover:border-white/20 text-xs font-mono text-gray-300 shrink-0">
            <Filter className="w-3 h-3 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-xs text-gray-200 focus:outline-none cursor-pointer pr-1"
            >
              <option value="apy" className="bg-[#12141c] text-white">Highest APY</option>
              <option value="valuation" className="bg-[#12141c] text-white">Highest Valuation</option>
              <option value="risk" className="bg-[#12141c] text-white">Lowest Risk Rating</option>
            </select>
          </div>

        </div>

      </div>

      {/* Assets Grid (Spacious 3-Column Layout) */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-[480px] rounded-[2rem] animate-pulse bg-white/[0.03] border border-white/[0.06]" />
          ))}
        </div>
      ) : filteredAssets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
          {filteredAssets.map((asset) => (
            <AssetCard key={asset.id} asset={asset} onSelect={onSelectAsset} />
          ))}
        </div>
      ) : (
        <div className="p-14 rounded-[2.5rem] bg-[#0C0E17]/80 border border-white/[0.08] text-center max-w-md mx-auto space-y-4 shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-black flex items-center justify-center border border-white/10 mx-auto shadow-sm">
            <Layers className="w-6 h-6 text-gray-400" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">No Assets Found</h3>
            <p className="text-xs text-gray-400">Try clearing your search query or selecting a different category filter.</p>
          </div>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="px-5 py-2 rounded-full bg-white text-black text-xs font-bold hover:bg-gray-100 transition-all shadow-md"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Asset Submission Modal */}
      {isSubmitModalOpen && (
        <AssetSubmissionModal
          onClose={() => setIsSubmitModalOpen(false)}
          onSubmitSuccess={() => {
            setIsSubmitModalOpen(false);
            fetchLiveAssets();
            toast.success('RWA Asset submitted successfully! It will appear in the marketplace once approved by the admin.');
          }}
          walletAddress={wallet.address || ''}
        />
      )}

    </div>
  );
};

