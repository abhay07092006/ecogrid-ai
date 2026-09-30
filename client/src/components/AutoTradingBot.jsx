import React, { useState } from 'react';
import { 
  Cpu, 
  Bot, 
  Zap, 
  BatteryCharging, 
  ShieldCheck, 
  Clock, 
  TrendingUp, 
  CheckCircle, 
  Sliders, 
  Sparkles,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

export default function AutoTradingBot({ wallet, onExecuteTrade }) {
  const [rule1Active, setRule1Active] = useState(true);
  const [rule1MinPrice, setRule1MinPrice] = useState(4.20);
  const [rule1MinSoc, setRule1MinSoc] = useState(80);

  const [rule2Active, setRule2Active] = useState(true);
  const [rule2MaxPrice, setRule2MaxPrice] = useState(3.90);

  const [rule3Active, setRule3Active] = useState(true);
  const [rule3ReserveSoc, setRule3ReserveSoc] = useState(30);

  const [rule4Active, setRule4Active] = useState(true);

  // Simulated bot action logs
  const [botLogs] = useState([
    {
      id: 'LOG-1',
      time: '14:15:02 IST',
      rule: 'Surplus Arbitrage',
      action: 'Dispatched 8.5 kWh surplus to P2P orderbook @ ₹4.30/kWh (BESS SoC at 88%)',
      status: 'Matched & Settled'
    },
    {
      id: 'LOG-2',
      time: '12:40:19 IST',
      rule: 'Pre-Peak Storage Charging',
      action: 'Auto-bought 15.0 kWh from SunPower Bio-Park @ ₹3.90/kWh (Tariff Arbitrage)',
      status: 'Transferred to BESS'
    },
    {
      id: 'LOG-3',
      time: '10:00:00 IST',
      rule: 'Blackout Reserve Guard',
      action: 'Reserved 4.2 kWh battery partition for islanding resilience',
      status: 'Active Guard'
    },
    {
      id: 'LOG-4',
      time: '08:30:15 IST',
      rule: 'Peak Tariff Shaving',
      action: 'Scheduled evening discharge (18:00 - 22:00) to bypass ₹10.50 utility peak tariff',
      status: 'Scheduled'
    }
  ]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-cyber-900 via-cyber-850 to-purple-950/40 p-6 rounded-2xl border border-cyber-800">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-purple-400"></span>
            <span className="text-xs uppercase font-mono tracking-widest text-purple-400 font-semibold flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5" /> Autonomous Energy Dispatch & Arbitrage
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            AI Smart Grid Auto-Pilot
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl mt-1">
            Configure algorithmic rules for microsecond automated energy trading, storage optimization, and peak-tariff avoidance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-cyber-950/80 border border-purple-500/30 px-4 py-2.5 rounded-2xl flex items-center gap-2 font-mono text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-emerald-400 font-bold">Auto-Pilot Active</span>
          </div>
        </div>
      </div>

      {/* Rules Engine Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Automated Rules Configuration (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-purple-400" />
            <span>Autonomous Dispatch Rules</span>
          </h3>

          {/* Rule 1 */}
          <div className="glass-panel p-5 rounded-2xl border border-cyber-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Rule 1: Solar Surplus Arbitrage</h4>
                  <p className="text-[11px] text-slate-400">
                    Automatically publish excess generation to the P2P market when battery is well charged.
                  </p>
                </div>
              </div>
              <button onClick={() => setRule1Active(!rule1Active)}>
                {rule1Active ? (
                  <ToggleRight className="w-7 h-7 text-emerald-400" />
                ) : (
                  <ToggleLeft className="w-7 h-7 text-slate-600" />
                )}
              </button>
            </div>

            {rule1Active && (
              <div className="pt-2 border-t border-cyber-800/80 grid grid-cols-2 gap-3 text-xs font-mono">
                <div>
                  <label className="text-slate-400 block mb-1 text-[10px]">MIN BATTERY SOC (%)</label>
                  <input
                    type="number"
                    value={rule1MinSoc}
                    onChange={(e) => setRule1MinSoc(e.target.value)}
                    className="w-full bg-cyber-950 border border-cyber-700 rounded-lg px-2.5 py-1.5 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 text-[10px]">MIN ASK PRICE (₹/kWh)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={rule1MinPrice}
                    onChange={(e) => setRule1MinPrice(e.target.value)}
                    className="w-full bg-cyber-950 border border-cyber-700 rounded-lg px-2.5 py-1.5 text-white font-bold"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Rule 2 */}
          <div className="glass-panel p-5 rounded-2xl border border-cyber-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Rule 2: Cheap Energy Dip Sniping</h4>
                  <p className="text-[11px] text-slate-400">
                    Instantly purchase cheap energy from commercial prosumers when local market price falls.
                  </p>
                </div>
              </div>
              <button onClick={() => setRule2Active(!rule2Active)}>
                {rule2Active ? (
                  <ToggleRight className="w-7 h-7 text-cyan-400" />
                ) : (
                  <ToggleLeft className="w-7 h-7 text-slate-600" />
                )}
              </button>
            </div>

            {rule2Active && (
              <div className="pt-2 border-t border-cyber-800/80 text-xs font-mono">
                <label className="text-slate-400 block mb-1 text-[10px]">MAX BUY TRIGGER PRICE (₹/kWh)</label>
                <input
                  type="number"
                  step="0.1"
                  value={rule2MaxPrice}
                  onChange={(e) => setRule2MaxPrice(e.target.value)}
                  className="w-full bg-cyber-950 border border-cyber-700 rounded-lg px-2.5 py-1.5 text-white font-bold"
                />
              </div>
            )}
          </div>

          {/* Rule 3 */}
          <div className="glass-panel p-5 rounded-2xl border border-cyber-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <BatteryCharging className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Rule 3: Emergency Blackout Buffer</h4>
                  <p className="text-[11px] text-slate-400">
                    Locks battery reserve to guarantee critical home power during utility grid outages.
                  </p>
                </div>
              </div>
              <button onClick={() => setRule3Active(!rule3Active)}>
                {rule3Active ? (
                  <ToggleRight className="w-7 h-7 text-amber-400" />
                ) : (
                  <ToggleLeft className="w-7 h-7 text-slate-600" />
                )}
              </button>
            </div>

            {rule3Active && (
              <div className="pt-2 border-t border-cyber-800/80 text-xs font-mono">
                <label className="text-slate-400 block mb-1 text-[10px]">RESERVE SOC FLOOR (%)</label>
                <input
                  type="number"
                  value={rule3ReserveSoc}
                  onChange={(e) => setRule3ReserveSoc(e.target.value)}
                  className="w-full bg-cyber-950 border border-cyber-700 rounded-lg px-2.5 py-1.5 text-white font-bold"
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Bot Execution Activity Stream (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-400" />
            <span>Autonomous Execution Stream</span>
          </h3>

          <div className="glass-panel p-5 rounded-2xl border border-cyber-800 space-y-3.5">
            {botLogs.map((log) => (
              <div 
                key={log.id} 
                className="p-3 rounded-xl bg-cyber-950 border border-cyber-800 font-mono text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-purple-300">{log.rule}</span>
                  <span className="text-slate-500">{log.time}</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed font-sans">
                  {log.action}
                </p>
                <div className="flex items-center justify-between pt-1 border-t border-cyber-900 text-[10px]">
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> {log.status}
                  </span>
                  <span className="text-slate-500">{log.id}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
