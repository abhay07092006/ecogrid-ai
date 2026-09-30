import React from 'react';
import { 
  Zap, 
  Activity, 
  Sun, 
  ArrowLeftRight, 
  Leaf, 
  Cpu, 
  Network, 
  Wallet, 
  PlusCircle, 
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  wallet, 
  onOpenWallet, 
  currency, 
  setCurrency,
  liveMode,
  setLiveMode 
}) {
  const navItems = [
    { id: 'telemetry', label: 'Real-Time Telemetry', icon: Activity, badge: 'Live' },
    { id: 'forecaster', label: 'AI Solar Forecaster', icon: Sun, badge: 'Predict' },
    { id: 'marketplace', label: 'P2P Energy Market', icon: ArrowLeftRight, badge: 'Trading' },
    { id: 'calculator', label: 'Carbon & Savings', icon: Leaf, badge: 'Impact' },
    { id: 'topology', label: 'Grid Topology', icon: Network, badge: 'Nodes' },
    { id: 'autopilot', label: 'Smart Auto-Pilot', icon: Cpu, badge: 'AI Bot' }
  ];

  const formatCurrency = (amountInr) => {
    if (currency === 'USD') {
      return `$${(amountInr / 84).toFixed(2)}`;
    }
    return `₹${amountInr.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-cyber-800 bg-cyber-950/85 backdrop-blur-xl">
      {/* Top Banner for SIH & Microgrid Health */}
      <div className="bg-gradient-to-r from-emerald-950/70 via-cyber-900 to-cyber-950 px-4 py-1.5 border-b border-eco-500/20 text-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            SIH Problem: SIH26200
          </span>
          <span className="text-slate-400 hidden sm:inline">
            Smart Microgrid & Decentralized Renewable Energy Management System
          </span>
        </div>
        <div className="flex items-center gap-4 text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${liveMode ? 'bg-emerald-400' : 'bg-slate-400'} opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${liveMode ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
            </span>
            <span className="text-[11px] font-mono text-emerald-400">Microgrid Stable (50.02 Hz)</span>
          </div>
          <button 
            onClick={() => setLiveMode(!liveMode)}
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
              liveMode ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
            }`}
            title="Toggle simulated live telemetry stream"
          >
            <RefreshCw className={`w-3 h-3 ${liveMode ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
            {liveMode ? 'LIVE TICK' : 'PAUSED'}
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('telemetry')}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 via-emerald-600 to-teal-800 shadow-lg shadow-emerald-500/20">
              <Zap className="w-5 h-5 text-cyber-950 fill-cyber-950" />
              <div className="absolute -inset-0.5 rounded-xl bg-emerald-500/30 blur-sm -z-10"></div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-white">
                  EcoGrid <span className="text-emerald-400">AI</span>
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300">
                  v2.4
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono tracking-tight -mt-0.5">
                P2P Clean Energy Protocol
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm shadow-emerald-950'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Widgets */}
          <div className="flex items-center gap-3">
            {/* Currency Selector */}
            <div className="flex items-center rounded-lg bg-cyber-900 border border-cyber-800 p-0.5 text-xs font-semibold">
              <button
                onClick={() => setCurrency('INR')}
                className={`px-2 py-1 rounded ${currency === 'INR' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                ₹ INR
              </button>
              <button
                onClick={() => setCurrency('USD')}
                className={`px-2 py-1 rounded ${currency === 'USD' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                $ USD
              </button>
            </div>

            {/* Wallet Button */}
            <button
              onClick={onOpenWallet}
              className="group flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-cyber-900 hover:bg-cyber-850 border border-emerald-500/30 hover:border-emerald-400 transition-all text-left shadow-sm"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-400 group-hover:scale-105 transition-transform">
                <Wallet className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                  Balance
                </div>
                <div className="text-sm font-bold text-white font-mono flex items-center gap-1">
                  {formatCurrency(wallet.balanceInr)}
                  <PlusCircle className="w-3 h-3 text-emerald-400 opacity-60 group-hover:opacity-100" />
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Submenu Bar */}
        <div className="lg:hidden flex items-center overflow-x-auto py-2 space-x-1 no-scrollbar border-t border-cyber-800/60">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-900/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
