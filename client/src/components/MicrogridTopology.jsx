import React, { useState } from 'react';
import { 
  Network, 
  Zap, 
  BatteryCharging, 
  Home, 
  Building2, 
  Car, 
  Radio, 
  Activity, 
  CheckCircle2,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

export default function MicrogridTopology({ nodes = [] }) {
  const [selectedNodeId, setSelectedNodeId] = useState('node_1');

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-cyber-900 via-cyber-850 to-cyan-950/40 p-6 rounded-2xl border border-cyber-800">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-cyan-400"></span>
            <span className="text-xs uppercase font-mono tracking-widest text-cyan-400 font-semibold flex items-center gap-1.5">
              <Network className="w-3.5 h-3.5" /> Cyber-Physical Microgrid Bus
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Microgrid Network Topology & Energy Dispatch Map
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl mt-1">
            Visual telemetry map illustrating active power distribution, bidirectional peer-to-peer conduits, and battery storage balancing across community subgrids.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-cyber-950/80 border border-cyber-800 px-3.5 py-2 rounded-xl text-xs font-mono">
            <div className="text-slate-400 text-[10px]">TRANSMISSION LOSS</div>
            <div className="font-bold text-emerald-400 mt-0.5">
              &lt; 0.8% (Local DC-Coupled)
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Diagram & Telemetry Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SVG Interactive Topology Diagram (8 cols) */}
        <div className="lg:col-span-8 glass-panel p-6 rounded-2xl border border-cyber-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              Active Dispatch Grid (Real-Time Energy Routing)
            </h3>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
              Interactive Nodes (Click to inspect)
            </span>
          </div>

          {/* SVG Canvas */}
          <div className="relative w-full aspect-[16/10] bg-cyber-950/80 rounded-xl border border-cyber-800 overflow-hidden flex items-center justify-center p-4">
            <svg viewBox="0 0 800 500" className="w-full h-full">
              <defs>
                {/* Flow Line Gradients & Markers */}
                <linearGradient id="flowGreen" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
                <linearGradient id="flowAmber" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>

              {/* Central Microgrid Ring Bus */}
              <circle
                cx="400"
                cy="250"
                r="160"
                fill="none"
                stroke="#1e293b"
                strokeWidth="4"
                strokeDasharray="6 6"
              />
              <circle
                cx="400"
                cy="250"
                r="160"
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
                strokeDasharray="12 12"
                className="animate-spin"
                style={{ transformOrigin: '400px 250px', animationDuration: '30s' }}
              />

              {/* Connecting Conduits from Central Inverter to Peripheral Nodes */}
              {/* Center to Node Alpha (Top Left) */}
              <line x1="400" y1="250" x2="200" y2="130" stroke="#10b981" strokeWidth="2.5" strokeDasharray="4 4" />
              {/* Center to Node Beta (Top Right) */}
              <line x1="400" y1="250" x2="600" y2="130" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="4 4" />
              {/* Center to Node Delta (Bottom Left - EV) */}
              <line x1="400" y1="250" x2="200" y2="370" stroke="#06b6d4" strokeWidth="2.5" strokeDasharray="4 4" />
              {/* Center to Node Epsilon (Bottom Right) */}
              <line x1="400" y1="250" x2="600" y2="370" stroke="#10b981" strokeWidth="2.5" strokeDasharray="4 4" />

              {/* CENTER HUB: Node Gamma (EcoSubstation) */}
              <g 
                onClick={() => setSelectedNodeId('node_3')} 
                className="cursor-pointer transition-transform hover:scale-105"
                style={{ transformOrigin: '400px 250px' }}
              >
                <circle cx="400" cy="250" r="48" fill="#0f172a" stroke={selectedNodeId === 'node_3' ? '#38bdf8' : '#334155'} strokeWidth="3" />
                <circle cx="400" cy="250" r="38" fill="#080d1a" stroke="#10b981" strokeWidth="1.5" />
                <text x="400" y="244" textAnchor="middle" fill="#38bdf8" fontSize="13" fontWeight="bold" fontFamily="monospace">SUBSTATION</text>
                <text x="400" y="262" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="monospace">Central Inverter</text>
              </g>

              {/* NODE ALPHA: GreenRoof Villa (Top Left) */}
              <g 
                onClick={() => setSelectedNodeId('node_1')} 
                className="cursor-pointer transition-transform hover:scale-105"
                style={{ transformOrigin: '200px 130px' }}
              >
                <circle cx="200" cy="130" r="44" fill="#0f172a" stroke={selectedNodeId === 'node_1' ? '#10b981' : '#1e293b'} strokeWidth="3" />
                <circle cx="200" cy="130" r="34" fill="#064e3b" fillOpacity="0.4" />
                <text x="200" y="125" textAnchor="middle" fill="#34d399" fontSize="12" fontWeight="bold" fontFamily="monospace">NODE ALPHA</text>
                <text x="200" y="142" textAnchor="middle" fill="#f59e0b" fontSize="10" fontFamily="monospace">+6.2 kW (PV)</text>
              </g>

              {/* NODE BETA: Commercial Park (Top Right) */}
              <g 
                onClick={() => setSelectedNodeId('node_2')} 
                className="cursor-pointer transition-transform hover:scale-105"
                style={{ transformOrigin: '600px 130px' }}
              >
                <circle cx="600" cy="130" r="44" fill="#0f172a" stroke={selectedNodeId === 'node_2' ? '#10b981' : '#1e293b'} strokeWidth="3" />
                <circle cx="600" cy="130" r="34" fill="#78350f" fillOpacity="0.3" />
                <text x="600" y="125" textAnchor="middle" fill="#fbbf24" fontSize="12" fontWeight="bold" fontFamily="monospace">NODE BETA</text>
                <text x="600" y="142" textAnchor="middle" fill="#f59e0b" fontSize="10" fontFamily="monospace">+22.4 kW (Farm)</text>
              </g>

              {/* NODE DELTA: Metro EV Hub (Bottom Left) */}
              <g 
                onClick={() => setSelectedNodeId('node_4')} 
                className="cursor-pointer transition-transform hover:scale-105"
                style={{ transformOrigin: '200px 370px' }}
              >
                <circle cx="200" cy="370" r="44" fill="#0f172a" stroke={selectedNodeId === 'node_4' ? '#06b6d4' : '#1e293b'} strokeWidth="3" />
                <circle cx="200" cy="370" r="34" fill="#164e63" fillOpacity="0.4" />
                <text x="200" y="365" textAnchor="middle" fill="#22d3ee" fontSize="12" fontWeight="bold" fontFamily="monospace">NODE DELTA</text>
                <text x="200" y="382" textAnchor="middle" fill="#f87171" fontSize="10" fontFamily="monospace">-18.2 kW (EV)</text>
              </g>

              {/* NODE EPSILON: Horizon Tower (Bottom Right) */}
              <g 
                onClick={() => setSelectedNodeId('node_5')} 
                className="cursor-pointer transition-transform hover:scale-105"
                style={{ transformOrigin: '600px 370px' }}
              >
                <circle cx="600" cy="370" r="44" fill="#0f172a" stroke={selectedNodeId === 'node_5' ? '#10b981' : '#1e293b'} strokeWidth="3" />
                <circle cx="600" cy="370" r="34" fill="#064e3b" fillOpacity="0.4" />
                <text x="600" y="365" textAnchor="middle" fill="#34d399" fontSize="12" fontWeight="bold" fontFamily="monospace">NODE EPSILON</text>
                <text x="600" y="382" textAnchor="middle" fill="#38bdf8" fontSize="10" fontFamily="monospace">+11.8 kW (Res)</text>
              </g>
            </svg>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 font-mono pt-2">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> Active P2P Green Flow
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Solar Generation Injection
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span> BESS Fast Storage Conduit
            </span>
          </div>
        </div>

        {/* Selected Node Details Panel (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-cyber-800 space-y-5">
            <div className="border-b border-cyber-800 pb-3">
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
                Telemetry Inspector
              </span>
              <h3 className="text-lg font-bold text-white tracking-tight mt-0.5">
                {selectedNode.name}
              </h3>
              <span className="text-xs font-mono text-slate-400">{selectedNode.role}</span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between p-3 rounded-xl bg-cyber-950 border border-cyber-800">
                <span className="text-slate-400">Current Power Output:</span>
                <span className="font-bold text-amber-400">{selectedNode.outputKw} kW</span>
              </div>

              <div className="flex justify-between p-3 rounded-xl bg-cyber-950 border border-cyber-800">
                <span className="text-slate-400">Load Demand:</span>
                <span className="font-bold text-cyan-400">{selectedNode.demandKw} kW</span>
              </div>

              <div className="flex justify-between p-3 rounded-xl bg-cyber-950 border border-cyber-800">
                <span className="text-slate-400">Battery SoC:</span>
                <span className="font-bold text-emerald-400">{selectedNode.batteryPct}%</span>
              </div>

              <div className="flex justify-between p-3 rounded-xl bg-cyber-950 border border-cyber-800">
                <span className="text-slate-400">Operating Mode:</span>
                <span className="font-bold text-white">{selectedNode.status}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-200 space-y-1">
              <div className="font-bold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>Microgrid Islanding Ready</span>
              </div>
              <p className="text-[11px] text-slate-300">
                This node is configured with fast-acting solid-state disconnect relays for sub-15ms autonomous islanding in case of utility grid blackout.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
