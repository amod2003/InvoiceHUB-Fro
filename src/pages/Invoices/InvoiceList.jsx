import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus,
  FileText,
  ChevronLeft,
  ChevronRight,
  X as ClearIcon,
} from 'lucide-react';
import toast from 'react-hot-toast';

import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { Table, THead, TBody, TR, TH, TD } from '../../components/ui/Table';
import { CenterSpinner } from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import { invoiceApi } from '../../api/invoiceApi';
import { clientApi } from '../../api/clientApi';
import { tenantApi } from '../../api/tenantApi';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/dateUtils';
import { invoiceStatusClass, INVOICE_STATUSES } from '../../utils/statusColors';
import { apiErrorMessage } from '../../api/axiosInstance';

const PAGE_SIZE = 20;

const statusDots = {
  draft: 'bg-text-muted',
  sent: 'bg-accent-indigo',
  paid: 'bg-status-success',
  overdue: 'bg-status-danger',
  cancelled: 'bg-text-muted',
};

export default function InvoiceList() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState([]);
  const [clients, setClients] = useState([]);
  const [page, setPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [clientFilter, setClientFilter] = useState('');
  const [currency, setCurrency] = useState('USD');

  const clientMap = useMemo(() => {
    const m = {};
    clients.forEach((c) => (m[c.id] = c));
    return m;
  }, [clients]);

  const load = async (p = page) => {
    setLoading(true);
    try {
      const params = { skip: p * PAGE_SIZE, limit: PAGE_SIZE };
      if (statusFilter) params.status = statusFilter;
      if (clientFilter) params.client_id = clientFilter;
      const data = await invoiceApi.list(params);
      setInvoices(data);
    } catch (err) {
      toast.error(apiErrorMessage(err, 'Failed to load invoices'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Promise.all([clientApi.list({ limit: 100 }).catch(() => []), tenantApi.me().catch(() => null)]).then(
      ([cs, t]) => {
        setClients(cs);
        if (t) setCurrency(t.settings?.currency || 'USD');
      }
    );
  }, []);

  useEffect(() => {
    load(page);
  }, [page, statusFilter, clientFilter]);

  const clearFilters = () => {
    setStatusFilter('');
    setClientFilter('');
    setPage(0);
  };

  const filtersActive = statusFilter || clientFilter;
  const totalPages = Math.ceil(invoices.length / PAGE_SIZE) || 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Invoices</h2>
          <p className="text-sm text-text-muted mt-0.5">
            {invoices.length > 0 ? `${invoices.length} invoice${invoices.length > 1 ? 's' : ''} found` : 'All invoices across your workspace'}
          </p>
        </div>
        <Link to="/invoices/new">
          <Button icon={Plus}>New Invoice</Button>
        </Link>
      </div>

      {/* Main card */}
      <div className="glass-card rounded-2xl overflow-hidden">
        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-2 px-6 py-4 border-b border-white/[0.06]">
          {/* Status pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setStatusFilter('')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all duration-150 ${
                statusFilter === ''
                  ? 'bg-white/[0.1] text-white border-white/[0.2] shadow-glow-indigo'
                  : 'bg-transparent text-text-muted border-border-subtle hover:text-text-primary hover:bg-white/[0.04]'
              }`}
            >
              All
            </button>
            {INVOICE_STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => { setStatusFilter(s); setPage(0); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all duration-150 capitalize ${
                  statusFilter === s
                    ? `${invoiceStatusClass(s)} shadow-sm`
                    : 'bg-transparent text-text-muted border-border-subtle hover:text-text-primary hover:bg-white/[0.04]'
                }`}
              >
                {statusFilter !== s && (
                  <span className={`w-1.5 h-1.5 rounded-full ${statusDots[s] || 'bg-text-muted'}`} />
                )}
                {s}
              </button>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-2">
            <select
              value={clientFilter}
              onChange={(e) => { setClientFilter(e.target.value); setPage(0); }}
              className="h-8 px-3 rounded-xl bg-bg-elevated border border-border-subtle text-xs text-text-primary hover:border-border-strong transition-all"
            >
              <option value="">All clients</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {filtersActive && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1 text-xs text-text-muted hover:text-red-400 transition px-2 py-1 rounded-lg hover:bg-red-500/10"
              >
                <ClearIcon className="w-3 h-3" /> Clear
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <CenterSpinner />
        ) : invoices.length === 0 ? (
          <div className="py-8 px-6">
            <EmptyState
              icon={FileText}
              title={filtersActive ? 'No invoices match your filters' : 'No invoices yet'}
              description={
                filtersActive
                  ? 'Try clearing or adjusting the filters above.'
                  : 'Create your first invoice to start getting paid.'
              }
              action={
                !filtersActive && (
                  <Link to="/invoices/new">
                    <Button icon={Plus}>New Invoice</Button>
                  </Link>
                )
              }
            />
          </div>
        ) : (
          <>
            <Table>
              <THead>
                <TR>
                  <TH>Invoice</TH>
                  <TH>Client</TH>
                  <TH>Issue / Due</TH>
                  <TH>Status</TH>
                  <TH align="right">Total</TH>
                </TR>
              </THead>
              <TBody>
                {invoices.map((inv) => {
                  const c = clientMap[inv.client_id];
                  return (
                    <TR
                      key={inv.id}
                      onClick={() => navigate(`/invoices/${inv.id}`)}
                      className="hover:bg-white/[0.03] cursor-pointer transition-all"
                    >
                      <TD>
                        <p className="text-sm font-mono font-semibold text-text-primary">
                          {inv.invoice_number}
                        </p>
                        <p className="text-[10px] text-text-muted mt-0.5">
                          {inv.line_items?.length || 0} item{inv.line_items?.length !== 1 ? 's' : ''}
                        </p>
                      </TD>
                      <TD>
                        {c ? (
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center text-[11px] font-bold text-white shrink-0">
                              {c.name?.slice(0, 1).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-text-primary">{c.name}</p>
                              {c.company && (
                                <p className="text-[10px] text-text-muted">{c.company}</p>
                              )}
                            </div>
                          </div>
                        ) : (
                          <span className="text-text-muted">—</span>
                        )}
                      </TD>
                      <TD>
                        <p className="text-xs text-text-secondary">{formatDate(inv.issue_date)}</p>
                        <p className="text-[10px] text-text-muted mt-0.5">
                          Due {formatDate(inv.due_date)}
                        </p>
                      </TD>
                      <TD>
                        <Badge dot className={invoiceStatusClass(inv.status)}>
                          {inv.status}
                        </Badge>
                      </TD>
                      <TD align="right" className="text-sm font-bold text-text-primary tabular-nums">
                        {formatCurrency(inv.total, inv.currency || currency)}
                      </TD>
                    </TR>
                  );
                })}
              </TBody>
            </Table>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-white/[0.06]">
              <p className="text-xs text-text-muted">
                Page <span className="text-text-secondary font-medium">{page + 1}</span> · {invoices.length} {invoices.length === 1 ? 'invoice' : 'invoices'}
              </p>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="w-8 h-8 rounded-xl flex items-center justify-center border border-border-subtle text-text-muted hover:text-text-primary hover:border-border-strong hover:bg-white/[0.04] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-3 h-8 rounded-xl flex items-center justify-center glass-card border border-white/[0.1] text-xs font-medium text-text-primary min-w-[2rem]">
                  {page + 1}
                </span>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={invoices.length < PAGE_SIZE}
                  className="w-8 h-8 rounded-xl flex items-center justify-center border border-border-subtle text-text-muted hover:text-text-primary hover:border-border-strong hover:bg-white/[0.04] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
