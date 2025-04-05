<template>
  <div
    class="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
  >
    <!-- Header with Logo -->
    <header class="pt-8 pb-4">
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
    <main class="flex-grow flex items-center justify-center px-4 py-10">
      <div class="w-full max-w-xl">
        <div
          class="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
        >
          <!-- Success color bar -->
          <div class="h-2 bg-gradient-to-r from-green-500 to-green-300"></div>

          <div class="p-8 text-center">
            <!-- Success icon -->
            <div class="flex justify-center mb-6">
              <div
                class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center"
              >
                <i class="pi pi-check text-green-500 text-4xl"></i>
              </div>
            </div>

            <!-- Success message -->
            <h1 class="text-3xl font-bold text-gray-800 mb-4">
              Registration Successful!
            </h1>
            <p class="text-lg text-gray-600 mb-8 max-w-md mx-auto">
              Your {{ userType }} account has been created successfully. You can
              now sign in to access your account.
            </p>

            <!-- Confetti animation (optional) -->
            <div class="mb-10 flex justify-center">
              <img
                src="@/assets/success-illustration.svg"
                alt="Success"
                class="h-44"
              />
            </div>

            <!-- Action buttons -->
            <div class="flex flex-col sm:flex-row justify-center gap-4 mb-6">
              <Button
                label="Back to Home"
                icon="pi pi-home"
                class="p-button-outlined p-button-lg"
                @click="goToHome"
              />
              <Button
                label="Sign In Now"
                icon="pi pi-sign-in"
                iconPos="right"
                class="p-button-primary p-button-lg"
                @click="goToLogin"
              />
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="py-6 text-center">
      <p class="text-sm text-gray-500">
        &copy; {{ currentYear }} Event Recruitment Platform. All rights
        reserved.
      </p>
    </footer>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

// Component setup
const router = useRouter();
const currentYear = new Date().getFullYear();

// Compute user type from localStorage
const userType = computed(() => {
  const type = localStorage.getItem('registeredUserType') || 'candidate';
  // Capitalize first letter
  return type.charAt(0).toUpperCase() + type.slice(1);
});

// Navigation functions
const goToHome = () => {
  router.push('/');
};

const goToLogin = () => {
  const type = localStorage.getItem('registeredUserType');
  if (type === 'recruiter') {
    router.push('/recruiter-login');
  } else {
    router.push('/login');
  }
};

// Clean up on component mount
onMounted(() => {
  // Set a timeout to redirect automatically after a period (optional)
  // setTimeout(() => {
  //   goToLogin();
  // }, 10000); // 10 seconds
});
</script>

<style scoped>
/* Optional: Add some custom styling for the success page */
.bg-gradient-to-br {
  animation: gradient-shift 10s ease infinite;
}

@keyframes gradient-shift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
