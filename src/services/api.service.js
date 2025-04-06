import axios from 'axios';
import router from '../router';
import {
  showTokenExpirationNotice,
  isTokenExpired,
} from '../utils/token-handler';

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

    // Check if token is expired before making request
    if (token && isTokenExpired(token)) {
      console.warn('Access token is expired before request');

      // We'll let the response interceptor handle the refresh
      // but we'll show a notification to the user
      showTokenExpirationNotice({ isRefreshing: true });
    }

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

// Track if we're currently refreshing the token
let isRefreshingToken = false;
// Store all requests that should be retried after token refresh
let refreshSubscribers = [];

// Helper function to add callback to retry queue
const subscribeTokenRefresh = (callback) => {
  refreshSubscribers.push(callback);
};

// Helper function to execute all queued requests
const onTokenRefreshed = (newToken) => {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
};

// Helper function to handle failed refresh
const onRefreshFailed = () => {
  refreshSubscribers = [];
};

// Helper function to check if the error status indicates token expiration
const isTokenExpiredError = (status) => {
  return status === 401 || status === 403;
};

// Helper function to handle authentication logout
const handleAuthLogout = () => {
  // Clear auth data
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  localStorage.removeItem('userType');

  // Show expiration notice to the user
  showTokenExpirationNotice({
    isRefreshing: false,
    message: 'Your session has expired. Redirecting to login...',
  });

  // Redirect to login page
  if (router.currentRoute.value.path !== '/login') {
    router.push({
      path: '/login',
      query: { redirect: router.currentRoute.value.fullPath },
    });
  }
};

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
    const status = error.response?.status;

    // Log detailed error information for debugging
    console.error('API Request Error:', {
      url: originalRequest?.url,
      method: originalRequest?.method,
      status,
      statusText: error.response?.statusText,
      message: error.message,
      hasResponse: !!error.response,
      skipAuthRefresh: originalRequest?.skipAuthRefresh,
    });

    // Check if this is a login request (we should not redirect or refresh token for login attempts)
    const isAuthRequest =
      originalRequest?.url &&
      (originalRequest.url.includes('/login') ||
        originalRequest.url.includes('/auth/candidate/login') ||
        originalRequest.url.includes('/auth/recruiter/login') ||
        originalRequest.url.includes('/auth/refresh'));

    // Handle token expiration (both 401 and 403)
    if (
      isTokenExpiredError(status) &&
      !originalRequest._retry &&
      !originalRequest.skipAuthRefresh &&
      !isAuthRequest
    ) {
      // Show notification to the user that we're refreshing their session
      showTokenExpirationNotice({ isRefreshing: true });

      // If we're already refreshing, queue this request
      if (isRefreshingToken) {
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh((newToken) => {
            // Replace the expired token and retry
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
            resolve(apiClient(originalRequest));
          });
        });
      }

      // Mark that we've tried refreshing for this request
      originalRequest._retry = true;
      isRefreshingToken = true;

      try {
        // Get the refresh token
        const refreshToken = localStorage.getItem('refreshToken');

        if (!refreshToken) {
          console.warn('No refresh token available');
          handleAuthLogout();
          return Promise.reject(error);
        }

        console.log('Attempting to refresh auth token...');

        // Make a request to refresh the token
        const response = await axios.post(
          `${API_URL}/auth/refresh`,
          {
            refreshToken: refreshToken,
          },
          {
            skipAuthRefresh: true, // Prevent infinite loop if refresh fails
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        // Check if refresh was successful
        if (response.data && response.data.statusCode === 200) {
          console.log('Token refresh successful, retrying original request');

          const responseData = response.data.data;
          const newAccessToken = responseData.accessToken;
          const newRefreshToken = responseData.refreshToken;

          // Store the new tokens
          if (newAccessToken) {
            localStorage.setItem('accessToken', newAccessToken);
          }

          if (newRefreshToken) {
            localStorage.setItem('refreshToken', newRefreshToken);
          }

          // Update the Authorization header
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

          // Process all queued requests
          onTokenRefreshed(newAccessToken);

          // Return the original request with new token
          return apiClient(originalRequest);
        } else {
          throw new Error('Token refresh response invalid');
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        onRefreshFailed();
        handleAuthLogout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshingToken = false;
      }
    }

    // Handle other errors
    if (status === 401 || status === 403) {
      if (isAuthRequest) {
        // For auth requests with 401/403, just reject without redirection
        return Promise.reject(error);
      } else {
        // For other endpoints with 401/403 when we've already tried refreshing, logout
        handleAuthLogout();
      }
    }

    // For other errors, just reject the promise
    return Promise.reject(error);
  }
);

// Export both the default and named export for backward compatibility
export { apiClient };
export default apiClient;
