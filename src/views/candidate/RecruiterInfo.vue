<template>
  <div class="job-application-process py-6 bg-gray-50 min-h-screen">
    <div class="container mx-auto px-4">
      <!-- Back Button -->
      <div class="mb-4">
        <Button
          icon="pi pi-arrow-left"
          label="Back to Job"
          class="p-button-text"
          @click="goBackToJob"
        />
      </div>

      <!-- Progress Steps -->
      <div class="mb-8">
        <Steps :model="steps" :readonly="false" :active-index="activeIndex" />
      </div>

      <!-- Page Title -->
      <div class="text-center mb-8">
        <h1 class="text-2xl md:text-3xl font-bold text-gray-800">
          {{ currentStepTitle }}
        </h1>
        <p class="text-gray-600 mt-2">{{ currentStepDescription }}</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <ProgressSpinner
          class="w-12 h-12"
          strokeWidth="4"
          fill="var(--surface-ground)"
          animationDuration=".5s"
          aria-label="Loading"
        />
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="flex flex-col items-center justify-center py-12"
      >
        <div
          class="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4"
        >
          <i class="pi pi-exclamation-triangle text-red-500 text-2xl"></i>
        </div>
        <h3 class="text-xl font-semibold text-gray-800 mb-2">
          Unable to load job information
        </h3>
        <p class="text-gray-600 mb-4 text-center max-w-md">
          We encountered an error while loading the job information. Please try
          again later.
        </p>
        <Button
          label="Go Back"
          icon="pi pi-arrow-left"
          class="p-button-outlined"
          @click="goBackToJob"
        />
      </div>

      <div v-else class="application-content">
        <!-- Step 1: Location and Date Selection -->
        <div v-if="activeIndex === 0" class="bg-white p-6 rounded-lg shadow-sm">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Left Column: Location Selection -->
            <div>
              <h2 class="text-xl font-semibold text-gray-800 mb-4">
                Available Locations
              </h2>
              <p class="text-gray-600 mb-4">
                Select the location where you'd like to work
              </p>

              <!-- Location Cards -->
              <div class="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                <div
                  v-for="location in availableLocations"
                  :key="location.id"
                  class="border rounded-lg p-4 cursor-pointer transition-all duration-200"
                  :class="
                    selectedLocations[0] === location.id
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-indigo-300'
                  "
                  @click="selectLocation(location.id)"
                >
                  <div class="flex justify-between mb-2">
                    <h3
                      class="font-medium text-gray-800 hover:text-indigo-600 hover:underline cursor-pointer"
                      @click.stop="showLocationDetails(location.id)"
                    >
                      {{ location.name }}
                    </h3>
                    <div
                      class="w-5 h-5 rounded-full border flex items-center justify-center"
                      :class="
                        selectedLocations[0] === location.id
                          ? 'bg-indigo-500 border-indigo-500'
                          : 'border-gray-400'
                      "
                    >
                      <i
                        v-if="selectedLocations[0] === location.id"
                        class="pi pi-check text-white text-xs"
                      ></i>
                    </div>
                  </div>
                  <p class="text-gray-600 text-sm mb-2">
                    {{ location.address }}
                  </p>
                  <div class="flex items-center text-sm text-gray-500 mt-2">
                    <i class="pi pi-users mr-1"></i>
                    <span
                      >{{ location.availablePositions }} positions
                      available</span
                    >
                  </div>

                  <div class="mt-3 flex justify-between items-center">
                    <a
                      :href="location.googleMapsUrl"
                      target="_blank"
                      class="text-indigo-600 text-sm hover:text-indigo-800 flex items-center"
                      @click.stop
                    >
                      <i class="pi pi-map-marker mr-1"></i> View on map
                    </a>
                    <Badge
                      v-if="location.notes"
                      value="Notes"
                      severity="info"
                      class="cursor-pointer"
                      @click.stop="showLocationNotes(location)"
                    ></Badge>
                  </div>
                </div>
              </div>

              <!-- Location Selection Error -->
              <small v-if="showLocationError" class="p-error block mt-2">
                Please select a location
              </small>
            </div>

            <!-- Right Column: Date Selection -->
            <div>
              <h2 class="text-xl font-semibold text-gray-800 mb-4">
                Select Working Dates
              </h2>
              <p class="text-gray-600 mb-4">
                Choose the dates you're available to work at this location
              </p>

              <!-- No Location Selected Message -->
              <div
                v-if="!selectedLocations.length"
                class="bg-gray-50 p-4 rounded-lg text-center"
              >
                <i class="pi pi-map-marker text-gray-300 text-3xl mb-2"></i>
                <p class="text-gray-500">
                  Please select a location first to see available dates
                </p>
              </div>

              <div v-else>
                <!-- Commit Full Event Button -->
                <div class="mb-4">
                  <Button
                    class="p-button-outlined w-full flex items-center"
                    @click="selectAllDates"
                    :disabled="availableDatesForLocation.length === 0"
                  >
                    <i class="pi pi-calendar mr-2"></i>
                    <span>Commit Full Event</span>
                    <Badge
                      :value="availableDatesForLocation.length"
                      severity="info"
                      class="ml-2"
                    ></Badge>
                  </Button>
                  <small class="text-green-600 mt-1 inline-block">
                    <i class="pi pi-info-circle mr-1"></i>
                    Committing to all dates increases your chances of selection
                  </small>
                </div>

                <!-- Calendar View - Use a different approach to highlight and control date selection -->
                <div class="mb-4 bg-white rounded-lg border border-gray-200">
                  <div
                    class="p-3 border-b border-gray-100 flex justify-between items-center"
                  >
                    <button
                      class="p-2 rounded-full hover:bg-gray-100"
                      @click="prevMonth"
                      type="button"
                    >
                      <i class="pi pi-chevron-left"></i>
                    </button>
                    <span class="font-medium">{{ currentMonthYear }}</span>
                    <button
                      class="p-2 rounded-full hover:bg-gray-100"
                      @click="nextMonth"
                      type="button"
                    >
                      <i class="pi pi-chevron-right"></i>
                    </button>
                  </div>

                  <!-- Days of Week Header -->
                  <div class="grid grid-cols-7 text-center p-2">
                    <div
                      v-for="day in ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']"
                      :key="day"
                      class="text-sm font-medium text-gray-700"
                    >
                      {{ day }}
                    </div>
                  </div>

                  <!-- Calendar Days -->
                  <div class="grid grid-cols-7 gap-1 p-2">
                    <!-- Empty cells for days before start of month -->
                    <div
                      v-for="_ in startDayOfMonth"
                      :key="`empty-start-${_}`"
                      class="h-10 rounded-md"
                    ></div>

                    <!-- Actual days of month -->
                    <div
                      v-for="day in daysInMonth"
                      :key="`day-${day}`"
                      class="h-10 flex items-center justify-center rounded-md relative"
                      :class="getDayClass(day)"
                      @click="toggleDateSelection(day)"
                    >
                      <span class="z-10">{{ day }}</span>
                    </div>

                    <!-- Empty cells for days after end of month -->
                    <div
                      v-for="_ in endDayOfMonth"
                      :key="`empty-end-${_}`"
                      class="h-10 rounded-md"
                    ></div>
                  </div>
                </div>

                <!-- Selected Dates Summary -->
                <div
                  v-if="selectedDates.length > 0"
                  class="bg-indigo-50 p-4 rounded-lg"
                >
                  <h3 class="font-medium text-indigo-800 mb-2">
                    Your Selected Dates
                  </h3>
                  <div class="flex flex-wrap gap-2">
                    <Chip
                      v-for="(date, index) in selectedDates"
                      :key="index"
                      :label="formatDate(date)"
                      class="bg-indigo-100 text-indigo-800"
                      aria-describedby="selected-date-chip-desc"
                    />
                  </div>
                  <span id="selected-date-chip-desc" class="sr-only"
                    >Selected dates.</span
                  >
                </div>

                <!-- Date Selection Error -->
                <small v-if="showDateError" class="p-error block mt-2">
                  Please select at least one date
                </small>
              </div>
            </div>
          </div>

          <!-- Next Button -->
          <div class="flex justify-end mt-6">
            <Button
              label="Continue to Review"
              icon="pi pi-arrow-right"
              iconPos="right"
              @click="validateAndProceed"
            />
          </div>
        </div>

        <!-- Step 2: Application Review & Confirmation -->
        <div
          v-else-if="activeIndex === 1"
          class="bg-white p-6 rounded-lg shadow-sm"
        >
          <div class="mb-6">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">
              Review Your Application
            </h2>

            <!-- Application Summary -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Job Details Card -->
              <div class="border border-gray-200 rounded-lg p-5">
                <h3
                  class="font-medium text-lg text-gray-800 mb-4 flex items-center"
                >
                  <i class="pi pi-briefcase text-indigo-500 mr-2"></i>
                  Job Details
                </h3>

                <div class="space-y-3">
                  <div class="flex">
                    <div class="w-28 text-gray-600">Position:</div>
                    <div class="font-medium text-gray-800">
                      {{ job?.title }}
                    </div>
                  </div>
                  <div class="flex">
                    <div class="w-28 text-gray-600">Company:</div>
                    <div class="font-medium text-gray-800">
                      {{ job?.company }}
                    </div>
                  </div>
                  <div class="flex">
                    <div class="w-28 text-gray-600">Salary:</div>
                    <div class="font-medium text-gray-800">
                      {{ job?.salary }}
                    </div>
                  </div>
                  <div class="flex">
                    <div class="w-28 text-gray-600">Job Type:</div>
                    <div class="font-medium text-gray-800">{{ job?.type }}</div>
                  </div>
                </div>
              </div>

              <!-- Selected Options Card -->
              <div class="border border-gray-200 rounded-lg p-5">
                <h3
                  class="font-medium text-lg text-gray-800 mb-4 flex items-center"
                >
                  <i class="pi pi-check-circle text-indigo-500 mr-2"></i>
                  Your Selections
                </h3>

                <!-- Selected Locations -->
                <div class="mb-4">
                  <h4 class="text-gray-600 font-medium mb-2">
                    Locations ({{ selectedLocationObjects.length }})
                  </h4>
                  <div class="pl-2 space-y-2">
                    <div
                      v-for="location in selectedLocationObjects"
                      :key="location.id"
                      class="text-gray-800"
                    >
                      <i class="pi pi-map-marker text-indigo-400 mr-1"></i>
                      <span
                        class="cursor-pointer hover:text-indigo-600 hover:underline"
                        @click="showLocationDetails(location.id)"
                        >{{ location.name }}</span
                      >
                    </div>
                  </div>
                </div>

                <!-- Selected Dates -->
                <div>
                  <h4 class="text-gray-600 font-medium mb-2">
                    Dates ({{ selectedDates.length }})
                  </h4>
                  <div class="pl-2 flex flex-wrap gap-2">
                    <Chip
                      v-for="(date, index) in selectedDates.slice(0, 5)"
                      :key="index"
                      :label="formatDate(date)"
                      class="bg-indigo-100 text-indigo-800 text-sm"
                      aria-label="Selected date"
                    />
                    <Chip
                      v-if="selectedDates.length > 5"
                      :label="`+${selectedDates.length - 5} more`"
                      class="bg-gray-100 text-gray-800 text-sm"
                      aria-label="Additional selected dates"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Profile Stats -->
            <div class="mt-6 p-5 border border-gray-200 rounded-lg bg-white">
              <h3
                class="font-medium text-lg text-gray-800 mb-4 flex items-center"
              >
                <i class="pi pi-user text-indigo-500 mr-2"></i>
                Your Profile Status
              </h3>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div class="flex items-center">
                    <i class="pi pi-file-pdf text-gray-600 mr-2"></i>
                    <span class="text-gray-700">Resume</span>
                  </div>
                  <div class="flex items-center">
                    <i
                      v-if="profileStats.data.hasResume"
                      class="pi pi-check-circle text-green-500 text-xl"
                    ></i>
                    <i
                      v-else
                      class="pi pi-times-circle text-red-500 text-xl"
                    ></i>
                  </div>
                </div>

                <div
                  class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div class="flex items-center">
                    <i class="pi pi-briefcase text-gray-600 mr-2"></i>
                    <span class="text-gray-700">Experience</span>
                  </div>
                  <div class="flex items-center">
                    <span
                      v-if="profileStats.data.experienceCount > 0"
                      class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium"
                    >
                      {{ profileStats.data.experienceCount }}
                    </span>
                    <i
                      v-else
                      class="pi pi-times-circle text-red-500 text-xl"
                    ></i>
                  </div>
                </div>

                <div
                  class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div class="flex items-center">
                    <i class="pi pi-camera text-gray-600 mr-2"></i>
                    <span class="text-gray-700">Work Photos</span>
                  </div>
                  <div class="flex items-center">
                    <span
                      v-if="profileStats.data.workingPhotoCount > 0"
                      class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium"
                    >
                      {{ profileStats.data.workingPhotoCount }}
                    </span>
                    <i
                      v-else
                      class="pi pi-times-circle text-red-500 text-xl"
                    ></i>
                  </div>
                </div>

                <div
                  class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div class="flex items-center">
                    <i class="pi pi-id-card text-gray-600 mr-2"></i>
                    <span class="text-gray-700">Personal Photos</span>
                  </div>
                  <div class="flex items-center">
                    <span
                      v-if="profileStats.data.comcardCount > 0"
                      class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium"
                    >
                      {{ profileStats.data.comcardCount }}
                    </span>
                    <i
                      v-else
                      class="pi pi-times-circle text-red-500 text-xl"
                    ></i>
                  </div>
                </div>
              </div>

              <div v-if="!isProfileComplete" class="mt-4 flex justify-center">
                <Button
                  label="Complete Your Profile"
                  icon="pi pi-user-edit"
                  class="p-button-warning"
                  @click="goToProfile"
                />
              </div>
            </div>

            <!-- Profile Completeness Warning -->
            <div
              class="mt-4 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400"
            >
              <h3 class="font-semibold text-yellow-800 mb-2 flex items-center">
                <i class="pi pi-exclamation-triangle text-yellow-500 mr-2"></i>
                Profile Completeness
              </h3>
              <p class="text-yellow-700 mb-2">
                Make sure your profile is complete with all required information
                before submitting:
              </p>
              <ul class="list-disc pl-6 space-y-1 text-yellow-700">
                <li>Professional photos uploaded</li>
                <li>Updated resume with relevant experience</li>
                <li>Work experience details fully completed</li>
                <li>Skills and qualifications added</li>
              </ul>
              <p class="text-yellow-700 mt-2 font-medium">
                A complete profile will increase your ranking in our AI matching
                system and improve your chances of being selected.
              </p>
            </div>

            <!-- No Last-Minute Cancellation Warning -->
            <div
              class="mt-4 p-4 bg-red-50 rounded-lg border-l-4 border-red-400"
            >
              <h3 class="font-semibold text-red-800 mb-2 flex items-center">
                <i class="pi pi-ban text-red-500 mr-2"></i>
                Cancellation Policy
              </h3>
              <p class="text-red-700">
                <span class="font-bold">IMPORTANT:</span> Once your application
                is confirmed by the recruiter, you cannot cancel without
                consequences. Last-minute cancellations or no-shows will
                significantly affect your reputation score in our system and
                reduce future job opportunities.
              </p>
              <p class="text-red-700 mt-2 font-medium">
                You may cancel before recruiter confirmation without penalty.
                After confirmation, your commitment is final.
              </p>
            </div>

            <!-- Terms & Conditions -->
            <div class="mt-6 p-4 bg-gray-50 rounded-lg">
              <div class="flex items-start">
                <Checkbox
                  v-model="termsAccepted"
                  :binary="true"
                  inputId="terms"
                />
                <label for="terms" class="ml-2 text-gray-700">
                  I confirm that I have read and agree to the
                  <a href="#" class="text-indigo-600 hover:underline"
                    >Terms and Conditions</a
                  >
                  and that the information provided is accurate.
                </label>
              </div>
            </div>
          </div>

          <!-- Navigation Buttons -->
          <div class="flex justify-between mt-6">
            <Button
              label="Back to Selection"
              icon="pi pi-arrow-left"
              class="p-button-outlined"
              @click="prevStep"
            />
            <Button
              label="Submit Application"
              icon="pi pi-check"
              :disabled="!termsAccepted"
              @click="submitApplication"
              :loading="submitting"
            />
          </div>
        </div>

        <!-- Step 3: Success Page -->
        <div
          v-else-if="activeIndex === 2"
          class="bg-white p-6 rounded-lg shadow-sm text-center"
        >
          <div class="mb-6 flex flex-col items-center">
            <div
              class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6"
            >
              <i class="pi pi-check-circle text-green-500 text-4xl"></i>
            </div>
            <h2 class="text-2xl font-bold text-gray-800 mb-2">
              Application Submitted Successfully!
            </h2>
            <p class="text-gray-600 mb-6 max-w-lg mx-auto">
              Your application has been received. We'll review it and get back
              to you soon.
            </p>

            <!-- Application Reference -->
            <div class="bg-gray-50 p-4 rounded-lg mb-6 w-full max-w-md mx-auto">
              <h3 class="font-medium text-gray-700 mb-2">
                Application Reference
              </h3>
              <div
                class="font-mono text-lg bg-white p-2 rounded border border-gray-200 flex justify-between items-center"
              >
                <span>{{ applicationReference }}</span>
                <Button
                  icon="pi pi-copy"
                  class="p-button-text p-button-sm"
                  @click="copyReference"
                  v-tooltip.top="'Copy to clipboard'"
                />
              </div>
            </div>

            <!-- Next Steps -->
            <div
              class="bg-indigo-50 p-5 rounded-lg w-full max-w-lg mx-auto text-left"
            >
              <h3 class="font-semibold text-indigo-800 mb-3">What's Next?</h3>
              <ul class="space-y-3">
                <li class="flex items-start">
                  <i class="pi pi-envelope text-indigo-500 mt-1 mr-2"></i>
                  <span
                    >You'll receive a confirmation email with your application
                    details.</span
                  >
                </li>
                <li class="flex items-start">
                  <i class="pi pi-clock text-indigo-500 mt-1 mr-2"></i>
                  <span
                    >The recruiter will review your application within 1-3
                    business days.</span
                  >
                </li>
                <li class="flex items-start">
                  <i class="pi pi-user text-indigo-500 mt-1 mr-2"></i>
                  <span
                    >You may be contacted for an interview or additional
                    information.</span
                  >
                </li>
              </ul>
            </div>
          </div>

          <!-- Navigation Buttons -->
          <div class="flex justify-center gap-4 mt-6">
            <Button
              label="View My Applications"
              icon="pi pi-list"
              class="p-button-outlined"
              @click="goToMyApplications"
            />
            <Button
              label="Back to Jobs"
              icon="pi pi-search"
              @click="goToJobSearch"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Location Notes Dialog -->
    <Dialog
      v-model:visible="locationNotesVisible"
      header="Location Notes"
      :style="{ width: '450px' }"
      :modal="true"
    >
      <div v-if="selectedLocationNotes" class="p-4">
        <h3 class="font-medium text-lg mb-2">
          {{ selectedLocationNotes.name }}
        </h3>
        <p class="text-gray-700">{{ selectedLocationNotes.notes }}</p>
      </div>
    </Dialog>

    <!-- Location Details Dialog -->
    <Dialog
      v-model:visible="locationDetailDialog"
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

    <!-- Toast for notifications -->
    <Toast />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';

// PrimeVue Components
import Steps from 'primevue/steps';
import Button from 'primevue/button';
import Calendar from 'primevue/calendar';
import Chip from 'primevue/chip';
import ProgressSpinner from 'primevue/progressspinner';
import Dialog from 'primevue/dialog';
import Checkbox from 'primevue/checkbox';
import Badge from 'primevue/badge';
import Toast from 'primevue/toast';

// Router and Toast
const route = useRoute();
const router = useRouter();
const toast = useToast();

// Steps definition - Now with 3 steps instead of 4
const steps = ref([
  { label: 'Location & Date Selection', icon: 'pi pi-map-marker' },
  { label: 'Review & Submit', icon: 'pi pi-check-square' },
  { label: 'Confirmation', icon: 'pi pi-check-circle' },
]);

// Application state
const activeIndex = ref(0);
const loading = ref(true);
const error = ref(null);
const job = ref(null);
const availableLocations = ref([]);
const selectedLocations = ref([]);
const selectedDates = ref([]);
const termsAccepted = ref(false);
const submitting = ref(false);
const applicationReference = ref(
  'APP-' + Math.random().toString(36).substring(2, 10).toUpperCase()
);

// Validation error states
const showLocationError = ref(false);
const showDateError = ref(false);

// Location notes dialog
const locationNotesVisible = ref(false);
const selectedLocationNotes = ref(null);

// Calendar state
const currentMonth = ref(new Date().getMonth());
const currentYear = ref(new Date().getFullYear());

// Add the mock data before the onMounted hook
// Mock job data
const mockJob = {
  id: 'job123',
  title: 'Sampling Promoter Needed',
  company: 'Insight Recruitment',
  companyName: 'Insight Recruitment',
  companyLogoUrl: 'https://via.placeholder.com/150',
  jobTitleType: 'PROMOTER',
  type: 'Promoter',
  salary: 130.0,
  location: 'Multiple Locations',
  salaryType: 'PER_DAY',
  paymentTerms: '25.04.2025 issue',
  requirementText:
    '1. Prefer Chinese & Malay\n2. Strictly no last mins pull out\n3. Can speak fluent Malay\n4. Attire: Top Provided but wear own plain black tshirt first, Own Black Long Pants (No Ripped Jean, No Short) & Black Sport Shoe\n',
  requirements: [
    'Prefer Chinese & Malay',
    'Strictly no last mins pull out',
    'Can speak fluent Malay',
    'Attire: Top Provided but wear own plain black tshirt first, Own Black Long Pants (No Ripped Jean, No Short) & Black Sport Shoe',
  ],
  benefits: [],
  jobSchedules: [
    {
      id: 1,
      jobId: 1,
      startDate: '2025-04-14',
      endDate: '2025-04-16',
      startTime: '10:00:00',
      endTime: '22:00:00',
      hoursOfRestTime: 2.0,
      numPositions: 5,
      scheduleDates: [
        {
          id: 14,
          workDate: '2025-04-14',
          jobLocations: [
            {
              id: 17,
              locationId: 'loc1',
              locationName: 'AEON',
              positionsNeeded: 5,
              positionsFilled: 0,
              status: 'OPEN',
              notes: null,
            },
            {
              id: 18,
              locationId: 'loc2',
              locationName: 'Billion Shopping Centre',
              positionsNeeded: 5,
              positionsFilled: 0,
              status: 'CLOSED', // AEON on 14th, Billion is CLOSED
              notes: null,
            },
            {
              id: 19,
              locationId: 'loc3',
              locationName: 'Pearl Point Shopping Mall',
              positionsNeeded: 5,
              positionsFilled: 4, // AEON on 14th, Pearl Point almost filled
              status: 'OPEN',
              notes: null,
            },
          ],
        },
        {
          id: 15,
          workDate: '2025-04-15',
          jobLocations: [
            {
              id: 20,
              locationId: 'loc1',
              locationName: 'AEON',
              positionsNeeded: 5,
              positionsFilled: 0,
              status: 'OPEN',
              notes: null,
            },
            {
              id: 21,
              locationId: 'loc2',
              locationName: 'Billion Shopping Centre',
              positionsNeeded: 5,
              positionsFilled: 0,
              status: 'OPEN', // All outlets available on the 15th
              notes: null,
            },
            {
              id: 22,
              locationId: 'loc3',
              locationName: 'Pearl Point Shopping Mall',
              positionsNeeded: 5,
              positionsFilled: 0,
              status: 'OPEN',
              notes: null,
            },
          ],
        },
        {
          id: 16,
          workDate: '2025-04-16',
          jobLocations: [
            {
              id: 23,
              locationId: 'loc1',
              locationName: 'AEON',
              positionsNeeded: 5,
              positionsFilled: 5, // AEON is fully booked on 16th
              status: 'CLOSED',
              notes: null,
            },
            {
              id: 24,
              locationId: 'loc2',
              locationName: 'Billion Shopping Centre',
              positionsNeeded: 5,
              positionsFilled: 0,
              status: 'OPEN',
              notes: null,
            },
            {
              id: 25,
              locationId: 'loc3',
              locationName: 'Pearl Point Shopping Mall',
              positionsNeeded: 5,
              positionsFilled: 0,
              status: 'CLOSED', // Pearl Point not available on 16th
              notes: null,
            },
          ],
        },
        // Add a new date only available for Billion
        {
          id: 17,
          workDate: '2025-04-17',
          jobLocations: [
            {
              id: 26,
              locationId: 'loc1',
              locationName: 'AEON',
              positionsNeeded: 0,
              positionsFilled: 0,
              status: 'CLOSED',
              notes: null,
            },
            {
              id: 27,
              locationId: 'loc2',
              locationName: 'Billion Shopping Centre',
              positionsNeeded: 5,
              positionsFilled: 0,
              status: 'OPEN', // Only Billion is open on 17th
              notes: null,
            },
            {
              id: 28,
              locationId: 'loc3',
              locationName: 'Pearl Point Shopping Mall',
              positionsNeeded: 0,
              positionsFilled: 0,
              status: 'CLOSED',
              notes: null,
            },
          ],
        },
      ],
    },
  ],
};

// Mock location data
const mockLocations = [
  {
    id: 'loc1',
    name: 'AEON',
    address: '123 Festival Plaza, Downtown',
    googleMapsUrl: 'https://maps.google.com',
    availablePositions: 5,
    notes: 'Main location with the highest traffic. Indoor and outdoor areas.',
  },
  {
    id: 'loc2',
    name: 'Billion Shopping Centre',
    address: '45 Harbor Drive, Waterfront District',
    googleMapsUrl: 'https://maps.google.com',
    availablePositions: 5,
    notes: 'Outdoor venue by the water. May require some setup work.',
  },
  {
    id: 'loc3',
    name: 'Pearl Point Shopping Mall',
    address: '789 Park Avenue, City Center',
    googleMapsUrl: 'https://maps.google.com',
    availablePositions: 5,
    notes: 'Large open space. Will require staff to cover multiple stations.',
  },
];

// Add the mock profile stats data
const profileStats = ref({
  statusCode: 200,
  message: 'Candidate profile statistics retrieved successfully',
  data: {
    candidateId: 4,
    experienceCount: 0,
    hasResume: false,
    workingPhotoCount: 0,
    comcardCount: 0,
  },
});

// Add a computed property to check if profile is complete
const isProfileComplete = computed(() => {
  const stats = profileStats.value.data;
  return (
    stats.experienceCount > 0 &&
    stats.hasResume &&
    stats.workingPhotoCount > 0 &&
    stats.comcardCount > 0
  );
});

// Computed properties
const currentStepTitle = computed(() => {
  const titles = [
    'Select Locations & Dates',
    'Review Your Application',
    'Application Submitted!',
  ];
  return titles[activeIndex.value];
});

const currentStepDescription = computed(() => {
  const descriptions = [
    'Choose where and when you would like to work',
    'Confirm your choices before submitting your application',
    'Your application has been successfully submitted',
  ];
  return descriptions[activeIndex.value];
});

const selectedLocationObjects = computed(() => {
  return availableLocations.value.filter((loc) =>
    selectedLocations.value.includes(loc.id)
  );
});

// Date constraints
const minDate = ref(new Date());
const maxDate = computed(() => {
  const date = new Date();
  date.setMonth(date.getMonth() + 3);
  return date;
});

// Available dates for selected location
const availableDatesForLocation = computed(() => {
  if (
    !selectedLocations.value.length ||
    !job.value ||
    !job.value.jobSchedules
  ) {
    return [];
  }

  const locationId = selectedLocations.value[0];
  const availableDates = [];

  job.value.jobSchedules.forEach((schedule) => {
    schedule.scheduleDates.forEach((scheduleDate) => {
      // Check if this location is available for this date
      const hasLocation = scheduleDate.jobLocations.some(
        (jobLocation) =>
          jobLocation.locationId.toString() === locationId.toString() &&
          jobLocation.status === 'OPEN' &&
          jobLocation.positionsFilled < jobLocation.positionsNeeded
      );

      if (hasLocation) {
        // Add this date to available dates
        availableDates.push(new Date(scheduleDate.workDate));
      }
    });
  });

  return availableDates;
});

// Unavailable dates - all dates except the available ones for the location
const unavailableDates = computed(() => {
  if (
    !selectedLocations.value.length ||
    !job.value ||
    !job.value.jobSchedules
  ) {
    return [];
  }

  // Get all possible dates from the job schedules
  const allPossibleDates = [];
  job.value.jobSchedules.forEach((schedule) => {
    schedule.scheduleDates.forEach((scheduleDate) => {
      allPossibleDates.push(new Date(scheduleDate.workDate).toDateString());
    });
  });

  // Get available dates for the location
  const availableDateStrings = availableDatesForLocation.value.map((date) =>
    date.toDateString()
  );

  // Create dates that are in allPossibleDates but not in availableDateStrings
  return allPossibleDates
    .filter((dateString) => !availableDateStrings.includes(dateString))
    .map((dateString) => new Date(dateString));
});

// Computed properties for the calendar
const currentMonthYear = computed(() => {
  const date = new Date(currentYear.value, currentMonth.value, 1);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
});

const daysInMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value + 1, 0).getDate();
});

const startDayOfMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value, 1).getDay();
});

const endDayOfMonth = computed(() => {
  const totalCells = 42; // 6 weeks x 7 days
  const usedCells = startDayOfMonth.value + daysInMonth.value;
  return totalCells - usedCells > 7
    ? totalCells - 7 - usedCells
    : totalCells - usedCells;
});

// Available days in current month for selected location
const availableDaysInCurrentMonth = computed(() => {
  if (!selectedLocations.value.length) return [];

  return availableDatesForLocation.value
    .filter(
      (date) =>
        date.getMonth() === currentMonth.value &&
        date.getFullYear() === currentYear.value
    )
    .map((date) => date.getDate());
});

// Currently selected days in this month
const selectedDaysInCurrentMonth = computed(() => {
  return selectedDates.value
    .filter((date) => {
      const d = new Date(date);
      return (
        d.getMonth() === currentMonth.value &&
        d.getFullYear() === currentYear.value
      );
    })
    .map((date) => new Date(date).getDate());
});

// Calendar navigation
const prevMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
};

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
};

// Check if a day is available for selection
const isDayAvailable = (day) => {
  return availableDaysInCurrentMonth.value.includes(day);
};

// Check if a day is selected - improve the detection logic
const isDaySelected = (day) => {
  return selectedDates.value.some((dateStr) => {
    const date = new Date(dateStr);
    return (
      date.getDate() === day &&
      date.getMonth() === currentMonth.value &&
      date.getFullYear() === currentYear.value
    );
  });
};

// Get the CSS class for a calendar day
const getDayClass = (day) => {
  const today = new Date();
  const isToday =
    day === today.getDate() &&
    currentMonth.value === today.getMonth() &&
    currentYear.value === today.getFullYear();

  const isAvailable = isDayAvailable(day);
  const isSelected = isDaySelected(day);

  return {
    'cursor-pointer hover:bg-indigo-100': isAvailable,
    'cursor-not-allowed opacity-40': !isAvailable,
    'bg-indigo-500 text-white hover:bg-indigo-600': isSelected,
    'bg-indigo-100': isToday && !isSelected,
    'border border-indigo-200': isAvailable && !isSelected,
  };
};

// Toggle date selection
const toggleDateSelection = (day) => {
  if (!isDayAvailable(day)) return;

  const newDate = new Date(currentYear.value, currentMonth.value, day);
  const dateString = newDate.toISOString();

  const index = selectedDates.value.findIndex(
    (d) => new Date(d).toDateString() === newDate.toDateString()
  );

  if (index >= 0) {
    // Remove date if already selected
    selectedDates.value.splice(index, 1);
  } else {
    // Add date
    selectedDates.value.push(dateString);
    showDateError.value = false;
  }
};

// Select all available dates for the selected location
const selectAllDates = () => {
  const availableDatesISO = availableDatesForLocation.value.map((date) =>
    date.toISOString()
  );

  // Set selected dates to all available dates
  selectedDates.value = [...availableDatesISO];
  showDateError.value = false;

  toast.add({
    severity: 'success',
    summary: 'Full Event Selected',
    detail: `You've committed to all ${selectedDates.value.length} days of this event`,
    life: 3000,
  });
};

// Load mock data
onMounted(() => {
  setTimeout(() => {
    job.value = mockJob;
    availableLocations.value = mockLocations;
    loading.value = false;
  }, 800); // Simulate loading delay
});

// Watch for changes in selected location to clear selected dates that are no longer available
watch(
  selectedLocations,
  (newSelectedLocations) => {
    if (newSelectedLocations.length > 0) {
      // Filter out selected dates that are no longer available for the location
      const availableDateStrings = availableDatesForLocation.value.map((date) =>
        date.toDateString()
      );

      // Only filter dates when location changes, not when removing individual dates
      if (selectedDates.value.length > 0) {
        selectedDates.value = selectedDates.value.filter((date) =>
          availableDateStrings.includes(new Date(date).toDateString())
        );
      }
    } else {
      // Clear selected dates if no location is selected
      selectedDates.value = [];
    }
  },
  { deep: true }
);

// Methods for location selection - updated for single location selection
const selectLocation = (locationId) => {
  // If selecting a different location, clear the selected dates
  if (selectedLocations.value[0] !== locationId) {
    // Clear all selected dates when changing location
    selectedDates.value = [];
  }

  selectedLocations.value = [locationId]; // Only one location can be selected
  showLocationError.value = false;
};

const showLocationNotes = (location) => {
  selectedLocationNotes.value = location;
  locationNotesVisible.value = true;
};

// Methods for date selection
const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

const removeDate = (index) => {
  // Store the date being removed to debug
  const dateBeingRemoved = selectedDates.value[index];
  console.log(
    'Removing date at index:',
    index,
    'Date value:',
    dateBeingRemoved
  );

  // Create a copy of the current dates before removing
  const previousDates = [...selectedDates.value];

  // Remove only the specific date at the given index
  selectedDates.value.splice(index, 1);

  console.log('Dates after removal:', selectedDates.value);

  // Force calendar to update by triggering a redraw
  nextTick(() => {
    // Force recomputation of selectedDaysInCurrentMonth
    const currentSelectedDates = selectedDaysInCurrentMonth.value;
    console.log(
      'Selected days in current month after removal:',
      currentSelectedDates
    );
  });
};

// Validate selections and proceed to next step
const validateAndProceed = () => {
  let isValid = true;

  if (selectedLocations.value.length === 0) {
    showLocationError.value = true;
    isValid = false;
  } else {
    showLocationError.value = false;
  }

  if (selectedDates.value.length === 0) {
    showDateError.value = true;
    isValid = false;
  } else {
    showDateError.value = false;
  }

  if (isValid) {
    nextStep();
  } else {
    // Scroll to error
    toast.add({
      severity: 'warn',
      summary: 'Missing Information',
      detail: 'Please select at least one location and one date',
      life: 3000,
    });
  }
};

// Navigation methods
const nextStep = () => {
  if (activeIndex.value < steps.value.length - 1) {
    activeIndex.value++;
  }
};

const prevStep = () => {
  if (activeIndex.value > 0) {
    activeIndex.value--;
  }
};

const goBackToJob = () => {
  const jobId = route.query.jobId;
  if (jobId) {
    // Navigate back to FindJobs with the specific job selected for display
    router.push({
      name: 'FindJobs',
      query: { showJob: jobId },
    });
  } else {
    // Fallback to standard back navigation if no job ID is available
    router.back();
  }
};

const goToMyApplications = () => {
  router.push({ name: 'MyApplications' });
};

const goToJobSearch = () => {
  router.push({ name: 'FindJobs' });
};

// Submit application
const submitApplication = async () => {
  if (!termsAccepted.value) {
    toast.add({
      severity: 'warn',
      summary: 'Terms Required',
      detail: 'Please accept the terms and conditions to continue',
      life: 3000,
    });
    return;
  }

  submitting.value = true;

  // Mock API call with simulated delay
  setTimeout(() => {
    // Log application data for development purposes
    console.log('Application Data:', {
      jobId: job.value.id,
      locationIds: selectedLocations.value,
      availableDates: selectedDates.value.map((date) => {
        return new Date(date).toISOString().split('T')[0];
      }),
    });

    // Move to success step
    nextStep();

    toast.add({
      severity: 'success',
      summary: 'Application Submitted',
      detail: 'Your job application has been successfully submitted',
      life: 5000,
    });

    submitting.value = false;
  }, 1500);
};

// Copy reference to clipboard
const copyReference = () => {
  navigator.clipboard
    .writeText(applicationReference.value)
    .then(() => {
      toast.add({
        severity: 'info',
        summary: 'Copied!',
        detail: 'Reference number copied to clipboard',
        life: 2000,
      });
    })
    .catch((err) => {
      console.error('Error copying to clipboard:', err);
    });
};

// Add the goToProfile method
const goToProfile = () => {
  router.push({ name: 'Profile' });
};

// Add to the existing ref declarations
const locationDetailDialog = ref(false);
const selectedLocation = ref(null);
const loadingLocation = ref(false);

// Add this method after the showLocationNotes method
const showLocationDetails = (locationId) => {
  if (!locationId) return;

  loadingLocation.value = true;
  locationDetailDialog.value = true;

  // Find location from our available locations
  selectedLocation.value = availableLocations.value.find(
    (loc) => loc.id === locationId
  );

  // Simulate API call delay
  setTimeout(() => {
    loadingLocation.value = false;
  }, 500);
};
</script>

<style scoped>
/* Base styling for the steps component */
:deep(.p-steps) {
  background: white;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

:deep(.p-steps .p-steps-item .p-menuitem-link) {
  background: transparent;
  padding: 0.5rem 1rem;
}

:deep(.p-steps .p-steps-item .p-menuitem-link .p-steps-number) {
  background: #f3f4f6;
  color: #4f46e5;
  border-color: #e5e7eb;
}

:deep(.p-steps .p-steps-item.p-highlight .p-steps-number) {
  background: #4f46e5;
  color: white;
}

:deep(.p-calendar) {
  width: 100%;
}

:deep(.p-calendar .p-datepicker-header) {
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

:deep(.p-datepicker table td > span.p-highlight) {
  background: #4f46e5;
  color: white;
}

:deep(.p-datepicker table td.p-datepicker-today > span.p-highlight) {
  background: #4f46e5;
  color: white;
}

:deep(.p-datepicker table td.p-datepicker-today > span) {
  background: #e0e7ff;
  color: #4f46e5;
}

/* Styling for calendar to highlight available dates */
:deep(.p-datepicker td[data-pc-section='day'].p-highlight) {
  background: #c7d2fe;
}

/* Add scrollbar styling for location list */
.max-h-\[500px\]::-webkit-scrollbar {
  width: 8px;
}

.max-h-\[500px\]::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.max-h-\[500px\]::-webkit-scrollbar-thumb {
  background: #c7d2fe;
  border-radius: 10px;
}

.max-h-\[500px\]::-webkit-scrollbar-thumb:hover {
  background: #818cf8;
}

/* Mobile responsiveness */
@media (max-width: 640px) {
  :deep(.p-steps .p-steps-item .p-menuitem-link .p-steps-title) {
    display: none;
  }

  :deep(.p-steps .p-steps-item) {
    flex: 1;
  }
}

@media (max-width: 768px) {
  /* Add spacing between location and date sections on mobile */
  .grid.grid-cols-1.lg\:grid-cols-2 > div:first-child {
    margin-bottom: 2rem;
  }
}

/* Additional styles for calendar */
.grid-cols-7 {
  grid-template-columns: repeat(7, minmax(0, 1fr));
}

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
