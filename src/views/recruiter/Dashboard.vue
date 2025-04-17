<template>
  <div class="p-6">
    <!-- Welcome Section with Gradient Background -->
    <div
      class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8 shadow-sm"
    >
      <h1 class="text-3xl font-bold text-gray-900 mb-2">
        Welcome, {{ userGreeting }}
      </h1>
      <p class="text-gray-600">Manage your recruitment and events from here</p>
    </div>

    <!-- Quick Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <!-- Active Job Listings Card -->
      <div
        class="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100"
      >
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold">Active Job Listings</h2>
          <div
            class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center"
          >
            <i class="pi pi-briefcase text-blue-600 text-xl"></i>
          </div>
        </div>
        <div class="text-4xl font-bold mb-2">5</div>
        <p class="text-gray-600 text-sm">Currently published jobs</p>
        <div class="mt-4">
          <router-link
            to="/recruiter/jobs"
            class="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
          >
            Manage jobs <i class="pi pi-arrow-right ml-2"></i>
          </router-link>
        </div>
      </div>

      <!-- Candidates Card -->
      <div
        class="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100"
      >
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold">Candidates</h2>
          <div
            class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center"
          >
            <i class="pi pi-users text-green-600 text-xl"></i>
          </div>
        </div>
        <div class="text-4xl font-bold mb-2">28</div>
        <p class="text-gray-600 text-sm">New applications this week</p>
        <div class="mt-4">
          <router-link
            to="/recruiter/talent-pool"
            class="text-green-600 hover:text-green-800 text-sm font-medium flex items-center"
          >
            View candidates <i class="pi pi-arrow-right ml-2"></i>
          </router-link>
        </div>
      </div>

      <!-- Upcoming Events Card -->
      <div
        class="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100"
      >
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold">Upcoming Events</h2>
          <div
            class="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center"
          >
            <i class="pi pi-calendar text-purple-600 text-xl"></i>
          </div>
        </div>
        <div class="text-4xl font-bold mb-2">2</div>
        <p class="text-gray-600 text-sm">Events in the next 30 days</p>
        <div class="mt-4">
          <router-link
            to="/recruiter/events"
            class="text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center"
          >
            Manage events <i class="pi pi-arrow-right ml-2"></i>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Quick Actions Section -->
    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-4">Quick Actions</h2>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Button
          icon="pi pi-plus"
          label="Post New Job"
          class="p-button-primary p-button-raised shadow-sm"
          @click="navigateTo('/recruiter/jobs/new')"
        />
        <Button
          icon="pi pi-search"
          label="Find Candidates"
          class="p-button-outlined p-button-raised shadow-sm"
          @click="navigateTo('/recruiter/talent-pool')"
        />
        <Button
          icon="pi pi-calendar-plus"
          label="Schedule Event"
          class="p-button-outlined p-button-raised shadow-sm"
          @click="navigateTo('/recruiter/events/new')"
        />
        <Button
          icon="pi pi-chart-line"
          label="View Analytics"
          class="p-button-outlined p-button-raised shadow-sm"
          @click="navigateTo('/recruiter/analytics')"
        />
      </div>
    </div>

    <!-- Recent Applications Section -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold">Recent Applications</h2>
        <Button
          label="View All"
          icon="pi pi-list"
          class="p-button-text"
          @click="navigateTo('/recruiter/applications')"
        />
      </div>

      <div
        class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
      >
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
                    class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
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
                  <div class="flex justify-end space-x-2">
                    <Button
                      icon="pi pi-eye"
                      class="p-button-text p-button-sm"
                      tooltip="View Profile"
                      @click="viewProfile(application.id)"
                    />
                    <Button
                      icon="pi pi-envelope"
                      class="p-button-text p-button-sm"
                      tooltip="Contact Candidate"
                      @click="contactCandidate(application.id)"
                    />
                  </div>
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
        <Button
          label="Post New Job"
          icon="pi pi-plus"
          class="p-button-sm"
          @click="navigateTo('/recruiter/jobs/new')"
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Job Card 1 -->
        <div
          class="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100"
        >
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
                <Menu :model="jobMenuItems" :popup="true" ref="menu1">
                  <template #trigger="{ toggle }">
                    <Button
                      icon="pi pi-ellipsis-v"
                      class="p-button-text p-button-rounded p-button-sm"
                      @click="toggle"
                    />
                  </template>
                </Menu>
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
                <Tag
                  value="Sales"
                  class="mr-2 bg-blue-100 text-blue-800 border-none"
                />
                <Tag
                  value="Promotion"
                  class="bg-purple-100 text-purple-800 border-none"
                />
              </div>
              <Button
                label="View Details"
                icon="pi pi-arrow-right"
                iconPos="right"
                class="p-button-outlined p-button-sm"
                @click="viewJobDetails('event-promoter')"
              />
            </div>
          </div>
        </div>

        <!-- Job Card 2 -->
        <div
          class="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100"
        >
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
                <Menu :model="jobMenuItems" :popup="true" ref="menu2">
                  <template #trigger="{ toggle }">
                    <Button
                      icon="pi pi-ellipsis-v"
                      class="p-button-text p-button-rounded p-button-sm"
                      @click="toggle"
                    />
                  </template>
                </Menu>
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
                <Tag
                  value="Customer Service"
                  class="mr-2 bg-green-100 text-green-800 border-none"
                />
                <Tag
                  value="Registration"
                  class="bg-orange-100 text-orange-800 border-none"
                />
              </div>
              <Button
                label="View Details"
                icon="pi pi-arrow-right"
                iconPos="right"
                class="p-button-outlined p-button-sm"
                @click="viewJobDetails('event-assistant')"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Upcoming Events and Recent Activity Section -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <!-- Upcoming Events -->
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold">Upcoming Events</h2>
          <Button
            icon="pi pi-calendar"
            class="p-button-text p-button-sm"
            @click="navigateTo('/recruiter/events')"
          />
        </div>
        <div class="space-y-4">
          <div class="flex items-start border-l-4 border-purple-500 pl-4 py-2">
            <div class="mr-4 bg-purple-100 text-center rounded p-2 w-16">
              <div class="text-sm font-semibold text-purple-800">APR</div>
              <div class="text-xl font-bold text-purple-800">15</div>
            </div>
            <div>
              <h3 class="font-semibold">Tech Career Fair</h3>
              <p class="text-sm text-gray-600">
                Kuala Lumpur Convention Center • 9AM-5PM
              </p>
            </div>
          </div>
          <div class="flex items-start border-l-4 border-blue-500 pl-4 py-2">
            <div class="mr-4 bg-blue-100 text-center rounded p-2 w-16">
              <div class="text-sm font-semibold text-blue-800">APR</div>
              <div class="text-xl font-bold text-blue-800">20</div>
            </div>
            <div>
              <h3 class="font-semibold">Product Launch</h3>
              <p class="text-sm text-gray-600">Pavilion KL • 10AM-3PM</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 class="text-xl font-semibold mb-4">Recent Activity</h2>
        <div class="space-y-4">
          <div class="flex items-center pb-3 border-b border-gray-100">
            <div
              class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3"
            >
              <i class="pi pi-id-card text-blue-600"></i>
            </div>
            <div>
              <p class="text-sm">
                New application received for
                <span class="font-semibold">Event Promoter</span>
              </p>
              <p class="text-xs text-gray-500 mt-1">Today, 10:23 AM</p>
            </div>
          </div>
          <div class="flex items-center pb-3 border-b border-gray-100">
            <div
              class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3"
            >
              <i class="pi pi-check-circle text-green-600"></i>
            </div>
            <div>
              <p class="text-sm">
                Candidate
                <span class="font-semibold">Aisha Rahman</span> accepted job
                offer
              </p>
              <p class="text-xs text-gray-500 mt-1">Yesterday, 3:45 PM</p>
            </div>
          </div>
          <div class="flex items-center pb-3 border-b border-gray-100">
            <div
              class="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3"
            >
              <i class="pi pi-calendar-plus text-yellow-600"></i>
            </div>
            <div>
              <p class="text-sm">
                Interview scheduled with
                <span class="font-semibold">Michael Wong</span>
              </p>
              <p class="text-xs text-gray-500 mt-1">Apr 3, 2025, 2:00 PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Menu from 'primevue/menu';
import Button from 'primevue/button';
import Badge from 'primevue/badge';
import Tag from 'primevue/tag';

const router = useRouter();
const menu1 = ref(null);
const menu2 = ref(null);
const userGreeting = 'User';

// Job menu items
const jobMenuItems = [
  {
    label: 'Edit Job',
    icon: 'pi pi-pencil',
    command: () => {},
  },
  {
    label: 'View Applicants',
    icon: 'pi pi-users',
    command: () => {},
  },
  {
    label: 'Clone Job',
    icon: 'pi pi-copy',
    command: () => {},
  },
  {
    separator: true,
  },
  {
    label: 'Unpublish',
    icon: 'pi pi-eye-slash',
    command: () => {},
  },
];

// Sample recent applications data (this would typically come from an API)
const recentApplications = [
  {
    id: 1,
    candidateName: 'Sarah Johnson',
    candidateEmail: 'sarah.j@example.com',
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
    position: 'Event Promoter',
    location: 'Kuala Lumpur',
    appliedDate: 'Apr 2, 2025',
    status: 'approved',
    statusText: 'Approved',
  },
];

// Navigation function
const navigateTo = (path) => {
  router.push(path);
};

// View profile function
const viewProfile = (candidateId) => {
  router.push(`/recruiter/candidates/${candidateId}`);
};

// Contact candidate function
const contactCandidate = (candidateId) => {
  // This would open a modal or navigate to a messaging interface
  console.log(`Contact candidate with ID: ${candidateId}`);
};

// View job details function
const viewJobDetails = (jobSlug) => {
  router.push(`/recruiter/jobs/${jobSlug}`);
};
</script>
