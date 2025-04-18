// src/stores/auth.js
import { defineStore } from 'pinia';
import AuthService from '../services/auth.service';
import router from '../router';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    // User data
    user: null,

    // Authentication status
    authenticated: false,

    // Loading indicators
    isLoading: false,

    // Error handling
    error: null,

    // Success message
    successMessage: null,

    // Redirect paths
    returnUrl: null,
  }),

  getters: {
    /**
     * Check if user is a candidate
     * @returns {boolean} - True if user is a candidate
     */
    isCandidate: (state) => {
      return state.user?.role === 'CANDIDATE';
    },

    /**
     * Check if user is a recruiter
     * @returns {boolean} - True if user is a recruiter
     */
    isRecruiter: (state) => {
      return state.user?.role === 'RECRUITER';
    },

    /**
     * Check if user is an admin
     * @returns {boolean} - True if user is an admin
     */
    isAdmin: (state) => {
      return state.user?.role === 'ADMIN';
    },

    /**
     * Get user's display name
     * @returns {string} - User's name or username
     */
    displayName: (state) => {
      return state.user?.name || state.user?.username || 'User';
    },
  },

  actions: {
    /**
     * Initialize auth store from localStorage
     */
    init() {
      console.log('Initializing auth store from localStorage');
      try {
        const userStr = localStorage.getItem('user');
        const token = localStorage.getItem('accessToken');

        console.log('User exists in localStorage:', !!userStr);
        console.log('Token exists in localStorage:', !!token);

        if (userStr && token) {
          // Parse the user data
          const userData = JSON.parse(userStr);
          console.log('Found user data:', userData);

          // Set the user and authenticated state
          this.user = userData;
          this.authenticated = true;
          console.log('Auth initialized with user role:', this.user?.role);
        } else {
          console.log('No valid auth data in localStorage');
          this.user = null;
          this.authenticated = false;
        }
      } catch (error) {
        console.error('Error initializing auth store:', error);
        this.user = null;
        this.authenticated = false;
      }
    },

    /**
     * Login as an admin
     * @param {string} username - Admin username
     * @param {string} password - Admin password
     */
    async adminLogin(username, password) {
      this.isLoading = true;
      this.error = null;

      try {
        console.log('Starting admin login...');
        const response = await AuthService.adminLogin(username, password);
        console.log('Admin login response:', response);

        // Check if we actually got a valid response
        if (!response || response.statusCode !== 200) {
          console.error('Invalid login response:', response);
          this.authenticated = false;
          this.error = response?.message || 'Invalid login response';
          throw new Error('Invalid login response');
        }

        // Get the data from the response
        const responseData = response.data;

        if (!responseData) {
          console.error('No data in response');
          this.authenticated = false;
          this.error = 'No data in response';
          throw new Error('No data in response');
        }

        // Create a user object from the response data
        const userData = {
          username: responseData.username,
          role: responseData.role,
          ...responseData,
        };

        // Check that tokens were properly stored
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          console.error('No access token set after login');
          this.authenticated = false;
          this.error = 'Authentication failed';
          throw new Error('Authentication failed - no token');
        }

        // Set the user in the store
        this.user = userData;
        this.authenticated = true;
        console.log('Admin authenticated:', this.user);

        // Navigate to admin dashboard
        const returnUrl = this.returnUrl || '/admin/dashboard';
        console.log('Redirecting to:', returnUrl);
        router.push(returnUrl);
        this.returnUrl = null;

        return response;
      } catch (error) {
        console.error('Admin login error:', error);
        this.error = error.response?.data?.message || 'Login failed';
        this.authenticated = false;
        this.user = null;
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Login as a candidate
     * @param {string} username - Username or email
     * @param {string} password - User password
     * @param {boolean} rememberMe - Remember login status
     */
    async candidateLogin(username, password, rememberMe) {
      this.isLoading = true;
      this.error = null;

      try {
        console.log('Starting candidate login...');
        const response = await AuthService.candidateLogin(username, password);
        console.log('Login response:', response);

        // Check if we actually got user data before setting authenticated state
        if (!response) {
          console.error('Empty login response');
          this.authenticated = false;
          this.error = 'Invalid login response';
          throw new Error('Invalid login response');
        }

        // If response doesn't have a user object, create a minimal one
        if (!response.user) {
          console.log(
            'Creating minimal user object since response.user is missing'
          );
          response.user = {
            role: 'CANDIDATE',
            username: username,
          };
        }

        this.user = response.user;
        this.authenticated = true;
        console.log('User authenticated:', this.user);

        // Navigate to appropriate dashboard or return URL
        const returnUrl = this.returnUrl || '/candidate/dashboard';
        console.log('Redirecting to:', returnUrl);
        router.push(returnUrl);
        this.returnUrl = null;

        return response;
      } catch (error) {
        console.error('Login error:', error);
        this.error = error.response?.data?.message || 'Login failed';
        this.authenticated = false;
        this.user = null;
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Login as a recruiter
     * @param {string} username - Username or email
     * @param {string} password - User password
     * @param {boolean} rememberMe - Remember login status
     */
    async recruiterLogin(username, password, rememberMe) {
      this.isLoading = true;
      this.error = null;

      try {
        console.log('Starting recruiter login...');
        const response = await AuthService.recruiterLogin(username, password);
        console.log('Login response:', response);

        // Check if we actually got user data before setting authenticated state
        if (!response) {
          console.error('Empty login response');
          this.authenticated = false;
          this.error = 'Invalid login response';
          throw new Error('Invalid login response');
        }

        // Check for valid tokens in localStorage
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');

        console.log('Access token exists:', !!accessToken);
        console.log('Refresh token exists:', !!refreshToken);

        if (!accessToken) {
          console.error('No access token saved after login');
          this.error = 'Authentication token not found';
          throw new Error('Authentication token not found');
        }

        // Get user from localStorage (should be set by AuthService.setUser)
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          this.user = JSON.parse(storedUser);
          console.log('User loaded from localStorage:', this.user);
        } else if (response.user) {
          this.user = response.user;
          console.log('User loaded from response:', this.user);
        } else {
          console.log('Creating minimal user object since no user data found');
          this.user = {
            role: 'RECRUITER',
            username: username,
          };
        }

        this.authenticated = true;
        console.log('User authenticated:', this.user);

        // Navigate to appropriate dashboard or return URL
        const returnUrl = this.returnUrl || '/recruiter/dashboard';
        console.log('Redirecting to:', returnUrl);
        router.push(returnUrl);
        this.returnUrl = null;

        return response;
      } catch (error) {
        console.error('Login error:', error);
        this.error = error.response?.data?.message || 'Login failed';
        this.authenticated = false;
        this.user = null;
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Register new candidate
     * @param {Object} candidateData - Candidate registration data
     */
    async registerCandidate(candidateData) {
      this.isLoading = true;
      this.error = null;

      try {
        await AuthService.registerCandidate(candidateData);
        // Redirection is now handled by the component
      } catch (error) {
        this.error = error.response?.data?.message || 'Registration failed';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Register new recruiter
     * @param {Object} recruiterData - Recruiter registration data
     */
    async registerRecruiter(recruiterData) {
      this.isLoading = true;
      this.error = null;

      try {
        await AuthService.registerRecruiter(recruiterData);
        // Redirection is now handled by the component
      } catch (error) {
        this.error = error.response?.data?.message || 'Registration failed';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Logout current user
     */
    async logout() {
      try {
        await AuthService.logout();
        this.user = null;
        this.authenticated = false;

        // Reset other stores if they exist
        try {
          // Use dynamic imports to avoid circular dependencies
          const { useProfileStore } = await import('./profile');
          if (useProfileStore) {
            const profileStore = useProfileStore();
            profileStore.$reset(); // Reset the profile store state
          }

          // Reset any other stores that might have user data
          // Example with dynamic import pattern:
          // const { useOtherStore } = await import('./otherStore');
          // if (useOtherStore) {
          //   const otherStore = useOtherStore();
          //   otherStore.$reset();
          // }
        } catch (storeError) {
          console.warn('Error resetting stores during logout:', storeError);
          // Continue with logout even if store reset fails
        }

        // Navigate to login page
        router.push('/login');
      } catch (error) {
        console.error('Logout error:', error);
        // Even if server logout fails, clear local state
        this.user = null;
        this.authenticated = false;
        router.push('/login');
      }
    },

    /**
     * Request password reset
     * @param {string} email - User email
     */
    async requestPasswordReset(email) {
      this.isLoading = true;
      this.error = null;

      try {
        await AuthService.requestPasswordReset(email);
      } catch (error) {
        this.error =
          error.response?.data?.message || 'Password reset request failed';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Reset password with token
     * @param {string} token - Reset token
     * @param {string} newPassword - New password
     */
    async resetPassword(token, newPassword) {
      this.isLoading = true;
      this.error = null;

      try {
        await AuthService.resetPassword(token, newPassword);
      } catch (error) {
        this.error = error.response?.data?.message || 'Password reset failed';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Update user profile data in store
     * @param {Object} userData - Updated user data
     */
    updateUserData(userData) {
      if (this.user) {
        this.user = { ...this.user, ...userData };
        // Update localStorage
        localStorage.setItem('user', JSON.stringify(this.user));
      }
    },

    /**
     * Get default home page based on user role
     * @returns {string} - Default home page route
     */
    getDefaultHomePage() {
      if (this.user?.role === 'CANDIDATE') {
        return '/candidate/dashboard';
      } else if (this.user?.role === 'RECRUITER') {
        return '/recruiter/dashboard';
      } else if (this.user?.role === 'ADMIN') {
        return '/admin/dashboard';
      } else {
        return '/';
      }
    },

    /**
     * Check if current token is valid and refresh if needed
     */
    async checkTokenValidity() {
      const token = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');

      if (!token) {
        this.authenticated = false;
        this.user = null;
        return;
      }

      // Check if token is expired (this would typically be done by checking JWT expiry)
      // This is a simple implementation - in production you might want to decode the JWT
      try {
        // Try to get user profile to verify token validity
        await this.getUserProfile();
      } catch (error) {
        if (error.response?.status === 401 && refreshToken) {
          try {
            // Try to refresh the token
            await AuthService.refreshToken(refreshToken);
            // Retry getting user profile
            await this.getUserProfile();
          } catch (refreshError) {
            // If refresh fails, logout
            this.logout();
          }
        } else {
          // For other errors, logout
          this.logout();
        }
      }
    },

    /**
     * Get user profile from backend
     */
    async getUserProfile() {
      // This would be implemented by calling your user API service
      // For now, we'll assume it's just for token validation
    },

    /**
     * Set success message
     * @param {string} message - Success message to display
     */
    setSuccessMessage(message) {
      this.successMessage = message;
      // Clear the success message after 5 seconds
      setTimeout(() => {
        this.successMessage = null;
      }, 5000);
    },

    /**
     * Clear success message
     */
    clearSuccessMessage() {
      this.successMessage = null;
    },

    /**
     * Change password
     * @param {string} currentPassword - Current password
     * @param {string} newPassword - New password
     * @param {string} confirmPassword - Confirmation of new password
     */
    async changePassword(currentPassword, newPassword, confirmPassword) {
      this.isLoading = true;
      this.error = null;

      try {
        // Import the candidate service dynamically to avoid circular dependencies
        const candidateService = await import(
          '../services/candidate.service'
        ).then((m) => m.default);

        const response = await candidateService.changePassword(
          currentPassword,
          newPassword,
          confirmPassword
        );

        this.isLoading = false;

        // Return response to the component that called this method
        return response;
      } catch (error) {
        this.isLoading = false;

        // Check if this is a password validation error (incorrect current password)
        if (error.isPasswordError) {
          // Don't clear auth state for password validation errors
          this.error = error.message;
          throw error;
        }

        // For other errors, check if we need to handle auth issues
        if (error.response?.status === 401) {
          this.error = error.response?.data?.message || 'Authentication failed';
          // Don't logout automatically for password change errors
        } else {
          this.error =
            error.response?.data?.message || 'Failed to change password';
        }

        throw error;
      }
    },
  },
});
