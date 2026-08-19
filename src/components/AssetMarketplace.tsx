import React, { useState, useEffect } from 'react';
import { RWAAsset, AssetCategory, WalletState } from '../types';
import { AssetCard } from './AssetCard';
import { AssetSubmissionModal } from './AssetSubmissionModal';
import { Search, Filter, Cpu, Zap, Building2, Landmark, Layers, ChevronRight, Home, PlusCircle } from 'lucide-react';

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
    { id: 'all', label: 'All RWA Assets', icon: <Layers className="w-4 h-4" /> },
    { id: 'depin_gpu', label: 'DePIN AI Compute', icon: <Cpu className="w-4 h-4 text-cyan-400" /> },
    { id: 'solar_farm', label: 'Green Energy Grid', icon: <Zap className="w-4 h-4 text-emerald-400" /> },
    { id: 'real_estate', label: 'Prime Real Estate', icon: <Building2 className="w-4 h-4 text-purple-400" /> },
    { id: 'treasury', label: 'U.S. T-Bills', icon: <Landmark className="w-4 h-4 text-amber-400" /> },
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

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Page Header & Breadcrumb */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2 text-xs font-mono text-gray-400">
          <span className="flex items-center space-x-1 hover:text-white transition-colors">
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
          <span className="text-cyan-400 font-bold">RWA Fractional Marketplace</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              <span>On-Chain Real World Asset Vaults</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">RWA Fractional Marketplace</h1>
            <p className="text-xs text-gray-400 font-sans mt-1">
              Browse, filter, and inspect verified physical asset shares backed by IoT telemetry and legal SPV audits on BOT Chain.
            </p>
          </div>

          {/* Search, Sort & Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            
            {/* List Your Asset Button */}
            <button
              onClick={() => {
                if (!wallet.isConnected) {
                  alert('Please connect your EVM wallet to submit an asset.');
                } else {
                  setIsSubmitModalOpen(true);
                }
              }}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-all shadow-lg shadow-purple-500/20 whitespace-nowrap"
            >
              <PlusCircle className="w-4 h-4 text-black" />
              <span>List Your Asset</span>
            </button>

            <div className="relative w-full sm:w-48">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="glass-input w-full pl-10 pr-4 py-2 rounded-xl text-xs font-mono placeholder:text-gray-500"
              />
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-gray-400 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="glass-input px-3 py-2 rounded-xl text-xs font-mono text-gray-300 w-full sm:w-auto bg-[#090B10]"
              >
                <option value="apy">Highest APY</option>
                <option value="valuation">Highest Valuation</option>
                <option value="risk">Lowest Risk Rating</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2.5 rounded-xl text-xs font-mono flex items-center space-x-2 whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/50 shadow-md shadow-cyan-500/10 font-bold'
                : 'glass-card text-gray-400 hover:text-white'
            }`}
          >
            {cat.icon}
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Assets Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="glass-card h-80 rounded-2xl animate-pulse bg-white/5 border border-white/10" />
          ))}
        </div>
      ) : filteredAssets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredAssets.map((asset) => (
            <AssetCard key={asset.id} asset={asset} onSelect={onSelectAsset} />
          ))}
        </div>
      ) : (
        <div className="glass-card p-12 rounded-2xl text-center max-w-md mx-auto space-y-3">
          <Layers className="w-10 h-10 text-gray-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Assets Found</h3>
          <p className="text-xs text-gray-400">Try clearing your search query or selecting a different category filter.</p>
        </div>
      )}

      {/* Asset Submission Modal */}
      {isSubmitModalOpen && (
        <AssetSubmissionModal
          onClose={() => setIsSubmitModalOpen(false)}
          onSubmitSuccess={() => {
            setIsSubmitModalOpen(false);
            fetchLiveAssets();
            alert('RWA Asset submitted successfully! It will appear in the marketplace once approved by the admin.');
          }}
          walletAddress={wallet.address || ''}
        />
      )}

    </div>
  );
};
