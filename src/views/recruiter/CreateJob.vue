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
          <h1 class="text-2xl font-bold text-gray-900 mb-1">Create New Job</h1>
          <div class="flex items-center text-gray-600">
            <i class="pi pi-folder text-primary-500 mr-2"></i>
            <span>{{ projectName }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Steps -->
    <Steps
      :model="steps"
      :readonly="false"
      :activeIndex="activeIndex"
      @select="onStepSelect"
    />

    <div class="bg-white rounded-lg shadow p-6 mt-6">
      <!-- Step 1: Job Details -->
      <div v-if="activeIndex === 0">
        <h2 class="text-xl font-bold mb-4">Job Details</h2>
        <p class="text-gray-600 mb-6">
          Enter the basic details for this job listing
        </p>

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
              placeholder="e.g. Dry Promoter"
              :class="{ 'p-invalid': v$.title.$invalid && submitted }"
            />
            <small v-if="v$.title.$invalid && submitted" class="p-error">{{
              v$.title.$errors[0].$message
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
              <label
                for="salaryType"
                class="block text-gray-700 font-medium mb-2"
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
              <small
                v-if="v$.salaryType.$invalid && submitted"
                class="p-error"
                >{{ v$.salaryType.$errors[0].$message }}</small
              >
            </div>
          </div>

          <!-- Payment Terms -->
          <div class="field">
            <label
              for="paymentTerms"
              class="block text-gray-700 font-medium mb-2"
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
              placeholder="Describe the scope of work and responsibilities"
              :class="{ 'p-invalid': v$.jobScope.$invalid && submitted }"
            />
            <small v-if="v$.jobScope.$invalid && submitted" class="p-error">{{
              v$.jobScope.$errors[0].$message
            }}</small>
          </div>

          <!-- Requirements -->
          <div class="field col-span-1 md:col-span-2">
            <label
              for="requirements"
              class="block text-gray-700 font-medium mb-2"
              >Requirements <span class="text-red-500">*</span></label
            >
            <Textarea
              id="requirements"
              v-model="job.requirements"
              rows="4"
              class="w-full"
              placeholder="List the qualifications, skills or experience required"
              :class="{ 'p-invalid': v$.requirements.$invalid && submitted }"
            />
            <small
              v-if="v$.requirements.$invalid && submitted"
              class="p-error"
              >{{ v$.requirements.$errors[0].$message }}</small
            >
          </div>
        </div>
      </div>

      <!-- Step 2: Job Schedule (Will implement in next step) -->
      <div v-if="activeIndex === 1">
        <h2 class="text-xl font-bold mb-4">Job Schedule</h2>
        <p class="text-gray-600 mb-6">Add working dates and locations</p>

        <div class="text-center py-12">
          <i class="pi pi-calendar text-6xl text-gray-300 mb-4"></i>
          <h3 class="text-xl font-medium text-gray-700 mb-2">Coming Soon</h3>
          <p class="text-gray-500 mb-4">
            This section will be implemented in the next step
          </p>
        </div>
      </div>

      <!-- Step 3: Review & Submit (Will implement in next step) -->
      <div v-if="activeIndex === 2">
        <h2 class="text-xl font-bold mb-4">Review & Submit</h2>
        <p class="text-gray-600 mb-6">
          Review the job details before submitting
        </p>

        <div class="text-center py-12">
          <i class="pi pi-check-circle text-6xl text-gray-300 mb-4"></i>
          <h3 class="text-xl font-medium text-gray-700 mb-2">Coming Soon</h3>
          <p class="text-gray-500 mb-4">
            This section will be implemented in the next step
          </p>
        </div>
      </div>

      <!-- Navigation Buttons -->
      <div class="flex justify-between mt-6 pt-4 border-t">
        <Button
          label="Back"
          icon="pi pi-arrow-left"
          class="p-button-secondary"
          @click="prevStep"
          :disabled="activeIndex === 0"
        />
        <Button
          v-if="activeIndex < steps.length - 1"
          label="Next"
          icon="pi pi-arrow-right"
          iconPos="right"
          @click="nextStep"
        />
        <Button v-else label="Submit" icon="pi pi-check" @click="submitJob" />
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

// PrimeVue components
import Steps from 'primevue/steps';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Dropdown from 'primevue/dropdown';
import Textarea from 'primevue/textarea';

const router = useRouter();
const route = useRoute();
const toast = useToast();

// Extract project information from query params
const projectId = computed(() => route.query.projectId);
const projectName = computed(
  () => route.query.projectName || 'Unknown Project'
);

// Step configuration
const steps = [
  { label: 'Job Details', icon: 'pi pi-file' },
  { label: 'Schedule', icon: 'pi pi-calendar' },
  { label: 'Review & Submit', icon: 'pi pi-check' },
];
const activeIndex = ref(0);

// Job data
const job = reactive({
  projectId: '',
  title: '',
  jobScope: '',
  requirements: '',
  salary: null,
  salaryType: '',
  paymentTerms: '',
  benefits: '',
  schedules: [],
});

// Salary type options
const salaryTypeOptions = [
  { label: 'Per Hour', value: 'PER_HOUR' },
  { label: 'Per Day', value: 'PER_DAY' },
  { label: 'Per Event', value: 'PER_EVENT' },
  { label: 'Per Week', value: 'PER_WEEK' },
  { label: 'Fixed Amount', value: 'FIXED_AMOUNT' },
];

// Form submission state
const submitted = ref(false);

// Validation rules
const rules = computed(() => {
  return {
    title: { required },
    jobScope: { required },
    requirements: { required },
    salary: { required, minValue: minValue(1) },
    salaryType: { required },
  };
});

// Create vuelidate object
const v$ = useVuelidate(rules, job);

// Navigate back to the job management page
const goBack = () => {
  router.push({
    name: 'ProjectDetails',
    params: { projectId: projectId.value },
  });
};

// Step navigation
const onStepSelect = (e) => {
  // Only allow navigation to completed steps or the next available step
  if (e.index <= activeIndex.value + 1) {
    activeIndex.value = e.index;
  }
};

const prevStep = () => {
  if (activeIndex.value > 0) {
    activeIndex.value--;
  }
};

const nextStep = async () => {
  // Validate current step before proceeding
  if (activeIndex.value === 0) {
    submitted.value = true;
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
  }

  activeIndex.value++;
  submitted.value = false;
};

const submitJob = () => {
  // Will implement form submission in next stage
  toast.add({
    severity: 'info',
    summary: 'Coming Soon',
    detail: 'Job submission will be implemented in the next stage',
    life: 3000,
  });
};

onMounted(() => {
  // Set project ID from query parameter
  if (projectId.value) {
    job.projectId = projectId.value;
  } else {
    // If no project ID is provided, show error and redirect back
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No project selected. Please select a project first.',
      life: 3000,
    });
    router.push({ name: 'ManageJobs' });
  }
});
</script>

<style scoped>
/* Custom styling for Steps component */
:deep(.p-steps) {
  margin-bottom: 2rem;
}

:deep(.p-steps-item) {
  z-index: 1;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  :deep(.p-steps-title) {
    display: none;
  }
}
</style>
