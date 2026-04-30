import { useMemo } from 'react';

export function useInvoiceTotals(line_items = [], discount = 0) {
  return useMemo(() => {
    const subtotal = line_items.reduce(
      (acc, it) => acc + Number(it.quantity || 0) * Number(it.unit_price || 0),
      0
    );
    const tax_amount = line_items.reduce(
      (acc, it) =>
        acc +
        (Number(it.quantity || 0) * Number(it.unit_price || 0) * Number(it.tax_percent || 0)) / 100,
      0
    );
    const total = Math.max(subtotal + tax_amount - Number(discount || 0), 0);
    return { subtotal, tax_amount, total };
  }, [line_items, discount]);
}
