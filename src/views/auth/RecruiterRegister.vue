<template>
  <div
    class="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
  >
    <!-- Header with Logo -->
    <header class="pt-4 pb-2">
      <div class="container px-4">
        <router-link to="/" class="inline-block">
          <div class="text-2xl font-extrabold tracking-tight">
            <span class="text-primary-700">Crew</span
            ><span class="text-gray-800">Connect</span>
          </div>
        </router-link>
      </div>
    </header>

    <!-- Main content -->
    <main class="flex-grow flex items-center justify-center px-4 py-6">
      <div class="w-full max-w-2xl">
        <!-- Navigation links above the card -->
        <div class="flex justify-start items-center mb-3 px-2">
          <router-link
            to="/register"
            class="text-xs font-medium text-gray-600 hover:text-primary-600 transition-colors duration-200 flex items-center"
          >
            <i class="pi pi-arrow-left mr-1 text-xs"></i> Back to registration
            options
          </router-link>
        </div>

        <!-- Title section -->
        <div class="text-center mb-6">
          <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Create Recruiter Account
          </h1>
          <p class="text-base text-gray-600 max-w-2xl mx-auto">
            Sign up to find the best talent for your events
          </p>
        </div>

        <!-- Error alert -->
        <div
          v-if="error"
          class="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-md flex items-center"
        >
          <i class="pi pi-exclamation-circle text-red-500 mr-2 text-base"></i>
          <p class="text-red-700 text-sm">{{ error }}</p>
        </div>

        <!-- Registration card -->
        <div
          class="bg-white rounded-lg p-5 md:p-6 shadow-md border border-gray-100"
        >
          <!-- Custom progress steps indicator -->
          <div class="mb-6">
            <div class="custom-steps-container flex justify-between">
              <div
                v-for="(item, index) in items"
                :key="index"
                class="custom-step-item flex flex-col items-center"
                :class="{ active: index <= activeStep }"
              >
                <div
                  class="step-number flex items-center justify-center h-8 w-8 rounded-full border-2 mb-1"
                >
                  <i :class="item.icon + ' text-base'"></i>
                </div>
                <span class="step-label text-xs font-medium">{{
                  item.label
                }}</span>
              </div>
            </div>
          </div>

          <!-- Step 1: Basic Information -->
          <div v-show="activeStep === 0" class="animate-fadeIn">
            <div class="mb-4 border-b border-gray-100 pb-3">
              <h2 class="text-xl font-semibold text-gray-800">
                Basic Information
              </h2>
              <p class="text-gray-600 mt-1 text-sm">Tell us about yourself</p>
            </div>
            <form @submit.prevent="nextStep" class="space-y-4">
              <!-- Recruiter Type field -->
              <div class="form-group">
                <label for="recruiterType" class="form-label">
                  Recruiter Type
                </label>
                <div class="flex items-center relative input-wrapper">
                  <i class="pi pi-briefcase input-icon"></i>
                  <Dropdown
                    id="recruiterType"
                    v-model="form.recruiterType"
                    :options="recruiterTypeOptions"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Select recruiter type"
                    class="w-full custom-dropdown"
                    :class="{ 'p-invalid': hasError('recruiterType') }"
                  />
                </div>
                <small v-if="hasError('recruiterType')" class="p-error text-xs">
                  Recruiter type selection is required
                </small>
              </div>

              <!-- Company Name field - only show for Company or Agency -->
              <div class="form-group" v-if="showCompanyNameField">
                <label for="companyName" class="form-label">Company Name</label>
                <div class="flex items-center relative input-wrapper">
                  <i class="pi pi-building input-icon"></i>
                  <InputText
                    id="companyName"
                    v-model="form.companyName"
                    type="text"
                    class="w-full p-inputtext-sm"
                    placeholder="Enter your company name"
                    :class="{ 'p-invalid': hasError('companyName') }"
                  />
                </div>
                <small v-if="hasError('companyName')" class="p-error text-xs">
                  Company name is required
                </small>
              </div>

              <!-- Rep Name field -->
              <div class="form-group">
                <label for="recruiterRepName" class="form-label">
                  {{
                    showCompanyNameField ? 'Representative Name' : 'Full Name'
                  }}
                </label>
                <div class="flex items-center relative input-wrapper">
                  <i class="pi pi-user input-icon"></i>
                  <InputText
                    id="recruiterRepName"
                    v-model="form.recruiterRepName"
                    type="text"
                    class="w-full p-inputtext-sm"
                    :placeholder="
                      showCompanyNameField
                        ? 'Enter representative\'s name'
                        : 'Enter your full name'
                    "
                    :class="{ 'p-invalid': hasError('recruiterRepName') }"
                  />
                </div>
                <small
                  v-if="hasError('recruiterRepName')"
                  class="p-error text-xs"
                >
                  {{
                    showCompanyNameField ? 'Representative name' : 'Full name'
                  }}
                  is required
                </small>
              </div>

              <!-- Email field -->
              <div class="form-group">
                <label for="email" class="form-label">Email Address</label>
                <div class="flex items-center relative input-wrapper">
                  <i class="pi pi-envelope input-icon"></i>
                  <InputText
                    id="email"
                    v-model="form.email"
                    type="email"
                    class="w-full p-inputtext-sm"
                    placeholder="company@example.com"
                    :class="{ 'p-invalid': hasError('email') }"
                  />
                </div>
                <small v-if="hasError('email')" class="p-error text-xs">
                  A valid email is required
                </small>
              </div>

              <!-- Phone Number field -->
              <div class="form-group">
                <label for="phoneNumber" class="form-label">Phone Number</label>
                <div class="flex items-center relative input-wrapper">
                  <i class="pi pi-phone input-icon"></i>
                  <InputText
                    id="phoneNumber"
                    v-model="form.phoneNumber"
                    type="tel"
                    class="w-full p-inputtext-sm"
                    placeholder="+60 12 345 6789"
                    :class="{ 'p-invalid': hasError('phoneNumber') }"
                  />
                </div>
                <small v-if="hasError('phoneNumber')" class="p-error text-xs">
                  Phone number is required
                </small>
              </div>

              <!-- Button -->
              <div class="pt-3">
                <Button
                  type="submit"
                  label="Continue to Account Setup"
                  icon="pi pi-arrow-right"
                  iconPos="right"
                  class="w-full p-button-md"
                />
              </div>

              <!-- Login link -->
              <div class="text-center pt-3">
                <p class="text-gray-600 text-sm">
                  Already have an account?
                  <router-link
                    to="/login"
                    class="text-primary-600 hover:text-primary-800 font-semibold"
                  >
                    Sign in instead
                  </router-link>
                </p>
              </div>
            </form>
          </div>

          <!-- Step 2: Account Information -->
          <div v-show="activeStep === 1" class="animate-fadeIn">
            <div class="mb-4 border-b border-gray-100 pb-3">
              <h2 class="text-xl font-semibold text-gray-800">Account Setup</h2>
              <p class="text-gray-600 mt-1 text-sm">
                Create your login credentials
              </p>
            </div>
            <form @submit.prevent="nextStep" class="space-y-4">
              <!-- Username field -->
              <div class="form-group">
                <label for="username" class="form-label">Username</label>
                <div class="flex items-center">
                  <i class="pi pi-at mr-2 text-gray-500 text-sm"></i>
                  <InputText
                    id="username"
                    v-model="form.username"
                    type="text"
                    class="w-full p-inputtext-sm"
                    placeholder="Choose a unique username"
                    :class="{ 'p-invalid': hasError('username') }"
                  />
                </div>
                <small v-if="hasError('username')" class="p-error text-xs">
                  Username is required (minimum 3 characters)
                </small>
              </div>

              <!-- Password field -->
              <div class="form-group">
                <label for="password" class="form-label">Password</label>
                <div class="flex items-center">
                  <i class="pi pi-lock mr-2 text-gray-500 text-sm"></i>
                  <Password
                    id="password"
                    v-model="form.password"
                    toggleMask
                    class="w-full custom-password"
                    :class="{ 'p-invalid': hasError('password') }"
                    :feedback="true"
                    placeholder="Create a secure password"
                    :inputClass="'w-full'"
                  />
                </div>
                <small v-if="hasError('password')" class="p-error text-xs">
                  Password is required (minimum 8 characters)
                </small>
              </div>

              <!-- Confirm Password field -->
              <div class="form-group">
                <label for="confirmPassword" class="form-label">
                  Confirm Password
                </label>
                <div class="flex items-center">
                  <i class="pi pi-shield mr-2 text-gray-500 text-sm"></i>
                  <Password
                    id="confirmPassword"
                    v-model="form.confirmPassword"
                    toggleMask
                    class="w-full custom-password"
                    :class="{ 'p-invalid': hasError('confirmPassword') }"
                    :feedback="false"
                    placeholder="Confirm your password"
                    :inputClass="'w-full'"
                  />
                </div>
                <small
                  v-if="hasError('confirmPassword')"
                  class="p-error text-xs"
                >
                  {{
                    formErrors.confirmPasswordMessage ||
                    'Password confirmation is required'
                  }}
                </small>
              </div>

              <!-- Navigation buttons -->
              <div class="flex justify-between mt-6 pt-3">
                <Button
                  type="button"
                  label="Back"
                  icon="pi pi-arrow-left"
                  class="p-button-outlined p-button-md"
                  @click="prevStep"
                />
                <Button
                  type="submit"
                  label="Continue to Company Details"
                  icon="pi pi-arrow-right"
                  iconPos="right"
                  class="p-button-md"
                />
              </div>
            </form>
          </div>

          <!-- Step 3: Company Details -->
          <div v-show="activeStep === 2" class="animate-fadeIn">
            <div class="mb-4 border-b border-gray-100 pb-3">
              <h2 class="text-xl font-semibold text-gray-800">
                {{
                  showCompanyNameField ? 'Company Details' : 'Profile Details'
                }}
              </h2>
              <p class="text-gray-600 mt-1 text-sm">
                Tell candidates more about
                {{
                  showCompanyNameField
                    ? 'your company'
                    : 'yourself and your recruitment services'
                }}
              </p>
            </div>
            <form @submit.prevent="submitForm" class="space-y-4">
              <!-- Company Description field -->
              <div class="form-group">
                <label for="companyDescription" class="form-label">
                  {{
                    showCompanyNameField
                      ? 'Company Description'
                      : 'Professional Bio'
                  }}
                  <span class="text-red-500">*</span>
                </label>
                <div class="flex items-start">
                  <i
                    class="pi pi-file-edit mr-2 text-gray-500 mt-2 text-sm"
                  ></i>
                  <Textarea
                    id="companyDescription"
                    v-model="form.companyDescription"
                    rows="3"
                    maxlength="255"
                    :placeholder="
                      showCompanyNameField
                        ? 'Describe your company, culture, and what makes it special...'
                        : 'Describe your professional background, expertise, and what you can offer to candidates...'
                    "
                    class="w-full p-inputtext-sm"
                    :class="{ 'p-invalid': hasError('companyDescription') }"
                  />
                </div>
                <div class="flex justify-between">
                  <small
                    v-if="hasError('companyDescription')"
                    class="p-error text-xs"
                  >
                    {{
                      showCompanyNameField
                        ? 'Company description'
                        : 'Professional bio'
                    }}
                    is required
                  </small>
                  <small class="text-gray-500 text-xs ml-auto">
                    {{ form.companyDescription.length }}/255
                  </small>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Company Location field -->
                <div class="form-group">
                  <label for="companyLocation" class="form-label">
                    {{ showCompanyNameField ? 'Company Location' : 'Location' }}
                    <span class="text-red-500">*</span>
                  </label>
                  <div class="location-field-container">
                    <LocationSearch
                      :multiple="false"
                      :show-selections="false"
                      @location-selected="handleLocationSelected"
                      class="w-full"
                      :class="{ 'p-invalid': hasError('companyLocation') }"
                    />
                  </div>

                  <!-- Display selected location -->
                  <div
                    v-if="form.companyLocationId && form.companyLocation"
                    class="mt-2 flex items-center bg-primary-50 p-2 rounded-md"
                  >
                    <i
                      class="pi pi-map-marker mr-2 text-primary-500 text-sm"
                    ></i>
                    <span class="text-sm font-medium text-primary-700">{{
                      form.companyLocation
                    }}</span>
                  </div>

                  <small
                    v-if="hasError('companyLocation')"
                    class="p-error text-xs"
                  >
                    {{ showCompanyNameField ? 'Company location' : 'Location' }}
                    is required
                  </small>
                </div>

                <!-- Company Website field -->
                <div class="form-group">
                  <label for="companyWebsite" class="form-label">
                    {{
                      showCompanyNameField
                        ? 'Company Website'
                        : 'Professional Website'
                    }}
                    <span class="text-gray-500 text-xs font-normal"
                      >(if available)</span
                    >
                  </label>
                  <div class="flex items-center">
                    <i class="pi pi-globe mr-2 text-gray-500 text-sm"></i>
                    <InputText
                      id="companyWebsite"
                      v-model="form.companyWebsite"
                      type="url"
                      placeholder="https://www.example.com"
                      class="w-full p-inputtext-sm"
                      :class="{ 'p-invalid': hasError('companyWebsite') }"
                    />
                  </div>
                  <small
                    v-if="hasError('companyWebsite')"
                    class="p-error text-xs"
                  >
                    Please enter a valid URL
                  </small>
                </div>
              </div>

              <!-- Terms and Conditions -->
              <div
                class="bg-gray-50 p-3 rounded-lg mt-4 border border-gray-200"
              >
                <div class="flex items-start">
                  <i
                    class="pi pi-check-circle mr-2 text-gray-500 mt-1 text-sm"
                  ></i>
                  <div>
                    <div class="flex items-center">
                      <Checkbox
                        id="terms"
                        v-model="form.terms"
                        :binary="true"
                        :class="{ 'p-invalid': hasError('terms') }"
                      />
                      <label for="terms" class="text-gray-700 ml-2 text-sm">
                        I agree to the
                        <a
                          href="#"
                          class="text-primary-600 hover:text-primary-800 font-medium"
                        >
                          Terms and Conditions
                        </a>
                        and
                        <a
                          href="#"
                          class="text-primary-600 hover:text-primary-800 font-medium"
                        >
                          Privacy Policy
                        </a>
                      </label>
                    </div>
                    <p class="text-gray-500 text-xs mt-1">
                      By creating an account, you agree to receive updates and
                      communications from our platform.
                    </p>
                    <small
                      v-if="hasError('terms')"
                      class="p-error block mt-1 text-xs"
                    >
                      You must agree to the terms and conditions
                    </small>
                  </div>
                </div>
              </div>

              <!-- Navigation buttons -->
              <div class="flex justify-between mt-6 pt-3">
                <Button
                  type="button"
                  label="Back"
                  icon="pi pi-arrow-left"
                  class="p-button-outlined p-button-md"
                  @click="prevStep"
                />
                <Button
                  type="submit"
                  label="Complete Registration"
                  icon="pi pi-check"
                  iconPos="right"
                  class="p-button-md"
                  :loading="isLoading"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="py-4 text-center mt-auto">
      <p class="text-xs text-gray-500">
        &copy; {{ currentYear }} Event Recruitment Platform. All rights
        reserved.
      </p>
    </footer>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, nextTick, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import LocationSearch from '@/components/shared/LocationSearch.vue';

// Component setup
const router = useRouter();
const authStore = useAuthStore();

// Form state
const form = reactive({
  // Step 1: Basic Information
  recruiterType: null,
  companyName: '',
  recruiterRepName: '',
  email: '',
  phoneNumber: '',

  // Step 2: Account Information
  username: '',
  password: '',
  confirmPassword: '',

  // Step 3: Company Details
  companyDescription: '',
  companyLocation: '',
  companyLocationId: null,
  companyWebsite: '',
  terms: false,
});

// Form errors
const formErrors = reactive({
  confirmPasswordMessage: '',
});

// Computed properties
const showCompanyNameField = computed(() => {
  return form.recruiterType === 'COMPANY' || form.recruiterType === 'AGENCY';
});

// Watch for password changes to validate confirm password
watch(
  () => [form.password, form.confirmPassword],
  ([newPassword, newConfirmPassword]) => {
    // Only validate if both fields have values
    if (newPassword && newConfirmPassword) {
      if (newPassword !== newConfirmPassword) {
        formErrors.confirmPassword = true;
        formErrors.confirmPasswordMessage = 'Passwords do not match';
      } else {
        formErrors.confirmPassword = false;
        formErrors.confirmPasswordMessage = '';
      }
    }
  }
);

// Steps setup
const activeStep = ref(0);
const items = ref([
  { label: 'Basic', icon: 'pi pi-building' },
  { label: 'Account', icon: 'pi pi-user' },
  { label: 'Company', icon: 'pi pi-briefcase' },
]);

// Options for recruiter type dropdown
const recruiterTypeOptions = [
  { label: 'Individual', value: 'INDIVIDUAL' },
  { label: 'Company', value: 'COMPANY' },
  { label: 'Agency', value: 'AGENCY' },
];

// Current year for footer
const currentYear = new Date().getFullYear();

// Component state
const isLoading = ref(false);
const error = ref('');

// Check if a field has an error
const hasError = (field) => {
  return formErrors[field] || false;
};

// Validate form fields based on current step
const validateCurrentStep = () => {
  console.log('Validating step:', activeStep.value);

  // Clear previous errors
  Object.keys(formErrors).forEach((key) => {
    if (key !== 'confirmPasswordMessage') {
      formErrors[key] = false;
    }
  });

  let isValid = true;

  if (activeStep.value === 0) {
    // Step 1: Basic Information
    if (!form.recruiterType) {
      formErrors.recruiterType = true;
      isValid = false;
      console.log('Recruiter type validation failed');
    }

    // Only validate company name if recruiter type is Company or Agency
    if (showCompanyNameField.value && !form.companyName) {
      formErrors.companyName = true;
      isValid = false;
      console.log('Company name validation failed');
    }

    if (!form.recruiterRepName) {
      formErrors.recruiterRepName = true;
      isValid = false;
      console.log('Rep name validation failed');
    }

    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      formErrors.email = true;
      isValid = false;
      console.log('Email validation failed');
    }

    if (!form.phoneNumber) {
      formErrors.phoneNumber = true;
      isValid = false;
      console.log('Phone number validation failed');
    }
  } else if (activeStep.value === 1) {
    // Step 2: Account Information
    if (!form.username || form.username.length < 3) {
      formErrors.username = true;
      isValid = false;
      console.log('Username validation failed');
    }

    if (!form.password || form.password.length < 8) {
      formErrors.password = true;
      isValid = false;
      console.log('Password validation failed');
    }

    if (!form.confirmPassword) {
      formErrors.confirmPassword = true;
      formErrors.confirmPasswordMessage = 'Please confirm your password';
      isValid = false;
      console.log('Confirm password validation failed: empty');
    } else if (form.password !== form.confirmPassword) {
      formErrors.confirmPassword = true;
      formErrors.confirmPasswordMessage = 'Passwords do not match';
      isValid = false;
      console.log('Confirm password validation failed: no match');
    }
  } else if (activeStep.value === 2) {
    // Step 3: Company Details
    if (!form.companyDescription) {
      formErrors.companyDescription = true;
      isValid = false;
    }

    if (!form.companyLocationId) {
      formErrors.companyLocation = true;
      isValid = false;
    }

    if (form.companyWebsite && !/^https?:\/\/.*/.test(form.companyWebsite)) {
      formErrors.companyWebsite = true;
      isValid = false;
    }

    if (!form.terms) {
      formErrors.terms = true;
      isValid = false;
    }
  }

  console.log('Form validation result:', isValid, formErrors);
  return isValid;
};

// Step navigation functions
const nextStep = () => {
  console.log('Trying to advance to next step from', activeStep.value);
  if (validateCurrentStep()) {
    activeStep.value++;
    console.log('Advanced to step', activeStep.value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const prevStep = () => {
  console.log('Trying to go back from step', activeStep.value);
  if (activeStep.value > 0) {
    activeStep.value--;
    console.log('Went back to step', activeStep.value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

// Add an onMounted hook
onMounted(() => {
  console.log('Component mounted');
  console.log('Current step value:', activeStep.value);
  console.log('Items:', items.value);
  nextTick(() => {
    const stepsContainer = document.querySelector('.custom-steps-container');
    console.log('Custom steps container found:', !!stepsContainer);
    if (stepsContainer) {
      const stepItems = stepsContainer.querySelectorAll('.custom-step-item');
      console.log('Step items found:', stepItems.length);
    }
  });
});

// Form submission
const submitForm = async () => {
  if (!validateCurrentStep()) return;

  isLoading.value = true;
  error.value = '';

  try {
    // Remove terms field and confirmPassword as they're not needed for the API
    const formData = { ...form };
    delete formData.terms;
    delete formData.confirmPassword;
    delete formData.companyLocation; // Remove the text field as we'll use companyLocationId instead

    // If recruiter type is individual, clear the company name
    if (formData.recruiterType === 'INDIVIDUAL') {
      formData.companyName = '';
    }

    await authStore.registerRecruiter(formData);

    // Store user type for the success page
    localStorage.setItem('registeredUserType', 'recruiter');

    // Redirect to registration success page
    router.push('/registration-success');
  } catch (err) {
    error.value =
      err.response?.data?.message || 'Registration failed. Please try again.';
    // Scroll to top to show error
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } finally {
    isLoading.value = false;
  }
};

// Handle location selection
const handleLocationSelected = (location) => {
  console.log('Location selected:', location);
  if (location && location.length > 0) {
    const selectedLocation = location[0];
    form.companyLocationId = selectedLocation.id;
    form.companyLocation = selectedLocation.name;
  } else {
    form.companyLocationId = null;
    form.companyLocation = '';
  }
};
</script>

<style scoped>
/* Custom form styles */
.form-label {
  @apply block text-xs font-medium text-gray-700 mb-1;
}

.form-group {
  @apply mb-3;
}

/* Input wrapper to contain icon and input */
.input-wrapper {
  position: relative;
  width: 100%;
}

/* Add this new class for icon positioning */
.input-icon {
  @apply absolute left-3 z-10 text-gray-500 text-sm;
  top: 50%;
  transform: translateY(-50%);
}

/* Custom steps container spacing */
.custom-steps-container::before {
  top: 16px;
  left: 45px;
  right: 45px;
}

.custom-step-item {
  width: 60px;
}

/* Make button sizes smaller */
:deep(.p-button.p-button-md) {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

/* Input field padding to make space for icons */
:deep(.p-inputtext),
:deep(.p-multiselect),
:deep(.p-calendar),
:deep(.p-password) {
  height: 2.25rem !important;
  padding-left: 2.5rem !important; /* Add padding to make room for the icon */
}

/* Force vertical centering for Dropdown components */
:deep(.p-dropdown) {
  height: 2.25rem !important;
  border: 1px solid #e2e8f0 !important;
  box-shadow: none !important;
  display: flex !important;
  align-items: center !important;
}

:deep(.p-dropdown-panel .p-dropdown-items-wrapper) {
  padding: 0 !important;
}

:deep(.p-dropdown-panel .p-dropdown-items) {
  padding: 0 !important;
}

:deep(.p-dropdown-panel .p-dropdown-item) {
  padding: 0.5rem 1rem !important;
  font-size: 0.875rem !important;
}

:deep(.p-dropdown .p-dropdown-clear-icon) {
  right: 2.5rem !important;
}

/* Direct targeting for the label element */
:deep(.p-dropdown .p-dropdown-label) {
  border: none !important;
  box-shadow: none !important;
  padding-left: 2.5rem !important;
  margin: 0 !important;
  text-align: left !important;
  height: 100% !important;
  line-height: normal !important;
  font-size: 0.875rem !important;
  top: 0 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: flex-start !important;
}

/* Specific styling for placeholder state */
:deep(.p-dropdown .p-dropdown-label.p-placeholder) {
  padding-left: 2.5rem !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  color: #9ca3af !important;
  font-size: 0.875rem !important;
}

/* Fix the right-side trigger position */
:deep(.p-dropdown .p-dropdown-trigger) {
  border: none !important;
  box-shadow: none !important;
  width: 2.5rem !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  background: transparent !important;
  position: absolute !important;
  right: 0 !important;
  top: 0 !important;
  bottom: 0 !important;
  margin: auto !important;
}

:deep(.p-dropdown:not(.p-disabled).p-focus) {
  border-color: var(--primary-color) !important;
  box-shadow: 0 0 0 1px rgba(var(--primary-rgb), 0.4) !important;
}

:deep(.p-inputtext-sm) {
  @apply text-sm py-2;
}

/* Fix text areas */
:deep(textarea.p-inputtext) {
  min-height: 5rem;
}

/* Password specific fixes */
:deep(.p-password-input) {
  border: 1px solid #e2e8f0 !important;
  border-radius: 0.375rem !important;
  padding-left: 2.5rem !important;
}

:deep(.p-password-input:hover) {
  border-color: #94a3b8 !important;
}

:deep(.p-password-input:focus) {
  border-color: var(--primary-color) !important;
  box-shadow: 0 0 0 1px rgba(var(--primary-rgb), 0.4) !important;
}

:deep(.p-password.p-component) {
  display: flex;
  width: 100%;
}

/* Custom steps styling */
:deep(.custom-steps .p-steps-item .p-steps-number) {
  border: 2px solid #e2e8f0;
  color: #64748b;
  background-color: white;
}

:deep(.custom-steps .p-steps-item.p-highlight .p-steps-number) {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

:deep(.custom-steps .p-steps-item .p-menuitem-link) {
  padding: 0;
}

:deep(.custom-steps .p-steps-item .p-menuitem-link .p-steps-title) {
  color: #64748b;
  font-weight: 500;
  margin-top: 0.5rem;
}

:deep(.custom-steps .p-steps-item.p-highlight .p-steps-title) {
  color: var(--primary-color);
}

:deep(.p-inputtext-lg) {
  @apply text-base py-3;
}

:deep(.p-dropdown-lg) {
  @apply text-base;
}

:deep(.p-dropdown-lg .p-dropdown-label) {
  @apply py-3;
}

:deep(.p-multiselect-lg) {
  @apply text-base;
}

:deep(.p-multiselect-lg .p-multiselect-label) {
  @apply py-3;
}

:deep(.p-password-lg .p-password-input) {
  @apply text-base py-3;
}

:deep(.p-calendar-lg .p-inputtext) {
  @apply text-base py-3;
}

/* Dropdown specific */
:deep(.p-dropdown .p-dropdown-label) {
  display: flex;
  align-items: center;
  line-height: 1;
  height: 2.75rem;
}

:deep(.p-dropdown .p-dropdown-label:not(.p-placeholder)) {
  color: #1e293b;
  font-weight: 500;
}

:deep(.p-dropdown .p-dropdown-trigger) {
  width: 3rem;
  padding-right: 0.5rem;
}

:deep(.p-dropdown-panel) {
  width: auto !important;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

:deep(.p-dropdown-panel .p-dropdown-items) {
  padding: 0.5rem 0;
}

:deep(.p-dropdown-panel .p-dropdown-items .p-dropdown-item) {
  padding: 0.75rem 1.25rem;
}

:deep(.p-dropdown .p-dropdown-clear-icon) {
  color: #64748b;
}

:deep(.p-dropdown-items-wrapper) {
  border: none !important;
  outline: none !important;
}

/* Password specific */
:deep(.p-password) {
  width: 100%;
  padding: 0 !important;
}

:deep(.p-password .p-password-input) {
  width: 100% !important;
  padding: 0.75rem 1rem !important;
  padding-left: 2.5rem !important;
}

/* Remove focus outlines and box shadows */
:deep(.p-dropdown:not(.p-disabled):hover),
:deep(.p-dropdown:not(.p-disabled).p-focus),
:deep(.p-calendar:not(.p-disabled):hover),
:deep(.p-calendar:not(.p-disabled).p-focus),
:deep(.p-multiselect:not(.p-disabled):hover),
:deep(.p-multiselect:not(.p-disabled).p-focus),
:deep(.p-password:not(.p-disabled):hover),
:deep(.p-password:not(.p-disabled).p-focus) {
  outline: none !important;
  box-shadow: none !important;
}

:deep(.p-dropdown .p-dropdown-label:focus),
:deep(.p-calendar .p-inputtext:focus),
:deep(.p-multiselect .p-multiselect-label:focus),
:deep(.p-password .p-password-input:focus) {
  box-shadow: none !important;
  outline: none !important;
}

/* Animation classes */
.animate-fadeIn {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Media queries for responsive design */
@media (max-width: 640px) {
  :deep(.p-steps .p-steps-item .p-menuitem-link .p-steps-title) {
    display: none;
  }

  :deep(.p-steps) {
    height: 6rem;
  }
}

/* Remove the step item click styling */
:deep(.p-steps .p-steps-item) {
  cursor: default;
}

:deep(.p-steps .p-steps-item .p-menuitem-link:not(.p-disabled):focus) {
  box-shadow: none;
}

:deep(.p-steps .p-steps-item .p-menuitem-link) {
  background: transparent;
}

/* Fix for step indicator to ensure it updates properly */
:deep(.p-steps) {
  position: relative;
  z-index: 1;
}

:deep(.p-steps .p-steps-item) {
  cursor: default;
}

:deep(.p-steps .p-steps-item .p-menuitem-link) {
  background: transparent !important;
  padding: 0;
}

:deep(.p-steps .p-steps-item .p-menuitem-link:not(.p-disabled):focus) {
  box-shadow: none;
}

:deep(.p-steps-item.p-highlight) {
  z-index: 2;
}

:deep(.p-steps-item.p-highlight .p-steps-number) {
  z-index: 2;
}

/* Force the active step styling */
:deep(.p-steps .p-steps-item:nth-child(1).p-highlight .p-steps-number),
:deep(.p-steps .p-steps-item:nth-child(2).p-highlight .p-steps-number),
:deep(.p-steps .p-steps-item:nth-child(3).p-highlight .p-steps-number) {
  background-color: var(--primary-color) !important;
  color: white !important;
  border-color: var(--primary-color) !important;
}

:deep(.p-steps .p-steps-item:nth-child(1).p-highlight .p-steps-title),
:deep(.p-steps .p-steps-item:nth-child(2).p-highlight .p-steps-title),
:deep(.p-steps .p-steps-item:nth-child(3).p-highlight .p-steps-title) {
  color: var(--primary-color) !important;
}

/* Custom form component styling */
.custom-password {
  width: 100%;
}

:deep(.custom-password .p-password-input) {
  width: 100%;
  padding: 0.75rem 1rem;
  padding-left: 2.5rem !important;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  transition: all 0.3s;
}

:deep(.custom-password .p-password-input:hover) {
  border-color: #94a3b8;
}

:deep(.custom-password .p-password-input:focus) {
  box-shadow: 0 0 0 1px rgba(var(--primary-rgb), 0.4);
  border-color: var(--primary-color);
  outline: none;
}

.custom-dropdown {
  width: 100%;
}

:deep(.custom-calendar .p-inputtext) {
  width: 100%;
  padding: 0.75rem 1rem;
  padding-left: 2.5rem !important;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  transition: all 0.3s;
}

:deep(.p-multiselect.custom-multiselect) {
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  transition: all 0.3s;
}

:deep(.p-multiselect.custom-multiselect:hover) {
  border-color: #94a3b8;
}

:deep(.p-multiselect.custom-multiselect .p-multiselect-label) {
  padding: 0.75rem 1rem;
  padding-left: 2.5rem !important;
}

:deep(.p-dropdown.p-component) {
  width: 100%;
  height: auto;
}

:deep(.p-dropdown .p-dropdown-label) {
  padding: 0.75rem 1rem;
  padding-left: 2.5rem !important;
  height: auto;
  min-height: 3rem;
  line-height: 1.5;
}

:deep(.p-dropdown-panel) {
  width: auto !important;
}

:deep(.p-dropdown-panel .p-dropdown-items) {
  padding: 0.5rem 0;
}

:deep(.p-dropdown-panel .p-dropdown-items .p-dropdown-item) {
  padding: 0.75rem 1.25rem;
}

:deep(.p-dropdown .p-dropdown-trigger) {
  width: 3rem;
  padding-right: 0.5rem;
}

:deep(.p-calendar) {
  width: 100%;
}

:deep(.p-calendar .p-inputtext) {
  height: auto;
  min-height: 3rem;
  width: 100%;
  line-height: 1.5;
  padding: 0.75rem 1rem;
  padding-left: 2.5rem !important;
}

:deep(.p-dropdown.custom-dropdown),
:deep(.p-calendar.custom-calendar),
:deep(.p-inputtext-lg),
:deep(.p-password.custom-password) {
  height: auto;
  min-height: 3rem;
  line-height: 1.5;
}

:deep(.p-inputtext),
:deep(.p-dropdown),
:deep(.p-multiselect),
:deep(.p-calendar) {
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  transition: all 0.3s;
  width: 100%;
  height: auto;
}

:deep(.p-inputtext):not(.p-dropdown-label):not(.p-multiselect-label):not(
    .p-calendar-label
  ) {
  padding: 0.75rem 1rem;
  padding-left: 2.5rem !important;
}

:deep(.p-inputtext:hover),
:deep(.p-dropdown:hover),
:deep(.p-multiselect:hover),
:deep(.p-calendar:hover) {
  border-color: #94a3b8;
}

:deep(.p-inputtext:focus),
:deep(.p-dropdown:not(.p-disabled).p-focus),
:deep(.p-multiselect:not(.p-disabled).p-focus),
:deep(.p-calendar:not(.p-disabled).p-focus) {
  box-shadow: 0 0 0 1px rgba(var(--primary-rgb), 0.4);
  border-color: var(--primary-color);
  outline: none;
}

/* Fix for input field height consistency */
:deep(.p-inputtext),
:deep(.p-dropdown),
:deep(.p-multiselect),
:deep(.p-calendar),
:deep(.p-password) {
  height: 2.75rem !important;
}

:deep(.p-inputtext) {
  display: flex;
  align-items: center;
}

/* Make sure textareas don't get restricted */
:deep(textarea.p-inputtext) {
  height: auto !important;
  padding: 0.75rem 1rem !important;
  padding-left: 2.5rem !important;
  display: block !important;
  align-items: flex-start !important;
}

/* Fix for calendar display */
:deep(.p-calendar .p-inputtext) {
  height: 100% !important;
  display: flex;
  align-items: center;
  padding-left: 2.5rem !important;
}

/* Make dropdown size consistent */
:deep(.p-dropdown-panel) {
  min-width: 100% !important;
}

/* Fix text alignment in selected items */
:deep(.p-dropdown-items .p-dropdown-item.p-highlight) {
  background-color: #f1f5f9;
  color: #334155;
  font-weight: 500;
}

/* Button styling */
:deep(.p-button-lg) {
  padding: 0.75rem 1.5rem;
}

/* Fix for text areas */
:deep(textarea.p-inputtext) {
  display: block;
  padding: 0.75rem 1rem;
  padding-left: 2.5rem !important;
  height: auto !important;
  min-height: 6rem;
}

/* Further fixes for dropdown value alignment */
:deep(.p-dropdown .p-dropdown-label:not(.p-placeholder)) {
  color: #1e293b;
  font-weight: 500;
}

/* Fix placeholder alignment in all inputs */
:deep(.p-inputtext::placeholder) {
  line-height: normal;
  vertical-align: middle;
}

:deep(.p-dropdown .p-dropdown-label.p-placeholder) {
  display: flex;
  align-items: center;
}

/* Fix specific input vertical alignment */
:deep(.p-inputtext) {
  line-height: normal;
}

:deep(.p-dropdown .p-dropdown-label) {
  display: flex;
  align-items: center;
}

:deep(.p-password .p-password-input) {
  line-height: normal;
  display: flex;
  align-items: center;
}

/* Custom steps indicator */
.custom-steps-container {
  position: relative;
  padding: 0 1rem;
}

.custom-steps-container::before {
  content: '';
  position: absolute;
  top: 20px;
  left: 60px;
  right: 60px;
  height: 2px;
  background-color: #e2e8f0;
  z-index: 0;
}

.custom-step-item {
  position: relative;
  z-index: 1;
  width: 80px;
}

.step-number {
  background-color: white;
  border-color: #e2e8f0;
  color: #64748b;
  transition: all 0.3s ease;
}

.custom-step-item.active .step-number {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.step-label {
  color: #64748b;
  transition: all 0.3s ease;
}

.custom-step-item.active .step-label {
  color: var(--primary-color);
  font-weight: 600;
}
</style>
