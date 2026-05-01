import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import { kpis } from '../data';

export default function KpiCards() {
  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
      {kpis.map((k, i) => (
        <div key={i}
             className={`relative p-4 lg:p-5 rounded-2xl border bg-bg-1/55 overflow-hidden transition hover:-translate-y-0.5
                         ${k.anomaly ? 'border-error/30 shadow-glow-anomaly' : 'border-white/[0.08] hover:border-white/[0.14]'}`}>
          <div className="absolute inset-0 pointer-events-none"
               style={{ background: k.anomaly
                  ? 'radial-gradient(circle at top right, rgba(239,68,68,0.18), transparent 60%)'
                  : 'radial-gradient(circle at top right, rgba(79,70,229,0.12), transparent 60%)' }} />
          <div className="relative flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <span className="text-[12px] text-ink-dim font-medium">{k.label}</span>
              <span className={`text-[11.5px] font-semibold px-2 py-0.5 rounded-full
                               ${k.trend === 'up'
                                 ? 'text-success bg-success/10'
                                 : 'text-error bg-error/10'}`}>{k.trendText}</span>
            </div>
            <div className="text-[26px] font-bold tracking-tight">{k.value}</div>
            <div className="h-11">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={k.spark.map(v => ({ v }))} margin={{ left: 0, right: 0, top: 4, bottom: 0 }}>
                  <defs>
                    <linearGradient id={`spark-${i}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor={k.color} stopOpacity={0.35} />
                      <stop offset="100%" stopColor={k.color} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="v" stroke={k.color} strokeWidth={2} fill={`url(#spark-${i})`} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className={`text-[11.5px] mt-1 ${k.anomaly ? 'text-error font-medium' : 'text-ink-faint'}`}>{k.foot}</div>
          </div>
        </div>
      ))}
    </section>
  );
}
