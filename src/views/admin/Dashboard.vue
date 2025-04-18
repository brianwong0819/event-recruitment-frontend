<template>
  <div>
    <!-- Toast component for notifications -->
    <Toast />

    <!-- Page header -->
    <div class="mb-8 flex justify-between items-center">
      <div>
        <h2 class="text-xl font-semibold text-indigo-600 mb-2">Admin Panel</h2>
        <h1 class="text-3xl font-bold text-gray-900">Recruiter Management</h1>
        <p class="mt-2 text-sm text-gray-700">
          Review and manage registered recruiters in the system
        </p>
      </div>
      <!-- Logout button -->
      <Button
        label="Logout"
        icon="pi pi-power-off"
        severity="secondary"
        outlined
        @click="handleLogout"
        class="self-start"
      />
    </div>

    <!-- Main content card -->
    <Card class="mb-8">
      <template #content>
        <!-- Search and filters -->
        <div class="flex flex-col sm:flex-row gap-3 mb-6">
          <InputText
            v-model="filters.global.value"
            placeholder="Search recruiters..."
            class="w-full border border-gray-200 rounded-md p-3"
          />
          <div>
            <Dropdown
              v-model="statusFilter"
              :options="statusOptions"
              optionLabel="label"
              placeholder="All Statuses"
              class="w-full sm:w-48 border-none"
              @change="onStatusFilterChange"
            />
          </div>
        </div>

        <!-- Recruiters table -->
        <DataTable
          :value="recruiters"
          :loading="loading"
          v-model:filters="filters"
          filterDisplay="menu"
          :globalFilterFields="[
            'recruiterRepName',
            'email',
            'companyName',
            'verificationStatus',
          ]"
          responsiveLayout="stack"
          breakpoint="960px"
          stripedRows
          class="p-datatable-sm"
          :emptyMessage="emptyMessage"
        >
          <!-- Company Column -->
          <Column
            field="companyName"
            header="Company"
            sortable
            style="width: 22%"
          >
            <template #body="{ data }">
              <div class="flex items-center gap-2">
                <Avatar
                  v-if="data.companyLogoUrl"
                  :image="getCompanyLogoUrl(data.companyLogoUrl)"
                  shape="circle"
                  size="small"
                  class="bg-blue-100"
                  @error="handleLogoError"
                />
                <Avatar
                  v-else
                  icon="pi pi-building"
                  shape="circle"
                  size="small"
                  class="bg-blue-100 text-blue-600"
                />
                <span>{{ data.companyName || 'Individual' }}</span>
              </div>
            </template>
          </Column>

          <!-- Name Column -->
          <Column
            field="recruiterRepName"
            header="Recruiter Name"
            sortable
            style="width: 24%"
          >
            <template #body="{ data }">
              <div class="flex items-center gap-2">
                <i class="pi pi-user text-blue-500"></i>
                <div>
                  <div class="font-medium">{{ data.recruiterRepName }}</div>
                  <div class="text-xs text-gray-500">@{{ data.username }}</div>
                </div>
              </div>
            </template>
          </Column>

          <!-- Email Column -->
          <Column field="email" header="Email" sortable style="width: 22%">
            <template #body="{ data }">
              <div class="flex items-center gap-2">
                <i class="pi pi-envelope text-blue-500"></i>
                <a
                  :href="'mailto:' + data.email"
                  class="text-blue-600 hover:underline"
                >
                  {{ data.email }}
                </a>
              </div>
            </template>
          </Column>

          <!-- Status Column -->
          <Column
            field="verificationStatus"
            header="Status"
            sortable
            style="width: 16%"
          >
            <template #body="{ data }">
              <Tag
                :severity="getStatusSeverity(data.verificationStatus)"
                :value="formatStatus(data.verificationStatus)"
                class="text-xs"
              />
            </template>
            <template #filter="{ filterModel, filterCallback }">
              <Dropdown
                v-model="filterModel.value"
                :options="statusOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Select Status"
                class="p-column-filter"
                :showClear="true"
                @change="filterCallback()"
              />
            </template>
          </Column>

          <!-- Actions Column -->
          <Column header="Actions" style="width: 14%">
            <template #body="{ data }">
              <div class="flex gap-2 justify-start">
                <Button
                  icon="pi pi-eye"
                  severity="info"
                  text
                  rounded
                  aria-label="View Details"
                  @click="viewRecruiter(data)"
                  v-tooltip.top="'View Details'"
                />
                <Menu
                  ref="statusMenu"
                  :model="getStatusMenuItems(data)"
                  :popup="true"
                />
                <Button
                  icon="pi pi-cog"
                  severity="secondary"
                  text
                  rounded
                  aria-label="Change Status"
                  @click="toggleStatusMenu($event, data)"
                  v-tooltip.top="'Change Status'"
                />
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <!-- Recruiter Details Dialog -->
    <Dialog
      v-model:visible="detailsVisible"
      :header="
        selectedRecruiter
          ? 'Recruiter Details: ' + selectedRecruiter.recruiterRepName
          : 'Recruiter Details'
      "
      :style="{ width: '50vw' }"
      :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
      :modal="true"
    >
      <div
        v-if="selectedRecruiter"
        class="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div class="md:col-span-2 flex justify-center mb-4">
          <Avatar
            v-if="selectedRecruiter.companyLogoUrl"
            :image="getCompanyLogoUrl(selectedRecruiter.companyLogoUrl)"
            shape="circle"
            size="xlarge"
            class="bg-blue-100"
            @error="handleLogoError"
          />
          <Avatar
            v-else
            icon="pi pi-building"
            shape="circle"
            size="xlarge"
            class="bg-blue-100 text-blue-600"
          />
        </div>

        <div class="field">
          <label class="text-sm font-medium text-gray-500">Username</label>
          <div class="text-gray-900">{{ selectedRecruiter.username }}</div>
        </div>

        <div class="field">
          <label class="text-sm font-medium text-gray-500">Company</label>
          <div class="text-gray-900">
            {{ selectedRecruiter.companyName || 'N/A' }}
          </div>
        </div>

        <div class="field">
          <label class="text-sm font-medium text-gray-500"
            >Recruiter Name</label
          >
          <div class="text-gray-900">
            {{ selectedRecruiter.recruiterRepName }}
          </div>
        </div>

        <div class="field">
          <label class="text-sm font-medium text-gray-500">Email</label>
          <div class="text-gray-900">
            <a
              :href="'mailto:' + selectedRecruiter.email"
              class="text-blue-600 hover:underline"
            >
              {{ selectedRecruiter.email }}
            </a>
          </div>
        </div>

        <div class="field">
          <label class="text-sm font-medium text-gray-500">Phone</label>
          <div class="text-gray-900">{{ selectedRecruiter.phoneNumber }}</div>
        </div>

        <div class="field">
          <label class="text-sm font-medium text-gray-500"
            >Recruiter Type</label
          >
          <div class="text-gray-900">{{ selectedRecruiter.recruiterType }}</div>
        </div>

        <div class="field">
          <label class="text-sm font-medium text-gray-500">Status</label>
          <div>
            <Tag
              :severity="
                getStatusSeverity(selectedRecruiter.verificationStatus)
              "
              :value="formatStatus(selectedRecruiter.verificationStatus)"
            />
          </div>
        </div>

        <div class="field">
          <label class="text-sm font-medium text-gray-500">Registered On</label>
          <div class="text-gray-900">
            {{ formatDate(selectedRecruiter.createdAt, true) }}
          </div>
        </div>

        <div class="md:col-span-2 mt-4">
          <label class="text-sm font-medium text-gray-500 mb-2 block"
            >Change Status</label
          >
          <div class="flex flex-wrap gap-3">
            <Button
              v-for="status in [
                'PENDING',
                'VERIFIED',
                'REJECTED',
                'UNDER_REVIEW',
                'SUSPENDED',
              ]"
              :key="status"
              :label="formatStatus(status)"
              :icon="getStatusIcon(status)"
              :severity="getStatusButtonSeverity(status)"
              :outlined="selectedRecruiter.verificationStatus !== status"
              :disabled="selectedRecruiter.verificationStatus === status"
              @click="changeStatus(selectedRecruiter, status)"
              size="small"
              class="mr-2 mb-2"
            />
          </div>
        </div>

        <div class="md:col-span-2 mt-4 flex justify-end gap-2">
          <Button
            label="Close"
            icon="pi pi-times"
            text
            @click="detailsVisible = false"
          />
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { FilterMatchMode } from 'primevue/api';
import { apiClient } from '@/services/api.service';
import { format, parseISO } from 'date-fns';
import fileService from '@/services/file.service';

// PrimeVue components
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import Badge from 'primevue/badge';
import Card from 'primevue/card';
import Avatar from 'primevue/avatar';
import Dialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown';
import Menu from 'primevue/menu';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();
const recruiters = ref([]);
const loading = ref(false);
const detailsVisible = ref(false);
const selectedRecruiter = ref(null);
const statusFilter = ref(null);

// Status options for filtering
const statusOptions = [
  { label: 'All Statuses', value: null },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Verified', value: 'VERIFIED' },
  { label: 'Rejected', value: 'REJECTED' },
  { label: 'Under Review', value: 'UNDER_REVIEW' },
  { label: 'Suspended', value: 'SUSPENDED' },
];

// Table filters
const filters = reactive({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  verificationStatus: { value: null, matchMode: FilterMatchMode.EQUALS },
});

// Empty message based on filter state
const emptyMessage = computed(() => {
  if (filters.global.value) {
    return `No recruiters found matching "${filters.global.value}"`;
  }
  if (filters.verificationStatus.value) {
    return `No recruiters with status "${formatStatus(
      filters.verificationStatus.value
    )}"`;
  }
  return 'No recruiters found';
});

// Format status for display
const formatStatus = (status) => {
  if (!status) return 'Unknown';
  return status.charAt(0) + status.slice(1).toLowerCase();
};

// Get severity class based on verification status
const getStatusSeverity = (status) => {
  switch (status) {
    case 'VERIFIED':
      return 'success';
    case 'REJECTED':
      return 'danger';
    case 'SUSPENDED':
      return 'danger';
    case 'UNDER_REVIEW':
      return 'info';
    case 'PENDING':
    default:
      return 'warning';
  }
};

// Format date for display
const formatDate = (dateString, showTime = false) => {
  if (!dateString) return 'N/A';
  try {
    const date = parseISO(dateString);
    return format(date, showTime ? 'MMM d, yyyy h:mm a' : 'MMM d, yyyy');
  } catch (e) {
    console.error('Error formatting date:', e);
    return dateString;
  }
};

// Apply status filter
const onStatusFilterChange = () => {
  filters.verificationStatus.value = statusFilter.value?.value || null;
};

// Load recruiters from API
const loadRecruiters = async () => {
  try {
    loading.value = true;
    console.log('Loading recruiters...');

    // Check authentication and token
    const token = localStorage.getItem('accessToken');
    console.log('Access token exists:', !!token);
    if (token) {
      console.log(
        'Token first few characters:',
        token.substring(0, 20) + '...'
      );
    }

    if (!authStore.authenticated || !authStore.isAdmin) {
      console.warn(
        'Warning: User is not authenticated as admin. Auth state:',
        authStore.authenticated,
        'isAdmin:',
        authStore.isAdmin
      );
      // We'll continue anyway since mock data will be used as fallback
    }

    // Call API to get recruiters list - updated URL format
    console.log('API base URL used:', apiClient.defaults.baseURL);
    console.log('Auth state:', authStore.authenticated, authStore.isAdmin);
    console.log('Current user:', authStore.user);

    try {
      // Update path to include /api prefix
      console.log('Attempting API call to /admin/recruiters');
      const response = await apiClient.get('/admin/recruiters');
      console.log('API response received:', response);

      if (response.data && Array.isArray(response.data)) {
        console.log('Response data is an array, using directly');
        recruiters.value = response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        console.log('Response data has nested data array, using data.data');
        recruiters.value = response.data.data;
      } else {
        console.log(
          'API response format does not match expected structure:',
          response.data
        );
      }
    } catch (apiError) {
      console.error('API call failed:', apiError);
      console.error('API error details:', {
        message: apiError.message,
        response: apiError.response,
        request: apiError.request
          ? 'Request made but no response received'
          : 'No request made',
        config: apiError.config,
      });
    }

    // Fallback to mock data if API call fails or returns no results
    if (!recruiters.value.length) {
      console.log('Using mock data since API returned no results');
      // Mock data for development
      recruiters.value = [
        {
          id: 2,
          username: 'amanda',
          recruiterRepName: 'Amanda Chong',
          email: 'ddacsmilecraft@gmail.com',
          phoneNumber: '0123456789',
          recruiterType: 'COMPANY',
          companyName: 'JobTag Sdn Bhd',
          companyLogoUrl:
            '/api/files/company-logos/472a8c2b-9042-4dab-a9d2-f9d6e61dc886.png',
          verificationStatus: 'PENDING',
          createdAt: '2025-04-15T14:52:32.170048',
        },
        {
          id: 3,
          username: 'michael',
          recruiterRepName: 'Michael Chen',
          email: 'michael@techrecruit.com',
          phoneNumber: '0187654321',
          recruiterType: 'COMPANY',
          companyName: 'TechRecruit Solutions',
          companyLogoUrl:
            '/api/files/company-logos/572a8c2b-9042-4dab-a9d2-f9d6e61dc776.png',
          verificationStatus: 'VERIFIED',
          createdAt: '2025-03-10T09:12:45.370048',
        },
        {
          id: 4,
          username: 'sarah',
          recruiterRepName: 'Sarah Johnson',
          email: 'sarah.j@talentmatch.com',
          phoneNumber: '0127890123',
          recruiterType: 'INDIVIDUAL',
          companyName: null,
          companyLogoUrl: null,
          verificationStatus: 'REJECTED',
          createdAt: '2025-05-22T11:32:18.270048',
        },
        // ... other mock recruiters
      ];
    }

    console.log('Final recruiters data:', recruiters.value.length, 'records');
    loading.value = false;
  } catch (error) {
    console.error('Error loading recruiters:', error);
    loading.value = false;

    // Use mock data as fallback
    recruiters.value = [
      {
        id: 2,
        username: 'amanda',
        recruiterRepName: 'Amanda Chong',
        email: 'ddacsmilecraft@gmail.com',
        phoneNumber: '0123456789',
        recruiterType: 'COMPANY',
        companyName: 'JobTag Sdn Bhd',
        companyLogoUrl:
          '/api/files/company-logos/472a8c2b-9042-4dab-a9d2-f9d6e61dc886.png',
        verificationStatus: 'PENDING',
        createdAt: '2025-04-15T14:52:32.170048',
      },
      // ... other mock recruiters
    ];
  }
};

// View recruiter details
const viewRecruiter = (recruiter) => {
  // Navigate to the admin-specific RecruiterInfo page
  router.push({
    name: 'AdminRecruiterInfo',
    params: { recruiterId: recruiter.id },
  });
};

// Toggle status menu popup
const toggleStatusMenu = (event, recruiter) => {
  // Store current recruiter reference for the menu
  selectedRecruiterForMenu.value = recruiter;
  // Show menu at event position
  statusMenu.value.toggle(event);
};

// Create menu items for status actions
const selectedRecruiterForMenu = ref(null);
const statusMenu = ref(null);

const getStatusMenuItems = (recruiter) => {
  return [
    {
      label: 'Change Status To',
      items: [
        {
          label: 'Pending',
          icon: 'pi pi-clock',
          class:
            recruiter.verificationStatus === 'PENDING'
              ? 'text-gray-400 cursor-not-allowed'
              : '',
          disabled: recruiter.verificationStatus === 'PENDING',
          command: () => changeStatus(recruiter, 'PENDING'),
        },
        {
          label: 'Verified',
          icon: 'pi pi-check-circle',
          class:
            recruiter.verificationStatus === 'VERIFIED'
              ? 'text-gray-400 cursor-not-allowed'
              : '',
          disabled: recruiter.verificationStatus === 'VERIFIED',
          command: () => changeStatus(recruiter, 'VERIFIED'),
        },
        {
          label: 'Rejected',
          icon: 'pi pi-times-circle',
          class:
            recruiter.verificationStatus === 'REJECTED'
              ? 'text-gray-400 cursor-not-allowed'
              : '',
          disabled: recruiter.verificationStatus === 'REJECTED',
          command: () => changeStatus(recruiter, 'REJECTED'),
        },
        {
          label: 'Under Review',
          icon: 'pi pi-search',
          class:
            recruiter.verificationStatus === 'UNDER_REVIEW'
              ? 'text-gray-400 cursor-not-allowed'
              : '',
          disabled: recruiter.verificationStatus === 'UNDER_REVIEW',
          command: () => changeStatus(recruiter, 'UNDER_REVIEW'),
        },
        {
          label: 'Suspended',
          icon: 'pi pi-ban',
          class:
            recruiter.verificationStatus === 'SUSPENDED'
              ? 'text-gray-400 cursor-not-allowed'
              : '',
          disabled: recruiter.verificationStatus === 'SUSPENDED',
          command: () => changeStatus(recruiter, 'SUSPENDED'),
        },
      ],
    },
  ];
};

// Change status to a specific value
const changeStatus = async (recruiter, newStatus, closeDialog = false) => {
  try {
    loading.value = true;
    console.log(
      'Changing status for recruiter:',
      recruiter.id,
      'from',
      recruiter.verificationStatus,
      'to',
      newStatus
    );

    // Call API to update recruiter status with the correct endpoint and request format
    await apiClient.put('/admin/recruiters/verification', {
      recruiterId: recruiter.id,
      verificationStatus: newStatus,
    });

    // Update local state
    recruiter.verificationStatus = newStatus;

    // Close dialog if needed
    if (closeDialog) {
      detailsVisible.value = false;
    }

    // Show success message
    toast.add({
      severity: 'success',
      summary: 'Status Changed',
      detail: `${
        recruiter.recruiterRepName
      }'s status has been changed to ${formatStatus(newStatus)}`,
      life: 5000,
    });
  } catch (error) {
    console.error('Error updating recruiter status:', error);
    // Don't update the local state if API call fails

    // Show error message
    toast.add({
      severity: 'error',
      summary: 'Status Change Failed',
      detail: `Failed to change ${recruiter.recruiterRepName}'s status. ${
        error.response?.data?.message ||
        error.message ||
        'Please try again later.'
      }`,
      life: 5000,
    });
  } finally {
    loading.value = false;
  }
};

// Get icon for status buttons
const getStatusIcon = (status) => {
  switch (status) {
    case 'VERIFIED':
      return 'pi pi-check-circle';
    case 'REJECTED':
      return 'pi pi-times-circle';
    case 'SUSPENDED':
      return 'pi pi-ban';
    case 'UNDER_REVIEW':
      return 'pi pi-search';
    case 'PENDING':
      return 'pi pi-clock';
    default:
      return 'pi pi-question';
  }
};

// Get severity for status buttons
const getStatusButtonSeverity = (status) => {
  switch (status) {
    case 'VERIFIED':
      return 'success';
    case 'REJECTED':
      return 'danger';
    case 'SUSPENDED':
      return 'danger';
    case 'UNDER_REVIEW':
      return 'info';
    case 'PENDING':
      return 'warning';
    default:
      return 'secondary';
  }
};

// Add these helper functions to handle company logos correctly
const getCompanyLogoUrl = (logoPath) => {
  if (!logoPath) return null;
  return fileService.getCompanyLogoUrl(logoPath);
};

const handleLogoError = (event) => {
  console.log('Logo failed to load:', event.target.src);
  // Fall back to building icon
  event.target.style.display = 'none';
};

// Logout function
const handleLogout = async () => {
  try {
    console.log('Logging out admin user...');

    // Clear all auth-related items from localStorage directly
    // This ensures logout works even if API call fails
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userType');

    // Reset auth store state
    authStore.user = null;
    authStore.authenticated = false;

    try {
      // Try API logout, but don't wait for it or depend on its success
      authStore.logout().catch((e) => {
        console.log('API logout failed, but continuing with local logout');
      });
    } catch (apiError) {
      console.log('API logout error handled:', apiError);
    }

    console.log('Logout successful, redirecting to admin login page');
    // Always redirect to admin login
    router.push('/admin/login');
  } catch (error) {
    console.error('Logout failed:', error);
    // Still redirect on any error
    router.push('/admin/login');
  }
};

onMounted(() => {
  console.log('Admin Dashboard component mounted');

  // Check if user is authenticated and is an admin
  if (!authStore.authenticated || !authStore.isAdmin) {
    console.error('Unauthorized access to admin dashboard:', {
      authenticated: authStore.authenticated,
      isAdmin: authStore.isAdmin,
      user: authStore.user,
    });

    console.log('Will try to redirect to login');
    router.push('/admin/login');
    return;
  }

  console.log('Admin authentication confirmed, loading recruiters...');
  // Load recruiters
  loadRecruiters();
});
</script>

<style scoped>
.field {
  margin-bottom: 1rem;
}

.field label {
  display: block;
  margin-bottom: 0.25rem;
}

:deep(.p-dropdown) {
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  background-color: white;
}

:deep(.p-dropdown-panel) {
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

:deep(.p-dropdown-item) {
  padding: 0.75rem 1rem;
}

:deep(.p-dropdown-trigger) {
  width: 2.5rem;
  border-left: none !important;
  background: transparent !important;
}

:deep(.p-dropdown-label) {
  padding: 0.625rem 0.75rem;
  border: none !important;
  background: transparent !important;
}

:deep(.p-dropdown:not(.p-disabled):hover) {
  border-color: #cbd5e1;
}

:deep(.p-component) {
  box-shadow: none !important;
}

:deep(.p-dropdown .p-inputtext) {
  border: none !important;
  box-shadow: none !important;
  background: transparent !important;
}

:deep(.p-dropdown-clear-icon) {
  margin-right: 0.5rem;
}

:deep(.p-inputtext:enabled:focus) {
  box-shadow: none;
  border-color: #6366f1;
}

:deep(.p-inputtext) {
  font-size: 0.875rem;
}

:deep(.p-card) {
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

:deep(.p-menuitem-link) {
  display: flex;
  align-items: center;
  position: relative;
  text-decoration: none;
  padding: 0.75rem 1rem;
  user-select: none;
}

:deep(
    .p-menu
      .p-menuitem:not(.p-highlight):not(.p-disabled)
      > .p-menuitem-content:hover
  ) {
  background: #f3f4f6;
}
</style>
