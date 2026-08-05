import axios from 'axios';

// Usa `||` (e nao `??`) de proposito: o build pode receber VITE_API_URL como
// string vazia, que passaria pelo `??` e deixaria o baseURL vazio.
// O fallback e relativo porque frontend e backend compartilham o dominio.
const baseURL = import.meta.env.VITE_API_URL || '/api/v1';

export const api = axios.create({
  baseURL,
});

export const AUTH_TOKEN_KEY = 'portfolio:token';
export const AUTH_USER_KEY = 'portfolio:user';

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      const currentPath = window.location.pathname;
      if (currentPath.startsWith('/admin') && currentPath !== '/admin/login') {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(AUTH_USER_KEY);
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  },
);
