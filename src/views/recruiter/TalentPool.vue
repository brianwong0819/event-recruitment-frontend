<template>
  <div class="p-6">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 mb-2">Talent Pool</h1>
      <p class="text-gray-600">
        Discover candidates who have made their profiles visible to recruiters
      </p>
    </div>

    <!-- Filters panel -->
    <div class="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
      <div class="p-4 border-b flex justify-between items-center bg-gray-50">
        <div class="flex items-center">
          <i class="pi pi-filter text-indigo-600 mr-2"></i>
          <h3 class="font-semibold">Filter Candidates</h3>
        </div>
        <Button
          v-if="hasActiveFilters"
          label="Clear All"
          icon="pi pi-filter-slash"
          class="p-button-outlined text-indigo-600 border-indigo-300 hover:bg-indigo-50 hover:border-indigo-400"
          @click="clearFilters"
        />
      </div>

      <div class="p-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Search field -->
          <div class="col-span-1 md:col-span-3">
            <InputText
              v-model="filters.search"
              placeholder="Search by name, skills, or location"
              class="w-full"
            />
          </div>

          <!-- Age Range filter -->
          <div class="col-span-1">
            <label
              for="age-range"
              class="block text-gray-700 text-sm font-medium mb-1"
            >
              Age Range
            </label>
            <div class="flex gap-2">
              <InputNumber
                v-model="filters.ageMin"
                placeholder="Min"
                :min="18"
                :max="100"
                class="w-full"
              />
              <InputNumber
                v-model="filters.ageMax"
                placeholder="Max"
                :min="18"
                :max="100"
                class="w-full"
              />
            </div>
          </div>

          <!-- Gender filter -->
          <div class="col-span-1">
            <label
              for="gender"
              class="block text-gray-700 text-sm font-medium mb-1"
            >
              Gender
            </label>
            <Dropdown
              id="gender"
              v-model="filters.gender"
              :options="genderOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="All Genders"
              class="w-full"
            />
          </div>

          <!-- Employment status filter -->
          <div class="col-span-1">
            <label
              for="employmentStatus"
              class="block text-gray-700 text-sm font-medium mb-1"
            >
              Employment Status
            </label>
            <Dropdown
              id="employmentStatus"
              v-model="filters.employmentStatus"
              :options="employmentStatusOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Any Status"
              class="w-full"
            />
          </div>

          <!-- Ethnicity filter -->
          <div class="col-span-1">
            <label
              for="ethnicity"
              class="block text-gray-700 text-sm font-medium mb-1"
            >
              Ethnicity
            </label>
            <Dropdown
              id="ethnicity"
              v-model="filters.ethnicity"
              :options="ethnicityOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="All Ethnicities"
              class="w-full"
            />
          </div>

          <!-- Experience Count filter -->
          <div class="col-span-1">
            <label
              for="experienceCount"
              class="block text-gray-700 text-sm font-medium mb-1"
            >
              Experience Count
            </label>
            <InputNumber
              v-model="filters.experienceMin"
              placeholder="Min"
              :min="0"
              class="w-full"
            />
          </div>

          <!-- Sort by dropdown -->
          <div class="col-span-1">
            <label
              for="sortBy"
              class="block text-gray-700 text-sm font-medium mb-1"
            >
              Sort By
            </label>
            <Dropdown
              id="sortBy"
              v-model="filters.sortBy"
              :options="sortOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Sort By"
              class="w-full"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Candidates grid view -->
    <div v-if="loading" class="flex justify-center py-12">
      <ProgressSpinner />
    </div>

    <div v-else>
      <!-- Total candidates count -->
      <div
        v-if="filteredCandidates.length > 0"
        class="mb-4 text-gray-600 font-medium"
      >
        {{ filteredCandidates.length }} candidates found
      </div>

      <!-- Empty state when no candidates match filters -->
      <div
        v-if="filteredCandidates.length === 0"
        class="bg-white rounded-xl shadow-md py-12 px-6 w-full"
      >
        <div class="flex flex-col items-center max-w-lg mx-auto">
          <div
            class="bg-indigo-50 w-16 h-16 flex items-center justify-center rounded-full mb-5"
          >
            <i class="pi pi-search text-indigo-500 text-2xl"></i>
          </div>
          <h3 class="text-xl font-semibold text-gray-800 mb-3">
            No candidates found
          </h3>
          <p class="text-gray-600 mb-6 text-center">
            {{
              candidates.length > 0
                ? 'No candidates match your current filter criteria. Try adjusting your filters.'
                : 'There are currently no candidates available in the talent pool.'
            }}
          </p>
          <Button
            v-if="hasActiveFilters"
            label="Clear All Filters"
            class="p-button-outlined text-indigo-600 border-indigo-300 hover:bg-indigo-50 hover:border-indigo-400 px-6"
            @click="clearFilters"
          >
            <template #icon>
              <i class="pi pi-filter-slash mr-2"></i>
            </template>
          </Button>
          <p v-if="candidates.length === 0" class="text-sm text-gray-500 mt-3">
            Check back later as more candidates join the platform.
          </p>
        </div>
      </div>

      <!-- Candidate cards grid -->
      <div
        v-if="filteredCandidates.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <div
          v-for="candidate in paginatedCandidates"
          :key="candidate.id"
          class="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 overflow-hidden"
        >
          <div class="p-5 border-b border-gray-100">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div
                  class="relative w-16 h-16 rounded-full overflow-hidden mr-3"
                >
                  <img
                    v-if="candidate.profilePictureUrl"
                    :src="getProfilePictureUrl(candidate.profilePictureUrl)"
                    class="w-full h-full object-cover rounded-full"
                    alt="Profile Picture"
                  />
                  <div
                    v-else
                    class="w-full h-full bg-gray-200 flex items-center justify-center rounded-full"
                  >
                    <span class="text-gray-600 font-medium text-xl">{{
                      getInitials(candidate.name)
                    }}</span>
                  </div>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-800">
                    {{ candidate.name }}
                  </h3>
                  <p
                    v-if="
                      candidate.experienceTypes &&
                      candidate.experienceTypes.length > 0
                    "
                    class="text-gray-500 text-sm"
                  >
                    {{ formatExperienceTypes(candidate.experienceTypes)[0] }}
                  </p>
                  <p v-else class="text-gray-500 text-sm">
                    No experience specified
                  </p>
                </div>
              </div>
              <div>
                <Button
                  icon="pi pi-user"
                  class="p-button-rounded p-button-outlined"
                  @click="viewCandidateProfile(candidate.id)"
                  aria-label="View Profile"
                  v-tooltip.top="'View Profile'"
                />
              </div>
            </div>
          </div>

          <div class="p-5">
            <!-- Location -->
            <div class="flex items-center mb-4 text-sm text-gray-600">
              <i class="pi pi-map-marker mr-2"></i>
              <span>{{
                candidate.preferredLocationName || 'Location not specified'
              }}</span>
            </div>

            <!-- Languages -->
            <div class="mb-4">
              <div class="text-sm font-medium text-gray-700 mb-2">
                Languages:
              </div>
              <div class="flex flex-wrap gap-2">
                <Chip
                  v-for="(language, index) in candidate.languages"
                  :key="index"
                  :label="language.charAt(0) + language.slice(1).toLowerCase()"
                  class="bg-indigo-50 text-indigo-700 text-xs py-1"
                />
                <Chip
                  v-if="
                    !candidate.languages || candidate.languages.length === 0
                  "
                  label="None specified"
                  class="bg-gray-100 text-gray-700 text-xs"
                />
              </div>
            </div>

            <!-- Experience -->
            <div class="flex items-center mb-4 text-sm">
              <i class="pi pi-briefcase mr-2 text-gray-600"></i>
              <span class="text-gray-700">
                {{
                  candidate.experienceCount ||
                  candidate.experienceTypes?.length ||
                  0
                }}
                experiences
              </span>
            </div>

            <!-- Demographics -->
            <div class="grid grid-cols-2 gap-2 mb-6 text-sm">
              <div class="flex items-center text-gray-600">
                <i class="pi pi-calendar mr-2"></i>
                <span>{{ candidate.age || 'N/A' }} years old</span>
              </div>
              <div class="flex items-center text-gray-600">
                <i class="pi pi-users mr-2"></i>
                <span>{{ candidate.gender }}</span>
              </div>
            </div>

            <!-- View Profile Button -->
            <Button
              label="View Profile"
              icon="pi pi-user"
              class="p-button-outlined w-full"
              @click="viewCandidateProfile(candidate.id)"
            />
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="filteredCandidates.length > 0" class="mt-8">
        <div
          class="bg-white rounded-xl shadow-md py-4 px-6 w-full flex justify-center"
        >
          <div class="flex items-center gap-2">
            <button
              class="pagination-button"
              @click="goToFirstPage"
              :disabled="isFirstPage"
            >
              «
            </button>
            <button
              class="pagination-button"
              @click="goToPrevPage"
              :disabled="isFirstPage"
            >
              ‹
            </button>

            <div class="pagination-page-number">
              {{ currentPage }}
            </div>

            <button
              class="pagination-button"
              @click="goToNextPage"
              :disabled="isLastPage"
            >
              ›
            </button>
            <button
              class="pagination-button"
              @click="goToLastPage"
              :disabled="isLastPage"
            >
              »
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { apiClient } from '../../services/api.service';
import fileService from '@/services/file.service';

// PrimeVue components
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import InputNumber from 'primevue/inputnumber';
import Avatar from 'primevue/avatar';
import Chip from 'primevue/chip';
import ProgressSpinner from 'primevue/progressspinner';
import Paginator from 'primevue/paginator';
import Toast from 'primevue/toast';

const router = useRouter();
const toast = useToast();

// State management
const loading = ref(true);
const candidates = ref([]);
const first = ref(0);
const itemsPerPage = ref(9);
const totalRecords = ref(0);

// Filter state
const filters = reactive({
  search: '',
  ageMin: null,
  ageMax: null,
  gender: null,
  employmentStatus: null,
  ethnicity: null,
  experienceMin: null,
  sortBy: null,
  page: 0,
  size: 9,
});

// Filter options
const genderOptions = [
  { label: 'All Genders', value: null },
  { label: 'Male', value: 'MALE' },
  { label: 'Female', value: 'FEMALE' },
];

const employmentStatusOptions = [
  { label: 'Any Status', value: null },
  { label: 'Full Time', value: 'FULL_TIME' },
  { label: 'Part Time', value: 'PART_TIME' },
  { label: 'Student', value: 'STUDENT' },
  { label: 'Unemployed', value: 'UNEMPLOYED' },
];

const ethnicityOptions = [
  { label: 'All Ethnicities', value: null },
  { label: 'Malay', value: 'MALAY' },
  { label: 'Chinese', value: 'CHINESE' },
  { label: 'Indian', value: 'INDIAN' },
  { label: 'Other', value: 'OTHER' },
];

const sortOptions = [
  { label: 'Name (A-Z)', value: 'NAME_ASC' },
  { label: 'Name (Z-A)', value: 'NAME_DESC' },
  { label: 'Most Experienced', value: 'EXPERIENCE_DESC' },
  { label: 'Least Experienced', value: 'EXPERIENCE_ASC' },
  { label: 'Age (Oldest First)', value: 'AGE_DESC' },
  { label: 'Age (Youngest First)', value: 'AGE_ASC' },
];

// Computed properties
const hasActiveFilters = computed(() => {
  return (
    filters.search ||
    filters.ageMin ||
    filters.ageMax ||
    filters.gender ||
    filters.employmentStatus ||
    filters.ethnicity ||
    filters.experienceMin
  );
});

const filteredCandidates = computed(() => {
  // If backend pagination is used, we need to filter on the client side
  let result = [...candidates.value];

  // Apply search filter
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    result = result.filter(
      (candidate) =>
        candidate.name.toLowerCase().includes(searchLower) ||
        (candidate.preferredLocationName &&
          candidate.preferredLocationName
            .toLowerCase()
            .includes(searchLower)) ||
        (candidate.languages &&
          candidate.languages.some((lang) =>
            lang.toLowerCase().includes(searchLower)
          )) ||
        (candidate.experienceTypes &&
          candidate.experienceTypes.some((exp) =>
            exp.toLowerCase().includes(searchLower)
          ))
    );
  }

  // Apply age filter - min
  if (filters.ageMin !== null && filters.ageMin !== undefined) {
    result = result.filter(
      (candidate) => parseInt(candidate.age) >= filters.ageMin
    );
  }

  // Apply age filter - max
  if (filters.ageMax !== null && filters.ageMax !== undefined) {
    result = result.filter(
      (candidate) => parseInt(candidate.age) <= filters.ageMax
    );
  }

  // Apply gender filter
  if (filters.gender) {
    result = result.filter((candidate) => candidate.gender === filters.gender);
  }

  // Apply employment status filter
  if (filters.employmentStatus) {
    result = result.filter(
      (candidate) => candidate.employmentStatus === filters.employmentStatus
    );
  }

  // Apply ethnicity filter
  if (filters.ethnicity) {
    result = result.filter(
      (candidate) => candidate.ethnicity === filters.ethnicity
    );
  }

  // Apply experience filter based on experienceTypes length
  if (filters.experienceMin !== null && filters.experienceMin !== undefined) {
    result = result.filter((candidate) => {
      // Use experienceCount if available, otherwise use length of experienceTypes
      const count =
        candidate.experienceCount !== undefined
          ? candidate.experienceCount
          : candidate.experienceTypes?.length || 0;
      return count >= filters.experienceMin;
    });
  }

  // Apply sorting
  if (filters.sortBy) {
    switch (filters.sortBy) {
      case 'NAME_ASC':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'NAME_DESC':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'EXPERIENCE_DESC':
        result.sort((a, b) => {
          const countA =
            a.experienceCount !== undefined
              ? a.experienceCount
              : a.experienceTypes?.length || 0;
          const countB =
            b.experienceCount !== undefined
              ? b.experienceCount
              : b.experienceTypes?.length || 0;
          return countB - countA;
        });
        break;
      case 'EXPERIENCE_ASC':
        result.sort((a, b) => {
          const countA =
            a.experienceCount !== undefined
              ? a.experienceCount
              : a.experienceTypes?.length || 0;
          const countB =
            b.experienceCount !== undefined
              ? b.experienceCount
              : b.experienceTypes?.length || 0;
          return countA - countB;
        });
        break;
      case 'AGE_DESC':
        result.sort((a, b) => parseInt(b.age) - parseInt(a.age));
        break;
      case 'AGE_ASC':
        result.sort((a, b) => parseInt(a.age) - parseInt(b.age));
        break;
    }
  }

  return result;
});

const paginatedCandidates = computed(() => {
  // Apply pagination on client side
  const startIndex = first.value;
  const endIndex = first.value + itemsPerPage.value;
  return filteredCandidates.value.slice(startIndex, endIndex);
});

// Custom pagination methods
const currentPage = computed(
  () => Math.floor(first.value / itemsPerPage.value) + 1
);
const totalPages = computed(() =>
  Math.ceil(filteredCandidates.value.length / itemsPerPage.value)
);
const isFirstPage = computed(() => currentPage.value === 1);
const isLastPage = computed(() => currentPage.value === totalPages.value);

// Methods
const clearFilters = () => {
  filters.search = '';
  filters.ageMin = null;
  filters.ageMax = null;
  filters.gender = null;
  filters.employmentStatus = null;
  filters.ethnicity = null;
  filters.experienceMin = null;
  filters.sortBy = null;

  // Reset pagination
  first.value = 0;
};

const onPageChange = (event) => {
  first.value = event.first;
  itemsPerPage.value = event.rows;

  // For server-side pagination:
  // filters.page = Math.floor(event.first / event.rows);
  // filters.size = event.rows;
  // fetchCandidates();
};

const onRowsPerPageChange = () => {
  first.value = 0;
};

const getInitials = (name) => {
  if (!name) return 'N/A';
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

const viewCandidateProfile = (candidateId) => {
  router.push(`/recruiter/candidates/${candidateId}`);
};

// Get profile picture URL with proper formatting
const getProfilePictureUrl = (url) => {
  if (!url) return null;
  return fileService.getProfilePictureUrl(url);
};

// Format the experience types for display
const formatExperienceTypes = (experienceTypes) => {
  if (!experienceTypes || experienceTypes.length === 0) return 'No experience';

  // Get unique experience types
  const uniqueTypes = [...new Set(experienceTypes)];

  // Format the types for display (convert from SNAKE_CASE to Title Case)
  return uniqueTypes.map((type) =>
    type
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  );
};

// Fetch candidates from API
const fetchCandidates = async () => {
  loading.value = true;
  try {
    // We're doing filtering on the client-side now, so we just need
    // to get all candidates once
    const response = await apiClient.get('/recruiters/candidates/search', {
      params: {
        page: 0,
        size: 1000, // Set a large size to get all candidates
      },
    });

    // Process API response
    if (response.data && response.data.statusCode === 200) {
      candidates.value = response.data.data.content;
      totalRecords.value = response.data.data.totalElements;
    } else {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load talent pool. Please try again later.',
        life: 5000,
      });
    }
  } catch (error) {
    console.error('Error loading talent pool:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load talent pool. Please try again later.',
      life: 5000,
    });
  } finally {
    loading.value = false;
  }
};

// Watch for filter changes
watch(
  () => [
    filters.search,
    filters.ageMin,
    filters.ageMax,
    filters.gender,
    filters.employmentStatus,
    filters.ethnicity,
    filters.experienceMin,
    filters.sortBy,
  ],
  () => {
    // Reset to first page when filters change
    first.value = 0;
  },
  { deep: true }
);

// Lifecycle hooks
onMounted(async () => {
  await fetchCandidates();
});

const goToFirstPage = () => {
  first.value = 0;
};

const goToPrevPage = () => {
  if (!isFirstPage.value) {
    first.value = Math.max(0, first.value - itemsPerPage.value);
  }
};

const goToNextPage = () => {
  if (!isLastPage.value) {
    first.value = first.value + itemsPerPage.value;
  }
};

const goToLastPage = () => {
  first.value = (totalPages.value - 1) * itemsPerPage.value;
};
</script>

<style scoped>
/* Custom styling for the filter panel */
:deep(.p-inputtext) {
  width: 100%;
}

/* Remove dropdown inner borders and improve styling */
:deep(.p-dropdown) {
  height: 42px;
  border-radius: 0.375rem;
  box-shadow: none !important;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;
}

:deep(.p-dropdown *) {
  border: none !important;
  box-shadow: none !important;
  outline: none !important;
}

:deep(.p-dropdown .p-dropdown-label) {
  padding: 0.5rem 0.75rem !important;
  display: flex !important;
  align-items: center !important;
  height: 100% !important;
  line-height: 1.5;
  font-size: 1rem;
}

:deep(.p-dropdown .p-dropdown-trigger) {
  width: 2.5rem !important;
  background: transparent !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

:deep(.p-dropdown .p-dropdown-clear-icon),
:deep(.p-dropdown-trigger::before),
:deep(.p-dropdown-trigger::after) {
  display: none !important;
}

:deep(.p-inputnumber) {
  width: 100%;
}

:deep(.p-inputnumber-input) {
  width: 100%;
  text-align: left;
}

:deep(.p-chip) {
  background-color: #eef2ff;
  color: #4f46e5;
  border-radius: 9999px;
  font-weight: 500;
  font-size: 0.75rem;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
}

/* Card hover effects */
.candidate-card {
  transition: all 0.3s ease;
}

.candidate-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1),
    0 8px 10px -6px rgba(0, 0, 0, 0.1);
}

:deep(.p-dropdown-panel) {
  border-radius: 0.5rem;
  margin-top: 0.25rem;
  border: 1px solid #e5e7eb;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

:deep(.p-dropdown-panel .p-dropdown-items) {
  padding: 0.25rem 0;
}

:deep(.p-dropdown-panel .p-dropdown-items .p-dropdown-item) {
  padding: 0.5rem 1rem;
  margin: 0;
}

:deep(.p-dropdown-panel .p-dropdown-items .p-dropdown-item.p-highlight) {
  background-color: #eef2ff;
  color: #4f46e5;
}

/* Paginator styling */
:deep(.p-paginator) {
  background-color: transparent;
  border: none;
}

:deep(.p-paginator .p-paginator-pages .p-paginator-page) {
  min-width: 36px;
  height: 36px;
  margin: 0 2px;
  border-radius: 8px;
}

:deep(.p-paginator .p-paginator-pages .p-paginator-page.p-highlight) {
  background-color: #e0e7ff;
  color: #4f46e5;
  font-weight: 600;
}

:deep(.p-paginator .p-paginator-first),
:deep(.p-paginator .p-paginator-prev),
:deep(.p-paginator .p-paginator-next),
:deep(.p-paginator .p-paginator-last) {
  width: 36px;
  height: 36px;
  margin: 0 2px;
  border-radius: 8px;
}

:deep(.p-paginator .p-dropdown) {
  height: 36px;
  margin-left: 10px;
}

:deep(.p-paginator .p-dropdown-label) {
  padding-top: 6px !important;
  padding-bottom: 6px !important;
}

:deep(.p-paginator-current) {
  margin-right: 10px;
}

/* Custom pagination styling */
.pagination-button {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background-color: white;
  border: 1px solid #e5e7eb;
  color: #6b7280;
  transition: all 0.2s;
}

.pagination-button:hover:not(:disabled) {
  background-color: #f3f4f6;
  color: #4f46e5;
  border-color: #d1d5db;
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-page-number {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background-color: #e0e7ff;
  color: #4f46e5;
  font-weight: 600;
}
</style>
