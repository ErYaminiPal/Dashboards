/* =====================================================
   mynickname · Dashboard interactions
   ===================================================== */

Chart.defaults.font.family = "'Inter', sans-serif";
Chart.defaults.color = '#94A3B8';
Chart.defaults.borderColor = 'rgba(255,255,255,0.06)';

const chartRegistry = {};
let currentView = 'dashboard';
let currentSeries = 'revenue';

// ---------- helpers ----------
function gradient(ctx, area, from, to) {
  const g = ctx.createLinearGradient(0, area.top, 0, area.bottom);
  g.addColorStop(0, from);
  g.addColorStop(1, to);
  return g;
}
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

// =====================================================
// Toast system
// =====================================================
const toastIcons = { success: '✓', info: 'ℹ', warn: '⚠' };
function showToast(title, body = '', type = 'info', ms = 3200) {
  const c = document.getElementById('toastContainer');
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `
    <div class="toast-icon">${toastIcons[type] || 'ℹ'}</div>
    <div>
      <div class="toast-title">${escapeHtml(title)}</div>
      ${body ? `<div class="toast-body">${escapeHtml(body)}</div>` : ''}
    </div>`;
  c.appendChild(t);
  setTimeout(() => {
    t.classList.add('out');
    t.addEventListener('animationend', () => t.remove(), { once: true });
  }, ms);
}

// =====================================================
// Modal system
// =====================================================
const modalEl = () => document.getElementById('modalOverlay');
function openModal({ title, body, actions = [] }) {
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalBody').innerHTML = body;
  const foot = document.getElementById('modalFoot');
  foot.innerHTML = '';
  actions.forEach(a => {
    const btn = document.createElement('button');
    btn.className = a.primary ? 'primary-btn' : 'ghost-btn';
    btn.textContent = a.label;
    btn.addEventListener('click', () => { a.onClick?.(); if (a.close !== false) closeModal(); });
    foot.appendChild(btn);
  });
  modalEl().removeAttribute('hidden');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  modalEl().setAttribute('hidden', '');
  document.body.style.overflow = '';
}

// =====================================================
// Sparklines
// =====================================================
function spark(canvas, color, data) {
  if (!canvas || canvas.dataset.init) return;
  canvas.dataset.init = '1';
  new Chart(canvas.getContext('2d'), {
    type: 'line',
    data: { labels: data.map((_, i) => i),
      datasets: [{ data, borderColor: color, borderWidth: 2, tension: 0.4, pointRadius: 0, fill: true,
        backgroundColor: (c) => {
          const { ctx, chartArea } = c.chart; if (!chartArea) return null;
          return gradient(ctx, chartArea, color + '55', color + '00');
        } }] },
    options: { responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { enabled: false } },
      scales: { x: { display: false }, y: { display: false } },
      animation: { duration: 800, easing: 'easeOutCubic' } }
  });
}
const sparkDataSets = [
  [12,15,14,18,20,22,21,25,24,28,30,33,32,36],
  [40,42,41,45,47,46,50,52,55,58,60,63,66,70],
  [22,20,24,21,25,28,32,30,35,40,44,48,52,58],
  [10,14,12,18,22,28,32,36,40,46,52,58,62,68]
];
function initDashboardSparklines() {
  document.querySelectorAll('.view-dashboard .sparkline').forEach((c, i) => {
    spark(c, c.dataset.color, sparkDataSets[i]);
  });
}

// =====================================================
// Series data + chart
// =====================================================
const chartLabels = ['Mar 1','Mar 5','Mar 9','Mar 13','Mar 17','Mar 21','Mar 25','Mar 29','Apr 2','Apr 6','Apr 10','Apr 14','Apr 18','Apr 22'];
const seriesMap = {
  revenue: {
    label: 'Revenue',
    color: '#3B82F6',
    fcColor: '#A78BFA',
    actual:   [82,88,86,94,102,108,112,118,124,130,138,148,156,164],
    forecast: [null,null,null,null,null,null,null,null,null,null,138,150,164,178],
    high:     [null,null,null,null,null,null,null,null,null,null,142,158,176,194],
    low:      [null,null,null,null,null,null,null,null,null,null,134,142,152,162],
    fmt: v => '$' + v + 'K',
    desc: 'Net new MRR · 92% confidence'
  },
  users: {
    label: 'Users',
    color: '#22D3EE',
    fcColor: '#A78BFA',
    actual:   [18.2,19.4,20.1,22.0,24.6,26.4,28.8,30.5,33.1,35.7,38.4,40.8,42.0,42.9],
    forecast: [null,null,null,null,null,null,null,null,null,null,38.4,41.5,44.0,46.8],
    high:     [null,null,null,null,null,null,null,null,null,null,40.0,43.4,46.5,50.1],
    low:      [null,null,null,null,null,null,null,null,null,null,37.0,39.8,42.2,44.0],
    fmt: v => v + 'K',
    desc: 'Active users (in thousands) · 89% confidence'
  },
  retention: {
    label: 'Retention',
    color: '#10B981',
    fcColor: '#A78BFA',
    actual:   [100,78,68,62,58,55,53,51,50,49,48,47,46,46],
    forecast: [null,null,null,null,null,null,null,null,null,null,48,47,46,45],
    high:     [null,null,null,null,null,null,null,null,null,null,50,49.5,49,48.5],
    low:      [null,null,null,null,null,null,null,null,null,null,46,44.5,43,42],
    fmt: v => v + '%',
    desc: 'Day-N retention · cohort weighted'
  }
};

function buildDatasets(s) {
  return [
    { label: 'Confidence high', data: s.high, borderColor: 'transparent', backgroundColor: 'rgba(34,211,238,0.10)', fill: '+1', pointRadius: 0, tension: 0.4 },
    { label: 'Confidence low',  data: s.low,  borderColor: 'transparent', fill: false, pointRadius: 0, tension: 0.4 },
    { label: 'AI Forecast',     data: s.forecast, borderColor: s.fcColor, borderWidth: 2.5, borderDash: [6, 5], tension: 0.4, pointRadius: 0, fill: false },
    { label: s.label, data: s.actual, borderColor: s.color, borderWidth: 3, tension: 0.4, pointRadius: 0,
      pointHoverRadius: 7, pointHoverBackgroundColor: s.color, pointHoverBorderColor: '#fff', pointHoverBorderWidth: 2,
      fill: true,
      backgroundColor: (c) => {
        const { ctx, chartArea } = c.chart; if (!chartArea) return null;
        const hex = s.color;
        const a35 = hex + '59'; // ~35%
        const a00 = hex + '00';
        return gradient(ctx, chartArea, a35, a00);
      } }
  ];
}

function initRevenueChart() {
  const el = document.getElementById('revenueChart');
  if (!el || chartRegistry.revenue) return;
  const s = seriesMap[currentSeries];
  chartRegistry.revenue = new Chart(el.getContext('2d'), {
    type: 'line',
    data: { labels: chartLabels, datasets: buildDatasets(s) },
    options: {
      responsive: true, maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      hover: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(15,23,42,0.97)',
          titleColor: '#E2E8F0', bodyColor: '#94A3B8',
          borderColor: 'rgba(79,70,229,0.4)', borderWidth: 1,
          padding: 12, cornerRadius: 10, displayColors: true, boxPadding: 4,
          callbacks: {
            label: (item) => {
              if (item.dataset.label.startsWith('Confidence')) return null;
              return `${item.dataset.label}: ${seriesMap[currentSeries].fmt(item.parsed.y)}`;
            }
          }
        }
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 11 } } },
        y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { font: { size: 11 }, callback: (v) => seriesMap[currentSeries].fmt(v) } }
      },
      animation: { duration: 900, easing: 'easeOutQuart' }
    }
  });
  updateChartLegend();
}

function switchSeries(name) {
  if (!seriesMap[name] || currentSeries === name) return;
  currentSeries = name;
  const chart = chartRegistry.revenue;
  if (!chart) return;
  const s = seriesMap[name];
  chart.data.datasets = buildDatasets(s);
  chart.options.scales.y.ticks.callback = (v) => s.fmt(v);
  chart.update('active');
  updateChartLegend();
  // Update card subtitle
  const sub = document.querySelector('.chart-card .card-sub');
  if (sub) sub.textContent = s.desc;
}

function updateChartLegend() {
  const lg = document.getElementById('chartLegend');
  if (!lg) return;
  const s = seriesMap[currentSeries];
  lg.innerHTML = `
    <span><i style="background:${s.color}"></i> Actual</span>
    <span><i style="background:${s.fcColor};border:1px dashed ${s.fcColor}"></i> AI Forecast</span>
    <span><i style="background:#22D3EE;opacity:.4"></i> Confidence band</span>`;
}

function initDonutChart() {
  const el = document.getElementById('donutChart');
  if (!el || chartRegistry.donut) return;
  chartRegistry.donut = new Chart(el.getContext('2d'), {
    type: 'doughnut',
    data: { labels: ['Enterprise', 'Pro', 'Starter', 'Free'],
      datasets: [{ data: [48, 31, 15, 6], backgroundColor: ['#3B82F6', '#A78BFA', '#22D3EE', '#10B981'],
        borderColor: 'rgba(15,23,42,1)', borderWidth: 3, hoverOffset: 8 }] },
    options: { responsive: true, maintainAspectRatio: false, cutout: '72%',
      plugins: { legend: { display: false }, tooltip: { backgroundColor: 'rgba(15,23,42,0.95)', borderColor: 'rgba(79,70,229,0.4)', borderWidth: 1, cornerRadius: 8, padding: 10 } },
      animation: { animateRotate: true, duration: 900 } }
  });
}

// =====================================================
// Activity feed
// =====================================================
const sampleActivity = [
  { type: 'payment', icon: '$', text: '<strong>Acme Inc</strong> upgraded to Enterprise', sub: '+$2,400 MRR', time: 'just now' },
  { type: 'signup',  icon: '+', text: '<strong>14 new signups</strong> from organic search', sub: 'India · Brazil · Germany', time: '1m ago' },
  { type: 'alert',   icon: '!', text: '<strong>Anomaly detected</strong> in EU checkout', sub: 'Mobile Safari · 14% failure rate', time: '3m ago' },
  { type: 'user',    icon: '★', text: '<strong>Sarah Chen</strong> hit usage limit', sub: 'Suggested upgrade to Pro', time: '7m ago' },
  { type: 'payment', icon: '$', text: '<strong>$840</strong> recovered from dunning', sub: '6 customers retained', time: '12m ago' },
  { type: 'signup',  icon: '+', text: '<strong>Mira Labs</strong> started 14-day trial', sub: 'Referred by Product Hunt', time: '18m ago' }
];
const liveEvents = [
  { type: 'payment', icon: '$', text: '<strong>Stripe</strong> processed $1,280 payment', sub: 'Customer · linear.app' },
  { type: 'signup',  icon: '+', text: '<strong>New signup</strong> from Tokyo', sub: 'tokyo · ja-JP' },
  { type: 'user',    icon: '★', text: '<strong>Power user</strong> sent invite', sub: '4 teammates joined' },
  { type: 'alert',   icon: '!', text: '<strong>Latency</strong> spiked in us-east-1', sub: 'Auto-mitigation engaged' }
];
let activityTimer = null;
function renderActivity() {
  const list = document.getElementById('activityList');
  if (!list) return;
  list.innerHTML = sampleActivity.map(a => `
    <div class="activity-item">
      <div class="activity-icon ${a.type}">${a.icon}</div>
      <div class="activity-text">${a.text}<span class="activity-sub">${a.sub}</span></div>
      <div class="activity-time">${a.time}</div>
    </div>`).join('');
}
function startActivityTicker() {
  stopActivityTicker();
  activityTimer = setInterval(() => {
    if (document.hidden || currentView !== 'dashboard') return;
    const list = document.getElementById('activityList');
    if (!list) return;
    const e = liveEvents[Math.floor(Math.random() * liveEvents.length)];
    const div = document.createElement('div');
    div.className = 'activity-item';
    div.innerHTML = `
      <div class="activity-icon ${e.type}">${e.icon}</div>
      <div class="activity-text">${e.text}<span class="activity-sub">${e.sub}</span></div>
      <div class="activity-time">just now</div>`;
    list.prepend(div);
    while (list.children.length > 8) list.removeChild(list.lastChild);
  }, 6000);
}
function stopActivityTicker() {
  if (activityTimer) { clearInterval(activityTimer); activityTimer = null; }
}

// =====================================================
// Notifications
// =====================================================
const notifications = [
  { type: 'alert', icon: '⚠', title: '<strong>Revenue anomaly</strong> in EU', body: 'Mobile Safari checkout failing — −$8.4K MRR impact.', time: '5 min ago', unread: true },
  { type: 'info',  icon: '✦', title: '<strong>AI Copilot</strong> has 3 new insights', body: 'Including a churn risk flag for 6 enterprise accounts.', time: '12 min ago', unread: true },
  { type: 'ok',    icon: '✓', title: '<strong>Stripe payout</strong> succeeded', body: '$48,210 deposited to your bank.', time: '1 hr ago', unread: true },
  { type: 'info',  icon: '↗', title: '<strong>India</strong> hit 1,000 users', body: 'Your fastest growing region this month.', time: '3 hr ago', unread: false },
  { type: 'ok',    icon: '✓', title: '<strong>Weekly digest</strong> ready', body: 'AI summary delivered to your inbox.', time: '1d ago', unread: false }
];
function renderNotifications() {
  const list = document.getElementById('notifList');
  if (!list) return;
  list.innerHTML = notifications.map(n => `
    <div class="notif-item ${n.unread ? 'unread' : ''}">
      <div class="notif-icon ${n.type}">${n.icon}</div>
      <div class="notif-text">${n.title}<div style="color:var(--text-dim);margin-top:2px">${n.body}</div><div class="notif-time">${n.time}</div></div>
    </div>`).join('');
}

// =====================================================
// Search suggestions
// =====================================================
const searchSuggestions = [
  { g: 'AI Insights', items: [
    { i: '✦', q: 'Why did revenue drop this week?', m: 'AI answer' },
    { i: '✦', q: 'Which customers are at risk of churn?', m: 'AI answer' },
    { i: '✦', q: 'What is my fastest growing region?', m: 'AI answer' },
    { i: '✦', q: 'Forecast MRR for next 30 days', m: 'AI answer' },
    { i: '✦', q: 'Why are mobile signups down?', m: 'AI answer' }
  ]},
  { g: 'Quick views', items: [
    { i: '↗', q: 'Show top customers', m: 'Revenue' },
    { i: '👤', q: 'List at-risk users', m: 'Users' },
    { i: '📊', q: 'Open conversion funnel', m: 'Analytics' },
    { i: '📅', q: 'Compare to last month', m: 'Dashboard' }
  ]},
  { g: 'Actions', items: [
    { i: '⚙', q: 'Connect Stripe', m: 'Settings' },
    { i: '✉', q: 'Send re-engagement email', m: 'Run' },
    { i: '⏪', q: 'Rollback Safari checkout', m: 'Run' }
  ]}
];

let suggestActiveIdx = -1;
function renderSuggestions(query = '') {
  const dd = document.getElementById('suggestDropdown');
  if (!dd) return;
  const q = query.trim().toLowerCase();
  const groups = searchSuggestions.map(g => ({
    g: g.g,
    items: q ? g.items.filter(i => i.q.toLowerCase().includes(q)) : g.items.slice(0, 4)
  })).filter(g => g.items.length > 0);

  if (!groups.length) {
    dd.innerHTML = `<div class="suggest-item" style="cursor:default;color:var(--text-faint)">No results — press Enter to ask Copilot anyway</div>`;
    dd.removeAttribute('hidden');
    return;
  }

  let idx = 0;
  dd.innerHTML = groups.map(g => `
    <div class="suggest-group">${g.g}</div>
    ${g.items.map(it => {
      const itemIdx = idx++;
      return `<div class="suggest-item" data-idx="${itemIdx}" data-q="${escapeHtml(it.q)}" data-route="${it.m}">
        <div class="si-icon">${it.i}</div>
        <span>${escapeHtml(it.q)}</span>
        <span class="si-meta">${it.m}</span>
      </div>`;
    }).join('')}
  `).join('');
  dd.removeAttribute('hidden');
  suggestActiveIdx = -1;

  dd.querySelectorAll('.suggest-item[data-q]').forEach(el => {
    el.addEventListener('mousedown', (e) => {
      e.preventDefault();
      pickSuggestion(el.dataset.q, el.dataset.route);
    });
  });
}
function hideSuggestions() {
  const dd = document.getElementById('suggestDropdown');
  if (dd) dd.setAttribute('hidden', '');
}
function pickSuggestion(q, route) {
  const input = document.getElementById('askInput');
  input.value = q;
  hideSuggestions();
  // If route maps to a known view, navigate. Otherwise treat as AI question.
  const routes = ['dashboard','analytics','users','revenue','insights','settings'];
  const r = (route || '').toLowerCase();
  if (routes.includes(r)) {
    setView(r);
    showToast('Opened ' + r, 'Navigated from search', 'info', 2200);
    setTimeout(() => { input.value = ''; }, 800);
  } else {
    // Send to copilot if visible
    showToast('Asking Copilot…', q, 'info', 2400);
    setView('dashboard');
    setTimeout(() => askCopilot(q), 200);
    setTimeout(() => { input.value = ''; }, 800);
  }
}

// =====================================================
// AI Copilot chat
// =====================================================
const aiResponses = [
  'Looking at your data… <strong>your top driver this week is Pro upgrades</strong> from the new onboarding flow. I recommend doubling down — predicted +$14K MRR.',
  'Quick read: retention at <strong>D7 is 64%</strong> (industry median 41%). The cohort that joined after your March pricing change is your stickiest yet.',
  'I see <strong>three high-impact actions</strong>. Want me to queue the Safari rollback first? It alone recovers ~$8.4K MRR.',
  'On it. <strong>India</strong> is your fastest-growing region (+47% MoM). Localized pricing could unlock another $12K based on willingness-to-pay signals.',
  'Forecast looks healthy: <strong>$210K MRR by end of next month</strong> at current trajectory, 92% confidence.'
];

function chatAppendMsg(text, role) {
  const chat = document.getElementById('chat');
  if (!chat) return;
  const wrap = document.createElement('div');
  wrap.className = `msg msg-${role}`;
  wrap.innerHTML = role === 'ai'
    ? `<div class="msg-avatar">✦</div><div class="msg-body">${text}</div>`
    : `<div class="msg-body">${text}</div>`;
  chat.appendChild(wrap);
  chat.scrollTop = chat.scrollHeight;
}
function chatTyping() {
  const chat = document.getElementById('chat');
  if (!chat) return;
  const wrap = document.createElement('div');
  wrap.className = 'msg msg-ai';
  wrap.id = 'typing';
  wrap.innerHTML = `<div class="msg-avatar">✦</div><div class="msg-body"><span class="typing-dots"><span></span><span></span><span></span></span></div>`;
  chat.appendChild(wrap);
  chat.scrollTop = chat.scrollHeight;
}
function askCopilot(q) {
  chatAppendMsg(escapeHtml(q), 'user');
  chatTyping();
  setTimeout(() => {
    document.getElementById('typing')?.remove();
    chatAppendMsg(aiResponses[Math.floor(Math.random() * aiResponses.length)], 'ai');
  }, 900 + Math.random() * 600);
}

function bindCopilot() {
  const form = document.getElementById('chatForm');
  const input = document.getElementById('chatInput');
  if (!form || form.dataset.bound) return;
  form.dataset.bound = '1';
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const v = input.value.trim();
    if (!v) return;
    askCopilot(v);
    input.value = '';
  });
  document.querySelectorAll('.suggest').forEach(btn => {
    btn.addEventListener('click', () => askCopilot(btn.textContent));
  });
}

// Inject typing-dots animation styles once
(function injectTypingStyles () {
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    .typing-dots { display: inline-flex; gap: 4px; }
    .typing-dots span { width: 6px; height: 6px; border-radius: 50%; background: var(--accent-2); animation: bounce 1s infinite; }
    .typing-dots span:nth-child(2) { animation-delay: .15s; }
    .typing-dots span:nth-child(3) { animation-delay: .3s; }
    @keyframes bounce { 0%, 60%, 100% { transform: translateY(0); opacity: .5; } 30% { transform: translateY(-4px); opacity: 1; } }
  `;
  document.head.appendChild(styleEl);
})();

// =====================================================
// View templates
// =====================================================
const avatars = [
  { i:'AC', c:'#3B82F6,#A78BFA' }, { i:'SC', c:'#22D3EE,#3B82F6' }, { i:'JT', c:'#A78BFA,#EF4444' },
  { i:'ML', c:'#10B981,#22D3EE' }, { i:'RK', c:'#F59E0B,#EF4444' }, { i:'PD', c:'#A78BFA,#22D3EE' }
];
const viewTemplates = {
  analytics: () => `
    <div class="page-head">
      <div><h1>Analytics</h1><p>Drilldown into traffic, conversion and cohorts.</p></div>
      <div class="hero-actions">
        <button class="ghost-btn" data-cta="range">Last 30 days ▾</button>
        <button class="primary-btn" data-cta="export">Export CSV</button>
      </div>
    </div>
    <div class="kpis">
      ${[
        { l:'Sessions', v:'128,420', t:'up', d:'▲ 18.4%', f:'vs 108K last period' },
        { l:'Conversion', v:'4.8%', t:'up', d:'▲ 0.6pp', f:'Target 5.0%' },
        { l:'Avg session', v:'6m 22s', t:'up', d:'▲ 11%', f:'New onboarding helping' },
        { l:'Bounce rate', v:'31.2%', t:'down', d:'▼ 4.1%', f:'Best in 6 months' }
      ].map(k => `
        <div class="kpi-card">
          <div class="kpi-head"><span class="kpi-label">${k.l}</span><span class="kpi-trend ${k.t}">${k.d}</span></div>
          <div class="kpi-value">${k.v}</div>
          <div class="kpi-foot">${k.f}</div>
        </div>`).join('')}
    </div>
    <div class="two-col">
      <div class="card">
        <div class="card-head"><div><h3>Conversion Funnel</h3><span class="card-sub">Last 30 days</span></div></div>
        <div class="funnel">
          ${[['Visited',100,'128,420'],['Signed up',42,'53,936'],['Activated',28,'35,957'],['Trial → Paid',12,'15,410'],['Retained 30d',9,'11,557']].map(([l,p,n]) => `
            <div class="funnel-row">
              <div class="funnel-label">${l}</div>
              <div class="funnel-bar" style="width:${p}%"><span>${n}</span></div>
              <div class="funnel-pct">${p}%</div>
            </div>`).join('')}
        </div>
      </div>
      <div class="card">
        <div class="card-head"><div><h3>AI Diagnosis</h3><span class="card-sub">Where you're losing users</span></div></div>
        <div class="insight insight-warn"><div class="insight-icon">⚠</div><div><div class="insight-title">Activation drop after step 3</div><div class="insight-body">26% of new users stall at "Connect data source." Removing this step (or making it optional) could lift activation by ~14%.</div></div></div>
        <div class="insight insight-ok"><div class="insight-icon">✦</div><div><div class="insight-title">Mobile signup conversion improved</div><div class="insight-body">+12% since last release. Keep the simplified flow.</div></div></div>
        <div class="insight insight-info"><div class="insight-icon">↗</div><div><div class="insight-title">Search-driven users convert 2.3× higher</div><div class="insight-body">Consider doubling SEO investment in Q3.</div></div></div>
      </div>
    </div>
    <div class="card">
      <div class="card-head"><div><h3>Cohort Retention</h3><span class="card-sub">% of users still active by week</span></div></div>
      <div style="overflow-x:auto;">
        <table class="cohort">
          <thead><tr><th>Cohort</th><th>W1</th><th>W2</th><th>W3</th><th>W4</th><th>W5</th><th>W6</th></tr></thead>
          <tbody>
            ${[['Mar 2026',[100,72,61,55,52,50]],['Feb 2026',[100,68,57,49,46,44]],['Jan 2026',[100,64,51,42,38,35]],['Dec 2025',[100,61,48,40,35,31]]].map(([n,vals]) => `
              <tr><td>${n}</td>${vals.map(v => `<td><span class="cell" style="background:rgba(79,70,229,${Math.max(0.08,v/120)});color:#fff">${v}%</span></td>`).join('')}</tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>`,

  users: () => `
    <div class="page-head">
      <div><h1>Users</h1><p>42,891 active · 3,212 new this week.</p></div>
      <div class="hero-actions">
        <button class="ghost-btn" data-cta="filter">All segments ▾</button>
        <button class="primary-btn" data-cta="invite">+ Invite</button>
      </div>
    </div>
    <div class="kpis">
      ${[{ l:'Total users', v:'48,219', t:'up', d:'▲ 5.4%' },{ l:'Active 7d', v:'42,891', t:'up', d:'▲ 8.1%' },{ l:'At-risk', v:'1,284', t:'down', d:'▲ 12%' },{ l:'Power users', v:'3,408', t:'up', d:'▲ 22%' }].map(k => `
        <div class="kpi-card">
          <div class="kpi-head"><span class="kpi-label">${k.l}</span><span class="kpi-trend ${k.t}">${k.d}</span></div>
          <div class="kpi-value">${k.v}</div>
          <div class="kpi-foot">Updated 2 min ago</div>
        </div>`).join('')}
    </div>
    <div class="card">
      <div class="card-head"><div><h3>User Directory</h3><span class="card-sub">Sorted by predicted churn risk</span></div>
      <div class="chip-row"><button class="chip active">All</button><button class="chip">Enterprise</button><button class="chip">Pro</button><button class="chip">At-risk</button></div></div>
      <div class="user-table">
        <div class="user-row head"><div>User</div><div>Plan</div><div>MRR</div><div>Last active</div><div>Churn risk</div></div>
        ${[['Acme Inc','acme@corp.io','ent','$4,200','2 min ago',8,'low'],['Sarah Chen','sarah@linear.app','pro','$240','12 min ago',14,'low'],['Mira Labs','team@miralabs.co','pro','$240','1 hr ago',22,'low'],['Jacob Tan','jt@retro.dev','starter','$49','3 hr ago',58,'mid'],['Rohan Khanna','r@khanna.in','free','$0','1d ago',78,'high'],['Pixel Dust','hi@pixeldust.io','pro','$240','4d ago',86,'high']].map((row,i) => {
          const av = avatars[i % avatars.length];
          return `
          <div class="user-row">
            <div class="user-cell"><div class="user-avatar" style="background:linear-gradient(135deg,${av.c})">${av.i}</div><div><div class="user-name">${row[0]}</div><div class="user-email">${row[1]}</div></div></div>
            <div><span class="plan-pill plan-${row[2]==='ent'?'ent':row[2]}">${row[2].toUpperCase()}</span></div>
            <div>${row[3]}</div>
            <div style="color:var(--text-dim);font-size:12.5px">${row[4]}</div>
            <div><div class="risk-bar risk-${row[6]}"><i style="width:${row[5]}%"></i></div></div>
          </div>`;
        }).join('')}
      </div>
    </div>`,

  revenue: () => `
    <div class="page-head">
      <div><h1>Revenue</h1><p><strong>$184,720 MRR</strong> · +$24,180 this week.</p></div>
      <div class="hero-actions">
        <button class="ghost-btn" data-cta="range">This quarter ▾</button>
        <button class="primary-btn" data-cta="invoice">Generate Invoice</button>
      </div>
    </div>
    <div class="kpis">
      ${[{ l:'MRR', v:'$184,720', t:'up', d:'▲ 12.4%' },{ l:'ARR', v:'$2.21M', t:'up', d:'▲ 18%' },{ l:'ARPU', v:'$58.40', t:'up', d:'▲ 4.1%' },{ l:'Net Revenue Retention', v:'118%', t:'up', d:'▲ 6pp' }].map(k => `
        <div class="kpi-card">
          <div class="kpi-head"><span class="kpi-label">${k.l}</span><span class="kpi-trend ${k.t}">${k.d}</span></div>
          <div class="kpi-value">${k.v}</div>
          <div class="kpi-foot">vs last period</div>
        </div>`).join('')}
    </div>
    <div class="two-col">
      <div class="card">
        <div class="card-head"><div><h3>MRR Movement</h3><span class="card-sub">Apr 2026</span></div></div>
        <div class="stat-row"><span class="stat-label">+ New business</span><span class="stat-value pos">+$22,400</span></div>
        <div class="stat-row"><span class="stat-label">+ Expansion</span><span class="stat-value pos">+$8,640</span></div>
        <div class="stat-row"><span class="stat-label">+ Reactivation</span><span class="stat-value pos">+$1,840</span></div>
        <div class="stat-row"><span class="stat-label">− Contraction</span><span class="stat-value neg">−$3,210</span></div>
        <div class="stat-row"><span class="stat-label">− Churn</span><span class="stat-value neg">−$5,490</span></div>
        <div class="stat-row" style="border:1px solid rgba(79,70,229,0.3);background:linear-gradient(135deg,rgba(79,70,229,0.10),rgba(34,211,238,0.04))"><span class="stat-label" style="font-weight:700;color:var(--text)">Net new MRR</span><span class="stat-value pos">+$24,180</span></div>
      </div>
      <div class="card">
        <div class="card-head"><div><h3>Top Customers</h3><span class="card-sub">By MRR</span></div></div>
        ${[['Acme Inc','$4,200','ent',0],['Vector Cloud','$3,100','ent',1],['Helix Labs','$2,800','ent',2],['Linear App','$1,920','pro',3],['Mira Labs','$1,440','pro',4]].map(([n,m,p,i]) => {
          const av = avatars[i];
          return `<div class="integration-row"><div class="user-avatar" style="background:linear-gradient(135deg,${av.c})">${n.slice(0,2).toUpperCase()}</div><div class="integration-info"><div class="integration-name">${n}</div><div class="integration-status">${p === 'ent' ? 'Enterprise' : 'Pro'}</div></div><div style="font-weight:700">${m}</div></div>`;
        }).join('')}
      </div>
    </div>
    <div class="card">
      <div class="card-head"><div><h3>AI Pricing Suggestions</h3><span class="card-sub">Personalized to your data</span></div></div>
      <div class="action"><div class="action-info"><div class="action-title">Localize India pricing −15%</div><div class="action-meta"><span class="impact-pill high">+$12K MRR</span> · 92% confidence · A/B test</div></div><button class="action-btn primary">Run A/B</button></div>
      <div class="action"><div class="action-info"><div class="action-title">Bundle Pro + Analytics add-on</div><div class="action-meta"><span class="impact-pill mid">+$6.4K MRR</span> · 78% confidence</div></div><button class="action-btn">Run</button></div>
      <div class="action"><div class="action-info"><div class="action-title">Annual discount: 20% → 18%</div><div class="action-meta"><span class="impact-pill mid">+$4.1K MRR</span> · low risk to retention</div></div><button class="action-btn">Run</button></div>
    </div>`,

  insights: () => `
    <div class="page-head">
      <div><h1>AI Insights</h1><p>12 active insights · auto-refreshed every 5 minutes.</p></div>
      <div class="hero-actions">
        <button class="ghost-btn" data-cta="severity">All severity ▾</button>
        <button class="primary-btn" data-cta="subscribe">Subscribe</button>
      </div>
    </div>
    <div class="three-col">
      ${[{ t:'warn', i:'⚠', h:'EU revenue dropped 12%', b:'Mobile Safari checkout failing for 14% of users in Germany and France. Net impact: −$8,420 MRR.', c:96 },{ t:'ok', i:'✦', h:'Pro upgrades up 31%', b:'Triggered by your in-app onboarding revamp. Maintain the new flow — predicted +$14K MRR by end of month.', c:91 },{ t:'info', i:'↗', h:'India is fastest-growing', b:'+47% MoM. Localized pricing could unlock another $12K based on willingness-to-pay signals.', c:88 },{ t:'warn', i:'⚠', h:'Churn risk: 6 enterprise accounts', b:'Usage dropped >40% in last 14 days. Recommend personalized outreach within 48 hours.', c:84 },{ t:'ok', i:'✦', h:'D7 retention at 64%', b:'Industry median is 41%. The cohort that joined after your March pricing change is your stickiest yet.', c:99 },{ t:'info', i:'↗', h:'Power users invite 4× more', b:'Adding an in-app referral CTA could generate ~1,800 organic signups/month.', c:76 }].map(x => `
        <div class="insight-large insight-${x.t}"><div class="insight-icon">${x.i}</div><div><h4>${x.h}</h4><p>${x.b}</p><div class="confidence">★ ${x.c}% confidence</div></div></div>`).join('')}
    </div>
    <div class="card">
      <div class="card-head"><div><h3>30-day Predictions</h3><span class="card-sub">Forecasts with confidence bands</span></div></div>
      ${[['Predicted MRR end of May','$210,400','+13.9%','high'],['Predicted churn','4.6%','+0.4pp','mid'],['New signups (30d)','14,820','+9.2%','high'],['Pro→Enterprise conversions','142','+24%','high']].map(([l,v,d,c]) => `
        <div class="stat-row"><span class="stat-label">${l}</span><span style="display:flex;align-items:center;gap:14px"><span class="impact-pill ${c==='high'?'high':'mid'}">${d}</span><span class="stat-value">${v}</span></span></div>`).join('')}
    </div>`,

  settings: () => `
    <div class="page-head">
      <div><h1>Settings</h1><p>Profile, integrations and API access.</p></div>
      <div class="hero-actions"><button class="primary-btn" data-cta="save">Save Changes</button></div>
    </div>
    <div class="two-col">
      <div class="card">
        <div class="card-head"><div><h3>Profile</h3><span class="card-sub">Visible across your workspace</span></div></div>
        <div class="form-row"><div><div class="form-label">Display name</div><div class="form-hint">Shown on reports and invoices.</div></div><input class="form-input" value="Yamini Singh" /></div>
        <div class="form-row"><div><div class="form-label">Email</div><div class="form-hint">Used for alerts.</div></div><input class="form-input" value="yamini@company.com" /></div>
        <div class="form-row"><div><div class="form-label">Timezone</div><div class="form-hint">All charts honor this.</div></div><input class="form-input" value="Asia/Kolkata (UTC+5:30)" /></div>
        <div class="form-row"><div><div class="form-label">Theme</div><div class="form-hint">Dark always-on for now.</div></div><input class="form-input" value="Dark · default" /></div>
      </div>
      <div class="card">
        <div class="card-head"><div><h3>AI Preferences</h3><span class="card-sub">Tune Copilot behavior</span></div></div>
        <div class="form-row"><div><div class="form-label">Auto-run safe actions</div><div class="form-hint">Like rolling back broken deploys.</div></div><div class="toggle on" data-toggle></div></div>
        <div class="form-row"><div><div class="form-label">Predictive alerts</div><div class="form-hint">Notify before metrics tank.</div></div><div class="toggle on" data-toggle></div></div>
        <div class="form-row"><div><div class="form-label">Daily digest</div><div class="form-hint">Sent at 9:00 AM.</div></div><div class="toggle on" data-toggle></div></div>
        <div class="form-row"><div><div class="form-label">Anonymize logs</div><div class="form-hint">Strip PII before training.</div></div><div class="toggle" data-toggle></div></div>
      </div>
    </div>
    <div class="card">
      <div class="card-head"><div><h3>Integrations</h3><span class="card-sub">3 connected · 12 available</span></div></div>
      ${[['Stripe','#635bff','Connected · syncing every 60s'],['Slack','#4A154B','Connected · #alerts channel'],['HubSpot','#FF7A59','Connected · 2-way sync'],['Segment','#52BD94','Not connected'],['Linear','#5e6ad2','Not connected']].map(([n,c,s]) => `
        <div class="integration-row"><div class="integration-icon" style="background:${c}">${n[0]}</div><div class="integration-info"><div class="integration-name">${n}</div><div class="integration-status">${s}</div></div><button class="action-btn ${s.startsWith('Not')?'':'primary'}">${s.startsWith('Not')?'Connect':'Manage'}</button></div>`).join('')}
    </div>
    <div class="card">
      <div class="card-head"><div><h3>API Key</h3><span class="card-sub">Use for programmatic access</span></div></div>
      <div class="api-key">
        <code>sk_live_2k4nFqL9zXcVm8pR7yT3hJxQwBdGsAeP</code>
        <button class="copy-btn" data-copy>Copy</button>
        <button class="copy-btn">Rotate</button>
      </div>
    </div>`
};

// =====================================================
// Router
// =====================================================
function setView(name) {
  if (!viewTemplates[name] && name !== 'dashboard') return;
  if (currentView === name) { closeAllDropdowns(); closeMobileNav(); return; }

  document.querySelectorAll('.nav-item').forEach(el => el.classList.toggle('active', el.dataset.view === name));
  document.querySelectorAll('.view').forEach(v => {
    const match = v.dataset.view === name;
    v.classList.toggle('active', match);
    if (match) v.removeAttribute('hidden'); else v.setAttribute('hidden', '');
  });

  currentView = name;

  if (name !== 'dashboard') {
    const target = document.querySelector(`.view[data-view="${name}"]`);
    if (target && !target.dataset.rendered) {
      target.innerHTML = viewTemplates[name]();
      target.dataset.rendered = '1';
      bindViewHandlers(target);
    }
  } else {
    initDashboardSparklines();
    initRevenueChart();
    initDonutChart();
  }

  closeMobileNav();
  closeAllDropdowns();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// =====================================================
// CTA handlers
// =====================================================
function handleCTA(action, btn) {
  const label = btn?.textContent?.trim() || '';
  switch (action) {
    case 'report':
      openReportModal();
      break;

    case 'export':
      exportCSV();
      break;

    case 'subscribe':
      openSubscribeModal();
      break;

    case 'invite':
      openInviteModal();
      break;

    case 'invoice':
      showToast('Invoice generated', 'invoice_apr_2026.pdf · 14.2 KB', 'success');
      simulateDownload('invoice_apr_2026.pdf');
      break;

    case 'save':
      showToast('Settings saved', 'Your preferences are synced across devices.', 'success');
      break;

    case 'range':
    case 'filter':
    case 'severity':
      openRangeModal(label);
      break;

    default:
      showToast(label || 'Action', 'Coming soon', 'info');
  }
}

function openReportModal() {
  openModal({
    title: 'Generate AI Report',
    body: `
      <p>I'll build a PDF summarizing this week's metrics, anomalies and recommended actions. Pick what to include:</p>
      <div class="check-list">
        <label class="check-row"><input type="checkbox" checked> Executive summary</label>
        <label class="check-row"><input type="checkbox" checked> KPI snapshot &amp; trends</label>
        <label class="check-row"><input type="checkbox" checked> AI-detected anomalies</label>
        <label class="check-row"><input type="checkbox" checked> Recommended actions</label>
        <label class="check-row"><input type="checkbox"> Raw data appendix</label>
      </div>
      <div class="progress" id="reportProgress"><i></i></div>`,
    actions: [
      { label: 'Cancel' },
      { label: '✦ Generate', primary: true, close: false, onClick: () => {
        const p = document.querySelector('#reportProgress i');
        let pct = 0;
        const t = setInterval(() => {
          pct += 12 + Math.random() * 18;
          if (pct >= 100) { pct = 100; clearInterval(t); setTimeout(() => {
            closeModal();
            showToast('Report ready', 'weekly_report.pdf · downloaded', 'success');
            simulateDownload('weekly_report.pdf');
          }, 300); }
          if (p) p.style.width = pct + '%';
        }, 220);
      }}
    ]
  });
}

function openSubscribeModal() {
  openModal({
    title: 'Subscribe to AI Insights',
    body: `
      <p>Get the most important findings delivered, so you only look when something matters.</p>
      <div class="check-list">
        <label class="check-row"><input type="checkbox" checked> Email — daily digest at 9:00 AM</label>
        <label class="check-row"><input type="checkbox" checked> Slack — high-severity anomalies only</label>
        <label class="check-row"><input type="checkbox"> SMS — critical alerts ($10K+ MRR risk)</label>
        <label class="check-row"><input type="checkbox" checked> Weekly forecast email</label>
      </div>`,
    actions: [
      { label: 'Cancel' },
      { label: 'Subscribe', primary: true, onClick: () => showToast('Subscribed', 'Daily digest will arrive at 9:00 AM IST.', 'success') }
    ]
  });
}

function openInviteModal() {
  openModal({
    title: 'Invite teammate',
    body: `
      <p>Send an invite — they'll see this dashboard with your data.</p>
      <div style="margin-top:14px"><div class="form-label">Email</div><input class="form-input" id="inviteEmail" placeholder="teammate@company.com" /></div>
      <div style="margin-top:14px"><div class="form-label">Role</div><input class="form-input" value="Viewer · read-only" /></div>`,
    actions: [
      { label: 'Cancel' },
      { label: 'Send invite', primary: true, onClick: () => {
        const v = document.getElementById('inviteEmail')?.value || 'teammate';
        showToast('Invite sent', v, 'success');
      }}
    ]
  });
}

function openRangeModal(currentLabel) {
  const ranges = ['Today', 'Last 7 days', 'Last 30 days', 'This quarter', 'This year', 'Custom range…'];
  openModal({
    title: 'Choose date range',
    body: `<div class="check-list">${ranges.map(r => `<label class="check-row" data-range="${r}"><input type="radio" name="r" ${r==='Last 7 days'?'checked':''}> ${r}</label>`).join('')}</div>`,
    actions: [
      { label: 'Cancel' },
      { label: 'Apply', primary: true, onClick: () => {
        const sel = document.querySelector('.modal input[name="r"]:checked')?.parentElement?.dataset?.range || 'Last 7 days';
        document.querySelectorAll('[data-cta="range"]').forEach(b => b.textContent = sel + ' ▾');
        showToast('Range updated', sel, 'info');
      }}
    ]
  });
}

function exportCSV() {
  const rows = [
    ['date','mrr','users','churn'],
    ['2026-04-22','164000','42891','4.2'],
    ['2026-04-15','156000','40320','4.0'],
    ['2026-04-08','148000','38120','3.8'],
    ['2026-04-01','138000','35900','3.6'],
    ['2026-03-25','130000','33200','3.5']
  ];
  const csv = rows.map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'mynickname_export.csv';
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
  showToast('Export ready', 'mynickname_export.csv downloaded', 'success');
}

function simulateDownload(name) {
  const blob = new Blob(['Generated by mynickname · ' + new Date().toISOString()], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}

// =====================================================
// Bind handlers within a view
// =====================================================
function bindViewHandlers(scope) {
  scope.querySelectorAll('[data-toggle]').forEach(t => {
    t.addEventListener('click', () => {
      t.classList.toggle('on');
      showToast(t.parentElement?.parentElement?.querySelector('.form-label')?.textContent || 'Updated',
                t.classList.contains('on') ? 'On' : 'Off', 'info', 1800);
    });
  });
  scope.querySelectorAll('[data-copy]').forEach(b => {
    b.addEventListener('click', () => {
      const code = b.parentElement.querySelector('code');
      if (code) {
        navigator.clipboard?.writeText(code.textContent);
        showToast('Copied to clipboard', 'API key copied securely', 'success', 2000);
        const o = b.textContent; b.textContent = '✓ Copied';
        setTimeout(() => b.textContent = o, 1400);
      }
    });
  });
  scope.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const original = btn.textContent;
      btn.textContent = '✓ Running…'; btn.style.opacity = '.7';
      setTimeout(() => {
        btn.textContent = '✓ Done';
        showToast('Action executed', original + ' completed', 'success', 1800);
        setTimeout(() => { btn.textContent = original; btn.style.opacity = '1'; }, 1400);
      }, 700);
    });
  });
  scope.querySelectorAll('[data-cta]').forEach(btn => {
    btn.addEventListener('click', () => handleCTA(btn.dataset.cta, btn));
  });
  // Generic chip toggle (non-chart)
  scope.querySelectorAll('.chip-row').forEach(row => {
    if (row.id === 'chartChipRow') return;
    row.querySelectorAll('.chip').forEach(c => {
      c.addEventListener('click', () => {
        row.querySelectorAll('.chip').forEach(x => x.classList.remove('active'));
        c.classList.add('active');
      });
    });
  });
}

// =====================================================
// Topbar interactions: refresh, dropdowns, search, mobile menu
// =====================================================
function closeAllDropdowns() {
  document.querySelectorAll('.dropdown').forEach(d => d.setAttribute('hidden', ''));
  hideSuggestions();
}

function bindTopbar() {
  // Refresh
  const refreshBtn = document.getElementById('refreshBtn');
  refreshBtn?.addEventListener('click', () => {
    const svg = refreshBtn.querySelector('svg');
    svg.style.transition = 'transform .8s ease';
    svg.style.transform = 'rotate(720deg)';
    refreshBtn.disabled = true;
    setTimeout(() => {
      svg.style.transition = 'none';
      svg.style.transform = 'rotate(0)';
      refreshBtn.disabled = false;
      showToast('Data refreshed', 'All metrics updated just now', 'success', 2200);
      // Update "live" eyebrow
      const eyebrow = document.querySelector('.hero-eyebrow');
      if (eyebrow) eyebrow.innerHTML = '<span class="pulse-dot"></span> Live · Updated just now';
    }, 850);
  });

  // Notifications dropdown
  const notifBtn = document.getElementById('notifBtn');
  const notifDropdown = document.getElementById('notifDropdown');
  notifBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = !notifDropdown.hasAttribute('hidden');
    closeAllDropdowns();
    if (!isOpen) {
      renderNotifications();
      notifDropdown.removeAttribute('hidden');
    }
  });
  notifDropdown?.querySelector('.link-btn')?.addEventListener('click', () => {
    notifications.forEach(n => n.unread = false);
    document.querySelector('.notif-dot')?.style.setProperty('display', 'none');
    renderNotifications();
    showToast('Marked as read', 'All notifications cleared', 'info', 1800);
  });

  // Profile dropdown
  const profileBtn = document.getElementById('profileBtn');
  const profileDropdown = document.getElementById('profileDropdown');
  profileBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = !profileDropdown.hasAttribute('hidden');
    closeAllDropdowns();
    if (!isOpen) profileDropdown.removeAttribute('hidden');
  });
  profileDropdown?.querySelectorAll('.dropdown-item').forEach(it => {
    it.addEventListener('click', (e) => {
      e.stopPropagation();
      closeAllDropdowns();
      if (it.dataset.route) setView(it.dataset.route);
      else if (it.classList.contains('danger')) showToast('Signed out', 'Session ended securely', 'info');
      else showToast(it.textContent.trim(), 'Coming soon', 'info', 1800);
    });
  });

  // Click outside closes dropdowns
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown-wrap') && !e.target.closest('.ask-ai')) {
      closeAllDropdowns();
    }
  });

  // Search input
  const askInput = document.getElementById('askInput');
  const askWrap = askInput?.closest('.ask-ai');
  askInput?.addEventListener('focus', () => renderSuggestions(askInput.value));
  askInput?.addEventListener('input', () => renderSuggestions(askInput.value));
  askInput?.addEventListener('keydown', (e) => {
    const items = document.querySelectorAll('#suggestDropdown .suggest-item[data-q]');
    if (e.key === 'ArrowDown') { e.preventDefault(); suggestActiveIdx = Math.min(items.length - 1, suggestActiveIdx + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); suggestActiveIdx = Math.max(0, suggestActiveIdx - 1); }
    else if (e.key === 'Enter') {
      e.preventDefault();
      if (items[suggestActiveIdx]) {
        pickSuggestion(items[suggestActiveIdx].dataset.q, items[suggestActiveIdx].dataset.route);
      } else if (askInput.value.trim()) {
        const q = askInput.value.trim();
        hideSuggestions(); askInput.blur();
        showToast('Asking Copilot…', q, 'info', 2000);
        setView('dashboard');
        setTimeout(() => askCopilot(q), 200);
        askInput.value = '';
      }
      return;
    } else if (e.key === 'Escape') { hideSuggestions(); askInput.blur(); return; }

    items.forEach((el, i) => el.classList.toggle('active', i === suggestActiveIdx));
    if (items[suggestActiveIdx]) items[suggestActiveIdx].scrollIntoView({ block: 'nearest' });
  });

  // ⌘K shortcut
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      askInput?.focus();
      askInput?.select();
    }
  });
}

// =====================================================
// Mobile sidebar drawer
// =====================================================
function openMobileNav() {
  document.querySelector('.sidebar')?.classList.add('open');
  document.getElementById('sidebarBackdrop')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeMobileNav() {
  document.querySelector('.sidebar')?.classList.remove('open');
  document.getElementById('sidebarBackdrop')?.classList.remove('open');
  document.body.style.overflow = '';
}
function bindMobileNav() {
  document.getElementById('menuBtn')?.addEventListener('click', openMobileNav);
  document.getElementById('sidebarBackdrop')?.addEventListener('click', closeMobileNav);
}

// =====================================================
// Modal interactions
// =====================================================
function bindModal() {
  document.getElementById('modalClose')?.addEventListener('click', closeModal);
  document.getElementById('modalOverlay')?.addEventListener('click', (e) => {
    if (e.target.id === 'modalOverlay') closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modalEl().hasAttribute('hidden')) closeModal();
  });
}

// =====================================================
// Bootstrap
// =====================================================
document.addEventListener('DOMContentLoaded', () => {
  initDashboardSparklines();
  initRevenueChart();
  initDonutChart();
  renderActivity();
  renderNotifications();
  bindCopilot();
  bindViewHandlers(document.querySelector('.view-dashboard'));
  startActivityTicker();
  bindTopbar();
  bindMobileNav();
  bindModal();

  // Sidebar nav
  document.querySelectorAll('.nav-item[data-view]').forEach(item => {
    item.addEventListener('click', (e) => { e.preventDefault(); setView(item.dataset.view); });
  });

  // Chart series chips
  document.getElementById('chartChipRow')?.querySelectorAll('.chip').forEach(c => {
    c.addEventListener('click', () => {
      document.getElementById('chartChipRow').querySelectorAll('.chip').forEach(x => x.classList.remove('active'));
      c.classList.add('active');
      switchSeries(c.dataset.series);
    });
  });

  // Pause ticker when tab is hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopActivityTicker(); else startActivityTicker();
  });
});
