import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds timeout
});

// Optional: Add request interceptor
api.interceptors.request.use(
  (config) => {
    // For example, add auth token if you have one
    // const token = localStorage.getItem('token');
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

// Optional: Add response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Global error handling (example)
    if (error.response?.status === 401) {
      // Handle unauthorized access - maybe redirect to login
    }
    return Promise.reject(error);
  },
);

export default api;
