import api from './axiosInstance';

export const tenantApi = {
  me: () => api.get('/tenants/me').then((r) => r.data),
  update: (payload) => api.put('/tenants/me', payload).then((r) => r.data),
  uploadLogo: (file) => {
    const fd = new FormData();
    fd.append('file', file);
    // Setting Content-Type to undefined lets axios auto-generate the
    // multipart boundary from the FormData body (the instance default
    // of application/json would otherwise prevent that).
    return api
      .put('/tenants/me/logo', fd, { headers: { 'Content-Type': undefined } })
      .then((r) => r.data);
  },
};
