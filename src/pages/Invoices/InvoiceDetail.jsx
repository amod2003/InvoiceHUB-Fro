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

import Card, { CardBody, CardHeader } from '../../components/ui/Card';
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

  const handleSend = async () => {
    await action('send', () => invoiceApi.send(invoice.id), 'Invoice email sent');
    load();
  };
  const handleMarkPaid = async () => {
    await action('paid', () => invoiceApi.markPaid(invoice.id), 'Marked as paid');
    load();
  };
  const handleRemind = async () => {
    await action('remind', () => invoiceApi.remind(invoice.id), 'Reminder sent');
    load();
  };
  const handleDuplicate = async () => {
    const newInv = await action(
      'duplicate',
      () => invoiceApi.duplicate(invoice.id),
      'Invoice duplicated'
    );
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
    const result = await action(
      'link',
      () => paymentApi.createLink(invoice.id),
      'Payment link created'
    );
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
      <div className="flex items-center justify-between">
        <Link
          to="/invoices"
          className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to invoices
        </Link>
        <Badge dot className={invoiceStatusClass(invoice.status)}>
          {invoice.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Preview */}
        <div className="lg:col-span-2">
          <InvoicePreview invoice={invoice} client={client} tenant={tenant} />
        </div>

        {/* Sidebar — actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader title="Actions" subtitle={`Last updated ${formatRelative(invoice.updated_at)}`} />
            <CardBody className="space-y-2">
              {isDraft && (
                <Button
                  className="w-full"
                  icon={Send}
                  loading={acting === 'send'}
                  onClick={handleSend}
                >
                  Send to Client
                </Button>
              )}
              {isUnpaid && (
                <Button
                  variant="secondary"
                  className="w-full"
                  icon={CheckCircle2}
                  loading={acting === 'paid'}
                  onClick={handleMarkPaid}
                >
                  Mark as Paid
                </Button>
              )}
              {isOverdue && (
                <Button
                  variant="secondary"
                  className="w-full"
                  icon={BellRing}
                  loading={acting === 'remind'}
                  onClick={handleRemind}
                >
                  Send Reminder
                </Button>
              )}
              {isUnpaid && (
                <Button
                  variant="secondary"
                  className="w-full"
                  icon={Link2}
                  loading={acting === 'link'}
                  onClick={handleCreateLink}
                >
                  {invoice.payment_link ? 'Refresh Stripe Link' : 'Create Stripe Link'}
                </Button>
              )}
              <Button
                variant="outline"
                className="w-full"
                icon={Download}
                loading={acting === 'pdf'}
                onClick={handlePdf}
              >
                Download PDF
              </Button>
              <Button
                variant="outline"
                className="w-full"
                icon={Copy}
                loading={acting === 'duplicate'}
                onClick={handleDuplicate}
              >
                Duplicate
              </Button>
              {isDraft && (
                <Button
                  variant="danger"
                  className="w-full"
                  icon={Trash2}
                  onClick={() => setConfirmDelete(true)}
                >
                  Delete Draft
                </Button>
              )}
            </CardBody>
          </Card>

          {invoice.payment_link && (
            <Card>
              <CardHeader title="Payment Link" />
              <CardBody className="space-y-2">
                <div className="rounded-lg bg-bg-elevated border border-border-subtle p-3 text-xs text-text-secondary break-all font-mono">
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
                      toast.success('Copied');
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
              </CardBody>
            </Card>
          )}
        </div>
      </div>

      <Modal
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title="Delete this draft?"
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmDelete(false)}>
              Cancel
            </Button>
            <Button variant="danger" icon={Trash2} loading={acting === 'delete'} onClick={handleDelete}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-text-secondary">
          Invoice <span className="font-mono text-text-primary">{invoice.invoice_number}</span> will
          be permanently removed.
        </p>
      </Modal>
    </div>
  );
}
