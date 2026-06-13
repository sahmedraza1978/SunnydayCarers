import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const USE_MOCK = process.env.REACT_APP_USE_MOCK === 'true';

const mockParticipants = [
  {
    id: '1',
    first_name: 'John',
    last_name: 'Smith',
    ndis_number: 'NDIS-1001',
    email: 'john.smith@example.com',
    status: 'active',
  },
  {
    id: '2',
    first_name: 'Mary',
    last_name: 'Jones',
    ndis_number: 'NDIS-1002',
    email: 'mary.jones@example.com',
    status: 'inactive',
  },
];

const mockResponse = (data: any) => Promise.resolve({ data: { data } });

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
  getAll: () => {
    if (USE_MOCK) return mockResponse(mockParticipants);
    return api.get('/participants').catch((err) => {
      // network failure fallback to mock data
      if (!err.response) return mockResponse(mockParticipants);
      throw err;
    });
  },
  getById: (id: string) => {
    if (USE_MOCK) return mockResponse(mockParticipants.find((p) => p.id === id) || null);
    return api.get(`/participants/${id}`).catch((err) => {
      if (!err.response) return mockResponse(mockParticipants.find((p) => p.id === id) || null);
      throw err;
    });
  },
  create: (data: any) => {
    if (USE_MOCK) {
      const newItem = { id: String(Date.now()), ...data };
      mockParticipants.push(newItem as any);
      return mockResponse(newItem);
    }
    return api.post('/participants', data);
  },
  update: (id: string, data: any) => {
    if (USE_MOCK) {
      const idx = mockParticipants.findIndex((p) => p.id === id);
      if (idx === -1) return mockResponse(null);
      mockParticipants[idx] = { ...mockParticipants[idx], ...data } as any;
      return mockResponse(mockParticipants[idx]);
    }
    return api.put(`/participants/${id}`, data);
  },
};

// Agreements Service
export const agreementService = {
  getAll: () => api.get('/agreements'),
  getById: (id: string) => api.get(`/agreements/${id}`),
  create: (data: any) => api.post('/agreements', data),
  updateStatus: (id: string, status: string) =>
    api.patch(`/agreements/${id}/status`, { status }),
};
