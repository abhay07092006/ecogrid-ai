import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import TelemetryDashboard from './components/TelemetryDashboard';
import AIForecaster from './components/AIForecaster';
import Marketplace from './components/Marketplace';
import CarbonCalculator from './components/CarbonCalculator';
import MicrogridTopology from './components/MicrogridTopology';
import AutoTradingBot from './components/AutoTradingBot';
import WalletModal from './components/WalletModal';
import NotificationToast from './components/NotificationToast';
import { api } from './services/api';
import { 
  Zap, 
  Activity, 
  ShieldCheck, 
  Leaf, 
  Cpu, 
  Globe, 
  ExternalLink,
  Code2
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('telemetry');
  const [currency, setCurrency] = useState('INR');
  const [liveMode, setLiveMode] = useState(true);

  // Core Data States
  const [telemetry, setTelemetry] = useState(null);
  const [offers, setOffers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [wallet, setWallet] = useState({
    id: 'usr_001',
    name: 'Rahul Sharma',
    nodeId: 'NODE-ALPHA-01',
    balanceInr: 2850.50,
    cleanTokens: 145.0,
    totalBoughtKwh: 48.5,
    totalSoldKwh: 126.0,
    co2SavedKg: 98.4
  });

  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (title, message, type = 'success') => {
    setToast({ title, message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Initial Data Fetch
  const loadInitialData = useCallback(async () => {
    try {
      const [telemetryRes, offersRes, txRes, walletRes] = await Promise.all([
        api.getTelemetry(),
        api.getOffers(),
        api.getTransactions(),
        api.getWallet()
      ]);

      if (telemetryRes) setTelemetry(telemetryRes);
      if (offersRes && offersRes.activeOffers) setOffers(offersRes.activeOffers);
      if (txRes && txRes.transactions) setTransactions(txRes.transactions);
      if (walletRes) setWallet(walletRes);
    } catch (err) {
      console.warn('Backend unavailable, operating seamlessly on local mock service:', err);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Live Telemetry Simulation Loop (Updates every 3.5s when liveMode is on)
  useEffect(() => {
    if (!liveMode) return;

    const interval = setInterval(async () => {
      try {
        const freshTelemetry = await api.getTelemetry();
        if (freshTelemetry) {
          setTelemetry((prev) => {
            if (!prev) return freshTelemetry;
            // Add slight dynamic pulse jitter to metrics
            const jitterSolar = Number((freshTelemetry.metrics.instantaneousSolarKw + (Math.random() * 0.1 - 0.05)).toFixed(2));
            const jitterDemand = Number((freshTelemetry.metrics.gridLoadDemandKw + (Math.random() * 0.16 - 0.08)).toFixed(2));
            const netExport = Number((jitterSolar - jitterDemand).toFixed(2));

            return {
              ...freshTelemetry,
              metrics: {
                ...freshTelemetry.metrics,
                instantaneousSolarKw: Math.max(0, jitterSolar),
                gridLoadDemandKw: Math.max(0.5, jitterDemand),
                netGridExportKw: netExport,
                gridFrequencyHz: Number((49.99 + Math.random() * 0.03).toFixed(2))
              }
            };
          });
        }
      } catch (e) {
        // silent catch
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [liveMode]);

  // Handle Trade Execution
  const handleExecuteTrade = async (offerId, unitsToBuy) => {
    const res = await api.executeTrade(offerId, unitsToBuy, wallet.name);
    if (res.success) {
      setWallet(res.updatedWallet);
      showToast(
        'P2P Trade Settled!',
        `Purchased ${unitsToBuy} kWh cleanly from ${res.transaction.seller}. TxHash: ${res.transaction.txHash.slice(0, 10)}...`,
        'success'
      );
      // Refresh offers and ledger
      const freshOffers = await api.getOffers();
      if (freshOffers && freshOffers.activeOffers) setOffers(freshOffers.activeOffers);
      const freshTx = await api.getTransactions();
      if (freshTx && freshTx.transactions) setTransactions(freshTx.transactions);
    }
    return res;
  };

  // Handle New Offer Publication
  const handlePublishOffer = async (offerData) => {
    const res = await api.listOffer(offerData);
    if (res.success) {
      showToast(
        'Offer Published to Grid!',
        `Your offer of ${offerData.availableKwh} kWh at ₹${offerData.pricePerKwh}/kWh is now active on the community orderbook.`,
        'success'
      );
      const freshOffers = await api.getOffers();
      if (freshOffers && freshOffers.activeOffers) setOffers(freshOffers.activeOffers);
      const freshWallet = await api.getWallet();
      if (freshWallet) setWallet(freshWallet);
    }
    return res;
  };

  // Handle Wallet Faucet Top Up
  const handleTopUpWallet = async (amount) => {
    const res = await api.topUpWallet(amount);
    if (res.success) {
      const freshWallet = await api.getWallet();
      if (freshWallet) setWallet(freshWallet);
      showToast('Wallet Credited', `+₹${amount} demo funds added for testing.`, 'info');
    }
  };

  return (
    <div className="min-h-screen bg-cyber-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-cyber-950 bg-grid-pattern relative">
      {/* Background ambient lighting */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[350px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none -z-10"></div>
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[350px] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none -z-10"></div>

      {/* Main Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        wallet={wallet}
        onOpenWallet={() => setIsWalletOpen(true)}
        currency={currency}
        setCurrency={setCurrency}
        liveMode={liveMode}
        setLiveMode={setLiveMode}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'telemetry' && (
          <TelemetryDashboard
            telemetryData={telemetry}
            onSwitchTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'forecaster' && (
          <AIForecaster
            onSwitchToMarketplace={() => setActiveTab('marketplace')}
          />
        )}

        {activeTab === 'marketplace' && (
          <Marketplace
            offers={offers}
            transactions={transactions}
            wallet={wallet}
            onExecuteTrade={handleExecuteTrade}
            onPublishOffer={handlePublishOffer}
            currency={currency}
          />
        )}

        {activeTab === 'calculator' && (
          <CarbonCalculator
            currency={currency}
            onSwitchToMarketplace={() => setActiveTab('marketplace')}
          />
        )}

        {activeTab === 'topology' && (
          <MicrogridTopology
            nodes={telemetry ? telemetry.nodes : []}
          />
        )}

        {activeTab === 'autopilot' && (
          <AutoTradingBot
            wallet={wallet}
            onExecuteTrade={handleExecuteTrade}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-cyber-800/80 bg-cyber-950/90 py-8 text-xs font-mono text-slate-400 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-white">EcoGrid AI</span>
            <span className="text-slate-500">|</span>
            <span>Smart India Hackathon Prototype (SIH26200)</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              P2P Protocol: IEEE 2030.5 / DER Compliant
            </span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="text-emerald-400">Zero Utility Carbon Intensity</span>
          </div>
        </div>
      </footer>

      {/* Wallet Modal */}
      {isWalletOpen && (
        <WalletModal
          wallet={wallet}
          onClose={() => setIsWalletOpen(false)}
          onTopUp={handleTopUpWallet}
          currency={currency}
        />
      )}

      {/* Global Notification Toast */}
      {toast && (
        <NotificationToast
          toast={toast}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
