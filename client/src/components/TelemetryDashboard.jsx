import React, { useState } from 'react';
import { 
  Sun, 
  Zap, 
  BatteryCharging, 
  Leaf, 
  ArrowUpRight, 
  ArrowDownRight, 
  TrendingUp, 
  Layers, 
  Cpu, 
  Radio, 
  AlertCircle,
  Clock,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend, 
  Line, 
  BarChart, 
  Bar,
  ReferenceLine
} from 'recharts';

export default function TelemetryDashboard({ telemetryData, onSwitchTab }) {
  const [activeCurveView, setActiveCurveView] = useState('all'); // 'all', 'generation', 'demand', 'battery'

  if (!telemetryData || !telemetryData.metrics) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  const { metrics, nodes = [], hourlyTrend = [] } = telemetryData;

  // Custom Chart Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-cyber-900/95 border border-cyber-700/80 p-3.5 rounded-xl shadow-2xl backdrop-blur-md text-xs font-mono">
          <p className="text-slate-300 font-semibold mb-2 border-b border-cyber-800 pb-1 flex items-center justify-between">
            <span>Time Window: {label}</span>
            <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/20">Microgrid Telemetry</span>
          </p>
          <div className="space-y-1.5">
            {payload.map((item, index) => (
              <div key={index} className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-1.5" style={{ color: item.color }}>
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                  {item.name}:
                </span>
                <span className="font-bold text-white">
                  {item.value} {item.unit || (item.name.includes('Battery') ? '%' : 'kW')}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-cyber-900 via-cyber-850 to-emerald-950/40 p-6 rounded-2xl border border-cyber-800/80 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs uppercase font-mono tracking-widest text-emerald-400 font-semibold">
              Live Microgrid Telemetry Feed
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Decentralized Energy Command Center
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl mt-1">
            Real-time telemetry, automated load balancing, and high-frequency dispatch for local community renewable energy nodes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <div className="bg-cyber-950/80 border border-cyber-800 px-3.5 py-2 rounded-xl text-xs font-mono">
            <div className="text-slate-400 text-[10px]">GRID DISPATCH STATUS</div>
            <div className="font-bold text-emerald-400 flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              {metrics.microgridStatus}
            </div>
          </div>
          <div className="bg-cyber-950/80 border border-cyber-800 px-3.5 py-2 rounded-xl text-xs font-mono">
            <div className="text-slate-400 text-[10px]">FREQUENCY / VOLTAGE</div>
            <div className="font-bold text-cyan-300 mt-0.5">
              {metrics.gridFrequencyHz} Hz / {metrics.gridVoltageV} V
            </div>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
      </div>

      {/* 4 Mandatory Core KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Solar Generated */}
        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden border border-cyber-800 hover:border-emerald-500/40 transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Total Solar Generated
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <Sun className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white font-mono">
                {metrics.totalSolarGeneratedKwh}
              </span>
              <span className="text-sm font-semibold text-amber-400 font-mono">kWh</span>
            </div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-cyber-800/80 text-xs text-slate-400">
              <span>Instantaneous Rate</span>
              <span className="font-mono font-bold text-emerald-400">
                {metrics.instantaneousSolarKw} kW
              </span>
            </div>
          </div>
          <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl"></div>
        </div>

        {/* Card 2: Grid Load Demand */}
        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden border border-cyber-800 hover:border-cyan-500/40 transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Grid Load Demand
            </span>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white font-mono">
                {metrics.gridLoadDemandKw}
              </span>
              <span className="text-sm font-semibold text-cyan-400 font-mono">kW</span>
            </div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-cyber-800/80 text-xs text-slate-400">
              <span>Net Microgrid Export</span>
              <span className={`font-mono font-bold ${metrics.netGridExportKw >= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {metrics.netGridExportKw >= 0 ? `+${metrics.netGridExportKw} kW (Surplus)` : `${metrics.netGridExportKw} kW (Deficit)`}
              </span>
            </div>
          </div>
          <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl"></div>
        </div>

        {/* Card 3: Battery Capacity (%) */}
        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden border border-cyber-800 hover:border-emerald-500/40 transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Battery Capacity (BESS)
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <BatteryCharging className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white font-mono">
                {metrics.batteryCapacityPct}%
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                {metrics.batteryEnergyStoredKwh} kWh
              </span>
            </div>
            {/* Battery Level Progress Bar */}
            <div className="w-full bg-cyber-900 rounded-full h-2 mt-3 overflow-hidden border border-cyber-800">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500" 
                style={{ width: `${metrics.batteryCapacityPct}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-slate-400">
              <span>BESS Health</span>
              <span className="font-mono text-emerald-400 font-semibold">{metrics.batteryHealthPct}% (LiFePO4)</span>
            </div>
          </div>
          <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl"></div>
        </div>

        {/* Card 4: Carbon Avoided */}
        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden border border-cyber-800 hover:border-emerald-500/40 transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Carbon Avoided
            </span>
            <div className="w-10 h-10 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform">
              <Leaf className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white font-mono">
                {metrics.carbonAvoidedKg}
              </span>
              <span className="text-sm font-semibold text-teal-400 font-mono">kg CO₂</span>
            </div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-cyber-800/80 text-xs text-slate-400">
              <span>Grid Independence</span>
              <span className="font-mono font-bold text-teal-300">
                {metrics.gridIndependencePct}% Clean
              </span>
            </div>
          </div>
          <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-teal-500/10 rounded-full blur-2xl"></div>
        </div>
      </div>

      {/* Dynamic 24-Hour Telemetry Curves (Generation vs. Consumption) */}
      <div className="glass-panel p-6 rounded-2xl border border-cyber-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-bold text-white tracking-tight">
                24-Hour Microgrid Power Profile: Generation vs. Demand
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Real-time telemetry showing diurnal solar bell-curve generation compared with localized demand load and battery dispatch.
            </p>
          </div>

          {/* View Filter Buttons */}
          <div className="flex items-center p-1 rounded-xl bg-cyber-900 border border-cyber-800 text-xs font-mono">
            <button
              onClick={() => setActiveCurveView('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeCurveView === 'all' ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Channels
            </button>
            <button
              onClick={() => setActiveCurveView('generation')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeCurveView === 'generation' ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              Solar Gen
            </button>
            <button
              onClick={() => setActiveCurveView('demand')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeCurveView === 'demand' ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              Load Demand
            </button>
            <button
              onClick={() => setActiveCurveView('battery')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeCurveView === 'battery' ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              Battery SoC
            </button>
          </div>
        </div>

        {/* The Recharts Graph */}
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={hourlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSolar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorBattery" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} tickLine={false} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="top" 
                align="right" 
                wrapperStyle={{ paddingBottom: '12px', fontSize: '12px' }} 
              />
              
              {(activeCurveView === 'all' || activeCurveView === 'generation') && (
                <Area 
                  type="monotone" 
                  dataKey="solarGeneration" 
                  name="Solar Generation (kW)" 
                  stroke="#f59e0b" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#colorSolar)" 
                />
              )}
              
              {(activeCurveView === 'all' || activeCurveView === 'demand') && (
                <Area 
                  type="monotone" 
                  dataKey="gridDemand" 
                  name="Load Demand (kW)" 
                  stroke="#06b6d4" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#colorDemand)" 
                />
              )}

              {(activeCurveView === 'all' || activeCurveView === 'battery') && (
                <Line 
                  type="monotone" 
                  dataKey="batterySoc" 
                  name="Battery SoC (%)" 
                  stroke="#10b981" 
                  strokeWidth={2} 
                  strokeDasharray="4 4"
                  dot={false}
                />
              )}

              {activeCurveView === 'all' && (
                <Line 
                  type="monotone" 
                  dataKey="p2pVolume" 
                  name="P2P Energy Traded (kWh)" 
                  stroke="#a855f7" 
                  strokeWidth={2} 
                  dot={false}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Telemetry Legend & Insight footer */}
        <div className="mt-4 pt-4 border-t border-cyber-800 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="w-3 h-3 rounded-full bg-amber-500"></span>
            <span>Peak Solar Generation: <strong>7.8 kW at 12:30 PM</strong></span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <span className="w-3 h-3 rounded-full bg-cyan-500"></span>
            <span>Peak Load Spike: <strong>6.7 kW at 19:30 PM (Evening)</strong></span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <span className="w-3 h-3 rounded-full bg-purple-500"></span>
            <span>Surplus Energy Traded: <strong>38.4 kWh within Community</strong></span>
          </div>
        </div>
      </div>

      {/* Microgrid Connected Nodes Status Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Community Microgrid Nodes (5 Connected)
            </h2>
          </div>
          <button 
            onClick={() => onSwitchTab('topology')}
            className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-mono hover:underline"
          >
            Open Topology Graph <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {nodes.map((node) => (
            <div 
              key={node.id} 
              className="glass-panel p-4 rounded-xl border border-cyber-800 hover:border-emerald-500/30 transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-white text-sm">{node.name}</h3>
                  <span className="text-[11px] font-mono text-slate-400">{node.role}</span>
                </div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                  node.status === 'Producing' ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' :
                  node.status === 'Optimal' ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' :
                  'bg-amber-500/15 text-amber-300 border-amber-500/30'
                }`}>
                  {node.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-cyber-800 text-center text-xs font-mono">
                <div>
                  <div className="text-[10px] text-slate-400">PV YIELD</div>
                  <div className="font-bold text-amber-400 mt-0.5">{node.outputKw} kW</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">DEMAND</div>
                  <div className="font-bold text-cyan-400 mt-0.5">{node.demandKw} kW</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">BATTERY</div>
                  <div className="font-bold text-emerald-400 mt-0.5">{node.batteryPct}%</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
