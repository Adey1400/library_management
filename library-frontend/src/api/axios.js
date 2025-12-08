// src/api/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api/v1",
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
