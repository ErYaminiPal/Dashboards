import { useState } from 'react';
import { CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, Area } from 'recharts';
import { chartLabels, series, SeriesKey } from '../data';

export default function RevenueChart() {
  const [active, setActive] = useState<SeriesKey>('revenue');
  const s = series[active];

  const data = chartLabels.map((label, i) => ({
    label,
    actual:   s.actual[i],
    forecast: s.forecast[i] ?? null,
    high:     s.high[i] ?? null,
    low:      s.low[i] ?? null,
    band:     s.high[i] != null && s.low[i] != null ? [s.low[i] as number, s.high[i] as number] : null,
  }));

  return (
    <div className="card">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="text-[15px] font-semibold tracking-tight">Revenue & Forecast</h3>
          <span className="text-[11.5px] text-ink-dim">{s.desc}</span>
        </div>
        <div className="flex gap-1.5 overflow-x-auto">
          {(['revenue', 'users', 'retention'] as SeriesKey[]).map(k => (
            <button key={k} onClick={() => setActive(k)}
                    className={`px-3 py-1.5 rounded-full text-[12px] font-medium whitespace-nowrap transition border
                               ${active === k
                                 ? 'text-white bg-gradient-to-br from-brand-primary/30 to-brand-accent/20 border-brand-primary/45'
                                 : 'text-ink-dim hover:text-ink bg-white/[0.06] border-transparent'}`}>
              {k.charAt(0).toUpperCase() + k.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[260px] sm:h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="actualFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor={s.color} stopOpacity={0.35} />
                <stop offset="100%" stopColor={s.color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="label" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false}
                   tickFormatter={(v) => s.fmt(Number(v))} />
            <Tooltip
              contentStyle={{ background: 'rgba(15,23,42,0.97)', border: '1px solid rgba(79,70,229,0.4)', borderRadius: 10, padding: '10px 12px' }}
              labelStyle={{ color: '#E2E8F0', fontWeight: 600, fontSize: 12 }}
              itemStyle={{ color: '#94A3B8', fontSize: 12 }}
              formatter={(value: any, name: string) => {
                if (name === 'band' || name === 'high' || name === 'low') return [null, null];
                return [s.fmt(Number(value)), name];
              }}
              filterNull={false}
            />
            <Area type="monotone" dataKey="band" fill="rgba(34,211,238,0.10)" stroke="transparent" />
            <Area type="monotone" dataKey="actual" fill="url(#actualFill)" stroke="transparent" />
            <Line type="monotone" dataKey="forecast" stroke={s.fcColor} strokeWidth={2.5} strokeDasharray="6 5" dot={false} />
            <Line type="monotone" dataKey="actual" stroke={s.color} strokeWidth={3} dot={false}
                  activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2, fill: s.color }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap gap-4 text-[11.5px] text-ink-dim mt-3">
        <span className="inline-flex items-center gap-1.5"><i className="w-2.5 h-2.5 rounded-sm" style={{ background: s.color }} /> Actual</span>
        <span className="inline-flex items-center gap-1.5"><i className="w-2.5 h-2.5 rounded-sm border border-dashed" style={{ borderColor: s.fcColor, background: s.fcColor }} /> AI Forecast</span>
        <span className="inline-flex items-center gap-1.5"><i className="w-2.5 h-2.5 rounded-sm" style={{ background: '#22D3EE', opacity: .4 }} /> Confidence band</span>
      </div>
    </div>
  );
}
