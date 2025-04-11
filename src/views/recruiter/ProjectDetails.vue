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
                  Total Positions
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
                  Positions Filled
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
                  Positions Remaining
                </h3>
                <p class="text-lg font-semibold text-orange-900">
                  {{ getRemainingPositions() }}
                </p>
              </div>
            </div>
          </div>

          <!-- Job Status Summary -->
          <div class="bg-purple-50 p-4 rounded-lg shadow-sm">
            <div class="flex items-center">
              <div class="bg-purple-100 rounded-full p-2 mr-3">
                <i class="pi pi-chart-pie text-purple-700"></i>
              </div>
              <div>
                <h3 class="text-sm font-medium text-purple-700">Job Status</h3>
                <div class="flex gap-2 mt-1">
                  <Badge
                    v-tooltip.top="'Open Jobs'"
                    value="Open"
                    :severity="'success'"
                    class="mr-1"
                  >
                    {{ projectStats?.openJobs || 0 }}
                  </Badge>
                  <Badge
                    v-tooltip.top="'Partially Filled'"
                    value="Partial"
                    :severity="'warning'"
                    class="mr-1"
                  >
                    {{ projectStats?.partiallyFilledJobs || 0 }}
                  </Badge>
                  <Badge
                    v-tooltip.top="'Filled Jobs'"
                    value="Filled"
                    :severity="'info'"
                    class="mr-1"
                  >
                    {{ projectStats?.filledJobs || 0 }}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Jobs Section -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="p-4 border-b flex justify-between items-center bg-gray-50">
        <div class="flex items-center">
          <i class="pi pi-list text-primary-500 mr-2"></i>
          <h2 class="text-lg font-semibold">Jobs in this Project</h2>
        </div>
        <Button
          v-if="!isDeletedProject"
          label="New Job"
          icon="pi pi-plus"
          @click="navigateToCreateJob"
          class="p-button-primary"
        />
      </div>

      <div class="p-6">
        <div v-if="loading" class="text-center py-8">
          <ProgressSpinner
            style="width: 50px; height: 50px"
            strokeWidth="8"
            fill="var(--surface-ground)"
            animationDuration=".5s"
          />
          <p class="mt-4 text-gray-600">Loading project details...</p>
        </div>

        <div
          v-else-if="!project || project.jobs?.length === 0"
          class="text-center py-12"
        >
          <div
            class="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6"
          >
            <i class="pi pi-briefcase text-gray-400 text-3xl"></i>
          </div>
          <h3 class="text-xl font-medium text-gray-700 mb-3">
            No Jobs in this Project Yet
          </h3>
          <p class="text-gray-500 mb-6 max-w-md mx-auto">
            Start creating job listings for this project to begin recruiting
            talent
          </p>
          <Button
            v-if="!isDeletedProject"
            label="Create First Job"
            icon="pi pi-plus"
            @click="navigateToCreateJob"
            class="p-button-primary px-4 py-2"
          />
        </div>

        <DataTable
          v-else
          :value="project.jobs"
          class="p-datatable-sm"
          :rowHover="true"
          stripedRows
          tableStyle="min-width: 50rem"
        >
          <Column field="title" header="Job Title">
            <template #body="{ data }">
              <div class="flex items-center">
                <div
                  class="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center mr-3"
                >
                  <i class="pi pi-briefcase text-primary-700 text-sm"></i>
                </div>
                <span class="font-medium">{{ data.title }}</span>
              </div>
            </template>
          </Column>
          <Column field="salary" header="Salary">
            <template #body="{ data }">
              <div class="flex items-center">
                <i class="pi pi-money-bill text-green-500 mr-2"></i>
                <span>{{ data.salary }}</span>
              </div>
            </template>
          </Column>
          <Column field="status" header="Status">
            <template #body="{ data }">
              <Tag
                :value="formatJobStatus(data.status)"
                :severity="getJobStatusSeverity(data.status)"
              />
            </template>
          </Column>
          <Column field="applicantsCount" header="Applicants">
            <template #body="{ data }">
              <div class="flex items-center">
                <i class="pi pi-users text-blue-500 mr-2"></i>
                <Badge :value="data.applicantsCount || 0" severity="info" />
              </div>
            </template>
          </Column>
          <Column header="Actions" style="width: 12rem">
            <template #body="{ data }">
              <div class="flex gap-2">
                <Button
                  icon="pi pi-eye"
                  class="p-button-text p-button-sm"
                  tooltip="View Details"
                  @click="viewJobDetails(data)"
                />
                <Button
                  v-if="!isDeletedProject"
                  icon="pi pi-pencil"
                  class="p-button-text p-button-sm"
                  tooltip="Edit Job"
                  @click="editJob(data)"
                />
                <Button
                  v-if="!isDeletedProject"
                  icon="pi pi-users"
                  class="p-button-text p-button-sm"
                  tooltip="View Applicants"
                  @click="viewJobApplicants(data)"
                />
              </div>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
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

const router = useRouter();
const route = useRoute();
const toast = useToast();

// State
const project = ref(null);
const loading = ref(true);
const projectStats = ref(null);
const jobSchedules = ref([]);

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
</style>
