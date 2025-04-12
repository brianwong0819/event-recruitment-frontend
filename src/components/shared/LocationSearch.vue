<template>
  <div class="location-search-container">
    <!-- Search input with loading state -->
    <div class="relative flex-grow">
      <div class="flex items-center relative">
        <span class="absolute left-3 text-gray-500">
          <i class="pi pi-search"></i>
        </span>
        <InputText
          v-model="searchQuery"
          placeholder="Search for locations..."
          class="w-full pl-10 pr-10"
          :class="{ 'p-invalid': error }"
          @focus="handleFocus"
          @keydown.enter.prevent="handleEnter"
        />
        <span v-if="loading" class="absolute right-3 text-primary-500">
          <i class="pi pi-spin pi-spinner"></i>
        </span>
        <span
          v-else-if="searchQuery && searchQuery.length > 0"
          class="absolute right-3 text-gray-500 cursor-pointer"
          @click="clearSearch"
        >
          <i class="pi pi-times"></i>
        </span>
      </div>
      <small v-if="error" class="p-error block mt-1">{{ error }}</small>
      <small v-else class="text-gray-500 text-xs block mt-1">
        Type at least 2 characters to search for locations
      </small>
    </div>

    <!-- Search results dropdown -->
    <div
      v-if="showResults && searchResults.length > 0"
      class="location-search-results bg-white rounded-lg shadow-lg border border-gray-200 mt-1 absolute z-50 w-full max-h-[320px] overflow-y-auto"
    >
      <!-- Database results section -->
      <div v-if="databaseResults.length > 0" class="p-2">
        <div class="text-xs font-medium text-gray-500 px-2 pt-1 pb-2">
          Saved Locations
        </div>
        <div
          v-for="location in databaseResults"
          :key="location.id"
          class="location-item p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors flex items-start"
          @click="selectLocation(location)"
        >
          <div
            class="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0 mr-2"
          >
            <i class="pi pi-database text-sm"></i>
          </div>
          <div class="flex-grow min-w-0">
            <div class="text-gray-900 font-medium truncate">
              {{ location.name }}
            </div>
            <div v-if="location.address" class="text-gray-600 text-sm truncate">
              {{ location.address }}
            </div>
          </div>
        </div>
      </div>

      <!-- Google Places results section -->
      <div v-if="googlePlacesResults.length > 0" class="p-2">
        <div
          class="text-xs font-medium text-gray-500 px-2 pt-1 pb-2"
          :class="{
            'border-t border-gray-100 mt-2 pt-3': databaseResults.length > 0,
          }"
        >
          Google Places
        </div>
        <div
          v-for="location in googlePlacesResults"
          :key="location.placeId"
          class="location-item p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors flex items-start"
          @click="selectLocation(location)"
        >
          <div
            class="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 mr-2"
          >
            <i class="pi pi-map-marker text-sm"></i>
          </div>
          <div class="flex-grow min-w-0">
            <div class="text-gray-900 font-medium truncate">
              {{ location.name }}
            </div>
            <div v-if="location.address" class="text-gray-600 text-sm truncate">
              {{ location.address }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty search results state -->
    <div
      v-else-if="showResults && searchQuery.length >= 2 && !loading"
      class="location-search-results bg-white rounded-lg shadow-lg border border-gray-200 mt-1 absolute z-50 w-full p-5 text-center"
    >
      <div class="flex flex-col items-center justify-center py-3">
        <i class="pi pi-search text-gray-300 text-3xl mb-2"></i>
        <p class="text-gray-700 font-medium">No locations found</p>
        <p class="text-gray-500 text-sm mt-1">
          Try a different search term or add a new location
        </p>
      </div>
    </div>

    <!-- Selected locations list - Only show when showSelections prop is true -->
    <div v-if="showSelections" class="mt-4">
      <div class="text-sm font-medium text-gray-700 mb-2">
        Selected Locations ({{ selectedLocations.length }})
      </div>

      <!-- Selected locations display -->
      <div
        v-if="selectedLocations.length > 0"
        class="bg-gray-50 rounded-lg border border-gray-200 p-3 divide-y divide-gray-100"
      >
        <div
          v-for="(location, index) in selectedLocations"
          :key="location.id || 'temp-' + index"
          class="py-3 first:pt-0 last:pb-0 flex items-start justify-between"
        >
          <div class="flex items-start">
            <div
              class="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-primary-100 text-primary-600 text-xs font-medium mr-3 mt-1"
            >
              {{ index + 1 }}
            </div>
            <div>
              <div class="font-medium text-gray-800">
                {{ location.name }}
              </div>
              <div v-if="location.address" class="text-sm text-gray-600 mt-1">
                {{ location.address }}
              </div>
              <div
                v-if="location.isLoading"
                class="text-sm text-blue-600 mt-1 flex items-center"
              >
                <i class="pi pi-spin pi-spinner mr-1 text-xs"></i>
                Saving location...
              </div>
              <!-- Show position count if it exists and is not default -->
              <div
                v-if="
                  locationSettings &&
                  locationSettings[location.id] &&
                  locationSettings[location.id].positionsNeeded &&
                  locationSettings[location.id].positionsNeeded > 1
                "
                class="text-sm text-gray-600 mt-1 flex items-center"
              >
                <i class="pi pi-users text-primary-500 mr-1 text-xs"></i>
                Positions: {{ locationSettings[location.id].positionsNeeded }}
              </div>
              <!-- Show notes if they exist -->
              <div
                v-if="
                  locationSettings &&
                  locationSettings[location.id] &&
                  locationSettings[location.id].notes
                "
                class="text-sm text-gray-600 mt-1 flex items-center"
              >
                <i class="pi pi-comment text-primary-500 mr-1 text-xs"></i>
                <span class="truncate max-w-xs">{{
                  locationSettings[location.id].notes
                }}</span>
              </div>
            </div>
          </div>
          <div class="flex">
            <Button
              icon="pi pi-pencil"
              class="p-button-text p-button-rounded p-button-info p-button-sm mr-1"
              @click="$emit('editLocation', { location, index })"
              :disabled="location.isLoading"
            />
            <Button
              icon="pi pi-trash"
              class="p-button-text p-button-rounded p-button-danger p-button-sm"
              @click="removeLocation(index)"
              :disabled="location.isLoading"
            />
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div
        v-else
        class="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-200"
      >
        <i class="pi pi-map-marker text-gray-300 text-2xl mb-2"></i>
        <p class="text-gray-500 text-sm">No locations selected</p>
        <p class="text-gray-400 text-xs mt-1">
          Search and select locations above
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { useToast } from 'primevue/usetoast';
import locationService from '@/services/location.service';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
  locationSettings: {
    type: Object,
    default: () => ({}),
  },
  multiple: {
    type: Boolean,
    default: true,
  },
  showSelections: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits([
  'update:modelValue',
  'editLocation',
  'location-selected',
]);

const toast = useToast();
const searchQuery = ref('');
const searchResults = ref([]);
const loading = ref(false);
const error = ref('');
const showResults = ref(false);
const debounceTimeout = ref(null);
const selectedLocations = ref([...props.modelValue]);

// Computed properties for different result types
const databaseResults = computed(() =>
  searchResults.value.filter((result) => result.id && !result.placeId)
);

const googlePlacesResults = computed(() =>
  searchResults.value.filter((result) => result.placeId)
);

// Watch for changes in modelValue prop
watch(
  () => props.modelValue,
  (newValue) => {
    // Add a check to prevent recursive updates
    if (JSON.stringify(newValue) !== JSON.stringify(selectedLocations.value)) {
      selectedLocations.value = [...newValue];
    }
  },
  { deep: true }
);

// Watch for changes in selectedLocations and emit update
watch(
  selectedLocations,
  (newValue) => {
    emit('update:modelValue', newValue);
  },
  { deep: true }
);

// Watch for search query changes and trigger debounced search
watch(searchQuery, (newValue) => {
  error.value = '';

  // Clear previous timeout
  if (debounceTimeout.value) {
    clearTimeout(debounceTimeout.value);
  }

  // If search is cleared, clear results
  if (!newValue || newValue.length < 2) {
    searchResults.value = [];
    return;
  }

  // Set debounce timeout for search
  debounceTimeout.value = setTimeout(() => {
    searchLocations(newValue);
  }, 300);
});

// Search locations function
const searchLocations = async (query) => {
  if (!query || query.length < 2) {
    searchResults.value = [];
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    const response = await locationService.searchLocations(query);

    if (response.data && response.data.statusCode === 200) {
      searchResults.value = response.data.data || [];
      showResults.value = true;
    } else {
      throw new Error(response.data?.message || 'Error fetching locations');
    }
  } catch (err) {
    console.error('Error searching locations:', err);
    error.value = 'Failed to search locations. Please try again.';
    searchResults.value = [];
  } finally {
    loading.value = false;
  }
};

// Select a location from search results
const selectLocation = async (location) => {
  // Don't add duplicate locations
  const isDuplicate = selectedLocations.value.some(
    (item) =>
      (item.id && item.id === location.id) ||
      (item.placeId && item.placeId === location.placeId)
  );

  if (isDuplicate) {
    toast.add({
      severity: 'info',
      summary: 'Already Selected',
      detail: `"${location.name}" is already in your selected locations`,
      life: 3000,
    });
    return;
  }

  // If it's a Google Places result, save it to the database first
  if (location.placeId && !location.id) {
    // Add to list with temporary loading state
    const tempIndex = selectedLocations.value.length;
    const tempLocation = { ...location, isLoading: true };

    if (!props.multiple) {
      selectedLocations.value = [tempLocation];
    } else {
      selectedLocations.value = [...selectedLocations.value, tempLocation];
    }

    try {
      const response = await locationService.saveGooglePlaceLocation(
        location.placeId
      );

      // Check for successful status codes (200 or 201)
      if (
        response.data &&
        (response.data.statusCode === 200 || response.data.statusCode === 201)
      ) {
        // Replace the temporary location with the saved one
        const savedLocation = response.data.data;
        // Make sure the saved location is correctly assigned back
        // Need to ensure reactivity is maintained correctly
        const updatedLocations = [...selectedLocations.value];
        updatedLocations[props.multiple ? tempIndex : 0] = savedLocation;
        selectedLocations.value = updatedLocations;

        // Emit the selected location for single selection mode
        if (!props.multiple) {
          emit('location-selected', [savedLocation]);
        }

        toast.add({
          severity: 'success',
          summary: 'Location Saved',
          detail: `"${savedLocation.name}" has been saved`,
          life: 3000,
        });
      } else {
        throw new Error(response.data?.message || 'Error saving location');
      }
    } catch (err) {
      console.error('Error saving Google Places location:', err);
      // Remove the temporary location on error
      if (props.multiple) {
        selectedLocations.value = selectedLocations.value.filter(
          (_, i) => i !== tempIndex
        );
      } else {
        selectedLocations.value = [];
      }

      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to save location. Please try again.',
        life: 3000,
      });
    }
  } else {
    // Regular database location, just add it
    if (!props.multiple) {
      selectedLocations.value = [location];
      // Emit the selected location for single selection mode
      emit('location-selected', [location]);
    } else {
      selectedLocations.value = [...selectedLocations.value, location];
    }
  }

  // Clear search after selection
  clearSearch();
};

// Remove a location from selected list
const removeLocation = (index) => {
  selectedLocations.value = selectedLocations.value.filter(
    (_, i) => i !== index
  );
};

// Clear search query and results
const clearSearch = () => {
  searchQuery.value = '';
  searchResults.value = [];
  showResults.value = false;
};

// Handle input focus event
const handleFocus = () => {
  if (searchQuery.value.length >= 2) {
    showResults.value = true;
  }
};

// Handle enter key press
const handleEnter = () => {
  if (searchQuery.value.length >= 2 && !loading.value) {
    searchLocations(searchQuery.value);
  }
};

// Handle click outside to close dropdown
const handleClickOutside = (event) => {
  const container = document.querySelector('.location-search-container');
  if (container && !container.contains(event.target)) {
    showResults.value = false;
  }
};

// Lifecycle hooks
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);

  if (debounceTimeout.value) {
    clearTimeout(debounceTimeout.value);
  }
});
</script>

<style scoped>
.location-search-container {
  position: relative;
}

.location-search-results {
  max-height: 320px;
  overflow-y: auto;
  width: 100%;
}

.location-item {
  transition: background-color 0.2s ease;
}

.location-item:hover {
  background-color: rgba(var(--primary-50-rgb), 0.8);
}

:deep(.p-inputtext) {
  padding-left: 2.5rem;
  height: 42px;
}

:deep(.p-button-rounded.p-button-sm) {
  width: 2rem;
  height: 2rem;
}
</style>
