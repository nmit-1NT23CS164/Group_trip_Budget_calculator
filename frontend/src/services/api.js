import axios from 'axios';

export const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth Service
export const authService = {
  register: (name, email, password) =>
    API.post('/auth/register', { name, email, password }),
  login: (email, password) =>
    API.post('/auth/login', { email, password }),
  logout: () =>
    API.post('/auth/logout'),
  getMe: () =>
    API.get('/auth/me'),
};

// Trips Service
export const tripService = {
  createTrip: (tripData) =>
    API.post('/trips', tripData),
  getAllTrips: () =>
    API.get('/trips'),
  getTrip: (id) =>
    API.get(`/trips/${id}`),
  updateTrip: (id, tripData) =>
    API.put(`/trips/${id}`, tripData),
  deleteTrip: (id) =>
    API.delete(`/trips/${id}`),
  addMember: (tripId, userId) =>
    API.post(`/trips/${tripId}/members`, { userId }),
};

// Expenses Service
export const expenseService = {
  createExpense: (expenseData) =>
    API.post('/expenses', expenseData),
  getExpenses: (tripId) =>
    API.get(`/expenses/${tripId}`),
  deleteExpense: (id) =>
    API.delete(`/expenses/${id}`),
  calculateSettlement: (tripId) =>
    API.post(`/expenses/calculate-settlement/${tripId}`),
};
