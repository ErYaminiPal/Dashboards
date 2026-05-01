import { useState, useRef, useEffect, FormEvent } from 'react';
import { Plus, ArrowRight } from 'lucide-react';
import { aiResponses } from '../data';

interface Msg { role: 'user' | 'ai'; text: string; reasons?: { dot: string; text: string }[] }

const initial: Msg[] = [
  { role: 'ai', text: "Hey Yamini — I spotted something. **EU revenue dropped 12%** this week, driven by a checkout conversion dip on mobile Safari. Want me to dig in?" },
  { role: 'user', text: 'Why did revenue drop in EU?' },
  { role: 'ai', text: 'Three things happened together:', reasons: [
    { dot: '#EF4444', text: 'Mobile Safari checkout failing for 14% of users' },
    { dot: '#F59E0B', text: 'Stripe 3DS step added latency in DE/FR' },
    { dot: '#22D3EE', text: 'Competitor ran 30% promo Mon–Wed' },
  ] },
];

function fmt(text: string) {
  return text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

export default function Copilot() {
  const [msgs, setMsgs] = useState<Msg[]>(initial);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [msgs, typing]);

  const ask = (q: string) => {
    if (!q.trim()) return;
    setMsgs(m => [...m, { role: 'user', text: q }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setMsgs(m => [...m, { role: 'ai', text: aiResponses[Math.floor(Math.random() * aiResponses.length)] }]);
      setTyping(false);
    }, 900 + Math.random() * 600);
  };

  const onSubmit = (e: FormEvent) => { e.preventDefault(); ask(input); };

  return (
    <div className="card flex flex-col min-h-[480px] lg:min-h-[560px]"
         style={{ background: 'linear-gradient(160deg, rgba(79,70,229,0.10), rgba(34,211,238,0.04))', borderColor: 'rgba(79,70,229,0.25)' }}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full animate-float shadow-glow-ai"
               style={{ background: 'radial-gradient(circle at 30% 30%, #fff, #A78BFA 40%, #4F46E5 80%)' }} />
          <div>
            <h3 className="text-[15px] font-semibold tracking-tight">AI Copilot</h3>
            <span className="text-[11.5px] text-ink-dim">Always watching · Always learning</span>
          </div>
        </div>
        <button className="w-8 h-8 grid place-items-center rounded-lg bg-white/[0.06] border border-white/[0.08] text-ink-dim hover:text-ink">
          <Plus size={14} />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 flex flex-col gap-3 overflow-y-auto min-h-0 mb-3 pr-1">
        {msgs.map((m, i) => (
          <div key={i} className={`flex gap-2.5 animate-msgIn ${m.role === 'user' ? 'justify-end' : ''}`}>
            {m.role === 'ai' && (
              <div className="shrink-0 w-6 h-6 rounded-full grid place-items-center bg-grad-avatar text-white text-[12px] shadow-[0_0_14px_rgba(167,139,250,0.5)]">✦</div>
            )}
            <div className={`px-3.5 py-2.5 text-[13px] leading-snug max-w-full
                            ${m.role === 'user'
                              ? 'bg-grad-primary text-white rounded-[14px_14px_4px_14px]'
                              : 'bg-white/[0.06] border border-white/[0.08] rounded-[14px_14px_14px_4px]'}`}>
              <span dangerouslySetInnerHTML={{ __html: fmt(m.text) }} />
              {m.reasons && (
                <ul className="mt-2.5 flex flex-col gap-1.5">
                  {m.reasons.map((r, j) => (
                    <li key={j} className="flex items-center gap-2 text-[12.5px] text-ink-dim">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: r.dot, boxShadow: `0 0 8px ${r.dot}` }} />
                      {r.text}
                    </li>
                  ))}
                </ul>
              )}
              {i === 0 && (
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {['Show me why', 'Auto-fix it'].map(s => (
                    <button key={s} onClick={() => ask(s)}
                            className="text-[11.5px] px-2.5 py-1 rounded-full bg-brand-accent/10 text-brand-accent border border-brand-accent/25 hover:bg-brand-accent/20">
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex gap-2.5">
            <div className="shrink-0 w-6 h-6 rounded-full grid place-items-center bg-grad-avatar text-white text-[12px]">✦</div>
            <div className="px-3.5 py-2.5 bg-white/[0.06] border border-white/[0.08] rounded-[14px_14px_14px_4px]">
              <span className="typing-dots"><span /><span /><span /></span>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={onSubmit} className="flex items-center gap-2 pl-4 pr-1.5 py-1.5 rounded-2xl bg-white/[0.06] border border-white/[0.14] focus-within:border-brand-primary/60 focus-within:shadow-[0_0_0_4px_rgba(79,70,229,0.10)]">
        <input value={input} onChange={e => setInput(e.target.value)}
               className="flex-1 bg-transparent outline-none text-[13px] py-1 placeholder:text-ink-faint"
               placeholder="Ask Nova anything…" />
        <button type="submit" className="w-9 h-9 grid place-items-center rounded-[10px] bg-grad-ai text-white shadow-[0_6px_18px_-6px_rgba(79,70,229,0.7)]" aria-label="Send">
          <ArrowRight size={14} />
        </button>
      </form>
    </div>
  );
}
