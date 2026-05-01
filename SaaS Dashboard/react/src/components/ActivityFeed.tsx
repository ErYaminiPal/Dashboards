import { useEffect, useState } from 'react';
import { activity, ActivityType } from '../data';

const variants: Record<ActivityType, string> = {
  signup:  'bg-brand-accent/15 text-brand-accent',
  payment: 'bg-success/15 text-success',
  alert:   'bg-error/15 text-error',
  user:    'bg-brand-accent2/15 text-brand-accent2',
};

const liveEvents: { type: ActivityType; icon: string; text: string; sub: string }[] = [
  { type: 'payment', icon: '$', text: 'Stripe processed $1,280 payment', sub: 'Customer · linear.app' },
  { type: 'signup',  icon: '+', text: 'New signup from Tokyo',           sub: 'tokyo · ja-JP' },
  { type: 'user',    icon: '★', text: 'Power user sent invite',          sub: '4 teammates joined' },
  { type: 'alert',   icon: '!', text: 'Latency spiked in us-east-1',     sub: 'Auto-mitigation engaged' },
];

export default function ActivityFeed() {
  const [items, setItems] = useState(activity);

  useEffect(() => {
    const t = setInterval(() => {
      if (document.hidden) return;
      const e = liveEvents[Math.floor(Math.random() * liveEvents.length)];
      setItems(prev => [{ ...e, time: 'just now' }, ...prev].slice(0, 8));
    }, 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="card">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-[15px] font-semibold tracking-tight">Live Activity</h3>
          <span className="text-[11.5px] text-ink-dim">Real-time stream</span>
        </div>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-success bg-success/10 border border-success/25 rounded-full px-2.5 py-1">
          <span className="pulse-dot" />Live
        </span>
      </div>
      <div className="flex flex-col gap-2.5 max-h-[260px] overflow-y-auto pr-1">
        {items.map((a, i) => (
          <div key={a.text + i} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.06] border border-white/[0.08] animate-msgIn">
            <div className={`w-7 h-7 grid place-items-center rounded-lg text-[13px] shrink-0 ${variants[a.type]}`}>{a.icon}</div>
            <div className="text-[12.5px] flex-1 min-w-0">
              <div className="text-ink font-semibold truncate">{a.text}</div>
              <div className="text-ink-dim text-[11px] mt-0.5">{a.sub}</div>
            </div>
            <div className="text-[11px] text-ink-faint shrink-0">{a.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
