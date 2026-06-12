import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  TrendingUp,
  Wallet,
  AlertCircle,
  Users,
  ArrowUpRight,
  FileText,
  Crown,
  Sparkles,
  Plus,
} from 'lucide-react';

import Card, { CardHeader, CardBody } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { CenterSpinner } from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import { dashboardApi } from '../api/dashboardApi';
import { tenantApi } from '../api/tenantApi';
import { formatCurrency } from '../utils/formatCurrency';
import { formatRelative } from '../utils/dateUtils';
import { invoiceStatusClass } from '../utils/statusColors';
import { apiErrorMessage } from '../api/axiosInstance';
import { useAuth } from '../hooks/useAuth';

const monthShort = (m) =>
  ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][m] || '';

const accentStyles = {
  indigo: {
    border: 'border-t-pink-500',
    iconBg: 'bg-pink-500/15 text-pink-300',
    glow: 'hover:shadow-[0_0_40px_-10px_rgba(236,72,153,0.6)]',
  },
  cyan: {
    border: 'border-t-violet-500',
    iconBg: 'bg-violet-500/15 text-violet-300',
    glow: 'hover:shadow-glow-violet',
  },
  violet: {
    border: 'border-t-purple-500',
    iconBg: 'bg-purple-500/15 text-purple-300',
    glow: 'hover:shadow-[0_0_40px_-10px_rgba(168,85,247,0.6)]',
  },
  danger: {
    border: 'border-t-red-500',
    iconBg: 'bg-red-500/15 text-red-300',
    glow: 'hover:shadow-glow-danger',
  },
};

function KPICard({ icon: Icon, label, value, accent, trend, trendUp }) {
  const s = accentStyles[accent];
  return (
    <div
      className={`glass-card rounded-2xl p-6 border-t-2 ${s.border} hover:border-white/[0.15] hover:scale-[1.02] transition-all duration-200 ${s.glow} group`}
    >
      <div className="flex items-start justify-between mb-5">
        <div className={`w-11 h-11 rounded-xl ${s.iconBg} flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <span
            className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
              trendUp
                ? 'bg-status-success/10 text-emerald-300'
                : 'bg-status-danger/10 text-red-300'
            }`}
          >
            <ArrowUpRight className={`w-3 h-3 ${trendUp ? '' : 'rotate-180'}`} />
            {trend}
          </span>
        )}
      </div>
      <p className="text-xs text-text-muted uppercase tracking-widest font-medium">{label}</p>
      <p className="text-2xl font-bold text-text-primary mt-1.5 tabular-nums">{value}</p>
    </div>
  );
}

function CustomTooltip({ active, payload, label, currency }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card-elevated rounded-xl px-4 py-3 shadow-card-lg border border-white/[0.12]">
      <p className="text-xs text-text-muted mb-1">{label}</p>
      <p className="text-sm font-bold text-text-primary">
        {formatCurrency(payload[0].value, currency)}
      </p>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [chart, setChart] = useState([]);
  const [recent, setRecent] = useState([]);
  const [topClients, setTopClients] = useState([]);
  const [tenant, setTenant] = useState(null);
  const [error, setError] = useState(null);

  const currency = tenant?.settings?.currency || 'USD';

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const [s, c, r, t, tn] = await Promise.all([
          dashboardApi.stats(),
          dashboardApi.revenueChart(),
          dashboardApi.recentInvoices(),
          dashboardApi.topClients(),
          tenantApi.me().catch(() => null),
        ]);
        if (cancelled) return;
        setStats(s);
        setChart(c.map((row) => ({ ...row, label: `${monthShort(row.month)} ${String(row.year).slice(2)}` })));
        setRecent(r);
        setTopClients(t);
        setTenant(tn);
      } catch (err) {
        if (!cancelled) setError(apiErrorMessage(err, 'Failed to load dashboard'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (loading) return <CenterSpinner label="Loading your workspace…" />;
  if (error)
    return (
      <Card className="p-8 text-center">
        <p className="text-red-400">{error}</p>
      </Card>
    );

  const firstName = user?.full_name?.split(' ')[0] || 'there';
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="space-y-6">
      {/* Hero greeting */}
      <div className="relative overflow-hidden rounded-2xl glass-card p-8" style={{borderTop: '1px solid rgba(168,85,247,0.3)'}}>
        <div className="absolute inset-0 opacity-80" style={{background: 'radial-gradient(ellipse 80% 70% at 10% 20%, rgba(124,58,237,0.28), transparent 55%), radial-gradient(ellipse 60% 80% at 90% 80%, rgba(236,72,153,0.22), transparent 55%), radial-gradient(ellipse 50% 60% at 50% 50%, rgba(168,85,247,0.15), transparent 60%)'}} />
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3 flex items-center gap-2" style={{color: '#c084fc'}}>
              <Sparkles className="w-3.5 h-3.5" />
              Your workspace · {today}
            </p>
            <h2 className="text-3xl font-bold text-text-primary leading-tight">
              Hello, {firstName} —{' '}
              <span style={{background: 'linear-gradient(135deg, #a855f7, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'}}>
                here's how things look today.
              </span>
            </h2>
            {stats?.overdue_count > 0 && (
              <p className="mt-2 text-sm text-status-warning flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                {stats.overdue_count} invoice{stats.overdue_count > 1 ? 's' : ''} overdue — follow up soon
              </p>
            )}
          </div>
          <Link
            to="/invoices/new"
            className="inline-flex items-center gap-2 px-6 h-11 rounded-xl text-white font-semibold hover:scale-[1.03] transition-all shrink-0"
            style={{background: 'linear-gradient(135deg, #7c3aed, #a855f7, #ec4899)', boxShadow: '0 0 32px -8px rgba(168,85,247,0.7)'}}
          >
            <Plus className="w-4 h-4" />
            New Invoice
          </Link>
        </div>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          icon={TrendingUp}
          label="Total Revenue"
          value={formatCurrency(stats.total_revenue, currency)}
          accent="cyan"
        />
        <KPICard
          icon={Wallet}
          label="Outstanding"
          value={formatCurrency(stats.outstanding, currency)}
          accent="indigo"
        />
        <KPICard
          icon={AlertCircle}
          label="Overdue"
          value={stats.overdue_count}
          accent="danger"
        />
        <KPICard icon={Users} label="Clients" value={stats.client_count} accent="violet" />
      </div>

      {/* Chart + Top Clients */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Revenue chart */}
        <div className="xl:col-span-2 glass-card rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/[0.06]">
            <div>
              <p className="text-base font-semibold text-text-primary">Revenue</p>
              <p className="text-xs text-text-muted mt-0.5">Paid invoices, last 12 months</p>
            </div>
            <div className="flex items-center gap-1.5">
              {['3M', '6M', '12M'].map((p, i) => (
                <button
                  key={p}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    i === 2
                      ? 'bg-white/[0.08] text-text-primary border border-white/[0.12]'
                      : 'text-text-muted hover:text-text-secondary hover:bg-white/[0.04]'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className="px-2 py-4">
            {chart.length === 0 ? (
              <div className="px-4 pb-4">
                <EmptyState
                  icon={TrendingUp}
                  title="No revenue yet"
                  description="Send your first invoice and mark it paid to see revenue charted here."
                />
              </div>
            ) : (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chart} margin={{ left: -10, right: 8, top: 8, bottom: 0 }}>
                    <defs>
                      <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#a855f7" stopOpacity={0.55} />
                        <stop offset="50%" stopColor="#ec4899" stopOpacity={0.25} />
                        <stop offset="100%" stopColor="#ec4899" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                    <XAxis dataKey="label" tick={{ fill: '#8a8a98', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#8a8a98', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip currency={currency} />} />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#a855f7"
                      strokeWidth={2.5}
                      fill="url(#revGrad)"
                      dot={false}
                      activeDot={{ r: 5, fill: '#ec4899', strokeWidth: 0 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

        {/* Top Clients */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/[0.06]">
            <div>
              <p className="text-base font-semibold" style={{background: 'linear-gradient(135deg, #a855f7, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'}}>Top Clients</p>
              <p className="text-xs text-text-muted mt-0.5">Ranked by paid revenue</p>
            </div>
            <Link to="/clients" className="text-xs font-medium transition" style={{color: '#c084fc'}}>
              View all →
            </Link>
          </div>
          <div className="p-4 space-y-2">
            {topClients.length === 0 ? (
              <p className="text-sm text-text-muted text-center py-8">No paid invoices yet.</p>
            ) : (
              topClients.map((c, i) => (
                <div
                  key={c.client_id}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.04] transition-all group"
                >
                  <div className="relative shrink-0">
                    <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center text-xs font-bold text-white">
                      {c.client_name?.slice(0, 1).toUpperCase()}
                    </div>
                    {i === 0 && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-bg-surface flex items-center justify-center">
                        <Crown className="w-2.5 h-2.5 text-amber-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate group-hover:text-purple-300 transition">
                      {c.client_name}
                    </p>
                    <p className="text-[11px] text-text-muted">{c.invoice_count} invoices</p>
                  </div>
                  <p className="text-sm font-bold text-text-primary tabular-nums">
                    {formatCurrency(c.revenue, currency)}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Invoices */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/[0.06]">
          <div>
            <p className="text-base font-semibold" style={{background: 'linear-gradient(135deg, #a855f7, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'}}>Recent Invoices</p>
            <p className="text-xs text-text-muted mt-0.5">Your latest 5 invoices</p>
          </div>
          <Link to="/invoices" className="text-xs font-medium transition" style={{color: '#c084fc'}}>
            View all →
          </Link>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {recent.length === 0 ? (
            <div className="p-6">
              <EmptyState
                icon={FileText}
                title="No invoices yet"
                description="Create your first invoice to get started."
              />
            </div>
          ) : (
            recent.map((inv) => (
              <Link
                key={inv.id}
                to={`/invoices/${inv.id}`}
                className="flex items-center justify-between px-6 py-4 hover:bg-white/[0.03] transition-all group"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-bg-elevated border border-border-subtle flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-text-muted" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-text-primary group-hover:gradient-text transition font-mono">
                      {inv.invoice_number}
                    </p>
                    <p className="text-xs text-text-muted">{formatRelative(inv.created_at)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge dot className={invoiceStatusClass(inv.status)}>
                    {inv.status}
                  </Badge>
                  <p className="text-sm font-bold text-text-primary tabular-nums">
                    {formatCurrency(inv.total, inv.currency || currency)}
                  </p>
                  <ArrowUpRight className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 transition -rotate-45 group-hover:rotate-0" />
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
