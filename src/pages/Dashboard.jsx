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

function KPICard({ icon: Icon, label, value, accent, delta }) {
  const accents = {
    indigo: 'from-indigo-500/20 to-indigo-500/5 text-indigo-300 border-indigo-500/20',
    cyan: 'from-cyan-400/20 to-cyan-400/5 text-cyan-300 border-cyan-400/20',
    violet: 'from-violet-500/20 to-violet-500/5 text-violet-300 border-violet-500/20',
    danger: 'from-red-500/20 to-red-500/5 text-red-300 border-red-500/20',
  };
  return (
    <Card className="p-5 hover:border-white/[0.15] transition group">
      <div className="flex items-start justify-between">
        <div
          className={`w-11 h-11 rounded-xl bg-gradient-to-br border ${accents[accent]} flex items-center justify-center`}
        >
          <Icon className="w-5 h-5" />
        </div>
        {delta && (
          <Badge className="bg-status-success/10 text-emerald-300 border-status-success/30">
            <ArrowUpRight className="w-3 h-3" /> {delta}
          </Badge>
        )}
      </div>
      <p className="text-xs text-text-muted uppercase tracking-wider mt-5">{label}</p>
      <p className="text-2xl font-bold text-text-primary mt-1">{value}</p>
    </Card>
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
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <CenterSpinner label="Loading your workspace…" />;
  if (error)
    return (
      <Card className="p-8 text-center">
        <p className="text-red-400">{error}</p>
      </Card>
    );

  return (
    <div className="space-y-6">
      {/* Hero greeting */}
      <Card className="relative overflow-hidden p-8">
        <div className="absolute inset-0 ambient-glow opacity-60" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-accent-cyan uppercase tracking-widest mb-2">
              <Sparkles className="inline w-3.5 h-3.5 mr-1" /> Your workspace
            </p>
            <h2 className="text-2xl font-bold text-text-primary">
              Hello, {user?.full_name?.split(' ')[0] || 'there'} —{' '}
              <span className="gradient-text">here's how things look today.</span>
            </h2>
          </div>
          <Link
            to="/invoices/new"
            className="inline-flex items-center gap-2 px-5 h-11 rounded-xl gradient-primary text-white font-medium shadow-glow-indigo hover:shadow-glow-violet hover:scale-[1.02] transition"
          >
            Create Invoice <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </Card>

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

      {/* Chart + side panels */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2">
          <CardHeader
            title="Revenue (last 12 months)"
            subtitle="Paid invoices, grouped by month"
          />
          <CardBody>
            {chart.length === 0 ? (
              <EmptyState
                icon={TrendingUp}
                title="No revenue yet"
                description="Send your first invoice and mark it paid to see revenue charted here."
              />
            ) : (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chart} margin={{ left: -10, right: 8, top: 8, bottom: 0 }}>
                    <defs>
                      <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#a855f7" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="label" tick={{ fill: '#8a8a98', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#8a8a98', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        background: '#13131a',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: 12,
                        color: '#f5f5fa',
                      }}
                      formatter={(v) => [formatCurrency(v, currency), 'Revenue']}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#a855f7"
                      strokeWidth={2.5}
                      fill="url(#revGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Top Clients" subtitle="Ranked by paid revenue" />
          <CardBody className="space-y-3">
            {topClients.length === 0 ? (
              <p className="text-sm text-text-muted text-center py-8">No paid invoices yet.</p>
            ) : (
              topClients.map((c, i) => (
                <div key={c.client_id} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center text-xs font-bold text-white">
                    {c.client_name?.slice(0, 1).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">{c.client_name}</p>
                    <p className="text-xs text-text-muted">{c.invoice_count} invoices</p>
                  </div>
                  <div className="text-right">
                    {i === 0 && <Crown className="w-3.5 h-3.5 text-accent-cyan ml-auto mb-0.5" />}
                    <p className="text-sm font-semibold text-text-primary">
                      {formatCurrency(c.revenue, currency)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </CardBody>
        </Card>
      </div>

      {/* Recent invoices */}
      <Card>
        <CardHeader
          title="Recent Invoices"
          subtitle="Your latest 5 invoices"
          action={
            <Link
              to="/invoices"
              className="text-xs text-accent-cyan font-medium hover:underline"
            >
              View all →
            </Link>
          }
        />
        <CardBody>
          {recent.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No invoices yet"
              description="Create your first invoice to get started."
            />
          ) : (
            <div className="divide-y divide-white/[0.04]">
              {recent.map((inv) => (
                <Link
                  key={inv.id}
                  to={`/invoices/${inv.id}`}
                  className="flex items-center justify-between py-3 group hover:bg-white/[0.02] -mx-2 px-2 rounded-lg transition"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-bg-elevated border border-border-subtle flex items-center justify-center">
                      <FileText className="w-4 h-4 text-text-muted" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-text-primary group-hover:text-accent-cyan transition">
                        {inv.invoice_number}
                      </p>
                      <p className="text-xs text-text-muted">{formatRelative(inv.created_at)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge dot className={invoiceStatusClass(inv.status)}>
                      {inv.status}
                    </Badge>
                    <p className="text-sm font-semibold text-text-primary tabular-nums">
                      {formatCurrency(inv.total, inv.currency || currency)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
