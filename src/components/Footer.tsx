import React from 'react';
import { Cpu, ExternalLink, ShieldCheck, Github, FileText, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="glass-panel border-t border-white/10 mt-16 py-12 bg-[#090B10]/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-[2px]">
                <div className="w-full h-full bg-[#090B10] rounded-[10px] flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <span className="text-lg font-extrabold text-white tracking-wider">VERITAS <span className="text-cyan-400 text-xs">RWA</span></span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed font-sans">
              Real-World Asset Fractionalization Protocol built natively for BOT Chain Mainnet (Chain ID 677).
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2 font-mono text-xs">
            <h4 className="text-gray-300 font-bold uppercase text-[11px]">BOT Chain Mainnet</h4>
            <ul className="space-y-1.5 text-gray-400">
              <li><a href="https://www.botchain.ai" target="_blank" rel="noreferrer" className="hover:text-cyan-400 flex items-center space-x-1"><span>Official Website</span><ExternalLink className="w-3 h-3"/></a></li>
              <li><a href="https://scan.botchain.ai" target="_blank" rel="noreferrer" className="hover:text-cyan-400 flex items-center space-x-1"><span>Blockscout Explorer</span><ExternalLink className="w-3 h-3"/></a></li>
              <li><a href="https://dex.botchain.ai/#/swap" target="_blank" rel="noreferrer" className="hover:text-cyan-400 flex items-center space-x-1"><span>BOT Chain DEX</span><ExternalLink className="w-3 h-3"/></a></li>
              <li><a href="https://faucet.botchain.ai" target="_blank" rel="noreferrer" className="hover:text-cyan-400 flex items-center space-x-1"><span>Testnet Faucet</span><ExternalLink className="w-3 h-3"/></a></li>
            </ul>
          </div>

          {/* Audit Reports */}
          <div className="space-y-2 font-mono text-xs">
            <h4 className="text-gray-300 font-bold uppercase text-[11px]">Security & Audits</h4>
            <ul className="space-y-1.5 text-gray-400">
              <li><a href="https://www.botchain.ai/docs/Chain.pdf" target="_blank" rel="noreferrer" className="hover:text-emerald-400 flex items-center space-x-1"><span>CertiK Chain Audit Report</span><ShieldCheck className="w-3 h-3 text-emerald-400"/></a></li>
              <li><a href="https://dex.botchain.ai/docs/Dex-Audit-Report.pdf" target="_blank" rel="noreferrer" className="hover:text-emerald-400 flex items-center space-x-1"><span>CertiK DEX Audit Report</span><ShieldCheck className="w-3 h-3 text-emerald-400"/></a></li>
              <li><a href="https://skynet.certik.com/projects/botchain" target="_blank" rel="noreferrer" className="hover:text-emerald-400 flex items-center space-x-1"><span>CertiK Skynet Insight</span><ExternalLink className="w-3 h-3"/></a></li>
            </ul>
          </div>



        </div>

        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-gray-500 gap-2">
          <div>© 2026 VeritasRWA. Built for BOT Chain Mainnet (Chain ID 677).</div>
          <div className="flex space-x-4">
            <span>EVM RPC: https://rpc.botchain.ai</span>
            <span>USDT: 0xaBabc...e87a3C</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
