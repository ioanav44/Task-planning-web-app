/*
 * Serviciu pentru comunicare cu backend-ul
 * Aici sunt toate request-urile HTTP catre API
 */

import axios from 'axios';


// configuram axios cu URL-ul backendului
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});


// interceptor pe request - adauga tokenul automat la fiecare request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);


// interceptor pe response - daca primim 401 inseamna ca tokenul e invalid
// si facem logout automat
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);


// endpoint-uri pentru autentificare
export const authAPI = {
    login: (email, password) => api.post('/auth/login', { email, password }),
    register: (data) => api.post('/auth/register', data),
    me: () => api.get('/auth/me'),
};

// endpoint-uri pentru useri
export const usersAPI = {
    getAll: () => api.get('/users'),
    getById: (id) => api.get(`/users/${id}`),
    getSpecialists: () => api.get('/users/specialists'),
    create: (data) => api.post('/users', data),
    update: (id, data) => api.put(`/users/${id}`, data),
    delete: (id) => api.delete(`/users/${id}`),
};

// endpoint-uri pentru taskuri
export const tasksAPI = {
    getAll: () => api.get('/tasks'),
    getById: (id) => api.get(`/tasks/${id}`),
    create: (data) => api.post('/tasks', data),
    update: (id, data) => api.put(`/tasks/${id}`, data),
    delete: (id) => api.delete(`/tasks/${id}`),
    assign: (id, assignedToId) => api.patch(`/tasks/${id}/assign`, { assignedToId }),
    complete: (id) => api.patch(`/tasks/${id}/complete`),
    close: (id) => api.patch(`/tasks/${id}/close`),
    getHistory: (userId) => api.get(`/tasks/history/${userId}`),
};

export default api;
