<template>
  <div class="edit-job-container bg-gray-50 min-h-screen">
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
            <i class="pi pi-folder text-primary-200 mr-2"></i>
            <span class="text-primary-100">Edit Job</span>
          </div>
        </div>
        <h1 class="text-3xl font-bold">{{ job?.title || 'Edit Job' }}</h1>
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
      <p class="text-gray-600">Loading job details...</p>
    </div>

    <!-- Job not found state -->
    <div v-else-if="!job" class="text-center py-16 container mx-auto">
      <div
        class="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6"
      >
        <i class="pi pi-exclamation-circle text-gray-400 text-4xl"></i>
      </div>
      <h3 class="text-2xl font-medium text-gray-700 mb-3">Job Not Found</h3>
      <p class="text-gray-500 mb-6 max-w-md mx-auto">
        The job you're looking for does not exist or has been deleted
      </p>
      <Button
        label="Go Back"
        icon="pi pi-arrow-left"
        @click="goBack"
        class="p-button-primary px-5 py-2"
      />
    </div>

    <!-- Main content -->
    <div v-else class="container mx-auto px-6 py-8">
      <div class="bg-white rounded-xl shadow-md overflow-hidden">
        <!-- Form header section -->
        <div class="bg-primary-50 p-6 border-b border-primary-100">
          <h2 class="text-xl font-semibold text-primary-800 flex items-center">
            <i class="pi pi-pencil text-primary-500 mr-2"></i>
            Edit Job Details
          </h2>
          <p class="text-gray-600 mt-2">
            Update the job information below. Fields marked with an asterisk (*)
            are required.
          </p>
        </div>

        <!-- Form content -->
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
            <!-- Job Title Section -->
            <div class="col-span-12 md:col-span-8">
              <div class="p-field">
                <label
                  for="jobTitle"
                  class="text-gray-700 font-medium block mb-2"
                >
                  Job Title <span class="text-red-500">*</span>
                </label>
                <InputText
                  id="jobTitle"
                  v-model="job.title"
                  class="w-full p-inputtext-lg"
                  placeholder="e.g. Drypers Promoter Needed"
                  :class="{ 'p-invalid': v$.title.$invalid && submitted }"
                />
                <small
                  v-if="v$.title.$invalid && submitted"
                  class="p-error block mt-1"
                >
                  {{ v$.title.$errors[0].$message }}
                </small>
              </div>
            </div>

            <!-- Job Type Section -->
            <div class="col-span-12 md:col-span-4">
              <div class="p-field">
                <label
                  for="jobTitleType"
                  class="text-gray-700 font-medium block mb-2"
                >
                  Job Type <span class="text-red-500">*</span>
                </label>
                <Dropdown
                  id="jobTitleType"
                  v-model="job.jobTitleType"
                  :options="jobTitleTypeOptions"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Select job type"
                  class="w-full p-inputtext-lg"
                  :class="{
                    'p-invalid': v$.jobTitleType.$invalid && submitted,
                  }"
                />
                <small
                  v-if="v$.jobTitleType.$invalid && submitted"
                  class="p-error block mt-1"
                >
                  {{ v$.jobTitleType.$errors[0].$message }}
                </small>
              </div>
            </div>

            <!-- Payment & Benefits Card -->
            <div class="col-span-12">
              <Card class="payment-card shadow-sm">
                <template #header>
                  <div
                    class="bg-gradient-to-r from-blue-50 to-primary-50 p-4 border-b border-blue-100"
                  >
                    <h3
                      class="text-lg font-semibold text-primary-800 flex items-center"
                    >
                      <i class="pi pi-money-bill text-primary-500 mr-2"></i>
                      Payment & Benefits
                    </h3>
                  </div>
                </template>
                <template #content>
                  <div class="p-4 grid grid-cols-1 gap-6">
                    <!-- Salary, Type, and Payment Terms on the same line -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div class="p-field">
                        <label
                          for="salary"
                          class="text-gray-700 font-medium block mb-2"
                        >
                          Salary <span class="text-red-500">*</span>
                        </label>
                        <div class="p-inputgroup">
                          <span class="p-inputgroup-addon">RM</span>
                          <InputText
                            id="salary"
                            v-model="salaryInput"
                            placeholder="0.00"
                            type="text"
                            class="w-full"
                            :class="{
                              'p-invalid': v$.salary.$invalid && submitted,
                            }"
                          />
                        </div>
                        <small
                          v-if="v$.salary.$invalid && submitted"
                          class="p-error block mt-1"
                        >
                          {{ v$.salary.$errors[0].$message }}
                        </small>
                      </div>

                      <div class="p-field">
                        <label
                          for="salaryType"
                          class="text-gray-700 font-medium block mb-2"
                        >
                          Type <span class="text-red-500">*</span>
                        </label>
                        <Dropdown
                          id="salaryType"
                          v-model="job.salaryType"
                          :options="salaryTypeOptions"
                          optionLabel="label"
                          optionValue="value"
                          placeholder="Select type"
                          class="w-full p-inputtext-lg"
                          :class="{
                            'p-invalid': v$.salaryType.$invalid && submitted,
                          }"
                        />
                        <small
                          v-if="v$.salaryType.$invalid && submitted"
                          class="p-error block mt-1"
                        >
                          {{ v$.salaryType.$errors[0].$message }}
                        </small>
                      </div>

                      <div class="p-field">
                        <label
                          for="paymentTerms"
                          class="text-gray-700 font-medium block mb-2"
                        >
                          Payment Terms
                        </label>
                        <InputText
                          id="paymentTerms"
                          v-model="job.paymentTerms"
                          class="w-full p-inputtext-lg"
                          placeholder="e.g. Payment within 14 days"
                        />
                      </div>
                    </div>

                    <!-- Benefits -->
                    <div class="p-field">
                      <label
                        for="benefits"
                        class="text-gray-700 font-medium block mb-2"
                      >
                        Benefits
                      </label>
                      <InputText
                        id="benefits"
                        v-model="job.benefits"
                        class="w-full p-inputtext-lg"
                        placeholder="Enter benefits (e.g. Meals provided, Transport allowance)"
                      />
                      <small class="text-gray-500 block mt-1">
                        Enter benefits separated by commas
                      </small>
                    </div>
                  </div>
                </template>
              </Card>
            </div>

            <!-- Job Requirements Card -->
            <div class="col-span-12">
              <Card class="shadow-sm">
                <template #header>
                  <div
                    class="bg-gradient-to-r from-green-50 to-blue-50 p-4 border-b border-green-100"
                  >
                    <h3
                      class="text-lg font-semibold text-primary-800 flex items-center"
                    >
                      <i class="pi pi-list text-green-600 mr-2"></i>
                      Job Description
                    </h3>
                  </div>
                </template>
                <template #content>
                  <div class="p-4 grid grid-cols-1 gap-6">
                    <!-- Job Scope -->
                    <div class="p-field">
                      <label
                        for="jobScope"
                        class="text-gray-700 font-medium block mb-2"
                      >
                        Job Scope <span class="text-red-500">*</span>
                      </label>
                      <div
                        class="bg-gray-50 p-1 rounded-lg large-textarea-container"
                      >
                        <Textarea
                          id="jobScope"
                          v-model="job.jobScope"
                          rows="12"
                          class="w-full large-textarea"
                          placeholder="Example:
1. Assist in mixing drinks, approach customers to sample drinks.
2. Push for sales.
3. Maintain cleanliness of the sampling area.
4. Engage with customers to explain product features.
5. Record customer feedback and report to supervisor."
                          :class="{
                            'p-invalid': v$.jobScope.$invalid && submitted,
                          }"
                        />
                      </div>
                      <small
                        v-if="v$.jobScope.$invalid && submitted"
                        class="p-error block mt-1"
                      >
                        {{ v$.jobScope.$errors[0].$message }}
                      </small>
                      <small class="text-gray-500 block mt-1">
                        Describe the main responsibilities and tasks for this
                        position
                      </small>
                    </div>

                    <!-- Requirements -->
                    <div class="p-field">
                      <label
                        for="requirements"
                        class="text-gray-700 font-medium block mb-2"
                      >
                        Requirements <span class="text-red-500">*</span>
                      </label>
                      <div
                        class="bg-gray-50 p-1 rounded-lg large-textarea-container"
                      >
                        <Textarea
                          id="requirements"
                          v-model="job.requirements"
                          rows="12"
                          class="w-full large-textarea"
                          placeholder="Example:
1. Responsible & Good Attitude
2. Prefer with past promoter experiences
3. No Spec & Colour Lens, only clear lens allowed for Work
4. Promoter need to have own transport, bring items to work & back home
5. Excellent communication skills and friendly personality"
                          :class="{
                            'p-invalid': v$.requirements.$invalid && submitted,
                          }"
                        />
                      </div>
                      <small
                        v-if="v$.requirements.$invalid && submitted"
                        class="p-error block mt-1"
                      >
                        {{ v$.requirements.$errors[0].$message }}
                      </small>
                      <small class="text-gray-500 block mt-1">
                        List qualifications, skills, and experience needed for
                        this position
                      </small>
                    </div>
                  </div>
                </template>
              </Card>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-between mt-8 pt-4 border-t border-gray-200">
            <Button
              label="Cancel"
              icon="pi pi-times"
              class="p-button-outlined p-button-secondary"
              @click="goBack"
            />
            <div class="flex gap-3">
              <Button
                label="Preview"
                icon="pi pi-eye"
                class="p-button-outlined"
                @click="previewJob"
              />
              <Button
                label="Save Changes"
                icon="pi pi-check"
                class="p-button-primary"
                @click="updateJob"
                :loading="saving"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Preview Dialog -->
    <Dialog
      v-model:visible="previewVisible"
      header="Job Preview"
      modal
      closeOnEscape
      dismissableMask
      :style="{ width: '70vw', maxWidth: '800px' }"
      :breakpoints="{ '960px': '90vw', '640px': '100vw' }"
    >
      <div class="job-preview p-4">
        <div class="mb-4 flex items-center">
          <Tag
            :value="getJobTypeName(job.jobTitleType)"
            :class="getJobTypeBgColor(job.jobTitleType)"
            class="mr-2 px-3 py-2 rounded-full font-medium text-white"
          />
          <Tag value="Draft" severity="info" class="px-3 py-2" />
        </div>
        <h2 class="text-2xl font-bold text-gray-900 mb-4">{{ job.title }}</h2>

        <div class="bg-blue-50 p-4 rounded-lg mb-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-3">
            Payment & Benefits
          </h3>
          <div class="flex items-center mb-2">
            <i class="pi pi-money-bill text-primary-500 mr-2"></i>
            <span class="text-xl font-bold text-primary-700"
              >RM {{ job.salary }}</span
            >
            <span class="text-gray-600 ml-2">{{
              getSalaryTypeName(job.salaryType)
            }}</span>
          </div>
          <div v-if="job.paymentTerms" class="mb-2">
            <span class="font-medium">Payment Terms:</span>
            {{ job.paymentTerms }}
          </div>
          <div v-if="job.benefits" class="mt-2">
            <div class="font-medium mb-1">Benefits:</div>
            <div class="flex flex-wrap gap-2">
              <Tag
                v-for="(benefit, index) in formatBenefits(job.benefits)"
                :key="index"
                :value="benefit"
                severity="success"
                icon="pi pi-check"
              />
            </div>
          </div>
        </div>

        <div class="mb-6">
          <h3
            class="text-lg font-semibold text-gray-800 mb-3 flex items-center"
          >
            <i class="pi pi-list text-primary-500 mr-2"></i>
            Job Scope
          </h3>
          <div
            class="bg-white p-4 rounded-lg border border-gray-200 leading-relaxed whitespace-pre-line preserve-format"
          >
            {{ job.jobScope }}
          </div>
        </div>

        <div class="mb-4">
          <h3
            class="text-lg font-semibold text-gray-800 mb-3 flex items-center"
          >
            <i class="pi pi-check-square text-primary-500 mr-2"></i>
            Requirements
          </h3>
          <div
            class="bg-white p-4 rounded-lg border border-gray-200 leading-relaxed whitespace-pre-line preserve-format"
          >
            {{ job.requirements }}
          </div>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useVuelidate } from '@vuelidate/core';
import { required, minValue, helpers } from '@vuelidate/validators';
import axios from 'axios';

// PrimeVue components
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Dropdown from 'primevue/dropdown';
import Textarea from 'primevue/textarea';
import ProgressSpinner from 'primevue/progressspinner';
import Card from 'primevue/card';
import Dialog from 'primevue/dialog';
import Tag from 'primevue/tag';

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

// Create a separate ref for salary input to handle as text
const salaryInput = ref('');

// Watch for salary changes in both directions
watch(
  () => job.value.salary,
  (newValue) => {
    if (newValue !== null && newValue !== undefined) {
      salaryInput.value = Number(newValue).toFixed(2);
    } else {
      salaryInput.value = '';
    }
  },
  { immediate: true }
);

// Convert text input to number for the actual model
watch(salaryInput, (newValue) => {
  if (newValue) {
    // Remove non-numeric characters except decimal point
    const cleaned = newValue.replace(/[^\d.]/g, '');
    // Ensure only one decimal point
    const parts = cleaned.split('.');
    const formatted =
      parts[0] + (parts.length > 1 ? '.' + parts[1].substring(0, 2) : '');

    job.value.salary = parseFloat(formatted);
    // Update the display value with proper formatting
    salaryInput.value = formatted;
  } else {
    job.value.salary = null;
  }
});

const loading = ref(true);
const submitted = ref(false);
const saving = ref(false);
const previewVisible = ref(false);

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

// Helper methods for preview
const getJobTypeName = (type) => {
  const option = jobTitleTypeOptions.find((item) => item.value === type);
  return option ? option.label : type;
};

const getSalaryTypeName = (type) => {
  const option = salaryTypeOptions.find((item) => item.value === type);
  return option ? option.label.toLowerCase() : type;
};

// Get job type background color for preview
const getJobTypeBgColor = (type) => {
  if (!type) return 'bg-gray-500';

  const colorMap = {
    PROMOTER: 'bg-blue-600',
    SUPERVISOR: 'bg-purple-600',
    SETUP_CREW: 'bg-orange-600',
    MASCOT_CREW: 'bg-pink-600',
    BRAND_AMBASSADOR: 'bg-green-600',
    EVENT_CREW: 'bg-indigo-600',
    USHER: 'bg-teal-600',
    OTHER: 'bg-gray-600',
  };

  return colorMap[type] || 'bg-gray-600';
};

// Preview job
const previewJob = () => {
  previewVisible.value = true;
};

// Custom salary validator to work with our text input
const isValidSalary = (value) => {
  if (!value) return false;
  const numValue = parseFloat(value);
  return !isNaN(numValue) && numValue > 0;
};

// Validation rules
const rules = computed(() => {
  return {
    title: { required },
    jobScope: { required },
    requirements: { required },
    salary: {
      required,
      validSalary: helpers.withMessage('Salary must be greater than 0', () =>
        isValidSalary(salaryInput.value)
      ),
    },
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

    saving.value = true;

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
      detail: error.response?.data?.message || 'An unexpected error occurred',
      life: 3000,
    });
  } finally {
    saving.value = false;
  }
};

// Initialize component
onMounted(() => {
  fetchJobData();
});

const formatBenefits = (benefits) => {
  if (!benefits) return [];
  return benefits
    .split(/[,;\n]/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
};
</script>

<style scoped>
.edit-job-container {
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

:deep(.p-card) {
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06) !important;
}

:deep(.p-card:hover) {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
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

:deep(.p-dropdown-panel) {
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  border: none;
}

:deep(.p-dropdown) {
  width: 100% !important;
}

:deep(.p-dropdown .p-dropdown-label) {
  padding: 0.75rem !important;
  font-size: 1rem;
  display: flex;
  align-items: center;
  border: none !important;
  box-shadow: none !important;
  background: transparent !important;
  line-height: 1.5;
  margin: 0;
  height: 100%;
}

:deep(.p-dropdown .p-dropdown-label.p-placeholder) {
  color: #94a3b8;
  align-self: center;
}

:deep(.p-dropdown) {
  width: 100% !important;
  display: flex;
  align-items: center;
}

:deep(.p-dropdown-panel .p-dropdown-items .p-dropdown-item) {
  padding: 0.75rem 1rem !important;
  line-height: 1.5;
}

:deep(.p-dropdown .p-dropdown-trigger) {
  width: 3rem;
  border-left: none !important;
  padding: 0 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

:deep(.p-textarea) {
  width: 100%;
  min-height: 240px !important;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  padding: 0.75rem;
  font-family: system-ui, -apple-system, sans-serif;
  line-height: 1.5;
  font-size: 1rem;
  resize: vertical;
}

:deep(.p-textarea:focus),
:deep(.p-inputtext:focus),
:deep(.p-dropdown:focus),
:deep(.p-inputnumber:focus) {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(var(--primary-color-rgb), 0.2);
}

:deep(.p-inputtext::placeholder),
:deep(.p-textarea::placeholder) {
  color: #94a3b8;
  opacity: 0.8;
  white-space: pre-line;
}

:deep(.p-inputtext),
:deep(.p-inputnumber-input) {
  padding: 0.75rem !important;
}

:deep(.job-preview) {
  max-height: 80vh;
  overflow-y: auto;
}

/* Responsive styles */
@media (max-width: 768px) {
  :deep(.p-dialog) {
    width: 95vw !important;
    margin: 0 auto;
  }

  .edit-job-container {
    padding-top: 0;
  }
}

:deep(.p-inputnumber) {
  display: block;
  width: 100% !important;
}

:deep(.p-inputnumber-input) {
  width: 100% !important;
  border-radius: 8px !important;
  height: 3rem !important;
  padding: 0.75rem !important;
}

:deep(.p-inputnumber .p-inputnumber-button) {
  display: none;
}

:deep(.p-inputnumber-buttons-stacked) {
  display: none;
}

/* Style the input group for salary */
:deep(.p-inputgroup) {
  display: flex;
  align-items: stretch;
  width: 100%;
}

:deep(.p-inputgroup-addon) {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-right: none;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  padding: 0 12px;
  font-weight: 500;
  color: #475569;
  height: 3rem;
}

:deep(.p-inputgroup .p-inputtext) {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  height: 3rem;
}

/* Completely revamp textarea styling for better visibility */
.large-textarea-container {
  margin-bottom: 1rem;
}

:deep(.large-textarea) {
  width: 100% !important;
  height: 350px !important;
  min-height: 350px !important;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  padding: 0.75rem;
  font-family: system-ui, -apple-system, sans-serif;
  line-height: 1.6;
  font-size: 1rem;
  resize: vertical;
  overflow-y: auto !important;
  display: block !important;
}

:deep(.p-inputtextarea) {
  height: auto !important;
  min-height: 350px !important;
}

/* Override any PrimeVue constraints on textareas */
:deep(.p-component.p-inputtextarea) {
  height: 350px !important;
  min-height: 350px !important;
  max-height: none;
  overflow: auto;
}

:deep(.p-textarea::placeholder) {
  color: #94a3b8;
  opacity: 1;
  white-space: pre-line;
  font-size: 0.95rem;
}

@media (min-width: 768px) {
  :deep(.large-textarea),
  :deep(.p-inputtextarea),
  :deep(.p-component.p-inputtextarea) {
    height: 350px !important;
    min-height: 350px !important;
  }
}

.preserve-format {
  white-space: pre-line !important;
  word-wrap: break-word;
  line-height: 1.6;
  font-family: system-ui, -apple-system, sans-serif;
}

:deep(.p-dialog-content) {
  padding: 1.5rem !important;
  overflow-y: auto;
  max-height: 80vh;
}

.job-preview .preserve-format {
  padding: 1rem;
  background-color: #fff;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
}

:deep(.p-dialog) {
  max-width: 800px;
  width: 90vw !important;
}

/* Keep preview text formatting clear */
:deep(.job-preview) {
  font-size: 1rem;
}
</style>
