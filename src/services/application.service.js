import { apiClient } from '@/services/api.service';

/**
 * Application service for handling candidate application operations
 */
class ApplicationService {
  /**
   * Get all applications for the current candidate
   * @returns {Promise} Response with applications data
   */
  async getCandidateApplications() {
    return apiClient.get('/candidates/applications');
  }

  /**
   * Get a specific application by ID
   * @param {number} applicationId - ID of the application to retrieve
   * @returns {Promise} Response with application data
   */
  async getApplicationById(applicationId) {
    return apiClient.get(`/candidates/applications/${applicationId}`);
  }

  /**
   * Withdraw an application
   * @param {number} applicationId - ID of the application to withdraw
   * @returns {Promise} Response confirming withdrawal
   */
  async withdrawApplication(applicationId) {
    return apiClient.put(`/candidates/applications/${applicationId}/withdraw`);
  }

  /**
   * Submit a new application
   * @param {Object} applicationData - Application data to submit
   * @returns {Promise} Response with the created application
   */
  async submitApplication(applicationData) {
    return apiClient.post('/candidates/applications', applicationData);
  }
}

export default new ApplicationService();
