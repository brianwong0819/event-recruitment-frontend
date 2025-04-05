import axios from 'axios';

// Get the API base URL from environment variables or use relative URL for proxy
const API_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Create a configured axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 10000, // 10 seconds timeout
  withCredentials: true // Important for CORS with credentials
});

// Request interceptor - runs before each request
apiClient.interceptors.request.use(
  (config) => {
    // Get the token from localStorage
    const token = localStorage.getItem('accessToken');
    
    // If token exists, add it to request headers
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

// Response interceptor - runs after each response
apiClient.interceptors.response.use(
  (response) => {
    // Return successful responses directly
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 (Unauthorized) and we haven't already tried refreshing
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Mark that we've tried refreshing for this request
      originalRequest._retry = true;
      
      try {
        // Get the refresh token
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (!refreshToken) {
          // No refresh token available, redirect to login
          window.location.href = '/login';
          return Promise.reject(error);
        }
        
        // Make a request to refresh the token
        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken: refreshToken
        });
        
        // If token refresh was successful
        if (response.data) {
          // Store the new tokens
          localStorage.setItem('accessToken', response.data.accessToken);
          
          if (response.data.refreshToken) {
            localStorage.setItem('refreshToken', response.data.refreshToken);
          }
          
          // Update the Authorization header
          originalRequest.headers['Authorization'] = `Bearer ${response.data.accessToken}`;
          
          // Retry the original request
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // If refresh token is invalid, redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    // For other errors, just reject the promise
    return Promise.reject(error);
  }
);

// Export the configured axios instance
export default apiClient;