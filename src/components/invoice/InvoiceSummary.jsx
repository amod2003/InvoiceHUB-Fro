import { formatCurrency } from '../../utils/formatCurrency';

export default function InvoiceSummary({ subtotal, tax_amount, discount, total, currency }) {
  const Row = ({ label, value, accent = false }) => (
    <div className={`flex items-center justify-between text-sm ${accent ? 'pt-3 border-t border-white/[0.06]' : ''}`}>
      <span className={accent ? 'font-semibold text-text-primary' : 'text-text-muted'}>{label}</span>
      <span
        className={`tabular-nums ${accent ? 'text-lg font-bold gradient-text' : 'text-text-primary font-medium'}`}
      >
        {value}
      </span>
    </div>
  );

  return (
    <div className="space-y-2.5">
      <Row label="Subtotal" value={formatCurrency(subtotal, currency)} />
      <Row label="Tax" value={formatCurrency(tax_amount, currency)} />
      {Number(discount) > 0 && (
        <Row label="Discount" value={`− ${formatCurrency(discount, currency)}`} />
      )}
      <Row label="Total Due" value={formatCurrency(total, currency)} accent />
    </div>
  );
}
