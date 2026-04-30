import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Save, Users } from 'lucide-react';
import toast from 'react-hot-toast';

import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Textarea from '../../components/ui/Textarea';
import LineItemRow from '../../components/invoice/LineItemRow';
import InvoiceSummary from '../../components/invoice/InvoiceSummary';

import { invoiceApi } from '../../api/invoiceApi';
import { clientApi } from '../../api/clientApi';
import { tenantApi } from '../../api/tenantApi';
import { useInvoiceStore } from '../../store/invoiceStore';
import { useInvoiceTotals } from '../../hooks/useInvoice';
import { todayInput, addDaysInput } from '../../utils/dateUtils';
import { apiErrorMessage } from '../../api/axiosInstance';

export default function InvoiceCreate() {
  const navigate = useNavigate();
  const { draft, setField, addItem, removeItem, updateItem, reset } = useInvoiceStore();
  const [clients, setClients] = useState([]);
  const [tenant, setTenant] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { subtotal, tax_amount, total } = useInvoiceTotals(draft.line_items, draft.discount);

  useEffect(() => {
    Promise.all([clientApi.list({ limit: 100 }).catch(() => []), tenantApi.me().catch(() => null)]).then(
      ([cs, t]) => {
        setClients(cs);
        if (t) {
          setTenant(t);
          if (!draft.currency || draft.currency === 'USD') {
            setField('currency', t.settings?.currency || 'USD');
          }
          if (!draft.issue_date) setField('issue_date', todayInput());
          if (!draft.due_date) {
            setField('due_date', addDaysInput(t.settings?.payment_terms || 30));
          }
        }
      }
    );
    return () => {
      // keep draft on unmount unless successfully submitted
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!draft.client_id) {
      toast.error('Please select a client');
      return;
    }
    if (!draft.line_items.length || !draft.line_items.some((it) => it.description?.trim())) {
      toast.error('Add at least one line item');
      return;
    }
    setSubmitting(true);
    const payload = {
      client_id: draft.client_id,
      issue_date: new Date(draft.issue_date).toISOString(),
      due_date: new Date(draft.due_date).toISOString(),
      line_items: draft.line_items.map((it) => ({
        description: it.description,
        quantity: Number(it.quantity),
        unit_price: Number(it.unit_price),
        tax_percent: Number(it.tax_percent || 0),
        amount: Number(it.quantity) * Number(it.unit_price),
      })),
      discount: Number(draft.discount || 0),
      notes: draft.notes || null,
      terms: draft.terms || null,
      currency: draft.currency || 'USD',
      is_recurring: false,
    };
    try {
      const inv = await invoiceApi.create(payload);
      toast.success(`Invoice ${inv.invoice_number} created`);
      reset();
      navigate(`/invoices/${inv.id}`);
    } catch (err) {
      toast.error(apiErrorMessage(err, 'Failed to create invoice'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Link
        to="/invoices"
        className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to invoices
      </Link>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — main form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader title="Details" subtitle="Who is this invoice for?" />
            <CardBody className="space-y-4">
              {clients.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border-subtle p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-text-muted">
                    <Users className="w-4 h-4" /> No clients yet — add one first.
                  </div>
                  <Link to="/clients/new">
                    <Button size="sm" variant="secondary" icon={Plus}>
                      Add Client
                    </Button>
                  </Link>
                </div>
              ) : (
                <Select
                  label="Client"
                  value={draft.client_id}
                  onChange={(e) => setField('client_id', e.target.value)}
                  placeholder="Select a client…"
                  options={clients.map((c) => ({ value: c.id, label: `${c.name}${c.company ? ' — ' + c.company : ''}` }))}
                />
              )}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  type="date"
                  label="Issue date"
                  value={draft.issue_date}
                  onChange={(e) => setField('issue_date', e.target.value)}
                />
                <Input
                  type="date"
                  label="Due date"
                  value={draft.due_date}
                  onChange={(e) => setField('due_date', e.target.value)}
                />
                <Select
                  label="Currency"
                  value={draft.currency}
                  onChange={(e) => setField('currency', e.target.value)}
                  options={[
                    { value: 'USD', label: 'USD — US Dollar' },
                    { value: 'INR', label: 'INR — Indian Rupee' },
                    { value: 'EUR', label: 'EUR — Euro' },
                    { value: 'GBP', label: 'GBP — British Pound' },
                  ]}
                />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title="Line Items"
              subtitle="Describe what you're billing for."
              action={
                <Button type="button" size="sm" variant="secondary" icon={Plus} onClick={addItem}>
                  Add Item
                </Button>
              }
            />
            <CardBody className="space-y-1">
              <div className="flex items-center gap-2 px-1 pb-2 text-[10px] uppercase tracking-wider text-text-muted">
                <span className="flex-1">Description</span>
                <span className="w-20 text-right">Qty</span>
                <span className="w-24 text-right">Unit</span>
                <span className="w-16 text-right">Tax %</span>
                <span className="w-28 text-right pr-1">Amount</span>
                <span className="w-7" />
              </div>
              <div className="divide-y divide-white/[0.04]">
                {draft.line_items.map((item, idx) => (
                  <LineItemRow
                    key={idx}
                    index={idx}
                    item={item}
                    currency={draft.currency}
                    onChange={updateItem}
                    onRemove={removeItem}
                    removable={draft.line_items.length > 1}
                  />
                ))}
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Notes & Terms" />
            <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Textarea
                label="Notes"
                placeholder="Visible to the client on the invoice…"
                rows={4}
                value={draft.notes}
                onChange={(e) => setField('notes', e.target.value)}
              />
              <Textarea
                label="Terms"
                placeholder="Payment terms, late fees, etc."
                rows={4}
                value={draft.terms}
                onChange={(e) => setField('terms', e.target.value)}
              />
            </CardBody>
          </Card>
        </div>

        {/* Right — summary */}
        <div className="space-y-6">
          <Card glow>
            <CardHeader title="Summary" />
            <CardBody>
              <InvoiceSummary
                subtotal={subtotal}
                tax_amount={tax_amount}
                discount={Number(draft.discount || 0)}
                total={total}
                currency={draft.currency}
              />
              <div className="mt-4">
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  label="Discount"
                  value={draft.discount}
                  onChange={(e) => setField('discount', parseFloat(e.target.value) || 0)}
                />
              </div>
            </CardBody>
          </Card>

          <Button type="submit" icon={Save} loading={submitting} size="lg" className="w-full">
            Create Invoice
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              reset();
              navigate('/invoices');
            }}
            className="w-full"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
