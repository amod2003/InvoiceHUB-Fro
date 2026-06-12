import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Send,
  CheckCircle2,
  BellRing,
  Download,
  Copy,
  Trash2,
  Link2,
  ExternalLink,
} from 'lucide-react';
import toast from 'react-hot-toast';

import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { CenterSpinner } from '../../components/ui/Spinner';
import InvoicePreview from '../../components/invoice/InvoicePreview';

import { invoiceApi } from '../../api/invoiceApi';
import { clientApi } from '../../api/clientApi';
import { tenantApi } from '../../api/tenantApi';
import { paymentApi } from '../../api/paymentApi';
import { invoiceStatusClass } from '../../utils/statusColors';
import { apiErrorMessage } from '../../api/axiosInstance';
import { formatRelative } from '../../utils/dateUtils';

function ActionRow({ icon: Icon, label, description, children }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl glass-card hover:bg-white/[0.05] transition-all group">
      <div className="w-9 h-9 rounded-xl bg-white/[0.06] flex items-center justify-center shrink-0 group-hover:bg-white/[0.1] transition-all">
        <Icon className="w-4 h-4 text-text-secondary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text-primary">{label}</p>
        {description && <p className="text-[11px] text-text-muted mt-0.5">{description}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

export default function InvoiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [client, setClient] = useState(null);
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const inv = await invoiceApi.get(id);
      setInvoice(inv);
      const [c, t] = await Promise.all([
        clientApi.get(inv.client_id).catch(() => null),
        tenantApi.me().catch(() => null),
      ]);
      setClient(c);
      setTenant(t);
    } catch (err) {
      toast.error(apiErrorMessage(err, 'Failed to load invoice'));
      navigate('/invoices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const action = async (key, fn, success) => {
    setActing(key);
    try {
      const result = await fn();
      toast.success(success);
      return result;
    } catch (err) {
      toast.error(apiErrorMessage(err, 'Action failed'));
    } finally {
      setActing('');
    }
  };

  const handleSend = async () => { await action('send', () => invoiceApi.send(invoice.id), 'Invoice email sent'); load(); };
  const handleMarkPaid = async () => { await action('paid', () => invoiceApi.markPaid(invoice.id), 'Marked as paid'); load(); };
  const handleRemind = async () => { await action('remind', () => invoiceApi.remind(invoice.id), 'Reminder sent'); load(); };
  const handleDuplicate = async () => {
    const newInv = await action('duplicate', () => invoiceApi.duplicate(invoice.id), 'Invoice duplicated');
    if (newInv?.id) navigate(`/invoices/${newInv.id}`);
  };
  const handleDelete = async () => {
    await action('delete', () => invoiceApi.remove(invoice.id), 'Invoice deleted');
    setConfirmDelete(false);
    navigate('/invoices');
  };
  const handlePdf = async () => {
    setActing('pdf');
    try {
      const blob = await invoiceApi.downloadPdf(invoice.id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${invoice.invoice_number}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      toast.error(apiErrorMessage(err, 'PDF download failed'));
    } finally {
      setActing('');
    }
  };
  const handleCreateLink = async () => {
    const result = await action('link', () => paymentApi.createLink(invoice.id), 'Payment link created');
    if (result?.payment_link) {
      navigator.clipboard.writeText(result.payment_link).catch(() => {});
      load();
    }
  };

  if (loading || !invoice) return <CenterSpinner />;

  const isDraft = invoice.status === 'draft';
  const isOverdue = invoice.status === 'overdue';
  const isUnpaid = !['paid', 'cancelled'].includes(invoice.status);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/invoices"
          className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to invoices
        </Link>
        <div className="flex items-center gap-3">
          <p className="text-xs text-text-muted">
            Updated {formatRelative(invoice.updated_at)}
          </p>
          <Badge dot className={invoiceStatusClass(invoice.status)}>
            {invoice.status}
          </Badge>
        </div>
      </div>

      {/* Invoice number hero */}
      <div className="relative overflow-hidden glass-card rounded-2xl px-8 py-5 border-gradient-top">
        <div className="absolute inset-0 mesh-bg opacity-50" />
        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-xs text-text-muted uppercase tracking-widest mb-1">Invoice</p>
            <h1 className="text-3xl font-bold gradient-text font-mono">{invoice.invoice_number}</h1>
          </div>
          <Badge dot className={`${invoiceStatusClass(invoice.status)} text-sm px-4 py-2`}>
            {invoice.status}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Preview — takes 2 cols */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl overflow-hidden shadow-card-lg ring-1 ring-white/[0.08]">
            <InvoicePreview invoice={invoice} client={client} tenant={tenant} />
          </div>
        </div>

        {/* Sidebar — actions */}
        <div className="space-y-4">
          {/* Primary actions */}
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-white/[0.06]">
              <p className="text-sm font-semibold text-text-primary">Actions</p>
            </div>
            <div className="p-4 space-y-2">
              {isDraft && (
                <ActionRow icon={Send} label="Send to Client" description="Email this invoice to the client">
                  <Button size="sm" loading={acting === 'send'} onClick={handleSend}>
                    Send
                  </Button>
                </ActionRow>
              )}
              {isUnpaid && (
                <ActionRow icon={CheckCircle2} label="Mark as Paid" description="Record a manual payment">
                  <Button size="sm" variant="secondary" loading={acting === 'paid'} onClick={handleMarkPaid}>
                    Mark Paid
                  </Button>
                </ActionRow>
              )}
              {isOverdue && (
                <ActionRow icon={BellRing} label="Send Reminder" description="Nudge the client by email">
                  <Button size="sm" variant="secondary" loading={acting === 'remind'} onClick={handleRemind}>
                    Remind
                  </Button>
                </ActionRow>
              )}
              {isUnpaid && (
                <ActionRow
                  icon={Link2}
                  label={invoice.payment_link ? 'Refresh Stripe Link' : 'Create Stripe Link'}
                  description="Generate an online payment URL"
                >
                  <Button size="sm" variant="secondary" loading={acting === 'link'} onClick={handleCreateLink}>
                    {invoice.payment_link ? 'Refresh' : 'Create'}
                  </Button>
                </ActionRow>
              )}
              <ActionRow icon={Download} label="Download PDF" description="Save invoice as PDF file">
                <Button size="sm" variant="outline" loading={acting === 'pdf'} onClick={handlePdf}>
                  PDF
                </Button>
              </ActionRow>
              <ActionRow icon={Copy} label="Duplicate" description="Create a copy of this invoice">
                <Button size="sm" variant="outline" loading={acting === 'duplicate'} onClick={handleDuplicate}>
                  Copy
                </Button>
              </ActionRow>
              {isDraft && (
                <ActionRow icon={Trash2} label="Delete Draft" description="Permanently remove this invoice">
                  <Button size="sm" variant="danger" onClick={() => setConfirmDelete(true)}>
                    Delete
                  </Button>
                </ActionRow>
              )}
            </div>
          </div>

          {/* Payment link card */}
          {invoice.payment_link && (
            <div className="glass-card-elevated rounded-2xl overflow-hidden border-gradient-top">
              <div className="px-5 py-4 border-b border-white/[0.06]">
                <p className="text-sm font-semibold gradient-text">Payment Link</p>
                <p className="text-xs text-text-muted mt-0.5">Share this link to get paid online</p>
              </div>
              <div className="p-4 space-y-3">
                <div className="rounded-xl bg-bg-base border border-border-subtle p-3 text-xs text-text-muted break-all font-mono leading-relaxed">
                  {invoice.payment_link}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="flex-1"
                    icon={Copy}
                    onClick={() => {
                      navigator.clipboard.writeText(invoice.payment_link);
                      toast.success('Copied to clipboard');
                    }}
                  >
                    Copy
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="flex-1"
                    icon={ExternalLink}
                    onClick={() => window.open(invoice.payment_link, '_blank')}
                  >
                    Open
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title="Delete this draft?"
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmDelete(false)}>Cancel</Button>
            <Button variant="danger" icon={Trash2} loading={acting === 'delete'} onClick={handleDelete}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-text-secondary">
          Invoice <span className="font-mono text-text-primary">{invoice.invoice_number}</span> will
          be permanently removed. This cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
