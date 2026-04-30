import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus,
  FileText,
  ChevronLeft,
  ChevronRight,
  Filter,
  X as ClearIcon,
} from 'lucide-react';
import toast from 'react-hot-toast';

import Card, { CardBody, CardHeader } from '../../components/ui/Card';
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader
          title="Invoices"
          subtitle="All invoices across your workspace."
          action={
            <Link to="/invoices/new">
              <Button icon={Plus} size="sm">
                New Invoice
              </Button>
            </Link>
          }
        />
        <CardBody className="px-0 pb-0">
          {/* Filter bar */}
          <div className="flex flex-wrap items-center gap-2 px-6 pb-4">
            <div className="flex items-center gap-1.5 text-xs text-text-muted">
              <Filter className="w-3.5 h-3.5" /> Status:
            </div>
            <button
              onClick={() => setStatusFilter('')}
              className={`px-2.5 py-1 rounded-full text-xs font-medium border transition ${
                statusFilter === ''
                  ? 'bg-white/10 text-white border-white/20'
                  : 'bg-transparent text-text-muted border-border-subtle hover:text-text-primary'
              }`}
            >
              All
            </button>
            {INVOICE_STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setStatusFilter(s);
                  setPage(0);
                }}
                className={`px-2.5 py-1 rounded-full text-xs font-medium border transition capitalize ${
                  statusFilter === s
                    ? invoiceStatusClass(s)
                    : 'bg-transparent text-text-muted border-border-subtle hover:text-text-primary'
                }`}
              >
                {s}
              </button>
            ))}
            <div className="ml-auto flex items-center gap-2">
              <select
                value={clientFilter}
                onChange={(e) => {
                  setClientFilter(e.target.value);
                  setPage(0);
                }}
                className="h-8 px-3 rounded-lg bg-bg-elevated border border-border-subtle text-xs text-text-primary"
              >
                <option value="">All clients</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {filtersActive && (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1 text-xs text-text-muted hover:text-red-400 transition"
                >
                  <ClearIcon className="w-3 h-3" /> Clear
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <CenterSpinner />
          ) : invoices.length === 0 ? (
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
                      <TR key={inv.id} onClick={() => navigate(`/invoices/${inv.id}`)}>
                        <TD>
                          <p className="text-sm font-mono font-medium text-text-primary">
                            {inv.invoice_number}
                          </p>
                          <p className="text-[10px] text-text-muted mt-0.5">
                            {inv.line_items?.length || 0} items
                          </p>
                        </TD>
                        <TD>
                          {c ? (
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-md gradient-primary flex items-center justify-center text-[10px] font-semibold text-white">
                                {c.name?.slice(0, 1).toUpperCase()}
                              </div>
                              <div>
                                <p className="text-sm text-text-primary">{c.name}</p>
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
                        <TD align="right" className="text-sm font-semibold text-text-primary tabular-nums">
                          {formatCurrency(inv.total, inv.currency || currency)}
                        </TD>
                      </TR>
                    );
                  })}
                </TBody>
              </Table>

              <div className="flex items-center justify-between px-6 py-4 border-t border-white/[0.04]">
                <p className="text-xs text-text-muted">
                  Page {page + 1} · Showing {invoices.length} {invoices.length === 1 ? 'invoice' : 'invoices'}
                </p>
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
                    disabled={invoices.length < PAGE_SIZE}
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
