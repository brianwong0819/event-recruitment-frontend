<template>
  <div class="p-6 relative">
    <!-- Read-only overlay for deleted projects -->
    <div
      v-if="isDeletedProject"
      class="absolute inset-0 bg-gray-100 bg-opacity-40 z-10 pointer-events-none"
    ></div>

    <!-- Read-only banner for deleted projects -->
    <div
      v-if="isDeletedProject"
      class="mb-6 bg-gray-100 border-l-4 border-gray-500 p-4 z-20 relative"
    >
      <div class="flex items-center">
        <i class="pi pi-info-circle text-gray-600 mr-2"></i>
        <p class="text-gray-700">
          This project has been deleted and is in read-only mode. No changes can
          be made.
        </p>
      </div>
    </div>

    <div class="mb-6">
      <div class="flex items-center">
        <Button
          icon="pi pi-arrow-left"
          class="p-button-text p-button-rounded mr-2"
          @click="goBackToProjects"
          :disabled="false"
        />
        <div>
          <h1 class="text-2xl font-bold text-gray-900 mb-1">
            {{ project?.name || 'Project Details' }}
          </h1>
          <p class="text-gray-600">{{ project?.description }}</p>
        </div>
        <!-- Add trash button -->
        <div class="ml-auto" v-if="!isDeletedProject">
          <Button
            icon="pi pi-trash"
            class="p-button-danger p-button-outlined"
            @click="confirmTrashProject"
            tooltip="Move to Trash"
            tooltipPosition="bottom"
          />
        </div>
      </div>
    </div>

    <!-- Project Details Card -->
    <div class="bg-white rounded-lg shadow mb-6 overflow-hidden">
      <div
        class="bg-gradient-to-r from-primary-500 to-primary-700 h-12 flex items-center px-4"
      >
        <span class="text-white font-medium">Project Overview</span>
      </div>
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Created At -->
          <div class="bg-gray-50 p-4 rounded-lg shadow-sm">
            <div class="flex items-center">
              <div class="bg-primary-100 rounded-full p-2 mr-3">
                <i class="pi pi-calendar text-primary-700"></i>
              </div>
              <div>
                <h3 class="text-sm font-medium text-gray-500">Created At</h3>
                <p class="text-lg font-semibold text-gray-900">
                  {{ formatDate(project?.createdAt) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Total Jobs -->
          <div class="bg-gray-50 p-4 rounded-lg shadow-sm">
            <div class="flex items-center">
              <div class="bg-primary-100 rounded-full p-2 mr-3">
                <i class="pi pi-briefcase text-primary-700"></i>
              </div>
              <div>
                <h3 class="text-sm font-medium text-gray-500">Total Jobs</h3>
                <p class="text-lg font-semibold text-gray-900">
                  {{ projectStats?.totalJobs || 0 }}
                </p>
              </div>
            </div>
          </div>

          <!-- Total Locations -->
          <div class="bg-gray-50 p-4 rounded-lg shadow-sm">
            <div class="flex items-center">
              <div class="bg-primary-100 rounded-full p-2 mr-3">
                <i class="pi pi-map-marker text-primary-700"></i>
              </div>
              <div>
                <h3 class="text-sm font-medium text-gray-500">
                  Total Locations
                </h3>
                <p class="text-lg font-semibold text-gray-900">
                  {{ projectStats?.totalUniqueLocations || 0 }}
                </p>
              </div>
            </div>
          </div>

          <!-- Total Working Days -->
          <div class="bg-gray-50 p-4 rounded-lg shadow-sm">
            <div class="flex items-center">
              <div class="bg-primary-100 rounded-full p-2 mr-3">
                <i class="pi pi-clock text-primary-700"></i>
              </div>
              <div>
                <h3 class="text-sm font-medium text-gray-500">
                  Total Working Days
                </h3>
                <p class="text-lg font-semibold text-gray-900">
                  {{ projectStats?.totalWorkingDays || 0 }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Second Row for Recruitment Stats -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <!-- Positions Needed -->
          <div class="bg-blue-50 p-4 rounded-lg shadow-sm">
            <div class="flex items-center">
              <div class="bg-blue-100 rounded-full p-2 mr-3">
                <i class="pi pi-users text-blue-700"></i>
              </div>
              <div>
                <h3 class="text-sm font-medium text-blue-700">
                  Total Working Dates
                </h3>
                <p class="text-lg font-semibold text-blue-900">
                  {{ projectStats?.totalPositionsNeeded || 0 }}
                </p>
              </div>
            </div>
          </div>

          <!-- Positions Filled -->
          <div class="bg-green-50 p-4 rounded-lg shadow-sm">
            <div class="flex items-center">
              <div class="bg-green-100 rounded-full p-2 mr-3">
                <i class="pi pi-check-circle text-green-700"></i>
              </div>
              <div>
                <h3 class="text-sm font-medium text-green-700">
                  Working Dates Filled
                </h3>
                <p class="text-lg font-semibold text-green-900">
                  {{ projectStats?.totalPositionsFilled || 0 }}
                </p>
              </div>
            </div>
          </div>

          <!-- Positions Remaining -->
          <div class="bg-orange-50 p-4 rounded-lg shadow-sm">
            <div class="flex items-center">
              <div class="bg-orange-100 rounded-full p-2 mr-3">
                <i class="pi pi-user-plus text-orange-700"></i>
              </div>
              <div>
                <h3 class="text-sm font-medium text-orange-700">
                  Working Dates Remaining
                </h3>
                <p class="text-lg font-semibold text-orange-900">
                  {{ getRemainingPositions() }}
                </p>
              </div>
            </div>
          </div>

          <!-- Job Status Summary -->
          <div class="bg-purple-50 p-4 rounded-lg shadow-sm">
            <div class="flex items-center mb-2">
              <div class="bg-purple-100 rounded-full p-2 mr-3">
                <i class="pi pi-chart-line text-purple-700"></i>
              </div>
              <div class="flex-1">
                <h3 class="text-sm font-medium text-purple-700">
                  Recruitment Progress
                </h3>
                <div class="text-xs text-gray-600 mt-1">
                  {{ projectStats?.totalPositionsFilled || 0 }} of
                  {{ projectStats?.totalPositionsNeeded || 0 }} Working dates
                  filled
                </div>
              </div>
              <div class="text-right">
                <div class="text-lg font-bold text-purple-700">
                  {{ calculateProgress }}%
                </div>
                <div class="text-xs text-gray-500">Complete</div>
              </div>
            </div>
            <div class="relative pt-1">
              <div
                class="overflow-hidden h-3 text-xs flex rounded bg-purple-200"
              >
                <div
                  :style="{ width: `${calculateProgress}%` }"
                  class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500 transition-all duration-500"
                ></div>
              </div>
              <div class="flex justify-between mt-2">
                <div class="text-xs">
                  <span class="text-gray-500">Total Dates:</span>
                  <span class="font-semibold text-gray-700 ml-1">{{
                    projectStats?.totalPositionsNeeded || 0
                  }}</span>
                </div>
                <div class="text-xs">
                  <span class="text-gray-500">Remaining:</span>
                  <span class="font-semibold text-gray-700 ml-1">{{
                    getRemainingPositions()
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Jobs Section -->
    <div class="bg-white rounded-xl shadow-md overflow-hidden">
      <div
        class="bg-gradient-to-r from-primary-50 to-primary-100 p-6 border-b border-primary-100"
      >
        <div class="flex justify-between items-center">
          <div>
            <h2
              class="text-xl font-semibold text-primary-800 flex items-center"
            >
              <i class="pi pi-briefcase text-primary-500 mr-3"></i>
              Jobs in this Project
            </h2>
            <p class="text-gray-600 mt-1">
              Manage all job listings and recruitment activities
            </p>
          </div>
          <Button
            v-if="!isDeletedProject"
            label="New Job"
            icon="pi pi-plus"
            @click="navigateToCreateJob"
            class="p-button-primary shadow-sm"
          />
        </div>
      </div>

      <div class="p-6">
        <!-- Loading state -->
        <div v-if="loading" class="text-center py-16">
          <ProgressSpinner
            style="width: 60px; height: 60px"
            strokeWidth="4"
            fill="var(--surface-ground)"
            animationDuration=".7s"
            class="mb-4"
          />
          <p class="text-gray-600 text-lg">Loading project jobs...</p>
        </div>

        <!-- Empty state -->
        <div
          v-else-if="!project || project.jobs?.length === 0"
          class="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-300"
        >
          <div
            class="w-24 h-24 rounded-full bg-primary-50 flex items-center justify-center mx-auto mb-6"
          >
            <i class="pi pi-briefcase text-primary-300 text-4xl"></i>
          </div>
          <h3 class="text-2xl font-medium text-gray-700 mb-3">
            No Jobs in this Project Yet
          </h3>
          <p class="text-gray-500 mb-8 max-w-md mx-auto">
            Start creating job listings for this project to begin recruiting
            talent
          </p>
          <Button
            v-if="!isDeletedProject"
            label="Create First Job"
            icon="pi pi-plus"
            @click="navigateToCreateJob"
            class="p-button-primary p-button-lg px-6 py-3 shadow-md"
          />
        </div>

        <!-- Jobs list (card layout) -->
        <div
          v-else
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <div
            v-for="job in project.jobs"
            :key="job.id"
            class="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
          >
            <!-- Job card header -->
            <div class="relative">
              <div class="absolute top-0 right-0 m-3">
                <Tag
                  :value="formatJobStatus(job.status)"
                  :severity="getJobStatusSeverity(job.status)"
                  class="rounded-full px-3 py-1"
                />
              </div>
              <div
                class="p-4 bg-gradient-to-r from-primary-100 via-primary-50 to-transparent border-b border-primary-100"
              >
                <div class="flex items-center">
                  <div class="mr-3 p-3 rounded-lg bg-white shadow-sm">
                    <i
                      :class="getJobTypeIcon(job.jobTitleType)"
                      class="text-primary-600 text-xl"
                    ></i>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h3
                      class="text-lg font-semibold text-gray-900 truncate"
                      v-tooltip="job.title"
                    >
                      {{ job.title }}
                    </h3>
                    <p class="text-sm text-gray-600">
                      {{ getJobTypeName(job.jobTitleType) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Job card content -->
            <div class="p-4">
              <div class="flex items-center mb-3">
                <i class="pi pi-money-bill text-green-500 mr-2"></i>
                <div class="font-medium text-green-700">
                  RM {{ job.salary }}
                </div>
                <div class="text-sm text-gray-500 ml-1">
                  / {{ getSalaryTypeName(job.salaryType) }}
                </div>
              </div>

              <div class="flex justify-between items-center mb-4">
                <div class="flex items-center">
                  <div
                    class="bg-blue-50 px-3 py-1 rounded-full flex items-center justify-center"
                  >
                    <i class="pi pi-users text-blue-500 mr-2"></i>
                    <span class="text-blue-700 font-medium text-center">{{
                      jobApplicantCounts.get(job.id) || 0
                    }}</span>
                  </div>
                </div>

                <div class="flex flex-col items-end">
                  <div class="text-xs text-gray-500">Created on</div>
                  <div class="text-sm font-medium">
                    {{ formatShortDate(job.createdAt) }}
                  </div>
                </div>
              </div>

              <!-- Action buttons -->
              <div
                class="flex justify-between items-center border-t border-gray-100 pt-4 mt-2"
              >
                <Button
                  icon="pi pi-eye"
                  label="View"
                  class="p-button-text flex-1 mr-1"
                  @click="viewJobDetails(job)"
                />
                <Button
                  v-if="!isDeletedProject"
                  icon="pi pi-pencil"
                  label="Edit"
                  class="p-button-outlined p-button-secondary flex-1 mx-1"
                  @click="editJob(job)"
                />
                <div class="relative">
                  <Button
                    v-if="!isDeletedProject"
                    icon="pi pi-users"
                    label=""
                    class="p-button-outlined p-button-primary ml-1 applicants-btn"
                    @click="viewJobApplicants(job)"
                    v-tooltip="'View Applicants'"
                  />
                  <span class="custom-badge">{{
                    jobApplicantCounts.get(job.id) || 0
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Custom trash confirmation dialog -->
    <ConfirmTrashDialog
      v-model:visible="showTrashDialog"
      :title="'Move to Trash'"
      :message="trashDialogMessage"
      @confirm="onConfirmTrash"
      @cancel="onCancelTrash"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { format } from 'date-fns';
import axios from 'axios';

// PrimeVue components
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import Badge from 'primevue/badge';
import ProgressSpinner from 'primevue/progressspinner';
import ConfirmTrashDialog from '@/components/shared/ConfirmTrashDialog.vue';

const router = useRouter();
const route = useRoute();
const toast = useToast();

// State
const project = ref(null);
const loading = ref(true);
const projectStats = ref(null);
const jobSchedules = ref([]);
const jobApplicantCounts = ref(new Map());
const showTrashDialog = ref(false);
const trashDialogMessage = ref('');

// Check if project is from trash (read-only mode)
const isDeletedProject = computed(() => {
  return route.query.readOnly === 'true' && route.query.deleted === 'true';
});

// Format job status for display
const formatJobStatus = (status) => {
  const statusMap = {
    active: 'Active',
    draft: 'Draft',
    closed: 'Closed',
    paused: 'Paused',
    completed: 'Completed',
    OPEN: 'Open',
    CLOSED: 'Closed',
    FILLED: 'Filled',
    CANCELLED: 'Cancelled',
  };
  return statusMap[status] || status;
};

// Job status indicator
const getJobStatusSeverity = (status) => {
  const severities = {
    active: 'success',
    draft: 'info',
    closed: 'secondary',
    paused: 'warning',
    completed: 'secondary',
    OPEN: 'success',
    CLOSED: 'secondary',
    FILLED: 'info',
    CANCELLED: 'danger',
  };
  return severities[status] || 'info';
};

// Format short date for display
const formatShortDate = (date) => {
  if (!date) return 'N/A';
  return format(new Date(date), 'dd MMM yyyy');
};

// Get job type name
const getJobTypeName = (type) => {
  if (!type) return 'Other';

  const jobTypeMap = {
    PROMOTER: 'Promoter',
    SUPERVISOR: 'Supervisor',
    SETUP_CREW: 'Setup Crew',
    MASCOT_CREW: 'Mascot Crew',
    BRAND_AMBASSADOR: 'Brand Ambassador',
    EVENT_CREW: 'Event Crew',
    USHER: 'Usher',
    OTHER: 'Other',
  };

  return jobTypeMap[type] || 'Other';
};

// Get icon for job type
const getJobTypeIcon = (type) => {
  if (!type) return 'pi pi-briefcase';

  const iconMap = {
    PROMOTER: 'pi pi-shopping-bag',
    SUPERVISOR: 'pi pi-id-card',
    SETUP_CREW: 'pi pi-wrench',
    MASCOT_CREW: 'pi pi-star',
    BRAND_AMBASSADOR: 'pi pi-megaphone',
    EVENT_CREW: 'pi pi-calendar-plus',
    USHER: 'pi pi-user',
    OTHER: 'pi pi-briefcase',
  };

  return iconMap[type] || 'pi pi-briefcase';
};

// Get salary type name
const getSalaryTypeName = (type) => {
  if (!type) return 'fixed';

  const salaryTypeMap = {
    PER_HOUR: 'hour',
    PER_DAY: 'day',
    PER_EVENT: 'event',
    FIXED: 'fixed',
    COMMISSION: 'commission',
    NEGOTIABLE: 'negotiable',
  };

  return salaryTypeMap[type] || 'fixed';
};

// Get total applicants
const getTotalApplicants = () => {
  if (!project.value || !project.value.jobs) return 0;
  return project.value.jobs.reduce(
    (total, job) => total + (job.applicantsCount || 0),
    0
  );
};

// Date formatter
const formatDate = (date) => {
  if (!date) return 'N/A';
  return format(new Date(date), 'dd MMM yyyy');
};

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('accessToken');
};

// API CALLS FOR JOB MANAGEMENT

// Create a new job
const createJob = async (jobData) => {
  try {
    const token = getAuthToken();
    const response = await axios.post(
      'http://localhost:8080/api/jobs',
      jobData,
      {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data && response.data.statusCode === 201) {
      toast.add({
        severity: 'success',
        summary: 'Job Created',
        detail: `Job "${jobData.title}" has been created successfully`,
        life: 3000,
      });
      fetchProjectJobs();
      return response.data.data;
    }
  } catch (error) {
    console.error('Error creating job:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: `Failed to create job: ${
        error.response?.data?.message || 'Unknown error'
      }`,
      life: 3000,
    });
    return null;
  }
};

// Get job by ID
const getJobById = async (jobId) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(
      `http://localhost:8080/api/jobs/${jobId}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    if (response.data && response.data.statusCode === 200) {
      return response.data.data;
    }
  } catch (error) {
    console.error(`Error fetching job ${jobId}:`, error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: `Failed to fetch job details: ${
        error.response?.data?.message || 'Unknown error'
      }`,
      life: 3000,
    });
    return null;
  }
};

// Get jobs by project ID
const getJobsByProjectId = async (projectId) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(
      `http://localhost:8080/api/jobs/project/${projectId}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    if (response.data && response.data.statusCode === 200) {
      return response.data.data;
    }
  } catch (error) {
    console.error(`Error fetching jobs for project ${projectId}:`, error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: `Failed to fetch jobs: ${
        error.response?.data?.message || 'Unknown error'
      }`,
      life: 3000,
    });
    return [];
  }
};

// Get all jobs for current recruiter
const getAllJobs = async () => {
  try {
    const token = getAuthToken();
    const response = await axios.get(`http://localhost:8080/api/jobs`, {
      headers: {
        Authorization: token,
      },
    });

    if (response.data && response.data.statusCode === 200) {
      return response.data.data;
    }
  } catch (error) {
    console.error('Error fetching all jobs:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: `Failed to fetch jobs: ${
        error.response?.data?.message || 'Unknown error'
      }`,
      life: 3000,
    });
    return [];
  }
};

// Change job status
const changeJobStatus = async (jobId, newStatus) => {
  try {
    const token = getAuthToken();
    const response = await axios.put(
      `http://localhost:8080/api/jobs/${jobId}/status`,
      { newStatus },
      {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data && response.data.statusCode === 200) {
      toast.add({
        severity: 'success',
        summary: 'Status Updated',
        detail: `Job status changed to ${formatJobStatus(newStatus)}`,
        life: 3000,
      });
      fetchProjectJobs();
      return response.data.data;
    }
  } catch (error) {
    console.error(`Error changing job status for job ${jobId}:`, error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: `Failed to update job status: ${
        error.response?.data?.message || 'Unknown error'
      }`,
      life: 3000,
    });
    return null;
  }
};

// JOB SCHEDULE API CALLS

// Create job schedule
const createJobSchedule = async (scheduleData) => {
  try {
    const token = getAuthToken();
    const response = await axios.post(
      'http://localhost:8080/api/job-schedules',
      scheduleData,
      {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data && response.data.statusCode === 201) {
      toast.add({
        severity: 'success',
        summary: 'Schedule Created',
        detail: 'Job schedule has been created successfully',
        life: 3000,
      });
      return response.data.data;
    }
  } catch (error) {
    console.error('Error creating job schedule:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: `Failed to create job schedule: ${
        error.response?.data?.message || 'Unknown error'
      }`,
      life: 3000,
    });
    return null;
  }
};

// Get job schedules by job ID
const getJobSchedulesByJobId = async (jobId) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(
      `http://localhost:8080/api/job-schedules/job/${jobId}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    if (response.data && response.data.statusCode === 200) {
      return response.data.data;
    }
  } catch (error) {
    console.error(`Error fetching schedules for job ${jobId}:`, error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: `Failed to fetch job schedules: ${
        error.response?.data?.message || 'Unknown error'
      }`,
      life: 3000,
    });
    return [];
  }
};

// Get job schedule by ID
const getJobScheduleById = async (scheduleId) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(
      `http://localhost:8080/api/job-schedules/${scheduleId}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    if (response.data && response.data.statusCode === 200) {
      return response.data.data;
    }
  } catch (error) {
    console.error(`Error fetching schedule ${scheduleId}:`, error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: `Failed to fetch schedule details: ${
        error.response?.data?.message || 'Unknown error'
      }`,
      life: 3000,
    });
    return null;
  }
};

// Update job schedule
const updateJobSchedule = async (scheduleId, scheduleData) => {
  try {
    const token = getAuthToken();
    const response = await axios.put(
      `http://localhost:8080/api/job-schedules/${scheduleId}`,
      scheduleData,
      {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data && response.data.statusCode === 200) {
      toast.add({
        severity: 'success',
        summary: 'Schedule Updated',
        detail: 'Job schedule has been updated successfully',
        life: 3000,
      });
      return response.data.data;
    }
  } catch (error) {
    console.error(`Error updating schedule ${scheduleId}:`, error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: `Failed to update job schedule: ${
        error.response?.data?.message || 'Unknown error'
      }`,
      life: 3000,
    });
    return null;
  }
};

// Delete job schedule
const deleteJobSchedule = async (scheduleId) => {
  try {
    const token = getAuthToken();
    const response = await axios.delete(
      `http://localhost:8080/api/job-schedules/${scheduleId}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    if (response.data && response.data.statusCode === 200) {
      toast.add({
        severity: 'success',
        summary: 'Schedule Deleted',
        detail: 'Job schedule has been deleted successfully',
        life: 3000,
      });
      return true;
    }
  } catch (error) {
    console.error(`Error deleting schedule ${scheduleId}:`, error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: `Failed to delete job schedule: ${
        error.response?.data?.message || 'Unknown error'
      }`,
      life: 3000,
    });
    return false;
  }
};

// Find job schedules in date range
const findJobSchedulesInDateRange = async (startDate, endDate) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(
      `http://localhost:8080/api/job-schedules/date-range?startDate=${startDate}&endDate=${endDate}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    if (response.data && response.data.statusCode === 200) {
      return response.data.data;
    }
  } catch (error) {
    console.error(`Error fetching schedules in date range:`, error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: `Failed to fetch schedules: ${
        error.response?.data?.message || 'Unknown error'
      }`,
      life: 3000,
    });
    return [];
  }
};

// Get available positions for a schedule
const getAvailablePositions = async (scheduleId) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(
      `http://localhost:8080/api/job-schedules/${scheduleId}/available-positions`,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    if (response.data && response.data.statusCode === 200) {
      return response.data.data;
    }
  } catch (error) {
    console.error(
      `Error fetching available positions for schedule ${scheduleId}:`,
      error
    );
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: `Failed to fetch available positions: ${
        error.response?.data?.message || 'Unknown error'
      }`,
      life: 3000,
    });
    return 0;
  }
};

// Navigation
const goBackToProjects = () => {
  router.push({ name: 'ManageJobs' });
};

const navigateToCreateJob = () => {
  if (isDeletedProject.value) return;

  router.push({
    name: 'CreateJob',
    query: {
      projectId: project.value.id,
      projectName: project.value.name,
    },
  });
};

// Job actions
const viewJobDetails = (job) => {
  router.push({
    name: 'JobDetails',
    params: { jobId: job.id },
    query: { projectId: project.value.id },
  });
};

const editJob = (job) => {
  if (isDeletedProject.value) return;

  router.push({
    name: 'EditJob',
    params: { jobId: job.id },
    query: { projectId: project.value.id },
  });
};

const viewJobApplicants = (job) => {
  if (isDeletedProject.value) return;

  router.push({
    name: 'JobApplicants',
    params: { jobId: job.id },
    query: { projectId: project.value.id },
  });
};

// Fetch project data
const fetchProjectData = async () => {
  loading.value = true;

  try {
    const token = getAuthToken();
    const projectId = route.params.projectId;

    // Fetch project details
    const response = await axios.get(
      `http://localhost:8080/api/projects/${projectId}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    if (response.data && response.data.statusCode === 200) {
      project.value = response.data.data;

      // Fetch project statistics
      const statsResponse = await axios.get(
        `http://localhost:8080/api/projects/${projectId}/statistics`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (statsResponse.data && statsResponse.data.statusCode === 200) {
        projectStats.value = statsResponse.data.data;
      } else {
        console.error(
          'Failed to fetch project statistics:',
          statsResponse.data
        );
      }

      // Fetch project jobs
      await fetchProjectJobs();
    } else {
      toast.add({
        severity: 'error',
        summary: 'Project Not Found',
        detail: 'The requested project could not be found',
        life: 3000,
      });
      router.push({ name: 'ManageJobs' });
    }
  } catch (error) {
    console.error('Error fetching project data:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'An error occurred while fetching project data',
      life: 3000,
    });
    router.push({ name: 'ManageJobs' });
  } finally {
    loading.value = false;
  }
};

// Fetch jobs for the current project
const fetchProjectJobs = async () => {
  try {
    const projectId = route.params.projectId;
    const jobs = await getJobsByProjectId(projectId);

    if (jobs && Array.isArray(jobs)) {
      // Update the project's jobs array
      if (project.value) {
        project.value.jobs = jobs;
        // Fetch applicant counts for each job
        for (const job of jobs) {
          await fetchJobApplicantCount(job.id);
        }
      }
    }
  } catch (error) {
    console.error('Error fetching project jobs:', error);
  }
};

// Get remaining positions to fill
const getRemainingPositions = () => {
  if (!projectStats.value) return 0;
  return (
    projectStats.value.totalPositionsNeeded -
    projectStats.value.totalPositionsFilled
  );
};

// Add this computed property in the script section, after the other computed properties
const calculateProgress = computed(() => {
  if (!projectStats.value?.totalPositionsNeeded) return 0;
  const filled =
    projectStats.value.totalPositionsNeeded - getRemainingPositions();
  const progress = (filled / projectStats.value.totalPositionsNeeded) * 100;
  return Math.round(progress);
});

// Add new function to fetch applicant count for a job
const fetchJobApplicantCount = async (jobId) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(
      `http://localhost:8080/api/recruiters/jobs/${jobId}/applicants/count`,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    if (response.data && response.data.statusCode === 200) {
      jobApplicantCounts.value.set(jobId, response.data.data);
    }
  } catch (error) {
    console.error(`Error fetching applicant count for job ${jobId}:`, error);
  }
};

// Add the following functions near the bottom of the script
const onConfirmTrash = () => {
  // Handle the confirmed trash action
  // You'll need to implement the actual deletion/trash logic here
  const projectId = route.params.projectId;
  const projectName = project.value?.name || '';

  trashProject(projectId, projectName);
};

const onCancelTrash = () => {
  // Handle cancellation - just close the dialog
  showTrashDialog.value = false;
};

const trashProject = async (projectId, projectName) => {
  try {
    const token = localStorage.getItem('accessToken');

    const response = await axios.delete(
      `http://localhost:8080/api/projects/${projectId}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    if (response.data.statusCode === 200) {
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: `Project "${projectName}" has been moved to trash`,
        life: 3000,
      });

      // Navigate back to the projects page
      router.push({ name: 'ManageJobs' });
    } else {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: response.data.message || 'Failed to move project to trash',
        life: 3000,
      });
    }
  } catch (error) {
    console.error('Error moving project to trash:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'An error occurred while moving project to trash',
      life: 3000,
    });
  }
};

// Add the confirmTrashProject function:
const confirmTrashProject = () => {
  trashDialogMessage.value = `Are you sure you want to move the project "${project.value?.name}" to trash? This action cannot be undone.`;
  showTrashDialog.value = true;
};

onMounted(() => {
  fetchProjectData();
});
</script>

<style scoped>
:deep(.p-button) {
  border-radius: 8px;
  font-weight: 500;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
  background: #f8fafc;
  color: #475569;
  font-weight: 600;
}

:deep(.p-tag) {
  border-radius: 4px;
  padding: 0.3rem 0.6rem;
}

/* Job card styles */
.rounded-xl {
  border-radius: 0.75rem;
}

:deep(.p-button.p-button-outlined) {
  border-width: 1px;
}

:deep(.p-button.p-button-text) {
  background-color: transparent;
  color: var(--primary-color);
}

:deep(.p-button.p-button-text:hover) {
  background-color: var(--primary-50);
  color: var(--primary-700);
}

:deep(.p-button.p-button-sm) {
  padding: 0.4rem 0.8rem;
  font-size: 0.875rem;
}

:deep(.p-badge) {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
}

/* Fix for applicants count badge alignment */
:deep(.applicants-btn .p-badge) {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 1.5rem;
  height: 1.5rem;
  padding: 0;
  margin-left: 0.25rem;
  line-height: 1;
}

.custom-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--blue-500);
  color: white;
  border-radius: 50%;
  min-width: 1.5rem;
  height: 1.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  position: absolute;
  top: -0.5rem;
  right: -0.5rem;
  padding: 0 0.25rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  line-height: 1;
}

/* Transitions */
.transition-shadow {
  transition-property: box-shadow;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

.hover\:shadow-md:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Card layout improvements */
:deep(.p-tag) {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.7rem;
  letter-spacing: 0.5px;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .grid-cols-1 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
}
</style>
