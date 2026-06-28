import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Send, FileText, ListOrdered, Eye, Users } from 'lucide-react';
import toast from 'react-hot-toast';

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

const steps = [
  { label: 'Details', icon: FileText },
  { label: 'Line Items', icon: ListOrdered },
  { label: 'Notes & Terms', icon: Eye },
];

function SectionCard({ icon: Icon, title, subtitle, action, children }) {
  return (
    <div className="rounded-2xl overflow-hidden bg-text-primary/[0.03] border border-text-primary/[0.09]">
      <div className="flex items-center justify-between px-6 py-4 border-b border-text-primary/[0.07]">
        <div className="flex items-center gap-3">
          <div className="text-text-muted">
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary">{title}</p>
            {subtitle && <p className="text-xs text-text-muted mt-0.5">{subtitle}</p>}
          </div>
        </div>
        {action}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

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
      {/* Back link */}
      <Link
        to="/invoices"
        className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to invoices
      </Link>

      {/* Page title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary tracking-tight">New Invoice</h2>
          <p className="text-sm text-text-muted mt-0.5">Fill in the details to create your invoice</p>
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <div key={step.label} className="flex items-center gap-2">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                i === 0
                  ? 'bg-text-primary text-bg-base border-text-primary'
                  : 'bg-text-primary/[0.04] border-text-primary/[0.09] text-text-muted'
              }`}>
                <Icon className="w-3.5 h-3.5" />
                {step.label}
              </div>
              {i < steps.length - 1 && (
                <div className="w-6 h-px bg-border-subtle" />
              )}
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — main form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Details */}
          <SectionCard icon={FileText} title="Details" subtitle="Who is this invoice for?" accent="indigo">
            <div className="space-y-4">
              {clients.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border-strong p-5 flex items-center justify-between bg-text-primary/[0.02]">
                  <div className="flex items-center gap-2.5 text-sm text-text-muted">
                    <Users className="w-4 h-4" /> No clients yet — add one first.
                  </div>
                  <Link to="/clients/new">
                    <Button size="sm" variant="secondary" icon={Plus}>Add Client</Button>
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
            </div>
          </SectionCard>

          {/* Line Items */}
          <SectionCard
            icon={ListOrdered}
            title="Line Items"
            subtitle="Describe what you're billing for."
            accent="violet"
            action={
              <Button type="button" size="sm" variant="secondary" icon={Plus} onClick={addItem}>
                Add Item
              </Button>
            }
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2 pb-3 text-[10px] uppercase tracking-widest text-text-muted border-b border-text-primary/[0.07]">
                <span className="flex-1">Description</span>
                <span className="w-20 text-right">Qty</span>
                <span className="w-24 text-right">Unit</span>
                <span className="w-16 text-right">Tax %</span>
                <span className="w-28 text-right pr-1">Amount</span>
                <span className="w-7" />
              </div>
              <div className="divide-y divide-text-primary/[0.06]">
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
            </div>
          </SectionCard>

          {/* Notes & Terms */}
          <SectionCard icon={Eye} title="Notes & Terms" accent="cyan">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>
          </SectionCard>
        </div>

        {/* Right — sticky summary */}
        <div className="space-y-4">
          <div className="lg:sticky lg:top-6 space-y-4">
            {/* Summary card */}
            <div className="border-gradient-top rounded-2xl overflow-hidden shadow-card-lg bg-text-primary/[0.05] border border-text-primary/[0.11]">
              <div className="px-6 py-4 border-b border-text-primary/[0.07]">
                <p className="text-sm font-semibold text-text-primary">Summary</p>
                <p className="text-xs text-text-muted mt-0.5">Invoice total breakdown</p>
              </div>
              <div className="p-6 space-y-4">
                <InvoiceSummary
                  subtotal={subtotal}
                  tax_amount={tax_amount}
                  discount={Number(draft.discount || 0)}
                  total={total}
                  currency={draft.currency}
                />
                <div className="pt-2 border-t border-text-primary/[0.07]">
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    label="Discount"
                    value={draft.discount}
                    onChange={(e) => setField('discount', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <Button
              type="submit"
              icon={Send}
              loading={submitting}
              size="lg"
              className="w-full"
            >
              Create Invoice
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => { reset(); navigate('/invoices'); }}
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
