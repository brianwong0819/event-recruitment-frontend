<template>
  <div
    class="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
  >
    <!-- Header with Logo -->
    <header class="pt-4 pb-2">
      <div class="container px-4">
        <router-link to="/" class="inline-block">
          <img src="@/assets/logo.png" alt="CrewLink Logo" class="h-10" />
        </router-link>
      </div>
    </header>

    <!-- Main content -->
    <main class="flex-grow flex items-center justify-center px-4 py-4">
      <div class="w-full max-w-md">
        <!-- Navigation links above the card -->
        <div class="flex justify-between items-center mb-2 px-2">
          <router-link
            to="/"
            class="text-xs font-medium text-gray-600 hover:text-primary-600 transition-colors duration-200 flex items-center"
          >
            <i class="pi pi-arrow-left mr-1 text-xs"></i> Back to home
          </router-link>
          <router-link
            to="/recruiter-login"
            class="text-xs font-medium text-primary-600 hover:text-primary-800 transition-colors duration-200 flex items-center"
          >
            Are you an employer? <i class="pi pi-arrow-right ml-1 text-xs"></i>
          </router-link>
        </div>

        <div
          class="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100"
        >
          <!-- Decorative top bar -->
          <div
            class="h-2 bg-gradient-to-r from-primary-500 to-primary-300"
          ></div>

          <div class="p-5">
            <!-- Success message from the auth store -->
            <div
              v-if="authStore.successMessage"
              class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg"
            >
              <div class="flex items-center">
                <i class="pi pi-check-circle text-green-500 mr-2 text-sm"></i>
                <p class="text-green-700 text-sm">
                  {{ authStore.successMessage }}
                </p>
              </div>
            </div>

            <!-- Registration success message from query param (fallback) -->
            <div
              v-else-if="registrationSuccess"
              class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg"
            >
              <div class="flex items-center">
                <i class="pi pi-check-circle text-green-500 mr-2 text-sm"></i>
                <p class="text-green-700 text-sm">
                  Registration successful! Please sign in with your credentials.
                </p>
              </div>
            </div>

            <!-- Error alert -->
            <div
              v-if="error"
              class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg"
            >
              <div class="flex items-center">
                <i
                  class="pi pi-exclamation-circle text-red-500 mr-2 text-sm"
                ></i>
                <p class="text-red-700 text-sm">{{ error }}</p>
              </div>
            </div>

            <!-- Login form header -->
            <div class="text-center mb-4">
              <h1 class="text-2xl font-bold text-gray-800 mb-1">
                Welcome Back
              </h1>
              <p class="text-base text-gray-600">
                Sign in to continue to CrewLink
              </p>
            </div>

            <!-- Login form -->
            <form @submit.prevent="handleSubmit" class="space-y-4">
              <!-- Username field -->
              <div class="space-y-1">
                <label
                  for="username"
                  class="block text-sm font-medium text-gray-700"
                >
                  Email or Username
                </label>
                <div class="flex items-center">
                  <div class="mr-2">
                    <i class="pi pi-user text-gray-400 text-base"></i>
                  </div>
                  <InputText
                    id="username"
                    v-model="username"
                    type="text"
                    autocomplete="username"
                    placeholder="Enter your email or username"
                    class="w-full p-inputtext"
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
              <div class="space-y-1">
                <div class="flex items-center justify-between">
                  <label
                    for="password"
                    class="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <router-link
                    to="/forgot-password"
                    class="text-xs font-medium text-primary-600 hover:text-primary-800 transition-colors duration-200"
                  >
                    Forgot password?
                  </router-link>
                </div>
                <div class="flex items-center">
                  <div class="mr-2">
                    <i class="pi pi-lock text-gray-400 text-base"></i>
                  </div>
                  <Password
                    id="password"
                    v-model="password"
                    :feedback="false"
                    toggleMask
                    placeholder="Enter your password"
                    class="w-full"
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
                class="w-full p-button-primary p-2 mt-4 shadow-md hover:shadow-lg transition-shadow duration-200 text-base"
              />
            </form>

            <!-- Register link -->
            <div class="text-center mt-6">
              <p class="text-sm text-gray-600">
                Don't have an account?
                <router-link
                  to="/register"
                  class="font-medium text-primary-600 hover:text-primary-800 transition-colors duration-200"
                >
                  Create one now
                </router-link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="py-4 text-center">
      <p class="text-xs text-gray-500">
        &copy; {{ currentYear }} CrewLink. All rights reserved.
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
  font-size: 0.9rem;
}

:deep(.p-button) {
  height: 42px;
  font-size: 1rem;
}

:deep(.p-inputtext) {
  padding: 0.6rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.9rem;
}

:deep(.p-password-panel) {
  margin-top: 6px;
  font-size: 0.9rem;
}
</style>
