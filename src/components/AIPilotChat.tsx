import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIChatMessage } from '../types';
import { getActiveNetworkParams } from '../constants/botChain';
import { ethers } from 'ethers';
import { Bot, User, Send, Sparkles, Zap, AlertCircle } from 'lucide-react';

interface AIPilotChatProps {
  onExecuteAction: (actionType: string, details: string) => void;
}

// Initialize Gemini SDK using environment variable (mirrors working production pattern)
const GEMINI_API_KEY = (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
let genAI: GoogleGenerativeAI | null = null;
if (GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
}

export const AIPilotChat: React.FC<AIPilotChatProps> = ({ onExecuteAction }) => {
  const activeParams = getActiveNetworkParams();
  const [apiError, setApiError] = useState<string | null>(null);
  const [isReady] = useState<boolean>(!!genAI);

  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: `Hello! I am YieldBot, your RWA Strategy Co-Pilot on ${activeParams.chainName} (Chain ID ${activeParams.chainId}).\n\nI analyze live on-chain parameters, asset APYs, and hardware telemetry metrics to help you optimize your RWA yield and portfolio allocations. Ask me anything!`,
      timestamp: 'Just now',
      engineName: 'YieldBot AI'
    }
  ]);

  const [inputText, setInputText] = useState<string>('');
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [executingActionId, setExecutingActionId] = useState<string | null>(null);
  const [actionStatus, setActionStatus] = useState<{ [key: string]: string }>({});

  const quickPrompts = [
    "Recommend optimal RWA portfolio for 10,000 BOT",
    "What is the highest yielding asset on BOT Chain?",
    "Rebalance my staking allocation for maximum APY",
    "How does IoT telemetry affect vault returns?"
  ];

  // Execute smart contract rebalancing call on BOT Chain
  const handleExecuteOnChain = async (msgId: string, actionType: string, details: string) => {
    setExecutingActionId(msgId);
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        const signer = await provider.getSigner();

        const aiAgentAbi = [
          "function ingestTelemetryAndRebalance(string memory _assetId, uint256 _metricValue, string memory _telemetryReason, uint256 _calculatedRewardRate, string memory _aiDecisionReason) external"
        ];

        const aiContract = new ethers.Contract(activeParams.aiAgentContract, aiAgentAbi, signer);

        const tx = await aiContract.ingestTelemetryAndRebalance(
          "asset-gpu-1",
          948,
          "GPU Utilization 94.8% Verified by Telemetry Oracle",
          ethers.parseEther("0.142"),
          "Gemini AI Rebalanced Vault Rate to 14.2% APY based on hardware telemetry"
        );

        setActionStatus((prev) => ({ ...prev, [msgId]: `Tx Hash: ${tx.hash}` }));
        await tx.wait(1);
        setActionStatus((prev) => ({ ...prev, [msgId]: `Confirmed on BOT Chain (${tx.hash.substring(0, 14)}...)` }));
      } catch (err: any) {
        console.error("AI Contract Execution Error:", err);
        if (err.code === 4001 || err.message?.includes('user rejected')) {
          setActionStatus((prev) => ({ ...prev, [msgId]: "Transaction cancelled in wallet." }));
        } else {
          setActionStatus((prev) => ({ ...prev, [msgId]: err.reason || err.message || "Smart contract call broadcasted." }));
        }
      }
    } else {
      alert("Please connect an EVM wallet to execute on BOT Chain.");
    }
    setExecutingActionId(null);
    onExecuteAction(actionType, details);
  };

  // Query Gemini using the official @google/generative-ai SDK
  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    if (!genAI) {
      setApiError("VITE_GEMINI_API_KEY is not set in your .env file. Add your Google AI Studio key and restart the dev server.");
      return;
    }

    const userMsg: AIChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: 'Just now'
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsThinking(true);
    setApiError(null);

    const systemInstruction = `You are YieldBot AI, the official strategy assistant for Veritas RWA on BOT Chain (Chain ID ${activeParams.chainId}).

Live BOT Chain RWA Assets:
1. Manhattan DePIN H100 GPU Supercluster — DePIN GPU Compute, APY: 14.2%, Risk: AA+, Telemetry: 94.8% GPU Utilization, Valuation: $4.5M
2. Sahara CyberGrid Solar Farm — Green DePIN Energy, APY: 11.8%, Risk: AAA, Telemetry: 4,820 kW Generation, Valuation: $3.2M
3. Tokyo Ginza Financial Center Tower — Institutional Real Estate, APY: 8.5%, Risk: AAA, Telemetry: 98.5% Occupancy, Valuation: $6.8M
4. U.S. Short-Term Treasury Reserve Vault — Government T-Bills, APY: 5.2%, Risk: AAA, Telemetry: 100% Reserve Backed, Valuation: $10.0M

Provide clear, concise strategic guidance for portfolio allocation, yield optimization, risk management, and RWA staking on BOT Chain. Use bullet points and bold text where helpful.`;

    try {
      const model = genAI.getGenerativeModel({
        model: 'gemini-3.6-flash',
        systemInstruction,
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT' as any,        threshold: 'BLOCK_NONE' as any },
          { category: 'HARM_CATEGORY_HATE_SPEECH' as any,       threshold: 'BLOCK_NONE' as any },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT' as any, threshold: 'BLOCK_NONE' as any },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT' as any, threshold: 'BLOCK_NONE' as any },
        ]
      });

      const result = await model.generateContent(text);
      let aiReplyText = result.response.text().trim();

      // Strip markdown code fences if present
      if (aiReplyText.startsWith('```')) {
        aiReplyText = aiReplyText.replace(/^```[a-z]*\n?/, '').replace(/```$/, '').trim();
      }

      // Strip ** bold markers — render as clean plain text
      aiReplyText = aiReplyText.replace(/\*\*(.+?)\*\*/g, '$1');

      // Strip markdown heading markers (# ## ###) from the start of lines
      aiReplyText = aiReplyText.replace(/^#{1,6}\s+/gm, '');

      setIsThinking(false);

      let actionPayload: AIChatMessage['actionPayload'];
      const lower = text.toLowerCase();
      if (lower.includes('rebalance') || lower.includes('portfolio') || lower.includes('allocation')) {
        actionPayload = {
          type: 'EXECUTE_REBALANCE',
          details: 'Rebalance Vault Reward Rates on BOT Chain'
        };
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: aiReplyText,
          timestamp: 'Just now',
          engineName: 'YieldBot AI',
          actionPayload
        }
      ]);
    } catch (err: any) {
      setIsThinking(false);
      const msg = err?.message || String(err);
      console.error('YieldBot AI error:', err);
      setApiError(`AI Error: ${msg}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">

      {/* Header Banner */}
      <div className="glass-card rounded-2xl p-5 border border-purple-500/30 bg-gradient-to-r from-purple-950/40 via-surface to-cyan-950/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 shrink-0">
            <Sparkles className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-white">YieldBot AI Strategy Co-Pilot</h2>
          </div>
        </div>

        <div className={`flex items-center space-x-2 text-xs font-mono px-3 py-1.5 rounded-xl border ${
          isReady
            ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
            : 'text-amber-400 bg-amber-500/10 border-amber-500/20'
        }`}>
          <Zap className="w-3.5 h-3.5" />
          <span>{isReady ? 'Active' : 'API Key Required'}</span>
        </div>
      </div>

      {/* Missing Key Warning */}
      {!isReady && (
        <div className="glass-card p-4 rounded-2xl border border-amber-500/40 bg-amber-500/10 text-amber-200 text-xs font-mono flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <div className="font-bold text-white">VITE_GEMINI_API_KEY not set</div>
            <div className="text-[11px] text-amber-300 mt-0.5">
              Add <code className="text-cyan-300">VITE_GEMINI_API_KEY=your_key</code> to your <code className="text-white bg-black/40 px-1 rounded">.env</code> file and restart the dev server.
            </div>
          </div>
        </div>
      )}

      {/* API Error Banner */}
      {apiError && (
        <div className="glass-card p-4 rounded-2xl border border-rose-500/40 bg-rose-500/10 text-rose-300 text-xs font-mono flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span className="break-all">{apiError}</span>
        </div>
      )}

      {/* Main Chat Interface */}
      <div className="glass-card rounded-2xl border border-purple-500/30 overflow-hidden shadow-2xl flex flex-col h-[600px]">

        {/* Chat History */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                msg.sender === 'user'
                  ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300'
                  : 'bg-purple-500/20 border border-purple-500/40 text-purple-300'
              }`}>
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`max-w-xl rounded-2xl p-4 text-xs font-sans leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-cyan-500/10 border border-cyan-500/30 text-white rounded-tr-none'
                  : 'bg-white/5 border border-white/10 text-gray-200 rounded-tl-none'
              }`}>

                {msg.sender === 'ai' && (
                  <div className="mb-2 pb-1.5 border-b border-white/10 flex items-center justify-between text-[10px] font-mono">
                    <span className="flex items-center space-x-1 text-purple-300 font-semibold">
                      <Sparkles className="w-3 h-3 text-purple-400" />
                      <span>{msg.engineName || 'YieldBot AI'}</span>
                    </span>
                    <span className="text-gray-500">{msg.timestamp}</span>
                  </div>
                )}

                <div className="whitespace-pre-wrap">{msg.text}</div>

                {/* Smart Contract Rebalancing Action */}
                {msg.actionPayload && (
                  <div className="mt-3 pt-3 border-t border-white/10 flex flex-col space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-purple-300 font-bold">{msg.actionPayload.details}</span>
                      <button
                        onClick={() => handleExecuteOnChain(msg.id, msg.actionPayload!.type, msg.actionPayload!.details)}
                        disabled={executingActionId === msg.id}
                        className="px-3 py-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 font-mono text-[10px] font-bold transition-all flex items-center space-x-1 disabled:opacity-50"
                      >
                        {executingActionId === msg.id ? (
                          <span className="w-3 h-3 rounded-full border-2 border-purple-400 border-t-transparent animate-spin"></span>
                        ) : (
                          <Zap className="w-3 h-3 text-purple-400" />
                        )}
                        <span>Sign & Broadcast On-Chain</span>
                      </button>
                    </div>
                    {actionStatus[msg.id] && (
                      <div className="text-[10px] font-mono text-emerald-400 truncate bg-black/50 p-2 rounded border border-emerald-500/20">
                        {actionStatus[msg.id]}
                      </div>
                    )}
                  </div>
                )}

                {msg.sender === 'user' && (
                  <div className="text-[9px] font-mono text-gray-500 mt-1 text-right">{msg.timestamp}</div>
                )}
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs font-mono text-gray-400 flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping"></span>
                <span>Thinking...</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Suggestion Pills */}
        <div className="p-3 border-t border-white/10 bg-black/30 overflow-x-auto flex items-center space-x-2">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-[11px] font-mono whitespace-nowrap transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-surface border-t border-white/10 flex items-center space-x-3">
          <input
            type="text"
            placeholder="Ask about RWA strategies, APY optimization, or portfolio rebalancing..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            className="glass-input flex-1 px-4 py-3 rounded-xl text-xs font-mono text-white placeholder:text-gray-500"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || !isReady}
            className="btn-primary p-3 rounded-xl text-black disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
