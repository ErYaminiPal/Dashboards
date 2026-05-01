# Design System & Architecture — mynickname Dashboard

This document describes the **layout**, **components**, and **design tokens** that make up the dashboard. Hand it to a designer or developer to understand or extend the system.

---

## 1. Full UI layout description

The shell is a **two-column app**: a fixed sidebar on the left (260 px) and a fluid main area on the right. The main area stacks vertically:

```
┌──────────────┬──────────────────────────────────────────────────────────┐
│              │  TOPBAR — search • refresh • notif • profile            │
│              ├──────────────────────────────────────────────────────────┤
│              │  HERO greeting + actions                                 │
│              ├──────────────────────────────────────────────────────────┤
│   SIDEBAR    │  KPI STRIP (4 cards: MRR, Users, Churn, Growth)         │
│  (sticky,    ├─────────────────────────────────┬─────────────────────────┤
│   260 px)    │  Revenue & Forecast chart        │                         │
│              ├─────────────────────────────────┤   AI Copilot           │
│              │  Smart Insights                 │   (spans 2 rows,        │
│              ├─────────────────────────────────┤    chat + input)        │
│              │  Recommended Actions            │                         │
│              ├─────────────────────────────────┼─────────────────────────┤
│              │                                 │   Activity Feed         │
│              │     (cards align top)           ├─────────────────────────┤
│              │                                 │   Revenue by Segment    │
│              ├──────────────────────────────────────────────────────────┤
│              │  FOOTER                                                   │
└──────────────┴──────────────────────────────────────────────────────────┘
```

Behind everything: 2 large drifting radial glows (indigo + cyan) at 30% opacity, blurred at 80 px. They give the dashboard a "living" ambient quality without distracting from data.

### Sub-pages
The sidebar swaps the main view via a client-side router. Five additional pages share the same topbar:
- **Analytics** — KPI strip, conversion funnel with gradient bars, AI diagnosis, cohort retention table
- **Users** — KPI strip, user directory with churn-risk bars
- **Revenue** — KPI strip, MRR movement breakdown, top customers, AI pricing suggestions
- **AI Insights** — 6 detailed insight cards (3-column), 30-day predictions table
- **Settings** — Profile form, AI preferences toggles, integrations, API key

### Mobile (< 980 px)
- Sidebar becomes a drawer that slides in from the left, triggered by a hamburger button in the topbar
- Sidebar dim-overlay backdrop closes drawer on tap
- Two-column grid collapses to one column
- KPIs go from 4-up → 2-up → 1-up at progressively smaller widths
- User table rows reflow into stacked cards
- Funnel labels and percentages stack vertically
- Search input wraps to its own row; profile name hides (avatar only)

---

## 2. Component breakdown

| Component | Purpose | Key states |
|---|---|---|
| **Sidebar** | Brand mark, sectioned nav, upgrade promo card | `active` (gradient pill + accent rail), `hover`, mobile drawer (`open`) |
| **Brand mark** | Logo tile with gradient + glow | static |
| **Nav item** | Icon + label, optional badge | `active`, `hover`, `ai` (with insight count badge) |
| **Upgrade card** | Premium-tier promo with animated aura | static |
| **Topbar** | Mobile menu, AI search, refresh, notifications, profile | search `focus` → indigo glow ring |
| **Search bar (Ask AI)** | Free-text input → categorized suggestion dropdown | `focus`, suggestions `open`, keyboard navigation `active` row |
| **Suggestion dropdown** | Grouped (AI Insights / Quick views / Actions) | filter-as-you-type, keyboard ↑↓ Enter Esc |
| **Notification dropdown** | List of notifications with severity icons | `unread` row highlight, "Mark all read" |
| **Profile dropdown** | Avatar card + menu items (Account, Billing, etc.) | item `hover`, `danger` (Sign out) |
| **Hero greeting** | Personalized headline + live indicator + actions | `pulse-dot` animation |
| **KPI card** | Label + value + trend pill + sparkline + foot note | `default`, `anomaly` (red border + glow + ⚠ tag), `hover` (lift) |
| **Sparkline** | Tiny line chart with gradient fill | static |
| **Revenue chart** | Big line chart with actual + forecast + confidence band | series switcher (Revenue / Users / Retention), tooltip on hover, point hover |
| **Series chip** | Tab-style toggle for chart series | `default`, `active` (gradient highlight) |
| **AI Copilot card** | Floating orb + chat history + input + suggestion chips | `typing-dots` animation, message-in animation |
| **Chat message** | User and AI variants with different bubble styles | static |
| **Suggestion chip** | Pre-canned question pill | `hover` (cyan glow) |
| **Smart Insight row** | Icon + title + body | `warn` / `ok` / `info` color variants |
| **Action row** | Title + impact pill + Run button | `default`, `primary` Run, `running…`, `done` |
| **Activity item** | Icon + text + timestamp | slide-in animation, `signup` / `payment` / `alert` / `user` variants |
| **Live pill** | Pulsing dot + "Live" label | static animation |
| **Segment donut** | Doughnut chart + legend | static (hover offsets slice) |
| **Cohort table cell** | Retention % with intensity-shaded bg | dynamic background opacity by value |
| **Funnel bar** | Gradient bar with label and percentage | width by data |
| **Toggle** | Dark on/off pill | `on` (gradient), `off` |
| **Toast** | Bottom-right notification | `success` / `info` / `warn`, slide-in/out, auto-dismiss after 3.2 s |
| **Modal** | Centered card with overlay | open animation, close on `Esc` or backdrop click |
| **Form input** | Dark input field with focus ring | `focus` (indigo border) |
| **Risk bar** | Thin progress bar | `low` (green) / `mid` (amber) / `high` (red) |
| **Plan pill** | Tier badge | `ent` / `pro` / `starter` / `free` color variants |

---

## 3. Design system

### Colors

| Token | Hex | Usage |
|---|---|---|
| `--bg-0` | `#020617` | Page background |
| `--bg-1` | `#0F172A` | Card/sidebar surface base |
| `--bg-2` | `#0B1226` | Deeper surface (inputs) |
| `--primary` | `#4F46E5` | Primary buttons, active states, brand |
| `--primary-2` | `#3B82F6` | Charts, gradient pair |
| `--accent` | `#22D3EE` | Highlights, links, neon glow |
| `--accent-2` | `#A78BFA` | AI / forecast lines, secondary glow |
| `--success` | `#10B981` | Positive trends, success toasts |
| `--warning` | `#F59E0B` | Warnings, mid-risk |
| `--error` | `#EF4444` | Anomalies, churn, errors |
| `--text` | `#E2E8F0` | Primary text |
| `--text-dim` | `#94A3B8` | Secondary text, labels |
| `--text-faint` | `#64748B` | Hints, footnotes, kbd |
| `--border` | `rgba(255,255,255,0.08)` | Default border |
| `--border-strong` | `rgba(255,255,255,0.14)` | Hover, focus, dropdown |
| `--surface` | `rgba(255,255,255,0.04)` | Glass surface base |
| `--surface-2` | `rgba(255,255,255,0.06)` | Inset / nested surface |
| `--surface-3` | `rgba(255,255,255,0.09)` | Stronger inset (toggle off) |

**Gradients**
- Primary CTA: `linear-gradient(135deg, #4F46E5, #3B82F6)`
- AI / Send: `linear-gradient(135deg, #4F46E5, #22D3EE)`
- Avatar: `linear-gradient(135deg, #A78BFA, #4F46E5)`
- Funnel bar: `linear-gradient(90deg, #4F46E5, #22D3EE)`
- Title text: `linear-gradient(180deg, #fff, #cbd5e1)` clipped to text

**Glow / shadow**
- Primary CTA: `0 10px 30px -10px rgba(59,130,246,0.7), inset 0 1px 0 rgba(255,255,255,0.2)`
- AI orb: `0 0 24px rgba(167,139,250,0.7), inset 0 0 12px rgba(255,255,255,0.4)`
- Card lift: `0 30px 80px -30px rgba(79,70,229,0.40)`
- Anomaly: `0 0 30px -10px rgba(239,68,68,0.4)`

### Typography

- **Sans**: `Inter`, weights 400 / 500 / 600 / 700 / 800 — letter-spacing −0.01 em globally, −0.02 em on headings, −0.03 em on `<h1>`
- **Mono**: `JetBrains Mono` 400 / 500 — used for `kbd`, API keys
- **Sizes**: 10.5 (uppercase labels) · 11 (foot, time) · 12 (meta) · 13 (body) · 13.5 (titles in cards) · 15 (h3) · 22 (h2 mobile) · 24 (h1 sub-page) · 28 (h1 hero)

### Spacing & shape

- **Radii**: 6 (cells) · 8 (icons) · 10 / 12 / 14 (controls, inputs) · 18–28 (cards)
- **Card padding**: 16 (mobile) · 18 (KPI) · 20 (default) · 22 (modal head/body)
- **Gap between cards**: 12 (tight) · 16 (default) · 22 (sections)
- **Sidebar width**: 260 px desktop, 280 px mobile drawer
- **Z-index layers**: ambient (0) · app (1) · sidebar drawer (100) · dropdowns (90) · modal overlay (150) · toasts (200)

### Animations

| Name | Duration | Easing | Used by |
|---|---|---|---|
| `drift` | 30 s | ease-in-out, infinite | Background glows |
| `pulse` | 1.8 s | infinite | Live status dots |
| `float` | 4 s | ease-in-out, infinite | Copilot orb |
| `msgIn` | 0.4 s | ease | Chat messages, activity items |
| `bounce` | 1 s | infinite | Typing-dots indicator |
| `popIn` | 0.18–0.22 s | ease | Dropdowns, modals, suggestions |
| `viewIn` | 0.3 s | ease | Page transitions |
| `toastIn / toastOut` | 0.25 s | ease | Toast notifications |
| Chart reveal | 0.9 s | easeOutQuart | Revenue / donut on first paint |

### Interaction patterns

- **Click outside** closes any open dropdown
- **Esc** closes modal, dropdown, suggestion list
- **⌘/Ctrl + K** focuses Ask AI search
- **↑/↓ + Enter** navigates suggestion list
- **Hover** lifts cards (translateY −2 px) and brightens borders
- **Active states** use gradient backgrounds + accent rails (sidebar items)
- **Loading states** swap label to "Running…" then "✓ Done"

---

## 4. Performance notes

- **Avoid backdrop-filter on cards** — performs poorly when stacked over animated glows. Keep it only on the modal overlay.
- **`contain: layout paint`** on every card isolates repaints.
- **Glow blur** capped at 80 px with `will-change: transform` to keep on its own GPU layer.
- **Activity feed** pauses when tab is hidden or off-dashboard.
- **Charts initialize once** and persist when navigating; sub-pages render lazily on first visit.
- Honor `prefers-reduced-motion` to disable drift animation.

---

## 5. Accessibility

- All interactive elements are keyboard-reachable (`<button>` and `<a>` semantic tags).
- `aria-label` on icon-only buttons.
- `kbd` for keyboard hints.
- Focus rings preserved (4 px indigo halo on inputs, default browser ring on buttons).
- Color contrast ≥ 4.5:1 for body text on dark surfaces.
- Reduced-motion path disables ambient animation.

> **Known gap**: dropdowns don't yet trap focus, and chart values aren't announced. Plan to add `aria-live` regions on KPI updates and `role="listbox"` for the search suggestions.
