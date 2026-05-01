import { insights } from '../data';

const variants = {
  warn: { icon: 'bg-error/15 text-error',         border: 'border-error/25' },
  ok:   { icon: 'bg-success/15 text-success',     border: 'border-white/[0.08]' },
  info: { icon: 'bg-brand-accent/15 text-brand-accent', border: 'border-white/[0.08]' },
};

export default function Insights() {
  return (
    <div className="card">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-[15px] font-semibold tracking-tight">Smart Insights</h3>
          <span className="text-[11.5px] text-ink-dim">Auto-generated · Refreshed 2 min ago</span>
        </div>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-success bg-success/10 border border-success/25 rounded-full px-2.5 py-1">
          <span className="pulse-dot" />Live
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {insights.map((it, i) => {
          const v = variants[it.type];
          return (
            <div key={i} className={`flex gap-3 p-3 rounded-2xl bg-white/[0.06] border ${v.border} hover:translate-x-0.5 transition`}>
              <div className={`w-7 h-7 grid place-items-center rounded-lg shrink-0 ${v.icon}`}>{it.icon}</div>
              <div>
                <div className="text-[13px] font-semibold">{it.title}</div>
                <div className="text-[12px] text-ink-dim leading-snug mt-0.5">{it.body}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
