import api from './axiosInstance';

export const searchFood       = (q)      => api.get('/calories/search', { params: { q } }).then(r => r.data);
export const analyzePhoto     = (body)   => api.post('/calories/analyze-photo', body).then(r => r.data);
export const logFood          = (body)   => api.post('/calories/log', body).then(r => r.data);
export const getDayLog        = (date)   => api.get('/calories/log', { params: { date } }).then(r => r.data);
export const deleteLogEntry   = (id)     => api.delete(`/calories/log/${id}`).then(r => r.data);
export const getWeeklySummary = ()       => api.get('/calories/weekly').then(r => r.data);