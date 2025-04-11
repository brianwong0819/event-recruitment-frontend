<template>
  <div class="job-location-scheduler">
    <!-- Section Header -->
    <div
      class="flex justify-between items-center mb-4 pb-2 border-b border-gray-100"
    >
      <h4 class="text-lg font-medium flex items-center">
        <i class="pi pi-calendar-plus text-primary-400 mr-2"></i>
        {{ title || 'Schedule Section' }}
      </h4>
      <div class="flex">
        <Button
          v-if="showRemoveButton"
          icon="pi pi-trash"
          class="p-button-text p-button-danger p-button-sm"
          @click="$emit('remove')"
        />
      </div>
    </div>

    <!-- Date selection -->
    <div class="mb-5">
      <label class="block text-gray-700 font-medium mb-2 flex items-center">
        <i class="pi pi-calendar text-primary-400 mr-2"></i>
        Working Dates <span class="text-red-500">*</span>
      </label>
      <div class="relative">
        <Calendar
          v-model="selectedDates"
          selectionMode="multiple"
          :manualInput="false"
          dateFormat="dd M yy"
          placeholder="Select working dates"
          panelClass="date-picker-panel"
          class="w-full"
          :minDate="minDate"
          @date-select="updateLocationSchedules"
          @month-change="updateCalendar"
        />
      </div>
      <div class="flex items-center mt-2">
        <i class="pi pi-info-circle text-primary-300 mr-2"></i>
        <div class="text-sm text-gray-600">
          <span class="font-medium">Selected dates: </span>
          <span
            v-if="selectedDates && selectedDates.length > 0"
            class="text-gray-700"
          >
            {{ formatSelectedDates(selectedDates) }}
          </span>
          <span v-else class="italic text-gray-500">None selected</span>
        </div>
      </div>
    </div>

    <!-- Location selection -->
    <div>
      <label class="block text-gray-700 font-medium mb-2 flex items-center">
        <i class="pi pi-map-marker text-primary-400 mr-2"></i>
        Locations <span class="text-red-500">*</span>
      </label>

      <!-- Location search component -->
      <LocationSearch
        v-model="selectedLocations"
        @update:modelValue="handleLocationsUpdate"
        @editLocation="editLocationSettings"
        :locationSettings="getLocationSettings()"
      />
    </div>

    <!-- Location Settings Dialog -->
    <Dialog
      v-model:visible="showLocationDialog"
      :header="
        currentLocation ? 'Edit ' + currentLocation.name : 'Edit Location'
      "
      :style="{ width: '550px', borderRadius: '12px' }"
      modal
      class="location-settings-dialog p-dialog-custom"
    >
      <div v-if="currentLocation" class="p-4">
        <div
          class="mb-6 bg-gray-50 p-4 rounded-lg border-l-4 border-primary-500"
        >
          <h5 class="text-lg font-medium text-gray-800 mb-1">
            {{ currentLocation.name }}
          </h5>
          <div class="text-sm text-gray-600">{{ currentLocation.address }}</div>
        </div>

        <div class="mb-5">
          <label class="block text-gray-700 font-medium mb-2 flex items-center">
            <i class="pi pi-users text-primary-500 mr-2"></i>
            Positions Needed <span class="text-red-500">*</span>
          </label>
          <InputNumber
            v-model="locationDialogData.positionsNeeded"
            placeholder="Number of positions"
            :min="1"
            class="w-full"
            inputClass="text-lg"
          />
          <small class="text-gray-500 block mt-1 ml-1"
            >Number of staff needed at this location for all selected
            dates</small
          >
        </div>

        <div class="mb-5">
          <label class="block text-gray-700 font-medium mb-2 flex items-center">
            <i class="pi pi-comment text-primary-500 mr-2"></i>
            Notes (Optional)
          </label>
          <Textarea
            v-model="locationDialogData.notes"
            placeholder="e.g., 2 Female, 3 Male or Need typhoid cert"
            class="w-full notes-textarea"
            rows="4"
            autoResize
          />
          <small class="text-gray-500 block mt-1 ml-1"
            >Special requirements or notes for this location</small
          >
        </div>
      </div>

      <template #footer>
        <div
          class="flex justify-end space-x-2 p-3 -mx-5 -mb-5 rounded-b-lg"
        >
          <Button
            label="Cancel"
            icon="pi pi-times"
            class="p-button-text"
            @click="closeLocationDialog"
          />
          <Button
            label="Save"
            icon="pi pi-check"
            class="p-button-primary"
            @click="saveLocationSettings"
          />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import Calendar from 'primevue/calendar';
import Button from 'primevue/button';
import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Dialog from 'primevue/dialog';
import LocationSearch from './LocationSearch.vue';

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      dates: [],
      locations: [],
      scheduleData: {},
    }),
  },
  title: {
    type: String,
    default: '',
  },
  sectionIndex: {
    type: Number,
    default: 0,
  },
  minDate: {
    type: Date,
    default: () => new Date(),
  },
  defaultPositions: {
    type: Number,
    default: 1,
  },
  showRemoveButton: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(['update:modelValue', 'remove']);

// Local state
const selectedDates = ref([...props.modelValue.dates]);
const selectedLocations = ref([...props.modelValue.locations]);
const scheduleData = ref({ ...props.modelValue.scheduleData });
const activeDate = ref('');
const showLocationDialog = ref(false);
const currentLocation = ref(null);
const currentLocationIndex = ref(-1);
const locationDialogData = ref({
  positionsNeeded: 1,
  notes: '',
});

// Format date for display
const formatSelectedDates = (dates) => {
  if (!dates || dates.length === 0) return '';

  // Sort dates chronologically
  const sortedDates = [...dates].sort((a, b) => new Date(a) - new Date(b));

  return sortedDates
    .map((date) => {
      return new Date(date).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
      });
    })
    .join(', ');
};

// Format date for tab display
const formatDateShort = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
  });
};

// Format date with day of week
const formatDateLong = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

// Set the active date for detailed schedule view
const setActiveDate = (date) => {
  const dateStr = new Date(date).toISOString();
  activeDate.value = dateStr;

  // Ensure schedule exists for this date
  if (!scheduleData.value[dateStr]) {
    // Create a new copy of schedule data to avoid direct reactivity issues
    const updatedScheduleData = { ...scheduleData.value };
    updatedScheduleData[dateStr] = {};

    // Initialize with all selected locations
    selectedLocations.value.forEach((location) => {
      if (location.id) {
        updatedScheduleData[dateStr][location.id] = {
          locationId: location.id,
          positionsNeeded: props.defaultPositions,
          notes: null,
        };
      }
    });

    // Update the state with the new copy
    scheduleData.value = updatedScheduleData;
  }
};

// Get location schedule for a specific date
const getLocationSchedule = (dateStr, locationId) => {
  // Create a new copy if we need to modify the object
  if (
    !scheduleData.value[dateStr] ||
    !scheduleData.value[dateStr][locationId]
  ) {
    const updatedScheduleData = { ...scheduleData.value };

    if (!updatedScheduleData[dateStr]) {
      updatedScheduleData[dateStr] = {};
    }

    if (!updatedScheduleData[dateStr][locationId]) {
      updatedScheduleData[dateStr][locationId] = {
        locationId,
        positionsNeeded: props.defaultPositions,
        notes: null,
      };
    }

    // Update the state with the new copy
    scheduleData.value = updatedScheduleData;
  }

  return scheduleData.value[dateStr][locationId];
};

// Update location schedules when dates or locations change
const updateLocationSchedules = () => {
  if (
    selectedDates.value.length === 0 ||
    selectedLocations.value.length === 0
  ) {
    return;
  }

  // Create a new copy of the schedule data to avoid direct mutation
  const updatedScheduleData = { ...scheduleData.value };

  // Ensure each date-location combination has an entry
  selectedDates.value.forEach((date) => {
    const dateStr = new Date(date).toISOString();

    if (!updatedScheduleData[dateStr]) {
      updatedScheduleData[dateStr] = {};
    }

    selectedLocations.value.forEach((location) => {
      if (location.id && !updatedScheduleData[dateStr][location.id]) {
        updatedScheduleData[dateStr][location.id] = {
          locationId: location.id,
          positionsNeeded: props.defaultPositions,
          notes: null,
        };
      }
    });
  });

  // Update the state with the new copy
  scheduleData.value = updatedScheduleData;
};

// Sort selected dates
const sortedSelectedDates = computed(() => {
  return [...selectedDates.value].sort((a, b) => new Date(a) - new Date(b));
});

// Calculate total positions needed across all dates and locations
const totalPositionsNeeded = computed(() => {
  let total = 0;

  // If there's no schedule data yet, return the default positions × locations count
  if (Object.keys(scheduleData.value).length === 0) {
    return selectedLocations.value.length * props.defaultPositions;
  }

  // For each date in the schedule
  Object.keys(scheduleData.value).forEach((dateStr) => {
    // For each location on that date
    Object.values(scheduleData.value[dateStr] || {}).forEach((location) => {
      if (location && location.positionsNeeded) {
        total += location.positionsNeeded;
      }
    });
  });

  return total;
});

// Watch for changes in props
watch(
  () => props.modelValue,
  (newValue) => {
    // Prevent recursive updates by checking that this isn't from our own emitted update
    if (
      JSON.stringify(newValue) !==
      JSON.stringify({
        dates: selectedDates.value,
        locations: selectedLocations.value,
        scheduleData: scheduleData.value,
      })
    ) {
      selectedDates.value = [...newValue.dates];
      selectedLocations.value = [...newValue.locations];
      scheduleData.value = { ...newValue.scheduleData };

      if (selectedDates.value.length > 0 && !activeDate.value) {
        setActiveDate(selectedDates.value[0]);
      }
    }
  },
  { deep: true }
);

// Watch for changes in local state and emit updates
watch(
  [selectedDates, selectedLocations, scheduleData],
  () => {
    emit('update:modelValue', {
      dates: selectedDates.value,
      locations: selectedLocations.value,
      scheduleData: scheduleData.value,
    });

    if (selectedDates.value.length > 0 && !activeDate.value) {
      setActiveDate(selectedDates.value[0]);
    }
  },
  { deep: true }
);

// Initialize bulk edit data whenever locations change
watch(
  selectedLocations,
  (newLocations) => {
    // Also ensure all new locations have schedule entries for all dates
    if (selectedDates.value.length > 0) {
      updateLocationSchedules();
    }
  },
  { deep: true }
);

// Initialize active date when dates are selected
watch(
  selectedDates,
  (newDates) => {
    if (newDates.length > 0 && !activeDate.value) {
      setActiveDate(newDates[0]);
    } else if (newDates.length === 0) {
      activeDate.value = '';
    }
  },
  { immediate: true }
);

// Update the calendar (just a placeholder for any future functionality)
const updateCalendar = () => {
  // Currently just a placeholder
};

// Get date object from active date string
const getActiveDateObject = () => {
  return activeDate.value ? new Date(activeDate.value) : null;
};

// Initialize component
onMounted(() => {
  if (selectedDates.value.length > 0) {
    updateLocationSchedules();

    if (!activeDate.value) {
      setActiveDate(selectedDates.value[0]);
    }
  }
});

// Edit location settings
const editLocationSettings = (data) => {
  currentLocation.value = data.location;
  currentLocationIndex.value = data.index;

  // Initialize dialog data
  if (selectedDates.value.length > 0 && currentLocation.value) {
    const firstDateStr = new Date(selectedDates.value[0]).toISOString();
    const locationSettings = getLocationSchedule(
      firstDateStr,
      currentLocation.value.id
    );

    locationDialogData.value = {
      positionsNeeded: locationSettings.positionsNeeded,
      notes: locationSettings.notes || '',
    };
  } else {
    locationDialogData.value = {
      positionsNeeded: props.defaultPositions,
      notes: '',
    };
  }

  showLocationDialog.value = true;
};

// Close location dialog
const closeLocationDialog = () => {
  showLocationDialog.value = false;
  currentLocation.value = null;
  currentLocationIndex.value = -1;
};

// Save location settings to all dates
const saveLocationSettings = () => {
  if (!currentLocation.value || selectedDates.value.length === 0) {
    closeLocationDialog();
    return;
  }

  const locationId = currentLocation.value.id;
  const { positionsNeeded, notes } = locationDialogData.value;
  const updatedScheduleData = { ...scheduleData.value };

  // Apply the settings to all dates for this location
  selectedDates.value.forEach((date) => {
    const dateStr = new Date(date).toISOString();

    if (!updatedScheduleData[dateStr]) {
      updatedScheduleData[dateStr] = {};
    }

    updatedScheduleData[dateStr][locationId] = {
      locationId,
      positionsNeeded,
      notes: notes || null,
    };
  });

  // Update the state with the new copy
  scheduleData.value = updatedScheduleData;

  // Close the dialog
  closeLocationDialog();
};

// Expose method to get data formatted for API
const getFormattedData = () => {
  const scheduleDates = [];

  Object.keys(scheduleData.value).forEach((dateStr) => {
    const date = new Date(dateStr);
    const formattedDate = date.toISOString().split('T')[0]; // YYYY-MM-DD format

    const jobLocations = [];
    Object.values(scheduleData.value[dateStr]).forEach((locationSchedule) => {
      jobLocations.push({
        locationId: locationSchedule.locationId,
        positionsNeeded: locationSchedule.positionsNeeded,
        notes: locationSchedule.notes,
      });
    });

    scheduleDates.push({
      workDate: formattedDate,
      jobLocations,
    });
  });

  return scheduleDates;
};

// Get settings for all locations (positions needed and notes)
const getLocationSettings = () => {
  if (
    selectedDates.value.length === 0 ||
    Object.keys(scheduleData.value).length === 0
  ) {
    return {};
  }

  // Use the first date as reference for settings
  const firstDateStr = new Date(selectedDates.value[0]).toISOString();

  if (!scheduleData.value[firstDateStr]) {
    return {};
  }

  // Return the settings for each location
  return scheduleData.value[firstDateStr] || {};
};

// Handle when locations are updated from the LocationSearch component
const handleLocationsUpdate = (newLocations) => {
  // Find locations that were removed
  const removedLocationIds = selectedLocations.value
    .filter(
      (oldLocation) =>
        !newLocations.some((newLocation) => newLocation.id === oldLocation.id)
    )
    .map((location) => location.id);

  // Remove schedule data for removed locations
  if (removedLocationIds.length > 0) {
    Object.keys(scheduleData.value).forEach((dateStr) => {
      removedLocationIds.forEach((locationId) => {
        if (scheduleData.value[dateStr][locationId]) {
          delete scheduleData.value[dateStr][locationId];
        }
      });
    });
  }

  // Update selected locations
  selectedLocations.value = newLocations;

  // Initialize schedule for new locations
  updateLocationSchedules();
};

// Expose methods and data for parent component
defineExpose({
  getFormattedData,
});
</script>

<style scoped>
.date-tabs {
  margin-bottom: 1rem;
}

.date-tab {
  transition: all 0.2s ease;
}

:deep(.p-calendar) {
  width: 100%;
}

:deep(.p-calendar .p-inputtext) {
  width: 100%;
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
  height: 40px;
  transition: border-color 0.2s;
}

:deep(.p-dropdown),
:deep(.p-inputtext),
:deep(.p-inputnumber) {
  height: 40px;
}

/* Dialog custom styles */
:deep(.p-dialog-custom) {
  border-radius: 12px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

:deep(.p-dialog-custom .p-dialog-header) {
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  padding: 1.25rem 1.5rem;
}

:deep(.p-dialog-custom .p-dialog-title) {
  font-weight: 600;
  font-size: 1.125rem;
  color: #1f2937;
}

:deep(.p-dialog-custom .p-dialog-content) {
  padding: 1.5rem;
}

:deep(.notes-textarea .p-inputtextarea) {
  border-radius: 8px;
  padding: 0.75rem;
  font-size: 1rem;
  border-color: #d1d5db;
  transition: all 0.2s ease;
  min-height: 100px;
  resize: none;
}

:deep(.notes-textarea .p-inputtextarea:focus) {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(var(--primary-color-rgb), 0.2);
}

:deep(.p-inputnumber-input) {
  border-radius: 0;
  text-align: center;
  font-weight: 500;
}
</style>
