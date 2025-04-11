<template>
  <div class="p-6">
    <div class="mb-6">
      <div class="flex items-center">
        <Button
          icon="pi pi-arrow-left"
          class="p-button-text p-button-rounded mr-2"
          @click="goBack"
        />
        <div>
          <h1 class="text-2xl font-bold text-gray-900 mb-1">Job Applicants</h1>
          <div class="flex items-center text-gray-600">
            <i class="pi pi-briefcase text-primary-500 mr-2"></i>
            <span>{{ job?.title || 'Loading job details...' }}</span>
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
      <p class="mt-4 text-gray-600">Loading applicants...</p>
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

    <div v-else>
      <!-- Job Status Card -->
      <div class="bg-white rounded-lg shadow mb-6 overflow-hidden">
        <div
          class="bg-gradient-to-r from-primary-500 to-primary-700 h-12 flex items-center justify-between px-4"
        >
          <span class="text-white font-medium">Job Status</span>
          <Tag
            :value="formatJobStatus(job.status)"
            :severity="getJobStatusSeverity(job.status)"
          />
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="bg-blue-50 p-4 rounded-lg shadow-sm">
              <div class="flex items-center">
                <div class="bg-blue-100 rounded-full p-2 mr-3">
                  <i class="pi pi-users text-blue-700"></i>
                </div>
                <div>
                  <h3 class="text-sm font-medium text-blue-700">
                    Total Applicants
                  </h3>
                  <p class="text-lg font-semibold text-blue-900">
                    {{ applicants.length }}
                  </p>
                </div>
              </div>
            </div>

            <div class="bg-green-50 p-4 rounded-lg shadow-sm">
              <div class="flex items-center">
                <div class="bg-green-100 rounded-full p-2 mr-3">
                  <i class="pi pi-check-circle text-green-700"></i>
                </div>
                <div>
                  <h3 class="text-sm font-medium text-green-700">Approved</h3>
                  <p class="text-lg font-semibold text-green-900">
                    {{ getApprovedCount() }}
                  </p>
                </div>
              </div>
            </div>

            <div class="bg-yellow-50 p-4 rounded-lg shadow-sm">
              <div class="flex items-center">
                <div class="bg-yellow-100 rounded-full p-2 mr-3">
                  <i class="pi pi-clock text-yellow-700"></i>
                </div>
                <div>
                  <h3 class="text-sm font-medium text-yellow-700">Pending</h3>
                  <p class="text-lg font-semibold text-yellow-900">
                    {{ getPendingCount() }}
                  </p>
                </div>
              </div>
            </div>

            <div class="bg-red-50 p-4 rounded-lg shadow-sm">
              <div class="flex items-center">
                <div class="bg-red-100 rounded-full p-2 mr-3">
                  <i class="pi pi-times-circle text-red-700"></i>
                </div>
                <div>
                  <h3 class="text-sm font-medium text-red-700">Rejected</h3>
                  <p class="text-lg font-semibold text-red-900">
                    {{ getRejectedCount() }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Applicant Filters -->
      <div class="bg-white rounded-lg shadow mb-6 overflow-hidden">
        <div class="p-4 border-b flex justify-between items-center bg-gray-50">
          <div class="flex items-center">
            <i class="pi pi-filter text-primary-500 mr-2"></i>
            <h3 class="font-semibold">Filter Applicants</h3>
          </div>
        </div>

        <div class="p-4">
          <div class="flex flex-wrap gap-4">
            <div class="flex-1 min-w-[200px]">
              <label
                for="search"
                class="block text-gray-700 text-sm font-medium mb-1"
              >
                Search
              </label>
              <span class="p-input-icon-left w-full">
                <i class="pi pi-search" />
                <InputText
                  id="search"
                  v-model="filters.search"
                  placeholder="Search by name"
                  class="w-full"
                />
              </span>
            </div>

            <div class="flex-1 min-w-[200px]">
              <label
                for="status"
                class="block text-gray-700 text-sm font-medium mb-1"
              >
                Status
              </label>
              <Dropdown
                id="status"
                v-model="filters.status"
                :options="statusOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="All Statuses"
                class="w-full"
              />
            </div>

            <div class="flex-1 min-w-[200px]">
              <label
                for="dateSort"
                class="block text-gray-700 text-sm font-medium mb-1"
              >
                Sort By
              </label>
              <Dropdown
                id="dateSort"
                v-model="filters.sort"
                :options="sortOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Sort By"
                class="w-full"
              />
            </div>

            <div class="flex items-end">
              <Button
                label="Clear Filters"
                icon="pi pi-filter-slash"
                class="p-button-outlined p-button-secondary"
                @click="clearFilters"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Applicants List -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div
          class="bg-gradient-to-r from-primary-500 to-primary-700 h-12 flex items-center px-4"
        >
          <span class="text-white font-medium">Applicants</span>
        </div>

        <div v-if="filteredApplicants.length === 0" class="text-center py-12">
          <div
            class="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6"
          >
            <i class="pi pi-search text-gray-400 text-3xl"></i>
          </div>
          <h3 class="text-xl font-medium text-gray-700 mb-3">
            No Applicants Found
          </h3>
          <p class="text-gray-500 mb-6 max-w-md mx-auto">
            There are no applicants for this job listing yet{{
              filters.status !== '' || filters.search !== ''
                ? ' matching your filters'
                : ''
            }}
          </p>
          <Button
            v-if="filters.status !== '' || filters.search !== ''"
            label="Clear Filters"
            icon="pi pi-filter-slash"
            class="p-button-outlined p-button-secondary"
            @click="clearFilters"
          />
        </div>

        <div v-else class="p-4">
          <DataTable
            :value="filteredApplicants"
            class="p-datatable-sm"
            :rowHover="true"
            paginator
            :rows="10"
            :rowsPerPageOptions="[10, 20, 50]"
            stripedRows
            tableStyle="min-width: 50rem"
          >
            <Column field="candidate.name" header="Candidate">
              <template #body="{ data }">
                <div class="flex items-center">
                  <div
                    v-if="data.candidate.avatar"
                    class="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mr-3 overflow-hidden"
                  >
                    <img
                      :src="data.candidate.avatar"
                      class="w-full h-full object-cover"
                    />
                  </div>
                  <div
                    v-else
                    class="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mr-3"
                  >
                    <i class="pi pi-user text-primary-700"></i>
                  </div>
                  <div>
                    <div class="font-medium">{{ data.candidate.name }}</div>
                    <div class="text-sm text-gray-500">
                      {{ data.candidate.email }}
                    </div>
                  </div>
                </div>
              </template>
            </Column>

            <Column field="appliedAt" header="Applied On">
              <template #body="{ data }">
                <div class="flex items-center">
                  <i class="pi pi-calendar text-blue-500 mr-2"></i>
                  <span>{{ formatDate(data.appliedAt) }}</span>
                </div>
              </template>
            </Column>

            <Column field="status" header="Status">
              <template #body="{ data }">
                <Tag
                  :value="formatApplicationStatus(data.status)"
                  :severity="getApplicationStatusSeverity(data.status)"
                />
              </template>
            </Column>

            <Column field="matchPercentage" header="Match" style="width: 10rem">
              <template #body="{ data }">
                <div class="flex flex-col">
                  <ProgressBar
                    :value="data.matchPercentage || 0"
                    :class="getMatchColor(data.matchPercentage)"
                    style="height: 0.5rem"
                  />
                  <div class="text-xs mt-1 text-right">
                    {{ data.matchPercentage || 0 }}% match
                  </div>
                </div>
              </template>
            </Column>

            <Column header="Actions" style="width: 15rem">
              <template #body="{ data }">
                <div class="flex gap-2">
                  <Button
                    icon="pi pi-eye"
                    class="p-button-sm p-button-outlined"
                    tooltip="View Profile"
                    @click="viewCandidateProfile(data.candidate.id)"
                  />
                  <Button
                    v-if="data.status === 'PENDING'"
                    icon="pi pi-check"
                    class="p-button-sm p-button-success p-button-outlined"
                    tooltip="Approve"
                    @click="updateApplicationStatus(data.id, 'APPROVED')"
                  />
                  <Button
                    v-if="data.status === 'PENDING'"
                    icon="pi pi-times"
                    class="p-button-sm p-button-danger p-button-outlined"
                    tooltip="Reject"
                    @click="updateApplicationStatus(data.id, 'REJECTED')"
                  />
                  <Button
                    v-if="
                      data.status === 'APPROVED' || data.status === 'REJECTED'
                    "
                    icon="pi pi-undo"
                    class="p-button-sm p-button-warning p-button-outlined"
                    tooltip="Reset Status"
                    @click="updateApplicationStatus(data.id, 'PENDING')"
                  />
                </div>
              </template>
            </Column>
          </DataTable>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { format } from 'date-fns';
import axios from 'axios';

// PrimeVue components
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import ProgressBar from 'primevue/progressbar';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import ProgressSpinner from 'primevue/progressspinner';

const router = useRouter();
const route = useRoute();
const toast = useToast();

// State
const job = ref(null);
const applicants = ref([]);
const loading = ref(true);

// Mock data - will be replaced with actual API data
const generateMockApplicants = () => {
  return [
    {
      id: 1,
      candidate: {
        id: 101,
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        avatar: null,
      },
      appliedAt: '2023-04-15T10:30:00',
      status: 'APPROVED',
      matchPercentage: 85,
    },
    {
      id: 2,
      candidate: {
        id: 102,
        name: 'John Doe',
        email: 'john.doe@example.com',
        avatar: null,
      },
      appliedAt: '2023-04-16T14:45:00',
      status: 'PENDING',
      matchPercentage: 65,
    },
    {
      id: 3,
      candidate: {
        id: 103,
        name: 'Sarah Johnson',
        email: 'sarah.j@example.com',
        avatar: null,
      },
      appliedAt: '2023-04-17T09:20:00',
      status: 'REJECTED',
      matchPercentage: 40,
    },
    {
      id: 4,
      candidate: {
        id: 104,
        name: 'Michael Brown',
        email: 'michael.b@example.com',
        avatar: null,
      },
      appliedAt: '2023-04-18T11:15:00',
      status: 'PENDING',
      matchPercentage: 75,
    },
  ];
};

// Filters
const filters = reactive({
  search: '',
  status: '',
  sort: 'newest',
});

// Filter options
const statusOptions = [
  { label: 'All Statuses', value: '' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Approved', value: 'APPROVED' },
  { label: 'Rejected', value: 'REJECTED' },
];

const sortOptions = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Oldest First', value: 'oldest' },
  { label: 'Highest Match', value: 'highMatch' },
  { label: 'Lowest Match', value: 'lowMatch' },
];

// Navigate back to job details page
const goBack = () => {
  router.push({
    name: 'JobDetails',
    params: { jobId: route.params.jobId },
    query: { projectId: route.query.projectId },
  });
};

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

// Format application status
const formatApplicationStatus = (status) => {
  const statusMap = {
    PENDING: 'Pending',
    APPROVED: 'Approved',
    REJECTED: 'Rejected',
    WITHDRAWN: 'Withdrawn',
  };
  return statusMap[status] || status;
};

// Application status indicator
const getApplicationStatusSeverity = (status) => {
  const severities = {
    PENDING: 'warning',
    APPROVED: 'success',
    REJECTED: 'danger',
    WITHDRAWN: 'info',
  };
  return severities[status] || 'info';
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

// Get color for match percentage
const getMatchColor = (percentage) => {
  if (!percentage) return '';
  if (percentage >= 80) return 'bg-green-500';
  if (percentage >= 60) return 'bg-blue-500';
  if (percentage >= 40) return 'bg-yellow-500';
  return 'bg-red-500';
};

// Get count by status
const getApprovedCount = () => {
  return applicants.value.filter((a) => a.status === 'APPROVED').length;
};

const getPendingCount = () => {
  return applicants.value.filter((a) => a.status === 'PENDING').length;
};

const getRejectedCount = () => {
  return applicants.value.filter((a) => a.status === 'REJECTED').length;
};

// Clear filters
const clearFilters = () => {
  filters.search = '';
  filters.status = '';
  filters.sort = 'newest';
};

// Filtered and sorted applicants
const filteredApplicants = computed(() => {
  let result = [...applicants.value];

  // Apply search filter
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    result = result.filter(
      (a) =>
        a.candidate.name.toLowerCase().includes(searchLower) ||
        a.candidate.email.toLowerCase().includes(searchLower)
    );
  }

  // Apply status filter
  if (filters.status) {
    result = result.filter((a) => a.status === filters.status);
  }

  // Apply sorting
  switch (filters.sort) {
    case 'newest':
      result.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));
      break;
    case 'oldest':
      result.sort((a, b) => new Date(a.appliedAt) - new Date(b.appliedAt));
      break;
    case 'highMatch':
      result.sort(
        (a, b) => (b.matchPercentage || 0) - (a.matchPercentage || 0)
      );
      break;
    case 'lowMatch':
      result.sort(
        (a, b) => (a.matchPercentage || 0) - (b.matchPercentage || 0)
      );
      break;
  }

  return result;
});

// View candidate profile
const viewCandidateProfile = (candidateId) => {
  // Navigate to candidate profile view
  toast.add({
    severity: 'info',
    summary: 'View Profile',
    detail: `Viewing profile of candidate ID: ${candidateId}`,
    life: 3000,
  });
};

// Update application status
const updateApplicationStatus = async (applicationId, newStatus) => {
  try {
    // This will be replaced with an actual API call
    // For now, we're just updating the local state
    const index = applicants.value.findIndex((a) => a.id === applicationId);
    if (index !== -1) {
      applicants.value[index].status = newStatus;

      toast.add({
        severity: 'success',
        summary: 'Status Updated',
        detail: `Application status has been updated to ${formatApplicationStatus(
          newStatus
        )}`,
        life: 3000,
      });
    }
  } catch (error) {
    console.error('Error updating application status:', error);
    toast.add({
      severity: 'error',
      summary: 'Update Failed',
      detail: 'Failed to update application status',
      life: 3000,
    });
  }
};

// Fetch job data and applicants
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

      // Fetch applicants (simulated for now)
      // This will be replaced with an actual API call
      applicants.value = generateMockApplicants();
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

:deep(.p-datatable .p-datatable-thead > tr > th) {
  background: #f8fafc;
  color: #475569;
  font-weight: 600;
}

:deep(.p-progressbar) {
  border-radius: 4px;
  background: #e2e8f0;
}

:deep(.p-progressbar-value) {
  border-radius: 4px;
}

:deep(.p-dropdown) {
  width: 100%;
  border-radius: 8px;
}

:deep(.p-inputtext) {
  border-radius: 8px;
}
</style>
