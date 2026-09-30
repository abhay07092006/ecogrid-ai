import React, { useState } from 'react';
import { 
  X, 
  Zap, 
  ShieldCheck, 
  ArrowRight, 
  Coins, 
  TrendingDown, 
  Leaf, 
  CheckCircle, 
  AlertCircle 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function TradeModal({ 
  offer, 
  wallet, 
  onClose, 
  onConfirmTrade, 
  currency 
}) {
  if (!offer) return null;

  const [unitsToBuy, setUnitsToBuy] = useState(
    Math.min(offer.availableKwh, Math.max(offer.minKwh || 1, 5))
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const unitPrice = offer.pricePerKwh;
  const totalCostInr = Number((unitsToBuy * unitPrice).toFixed(2));
  const discomBenchmarkInr = Number((unitsToBuy * offer.discomPrice).toFixed(2));
  const totalSavingsInr = Number((discomBenchmarkInr - totalCostInr).toFixed(2));
  const savingsPct = Math.round((totalSavingsInr / discomBenchmarkInr) * 100);
  const co2AvoidedKg = Number((unitsToBuy * 0.82).toFixed(2));
  const cleanTokensEarned = Number((unitsToBuy * 0.1).toFixed(1));

  const canAfford = wallet.balanceInr >= totalCostInr;

  const handleExecute = async () => {
    if (!canAfford) {
      setErrorMsg(`Insufficient funds. Your wallet balance is ₹${wallet.balanceInr.toFixed(2)}.`);
      return;
    }
    if (unitsToBuy > offer.availableKwh) {
      setErrorMsg(`Cannot purchase more than available ${offer.availableKwh} kWh.`);
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg(null);
      await onConfirmTrade(offer.id, unitsToBuy);
      
      // Trigger festive green confetti celebration!
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#34d399', '#6ee7b7', '#00ffaa']
      });
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Transaction could not be confirmed on the microgrid');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amt) => {
    if (currency === 'USD') return `$${(amt / 84).toFixed(2)}`;
    return `₹${amt.toFixed(2)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cyber-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg glass-panel-glow bg-cyber-900 border border-cyber-700/80 rounded-2xl p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-cyber-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-xl">
              {offer.sellerAvatar || '⚡'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Instant P2P Clean Energy Trade
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                  Smart Contract
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Purchasing from <span className="text-emerald-400 font-semibold">{offer.sellerName}</span> ({offer.node})
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

        {/* Units Selector & Slider */}
        <div className="space-y-3 bg-cyber-950/70 p-4 rounded-xl border border-cyber-800">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300 font-semibold">Select Energy Units to Buy:</span>
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-bold text-emerald-400 font-mono">
                {unitsToBuy}
              </span>
              <span className="text-slate-400">kWh</span>
            </div>
          </div>

          <input
            type="range"
            min={offer.minKwh || 1}
            max={offer.availableKwh}
            step="0.5"
            value={unitsToBuy}
            onChange={(e) => setUnitsToBuy(parseFloat(e.target.value))}
            className="w-full h-2 bg-cyber-900 rounded-lg appearance-none cursor-pointer accent-emerald-400"
          />

          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Min: {offer.minKwh || 1} kWh</span>
            <div className="flex gap-1.5">
              {[5, 10, 15, offer.availableKwh].map((val) => (
                val <= offer.availableKwh && (
                  <button
                    key={val}
                    onClick={() => setUnitsToBuy(val)}
                    className={`px-2 py-0.5 rounded text-[10px] ${
                      unitsToBuy === val ? 'bg-emerald-600 text-white font-bold' : 'bg-cyber-800 text-slate-300 hover:bg-cyber-700'
                    }`}
                  >
                    {val === offer.availableKwh ? 'MAX' : `${val} kWh`}
                  </button>
                )
              ))}
            </div>
            <span>Available: {offer.availableKwh} kWh</span>
          </div>
        </div>

        {/* Cost & Savings Comparison breakdown */}
        <div className="space-y-2.5 font-mono text-xs">
          <div className="flex justify-between text-slate-400">
            <span>P2P Tariff Rate:</span>
            <span className="text-emerald-400 font-bold">
              {formatCurrency(unitPrice)} / kWh
            </span>
          </div>

          <div className="flex justify-between text-slate-400">
            <span>Discom Standard Grid Tariff:</span>
            <span className="line-through text-slate-500">
              {formatCurrency(offer.discomPrice)} / kWh
            </span>
          </div>

          <div className="flex justify-between text-slate-300 pt-2 border-t border-cyber-800">
            <span>Total Settlement Cost:</span>
            <span className="text-lg font-bold text-white">
              {formatCurrency(totalCostInr)}
            </span>
          </div>

          {/* Savings Highlight */}
          <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-emerald-400" />
              <div>
                <div className="text-[11px] text-slate-300 font-sans font-semibold">Immediate Tariff Savings</div>
                <div className="text-[10px] text-emerald-400">vs. State Utility Coal Grid</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-emerald-300 text-sm">
                Save {formatCurrency(totalSavingsInr)}
              </div>
              <div className="text-[10px] text-emerald-400 font-bold">({savingsPct}% Cheaper)</div>
            </div>
          </div>

          {/* Environmental Credits */}
          <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
            <div className="p-2 rounded-lg bg-cyber-950 border border-cyber-800 flex items-center gap-1.5 text-teal-300">
              <Leaf className="w-3.5 h-3.5" />
              <span>{co2AvoidedKg} kg CO₂ Offset</span>
            </div>
            <div className="p-2 rounded-lg bg-cyber-950 border border-cyber-800 flex items-center gap-1.5 text-amber-300">
              <Coins className="w-3.5 h-3.5" />
              <span>+{cleanTokensEarned} RET Green Tokens</span>
            </div>
          </div>
        </div>

        {/* Error message if any */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Wallet balance check */}
        <div className="flex items-center justify-between text-xs font-mono pt-1 text-slate-400">
          <span>Available Wallet Balance:</span>
          <span className={`font-bold ${canAfford ? 'text-emerald-400' : 'text-red-400'}`}>
            {formatCurrency(wallet.balanceInr)}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-cyber-700 bg-cyber-850 hover:bg-cyber-800 text-slate-300 text-xs font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isSubmitting || !canAfford}
            onClick={handleExecute}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              canAfford && !isSubmitting
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-cyber-950 shadow-lg shadow-emerald-900/40'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-1.5">
                <span className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-cyber-950 border-t-transparent"></span>
                Settling on Grid...
              </span>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-cyber-950" />
                <span>Confirm Purchase ({formatCurrency(totalCostInr)})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
