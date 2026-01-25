import axios from 'axios';

// Create an Axios instance
const api = axios.create({
    baseURL: 'http://localhost:8080', // Connects to Spring Boot
});

// Add a request interceptor to attach the Token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        console.log("Interceptor: Attaching Token ->", token ? "YES" : "NO");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;