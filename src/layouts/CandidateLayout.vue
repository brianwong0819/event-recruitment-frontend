<template>
    <div class="min-h-screen flex flex-col bg-gray-100">
      <!-- Header -->
      <header class="bg-white shadow">
        <div class="flex justify-between items-center px-4 py-3">
          <!-- Logo -->
          <router-link to="/" class="flex items-center">
            <img src="@/assets/logo.png" alt="CrewLink Logo" class="h-8" />
          </router-link>
          
          <!-- Navigation -->
          <nav class="hidden md:flex space-x-6">
            <router-link to="/candidate/dashboard" class="text-gray-700 hover:text-primary-600 font-medium">
              Dashboard
            </router-link>
            <router-link to="/candidate/jobs" class="text-gray-700 hover:text-primary-600 font-medium">
              Find Jobs
            </router-link>
            <router-link to="/candidate/applications" class="text-gray-700 hover:text-primary-600 font-medium">
              Applications
            </router-link>
            <router-link to="/candidate/profile" class="text-gray-700 hover:text-primary-600 font-medium">
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
            
            <Menu id="user-menu" ref="menu" :model="userMenuItems" :popup="true" />
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
  
  const router = useRouter();
  const authStore = useAuthStore();
  const menu = ref(null);
  const mobileMenuOpen = ref(false);
  const currentYear = new Date().getFullYear();
  
  // User menu items
  const userMenuItems = [
    {
      label: 'Profile',
      icon: 'pi pi-user',
      command: () => router.push('/candidate/profile')
    },
    {
      label: 'Settings',
      icon: 'pi pi-cog',
      command: () => router.push('/candidate/settings')
    },
    {
      separator: true
    },
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      command: () => handleLogout()
    }
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
    authStore.logout();
    router.push('/login');
  };
  
  // Close mobile menu on route change
  onMounted(() => {
    router.afterEach(() => {
      mobileMenuOpen.value = false;
    });
  });
  </script>