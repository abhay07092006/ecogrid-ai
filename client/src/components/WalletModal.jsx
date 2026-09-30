import React, { useState } from 'react';
import { 
  X, 
  Wallet, 
  PlusCircle, 
  Coins, 
  Zap, 
  ShieldCheck, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Leaf,
  CheckCircle2
} from 'lucide-react';

export default function WalletModal({ wallet, onClose, onTopUp, currency }) {
  const [faucetAmount, setFaucetAmount] = useState(1000);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleTopUp = async (amount) => {
    setIsProcessing(true);
    setSuccessMsg(null);
    try {
      await onTopUp(amount);
      setSuccessMsg(`Successfully credited ₹${amount} to your demo wallet!`);
      setTimeout(() => setSuccessMsg(null), 3000);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCurrency = (amt) => {
    if (currency === 'USD') return `$${(amt / 84).toFixed(2)}`;
    return `₹${amt.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cyber-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md glass-panel-glow bg-cyber-900 border border-cyber-700/80 rounded-2xl p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-cyber-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Microgrid Prosumer Wallet
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                {wallet.name} • {wallet.nodeId}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-cyber-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Balance Display */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-cyber-950 via-cyber-900 to-emerald-950/40 border border-emerald-500/30 space-y-2">
          <div className="text-[11px] font-mono uppercase text-slate-400 flex items-center justify-between">
            <span>Settlement Balance</span>
            <span className="text-emerald-400 flex items-center gap-1 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" /> Instant Smart Settlement
            </span>
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">
            {formatCurrency(wallet.balanceInr)}
          </div>
          <div className="flex items-center gap-3 pt-2 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-500/20">
              <Coins className="w-3.5 h-3.5" />
              <span>{wallet.cleanTokens} RET Tokens</span>
            </div>
            <div className="flex items-center gap-1.5 text-teal-400 bg-teal-950/60 px-2.5 py-1 rounded-lg border border-teal-500/20">
              <Leaf className="w-3.5 h-3.5" />
              <span>{wallet.co2SavedKg} kg CO₂</span>
            </div>
          </div>
        </div>

        {/* Prosumer Lifetime Energy Summary */}
        <div className="grid grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-3 rounded-xl bg-cyber-950 border border-cyber-800">
            <div className="text-slate-400 text-[10px] flex items-center gap-1">
              <ArrowDownLeft className="w-3 h-3 text-cyan-400" /> BOUGHT CLEAN POWER
            </div>
            <div className="text-lg font-bold text-white mt-1">
              {wallet.totalBoughtKwh} <span className="text-xs text-cyan-400 font-normal">kWh</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-cyber-950 border border-cyber-800">
            <div className="text-slate-400 text-[10px] flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3 text-emerald-400" /> SURPLUS POWER SOLD
            </div>
            <div className="text-lg font-bold text-white mt-1">
              {wallet.totalSoldKwh} <span className="text-xs text-emerald-400 font-normal">kWh</span>
            </div>
          </div>
        </div>

        {/* Evaluator Quick Faucet */}
        <div className="p-4 rounded-xl bg-cyber-950 border border-cyber-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              <span>Hackathon Judge Faucet</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Instant Top-Up</span>
          </div>

          <p className="text-[11px] text-slate-400 font-sans">
            Need more funds to test buy trades in the P2P marketplace? Click below to instantly top up your demo balance.
          </p>

          <div className="grid grid-cols-3 gap-2">
            {[500, 1000, 2500].map((amt) => (
              <button
                key={amt}
                disabled={isProcessing}
                onClick={() => handleTopUp(amt)}
                className="py-2 rounded-xl bg-cyber-850 hover:bg-cyber-800 border border-cyber-700 hover:border-emerald-500/40 text-xs font-bold font-mono text-emerald-300 transition-all"
              >
                +₹{amt}
              </button>
            ))}
          </div>

          {successMsg && (
            <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-cyber-800 hover:bg-cyber-750 text-slate-200 text-xs font-semibold transition-colors"
          >
            Close Wallet
          </button>
        </div>
      </div>
    </div>
  );
}
