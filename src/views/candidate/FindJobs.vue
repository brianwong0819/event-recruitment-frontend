<template>
  <div class="p-6">
    <!-- Search and Filter Section -->
    <div
      class="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg shadow-md p-6 mb-6 border border-indigo-200"
    >
      <div class="grid grid-cols-1 lg:grid-cols-6 gap-4 mb-4">
        <!-- What (Keywords) -->
        <div class="lg:col-span-2">
          <label
            for="keywords"
            class="block text-indigo-700 text-sm font-medium mb-1"
            >Search jobs</label
          >
          <InputText
            id="keywords"
            v-model="filters.keywords"
            placeholder="Job title, skills, or company"
            class="w-full border-indigo-200 shadow-sm"
          />
        </div>

        <!-- Where (Location) -->
        <div class="lg:col-span-2">
          <label
            for="location"
            class="block text-indigo-700 text-sm font-medium mb-1"
            >Location</label
          >
          <InputText
            id="location"
            v-model="filters.location"
            placeholder="City or state"
            class="w-full border-indigo-200 shadow-sm"
          />
        </div>

        <!-- Salary Range -->
        <div class="lg:col-span-1">
          <label
            for="minSalary"
            class="block text-indigo-700 text-sm font-medium mb-1"
            >Salary (MYR)</label
          >
          <div class="flex items-center gap-2">
            <InputNumber
              id="minSalary"
              v-model="filters.minSalary"
              placeholder="Min"
              :min="0"
              :max="filters.maxSalary"
              class="w-full border-indigo-200 shadow-sm"
              locale="en-MY"
            />
            <span class="text-indigo-500">-</span>
            <InputNumber
              v-model="filters.maxSalary"
              placeholder="Max"
              :min="filters.minSalary"
              class="w-full border-indigo-200 shadow-sm"
              locale="en-MY"
            />
          </div>
        </div>

        <!-- Search Button -->
        <div class="flex items-end lg:col-span-1">
          <Button
            label="Find Jobs"
            icon="pi pi-search"
            iconPos="right"
            class="w-full bg-gradient-to-r from-indigo-500 to-purple-500 border-none hover:shadow-lg"
            @click="searchJobs"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Classification Filter -->
        <div>
          <label class="block text-indigo-700 text-sm font-medium mb-1"
            >Job Category</label
          >
          <Dropdown
            v-model="filters.jobTitle"
            :options="jobTitleOptions"
            optionLabel="label"
            placeholder="Select job category"
            class="w-full border-indigo-200 shadow-sm"
          />
        </div>

        <!-- Listing Time Filter -->
        <div>
          <label class="block text-indigo-700 text-sm font-medium mb-1"
            >Posted Within</label
          >
          <Dropdown
            v-model="filters.datePosted"
            :options="datePostedOptions"
            optionLabel="label"
            placeholder="Any time"
            class="w-full border-indigo-200 shadow-sm"
          />
        </div>
      </div>

      <!-- Additional Filters (expandable) -->
      <div v-if="showMoreFilters" class="mt-4 pt-4 border-t border-indigo-200">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Date Range Filter -->
          <div>
            <label class="block text-indigo-700 text-sm font-medium mb-1"
              >Event Date Range</label
            >
            <div class="flex gap-2">
              <Calendar
                v-model="filters.startDate"
                placeholder="Start Date"
                class="w-full border-indigo-200 shadow-sm"
                dateFormat="dd/mm/yy"
              />
              <Calendar
                v-model="filters.endDate"
                placeholder="End Date"
                class="w-full border-indigo-200 shadow-sm"
                dateFormat="dd/mm/yy"
                :minDate="filters.startDate"
              />
            </div>
          </div>

          <!-- Distance Filter -->
          <div>
            <label class="block text-indigo-700 text-sm font-medium mb-1"
              >Distance (km)
              <span class="text-xs font-normal text-gray-500"
                >(from your preferred location in profile settings)</span
              ></label
            >
            <Slider
              v-model="filters.distance"
              :min="0"
              :max="20"
              :step="2"
              class="w-full mt-6"
              @change="onDistanceChange"
            />
            <div class="flex justify-between text-indigo-600 text-xs mt-1">
              <span>{{ distanceFilterActive ? filters.distance : 0 }}km</span>
              <span>20km</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Toggle More Filters -->
      <div class="mt-4 flex justify-center gap-3">
        <Button
          @click="showMoreFilters = !showMoreFilters"
          :icon="showMoreFilters ? 'pi pi-chevron-up' : 'pi pi-chevron-down'"
          :label="showMoreFilters ? 'Less Filters' : 'More Filters'"
          class="p-button-text p-button-sm text-indigo-600 border border-indigo-300 hover:bg-indigo-100 hover:border-indigo-400"
        />
        <Button
          v-if="isFiltering"
          @click="clearFilters"
          icon="pi pi-filter-slash"
          label="Clear Filters"
          class="p-button-text p-button-sm text-red-500 border border-red-200 hover:bg-red-50 hover:border-red-300"
        />
      </div>
    </div>

    <!-- Results Section -->
    <div class="flex flex-col lg:flex-row gap-6">
      <!-- Job Listings Panel -->
      <div class="w-full lg:w-1/2 xl:w-2/5 flex flex-col">
        <!-- Sorting Options -->
        <div class="flex justify-between items-center mb-4">
          <span class="text-gray-600">
            {{ jobListings.length }} of {{ totalJobsCount }} jobs found
            <template v-if="isFiltering">(filtered)</template>
          </span>
          <Dropdown
            v-model="sortBy"
            :options="sortOptions"
            optionLabel="label"
            placeholder="Sort by relevance"
            class="w-48"
          />
        </div>

        <!-- Loading Indicator -->
        <div v-if="loading" class="flex justify-center my-8">
          <ProgressSpinner style="width: 50px; height: 50px" />
        </div>

        <!-- No Results Message -->
        <div
          v-else-if="jobListings.length === 0"
          class="flex flex-col items-center justify-center py-12 text-center"
        >
          <i class="pi pi-search text-5xl text-gray-300 mb-4"></i>
          <h3 class="text-xl font-semibold text-gray-700 mb-2">
            No jobs found
          </h3>
          <p class="text-gray-500">Try adjusting your search filters</p>
        </div>

        <!-- Job Cards - Scrollable Container -->
        <div
          v-else
          ref="jobListContainer"
          class="h-[500px] lg:h-[calc(100vh-300px)] overflow-y-auto custom-scrollbar pr-2 flex-grow"
          @scroll="onScroll"
        >
          <div>
            <div
              v-for="(job, index) in sortedJobs"
              :key="job.id"
              class="bg-white rounded-lg shadow-md p-5 cursor-pointer hover:shadow-lg transition-shadow min-h-[200px]"
              :class="{
                'border-2 border-primary-500': selectedJob?.id === job.id,
                'mb-5': index !== sortedJobs.length - 1,
              }"
              @click="selectJob(job)"
            >
              <!-- Job Layout with Logo on Left -->
              <div class="flex gap-4 mb-4">
                <!-- Company Logo - Left side -->
                <div
                  class="w-16 h-16 flex-shrink-0 flex items-center justify-center bg-gray-100 rounded-md overflow-hidden"
                >
                  <img
                    v-if="job.companyLogoUrl"
                    :src="job.companyLogoUrl"
                    :alt="`${job.company} logo`"
                    class="w-full h-full object-contain"
                    @error="$event.target.src = defaultCompanyLogo.value"
                  />
                  <i v-else class="pi pi-building text-gray-400 text-2xl"></i>
                </div>

                <!-- Job Title -->
                <div class="flex-grow">
                  <div class="flex items-center gap-2 flex-wrap mb-1">
                    <h3 class="font-semibold text-lg">{{ job.title }}</h3>
                    <!-- Job Title Type Tag -->
                    <Tag
                      :value="JobService.formatJobTitleType(job.jobTitle)"
                      severity="info"
                      class="text-xs"
                    />
                  </div>
                  <div class="flex items-center gap-1">
                    <p class="text-gray-600 text-sm">{{ job.company }}</p>
                    <!-- Recruiter Type Tag - Smaller -->
                    <Tag
                      v-if="job.recruiterType"
                      :value="job.recruiterType"
                      severity="warning"
                      class="text-[10px] py-1 px-2"
                    />
                  </div>
                </div>
              </div>

              <!-- Details - Each on separate line -->
              <div class="flex flex-col gap-2 mt-3">
                <!-- Location -->
                <div class="flex items-center text-sm text-gray-700">
                  <i class="pi pi-map-marker mr-2 text-gray-500"></i>
                  <span>{{ job.location }}</span>
                </div>

                <!-- Salary -->
                <div class="flex items-center text-sm text-gray-700">
                  <i class="pi pi-dollar mr-2 text-gray-500"></i>
                  <span>{{ job.salary }}</span>
                </div>

                <!-- Job Type -->
                <div class="flex items-center text-sm text-gray-700">
                  <i class="pi pi-briefcase mr-2 text-gray-500"></i>
                  <span>{{ job.type }}</span>
                </div>

                <!-- Event Date -->
                <div class="flex items-center text-sm text-gray-700">
                  <i class="pi pi-calendar mr-2 text-gray-500"></i>
                  <span>{{ job.dates }}</span>
                </div>

                <!-- Distance if available -->
                <div
                  v-if="job.distance !== undefined && job.distance !== null"
                  class="flex items-center text-sm text-indigo-700"
                >
                  <i class="pi pi-compass mr-2 text-indigo-500"></i>
                  <span>{{ job.distance?.toFixed(1) }} km away</span>
                </div>
              </div>

              <!-- Benefits Tags -->
              <div
                class="flex flex-wrap gap-1 mt-3 mb-2"
                v-if="job.benefits && job.benefits.length > 0"
              >
                <Tag
                  v-for="benefit in job.benefits"
                  :key="benefit"
                  :value="benefit"
                  severity="success"
                  class="text-xs my-1"
                />
              </div>

              <!-- Posted Time -->
              <div class="mt-3 text-xs text-gray-500">
                <i class="pi pi-clock mr-1"></i> Posted {{ job.postedTime }} ago
              </div>
            </div>

            <!-- Loading More Indicator -->
            <div v-if="loadingMore" class="py-4 flex justify-center">
              <ProgressSpinner style="width: 30px; height: 30px" />
            </div>

            <!-- No more jobs message -->
            <div
              v-if="noMoreJobs"
              class="py-4 text-center text-gray-500 text-sm"
            >
              No more jobs to load
            </div>
          </div>
        </div>
      </div>

      <!-- Job Details Panel -->
      <div
        class="w-full lg:w-1/2 xl:w-3/5 h-[550px] lg:h-[calc(100vh-200px)] overflow-hidden"
      >
        <div
          class="bg-white rounded-lg shadow-md h-full overflow-y-auto custom-scrollbar"
        >
          <div class="p-6">
            <JobDetail
              :job="selectedJob"
              :loading="applyLoading"
              @apply="applyForJob"
              @toggleSave="toggleSaveJob"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import InputNumber from 'primevue/inputnumber';
import Calendar from 'primevue/calendar';
import Slider from 'primevue/slider';
import Tag from 'primevue/tag';
import JobService from '@/services/JobService';
import ProgressSpinner from 'primevue/progressspinner';
import JobDetail from '@/components/candidate/JobDetail.vue';
import axios from 'axios';

// Default company logo (base64 encoded simple building icon)
const defaultCompanyLogo = ref(
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOWNhM2FmIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgY2xhc3M9ImZlYXRoZXIgZmVhdGhlci1idWlsZGluZyI+PHJlY3QgeD0iNCIgeT0iMiIgd2lkdGg9IjE2IiBoZWlnaHQ9IjIwIiByeD0iMiIgcnk9IjIiPjwvcmVjdD48bGluZSB4MT0iOSIgeTE9IjIiIHgyPSI5IiB5Mj0iMjIiPjwvbGluZT48bGluZSB4MT0iMTUiIHkxPSIyIiB4Mj0iMTUiIHkyPSIyMiI+PC9saW5lPjxsaW5lIHgxPSI0IiB5MT0iMTIiIHgyPSIyMCIgeTI9IjEyIj48L2xpbmU+PC9zdmc+'
);

// UI state variables
const showMoreFilters = ref(false);
const selectedJob = ref(null);
const loading = ref(false);
const applyLoading = ref(false);
const loadingMore = ref(false);
const noMoreJobs = ref(false);
const jobListContainer = ref(null);
const currentPage = ref(0);
const jobsPerPage = 5;
const totalJobsCount = ref(0);
const isFiltering = ref(false);

// Filter variables
const filters = ref({
  keywords: '',
  location: '',
  workType: null,
  jobTitle: null,
  datePosted: null,
  minSalary: null,
  maxSalary: null,
  startDate: null,
  endDate: null,
  distance: 0, // Default 0 means no distance filtering
  state: null,
});

// Distance filter state
const distanceFilterActive = ref(false);

// Sorting
const sortBy = ref({ value: 'relevance', label: 'Relevance' });
const sortOptions = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'dateDesc', label: 'Newest first' },
  { value: 'dateAsc', label: 'Oldest first' },
  { value: 'salaryDesc', label: 'Highest salary' },
  { value: 'salaryAsc', label: 'Lowest salary' },
];

// Get filter options from the service
const filterOptions = JobService.getFilterOptions();
const workTypeOptions = filterOptions.workTypes;
const jobTitleOptions = filterOptions.jobTitles;
const stateOptions = filterOptions.states;

const datePostedOptions = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'last3Days', label: 'Last 3 days' },
  { value: 'lastWeek', label: 'Last week' },
  { value: 'lastMonth', label: 'Last month' },
];

// Job listings
const jobListings = ref([]);

// Computed sorted jobs
const sortedJobs = computed(() => {
  let sortedArray = [...jobListings.value];

  switch (sortBy.value?.value) {
    case 'dateDesc':
      // Sort by newest (assuming posted time is in the format "Xd")
      sortedArray.sort(
        (a, b) => parseInt(a.postedTime) - parseInt(b.postedTime)
      );
      break;
    case 'dateAsc':
      // Sort by oldest
      sortedArray.sort(
        (a, b) => parseInt(b.postedTime) - parseInt(a.postedTime)
      );
      break;
    case 'salaryDesc':
      // Very simplified salary sorting - would be better with actual numbers
      sortedArray.sort((a, b) => {
        const aMatch = a.salary.match(/\d+/g);
        const bMatch = b.salary.match(/\d+/g);
        const aMax = aMatch ? Math.max(...aMatch.map(Number)) : 0;
        const bMax = bMatch ? Math.max(...bMatch.map(Number)) : 0;
        return bMax - aMax;
      });
      break;
    case 'salaryAsc':
      // Very simplified salary sorting - would be better with actual numbers
      sortedArray.sort((a, b) => {
        const aMatch = a.salary.match(/\d+/g);
        const bMatch = b.salary.match(/\d+/g);
        const aMin = aMatch ? Math.min(...aMatch.map(Number)) : 0;
        const bMin = bMatch ? Math.min(...bMatch.map(Number)) : 0;
        return aMin - bMin;
      });
      break;
    case 'relevance':
    default:
      // Default sorting - relevance
      // We'd implement a more complex algorithm here for relevance
      break;
  }

  return sortedArray;
});

// Check if scroll is near the bottom to trigger loading more
const onScroll = async (event) => {
  const container = event.target;
  const scrollPosition = container.scrollTop + container.clientHeight;
  const scrollThreshold = container.scrollHeight - 100; // Load more when 100px from bottom

  if (
    scrollPosition >= scrollThreshold &&
    !loadingMore.value &&
    !noMoreJobs.value
  ) {
    await loadMoreJobs();
  }
};

// Load more jobs when scrolling to the bottom
const loadMoreJobs = async () => {
  if (loadingMore.value || noMoreJobs.value) return;

  try {
    loadingMore.value = true;
    currentPage.value++;

    // Only include distance filter if active
    const filterParams = { ...filters.value };
    if (!distanceFilterActive.value) {
      delete filterParams.distance;
    }

    const moreData = await JobService.getJobs(
      filterParams,
      currentPage.value,
      jobsPerPage
    );

    if (moreData.length === 0) {
      noMoreJobs.value = true;
    } else {
      jobListings.value = [
        ...jobListings.value,
        ...moreData.map((job) => ({ ...job, saved: false })),
      ];

      // Check if we've loaded all available jobs
      noMoreJobs.value = jobListings.value.length >= totalJobsCount.value;
    }
  } catch (error) {
    console.error('Error loading more jobs:', error);
  } finally {
    loadingMore.value = false;
  }
};

// Function to handle distance slider change
const onDistanceChange = (value) => {
  // Only activate distance filter if value is greater than 0
  distanceFilterActive.value = value > 0;
};

// Check if any filters are applied
const checkIfFiltering = () => {
  return (
    !!filters.value.keywords ||
    !!filters.value.location ||
    !!filters.value.jobTitle ||
    !!filters.value.minSalary ||
    !!filters.value.maxSalary ||
    !!filters.value.startDate ||
    !!filters.value.endDate ||
    distanceFilterActive.value ||
    !!filters.value.datePosted
  );
};

// Fetch initial jobs from service
const fetchJobs = async () => {
  try {
    loading.value = true;
    currentPage.value = 0;
    noMoreJobs.value = false;

    // Only include distance filter if active
    const filterParams = { ...filters.value };
    if (!distanceFilterActive.value) {
      delete filterParams.distance;
    }

    // Get total count of available jobs
    totalJobsCount.value = await JobService.getAllJobsCount(filterParams);

    const data = await JobService.getJobs(
      filterParams,
      currentPage.value,
      jobsPerPage
    );

    jobListings.value = data.map((job) => ({
      ...job,
      saved: false, // Initialize all jobs as not saved
    }));

    // Check if filters are applied
    isFiltering.value = checkIfFiltering();

    // Check if there might be more jobs
    noMoreJobs.value =
      data.length < jobsPerPage ||
      jobListings.value.length >= totalJobsCount.value;

    // Don't auto-select a job
    // Leave selectedJob.value as null so user needs to click to see details
  } catch (error) {
    console.error('Error fetching jobs:', error);
  } finally {
    loading.value = false;
  }
};

// Select a job to display details
const selectJob = async (job) => {
  try {
    // Get detailed job information when selecting
    const jobDetail = await JobService.getJobById(job.id);

    // Also call the job view tracking API (requires auth token)
    try {
      const token = JobService.getAuthToken();
      if (token) {
        // Make the job view tracking API call
        await axios.post(
          `http://localhost:8080/api/jobs/${job.id}/view`,
          {},
          {
            headers: { Authorization: token },
          }
        );
        console.log(`Tracked view for job ${job.id}`);
      }
    } catch (viewError) {
      // Just log the error, don't prevent showing job details
      console.error('Error tracking job view:', viewError);
    }

    if (jobDetail) {
      // Keep saved status from the job card
      jobDetail.saved = job.saved;
      selectedJob.value = jobDetail;
    } else {
      selectedJob.value = job;
    }
  } catch (error) {
    console.error('Error fetching job details:', error);
    selectedJob.value = job;
  }
};

// Toggle save job
const toggleSaveJob = async (job) => {
  try {
    // Call the service to save/unsave the job
    await JobService.saveJob(job.id, !job.saved);

    // Update the job saved status
    job.saved = !job.saved;
  } catch (error) {
    console.error('Error saving job:', error);
  }
};

// Router
const router = useRouter();

// Apply for a job
const applyForJob = async (job) => {
  // Navigate to the job application page
  if (job && job.id) {
    router.push({
      name: 'JobApplication',
      params: { jobId: job.id },
    });
  }
};

// Search jobs with filters
const searchJobs = async () => {
  // Reset pagination
  currentPage.value = 0;
  noMoreJobs.value = false;

  // Clear selected job when applying new filters
  selectedJob.value = null;

  jobListings.value = [];

  // Check if distance filter should be active
  if (filters.value.distance !== 0) {
    distanceFilterActive.value = true;
  }

  await fetchJobs();
};

// Clear all filters and search again
const clearFilters = async () => {
  // Reset all filters to default values
  filters.value = {
    keywords: '',
    location: '',
    workType: null,
    jobTitle: null,
    datePosted: null,
    minSalary: null,
    maxSalary: null,
    startDate: null,
    endDate: null,
    distance: 0, // Reset to 0 (no distance filtering)
    state: null,
  };

  // Reset distance filter state
  distanceFilterActive.value = false;

  // Reset sort order
  sortBy.value = { value: 'relevance', label: 'Relevance' };

  // Reset pagination and search
  currentPage.value = 0;
  noMoreJobs.value = false;
  selectedJob.value = null;
  jobListings.value = [];

  // Run the search
  await fetchJobs();
};

// Initialize with data
onMounted(async () => {
  await fetchJobs();
  // Not pre-selecting any job (commented out previous code)
  // selectedJob.value = null;
});
</script>

<style scoped>
/* Button gradient styling */
:deep(.p-button) {
  transition: all 0.3s ease;
}

:deep(.bg-gradient-to-r) {
  background-size: 200% auto;
  transition: 0.5s;
}

:deep(.bg-gradient-to-r:hover) {
  background-position: right center;
  box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.3);
}

/* More filters button */
:deep(.p-button-text.text-indigo-600) {
  transition: all 0.3s ease;
}

:deep(.p-button-text.text-indigo-600:hover) {
  background-color: rgba(99, 102, 241, 0.1) !important;
  border-color: #6366f1 !important;
}

/* Highlight selected job card */
.border-primary-500 {
  border-color: #6366f1 !important;
}

/* Custom scrollbar styling */
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #ddd;
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #ccc;
}

.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #ddd #f1f1f1;
}

/* Form controls styling */
:deep(.p-dropdown) {
  border-radius: 0.375rem;
  height: 42px; /* Match height with other inputs */
  display: flex !important;
  align-items: center !important;
  padding: 0 !important;
}

:deep(.p-calendar) {
  border-radius: 0.375rem;
  height: 42px;
}

:deep(.p-inputtext) {
  border-radius: 0.375rem;
  height: 42px;
}

:deep(.p-inputnumber) {
  height: 42px;
}

:deep(.p-slider .p-slider-handle) {
  background: #6366f1;
  border: 2px solid #6366f1;
}

:deep(.p-slider-range) {
  background: #6366f1;
}

/* Remove dropdown inner borders */
:deep(.p-dropdown-label),
:deep(.p-dropdown-trigger),
:deep(.p-dropdown.p-component) {
  border: none;
  box-shadow: none;
}

:deep(.p-dropdown-trigger) {
  border-left: none;
}

/* Fix dropdown height and alignment */
:deep(.p-dropdown .p-component) {
  height: 42px !important;
}

:deep(.p-dropdown-panel .p-dropdown-items .p-dropdown-item) {
  padding: 0.5rem 1rem;
}

:deep(.p-dropdown .p-dropdown-label) {
  padding: 10px 12px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: flex-start !important;
  height: 100% !important;
  margin: 0 !important;
  position: static !important;
  transform: none !important;
  text-align: left !important;
  line-height: normal !important;
  vertical-align: middle !important;
}

:deep(.p-dropdown .p-dropdown-label.p-placeholder) {
  color: #9ca3af;
}

:deep(.p-dropdown-items-wrapper) {
  padding: 0 !important;
}

:deep(.p-dropdown-panel) {
  margin-top: 4px !important;
}

:deep(.p-inputtext::placeholder) {
  line-height: 1.5rem;
}

:deep(.p-calendar .p-inputtext) {
  display: flex;
  align-items: center;
}
</style>
