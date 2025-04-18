<template>
  <div class="admin-layout min-h-screen bg-gray-50 flex flex-col">
    <!-- Top navbar -->
    <header class="bg-white shadow-sm z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo only -->
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <router-link to="/admin/dashboard" class="flex items-center">
                <div class="text-2xl font-extrabold tracking-tight">
                  <span class="text-primary-700">Crew</span
                  ><span class="text-gray-800">Connect</span>
                </div>
              </router-link>
            </div>
          </div>

          <!-- User dropdown -->
          <div class="flex items-center gap-4">
            <span class="text-sm text-gray-700">Welcome, Admin</span>
            <Menu ref="menu" :model="menuItems" :popup="true">
              <template #button>
                <Avatar
                  icon="pi pi-user"
                  class="cursor-pointer"
                  size="normal"
                  shape="circle"
                  @click="(event) => menu.toggle(event)"
                />
              </template>
            </Menu>
          </div>
        </div>
      </div>
    </header>

    <!-- Page content -->
    <main class="flex-grow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <router-view />
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-white py-4 border-t">
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
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import Menu from 'primevue/menu';
import Avatar from 'primevue/avatar';

const router = useRouter();
const authStore = useAuthStore();
const menu = ref(null);

const menuItems = [
  {
    label: 'Logout',
    icon: 'pi pi-power-off',
    command: async () => {
      await authStore.logout();
      router.push('/admin/login');
    },
  },
];

onMounted(() => {
  // Check if user is authenticated and is an admin
  if (!authStore.authenticated || !authStore.isAdmin) {
    console.log('Unauthorized access to admin area, redirecting to login');
    router.push('/admin/login');
  }
});
</script>
