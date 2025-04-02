import api from './api'

const authService = {
  /**
   * Login with username/email and password
   * @param {Object} credentials - { username, password }
   * @returns {Promise}
   */
  login(credentials) {
    return api.post('/auth/login', credentials)
  },

  /**
   * Register a new candidate
   * @param {Object} candidateData - Candidate registration data
   * @returns {Promise}
   */
  registerCandidate(candidateData) {
    return api.post('/auth/register/candidate', candidateData)
  },

  /**
   * Register a new recruiter
   * @param {Object} recruiterData - Recruiter registration data
   * @returns {Promise}
   */
  registerRecruiter(recruiterData) {
    return api.post('/auth/register/recruiter', recruiterData)
  },

  /**
   * Refresh token
   * @param {Object} refreshToken - { refreshToken }
   * @returns {Promise}
   */
  refreshToken(refreshToken) {
    return api.post('/auth/refreshtoken', refreshToken)
  },

  /**
   * Check if user is authenticated
   * @returns {Boolean}
   */
  isAuthenticated() {
    return !!localStorage.getItem('token')
  },

  /**
   * Get current user token
   * @returns {String|null}
   */
  getToken() {
    return localStorage.getItem('token')
  },

  /**
   * Get current user info
   * @returns {Object|null}
   */
  getUserInfo() {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  }
}

export default authService