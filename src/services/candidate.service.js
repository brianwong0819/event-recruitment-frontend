import api from './api'

const candidateService = {
  /**
   * Get candidate profile
   * @returns {Promise}
   */
  getProfile() {
    return api.get('/candidates/profile')
  },

  /**
   * Update candidate profile
   * @param {Object} profileData - Profile data to update
   * @returns {Promise}
   */
  updateProfile(profileData) {
    return api.put('/candidates/profile', profileData)
  },

  /**
   * Add candidate experience
   * @param {Object} experienceData - Experience data to add
   * @returns {Promise}
   */
  addExperience(experienceData) {
    return api.post('/candidates/experiences', experienceData)
  },

  /**
   * Update candidate experience
   * @param {Number} experienceId - ID of the experience to update
   * @param {Object} experienceData - Updated experience data
   * @returns {Promise}
   */
  updateExperience(experienceId, experienceData) {
    return api.put(`/candidates/experiences/${experienceId}`, experienceData)
  },

  /**
   * Delete candidate experience
   * @param {Number} experienceId - ID of the experience to delete
   * @returns {Promise}
   */
  deleteExperience(experienceId) {
    return api.delete(`/candidates/experiences/${experienceId}`)
  },

  /**
   * Upload working photo
   * @param {FormData} formData - Form data with photo
   * @returns {Promise}
   */
  uploadWorkingPhoto(formData) {
    return api.post('/candidates/working-photos', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  /**
   * Delete working photo
   * @param {Number} photoId - ID of the photo to delete
   * @returns {Promise}
   */
  deleteWorkingPhoto(photoId) {
    return api.delete(`/candidates/working-photos/${photoId}`)
  },

  /**
   * Upload comcard (ID card)
   * @param {FormData} formData - Form data with comcard
   * @returns {Promise}
   */
  uploadComcard(formData) {
    return api.post('/candidates/comcards', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  /**
   * Delete comcard
   * @param {Number} comcardId - ID of the comcard to delete
   * @returns {Promise}
   */
  deleteComcard(comcardId) {
    return api.delete(`/candidates/comcards/${comcardId}`)
  },

  /**
   * Update availability dates
   * @param {Object} availabilityData - Availability dates data
   * @returns {Promise}
   */
  updateAvailability(availabilityData) {
    return api.put('/candidates/availability', availabilityData)
  },

  /**
   * Get all availability dates
   * @returns {Promise}
   */
  getAvailability() {
    return api.get('/candidates/availability')
  }
}

export default candidateService