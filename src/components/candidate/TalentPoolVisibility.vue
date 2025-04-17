<!-- 
  Talent Pool Visibility Component
  This component allows candidates to control whether their profile is visible to recruiters
  in the talent pool search.
-->
<template>
  <div class="talent-pool-container">
    <!-- Toast for notifications -->
    <Toast position="top-right" />

    <!-- Main content container -->
    <div class="bg-white rounded-xl shadow-md overflow-hidden">
      <div
        class="flex justify-between items-center p-3 md:p-5 border-b bg-gradient-to-r from-primary-50 to-white"
      >
        <h2
          class="text-base md:text-lg font-semibold text-gray-800 flex items-center"
        >
          <i class="pi pi-search text-primary-500 mr-2"></i>
          Talent Pool Visibility
        </h2>
      </div>

      <div class="p-4 md:p-6">
        <!-- Loading state -->
        <div v-if="loading" class="flex justify-center py-5">
          <div class="animate-pulse flex flex-col items-center">
            <i class="pi pi-spin pi-spinner text-primary-500 text-2xl mb-2"></i>
            <p class="text-primary-500">Loading your profile settings...</p>
          </div>
        </div>

        <!-- Visibility controls when loaded -->
        <div v-else>
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="text-gray-800 font-medium mb-2">
                Allow recruiters to discover your profile
              </h3>
              <p class="text-gray-600 text-sm">
                When enabled, recruiters can find you in the talent pool and may
                offer you job opportunities directly.
              </p>
            </div>
            <InputSwitch
              v-model="isSearchable"
              @change="updateSearchable"
              :disabled="updatingSearchable"
              class="mt-1"
            />
          </div>

          <div class="bg-blue-50 p-4 rounded-lg border border-blue-100 mt-3">
            <div class="flex items-start">
              <i
                class="pi pi-info-circle text-blue-600 mr-3 mt-0.5 text-lg"
              ></i>
              <div>
                <h4 class="text-blue-700 font-medium mb-1">
                  {{
                    isSearchable
                      ? 'Your profile is visible'
                      : 'Your profile is hidden'
                  }}
                </h4>
                <p class="text-blue-700 text-sm">
                  {{
                    isSearchable
                      ? 'Recruiters can discover your profile in the talent pool and may reach out with job offers that match your skills and availability.'
                      : 'Your profile is hidden from the talent pool search. Recruiters can only find you when you apply directly to their job postings.'
                  }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import { apiClient } from '../../services/api.service';
import InputSwitch from 'primevue/inputswitch';

// Toast for notifications
const toast = useToast();

// Component state
const loading = ref(true);
const isSearchable = ref(true);
const updatingSearchable = ref(false);

// Fetch searchable status from the API
const fetchSearchableStatus = async () => {
  loading.value = true;
  try {
    const response = await apiClient.get('/profile');

    if (response.data && response.data.data) {
      const availData = response.data.data;

      // Set searchable status if available in the API response
      if (availData.hasOwnProperty('isSearchable')) {
        isSearchable.value = availData.isSearchable;
      }
    }
  } catch (error) {
    console.error('Error fetching availability data:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load your profile settings. Please try again.',
      life: 5000,
    });
  } finally {
    loading.value = false;
  }
};

// Update searchable status
const updateSearchable = async () => {
  updatingSearchable.value = true;

  try {
    const response = await apiClient.put('/candidates/searchable', {
      isSearchable: isSearchable.value,
    });

    if (response.data && response.data.statusCode === 200) {
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: isSearchable.value
          ? 'Your profile is now visible to recruiters in the talent pool.'
          : 'Your profile has been hidden from the talent pool.',
        life: 3000,
      });
    } else {
      // Revert the switch if the update failed
      isSearchable.value = !isSearchable.value;

      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to update your profile visibility. Please try again.',
        life: 5000,
      });
    }
  } catch (error) {
    console.error('Error updating searchable status:', error);

    // Revert the switch if the update failed
    isSearchable.value = !isSearchable.value;

    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to update your profile visibility. Please try again.',
      life: 5000,
    });
  } finally {
    updatingSearchable.value = false;
  }
};

// Load data when component mounts
onMounted(() => {
  fetchSearchableStatus();
});
</script>

<style scoped>
/* Component specific styles can be added here if needed */
</style>
