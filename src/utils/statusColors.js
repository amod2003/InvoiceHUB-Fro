export const INVOICE_STATUSES = ['draft', 'sent', 'viewed', 'paid', 'overdue', 'cancelled'];

export const PAYMENT_STATUSES = ['pending', 'completed', 'failed', 'refunded'];

export const PAYMENT_METHODS = ['stripe', 'manual', 'bank_transfer'];

export function invoiceStatusClass(status) {
  switch (status) {
    case 'draft':
      return 'bg-white/5 text-text-muted border-border-subtle';
    case 'sent':
      return 'bg-status-info/10 text-blue-300 border-blue-500/30';
    case 'viewed':
      return 'bg-accent-violet/10 text-violet-300 border-accent-violet/30';
    case 'paid':
      return 'bg-status-success/10 text-emerald-300 border-status-success/30';
    case 'overdue':
      return 'bg-status-danger/10 text-red-300 border-status-danger/30';
    case 'cancelled':
      return 'bg-white/5 text-text-muted border-border-subtle line-through';
    default:
      return 'bg-white/5 text-text-muted border-border-subtle';
  }
}

export function paymentStatusClass(status) {
  switch (status) {
    case 'completed':
      return 'bg-status-success/10 text-emerald-300 border-status-success/30';
    case 'pending':
      return 'bg-status-warning/10 text-amber-300 border-status-warning/30';
    case 'failed':
      return 'bg-status-danger/10 text-red-300 border-status-danger/30';
    case 'refunded':
      return 'bg-accent-cyan/10 text-cyan-300 border-accent-cyan/30';
    default:
      return 'bg-white/5 text-text-muted border-border-subtle';
  }
}

export function paymentMethodLabel(method) {
  switch (method) {
    case 'stripe':
      return 'Stripe';
    case 'manual':
      return 'Manual';
    case 'bank_transfer':
      return 'Bank Transfer';
    default:
      return method;
  }
}
