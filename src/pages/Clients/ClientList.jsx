import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Users,
  MoreHorizontal,
  Pencil,
  Trash2,
  Mail,
  Phone,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import toast from 'react-hot-toast';

import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Table, THead, TBody, TR, TH, TD } from '../../components/ui/Table';
import { CenterSpinner } from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import Modal from '../../components/ui/Modal';
import { clientApi } from '../../api/clientApi';
import { tenantApi } from '../../api/tenantApi';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/dateUtils';
import { apiErrorMessage } from '../../api/axiosInstance';

const PAGE_SIZE = 20;

export default function ClientList() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState([]);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [currency, setCurrency] = useState('USD');

  const load = async (p = page) => {
    setLoading(true);
    try {
      const data = await clientApi.list({ skip: p * PAGE_SIZE, limit: PAGE_SIZE });
      setClients(data);
    } catch (err) {
      toast.error(apiErrorMessage(err, 'Failed to load clients'));
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

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return clients;
    return clients.filter(
      (c) =>
        c.name?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.company?.toLowerCase().includes(q)
    );
  }, [clients, search]);

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await clientApi.remove(confirmDelete.id);
      toast.success(`Removed ${confirmDelete.name}`);
      setConfirmDelete(null);
      load();
    } catch (err) {
      toast.error(apiErrorMessage(err, 'Delete failed'));
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader
          title="Clients"
          subtitle="Manage your customer directory and billing contacts."
          action={
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 px-3 h-9 rounded-lg bg-bg-elevated border border-border-subtle">
                <Search className="w-3.5 h-3.5 text-text-muted" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search clients…"
                  className="bg-transparent text-sm text-text-primary placeholder:text-text-muted w-48"
                />
              </div>
              <Link to="/clients/new">
                <Button icon={Plus} size="sm">
                  New Client
                </Button>
              </Link>
            </div>
          }
        />
        <CardBody className="px-0 pb-0">
          {loading ? (
            <CenterSpinner />
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={Users}
              title={search ? 'No matches' : 'No clients yet'}
              description={
                search
                  ? 'Try a different search term.'
                  : 'Add your first client to start invoicing them.'
              }
              action={
                !search && (
                  <Link to="/clients/new">
                    <Button icon={Plus}>Add Client</Button>
                  </Link>
                )
              }
            />
          ) : (
            <>
              <Table>
                <THead>
                  <TR>
                    <TH>Client</TH>
                    <TH>Contact</TH>
                    <TH>Company</TH>
                    <TH align="right">Invoiced</TH>
                    <TH>Created</TH>
                    <TH align="right">Actions</TH>
                  </TR>
                </THead>
                <TBody>
                  {filtered.map((c) => (
                    <TR key={c.id} onClick={() => navigate(`/clients/${c.id}/edit`)}>
                      <TD>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center text-xs font-semibold text-white">
                            {c.name?.slice(0, 1).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-text-primary">{c.name}</p>
                            {c.gstin && (
                              <p className="text-[10px] text-text-muted font-mono mt-0.5">
                                GSTIN: {c.gstin}
                              </p>
                            )}
                          </div>
                        </div>
                      </TD>
                      <TD>
                        <div className="space-y-0.5">
                          <p className="text-xs flex items-center gap-1.5 text-text-secondary">
                            <Mail className="w-3 h-3" /> {c.email}
                          </p>
                          {c.phone && (
                            <p className="text-xs flex items-center gap-1.5 text-text-muted">
                              <Phone className="w-3 h-3" /> {c.phone}
                            </p>
                          )}
                        </div>
                      </TD>
                      <TD>{c.company || <span className="text-text-muted">—</span>}</TD>
                      <TD align="right" className="font-medium text-text-primary tabular-nums">
                        {formatCurrency(c.total_invoiced || 0, currency)}
                      </TD>
                      <TD className="text-text-muted">{formatDate(c.created_at)}</TD>
                      <TD align="right">
                        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => navigate(`/clients/${c.id}/edit`)}
                            className="p-1.5 rounded-md text-text-muted hover:text-accent-cyan hover:bg-white/5 transition"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setConfirmDelete(c)}
                            className="p-1.5 rounded-md text-text-muted hover:text-red-400 hover:bg-red-500/10 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </TD>
                    </TR>
                  ))}
                </TBody>
              </Table>

              <div className="flex items-center justify-between px-6 py-4 border-t border-white/[0.04]">
                <p className="text-xs text-text-muted">
                  Page {page + 1} · Showing {filtered.length} {filtered.length === 1 ? 'client' : 'clients'}
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
                    disabled={clients.length < PAGE_SIZE}
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

      <Modal
        open={Boolean(confirmDelete)}
        onClose={() => setConfirmDelete(null)}
        title="Remove client?"
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmDelete(null)}>
              Cancel
            </Button>
            <Button variant="danger" icon={Trash2} onClick={handleDelete}>
              Remove
            </Button>
          </>
        }
      >
        <p className="text-sm text-text-secondary">
          This will soft-delete <span className="text-text-primary font-medium">{confirmDelete?.name}</span>.
          Their invoice history will be preserved.
        </p>
      </Modal>
    </div>
  );
}
