import { LayoutDashboard, TrendingUp, Users, DollarSign, Sparkles, Settings, X } from 'lucide-react';
import { navItems } from '../data';

const iconMap: Record<string, any> = { LayoutDashboard, TrendingUp, Users, DollarSign, Sparkles, Settings };

interface Props {
  active: string;
  setActive: (id: string) => void;
  drawerOpen: boolean;
  closeDrawer: () => void;
}

export default function Sidebar({ active, setActive, drawerOpen, closeDrawer }: Props) {
  return (
    <>
      {/* Mobile backdrop */}
      <div onClick={closeDrawer}
           className={`fixed inset-0 bg-bg-0/70 backdrop-blur-sm z-[95] lg:hidden transition-opacity ${drawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} />

      <aside className={`fixed lg:sticky top-0 left-0 z-[100] lg:z-auto h-screen w-[280px] lg:w-auto p-5 flex flex-col gap-5 border-r border-white/[0.08] transition-transform lg:translate-x-0
                         ${drawerOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
             style={{ background: 'linear-gradient(180deg, rgba(15,23,42,0.92), rgba(2,6,23,0.92))' }}>
        <div className="flex items-center gap-3 pb-3 border-b border-white/[0.08]">
          <div className="w-9 h-9 rounded-[10px] grid place-items-center bg-grad-avatar text-white shadow-[0_0_24px_-4px_rgba(79,70,229,0.7)]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L4 7v10l8 5 8-5V7l-8-5z"/><path d="M12 22V12"/><path d="M20 7l-8 5L4 7"/></svg>
          </div>
          <div className="flex-1">
            <div className="font-bold text-[16px] tracking-tight">mynickname</div>
            <div className="text-[11px] text-ink-dim">AI Copilot</div>
          </div>
          <button onClick={closeDrawer} className="lg:hidden text-ink-dim hover:text-ink">
            <X size={18} />
          </button>
        </div>

        <nav className="flex flex-col gap-0.5">
          <div className="px-3 pt-2 pb-1 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-ink-faint">Workspace</div>
          {navItems.slice(0, 5).map(item => {
            const Icon = iconMap[item.icon];
            const isActive = active === item.id;
            return (
              <a key={item.id} href="#" onClick={(e) => { e.preventDefault(); setActive(item.id); }}
                 className={`relative flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[13.5px] font-medium transition
                             ${isActive
                               ? 'text-white bg-gradient-to-br from-brand-primary/[0.22] to-brand-accent/[0.10] ring-1 ring-brand-primary/30'
                               : 'text-ink-dim hover:bg-white/[0.04] hover:text-ink'}`}>
                {isActive && <span className="absolute -left-5 top-2 bottom-2 w-[3px] rounded-r bg-gradient-to-b from-brand-accent to-brand-primary shadow-[0_0_12px_#22D3EE]" />}
                <Icon size={18} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-auto text-[10.5px] font-bold px-2 py-0.5 rounded-full bg-grad-ai text-bg-0">{item.badge}</span>
                )}
              </a>
            );
          })}
          <div className="px-3 pt-3 pb-1 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-ink-faint">Account</div>
          {navItems.slice(5).map(item => {
            const Icon = iconMap[item.icon];
            const isActive = active === item.id;
            return (
              <a key={item.id} href="#" onClick={(e) => { e.preventDefault(); setActive(item.id); }}
                 className={`flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[13.5px] font-medium transition
                             ${isActive
                               ? 'text-white bg-gradient-to-br from-brand-primary/[0.22] to-brand-accent/[0.10] ring-1 ring-brand-primary/30'
                               : 'text-ink-dim hover:bg-white/[0.04] hover:text-ink'}`}>
                <Icon size={18} />
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>

        <div className="mt-auto relative p-5 rounded-2xl border border-brand-primary/30 overflow-hidden"
             style={{ background: 'linear-gradient(160deg, rgba(79,70,229,0.20), rgba(34,211,238,0.06))' }}>
          <div className="absolute -inset-1/2 animate-drift pointer-events-none"
               style={{ background: 'radial-gradient(circle at 30% 30%, rgba(167,139,250,0.35), transparent 60%)' }} />
          <div className="relative">
            <div className="text-[22px] text-brand-accent">✦</div>
            <div className="font-bold mt-1">Unlock Predictive AI</div>
            <div className="text-[12px] text-ink-dim mt-0.5 mb-3">Forecast churn 30 days ahead</div>
            <button className="w-full py-2 px-3 rounded-[10px] bg-grad-ai text-white font-semibold text-[13px] shadow-[0_8px_22px_-8px_rgba(79,70,229,0.7)] hover:-translate-y-px transition">
              Upgrade Pro
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
