export const kpis = [
  { label: 'Monthly Recurring Revenue', value: '$184,720', trend: 'up' as const, trendText: '▲ 12.4%', foot: 'vs $164,310 last month',
    spark: [12,15,14,18,20,22,21,25,24,28,30,33,32,36], color: '#22D3EE' },
  { label: 'Active Users', value: '42,891', trend: 'up' as const, trendText: '▲ 8.1%', foot: '3,212 new this week',
    spark: [40,42,41,45,47,46,50,52,55,58,60,63,66,70], color: '#A78BFA' },
  { label: 'Churn Rate', value: '4.2%', trend: 'down' as const, trendText: '▲ 1.8%', foot: '⚠ Anomaly · EU region spike',
    spark: [22,20,24,21,25,28,32,30,35,40,44,48,52,58], color: '#EF4444', anomaly: true },
  { label: 'Growth', value: '+23.6%', trend: 'up' as const, trendText: '▲ 23.6%', foot: 'Best week in 4 months',
    spark: [10,14,12,18,22,28,32,36,40,46,52,58,62,68], color: '#10B981' },
];

export const chartLabels = ['Mar 1','Mar 5','Mar 9','Mar 13','Mar 17','Mar 21','Mar 25','Mar 29','Apr 2','Apr 6','Apr 10','Apr 14','Apr 18','Apr 22'];

export type SeriesKey = 'revenue' | 'users' | 'retention';
export const series: Record<SeriesKey, {
  label: string; color: string; fcColor: string;
  actual: (number|null)[]; forecast: (number|null)[]; high: (number|null)[]; low: (number|null)[];
  fmt: (v: number) => string; desc: string;
}> = {
  revenue: {
    label: 'Revenue', color: '#3B82F6', fcColor: '#A78BFA',
    actual:   [82,88,86,94,102,108,112,118,124,130,138,148,156,164],
    forecast: [null,null,null,null,null,null,null,null,null,null,138,150,164,178],
    high:     [null,null,null,null,null,null,null,null,null,null,142,158,176,194],
    low:      [null,null,null,null,null,null,null,null,null,null,134,142,152,162],
    fmt: v => `$${v}K`, desc: 'Net new MRR · 92% confidence',
  },
  users: {
    label: 'Users', color: '#22D3EE', fcColor: '#A78BFA',
    actual:   [18.2,19.4,20.1,22.0,24.6,26.4,28.8,30.5,33.1,35.7,38.4,40.8,42.0,42.9],
    forecast: [null,null,null,null,null,null,null,null,null,null,38.4,41.5,44.0,46.8],
    high:     [null,null,null,null,null,null,null,null,null,null,40.0,43.4,46.5,50.1],
    low:      [null,null,null,null,null,null,null,null,null,null,37.0,39.8,42.2,44.0],
    fmt: v => `${v}K`, desc: 'Active users (in thousands) · 89% confidence',
  },
  retention: {
    label: 'Retention', color: '#10B981', fcColor: '#A78BFA',
    actual:   [100,78,68,62,58,55,53,51,50,49,48,47,46,46],
    forecast: [null,null,null,null,null,null,null,null,null,null,48,47,46,45],
    high:     [null,null,null,null,null,null,null,null,null,null,50,49.5,49,48.5],
    low:      [null,null,null,null,null,null,null,null,null,null,46,44.5,43,42],
    fmt: v => `${v}%`, desc: 'Day-N retention · cohort weighted',
  },
};

export const insights = [
  { type: 'warn' as const, icon: '⚠', title: 'Revenue dropped 12% in EU',  body: 'Lower conversions on mobile Safari (Germany, France). Affects ~2,140 users.' },
  { type: 'ok'   as const, icon: '✦', title: 'Pro plan upgrades up 31%',   body: 'Triggered by your in-app onboarding revamp. Keep the new flow.' },
  { type: 'info' as const, icon: '↗', title: 'India is your fastest-growing market', body: '+47% MoM. Consider localized pricing — predicted +$12K MRR.' },
];

export const actions = [
  { title: 'Send re-engagement email to 1,284 dormant users', impact: '+$6.2K MRR', meta: '3 min to deploy', impactColor: 'high' as const, primary: false },
  { title: 'Adjust pricing for India (-15%)',                 impact: '+$12K MRR',  meta: 'A/B test',         impactColor: 'mid'  as const, primary: false },
  { title: 'Rollback Safari checkout to v3.4.1',              impact: '+$8.4K MRR', meta: 'Instant',          impactColor: 'high' as const, primary: true  },
];

export type ActivityType = 'payment' | 'signup' | 'alert' | 'user';
export const activity: { type: ActivityType; icon: string; text: string; sub: string; time: string }[] = [
  { type: 'payment', icon: '$', text: 'Acme Inc upgraded to Enterprise',     sub: '+$2,400 MRR',                    time: 'just now' },
  { type: 'signup',  icon: '+', text: '14 new signups from organic search',  sub: 'India · Brazil · Germany',        time: '1m ago' },
  { type: 'alert',   icon: '!', text: 'Anomaly detected in EU checkout',     sub: 'Mobile Safari · 14% failure',     time: '3m ago' },
  { type: 'user',    icon: '★', text: 'Sarah Chen hit usage limit',          sub: 'Suggested upgrade to Pro',        time: '7m ago' },
  { type: 'payment', icon: '$', text: '$840 recovered from dunning',         sub: '6 customers retained',            time: '12m ago' },
  { type: 'signup',  icon: '+', text: 'Mira Labs started 14-day trial',      sub: 'Referred by Product Hunt',        time: '18m ago' },
];

export const segments = [
  { label: 'Enterprise', value: 48, color: '#3B82F6' },
  { label: 'Pro',        value: 31, color: '#A78BFA' },
  { label: 'Starter',    value: 15, color: '#22D3EE' },
  { label: 'Free',       value: 6,  color: '#10B981' },
];

export const aiResponses = [
  'Looking at your data… your top driver this week is Pro upgrades from the new onboarding flow. Predicted +$14K MRR.',
  'Quick read: D7 retention is 64% (industry median 41%). The post-March-pricing cohort is your stickiest yet.',
  'I see three high-impact actions. Want me to queue the Safari rollback first? It alone recovers ~$8.4K MRR.',
  'On it. India is your fastest-growing region (+47% MoM). Localized pricing could unlock another $12K.',
  'Forecast looks healthy: $210K MRR by end of next month at current trajectory, 92% confidence.',
];

export const navItems = [
  { id: 'dashboard',  label: 'Dashboard',  icon: 'LayoutDashboard' },
  { id: 'analytics',  label: 'Analytics',  icon: 'TrendingUp' },
  { id: 'users',      label: 'Users',      icon: 'Users' },
  { id: 'revenue',    label: 'Revenue',    icon: 'DollarSign' },
  { id: 'insights',   label: 'AI Insights', icon: 'Sparkles', badge: '12' },
  { id: 'settings',   label: 'Settings',   icon: 'Settings' },
];
