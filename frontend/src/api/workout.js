import api from './axiosInstance';

export const startWorkout   = (body)       => api.post('/workout/start',    body).then(r => r.data);
export const completeWorkout = (body)      => api.post('/workout/complete',  body).then(r => r.data);
export const getWorkoutHistory = (params)  => api.get('/workout/history',   { params }).then(r => r.data);
export const getWorkoutStats   = ()        => api.get('/workout/stats').then(r => r.data);