import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const getAuthToken = () => localStorage.getItem('authToken');

export const setAuthToken = (token: string) => {
  localStorage.setItem('authToken', token);
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const clearAuthToken = () => {
  localStorage.removeItem('authToken');
  delete api.defaults.headers.common['Authorization'];
};

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth Service
export const authService = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (email: string, password: string, firstName: string, lastName: string) =>
    api.post('/auth/register', {
      email,
      password,
      first_name: firstName,
      last_name: lastName,
    }),
  getCurrentUser: () => api.get('/users/me'),
};

// Participants Service
export const participantService = {
  getAll: () => api.get('/participants'),
  getById: (id: string) => api.get(`/participants/${id}`),
  create: (data: any) => api.post('/participants', data),
  update: (id: string, data: any) => api.put(`/participants/${id}`, data),
};

// Agreements Service
export const agreementService = {
  getAll: () => api.get('/agreements'),
  getById: (id: string) => api.get(`/agreements/${id}`),
  create: (data: any) => api.post('/agreements', data),
  updateStatus: (id: string, status: string) =>
    api.patch(`/agreements/${id}/status`, { status }),
};
