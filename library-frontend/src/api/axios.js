// src/api/axios.js
import axios from "axios";

const baseURL= import.meta.env.VITE_API_URL?`${import.meta.env.VITE_API_URL}/api/v1`:
"http://localhost:8080/api/v1";
const api = axios.create({
  baseURL: baseURL,
  timeout: 8000
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response && err.response.data) {
      err.message = err.response.data.error || err.response.data.message || err.message;
    }
    return Promise.reject(err);
  }
);

export default api;
