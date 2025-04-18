<template>
  <div class="min-h-screen flex flex-col bg-gray-100">
    <!-- Toast for notifications -->
    <Toast />

    <!-- Confirmation dialog -->
    <ConfirmDialog />

    <!-- Header -->
    <header class="bg-white shadow-sm sticky top-0 z-50">
      <div
        class="container mx-auto flex justify-between items-center px-4 py-3"
      >
        <!-- Logo -->
        <router-link to="/recruiter/jobs" class="flex items-center">
          <div class="text-2xl font-extrabold tracking-tight">
            <span class="text-primary-700">Crew</span
            ><span class="text-gray-800">Connect</span>
          </div>
        </router-link>

        <!-- Navigation -->
        <nav class="hidden md:flex space-x-8">
          <router-link
            to="/recruiter/jobs"
            class="nav-link relative py-2 transition-colors duration-200 font-medium"
            :class="{
              'active-nav-link': $route.path.includes('/recruiter/jobs'),
            }"
          >
            Manage Jobs
          </router-link>
          <router-link
            to="/recruiter/talent-pool"
            class="nav-link relative py-2 transition-colors duration-200 font-medium"
            :class="{
              'active-nav-link': $route.path.includes('/recruiter/talent-pool'),
            }"
          >
            Talent Pool
          </router-link>
          <router-link
            to="/recruiter/profile"
            class="nav-link relative py-2 transition-colors duration-200 font-medium"
            :class="{
              'active-nav-link': $route.path.includes('/recruiter/profile'),
            }"
          >
            Company Profile
          </router-link>
        </nav>

        <!-- User menu -->
        <div class="relative">
          <Button
            icon="pi pi-user"
            class="p-button-text p-button-rounded hover:bg-gray-100"
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
          class="p-button-text p-button-rounded md:hidden hover:bg-gray-100"
          @click="toggleMobileMenu"
        />
      </div>

      <!-- Mobile navigation -->
      <div
        v-if="mobileMenuOpen"
        class="md:hidden px-2 pt-2 pb-3 space-y-1 border-t border-gray-200"
      >
        <router-link
          to="/recruiter/jobs"
          class="block px-4 py-2 rounded-md text-base font-medium transition-colors duration-200"
          :class="
            $route.path.includes('/recruiter/jobs')
              ? 'text-primary-600 bg-primary-50'
              : 'text-gray-700 hover:bg-gray-50'
          "
          @click="mobileMenuOpen = false"
        >
          Manage Jobs
        </router-link>
        <router-link
          to="/recruiter/talent-pool"
          class="block px-4 py-2 rounded-md text-base font-medium transition-colors duration-200"
          :class="
            $route.path.includes('/recruiter/talent-pool')
              ? 'text-primary-600 bg-primary-50'
              : 'text-gray-700 hover:bg-gray-50'
          "
          @click="mobileMenuOpen = false"
        >
          Talent Pool
        </router-link>
        <router-link
          to="/recruiter/profile"
          class="block px-4 py-2 rounded-md text-base font-medium transition-colors duration-200"
          :class="
            $route.path.includes('/recruiter/profile')
              ? 'text-primary-600 bg-primary-50'
              : 'text-gray-700 hover:bg-gray-50'
          "
          @click="mobileMenuOpen = false"
        >
          Company Profile
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
    <footer class="mt-auto py-4 bg-white border-t border-gray-100">
      <div class="container mx-auto px-4">
        <p class="text-xs text-gray-500 text-center">
          &copy; {{ new Date().getFullYear() }} CrewConnect. All rights
          reserved.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import Menu from 'primevue/menu';
import Button from 'primevue/button';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import ConfirmDialog from 'primevue/confirmdialog';
import Toast from 'primevue/toast';

const router = useRouter();
const authStore = useAuthStore();
const menu = ref();
const mobileMenuOpen = ref(false);
const confirm = useConfirm();
const toast = useToast();

// Menu items for user dropdown
const userMenuItems = [
  {
    label: 'My Account',
    icon: 'pi pi-user',
    command: () => router.push('/recruiter/profile'),
  },
  {
    separator: true,
  },
  {
    label: 'Sign Out',
    icon: 'pi pi-power-off',
    command: () => handleLogout(),
  },
];

// Handle logout with confirmation
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

// Toggle user dropdown menu
const toggleUserMenu = (event) => {
  menu.value.toggle(event);
};

// Toggle mobile menu
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};
</script>

<style scoped>
.nav-link {
  color: #4b5563;
  position: relative;
}

.nav-link:hover {
  color: #1f2937;
}

.active-nav-link {
  color: #2563eb;
  font-weight: 600;
}

.active-nav-link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #2563eb;
  border-radius: 2px;
}
</style>
