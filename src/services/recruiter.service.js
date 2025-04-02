import api from './api'

const recruiterService = {
  /**
   * Get recruiter profile
   * @returns {Promise}
   */
  getProfile() {
    return api.get('/recruiters/profile')
  },

  /**
   * Update recruiter profile
   * @param {Object} profileData - Profile data to update
   * @returns {Promise}
   */
  updateProfile(profileData) {
    return api.put('/recruiters/profile', profileData)
  },

  /**
   * Upload company logo
   * @param {FormData} formData - Form data with logo
   * @returns {Promise}
   */
  uploadLogo(formData) {
    return api.post('/recruiters/logo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  /**
   * Create portfolio/event
   * @param {Object} portfolioData - Portfolio data to create
   * @returns {Promise}
   */
  createPortfolio(portfolioData) {
    return api.post('/recruiters/portfolio', portfolioData)
  },

  /**
   * Get all portfolios/events
   * @returns {Promise}
   */
  getPortfolios() {
    return api.get('/recruiters/portfolio')
  },

  /**
   * Get specific portfolio/event
   * @param {Number} portfolioId - ID of the portfolio to get
   * @returns {Promise}
   */
  getPortfolio(portfolioId) {
    return api.get(`/recruiters/portfolio/${portfolioId}`)
  },

  /**
   * Update portfolio/event
   * @param {Number} portfolioId - ID of the portfolio to update
   * @param {Object} portfolioData - Updated portfolio data
   * @returns {Promise}
   */
  updatePortfolio(portfolioId, portfolioData) {
    return api.put(`/recruiters/portfolio/${portfolioId}`, portfolioData)
  },

  /**
   * Delete portfolio/event
   * @param {Number} portfolioId - ID of the portfolio to delete
   * @returns {Promise}
   */
  deletePortfolio(portfolioId) {
    return api.delete(`/recruiters/portfolio/${portfolioId}`)
  },

  /**
   * Upload media to portfolio/event
   * @param {Number} portfolioId - ID of the portfolio
   * @param {FormData} formData - Form data with media
   * @returns {Promise}
   */
  uploadPortfolioMedia(portfolioId, formData) {
    return api.post(`/recruiters/portfolio/${portfolioId}/media`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  /**
   * Delete media from portfolio/event
   * @param {Number} portfolioId - ID of the portfolio
   * @param {Number} mediaId - ID of the media to delete
   * @returns {Promise}
   */
  deletePortfolioMedia(portfolioId, mediaId) {
    return api.delete(`/recruiters/portfolio/${portfolioId}/media/${mediaId}`)
  }
}