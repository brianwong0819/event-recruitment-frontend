<template>
  <div class="p-6">
    <div class="mb-6">
      <div class="flex items-center">
        <Button
          icon="pi pi-arrow-left"
          class="p-button-text p-button-rounded mr-2"
          @click="goBack"
        />
        <div>
          <h1 class="text-2xl font-bold text-gray-900 mb-1">Edit Job</h1>
          <div class="flex items-center text-gray-600">
            <i class="pi pi-briefcase text-primary-500 mr-2"></i>
            <span>{{ job?.title || 'Loading job details...' }}</span>
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

    <div v-else-if="!job" class="text-center py-12">
      <div
        class="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6"
      >
        <i class="pi pi-exclamation-circle text-gray-400 text-3xl"></i>
      </div>
      <h3 class="text-xl font-medium text-gray-700 mb-3">Job Not Found</h3>
      <p class="text-gray-500 mb-6 max-w-md mx-auto">
        The job you're looking for does not exist or has been deleted
      </p>
      <Button
        label="Go Back"
        icon="pi pi-arrow-left"
        @click="goBack"
        class="p-button-primary px-4 py-2"
      />
    </div>

    <div v-else class="bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-bold mb-4">Job Details</h2>
      <p class="text-gray-600 mb-6">Update the job information below</p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Job Title -->
        <div class="field">
          <label for="jobTitle" class="block text-gray-700 font-medium mb-2"
            >Job Title <span class="text-red-500">*</span></label
          >
          <InputText
            id="jobTitle"
            v-model="job.title"
            class="w-full"
            placeholder="e.g. Drypers Promoter Needed"
            :class="{ 'p-invalid': v$.title.$invalid && submitted }"
          />
          <small v-if="v$.title.$invalid && submitted" class="p-error">{{
            v$.title.$errors[0].$message
          }}</small>
        </div>

        <!-- Job Title Type -->
        <div class="field">
          <label for="jobTitleType" class="block text-gray-700 font-medium mb-2"
            >Job Type <span class="text-red-500">*</span></label
          >
          <Dropdown
            id="jobTitleType"
            v-model="job.jobTitleType"
            :options="jobTitleTypeOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Select job type"
            class="w-full"
            :class="{ 'p-invalid': v$.jobTitleType.$invalid && submitted }"
          />
          <small v-if="v$.jobTitleType.$invalid && submitted" class="p-error">{{
            v$.jobTitleType.$errors[0].$message
          }}</small>
        </div>

        <!-- Salary -->
        <div class="grid grid-cols-3 gap-4">
          <div class="field col-span-2">
            <label for="salary" class="block text-gray-700 font-medium mb-2"
              >Salary <span class="text-red-500">*</span></label
            >
            <InputNumber
              id="salary"
              v-model="job.salary"
              mode="currency"
              currency="MYR"
              locale="en-MY"
              placeholder="0.00"
              :class="{ 'p-invalid': v$.salary.$invalid && submitted }"
              class="w-full"
            />
            <small v-if="v$.salary.$invalid && submitted" class="p-error">{{
              v$.salary.$errors[0].$message
            }}</small>
          </div>

          <div class="field">
            <label for="salaryType" class="block text-gray-700 font-medium mb-2"
              >Type <span class="text-red-500">*</span></label
            >
            <Dropdown
              id="salaryType"
              v-model="job.salaryType"
              :options="salaryTypeOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Select"
              class="w-full"
              :class="{ 'p-invalid': v$.salaryType.$invalid && submitted }"
            />
            <small v-if="v$.salaryType.$invalid && submitted" class="p-error">{{
              v$.salaryType.$errors[0].$message
            }}</small>
          </div>
        </div>

        <!-- Payment Terms -->
        <div class="field">
          <label for="paymentTerms" class="block text-gray-700 font-medium mb-2"
            >Payment Terms</label
          >
          <InputText
            id="paymentTerms"
            v-model="job.paymentTerms"
            class="w-full"
            placeholder="e.g. Payment within 14 days after event"
          />
        </div>

        <!-- Benefits -->
        <div class="field">
          <label for="benefits" class="block text-gray-700 font-medium mb-2"
            >Benefits (Optional)</label
          >
          <InputText
            id="benefits"
            v-model="job.benefits"
            class="w-full"
            placeholder="e.g. Meals provided, Transport allowance"
          />
        </div>

        <!-- Job Scope -->
        <div class="field col-span-1 md:col-span-2">
          <label for="jobScope" class="block text-gray-700 font-medium mb-2"
            >Job Scope <span class="text-red-500">*</span></label
          >
          <Textarea
            id="jobScope"
            v-model="job.jobScope"
            rows="4"
            class="w-full"
            placeholder="Example:
1. Assist in mixing drinks, approach customers to sample drinks.
2. Push for sales."
            :class="{ 'p-invalid': v$.jobScope.$invalid && submitted }"
          />
          <small v-if="v$.jobScope.$invalid && submitted" class="p-error">{{
            v$.jobScope.$errors[0].$message
          }}</small>
        </div>

        <!-- Requirements -->
        <div class="field col-span-1 md:col-span-2">
          <label for="requirements" class="block text-gray-700 font-medium mb-2"
            >Requirements <span class="text-red-500">*</span></label
          >
          <Textarea
            id="requirements"
            v-model="job.requirements"
            rows="4"
            class="w-full"
            placeholder="Example:
1. Responsible & Good Attitude
2. Prefer with past promoter experiences
3. No Spec & Colour Lens, only clear lens allowed for Work
4. Promoter need to have own transport, bring items to work & back home"
            :class="{ 'p-invalid': v$.requirements.$invalid && submitted }"
          />
          <small v-if="v$.requirements.$invalid && submitted" class="p-error">{{
            v$.requirements.$errors[0].$message
          }}</small>
        </div>
      </div>

      <!-- Status section -->
      <div class="mt-6 pt-4 border-t">
        <h3 class="text-lg font-semibold mb-3">Job Status</h3>
        <div class="flex items-center gap-4">
          <div class="field-radiobutton">
            <RadioButton
              v-model="job.status"
              inputId="status_draft"
              value="DRAFT"
              name="status"
            />
            <label for="status_draft" class="ml-2">Draft</label>
          </div>
          <div class="field-radiobutton">
            <RadioButton
              v-model="job.status"
              inputId="status_open"
              value="OPEN"
              name="status"
            />
            <label for="status_open" class="ml-2">Open</label>
          </div>
          <div class="field-radiobutton">
            <RadioButton
              v-model="job.status"
              inputId="status_closed"
              value="CLOSED"
              name="status"
            />
            <label for="status_closed" class="ml-2">Closed</label>
          </div>
        </div>
      </div>

      <!-- Navigation Buttons -->
      <div class="flex justify-between mt-6 pt-4 border-t">
        <Button
          label="Cancel"
          icon="pi pi-times"
          class="p-button-secondary"
          @click="goBack"
        />
        <Button label="Save Changes" icon="pi pi-check" @click="updateJob" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useVuelidate } from '@vuelidate/core';
import { required, minValue } from '@vuelidate/validators';
import axios from 'axios';

// PrimeVue components
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Dropdown from 'primevue/dropdown';
import Textarea from 'primevue/textarea';
import RadioButton from 'primevue/radiobutton';
import ProgressSpinner from 'primevue/progressspinner';

const router = useRouter();
const route = useRoute();
const toast = useToast();

// State
const job = ref({
  id: null,
  projectId: null,
  title: '',
  jobTitleType: '',
  jobScope: '',
  requirements: '',
  salary: null,
  salaryType: '',
  paymentTerms: '',
  benefits: '',
  status: 'DRAFT',
});
const loading = ref(true);
const submitted = ref(false);

// Salary type options
const salaryTypeOptions = [
  { label: 'Per Hour', value: 'PER_HOUR' },
  { label: 'Per Day', value: 'PER_DAY' },
  { label: 'Per Event', value: 'PER_EVENT' },
  { label: 'Fixed', value: 'FIXED' },
  { label: 'Commission', value: 'COMMISSION' },
  { label: 'Negotiable', value: 'NEGOTIABLE' },
];

// Job title type options
const jobTitleTypeOptions = [
  { label: 'Promoter', value: 'PROMOTER' },
  { label: 'Supervisor', value: 'SUPERVISOR' },
  { label: 'Setup Crew', value: 'SETUP_CREW' },
  { label: 'Mascot Crew', value: 'MASCOT_CREW' },
  { label: 'Brand Ambassador', value: 'BRAND_AMBASSADOR' },
  { label: 'Event Crew', value: 'EVENT_CREW' },
  { label: 'Usher', value: 'USHER' },
  { label: 'Other', value: 'OTHER' },
];

// Validation rules
const rules = computed(() => {
  return {
    title: { required },
    jobScope: { required },
    requirements: { required },
    salary: { required, minValue: minValue(1) },
    salaryType: { required },
    jobTitleType: { required },
  };
});

// Create vuelidate object
const v$ = useVuelidate(rules, job);

// Navigate back to job details page
const goBack = () => {
  router.push({
    name: 'JobDetails',
    params: { jobId: route.params.jobId },
    query: { projectId: route.query.projectId },
  });
};

// Fetch job data
const fetchJobData = async () => {
  loading.value = true;

  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      toast.add({
        severity: 'error',
        summary: 'Authentication Error',
        detail: 'You are not logged in. Please log in to continue.',
        life: 3000,
      });
      router.push({ name: 'Login' });
      return;
    }

    const jobId = route.params.jobId;

    // Fetch job details
    const response = await axios.get(
      `http://localhost:8080/api/jobs/${jobId}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    if (response.data && response.data.statusCode === 200) {
      job.value = response.data.data;
    } else {
      toast.add({
        severity: 'error',
        summary: 'Job Not Found',
        detail: 'The requested job could not be found',
        life: 3000,
      });
    }
  } catch (error) {
    console.error('Error fetching job data:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'An error occurred while fetching job data',
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
};

// Update job
const updateJob = async () => {
  submitted.value = true;

  try {
    const isValid = await v$.value.$validate();
    if (!isValid) {
      toast.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fill in all required fields correctly',
        life: 3000,
      });
      return;
    }

    const token = localStorage.getItem('accessToken');
    if (!token) {
      toast.add({
        severity: 'error',
        summary: 'Authentication Error',
        detail: 'You are not logged in. Please log in to continue.',
        life: 3000,
      });
      return;
    }

    // Prepare job data for update
    const jobData = {
      title: job.value.title,
      jobTitleType: job.value.jobTitleType,
      jobScope: job.value.jobScope,
      requirements: job.value.requirements,
      salary: job.value.salary,
      salaryType: job.value.salaryType,
      paymentTerms: job.value.paymentTerms || '',
      benefits: job.value.benefits || '',
      status: job.value.status,
    };

    // Update job
    const response = await axios.put(
      `http://localhost:8080/api/jobs/${job.value.id}`,
      jobData,
      {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data && response.data.statusCode === 200) {
      toast.add({
        severity: 'success',
        summary: 'Job Updated',
        detail: 'Job details have been updated successfully',
        life: 3000,
      });

      // Navigate back to job details page
      router.push({
        name: 'JobDetails',
        params: { jobId: job.value.id },
        query: { projectId: job.value.projectId },
      });
    } else {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: response.data?.message || 'Failed to update job',
        life: 3000,
      });
    }
  } catch (error) {
    console.error('Error updating job:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'An unexpected error occurred',
      life: 3000,
    });
  }
};

// Initialize component
onMounted(() => {
  fetchJobData();
});
</script>

<style scoped>
.field {
  margin-bottom: 1rem;
}

:deep(.p-button) {
  border-radius: 8px;
  font-weight: 500;
}

:deep(.p-dropdown) {
  width: 100%;
  border-radius: 8px;
}

:deep(.p-inputnumber) {
  width: 100%;
}

:deep(.p-inputnumber-input) {
  width: 100%;
  border-radius: 8px;
}

:deep(.p-inputtext) {
  border-radius: 8px;
}

:deep(.p-textarea) {
  width: 100%;
  border-radius: 8px;
}

.field-radiobutton {
  display: flex;
  align-items: center;
}
</style>
