import { apiClient } from './api.service';

class AuthService {
  /**
   * Login as an admin
   * @param {string} username - Admin username
   * @param {string} password - Admin password
   * @returns {Promise} - Response with user data and tokens
   */
  async adminLogin(username, password) {
    console.log('AuthService: adminLogin called');
    try {
      const response = await apiClient.post('/auth/admin/login', {
        username,
        password,
      });

      console.log('AuthService: Admin Login API response:', response.data);

      if (response.data && response.data.statusCode === 200) {
        const responseData = response.data.data;

        if (responseData) {
          const tokenData = {
            accessToken: responseData.token,
            refreshToken: responseData.refreshToken,
          };

          this.setTokens(tokenData);

          const userData = {
            username: responseData.username,
            role: responseData.role,
            ...responseData,
          };

          if (!response.data.user) {
            response.data.user = userData;
          }

          this.setUser(response.data, 'admin');
        }
      }

      return response.data;
    } catch (error) {
      console.error('Error in adminLogin:', error);
      throw error;
    }
  }

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
    console.log('AuthService: recruiterLogin called');
    try {
      const response = await apiClient.post('/auth/recruiter/login', {
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
        // Check for accessToken too
        else if (hasData && response.data.data.accessToken) {
          console.log('Found accessToken in data.accessToken');
          jwToken = response.data.data.accessToken;
        } else if (response.data.accessToken) {
          console.log('Found accessToken in response.accessToken');
          jwToken = response.data.accessToken;
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
          accessToken: jwToken || '',
          refreshToken:
            response.data.data?.refreshToken ||
            response.data.refreshToken ||
            '',
        };

        this.setTokens(tokenData);

        // Create a proper user object from whatever data we have
        const userData = {
          // Always set a role
          role: 'RECRUITER',
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
        this.setUser(response.data, 'recruiter');
      }

      return response.data;
    } catch (error) {
      console.error('Error in recruiterLogin:', error);
      throw error;
    }
  }

  /**
   * Register a new candidate
   * @param {Object} candidateData - Candidate registration data
   * @returns {Promise} - Response with registration status
   */
  async registerCandidate(candidateData) {
    try {
      const response = await apiClient.post(
        '/candidates/register',
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
    try {
      const response = await apiClient.post(
        '/auth/refresh',
        { refreshToken },
        { skipAuthRefresh: true } // Prevent interceptor from trying to refresh token again
      );

      if (
        response.data &&
        response.data.statusCode === 200 &&
        response.data.data
      ) {
        const responseData = response.data.data;

        // Store the new tokens
        if (responseData.accessToken) {
          localStorage.setItem('accessToken', responseData.accessToken);
        }

        if (responseData.refreshToken) {
          localStorage.setItem('refreshToken', responseData.refreshToken);
        }
      }

      return response.data;
    } catch (error) {
      console.error('Token refresh failed:', error);
      throw error;
    }
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

    // Extract tokens from the response data structure
    let accessToken = null;
    let refreshToken = null;

    // Try to extract tokens based on different response structures
    if (data.accessToken) {
      accessToken = data.accessToken;
    } else if (data.token) {
      accessToken = data.token;
    } else if (data.jwToken) {
      accessToken = data.jwToken;
    } else if (data.access_token) {
      accessToken = data.access_token;
    } else if (data.data && data.data.accessToken) {
      accessToken = data.data.accessToken;
    } else if (data.data && data.data.token) {
      accessToken = data.data.token;
    }

    // Extract refresh token
    refreshToken =
      data.refreshToken ||
      data.refresh_token ||
      (data.data && (data.data.refreshToken || data.data.refresh_token));

    // Log token extraction attempts
    if (accessToken) {
      console.log('Found access token in response');

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
      console.error(
        'No access token found in response. Authentication will fail!'
      );
      // Do NOT set a dummy token as it will cause authorization errors
    }

    // Store refresh token if available
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
      console.log('Refresh token stored in localStorage');
    } else {
      console.warn('No refresh token found in response');
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
    let userData = {
      role: userType.toUpperCase(),
    };

    // Try to extract user data from different locations in the response
    if (data.user) {
      userData = { ...userData, ...data.user };
      console.log('Found user data in data.user');
    } else if (data.data && data.data.user) {
      userData = { ...userData, ...data.data.user };
      console.log('Found user data in data.data.user');
    } else if (data.data) {
      // Extract relevant user fields from data.data
      const {
        id,
        username,
        email,
        phoneNumber,
        recruiterRepName,
        companyName,
        verificationStatus,
        name,
        profilePictureUrl,
        preferredLocation,
      } = data.data;

      const extractedData = {
        id,
        username,
        email,
        phoneNumber,
        recruiterRepName,
        companyName,
        verificationStatus,
        name,
        profilePictureUrl,
        preferredLocation,
      };

      // Remove undefined fields
      Object.keys(extractedData).forEach((key) => {
        if (extractedData[key] === undefined) {
          delete extractedData[key];
        }
      });

      if (Object.keys(extractedData).length > 0) {
        userData = { ...userData, ...extractedData };
        console.log('Extracted user data from data.data fields');
      }
    }

    // Ensure some required fields have values
    if (!userData.username && data.username) {
      userData.username = data.username;
    }

    if (userType.toUpperCase() === 'RECRUITER') {
      userData.recruiterType = userData.recruiterType || 'INDIVIDUAL';
    }

    console.log('Final user data to save:', userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('userType', userType);
    console.log('User data saved to localStorage');
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

  /**
   * Get the current access token
   * @returns {string} - The current access token with 'Bearer ' prefix
   */
  getToken() {
    const token = localStorage.getItem('accessToken');
    return token || '';
  }
}

export default new AuthService();
