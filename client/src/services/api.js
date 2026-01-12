import axios from 'axios';


const api = axios.create({
    baseURL: 'http://localhost:3000/api',  // URL-ul backend-ului
    headers: {
        'Content-Type': 'application/json',
    },
});


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


export const authAPI = {
    login: (email, password) => api.post('/auth/login', { email, password }),
    register: (data) => api.post('/auth/register', data),
    me: () => api.get('/auth/me'),
};

export const usersAPI = {
    getAll: () => api.get('/users'),
    getById: (id) => api.get(`/users/${id}`),
    getSpecialists: () => api.get('/users/specialists'),
    create: (data) => api.post('/users', data),
    update: (id, data) => api.put(`/users/${id}`, data),
    delete: (id) => api.delete(`/users/${id}`),
};

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
