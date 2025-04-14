import { apiClient } from './api.service';
import fileService from './file.service';

/**
 * Service for recruiter-related API operations
 */
class RecruiterService {
  /**
   * Get the recruiter's profile information
   * @returns {Promise} Promise representing the API call
   */
  getProfile() {
    return apiClient.get('/profile');
  }

  /**
   * Update the recruiter's profile information
   * @param {Object} profileData - Updated profile data
   * @returns {Promise} Promise representing the API call
   */
  updateProfile(profileData) {
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

    return apiClient.post('/recruiter/company-logo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  /**
   * Get company logo URL from assets directory
   * @param {String} logoPath - Company logo filename or path
   * @returns {String} - Full URL to the company logo
   */
  getLogoFromAssets(logoPath) {
    if (!logoPath || logoPath === 'undefined') return null;

    try {
      // Use the fileService to handle the URL properly
      return fileService.getCompanyLogoUrl(logoPath);
    } catch (error) {
      console.error('Error in getLogoFromAssets:', error);
      return null;
    }
  }

  /**
   * Get logo URL - handles both local and server-side URLs
   * @param {String} logoPath - Logo path or filename
   * @returns {String} - Processed URL for display
   */
  getLogoUrl(logoPath) {
    if (!logoPath) return '';

    // If it's a blob URL for image preview, return as is
    if (logoPath.startsWith('blob:')) return logoPath;

    try {
      // Use fileService to get the proper URL
      return fileService.getCompanyLogoUrl(logoPath);
    } catch (error) {
      console.error('Error in getLogoUrl:', error);

      // Fallback for absolute URLs with http/https
      if (logoPath.startsWith('http')) {
        return logoPath;
      }

      // Fallback for URLs starting with / (server-relative paths)
      const baseServerUrl = apiClient.defaults.baseURL.split('/api')[0]; // e.g. http://localhost:8080
      return `${baseServerUrl}${
        logoPath.startsWith('/') ? '' : '/'
      }${logoPath}`;
    }
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
