import { useState } from 'react';
import { actions } from '../data';

function ActionRow({ a }: { a: typeof actions[number] }) {
  const [state, setState] = useState<'idle' | 'running' | 'done'>('idle');
  const onClick = () => {
    setState('running');
    setTimeout(() => setState('done'), 700);
    setTimeout(() => setState('idle'), 2300);
  };
  const label = state === 'running' ? '✓ Running…' : state === 'done' ? '✓ Done' : (a.primary ? 'Run now' : 'Run');
  return (
    <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-white/[0.06] border border-white/[0.08] hover:bg-white/[0.09] transition">
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-medium">{a.title}</div>
        <div className="text-[11.5px] text-ink-dim flex items-center gap-2 mt-1">
          <span className={`text-[10.5px] font-bold px-1.5 py-0.5 rounded-full
                           ${a.impactColor === 'high' ? 'text-success bg-success/10' : 'text-brand-accent bg-brand-accent/10'}`}>
            {a.impact}
          </span>
          · {a.meta}
        </div>
      </div>
      <button onClick={onClick} disabled={state !== 'idle'}
              className={`px-3.5 py-2 rounded-[10px] text-[12.5px] font-semibold transition shrink-0 disabled:opacity-70
                         ${a.primary
                           ? 'bg-grad-ai text-white shadow-[0_6px_18px_-6px_rgba(79,70,229,0.7)] hover:-translate-y-px'
                           : 'bg-white/[0.09] border border-white/[0.14] hover:bg-white/[0.06]'}`}>
        {label}
      </button>
    </div>
  );
}

export default function Actions() {
  return (
    <div className="card">
      <div className="mb-4">
        <h3 className="text-[15px] font-semibold tracking-tight">Recommended Actions</h3>
        <span className="text-[11.5px] text-ink-dim">Ranked by predicted impact</span>
      </div>
      <div className="flex flex-col gap-2">
        {actions.map((a, i) => <ActionRow key={i} a={a} />)}
      </div>
    </div>
  );
}
