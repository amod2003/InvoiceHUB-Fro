import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CreditCard,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  CheckCircle2,
  Clock,
  XCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';

import Card, { CardBody, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { Table, THead, TBody, TR, TH, TD } from '../components/ui/Table';
import { CenterSpinner } from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import { paymentApi } from '../api/paymentApi';
import { tenantApi } from '../api/tenantApi';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDateTime } from '../utils/dateUtils';
import { paymentStatusClass, paymentMethodLabel } from '../utils/statusColors';
import { apiErrorMessage } from '../api/axiosInstance';

const PAGE_SIZE = 20;

function StatCard({ icon: Icon, label, value, accent }) {
  const accents = {
    success: 'from-emerald-500/20 to-emerald-500/5 text-emerald-300 border-emerald-500/20',
    warning: 'from-amber-500/20 to-amber-500/5 text-amber-300 border-amber-500/20',
    danger: 'from-red-500/20 to-red-500/5 text-red-300 border-red-500/20',
    cyan: 'from-cyan-400/20 to-cyan-400/5 text-cyan-300 border-cyan-400/20',
  };
  return (
    <Card className="p-5">
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br border ${accents[accent]} flex items-center justify-center`}>
        <Icon className="w-4 h-4" />
      </div>
      <p className="text-xs text-text-muted uppercase tracking-wider mt-4">{label}</p>
      <p className="text-xl font-bold text-text-primary mt-1">{value}</p>
    </Card>
  );
}

export default function Payments() {
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState([]);
  const [page, setPage] = useState(0);
  const [currency, setCurrency] = useState('USD');

  const load = async (p = page) => {
    setLoading(true);
    try {
      const data = await paymentApi.list({ skip: p * PAGE_SIZE, limit: PAGE_SIZE });
      setPayments(data);
    } catch (err) {
      toast.error(apiErrorMessage(err, 'Failed to load payments'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(page);
  }, [page]);

  useEffect(() => {
    tenantApi
      .me()
      .then((t) => setCurrency(t.settings?.currency || 'USD'))
      .catch(() => {});
  }, []);

  const totals = payments.reduce(
    (acc, p) => {
      if (p.status === 'completed') acc.completed += p.amount;
      else if (p.status === 'pending') acc.pending += p.amount;
      else if (p.status === 'failed') acc.failed += 1;
      acc.total += p.amount;
      return acc;
    },
    { total: 0, completed: 0, pending: 0, failed: 0 }
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={TrendingUp}
          label="Total Volume (page)"
          value={formatCurrency(totals.total, currency)}
          accent="cyan"
        />
        <StatCard
          icon={CheckCircle2}
          label="Completed"
          value={formatCurrency(totals.completed, currency)}
          accent="success"
        />
        <StatCard
          icon={Clock}
          label="Pending"
          value={formatCurrency(totals.pending, currency)}
          accent="warning"
        />
        <StatCard icon={XCircle} label="Failed" value={totals.failed} accent="danger" />
      </div>

      <Card>
        <CardHeader title="All Payments" subtitle="Stripe + manual payments across your workspace." />
        <CardBody className="px-0 pb-0">
          {loading ? (
            <CenterSpinner />
          ) : payments.length === 0 ? (
            <EmptyState
              icon={CreditCard}
              title="No payments yet"
              description="Once a customer pays an invoice (via Stripe or marked manually), it will show up here."
            />
          ) : (
            <>
              <Table>
                <THead>
                  <TR>
                    <TH>Invoice</TH>
                    <TH>Method</TH>
                    <TH>Status</TH>
                    <TH>Paid At</TH>
                    <TH align="right">Amount</TH>
                  </TR>
                </THead>
                <TBody>
                  {payments.map((p) => (
                    <TR key={p.id}>
                      <TD>
                        <Link
                          to={`/invoices/${p.invoice_id}`}
                          className="text-sm font-mono font-medium text-text-primary hover:text-accent-cyan transition"
                        >
                          {p.invoice_id?.slice(-8)}
                        </Link>
                        {p.stripe_payment_id && (
                          <p className="text-[10px] text-text-muted font-mono mt-0.5 truncate max-w-[200px]">
                            {p.stripe_payment_id}
                          </p>
                        )}
                      </TD>
                      <TD>
                        <Badge className="bg-white/5 text-text-secondary border-border-subtle">
                          {paymentMethodLabel(p.method)}
                        </Badge>
                      </TD>
                      <TD>
                        <Badge dot className={paymentStatusClass(p.status)}>
                          {p.status}
                        </Badge>
                      </TD>
                      <TD className="text-text-muted text-xs">{formatDateTime(p.paid_at)}</TD>
                      <TD align="right" className="text-sm font-semibold text-text-primary tabular-nums">
                        {formatCurrency(p.amount, p.currency || currency)}
                      </TD>
                    </TR>
                  ))}
                </TBody>
              </Table>

              <div className="flex items-center justify-between px-6 py-4 border-t border-white/[0.04]">
                <p className="text-xs text-text-muted">Page {page + 1}</p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={ChevronLeft}
                    disabled={page === 0}
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                  >
                    Prev
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    iconRight={ChevronRight}
                    disabled={payments.length < PAGE_SIZE}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
