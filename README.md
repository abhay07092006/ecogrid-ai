# ⚡ EcoGrid AI — Smart Microgrid & Renewable Energy Platform
### Smart India Hackathon Prototype (Problem Statement: SIH26200 — Sustainable & Renewable Energy Management)

> **EcoGrid AI** is an end-to-end, decentralized microgrid energy management and Peer-to-Peer (P2P) trading platform. It unites real-time Internet-of-Things (IoT) telemetry, mathematical photovoltaic yield forecasting, automated demand-response heuristics, and trustless local energy commerce into a modern cyber-slate & eco-green command dashboard.

---

## 🌟 Key Problem Addressed (SIH26200)
Conventional energy distribution models suffer from:
1. **Severe Transmission & Distribution (T&D) Losses**: Long-distance high-voltage lines lose 18–25% of generated electricity.
2. **Solar Curtailment & Duck Curves**: Daytime residential and commercial solar generation surges without localized market incentives, leading to curtailment.
3. **High Utility Tariffs**: Consumers pay ₹7.50 to ₹12.00/kWh to coal-heavy Discom utilities while local solar prosumers receive minimal feed-in tariffs.
4. **Grid Instability**: Lack of localized battery energy storage (BESS) coordination causes voltage fluctuations and substation blackouts.

### The EcoGrid AI Solution
EcoGrid AI enables prosumers (residential rooftops, commercial solar arrays, agrivoltaic farms) to sell surplus clean energy directly to nearby community consumers at an average discount of **40–50% vs Discom utility tariffs** (e.g. ₹4.20/kWh vs ₹7.50/kWh), retaining economic value locally while eliminating transmission losses.

---

## 🚀 Core Modules Implemented

### 1. 📊 Real-Time Energy Telemetry Dashboard
- **Live Key Performance Indicators (KPIs)**:
  - **Total Solar Generated (kWh)**: Cumulative clean energy with current generation rate (kW).
  - **Grid Load Demand (kW)**: Real-time community power consumption and net export/import surplus indicator.
  - **Battery Storage (BESS) Capacity (%)**: Dynamic state-of-charge (SoC) gauge with stored energy (kWh) and battery health (LiFePO4).
  - **Carbon Avoided (kg CO₂)**: Quantified emissions reduction and grid independence ratio.
- **Dynamic 24-Hour Telemetry Curves**: High-frequency diurnal charts built using Recharts featuring channel filters (Solar Gen, Load Demand, Battery SoC, P2P Volume).
- **Microgrid Node Inspector**: Live status of connected prosumer houses, commercial parks, battery storage banks, and high-demand EV charging sinks.

### 2. 🧠 AI Solar Generation Forecaster
- **Interactive Meteorological Sliders**:
  - Ambient Temperature: $10^\circ\text{C}$ to $50^\circ\text{C}$
  - Peak Sunlight Hours: $2.0\text{h}$ to $10.0\text{h}$
  - Cloud Cover Density: $0\%$ to $100\%$
  - Installed Array Capacity: $1\text{ kWp}$ to $40\text{ kWp}$
- **Empirical Photovoltaic Production Formula**:
  $$E_{\text{yield}} = P_{\text{array}} \times H_{\text{sun}} \times [1 - \gamma \cdot (T - 25)] \times [1 - 0.72 \cdot C_{\text{cloud}}] \times \eta_{\text{system}}$$
- **Hourly 24-Hour Yield Projection**: Visualizes the bell-curve irradiance profile with confidence intervals and ambient temperature tracking.
- **AI Smart Grid Advisories**: Automated recommendations pinpointing optimal surplus export windows, battery fast-charging schedules, and cloud-attenuation alerts.
- **1-Click Presets**: Clear Summer, Partly Cloudy, Heavy Overcast, and Heatwave.

### 3. ⚡ P2P Energy Trading Marketplace
- **Real-Time Community Orderbook**: Active energy offers with seller identity, star rating, verified prosumer badge, available kWh, asking rate in ₹, and battery backup indicator.
- **Interactive "Buy Energy" Modal**:
  - Dynamic kWh slider with quick presets (5 kWh, 10 kWh, MAX).
  - Instant calculation of total cost, savings vs Discom benchmark rate (₹7.50/kWh), and CO₂ avoided.
  - One-click atomic purchase execution, automatic wallet deduction, and green confetti celebration.
- **"List Surplus Solar" Drawer**: Allows prosumers to publish excess power to the microgrid with price suggestions.
- **Decentralized Settlement Ledger**: Immutable log of completed transactions with cryptographic hashes (`0x8f4c...`), block numbers, timestamps, buyer/seller nodes, and financial totals.
- **Judge Testing Faucet**: Integrated wallet modal enabling instant demo balance top-ups (+₹500, +₹1,000, +₹2,500) for friction-free evaluation.

### 4. 🌿 Carbon Impact & Savings Calculator
- **Interactive Financial Modeling**:
  - Monthly solar usage slider (100 to 2,500 kWh).
  - Discom utility grid tariff slider (₹5.00 to ₹12.00/kWh).
  - EcoGrid clean rate slider (₹2.50 to ₹6.50/kWh).
  - Rooftop system capacity slider (1 to 25 kW).
- **Direct Financial Output**: Monthly savings, annual savings, capital expenditure break-even timeline (ROI payback horizon).
- **Environmental Equivalency Matrix**:
  - Mature Trees Planted Equivalent (1 tree $\approx 21.8\text{ kg CO}_2/\text{year}$)
  - Raw Coal Burned Avoided ($0.83\text{ kg coal/kWh}$)
  - EV Kilometers Powered ($7.0\text{ km/kWh}$)
  - Commercial Flights Offset
- **10-Year Compounding Comparison Chart**: Bar chart illustrating long-term expenditure between traditional fossil utilities (with 4% annual inflation) and EcoGrid AI.

### 5. 🌐 Network Topology & 🤖 Smart Auto-Pilot
- **Cyber-Physical Topology Map**: Interactive SVG diagram showing bidirectional energy routing between the Central Substation Inverter, Prosumer Homes, Commercial Bifacial Arrays, and EV Charging Stations.
- **Algorithmic Dispatch Auto-Pilot**: Automated rules engine for surplus arbitrage, cheap energy sniping, and emergency blackout buffers.

---

## 🛠️ Tech Stack & Architecture

| Tier | Technologies |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS, Lucide-React, Recharts, Canvas-Confetti |
| **Backend** | Node.js, Express.js, CORS, RESTful API |
| **Data & State** | Dual-mode hybrid architecture: Live REST API with automatic client-side persistence fallback (localStorage) |
| **Theme** | Cyber-slate (`#080d1a`, `#0f172a`) with Eco-green neon accents (`#10b981`, `#34d399`) |

---

## 🏃 Quick Start Guide

### Prerequisites
- Node.js (v18+ recommended, tested on v24.x)
- npm (v9+ recommended)

### Running the Full-Stack Application
To start both the Express backend and the Vite frontend simultaneously:
```bash
# Navigate to the project directory
cd ecogrid-ai

# Start both services with one command
npm run dev
```

Alternatively, you can run them in separate terminals:
```bash
# Terminal 1: Express API Server (Port 5000)
cd server
npm start

# Terminal 2: Vite React Frontend (Port 5173)
cd client
npm run dev
```

Open your browser at:
👉 **`http://localhost:5173`**

---

## 📡 API Endpoints Reference

- `GET /api/telemetry` — Live microgrid generation, load demand, battery SoC, frequency, nodes.
- `GET /api/forecast?temp=32&sunHours=7.5&cloudCover=20&capacity=10` — 24-hour PV forecast and AI dispatch advisories.
- `GET /api/marketplace/offers` — Active peer-to-peer energy orderbook and market statistics.
- `POST /api/marketplace/trade` — Atomic energy trade execution and wallet settlement.
- `POST /api/marketplace/list` — List new surplus power onto the microgrid.
- `GET /api/marketplace/transactions` — Microgrid transaction ledger.
- `GET /api/wallet` & `POST /api/wallet/faucet` — User wallet and balance top-up.
- `GET /api/calculator/savings` — ESG and financial return calculations.

---

## 👥 Hackathon Evaluation Checklist
- [x] **Real-time Telemetry Dashboard**: Solar kWh, Load kW, Battery SoC %, Carbon Avoided, 24-hr Recharts curves.
- [x] **AI Forecaster**: Sliders for Temp, Sun Hours, Cloud %, Capacity kWp with mathematical formula display.
- [x] **P2P Marketplace**: Interactive Buy modal, wallet balance deduction, instant ledger logging, List Surplus form.
- [x] **Carbon Calculator**: Sliders for monthly usage & tariffs, ROI payback, trees/coal/EV equivalents.
- [x] **High Polish UI/UX**: Dark-mode cyber-slate aesthetic, glowing emerald accents, mobile responsiveness.
- [x] **Zero External DB Dependency**: Runs out-of-the-box with dual-mode API and local fallback.
