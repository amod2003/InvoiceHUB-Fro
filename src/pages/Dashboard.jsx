import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import {
  TrendingUp, Wallet, AlertCircle, Users, ArrowUpRight, FileText, Crown, Plus,
} from 'lucide-react';

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
import { useThemeStore } from '../store/themeStore';

const monthShort = (m) =>
  ['','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][m] || '';

const kpiConfig = [
  { key: 'total_revenue', label: 'Total Revenue',  icon: TrendingUp, format: 'currency' },
  { key: 'outstanding',   label: 'Outstanding',    icon: Wallet,     format: 'currency' },
  { key: 'overdue_count', label: 'Overdue',        icon: AlertCircle,format: 'number', alert: true },
  { key: 'client_count',  label: 'Clients',        icon: Users,      format: 'number' },
];

function KPICard({ icon: Icon, label, value, alert }) {
  return (
    <div className={`relative rounded-2xl p-6 border transition-all duration-200 hover:scale-[1.02] cursor-default
      ${alert && value > 0
        ? 'bg-status-danger/[0.05] border-status-danger/20 hover:border-status-danger/30'
        : 'surface-card hover:border-border-strong'
      }`}
    >
      <div className="flex items-start justify-between mb-5">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center
          ${alert && value > 0 ? 'bg-status-danger/10' : 'bg-text-primary/[0.07]'}`}
        >
          <Icon className={`w-4 h-4 ${alert && value > 0 ? 'text-status-danger' : 'text-text-primary'}`} />
        </div>
      </div>
      <p className="text-[11px] text-text-muted uppercase tracking-widest font-medium">{label}</p>
      <p className={`text-2xl font-bold mt-1.5 tabular-nums ${alert && value > 0 ? 'text-status-danger' : 'text-text-primary'}`}>
        {value}
      </p>
    </div>
  );
}

function CustomTooltip({ active, payload, label, currency }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-4 py-3 glass-card-elevated shadow-card-lg">
      <p className="text-xs text-text-muted mb-1">{label}</p>
      <p className="text-sm font-bold text-text-primary">{formatCurrency(payload[0].value, currency)}</p>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const { theme } = useThemeStore();
  const [loading, setLoading]       = useState(true);
  const [stats, setStats]           = useState(null);
  const [chart, setChart]           = useState([]);
  const [recent, setRecent]         = useState([]);
  const [topClients, setTopClients] = useState([]);
  const [tenant, setTenant]         = useState(null);
  const [error, setError]           = useState(null);

  const currency   = tenant?.settings?.currency || 'USD';
  const isDark     = theme === 'dark';
  const lineColor  = isDark ? 'rgba(255,255,255,0.65)' : 'rgba(10,10,10,0.65)';
  const fillStart  = isDark ? 'rgba(255,255,255,0.20)' : 'rgba(10,10,10,0.12)';
  const fillEnd    = isDark ? 'rgba(255,255,255,0.00)' : 'rgba(10,10,10,0.00)';
  const axisColor  = isDark ? '#525252' : '#a3a3a3';

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
  if (error) return (
    <div className="rounded-2xl p-8 text-center surface-card">
      <p className="text-status-danger">{error}</p>
    </div>
  );

  const firstName = user?.full_name?.split(' ')[0] || 'there';
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl border-gradient-top p-8 surface-card">
        <div className="absolute inset-0 dot-pattern opacity-60" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <p className="text-[10px] font-semibold text-text-muted uppercase tracking-widest mb-3">{today}</p>
            <h2 className="text-3xl font-bold text-text-primary leading-tight tracking-tight">
              Hello, {firstName} —{' '}
              <span className="text-text-secondary">here's how things look today.</span>
            </h2>
            {stats?.overdue_count > 0 && (
              <p className="mt-2 text-sm text-status-danger flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                {stats.overdue_count} invoice{stats.overdue_count > 1 ? 's' : ''} overdue
              </p>
            )}
          </div>
          <Link
            to="/invoices/new"
            className="inline-flex items-center gap-2 px-6 h-11 rounded-xl bg-text-primary text-bg-base font-semibold hover:bg-text-primary/90 hover:scale-[1.02] transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            New Invoice
          </Link>
        </div>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiConfig.map(({ key, label, icon, format, alert }) => {
          const raw = stats?.[key] ?? 0;
          const value = format === 'currency' ? formatCurrency(raw, currency) : raw;
          return <KPICard key={key} icon={icon} label={label} value={value} alert={alert} />;
        })}
      </div>

      {/* Chart + Top Clients */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 rounded-2xl surface-card overflow-hidden">
          <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-border-subtle">
            <div>
              <p className="text-sm font-semibold text-text-primary">Revenue</p>
              <p className="text-xs text-text-muted mt-0.5">Paid invoices, last 12 months</p>
            </div>
            <div className="flex items-center gap-1">
              {['3M', '6M', '12M'].map((p, i) => (
                <button key={p} className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  i === 2
                    ? 'bg-text-primary text-bg-base'
                    : 'text-text-muted hover:text-text-secondary hover:bg-text-primary/[0.05]'
                }`}>{p}</button>
              ))}
            </div>
          </div>
          <div className="px-2 py-4">
            {chart.length === 0 ? (
              <div className="px-4 pb-4">
                <EmptyState icon={TrendingUp} title="No revenue yet" description="Send your first invoice and mark it paid." />
              </div>
            ) : (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chart} margin={{ left: -10, right: 8, top: 8, bottom: 0 }}>
                    <defs>
                      <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%"   stopColor={fillStart} />
                        <stop offset="100%" stopColor={fillEnd} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.06)'} vertical={false} />
                    <XAxis dataKey="label" tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip currency={currency} />} />
                    <Area type="monotone" dataKey="revenue"
                      stroke={lineColor} strokeWidth={2}
                      fill="url(#revGrad)" dot={false}
                      activeDot={{ r: 4, fill: lineColor, strokeWidth: 0 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

        {/* Top Clients */}
        <div className="rounded-2xl surface-card overflow-hidden">
          <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-border-subtle">
            <div>
              <p className="text-sm font-semibold text-text-primary">Top Clients</p>
              <p className="text-xs text-text-muted mt-0.5">By paid revenue</p>
            </div>
            <Link to="/clients" className="text-xs text-text-muted hover:text-text-primary transition font-medium">
              View all →
            </Link>
          </div>
          <div className="p-4 space-y-1">
            {topClients.length === 0 ? (
              <p className="text-sm text-text-muted text-center py-8">No paid invoices yet.</p>
            ) : (
              topClients.map((c, i) => (
                <div key={c.client_id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-text-primary/[0.04] transition-all group">
                  <div className="relative shrink-0">
                    <div className="w-8 h-8 rounded-xl bg-text-primary flex items-center justify-center text-xs font-bold text-bg-base">
                      {c.client_name?.slice(0, 1).toUpperCase()}
                    </div>
                    {i === 0 && (
                      <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-bg-base flex items-center justify-center">
                        <Crown className="w-2 h-2 text-status-warning" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate group-hover:text-text-primary transition">{c.client_name}</p>
                    <p className="text-[11px] text-text-muted">{c.invoice_count} invoices</p>
                  </div>
                  <p className="text-sm font-bold text-text-primary tabular-nums">{formatCurrency(c.revenue, currency)}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Invoices */}
      <div className="rounded-2xl surface-card overflow-hidden">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-border-subtle">
          <div>
            <p className="text-sm font-semibold text-text-primary">Recent Invoices</p>
            <p className="text-xs text-text-muted mt-0.5">Your latest 5 invoices</p>
          </div>
          <Link to="/invoices" className="text-xs text-text-muted hover:text-text-primary transition font-medium">
            View all →
          </Link>
        </div>
        <div className="divide-y divide-border-subtle">
          {recent.length === 0 ? (
            <div className="p-6">
              <EmptyState icon={FileText} title="No invoices yet" description="Create your first invoice to get started." />
            </div>
          ) : (
            recent.map((inv) => (
              <Link key={inv.id} to={`/invoices/${inv.id}`}
                className="flex items-center justify-between px-6 py-4 hover:bg-text-primary/[0.03] transition-all group"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-text-primary/[0.06] border border-border-subtle flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-text-muted" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-text-primary group-hover:text-text-primary transition font-mono">
                      {inv.invoice_number}
                    </p>
                    <p className="text-xs text-text-muted">{formatRelative(inv.created_at)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge dot className={invoiceStatusClass(inv.status)}>{inv.status}</Badge>
                  <p className="text-sm font-bold text-text-primary tabular-nums">
                    {formatCurrency(inv.total, inv.currency || currency)}
                  </p>
                  <ArrowUpRight className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 transition" />
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
