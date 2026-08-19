import React, { useState, useEffect } from 'react';
import { WalletState, ActiveTabType } from '../types';
import { BOT_CHAIN_PARAMS, BOT_PRICE_API } from '../constants/botChain';
import { Shield, Cpu, RefreshCw, ChevronRight, Activity, Globe, ExternalLink, Home, Layers } from 'lucide-react';

interface NavbarProps {
  wallet: WalletState;
  onConnectWallet: () => void;
  onDisconnectWallet: () => void;
  onSwitchNetwork: () => void;
  activeTab: ActiveTabType;
  setActiveTab: (tab: ActiveTabType) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  wallet,
  onConnectWallet,
  onDisconnectWallet,
  onSwitchNetwork,
  activeTab,
  setActiveTab
}) => {
  const [botPrice, setBotPrice] = useState<string>('0.0425');
  const [priceChange, setPriceChange] = useState<number>(4.12);
  const [isRefreshingPrice, setIsRefreshingPrice] = useState<boolean>(false);

  const fetchBotPrice = async () => {
    setIsRefreshingPrice(true);
    try {
      const response = await fetch(BOT_PRICE_API);
      if (response.ok) {
        const data = await response.json();
        if (data && data.data && data.data.price) {
          const fetchedPrice = parseFloat(data.data.price).toFixed(4);
          setBotPrice(fetchedPrice);
        }
      }
    } catch (err) {
      console.log('Using default BOT price ticker:', err);
    } finally {
      setTimeout(() => setIsRefreshingPrice(false), 500);
    }
  };

  useEffect(() => {
    fetchBotPrice();
    const interval = setInterval(fetchBotPrice, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-white/10 bg-[#090B10]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo & BOT Price Ticker */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-emerald-400 p-[2px] shadow-lg shadow-cyan-500/20 shrink-0">
              <div className="w-full h-full bg-[#090B10] rounded-[10px] flex items-center justify-center">
                <Cpu className="w-5.5 h-5.5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-black tracking-wider text-white">VERITAS</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-mono font-bold">RWA</span>
              </div>
            </div>
          </div>

          {/* Live BOT Price API Ticker */}
          <div className="hidden lg:flex items-center space-x-2 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[11px] font-mono shrink-0">
            <span className="text-gray-400">BOT:</span>
            <span className="text-cyan-300 font-bold">${botPrice}</span>
            <span className="text-emerald-400 font-semibold">+{priceChange}%</span>
            <button 
              onClick={fetchBotPrice} 
              className="text-gray-500 hover:text-cyan-400 transition-colors ml-1"
              title="Refresh Price"
            >
              <RefreshCw className={`w-3 h-3 ${isRefreshingPrice ? 'animate-spin text-cyan-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Center Navigation Links (Home link removed for decluttering) */}
        <nav className="hidden md:flex items-center space-x-1 p-1 rounded-xl bg-white/5 border border-white/10 shrink-0">
          <button
            onClick={() => setActiveTab('marketplace')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center space-x-1 ${
              activeTab === 'marketplace'
                ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>RWA Marketplace</span>
          </button>

          <button
            onClick={() => setActiveTab('staking')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
              activeTab === 'staking'
                ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Yield & Staking
          </button>

          <button
            onClick={() => setActiveTab('ai-pilot')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center space-x-1.5 ${
              activeTab === 'ai-pilot'
                ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"></span>
            <span>AI Yield Co-Pilot</span>
          </button>

          <button
            onClick={() => setActiveTab('proofs')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
              activeTab === 'proofs'
                ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Proof of Reserve
          </button>

          {/* Admin panel button gated to authorized address */}
          {wallet.isConnected && wallet.address?.toLowerCase() === '0xA4D0349DdeffEe42Afb019105cB55912F7b8e848'.toLowerCase() && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-3 py-2 rounded-lg text-xs font-mono font-bold transition-all duration-200 flex items-center space-x-1.5 ${
                activeTab === 'admin'
                  ? 'bg-gradient-to-r from-red-500/20 to-rose-500/20 text-red-300 border border-red-500/40 shadow-sm'
                  : 'text-rose-400 hover:text-white hover:bg-rose-500/10'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Panel</span>
            </button>
          )}
        </nav>

        {/* Right Network Selector & Wallet Connection */}
        <div className="flex items-center space-x-3 shrink-0">
          
          {/* Network Switcher Badge */}
          <div 
            onClick={onSwitchNetwork}
            className={`cursor-pointer flex items-center space-x-1.5 px-3 py-2 rounded-xl border text-[11px] font-mono transition-all ${
              wallet.isCorrectNetwork
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
            }`}
            title="Click to Switch Network"
          >
            <span className={`w-1.5 h-1.5 rounded-full ${wallet.isCorrectNetwork ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
            <span className="font-semibold">
              {wallet.chainId === 968 ? 'Testnet' : wallet.chainId === 677 ? 'Mainnet' : 'Switch Network'}
            </span>
          </div>

          {/* EVM Wallet Connection / Disconnect Button */}
          {wallet.isConnected ? (
            <div className="flex items-center space-x-2.5">
              <div className="flex flex-col text-right font-mono text-[11px]">
                <span className="text-cyan-300 font-bold">
                  {parseFloat(wallet.botBalance).toFixed(2)} BOT
                </span>
                <span className="text-[9px] text-gray-500">
                  {wallet.address?.substring(0, 6)}...{wallet.address?.substring(wallet.address.length - 4)}
                </span>
              </div>
              <button
                onClick={onDisconnectWallet}
                className="px-2.5 py-1.5 rounded-lg border border-rose-500/30 hover:border-rose-500 bg-rose-500/5 hover:bg-rose-500/10 text-rose-300 hover:text-rose-200 text-[10px] font-mono transition-all"
                title="Disconnect Wallet"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={onConnectWallet}
              className="btn-primary px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-all shadow-md"
            >
              <span>Connect Wallet</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
