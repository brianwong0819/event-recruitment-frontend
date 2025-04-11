<template>
  <div class="p-6">
    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-center">
        <Button
          icon="pi pi-arrow-left"
          class="p-button-text p-button-rounded mr-2"
          @click="goBack"
        />
        <div>
          <h1 class="text-2xl font-bold text-gray-900 mb-1">
            Create Job Schedule
          </h1>
          <div class="flex items-center text-gray-600">
            <i class="pi pi-calendar text-primary-500 mr-2"></i>
            <span>{{ jobTitle }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading" class="text-center py-8">
      <ProgressSpinner
        style="width: 50px; height: 50px"
        strokeWidth="8"
        fill="var(--surface-ground)"
        animationDuration=".5s"
      />
      <p class="mt-4 text-gray-600">Loading job details...</p>
    </div>

    <div v-else class="grid grid-cols-1 gap-6">
      <!-- Placeholder for schedule creation form -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold mb-4">Create Schedule</h2>
        <p class="text-gray-600 mb-6">
          This component is under development. Please check back later.
        </p>
        <div class="flex justify-end">
          <Button label="Cancel" class="p-button-text mr-2" @click="goBack" />
          <Button
            label="Save"
            icon="pi pi-check"
            class="p-button-primary"
            @click="submitForm"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import jobService from '@/services/job.service';

// PrimeVue components
import Button from 'primevue/button';
import ProgressSpinner from 'primevue/progressspinner';

const router = useRouter();
const route = useRoute();
const toast = useToast();

// State
const loading = ref(true);
const jobTitle = ref('');
const job = ref(null);

// Fetch job data
const fetchJobData = async () => {
  loading.value = true;
  try {
    const jobId = route.params.jobId;
    const response = await jobService.getJobById(jobId);

    if (response.data && response.data.statusCode === 200) {
      job.value = response.data.data;
      jobTitle.value = job.value.title;
    } else {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load job details',
        life: 3000,
      });
      router.push({
        name: 'JobDetails',
        params: { jobId: route.params.jobId },
      });
    }
  } catch (error) {
    console.error('Error fetching job:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'An error occurred while loading job details',
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
};

// Navigation
const goBack = () => {
  router.push({ name: 'JobDetails', params: { jobId: route.params.jobId } });
};

// Form submission placeholder
const submitForm = () => {
  toast.add({
    severity: 'info',
    summary: 'Info',
    detail: 'This feature is currently under development',
    life: 3000,
  });
};

// Initialize component
onMounted(() => {
  fetchJobData();
});
</script>
