<template>
  <div
    class="flex flex-col min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50"
  >
    <!-- Header with Logo -->
    <header class="pt-6 pb-3">
      <div class="container px-6">
        <router-link
          to="/"
          class="inline-block transition-transform hover:scale-105 duration-300"
        >
          <div class="text-3xl font-extrabold tracking-tight">
            <span class="text-primary-700">Crew</span
            ><span class="text-gray-800">Connect</span>
          </div>
        </router-link>
      </div>
    </header>

    <!-- Main content -->
    <main class="flex-grow flex items-center justify-center px-4 py-8">
      <div class="w-full max-w-md">
        <!-- Navigation links above the card -->
        <div class="flex justify-between items-center mb-3 px-2">
          <router-link
            to="/"
            class="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors duration-200 flex items-center group"
          >
            <i
              class="pi pi-arrow-left mr-2 text-xs group-hover:-translate-x-1 transition-transform duration-200"
            ></i>
            Back to home
          </router-link>
          <router-link
            to="/recruiter-login"
            class="text-sm font-medium text-primary-600 hover:text-primary-800 transition-colors duration-200 flex items-center group"
          >
            Are you a recruiter?
            <i
              class="pi pi-arrow-right ml-2 text-xs group-hover:translate-x-1 transition-transform duration-200"
            ></i>
          </router-link>
        </div>

        <div
          class="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transform transition-all duration-300 hover:shadow-2xl"
        >
          <!-- Decorative top bar -->
          <div
            class="h-2 bg-gradient-to-r from-primary-600 via-primary-500 to-primary-400"
          ></div>

          <div class="p-8">
            <!-- Success message from the auth store -->
            <div
              v-if="authStore.successMessage"
              class="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl"
            >
              <div class="flex items-center">
                <i class="pi pi-check-circle text-green-500 mr-3 text-lg"></i>
                <p class="text-green-700 text-sm font-medium">
                  {{ authStore.successMessage }}
                </p>
              </div>
            </div>

            <!-- Registration success message from query param (fallback) -->
            <div
              v-else-if="registrationSuccess"
              class="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl"
            >
              <div class="flex items-center">
                <i class="pi pi-check-circle text-green-500 mr-3 text-lg"></i>
                <p class="text-green-700 text-sm font-medium">
                  Registration successful! Please sign in with your credentials.
                </p>
              </div>
            </div>

            <!-- Error alert -->
            <div
              v-if="error"
              class="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl"
            >
              <div class="flex items-center">
                <i
                  class="pi pi-exclamation-circle text-red-500 mr-3 text-lg"
                ></i>
                <p class="text-red-700 text-sm font-medium">{{ error }}</p>
              </div>
            </div>

            <!-- Login form header -->
            <div class="text-center mb-8">
              <h1
                class="text-3xl font-bold text-gray-800 mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-800"
              >
                Welcome Back
              </h1>
              <p class="text-base text-gray-600">
                Sign in to continue to CrewConnect
              </p>
            </div>

            <!-- Login form -->
            <form @submit.prevent="handleSubmit" class="space-y-6">
              <!-- Username field -->
              <div class="space-y-2">
                <label
                  for="username"
                  class="block text-sm font-medium text-gray-700"
                >
                  Email or Username
                </label>
                <div class="relative">
                  <span
                    class="absolute inset-y-0 left-0 flex items-center pl-3 z-10"
                  >
                    <i class="pi pi-user text-gray-400 text-base"></i>
                  </span>
                  <InputText
                    id="username"
                    v-model="username"
                    type="text"
                    autocomplete="username"
                    placeholder="Enter your email or username"
                    class="w-full pl-10 py-3 border-gray-300 rounded-xl hover:border-primary-400 focus:border-primary-500 focus:ring focus:ring-primary-200 transition-all duration-200 input-with-icon"
                    :class="{ 'p-invalid': v$.username.$error }"
                    @blur="v$.username.$touch()"
                  />
                </div>
                <small
                  v-if="v$.username.$error"
                  class="p-error flex items-center text-xs"
                >
                  <i class="pi pi-info-circle mr-1"></i>
                  {{ v$.username.$errors[0].$message }}
                </small>
              </div>

              <!-- Password field -->
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <label
                    for="password"
                    class="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                </div>
                <div class="relative">
                  <span
                    class="absolute inset-y-0 left-0 flex items-center pl-3 z-10"
                  >
                    <i class="pi pi-lock text-gray-400 text-base"></i>
                  </span>
                  <Password
                    id="password"
                    v-model="password"
                    :feedback="false"
                    toggleMask
                    placeholder="Enter your password"
                    class="w-full password-with-icon"
                    inputClass="w-full pl-10 py-3 border-gray-300 rounded-xl hover:border-primary-400 focus:border-primary-500 focus:ring focus:ring-primary-200 transition-all duration-200"
                    :class="{ 'p-invalid': v$.password.$error }"
                    @blur="v$.password.$touch()"
                  />
                </div>
                <small
                  v-if="v$.password.$error"
                  class="p-error flex items-center text-xs"
                >
                  <i class="pi pi-info-circle mr-1"></i>
                  {{ v$.password.$errors[0].$message }}
                </small>
              </div>

              <!-- Submit button -->
              <Button
                type="submit"
                :label="isLoading ? 'Signing in...' : 'Sign In'"
                :loading="isLoading"
                loadingIcon="pi pi-spin pi-spinner"
                class="w-full p-button-primary p-3 mt-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-base font-medium hover:opacity-95 transform hover:-translate-y-1"
              />
            </form>

            <!-- Register link -->
            <div class="text-center mt-8">
              <p class="text-sm text-gray-600">
                Don't have an account?
                <router-link
                  to="/register"
                  class="font-medium text-primary-600 hover:text-primary-800 transition-colors duration-200 ml-1 inline-flex items-center group"
                >
                  Create one now
                  <i
                    class="pi pi-arrow-right ml-1 text-xs invisible group-hover:visible group-hover:translate-x-1 transition-all duration-200"
                  ></i>
                </router-link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="py-6 text-center">
      <p class="text-sm text-gray-500">
        &copy; {{ currentYear }} CrewConnect. All rights reserved.
      </p>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useVuelidate } from '@vuelidate/core';
import { required, helpers } from '@vuelidate/validators';
import { useAuthStore } from '@/stores/auth';

// Component setup
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

// Form fields
const username = ref('');
const password = ref('');
const isLoading = ref(false);
const error = ref('');
const currentYear = new Date().getFullYear();

// Create ref for registration success
const registrationSuccess = ref(false);

// Form validation rules
const rules = {
  username: {
    required: helpers.withMessage('Username or email is required', required),
  },
  password: {
    required: helpers.withMessage('Password is required', required),
  },
};

const v$ = useVuelidate(rules, { username, password });

// Handle form submission - Candidate login
const handleSubmit = async () => {
  error.value = '';

  // Validate form
  const result = await v$.value.$validate();
  if (!result) return;

  isLoading.value = true;

  try {
    // Login as candidate
    await authStore.candidateLogin(username.value, password.value);
    // Redirect will be handled by the store
  } catch (err) {
    console.error('Login error in component:', err);
    // Display error message to user
    error.value =
      err.response?.data?.message ||
      'Login failed. Please check your credentials.';

    // Reset password field on failed login
    password.value = '';
  } finally {
    isLoading.value = false;
  }
};

// Reset form on mount if coming from another page
onMounted(() => {
  // Initialize auth store from localStorage
  authStore.init();

  // If user is already authenticated, redirect to appropriate dashboard
  if (authStore.authenticated) {
    router.push(authStore.getDefaultHomePage());
  }

  // Clear form
  username.value = '';
  password.value = '';
  v$.value.$reset();

  // Check for query params on mount
  if (route.query.registered === 'true') {
    registrationSuccess.value = true;
  }

  // This ensures we see any success message set by the registration process
  setTimeout(() => {
    // We don't immediately clear it in case it was just set during navigation
  }, 500);
});
</script>

<style scoped>
/* Custom styles for the login page */
:deep(.p-password input) {
  width: 100%;
  font-size: 0.95rem;
}

:deep(.p-button) {
  height: 48px;
  font-size: 1rem;
}

:deep(.p-inputtext) {
  font-size: 0.95rem;
}

/* Fix for all input icons */
:deep(.input-with-icon) {
  padding-left: 2.5rem !important;
}

:deep(.password-with-icon .p-password-input) {
  padding-left: 2.5rem !important;
}

:deep(.password-with-icon .p-password-panel) {
  margin-top: 8px;
  font-size: 0.9rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

:deep(.password-with-icon .p-icon.p-password-icon) {
  z-index: 20;
  color: var(--primary-color);
  margin-left: 8px;
}

:deep(.password-with-icon) {
  width: 100%;
}

:deep(.p-password-meter) {
  margin-top: 8px;
}
</style>
