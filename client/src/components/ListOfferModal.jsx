import React, { useState } from 'react';
import { 
  X, 
  PlusCircle, 
  Sun, 
  BatteryCharging, 
  HelpCircle, 
  AlertCircle,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';

export default function ListOfferModal({ wallet, onClose, onPublishOffer }) {
  const [availableKwh, setAvailableKwh] = useState(15.0);
  const [pricePerKwh, setPricePerKwh] = useState(4.20);
  const [source, setSource] = useState('Rooftop Monocrystalline PV');
  const [batteryBacked, setBatteryBacked] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!availableKwh || availableKwh <= 0) {
      setErrorMsg('Please enter a valid energy quantity (kWh).');
      return;
    }
    if (!pricePerKwh || pricePerKwh <= 0) {
      setErrorMsg('Please specify a valid asking price per unit.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg(null);
      await onPublishOffer({
        availableKwh: parseFloat(availableKwh),
        pricePerKwh: parseFloat(pricePerKwh),
        source,
        batteryBacked
      });
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to publish surplus energy offer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const estimatedEarnings = (availableKwh * pricePerKwh).toFixed(2);
  const discomBenchmark = (availableKwh * 7.50).toFixed(2);
  const discountVsDiscom = Math.round(((7.50 - pricePerKwh) / 7.50) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cyber-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg glass-panel bg-cyber-900 border border-cyber-700/80 rounded-2xl p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-cyber-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                List Surplus Solar Power on Microgrid
              </h3>
              <p className="text-xs text-slate-400">
                Publish excess solar output from your node ({wallet.nodeId}) for peer-to-peer sale.
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
          {/* Energy Quantity */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold flex items-center justify-between">
              <span>Surplus Energy Available (kWh):</span>
              <span className="text-[10px] text-emerald-400 font-sans">
                Max from Inverter: 24.5 kWh
              </span>
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.5"
                min="1"
                max="100"
                value={availableKwh}
                onChange={(e) => setAvailableKwh(e.target.value)}
                required
                className="w-full bg-cyber-950 border border-cyber-700 rounded-xl px-4 py-2.5 text-white font-bold focus:outline-none focus:border-emerald-500 text-sm"
              />
              <span className="absolute right-4 top-2.5 text-slate-400 font-bold">kWh</span>
            </div>
          </div>

          {/* Asking Price */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold flex items-center justify-between">
              <span>Selling Price per Unit (₹/kWh):</span>
              <span className="text-[10px] text-amber-400">
                Discom Standard: ₹7.50/unit
              </span>
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.05"
                min="1.0"
                max="15.0"
                value={pricePerKwh}
                onChange={(e) => setPricePerKwh(e.target.value)}
                required
                className="w-full bg-cyber-950 border border-cyber-700 rounded-xl px-4 py-2.5 text-white font-bold focus:outline-none focus:border-emerald-500 text-sm"
              />
              <span className="absolute right-4 top-2.5 text-slate-400 font-bold">₹/unit</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Recommended: ₹4.20 - ₹4.50 ({discountVsDiscom}% discount attracts instant buyers)</span>
            </div>
          </div>

          {/* Power Source */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold">Clean Energy Source:</label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full bg-cyber-950 border border-cyber-700 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-emerald-500 text-xs"
            >
              <option value="Rooftop Monocrystalline PV">Rooftop Monocrystalline PV</option>
              <option value="Smart Hybrid Solar + LFP Storage">Smart Hybrid Solar + LFP Storage</option>
              <option value="Agri-Voltaic Solar Array">Agri-Voltaic Solar Array</option>
              <option value="Micro-BESS Clean Energy Bank">Micro-BESS Clean Energy Bank</option>
            </select>
          </div>

          {/* Battery Backed Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-cyber-950 border border-cyber-800">
            <div className="flex items-center gap-2">
              <BatteryCharging className="w-4 h-4 text-emerald-400" />
              <div>
                <div className="text-slate-200 font-semibold text-xs">Battery BESS Backed</div>
                <div className="text-[10px] text-slate-400">Guarantees uninterrupted dispatch during cloud dips</div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={batteryBacked}
                onChange={(e) => setBatteryBacked(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-cyber-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>

          {/* Revenue Summary */}
          <div className="p-3.5 rounded-xl bg-cyber-950 border border-cyber-800 space-y-1.5">
            <div className="flex justify-between text-slate-400">
              <span>Potential Seller Earnings:</span>
              <span className="text-white font-bold">₹{estimatedEarnings}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Buyer Total Savings vs Discom:</span>
              <span className="text-emerald-400 font-bold">₹{(discomBenchmark - estimatedEarnings).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Green Token Incentive:</span>
              <span className="text-amber-400 font-bold">+{(availableKwh * 0.1).toFixed(1)} RET</span>
            </div>
          </div>

          {/* Error display */}
          {errorMsg && (
            <div className="p-2.5 rounded-lg bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-cyber-700 bg-cyber-850 hover:bg-cyber-800 text-slate-300 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-cyber-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-950/50"
            >
              {isSubmitting ? (
                <span>Publishing...</span>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" />
                  <span>Publish Offer to Grid</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
