import axios from 'axios';
import { BASE_URL } from '../BASE_URL';

// Set base URL for all requests
axios.defaults.baseURL = BASE_URL;


// Add request interceptor to include token
axios.interceptors.request.use(
  (config) => {
    console.log('Request:', config.method?.toUpperCase(), config.url, config.data);
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
axios.interceptors.response.use(
  (response) => {
    console.log('Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default axios; 