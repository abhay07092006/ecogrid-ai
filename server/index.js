import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-Memory State for Demonstration & Hackathon Evaluation
let userWallet = {
  id: 'usr_001',
  name: 'Rahul Sharma',
  nodeId: 'NODE-ALPHA-01',
  balanceInr: 2850.50,
  cleanTokens: 145.0,
  totalBoughtKwh: 48.5,
  totalSoldKwh: 126.0,
  co2SavedKg: 98.4
};

let activeOffers = [
  {
    id: 'off_01',
    sellerId: 'usr_greenroof',
    sellerName: 'GreenRoof Villa',
    sellerAvatar: '🏡',
    sellerRating: 4.9,
    node: 'Node Alpha (Residential)',
    availableKwh: 18.5,
    minKwh: 2.0,
    pricePerKwh: 4.20,
    discomPrice: 7.50,
    source: 'Rooftop Monocrystalline PV',
    batteryBacked: true,
    expiresIn: '2h 45m',
    verified: true
  },
  {
    id: 'off_02',
    sellerId: 'usr_sunpower',
    sellerName: 'SunPower Bio-Park',
    sellerAvatar: '🏢',
    sellerRating: 4.8,
    node: 'Node Beta (Commercial)',
    availableKwh: 52.0,
    minKwh: 10.0,
    pricePerKwh: 3.90,
    discomPrice: 7.50,
    source: 'Commercial Bifacial Array',
    batteryBacked: true,
    expiresIn: '4h 10m',
    verified: true
  },
  {
    id: 'off_03',
    sellerId: 'usr_drmehta',
    sellerName: 'Dr. Mehta Net-Zero Home',
    sellerAvatar: '⚡',
    sellerRating: 5.0,
    node: 'Node Gamma (Sub-grid 4)',
    availableKwh: 12.0,
    minKwh: 1.0,
    pricePerKwh: 4.40,
    discomPrice: 7.50,
    source: 'Smart Hybrid Solar + LFP Storage',
    batteryBacked: true,
    expiresIn: '1h 15m',
    verified: true
  },
  {
    id: 'off_04',
    sellerId: 'usr_microbess',
    sellerName: 'Silicon Park Micro-BESS',
    sellerAvatar: '🔋',
    sellerRating: 4.9,
    node: 'Node Delta (Storage Hub)',
    availableKwh: 35.0,
    minKwh: 5.0,
    pricePerKwh: 4.60,
    discomPrice: 7.50,
    source: 'Utility Micro-BESS Stored Solar',
    batteryBacked: true,
    expiresIn: '5h 30m',
    verified: true
  },
  {
    id: 'off_05',
    sellerId: 'usr_agrivoltaic',
    sellerName: 'Kisan Eco Agro-Voltaics',
    sellerAvatar: '🌾',
    sellerRating: 4.7,
    node: 'Node Epsilon (Rural Feeder)',
    availableKwh: 65.0,
    minKwh: 5.0,
    pricePerKwh: 3.75,
    discomPrice: 7.50,
    source: 'Agrivoltaic Solar Farm',
    batteryBacked: false,
    expiresIn: '3h 50m',
    verified: true
  }
];

let transactionLedger = [
  {
    id: 'TXN-984210',
    txHash: '0x8f4c3a91b8d2345e6702cfa98b31a2d103b41e8c',
    timestamp: '14:28:12 IST',
    date: '2026-09-30',
    buyer: 'Rahul Sharma (You)',
    seller: 'GreenRoof Villa',
    kwh: 12.0,
    unitPrice: 4.20,
    totalInr: 50.40,
    discomSavingsInr: 39.60,
    co2AvoidedKg: 9.84,
    status: 'Confirmed (Settled on Microgrid)',
    block: 104821
  },
  {
    id: 'TXN-984192',
    txHash: '0x4e21a8f902dc45b1287349ac81e05d923bb6f189',
    timestamp: '12:15:40 IST',
    date: '2026-09-30',
    buyer: 'Metro EV Fast Hub',
    seller: 'Rahul Sharma (You)',
    kwh: 20.0,
    unitPrice: 4.80,
    totalInr: 96.00,
    discomSavingsInr: 54.00,
    co2AvoidedKg: 16.40,
    status: 'Confirmed (Settled on Microgrid)',
    block: 104815
  },
  {
    id: 'TXN-984055',
    txHash: '0x17c9b0e2f54a8d93c40172e81a3d9024f92d47ea',
    timestamp: '09:40:02 IST',
    date: '2026-09-30',
    buyer: 'Apex Heights Residency',
    seller: 'Kisan Eco Agro-Voltaics',
    kwh: 35.0,
    unitPrice: 3.75,
    totalInr: 131.25,
    discomSavingsInr: 131.25,
    co2AvoidedKg: 28.70,
    status: 'Confirmed (Settled on Microgrid)',
    block: 104780
  }
];

// Helper: 24h curve calculation based on current hour
function getTelemetry24hCurve() {
  const currentHour = new Date().getHours();
  const curve = [];

  for (let h = 0; h < 24; h++) {
    const timeLabel = `${h.toString().padStart(2, '0')}:00`;
    
    // Solar profile peaks at ~12:00 - 13:00 (bell curve)
    let solarKw = 0;
    if (h >= 6 && h <= 18) {
      const peak = 12.5;
      const sigma = 2.8;
      const gaussian = Math.exp(-Math.pow(h - peak, 2) / (2 * Math.pow(sigma, 2)));
      solarKw = Number((gaussian * 7.8 + (Math.sin(h * 1.5) * 0.3)).toFixed(2));
      if (solarKw < 0) solarKw = 0;
    }

    // Load Demand profile: morning peak ~8-10, evening peak ~18-22
    let baseDemand = 2.2;
    if (h >= 7 && h <= 11) baseDemand = 4.8 + Math.sin(h) * 0.6;
    else if (h >= 18 && h <= 22) baseDemand = 5.9 + Math.cos(h) * 0.8;
    else if (h >= 12 && h <= 17) baseDemand = 3.6 + Math.sin(h * 2) * 0.4;
    else baseDemand = 1.6 + Math.random() * 0.3;
    const demandKw = Number(baseDemand.toFixed(2));

    // Battery State of Charge (%)
    // Charges when solar > demand, discharges during evening peak
    let batterySoc = 65;
    if (h >= 0 && h < 6) batterySoc = 48 - (h * 2.5);
    else if (h >= 6 && h <= 15) batterySoc = Math.min(98, 35 + ((h - 6) * 7.2));
    else batterySoc = Math.max(30, 98 - ((h - 15) * 7.8));
    batterySoc = Math.round(batterySoc);

    // P2P Energy Traded (kWh in microgrid)
    let p2pTraded = 0;
    if (h >= 9 && h <= 17) {
      p2pTraded = Number((solarKw * 0.45 + 1.2).toFixed(1));
    } else if (h >= 18 && h <= 21) {
      p2pTraded = Number((batterySoc > 50 ? 2.8 : 0.8).toFixed(1));
    }

    curve.push({
      time: timeLabel,
      hour: h,
      solarGeneration: solarKw,
      gridDemand: demandKw,
      batterySoc: batterySoc,
      p2pVolume: p2pTraded,
      isCurrent: h === currentHour
    });
  }
  return curve;
}

// 1. TELEMETRY ENDPOINT
app.get('/api/telemetry', (req, res) => {
  const currentHour = new Date().getHours();
  const currentMinute = new Date().getMinutes();
  
  // Real-time instantaneous values with small realistic natural jitter
  const peakFactor = (currentHour >= 6 && currentHour <= 18) 
    ? Math.exp(-Math.pow(currentHour + currentMinute/60 - 12.5, 2) / (2 * Math.pow(2.8, 2)))
    : 0;

  const currentSolarKw = Number((peakFactor * 8.2 + (Math.random() * 0.15 - 0.07)).toFixed(2));
  const currentDemandKw = Number((3.8 + (Math.random() * 0.4 - 0.2)).toFixed(2));
  
  const batteryPct = Math.round(
    currentHour >= 6 && currentHour <= 15 
      ? Math.min(96, 38 + ((currentHour - 6) * 6.8))
      : Math.max(35, 96 - ((currentHour > 15 ? currentHour - 15 : currentHour + 9) * 4.2))
  );

  const netExportKw = Number((currentSolarKw - currentDemandKw).toFixed(2));
  const gridFrequencyHz = Number((49.98 + (Math.random() * 0.04)).toFixed(2));
  const gridVoltageV = Math.round(230 + (Math.random() * 4 - 2));

  res.json({
    timestamp: new Date().toISOString(),
    metrics: {
      totalSolarGeneratedKwh: 34.8,
      instantaneousSolarKw: currentSolarKw,
      gridLoadDemandKw: currentDemandKw,
      batteryCapacityPct: batteryPct,
      batteryHealthPct: 98.2,
      batteryEnergyStoredKwh: Number(((batteryPct / 100) * 14.5).toFixed(1)),
      carbonAvoidedKg: 28.5,
      netGridExportKw: netExportKw,
      gridIndependencePct: Math.min(100, Math.round((currentSolarKw / (currentDemandKw || 1)) * 100)),
      gridFrequencyHz: gridFrequencyHz,
      gridVoltageV: gridVoltageV,
      microgridStatus: netExportKw >= 0 ? 'Surplus / Self-Sustaining' : 'Balancing via Micro-BESS'
    },
    nodes: [
      { id: 'node_1', name: 'Node Alpha (GreenRoof)', status: 'Producing', outputKw: 6.2, demandKw: 2.1, batteryPct: 88, role: 'Prosumer' },
      { id: 'node_2', name: 'Node Beta (Commercial Park)', status: 'Producing', outputKw: 22.4, demandKw: 14.8, batteryPct: 76, role: 'Prosumer' },
      { id: 'node_3', name: 'Node Gamma (EcoSubstation)', status: 'Optimal', outputKw: 0.0, demandKw: 0.8, batteryPct: 92, role: 'Central Inverter' },
      { id: 'node_4', name: 'Node Delta (Metro EV Fast Hub)', status: 'High Load', outputKw: 1.5, demandKw: 18.2, batteryPct: 45, role: 'Consumer' },
      { id: 'node_5', name: 'Node Epsilon (Horizon Tower)', status: 'Producing', outputKw: 11.8, demandKw: 8.4, batteryPct: 82, role: 'Prosumer' }
    ],
    hourlyTrend: getTelemetry24hCurve()
  });
});

// 2. AI SOLAR FORECASTER ENDPOINT
app.get('/api/forecast', (req, res) => {
  // Query parameters with defaults
  const temperature = parseFloat(req.query.temp) || 30.0; // °C
  const sunHours = parseFloat(req.query.sunHours) || 7.5; // Peak sun hours
  const cloudCover = parseFloat(req.query.cloudCover) || 20.0; // %
  const arrayCapacity = parseFloat(req.query.capacity) || 10.0; // kWp
  const panelEfficiency = parseFloat(req.query.efficiency) || 21.0; // %
  const tiltEfficiency = parseFloat(req.query.tilt) || 96.0; // %

  // Standard PV Math Formula:
  // Temp derating coefficient: -0.40% per °C above 25°C STC
  const tempDelta = Math.max(0, temperature - 25);
  const tempEfficiencyLoss = (tempDelta * 0.004); // e.g. (30-25)*0.004 = 0.02 (2% loss)
  const cloudTransmission = 1 - (cloudCover / 100) * 0.72; // cloud reduction
  const systemDerateFactor = 0.86; // Inverter loss, dust/soiling, wiring
  const netDerateFactor = (1 - tempEfficiencyLoss) * cloudTransmission * (tiltEfficiency / 100) * systemDerateFactor;

  // Expected daily yield in kWh: Capacity (kWp) * Effective Sun Hours * Net Derate Factor
  const dailyYieldKwh = Number((arrayCapacity * sunHours * netDerateFactor).toFixed(2));
  
  // Peak estimated power in kW
  const peakPowerKw = Number((arrayCapacity * (1 - tempEfficiencyLoss) * cloudTransmission * 0.95).toFixed(2));

  // Hourly curve simulation (24 hrs)
  const hourlyForecast = [];
  let peakHour = 12;
  let maxOutput = 0;

  for (let h = 0; h < 24; h++) {
    let kw = 0;
    if (h >= 6 && h <= 18) {
      const peak = 12.5;
      const sigma = 2.6;
      const irradianceNorm = Math.exp(-Math.pow(h - peak, 2) / (2 * Math.pow(sigma, 2)));
      // Base output before clouds & temp
      kw = Number((peakPowerKw * irradianceNorm).toFixed(2));
      if (kw > maxOutput) {
        maxOutput = kw;
        peakHour = h;
      }
    }
    hourlyForecast.push({
      hour: `${h.toString().padStart(2, '0')}:00`,
      predictedKw: kw,
      ambientTempC: Math.round(temperature - 6 + Math.sin((h - 8) / 4) * 8),
      confidencePct: Math.round(92 - (cloudCover * 0.18) + (h < 12 ? 3 : 0))
    });
  }

  // AI-Driven Smart Grid Recommendations
  const recommendations = [];
  if (cloudCover > 60) {
    recommendations.push({
      type: 'warning',
      title: 'Cloud Cover Alert',
      desc: `High cloud density (${cloudCover}%) will reduce direct yield by ~${Math.round((1 - cloudTransmission) * 100)}%. Recommend preserving BESS reserve storage.`
    });
  } else {
    recommendations.push({
      type: 'opportunity',
      title: 'Surplus Export Window',
      desc: `High irradiance expected between 10:30 AM and 02:45 PM. Forecast predicts ${dailyYieldKwh} kWh yield. Ideal for high-margin P2P trading.`
    });
  }

  if (temperature > 38) {
    recommendations.push({
      type: 'thermal',
      title: 'Thermal Derating Impact',
      desc: `High ambient temperature (${temperature}°C) degrades PV efficiency by ${(tempEfficiencyLoss * 100).toFixed(1)}%. Trigger microgrid panel cooling if available.`
    });
  }

  recommendations.push({
    type: 'dispatch',
    title: 'Optimal Battery Storage Schedule',
    desc: `Initiate BESS fast-charge at ${peakHour - 1}:00 when predicted generation reaches ${maxOutput} kW.`
  });

  res.json({
    parameters: {
      temperature,
      sunHours,
      cloudCover,
      arrayCapacity,
      panelEfficiency,
      tiltEfficiency
    },
    prediction: {
      dailyYieldKwh,
      peakPowerKw,
      efficiencyLossPct: Number((tempEfficiencyLoss * 100).toFixed(1)),
      cloudTransmissionPct: Number((cloudTransmission * 100).toFixed(1)),
      carbonOffsetKg: Number((dailyYieldKwh * 0.82).toFixed(1)),
      estimatedRevenueInr: Number((dailyYieldKwh * 4.25).toFixed(2)),
      peakProductionTime: `${peakHour}:00 - ${peakHour + 1}:00`
    },
    hourlyForecast,
    recommendations
  });
});

// 3. P2P MARKETPLACE OFFERS
app.get('/api/marketplace/offers', (req, res) => {
  res.json({
    activeOffers,
    stats: {
      averageP2pRate: 4.17,
      discomStandardRate: 7.50,
      averageSavingsPct: 44.4,
      totalVolumeAvailableKwh: activeOffers.reduce((sum, o) => sum + o.availableKwh, 0)
    }
  });
});

// 4. EXECUTE P2P TRADE
app.post('/api/marketplace/trade', (req, res) => {
  const { offerId, unitsToBuy, buyerName = 'Rahul Sharma' } = req.body;
  const units = parseFloat(unitsToBuy);

  if (!units || units <= 0) {
    return res.status(400).json({ error: 'Valid energy units (kWh) required' });
  }

  const offerIndex = activeOffers.findIndex(o => o.id === offerId);
  if (offerIndex === -1) {
    return res.status(404).json({ error: 'Selected energy offer is no longer active' });
  }

  const offer = activeOffers[offerIndex];
  if (units > offer.availableKwh) {
    return res.status(400).json({ error: `Requested ${units} kWh exceeds available ${offer.availableKwh} kWh` });
  }

  const totalCost = Number((units * offer.pricePerKwh).toFixed(2));
  const discomBenchmark = Number((units * offer.discomPrice).toFixed(2));
  const savings = Number((discomBenchmark - totalCost).toFixed(2));
  const co2Avoided = Number((units * 0.82).toFixed(2));

  // Check buyer wallet balance
  if (userWallet.balanceInr < totalCost) {
    return res.status(400).json({ 
      error: `Insufficient wallet balance. Required: ₹${totalCost}, Available: ₹${userWallet.balanceInr.toFixed(2)}` 
    });
  }

  // Deduct from buyer wallet & update stats
  userWallet.balanceInr = Number((userWallet.balanceInr - totalCost).toFixed(2));
  userWallet.cleanTokens = Number((userWallet.cleanTokens + (units * 0.1)).toFixed(1));
  userWallet.totalBoughtKwh = Number((userWallet.totalBoughtKwh + units).toFixed(1));
  userWallet.co2SavedKg = Number((userWallet.co2SavedKg + co2Avoided).toFixed(2));

  // Deduct available kWh from offer
  offer.availableKwh = Number((offer.availableKwh - units).toFixed(1));
  if (offer.availableKwh <= 0.1) {
    activeOffers.splice(offerIndex, 1);
  }

  // Generate cryptographic-style mock txHash
  const randomHex = () => Math.random().toString(16).substring(2, 10);
  const txHash = `0x${randomHex()}${randomHex()}${randomHex()}${randomHex()}`.toLowerCase();
  const txId = `TXN-${Math.floor(100000 + Math.random() * 900000)}`;
  const now = new Date();
  const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')} IST`;

  const newTx = {
    id: txId,
    txHash,
    timestamp: timeStr,
    date: now.toISOString().split('T')[0],
    buyer: buyerName,
    seller: offer.sellerName,
    sellerNode: offer.node,
    kwh: units,
    unitPrice: offer.pricePerKwh,
    totalInr: totalCost,
    discomSavingsInr: savings,
    co2AvoidedKg: co2Avoided,
    status: 'Confirmed (Settled on Microgrid)',
    block: Math.floor(104820 + transactionLedger.length + 1)
  };

  transactionLedger.unshift(newTx);

  res.json({
    success: true,
    message: `Successfully purchased ${units} kWh from ${offer.sellerName}!`,
    transaction: newTx,
    updatedWallet: userWallet,
    remainingOfferKwh: offer.availableKwh
  });
});

// 5. LIST SURPLUS ENERGY OFFER
app.post('/api/marketplace/list', (req, res) => {
  const { availableKwh, pricePerKwh, source = 'Rooftop Solar PV', batteryBacked = true } = req.body;
  const kwh = parseFloat(availableKwh);
  const price = parseFloat(pricePerKwh);

  if (!kwh || kwh <= 0 || !price || price <= 0) {
    return res.status(400).json({ error: 'Please enter valid energy units and price per unit' });
  }

  const newOffer = {
    id: `off_${Date.now().toString().slice(-6)}`,
    sellerId: userWallet.id,
    sellerName: `${userWallet.name} (You)`,
    sellerAvatar: '⚡',
    sellerRating: 5.0,
    node: userWallet.nodeId,
    availableKwh: kwh,
    minKwh: 1.0,
    pricePerKwh: price,
    discomPrice: 7.50,
    source,
    batteryBacked: Boolean(batteryBacked),
    expiresIn: '4h 00m',
    verified: true
  };

  activeOffers.unshift(newOffer);
  userWallet.totalSoldKwh = Number((userWallet.totalSoldKwh + kwh).toFixed(1));

  res.json({
    success: true,
    message: `Your offer for ${kwh} kWh at ₹${price.toFixed(2)}/kWh has been published to the microgrid orderbook.`,
    offer: newOffer
  });
});

// 6. TRANSACTION LEDGER
app.get('/api/marketplace/transactions', (req, res) => {
  res.json({
    transactions: transactionLedger,
    totalTransactions: transactionLedger.length,
    cumulativeKwhTraded: Number(transactionLedger.reduce((sum, t) => sum + t.kwh, 0).toFixed(1)),
    cumulativeInrSettled: Number(transactionLedger.reduce((sum, t) => sum + t.totalInr, 0).toFixed(2)),
    cumulativeSavingsInr: Number(transactionLedger.reduce((sum, t) => sum + t.discomSavingsInr, 0).toFixed(2))
  });
});

// 7. USER WALLET & STATS
app.get('/api/wallet', (req, res) => {
  res.json(userWallet);
});

// Top-up wallet faucet (judges testing feature)
app.post('/api/wallet/faucet', (req, res) => {
  const amount = parseFloat(req.body.amount) || 1000.0;
  userWallet.balanceInr = Number((userWallet.balanceInr + amount).toFixed(2));
  res.json({
    success: true,
    message: `Wallet topped up by ₹${amount}. New balance: ₹${userWallet.balanceInr}`,
    balanceInr: userWallet.balanceInr
  });
});

// 8. CARBON IMPACT & SAVINGS CALCULATOR
app.get('/api/calculator/savings', (req, res) => {
  const monthlySolarKwh = parseFloat(req.query.monthlyKwh) || 350;
  const gridTariffInr = parseFloat(req.query.tariff) || 7.50;
  const p2pTariffInr = parseFloat(req.query.p2pRate) || 4.20;
  const solarSizeKw = parseFloat(req.query.solarSizeKw) || 3.5;

  // Monthly savings comparing P2P/Self-solar generation vs Traditional Discom Coal Grid
  const costWithoutSolar = monthlySolarKwh * gridTariffInr;
  const costWithP2pOrSolar = monthlySolarKwh * p2pTariffInr;
  const monthlySavingsInr = Number((costWithoutSolar - costWithP2pOrSolar).toFixed(2));
  const annualSavingsInr = Number((monthlySavingsInr * 12).toFixed(2));

  // Carbon and Environmental Equivalents
  // Standard India Grid Carbon Intensity: ~0.82 kg CO2 per kWh
  const monthlyCo2AvoidedKg = Number((monthlySolarKwh * 0.82).toFixed(1));
  const annualCo2AvoidedKg = Number((monthlyCo2AvoidedKg * 12).toFixed(1));
  const annualCo2AvoidedTons = Number((annualCo2AvoidedKg / 1000).toFixed(2));

  // Equivalencies:
  // 1 mature tree absorbs ~21.8 kg CO2 per year
  const treesPlantedEquivalent = Math.round(annualCo2AvoidedKg / 21.8);
  // 1 kg coal produces ~1.2 kWh in thermal power plant (~0.83 kg coal per kWh)
  const coalAvoidedKg = Math.round(monthlySolarKwh * 12 * 0.83);
  // Average EV efficiency: ~7 km per kWh
  const evKilometersPowered = Math.round(monthlySolarKwh * 12 * 7.0);

  // Estimated ROI / Payback calculation (assuming average ₹55,000 per kW system capital cost)
  const estimatedSystemCostInr = solarSizeKw * 55000;
  const paybackYears = Number((estimatedSystemCostInr / annualSavingsInr).toFixed(1));

  res.json({
    inputs: {
      monthlySolarKwh,
      gridTariffInr,
      p2pTariffInr,
      solarSizeKw
    },
    savings: {
      monthlySavingsInr,
      annualSavingsInr,
      costWithoutSolar,
      costWithP2pOrSolar,
      paybackYears: isFinite(paybackYears) ? paybackYears : 3.8
    },
    environmentalImpact: {
      monthlyCo2AvoidedKg,
      annualCo2AvoidedKg,
      annualCo2AvoidedTons,
      treesPlantedEquivalent,
      coalAvoidedKg,
      evKilometersPowered
    }
  });
});

app.listen(PORT, () => {
  console.log(`⚡ EcoGrid AI Backend running on http://localhost:${PORT}`);
});
