import { apiClient } from './api.service';

/**
 * Service for recruiter-related API operations
 */
class RecruiterService {
  /**
   * Get the recruiter's profile information
   * @returns {Promise} Promise representing the API call
   */
  getProfile() {
    console.log('Calling profile API endpoint: /profile');
    return apiClient.get('/profile');
  }

  /**
   * Update the recruiter's profile information
   * @param {Object} profileData - Updated profile data
   * @returns {Promise} Promise representing the API call
   */
  updateProfile(profileData) {
    console.log('Updating profile with data:', profileData);
    return apiClient.put('/profile', profileData);
  }

  /**
   * Upload company logo
   * @param {File} file - The logo file to upload
   * @returns {Promise} Promise representing the API call
   */
  uploadLogo(file) {
    const formData = new FormData();
    formData.append('file', file);

    console.log('Uploading logo to endpoint: /profile/logo');
    return apiClient.post('/profile/logo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  /**
   * Get company logo URL
   * @param {string} logoPath - The logo path from the server
   * @returns {string} Full URL to the logo
   */
  getLogoUrl(logoPath) {
    if (!logoPath) return null;

    // Check if it's already a full URL
    if (logoPath.startsWith('http')) {
      return logoPath;
    }

    // Otherwise, build the URL
    return `${apiClient.defaults.baseURL}/uploads/recruiter/logos/${logoPath}`;
  }

  /**
   * Get team members
   * @returns {Promise} Promise representing the API call
   */
  getTeamMembers() {
    return apiClient.get('/recruiter/team');
  }

  /**
   * Add a new team member
   * @param {Object} memberData - New member data
   * @returns {Promise} Promise representing the API call
   */
  addTeamMember(memberData) {
    return apiClient.post('/recruiter/team', memberData);
  }

  /**
   * Update a team member
   * @param {string} memberId - ID of the member to update
   * @param {Object} memberData - Updated member data
   * @returns {Promise} Promise representing the API call
   */
  updateTeamMember(memberId, memberData) {
    return apiClient.put(`/recruiter/team/${memberId}`, memberData);
  }

  /**
   * Delete a team member
   * @param {string} memberId - ID of the member to delete
   * @returns {Promise} Promise representing the API call
   */
  deleteTeamMember(memberId) {
    return apiClient.delete(`/recruiter/team/${memberId}`);
  }

  /**
   * Get company documents
   * @returns {Promise} Promise representing the API call
   */
  getDocuments() {
    return apiClient.get('/recruiter/documents');
  }

  /**
   * Upload a company document
   * @param {File} file - The document file to upload
   * @param {Object} metadata - Document metadata like type and description
   * @returns {Promise} Promise representing the API call
   */
  uploadDocument(file, metadata) {
    const formData = new FormData();
    formData.append('document', file);

    // Add metadata as additional form fields
    if (metadata) {
      Object.keys(metadata).forEach((key) => {
        formData.append(key, metadata[key]);
      });
    }

    return apiClient.post('/recruiter/documents', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  /**
   * Delete a document
   * @param {string} documentId - ID of the document to delete
   * @returns {Promise} Promise representing the API call
   */
  deleteDocument(documentId) {
    return apiClient.delete(`/recruiter/documents/${documentId}`);
  }
}

export default new RecruiterService();
