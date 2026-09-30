import React, { useState, useMemo } from 'react';
import { 
  Leaf, 
  Coins, 
  DollarSign, 
  Trees, 
  Car, 
  Flame, 
  TrendingUp, 
  Calendar, 
  ShieldCheck, 
  Award,
  Sparkles,
  Plane,
  Calculator
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';

export default function CarbonCalculator({ currency, onSwitchToMarketplace }) {
  // Calculator Parameters
  const [monthlyKwh, setMonthlyKwh] = useState(450); // Monthly consumption
  const [gridTariff, setGridTariff] = useState(7.50); // ₹ / kWh (Discom utility rate)
  const [cleanTariff, setCleanTariff] = useState(4.20); // ₹ / kWh (EcoGrid P2P or Solar LCOE)
  const [systemSizeKw, setSystemSizeKw] = useState(4.0); // Installed PV Capacity kW

  const formatCurrency = (amt) => {
    if (currency === 'USD') return `$${(amt / 84).toFixed(2)}`;
    return `₹${amt.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Calculations
  const calculations = useMemo(() => {
    const monthlyCostGrid = monthlyKwh * gridTariff;
    const monthlyCostClean = monthlyKwh * cleanTariff;
    const monthlySavings = monthlyCostGrid - monthlyCostClean;
    const annualSavings = monthlySavings * 12;

    // Environmental calculations (based on CEA India grid emission factor: 0.82 kg CO2 / kWh)
    const monthlyCo2Kg = monthlyKwh * 0.82;
    const annualCo2Kg = monthlyCo2Kg * 12;
    const annualCo2Tons = Number((annualCo2Kg / 1000).toFixed(2));

    // Equivalencies
    const treesEquivalent = Math.round(annualCo2Kg / 21.8); // 1 tree ~ 21.8 kg CO2/year
    const coalAvoidedKg = Math.round(monthlyKwh * 12 * 0.83); // ~0.83 kg coal per kWh
    const evKmPowered = Math.round(monthlyKwh * 12 * 7.0); // 7 km / kWh
    const flightsOffset = Number((annualCo2Kg / 250).toFixed(1)); // ~250 kg CO2 per short-haul flight

    // Capital Cost & Payback Estimation (assuming ₹55,000 per kW solar system)
    const estimatedCapEx = systemSizeKw * 55000;
    const paybackYears = annualSavings > 0 ? Number((estimatedCapEx / annualSavings).toFixed(1)) : 0;

    // 10-Year Cumulative Cost Comparison Chart Data
    const tenYearData = [];
    let cumulativeGrid = 0;
    let cumulativeClean = 0;
    const inflationRate = 0.04; // 4% annual grid tariff inflation

    for (let yr = 1; yr <= 10; yr++) {
      const yearFactor = Math.pow(1 + inflationRate, yr - 1);
      const yearGridCost = annualSavings > 0 ? (monthlyCostGrid * 12 * yearFactor) : 0;
      const yearCleanCost = (monthlyCostClean * 12);
      
      cumulativeGrid += yearGridCost;
      cumulativeClean += yearCleanCost;

      tenYearData.push({
        year: `Yr ${yr}`,
        traditionalGrid: Math.round(cumulativeGrid),
        ecoGridClean: Math.round(cumulativeClean + (yr === 1 ? estimatedCapEx : 0)),
        savingsCumulative: Math.round(cumulativeGrid - cumulativeClean)
      });
    }

    return {
      monthlySavings,
      annualSavings,
      annualCo2Kg,
      annualCo2Tons,
      treesEquivalent,
      coalAvoidedKg,
      evKmPowered,
      flightsOffset,
      paybackYears,
      estimatedCapEx,
      tenYearData
    };
  }, [monthlyKwh, gridTariff, cleanTariff, systemSizeKw]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-cyber-900 via-cyber-850 to-teal-950/40 p-6 rounded-2xl border border-cyber-800">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-teal-400"></span>
            <span className="text-xs uppercase font-mono tracking-widest text-teal-400 font-semibold flex items-center gap-1.5">
              <Leaf className="w-3.5 h-3.5" /> ESG & Clean Energy Impact Modeling
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Carbon Footprint & Financial Savings Calculator
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl mt-1">
            Quantify direct monetary savings, levelized cost of energy (LCOE), and verified decarbonization metrics achieved by shifting to EcoGrid community solar.
          </p>
        </div>

        <div className="bg-cyber-950/80 border border-teal-500/30 px-4 py-3 rounded-2xl">
          <div className="text-[10px] font-mono uppercase text-teal-400">Carbon Abatement Rate</div>
          <div className="text-xl font-bold font-mono text-white mt-0.5">
            0.82 kg CO₂ <span className="text-xs font-normal text-slate-400">/ kWh clean energy</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Controls + Impact Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Sliders (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-cyber-800 space-y-6">
            <div className="flex items-center justify-between border-b border-cyber-800 pb-3">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Calculator className="w-4 h-4 text-teal-400" />
                <span>Adjust Consumption & Tariff Parameters</span>
              </div>
              <span className="text-[10px] font-mono text-teal-400 bg-teal-950 px-2 py-0.5 rounded border border-teal-500/30">
                Custom Model
              </span>
            </div>

            {/* Slider 1: Monthly Consumption */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300 font-semibold">Monthly Solar Usage:</span>
                <span className="font-bold text-teal-400 bg-teal-950/60 px-2 py-0.5 rounded border border-teal-500/30">
                  {monthlyKwh} kWh/mo
                </span>
              </div>
              <input
                type="range"
                min="100"
                max="2500"
                step="25"
                value={monthlyKwh}
                onChange={(e) => setMonthlyKwh(parseInt(e.target.value))}
                className="w-full h-1.5 bg-cyber-900 rounded-lg appearance-none cursor-pointer accent-teal-400"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>100 kWh (Studio)</span>
                <span>450 kWh (3BHK Flat)</span>
                <span>2,500 kWh (Commercial)</span>
              </div>
            </div>

            {/* Slider 2: Utility Discom Grid Tariff */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300 font-semibold">State Discom Grid Tariff:</span>
                <span className="font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                  ₹{gridTariff.toFixed(2)} / kWh
                </span>
              </div>
              <input
                type="range"
                min="5.0"
                max="12.0"
                step="0.25"
                value={gridTariff}
                onChange={(e) => setGridTariff(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-cyber-900 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>₹5.00/kWh</span>
                <span>₹7.50/kWh (Tier-2 avg)</span>
                <span>₹12.00/kWh (Peak)</span>
              </div>
            </div>

            {/* Slider 3: EcoGrid P2P Rate */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300 font-semibold">EcoGrid P2P Solar Rate:</span>
                <span className="font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  ₹{cleanTariff.toFixed(2)} / kWh
                </span>
              </div>
              <input
                type="range"
                min="2.50"
                max="6.50"
                step="0.10"
                value={cleanTariff}
                onChange={(e) => setCleanTariff(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-cyber-900 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>₹2.50 (Base PV)</span>
                <span>₹4.20 (Microgrid avg)</span>
                <span>₹6.50 (Storage Dispatched)</span>
              </div>
            </div>

            {/* Slider 4: Solar Rooftop System Size */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300 font-semibold">Rooftop Solar Size (if installed):</span>
                <span className="font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                  {systemSizeKw.toFixed(1)} kW
                </span>
              </div>
              <input
                type="range"
                min="1.0"
                max="25.0"
                step="0.5"
                value={systemSizeKw}
                onChange={(e) => setSystemSizeKw(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-cyber-900 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>1 kW (~₹55k)</span>
                <span>4 kW (~₹2.2L)</span>
                <span>25 kW (~₹13.7L)</span>
              </div>
            </div>
          </div>

          {/* Quick Payback & ROI Card */}
          <div className="glass-panel p-5 rounded-2xl border border-cyber-800 bg-cyber-900/60 space-y-3 font-mono text-xs">
            <div className="text-slate-300 font-bold flex items-center justify-between">
              <span>Financial Return on Investment (ROI)</span>
              <span className="text-emerald-400 text-[10px] bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                Payback Estimate
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-cyber-950 border border-cyber-800">
                <div className="text-[10px] text-slate-400">ESTIMATED CAPITAL COST</div>
                <div className="text-lg font-bold text-white mt-1">
                  {formatCurrency(calculations.estimatedCapEx)}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-cyber-950 border border-cyber-800">
                <div className="text-[10px] text-slate-400">BREAK-EVEN HORIZON</div>
                <div className="text-lg font-bold text-emerald-400 mt-1">
                  {calculations.paybackYears} Years
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 font-sans">
              *After break-even, all solar generation delivers near 100% free electricity for the remaining 20+ years of panel life.
            </p>
          </div>
        </div>

        {/* Right Column: High Impact Environmental Metrics & 10-Year Cost Chart (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Top 2 Primary Savings Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="glass-panel p-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-emerald-400 font-semibold">
                  Monthly Direct Savings
                </span>
                <Coins className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-3xl font-extrabold text-white font-mono mt-3">
                {formatCurrency(calculations.monthlySavings)}
              </div>
              <div className="text-xs text-emerald-300/80 mt-1 font-mono">
                {Math.round(((gridTariff - cleanTariff) / gridTariff) * 100)}% cheaper than state utility
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-teal-500/30 bg-teal-950/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-teal-400 font-semibold">
                  Annual Cumulative Savings
                </span>
                <TrendingUp className="w-5 h-5 text-teal-400" />
              </div>
              <div className="text-3xl font-extrabold text-white font-mono mt-3">
                {formatCurrency(calculations.annualSavings)}
              </div>
              <div className="text-xs text-teal-300/80 mt-1 font-mono">
                Annual energy expense reduction
              </div>
            </div>
          </div>

          {/* 4 Environmental Equivalence Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="glass-panel p-4 rounded-xl border border-cyber-800 text-center space-y-1">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 mx-auto flex items-center justify-center text-emerald-400 mb-2">
                <Trees className="w-4 h-4" />
              </div>
              <div className="text-2xl font-extrabold text-white font-mono">
                {calculations.treesEquivalent}
              </div>
              <div className="text-[10px] text-slate-400 uppercase font-mono">Trees Planted Eq.</div>
            </div>

            <div className="glass-panel p-4 rounded-xl border border-cyber-800 text-center space-y-1">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 mx-auto flex items-center justify-center text-amber-400 mb-2">
                <Flame className="w-4 h-4" />
              </div>
              <div className="text-2xl font-extrabold text-white font-mono">
                {calculations.coalAvoidedKg} <span className="text-xs text-slate-400">kg</span>
              </div>
              <div className="text-[10px] text-slate-400 uppercase font-mono">Coal Combustion Cut</div>
            </div>

            <div className="glass-panel p-4 rounded-xl border border-cyber-800 text-center space-y-1">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 mx-auto flex items-center justify-center text-cyan-400 mb-2">
                <Car className="w-4 h-4" />
              </div>
              <div className="text-2xl font-extrabold text-white font-mono">
                {calculations.evKmPowered} <span className="text-xs text-slate-400">km</span>
              </div>
              <div className="text-[10px] text-slate-400 uppercase font-mono">EV Kilometers Powered</div>
            </div>

            <div className="glass-panel p-4 rounded-xl border border-cyber-800 text-center space-y-1">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 mx-auto flex items-center justify-center text-purple-400 mb-2">
                <Plane className="w-4 h-4" />
              </div>
              <div className="text-2xl font-extrabold text-white font-mono">
                {calculations.flightsOffset}
              </div>
              <div className="text-[10px] text-slate-400 uppercase font-mono">Flights Offset Eq.</div>
            </div>
          </div>

          {/* 10-Year Cumulative Cost Comparison Chart */}
          <div className="glass-panel p-5 rounded-2xl border border-cyber-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  10-Year Cumulative Expenditure: Coal Utility vs. EcoGrid AI
                </h3>
                <p className="text-[11px] text-slate-400">
                  Projecting savings over a decade factoring 4% annual fossil utility tariff inflation.
                </p>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={calculations.tenYearData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 10 }} tickLine={false} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 10 }} tickLine={false} tickFormatter={(val) => `₹${(val/1000).toFixed(0)}k`} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-cyber-900 border border-cyber-700 p-2.5 rounded-lg text-xs font-mono shadow-xl space-y-1">
                            <div className="font-bold text-white">{label}</div>
                            <div className="text-slate-400">
                              Discom Coal Grid: <strong className="text-red-400">₹{payload[0].value.toLocaleString()}</strong>
                            </div>
                            <div className="text-slate-400">
                              EcoGrid Community: <strong className="text-emerald-400">₹{payload[1].value.toLocaleString()}</strong>
                            </div>
                            <div className="text-emerald-400 font-bold border-t border-cyber-800 pt-1">
                              Net Saved: ₹{(payload[0].value - payload[1].value).toLocaleString()}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Bar dataKey="traditionalGrid" name="Traditional Coal Utility (Inflating)" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="ecoGridClean" name="EcoGrid Renewable Microgrid" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
