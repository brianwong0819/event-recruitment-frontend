import apiClient from './api.service';
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
    return userService.updateCandidateProfile(profileData);
  }

  /**
   * Upload resume for candidate
   * @param {File} file - Resume file to upload
   * @returns {Promise} - Response with uploaded file URL
   */
  async uploadResume(file) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post(
      '/candidates/resume/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response;
  }

  /**
   * Add or update work experience
   * @param {Object} experienceData - Experience data
   * @returns {Promise} - Response with updated experience data
   */
  async saveExperience(experienceData) {
    return apiClient.post('/candidates/experience', experienceData);
  }

  /**
   * Delete work experience
   * @param {string} experienceId - ID of experience to delete
   * @returns {Promise} - Response with deletion status
   */
  async deleteExperience(experienceId) {
    return apiClient.delete(`/candidates/experience/${experienceId}`);
  }

  /**
   * Get all work experiences
   * @returns {Promise} - Response with list of experiences
   */
  async getExperiences() {
    return apiClient.get('/candidates/experiences');
  }

  /**
   * Update candidate availability dates
   * @param {Array} dates - Array of date strings in YYYY-MM-DD format
   * @returns {Promise} - Response with updated availability
   */
  async updateAvailability(dates) {
    return apiClient.post('/candidates/availability', { dates });
  }

  /**
   * Get candidate availability dates
   * @returns {Promise} - Response with list of available dates
   */
  async getAvailability() {
    return apiClient.get('/candidates/availability');
  }

  /**
   * Upload profile picture
   * @param {File} file - Image file to upload
   * @returns {Promise} - Response with uploaded image URL
   */
  async uploadProfilePicture(file) {
    return userService.uploadProfilePicture(file);
  }

  /**
   * Delete resume
   * @returns {Promise} - Response with deletion status
   */
  async deleteResume() {
    return apiClient.delete('/candidates/resume');
  }

  /**
   * Remove profile picture
   * @returns {Promise} - Response with deletion status
   */
  async removeProfilePicture() {
    return apiClient.delete('/candidates/profile/picture');
  }
}

export default new CandidateService();
