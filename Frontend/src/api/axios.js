import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api', // your Spring Boot API URL
  withCredentials: true // if using cookies, else set to false
});

// Attach bearer token from localStorage if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
