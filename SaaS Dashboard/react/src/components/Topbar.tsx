import { useState } from 'react';
import { Menu, RefreshCw, Bell, Sparkles } from 'lucide-react';

interface Props { onMenu: () => void; }

export default function Topbar({ onMenu }: Props) {
  const [refreshing, setRefreshing] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const refresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 850);
  };

  return (
    <header className="flex items-center gap-3 sm:gap-4">
      <button onClick={onMenu} className="lg:hidden w-10 h-10 rounded-xl glass grid place-items-center hover:bg-white/[0.06]" aria-label="Open menu">
        <Menu size={20} />
      </button>

      <div className="flex-1 relative">
        <div className="flex items-center gap-2.5 px-3 sm:px-4 py-2.5 rounded-2xl border border-white/[0.08] bg-bg-1/60 focus-within:border-brand-primary/60 focus-within:shadow-[0_0_0_4px_rgba(79,70,229,0.10)] transition">
          <div className="w-7 h-7 grid place-items-center rounded-lg bg-grad-ai text-white">
            <Sparkles size={14} />
          </div>
          <input
            className="flex-1 bg-transparent outline-none text-[14px] placeholder:text-ink-faint"
            placeholder="Ask anything about your data — e.g. 'Why did MRR drop in EU?'"
          />
          <kbd className="hidden sm:inline-block font-mono text-[11px] px-1.5 py-0.5 rounded-md border border-white/[0.14] bg-white/[0.06] text-ink-dim">⌘K</kbd>
        </div>
      </div>

      <button onClick={refresh}
              className="w-10 h-10 rounded-xl glass grid place-items-center text-ink-dim hover:text-ink hover:border-white/[0.14] disabled:opacity-50"
              disabled={refreshing} aria-label="Refresh">
        <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
      </button>

      <div className="relative">
        <button onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
                className="w-10 h-10 rounded-xl glass grid place-items-center text-ink-dim hover:text-ink relative">
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-error ring-2 ring-bg-0 shadow-[0_0_12px_#EF4444]" />
        </button>
        {notifOpen && (
          <div className="absolute top-full mt-2 right-0 w-[320px] max-w-[calc(100vw-32px)] rounded-2xl border border-white/[0.14] bg-bg-1/95 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)] overflow-hidden">
            <div className="flex justify-between items-center px-4 py-3 border-b border-white/[0.08]">
              <span className="font-semibold text-[13px]">Notifications</span>
              <button className="text-[12px] text-brand-accent">Mark all read</button>
            </div>
            <div className="max-h-80 overflow-y-auto p-2">
              {[
                { i: '⚠', t: 'Revenue anomaly in EU', s: 'Mobile Safari · −$8.4K MRR', tm: '5 min ago', cls: 'bg-error/15 text-error' },
                { i: '✦', t: 'AI Copilot has 3 new insights', s: 'Including a churn risk flag', tm: '12 min ago', cls: 'bg-brand-accent/15 text-brand-accent' },
                { i: '✓', t: 'Stripe payout succeeded', s: '$48,210 deposited', tm: '1 hr ago', cls: 'bg-success/15 text-success' },
              ].map((n, i) => (
                <div key={i} className="flex gap-2.5 p-3 rounded-[10px] hover:bg-white/[0.04] cursor-pointer">
                  <div className={`w-7 h-7 rounded-lg grid place-items-center text-[13px] shrink-0 ${n.cls}`}>{n.i}</div>
                  <div className="text-[12.5px] leading-snug">
                    <div className="text-ink font-medium">{n.t}</div>
                    <div className="text-ink-dim mt-0.5">{n.s}</div>
                    <div className="text-ink-faint text-[11px] mt-0.5">{n.tm}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="relative">
        <button onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
                className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-full glass hover:border-white/[0.14] transition">
          <div className="w-8 h-8 rounded-full grid place-items-center bg-grad-avatar text-white text-[12px] font-bold">YS</div>
          <div className="hidden sm:flex flex-col items-start leading-tight">
            <span className="text-[13px] font-semibold">Yamini Singh</span>
            <span className="text-[11px] text-ink-dim">Founder · Pro</span>
          </div>
        </button>
        {profileOpen && (
          <div className="absolute top-full mt-2 right-0 w-[280px] rounded-2xl border border-white/[0.14] bg-bg-1/95 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)] overflow-hidden">
            <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-brand-primary/10 to-brand-accent/[0.04]">
              <div className="w-10 h-10 rounded-full grid place-items-center bg-grad-avatar text-white font-bold">YS</div>
              <div>
                <div className="font-semibold text-[14px]">Yamini Singh</div>
                <div className="text-[11.5px] text-ink-dim">yamini@company.com</div>
              </div>
            </div>
            <div className="border-t border-white/[0.08]">
              {['👤 My Account', '💳 Billing & Plans', '🔑 API Keys', '🌙 Appearance', '📚 Help & Docs'].map(it => (
                <a key={it} href="#" className="flex items-center gap-3 px-4 py-2.5 text-[13px] hover:bg-white/[0.04]">{it}</a>
              ))}
              <div className="border-t border-white/[0.08]">
                <a href="#" className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-error hover:bg-white/[0.04]">↩ Sign out</a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
