import { apiClient } from './api.service';
import userService from './user.service';
import fileService from './file.service';

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

    const response = await apiClient.post('/candidate/file/resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response;
  }

  /**
   * Add or update work experience
   * @param {Object} experienceData - Experience data with jobType and experienceText
   * @returns {Promise} - Response with updated experience data
   */
  async saveExperience(experienceData) {
    // If experience has an ID, it's an update
    if (experienceData.id) {
      return apiClient.put(
        `/candidate/experiences/${experienceData.id}`,
        experienceData
      );
    }
    // Otherwise it's a new experience
    return apiClient.post('/candidate/experiences', experienceData);
  }

  /**
   * Delete work experience
   * @param {string} experienceId - ID of experience to delete
   * @returns {Promise} - Response with deletion status
   */
  async deleteExperience(experienceId) {
    return apiClient.delete(`/candidate/experiences/${experienceId}`);
  }

  /**
   * Get all work experiences
   * @returns {Promise} - Response with list of experiences
   */
  async getExperiences() {
    return apiClient.get('/candidate/experiences');
  }

  /**
   * Get experience by ID
   * @param {string} experienceId - ID of experience to retrieve
   * @returns {Promise} - Response with experience data
   */
  async getExperienceById(experienceId) {
    return apiClient.get(`/candidate/experiences/${experienceId}`);
  }

  /**
   * Update candidate availability
   * @param {Object} availabilityData - Availability data with type and dates
   * @returns {Promise} - Response with updated availability
   */
  async updateAvailability(availabilityData) {
    return apiClient.put('/candidates/availability', availabilityData);
  }

  /**
   * Get candidate availability
   * @returns {Promise} - Response with availability data
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
    const formData = new FormData();
    formData.append('file', file);

    return apiClient.post('/candidate/file/profile-picture', formData, {
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
    return fileService.getProfilePictureUrl(filename);
  }

  /**
   * Delete resume
   * @returns {Promise} - Response with deletion status
   */
  async deleteResume() {
    return apiClient.delete('/candidate/file/resume');
  }

  /**
   * Download resume
   * @returns {Promise} - Response with the resume file or its URL
   */
  async downloadResume() {
    try {
      // Try to get the file as a blob
      const response = await apiClient.get('/candidate/file/resume', {
        responseType: 'blob',
      });

      // Check if we received a valid blob
      const contentType = response.headers['content-type'];
      if (contentType && contentType.includes('application/json')) {
        // If we got JSON instead of a file, convert it back to read the error
        const text = await new Response(response.data).text();
        const jsonData = JSON.parse(text);

        // If there's a URL in the response, open it
        if (jsonData.data && jsonData.data.url) {
          window.open(jsonData.data.url, '_blank');
          return response;
        } else if (jsonData.url) {
          window.open(jsonData.url, '_blank');
          return response;
        } else {
          throw new Error(jsonData.message || 'Failed to download resume');
        }
      }

      // Otherwise we have a PDF or other file, so create download
      const blob = new Blob([response.data], {
        type: contentType || 'application/pdf',
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'resume.pdf');
      document.body.appendChild(link);
      link.click();

      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);

      return response;
    } catch (error) {
      console.error('Error downloading resume:', error);

      try {
        const urlResponse = await apiClient.get('/candidate/file/resume', {
          responseType: 'json',
        });

        if (urlResponse.data && urlResponse.data.url) {
          window.open(urlResponse.data.url, '_blank');
          return urlResponse;
        } else if (
          typeof urlResponse.data === 'string' &&
          (urlResponse.data.includes('/api/files/resumes/') ||
            urlResponse.data.includes('/assets/resumes/'))
        ) {
          window.open(urlResponse.data, '_blank');
          return urlResponse;
        }
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
      }

      throw error;
    }
  }

  /**
   * Get resume URL from assets directory
   * @param {String} filename - Resume filename in assets directory
   * @returns {String} - Full URL to the resume file
   */
  getResumeFromAssets(filename) {
    if (!filename || filename === 'undefined') return null;
    return fileService.getResumeUrl(filename);
  }

  /**
   * Remove profile picture
   * @returns {Promise} - Response with deletion status
   */
  async removeProfilePicture() {
    return apiClient.delete('/candidate/file/profile-picture');
  }

  /**
   * Update email address
   * @param {String} email - New email address
   * @returns {Promise} - Response with updated profile
   */
  async updateEmail(email) {
    return apiClient.put(
      `/profile/update-email?newEmail=${encodeURIComponent(email)}`
    );
  }

  /**
   * Upload comp card photo
   * @param {File} file - Image file to upload
   * @returns {Promise} - Response with uploaded image URL
   */
  async uploadCompcardPhoto(file) {
    const formData = new FormData();
    formData.append('file', file);

    return apiClient.post('/candidate/file/comcard', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  /**
   * Get comp card photos
   * @returns {Promise} - Response with comp card photos
   */
  async getCompcardPhotos() {
    return apiClient.get('/candidate/file/comcard');
  }

  /**
   * Get comp card image URL from assets directory
   * @param {String} filename - Comp card image filename or path
   * @returns {String} - Full URL to the comp card image
   */
  getCompcardFromAssets(filename) {
    if (!filename || filename === 'undefined') return null;

    console.log('Resolving image path for:', filename);

    const filenameOnly = filename.includes('/')
      ? filename.split('/').pop()
      : filename;

    console.log('Extracted filename:', filenameOnly);

    const url = fileService.getCompcardUrl(filenameOnly);

    console.log('Final image URL:', url);
    return url;
  }

  /**
   * Delete comp card photo
   * @param {String|Number} photoId - ID of the photo to delete
   * @returns {Promise} - Response with deletion status
   */
  async deleteCompcardPhoto(photoId) {
    console.log(`Deleting photo with ID: ${photoId}`);
    return apiClient.delete(`/candidate/file/comcard/${photoId}`);
  }

  /**
   * Change password
   * @param {String} currentPassword - Current password
   * @param {String} newPassword - New password
   * @param {String} confirmPassword - Confirm new password
   * @returns {Promise} - Response with success or failure
   */
  async changePassword(currentPassword, newPassword, confirmPassword) {
    try {
      // Use a config option to prevent automatic retries on authentication errors
      const response = await apiClient.post(
        '/profile/change-password',
        {
          currentPassword,
          newPassword,
        },
        {
          skipAuthRefresh: true,
          shouldRetry: false,
        }
      );
      return response;
    } catch (error) {
      console.error('Error changing password:', error.message);

      if (
        error.response?.status === 401 ||
        error.response?.data?.message === 'Current password is incorrect' ||
        (error.response?.data?.message &&
          error.response?.data?.message.includes('password'))
      ) {
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

  /**
   * Upload working photo
   * @param {File} file - Image file to upload
   * @param {String} description - Description of the working photo
   * @returns {Promise} - Response with uploaded image URL
   */
  async uploadWorkingPhoto(file, description) {
    const formData = new FormData();
    formData.append('file', file);
    if (description) {
      formData.append('description', description);
    }

    return apiClient.post('/candidate/file/working', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  /**
   * Get working photos
   * @returns {Promise} - Response with working photos
   */
  async getWorkingPhotos() {
    return apiClient.get('/candidate/file/working');
  }

  /**
   * Delete working photo
   * @param {String|Number} photoId - ID of the photo to delete
   * @returns {Promise} - Response with deletion status
   */
  async deleteWorkingPhoto(photoId) {
    console.log(`Deleting working photo with ID: ${photoId}`);
    return apiClient.delete(`/candidate/file/working/${photoId}`);
  }

  /**
   * Get working photo URL from assets directory
   * @param {String} filename - Working photo filename or path
   * @returns {String} - Full URL to the working photo
   */
  getWorkingPhotoFromAssets(filename) {
    if (!filename || filename === 'undefined') return null;

    try {
      console.log('Resolving working image path for:', filename);

      // Clean up the filename by removing any path prefixes
      let cleanFilename = filename;

      // Check for various patterns and extract just the filename
      if (filename.includes('/api/files/working-photos/')) {
        cleanFilename = filename.split('/api/files/working-photos/').pop();
      } else if (filename.includes('api/files/working-photos/')) {
        cleanFilename = filename.split('api/files/working-photos/').pop();
      } else if (filename.includes('/assets/working-photos/')) {
        cleanFilename = filename.split('/assets/working-photos/').pop();
      } else if (filename.includes('/working-photos/')) {
        cleanFilename = filename.split('/working-photos/').pop();
      } else if (filename.includes('/')) {
        cleanFilename = filename.split('/').pop();
      }

      cleanFilename = cleanFilename.replace(/^\/+/, '');

      console.log('Extracted filename for working photo:', cleanFilename);

      const url = fileService.getWorkingPhotoUrl(cleanFilename);

      console.log('Final working photo URL:', url);
      return url;
    } catch (error) {
      console.error('Failed to resolve working photo path:', error);
      return null;
    }
  }
}

export default new CandidateService();
