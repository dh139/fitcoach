import api from './axiosInstance';

export const fetchExercises = (params) =>
  api.get('/exercises', { params }).then((r) => r.data);

export const fetchExerciseById = (id) =>
  api.get(`/exercises/${id}`).then((r) => r.data);

export const fetchFilterOptions = () =>
  api.get('/exercises/meta/filters').then((r) => r.data);

export const toggleFavorite = (id) =>
  api.post(`/exercises/${id}/favorite`).then((r) => r.data);

export const fetchFavorites = () =>
  api.get('/exercises/user/favorites').then((r) => r.data);