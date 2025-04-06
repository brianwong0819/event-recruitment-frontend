import axios from 'axios';

// Use the specific base URL for the API
const API_URL = 'http://localhost:8080/api';

// Create a configured axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
  withCredentials: false, // Changed to false to prevent cookies being sent automatically
});

// Request interceptor - runs before each request
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('accessToken');

    // Log request details for debugging (in development only)
    console.log('API Request:', {
      url: config.url,
      method: config.method,
      hasToken: !!token,
      fullUrl: API_URL + config.url,
    });

    // If token exists, add Authorization header - exactly as shown in Postman
    if (token) {
      // Make sure we don't add "Bearer " prefix if it's already in the token
      const tokenValue = token.startsWith('Bearer ')
        ? token
        : `Bearer ${token}`;
      config.headers.Authorization = tokenValue;

      console.log('Using token:', tokenValue.substring(0, 20) + '...');
    } else {
      console.warn('No access token found in localStorage');
    }

    // Log full request configuration
    if (process.env.NODE_ENV === 'development') {
      console.log('Full request config:', {
        method: config.method,
        url: API_URL + config.url,
        headers: config.headers,
        data: config.data,
      });
    }

    return config;
  },
  (error) => {
    console.error('API Request Interceptor Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - runs after each response
apiClient.interceptors.response.use(
  (response) => {
    // Log successful response details
    console.log('API Response Success:', {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });

    // Return successful responses directly
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Log detailed error information for debugging
    console.error('API Request Error:', {
      url: originalRequest?.url,
      method: originalRequest?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
      hasResponse: !!error.response,
      skipAuthRefresh: originalRequest?.skipAuthRefresh,
    });

    // If error is 401 (Unauthorized) and we haven't already tried refreshing
    // and the request doesn't have the skipAuthRefresh flag
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.skipAuthRefresh
    ) {
      // Mark that we've tried refreshing for this request
      originalRequest._retry = true;

      try {
        // Get the refresh token
        const refreshToken = localStorage.getItem('refreshToken');

        if (!refreshToken) {
          // No refresh token available, but don't force page reload
          // Just reject the promise and let the component handle it
          console.warn('No refresh token available');
          return Promise.reject(error);
        }

        // Log that we're attempting to refresh the token
        console.log('Attempting to refresh auth token...');

        // Make a request to refresh the token
        const response = await axios.post(
          `${API_URL}/auth/refresh`,
          {
            refreshToken: refreshToken,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        // If token refresh was successful
        if (response.data) {
          console.log('Token refresh successful, retrying original request');

          // Store the new tokens
          localStorage.setItem('accessToken', response.data.accessToken);

          if (response.data.refreshToken) {
            localStorage.setItem('refreshToken', response.data.refreshToken);
          }

          // Update the Authorization header
          originalRequest.headers[
            'Authorization'
          ] = `Bearer ${response.data.accessToken}`;

          // Retry the original request
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // If refresh token is invalid, log error but don't redirect
        console.error('Token refresh failed:', refreshError);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');

        // Remove the direct page reload that's causing issues
        // window.location.href = '/login';

        return Promise.reject(refreshError);
      }
    } else if (error.response?.status === 403) {
      console.warn(
        'Access forbidden (403) - this may be a CORS or authentication issue'
      );
    }

    // For other errors, just reject the promise
    return Promise.reject(error);
  }
);

// Export both the default and named export for backward compatibility
export { apiClient };
export default apiClient;
