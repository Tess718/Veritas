import React from 'react';
import { Cpu, ExternalLink, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/[0.08] mt-20 py-14 bg-[#050608] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-3.5 md:col-span-1">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#00E575] via-cyan-500 to-blue-500 p-[1.5px] shadow-md shadow-cyan-500/20">
                <div className="w-full h-full bg-[#060709] rounded-[9px] flex items-center justify-center">
                  <Cpu className="w-4.5 h-4.5 text-[#00E575]" />
                </div>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="text-base font-black tracking-wider text-white">VERITAS</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#00E575]/15 text-[#00E575] border border-[#00E575]/30 font-mono font-bold">RWA</span>
              </div>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed font-sans">
              Real-World Asset Fractionalization Protocol built natively for BOT Chain Mainnet (Chain ID 677).
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2.5 font-mono text-xs">
            <h4 className="text-white font-bold uppercase text-[11px] tracking-wider">BOT Chain Mainnet</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="https://www.botchain.ai" target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center space-x-1.5"><span>Official Website</span><ExternalLink className="w-3 h-3 text-gray-500"/></a></li>
              <li><a href="https://scan.botchain.ai" target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center space-x-1.5"><span>Blockscout Explorer</span><ExternalLink className="w-3 h-3 text-gray-500"/></a></li>
              <li><a href="https://dex.botchain.ai/#/swap" target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center space-x-1.5"><span>BOT Chain DEX</span><ExternalLink className="w-3 h-3 text-gray-500"/></a></li>
              <li><a href="https://faucet.botchain.ai" target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center space-x-1.5"><span>Testnet Faucet</span><ExternalLink className="w-3 h-3 text-gray-500"/></a></li>
            </ul>
          </div>

          {/* Audit Reports */}
          <div className="space-y-2.5 font-mono text-xs">
            <h4 className="text-white font-bold uppercase text-[11px] tracking-wider">Security & Audits</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="https://www.botchain.ai/docs/Chain.pdf" target="_blank" rel="noreferrer" className="hover:text-[#00E575] transition-colors flex items-center space-x-1.5"><span>CertiK Chain Audit Report</span><ShieldCheck className="w-3 h-3 text-[#00E575]"/></a></li>
              <li><a href="https://dex.botchain.ai/docs/Dex-Audit-Report.pdf" target="_blank" rel="noreferrer" className="hover:text-[#00E575] transition-colors flex items-center space-x-1.5"><span>CertiK DEX Audit Report</span><ShieldCheck className="w-3 h-3 text-[#00E575]"/></a></li>
              <li><a href="https://skynet.certik.com/projects/botchain" target="_blank" rel="noreferrer" className="hover:text-[#00E575] transition-colors flex items-center space-x-1.5"><span>CertiK Skynet Insight</span><ExternalLink className="w-3 h-3 text-gray-500"/></a></li>
            </ul>
          </div>

          {/* Protocol Status Pill */}
          <div className="space-y-2.5 font-mono text-xs">
            <h4 className="text-white font-bold uppercase text-[11px] tracking-wider">Protocol Status</h4>
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Network:</span>
                <span className="text-[#00E575] font-semibold">BOT Chain (677)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Oracles:</span>
                <span className="text-cyan-400 font-semibold">Live Telemetry</span>
              </div>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-gray-500 gap-3">
          <div>© 2026 VeritasRWA. Built for BOT Chain Mainnet (Chain ID 677).</div>
          <div className="flex flex-wrap gap-4 text-[11px]">
            <span>RPC: https://rpc.botchain.ai</span>
            <span>USDT: 0xaBabc...e87a3C</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

