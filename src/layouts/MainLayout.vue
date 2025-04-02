<template>
    <div class="min-h-screen flex flex-col">
      <!-- Header -->
      <header class="bg-white shadow">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <!-- Logo and nav -->
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <router-link to="/" class="text-primary text-2xl font-heading font-bold">
                  Event Recruitment
                </router-link>
              </div>
              <nav class="hidden md:ml-10 md:flex space-x-8">
                <router-link 
                  to="/" 
                  class="text-text-primary px-3 py-2 rounded-md text-sm font-medium hover:bg-background-alt"
                  :class="{ 'text-primary': $route.path === '/' }">
                  Home
                </router-link>
                <router-link 
                  to="/about" 
                  class="text-text-primary px-3 py-2 rounded-md text-sm font-medium hover:bg-background-alt"
                  :class="{ 'text-primary': $route.path === '/about' }">
                  About
                </router-link>
              </nav>
            </div>
  
            <!-- Auth buttons or user menu -->
            <div class="flex items-center">
              <template v-if="authStore.isAuthenticated">
                <div class="relative ml-3">
                  <div>
                    <button 
                      @click="toggleUserMenu" 
                      class="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                      <span class="sr-only">Open user menu</span>
                      <div class="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">
                        {{ userInitials }}
                      </div>
                    </button>
                  </div>
                  <div 
                    v-if="showUserMenu" 
                    class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                  >
                    <router-link 
                      :to="dashboardRoute" 
                      class="block px-4 py-2 text-sm text-text-primary hover:bg-background-alt"
                    >
                      Dashboard
                    </router-link>
                    <router-link 
                      :to="profileRoute" 
                      class="block px-4 py-2 text-sm text-text-primary hover:bg-background-alt"
                    >
                      Profile
                    </router-link>
                    <button 
                      @click="logout" 
                      class="block w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-background-alt"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              </template>
              <template v-else>
                <router-link 
                  to="/auth/login" 
                  class="text-primary font-medium hover:text-primary-light"
                >
                  Log in
                </router-link>
                <router-link 
                  to="/auth/register/candidate" 
                  class="ml-8 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Sign up
                </router-link>
              </template>
            </div>
          </div>
        </div>
      </header>
  
      <!-- Main content -->
      <main class="flex-grow">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <router-view />
        </div>
      </main>
  
      <!-- Footer -->
      <footer class="bg-background-alt">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div class="md:flex md:items-center md:justify-between">
            <div class="flex justify-center md:justify-start space-x-6">
              <a href="#" class="text-text-primary hover:text-primary">
                <span class="sr-only">Facebook</span>
                <i class="pi pi-facebook"></i>
              </a>
              <a href="#" class="text-text-primary hover:text-primary">
                <span class="sr-only">Instagram</span>
                <i class="pi pi-instagram"></i>
              </a>
              <a href="#" class="text-text-primary hover:text-primary">
                <span class="sr-only">Twitter</span>
                <i class="pi pi-twitter"></i>
              </a>
            </div>
            <p class="mt-8 text-center md:mt-0 md:text-right text-sm text-text-primary">
              &copy; {{ new Date().getFullYear() }} Event Recruitment Platform. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import { useAuthStore } from '../stores/auth'
  import { useProfileStore } from '../stores/profile'
  
  const authStore = useAuthStore()
  const profileStore = useProfileStore()
  const showUserMenu = ref(false)
  
  // User menu toggle
  const toggleUserMenu = () => {
    showUserMenu.value = !showUserMenu.value
  }
  
  // Hide user menu when clicked outside
  window.addEventListener('click', (e) => {
    if (showUserMenu.value && !e.target.closest('.relative')) {
      showUserMenu.value = false
    }
  })
  
  // Get user initials for avatar
  const userInitials = computed(() => {
    if (!authStore.username) return ''
    return authStore.username.charAt(0).toUpperCase()
  })
  
  // Get dashboard route based on user role
  const dashboardRoute = computed(() => {
    return authStore.isCandidate ? '/candidate/dashboard' : '/recruiter/dashboard'
  })
  
  // Get profile route based on user role
  const profileRoute = computed(() => {
    return authStore.isCandidate ? '/candidate/profile' : '/recruiter/profile'
  })
  
  // Logout handler
  const logout = () => {
    profileStore.clearProfile()
    authStore.logout()
  }
  </script>