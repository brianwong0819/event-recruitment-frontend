import apiClient from './api.service';

/**
 * Project service for managing projects
 */
export default {
  /**
   * Get all projects
   * @returns {Promise} Promise object with all projects
   */
  getProjects() {
    return apiClient.get('/projects');
  },

  /**
   * Get project by ID
   * @param {number} id - The project ID
   * @returns {Promise} Promise object with the project details
   */
  getProjectById(id) {
    return apiClient.get(`/projects/${id}`);
  },

  /**
   * Create a new project
   * @param {Object} projectData - The project data
   * @returns {Promise} Promise object with the created project
   */
  createProject(projectData) {
    return apiClient.post('/projects', projectData);
  },

  /**
   * Update project details
   * @param {number} projectId - The project ID
   * @param {Object} projectData - The updated project data
   * @returns {Promise} Promise object with the updated project
   */
  updateProject(projectId, projectData) {
    return apiClient.put(`/projects/${projectId}`, projectData);
  },

  /**
   * Delete a project
   * @param {number} projectId - The project ID
   * @returns {Promise} Promise object with the deletion status
   */
  deleteProject(projectId) {
    return apiClient.delete(`/projects/${projectId}`);
  },

  /**
   * Get project statistics
   * @param {number} projectId - The project ID
   * @returns {Promise} Promise object with the project statistics
   */
  getProjectStatistics(projectId) {
    return apiClient.get(`/projects/${projectId}/statistics`);
  },
};
