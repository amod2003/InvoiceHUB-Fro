import { create } from 'zustand';

const blankItem = () => ({
  description: '',
  quantity: 1,
  unit_price: 0,
  tax_percent: 0,
  amount: 0,
});

export const useInvoiceStore = create((set, get) => ({
  draft: {
    client_id: '',
    issue_date: '',
    due_date: '',
    line_items: [blankItem()],
    discount: 0,
    notes: '',
    terms: '',
    currency: 'USD',
    is_recurring: false,
    recurrence: null,
  },

  setField: (key, value) => set((s) => ({ draft: { ...s.draft, [key]: value } })),

  addItem: () => set((s) => ({ draft: { ...s.draft, line_items: [...s.draft.line_items, blankItem()] } })),

  removeItem: (idx) =>
    set((s) => ({
      draft: {
        ...s.draft,
        line_items: s.draft.line_items.filter((_, i) => i !== idx),
      },
    })),

  updateItem: (idx, patch) =>
    set((s) => ({
      draft: {
        ...s.draft,
        line_items: s.draft.line_items.map((it, i) => {
          if (i !== idx) return it;
          const next = { ...it, ...patch };
          next.amount = Number(next.quantity || 0) * Number(next.unit_price || 0);
          return next;
        }),
      },
    })),

  reset: () =>
    set({
      draft: {
        client_id: '',
        issue_date: '',
        due_date: '',
        line_items: [blankItem()],
        discount: 0,
        notes: '',
        terms: '',
        currency: 'USD',
        is_recurring: false,
        recurrence: null,
      },
    }),

  totals: () => {
    const { line_items, discount } = get().draft;
    const subtotal = line_items.reduce((acc, it) => acc + Number(it.quantity || 0) * Number(it.unit_price || 0), 0);
    const tax_amount = line_items.reduce(
      (acc, it) =>
        acc + (Number(it.quantity || 0) * Number(it.unit_price || 0) * Number(it.tax_percent || 0)) / 100,
      0
    );
    const total = Math.max(subtotal + tax_amount - Number(discount || 0), 0);
    return { subtotal, tax_amount, total };
  },
}));
