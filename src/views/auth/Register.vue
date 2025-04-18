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
    <main class="flex-grow flex items-center justify-center px-4 pb-8">
      <div class="w-full max-w-4xl">
        <!-- Navigation links above the card -->
        <div class="flex justify-start items-center mb-3 px-2">
          <router-link
            to="/"
            class="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors duration-200 flex items-center group"
          >
            <i
              class="pi pi-arrow-left mr-2 text-xs group-hover:-translate-x-1 transition-transform duration-200"
            ></i>
            Back to home
          </router-link>
        </div>

        <div
          class="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-gray-100 transform transition-all duration-300 hover:shadow-2xl"
        >
          <!-- Decorative top bar (only visible on mobile) -->
          <div
            class="h-2 md:hidden bg-gradient-to-r from-primary-600 via-primary-500 to-primary-400"
          ></div>

          <!-- Left side - illustration and branding -->
          <div
            class="hidden md:block md:w-1/2 bg-gradient-to-br from-primary-600 to-primary-800 p-8 text-white relative overflow-hidden"
          >
            <!-- Decorative elements -->
            <div
              class="absolute top-0 right-0 w-64 h-64 bg-primary-500 rounded-full opacity-20 -mr-32 -mt-32"
            ></div>
            <div
              class="absolute bottom-0 left-0 w-64 h-64 bg-primary-500 rounded-full opacity-20 -ml-32 -mb-32"
            ></div>

            <div class="relative z-10">
              <div class="mb-12">
                <h2
                  class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100"
                >
                  AI-Driven Event Staffing
                </h2>
                <p class="text-primary-100 mt-1 font-medium">
                  Match. Recruit. Succeed.
                </p>
              </div>

              <div class="h-full flex flex-col justify-center">
                <h1 class="text-3xl font-bold mb-6 leading-tight">
                  Intelligent Recruitment for Event Companies
                </h1>
                <p class="text-primary-100 mb-10 text-lg">
                  The smarter way to connect event staff with the right
                  opportunities.
                </p>

                <div class="space-y-6 mt-4">
                  <div class="flex items-center group">
                    <span
                      class="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-white bg-opacity-20 text-white mr-4 group-hover:bg-white group-hover:text-primary-600 transition-all duration-300"
                    >
                      <i class="pi pi-bolt text-lg"></i>
                    </span>
                    <span class="text-lg">AI-powered candidate matching</span>
                  </div>
                  <div class="flex items-center group">
                    <span
                      class="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-white bg-opacity-20 text-white mr-4 group-hover:bg-white group-hover:text-primary-600 transition-all duration-300"
                    >
                      <i class="pi pi-map-marker text-lg"></i>
                    </span>
                    <span class="text-lg"
                      >Geolocation-based job suggestions</span
                    >
                  </div>
                  <div class="flex items-center group">
                    <span
                      class="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-white bg-opacity-20 text-white mr-4 group-hover:bg-white group-hover:text-primary-600 transition-all duration-300"
                    >
                      <i class="pi pi-calendar text-lg"></i>
                    </span>
                    <span class="text-lg">Smart scheduling & automation</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right side - registration form -->
          <div class="w-full md:w-1/2 p-8">
            <!-- Mobile logo -->
            <div class="md:hidden text-center mb-6">
              <h2 class="text-2xl font-extrabold tracking-tight">
                <span class="text-primary-700">Crew</span
                ><span class="text-gray-800">Connect</span>
              </h2>
              <p class="text-gray-500 text-sm mt-1">Match. Recruit. Succeed.</p>
            </div>

            <!-- Title -->
            <div class="text-center mb-8">
              <h1 class="text-3xl font-bold text-gray-900 mb-2">
                Create your account
              </h1>
              <p class="text-gray-600 text-lg">
                Join our intelligent event staffing platform
              </p>
            </div>

            <!-- User type toggle -->
            <RegistrationToggle v-model="userType" class="mb-8" />

            <!-- Registration info box -->
            <div
              class="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div v-if="userType === 'candidate'">
                <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
                  <i class="pi pi-user text-primary-600"></i>
                  <span>Candidate Benefits</span>
                </h2>

                <ul class="space-y-4">
                  <li class="flex items-start group">
                    <span
                      class="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-primary-100 text-primary-600 mr-3 mt-0.5 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300"
                    >
                      <i class="pi pi-check text-xs"></i>
                    </span>
                    <span
                      class="text-gray-700 text-base group-hover:text-primary-700 transition-colors duration-300"
                      >Get matched with part-time and temporary event jobs</span
                    >
                  </li>
                  <li class="flex items-start group">
                    <span
                      class="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-primary-100 text-primary-600 mr-3 mt-0.5 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300"
                    >
                      <i class="pi pi-check text-xs"></i>
                    </span>
                    <span
                      class="text-gray-700 text-base group-hover:text-primary-700 transition-colors duration-300"
                      >Receive job alerts based on your location and
                      availability</span
                    >
                  </li>
                  <li class="flex items-start group">
                    <span
                      class="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-primary-100 text-primary-600 mr-3 mt-0.5 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300"
                    >
                      <i class="pi pi-check text-xs"></i>
                    </span>
                    <span
                      class="text-gray-700 text-base group-hover:text-primary-700 transition-colors duration-300"
                      >Access training materials and improve your skills</span
                    >
                  </li>
                </ul>
              </div>

              <div v-else>
                <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
                  <i class="pi pi-briefcase text-primary-600"></i>
                  <span>Recruiter Benefits</span>
                </h2>

                <ul class="space-y-4">
                  <li class="flex items-start group">
                    <span
                      class="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-primary-100 text-primary-600 mr-3 mt-0.5 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300"
                    >
                      <i class="pi pi-check text-xs"></i>
                    </span>
                    <span
                      class="text-gray-700 text-base group-hover:text-primary-700 transition-colors duration-300"
                      >Automate job postings with AI-powered templates</span
                    >
                  </li>
                  <li class="flex items-start group">
                    <span
                      class="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-primary-100 text-primary-600 mr-3 mt-0.5 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300"
                    >
                      <i class="pi pi-check text-xs"></i>
                    </span>
                    <span
                      class="text-gray-700 text-base group-hover:text-primary-700 transition-colors duration-300"
                      >Find and score candidates based on experience and
                      location</span
                    >
                  </li>
                  <li class="flex items-start group">
                    <span
                      class="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-primary-100 text-primary-600 mr-3 mt-0.5 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300"
                    >
                      <i class="pi pi-check text-xs"></i>
                    </span>
                    <span
                      class="text-gray-700 text-base group-hover:text-primary-700 transition-colors duration-300"
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
              class="w-full p-3 p-button-primary rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-base font-medium hover:opacity-95 transform hover:-translate-y-1"
              @click="$router.push('/register/candidate')"
            />

            <Button
              v-else
              label="Register as Recruiter"
              icon="pi pi-briefcase"
              class="w-full p-3 p-button-primary rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-base font-medium hover:opacity-95 transform hover:-translate-y-1"
              @click="$router.push('/register/recruiter')"
            />

            <!-- Login link -->
            <div class="text-center mt-8">
              <p class="text-base text-gray-600">
                Already have an account?
                <router-link
                  :to="userType === 'candidate' ? '/login' : '/recruiter-login'"
                  class="font-medium text-primary-600 hover:text-primary-800 transition-colors duration-200 ml-1 inline-flex items-center group"
                >
                  Sign in
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
  height: 48px;
}
</style>
