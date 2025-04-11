import apiClient from './api.service';

/**
 * Location service for managing locations in the application
 */
export default {
  /**
   * Search for locations using fuzzy search
   * @param {string} query - The search query (minimum 2 characters)
   * @returns {Promise} Promise object with search results
   */
  searchLocations(query) {
    return apiClient.post('/locations/search', { keyword: query });
  },

  /**
   * Save a Google Places location to the database
   * @param {string} placeId - The Google Places ID
   * @returns {Promise} Promise object with the saved location
   */
  saveGooglePlaceLocation(placeId) {
    return apiClient.get(`/locations/place/${placeId}`);
  },

  /**
   * Get location by ID
   * @param {number} id - The location ID
   * @returns {Promise} Promise object with the location details
   */
  getLocationById(id) {
    return apiClient.get(`/locations/${id}`);
  },

  /**
   * Get recent locations
   * @param {number} limit - The number of recent locations to fetch
   * @returns {Promise} Promise object with recent locations
   */
  getRecentLocations(limit = 5) {
    return apiClient.get('/locations/recent', { params: { limit } });
  },
};
