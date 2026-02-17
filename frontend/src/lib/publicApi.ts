import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const publicApi = axios.create({
  baseURL: `${API_BASE}/api`,
  timeout: 15000, // 15 second timeout
});

// Response interceptor — normalize error messages
publicApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      error.message = 'Request timeout — server tidak merespons';
    } else if (!error.response) {
      error.message = 'Tidak dapat terhubung ke server';
    }
    return Promise.reject(error);
  }
);

export default publicApi;

export function getImageUrl(path?: string | null): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('/src/') || path.startsWith('data:')) return path;
  return `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`;
}
