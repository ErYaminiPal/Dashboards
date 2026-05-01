import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { segments } from '../data';

export default function Segment() {
  return (
    <div className="card">
      <div className="mb-4">
        <h3 className="text-[15px] font-semibold tracking-tight">Revenue by Segment</h3>
        <span className="text-[11.5px] text-ink-dim">Last 30 days</span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-5">
        <div className="w-[140px] h-[140px] shrink-0">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={segments} dataKey="value" innerRadius={42} outerRadius={62} stroke="#0F172A" strokeWidth={3} paddingAngle={1}>
                {segments.map((s, i) => <Cell key={i} fill={s.color} />)}
              </Pie>
              <Tooltip
                contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(79,70,229,0.4)', borderRadius: 8, padding: '8px 10px' }}
                formatter={(v: any, _: string, p: any) => [`${v}%`, p.payload.label]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 min-w-0 w-full flex flex-col gap-2.5">
          {segments.map(s => (
            <div key={s.label} className="flex items-center gap-2 text-[12.5px] text-ink-dim min-w-0">
              <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: s.color, boxShadow: `0 0 8px ${s.color}` }} />
              <span className="flex-1 min-w-0 truncate">{s.label}</span>
              <strong className="text-ink font-semibold tabular-nums shrink-0">{s.value}%</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
