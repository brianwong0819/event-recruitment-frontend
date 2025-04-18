<template>
  <div
    class="flex flex-col min-h-screen bg-gradient-to-br from-gray-100 to-blue-50"
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
        <div class="flex justify-start items-center mb-2 px-2">
          <router-link
            to="/"
            class="text-xs font-medium text-gray-600 hover:text-primary-600 transition-colors duration-200 flex items-center"
          >
            <i class="pi pi-arrow-left mr-1 text-xs"></i> Back to home
          </router-link>
        </div>

        <div
          class="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100"
        >
          <!-- Decorative top bar -->
          <div class="h-2 bg-gradient-to-r from-gray-700 to-gray-500"></div>

          <div class="p-5">
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
              <h1 class="text-2xl font-bold text-gray-800 mb-1">Admin Login</h1>
              <p class="text-base text-gray-600">
                Sign in to access the admin panel
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
                  Admin Username
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
                    placeholder="Enter your admin username"
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
                <label
                  for="password"
                  class="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
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
                severity="secondary"
              />
            </form>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="py-4 text-center">
      <p class="text-xs text-gray-500">
        &copy; {{ currentYear }} CrewConnect. All rights reserved.
      </p>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useVuelidate } from '@vuelidate/core';
import { required, helpers } from '@vuelidate/validators';
import { useAuthStore } from '@/stores/auth';

// Component setup
const router = useRouter();
const authStore = useAuthStore();

// Form fields
const username = ref('');
const password = ref('');
const isLoading = ref(false);
const error = ref('');
const currentYear = new Date().getFullYear();

// Form validation rules
const rules = {
  username: {
    required: helpers.withMessage('Username is required', required),
  },
  password: {
    required: helpers.withMessage('Password is required', required),
  },
};

const v$ = useVuelidate(rules, { username, password });

// Handle form submission - Admin login
const handleSubmit = async () => {
  error.value = '';

  // Validate form
  const result = await v$.value.$validate();
  if (!result) return;

  isLoading.value = true;

  try {
    // Login as admin
    // This will need to be implemented in the auth store
    await authStore.adminLogin(username.value, password.value);
    // Redirect will be handled by the store
  } catch (err) {
    console.error('Admin login error:', err);
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
