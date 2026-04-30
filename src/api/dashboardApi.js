import api from './axiosInstance';

export const dashboardApi = {
  stats: () => api.get('/dashboard/stats').then((r) => r.data),
  revenueChart: () => api.get('/dashboard/revenue-chart').then((r) => r.data),
  recentInvoices: () => api.get('/dashboard/recent-invoices').then((r) => r.data),
  topClients: () => api.get('/dashboard/top-clients').then((r) => r.data),
};
