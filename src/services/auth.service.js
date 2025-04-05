import apiClient from './api.service';

class AuthService {
  /**
   * Login as a candidate
   * @param {string} username - Username or email
   * @param {string} password - User password
   * @returns {Promise} - Response with user data and tokens
   */
  async candidateLogin(username, password) {
    console.log('AuthService: candidateLogin called');
    const response = await apiClient.post('/auth/candidate/login', {
      username,
      password,
    });

    console.log('AuthService: Login API response:', response.data);

    if (response.data) {
      // The backend doesn't seem to return tokens explicitly
      // Check if we need to extract from headers or response structure
      const tokenData = {
        accessToken:
          response.data.accessToken || response.data.token || 'dummy-token',
        refreshToken: response.data.refreshToken || 'dummy-refresh',
      };

      this.setTokens(tokenData);
      this.setUser(response.data, 'candidate');
      console.log('AuthService: User data stored in localStorage');
      console.log('AuthService: Current user:', this.getCurrentUser());
      console.log('AuthService: Is authenticated:', this.isAuthenticated());
    }

    return response.data;
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
   */
  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userType');

    // Optional: Call the backend to invalidate token
    // apiClient.post('/auth/logout');
  }

  /**
   * Store authentication tokens in localStorage
   * @param {Object} data - Response data containing tokens
   */
  setTokens(data) {
    console.log('Setting tokens with data:', data);

    // Store access token
    const accessToken = data.accessToken || data.token || data.access_token;
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
      console.log('Access token stored in localStorage');
    } else {
      console.warn('No access token found in response');
      // For testing, we can set a dummy token
      localStorage.setItem('accessToken', 'dummy-token-for-testing');
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
}

export default new AuthService();
