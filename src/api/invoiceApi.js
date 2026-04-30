import api from './axiosInstance';

export const invoiceApi = {
  list: (params = {}) => api.get('/invoices/', { params }).then((r) => r.data),
  create: (payload) => api.post('/invoices/', payload).then((r) => r.data),
  get: (id) => api.get(`/invoices/${id}`).then((r) => r.data),
  update: (id, payload) => api.put(`/invoices/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/invoices/${id}`).then((r) => r.data),
  send: (id) => api.post(`/invoices/${id}/send`).then((r) => r.data),
  markPaid: (id) => api.post(`/invoices/${id}/mark-paid`).then((r) => r.data),
  remind: (id) => api.post(`/invoices/${id}/remind`).then((r) => r.data),
  duplicate: (id) => api.post(`/invoices/${id}/duplicate`).then((r) => r.data),
  pdfUrl: (id) => `${api.defaults.baseURL}/invoices/${id}/pdf`,
  downloadPdf: (id) =>
    api.get(`/invoices/${id}/pdf`, { responseType: 'blob' }).then((r) => r.data),
};
