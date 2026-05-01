# mynickname Dashboard — React + Tailwind

A faithful React port of the vanilla dashboard. Same dark glassmorphic aesthetic, same KPI cards and Copilot, built with Tailwind utility classes and Recharts for charts.

## Setup

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # production bundle into /dist
npm run preview      # preview the build
```

Requires Node ≥ 18.

## Stack

- **React 18** + TypeScript (strict)
- **Vite 5** for dev server & build
- **Tailwind CSS 3** with custom theme matching `styles.css` tokens
- **Recharts** for sparklines, area chart with forecast band, donut
- **Lucide React** for icons

## Structure

```
react/
├── package.json            scripts + dependencies
├── vite.config.ts          Vite + React plugin
├── tailwind.config.js      Theme tokens (mirrors :root in styles.css)
├── postcss.config.js       Tailwind + autoprefixer pipeline
├── tsconfig.json           Strict TS, ES2020 target
├── index.html              Entry HTML for Vite
└── src/
    ├── main.tsx            ReactDOM.createRoot bootstrap
    ├── index.css           Tailwind directives + a few keyframes
    ├── App.tsx             Composes the dashboard layout
    ├── data.ts             Mock dataset (replace with API calls)
    └── components/
        ├── Sidebar.tsx          Left nav + brand + upgrade card
        ├── Topbar.tsx           Search, refresh, notif & profile dropdowns
        ├── KpiCards.tsx         4 KPI cards with sparklines + anomaly variant
        ├── RevenueChart.tsx     Big chart with Revenue / Users / Retention switcher
        ├── Copilot.tsx          AI chat with simulated responses
        ├── Insights.tsx         Smart insight rows (warn/ok/info)
        ├── Actions.tsx          Run buttons with running → done states
        ├── ActivityFeed.tsx     Live-prepending stream
        └── Segment.tsx          Donut chart by plan
```

## Replacing mock data

All static datasets live in `src/data.ts`. Plug your real API by:

1. Replacing `kpis`, `series`, `insights`, `actions`, `activity`, `segments` with `useState` + `useEffect` that fetches from your backend.
2. In `Copilot.tsx`, swap the simulated response in `ask()` for a real LLM call (Claude, OpenAI, etc.).
3. In `ActivityFeed.tsx`, replace the `setInterval` with a WebSocket or SSE connection.

## Known scope gaps vs vanilla version

The React app focuses on the **dashboard view** to keep the code tight. The vanilla version has additional sub-pages (Analytics, Users, Revenue, AI Insights, Settings) and a mini-router. Adding them is straightforward:

1. Add `<Routes>` from `react-router-dom`.
2. Move each sub-page into `src/pages/`.
3. Hook up the sidebar `setActive` to navigate instead of toggling local state.
