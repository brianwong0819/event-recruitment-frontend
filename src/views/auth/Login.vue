<template>
  <div>
    <div class="text-center">
      <h2 class="mt-6 text-3xl font-bold text-text-heading">Welcome back</h2>
      <p class="mt-2 text-sm text-text-primary">Sign in to your account</p>
    </div>

    <div class="mt-8">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Error alert -->
          <div
            v-if="authStore.error"
            class="bg-red-50 border-l-4 border-red-400 p-4"
          >
            <div class="flex">
              <div class="flex-shrink-0">
                <i class="pi pi-exclamation-triangle text-red-400"></i>
              </div>
              <div class="ml-3">
                <p class="text-sm text-red-700">
                  {{ authStore.error }}
                </p>
              </div>
            </div>
          </div>

          <!-- Username/Email field -->
          <div>
            <label for="username" class="form-label">Username or Email</label>
            <div class="mt-1">
              <InputText
                id="username"
                v-model="username"
                type="text"
                autocomplete="username"
                required
                class="form-input"
                :class="{ 'p-invalid': v$.username.$error }"
              />
              <small v-if="v$.username.$error" class="p-error">{{
                v$.username.$errors[0].$message
              }}</small>
            </div>
          </div>

          <!-- Password field -->
          <div>
            <label for="password" class="form-label"> Password </label>
            <div class="mt-1">
              <Password
                id="password"
                v-model="password"
                :feedback="false"
                toggleMask
                required
                class="w-full"
                inputClass="form-input"
                :class="{ 'p-invalid': v$.password.$error }"
              />
              <small v-if="v$.password.$error" class="p-error">{{
                v$.password.$errors[0].$message
              }}</small>
            </div>
          </div>

          <!-- Remember me and forgot password -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <Checkbox
                id="remember-me"
                v-model="rememberMe"
                :binary="true"
                class="mr-2"
              />
              <label for="remember-me" class="text-sm text-text-primary">
                Remember me
              </label>
            </div>

            <div class="text-sm">
              <a
                href="#"
                class="font-medium text-primary hover:text-primary-dark"
              >
                Forgot your password?
              </a>
            </div>
          </div>

          <!-- Submit button -->
          <div>
            <Button
              type="submit"
              class="w-full flex justify-center"
              label="Sign in"
              :loading="authStore.loading"
              :disabled="authStore.loading"
            />
          </div>
        </form>

        <!-- Social login buttons -->
        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-text-primary">
                Or continue with
              </span>
            </div>
          </div>

          <div class="mt-6">
            <div>
              <Button
                type="button"
                class="w-full flex justify-center items-center bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                label="Sign in with Google"
                icon="pi pi-google"
                severity="secondary"
                text
              />
            </div>
          </div>
        </div>

        <!-- Sign up links -->
        <div class="mt-6 text-center text-sm">
          <p class="text-text-primary">Don't have an account?</p>
          <div class="mt-2 flex justify-center space-x-4">
            <router-link
              to="/auth/register/candidate"
              class="font-medium text-primary hover:text-primary-dark"
            >
              Sign up as Candidate
            </router-link>
            <router-link
              to="/auth/register/recruiter"
              class="font-medium text-primary hover:text-primary-dark"
            >
              Sign up as Recruiter
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import { useToast } from 'primevue/usetoast';
import { useVuelidate } from '@vuelidate/core';
import { required, minLength } from '@vuelidate/validators';
import Password from 'primevue/password';
import Checkbox from 'primevue/checkbox';

// Form data
const username = ref('');
const password = ref('');
const rememberMe = ref(false);
const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

// Form validation rules
const rules = {
  username: { required, minLength: minLength(3) },
  password: { required, minLength: minLength(6) },
};

const v$ = useVuelidate(rules, { username, password });

// Login handler
const handleLogin = async () => {
  // Validate form
  const isFormValid = await v$.value.$validate();
  if (!isFormValid) return;

  try {
    await authStore.login({
      username: username.value,
      password: password.value,
    });

    // Success message
    toast.add({
      severity: 'success',
      summary: 'Login Successful',
      detail: 'Welcome back!',
      life: 3000,
    });

    // Router redirection is handled in the login action in the store
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Login Failed',
      detail: error,
      life: 5000,
    });
  }
};
</script>
