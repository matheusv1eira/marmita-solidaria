import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/', // Ajuste conforme a porta do seu Django
});

// Interceptor para injetar o token Bearer automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default globalThis.api || api;