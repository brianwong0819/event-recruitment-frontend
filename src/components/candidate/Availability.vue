<!-- 
  Candidate Availability Component
  This component allows candidates to set their availability type (anytime, weekdays only, 
  weekends only, or custom dates) and save the settings.
-->
<template>
  <div class="availability-container">
    <!-- Toast for notifications -->
    <Toast position="top-right" />

    <!-- Main content container -->
    <div class="bg-white rounded-xl shadow-md overflow-hidden">
      <!-- Header section -->
      <div
        class="flex justify-between items-center p-3 md:p-5 border-b bg-gradient-to-r from-primary-50 to-white"
      >
        <h2
          class="text-base md:text-lg font-semibold text-gray-800 flex items-center"
        >
          <i class="pi pi-calendar text-primary-500 mr-2"></i>
          Availability
        </h2>
        <Button
          icon="pi pi-calendar-plus"
          label="Update Availability"
          class="p-button-sm"
          @click="showAvailabilityDialog = true"
        />
      </div>

      <!-- Content section -->
      <div class="p-4 md:p-6">
        <!-- Loading state -->
        <div v-if="loading" class="flex justify-center py-5">
          <div class="animate-pulse flex flex-col items-center">
            <i class="pi pi-spin pi-spinner text-primary-500 text-2xl mb-2"></i>
            <p class="text-primary-500">Loading your availability...</p>
          </div>
        </div>

        <!-- Empty state - no availability set yet -->
        <div
          v-else-if="!availabilityType"
          class="text-center p-4 md:p-8 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 transition-all duration-300 hover:border-primary-200"
        >
          <div
            class="bg-white inline-flex p-3 md:p-4 rounded-full mb-3 md:mb-4 shadow-sm"
          >
            <i class="pi pi-calendar text-gray-400 text-xl md:text-2xl"></i>
          </div>
          <p class="text-gray-700 font-medium mb-2 text-sm md:text-base">
            You haven't set your availability yet
          </p>
          <p
            class="text-xs md:text-sm text-gray-500 mb-3 md:mb-4 max-w-md mx-auto"
          >
            Let recruiters know when you're available to work to increase your
            chances of being selected for events
          </p>
          <Button
            icon="pi pi-calendar-plus"
            label="Set Availability"
            class="p-button-sm shadow-sm"
            @click="showAvailabilityDialog = true"
          />
        </div>

        <!-- Availability display when set -->
        <div v-else>
          <div
            class="bg-gradient-to-br from-primary-50 to-white p-3 md:p-4 rounded-lg mb-3 md:mb-4 border border-primary-100"
          >
            <p
              class="text-xs md:text-sm text-primary-700 mb-1 font-medium flex items-center"
            >
              <i class="pi pi-info-circle mr-2 text-primary-500"></i>
              Your current availability:
            </p>
          </div>

          <!-- Display for "ANYTIME" availability -->
          <div
            v-if="availabilityType === 'ANYTIME'"
            class="bg-green-50 p-4 rounded-lg border border-green-100 mb-4"
          >
            <div class="flex items-center mb-2">
              <i class="pi pi-check-circle text-green-600 mr-2 text-lg"></i>
              <h3 class="text-green-800 font-semibold">Available Anytime</h3>
            </div>
            <p class="text-green-700 text-sm">
              You're available to work on any day. Recruiters can assign you to
              events on any date.
            </p>
          </div>

          <!-- Display for "WEEKDAYS" availability -->
          <div
            v-else-if="availabilityType === 'WEEKDAYS_ONLY'"
            class="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4"
          >
            <div class="flex items-center mb-2">
              <i class="pi pi-briefcase text-blue-600 mr-2 text-lg"></i>
              <h3 class="text-blue-800 font-semibold">Available on Weekdays</h3>
            </div>
            <p class="text-blue-700 text-sm">
              You're available to work Monday through Friday. Recruiters will
              only assign you to weekday events.
            </p>
          </div>

          <!-- Display for "WEEKENDS" availability -->
          <div
            v-else-if="availabilityType === 'WEEKENDS_ONLY'"
            class="bg-yellow-50 p-4 rounded-lg border border-yellow-100 mb-4"
          >
            <div class="flex items-center mb-2">
              <i class="pi pi-home text-yellow-600 mr-2 text-lg"></i>
              <h3 class="text-yellow-800 font-semibold">
                Available on Weekends
              </h3>
            </div>
            <p class="text-yellow-700 text-sm">
              You're available to work Saturday and Sunday. Recruiters will only
              assign you to weekend events.
            </p>
          </div>

          <!-- Display for "CUSTOM_DATES" availability -->
          <div v-else-if="availabilityType === 'CUSTOM_DATES'" class="mb-4">
            <div
              class="bg-purple-50 p-4 rounded-lg border border-purple-100 mb-3"
            >
              <div class="flex items-center mb-2">
                <i class="pi pi-calendar-plus text-purple-600 mr-2 text-lg"></i>
                <h3 class="text-purple-800 font-semibold">
                  Available on Specific Dates
                </h3>
              </div>
              <p class="text-purple-700 text-sm">
                You're available to work only on the following selected dates:
              </p>
            </div>

            <!-- Custom dates grid -->
            <div
              class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 mt-3"
            >
              <div
                v-for="(date, index) in customDates"
                :key="index"
                class="flex items-center bg-green-50 rounded-lg p-2 md:p-3 transition-all duration-300 hover:bg-green-100 hover:shadow-sm border border-green-100"
              >
                <i
                  class="pi pi-calendar-check text-green-600 mr-2 text-sm md:text-base"
                ></i>
                <p class="text-green-800 font-medium text-xs md:text-sm">
                  {{ formatAvailabilityDate(date) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Edit button -->
          <div class="mt-3 md:mt-4 flex justify-end">
            <Button
              icon="pi pi-pencil"
              label="Edit Availability"
              class="p-button-outlined p-button-sm"
              @click="showAvailabilityDialog = true"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Availability Dialog -->
    <Dialog
      v-model:visible="showAvailabilityDialog"
      header="Set Your Availability"
      :style="{ width: '550px', maxWidth: '95vw' }"
      :modal="true"
      :closable="false"
      class="availability-dialog rounded-xl p-0"
    >
      <div class="p-fluid px-5 py-4">
        <!-- Availability type selection -->
        <div class="field mb-5">
          <label
            class="font-medium text-gray-700 text-sm flex items-center mb-3"
          >
            <i class="pi pi-calendar text-primary-500 mr-2"></i>
            Availability Type
          </label>

          <div class="flex flex-col gap-2">
            <!-- Anytime option -->
            <div
              :class="[
                'flex items-center p-4 rounded-lg border transition-all cursor-pointer',
                selectedType === 'ANYTIME'
                  ? 'bg-green-50 border-green-200 shadow-sm'
                  : 'bg-white border-gray-200 hover:bg-gray-50',
              ]"
              @click="selectedType = 'ANYTIME'"
            >
              <div class="radio-wrapper mr-2">
                <RadioButton
                  v-model="selectedType"
                  value="ANYTIME"
                  :inputId="'type-anytime'"
                  class="custom-radio"
                />
                <div
                  class="custom-radio-icon"
                  :class="{ active: selectedType === 'ANYTIME' }"
                ></div>
              </div>
              <label :for="'type-anytime'" class="ml-2 cursor-pointer flex-1">
                <span class="font-medium text-gray-800 block mb-1"
                  >Available Anytime</span
                >
                <span class="text-xs text-gray-600 block"
                  >I can work on any day, including weekdays and weekends</span
                >
              </label>
            </div>

            <!-- Weekdays only option -->
            <div
              :class="[
                'flex items-center p-4 rounded-lg border transition-all cursor-pointer',
                selectedType === 'WEEKDAYS_ONLY'
                  ? 'bg-blue-50 border-blue-200 shadow-sm'
                  : 'bg-white border-gray-200 hover:bg-gray-50',
              ]"
              @click="selectedType = 'WEEKDAYS_ONLY'"
            >
              <div class="radio-wrapper mr-2">
                <RadioButton
                  v-model="selectedType"
                  value="WEEKDAYS_ONLY"
                  :inputId="'type-weekdays'"
                  class="custom-radio"
                />
                <div
                  class="custom-radio-icon"
                  :class="{ active: selectedType === 'WEEKDAYS_ONLY' }"
                ></div>
              </div>
              <label :for="'type-weekdays'" class="ml-2 cursor-pointer flex-1">
                <span class="font-medium text-gray-800 block mb-1"
                  >Weekdays Only</span
                >
                <span class="text-xs text-gray-600 block"
                  >I'm available Monday through Friday only</span
                >
              </label>
            </div>

            <!-- Weekends only option -->
            <div
              :class="[
                'flex items-center p-4 rounded-lg border transition-all cursor-pointer',
                selectedType === 'WEEKENDS_ONLY'
                  ? 'bg-yellow-50 border-yellow-200 shadow-sm'
                  : 'bg-white border-gray-200 hover:bg-gray-50',
              ]"
              @click="selectedType = 'WEEKENDS_ONLY'"
            >
              <div class="radio-wrapper mr-2">
                <RadioButton
                  v-model="selectedType"
                  value="WEEKENDS_ONLY"
                  :inputId="'type-weekends'"
                  class="custom-radio"
                />
                <div
                  class="custom-radio-icon"
                  :class="{ active: selectedType === 'WEEKENDS_ONLY' }"
                ></div>
              </div>
              <label :for="'type-weekends'" class="ml-2 cursor-pointer flex-1">
                <span class="font-medium text-gray-800 block mb-1"
                  >Weekends Only</span
                >
                <span class="text-xs text-gray-600 block"
                  >I'm available Saturday and Sunday only</span
                >
              </label>
            </div>

            <!-- Custom dates option -->
            <div
              :class="[
                'flex items-center p-4 rounded-lg border transition-all cursor-pointer',
                selectedType === 'CUSTOM_DATES'
                  ? 'bg-purple-50 border-purple-200 shadow-sm'
                  : 'bg-white border-gray-200 hover:bg-gray-50',
              ]"
              @click="selectedType = 'CUSTOM_DATES'"
            >
              <div class="radio-wrapper mr-2">
                <RadioButton
                  v-model="selectedType"
                  value="CUSTOM_DATES"
                  :inputId="'type-custom'"
                  class="custom-radio"
                />
                <div
                  class="custom-radio-icon"
                  :class="{ active: selectedType === 'CUSTOM_DATES' }"
                ></div>
              </div>
              <label :for="'type-custom'" class="ml-2 cursor-pointer flex-1">
                <span class="font-medium text-gray-800 block mb-1"
                  >Custom Dates</span
                >
                <span class="text-xs text-gray-600 block"
                  >I want to select specific dates when I'm available</span
                >
              </label>
            </div>
          </div>
        </div>

        <!-- Calendar for custom dates selection -->
        <div v-if="selectedType === 'CUSTOM_DATES'" class="field mb-5">
          <label
            class="font-medium mb-2 block text-gray-700 text-sm flex items-center"
          >
            <i class="pi pi-calendar text-primary-500 mr-2"></i>
            Select Specific Dates
          </label>
          <div
            class="bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-inner"
          >
            <Calendar
              v-model="selectedDates"
              selectionMode="multiple"
              :inline="true"
              :minDate="new Date()"
              class="w-full shadow-sm calendar-container"
              style="border-radius: 0.75rem"
            />
          </div>
          <small v-if="customDatesError" class="p-error block mt-2">{{
            customDatesError
          }}</small>
          <p v-else class="text-xs text-gray-500 mt-2 flex items-center">
            <i class="pi pi-info-circle text-primary-400 mr-1"></i>
            Select all dates when you would be available to work
          </p>
        </div>

        <!-- Error message -->
        <small v-if="formError" class="p-error block mt-4 text-center">{{
          formError
        }}</small>

        <!-- Error notification -->
        <div
          v-if="formError"
          class="mt-4 text-red-500 text-sm flex items-center"
        >
          <i class="pi pi-exclamation-circle mr-2"></i>
          <span>Failed to update availability. Please try again.</span>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex justify-between items-center p-4 border-t">
        <button
          @click="closeDialog"
          class="flex items-center text-gray-700 font-medium px-4 py-2 rounded hover:bg-gray-100"
        >
          <i class="pi pi-times mr-2"></i>
          Cancel
        </button>

        <button
          @click="saveAvailability"
          :disabled="isSubmitDisabled || saving"
          class="flex items-center bg-primary-500 text-white font-medium px-6 py-2 rounded hover:bg-primary-600 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <i v-if="!saving" class="pi pi-check mr-2"></i>
          <i v-else class="pi pi-spin pi-spinner mr-2"></i>
          Save Availability
        </button>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import { format, parseISO } from 'date-fns';
import { apiClient } from '../../services/api.service';

// Toast for notifications
const toast = useToast();

// Component state
const loading = ref(true);
const saving = ref(false);
const showAvailabilityDialog = ref(false);
const formError = ref('');
const customDatesError = ref('');

// Availability data
const availabilityType = ref('');
const customDates = ref([]);

// Form state
const selectedType = ref('');
const selectedDates = ref([]);

// Computed properties
const isSubmitDisabled = computed(() => {
  if (
    selectedType.value === 'CUSTOM_DATES' &&
    (!selectedDates.value || selectedDates.value.length === 0)
  ) {
    return true;
  }
  return false;
});

// Format date for display
const formatAvailabilityDate = (dateString) => {
  if (!dateString) return '';
  try {
    return format(parseISO(dateString), 'EEE, MMM d, yyyy');
  } catch (e) {
    return dateString;
  }
};

// Convert date objects to string format for API
const formatDateForApi = (date) => {
  if (!date) return '';
  try {
    return format(date, 'yyyy-MM-dd');
  } catch (e) {
    console.error('Error formatting date:', e);
    return '';
  }
};

// Close dialog and reset form state
const closeDialog = () => {
  showAvailabilityDialog.value = false;
  formError.value = '';
  customDatesError.value = '';

  // Reset form to current values
  selectedType.value = availabilityType.value || '';
  selectedDates.value = customDates.value.map((date) => new Date(date)) || [];
};

// Ensure enum values match backend expected values when fetching and setting
const mapToCorrectEnumValues = (type) => {
  const enumMapping = {
    WEEKDAYS: 'WEEKDAYS_ONLY',
    WEEKENDS: 'WEEKENDS_ONLY',
  };

  return enumMapping[type] || type;
};

// Fetch availability data from the API
const fetchAvailability = async () => {
  loading.value = true;
  try {
    const response = await apiClient.get('/candidates/availability');

    if (response.data && response.data.data) {
      const availData = response.data.data;

      // Ensure we're using the correct enum values
      availabilityType.value =
        mapToCorrectEnumValues(availData.availabilityType) || '';

      if (
        availData.availabilityType === 'CUSTOM_DATES' &&
        availData.customDates
      ) {
        customDates.value = availData.customDates;

        // Also set the selected dates for the form
        selectedDates.value = customDates.value.map(
          (dateStr) => new Date(dateStr)
        );
      } else {
        customDates.value = [];
        selectedDates.value = [];
      }

      // Set the form initial values
      selectedType.value = availabilityType.value;
    }
  } catch (error) {
    console.error('Error fetching availability:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load availability settings. Please try again.',
      life: 5000,
    });
  } finally {
    loading.value = false;
  }
};

// Save availability settings
const saveAvailability = async () => {
  formError.value = '';
  customDatesError.value = '';

  // Validate custom dates if that option is selected
  if (selectedType.value === 'CUSTOM_DATES') {
    if (!selectedDates.value || selectedDates.value.length === 0) {
      customDatesError.value = 'Please select at least one date.';
      return;
    }
  }

  saving.value = true;

  try {
    const requestData = {
      availabilityType: selectedType.value,
    };

    // Add custom dates if that option is selected
    if (selectedType.value === 'CUSTOM_DATES') {
      requestData.customDates = selectedDates.value.map((date) =>
        formatDateForApi(date)
      );
    }

    console.log('Sending availability data:', requestData);

    const response = await apiClient.put(
      '/candidates/availability',
      requestData
    );

    if (response.data && response.data.statusCode === 200) {
      // Update local state with the new values
      availabilityType.value = selectedType.value;

      if (selectedType.value === 'CUSTOM_DATES') {
        customDates.value = selectedDates.value.map((date) =>
          formatDateForApi(date)
        );
      } else {
        customDates.value = [];
      }

      // Close dialog and show success message
      showAvailabilityDialog.value = false;

      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Your availability has been updated successfully.',
        life: 5000,
      });
    } else {
      formError.value = 'Failed to update availability. Please try again.';
    }
  } catch (error) {
    console.error('Error saving availability:', error);

    // Handle different types of errors
    if (error.response) {
      if (error.response.status === 400) {
        formError.value =
          error.response.data.message ||
          'Invalid availability data. Please check your selections.';
      } else if (error.response.status === 401) {
        formError.value = 'You must be logged in to update your availability.';
      } else {
        formError.value = 'Failed to update availability. Please try again.';
      }
    } else {
      formError.value =
        'Network error. Please check your connection and try again.';
    }

    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: formError.value,
      life: 5000,
    });
  } finally {
    saving.value = false;
  }
};

// Load data when component mounts
onMounted(() => {
  fetchAvailability();
});
</script>

<style scoped>
.availability-dialog :deep(.p-dialog-header) {
  border-top-left-radius: 0.75rem;
  border-top-right-radius: 0.75rem;
  padding: 1.25rem 1.5rem;
  background: white;
  border-bottom: 1px solid #f0f0f0;
}

.availability-dialog :deep(.p-dialog-title) {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
}

.availability-dialog :deep(.p-dialog-content) {
  border-bottom-left-radius: 0.75rem;
  border-bottom-right-radius: 0.75rem;
  padding: 0;
}

.radio-wrapper {
  position: relative;
  display: inline-block;
  width: 20px;
  height: 20px;
}

.radio-wrapper .custom-radio {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.custom-radio-icon {
  position: absolute;
  top: 0;
  left: 0;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #d1d5db;
  background-color: white;
}

.custom-radio-icon.active {
  border-color: var(--primary-500);
}

.custom-radio-icon.active:after {
  content: '';
  position: absolute;
  top: 4px;
  left: 4px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--primary-500);
}

/* Override calendar styling */
:deep(.p-datepicker) {
  border-radius: 0.75rem;
  overflow: hidden;
  width: 100%;
  border: none;
  box-shadow: none;
}

:deep(.p-datepicker table) {
  font-size: 0.875rem;
  width: 100%;
}

:deep(.p-datepicker table td) {
  padding: 0.3rem;
}

:deep(.p-datepicker table td > span) {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.p-datepicker table td.p-datepicker-today > span) {
  background-color: #f0f7ff;
  color: var(--primary-600);
  border: 1px solid #cce0ff;
}

:deep(.p-datepicker table td.p-highlight > span) {
  background-color: var(--primary-500) !important;
  color: white !important;
}

:deep(.p-highlight) {
  background-color: var(--primary-500) !important;
}

:deep(.p-datepicker-header) {
  padding: 0.75rem;
  background-color: white;
  border-bottom: 1px solid #f0f0f0;
}

:deep(.p-datepicker-next, .p-datepicker-prev) {
  color: #666;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  transition: background-color 0.2s;
}

:deep(.p-datepicker-next:hover, .p-datepicker-prev:hover) {
  background-color: #f0f0f0;
  color: #333;
}

.calendar-container {
  max-width: 100%;
  margin: 0 auto;
}
</style>
