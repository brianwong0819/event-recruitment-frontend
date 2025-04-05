<template>
  <div class="p-6">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 mb-2">
        Welcome, {{ userGreeting }}
      </h1>
      <p class="text-gray-600">Manage your recruitment and events from here</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <!-- Active Job Listings Card -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold">Active Job Listings</h2>
          <div
            class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center"
          >
            <i class="pi pi-briefcase text-blue-600"></i>
          </div>
        </div>
        <div class="text-3xl font-bold mb-2">5</div>
        <p class="text-gray-600 text-sm">Currently published jobs</p>
      </div>

      <!-- Candidates Card -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold">Candidates</h2>
          <div
            class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center"
          >
            <i class="pi pi-users text-green-600"></i>
          </div>
        </div>
        <div class="text-3xl font-bold mb-2">28</div>
        <p class="text-gray-600 text-sm">New applications this week</p>
      </div>

      <!-- Upcoming Events Card -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold">Upcoming Events</h2>
          <div
            class="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center"
          >
            <i class="pi pi-calendar text-purple-600"></i>
          </div>
        </div>
        <div class="text-3xl font-bold mb-2">2</div>
        <p class="text-gray-600 text-sm">Events in the next 30 days</p>
      </div>
    </div>

    <!-- Recent Applications Section -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold">Recent Applications</h2>
        <Button label="View All" class="p-button-text" />
      </div>

      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Candidate
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Position
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Applied On
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="application in recentApplications"
                :key="application.id"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div
                      class="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full overflow-hidden"
                    >
                      <img
                        v-if="application.candidateImage"
                        :src="application.candidateImage"
                        class="h-full w-full object-cover"
                      />
                      <div
                        v-else
                        class="h-full w-full flex items-center justify-center text-gray-500"
                      >
                        <i class="pi pi-user"></i>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">
                        {{ application.candidateName }}
                      </div>
                      <div class="text-sm text-gray-500">
                        {{ application.candidateEmail }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">
                    {{ application.position }}
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ application.location }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ application.appliedDate }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="{
                      'bg-yellow-100 text-yellow-800':
                        application.status === 'pending',
                      'bg-green-100 text-green-800':
                        application.status === 'approved',
                      'bg-red-100 text-red-800':
                        application.status === 'rejected',
                      'bg-blue-100 text-blue-800':
                        application.status === 'interview',
                    }"
                  >
                    {{ application.statusText }}
                  </span>
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
                >
                  <Button
                    icon="pi pi-eye"
                    class="p-button-text p-button-sm"
                    tooltip="View Profile"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Active Jobs Section -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold">Your Active Job Listings</h2>
        <Button label="Post New Job" icon="pi pi-plus" />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Job Card 1 -->
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div class="p-5">
            <div class="flex items-start justify-between mb-3">
              <div>
                <h3 class="font-semibold text-lg mb-1">Event Promoter</h3>
                <p class="text-gray-600 text-sm">
                  Kuala Lumpur • 15-16 Apr 2025
                </p>
              </div>
              <div class="flex">
                <Badge value="8 Applicants" severity="success" class="mr-2" />
                <Button
                  icon="pi pi-ellipsis-v"
                  class="p-button-text p-button-rounded p-button-sm"
                />
              </div>
            </div>
            <div class="flex items-center text-sm text-gray-600 mb-4">
              <i class="pi pi-dollar mr-2"></i>
              <span class="mr-4">RM 80/day</span>
              <i class="pi pi-clock mr-2"></i>
              <span>Posted 2 days ago</span>
            </div>
            <div class="flex justify-between items-center">
              <div>
                <Tag value="Sales" class="mr-2" />
                <Tag value="Promotion" />
              </div>
              <Button
                label="View Details"
                class="p-button-outlined p-button-sm"
              />
            </div>
          </div>
        </div>

        <!-- Job Card 2 -->
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div class="p-5">
            <div class="flex items-start justify-between mb-3">
              <div>
                <h3 class="font-semibold text-lg mb-1">Event Assistant</h3>
                <p class="text-gray-600 text-sm">
                  Petaling Jaya • 20-22 Apr 2025
                </p>
              </div>
              <div class="flex">
                <Badge value="12 Applicants" severity="success" class="mr-2" />
                <Button
                  icon="pi pi-ellipsis-v"
                  class="p-button-text p-button-rounded p-button-sm"
                />
              </div>
            </div>
            <div class="flex items-center text-sm text-gray-600 mb-4">
              <i class="pi pi-dollar mr-2"></i>
              <span class="mr-4">RM 100/day</span>
              <i class="pi pi-clock mr-2"></i>
              <span>Posted 5 days ago</span>
            </div>
            <div class="flex justify-between items-center">
              <div>
                <Tag value="Customer Service" class="mr-2" />
                <Tag value="Registration" />
              </div>
              <Button
                label="View Details"
                class="p-button-outlined p-button-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions Section -->
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold mb-4">Quick Actions</h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Post Job Action -->
        <div
          class="border rounded-lg p-4 flex flex-col items-center text-center"
        >
          <div
            class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-3"
          >
            <i class="pi pi-plus text-blue-600"></i>
          </div>
          <h3 class="font-medium text-lg mb-2">Post a New Job</h3>
          <p class="text-gray-600 text-sm mb-4">
            Create a new job listing to find the perfect candidates
          </p>
          <Button label="Post Job" class="p-button-outlined" />
        </div>

        <!-- Screen Candidates Action -->
        <div
          class="border rounded-lg p-4 flex flex-col items-center text-center"
        >
          <div
            class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-3"
          >
            <i class="pi pi-check text-green-600"></i>
          </div>
          <h3 class="font-medium text-lg mb-2">Screen Candidates</h3>
          <p class="text-gray-600 text-sm mb-4">
            Review applications and schedule interviews
          </p>
          <Button label="View Applications" class="p-button-outlined" />
        </div>

        <!-- Manage Events Action -->
        <div
          class="border rounded-lg p-4 flex flex-col items-center text-center"
        >
          <div
            class="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-3"
          >
            <i class="pi pi-calendar text-purple-600"></i>
          </div>
          <h3 class="font-medium text-lg mb-2">Manage Events</h3>
          <p class="text-gray-600 text-sm mb-4">
            View and update your upcoming events
          </p>
          <Button label="View Events" class="p-button-outlined" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import Badge from 'primevue/badge';
import Tag from 'primevue/tag';
import Button from 'primevue/button';

const authStore = useAuthStore();

// User greeting
const userGreeting = computed(() => {
  return authStore.displayName || 'Recruiter';
});

// Recent applications (would normally be fetched from API)
const recentApplications = ref([
  {
    id: 1,
    candidateName: 'Sarah Johnson',
    candidateEmail: 'sarah.j@example.com',
    candidateImage: null,
    position: 'Event Promoter',
    location: 'Kuala Lumpur',
    appliedDate: 'Apr 5, 2025',
    status: 'pending',
    statusText: 'Pending Review',
  },
  {
    id: 2,
    candidateName: 'Michael Wong',
    candidateEmail: 'michael.w@example.com',
    candidateImage: null,
    position: 'Event Assistant',
    location: 'Petaling Jaya',
    appliedDate: 'Apr 3, 2025',
    status: 'interview',
    statusText: 'Interview',
  },
  {
    id: 3,
    candidateName: 'Aisha Rahman',
    candidateEmail: 'aisha.r@example.com',
    candidateImage: null,
    position: 'Event Promoter',
    location: 'Kuala Lumpur',
    appliedDate: 'Apr 2, 2025',
    status: 'approved',
    statusText: 'Approved',
  },
]);

// Active jobs (would normally be fetched from API)
const activeJobs = ref([
  {
    id: 1,
    title: 'Event Promoter',
    location: 'Kuala Lumpur',
    dates: '15-16 Apr 2025',
    salary: 'RM 80/day',
    postedDate: 'Apr 3, 2025',
    applicants: 8,
    tags: ['Sales', 'Promotion'],
  },
  {
    id: 2,
    title: 'Event Assistant',
    location: 'Petaling Jaya',
    dates: '20-22 Apr 2025',
    salary: 'RM 100/day',
    postedDate: 'Mar 30, 2025',
    applicants: 12,
    tags: ['Customer Service', 'Registration'],
  },
]);

onMounted(() => {
  // Here you would normally fetch dashboard data from API
  console.log('Recruiter Dashboard mounted');
});
</script>
