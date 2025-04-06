import { useToast } from 'primevue/usetoast';

/**
 * Shows a notification about token expiration and ongoing refresh
 * This should be called when a token expires but before redirecting
 * to login, to give the user context about what's happening.
 *
 * @param {Object} options - Options for customizing the notification
 * @param {boolean} options.isRefreshing - Whether token refresh is in progress
 * @param {string} options.message - Custom message to display
 */
export const showTokenExpirationNotice = (options = {}) => {
  try {
    const toast = useToast();
    if (!toast) return;

    const { isRefreshing = true, message } = options;

    if (isRefreshing) {
      toast.add({
        severity: 'info',
        summary: 'Session Expiring',
        detail:
          message ||
          'Your session is expiring. Attempting to refresh automatically...',
        life: 5000,
      });
    } else {
      toast.add({
        severity: 'error',
        summary: 'Session Expired',
        detail: message || 'Your session has expired. Please log in again.',
        life: 5000,
      });
    }
  } catch (error) {
    console.error('Error showing token expiration notice:', error);
  }
};

/**
 * Check if a JWT token is expired
 * @param {string} token - JWT token to check
 * @returns {boolean} - True if token is expired, false otherwise or if token is invalid
 */
export const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    // Get payload from token (second part after .)
    const base64Url = token.split('.')[1];
    if (!base64Url) return true;

    // Decode the base64 payload
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64));

    if (!payload.exp) return false;

    // Get current time and check if token is expired
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true; // If we can't parse the token, consider it expired
  }
};

/**
 * Decode and extract information from a JWT token
 * @param {string} token - JWT token to decode
 * @returns {Object|null} - Decoded token payload or null if invalid
 */
export const decodeToken = (token) => {
  if (!token) return null;

  try {
    // Get payload from token (second part after .)
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;

    // Decode the base64 payload
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(base64));
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export default {
  showTokenExpirationNotice,
  isTokenExpired,
  decodeToken,
};
