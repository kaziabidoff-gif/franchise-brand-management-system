import api from './api';

export const listResource = async (endpoint, params = {}) => {
  const { data } = await api.get(endpoint, { params });
  return data;
};

export const getResource = async (endpoint, id) => {
  const { data } = await api.get(`${endpoint}/${id}`);
  return data.data;
};

export const createResource = async (endpoint, payload, multipart = false) => {
  const { data } = await api.post(endpoint, payload, multipart ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined);
  return data.data;
};

export const updateResource = async (endpoint, id, payload, multipart = false) => {
  const { data } = await api.put(`${endpoint}/${id}`, payload, multipart ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined);
  return data.data;
};

export const deleteResource = async (endpoint, id) => {
  await api.delete(`${endpoint}/${id}`);
};
