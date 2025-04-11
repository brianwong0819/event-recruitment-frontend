import apiClient from './api.service';

/**
 * Job service for managing job postings and schedules
 */
export default {
  /**
   * Create a new job
   * @param {Object} jobData - The job data
   * @returns {Promise} Promise object with the created job
   */
  createJob(jobData) {
    return apiClient.post('/jobs', jobData);
  },

  /**
   * Get job by ID
   * @param {number} id - The job ID
   * @returns {Promise} Promise object with the job details
   */
  getJobById(id) {
    return apiClient.get(`/jobs/${id}`);
  },

  /**
   * Get jobs by project ID
   * @param {number} projectId - The project ID
   * @returns {Promise} Promise object with jobs for the project
   */
  getJobsByProject(projectId) {
    return apiClient.get(`/jobs/project/${projectId}`);
  },

  /**
   * Create a job schedule
   * @param {Object} scheduleData - The schedule data including job ID, dates, times, and locations
   * @returns {Promise} Promise object with the created schedule
   */
  createJobSchedule(scheduleData) {
    return apiClient.post('/job-schedules', scheduleData);
  },

  /**
   * Get job schedule by job ID
   * @param {number} jobId - The job ID
   * @returns {Promise} Promise object with the job schedule
   */
  getJobScheduleByJobId(jobId) {
    return apiClient.get(`/job-schedules/job/${jobId}`);
  },

  /**
   * Update job schedule
   * @param {number} scheduleId - The schedule ID
   * @param {Object} scheduleData - The updated schedule data
   * @returns {Promise} Promise object with the updated schedule
   */
  updateJobSchedule(scheduleId, scheduleData) {
    return apiClient.put(`/job-schedules/${scheduleId}`, scheduleData);
  },

  /**
   * Update job status
   * @param {number} jobId - The job ID
   * @param {string} status - The new status (OPEN, CLOSED, FILLED, CANCELLED, DRAFT, PENDING_REVIEW, ARCHIVED)
   * @returns {Promise} Promise object with the updated job
   */
  updateJobStatus(jobId, status) {
    return apiClient.put(`/jobs/${jobId}/status`, { newStatus: status });
  },

  /**
   * Update job details
   * @param {number} jobId - The job ID
   * @param {Object} jobData - The updated job data
   * @returns {Promise} Promise object with the updated job
   */
  updateJob(jobId, jobData) {
    return apiClient.put(`/jobs/${jobId}`, jobData);
  },

  /**
   * Delete a job
   * @param {number} jobId - The job ID
   * @returns {Promise} Promise object with the deletion status
   */
  deleteJob(jobId) {
    return apiClient.delete(`/jobs/${jobId}`);
  },
};
