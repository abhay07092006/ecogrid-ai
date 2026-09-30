import React, { useState } from 'react';
import { 
  ArrowLeftRight, 
  PlusCircle, 
  ShieldCheck, 
  Star, 
  Zap, 
  BatteryCharging, 
  Clock, 
  TrendingDown, 
  Search, 
  Filter, 
  FileText, 
  CheckCircle2, 
  Layers,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import TradeModal from './TradeModal';
import ListOfferModal from './ListOfferModal';

export default function Marketplace({ 
  offers = [], 
  transactions = [], 
  wallet, 
  onExecuteTrade, 
  onPublishOffer, 
  currency 
}) {
  const [activeTab, setActiveTab] = useState('offers'); // 'offers' or 'ledger'
  const [selectedOfferForTrade, setSelectedOfferForTrade] = useState(null);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'battery', 'residential', 'commercial'

  const formatCurrency = (amt) => {
    if (currency === 'USD') return `$${(amt / 84).toFixed(2)}`;
    return `₹${amt.toFixed(2)}`;
  };

  // Filter offers
  const filteredOffers = offers.filter((offer) => {
    const matchesSearch = 
      offer.sellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.node.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.source.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (filterType === 'battery') return offer.batteryBacked;
    if (filterType === 'residential') return offer.node.includes('Residential') || offer.node.includes('Home') || offer.node.includes('Alpha');
    if (filterType === 'commercial') return offer.node.includes('Commercial') || offer.node.includes('Park') || offer.node.includes('Farm');
    return true;
  });

  const totalVolumeAvailable = offers.reduce((sum, o) => sum + o.availableKwh, 0);
  const avgP2pRate = offers.length 
    ? (offers.reduce((sum, o) => sum + o.pricePerKwh, 0) / offers.length).toFixed(2)
    : '4.17';

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Header & Market Metrics Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-cyber-900 via-cyber-850 to-emerald-950/40 p-6 rounded-2xl border border-cyber-800">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400"></span>
            <span className="text-xs uppercase font-mono tracking-widest text-emerald-400 font-semibold flex items-center gap-1.5">
              <ArrowLeftRight className="w-3.5 h-3.5" /> Peer-to-Peer Smart Grid Trading Bus
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Decentralized Energy Marketplace
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl mt-1">
            Buy and sell clean solar power directly with your community neighbors. Cut energy costs by 40-50% while supporting local renewable microgrids.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsListModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-cyber-950 font-bold text-xs transition-all shadow-lg shadow-emerald-950/40"
          >
            <PlusCircle className="w-4 h-4 fill-cyber-950 text-emerald-600" />
            <span>List Surplus Solar</span>
          </button>
        </div>
      </div>

      {/* Market Statistics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-cyber-800">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Avg. P2P Clearing Rate</div>
          <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">
            {formatCurrency(parseFloat(avgP2pRate))} <span className="text-xs text-slate-400 font-normal">/ kWh</span>
          </div>
          <div className="text-[10px] text-emerald-300 font-mono mt-1">
            44% below Utility Discom (₹7.50)
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-cyber-800">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Available Solar Volume</div>
          <div className="text-2xl font-bold text-white font-mono mt-1">
            {totalVolumeAvailable.toFixed(1)} <span className="text-xs text-amber-400 font-normal">kWh</span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-1">
            Across {offers.length} active prosumer nodes
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-cyber-800">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Community Savings Today</div>
          <div className="text-2xl font-bold text-cyan-400 font-mono mt-1">
            {formatCurrency(transactions.reduce((acc, t) => acc + (t.discomSavingsInr || 0), 0))}
          </div>
          <div className="text-[10px] text-cyan-300 font-mono mt-1">
            Settled via Smart Contracts
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-cyber-800">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Settled Clean Transactions</div>
          <div className="text-2xl font-bold text-purple-400 font-mono mt-1">
            {transactions.length} <span className="text-xs text-slate-400 font-normal">Trades</span>
          </div>
          <div className="text-[10px] text-purple-300 font-mono mt-1">
            Zero Discom Grid Transmission Loss
          </div>
        </div>
      </div>

      {/* Tabs & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyber-800 pb-4">
        {/* Sub-Tabs: Offers vs Ledger */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('offers')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'offers'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm'
                : 'text-slate-400 hover:text-white bg-cyber-900 border border-cyber-800'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span>Active Energy Offers ({filteredOffers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('ledger')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'ledger'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 shadow-sm'
                : 'text-slate-400 hover:text-white bg-cyber-900 border border-cyber-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-purple-400" />
            <span>Settled Ledger ({transactions.length})</span>
          </button>
        </div>

        {/* Search & Filter Dropdown (Active when in 'offers' tab) */}
        {activeTab === 'offers' && (
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search sellers or nodes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-cyber-900 border border-cyber-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-48 sm:w-60 font-mono"
              />
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-cyber-900 border border-cyber-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500 font-mono"
            >
              <option value="all">All Sources</option>
              <option value="battery">Battery Backed</option>
              <option value="residential">Residential Prosumers</option>
              <option value="commercial">Commercial/Farms</option>
            </select>
          </div>
        )}
      </div>

      {/* TAB 1: ACTIVE ENERGY OFFERS GRID */}
      {activeTab === 'offers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredOffers.length === 0 ? (
            <div className="col-span-full text-center py-12 glass-panel rounded-2xl border border-cyber-800">
              <Zap className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">No energy offers match your current filter.</p>
              <button
                onClick={() => { setSearchQuery(''); setFilterType('all'); }}
                className="mt-3 text-xs text-emerald-400 hover:underline"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredOffers.map((offer) => {
              const discount = Math.round(((offer.discomPrice - offer.pricePerKwh) / offer.discomPrice) * 100);
              return (
                <div
                  key={offer.id}
                  className="glass-panel rounded-2xl p-5 border border-cyber-800 hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between group shadow-lg"
                >
                  {/* Card Header */}
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-cyber-950 border border-cyber-800 flex items-center justify-center text-xl">
                          {offer.sellerAvatar || '⚡'}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="font-bold text-white text-sm group-hover:text-emerald-400 transition-colors">
                              {offer.sellerName}
                            </h3>
                            {offer.verified && (
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" title="Verified Microgrid Prosumer" />
                            )}
                          </div>
                          <span className="text-[11px] font-mono text-slate-400 block">
                            {offer.node}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded text-[11px] font-mono text-amber-300">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{offer.sellerRating}</span>
                      </div>
                    </div>

                    {/* Source & Badges */}
                    <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[10px] font-mono">
                      <span className="px-2 py-0.5 rounded bg-cyber-950 border border-cyber-800 text-slate-300">
                        {offer.source}
                      </span>
                      {offer.batteryBacked && (
                        <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 flex items-center gap-1">
                          <BatteryCharging className="w-3 h-3" /> BESS Backed
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded bg-cyber-950 border border-cyber-800 text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Exp: {offer.expiresIn}
                      </span>
                    </div>

                    {/* Pricing and Volume Box */}
                    <div className="mt-4 p-3.5 rounded-xl bg-cyber-950/80 border border-cyber-800/80 font-mono">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <div className="text-[10px] text-slate-400 uppercase">Tariff Rate</div>
                          <div className="text-xl font-extrabold text-emerald-400 mt-0.5">
                            {formatCurrency(offer.pricePerKwh)}
                            <span className="text-xs text-slate-400 font-normal"> / kWh</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-[10px] text-slate-400 uppercase">Discom Benchmark</div>
                          <div className="text-xs text-slate-500 line-through">
                            {formatCurrency(offer.discomPrice)} / kWh
                          </div>
                          <div className="text-[10px] text-emerald-400 font-bold">
                            Save {discount}%
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-cyber-800 flex items-center justify-between text-xs">
                        <span className="text-slate-400">Available Energy:</span>
                        <span className="font-bold text-white">{offer.availableKwh} kWh</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Action */}
                  <div className="mt-5 pt-3 border-t border-cyber-800/60 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-400">
                      Min Buy: {offer.minKwh || 1} kWh
                    </span>
                    <button
                      onClick={() => setSelectedOfferForTrade(offer)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-cyber-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-950/40"
                    >
                      <Zap className="w-3.5 h-3.5 fill-cyber-950" />
                      <span>Buy Energy</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 2: IMMUTABLE MICROGRID TRANSACTION LEDGER */}
      {activeTab === 'ledger' && (
        <div className="glass-panel rounded-2xl border border-cyber-800 overflow-hidden">
          <div className="p-4 bg-cyber-900/80 border-b border-cyber-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-400" />
              <h3 className="font-bold text-white text-sm">
                Decentralized Microgrid Settlement Ledger
              </h3>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
              Verified & Settled
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-cyber-950/70 border-b border-cyber-800 text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="p-3.5">Tx ID & Block</th>
                  <th className="p-3.5">Time (IST)</th>
                  <th className="p-3.5">Buyer ➔ Seller</th>
                  <th className="p-3.5">Volume</th>
                  <th className="p-3.5">Tariff</th>
                  <th className="p-3.5">Total Settlement</th>
                  <th className="p-3.5">Saved vs Discom</th>
                  <th className="p-3.5">CO₂ Offset</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyber-800/60">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-cyber-900/50 transition-colors">
                    <td className="p-3.5">
                      <div className="font-bold text-white">{tx.id}</div>
                      <div className="text-[10px] text-purple-400 font-mono truncate max-w-[120px]" title={tx.txHash}>
                        {tx.txHash.slice(0, 10)}...{tx.txHash.slice(-6)}
                      </div>
                    </td>
                    <td className="p-3.5 text-slate-300">
                      <div>{tx.timestamp}</div>
                      <div className="text-[10px] text-slate-500">{tx.date}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="text-white font-medium">{tx.buyer}</div>
                      <div className="text-[10px] text-emerald-400">➔ {tx.seller}</div>
                    </td>
                    <td className="p-3.5 font-bold text-amber-400">
                      {tx.kwh} kWh
                    </td>
                    <td className="p-3.5 text-slate-300">
                      {formatCurrency(tx.unitPrice)}
                    </td>
                    <td className="p-3.5 font-bold text-white">
                      {formatCurrency(tx.totalInr)}
                    </td>
                    <td className="p-3.5 font-bold text-emerald-400">
                      +{formatCurrency(tx.discomSavingsInr)}
                    </td>
                    <td className="p-3.5 text-teal-300">
                      {tx.co2AvoidedKg} kg
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Trade Modal */}
      {selectedOfferForTrade && (
        <TradeModal
          offer={selectedOfferForTrade}
          wallet={wallet}
          onClose={() => setSelectedOfferForTrade(null)}
          onConfirmTrade={onExecuteTrade}
          currency={currency}
        />
      )}

      {/* List Surplus Solar Modal */}
      {isListModalOpen && (
        <ListOfferModal
          wallet={wallet}
          onClose={() => setIsListModalOpen(false)}
          onPublishOffer={onPublishOffer}
        />
      )}
    </div>
  );
}
