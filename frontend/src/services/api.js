import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  login: (credentials) => api.post('/auth/login/', credentials),
  logout: () => api.post('/auth/logout/'),
  getCurrentUser: () => api.get('/auth/me/'),
};

// Organizations
export const organizationsAPI = {
  getAll: () => api.get('/organizations/'),
  getById: (id) => api.get(`/organizations/${id}/`),
  create: (data) => api.post('/organizations/', data),
  update: (id, data) => api.put(`/organizations/${id}/`, data),
  delete: (id) => api.delete(`/organizations/${id}/`),
};

// Data Sources
export const dataSourcesAPI = {
  getAll: (params) => api.get('/data-sources/', { params }),
  getById: (id) => api.get(`/data-sources/${id}/`),
  create: (data) => api.post('/data-sources/', data),
  update: (id, data) => api.put(`/data-sources/${id}/`, data),
  delete: (id) => api.delete(`/data-sources/${id}/`),
};

// Emission Records
export const emissionRecordsAPI = {
  getAll: (params) => api.get('/emission-records/', { params }),
  getById: (id) => api.get(`/emission-records/${id}/`),
  create: (data) => api.post('/emission-records/', data),
  update: (id, data) => api.put(`/emission-records/${id}/`, data),
  delete: (id) => api.delete(`/emission-records/${id}/`),
  review: (id, data) => api.post(`/emission-records/${id}/review/`, data),
  getStatistics: (params) => api.get('/emission-records/statistics/', { params }),
};

// Uploads
export const uploadsAPI = {
  getAll: (params) => api.get('/uploads/', { params }),
  getById: (id) => api.get(`/uploads/${id}/`),
  create: (formData) => {
    return api.post('/uploads/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  reprocess: (id) => api.post(`/uploads/${id}/reprocess/`),
};

// Audit Logs
export const auditLogsAPI = {
  getAll: (params) => api.get('/audit-logs/', { params }),
  getById: (id) => api.get(`/audit-logs/${id}/`),
};

export default api;
