import axios, { AxiosError } from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL;

if (!baseURL) {
  throw new Error('VITE_API_BASE_URL is not defined in .env');
}

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 secondes
});

// Interceptor add token JWT if exists
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('apulse-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Token expiré ou invalide → on déconnecte
    if (error.response?.status === 401) {
      localStorage.removeItem('apulse-token');
      // On pourrait rediriger vers /login ici, on le fera via le contexte
    }
    return Promise.reject(error);
  },
);