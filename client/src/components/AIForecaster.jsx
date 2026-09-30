import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sun, 
  CloudSun, 
  Thermometer, 
  Clock, 
  Sparkles, 
  Zap, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Sliders, 
  Cpu, 
  Layers,
  ArrowRight,
  RefreshCw,
  Info
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
  Line 
} from 'recharts';

export default function AIForecaster({ onSwitchToMarketplace }) {
  // Weather & System Parameter States
  const [temperature, setTemperature] = useState(30.0); // °C
  const [sunHours, setSunHours] = useState(7.5); // Peak hours
  const [cloudCover, setCloudCover] = useState(20); // %
  const [capacity, setCapacity] = useState(10.0); // kWp
  const [efficiencyLossCoeff, setEfficiencyLossCoeff] = useState(0.4); // % per °C above 25
  const [activePreset, setActivePreset] = useState('clear');

  // Weather presets for fast one-click simulation testing
  const presets = [
    { id: 'clear', label: '☀️ Clear Summer Day', temp: 32, hours: 8.5, cloud: 10, capacity: 10.0 },
    { id: 'partly', label: '⛅ Partly Cloudy', temp: 28, hours: 6.0, cloud: 45, capacity: 10.0 },
    { id: 'overcast', label: '🌧️ Heavy Overcast', temp: 24, hours: 3.5, cloud: 85, capacity: 10.0 },
    { id: 'heatwave', label: '🔥 Extreme Heatwave', temp: 43, hours: 9.0, cloud: 0, capacity: 10.0 }
  ];

  const applyPreset = (preset) => {
    setActivePreset(preset.id);
    setTemperature(preset.temp);
    setSunHours(preset.hours);
    setCloudCover(preset.cloud);
    setCapacity(preset.capacity);
  };

  // Mathematical Energy Production Formula Calculation
  // E = P_cap * H_sun * (1 - gamma * deltaT) * (1 - cloud_factor) * derate
  const calculation = useMemo(() => {
    const tempDelta = Math.max(0, temperature - 25);
    const tempLoss = (tempDelta * (efficiencyLossCoeff / 100)); // fraction
    const cloudTransmission = 1 - (cloudCover / 100) * 0.72; // cloud derating
    const systemDerate = 0.86; // Inverter, wiring, dust
    const netDerate = (1 - tempLoss) * cloudTransmission * systemDerate;

    const dailyYieldKwh = Number((capacity * sunHours * netDerate).toFixed(2));
    const peakPowerKw = Number((capacity * (1 - tempLoss) * cloudTransmission * 0.95).toFixed(2));
    const carbonOffsetKg = Number((dailyYieldKwh * 0.82).toFixed(1));
    const revenueInr = Number((dailyYieldKwh * 4.25).toFixed(2));

    // Generate 24h curve
    const hourlyData = [];
    let peakHour = 12;
    let maxHourKw = 0;

    for (let h = 0; h < 24; h++) {
      let kw = 0;
      if (h >= 6 && h <= 18) {
        const peak = 12.5;
        const sigma = 2.6;
        const irradiance = Math.exp(-Math.pow(h - peak, 2) / (2 * Math.pow(sigma, 2)));
        kw = Number((peakPowerKw * irradiance).toFixed(2));
        if (kw > maxHourKw) {
          maxHourKw = kw;
          peakHour = h;
        }
      }

      hourlyData.push({
        hour: `${h.toString().padStart(2, '0')}:00`,
        predictedKw: kw,
        ambientTemp: Math.round(temperature - 6 + Math.sin((h - 8) / 4) * 8),
        confidence: Math.round(94 - (cloudCover * 0.2))
      });
    }

    return {
      dailyYieldKwh,
      peakPowerKw,
      tempLossPct: Number((tempLoss * 100).toFixed(1)),
      cloudLossPct: Number(((1 - cloudTransmission) * 100).toFixed(1)),
      netEfficiencyPct: Number((netDerate * 100).toFixed(1)),
      carbonOffsetKg,
      revenueInr,
      peakHour: `${peakHour}:00 - ${peakHour + 1}:00`,
      hourlyData
    };
  }, [temperature, sunHours, cloudCover, capacity, efficiencyLossCoeff]);

  // AI-Driven Recommendations
  const aiInsights = useMemo(() => {
    const list = [];
    if (cloudCover >= 60) {
      list.push({
        type: 'warning',
        title: 'High Cloud Density Impact',
        desc: `Cloud density of ${cloudCover}% attenuates solar irradiance by ${calculation.cloudLossPct}%. Recommend shifting scheduled high-drain loads (EV charging, water pumping) to off-peak grid hours.`
      });
    } else {
      list.push({
        type: 'opportunity',
        title: 'Peak Solar Export Window',
        desc: `High solar irradiance expected between 10:30 AM and 03:00 PM. Forecast projects ${calculation.dailyYieldKwh} kWh total yield. Recommend listing 15-20 kWh surplus on P2P market for max profit.`
      });
    }

    if (temperature >= 38) {
      list.push({
        type: 'warning',
        title: 'Thermal Derating Alert',
        desc: `High cell temperature (${temperature}°C) induces ${calculation.tempLossPct}% silicon efficiency degradation. Panel back-cooling or hybrid micro-hydro cooling recommended.`
      });
    }

    list.push({
      type: 'info',
      title: 'BESS Microgrid Fast-Charge Window',
      desc: `Optimal battery storage absorption window starts at 11:00 AM when predicted power crosses ${(calculation.peakPowerKw * 0.6).toFixed(1)} kW.`
    });

    return list;
  }, [cloudCover, temperature, calculation]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-cyber-900 via-cyber-850 to-amber-950/30 p-6 rounded-2xl border border-cyber-800">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-amber-400"></span>
            <span className="text-xs uppercase font-mono tracking-widest text-amber-400 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> AI Predictive Microgrid Forecasting Engine
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Solar Generation & Yield Forecaster
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl mt-1">
            Simulate real-time meteorological variables to forecast 24-hour photovoltaic yield using empirical irradiance degradation physics and AI dispatch heuristics.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2">
          {presets.map((p) => (
            <button
              key={p.id}
              onClick={() => applyPreset(p)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                activePreset === p.id 
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm' 
                  : 'bg-cyber-900 text-slate-400 border border-cyber-800 hover:text-white'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Controls & Math Formula Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Sliders & Variables (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-cyber-800 space-y-5">
            <div className="flex items-center justify-between border-b border-cyber-800 pb-3">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Sliders className="w-4 h-4 text-emerald-400" />
                <span>Simulated Weather & Array Controls</span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                Live Parameters
              </span>
            </div>

            {/* Slider 1: Ambient Temperature */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Thermometer className="w-3.5 h-3.5 text-red-400" />
                  Ambient Temperature:
                </span>
                <span className="font-bold text-red-400 bg-red-950/60 px-2 py-0.5 rounded border border-red-500/30">
                  {temperature.toFixed(1)} °C
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                step="0.5"
                value={temperature}
                onChange={(e) => {
                  setTemperature(parseFloat(e.target.value));
                  setActivePreset('custom');
                }}
                className="w-full h-1.5 bg-cyber-900 rounded-lg appearance-none cursor-pointer accent-red-400"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>10°C (Cold/High Eff)</span>
                <span>25°C (STC Nominal)</span>
                <span>50°C (Heatwave)</span>
              </div>
            </div>

            {/* Slider 2: Sunlight Peak Hours */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  Peak Sunlight Hours:
                </span>
                <span className="font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                  {sunHours.toFixed(1)} hrs/day
                </span>
              </div>
              <input
                type="range"
                min="2.0"
                max="10.0"
                step="0.1"
                value={sunHours}
                onChange={(e) => {
                  setSunHours(parseFloat(e.target.value));
                  setActivePreset('custom');
                }}
                className="w-full h-1.5 bg-cyber-900 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>2.0h (Winter/Monsoon)</span>
                <span>6.0h (Average)</span>
                <span>10.0h (Peak Summer)</span>
              </div>
            </div>

            {/* Slider 3: Cloud Cover Percentage */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <CloudSun className="w-3.5 h-3.5 text-cyan-400" />
                  Cloud Cover Density:
                </span>
                <span className="font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                  {cloudCover}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={cloudCover}
                onChange={(e) => {
                  setCloudCover(parseInt(e.target.value));
                  setActivePreset('custom');
                }}
                className="w-full h-1.5 bg-cyber-900 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>0% (Clear Sky)</span>
                <span>50% (Scattered)</span>
                <span>100% (Dense Cumulus)</span>
              </div>
            </div>

            {/* Slider 4: Installed Solar Capacity */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Zap className="w-3.5 h-3.5 text-emerald-400" />
                  Array Capacity (kWp):
                </span>
                <span className="font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  {capacity.toFixed(1)} kWp
                </span>
              </div>
              <input
                type="range"
                min="1.0"
                max="40.0"
                step="0.5"
                value={capacity}
                onChange={(e) => {
                  setCapacity(parseFloat(e.target.value));
                  setActivePreset('custom');
                }}
                className="w-full h-1.5 bg-cyber-900 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>1.0 kWp (Home)</span>
                <span>10.0 kWp (Villa/Bld)</span>
                <span>40.0 kWp (Commercial)</span>
              </div>
            </div>
          </div>

          {/* Mathematical Production Formula Display */}
          <div className="glass-panel p-5 rounded-2xl border border-cyber-800 bg-cyber-900/60 font-mono text-xs space-y-3">
            <div className="flex items-center gap-2 text-slate-300 font-semibold">
              <Info className="w-4 h-4 text-emerald-400" />
              <span>Energy Production Model Formula</span>
            </div>
            
            <div className="bg-cyber-950 p-3 rounded-xl border border-cyber-800 text-emerald-300 overflow-x-auto text-[11px] leading-relaxed">
              <code>
                E_yield = P_cap × H_sun × [1 - γ·(T - 25)] × [1 - 0.72·C] × η_sys
              </code>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
              <div>
                • Temp Derating (γ): <strong className="text-white">-{calculation.tempLossPct}%</strong>
              </div>
              <div>
                • Cloud Attenuation: <strong className="text-white">-{calculation.cloudLossPct}%</strong>
              </div>
              <div>
                • System Balance: <strong className="text-white">86% Efficiency</strong>
              </div>
              <div>
                • Net Derate Factor: <strong className="text-emerald-400 font-bold">{calculation.netEfficiencyPct}%</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Predicted Yield KPI Cards + Hourly Projection Chart (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Predicted KPI Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="glass-panel p-4 rounded-xl border border-amber-500/20 bg-amber-950/20">
              <div className="text-[10px] font-mono uppercase text-amber-400 font-semibold">Predicted Daily Yield</div>
              <div className="text-2xl font-bold text-white font-mono mt-1">
                {calculation.dailyYieldKwh} <span className="text-xs font-normal text-amber-300">kWh</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1">24-hour cumulative</div>
            </div>

            <div className="glass-panel p-4 rounded-xl border border-emerald-500/20 bg-emerald-950/20">
              <div className="text-[10px] font-mono uppercase text-emerald-400 font-semibold">Peak Power Output</div>
              <div className="text-2xl font-bold text-white font-mono mt-1">
                {calculation.peakPowerKw} <span className="text-xs font-normal text-emerald-300">kW</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1">At {calculation.peakHour}</div>
            </div>

            <div className="glass-panel p-4 rounded-xl border border-cyan-500/20 bg-cyan-950/20">
              <div className="text-[10px] font-mono uppercase text-cyan-400 font-semibold">Daily P2P Value</div>
              <div className="text-2xl font-bold text-white font-mono mt-1">
                ₹{calculation.revenueInr}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">@ ₹4.25/kWh benchmark</div>
            </div>

            <div className="glass-panel p-4 rounded-xl border border-teal-500/20 bg-teal-950/20">
              <div className="text-[10px] font-mono uppercase text-teal-400 font-semibold">CO₂ Offset Potential</div>
              <div className="text-2xl font-bold text-white font-mono mt-1">
                {calculation.carbonOffsetKg} <span className="text-xs font-normal text-teal-300">kg</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Avoided thermal burn</div>
            </div>
          </div>

          {/* 24-Hour Projected Generation Chart */}
          <div className="glass-panel p-5 rounded-2xl border border-cyber-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                  Predicted 24-Hour Solar Production Curve
                </h3>
                <p className="text-[11px] text-slate-400">
                  Solar output simulation modeled using diurnal sun azimuth & empirical weather derating.
                </p>
              </div>
              <span className="text-xs font-mono text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/20">
                Peak: {calculation.peakPowerKw} kW
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={calculation.hourlyData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="hour" stroke="#64748b" tick={{ fontSize: 10 }} tickLine={false} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 10 }} tickLine={false} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-cyber-900 border border-cyber-700 p-2.5 rounded-lg text-xs font-mono shadow-xl">
                            <div className="font-bold text-white mb-1">{label}</div>
                            <div className="text-amber-400">
                              Yield: <strong>{payload[0].value} kW</strong>
                            </div>
                            <div className="text-slate-400 text-[10px]">
                              Est. Cell Temp: {payload[0].payload.ambientTemp}°C
                            </div>
                            <div className="text-emerald-400 text-[10px]">
                              Forecast Confidence: {payload[0].payload.confidence}%
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="predictedKw"
                    name="Predicted Power (kW)"
                    stroke="#f59e0b"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorForecast)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Smart Grid Advisory & Insights */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase font-mono tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              AI Automated Microgrid Dispatch Advisories
            </h3>
            <div className="space-y-2.5">
              {aiInsights.map((insight, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border text-xs flex items-start gap-3 ${
                    insight.type === 'opportunity'
                      ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200'
                      : insight.type === 'warning'
                      ? 'bg-amber-950/40 border-amber-500/30 text-amber-200'
                      : 'bg-cyber-900/90 border-cyber-800 text-slate-300'
                  }`}
                >
                  <div className="mt-0.5">
                    {insight.type === 'opportunity' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : insight.type === 'warning' ? (
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                    ) : (
                      <Info className="w-4 h-4 text-cyan-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold mb-0.5 text-white">{insight.title}</div>
                    <div className="text-[11px] leading-relaxed opacity-90">{insight.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Direct CTA to Marketplace */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={onSwitchToMarketplace}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-cyber-950 font-bold text-xs transition-all shadow-lg shadow-emerald-900/30"
              >
                <span>Trade Forecasted Surplus on P2P Market</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
