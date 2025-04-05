<template>
  <div
    class="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
  >
    <!-- Header with Logo -->
    <header class="pt-6 pb-2">
      <div class="container px-6">
        <router-link to="/" class="inline-block">
          <img
            src="@/assets/logo.png"
            alt="Event Recruitment Logo"
            class="h-14"
          />
        </router-link>
      </div>
    </header>

    <!-- Main content -->
    <main class="flex-grow flex items-center justify-center px-4 py-8">
      <div class="w-full max-w-3xl">
        <!-- Navigation links above the card -->
        <div class="flex justify-start items-center mb-4 px-2">
          <router-link
            to="/register"
            class="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors duration-200 flex items-center"
          >
            <i class="pi pi-arrow-left mr-1 text-xs"></i> Back to registration
            options
          </router-link>
        </div>

        <!-- Title section -->
        <div class="text-center mb-8">
          <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Join Our Talent Pool
          </h1>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            Create your candidate profile and discover exciting event
            opportunities
          </p>
        </div>

        <!-- Error alert -->
        <div
          v-if="error"
          class="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md flex items-center"
        >
          <i class="pi pi-exclamation-circle text-red-500 mr-3 text-xl"></i>
          <p class="text-red-700">{{ error }}</p>
        </div>

        <!-- Registration card -->
        <div
          class="bg-white rounded-xl p-6 md:p-8 shadow-lg border border-gray-100"
        >
          <!-- Custom progress steps indicator -->
          <div class="mb-10">
            <div class="custom-steps-container flex justify-between">
              <div
                v-for="(item, index) in items"
                :key="index"
                class="custom-step-item flex flex-col items-center"
                :class="{ active: index <= currentStep }"
              >
                <div
                  class="step-number flex items-center justify-center h-10 w-10 rounded-full border-2 mb-2"
                >
                  <i :class="item.icon + ' text-lg'"></i>
                </div>
                <span class="step-label text-sm font-medium">{{
                  item.label
                }}</span>
              </div>
            </div>
          </div>

          <!-- Step 1: Basic Information -->
          <div v-show="currentStep === 0" class="animate-fadeIn">
            <div class="mb-6 border-b border-gray-100 pb-4">
              <h2 class="text-2xl font-semibold text-gray-800">
                Account Information
              </h2>
              <p class="text-gray-600 mt-1">Create your login credentials</p>
            </div>
            <form @submit.prevent="nextStep" class="space-y-6">
              <!-- Name field -->
              <div class="form-group">
                <label for="name" class="form-label"> Full Name </label>
                <div class="flex items-center">
                  <i class="pi pi-user mr-3 text-gray-500"></i>
                  <InputText
                    id="name"
                    v-model="form.name"
                    type="text"
                    class="w-full p-inputtext-lg"
                    placeholder="Enter your full name"
                    :class="{ 'p-invalid': hasError('name') }"
                  />
                </div>
                <small v-if="hasError('name')" class="p-error">
                  Full name is required
                </small>
              </div>

              <!-- Email field -->
              <div class="form-group">
                <label for="email" class="form-label"> Email Address </label>
                <div class="flex items-center">
                  <i class="pi pi-envelope mr-3 text-gray-500"></i>
                  <InputText
                    id="email"
                    v-model="form.email"
                    type="email"
                    class="w-full p-inputtext-lg"
                    placeholder="your.email@example.com"
                    :class="{ 'p-invalid': hasError('email') }"
                  />
                </div>
                <small v-if="hasError('email')" class="p-error">
                  A valid email is required
                </small>
              </div>

              <!-- Username field -->
              <div class="form-group">
                <label for="username" class="form-label"> Username </label>
                <div class="flex items-center">
                  <i class="pi pi-at mr-3 text-gray-500"></i>
                  <InputText
                    id="username"
                    v-model="form.username"
                    type="text"
                    class="w-full p-inputtext-lg"
                    placeholder="Choose a unique username"
                    :class="{ 'p-invalid': hasError('username') }"
                  />
                </div>
                <small v-if="hasError('username')" class="p-error">
                  Username is required (minimum 3 characters)
                </small>
              </div>

              <!-- Password field -->
              <div class="form-group">
                <label for="password" class="form-label"> Password </label>
                <div class="flex items-center">
                  <i class="pi pi-lock mr-3 text-gray-500"></i>
                  <Password
                    id="password"
                    v-model="form.password"
                    toggleMask
                    class="w-full custom-password"
                    :class="{ 'p-invalid': hasError('password') }"
                    :feedback="true"
                    placeholder="Create a secure password"
                  />
                </div>
                <small v-if="hasError('password')" class="p-error">
                  Password is required (minimum 8 characters)
                </small>
              </div>

              <!-- Confirm Password field -->
              <div class="form-group">
                <label for="confirmPassword" class="form-label">
                  Confirm Password
                </label>
                <div class="flex items-center">
                  <i class="pi pi-shield mr-3 text-gray-500"></i>
                  <Password
                    id="confirmPassword"
                    v-model="form.confirmPassword"
                    toggleMask
                    class="w-full custom-password"
                    :class="{ 'p-invalid': hasError('confirmPassword') }"
                    :feedback="false"
                    placeholder="Confirm your password"
                  />
                </div>
                <small v-if="hasError('confirmPassword')" class="p-error">
                  {{
                    formErrors.confirmPasswordMessage ||
                    'Password confirmation is required'
                  }}
                </small>
              </div>

              <!-- Button -->
              <div class="pt-4">
                <Button
                  type="submit"
                  label="Continue to Personal Information"
                  icon="pi pi-arrow-right"
                  iconPos="right"
                  class="w-full p-button-lg"
                />
              </div>

              <!-- Login link -->
              <div class="text-center pt-4">
                <p class="text-gray-600">
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

          <!-- Step 2: Personal Information -->
          <div v-show="currentStep === 1" class="animate-fadeIn">
            <div class="mb-6 border-b border-gray-100 pb-4">
              <h2 class="text-2xl font-semibold text-gray-800">
                Personal Information
              </h2>
              <p class="text-gray-600 mt-1">Tell us a bit about yourself</p>
            </div>
            <form @submit.prevent="nextStep" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Phone Number field -->
                <div class="form-group">
                  <label for="phoneNumber" class="form-label">
                    Phone Number
                  </label>
                  <div class="flex items-center">
                    <i class="pi pi-phone mr-3 text-gray-500"></i>
                    <InputText
                      id="phoneNumber"
                      v-model="form.phoneNumber"
                      type="tel"
                      class="w-full p-inputtext-lg"
                      placeholder="+60 12 345 6789"
                      :class="{ 'p-invalid': hasError('phoneNumber') }"
                    />
                  </div>
                  <small v-if="hasError('phoneNumber')" class="p-error">
                    Phone number is required
                  </small>
                </div>

                <!-- Gender field -->
                <div class="form-group">
                  <label for="gender" class="form-label"> Gender </label>
                  <div class="flex items-center">
                    <i class="pi pi-user mr-3 text-gray-500"></i>
                    <Dropdown
                      id="gender"
                      v-model="form.gender"
                      :options="genderOptions"
                      optionLabel="label"
                      optionValue="value"
                      placeholder="Select your gender"
                      class="w-full custom-dropdown"
                      :class="{ 'p-invalid': hasError('gender') }"
                    />
                  </div>
                  <small v-if="hasError('gender')" class="p-error">
                    Gender selection is required
                  </small>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Date of Birth field -->
                <div class="form-group">
                  <label for="dateOfBirth" class="form-label">
                    Date of Birth
                  </label>
                  <div class="flex items-center">
                    <i class="pi pi-calendar mr-3 text-gray-500"></i>
                    <Calendar
                      id="dateOfBirth"
                      v-model="form.dateOfBirth"
                      dateFormat="yy-mm-dd"
                      :showIcon="false"
                      :maxDate="maxDate"
                      placeholder="Select your date of birth"
                      class="w-full custom-calendar"
                      :class="{ 'p-invalid': hasError('dateOfBirth') }"
                    />
                  </div>
                  <small v-if="hasError('dateOfBirth')" class="p-error">
                    Date of birth is required (must be 18+)
                  </small>
                </div>

                <!-- Race field -->
                <div class="form-group">
                  <label for="race" class="form-label"> Ethnicity </label>
                  <div class="flex items-center">
                    <i class="pi pi-users mr-3 text-gray-500"></i>
                    <Dropdown
                      id="race"
                      v-model="form.race"
                      :options="raceOptions"
                      optionLabel="label"
                      optionValue="value"
                      placeholder="Select your ethnicity"
                      class="w-full custom-dropdown"
                      :class="{ 'p-invalid': hasError('race') }"
                    />
                  </div>
                  <small v-if="hasError('race')" class="p-error">
                    Ethnicity selection is required
                  </small>
                </div>
              </div>

              <!-- Navigation buttons -->
              <div class="flex justify-between mt-8 pt-4">
                <Button
                  type="button"
                  label="Back"
                  icon="pi pi-arrow-left"
                  class="p-button-outlined p-button-lg"
                  @click="prevStep"
                />
                <Button
                  type="submit"
                  label="Continue to Preferences"
                  icon="pi pi-arrow-right"
                  iconPos="right"
                  class="p-button-lg"
                />
              </div>
            </form>
          </div>

          <!-- Step 3: Languages & Bio -->
          <div v-show="currentStep === 2" class="animate-fadeIn">
            <div class="mb-6 border-b border-gray-100 pb-4">
              <h2 class="text-2xl font-semibold text-gray-800">
                Languages & Bio
              </h2>
              <p class="text-gray-600 mt-1">
                Tell us about yourself and your language skills
              </p>
            </div>
            <form @submit.prevent="submitForm" class="space-y-6">
              <!-- Languages field -->
              <div class="form-group">
                <label for="languages" class="form-label">
                  Languages You Speak
                </label>
                <div class="flex items-center">
                  <i class="pi pi-comment mr-3 text-gray-500"></i>
                  <MultiSelect
                    id="languages"
                    v-model="form.languages"
                    :options="languageOptions"
                    optionLabel="label"
                    optionValue="value"
                    display="chip"
                    placeholder="Select one or more languages"
                    class="w-full custom-multiselect"
                    :class="{ 'p-invalid': hasError('languages') }"
                  />
                </div>
                <small v-if="hasError('languages')" class="p-error">
                  Please select at least one language
                </small>
              </div>

              <!-- Bio field -->
              <div class="form-group">
                <label for="bio" class="form-label"> About You </label>
                <div class="flex items-start">
                  <i class="pi pi-user-edit mr-3 text-gray-500 mt-3"></i>
                  <Textarea
                    id="bio"
                    v-model="form.bio"
                    rows="4"
                    placeholder="Share a brief description about yourself, your skills, and work preferences..."
                    class="w-full p-inputtext-lg"
                    :class="{ 'p-invalid': hasError('bio') }"
                  />
                </div>
                <small v-if="hasError('bio')" class="p-error">
                  Please provide a short bio
                </small>
              </div>

              <!-- Terms and Conditions -->
              <div
                class="bg-gray-50 p-5 rounded-lg mt-6 border border-gray-200"
              >
                <div class="flex items-start">
                  <i class="pi pi-check-circle mr-3 text-gray-500 mt-1"></i>
                  <div>
                    <div class="flex items-center">
                      <Checkbox
                        id="terms"
                        v-model="form.terms"
                        :binary="true"
                        :class="{ 'p-invalid': hasError('terms') }"
                      />
                      <label for="terms" class="text-gray-700 ml-2">
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
                    <p class="text-gray-500 text-sm mt-1">
                      By creating an account, you agree to receive job alerts
                      and communications from our platform.
                    </p>
                    <small v-if="hasError('terms')" class="p-error block mt-2">
                      You must agree to the terms and conditions
                    </small>
                  </div>
                </div>
              </div>

              <!-- Navigation buttons -->
              <div class="flex justify-between mt-8 pt-4">
                <Button
                  type="button"
                  label="Back"
                  icon="pi pi-arrow-left"
                  class="p-button-outlined p-button-lg"
                  @click="prevStep"
                />
                <Button
                  type="submit"
                  label="Complete Registration"
                  icon="pi pi-check"
                  iconPos="right"
                  class="p-button-lg"
                  :loading="isLoading"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="py-6 text-center mt-auto">
      <p class="text-sm text-gray-500">
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
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Dropdown from 'primevue/dropdown';
import Calendar from 'primevue/calendar';
import MultiSelect from 'primevue/multiselect';
import Textarea from 'primevue/textarea';
import Checkbox from 'primevue/checkbox';
import Button from 'primevue/button';

// Component setup
const router = useRouter();
const authStore = useAuthStore();

// Form state
const form = reactive({
  // Step 1: Basic Information
  name: '',
  email: '',
  username: '',
  password: '',
  confirmPassword: '',

  // Step 2: Personal Information
  phoneNumber: '',
  gender: null,
  dateOfBirth: null,
  race: null,

  // Step 3: Languages & Bio
  languages: [],
  bio: '',
  terms: false,
});

// Form errors
const formErrors = reactive({
  confirmPasswordMessage: '',
});

// Steps setup - use a simple ref for currentStep
const currentStep = ref(0);

const items = ref([
  { label: 'Account', icon: 'pi pi-user' },
  { label: 'Personal', icon: 'pi pi-id-card' },
  { label: 'Preferences', icon: 'pi pi-sliders-h' },
]);

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

// Options for dropdowns
const genderOptions = [
  { label: 'Male', value: 'MALE' },
  { label: 'Female', value: 'FEMALE' },
  { label: 'Other', value: 'OTHER' },
  { label: 'Prefer not to say', value: 'UNDISCLOSED' },
];

const raceOptions = [
  { label: 'Malay', value: 'MALAY' },
  { label: 'Chinese', value: 'CHINESE' },
  { label: 'Indian', value: 'INDIAN' },
  { label: 'Other', value: 'OTHER' },
];

const languageOptions = [
  { label: 'English', value: 'ENGLISH' },
  { label: 'Malay', value: 'MALAY' },
  { label: 'Mandarin', value: 'MANDARIN' },
  { label: 'Tamil', value: 'TAMIL' },
  { label: 'Other', value: 'OTHER' },
];

// Calculated maximum date for date of birth (18 years ago)
const maxDate = computed(() => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 18);
  return date;
});

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
  console.log('Validating step:', currentStep.value);

  // Clear previous errors
  Object.keys(formErrors).forEach((key) => {
    if (key !== 'confirmPasswordMessage') {
      formErrors[key] = false;
    }
  });

  let isValid = true;

  if (currentStep.value === 0) {
    // Step 1: Basic Information
    if (!form.name) {
      formErrors.name = true;
      isValid = false;
      console.log('Name validation failed');
    }

    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      formErrors.email = true;
      isValid = false;
      console.log('Email validation failed');
    }

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
  } else if (currentStep.value === 1) {
    // Step 2: Personal Information
    if (!form.phoneNumber) {
      formErrors.phoneNumber = true;
      isValid = false;
    }

    if (!form.gender) {
      formErrors.gender = true;
      isValid = false;
    }

    if (!form.dateOfBirth) {
      formErrors.dateOfBirth = true;
      isValid = false;
    }

    if (!form.race) {
      formErrors.race = true;
      isValid = false;
    }
  } else if (currentStep.value === 2) {
    // Step 3: Languages & Bio
    if (!form.languages || form.languages.length === 0) {
      formErrors.languages = true;
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
  console.log('Trying to advance to next step from', currentStep.value);
  if (validateCurrentStep()) {
    currentStep.value++;
    console.log('Advanced to step', currentStep.value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const prevStep = () => {
  console.log('Trying to go back from step', currentStep.value);
  if (currentStep.value > 0) {
    currentStep.value--;
    console.log('Went back to step', currentStep.value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

// Form submission
const submitForm = async () => {
  if (!validateCurrentStep()) return;

  isLoading.value = true;
  error.value = '';

  try {
    // Format date to string if it exists
    const formattedData = {
      name: form.name,
      email: form.email,
      username: form.username,
      password: form.password,
      phoneNumber: form.phoneNumber,
      gender: form.gender,
      dateOfBirth: form.dateOfBirth
        ? form.dateOfBirth.toISOString().split('T')[0]
        : null,
      race: form.race,
      languages: form.languages,
      bio: form.bio,
    };

    await authStore.registerCandidate(formattedData);

    // Store user type for the success page
    localStorage.setItem('registeredUserType', 'candidate');

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

// Add an onMounted hook
onMounted(() => {
  console.log('Component mounted');
  console.log('Current step value:', currentStep.value);
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
</script>

<style scoped>
/* Custom form styles */
.form-label {
  @apply block text-sm font-medium text-gray-700 mb-1;
}

.form-group {
  @apply mb-4;
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
  padding-top: 0;
  padding-bottom: 0;
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
  border: none !important;
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

/* Force the active step styling */
:deep(.p-steps .p-steps-item.p-highlight .p-steps-number) {
  background-color: var(--primary-color) !important;
  color: white !important;
  border-color: var(--primary-color) !important;
}

:deep(.p-steps .p-steps-item.p-highlight .p-steps-title) {
  color: var(--primary-color) !important;
}

:deep(.p-steps-item.p-highlight) {
  z-index: 2;
}

:deep(.p-steps-item.p-highlight .p-steps-number) {
  z-index: 2;
}

/* Custom form component styling */
.custom-password {
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
}

:deep(.custom-password .p-password-input) {
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 0.375rem;
  transition: all 0.3s;
}

:deep(.custom-password:hover) {
  border-color: #94a3b8;
}

:deep(.custom-password.p-focus) {
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
}

:deep(.p-dropdown.p-component) {
  width: 100%;
  height: auto;
}

:deep(.p-dropdown .p-dropdown-label) {
  padding: 0.75rem 1rem;
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
  padding: 0 !important;
  width: 100%;
  height: auto;
}

:deep(.p-inputtext):not(.p-dropdown-label):not(.p-multiselect-label):not(
    .p-calendar-label
  ) {
  padding: 0.75rem 1rem;
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

/* Calendar specific */
:deep(.p-calendar) {
  width: 100%;
  padding: 0 !important;
}

:deep(.p-calendar .p-inputtext) {
  height: auto;
  width: 100%;
  line-height: 1.5;
  padding: 0.75rem 1rem !important;
  border: none;
}

/* MultiSelect specific */
:deep(.p-multiselect) {
  padding: 0 !important;
}

:deep(.p-multiselect .p-multiselect-label) {
  padding: 0 0.5rem !important;
  display: flex;
  align-items: center;
  height: 2.75rem;
  line-height: 1;
}

:deep(.p-multiselect-token) {
  height: 1.75rem;
  display: inline-flex;
  align-items: center;
  background-color: #f1f5f9 !important;
  border: 1px solid #e2e8f0 !important;
  border-radius: 0.25rem !important;
  margin: 0.2rem !important;
  padding: 0 0.5rem !important;
}

:deep(.p-multiselect-token-label) {
  margin-right: 0.25rem;
  font-size: 0.875rem;
  color: #334155 !important;
}

:deep(.p-multiselect-token-icon) {
  color: #64748b !important;
  font-size: 0.75rem;
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
}

/* Fix for calendar display */
:deep(.p-calendar .p-inputtext) {
  height: 100% !important;
}

/* Make dropdown size consistent */
:deep(.p-dropdown-panel) {
  min-width: 100% !important;
}

/* Multiselect chip styling */
:deep(.p-multiselect-token) {
  background-color: #f1f5f9 !important;
  color: #334155 !important;
  border: 1px solid #e2e8f0;
  padding: 0.25rem 0.5rem !important;
  margin: 0.15rem !important;
  border-radius: 0.25rem !important;
  font-size: 0.875rem;
}

:deep(.p-multiselect-token-icon) {
  margin-left: 0.5rem !important;
  color: #64748b !important;
}

:deep(.p-multiselect-token-icon:hover) {
  color: #334155 !important;
}

:deep(.p-multiselect .p-multiselect-label) {
  padding: 0.5rem 1rem !important;
}

:deep(.p-multiselect .p-multiselect-label.p-placeholder) {
  padding: 0.75rem 1rem !important;
}

/* Specific styling for the languages multiselect */
:deep(.p-chips .p-chips-multiple-container) {
  padding: 0.5rem 0.75rem !important;
  gap: 0.25rem;
}

:deep(.p-chips .p-chips-token) {
  background-color: #f1f5f9;
  color: #334155;
  border: 1px solid #e2e8f0;
  margin-right: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
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

/* Fix calendar height issue */
:deep(.p-datepicker) {
  height: auto !important;
}

/* Fix for text areas */
:deep(textarea.p-inputtext) {
  display: block;
  padding: 0.75rem 1rem;
  height: auto !important;
  min-height: 6rem;
}

:deep(.p-multiselect-label-container) {
  overflow: hidden;
  flex: 1 1 auto;
}

:deep(.p-multiselect .p-multiselect-label.p-placeholder) {
  padding-left: 1rem !important;
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
