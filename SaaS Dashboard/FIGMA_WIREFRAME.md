# Figma Wireframe Structure

This document expresses the dashboard as a Figma frame tree. Each frame uses **Auto Layout** unless noted. Recreate this structure in Figma and apply the design tokens from `DESIGN.md` to get a faithful reproduction.

> **How to use this**: In Figma, create a new file. For each section below, create a Frame with the listed properties. Indent = parent/child relationship. Layer names match the tag.

---

## File-level

```
🎨 Pages
  ├── 1_Cover            (presentation cover, optional)
  ├── 2_Design_System    (color/type/component library)
  ├── 3_Dashboard        (main dashboard screen — desktop)
  ├── 4_Sub_Pages        (Analytics / Users / Revenue / Insights / Settings)
  ├── 5_Tablet           (980 px)
  ├── 6_Mobile           (400 px)
  └── 7_Landing          (marketing landing page)
```

---

## Page 2 — Design System (component library)

```
📐 Frame: Tokens                         [Auto-layout: vertical, gap 32]
  ├── 🎨 Frame: Color palette            [Auto-layout: grid 6 columns]
  │     • 14 swatches (each 80×80) labelled with --token name + hex
  ├── ✏️ Frame: Typography scale         [Auto-layout: vertical, gap 12]
  │     • Display 28/700 · H2 24/700 · H3 15/600 · Body 13/400 · Caption 11/500 · Mono 11/500
  ├── 📦 Frame: Spacing scale            [4 · 6 · 8 · 10 · 12 · 14 · 16 · 18 · 20 · 22 · 28 · 32]
  ├── 🟦 Frame: Radius scale             [6 · 8 · 10 · 12 · 14 · 18 · 20 · 28]
  └── 💫 Frame: Shadow & glow            [4 examples: card, primary, AI orb, anomaly]

📦 Frame: Components                     [Master components on this page]
  • Button / Primary
  • Button / Ghost
  • Button / Icon
  • Chip / Default · Active
  • Pill / Trend Up · Trend Down · Impact High · Impact Mid · Plan-Ent · Plan-Pro
  • Card / Default · Anomaly
  • Avatar / Small · Large
  • Toggle / On · Off
  • Toast / Success · Info · Warn
  • KPI Card (master component with variants)
  • Insight Row / Warn · Ok · Info
  • Action Row
  • Activity Item / Signup · Payment · Alert · User
  • Chat Message / AI · User
  • Nav Item / Default · Active
  • Funnel Row
  • Cohort Cell (with intensity variants)
```

---

## Page 3 — Dashboard (1440 × 900 desktop frame)

```
🖼  Frame: Dashboard_1440             [Fill: --bg-0]
   │   Layout: Horizontal · Padding 0 · Gap 0
   │
   ├── 🎚 Frame: Ambient                [Absolute, z-index back]
   │     ├── ⚪ Ellipse: Glow_Indigo    [W 480, H 480, fill #4F46E5, blur 80, opacity 0.30, top -140 left -120]
   │     └── ⚪ Ellipse: Glow_Cyan      [W 420, H 420, fill #22D3EE, blur 80, opacity 0.30, bottom -160 right 10%]
   │
   ├── 📌 Sidebar                       [W 260, H fill, padding 22 16, gap 22]
   │   │   Fill: linear gradient #0F172A 92% → #020617 92%
   │   │   Border-right: 1 px rgba(255,255,255,0.08)
   │   │
   │   ├── Brand                       [Horizontal, gap 12, padding-bottom 14, border-bottom]
   │   │     ├── 🟦 Brand_Mark         [38×38, radius 10, gradient #4F46E5→#A78BFA, glow]
   │   │     │     └── 📐 Cube icon (white)
   │   │     └── Vertical
   │   │           ├── Text: "mynickname" [Inter 16/700]
   │   │           └── Text: "AI Copilot"  [11/400, --text-dim]
   │   │
   │   ├── Nav                         [Vertical, gap 2]
   │   │     ├── Section_Header: "WORKSPACE"
   │   │     ├── Nav_Item / Active: ⊞ Dashboard
   │   │     ├── Nav_Item: ↗ Analytics
   │   │     ├── Nav_Item: 👥 Users
   │   │     ├── Nav_Item: $ Revenue
   │   │     ├── Nav_Item: ✦ AI Insights [+ Badge "12"]
   │   │     ├── Section_Header: "ACCOUNT"
   │   │     └── Nav_Item: ⚙ Settings
   │   │
   │   └── Upgrade_Card                 [Padding 18, radius 20, gradient bg with aura]
   │         ├── Icon: ✦ (cyan)
   │         ├── Title: "Unlock Predictive AI"
   │         ├── Subtitle: "Forecast churn 30 days ahead"
   │         └── Button / Primary: "Upgrade Pro"
   │
   └── 🖼  Main                         [Fill, padding 22 32 40, gap 22]
       │
       ├── Topbar                       [Horizontal, gap 16, height 56]
       │     ├── Search_Bar (Ask AI)    [Flex 1, padding 10 16, radius 14]
       │     │     ├── Icon_Tile (gradient)
       │     │     ├── Input "Ask anything…" [placeholder]
       │     │     └── Kbd "⌘K"
       │     ├── Icon_Button: 🔄
       │     ├── Icon_Button: 🔔 (with red dot indicator)
       │     └── Profile_Chip          [Pill, avatar + name + role]
       │
       ├── Hero_Greeting                [Horizontal, space-between]
       │     ├── Vertical
       │     │     ├── Live_Pill: "● Live · Updated 14 sec ago"
       │     │     ├── H1: "Good evening, Yamini." [gradient text]
       │     │     └── Body: "Your business added $24,180 today…"
       │     └── Horizontal (actions)
       │           ├── Button / Ghost: "Last 7 days ▾"
       │           └── Button / Primary: "✦ Generate Report"
       │
       ├── KPI_Strip                    [Horizontal grid, 4 columns, gap 16]
       │     ├── KPI_Card / MRR         [variant: default, sparkline cyan]
       │     ├── KPI_Card / Users       [variant: default, sparkline purple]
       │     ├── KPI_Card / Churn       [variant: ANOMALY — red border + glow + ⚠ tag]
       │     └── KPI_Card / Growth      [variant: default, sparkline green]
       │
       ├── Grid_2col                    [2 columns 1.45fr / 1fr, gap 16]
       │     ├── Column 1 (vertical, gap 16)
       │     │     ├── Chart_Card                [Revenue & Forecast]
       │     │     │     ├── Card_Head: title + chip-row [Revenue·Users·Retention]
       │     │     │     ├── Chart_Wrap (280 px tall)
       │     │     │     │     • Solid line: actual (blue)
       │     │     │     │     • Dashed line: AI forecast (purple)
       │     │     │     │     • Translucent fill: confidence band (cyan 10%)
       │     │     │     └── Legend (3 items, dot + label)
       │     │     ├── Insights_Card
       │     │     │     ├── Card_Head + Live_Pill
       │     │     │     ├── Insight / Warn: "EU revenue dropped 12%"
       │     │     │     ├── Insight / Ok:   "Pro upgrades up 31%"
       │     │     │     └── Insight / Info: "India is your fastest-growing market"
       │     │     └── Actions_Card
       │     │           ├── Action_Row × 3 (last is primary Run)
       │     │
       │     └── Column 2 (vertical, gap 16)
       │           ├── Copilot_Card     [spans full height of column 1; min 600 px]
       │           │     ├── Header: orb + title + new-chat icon
       │           │     ├── Chat_Scroll (3 messages: AI · user · AI)
       │           │     │     • AI_Message bubble (avatar ✦)
       │           │     │       └── Reason_List (red/amber/cyan dots)
       │           │     │       └── Suggest_Chips ["Show me why", "Auto-fix it"]
       │           │     │     • User_Message bubble (gradient blue)
       │           │     │     • AI_Message bubble
       │           │     └── Chat_Input (input + gradient send button)
       │           ├── Activity_Card
       │           │     ├── Card_Head + Live_Pill
       │           │     └── Activity_List (6 items, prepended live)
       │           └── Segment_Card
       │                 ├── Card_Head
       │                 └── Segment_Body (donut + legend)
       │                       ├── Donut_Wrap (140×140)
       │                       └── Segment_Legend (4 rows, dot + label + percent)
       │
       └── Footer                       [Horizontal, space-between, --text-faint]
             ├── Text: "mynickname · AI-native analytics"
             └── Text: "All systems normal · 99.99% uptime"
```

---

## Page 4 — Sub-pages (each is a separate frame, sharing topbar)

### Frame: Analytics
```
└── Page_Head: H1 "Analytics" + actions [Last 30 days · Export CSV]
└── KPI_Strip × 4 (Sessions, Conversion, Avg session, Bounce)
└── Two_Col
      ├── Funnel_Card (5 rows, gradient bars)
      └── AI_Diagnosis_Card (3 insights)
└── Cohort_Card (table 4 cohorts × 6 weeks)
```

### Frame: Users
```
└── Page_Head: H1 "Users"
└── KPI_Strip × 4
└── Directory_Card
      ├── Chip_Row [All · Enterprise · Pro · At-risk]
      └── User_Table (6 rows, columns: User · Plan · MRR · Last active · Risk bar)
```

### Frame: Revenue
```
└── Page_Head + Generate Invoice
└── KPI_Strip × 4
└── Two_Col
      ├── MRR_Movement_Card (6 stat rows, last is Net total)
      └── Top_Customers_Card (5 rows)
└── Pricing_Suggestions_Card (3 actions)
```

### Frame: AI Insights
```
└── Page_Head + Subscribe
└── Three_Col grid of 6 Insight_Large cards
└── Predictions_Card (4 stat rows)
```

### Frame: Settings
```
└── Page_Head + Save Changes
└── Two_Col
      ├── Profile_Card (4 form rows: name, email, timezone, theme)
      └── AI_Preferences_Card (4 toggle rows)
└── Integrations_Card (5 rows, Connect / Manage button each)
└── API_Key_Card (mono code + Copy / Rotate buttons)
```

---

## Page 5 — Tablet (980 px)

Same structure as desktop, but:
- Sidebar **hidden**, hamburger button appears in topbar
- Grid_2col → single column (cards stack)
- Three_Col → Two_Col
- KPI_Strip stays 4-up (or 2-up if cramped)
- User_Table hides "Last active" column

## Page 6 — Mobile (400 px)

- Sidebar becomes a Drawer overlay
- KPI_Strip → 2-up grid
- User_Table → stacked Card layout per row
- Funnel_Row → 1-column with percent above bar
- Modal_Overlay aligns to bottom of viewport
- Topbar wraps: search bar drops to second line, profile shows avatar only

---

## Page 7 — Landing (1440 × 1800)

```
└── Hero (full bleed)
      ├── Nav_Bar (logo + Pricing/Docs/Login + Get Started)
      ├── Eyebrow Pill: "✦ Now with predictive AI"
      ├── H1: "The dashboard that thinks for you" (gradient)
      ├── Subhead: "Stop staring at charts. Ask Copilot…"
      ├── CTA_Row: Primary "Start free trial" + Ghost "Watch demo"
      └── Hero_Image: Dashboard_screenshot (use Page 3 as Component instance)
└── Feature_Grid (3-col, 6 features)
└── Live_Demo: "Ask anything" — embedded Copilot interaction
└── Pricing_Teaser: 3 plan cards
└── Logo_Bar: trusted-by row
└── CTA_Block (centered)
└── Footer (4-col link grid)
```

---

## Auto-Layout cheatsheet for Figma

| Container | Direction | Padding | Gap | Notes |
|---|---|---|---|---|
| Sidebar | Vertical | 22 16 | 22 | sticky position |
| Main | Vertical | 22 32 40 | 22 | flex-grow |
| Topbar | Horizontal | 0 | 16 | center align |
| Hero | Horizontal | 4 | 24 | space-between |
| KPI_Strip | Grid 4-col | 0 | 16 | equal columns |
| Grid_2col | Grid 2-col | 0 | 16 | columns 1.45fr / 1fr |
| Card | Vertical | 20 | 14 | radius 28 |
| KPI_Card | Vertical | 18 20 | 6 | radius 20 |
| Chip_Row | Horizontal | 0 | 6 | wrap |
| Activity_Item | Horizontal | 10 12 | 12 | center align |
| Funnel_Row | Grid 3-col | 0 | 12 | columns 110 / 1fr / 80 |
| Form_Row | Grid 2-col | 14 0 | 18 | columns 200 / 1fr |

---

## Translating to Figma styles

When recreating in Figma:
1. Create **Color styles** for each `--token` → name them like `bg/0`, `bg/1`, `brand/primary`, `brand/accent`, `text/default`, `text/dim`, etc.
2. Create **Text styles** for: `Display`, `H1`, `H2`, `H3`, `Body`, `Body-Small`, `Caption`, `Mono`.
3. Create **Effect styles** for the four shadow/glow definitions in `DESIGN.md`.
4. Build **Components** for everything in Page 2's component list — use **Variants** for KPI Card (default/anomaly), Button (primary/ghost/icon), Insight (warn/ok/info), etc.
5. Use **Component Properties** for label text and trend direction so cards stay flexible.
6. Use **Constraints** + **Auto Layout** so each component scales to width when nested in a column.

That's enough to ship a pixel-faithful Figma file in ~1 day of work.
