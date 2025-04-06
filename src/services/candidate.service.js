import { apiClient } from './api.service';
import userService from './user.service';

class CandidateService {
  /**
   * Get candidate profile for current user
   * @returns {Promise} - Candidate profile data
   */
  async getProfile() {
    return userService.getCandidateProfile();
  }

  /**
   * Update candidate profile
   * @param {Object} profileData - Updated profile data
   * @returns {Promise} - Response with updated profile
   */
  async updateProfile(profileData) {
    try {
      // Format dates properly if needed
      const formattedData = { ...profileData };

      // Make sure date is in proper ISO format for API
      if (
        formattedData.dateOfBirth &&
        typeof formattedData.dateOfBirth !== 'string'
      ) {
        formattedData.dateOfBirth = formattedData.dateOfBirth
          .toISOString()
          .split('T')[0];
      }

      // Call the user service to update the profile
      const response = await userService.updateCandidateProfile(formattedData);
      return response;
    } catch (error) {
      console.error('Error updating profile:', error.message);
      throw error;
    }
  }

  /**
   * Upload resume for candidate
   * @param {File} file - Resume file to upload
   * @returns {Promise} - Response with uploaded file URL
   */
  async uploadResume(file) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post('/resume/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response;
  }

  /**
   * Add or update work experience
   * @param {Object} experienceData - Experience data
   * @returns {Promise} - Response with updated experience data
   */
  async saveExperience(experienceData) {
    return apiClient.post('/experience', experienceData);
  }

  /**
   * Delete work experience
   * @param {string} experienceId - ID of experience to delete
   * @returns {Promise} - Response with deletion status
   */
  async deleteExperience(experienceId) {
    return apiClient.delete(`/experience/${experienceId}`);
  }

  /**
   * Get all work experiences
   * @returns {Promise} - Response with list of experiences
   */
  async getExperiences() {
    return apiClient.get('/experiences');
  }

  /**
   * Update candidate availability dates
   * @param {Array} dates - Array of date strings in YYYY-MM-DD format
   * @returns {Promise} - Response with updated availability
   */
  async updateAvailability(dates) {
    return apiClient.post('/availability', { dates });
  }

  /**
   * Get candidate availability dates
   * @returns {Promise} - Response with list of available dates
   */
  async getAvailability() {
    return apiClient.get('/availability');
  }

  /**
   * Upload profile picture
   * @param {File} file - Image file to upload
   * @returns {Promise} - Response with uploaded image URL
   */
  async uploadProfilePicture(file) {
    const formData = new FormData();
    formData.append('file', file);

    return apiClient.post('/candidate/photos/profile-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  /**
   * Get profile picture URL
   * @param {String} filename - Image filename in assets directory
   * @returns {String} - Full URL to the profile picture
   */
  getProfilePictureFromAssets(filename) {
    if (!filename || filename === 'undefined') return null;
    try {
      // Using URL constructor for more robust importing with correct relative path
      return new URL(
        `../../assets/profile-pictures/${filename}`,
        import.meta.url
      ).href;
    } catch (error) {
      console.error('Failed to load profile picture from assets:', error);
      return null;
    }
  }

  /**
   * Delete resume
   * @returns {Promise} - Response with deletion status
   */
  async deleteResume() {
    return apiClient.delete('/resume');
  }

  /**
   * Remove profile picture
   * @returns {Promise} - Response with deletion status
   */
  async removeProfilePicture() {
    return apiClient.delete('/candidate/photos/profile-picture');
  }

  /**
   * Update email address
   * @param {String} email - New email address
   * @returns {Promise} - Response with updated profile
   */
  async updateEmail(email) {
    try {
      // Use the same API endpoint as profile update, but only send email
      const response = await apiClient.put('/profile', { email });
      return response;
    } catch (error) {
      console.error('Error updating email:', error.message);
      throw error;
    }
  }

  /**
   * Change user password
   * @param {String} currentPassword - Current password
   * @param {String} newPassword - New password
   * @param {String} confirmPassword - Confirmation of new password
   * @returns {Promise} - Response with status
   */
  async changePassword(currentPassword, newPassword, confirmPassword) {
    try {
      // Use a config option to prevent automatic retries on authentication errors
      const response = await apiClient.post(
        '/profile/change-password',
        {
          currentPassword,
          newPassword,
          confirmPassword,
        },
        {
          // This will prevent automatic token refresh on 401 errors for this specific request
          skipAuthRefresh: true,
          // Option to not retry this request if it fails
          shouldRetry: false,
        }
      );
      return response;
    } catch (error) {
      console.error('Error changing password:', error.message);

      // If the error is "Current password is incorrect", handle it specifically
      if (
        error.response?.status === 401 ||
        error.response?.data?.message === 'Current password is incorrect'
      ) {
        // Throw a custom error that won't trigger the auth refresh mechanism
        throw {
          ...error,
          isPasswordError: true,
          message:
            error.response?.data?.message || 'Current password is incorrect',
          response: error.response,
        };
      }

      throw error;
    }
  }
}

export default new CandidateService();
