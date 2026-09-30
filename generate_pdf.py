import os
from reportlab.lib import colors
from reportlab.lib.pagesizes import landscape, letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether
)
from reportlab.pdfgen import canvas

# Dimensions for Landscape Letter (11 x 8.5 inches = 792 x 612 pt)
PAGE_WIDTH, PAGE_HEIGHT = landscape(letter)

PDF_FILENAME = "EcoGrid_AI_SIH26200_Presentation.pdf"

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        # Draw top accent bar
        self.saveState()
        self.setFillColor(colors.HexColor("#10b981"))
        self.rect(0, PAGE_HEIGHT - 6, PAGE_WIDTH, 6, fill=True, stroke=False)
        
        # Draw bottom footer bar
        self.setFillColor(colors.HexColor("#0f172a"))
        self.rect(0, 0, PAGE_WIDTH, 26, fill=True, stroke=False)
        self.setFillColor(colors.HexColor("#1e293b"))
        self.rect(0, 26, PAGE_WIDTH, 1, fill=True, stroke=False)
        
        # Footer text
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#10b981"))
        self.drawString(36, 10, "EcoGrid AI")
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#94a3b8"))
        self.drawString(95, 10, "|   Smart India Hackathon (SIH26200: Sustainable & Renewable Energy Management)")
        
        page_str = f"Slide {self._pageNumber} of {page_count}"
        self.drawRightString(PAGE_WIDTH - 36, 10, page_str)
        self.restoreState()


def build_pdf(filename=PDF_FILENAME):
    doc = SimpleDocTemplate(
        filename,
        pagesize=(PAGE_WIDTH, PAGE_HEIGHT),
        leftMargin=36,
        rightMargin=36,
        topMargin=26,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()
    
    # Custom Palette
    BG_DARK = colors.HexColor("#090d16")
    CARD_BG = colors.HexColor("#131d35")
    EMERALD = colors.HexColor("#10b981")
    CYAN = colors.HexColor("#06b6d4")
    AMBER = colors.HexColor("#f59e0b")
    RED_ACCENT = colors.HexColor("#ef4444")
    TEXT_LIGHT = colors.HexColor("#f8fafc")
    TEXT_MUTED = colors.HexColor("#94a3b8")
    BORDER_COLOR = colors.HexColor("#1e293b")

    # Typography Styles
    title_style = ParagraphStyle(
        'CoverTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=32,
        leading=38,
        textColor=TEXT_LIGHT,
        alignment=0
    )

    slide_header_style = ParagraphStyle(
        'SlideHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=TEXT_LIGHT
    )

    slide_sub_style = ParagraphStyle(
        'SlideSub',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=13,
        textColor=EMERALD
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=colors.HexColor("#cbd5e1")
    )

    body_bold = ParagraphStyle(
        'BodyBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=13.5,
        textColor=TEXT_LIGHT
    )

    card_header = ParagraphStyle(
        'CardHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        textColor=EMERALD
    )

    notes_style = ParagraphStyle(
        'Notes',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor("#64748b")
    )

    story = []

    def make_header(title, category):
        content = [
            Paragraph(f"<b>{category.upper()}</b>", slide_sub_style),
            Spacer(1, 2),
            Paragraph(f"<b>{title}</b>", slide_header_style),
            Spacer(1, 10),
        ]
        return content

    # -------------------------------------------------------------
    # SLIDE 1: TITLE SLIDE
    # -------------------------------------------------------------
    story.append(Spacer(1, 40))
    badge = Table(
        [[Paragraph("<b>SMART INDIA HACKATHON 2026  •  PROBLEM STATEMENT: SIH26200</b>", ParagraphStyle('Badge', fontName='Helvetica-Bold', fontSize=10, textColor=EMERALD))]],
        style=[
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#064e3b")),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#10b981")),
            ('TOPPADDING', (0,0), (-1,-1), 4),
            ('BOTTOMPADDING', (0,0), (-1,-1), 4),
            ('LEFTPADDING', (0,0), (-1,-1), 10),
            ('RIGHTPADDING', (0,0), (-1,-1), 10),
        ]
    )
    story.append(badge)
    story.append(Spacer(1, 18))
    story.append(Paragraph("<b>EcoGrid AI</b>", title_style))
    story.append(Spacer(1, 6))
    story.append(Paragraph("<b>Smart Microgrid & Peer-to-Peer (P2P) Clean Energy Management Platform</b>", ParagraphStyle('Sub', fontName='Helvetica', fontSize=14, leading=18, textColor=CYAN)))
    story.append(Spacer(1, 20))

    meta_table = Table(
        [
            [Paragraph("<b>Theme:</b>", body_bold), Paragraph("Sustainable & Renewable Energy Management", body_style),
             Paragraph("<b>Prototype:</b>", body_bold), Paragraph("Full-Stack Interactive MVP (React + Express)", body_style)],
            [Paragraph("<b>Target Discoms:</b>", body_bold), Paragraph("State Utilities & Local Urban Microgrids", body_style),
             Paragraph("<b>IEEE Standard:</b>", body_bold), Paragraph("IEEE 2030.5 DER / IEEE 1547 Microgrid Compliant", body_style)],
            [Paragraph("<b>Core Innovation:</b>", body_bold), Paragraph("Autonomous P2P Order Matching & Physics-Informed ML", body_style),
             Paragraph("<b>Live Demo:</b>", body_bold), Paragraph("http://localhost:5173 (Port 5000 API)", body_style)],
        ],
        colWidths=[100, 240, 100, 280],
        style=[
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#0f172a")),
            ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
            ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
            ('TOPPADDING', (0,0), (-1,-1), 8),
            ('BOTTOMPADDING', (0,0), (-1,-1), 8),
            ('LEFTPADDING', (0,0), (-1,-1), 10),
            ('RIGHTPADDING', (0,0), (-1,-1), 10),
        ]
    )
    story.append(meta_table)
    story.append(Spacer(1, 35))
    story.append(Paragraph("<i><b>Presenter Script:</b> Welcome jury members. Conventional grids are centralized and suffer massive transmission losses. EcoGrid AI is a decentralized operating system allowing local communities to generate, forecast, and trade renewable electricity peer-to-peer.</i>", notes_style))
    story.append(PageBreak())

    # -------------------------------------------------------------
    # SLIDE 2: THE PROBLEM STATEMENT & GROUND REALITY
    # -------------------------------------------------------------
    story.extend(make_header("The Crisis in Conventional Energy Distribution", "Problem Context & Industry Pain Points"))
    
    col1 = [
        Paragraph("<b>1. High T&D Transmission Loss (18% - 25%)</b>", card_header),
        Spacer(1, 4),
        Paragraph("Electricity generated in remote coal plants travels hundreds of kilometers over high-voltage lines, losing almost a quarter of all generated energy as heat before reaching homes.", body_style),
        Spacer(1, 10),
        Paragraph("<b>2. Solar Curtailment & Duck Curves</b>", card_header),
        Spacer(1, 4),
        Paragraph("Solar arrays peak aggressively between 11:00 AM and 2:30 PM. Without local demand matching or flexible storage, massive green energy is dumped or curtailed.", body_style)
    ]

    col2 = [
        Paragraph("<b>3. The Unfair Consumer/Prosumer Pricing Trap</b>", card_header),
        Spacer(1, 4),
        Paragraph("• Consumers pay heavy peak rates: <b>₹7.50 to ₹12.00/kWh</b>.<br/>• Solar rooftop owners receive only <b>₹2.00 to ₹2.50/kWh</b> under traditional net-metering buyback, killing adoption ROI.", body_style),
        Spacer(1, 10),
        Paragraph("<b>4. Substation Blackouts & Peak Spikes</b>", card_header),
        Spacer(1, 4),
        Paragraph("Local distribution transformers overheat during evening peaks (6 PM to 10 PM) due to zero coordinated battery storage (BESS) dispatch.", body_style)
    ]

    p_table = Table([[col1, col2]], colWidths=[350, 370], style=[
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#0f172a")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#334155")),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 14),
        ('BOTTOMPADDING', (0,0), (-1,-1), 14),
        ('LEFTPADDING', (0,0), (-1,-1), 14),
        ('RIGHTPADDING', (0,0), (-1,-1), 14),
    ])
    story.append(p_table)
    story.append(Spacer(1, 20))
    story.append(Paragraph("<i><b>Presenter Script:</b> Current net-metering rewards utilities rather than citizens. Rooftop solar owners receive pennies, while neighbors pay steep coal tariffs. Our problem statement demands a democratic, efficient microgrid model.</i>", notes_style))
    story.append(PageBreak())

    # -------------------------------------------------------------
    # SLIDE 3: PROPOSED SOLUTION & CORE INNOVATION
    # -------------------------------------------------------------
    story.extend(make_header("EcoGrid AI — Decentralizing Clean Energy", "Proposed Architecture & Core Solution"))
    
    sol_boxes = [
        [
            Paragraph("<b>P2P Energy Trading Market</b>", card_header),
            Paragraph("Allows rooftop solar owners (Prosumers) to sell surplus power directly to neighbors at ~₹4.20/kWh, saving buyers 44% and doubling seller profits.", body_style)
        ],
        [
            Paragraph("<b>Physics-Informed AI Forecaster</b>", card_header),
            Paragraph("Uses temperature, sunlight hours, and cloud cover to forecast 24-hour PV yields, scheduling battery charging before weather dips occur.", body_style)
        ],
        [
            Paragraph("<b>Autonomous Auto-Pilot Engine</b>", card_header),
            Paragraph("Algorithmic smart-agent that auto-sells surplus when battery > 80% and snipes cheap clean energy during off-peak dips.", body_style)
        ],
        [
            Paragraph("<b>Verifiable Settlement Ledger</b>", card_header),
            Paragraph("Cryptographic block-style transaction ledger providing immutable audit trails, Discom tariff savings receipts, and green RET tokens.", body_style)
        ]
    ]

    sol_table = Table(
        [
            [sol_boxes[0][0], sol_boxes[1][0]],
            [sol_boxes[0][1], sol_boxes[1][1]],
            [sol_boxes[2][0], sol_boxes[3][0]],
            [sol_boxes[2][1], sol_boxes[3][1]],
        ],
        colWidths=[360, 360],
        style=[
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#0f172a")),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#10b981")),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('TOPPADDING', (0,0), (-1,-1), 8),
            ('BOTTOMPADDING', (0,0), (-1,-1), 8),
            ('LEFTPADDING', (0,0), (-1,-1), 12),
            ('RIGHTPADDING', (0,0), (-1,-1), 12),
            ('LINEBELOW', (0,1), (1,1), 0.5, BORDER_COLOR),
        ]
    )
    story.append(sol_table)
    story.append(Spacer(1, 20))
    story.append(Paragraph("<i><b>Presenter Script:</b> EcoGrid AI turns passive electricity consumers into an active, self-balancing energy economy. Electricity stays within the local transformer loop, dropping losses to under 1%.</i>", notes_style))
    story.append(PageBreak())

    # -------------------------------------------------------------
    # SLIDE 4: SYSTEM ARCHITECTURE & TECH STACK
    # -------------------------------------------------------------
    story.extend(make_header("End-to-End Cyber-Physical System Architecture", "Technical Framework & Ingestion Pipeline"))

    arch_rows = [
        [Paragraph("<b>LAYER</b>", body_bold), Paragraph("<b>COMPONENTS & TECHNOLOGIES</b>", body_bold), Paragraph("<b>PRIMARY FUNCTION</b>", body_bold)],
        [
            Paragraph("<b>Edge & DER</b>", body_style),
            Paragraph("Rooftop Monocrystalline PV, Bifacial Arrays, LiFePO4 BESS Storage, Bidirectional Smart Inverters", body_style),
            Paragraph("Physical clean power generation, localized DC storage, and household load dispatch", body_style)
        ],
        [
            Paragraph("<b>Backend API</b>", body_style),
            Paragraph("Node.js, Express.js REST API, JSON Telemetry Ingestion, Dynamic Orderbook Matcher", body_style),
            Paragraph("Executes sub-10ms atomic trade settlements, manages wallets, and logs ledger blocks", body_style)
        ],
        [
            Paragraph("<b>AI Forecasting</b>", body_style),
            Paragraph("Diurnal Solar Azimuth Model, Thermal Silicon Derating Engine, Cloud Optical Attenuation", body_style),
            Paragraph("Predicts 24-hr hour-by-hour kWh production and flags optimal BESS charge windows", body_style)
        ],
        [
            Paragraph("<b>Frontend UI</b>", body_style),
            Paragraph("React 19, Vite, Tailwind CSS, Recharts Telemetry Charts, Lucide-React Icons, Confetti Engine", body_style),
            Paragraph("Responsive cyber-slate dashboard with live real-time telemetry streaming and trading modals", body_style)
        ]
    ]

    arch_table = Table(arch_rows, colWidths=[100, 360, 260], style=[
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#064e3b")),
        ('BACKGROUND', (0,1), (-1,-1), colors.HexColor("#0f172a")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#10b981")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0,0), (-1,-1), 7),
        ('BOTTOMPADDING', (0,0), (-1,-1), 7),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ])
    story.append(arch_table)
    story.append(Spacer(1, 25))
    story.append(Paragraph("<i><b>Presenter Script:</b> Our architecture is modular and DER-ready. We designed a dual-mode service layer so the entire platform operates live via Express or standalone with zero external database dependencies.</i>", notes_style))
    story.append(PageBreak())

    # -------------------------------------------------------------
    # SLIDE 5: MANDATORY CORE MODULES (LIVE WORKING MVP)
    # -------------------------------------------------------------
    story.extend(make_header("Live Functional Modules — Ready for Evaluation", "Smart India Hackathon Deliverables"))

    mod_data = [
        [
            Paragraph("<b>Module 1: Real-Time Telemetry Dashboard</b>", card_header),
            Paragraph("<b>Module 2: AI Solar Generation Forecaster</b>", card_header)
        ],
        [
            Paragraph("• Key KPIs: Total Solar (kWh), Grid Demand (kW), Battery SoC (%), Carbon Avoided (kg CO₂).<br/>• 24-Hour Generation vs. Consumption Recharts curve.<br/>• Live Microgrid Nodes status (Alpha, Beta, Gamma, EV Sink).", body_style),
            Paragraph("• Interactive Sliders: Temperature (10-50°C), Sun Hours (2-10h), Cloud Cover %, Array Capacity.<br/>• Empirical PV yield formula calculation with 24-hr hourly projection.<br/>• Automated AI dispatch advisory notices.", body_style)
        ],
        [
            Paragraph("<b>Module 3: P2P Trading Marketplace</b>", card_header),
            Paragraph("<b>Module 4: Carbon Impact & Savings Calculator</b>", card_header)
        ],
        [
            Paragraph("• Active local prosumer orderbook with ratings and verified flags.<br/>• Interactive Buy Modal with instant wallet deduction and celebration.<br/>• Prosumer Surplus Listing Drawer & Immutable Settlement Ledger.", body_style),
            Paragraph("• Monthly consumption & tariff sliders (₹5 to ₹12/kWh).<br/>• Quantified Trees Planted, Coal Avoided, and EV km Powered.<br/>• 10-Year compounding expenditure bar chart vs fossil utility inflation.", body_style)
        ]
    ]

    mod_table = Table(mod_data, colWidths=[360, 360], style=[
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#0f172a")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#334155")),
        ('LINEBELOW', (0,1), (1,1), 1, colors.HexColor("#10b981")),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
        ('RIGHTPADDING', (0,0), (-1,-1), 12),
    ])
    story.append(mod_table)
    story.append(Spacer(1, 20))
    story.append(Paragraph("<i><b>Presenter Script:</b> All four mandatory modules specified in the SIH problem statement are 100% built, fully interactive, and running right now on our dev server.</i>", notes_style))
    story.append(PageBreak())

    # -------------------------------------------------------------
    # SLIDE 6: MATHEMATICAL MODELING & AI FORECASTING
    # -------------------------------------------------------------
    story.extend(make_header("Physics-Informed Photovoltaic Yield Modeling", "Mathematical Energy Production Model"))

    formula_p = Paragraph(
        "<b>E_daily = P_array  ×  H_sun  ×  [1 - γ · (T_ambient - 25)]  ×  [1 - 0.72 · C_cloud]  ×  η_system</b>",
        ParagraphStyle('Formula', fontName='Helvetica-Bold', fontSize=12, leading=16, textColor=EMERALD, alignment=1)
    )

    f_box = Table([[formula_p]], colWidths=[720], style=[
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#064e3b")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#10b981")),
        ('TOPPADDING', (0,0), (-1,-1), 10),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
    ])
    story.append(f_box)
    story.append(Spacer(1, 12))

    math_rows = [
        [Paragraph("<b>VARIABLE</b>", body_bold), Paragraph("<b>PHYSICAL MEANING</b>", body_bold), Paragraph("<b>DERATING IMPACT & FORMULA VALUE</b>", body_bold)],
        [Paragraph("<b>P_array</b>", body_style), Paragraph("Installed Solar Array Capacity (kWp)", body_style), Paragraph("Nominal STC rating (1 kWp to 40 kWp in simulation)", body_style)],
        [Paragraph("<b>H_sun</b>", body_style), Paragraph("Effective Peak Sun Hours", body_style), Paragraph("Direct solar irradiation equivalent (typically 4.5h to 8.5h in India)", body_style)],
        [Paragraph("<b>γ · (T - 25)</b>", body_style), Paragraph("Thermal Silicon Derating Coefficient", body_style), Paragraph("γ = 0.004 (0.4% efficiency drop per °C above 25°C standard)", body_style)],
        [Paragraph("<b>1 - 0.72·C</b>", body_style), Paragraph("Cloud Optical Attenuation Factor", body_style), Paragraph("Non-linear atmospheric irradiance scatter from cloud density", body_style)],
        [Paragraph("<b>η_system</b>", body_style), Paragraph("Balance of System (BOS) Efficiency", body_style), Paragraph("86% net factor (incorporates inverter loss, wiring, and soiling/dust)", body_style)]
    ]

    math_table = Table(math_rows, colWidths=[110, 270, 340], style=[
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#1e293b")),
        ('BACKGROUND', (0,1), (-1,-1), colors.HexColor("#0f172a")),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ])
    story.append(math_table)
    story.append(Spacer(1, 15))
    story.append(Paragraph("<i><b>Presenter Script:</b> Unlike generic regression formulas, our model incorporates silicon thermal coefficients and optical scatter, matching real Indian meteorological conditions across hot summers and monsoon cloud cover.</i>", notes_style))
    story.append(PageBreak())

    # -------------------------------------------------------------
    # SLIDE 7: BUSINESS MODEL & ECONOMIC FEASIBILITY
    # -------------------------------------------------------------
    story.extend(make_header("Triple-Win Economic Feasibility & Monetization", "Market Viability & Business Architecture"))

    eco_rows = [
        [Paragraph("<b>STAKEHOLDER</b>", body_bold), Paragraph("<b>TRADITIONAL GRID REALITY</b>", body_bold), Paragraph("<b>ECOGRID AI PARADIGM</b>", body_bold), Paragraph("<b>DIRECT BENEFIT</b>", body_bold)],
        [
            Paragraph("<b>Energy Consumer (Buyer)</b>", body_bold),
            Paragraph("Pays ₹7.50 to ₹12.00/unit to state Discom utilities for coal electricity.", body_style),
            Paragraph("Buys community clean solar power at <b>₹3.90 to ₹4.50/unit</b> directly from neighbors.", body_style),
            Paragraph("<b>Saves 40% - 48%</b> on monthly electricity expenditure.", body_style)
        ],
        [
            Paragraph("<b>Solar Prosumer (Seller)</b>", body_bold),
            Paragraph("Earns only ₹2.00 to ₹2.50/unit under Discom net-metering buyback.", body_style),
            Paragraph("Sells surplus clean generation directly on the P2P market at <b>₹4.20/unit</b>.", body_style),
            Paragraph("<b>Earns ~90% more income</b>; reduces rooftop ROI to 3.8 years.", body_style)
        ],
        [
            Paragraph("<b>Discom Utility Operator</b>", body_bold),
            Paragraph("Spends heavy capital on substation peak reinforcement & transmission lines.", body_style),
            Paragraph("Discom earns a <b>₹0.30/kWh micro-wheeling fee</b> for transit through existing wires.", body_style),
            Paragraph("Avoids buying expensive spot-market peak power.", body_style)
        ],
        [
            Paragraph("<b>Platform Operator</b>", body_bold),
            Paragraph("N/A", body_style),
            Paragraph("Charges a 2.5% settlement fee on matched P2P micro-transactions + B2B SaaS.", body_style),
            Paragraph("Sustainable high-margin revenue model.", body_style)
        ]
    ]

    eco_table = Table(eco_rows, colWidths=[120, 200, 240, 160], style=[
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#064e3b")),
        ('BACKGROUND', (0,1), (-1,-1), colors.HexColor("#0f172a")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#10b981")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0,0), (-1,-1), 7),
        ('BOTTOMPADDING', (0,0), (-1,-1), 7),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ])
    story.append(eco_table)
    story.append(Spacer(1, 20))
    story.append(Paragraph("<i><b>Presenter Script:</b> Notice that the utility company is not replaced—they are partnered with. Discoms earn transit wheeling revenue without spending on substation upgrades.</i>", notes_style))
    story.append(PageBreak())

    # -------------------------------------------------------------
    # SLIDE 8: ENVIRONMENTAL IMPACT & UN SDGS
    # -------------------------------------------------------------
    story.extend(make_header("Quantified Environmental Impact & ESG Alignment", "Sustainability & Decarbonization Footprint"))

    kpi_boxes = [
        [
            Paragraph("<b>4.40 METRIC TONS</b>", ParagraphStyle('KpiVal', fontName='Helvetica-Bold', fontSize=16, textColor=EMERALD, alignment=1)),
            Paragraph("Annual CO₂ Avoided per household", ParagraphStyle('KpiSub', fontName='Helvetica', fontSize=8.5, textColor=TEXT_LIGHT, alignment=1))
        ],
        [
            Paragraph("<b>203 TREES</b>", ParagraphStyle('KpiVal', fontName='Helvetica-Bold', fontSize=16, textColor=CYAN, alignment=1)),
            Paragraph("Mature Trees planted equivalent", ParagraphStyle('KpiSub', fontName='Helvetica', fontSize=8.5, textColor=TEXT_LIGHT, alignment=1))
        ],
        [
            Paragraph("<b>4,482 KG</b>", ParagraphStyle('KpiVal', fontName='Helvetica-Bold', fontSize=16, textColor=AMBER, alignment=1)),
            Paragraph("Thermal coal combustion avoided", ParagraphStyle('KpiSub', fontName='Helvetica', fontSize=8.5, textColor=TEXT_LIGHT, alignment=1))
        ],
        [
            Paragraph("<b>37,800 KM</b>", ParagraphStyle('KpiVal', fontName='Helvetica-Bold', fontSize=16, textColor=colors.HexColor("#c084fc"), alignment=1)),
            Paragraph("Clean Electric Vehicle km powered", ParagraphStyle('KpiSub', fontName='Helvetica', fontSize=8.5, textColor=TEXT_LIGHT, alignment=1))
        ]
    ]

    impact_table = Table(
        [[kpi_boxes[0], kpi_boxes[1], kpi_boxes[2], kpi_boxes[3]]],
        colWidths=[175, 175, 175, 175],
        style=[
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#0f172a")),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#334155")),
            ('TOPPADDING', (0,0), (-1,-1), 12),
            ('BOTTOMPADDING', (0,0), (-1,-1), 12),
        ]
    )
    story.append(impact_table)
    story.append(Spacer(1, 20))

    sdg_data = [
        [Paragraph("<b>UN SDG GOAL</b>", body_bold), Paragraph("<b>HOW ECOGRID AI DELIVERS DIRECT COMPLIANCE</b>", body_bold)],
        [Paragraph("<b>SDG 7: Affordable & Clean Energy</b>", body_style), Paragraph("Democratizes solar power by reducing unit costs to ₹4.20/kWh for low and middle-income families.", body_style)],
        [Paragraph("<b>SDG 9: Industry, Innovation & Infra</b>", body_style), Paragraph("Upgrades antiquated radial distribution grids into self-healing, smart bidirectional microgrids.", body_style)],
        [Paragraph("<b>SDG 11: Sustainable Cities & Communities</b>", body_style), Paragraph("Fosters localized energy independence, islanding protection, and resilient residential societies.", body_style)],
        [Paragraph("<b>SDG 13: Climate Action</b>", body_style), Paragraph("Directly abates carbon emissions at the point of consumption, replacing thermal grid dispatch.", body_style)]
    ]

    sdg_table = Table(sdg_data, colWidths=[240, 480], style=[
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#064e3b")),
        ('BACKGROUND', (0,1), (-1,-1), colors.HexColor("#0f172a")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#10b981")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ])
    story.append(sdg_table)
    story.append(Spacer(1, 15))
    story.append(Paragraph("<i><b>Presenter Script:</b> Based on the Central Electricity Authority (CEA) emission factor of 0.82 kg CO2 per kWh, each typical residential society running on EcoGrid AI eliminates hundreds of metric tons of greenhouse gas annually.</i>", notes_style))
    story.append(PageBreak())

    # -------------------------------------------------------------
    # SLIDE 9: COMPETITIVE ADVANTAGE MATRIX
    # -------------------------------------------------------------
    story.extend(make_header("Competitive Differentiation & Industry Benchmark", "Why EcoGrid AI Outperforms Existing Systems"))

    comp_rows = [
        [Paragraph("<b>CRITERIA</b>", body_bold), Paragraph("<b>TRADITIONAL GRID</b>", body_bold), Paragraph("<b>GOVT NET-METERING</b>", body_bold), Paragraph("<b>BLOCKCHAIN P2P (POWERLEDGER)</b>", body_bold), Paragraph("<b>ECOGRID AI (OUR SOLUTION)</b>", body_bold)],
        [Paragraph("<b>T&D Energy Loss</b>", body_style), Paragraph("18% - 25%", body_style), Paragraph("12% - 18%", body_style), Paragraph("< 2%", body_style), Paragraph("<b>< 0.8% (DC-Coupled Microgrid)</b>", body_bold)],
        [Paragraph("<b>Consumer Cost</b>", body_style), Paragraph("₹7.50 - ₹12.00", body_style), Paragraph("₹7.50", body_style), Paragraph("₹5.50 + Gas Fees", body_style), Paragraph("<b>₹3.90 - ₹4.50 (44% Cheaper)</b>", body_bold)],
        [Paragraph("<b>Prosumer Feed-In</b>", body_style), Paragraph("None", body_style), Paragraph("₹2.00 - ₹2.50", body_style), Paragraph("₹3.80", body_style), Paragraph("<b>₹4.20 (Double Seller Income)</b>", body_bold)],
        [Paragraph("<b>AI Yield Forecaster</b>", body_style), Paragraph("None", body_style), Paragraph("None", body_style), Paragraph("Basic Moving Avg", body_style), Paragraph("<b>Physics-Informed Hourly Model</b>", body_bold)],
        [Paragraph("<b>Autonomous Bot</b>", body_style), Paragraph("None", body_style), Paragraph("None", body_style), Paragraph("Manual Bidding", body_style), Paragraph("<b>Smart Arbitrage Auto-Pilot</b>", body_bold)],
        [Paragraph("<b>Deployment Barrier</b>", body_style), Paragraph("High Substation CapEx", body_style), Paragraph("Bureaucratic Delay", body_style), Paragraph("Crypto Wallet Friction", body_style), Paragraph("<b>Instant Zero-Config Web App</b>", body_bold)]
    ]

    comp_table = Table(comp_rows, colWidths=[140, 130, 130, 160, 160], style=[
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#1e293b")),
        ('BACKGROUND', (0,1), (-1,-1), colors.HexColor("#0f172a")),
        ('BACKGROUND', (4,1), (4,-1), colors.HexColor("#064e3b")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#10b981")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ])
    story.append(comp_table)
    story.append(Spacer(1, 20))
    story.append(Paragraph("<i><b>Presenter Script:</b> While existing blockchain attempts failed due to gas fees and technical complexity, EcoGrid AI combines high-frequency web architecture with frictionless INR fiat settlement.</i>", notes_style))
    story.append(PageBreak())

    # -------------------------------------------------------------
    # SLIDE 10: FUTURE ROADMAP & PILOT DEPLOYMENT
    # -------------------------------------------------------------
    story.extend(make_header("Future Roadmap & Commercial Scalability", "Phased Commercialization Strategy"))

    road_rows = [
        [Paragraph("<b>PHASE & TIMELINE</b>", body_bold), Paragraph("<b>MILESTONES & CORE DELIVERABLES</b>", body_bold), Paragraph("<b>REGULATORY & INFRASTRUCTURE GOALS</b>", body_bold)],
        [
            Paragraph("<b>Phase 1<br/>(Present MVP)</b>", body_bold),
            Paragraph("• Working full-stack prototype with live telemetry, AI forecaster, P2P orderbook, and ledger.<br/>• Zero-database friction; interactive demo deployed.", body_style),
            Paragraph("Hackathon validation, proof of concept demonstration, user acceptance testing.", body_style)
        ],
        [
            Paragraph("<b>Phase 2<br/>(Months 1 - 6)</b>", body_bold),
            Paragraph("• Hardware integration with bidirectional smart meters via MODBUS / RS-485 / LoRaWAN.<br/>• Launching pilot deployment in a 100-home residential gated community.", body_style),
            Paragraph("Verification of sub-second IoT telemetry telemetry and relay islanding.", body_style)
        ],
        [
            Paragraph("<b>Phase 3<br/>(Months 6 - 12)</b>", body_bold),
            Paragraph("• Integration with state Discom regulatory sandboxes (e.g. UPERC & KERC P2P guidelines).<br/>• Automated wheeling fee disbursement and discom tariff integration.", body_style),
            Paragraph("Formal regulatory compliance and distribution operator tariff endorsement.", body_style)
        ],
        [
            Paragraph("<b>Phase 4<br/>(Months 12 - 24)</b>", body_bold),
            Paragraph("• Vehicle-to-Grid (V2G) bidirectional charging hubs and commercial virtual power plant (VPP).<br/>• Expansion to commercial SEZs and agrivoltaic agricultural feeders.", body_style),
            Paragraph("Multi-megawatt decentralized community grid operation.", body_style)
        ]
    ]

    road_table = Table(road_rows, colWidths=[120, 360, 240], style=[
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#064e3b")),
        ('BACKGROUND', (0,1), (-1,-1), colors.HexColor("#0f172a")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#10b981")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0,0), (-1,-1), 7),
        ('BOTTOMPADDING', (0,0), (-1,-1), 7),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ])
    story.append(road_table)
    story.append(Spacer(1, 25))
    story.append(Paragraph("<i><b>Presenter Script:</b> We have a clear path from today's working prototype to real-world pilot deployment. EcoGrid AI turns every Indian neighborhood into an autonomous, clean energy powerhouse. Thank you!</i>", notes_style))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"[SUCCESS] Successfully generated PDF: {filename}")

if __name__ == '__main__':
    build_pdf()
