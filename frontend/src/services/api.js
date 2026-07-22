import axios from 'axios';

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('fbms_token');

  console.log('AXIOS REQUEST ABOUT TO BE SENT:', {
    method: config.method,
    url: `${config.baseURL}${config.url}`,
    data: config.data
  });

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;