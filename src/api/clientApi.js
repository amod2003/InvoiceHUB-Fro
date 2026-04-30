import api from './axiosInstance';

export const clientApi = {
  list: (params = {}) => api.get('/clients/', { params }).then((r) => r.data),
  create: (payload) => api.post('/clients/', payload).then((r) => r.data),
  get: (id) => api.get(`/clients/${id}`).then((r) => r.data),
  update: (id, payload) => api.put(`/clients/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/clients/${id}`).then((r) => r.data),
  invoices: (id, params = {}) => api.get(`/clients/${id}/invoices`, { params }).then((r) => r.data),
};
