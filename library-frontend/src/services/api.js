import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const api = axios.create({
    baseURL: baseURL,
}
)
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