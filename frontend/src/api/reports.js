import api from './axiosInstance';

export const getReport        = (type, refresh = false) =>
  api.get(`/report/${type}`, { params: { refresh } }).then(r => r.data);

export const getReportHistory = () =>
  api.get('/report/history').then(r => r.data);