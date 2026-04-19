import api from './axiosInstance';

export const getLeaderboard = (params) =>
  api.get('/leaderboard', { params }).then(r => r.data);

export const getMyStats = () =>
  api.get('/leaderboard/my-stats').then(r => r.data);