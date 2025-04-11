<template>
  <div class="p-6">
    <!-- Back button and header -->
    <div class="mb-6">
      <div class="flex items-center">
        <Button
          icon="pi pi-arrow-left"
          class="p-button-text p-button-rounded mr-2"
          @click="goBack"
        />
        <div>
          <h1 class="text-2xl font-bold text-gray-900 mb-1">
            {{ job?.title || 'Job Details' }}
          </h1>
          <div class="flex items-center text-gray-600">
            <i class="pi pi-folder text-primary-500 mr-2"></i>
            <span>{{ projectName }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading" class="text-center py-8">
      <ProgressSpinner
        style="width: 50px; height: 50px"
        strokeWidth="8"
        fill="var(--surface-ground)"
        animationDuration=".5s"
      />
      <p class="mt-4 text-gray-600">Loading job details...</p>
    </div>

    <div v-else-if="!job" class="text-center py-12">
      <div
        class="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6"
      >
        <i class="pi pi-exclamation-circle text-gray-400 text-3xl"></i>
      </div>
      <h3 class="text-xl font-medium text-gray-700 mb-3">Job Not Found</h3>
      <p class="text-gray-500 mb-6 max-w-md mx-auto">
        The job you're looking for does not exist or has been deleted
      </p>
      <Button
        label="Go Back"
        icon="pi pi-arrow-left"
        @click="goBack"
        class="p-button-primary px-4 py-2"
      />
    </div>

    <div v-else class="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <!-- Main Job Details -->
      <div class="col-span-1 xl:col-span-2">
        <!-- Main job details card -->
        <div class="bg-white rounded-lg shadow mb-6 overflow-hidden">
          <div
            class="bg-gradient-to-r from-primary-500 to-primary-700 h-12 flex items-center justify-between px-4"
          >
            <span class="text-white font-medium">Job Information</span>
            <Tag
              :value="formatJobStatus(job.status)"
              :severity="getJobStatusSeverity(job.status)"
            />
          </div>
          <div class="p-6">
            <!-- Job title and type -->
            <div class="flex items-start justify-between mb-6">
              <div>
                <h2 class="text-xl font-bold text-gray-900">{{ job.title }}</h2>
                <Badge
                  :value="formatJobTitleType(job.jobTitleType)"
                  class="mt-2"
                  severity="info"
                />
              </div>
              <div>
                <Tag
                  v-if="job.status === 'DRAFT'"
                  class="px-3 py-2"
                  icon="pi pi-exclamation-triangle"
                  severity="warning"
                  value="Draft Mode"
                />
              </div>
            </div>

            <!-- Salary information -->
            <div class="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 class="text-lg font-semibold text-gray-800 mb-3">
                <i class="pi pi-money-bill text-primary-500 mr-2"></i>
                Compensation
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p class="text-sm text-gray-500 mb-1">Salary</p>
                  <div class="flex items-center">
                    <span class="text-2xl font-bold text-primary-700"
                      >RM {{ job.salary }}</span
                    >
                    <span class="text-gray-600 ml-2">{{
                      formatSalaryType(job.salaryType)
                    }}</span>
                  </div>
                </div>
                <div v-if="job.paymentTerms">
                  <p class="text-sm text-gray-500 mb-1">Payment Terms</p>
                  <p class="text-gray-700">{{ job.paymentTerms }}</p>
                </div>
              </div>
              <div v-if="job.benefits" class="mt-4">
                <p class="text-sm text-gray-500 mb-1">Benefits</p>
                <p class="text-gray-700">{{ job.benefits }}</p>
              </div>
            </div>

            <!-- Job scope section -->
            <div class="mb-6">
              <h3 class="text-lg font-semibold text-gray-800 mb-3">
                <i class="pi pi-list text-primary-500 mr-2"></i>
                Job Scope
              </h3>
              <div
                class="whitespace-pre-line text-gray-700 bg-white p-3 rounded-lg border border-gray-200"
              >
                {{ job.jobScope }}
              </div>
            </div>

            <!-- Requirements section -->
            <div class="mb-6">
              <h3 class="text-lg font-semibold text-gray-800 mb-3">
                <i class="pi pi-check-square text-primary-500 mr-2"></i>
                Requirements
              </h3>
              <div
                class="whitespace-pre-line text-gray-700 bg-white p-3 rounded-lg border border-gray-200"
              >
                {{ job.requirements }}
              </div>
            </div>
          </div>
        </div>

        <!-- Working Schedule Card - For future implementation -->
        <div class="bg-white rounded-lg shadow mb-6 overflow-hidden">
          <div
            class="bg-gradient-to-r from-primary-500 to-primary-700 h-12 flex items-center px-4"
          >
            <span class="text-white font-medium">Working Schedule</span>
          </div>
          <div class="p-6 text-center py-8">
            <i class="pi pi-calendar text-6xl text-gray-300 mb-4"></i>
            <h3 class="text-xl font-medium text-gray-700 mb-2">Coming Soon</h3>
            <p class="text-gray-500 mb-4">
              Working schedule information will be implemented in a future
              update
            </p>
          </div>
        </div>
      </div>

      <!-- Sidebar Information -->
      <div class="col-span-1">
        <!-- Actions Card -->
        <div class="bg-white rounded-lg shadow mb-6 overflow-hidden">
          <div
            class="bg-gradient-to-r from-primary-500 to-primary-700 h-12 flex items-center px-4"
          >
            <span class="text-white font-medium">Actions</span>
          </div>
          <div class="p-4">
            <div class="flex flex-col gap-3">
              <Button
                label="Edit Job Details"
                icon="pi pi-pencil"
                class="p-button-outlined w-full justify-content-start"
                @click="editJob"
              />
              <Button
                label="View Applicants"
                icon="pi pi-users"
                class="p-button-outlined w-full justify-content-start"
                @click="viewApplicants"
                badge="0"
                badgeClass="p-badge-info"
              />
              <Button
                v-if="job.status === 'DRAFT'"
                label="Publish Job"
                icon="pi pi-check-circle"
                class="p-button-success w-full justify-content-start mt-2"
                @click="publishJob"
              />
              <Button
                v-else-if="job.status === 'OPEN'"
                label="Close Job"
                icon="pi pi-ban"
                class="p-button-danger w-full justify-content-start mt-2"
                @click="closeJob"
              />
              <Button
                v-else-if="job.status === 'CLOSED'"
                label="Reopen Job"
                icon="pi pi-refresh"
                class="p-button-warning w-full justify-content-start mt-2"
                @click="reopenJob"
              />
            </div>
          </div>
        </div>

        <!-- Job Stats Card -->
        <div class="bg-white rounded-lg shadow mb-6 overflow-hidden">
          <div
            class="bg-gradient-to-r from-primary-500 to-primary-700 h-12 flex items-center px-4"
          >
            <span class="text-white font-medium">Job Statistics</span>
          </div>
          <div class="p-4">
            <div class="flex items-center justify-between p-3 border-b">
              <div class="flex items-center">
                <i class="pi pi-users text-blue-500 mr-2"></i>
                <span class="text-gray-700">Total Applicants</span>
              </div>
              <Badge :value="job.applicantsCount || 0" severity="info" />
            </div>
            <div class="flex items-center justify-between p-3 border-b">
              <div class="flex items-center">
                <i class="pi pi-eye text-green-500 mr-2"></i>
                <span class="text-gray-700">Job Views</span>
              </div>
              <Badge value="0" severity="success" />
            </div>
            <div class="flex items-center justify-between p-3">
              <div class="flex items-center">
                <i class="pi pi-calendar text-orange-500 mr-2"></i>
                <span class="text-gray-700">Created</span>
              </div>
              <span class="text-gray-600">{{ formatDate(job.createdAt) }}</span>
            </div>
          </div>
        </div>

        <!-- Project Info Card -->
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div
            class="bg-gradient-to-r from-primary-500 to-primary-700 h-12 flex items-center px-4"
          >
            <span class="text-white font-medium">Project Information</span>
          </div>
          <div class="p-4">
            <div v-if="loading" class="text-center py-4">
              <ProgressSpinner
                style="width: 30px; height: 30px"
                strokeWidth="8"
              />
            </div>
            <div v-else>
              <div class="flex items-center justify-between p-3 border-b">
                <div class="flex items-center">
                  <i class="pi pi-folder text-blue-500 mr-2"></i>
                  <span class="text-gray-700">Project</span>
                </div>
                <span class="text-gray-600">{{ projectName }}</span>
              </div>
              <div class="flex items-center justify-between p-3 border-b">
                <div class="flex items-center">
                  <i class="pi pi-briefcase text-green-500 mr-2"></i>
                  <span class="text-gray-700">Total Jobs</span>
                </div>
                <Badge
                  :value="projectStats?.totalJobs || 0"
                  severity="success"
                />
              </div>
              <div class="flex items-center justify-between p-3">
                <div class="flex items-center">
                  <i class="pi pi-map-marker text-orange-500 mr-2"></i>
                  <span class="text-gray-700">Locations</span>
                </div>
                <Badge
                  :value="projectStats?.totalUniqueLocations || 0"
                  severity="warning"
                />
              </div>
              <div class="p-3 pt-2">
                <Button
                  label="View Project"
                  icon="pi pi-external-link"
                  class="p-button-text p-button-sm w-full justify-content-center"
                  @click="viewProject"
                />
              </div>
            </div>
          </div>
        </div>
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
import Tag from 'primevue/tag';
import Badge from 'primevue/badge';
import ProgressSpinner from 'primevue/progressspinner';

const router = useRouter();
const route = useRoute();
const toast = useToast();

// State
const job = ref(null);
const loading = ref(true);
const projectName = ref('');
const projectStats = ref(null);

// Format job status for display
const formatJobStatus = (status) => {
  const statusMap = {
    DRAFT: 'Draft',
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
    DRAFT: 'info',
    OPEN: 'success',
    CLOSED: 'secondary',
    FILLED: 'info',
    CANCELLED: 'danger',
  };
  return severities[status] || 'info';
};

// Format job title type
const formatJobTitleType = (type) => {
  const typeMap = {
    PROMOTER: 'Promoter',
    SUPERVISOR: 'Supervisor',
    SETUP_CREW: 'Setup Crew',
    MASCOT_CREW: 'Mascot Crew',
    BRAND_AMBASSADOR: 'Brand Ambassador',
    EVENT_CREW: 'Event Crew',
    USHER: 'Usher',
    OTHER: 'Other',
  };
  return typeMap[type] || type;
};

// Format salary type
const formatSalaryType = (type) => {
  const typeMap = {
    PER_HOUR: 'per hour',
    PER_DAY: 'per day',
    PER_EVENT: 'per event',
    FIXED: 'fixed',
    COMMISSION: 'commission-based',
    NEGOTIABLE: 'negotiable',
  };
  return typeMap[type] || type;
};

// Format date
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return format(new Date(dateString), 'dd MMM yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

// Navigation
const goBack = () => {
  if (route.query.projectId) {
    router.push({
      name: 'ProjectDetails',
      params: { projectId: route.query.projectId },
    });
  } else {
    router.push({ name: 'ManageJobs' });
  }
};

// Action handlers
const editJob = () => {
  router.push({
    name: 'EditJob', // This route needs to be created
    params: { jobId: job.value.id },
    query: { projectId: route.query.projectId },
  });
};

const viewApplicants = () => {
  router.push({
    name: 'JobApplicants', // This route needs to be created
    params: { jobId: job.value.id },
    query: { projectId: route.query.projectId },
  });
};

const publishJob = async () => {
  // Will be implemented to change job status from DRAFT to OPEN
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      toast.add({
        severity: 'error',
        summary: 'Authentication Error',
        detail: 'You are not logged in. Please log in to continue.',
        life: 3000,
      });
      return;
    }

    const response = await axios.patch(
      `http://localhost:8080/api/jobs/${job.value.id}/status`,
      { status: 'OPEN' },
      {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data && response.data.statusCode === 200) {
      job.value.status = 'OPEN';
      toast.add({
        severity: 'success',
        summary: 'Job Published',
        detail: 'The job has been published successfully',
        life: 3000,
      });
    } else {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to publish job',
        life: 3000,
      });
    }
  } catch (error) {
    console.error('Error publishing job:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'An unexpected error occurred',
      life: 3000,
    });
  }
};

const closeJob = async () => {
  // Will be implemented to change job status from OPEN to CLOSED
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      toast.add({
        severity: 'error',
        summary: 'Authentication Error',
        detail: 'You are not logged in. Please log in to continue.',
        life: 3000,
      });
      return;
    }

    const response = await axios.patch(
      `http://localhost:8080/api/jobs/${job.value.id}/status`,
      { status: 'CLOSED' },
      {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data && response.data.statusCode === 200) {
      job.value.status = 'CLOSED';
      toast.add({
        severity: 'success',
        summary: 'Job Closed',
        detail: 'The job has been closed successfully',
        life: 3000,
      });
    } else {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to close job',
        life: 3000,
      });
    }
  } catch (error) {
    console.error('Error closing job:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'An unexpected error occurred',
      life: 3000,
    });
  }
};

const reopenJob = async () => {
  // Will be implemented to change job status from CLOSED to OPEN
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      toast.add({
        severity: 'error',
        summary: 'Authentication Error',
        detail: 'You are not logged in. Please log in to continue.',
        life: 3000,
      });
      return;
    }

    const response = await axios.patch(
      `http://localhost:8080/api/jobs/${job.value.id}/status`,
      { status: 'OPEN' },
      {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data && response.data.statusCode === 200) {
      job.value.status = 'OPEN';
      toast.add({
        severity: 'success',
        summary: 'Job Reopened',
        detail: 'The job has been reopened successfully',
        life: 3000,
      });
    } else {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to reopen job',
        life: 3000,
      });
    }
  } catch (error) {
    console.error('Error reopening job:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'An unexpected error occurred',
      life: 3000,
    });
  }
};

const viewProject = () => {
  if (route.query.projectId) {
    router.push({
      name: 'ProjectDetails',
      params: { projectId: route.query.projectId },
    });
  }
};

// Fetch job data and related information
const fetchJobData = async () => {
  loading.value = true;

  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      toast.add({
        severity: 'error',
        summary: 'Authentication Error',
        detail: 'You are not logged in. Please log in to continue.',
        life: 3000,
      });
      router.push({ name: 'Login' });
      return;
    }

    const jobId = route.params.jobId;

    // Fetch job details
    const response = await axios.get(
      `http://localhost:8080/api/jobs/${jobId}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    if (response.data && response.data.statusCode === 200) {
      job.value = response.data.data;

      // Fetch project information if we have a project ID
      if (job.value.projectId) {
        await fetchProjectInfo(job.value.projectId);
      }
    } else {
      toast.add({
        severity: 'error',
        summary: 'Job Not Found',
        detail: 'The requested job could not be found',
        life: 3000,
      });
    }
  } catch (error) {
    console.error('Error fetching job data:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'An error occurred while fetching job data',
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
};

// Fetch project information
const fetchProjectInfo = async (projectId) => {
  try {
    const token = localStorage.getItem('accessToken');

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
      projectName.value = response.data.data.name;

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
      }
    }
  } catch (error) {
    console.error('Error fetching project info:', error);
  }
};

// Initialize component
onMounted(() => {
  fetchJobData();
});
</script>

<style scoped>
:deep(.p-button) {
  border-radius: 8px;
  font-weight: 500;
}

:deep(.p-tag) {
  border-radius: 4px;
  padding: 0.3rem 0.6rem;
}

.justify-content-start {
  justify-content: flex-start;
}

.justify-content-center {
  justify-content: center;
}

:deep(.p-badge) {
  border-radius: 10px;
  padding: 0.25rem 0.75rem;
}
</style>
