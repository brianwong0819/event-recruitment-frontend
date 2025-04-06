import { apiClient } from './api.service';

class AuthService {
  /**
   * Login as a candidate
   * @param {string} username - Username or email
   * @param {string} password - User password
   * @returns {Promise} - Response with user data and tokens
   */
  async candidateLogin(username, password) {
    console.log('AuthService: candidateLogin called');
    try {
      const response = await apiClient.post('/auth/candidate/login', {
        username,
        password,
      });

      console.log('AuthService: Login API response:', response.data);

      // Debug the full response structure
      console.log('Full response structure:');
      console.log(JSON.stringify(response, null, 2));

      if (response.data) {
        // Based on your console logs, the jwToken appears to be in the data field
        // Log each key in the response to find where the token is
        console.log('Response data keys:', Object.keys(response.data));

        // Check if response has a data property with the token
        const hasData = typeof response.data.data === 'object';
        console.log('Response has data object:', hasData);

        if (hasData) {
          console.log('Data object keys:', Object.keys(response.data.data));
        }

        // Direct check for jwToken in data object
        let jwToken = '';

        // Based on the logs, we saw the token was in data.jwToken
        if (hasData && response.data.data.jwToken) {
          console.log('Found jwToken in data.jwToken');
          jwToken = response.data.data.jwToken;
        }
        // Or it might be directly in the response.data.jwToken
        else if (response.data.jwToken) {
          console.log('Found jwToken in response.jwToken');
          jwToken = response.data.jwToken;
        }

        // Additional check for token in the data object
        else {
          // Loop through each field in response.data to find the JWT token
          console.log('Searching all response fields for JWT-like value:');

          const findJwtInObject = (obj, prefix = '') => {
            for (const key in obj) {
              const value = obj[key];
              if (
                typeof value === 'string' &&
                value.length > 30 &&
                /^ey[A-Za-z0-9_-]*\.[A-Za-z0-9_-]*\./.test(value)
              ) {
                console.log(`Found JWT-like string in ${prefix}${key}`);
                return value;
              } else if (typeof value === 'object' && value !== null) {
                const found = findJwtInObject(value, `${prefix}${key}.`);
                if (found) return found;
              }
            }
            return null;
          };

          const foundToken = findJwtInObject(response.data);
          if (foundToken) {
            console.log('Found JWT-like token in response');
            jwToken = foundToken;
          }
        }

        console.log('JWT Token found:', !!jwToken);
        if (jwToken) {
          console.log(
            'JWT Token (first 30 chars):',
            jwToken.substring(0, 30) + '...'
          );
        }

        const tokenData = {
          accessToken: jwToken || 'dummy-token',
          refreshToken:
            response.data.data?.refreshToken ||
            response.data.refreshToken ||
            'dummy-refresh',
        };

        this.setTokens(tokenData);

        // Create a proper user object from whatever data we have
        const userData = {
          // Always set a role
          role: 'CANDIDATE',
          // Try to extract user details from various locations
          ...(response.data.user || {}),
          ...(response.data.data?.user || {}),
          // Include username that was used to login
          username: username,
          // Any other fields from the response
          ...(hasData ? response.data.data : {}),
        };

        // If we have a JWT token, try to extract user info from it
        if (jwToken) {
          const tokenPrefix = jwToken.startsWith('Bearer ') ? '' : 'Bearer ';
          const tokenUser = this.extractUserFromToken(
            jwToken.replace('Bearer ', '')
          );
          if (tokenUser) {
            Object.assign(userData, tokenUser);
          }
        }

        // Ensure there's always a user object in the response
        if (!response.data.user) {
          response.data.user = userData;
        }

        // Store the user data
        this.setUser(response.data, 'candidate');
      }

      return response.data;
    } catch (error) {
      console.error('Error in candidateLogin:', error);
      throw error;
    }
  }

  /**
   * Login as a recruiter
   * @param {string} username - Username or email
   * @param {string} password - User password
   * @returns {Promise} - Response with user data and tokens
   */
  async recruiterLogin(username, password) {
    const response = await apiClient.post('/auth/recruiter/login', {
      username,
      password,
    });

    if (response.data) {
      this.setTokens(response.data);
      this.setUser(response.data, 'recruiter');
    }

    return response.data;
  }

  /**
   * Register a new candidate
   * @param {Object} candidateData - Candidate registration data
   * @returns {Promise} - Response with registration status
   */
  async registerCandidate(candidateData) {
    try {
      const response = await apiClient.post(
        '/candidate/register',
        candidateData
      );
      console.log('Registration successful:', response);
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  /**
   * Register a new recruiter
   * @param {Object} recruiterData - Recruiter registration data
   * @returns {Promise} - Response with registration status
   */
  async registerRecruiter(recruiterData) {
    try {
      const response = await apiClient.post(
        '/recruiter/register',
        recruiterData
      );
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  /**
   * Refresh the access token using refresh token
   * @param {string} refreshToken - Refresh token
   * @returns {Promise} - Response with new tokens
   */
  async refreshToken(refreshToken) {
    const response = await apiClient.post('/auth/refreshtoken', {
      refreshToken,
    });

    if (response.data) {
      this.setTokens(response.data);
    }

    return response.data;
  }

  /**
   * Request password reset
   * @param {string} email - User email
   * @returns {Promise} - Response with status
   */
  async requestPasswordReset(email) {
    return apiClient.post('/auth/password-reset-request', { email });
  }

  /**
   * Reset password with token
   * @param {string} token - Reset token
   * @param {string} newPassword - New password
   * @returns {Promise} - Response with status
   */
  async resetPassword(token, newPassword) {
    return apiClient.post('/auth/password-reset', {
      token,
      newPassword,
    });
  }

  /**
   * Logout the current user
   * @returns {Promise} - Response with logout status
   */
  async logout() {
    // Get the refresh token before clearing localStorage
    const refreshToken = localStorage.getItem('refreshToken');

    // Clear all localStorage items related to user authentication and data
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userType');

    // Clear any profile/candidate specific data
    localStorage.removeItem('profile');
    localStorage.removeItem('candidate-profile');
    localStorage.removeItem('recruiter-profile');
    localStorage.removeItem('experiences');
    localStorage.removeItem('availability');

    // Clear any cached application data
    localStorage.removeItem('applications');
    localStorage.removeItem('jobs');

    // For complete cleanup, clear session storage as well
    sessionStorage.clear();

    // Clear all localStorage items that might contain user data (more comprehensive approach)
    const keysToKeep = ['theme', 'language']; // Keep these settings if needed
    Object.keys(localStorage).forEach((key) => {
      if (!keysToKeep.includes(key)) {
        localStorage.removeItem(key);
      }
    });

    // Call the backend to invalidate token
    if (refreshToken) {
      try {
        return await apiClient.post('/auth/logout', { refreshToken });
      } catch (error) {
        console.error('Error logging out on server:', error);
        throw error;
      }
    }

    return Promise.resolve();
  }

  /**
   * Store authentication tokens in localStorage
   * @param {Object} data - Response data containing tokens
   */
  setTokens(data) {
    console.log('Setting tokens with data:', data);

    // Store access token
    const accessToken =
      data.accessToken || data.token || data.jwToken || data.access_token;
    if (accessToken) {
      // Add the Bearer prefix if it's not already there
      const tokenValue = accessToken.startsWith('Bearer ')
        ? accessToken
        : `Bearer ${accessToken}`;
      localStorage.setItem('accessToken', tokenValue);
      console.log(
        'Access token stored in localStorage:',
        tokenValue.substring(0, 20) + '...'
      );
    } else {
      console.warn('No access token found in response');
      // For testing, we can set a dummy token
      localStorage.setItem('accessToken', 'Bearer dummy-token-for-testing');
    }

    // Store refresh token if available
    const refreshToken = data.refreshToken || data.refresh_token;
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
  }

  /**
   * Store user data in localStorage
   * @param {Object} data - Response data containing user info
   * @param {string} userType - Type of user ('candidate' or 'recruiter')
   */
  setUser(data, userType) {
    console.log('setUser called with data:', data, 'userType:', userType);

    // Create a user object with role from the response data
    // Since the API doesn't return a user object directly
    const userData = {
      // Use any available user fields from the response
      // or create a minimal user object with the role
      role: userType.toUpperCase(),
      // Add any other fields that might be in the response
      ...(data.userData || {}),
    };

    console.log('Created user data:', userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('userType', userType);
    console.log('User data saved to localStorage:', userData);
  }

  /**
   * Get current user from localStorage
   * @returns {Object|null} - User object or null
   */
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Get current user type (candidate or recruiter)
   * @returns {string|null} - User type or null
   */
  getUserType() {
    return localStorage.getItem('userType');
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} - True if user is authenticated
   */
  isAuthenticated() {
    return !!localStorage.getItem('accessToken');
  }

  /**
   * Check if the authenticated user is a candidate
   * @returns {boolean} - True if user is a candidate
   */
  isCandidate() {
    return this.isAuthenticated() && this.getUserType() === 'candidate';
  }

  /**
   * Check if the authenticated user is a recruiter
   * @returns {boolean} - True if user is a recruiter
   */
  isRecruiter() {
    return this.isAuthenticated() && this.getUserType() === 'recruiter';
  }

  /**
   * Extract base user info from JWT token
   * @param {string} token - JWT token
   * @returns {Object} - Basic user information extracted from token
   */
  extractUserFromToken(token) {
    try {
      // JWT tokens have 3 parts separated by dots
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.error('Invalid JWT token format');
        return null;
      }

      // Decode the payload (middle part)
      const payload = JSON.parse(atob(parts[1]));
      console.log('Token payload:', payload);

      // Extract common user fields from payload
      return {
        // Most JWT tokens include these fields
        id: payload.sub || payload.id || payload.userId || '',
        username:
          payload.username || payload.email || payload.preferred_username || '',
        role: payload.role || 'CANDIDATE', // Default to CANDIDATE
        email: payload.email || '',
        // Add any other fields that might be in the token
      };
    } catch (error) {
      console.error('Error extracting user from token:', error);
      return null;
    }
  }
}

export default new AuthService();
