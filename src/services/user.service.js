import { apiClient } from './api.service';
import AuthService from './auth.service';

class UserService {
  /**
   * Get candidate profile for current user
   * @returns {Promise} - Candidate profile data
   */
  async getCandidateProfile() {
    return apiClient.get('/profile');
  }

  /**
   * Update candidate profile
   * @param {Object} profileData - Updated profile data
   * @returns {Promise} - Response with updated profile
   */
  async updateCandidateProfile(profileData) {
    try {
      // Get token directly from localStorage
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Authentication token missing');
      }

      // Ensure race field is properly formatted
      const cleanedData = { ...profileData };

      // Make sure race is included and valid
      if (!cleanedData.race || cleanedData.race === 'undefined') {
        cleanedData.race = null;
      }

      // Use direct fetch approach
      const response = await fetch('http://localhost:8080/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify(cleanedData),
      });

      let responseData;
      try {
        responseData = await response.json();
      } catch (e) {
        responseData = { success: response.ok };
      }

      // Update local user data if available in response
      if (responseData?.data) {
        this.updateLocalUserData(responseData.data);
      }

      return { data: responseData };
    } catch (error) {
      // Only keep essential error logging
      console.error('Error updating profile:', error.message);
      throw error;
    }
  }

  /**
   * Get recruiter profile for current user
   * @returns {Promise} - Recruiter profile data
   */
  async getRecruiterProfile() {
    return apiClient.get('/profile');
  }

  /**
   * Update recruiter profile
   * @param {Object} profileData - Updated profile data
   * @returns {Promise} - Response with updated profile
   */
  async updateRecruiterProfile(profileData) {
    const response = await apiClient.put('/profile', profileData);

    // Update local user data if available in response
    if (response.data?.data) {
      this.updateLocalUserData(response.data.data);
    }

    return response;
  }

  /**
   * Get profile based on user role
   * @returns {Promise} - Profile data for current user
   */
  async getUserProfile() {
    const user = AuthService.getCurrentUser();

    if (!user) {
      return Promise.reject('No user logged in');
    }

    // Determine user type from role or other indicator
    if (user.role === 'CANDIDATE') {
      return this.getCandidateProfile();
    } else if (user.role === 'RECRUITER') {
      return this.getRecruiterProfile();
    } else {
      return Promise.reject('Unknown user role');
    }
  }

  /**
   * Update user profile based on role
   * @param {Object} profileData - Profile data to update
   * @returns {Promise} - Response with updated profile
   */
  async updateUserProfile(profileData) {
    const user = AuthService.getCurrentUser();

    if (!user) {
      return Promise.reject('No user logged in');
    }

    if (user.role === 'CANDIDATE') {
      return this.updateCandidateProfile(profileData);
    } else if (user.role === 'RECRUITER') {
      return this.updateRecruiterProfile(profileData);
    } else {
      return Promise.reject('Unknown user role');
    }
  }

  /**
   * Update local user data in localStorage
   * @param {Object} userData - Updated user data fields
   */
  updateLocalUserData(userData) {
    try {
      // Get current user data from localStorage
      const currentUserString = localStorage.getItem('user');

      if (currentUserString) {
        const currentUser = JSON.parse(currentUserString);

        // Merge new data with existing user data
        const updatedUser = { ...currentUser, ...userData };

        // Save back to localStorage
        localStorage.setItem('user', JSON.stringify(updatedUser));

        console.log('UserService: Updated local user data:', updatedUser);
      } else {
        console.warn(
          'UserService: Cannot update local user data - no user found in localStorage'
        );
      }
    } catch (error) {
      console.error('UserService: Error updating local user data:', error);
    }
  }

  /**
   * Upload profile picture
   * @param {File} file - Image file to upload
   * @returns {Promise} - Response with uploaded file URL
   */
  async uploadProfilePicture(file) {
    const formData = new FormData();
    formData.append('file', file);

    const endpoint = '/profile/upload-picture';

    const response = await apiClient.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Update local user data if URL is returned
    if (response.data?.data?.profilePictureUrl) {
      this.updateLocalUserData({
        profilePictureUrl: response.data.data.profilePictureUrl,
      });
    }

    return response;
  }
}

// Create a singleton instance
const userService = new UserService();
export default userService;
