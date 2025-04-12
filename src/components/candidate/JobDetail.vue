<template>
  <div>
    <!-- Job with details -->
    <div v-if="job">
      <!-- Job Header -->
      <div class="mb-6">
        <!-- Save Button -->
        <div class="flex justify-end mb-1">
          <Button
            icon="pi pi-bookmark"
            :class="
              job.saved
                ? 'p-button-warning'
                : 'p-button-outlined p-button-secondary'
            "
            class="p-button-rounded"
            @click="$emit('toggleSave', job)"
          />
        </div>

        <!-- Job Layout with Logo on Left -->
        <div class="flex gap-4 mb-4">
          <!-- Company Logo - Left side -->
          <div
            class="w-20 h-20 flex-shrink-0 flex items-center justify-center bg-gray-100 rounded-md overflow-hidden"
          >
            <img
              v-if="job.companyLogoUrl"
              :src="job.companyLogoUrl"
              :alt="`${job.company} logo`"
              class="w-full h-full object-contain"
              @error="$event.target.src = defaultCompanyLogo"
            />
            <i v-else class="pi pi-building text-gray-400 text-3xl"></i>
          </div>

          <!-- Job Info -->
          <div class="flex-grow">
            <div class="flex items-center gap-2 flex-wrap mb-2">
              <h2 class="text-2xl font-bold">{{ job.title }}</h2>
              <!-- Job Title Type Tag -->
              <Tag
                :value="JobService.formatJobTitleType(job.jobTitle)"
                severity="info"
              />
            </div>
            <div class="flex items-center gap-1 mb-2">
              <p class="text-lg text-gray-700">{{ job.company }}</p>
              <!-- Recruiter Type Tag - Smaller -->
              <Tag
                v-if="job.recruiterType"
                :value="job.recruiterType"
                severity="warning"
                class="text-[11px] py-1 px-2"
              />
            </div>
          </div>
        </div>

        <!-- Details - Each on separate line -->
        <div class="flex flex-col gap-3 mb-4">
          <!-- Location -->
          <div class="flex items-center text-gray-600">
            <i class="pi pi-map-marker mr-2 text-gray-500"></i>
            <span>{{ job.location }}</span>
          </div>

          <!-- Salary -->
          <div class="flex items-center text-gray-600">
            <i class="pi pi-dollar mr-2 text-gray-500"></i>
            <span>{{ job.salary }}</span>
          </div>

          <!-- Project Name if available -->
          <div v-if="job.projectName" class="flex items-center text-indigo-600">
            <i class="pi pi-tag mr-2"></i>
            <span>Project: {{ job.projectName }}</span>
          </div>
        </div>
      </div>

      <!-- Key Details -->
      <div class="grid grid-cols-1 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div class="flex items-center gap-2">
          <i class="pi pi-briefcase text-gray-500"></i>
          <h3 class="text-sm font-semibold text-gray-500">Job Type:</h3>
          <p>{{ job.type }}</p>
        </div>

        <div class="flex items-center gap-2">
          <i class="pi pi-calendar text-gray-500"></i>
          <h3 class="text-sm font-semibold text-gray-500">Event Date:</h3>
          <p>{{ job.dates }}</p>
        </div>

        <div class="flex items-center gap-2">
          <i class="pi pi-clock text-gray-500"></i>
          <h3 class="text-sm font-semibold text-gray-500">Posted:</h3>
          <p>{{ job.postedTime }} ago</p>
        </div>
      </div>

      <!-- Section Separator -->
      <div class="border-b border-gray-200 my-6"></div>

      <!-- Additional Details -->
      <div class="grid grid-cols-1 gap-4 mb-6 p-4 bg-indigo-50 rounded-lg">
        <div class="flex items-center gap-2">
          <i class="pi pi-credit-card text-indigo-600"></i>
          <h3 class="text-sm font-semibold text-indigo-700">Payment Terms:</h3>
          <p class="text-indigo-900">
            {{ job.paymentTerms || 'Not specified' }}
          </p>
        </div>

        <div class="flex items-center gap-2">
          <i class="pi pi-check-circle text-indigo-600"></i>
          <h3 class="text-sm font-semibold text-indigo-700">
            Available Positions:
          </h3>
          <p class="text-indigo-900">{{ job.availablePositions || 0 }}</p>
        </div>
      </div>

      <!-- Section Separator -->
      <div class="border-b border-gray-200 my-6"></div>

      <!-- Job Description -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold mb-3">Job Description</h3>
        <div class="text-gray-700 leading-relaxed">
          <p>{{ job.description }}</p>
        </div>
      </div>

      <!-- Section Separator -->
      <div class="border-b border-gray-200 my-6"></div>

      <!-- Requirements -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold mb-3">Requirements</h3>
        <ul class="list-disc list-inside space-y-2 text-gray-700">
          <li v-for="(req, index) in job.requirements" :key="index">
            {{ req }}
          </li>
          <li v-if="!job.requirements || job.requirements.length === 0">
            No specific requirements listed
          </li>
        </ul>
      </div>

      <!-- Section Separator -->
      <div class="border-b border-gray-200 my-6"></div>

      <!-- Benefits -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold mb-3">Benefits</h3>
        <ul class="list-disc list-inside space-y-2 text-gray-700">
          <li v-for="(benefit, index) in job.benefits" :key="index">
            {{ benefit }}
          </li>
          <li v-if="!job.benefits || job.benefits.length === 0">
            No specific benefits listed
          </li>
        </ul>
      </div>

      <!-- Section Separator -->
      <div class="border-b border-gray-200 my-6"></div>

      <!-- Job Schedules -->
      <div v-if="job.schedules && job.schedules.length > 0" class="mb-6">
        <h3 class="text-lg font-semibold mb-3">Work Schedule</h3>
        <div
          v-for="(schedule, scheduleIndex) in job.schedules"
          :key="scheduleIndex"
          class="mb-4 p-4 border border-gray-200 rounded-lg bg-white shadow-sm"
        >
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 text-sm">
            <div>
              <span class="font-semibold text-gray-700">Date Range:</span>
              <div class="mt-1 text-gray-800">
                {{ formatDateRange(schedule.startDate, schedule.endDate) }}
              </div>
            </div>
            <div>
              <span class="font-semibold text-gray-700">Working Hours:</span>
              <div class="mt-1 text-gray-800">
                {{ formatTimeRange(schedule.startTime, schedule.endTime) }}
              </div>
            </div>
            <div>
              <span class="font-semibold text-gray-700">Rest Time:</span>
              <div class="mt-1 text-gray-800">
                {{ formatRestTime(schedule.hoursOfRestTime) }}
              </div>
            </div>
          </div>

          <!-- Separator within schedule card -->
          <div class="border-t border-gray-200 my-4"></div>

          <!-- Schedule Dates with Locations - Grouped by dates -->
          <div
            v-if="schedule.scheduleDates && schedule.scheduleDates.length > 0"
            class="mt-4"
          >
            <h4 class="font-medium text-gray-700 mb-3">
              Work Days and Locations:
            </h4>
            <div
              v-for="(dateGroup, dateGroupIndex) in groupedScheduleDates(
                schedule.scheduleDates
              )"
              :key="dateGroupIndex"
              class="mb-4 pl-4 border-l-2 border-indigo-200"
            >
              <div class="font-medium mb-2">
                <span class="text-indigo-700 font-bold">Date:</span>
                <span class="text-indigo-600 ml-1">{{
                  dateGroup.formattedDates
                }}</span>
              </div>
              <div class="pl-2 mb-2">
                <div class="font-medium mb-2">
                  <span class="text-indigo-700 font-bold">Location:</span>
                </div>
                <div class="pl-4">
                  <div
                    v-for="(location, locationIndex) in dateGroup.locations"
                    :key="locationIndex"
                    class="text-sm mb-1 flex items-start"
                  >
                    <span class="mr-2 text-indigo-600"
                      >{{ locationIndex + 1 }}.</span
                    >
                    <div>
                      <span
                        class="text-gray-800 cursor-pointer hover:text-indigo-600 hover:underline"
                        @click="showLocationDetails(location.id)"
                        >{{ location.name }}</span
                      >
                      <span
                        v-if="location.notes"
                        class="text-gray-500 ml-1 italic"
                      >
                        ({{ location.notes }})
                      </span>
                      <span class="text-gray-500 ml-1">
                        ({{ location.available }} positions available)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Apply Button -->
      <div class="flex justify-center mt-8">
        <Button
          label="Apply Now"
          icon="pi pi-send"
          class="p-button-lg"
          @click="$emit('apply', job)"
          :loading="loading"
        />
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="flex flex-col items-center justify-center h-full text-center py-12"
    >
      <i class="pi pi-arrow-left text-5xl text-gray-300 mb-4"></i>
      <h3 class="text-xl font-semibold text-gray-700 mb-2">Select a job</h3>
      <p class="text-gray-500 max-w-md mb-4">
        Click on any job from the list on the left to view its details here
      </p>

      <div
        class="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-3"
      >
        <i class="pi pi-search text-indigo-500 text-xl"></i>
      </div>
      <p class="text-sm text-gray-500 max-w-sm">
        <span class="font-medium text-indigo-600">Tip:</span> Use the filters
        above to find jobs that match your preferences
      </p>

      <!-- Empty State Illustration -->
      <img
        src="@/assets/select-job.svg"
        alt="Select a job"
        class="mt-8 max-w-xs rounded-lg opacity-50"
        @error="onImageError"
      />
    </div>

    <Dialog
      v-model:visible="locationDialog"
      header="Location Details"
      :style="{ width: '450px' }"
      :modal="true"
      :closable="true"
      class="location-dialog"
    >
      <div v-if="loadingLocation" class="flex justify-center p-4">
        <i class="pi pi-spin pi-spinner text-indigo-500 text-2xl"></i>
      </div>

      <div v-else-if="selectedLocation" class="p-4">
        <div class="bg-indigo-50 p-4 rounded-lg mb-4">
          <h3 class="text-xl font-semibold text-indigo-800 mb-2">
            {{ selectedLocation.name }}
          </h3>

          <div class="border-t border-indigo-200 pt-3 mt-2">
            <p class="text-gray-700 mb-4 leading-relaxed">
              {{ selectedLocation.address }}
            </p>

            <a
              :href="selectedLocation.googleMapsUrl"
              target="_blank"
              class="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition-colors duration-200 w-fit mt-2"
            >
              <i class="pi pi-map-marker"></i> View on Google Maps
            </a>
          </div>
        </div>
      </div>

      <div v-else class="p-4 text-center text-gray-500">
        Location details not available
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import Dialog from 'primevue/dialog';
import JobService from '@/services/JobService';
import axios from 'axios';

// Default company logo (base64 encoded simple building icon)
const defaultCompanyLogo = ref(
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOWNhM2FmIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgY2xhc3M9ImZlYXRoZXIgZmVhdGhlci1idWlsZGluZyI+PHJlY3QgeD0iNCIgeT0iMiIgd2lkdGg9IjE2IiBoZWlnaHQ9IjIwIiByeD0iMiIgcnk9IjIiPjwvcmVjdD48bGluZSB4MT0iOSIgeTE9IjIiIHgyPSI5IiB5Mj0iMjIiPjwvbGluZT48bGluZSB4MT0iMTUiIHkxPSIyIiB4Mj0iMTUiIHkyPSIyMiI+PC9saW5lPjxsaW5lIHgxPSI0IiB5MT0iMTIiIHgyPSIyMCIgeTI9IjEyIj48L2xpbmU+PC9zdmc+'
);

// Location dialog state
const locationDialog = ref(false);
const selectedLocation = ref(null);
const loadingLocation = ref(false);

// Location API call
const showLocationDetails = async (locationId) => {
  if (!locationId) return;

  try {
    locationDialog.value = true;
    loadingLocation.value = true;

    const response = await axios.get(
      `http://localhost:8080/api/locations/${locationId}`
    );
    if (response.data && response.data.data) {
      selectedLocation.value = response.data.data;
    }
  } catch (error) {
    console.error('Error fetching location details:', error);
  } finally {
    loadingLocation.value = false;
  }
};

const props = defineProps({
  job: {
    type: Object,
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const onImageError = (event) => {
  event.target.src = 'https://via.placeholder.com/300x200?text=Select+a+job';
};

// Format date to readable format
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      weekday: 'long',
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

// Format date range
const formatDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return 'N/A';
  return `${formatDate(startDate)} to ${formatDate(endDate)}`;
};

// Format time (from HH:MM:SS to readable format)
const formatTime = (timeString) => {
  if (!timeString) return 'N/A';
  try {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch (error) {
    console.error('Error formatting time:', error);
    return timeString;
  }
};

// Format time range
const formatTimeRange = (startTime, endTime) => {
  if (!startTime || !endTime) return 'N/A';
  return `${formatTime(startTime)} - ${formatTime(endTime)}`;
};

// Format rest time (from decimal hours to readable format)
const formatRestTime = (hoursDecimal) => {
  if (!hoursDecimal) return 'No rest time';
  try {
    const hours = Math.floor(hoursDecimal);
    const minutes = Math.round((hoursDecimal - hours) * 60);

    let result = '';
    if (hours > 0) {
      result += `${hours} hour${hours !== 1 ? 's' : ''}`;
    }
    if (minutes > 0) {
      if (result) result += ' ';
      result += `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }
    return result || 'No rest time';
  } catch (error) {
    console.error('Error formatting rest time:', error);
    return `${hoursDecimal} hours`;
  }
};

// Group schedule dates by consecutive dates
const groupedScheduleDates = (scheduleDates) => {
  if (!scheduleDates || scheduleDates.length === 0) return [];

  // First, sort the dates
  const sortedDates = [...scheduleDates].sort((a, b) => {
    return new Date(a.workDate) - new Date(b.workDate);
  });

  // Group dates by proximity and location
  const dateGroups = [];
  let currentGroup = null;

  sortedDates.forEach((date, index) => {
    const currentDate = new Date(date.workDate);

    // If this is the first date or it's more than 3 days from the last date in the current group,
    // start a new group
    if (
      index === 0 ||
      !currentGroup ||
      Math.abs(currentDate - new Date(sortedDates[index - 1].workDate)) >
        3 * 24 * 60 * 60 * 1000
    ) {
      // Save current group if it exists
      if (currentGroup) {
        dateGroups.push(currentGroup);
      }

      // Start a new group
      currentGroup = {
        dates: [date.workDate],
        locations: {},
      };
    } else {
      // Add to current group
      currentGroup.dates.push(date.workDate);
    }

    // Add locations for this date
    if (date.jobLocations) {
      date.jobLocations.forEach((location) => {
        const locationKey = location.locationName;
        if (!currentGroup.locations[locationKey]) {
          currentGroup.locations[locationKey] = {
            name: locationKey,
            available: location.positionsNeeded - location.positionsFilled,
            notes: location.notes,
            id: location.locationId,
          };
        }
      });
    }

    // If this is the last date, add the current group
    if (index === sortedDates.length - 1 && currentGroup) {
      dateGroups.push(currentGroup);
    }
  });

  // Format the groups for display
  return dateGroups.map((group) => {
    // Remove duplicate dates
    const uniqueDates = [...new Set(group.dates)];

    // Sort dates
    uniqueDates.sort((a, b) => new Date(a) - new Date(b));

    // Format dates with commas
    const formattedDates = uniqueDates
      .map((date) => {
        return formatDateShort(date);
      })
      .join(', ');

    // Convert locations object to array
    const locationsList = Object.values(group.locations);

    return {
      formattedDates,
      locations: locationsList,
    };
  });
};

// Shorter date format for grouped dates
const formatDateShort = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    return `${day} ${month}`;
  } catch (error) {
    console.error('Error formatting date short:', error);
    return dateString;
  }
};

defineEmits(['apply', 'toggleSave']);
</script>

<style scoped>
.location-dialog :deep(.p-dialog-header) {
  background-color: #4f46e5;
  color: white;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.location-dialog :deep(.p-dialog-content) {
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  padding: 0;
}

.location-dialog :deep(.p-dialog-header-icon) {
  color: white;
}

.location-dialog :deep(.p-dialog-header-icon:hover) {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}
</style>
