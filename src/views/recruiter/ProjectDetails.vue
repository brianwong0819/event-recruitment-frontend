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
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          <div class="bg-gray-50 p-4 rounded-lg shadow-sm">
            <div class="flex items-center">
              <div class="bg-primary-100 rounded-full p-2 mr-3">
                <i class="pi pi-briefcase text-primary-700"></i>
              </div>
              <div>
                <h3 class="text-sm font-medium text-gray-500">Total Jobs</h3>
                <p class="text-lg font-semibold text-gray-900">
                  {{ project?.jobs?.length || 0 }}
                </p>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg shadow-sm">
            <div class="flex items-center">
              <div class="bg-primary-100 rounded-full p-2 mr-3">
                <i class="pi pi-users text-primary-700"></i>
              </div>
              <div>
                <h3 class="text-sm font-medium text-gray-500">
                  Total Applicants
                </h3>
                <p class="text-lg font-semibold text-gray-900">
                  {{ getTotalApplicants() }}
                </p>
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
          <Column field="location" header="Location">
            <template #body="{ data }">
              <div class="flex items-center">
                <i class="pi pi-map-marker text-gray-500 mr-2"></i>
                <span>{{ data.location }}</span>
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
          <Column field="dateRange" header="Dates">
            <template #body="{ data }">
              <div class="flex items-center">
                <i class="pi pi-calendar text-blue-500 mr-2"></i>
                <span>{{ data.dateRange }}</span>
              </div>
            </template>
          </Column>
          <Column field="status" header="Status">
            <template #body="{ data }">
              <Tag
                :value="formatJobStatus(data.status)"
                :severity="getJobStatusSeverity(data.status)"
                class="text-xs font-medium uppercase"
              />
            </template>
          </Column>
          <Column field="applicantsCount" header="Applicants">
            <template #body="{ data }">
              <div class="flex items-center">
                <span
                  class="flex items-center justify-center w-7 h-7 rounded-full bg-blue-50 mr-2"
                >
                  <Badge :value="data.applicantsCount" severity="info" />
                </span>
                <Button
                  v-if="data.applicantsCount > 0 && !isDeletedProject"
                  icon="pi pi-arrow-right"
                  class="p-button-text p-button-rounded p-button-sm text-blue-500"
                  @click.stop="viewJobApplicants(data)"
                />
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
  toast.add({
    severity: 'info',
    summary: 'View Job',
    detail: `Viewing job details: ${job.title}`,
    life: 3000,
  });
};

const editJob = (job) => {
  if (isDeletedProject.value) return;

  toast.add({
    severity: 'info',
    summary: 'Edit Job',
    detail: `Editing job: ${job.title}`,
    life: 3000,
  });
};

const viewJobApplicants = (job) => {
  if (isDeletedProject.value) return;

  toast.add({
    severity: 'info',
    summary: 'View Applicants',
    detail: `Viewing applicants for: ${job.title}`,
    life: 3000,
  });
};

// Fetch project data
const fetchProjectData = () => {
  loading.value = true;

  // In a real app, this would be an API call
  // For now, simulating an API call with mock data
  setTimeout(() => {
    // Mock project data - in a real app, this would come from an API
    const mockProjects = [
      {
        id: '1',
        name: 'Summer Sales Campaign',
        description:
          'Promotional events for our summer product line across major malls',
        createdAt: new Date(2024, 3, 15), // April 15, 2024
        jobCount: 3,
        jobs: [
          {
            id: 101,
            title: 'Dry Promoter',
            location: 'MITC Melaka Outlet',
            salary: 'RM 95/day',
            dateRange: '02 May - 03 May 2024',
            status: 'active',
            applicantsCount: 5,
          },
          {
            id: 102,
            title: 'Event Assistant',
            location: 'Kuala Lumpur City Centre',
            salary: 'RM 100/day',
            dateRange: '10 May - 12 May 2024',
            status: 'draft',
            applicantsCount: 0,
          },
          {
            id: 103,
            title: 'Product Demonstrator',
            location: 'Penang Gurney Plaza',
            salary: 'RM 110/day',
            dateRange: '15 May - 16 May 2024',
            status: 'active',
            applicantsCount: 3,
          },
        ],
      },
      {
        id: '2',
        name: 'Tech Expo 2024',
        description:
          'Annual technology exhibition with product showcases and demonstrations',
        createdAt: new Date(2024, 3, 10), // April 10, 2024
        jobCount: 2,
        jobs: [
          {
            id: 201,
            title: 'Tech Product Demonstrator',
            location: 'Kuala Lumpur Convention Centre',
            salary: 'RM 120/day',
            dateRange: '15 Jun - 18 Jun 2024',
            status: 'draft',
            applicantsCount: 0,
          },
          {
            id: 202,
            title: 'Registration Assistant',
            location: 'Kuala Lumpur Convention Centre',
            salary: 'RM 90/day',
            dateRange: '15 Jun - 18 Jun 2024',
            status: 'draft',
            applicantsCount: 0,
          },
        ],
      },
      {
        id: '3',
        name: 'Food Festival',
        description: 'Food sampling and promotion for the annual food festival',
        createdAt: new Date(2024, 2, 20), // March 20, 2024
        jobCount: 0,
        jobs: [],
      },
      // Add mock data for deleted projects
      {
        id: '4',
        name: 'Fashion Week 2024',
        description:
          'Runway models and fashion event staff for the annual fashion week',
        createdAt: new Date(2024, 1, 15), // February 15, 2024
        deletedAt: new Date(2024, 3, 5), // April 5, 2024
        jobCount: 4,
        jobs: [
          {
            id: 301,
            title: 'Fashion Assistant',
            location: 'Pavilion Shopping Mall',
            salary: 'RM 150/day',
            dateRange: '05 Mar - 12 Mar 2024',
            status: 'completed',
            applicantsCount: 8,
          },
          {
            id: 302,
            title: 'Runway Model',
            location: 'Pavilion Shopping Mall',
            salary: 'RM 300/day',
            dateRange: '07 Mar - 10 Mar 2024',
            status: 'completed',
            applicantsCount: 12,
          },
        ],
      },
    ];

    const foundProject = mockProjects.find(
      (p) => p.id === route.params.projectId
    );

    if (foundProject) {
      project.value = foundProject;
    } else {
      toast.add({
        severity: 'error',
        summary: 'Project Not Found',
        detail: 'The requested project could not be found',
        life: 3000,
      });
      router.push({ name: 'ManageJobs' });
    }

    loading.value = false;
  }, 1000); // Simulate network delay
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
