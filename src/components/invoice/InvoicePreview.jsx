import { Sparkles } from 'lucide-react';
import Badge from '../ui/Badge';
import { formatDate } from '../../utils/dateUtils';
import { formatCurrency } from '../../utils/formatCurrency';
import { invoiceStatusClass } from '../../utils/statusColors';

export default function InvoicePreview({ invoice, client, tenant }) {
  if (!invoice) return null;
  const settings = tenant?.settings || {};
  const currency = invoice.currency || settings.currency || 'USD';

  return (
    <div className="rounded-2xl bg-white text-slate-900 p-8 md:p-10 shadow-glow-indigo">
      {/* Header */}
      <div className="flex items-start justify-between pb-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          {settings.logo_url ? (
            <img src={settings.logo_url} alt="Logo" className="w-12 h-12 rounded-lg object-cover" />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-cyan-400 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          )}
          <div>
            <p className="text-lg font-bold">{tenant?.name || 'InvoiceHub'}</p>
            <p className="text-xs text-slate-500">{tenant?.email}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-widest text-slate-400">Invoice</p>
          <p className="text-2xl font-bold mt-1 font-mono">{invoice.invoice_number}</p>
          <Badge dot className={`mt-2 ${invoiceStatusClass(invoice.status)} bg-opacity-100`}>
            {invoice.status}
          </Badge>
        </div>
      </div>

      {/* Bill to / dates */}
      <div className="grid grid-cols-2 gap-6 py-6">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-2">Bill To</p>
          <p className="text-sm font-semibold text-slate-900">{client?.name || '—'}</p>
          {client?.company && <p className="text-xs text-slate-600">{client.company}</p>}
          <p className="text-xs text-slate-600 mt-1">{client?.email}</p>
          {client?.address?.line1 && (
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              {client.address.line1}
              <br />
              {[client.address.city, client.address.state, client.address.postal_code]
                .filter(Boolean)
                .join(', ')}
              {client.address.country && (
                <>
                  <br />
                  {client.address.country}
                </>
              )}
            </p>
          )}
          {client?.gstin && (
            <p className="text-[10px] text-slate-400 font-mono mt-2">GSTIN: {client.gstin}</p>
          )}
        </div>
        <div className="text-right space-y-2">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-slate-400">Issue Date</p>
            <p className="text-sm font-medium">{formatDate(invoice.issue_date)}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-slate-400">Due Date</p>
            <p className="text-sm font-medium">{formatDate(invoice.due_date)}</p>
          </div>
        </div>
      </div>

      {/* Line items */}
      <table className="w-full text-sm border-t border-slate-200">
        <thead>
          <tr className="text-[10px] uppercase tracking-widest text-slate-400">
            <th className="text-left py-3">Description</th>
            <th className="text-right py-3 w-16">Qty</th>
            <th className="text-right py-3 w-24">Unit</th>
            <th className="text-right py-3 w-16">Tax</th>
            <th className="text-right py-3 w-28">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {invoice.line_items?.map((it, i) => {
            const amount = (it.amount ?? Number(it.quantity) * Number(it.unit_price)) || 0;
            return (
              <tr key={i}>
                <td className="py-3 text-slate-800">{it.description || '—'}</td>
                <td className="py-3 text-right text-slate-600 tabular-nums">{it.quantity}</td>
                <td className="py-3 text-right text-slate-600 tabular-nums">
                  {formatCurrency(it.unit_price, currency)}
                </td>
                <td className="py-3 text-right text-slate-600 tabular-nums">{it.tax_percent}%</td>
                <td className="py-3 text-right font-semibold text-slate-900 tabular-nums">
                  {formatCurrency(amount, currency)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end pt-6">
        <div className="w-full max-w-xs space-y-2 text-sm">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal</span>
            <span className="tabular-nums">{formatCurrency(invoice.subtotal, currency)}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Tax</span>
            <span className="tabular-nums">{formatCurrency(invoice.tax_amount, currency)}</span>
          </div>
          {Number(invoice.discount) > 0 && (
            <div className="flex justify-between text-slate-600">
              <span>Discount</span>
              <span className="tabular-nums">− {formatCurrency(invoice.discount, currency)}</span>
            </div>
          )}
          <div className="flex justify-between pt-3 border-t border-slate-200">
            <span className="text-base font-bold text-slate-900">Total</span>
            <span className="text-xl font-bold tabular-nums bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 bg-clip-text text-transparent">
              {formatCurrency(invoice.total, currency)}
            </span>
          </div>
        </div>
      </div>

      {(invoice.notes || invoice.terms) && (
        <div className="mt-8 pt-6 border-t border-slate-200 grid grid-cols-2 gap-6">
          {invoice.notes && (
            <div>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-1">Notes</p>
              <p className="text-xs text-slate-600 leading-relaxed">{invoice.notes}</p>
            </div>
          )}
          {invoice.terms && (
            <div>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-1">Terms</p>
              <p className="text-xs text-slate-600 leading-relaxed">{invoice.terms}</p>
            </div>
          )}
        </div>
      )}

      <p className="text-center text-[10px] text-slate-400 mt-8 pt-4 border-t border-slate-100">
        Generated by InvoiceHub
      </p>
    </div>
  );
}
