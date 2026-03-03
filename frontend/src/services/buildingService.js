import api from './api';

export const getBuildings = (params) => api.get('/buildings', { params });
export const getBuilding = (id) => api.get(`/buildings/${id}`);
export const createBuilding = (data) => api.post('/buildings', data);
export const updateBuilding = (id, data) => api.put(`/buildings/${id}`, data);
export const deleteBuilding = (id) => api.delete(`/buildings/${id}`);
export const getBuildingStats = () => api.get('/buildings/stats');
