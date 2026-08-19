import React, { useState, useEffect } from 'react';
import { WalletState, ActiveTabType } from '../types';
import { BOT_PRICE_API } from '../constants/botChain';
import { Shield, Cpu, RefreshCw, Layers, Menu, X, LogOut } from 'lucide-react';

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
  const [priceChange] = useState<number>(4.12);
  const [isRefreshingPrice, setIsRefreshingPrice] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

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

  const navItems = [
    {
      id: 'marketplace' as ActiveTabType,
      label: 'RWA Marketplace',
      icon: <Layers className="w-3.5 h-3.5" />
    },
    {
      id: 'staking' as ActiveTabType,
      label: 'Yield & Staking'
    },
    {
      id: 'ai-pilot' as ActiveTabType,
      label: 'AI Yield Co-Pilot',
      badge: <span className="w-1.5 h-1.5 rounded-full bg-[#00E575] animate-pulse" />
    },
    {
      id: 'proofs' as ActiveTabType,
      label: 'Proof of Reserve'
    }
  ];

  const isAdmin =
    wallet.isConnected &&
    wallet.address?.toLowerCase() === '0xA4D0349DdeffEe42Afb019105cB55912F7b8e848'.toLowerCase();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#060709]/85 backdrop-blur-2xl border-b border-white/[0.08] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between py-3.5">
        
        {/* Left: Brand Logo & Live BOT Price Ticker */}
        <div className="flex items-center space-x-3.5 sm:space-x-4">
          <button
            onClick={() => {
              setActiveTab('home');
              setIsMobileMenuOpen(false);
            }}
            className="flex items-center space-x-2.5 group text-left focus:outline-none"
          >
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-[#00E575] via-cyan-500 to-blue-500 p-[1.5px] shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-300 shrink-0">
              <div className="w-full h-full bg-[#060709] rounded-[9px] flex items-center justify-center">
                <Cpu className="w-4.5 h-4.5 text-[#00E575] group-hover:rotate-45 transition-transform duration-500" />
              </div>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="text-base font-black tracking-wider text-white group-hover:text-cyan-300 transition-colors">
                VERITAS
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#00E575]/15 text-[#00E575] border border-[#00E575]/30 font-mono font-bold">
                RWA
              </span>
            </div>
          </button>

          {/* Live BOT Price Ticker Pill */}
          <div className="hidden xl:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] hover:border-white/20 text-xs font-mono transition-all duration-200">
            <span className="text-gray-400">BOT:</span>
            <span className="text-white font-bold">${botPrice}</span>
            <span className="text-[#00E575] font-semibold">+{priceChange}%</span>
            <button
              onClick={fetchBotPrice}
              className="text-gray-400 hover:text-white transition-colors ml-0.5 p-0.5"
              title="Refresh Price"
            >
              <RefreshCw className={`w-3 h-3 ${isRefreshingPrice ? 'animate-spin text-[#00E575]' : ''}`} />
            </button>
          </div>
        </div>

        {/* Center: Sleek Floating Pill Navigation Bar */}
        <nav className="hidden lg:flex items-center p-1 rounded-full bg-white/[0.03] border border-white/[0.08] shadow-inner shadow-black/40">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 flex items-center space-x-1.5 select-none ${
                  isActive
                    ? 'bg-white text-black font-bold shadow-lg shadow-white/10 scale-[1.02]'
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && !isActive && item.badge}
              </button>
            );
          })}

          {/* Admin Panel Link */}
          {isAdmin && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-3.5 py-2 rounded-full text-xs font-mono font-bold transition-all duration-200 flex items-center space-x-1.5 ${
                activeTab === 'admin'
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
                  : 'text-rose-400 hover:text-rose-200 hover:bg-rose-500/10'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          )}
        </nav>

        {/* Right: Network Selector, Wallet Actions & Mobile Toggle */}
        <div className="flex items-center space-x-1.5 sm:space-x-2.5 shrink-0">
          
          {/* Network Switcher Pill (Compact icon on mobile, full on desktop) */}
          <div
            onClick={onSwitchNetwork}
            className={`cursor-pointer flex items-center space-x-1 sm:space-x-1.5 px-2 sm:px-3 py-1.5 rounded-full border text-[11px] sm:text-xs font-mono transition-all duration-200 select-none ${
              wallet.isCorrectNetwork
                ? 'bg-[#00E575]/10 border-[#00E575]/30 text-[#00E575] hover:bg-[#00E575]/20 hover:border-[#00E575]/50'
                : 'bg-[#FFE600]/10 border-[#FFE600]/30 text-[#FFE600] hover:bg-[#FFE600]/20 hover:border-[#FFE600]/50'
            }`}
            title="Click to Switch BOT Chain Network"
          >
            <span className={`w-2 h-2 rounded-full ${wallet.isCorrectNetwork ? 'bg-[#00E575] animate-pulse' : 'bg-[#FFE600]'}`} />
            <span className="font-semibold hidden sm:inline">
              {wallet.chainId === 968 ? 'Testnet' : wallet.chainId === 677 ? 'Mainnet' : 'Switch Net'}
            </span>
          </div>

          {/* EVM Wallet Pill Button */}
          {wallet.isConnected ? (
            <div className="flex items-center p-1 pl-2 sm:pl-3 rounded-full bg-white/[0.04] border border-white/10 space-x-1.5 sm:space-x-2">
              <div className="flex items-center space-x-1 sm:space-x-1.5 text-[11px] sm:text-xs font-mono">
                <span className="text-white font-bold">
                  {parseFloat(wallet.botBalance).toFixed(2)} <span className="hidden sm:inline">BOT</span>
                </span>
                <span className="text-gray-400 text-[10px] hidden md:inline">
                  • {wallet.address?.substring(0, 5)}...{wallet.address?.substring(wallet.address.length - 4)}
                </span>
              </div>
              <button
                onClick={onDisconnectWallet}
                className="p-1 sm:p-1.5 rounded-full bg-white/[0.05] hover:bg-rose-500/20 text-gray-400 hover:text-rose-300 border border-transparent hover:border-rose-500/40 transition-all duration-200"
                title="Disconnect Wallet"
              >
                <LogOut className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onConnectWallet}
              className="bg-white hover:bg-gray-150 hover:shadow-white/20 text-black font-bold px-3 sm:px-5 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs transition-all duration-300 shadow-md flex items-center space-x-1 sm:space-x-1.5 active:scale-95 group shrink-0"
            >
              <span>Connect<span className="hidden xs:inline"> Wallet</span></span>
              <span className="group-hover:translate-x-0.5 transition-transform text-black text-xs">↗</span>
            </button>
          )}

          {/* Mobile Menu Hamburger Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-1.5 sm:p-2 rounded-full bg-white/[0.04] border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-colors focus:outline-none shrink-0"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-white/[0.08] bg-[#060709]/95 backdrop-blur-2xl px-4 py-4 space-y-2 animate-in slide-in-from-top-2 duration-200">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full px-4 py-3 rounded-2xl text-xs font-semibold flex items-center justify-between transition-all ${
                  isActive
                    ? 'bg-white text-black font-bold'
                    : 'text-gray-300 hover:bg-white/[0.05] hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge}
              </button>
            );
          })}

          {isAdmin && (
            <button
              onClick={() => {
                setActiveTab('admin');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full px-4 py-3 rounded-2xl text-xs font-mono font-bold flex items-center space-x-2.5 transition-all ${
                activeTab === 'admin'
                  ? 'bg-rose-500 text-white'
                  : 'text-rose-400 hover:bg-rose-500/10'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Admin Panel</span>
            </button>
          )}

          {/* Mobile BOT Price Display */}
          <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono text-gray-400 px-2">
            <span>BOT Oracle Price:</span>
            <div className="flex items-center space-x-2">
              <span className="text-white font-bold">${botPrice}</span>
              <span className="text-[#00E575]">+{priceChange}%</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

