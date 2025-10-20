import axios from 'axios';

// Create axios instance for public API calls
export const publicGateway = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://dev.mulearn.org/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for any global request configuration
publicGateway.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for global error handling
publicGateway.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle global errors here if needed
    return Promise.reject(error);
  }
);
