// frontend/src/services/api.js

import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api', // ✅ Assuming all endpoints start with /api (as seen in backend controllers)
    headers: {
        'Content-Type': 'application/json',
    }
});

// Add a request interceptor to include JWT token if present
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // or sessionStorage
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;