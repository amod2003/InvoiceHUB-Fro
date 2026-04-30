import api from './axiosInstance';

export const paymentApi = {
  list: (params = {}) => api.get('/payments/', { params }).then((r) => r.data),
  get: (id) => api.get(`/payments/${id}`).then((r) => r.data),
  createLink: (invoiceId) =>
    api.post('/payments/create-link', null, { params: { invoice_id: invoiceId } }).then((r) => r.data),
};
