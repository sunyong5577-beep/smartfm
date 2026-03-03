import api from './api';

export const getMaintenanceList = (params) => api.get('/maintenance', { params });
export const getMaintenance = (id) => api.get(`/maintenance/${id}`);
export const createMaintenance = (data) => api.post('/maintenance', data);
export const updateMaintenance = (id, data) => api.put(`/maintenance/${id}`, data);
export const deleteMaintenance = (id) => api.delete(`/maintenance/${id}`);
export const getMaintenanceStats = (params) => api.get('/maintenance/stats', { params });
