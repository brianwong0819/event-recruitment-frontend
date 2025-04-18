<template>
  <div
    class="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
  >
    <!-- Header with Logo -->
    <header class="pt-4 pb-2">
      <div class="container px-4">
        <router-link to="/" class="inline-block">
          <img src="@/assets/logo.png" alt="EventRecruit Logo" class="h-10" />
        </router-link>
      </div>
    </header>

    <!-- Main content -->
    <main class="flex-grow flex items-center justify-center px-4 pb-6">
      <div class="w-full max-w-4xl">
        <!-- Navigation links above the card -->
        <div class="flex justify-start items-center mb-3 px-2">
          <router-link
            to="/"
            class="text-xs font-medium text-gray-600 hover:text-primary-600 transition-colors duration-200 flex items-center"
          >
            <i class="pi pi-arrow-left mr-1 text-xs"></i> Back to home
          </router-link>
        </div>

        <div
          class="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row border border-gray-100"
        >
          <!-- Decorative top bar (only visible on mobile) -->
          <div
            class="h-1 md:hidden bg-gradient-to-r from-primary-500 to-primary-300"
          ></div>

          <!-- Left side - illustration and branding -->
          <div
            class="hidden md:block md:w-1/2 bg-primary-600 p-6 text-white relative"
          >
            <div class="absolute top-0 left-0 p-6">
              <h2 class="text-2xl font-bold">AI-Driven Event Staffing</h2>
              <p class="text-primary-100 mt-1">Match. Recruit. Succeed.</p>
            </div>

            <div class="h-full flex flex-col justify-center mt-6">
              <h1 class="text-3xl font-bold mb-4">
                Intelligent Recruitment for Event Companies
              </h1>
              <p class="text-primary-100 mb-8 text-base">
                The smarter way to connect event staff with the right
                opportunities.
              </p>

              <div class="space-y-4 mt-3">
                <div class="flex items-center">
                  <span
                    class="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-primary-500 text-white mr-3"
                  >
                    <i class="pi pi-bolt text-base"></i>
                  </span>
                  <span class="text-base">AI-powered candidate matching</span>
                </div>
                <div class="flex items-center">
                  <span
                    class="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-primary-500 text-white mr-3"
                  >
                    <i class="pi pi-map-marker text-base"></i>
                  </span>
                  <span class="text-base"
                    >Geolocation-based job suggestions</span
                  >
                </div>
                <div class="flex items-center">
                  <span
                    class="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-primary-500 text-white mr-3"
                  >
                    <i class="pi pi-calendar text-base"></i>
                  </span>
                  <span class="text-base">Smart scheduling & automation</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Right side - registration form -->
          <div class="w-full md:w-1/2 p-6">
            <!-- Mobile logo -->
            <div class="md:hidden text-center mb-4">
              <h2 class="text-2xl font-bold text-primary-600">
                Event Recruitment
              </h2>
              <p class="text-gray-500 text-xs">Match. Recruit. Succeed.</p>
            </div>

            <!-- Title -->
            <div class="text-center mb-6">
              <h1 class="text-2xl font-bold text-gray-900">
                Create your account
              </h1>
              <p class="text-gray-500 text-base mt-1">
                Join our intelligent event staffing platform
              </p>
            </div>

            <!-- User type toggle -->
            <RegistrationToggle v-model="userType" class="mb-6" />

            <!-- Registration info box -->
            <div class="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-100">
              <div v-if="userType === 'candidate'">
                <h2 class="text-lg font-semibold mb-3 flex items-center gap-2">
                  <i class="pi pi-user text-primary-500"></i>
                  <span>Candidate Benefits</span>
                </h2>

                <ul class="space-y-3">
                  <li class="flex items-start">
                    <span
                      class="flex-shrink-0 flex items-center justify-center h-5 w-5 rounded-full bg-primary-100 text-primary-600 mr-2 mt-0.5"
                    >
                      <i class="pi pi-check text-xs"></i>
                    </span>
                    <span class="text-gray-700 text-sm"
                      >Get matched with part-time and temporary event jobs</span
                    >
                  </li>
                  <li class="flex items-start">
                    <span
                      class="flex-shrink-0 flex items-center justify-center h-5 w-5 rounded-full bg-primary-100 text-primary-600 mr-2 mt-0.5"
                    >
                      <i class="pi pi-check text-xs"></i>
                    </span>
                    <span class="text-gray-700 text-sm"
                      >Receive job alerts based on your location and
                      availability</span
                    >
                  </li>
                  <li class="flex items-start">
                    <span
                      class="flex-shrink-0 flex items-center justify-center h-5 w-5 rounded-full bg-primary-100 text-primary-600 mr-2 mt-0.5"
                    >
                      <i class="pi pi-check text-xs"></i>
                    </span>
                    <span class="text-gray-700 text-sm"
                      >Access training materials and improve your skills</span
                    >
                  </li>
                </ul>
              </div>

              <div v-else>
                <h2 class="text-lg font-semibold mb-3 flex items-center gap-2">
                  <i class="pi pi-briefcase text-primary-500"></i>
                  <span>Recruiter Benefits</span>
                </h2>

                <ul class="space-y-3">
                  <li class="flex items-start">
                    <span
                      class="flex-shrink-0 flex items-center justify-center h-5 w-5 rounded-full bg-primary-100 text-primary-600 mr-2 mt-0.5"
                    >
                      <i class="pi pi-check text-xs"></i>
                    </span>
                    <span class="text-gray-700 text-sm"
                      >Automate job postings with AI-powered templates</span
                    >
                  </li>
                  <li class="flex items-start">
                    <span
                      class="flex-shrink-0 flex items-center justify-center h-5 w-5 rounded-full bg-primary-100 text-primary-600 mr-2 mt-0.5"
                    >
                      <i class="pi pi-check text-xs"></i>
                    </span>
                    <span class="text-gray-700 text-sm"
                      >Find and score candidates based on experience and
                      location</span
                    >
                  </li>
                  <li class="flex items-start">
                    <span
                      class="flex-shrink-0 flex items-center justify-center h-5 w-5 rounded-full bg-primary-100 text-primary-600 mr-2 mt-0.5"
                    >
                      <i class="pi pi-check text-xs"></i>
                    </span>
                    <span class="text-gray-700 text-sm"
                      >Access backup and replacement staff automatically</span
                    >
                  </li>
                </ul>
              </div>
            </div>

            <!-- Registration button -->
            <Button
              v-if="userType === 'candidate'"
              label="Register as Candidate"
              icon="pi pi-user-plus"
              class="w-full p-2 p-button-primary shadow-md hover:shadow-lg transition-shadow duration-200 text-sm"
              @click="$router.push('/register/candidate')"
            />

            <Button
              v-else
              label="Register as Recruiter"
              icon="pi pi-briefcase"
              class="w-full p-2 p-button-primary shadow-md hover:shadow-lg transition-shadow duration-200 text-sm"
              @click="$router.push('/register/recruiter')"
            />

            <!-- Login link -->
            <div class="text-center mt-6">
              <p class="text-sm text-gray-600">
                Already have an account?
                <router-link
                  :to="userType === 'candidate' ? '/login' : '/recruiter-login'"
                  class="font-medium text-primary-600 hover:text-primary-800 transition-colors duration-200 ml-1"
                >
                  Sign in
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
        &copy; {{ currentYear }} Event Recruitment Platform. All rights
        reserved.
      </p>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import RegistrationToggle from '@/components/auth/RegistrationToggle.vue';

const route = useRoute();

// Default to candidate registration
const userType = ref('candidate');

// Get current year for footer
const currentYear = new Date().getFullYear();

// Check for type parameter on mount
onMounted(() => {
  if (route.query.type === 'recruiter') {
    userType.value = 'recruiter';
  }
});
</script>

<style scoped>
/* Custom styles for the registration page */
:deep(.p-button) {
  height: 40px;
}
</style>
