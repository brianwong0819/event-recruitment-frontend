import apiClient from './api.service';
import AuthService from './auth.service';

class UserService {
  /**
   * Get candidate profile for current user
   * @returns {Promise} - Candidate profile data
   */
  async getCandidateProfile() {
    return apiClient.get('/candidates/profile');
  }
  
  /**
   * Update candidate profile
   * @param {Object} profileData - Updated profile data
   * @returns {Promise} - Response with updated profile
   */
  async updateCandidateProfile(profileData) {
    const response = await apiClient.put('/candidates/profile', profileData);
    
    // Update local user data if available in response
    if (response.data?.data) {
      this.updateLocalUserData(response.data.data);
    }
    
    return response;
  }
  
  /**
   * Get recruiter profile for current user
   * @returns {Promise} - Recruiter profile data
   */
  async getRecruiterProfile() {
    return apiClient.get('/recruiters/profile');
  }
  
  /**
   * Update recruiter profile
   * @param {Object} profileData - Updated profile data
   * @returns {Promise} - Response with updated profile
   */
  async updateRecruiterProfile(profileData) {
    const response = await apiClient.put('/recruiters/profile', profileData);
    
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
   * @param {Object} userData - Updated user data
   */
  updateLocalUserData(userData) {
    const currentUser = AuthService.getCurrentUser();
    
    if (currentUser) {
      // Merge current user data with new data
      const updatedUser = { ...currentUser, ...userData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
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
    
    const user = AuthService.getCurrentUser();
    let endpoint = '/profile/upload-picture';
    
    // Use role-specific endpoints if needed
    if (user && user.role === 'CANDIDATE') {
      endpoint = '/candidates/profile/upload-picture';
    } else if (user && user.role === 'RECRUITER') {
      endpoint = '/recruiters/profile/upload-picture';
    }
    
    const response = await apiClient.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    // Update local user data if URL is returned
    if (response.data?.data?.profilePictureUrl) {
      this.updateLocalUserData({ 
        profilePictureUrl: response.data.data.profilePictureUrl 
      });
    }
    
    return response;
  }
}

export default new UserService();