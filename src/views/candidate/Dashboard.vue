<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- Reputation Header Section -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-8 reputation-card">
      <div
        class="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
      >
        <div>
          <h1 class="text-2xl font-bold text-gray-900 mb-2">
            Welcome, {{ userProfile ? userProfile.name : 'Candidate' }}
          </h1>
          <p class="text-gray-600">
            Here's what's happening with your job search
          </p>
        </div>

        <div class="flex items-center reputation-score-container">
          <div class="relative mr-5">
            <div
              class="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center border-4 border-white shadow-lg reputation-badge"
            >
              <i class="pi pi-shield text-blue-600 text-2xl"></i>
            </div>
            <div
              class="absolute -bottom-1 -right-1 bg-green-500 text-white text-xs font-bold w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow reputation-badge-level"
            >
              {{ getReputationLevel(reputationData?.score?.score || 0) }}
            </div>
          </div>
          <div>
            <div class="flex items-center">
              <span class="text-3xl font-bold mr-2 animate-number">{{
                Math.round(reputationData?.score?.score || 0)
              }}</span>
              <Tag
                :severity="
                  getReputationSeverity(reputationData?.score?.score || 0)
                "
                value="Reputation"
                class="animate-tag"
              />
            </div>
            <div class="text-sm text-gray-600 mt-1">
              Your current reputation score
            </div>
            <div class="w-32 md:w-48 bg-gray-200 rounded-full h-2 mt-2">
              <div
                class="h-2 rounded-full reputation-progress-bar"
                :class="
                  getReputationColorClass(reputationData?.score?.score || 0)
                "
                :style="{
                  width: `${Math.min(100, reputationData?.score?.score || 0)}%`,
                }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Reputation History Section -->
    <div
      class="bg-white rounded-lg shadow-md mb-8 overflow-hidden history-card"
    >
      <div class="px-6 py-4 border-b flex justify-between items-center">
        <h2 class="text-xl font-semibold flex items-center">
          <i class="pi pi-history mr-2 text-blue-600"></i>
          Reputation History
        </h2>
        <div class="flex items-center">
          <span class="mr-2 text-sm">Filter:</span>
          <SelectButton
            v-model="historyFilter"
            :options="filterOptions"
            optionLabel="label"
            class="p-selectbutton-sm"
          />
        </div>
      </div>
      <div class="p-6">
        <div v-if="filteredHistory.length > 0" class="divide-y">
          <div
            v-for="(item, index) in filteredHistory"
            :key="item.id"
            class="py-3 first:pt-0 last:pb-0 history-item"
            :style="{ animationDelay: `${index * 100}ms` }"
          >
            <div class="flex items-start">
              <div
                :class="[
                  'w-10 h-10 rounded-full flex items-center justify-center mr-4 mt-1',
                  item.scoreChange >= 0 ? 'bg-green-100' : 'bg-red-100',
                ]"
              >
                <i
                  :class="[
                    item.scoreChange >= 0
                      ? 'pi pi-plus-circle text-green-600'
                      : 'pi pi-minus-circle text-red-600',
                  ]"
                ></i>
              </div>
              <div class="flex-grow">
                <div class="flex justify-between items-start">
                  <div>
                    <h3 class="font-semibold text-gray-900">
                      {{ formatEventType(item.eventType) }}
                    </h3>
                    <p class="text-gray-700">{{ item.description }}</p>
                  </div>
                  <div
                    :class="[
                      'font-bold text-lg',
                      item.scoreChange >= 0 ? 'text-green-600' : 'text-red-600',
                    ]"
                  >
                    {{ item.scoreChange >= 0 ? '+' : '' }}{{ item.scoreChange }}
                  </div>
                </div>
                <p class="text-sm text-gray-500 mt-2">
                  {{ formatDate(item.createdAt) }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-12 text-gray-500">
          <i class="pi pi-inbox text-5xl mb-3"></i>
          <p>No reputation history found</p>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 stats-card-group">
      <!-- Available Jobs Card -->
      <div
        class="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow duration-300 border-t-4 border-blue-500 stats-main-card"
      >
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold">Available Jobs</h2>
          <div
            class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center"
          >
            <i class="pi pi-briefcase text-blue-600 text-xl"></i>
          </div>
        </div>
        <div class="text-3xl font-bold mb-2">{{ totalAvailableJobs }}</div>
        <p class="text-gray-600 text-sm">Jobs matching your profile</p>
        <div class="mt-4">
          <Button
            label="Find Jobs"
            class="p-button-sm p-button-outlined w-full"
            severity="info"
            icon="pi pi-search"
            @click="$router.push('/candidate/jobs')"
          />
        </div>
      </div>

      <!-- Applications Card -->
      <div
        class="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow duration-300 border-t-4 border-green-500 stats-main-card"
      >
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold">Your Applications</h2>
          <div
            class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center"
          >
            <i class="pi pi-check-square text-green-600 text-xl"></i>
          </div>
        </div>
        <div class="text-3xl font-bold mb-2">{{ totalApplications }}</div>
        <p class="text-gray-600 text-sm">Active applications</p>
        <div class="mt-4">
          <Button
            label="View Applications"
            class="p-button-sm p-button-outlined w-full"
            severity="success"
            icon="pi pi-list"
            @click="$router.push('/candidate/applications')"
          />
        </div>
      </div>

      <!-- Upcoming Events Card -->
      <div
        class="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow duration-300 border-t-4 border-purple-500 stats-main-card"
      >
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold">Upcoming Events</h2>
          <div
            class="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center"
          >
            <i class="pi pi-calendar text-purple-600 text-xl"></i>
          </div>
        </div>
        <div class="text-3xl font-bold mb-2">{{ upcomingEvents }}</div>
        <p class="text-gray-600 text-sm">Scheduled in next 7 days</p>
        <div class="mt-4">
          <Button
            label="View Applications"
            class="p-button-sm p-button-outlined w-full"
            severity="secondary"
            icon="pi pi-list"
            @click="$router.push('/candidate/applications')"
          />
        </div>
      </div>
    </div>

    <!-- Recommended Jobs Section -->
    <div class="mb-8 recommended-jobs">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold flex items-center">
          <i class="pi pi-star-fill mr-2 text-yellow-500"></i>
          Recommended for You
        </h2>
        <Button
          label="View All Jobs"
          icon="pi pi-external-link"
          class="p-button-text"
          @click="$router.push('/candidate/jobs')"
        />
      </div>

      <div
        v-if="recommendedJobs.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div
          v-for="job in recommendedJobs"
          :key="job.id"
          class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden job-card"
        >
          <div class="p-5">
            <div class="flex items-start justify-between mb-3">
              <div class="flex items-start">
                <img
                  v-if="job.companyLogoUrl"
                  :src="`http://localhost:8080${job.companyLogoUrl}`"
                  class="w-10 h-10 object-contain mr-3 rounded"
                  alt="Company logo"
                />
                <div>
                  <h3 class="font-semibold text-lg mb-1">{{ job.title }}</h3>
                  <p class="text-gray-600 text-sm">
                    {{ job.companyName }}
                    <span v-if="job.locations && job.locations.length > 0">
                      • {{ job.locations[0] }}
                    </span>
                  </p>
                </div>
              </div>
              <Badge
                v-if="job.availablePositions > 5"
                value="Popular"
                severity="warning"
              />
              <Badge
                v-else-if="
                  new Date(job.createdAt) >
                  new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                "
                value="New"
                severity="success"
              />
            </div>
            <div class="flex items-center text-sm text-gray-600 mb-4">
              <i class="pi pi-dollar mr-2"></i>
              <span class="mr-4">{{
                formatSalary(job.salary, job.salaryType)
              }}</span>
              <i class="pi pi-calendar mr-2"></i>
              <span>{{
                formatDateRange(job.earliestStartDate, job.latestEndDate)
              }}</span>
            </div>
            <div>
              <Tag :value="job.jobTitleType" class="mr-2" />
              <Tag
                v-if="job.totalPositions > 1"
                :value="`${job.totalPositions} positions`"
              />
            </div>
          </div>
        </div>
      </div>

      <div v-else class="bg-white rounded-lg shadow-md p-8 text-center">
        <div class="flex flex-col items-center">
          <i class="pi pi-search text-4xl text-gray-400 mb-4"></i>
          <h3 class="text-lg font-medium text-gray-600 mb-2">No jobs found</h3>
          <p class="text-gray-500 mb-4">
            We couldn't find any recommended jobs for you at the moment.
          </p>
          <Button
            label="Browse All Jobs"
            icon="pi pi-search"
            @click="$router.push('/candidate/jobs')"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { format } from 'date-fns';
import axios from 'axios';
import Badge from 'primevue/badge';
import Tag from 'primevue/tag';
import SelectButton from 'primevue/selectbutton';
import ProgressBar from 'primevue/progressbar';
import Button from 'primevue/button';

const router = useRouter();

// User data
const userProfile = ref(null);
const profileCompletionPercentage = ref(65);

// Reputation data
const reputationData = ref(null);
const isLoading = ref(true);
const error = ref(null);

// Jobs data
const recommendedJobs = ref([]);
const totalAvailableJobs = ref(0);
const totalApplications = ref(0);
const upcomingEvents = ref(0);

// History filter options
const historyFilter = ref('all');
const filterOptions = [
  { label: 'All', value: 'all' },
  { label: 'Positive', value: 'positive' },
  { label: 'Negative', value: 'negative' },
];

// Computed properties
const filteredHistory = computed(() => {
  if (!reputationData.value || !reputationData.value.history) return [];

  if (historyFilter.value === 'all') {
    return reputationData.value.history;
  }
  return reputationData.value.history.filter((item) =>
    historyFilter.value === 'positive'
      ? item.scoreChange >= 0
      : item.scoreChange < 0
  );
});

const getProfileCompletionClass = () => {
  if (profileCompletionPercentage.value < 30) return 'p-progressbar-danger';
  if (profileCompletionPercentage.value < 70) return 'p-progressbar-warning';
  return 'p-progressbar-success';
};

const getReputationSeverity = (score) => {
  if (score < 60) return 'danger';
  if (score < 80) return 'warning';
  if (score < 95) return 'success';
  return 'info';
};

const getReputationColorClass = (score) => {
  if (score < 60) return 'bg-red-500';
  if (score < 80) return 'bg-yellow-500';
  if (score < 95) return 'bg-green-500';
  return 'bg-blue-500';
};

const getReputationLevel = (score) => {
  if (score < 60) return 'D';
  if (score < 80) return 'C';
  if (score < 95) return 'B';
  return 'A';
};

// Format event type for better display
const formatEventType = (eventType) => {
  if (!eventType) return '';

  // Convert from SCREAMING_SNAKE_CASE to Title Case With Spaces
  return eventType
    .split('_')
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');
};

// Format date with time
const formatDateTime = (dateString, timeString) => {
  const date = new Date(dateString);
  return `${format(date, 'dd MMM yyyy')} ${
    timeString ? `• ${timeString.substring(0, 5)}` : ''
  }`;
};

// Format date range
const formatDateRange = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (format(start, 'MMM yyyy') === format(end, 'MMM yyyy')) {
    return `${format(start, 'dd')}-${format(end, 'dd MMM yyyy')}`;
  }

  return `${format(start, 'dd MMM')}-${format(end, 'dd MMM yyyy')}`;
};

// Format salary
const formatSalary = (amount, type) => {
  if (!amount || !type) return '';

  let formattedType = '';
  switch (type) {
    case 'PER_DAY':
      formattedType = '/day';
      break;
    case 'PER_HOUR':
      formattedType = '/hr';
      break;
    case 'PER_MONTH':
      formattedType = '/month';
      break;
    default:
      formattedType = '';
  }

  return `RM ${amount}${formattedType}`;
};

// Methods
const navigateToJobApplication = (jobId) => {
  router.push(`/candidate/apply/${jobId}`);
};

const formatDate = (dateString) => {
  return format(new Date(dateString), 'MMM d, yyyy');
};

// Fetch user profile data
const fetchUserProfile = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get('http://localhost:8080/api/profile', {
      headers: {
        Authorization: token,
      },
    });
    if (response.data && response.data.statusCode === 200) {
      userProfile.value = response.data.data;
    }
  } catch (err) {
    console.error('Error fetching user profile:', err);
    error.value = 'Failed to load user profile data';
  }
};

// Fetch reputation data
const fetchReputationData = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(
      'http://localhost:8080/api/candidates/reputation',
      {
        headers: {
          Authorization: token,
        },
      }
    );
    if (response.data && response.data.statusCode === 200) {
      reputationData.value = response.data.data;
    }
  } catch (err) {
    console.error('Error fetching reputation data:', err);
    error.value = 'Failed to load reputation data';
  } finally {
    isLoading.value = false;
  }
};

// Fetch jobs data
const fetchRecommendedJobs = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get('http://localhost:8080/api/jobs/public', {
      headers: {
        Authorization: token,
      },
      params: {
        page: 0,
        size: 2,
      },
    });
    if (response.data && response.data.statusCode === 200) {
      recommendedJobs.value = response.data.data.content;
      totalAvailableJobs.value = response.data.data.totalElements;
    }
  } catch (err) {
    console.error('Error fetching recommended jobs:', err);
  }
};

// Fetch applications count
const fetchApplicationsCount = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(
      'http://localhost:8080/api/candidates/applications',
      {
        headers: {
          Authorization: token,
        },
      }
    );
    if (response.data && response.data.statusCode === 200) {
      // Calculate the count from the applications list
      totalApplications.value = response.data.data
        ? response.data.data.length
        : 0;
    }
  } catch (err) {
    console.error('Error fetching applications count:', err);
    // Set a default value if the API fails
    totalApplications.value = 0;
  }
};

// Fetch upcoming events from applications that have HIRED status
const fetchUpcomingEvents = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(
      'http://localhost:8080/api/candidates/applications',
      {
        headers: {
          Authorization: token,
        },
      }
    );

    if (response.data && response.data.statusCode === 200) {
      console.log('All applications:', response.data.data);

      // Filter applications with HIRED status
      const hiredApplications = response.data.data.filter(
        (app) => app.applicationStatus === 'HIRED'
      );
      console.log('Hired applications:', hiredApplications);

      // Get today's date
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      console.log('Today (for comparison):', today);

      // Filter hired applications that have at least one future work date
      const upcomingHiredApplications = hiredApplications.filter((app) => {
        if (app.workDates && app.workDates.length) {
          // Check if at least one work date is in the future
          return app.workDates.some((dateStr) => {
            const workDate = new Date(dateStr);
            workDate.setHours(0, 0, 0, 0);
            return workDate >= today;
          });
        }
        return false;
      });

      console.log('Upcoming hired applications:', upcomingHiredApplications);
      console.log(
        'Number of upcoming hired applications:',
        upcomingHiredApplications.length
      );

      // Set the count to the number of hired applications
      upcomingEvents.value = upcomingHiredApplications.length;

      console.log('Final upcoming events count:', upcomingEvents.value);
    }
  } catch (err) {
    console.error('Error fetching upcoming events:', err);
    upcomingEvents.value = 0;
  }
};

// Lifecycle hooks
onMounted(async () => {
  try {
    await Promise.all([
      fetchUserProfile(),
      fetchReputationData(),
      fetchRecommendedJobs(),
      fetchApplicationsCount(),
      fetchUpcomingEvents(),
    ]);
  } catch (err) {
    console.error('Error in dashboard initialization:', err);
  }
});
</script>

<style scoped>
.reputation-card {
  animation: fadeIn 0.5s ease;
}

.reputation-badge {
  animation: scaleIn 0.6s ease;
}

.reputation-badge-level {
  animation: fadeIn 0.8s ease;
}

.animate-number {
  animation: countUp 1.5s ease;
}

.animate-tag {
  animation: fadeIn 0.7s ease;
}

.reputation-progress-bar {
  animation: growWidth 1.2s ease-in-out;
}

.history-card {
  animation: fadeIn 0.6s ease;
}

.history-item {
  animation: slideInRight 0.5s ease;
  animation-fill-mode: both;
}

.stats-card-group {
  animation: fadeIn 0.8s ease;
}

.stats-main-card {
  animation: fadeInUp 0.8s ease;
  animation-fill-mode: both;
}

.stats-main-card:nth-child(1) {
  animation-delay: 0.3s;
}

.stats-main-card:nth-child(2) {
  animation-delay: 0.5s;
}

.stats-main-card:nth-child(3) {
  animation-delay: 0.7s;
}

.recommended-jobs {
  animation: fadeIn 0.5s ease;
  animation-delay: 0.8s;
  animation-fill-mode: both;
}

.job-card {
  animation: fadeIn 0.8s ease;
  animation-fill-mode: both;
}

.job-card:nth-child(1) {
  animation-delay: 0.9s;
}

.job-card:nth-child(2) {
  animation-delay: 1s;
}

.profile-completion {
  animation: fadeIn 0.8s ease;
  animation-delay: 1.1s;
  animation-fill-mode: both;
}

.profile-item {
  animation: fadeIn 0.5s ease;
  animation-fill-mode: both;
}

.profile-item:nth-child(1) {
  animation-delay: 1.2s;
}

.profile-item:nth-child(2) {
  animation-delay: 1.3s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scaleIn {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes growWidth {
  from {
    width: 0%;
  }
  to {
    width: 100%;
  }
}

@keyframes countUp {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(15px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.p-selectbutton-sm :deep(.p-button) {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
}

.timeline-event {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
}

.positive-event {
  background-color: rgba(220, 252, 231, 0.5);
  border-left: 3px solid #22c55e;
}

.negative-event {
  background-color: rgba(254, 236, 235, 0.5);
  border-left: 3px solid #ef4444;
}

.p-progressbar-danger :deep(.p-progressbar-value) {
  background-color: #ef4444;
}

.p-progressbar-warning :deep(.p-progressbar-value) {
  background-color: #f59e0b;
}

.p-progressbar-success :deep(.p-progressbar-value) {
  background-color: #22c55e;
}
</style>
