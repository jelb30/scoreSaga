import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api', // your Spring Boot API URL
  withCredentials: true // if using cookies, else set to false
});

export default api;
