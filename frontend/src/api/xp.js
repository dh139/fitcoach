import api from './axiosInstance';

export const getXpProfile    = ()       => api.get('/xp/profile').then(r => r.data);
export const getXpHistory    = (params) => api.get('/xp/history', { params }).then(r => r.data);
export const useStreakFreeze  = ()       => api.post('/xp/use-streak-freeze').then(r => r.data);