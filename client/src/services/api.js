// API Service for EcoGrid AI with full client-side fallback & persistence

const STORAGE_KEYS = {
  WALLET: 'ecogrid_wallet',
  OFFERS: 'ecogrid_offers',
  TRANSACTIONS: 'ecogrid_transactions',
};

// Initial Seed Data for offline/standalone resilience
const INITIAL_WALLET = {
  id: 'usr_001',
  name: 'Rahul Sharma',
  nodeId: 'NODE-ALPHA-01',
  balanceInr: 2850.50,
  cleanTokens: 145.0,
  totalBoughtKwh: 48.5,
  totalSoldKwh: 126.0,
  co2SavedKg: 98.4
};

const INITIAL_OFFERS = [
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

const INITIAL_TRANSACTIONS = [
  {
    id: 'TXN-984210',
    txHash: '0x8f4c3a91b8d2345e6702cfa98b31a2d103b41e8c',
    timestamp: '14:28:12 IST',
    date: '2026-09-30',
    buyer: 'Rahul Sharma (You)',
    seller: 'GreenRoof Villa',
    sellerNode: 'Node Alpha (Residential)',
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
    sellerNode: 'Node Alpha-01',
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
    sellerNode: 'Node Epsilon (Rural Feeder)',
    kwh: 35.0,
    unitPrice: 3.75,
    totalInr: 131.25,
    discomSavingsInr: 131.25,
    co2AvoidedKg: 28.70,
    status: 'Confirmed (Settled on Microgrid)',
    block: 104780
  }
];

// Local state accessors
function getLocalWallet() {
  const data = localStorage.getItem(STORAGE_KEYS.WALLET);
  return data ? JSON.parse(data) : INITIAL_WALLET;
}

function saveLocalWallet(wallet) {
  localStorage.setItem(STORAGE_KEYS.WALLET, JSON.stringify(wallet));
}

function getLocalOffers() {
  const data = localStorage.getItem(STORAGE_KEYS.OFFERS);
  return data ? JSON.parse(data) : INITIAL_OFFERS;
}

function saveLocalOffers(offers) {
  localStorage.setItem(STORAGE_KEYS.OFFERS, JSON.stringify(offers));
}

function getLocalTransactions() {
  const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
  return data ? JSON.parse(data) : INITIAL_TRANSACTIONS;
}

function saveLocalTransactions(txs) {
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(txs));
}

// Fallback Telemetry generator
function generateLocalTelemetry() {
  const currentHour = new Date().getHours();
  const currentMinute = new Date().getMinutes();
  
  const peakFactor = (currentHour >= 6 && currentHour <= 18) 
    ? Math.exp(-Math.pow(currentHour + currentMinute/60 - 12.5, 2) / (2 * Math.pow(2.8, 2)))
    : 0;

  const currentSolarKw = Number((peakFactor * 8.4 + (Math.random() * 0.2 - 0.1)).toFixed(2));
  const currentDemandKw = Number((3.6 + (Math.random() * 0.3 - 0.15)).toFixed(2));
  
  const batteryPct = Math.round(
    currentHour >= 6 && currentHour <= 15 
      ? Math.min(96, 38 + ((currentHour - 6) * 6.8))
      : Math.max(35, 96 - ((currentHour > 15 ? currentHour - 15 : currentHour + 9) * 4.2))
  );

  const netExportKw = Number((currentSolarKw - currentDemandKw).toFixed(2));

  // 24h curve
  const curve = [];
  for (let h = 0; h < 24; h++) {
    let solarKw = 0;
    if (h >= 6 && h <= 18) {
      const peak = 12.5;
      const sigma = 2.8;
      const gaussian = Math.exp(-Math.pow(h - peak, 2) / (2 * Math.pow(sigma, 2)));
      solarKw = Number((gaussian * 7.8).toFixed(2));
    }
    let baseDemand = 2.2;
    if (h >= 7 && h <= 11) baseDemand = 4.8;
    else if (h >= 18 && h <= 22) baseDemand = 6.0;
    else if (h >= 12 && h <= 17) baseDemand = 3.6;
    else baseDemand = 1.6;

    let batSoc = h < 6 ? 48 - (h * 2.5) : h <= 15 ? Math.min(98, 35 + ((h - 6) * 7.2)) : Math.max(30, 98 - ((h - 15) * 7.8));

    curve.push({
      time: `${h.toString().padStart(2, '0')}:00`,
      hour: h,
      solarGeneration: solarKw,
      gridDemand: Number(baseDemand.toFixed(2)),
      batterySoc: Math.round(batSoc),
      p2pVolume: h >= 10 && h <= 16 ? Number((solarKw * 0.4).toFixed(1)) : 0.5,
      isCurrent: h === currentHour
    });
  }

  return {
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
      gridFrequencyHz: Number((49.98 + (Math.random() * 0.04)).toFixed(2)),
      gridVoltageV: Math.round(230 + (Math.random() * 4 - 2)),
      microgridStatus: netExportKw >= 0 ? 'Surplus / Self-Sustaining' : 'Balancing via Micro-BESS'
    },
    nodes: [
      { id: 'node_1', name: 'Node Alpha (GreenRoof)', status: 'Producing', outputKw: 6.2, demandKw: 2.1, batteryPct: 88, role: 'Prosumer' },
      { id: 'node_2', name: 'Node Beta (Commercial Park)', status: 'Producing', outputKw: 22.4, demandKw: 14.8, batteryPct: 76, role: 'Prosumer' },
      { id: 'node_3', name: 'Node Gamma (EcoSubstation)', status: 'Optimal', outputKw: 0.0, demandKw: 0.8, batteryPct: 92, role: 'Central Inverter' },
      { id: 'node_4', name: 'Node Delta (Metro EV Fast Hub)', status: 'High Load', outputKw: 1.5, demandKw: 18.2, batteryPct: 45, role: 'Consumer' },
      { id: 'node_5', name: 'Node Epsilon (Horizon Tower)', status: 'Producing', outputKw: 11.8, demandKw: 8.4, batteryPct: 82, role: 'Prosumer' }
    ],
    hourlyTrend: curve
  };
}

// Fallback Forecast calculator
function calculateLocalForecast(temp, sunHours, cloudCover, capacity, efficiency = 21, tilt = 96) {
  const tempDelta = Math.max(0, temp - 25);
  const tempEfficiencyLoss = (tempDelta * 0.004);
  const cloudTransmission = 1 - (cloudCover / 100) * 0.72;
  const systemDerateFactor = 0.86;
  const netDerateFactor = (1 - tempEfficiencyLoss) * cloudTransmission * (tilt / 100) * systemDerateFactor;

  const dailyYieldKwh = Number((capacity * sunHours * netDerateFactor).toFixed(2));
  const peakPowerKw = Number((capacity * (1 - tempEfficiencyLoss) * cloudTransmission * 0.95).toFixed(2));

  const hourlyForecast = [];
  let peakHour = 12;
  let maxOutput = 0;

  for (let h = 0; h < 24; h++) {
    let kw = 0;
    if (h >= 6 && h <= 18) {
      const peak = 12.5;
      const sigma = 2.6;
      const irradianceNorm = Math.exp(-Math.pow(h - peak, 2) / (2 * Math.pow(sigma, 2)));
      kw = Number((peakPowerKw * irradianceNorm).toFixed(2));
      if (kw > maxOutput) {
        maxOutput = kw;
        peakHour = h;
      }
    }
    hourlyForecast.push({
      hour: `${h.toString().padStart(2, '0')}:00`,
      predictedKw: kw,
      ambientTempC: Math.round(temp - 6 + Math.sin((h - 8) / 4) * 8),
      confidencePct: Math.round(92 - (cloudCover * 0.18) + (h < 12 ? 3 : 0))
    });
  }

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

  if (temp > 38) {
    recommendations.push({
      type: 'thermal',
      title: 'Thermal Derating Impact',
      desc: `High ambient temperature (${temp}°C) degrades PV efficiency by ${(tempEfficiencyLoss * 100).toFixed(1)}%. Trigger microgrid panel cooling if available.`
    });
  }

  recommendations.push({
    type: 'dispatch',
    title: 'Optimal Battery Storage Schedule',
    desc: `Initiate BESS fast-charge at ${peakHour - 1}:00 when predicted generation reaches ${maxOutput} kW.`
  });

  return {
    parameters: { temperature: temp, sunHours, cloudCover, arrayCapacity: capacity, panelEfficiency: efficiency, tiltEfficiency: tilt },
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
  };
}

export const api = {
  // 1. Telemetry
  async getTelemetry() {
    try {
      const res = await fetch('/api/telemetry');
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    return generateLocalTelemetry();
  },

  // 2. Forecaster
  async getForecast(params) {
    const { temp, sunHours, cloudCover, capacity } = params;
    try {
      const url = `/api/forecast?temp=${temp}&sunHours=${sunHours}&cloudCover=${cloudCover}&capacity=${capacity}`;
      const res = await fetch(url);
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    return calculateLocalForecast(temp, sunHours, cloudCover, capacity);
  },

  // 3. Marketplace Offers
  async getOffers() {
    try {
      const res = await fetch('/api/marketplace/offers');
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    const offers = getLocalOffers();
    return {
      activeOffers: offers,
      stats: {
        averageP2pRate: 4.17,
        discomStandardRate: 7.50,
        averageSavingsPct: 44.4,
        totalVolumeAvailableKwh: offers.reduce((sum, o) => sum + o.availableKwh, 0)
      }
    };
  },

  // 4. Trade Execution
  async executeTrade(offerId, unitsToBuy, buyerName = 'Rahul Sharma') {
    try {
      const res = await fetch('/api/marketplace/trade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ offerId, unitsToBuy, buyerName })
      });
      if (res.ok) return await res.json();
      const errData = await res.json();
      throw new Error(errData.error || 'Trade execution failed');
    } catch (err) {
      if (err.message && !err.message.includes('fetch')) {
        throw err;
      }
      // Offline fallback trade execution
      const offers = getLocalOffers();
      const offerIndex = offers.findIndex(o => o.id === offerId);
      if (offerIndex === -1) throw new Error('Selected offer no longer available');

      const offer = offers[offerIndex];
      const units = parseFloat(unitsToBuy);
      if (units > offer.availableKwh) throw new Error('Requested units exceed available amount');

      const wallet = getLocalWallet();
      const totalCost = Number((units * offer.pricePerKwh).toFixed(2));
      if (wallet.balanceInr < totalCost) {
        throw new Error(`Insufficient wallet balance. Required: ₹${totalCost}, Available: ₹${wallet.balanceInr.toFixed(2)}`);
      }

      // Update wallet
      wallet.balanceInr = Number((wallet.balanceInr - totalCost).toFixed(2));
      wallet.cleanTokens = Number((wallet.cleanTokens + (units * 0.1)).toFixed(1));
      wallet.totalBoughtKwh = Number((wallet.totalBoughtKwh + units).toFixed(1));
      wallet.co2SavedKg = Number((wallet.co2SavedKg + (units * 0.82)).toFixed(2));
      saveLocalWallet(wallet);

      // Update offer
      offer.availableKwh = Number((offer.availableKwh - units).toFixed(1));
      if (offer.availableKwh <= 0.1) {
        offers.splice(offerIndex, 1);
      }
      saveLocalOffers(offers);

      // Record transaction
      const randomHex = () => Math.random().toString(16).substring(2, 10);
      const txHash = `0x${randomHex()}${randomHex()}${randomHex()}${randomHex()}`.toLowerCase();
      const tx = {
        id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
        txHash,
        timestamp: `${new Date().getHours().toString().padStart(2, '0')}:${new Date().getMinutes().toString().padStart(2, '0')}:${new Date().getSeconds().toString().padStart(2, '0')} IST`,
        date: new Date().toISOString().split('T')[0],
        buyer: buyerName,
        seller: offer.sellerName,
        sellerNode: offer.node,
        kwh: units,
        unitPrice: offer.pricePerKwh,
        totalInr: totalCost,
        discomSavingsInr: Number(((units * 7.50) - totalCost).toFixed(2)),
        co2AvoidedKg: Number((units * 0.82).toFixed(2)),
        status: 'Confirmed (Settled on Microgrid)',
        block: 104825
      };

      const txs = getLocalTransactions();
      txs.unshift(tx);
      saveLocalTransactions(txs);

      return {
        success: true,
        message: `Successfully purchased ${units} kWh from ${offer.sellerName}!`,
        transaction: tx,
        updatedWallet: wallet,
        remainingOfferKwh: offer.availableKwh
      };
    }
  },

  // 5. List Energy Offer
  async listOffer(newOfferData) {
    try {
      const res = await fetch('/api/marketplace/list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOfferData)
      });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }

    const offers = getLocalOffers();
    const wallet = getLocalWallet();
    const kwh = parseFloat(newOfferData.availableKwh);
    const price = parseFloat(newOfferData.pricePerKwh);

    const offer = {
      id: `off_${Date.now().toString().slice(-6)}`,
      sellerId: wallet.id,
      sellerName: `${wallet.name} (You)`,
      sellerAvatar: '⚡',
      sellerRating: 5.0,
      node: wallet.nodeId,
      availableKwh: kwh,
      minKwh: 1.0,
      pricePerKwh: price,
      discomPrice: 7.50,
      source: newOfferData.source || 'Rooftop Solar PV',
      batteryBacked: Boolean(newOfferData.batteryBacked),
      expiresIn: '4h 00m',
      verified: true
    };

    offers.unshift(offer);
    saveLocalOffers(offers);
    wallet.totalSoldKwh = Number((wallet.totalSoldKwh + kwh).toFixed(1));
    saveLocalWallet(wallet);

    return {
      success: true,
      message: `Your offer for ${kwh} kWh at ₹${price.toFixed(2)}/kWh has been published.`,
      offer
    };
  },

  // 6. Transactions
  async getTransactions() {
    try {
      const res = await fetch('/api/marketplace/transactions');
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    const txs = getLocalTransactions();
    return {
      transactions: txs,
      totalTransactions: txs.length,
      cumulativeKwhTraded: Number(txs.reduce((sum, t) => sum + t.kwh, 0).toFixed(1)),
      cumulativeInrSettled: Number(txs.reduce((sum, t) => sum + t.totalInr, 0).toFixed(2)),
      cumulativeSavingsInr: Number(txs.reduce((sum, t) => sum + t.discomSavingsInr, 0).toFixed(2))
    };
  },

  // 7. Wallet
  async getWallet() {
    try {
      const res = await fetch('/api/wallet');
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    return getLocalWallet();
  },

  // 8. Wallet Faucet
  async topUpWallet(amount = 1000) {
    try {
      const res = await fetch('/api/wallet/faucet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount })
      });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    const wallet = getLocalWallet();
    wallet.balanceInr = Number((wallet.balanceInr + amount).toFixed(2));
    saveLocalWallet(wallet);
    return {
      success: true,
      message: `Wallet topped up by ₹${amount}`,
      balanceInr: wallet.balanceInr
    };
  },

  // 9. Carbon Calculator
  calculateSavings(monthlyKwh = 350, gridTariff = 7.50, p2pRate = 4.20, solarSizeKw = 3.5) {
    const costWithoutSolar = monthlyKwh * gridTariff;
    const costWithP2pOrSolar = monthlyKwh * p2pRate;
    const monthlySavingsInr = Number((costWithoutSolar - costWithP2pOrSolar).toFixed(2));
    const annualSavingsInr = Number((monthlySavingsInr * 12).toFixed(2));

    const monthlyCo2AvoidedKg = Number((monthlyKwh * 0.82).toFixed(1));
    const annualCo2AvoidedKg = Number((monthlyCo2AvoidedKg * 12).toFixed(1));
    const annualCo2AvoidedTons = Number((annualCo2AvoidedKg / 1000).toFixed(2));

    const treesPlantedEquivalent = Math.round(annualCo2AvoidedKg / 21.8);
    const coalAvoidedKg = Math.round(monthlyKwh * 12 * 0.83);
    const evKilometersPowered = Math.round(monthlyKwh * 12 * 7.0);

    const estimatedSystemCostInr = solarSizeKw * 55000;
    const paybackYears = Number((estimatedSystemCostInr / annualSavingsInr).toFixed(1));

    return {
      inputs: { monthlySolarKwh: monthlyKwh, gridTariffInr: gridTariff, p2pTariffInr: p2pRate, solarSizeKw },
      savings: { monthlySavingsInr, annualSavingsInr, costWithoutSolar, costWithP2pOrSolar, paybackYears: isFinite(paybackYears) ? paybackYears : 3.8 },
      environmentalImpact: { monthlyCo2AvoidedKg, annualCo2AvoidedKg, annualCo2AvoidedTons, treesPlantedEquivalent, coalAvoidedKg, evKilometersPowered }
    };
  }
};
