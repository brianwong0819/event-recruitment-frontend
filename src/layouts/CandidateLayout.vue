<template>
  <div class="min-h-screen flex flex-col bg-gray-100">
    <!-- Toast for notifications -->
    <Toast />

    <!-- Confirmation dialog -->
    <ConfirmDialog />

    <!-- Header -->
    <header class="bg-white shadow">
      <div class="flex justify-between items-center px-4 py-3">
        <!-- Logo -->
        <router-link to="/" class="flex items-center">
          <img src="@/assets/logo.png" alt="CrewLink Logo" class="h-8" />
        </router-link>

        <!-- Navigation -->
        <nav class="hidden md:flex space-x-6">
          <router-link
            to="/candidate/dashboard"
            class="text-gray-700 hover:text-primary-600 font-medium"
          >
            Dashboard
          </router-link>
          <router-link
            to="/candidate/jobs"
            class="text-gray-700 hover:text-primary-600 font-medium"
          >
            Find Jobs
          </router-link>
          <router-link
            to="/candidate/applications"
            class="text-gray-700 hover:text-primary-600 font-medium"
          >
            Applications
          </router-link>
          <router-link
            to="/candidate/profile"
            class="text-gray-700 hover:text-primary-600 font-medium"
          >
            Profile
          </router-link>
        </nav>

        <!-- User menu -->
        <div class="relative">
          <Button
            icon="pi pi-user"
            class="p-button-text p-button-rounded"
            aria-haspopup="true"
            aria-controls="user-menu"
            @click="toggleUserMenu"
          />

          <Menu
            id="user-menu"
            ref="menu"
            :model="userMenuItems"
            :popup="true"
          />
        </div>

        <!-- Mobile menu button -->
        <Button
          icon="pi pi-bars"
          class="p-button-text p-button-rounded md:hidden"
          @click="toggleMobileMenu"
        />
      </div>

      <!-- Mobile navigation -->
      <div v-if="mobileMenuOpen" class="md:hidden px-2 pt-2 pb-3 space-y-1">
        <router-link
          to="/candidate/dashboard"
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
          @click="mobileMenuOpen = false"
        >
          Dashboard
        </router-link>
        <router-link
          to="/candidate/jobs"
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
          @click="mobileMenuOpen = false"
        >
          Find Jobs
        </router-link>
        <router-link
          to="/candidate/applications"
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
          @click="mobileMenuOpen = false"
        >
          Applications
        </router-link>
        <router-link
          to="/candidate/profile"
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
          @click="mobileMenuOpen = false"
        >
          Profile
        </router-link>
      </div>
    </header>

    <!-- Main content -->
    <main class="flex-grow">
      <div class="container mx-auto">
        <router-view></router-view>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t py-4">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="mb-4 md:mb-0">
            <p class="text-sm text-gray-500">
              &copy; {{ currentYear }} CrewLink. All rights reserved.
            </p>
          </div>
          <div class="flex space-x-4">
            <a href="#" class="text-sm text-gray-500 hover:text-primary-600">
              Privacy Policy
            </a>
            <a href="#" class="text-sm text-gray-500 hover:text-primary-600">
              Terms of Service
            </a>
            <a href="#" class="text-sm text-gray-500 hover:text-primary-600">
              Help Center
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import ConfirmDialog from 'primevue/confirmdialog';
import Toast from 'primevue/toast';

const router = useRouter();
const authStore = useAuthStore();
const menu = ref(null);
const mobileMenuOpen = ref(false);
const currentYear = new Date().getFullYear();
const confirm = useConfirm();
const toast = useToast();

// User menu items
const userMenuItems = [
  {
    label: 'Profile',
    icon: 'pi pi-user',
    command: () => router.push('/candidate/profile'),
  },
  {
    label: 'Settings',
    icon: 'pi pi-cog',
    command: () => router.push('/candidate/settings'),
  },
  {
    separator: true,
  },
  {
    label: 'Logout',
    icon: 'pi pi-sign-out',
    command: () => handleLogout(),
  },
];

// Toggle user menu
const toggleUserMenu = (event) => {
  menu.value.toggle(event);
};

// Toggle mobile menu
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

// Handle logout
const handleLogout = () => {
  // Use PrimeVue's confirm dialog
  confirm.require({
    message:
      'Are you sure you want to log out? All unsaved changes will be lost.',
    header: 'Confirm Logout',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        // Show a loading toast
        toast.add({
          severity: 'info',
          summary: 'Logging out',
          detail: 'Please wait while we log you out...',
          life: 3000,
        });

        // Call logout from the auth store
        await authStore.logout();

        // Show success toast
        toast.add({
          severity: 'success',
          summary: 'Logged out',
          detail: 'You have been successfully logged out.',
          life: 3000,
        });

        // Router navigation is handled in the auth store logout method
      } catch (error) {
        console.error('Error during logout:', error);

        // Show error toast
        toast.add({
          severity: 'error',
          summary: 'Logout Error',
          detail: 'There was an error logging you out. Please try again.',
          life: 5000,
        });
      }
    },
  });
};

// Close mobile menu on route change
onMounted(() => {
  router.afterEach(() => {
    mobileMenuOpen.value = false;
  });
});
</script>
