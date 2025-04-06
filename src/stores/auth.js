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
      const user = localStorage.getItem('user');
      const token = localStorage.getItem('accessToken');

      if (user && token) {
        this.user = JSON.parse(user);
        this.authenticated = true;
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
        const response = await AuthService.recruiterLogin(username, password);
        this.user = response.user;
        this.authenticated = true;

        // Navigate to appropriate dashboard or return URL
        const returnUrl = this.returnUrl || '/recruiter/dashboard';
        router.push(returnUrl);
        this.returnUrl = null;

        return response;
      } catch (error) {
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
