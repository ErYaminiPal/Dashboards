import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import KpiCards from './components/KpiCards';
import RevenueChart from './components/RevenueChart';
import Copilot from './components/Copilot';
import Insights from './components/Insights';
import Actions from './components/Actions';
import ActivityFeed from './components/ActivityFeed';
import Segment from './components/Segment';

export default function App() {
  const [active, setActive] = useState('dashboard');
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Ambient glows */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-28 w-[480px] h-[480px] rounded-full opacity-30 will-change-transform animate-drift"
             style={{ background: '#4F46E5', filter: 'blur(80px)' }} />
        <div className="absolute -bottom-40 right-[10%] w-[420px] h-[420px] rounded-full opacity-30 will-change-transform animate-drift"
             style={{ background: '#22D3EE', filter: 'blur(80px)', animationDelay: '-10s' }} />
      </div>

      <div className="relative z-10 grid lg:grid-cols-[260px_1fr] min-h-screen">
        <Sidebar active={active} setActive={(v) => { setActive(v); setDrawerOpen(false); }} drawerOpen={drawerOpen} closeDrawer={() => setDrawerOpen(false)} />

        <main className="px-4 sm:px-6 lg:px-8 py-5 pb-10 flex flex-col gap-5 min-w-0">
          <Topbar onMenu={() => setDrawerOpen(true)} />

          {/* Hero */}
          <section className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-[11.5px] text-ink-dim glass rounded-full px-2.5 py-1 mb-2">
                <span className="pulse-dot" />
                Live · Updated 14 sec ago
              </div>
              <h1 className="text-[28px] font-bold gradient-text leading-tight tracking-tight">Good evening, Yamini.</h1>
              <p className="text-ink-dim mt-1">Your business added <span className="text-ink font-semibold">$24,180</span> in revenue today. I noticed <span className="text-ink font-semibold">3 anomalies</span> worth your attention.</p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2.5 rounded-xl glass text-[13px] font-semibold hover:bg-white/[0.06]">Last 7 days ▾</button>
              <button className="px-4 py-2.5 rounded-xl bg-grad-primary text-white text-[13px] font-semibold shadow-glow-primary hover:-translate-y-px transition">
                ✦ Generate Report
              </button>
            </div>
          </section>

          <KpiCards />

          <section className="grid lg:grid-cols-[1.45fr_1fr] gap-4">
            <div className="flex flex-col gap-4">
              <RevenueChart />
              <Insights />
              <Actions />
            </div>
            <div className="flex flex-col gap-4">
              <Copilot />
              <ActivityFeed />
              <Segment />
            </div>
          </section>

          <footer className="flex justify-between text-[11.5px] text-ink-faint pt-4 border-t border-white/[0.08]">
            <span>mynickname · AI-native analytics</span>
            <span>All systems normal · 99.99% uptime</span>
          </footer>
        </main>
      </div>
    </div>
  );
}
