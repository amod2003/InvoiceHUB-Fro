import { Trash2 } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

export default function LineItemRow({ item, index, currency, onChange, onRemove, removable }) {
  const amount = Number(item.quantity || 0) * Number(item.unit_price || 0);

  return (
    <div className="flex items-center gap-2 py-2 group">
      <input
        type="text"
        value={item.description}
        onChange={(e) => onChange(index, { description: e.target.value })}
        placeholder={`Item ${index + 1}…`}
        className="flex-1 h-9 px-3 rounded-lg bg-bg-elevated border border-border-subtle text-sm text-text-primary placeholder:text-text-muted focus:border-accent-indigo focus:bg-bg-surface focus:ring-2 focus:ring-accent-indigo/20 outline-none transition"
      />
      <input
        type="number"
        step="0.01"
        min="0.01"
        value={item.quantity}
        onChange={(e) => onChange(index, { quantity: parseFloat(e.target.value) || 0 })}
        className="w-20 h-9 px-2 rounded-lg bg-bg-elevated border border-border-subtle text-sm text-text-primary text-right tabular-nums focus:border-accent-indigo focus:bg-bg-surface focus:ring-2 focus:ring-accent-indigo/20 outline-none transition"
      />
      <input
        type="number"
        step="0.01"
        min="0"
        value={item.unit_price}
        onChange={(e) => onChange(index, { unit_price: parseFloat(e.target.value) || 0 })}
        className="w-24 h-9 px-2 rounded-lg bg-bg-elevated border border-border-subtle text-sm text-text-primary text-right tabular-nums focus:border-accent-indigo focus:bg-bg-surface focus:ring-2 focus:ring-accent-indigo/20 outline-none transition"
      />
      <input
        type="number"
        step="0.1"
        min="0"
        max="100"
        value={item.tax_percent}
        onChange={(e) => onChange(index, { tax_percent: parseFloat(e.target.value) || 0 })}
        className="w-16 h-9 px-2 rounded-lg bg-bg-elevated border border-border-subtle text-sm text-text-primary text-right tabular-nums focus:border-accent-indigo focus:bg-bg-surface focus:ring-2 focus:ring-accent-indigo/20 outline-none transition"
      />
      <div className="w-28 text-right text-sm font-semibold text-text-primary tabular-nums pr-1">
        {formatCurrency(amount, currency)}
      </div>
      <button
        type="button"
        onClick={() => onRemove(index)}
        disabled={!removable}
        className="p-1.5 rounded-md text-text-muted hover:text-red-400 hover:bg-red-500/10 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-text-muted transition"
        aria-label="Remove line item"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
