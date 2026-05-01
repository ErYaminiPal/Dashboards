# mynickname — AI Copilot SaaS Dashboard

A next-generation, futuristic SaaS analytics dashboard with an **AI Copilot** at its center. Built with vanilla HTML/CSS/JS plus a parallel **React + Tailwind** implementation. Dark glassmorphic UI, smooth animations, predictive charts, and natural-language search.

> _"Your business added $24,180 in revenue today. I noticed 3 anomalies worth your attention."_ — Copilot, on every page load.

---

## Quick start

This project ships in two flavors — pick whichever fits your stack.

### Option A — Vanilla HTML/CSS/JS (zero install)

```bash
# 1. Clone the repo
git clone https://github.com/ErYaminiPal/Dashboards.git
cd Dashboards

# 2. Open in browser — no build step, no dependencies
open index.html        # macOS
xdg-open index.html    # Linux
start index.html       # Windows
```

That's it. Chart.js loads from a CDN. Works offline once cached.

For a nicer dev experience with live reload:

```bash
npx serve .            # serves on http://localhost:3000
# or
python3 -m http.server 8000
```

### Option B — React + Tailwind

```bash
cd react
npm install
npm run dev            # http://localhost:5173
npm run build          # production bundle in /dist
npm run preview        # preview production build
```

Requires Node ≥ 18.

---

## File-by-file guide

### Root (vanilla version)

| File | Purpose | What you can change |
|---|---|---|
| `index.html` | Main dashboard page. Contains sidebar, topbar, hero, KPI strip, grid of cards, and 5 lazy-rendered sub-pages. | Edit nav items, add new view containers (`<div class="view" data-view="…">`), swap brand name. |
| `landing.html` | Marketing landing page (open this for the public-facing preview). Hero, feature grid, "ask anything" demo, pricing teaser, CTA. | Hero copy, feature list, CTA URL. |
| `styles.css` | Complete design system + all component styles (~24 KB). Defined as CSS custom properties at the top. | Tweak `:root` tokens to rebrand globally. Each component has its own commented section. |
| `script.js` | All interactivity: charts, AI chat, router, search suggestions, dropdowns, toasts, modals, mobile drawer (~50 KB). | Add view templates in `viewTemplates`, wire CTAs in `handleCTA`. |
| `README.md` | This file. | — |
| `DESIGN.md` | UI layout description, component breakdown, design system tokens. Read this to understand the architecture. | — |
| `FIGMA_WIREFRAME.md` | Figma-style wireframe tree. Hand to a designer to mirror in Figma with auto-layout. | — |
| `.gitignore` | Standard Node + macOS ignores. | — |

### React app (`/react`)

| File | Purpose |
|---|---|
| `react/package.json` | npm scripts and dependencies (React, Vite, Tailwind, Recharts, Lucide). |
| `react/vite.config.ts` | Vite bundler config. |
| `react/tailwind.config.js` | Tailwind theme — colors, fonts, animations. **Mirrors the CSS custom properties from styles.css**. |
| `react/postcss.config.js` | PostCSS pipeline (Tailwind + autoprefixer). |
| `react/tsconfig.json` | TypeScript config (strict mode). |
| `react/index.html` | Vite entry HTML. |
| `react/src/main.tsx` | React bootstrap. |
| `react/src/App.tsx` | Composes all dashboard sections into one screen. |
| `react/src/index.css` | Tailwind directives + a few custom utility classes (glassmorphism, glow). |
| `react/src/data.ts` | Mock dataset (KPIs, chart series, insights, activity, etc.). Replace with real API calls. |
| `react/src/components/Sidebar.tsx` | Left navigation with active state, brand mark, upgrade card. |
| `react/src/components/Topbar.tsx` | Search, refresh, notifications, profile. |
| `react/src/components/KpiCards.tsx` | 4 KPI cards with sparklines and anomaly state. |
| `react/src/components/RevenueChart.tsx` | Big chart with Revenue / Users / Retention switcher and AI-forecast band. |
| `react/src/components/Copilot.tsx` | Chat-style AI panel with simulated responses. |
| `react/src/components/Insights.tsx` | Auto-generated insight cards. |
| `react/src/components/Actions.tsx` | Recommended action list with Run buttons. |
| `react/src/components/ActivityFeed.tsx` | Live-updating activity stream. |
| `react/src/components/Segment.tsx` | Donut chart by plan segment. |

---

## What this dashboard does

- **AI Copilot first**, charts second — chat panel sits next to charts and explains them in English.
- **Natural-language search** — type "Why did MRR drop in EU?" → categorized suggestions → AI answer.
- **Predictive charts** — forecast band painted on top of actuals (not in a separate tab).
- **Anomaly detection** — KPI cards turn red and glow when something is off.
- **Action recommendations** — every insight has a one-click Run button.
- **Live activity feed** — new events stream in every 6 seconds.
- **Mobile responsive** — sidebar collapses to a drawer; everything reflows from desktop down to 380 px.
- **Five sub-pages** — Analytics (funnel + cohort), Users (table + churn risk), Revenue (MRR movement), AI Insights, Settings.

---

## Tweaking the design

All colors live in `:root` at the top of `styles.css`. To rebrand, change just these:

```css
--primary: #4F46E5;      /* indigo */
--primary-2: #3B82F6;    /* electric blue */
--accent: #22D3EE;       /* neon cyan */
--accent-2: #A78BFA;     /* purple glow */
--bg-0: #020617;         /* darkest */
--bg-1: #0F172A;         /* surface */
```

The same tokens are mirrored in `react/tailwind.config.js` under `theme.extend.colors.brand.*`.

---

## Browser support

- Chrome / Edge / Safari / Firefox — last 2 major versions.
- `backdrop-filter` is used sparingly (kept off cards for performance) — degrades gracefully where unsupported.
- Honors `prefers-reduced-motion` (kills the ambient drift animation).

---

## Data sources

Right now everything is mocked client-side. To wire up real data:

1. Replace the data constants in `script.js` (top of each section) or `react/src/data.ts`.
2. Swap the simulated `askCopilot()` function for a real LLM call (Claude, GPT, etc.). Keep the `chatTyping → response` UX pattern.
3. Replace `setInterval` activity ticker with a WebSocket / Server-Sent Events feed.
4. Replace `exportCSV()` with a server endpoint that streams the real export.

---

## License

MIT — do whatever you want, just don't blame us if your AI gives bad advice.
