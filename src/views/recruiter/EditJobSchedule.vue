<template>
  <div class="edit-schedule-container min-h-screen bg-gray-50">
    <!-- Header Section with gradient background -->
    <div class="bg-gradient-to-r from-primary-700 to-primary-900 text-white">
      <div class="container mx-auto py-8 px-6">
        <div class="flex items-center mb-2">
          <Button
            icon="pi pi-arrow-left"
            class="p-button-rounded p-button-text text-white"
            @click="goBack"
            v-tooltip="'Go back'"
          />
          <div class="flex items-center ml-2">
            <i class="pi pi-calendar text-primary-200 mr-2"></i>
            <span class="text-primary-100">Edit Schedule</span>
          </div>
        </div>
        <h1 class="text-3xl font-bold">{{ jobTitle }}</h1>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="text-center py-16 container mx-auto">
      <ProgressSpinner
        style="width: 50px; height: 50px"
        strokeWidth="4"
        animationDuration=".7s"
        class="mb-4"
      />
      <p class="text-gray-600">Loading schedule details...</p>
    </div>

    <!-- Main content -->
    <div v-else class="container mx-auto px-6 py-8">
      <div class="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <!-- Form header section -->
        <div class="bg-primary-50 p-6 border-b border-primary-100">
          <h2 class="text-xl font-semibold text-primary-800 flex items-center">
            <i class="pi pi-cog text-primary-500 mr-2"></i>
            Schedule Settings
          </h2>
          <p class="text-gray-600 mt-2">
            Configure the global settings for this job schedule. These settings
            will apply to all sections.
          </p>
        </div>

        <!-- Schedule Settings -->
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
            <!-- Positions Column -->
            <div class="col-span-12 md:col-span-4">
              <div class="bg-blue-50 rounded-xl p-5 h-full">
                <div class="flex items-center justify-center mb-4">
                  <div
                    class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center"
                  >
                    <i class="pi pi-users text-blue-600 text-lg"></i>
                  </div>
                </div>
                <h3
                  class="text-center text-lg font-semibold text-blue-800 mb-3"
                >
                  Positions
                </h3>
                <div class="p-field">
                  <label
                    class="block text-gray-700 font-medium mb-2 text-center"
                  >
                    Default number of positions
                    <span class="text-red-500">*</span>
                  </label>
                  <div class="flex justify-center">
                    <div class="p-inputgroup w-full max-w-xs">
                      <Button
                        icon="pi pi-minus"
                        class="p-button-secondary"
                        @click="decrementPositions"
                        :disabled="scheduleSettings.numPositions <= 1"
                      />
                      <InputNumber
                        v-model="scheduleSettings.numPositions"
                        :min="1"
                        :showButtons="false"
                        class="text-center w-20"
                        inputClass="text-center"
                      />
                      <Button
                        icon="pi pi-plus"
                        class="p-button-secondary"
                        @click="incrementPositions"
                      />
                    </div>
                  </div>
                  <div class="text-sm text-gray-600 text-center mt-2">
                    This will apply to all locations by default
                  </div>
                </div>
              </div>
            </div>

            <!-- Working Hours Column -->
            <div class="col-span-12 md:col-span-4">
              <div class="bg-amber-50 rounded-xl p-5 h-full">
                <div class="flex items-center justify-center mb-4">
                  <div
                    class="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center"
                  >
                    <i class="pi pi-clock text-amber-600 text-lg"></i>
                  </div>
                </div>
                <h3
                  class="text-center text-lg font-semibold text-amber-800 mb-3"
                >
                  Working Hours
                </h3>
                <div class="grid grid-cols-1 gap-4">
                  <div class="p-field">
                    <label
                      class="block text-gray-700 font-medium mb-2 text-center"
                    >
                      Start Time <span class="text-red-500">*</span>
                    </label>
                    <Calendar
                      v-model="scheduleSettings.startTime"
                      timeOnly
                      hourFormat="12"
                      placeholder="Select start time"
                      class="w-full"
                    />
                  </div>
                  <div class="p-field">
                    <label
                      class="block text-gray-700 font-medium mb-2 text-center"
                    >
                      End Time <span class="text-red-500">*</span>
                    </label>
                    <Calendar
                      v-model="scheduleSettings.endTime"
                      timeOnly
                      hourFormat="12"
                      placeholder="Select end time"
                      class="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Rest Time Column -->
            <div class="col-span-12 md:col-span-4">
              <div class="bg-purple-50 rounded-xl p-5 h-full">
                <div class="flex items-center justify-center mb-4">
                  <div
                    class="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center"
                  >
                    <i class="pi pi-hourglass text-purple-600 text-lg"></i>
                  </div>
                </div>
                <h3
                  class="text-center text-lg font-semibold text-purple-800 mb-3"
                >
                  Rest Time
                </h3>
                <div class="p-field">
                  <label
                    class="block text-gray-700 font-medium mb-2 text-center"
                  >
                    Break duration
                  </label>
                  <div class="grid grid-cols-2 gap-4">
                    <!-- Hours input -->
                    <div>
                      <div class="text-center mb-2 text-sm text-purple-700">
                        Hours
                      </div>
                      <div
                        class="flex items-center bg-white rounded-lg border border-purple-200 overflow-hidden rest-time-input"
                      >
                        <button
                          @click="decrementHours"
                          class="w-10 h-10 flex items-center justify-center bg-purple-50 hover:bg-purple-100 text-purple-600 transition-colors"
                          :disabled="scheduleSettings.restTimeHours <= 0"
                        >
                          <i class="pi pi-minus"></i>
                        </button>
                        <div class="flex-1 text-center">
                          <InputNumber
                            v-model="scheduleSettings.restTimeHours"
                            placeholder="0"
                            :min="0"
                            :max="23"
                            :showButtons="false"
                            class="w-full text-center border-none"
                            inputClass="border-0 text-center text-lg font-semibold text-gray-800"
                          />
                        </div>
                        <button
                          @click="incrementHours"
                          class="w-10 h-10 flex items-center justify-center bg-purple-50 hover:bg-purple-100 text-purple-600 transition-colors"
                        >
                          <i class="pi pi-plus"></i>
                        </button>
                      </div>
                    </div>

                    <!-- Minutes input -->
                    <div>
                      <div class="text-center mb-2 text-sm text-purple-700">
                        Minutes
                      </div>
                      <div
                        class="flex items-center bg-white rounded-lg border border-purple-200 overflow-hidden rest-time-input"
                      >
                        <button
                          @click="decrementMinutes"
                          class="w-10 h-10 flex items-center justify-center bg-purple-50 hover:bg-purple-100 text-purple-600 transition-colors"
                          :disabled="scheduleSettings.restTimeMinutes <= 0"
                        >
                          <i class="pi pi-minus"></i>
                        </button>
                        <div class="flex-1 text-center">
                          <InputNumber
                            v-model="scheduleSettings.restTimeMinutes"
                            placeholder="0"
                            :min="0"
                            :max="59"
                            :step="5"
                            :showButtons="false"
                            class="w-full text-center border-none"
                            inputClass="border-0 text-center text-lg font-semibold text-gray-800"
                          />
                        </div>
                        <button
                          @click="incrementMinutes"
                          class="w-10 h-10 flex items-center justify-center bg-purple-50 hover:bg-purple-100 text-purple-600 transition-colors"
                        >
                          <i class="pi pi-plus"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Schedule Sections -->
      <div class="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div
          class="bg-primary-50 p-6 border-b border-primary-100 flex justify-between items-center"
        >
          <div>
            <h2
              class="text-xl font-semibold text-primary-800 flex items-center"
            >
              <i class="pi pi-calendar text-primary-500 mr-2"></i>
              Work Schedule Sections
            </h2>
            <p class="text-gray-600 mt-2">
              Add dates and locations for this job. You can create multiple
              sections for different date ranges.
            </p>
          </div>
          <Button
            icon="pi pi-plus"
            label="Add Section"
            class="p-button-primary"
            @click="addScheduleSection"
          />
        </div>

        <div class="p-6">
          <!-- Empty state message when no schedule sections exist -->
          <div
            v-if="scheduleSections.length === 0"
            class="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300"
          >
            <i class="pi pi-calendar text-6xl text-gray-300 mb-4"></i>
            <h4 class="text-xl font-medium text-gray-700 mb-2">
              No schedules added yet
            </h4>
            <p class="text-gray-500 mb-6 max-w-md mx-auto">
              Add a schedule section to specify working dates and locations for
              this job. You can create multiple sections for different date
              ranges.
            </p>
            <Button
              icon="pi pi-plus"
              label="Add Schedule Section"
              class="p-button-primary p-button-lg"
              @click="addScheduleSection"
            />
          </div>

          <!-- Schedule sections list -->
          <div v-else class="space-y-8">
            <div
              v-for="(section, sectionIndex) in scheduleSections"
              :key="sectionIndex"
              class="bg-white rounded-lg shadow-sm border border-gray-200 transition-all hover:shadow-md overflow-hidden"
            >
              <div
                class="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-blue-100 flex justify-between items-center"
              >
                <h3
                  class="text-lg font-semibold text-primary-800 flex items-center"
                >
                  <i class="pi pi-calendar text-primary-500 mr-2"></i>
                  Schedule Section {{ sectionIndex + 1 }}
                </h3>
                <Button
                  icon="pi pi-trash"
                  class="p-button-danger p-button-outlined p-button-rounded"
                  @click="removeScheduleSection(sectionIndex)"
                  v-tooltip="'Remove this section'"
                />
              </div>
              <div class="p-4">
                <JobLocationScheduler
                  v-model="scheduleSections[sectionIndex]"
                  :title="`Schedule Section ${sectionIndex + 1}`"
                  :section-index="sectionIndex"
                  :min-date="new Date()"
                  :default-positions="scheduleSettings.numPositions"
                  :showHeader="false"
                  @remove="removeScheduleSection(sectionIndex)"
                />
              </div>
            </div>
          </div>

          <div
            v-if="scheduleSections.length > 0"
            class="flex justify-center mt-8"
          >
            <Button
              icon="pi pi-plus"
              label="Add Another Section"
              class="p-button-primary"
              @click="addScheduleSection"
            />
          </div>
        </div>
      </div>

      <!-- Summary Card -->
      <div class="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div
          class="bg-gradient-to-r from-green-50 to-teal-50 p-6 border-b border-green-100"
        >
          <h2 class="text-xl font-semibold text-green-800 flex items-center">
            <i class="pi pi-check-circle text-green-500 mr-2"></i>
            Schedule Summary
          </h2>
        </div>

        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="rounded-lg bg-blue-50 p-4 flex items-center">
              <div
                class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4 flex-shrink-0"
              >
                <i class="pi pi-calendar text-blue-600 text-lg"></i>
              </div>
              <div>
                <div class="text-sm text-blue-700 font-medium">Date Range</div>
                <div class="font-semibold text-gray-800 text-lg">
                  {{ getScheduleDateSummary() }}
                </div>
              </div>
            </div>

            <div class="rounded-lg bg-amber-50 p-4 flex items-center">
              <div
                class="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mr-4 flex-shrink-0"
              >
                <i class="pi pi-clock text-amber-600 text-lg"></i>
              </div>
              <div>
                <div class="text-sm text-amber-700 font-medium">
                  Working Hours
                </div>
                <div class="font-semibold text-gray-800 text-lg">
                  {{
                    scheduleSettings.startTime && scheduleSettings.endTime
                      ? `${formatTime(
                          scheduleSettings.startTime
                        )} - ${formatTime(scheduleSettings.endTime)}`
                      : 'Not specified'
                  }}
                </div>
              </div>
            </div>

            <div class="rounded-lg bg-purple-50 p-4 flex items-center">
              <div
                class="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-4 flex-shrink-0"
              >
                <i class="pi pi-hourglass text-purple-600 text-lg"></i>
              </div>
              <div>
                <div class="text-sm text-purple-700 font-medium">Rest Time</div>
                <div class="font-semibold text-gray-800 text-lg">
                  {{
                    formatRestTime(
                      scheduleSettings.restTimeHours,
                      scheduleSettings.restTimeMinutes
                    )
                  }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-between bg-white rounded-xl shadow-md p-6">
        <Button
          label="Cancel"
          icon="pi pi-times"
          class="p-button-outlined p-button-secondary"
          @click="goBack"
        />
        <Button
          label="Save Changes"
          icon="pi pi-check"
          class="p-button-primary"
          :loading="saving"
          @click="submitForm"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import jobService from '@/services/job.service';
import locationService from '@/services/location.service';

// PrimeVue components
import Button from 'primevue/button';
import ProgressSpinner from 'primevue/progressspinner';
import Calendar from 'primevue/calendar';
import InputNumber from 'primevue/inputnumber';
import JobLocationScheduler from '@/components/shared/JobLocationScheduler.vue';

const router = useRouter();
const route = useRoute();
const toast = useToast();

// State
const loading = ref(true);
const saving = ref(false);
const jobTitle = ref('');
const job = ref(null);
const schedule = ref(null);

// Schedule settings
const scheduleSettings = ref({
  numPositions: 1,
  startTime: null,
  endTime: null,
  restTimeHours: 0,
  restTimeMinutes: 0,
});

// Initialize empty schedule data
const scheduleData = ref({
  dates: [],
  locations: [],
  scheduleData: {},
});

// Schedule sections
const scheduleSections = ref([]);

// Helper functions for positions
const incrementPositions = () => {
  scheduleSettings.value.numPositions =
    (scheduleSettings.value.numPositions || 1) + 1;
};

const decrementPositions = () => {
  if (scheduleSettings.value.numPositions > 1) {
    scheduleSettings.value.numPositions -= 1;
  }
};

// Helper functions for rest time
const incrementHours = () => {
  if (scheduleSettings.value.restTimeHours < 23) {
    scheduleSettings.value.restTimeHours =
      (scheduleSettings.value.restTimeHours || 0) + 1;
  }
};

const decrementHours = () => {
  if (scheduleSettings.value.restTimeHours > 0) {
    scheduleSettings.value.restTimeHours -= 1;
  }
};

const incrementMinutes = () => {
  if (scheduleSettings.value.restTimeMinutes < 55) {
    scheduleSettings.value.restTimeMinutes =
      (scheduleSettings.value.restTimeMinutes || 0) + 5;
  } else {
    scheduleSettings.value.restTimeMinutes = 0;
  }
};

const decrementMinutes = () => {
  if (scheduleSettings.value.restTimeMinutes >= 5) {
    scheduleSettings.value.restTimeMinutes -= 5;
  } else if (scheduleSettings.value.restTimeMinutes > 0) {
    scheduleSettings.value.restTimeMinutes = 0;
  }
};

// Format date for display
const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

// Format time for display
const formatTime = (time) => {
  if (!time) return '';
  return new Date(time).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

// Format date range
const formatDateRange = (dates) => {
  if (!dates || dates.length === 0) return '';

  // Sort dates chronologically
  const sortedDates = [...dates].sort((a, b) => new Date(a) - new Date(b));
  const firstDate = new Date(sortedDates[0]);
  const lastDate = new Date(sortedDates[sortedDates.length - 1]);

  // If only one date or same day
  if (firstDate.toDateString() === lastDate.toDateString()) {
    return formatDate(firstDate);
  }

  // Date range
  return `${formatDate(firstDate)} - ${formatDate(lastDate)}`;
};

// Format rest time
const formatRestTime = (hours, minutes) => {
  let result = '';
  if (hours > 0) {
    result += `${hours} hr${hours !== 1 ? 's' : ''}`;
  }
  if (minutes > 0) {
    if (result) result += ' ';
    result += `${minutes} min${minutes !== 1 ? 's' : ''}`;
  }
  return result || 'None';
};

// Format time for API
const formatTimeForAPI = (time) => {
  if (!time) return null;

  const date = new Date(time);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${hours}:${minutes}:00`;
};

// Fetch location details by ID
const fetchLocationDetails = async (locationId) => {
  try {
    const response = await locationService.getLocationById(locationId);
    if (response.data && response.data.statusCode === 200) {
      return response.data.data;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching location ${locationId}:`, error);
    return null;
  }
};

// Format the raw schedule data into the format expected by JobLocationScheduler
const formatScheduleForEdit = async (scheduleData) => {
  if (!scheduleData || !scheduleData.scheduleDates) {
    return;
  }

  // Extract schedule settings
  if (scheduleData.numPositions) {
    scheduleSettings.value.numPositions = scheduleData.numPositions;
  }

  if (scheduleData.startTime) {
    // Convert HH:MM:SS to Date object for the time picker
    const [hours, minutes] = scheduleData.startTime.split(':');
    const startTime = new Date();
    startTime.setHours(parseInt(hours, 10));
    startTime.setMinutes(parseInt(minutes, 10));
    startTime.setSeconds(0);
    scheduleSettings.value.startTime = startTime;
  }

  if (scheduleData.endTime) {
    // Convert HH:MM:SS to Date object for the time picker
    const [hours, minutes] = scheduleData.endTime.split(':');
    const endTime = new Date();
    endTime.setHours(parseInt(hours, 10));
    endTime.setMinutes(parseInt(minutes, 10));
    endTime.setSeconds(0);
    scheduleSettings.value.endTime = endTime;
  }

  if (scheduleData.hoursOfRestTime) {
    // Calculate hours and minutes from decimal hours
    const totalHours = scheduleData.hoursOfRestTime;
    scheduleSettings.value.restTimeHours = Math.floor(totalHours);
    scheduleSettings.value.restTimeMinutes = Math.round(
      (totalHours - scheduleSettings.value.restTimeHours) * 60
    );
    // Round minutes to nearest 5
    scheduleSettings.value.restTimeMinutes =
      Math.round(scheduleSettings.value.restTimeMinutes / 5) * 5;
  }

  // Clear existing schedule sections and create a new one
  scheduleSections.value = [];

  // Create a new schedule section
  const newSection = {
    dates: [],
    locations: [],
    scheduleData: {},
  };

  // Map to track locations we've already added
  const locationMap = new Map();
  const locationIdsToFetch = new Set();
  const locationPromises = [];

  // First pass - collect dates, locations, and identify additional locations to fetch
  scheduleData.scheduleDates.forEach((scheduleDate) => {
    // Convert date string to Date object and add to dates
    const dateObj = new Date(scheduleDate.workDate);
    newSection.dates.push(dateObj);
    const dateStr = dateObj.toISOString();
    newSection.scheduleData[dateStr] = {};

    // Process locations for this date
    if (scheduleDate.jobLocations && Array.isArray(scheduleDate.jobLocations)) {
      scheduleDate.jobLocations.forEach((jobLocation) => {
        // Skip if location is completely missing
        if (!jobLocation) {
          return;
        }

        if (jobLocation.location && jobLocation.location.id) {
          if (!locationMap.has(jobLocation.location.id)) {
            newSection.locations.push(jobLocation.location);
            locationMap.set(jobLocation.location.id, true);
          }
        }
        else if (jobLocation.locationId && jobLocation.locationName) {
          const basicLocation = {
            id: jobLocation.locationId,
            name: jobLocation.locationName,
          };

          if (!locationMap.has(jobLocation.locationId)) {
            newSection.locations.push(basicLocation);
            locationMap.set(jobLocation.locationId, true);
            // Still fetch complete details to get address
            locationIdsToFetch.add(jobLocation.locationId);
          }
        }
        else if (jobLocation.locationId) {
          locationIdsToFetch.add(jobLocation.locationId);
        }
      });
    }
  });

  // Fetch any missing location details
  for (const locationId of locationIdsToFetch) {
    if (!locationMap.has(locationId)) {
      locationPromises.push(
        fetchLocationDetails(locationId).then((locationData) => {
          if (locationData) {
            newSection.locations.push(locationData);
            locationMap.set(locationData.id, true);
          }
        })
      );
    }
  }

  // Wait for all location data to be fetched
  if (locationPromises.length > 0) {
    await Promise.all(locationPromises);
  }

  // Second pass - fill in the schedule data details
  scheduleData.scheduleDates.forEach((scheduleDate) => {
    const dateStr = new Date(scheduleDate.workDate).toISOString();

    if (scheduleDate.jobLocations && Array.isArray(scheduleDate.jobLocations)) {
      scheduleDate.jobLocations.forEach((jobLocation) => {
        // Get the relevant location ID
        const locationId = jobLocation.locationId || jobLocation.location?.id;

        if (locationId && locationMap.has(locationId)) {
          newSection.scheduleData[dateStr][locationId] = {
            locationId: locationId,
            positionsNeeded:
              jobLocation.positionsNeeded ||
              scheduleSettings.value.numPositions ||
              1,
            notes: jobLocation.notes,
          };
        }
      });
    }
  });

  scheduleSections.value.push(newSection);
};

// Fetch job and schedule data
const fetchData = async () => {
  loading.value = true;
  try {
    const jobId = route.params.jobId;
    const scheduleId = route.params.scheduleId;

    // Fetch job details first
    const jobResponse = await jobService.getJobById(jobId);

    if (jobResponse.data && jobResponse.data.statusCode === 200) {
      job.value = jobResponse.data.data;
      jobTitle.value = job.value.title;

      // Next, fetch schedule details
      const scheduleResponse = await jobService.getJobScheduleByJobId(jobId);

      if (scheduleResponse.data && scheduleResponse.data.statusCode === 200) {
        // Find the schedule with the matching ID
        const schedules = scheduleResponse.data.data;
        if (schedules && schedules.length > 0) {
          const targetSchedule = schedules.find(
            (s) => s.id.toString() === scheduleId.toString()
          );

          if (targetSchedule) {
            schedule.value = targetSchedule;
            console.log('Loaded schedule:', targetSchedule);

            // Format the schedule data for the scheduler component
            scheduleData.value = await formatScheduleForEdit(targetSchedule);
          } else {
            toast.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Schedule not found',
              life: 3000,
            });
            goBack();
          }
        } else {
          toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No schedules found for this job',
            life: 3000,
          });
          goBack();
        }
      } else {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load schedule details',
          life: 3000,
        });
        goBack();
      }
    } else {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load job details',
        life: 3000,
      });
      goBack();
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'An error occurred while loading data',
      life: 3000,
    });
    goBack();
  } finally {
    loading.value = false;
  }
};

// Navigation
const goBack = () => {
  router.push({ name: 'JobDetails', params: { jobId: route.params.jobId } });
};

// Validate schedule dates
const validateSchedule = () => {
  const errors = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to start of day for comparison

  // Check if schedule sections exist
  if (scheduleSections.value.length === 0) {
    errors.push('Please add at least one schedule section');
    return errors;
  }

  // Check each schedule section
  for (let i = 0; i < scheduleSections.value.length; i++) {
    const section = scheduleSections.value[i];

    // Check if dates are selected
    if (!section.dates || section.dates.length === 0) {
      errors.push(
        `Schedule section ${i + 1}: Please select at least one working date`
      );
      continue;
    }

    // Check if any date is in the past
    const hasPastDate = section.dates.some((date) => {
      const dateObj = new Date(date);
      dateObj.setHours(0, 0, 0, 0); // Set to start of day for comparison
      return dateObj < today;
    });

    if (hasPastDate) {
      errors.push(
        `Schedule section ${i + 1}: You cannot select dates in the past`
      );
    }

    // Check if locations are selected
    if (!section.locations || section.locations.length === 0) {
      errors.push(
        `Schedule section ${i + 1}: Please select at least one location`
      );
    }
  }

  // Check if time fields are filled
  if (!scheduleSettings.value.startTime) {
    errors.push('Please specify the start time');
  }

  if (!scheduleSettings.value.endTime) {
    errors.push('Please specify the end time');
  }

  // Check if start time is before end time
  if (scheduleSettings.value.startTime && scheduleSettings.value.endTime) {
    const startTime = new Date(scheduleSettings.value.startTime);
    const endTime = new Date(scheduleSettings.value.endTime);

    if (startTime >= endTime) {
      errors.push('Start time must be before end time');
    }
  }

  return errors;
};

// Form submission handler
const submitForm = async () => {
  if (!schedule.value) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Schedule data is incomplete',
      life: 3000,
    });
    return;
  }

  // Validate schedule before submission
  const validationErrors = validateSchedule();
  if (validationErrors.length > 0) {
    validationErrors.forEach((error) => {
      toast.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: error,
        life: 3000,
      });
    });
    return;
  }

  saving.value = true;
  try {
    // Prepare the schedule dates from all sections
    const allScheduleDates = [];

    // Process each schedule section
    for (const section of scheduleSections.value) {
      // Get all dates in this section
      const dates = section.dates || [];

      // For each date, collect location data
      dates.forEach((date) => {
        const dateObj = new Date(date);
        const dateStr = dateObj.toISOString();
        const formattedDate = dateObj.toISOString().split('T')[0]; // YYYY-MM-DD format

        // Get locations for this date
        const jobLocations = [];

        if (section.scheduleData && section.scheduleData[dateStr]) {
          Object.values(section.scheduleData[dateStr]).forEach(
            (locationData) => {
              jobLocations.push({
                locationId: locationData.locationId,
                positionsNeeded:
                  locationData.positionsNeeded ||
                  scheduleSettings.value.numPositions,
                notes: locationData.notes || null,
              });
            }
          );
        }

        // Only add if we have locations for this date
        if (jobLocations.length > 0) {
          allScheduleDates.push({
            workDate: formattedDate,
            jobLocations,
          });
        }
      });
    }

    // Calculate rest time in hours (decimal)
    const hoursOfRestTime =
      scheduleSettings.value.restTimeHours +
      scheduleSettings.value.restTimeMinutes / 60;

    // Get date range from all schedule sections
    const { startDate, endDate } = calculateDateRange();

    // Prepare the update payload with the required fields
    const updateData = {
      jobId: parseInt(route.params.jobId, 10),
      scheduleDates: allScheduleDates,
      numPositions: scheduleSettings.value.numPositions,
      startTime: formatTimeForAPI(scheduleSettings.value.startTime),
      endTime: formatTimeForAPI(scheduleSettings.value.endTime),
      startDate: startDate,
      endDate: endDate,
      hoursOfRestTime: hoursOfRestTime,
    };

    console.log('Sending update data:', JSON.stringify(updateData, null, 2));

    // Send the update request
    const response = await jobService.updateJobSchedule(
      route.params.scheduleId,
      updateData
    );

    if (response.data && response.data.statusCode === 200) {
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Schedule updated successfully',
        life: 3000,
      });

      // Navigate back to job details
      goBack();
    } else {
      throw new Error(response.data?.message || 'Failed to update schedule');
    }
  } catch (error) {
    console.error('Error updating schedule:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.message || 'Failed to update schedule',
      life: 3000,
    });
  } finally {
    saving.value = false;
  }
};

// Initialize component
onMounted(() => {
  fetchData();
});

const addScheduleSection = () => {
  scheduleSections.value.push({
    dates: [],
    locations: [],
    scheduleData: {},
  });
};

const removeScheduleSection = (index) => {
  scheduleSections.value.splice(index, 1);
};

// Calculate date range from all schedule sections
const calculateDateRange = () => {
  // Collect all dates from all sections
  const allDates = [];

  scheduleSections.value.forEach((section) => {
    if (Array.isArray(section.dates) && section.dates.length > 0) {
      allDates.push(...section.dates);
    }
  });

  if (allDates.length > 0) {
    // Sort dates chronologically
    allDates.sort((a, b) => new Date(a) - new Date(b));

    // Return start and end dates
    return {
      startDate: new Date(allDates[0]).toISOString().split('T')[0],
      endDate: new Date(allDates[allDates.length - 1])
        .toISOString()
        .split('T')[0],
    };
  }

  return { startDate: null, endDate: null };
};

// Get schedule date summary
const getScheduleDateSummary = () => {
  const { startDate, endDate } = calculateDateRange();
  if (startDate && endDate) {
    if (startDate === endDate) {
      return formatDate(new Date(startDate));
    }
    return `${formatDate(new Date(startDate))} - ${formatDate(
      new Date(endDate)
    )}`;
  }
  return 'No dates selected';
};
</script>

<style scoped>
.edit-schedule-container {
  background-image: linear-gradient(to bottom, #f9fafb 0%, #f3f4f6 100%);
}

:deep(.p-button) {
  border-radius: 8px;
  font-weight: 500;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}

:deep(.p-button:hover) {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1);
}

:deep(.p-button-outlined.p-button-purple) {
  color: var(--purple-600);
  border-color: var(--purple-500);
}

:deep(.p-button-outlined.p-button-purple:hover) {
  background-color: var(--purple-50);
}

:deep(.p-inputtext),
:deep(.p-dropdown),
:deep(.p-inputnumber),
:deep(.p-inputnumber-input) {
  height: 3rem !important;
  border-radius: 8px;
  transition: all 0.2s ease;
  border: 1px solid #e2e8f0;
  width: 100% !important;
}

:deep(.p-calendar) {
  width: 100% !important;
}

:deep(.p-calendar .p-inputtext) {
  width: 100% !important;
}

:deep(.p-inputgroup-addon) {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-right: none;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  padding: 0 12px;
  font-weight: 500;
  color: #475569;
  height: 3rem;
}

:deep(.p-inputgroup-button-group) {
  display: flex;
  flex-direction: column;
  height: 3rem;
}

:deep(.p-inputgroup-button-group .p-button) {
  border-radius: 0;
  margin: 0;
  height: 1.5rem;
  width: 2rem;
}

:deep(.p-inputgroup-button-group .p-button:first-child) {
  border-top-right-radius: 8px;
  border-bottom: 1px solid #e2e8f0;
}

:deep(.p-inputgroup-button-group .p-button:last-child) {
  border-bottom-right-radius: 8px;
}

/* Adjust inputs with addons */
:deep(.p-inputgroup-addon-uneven .p-inputnumber-input) {
  border-radius: 0 !important;
  width: 4rem !important;
  text-align: center;
}

/* Fix for the Rest Time inputs to prevent overlap */
:deep(.p-inputgroup) {
  position: relative;
  display: flex;
  align-items: stretch;
}

:deep(.p-inputgroup-button-group) {
  display: flex;
  flex-direction: column;
  height: 3rem;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 1;
}

:deep(.p-inputgroup .p-inputnumber) {
  flex: 1;
  min-width: 2.5rem;
}

:deep(.p-inputgroup-addon-uneven) {
  padding-right: 2rem; /* Make room for the buttons */
}

:deep(.p-inputgroup-addon-uneven .p-inputnumber-input) {
  padding-right: 2.5rem !important;
}

/* Add specific styles for the new rest time inputs */
.bg-purple-50 {
  background-color: var(--purple-50);
}

.hover\:bg-purple-100:hover {
  background-color: var(--purple-100);
}

.text-purple-600 {
  color: var(--purple-600);
}

.border-purple-200 {
  border-color: var(--purple-200);
}

/* Custom styles for rest time inputs */
:deep(.rest-time-input) {
  display: flex;
  align-items: center;
  border-radius: 0.5rem;
  overflow: hidden;
}

:deep(.rest-time-input .p-inputnumber-input) {
  border: none !important;
  box-shadow: none !important;
  text-align: center !important;
  font-size: 1.25rem !important;
  font-weight: 600 !important;
  padding: 0.5rem 0 !important;
  width: 100% !important;
  color: var(--gray-800) !important;
}

:deep(.rest-time-input .p-inputnumber) {
  width: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
}

:deep(.rest-time-input button) {
  border: none;
  background: var(--purple-50);
  color: var(--purple-600);
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

:deep(.rest-time-input button:hover) {
  background: var(--purple-100);
}

:deep(.rest-time-input button:disabled) {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Calendar styling */
:deep(.p-calendar .p-datepicker) {
  border-radius: 12px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  border: none;
  padding: 0.5rem;
}

:deep(.p-datepicker table td > span.p-highlight) {
  background: var(--primary-color);
}

:deep(.p-datepicker table td.p-datepicker-today > span) {
  background: var(--primary-50);
  color: var(--primary-700);
  font-weight: 600;
}

:deep(.p-timepicker > div > span) {
  font-size: 1.1rem;
}

:deep(.p-timepicker > div > div.p-highlight) {
  background: var(--primary-color);
}

/* Make cards pop on hover */
.rounded-xl {
  transition: all 0.3s ease;
}

.rounded-xl:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .edit-schedule-container {
    padding-top: 0;
  }

  :deep(.p-inputgroup-button-group) {
    flex-direction: row;
    height: 3rem;
  }

  :deep(.p-inputgroup-button-group .p-button) {
    height: 3rem;
    width: 3rem;
  }

  :deep(.p-inputgroup-button-group .p-button:first-child) {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-bottom: none;
    border-right: 1px solid #e2e8f0;
  }

  :deep(.p-inputgroup-button-group .p-button:last-child) {
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
  }
}
</style>
