<template>
    <div class="min-h-screen flex flex-col bg-background-alt">
      <!-- Header with logo -->
      <header class="bg-white shadow">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <div class="flex-shrink-0">
              <router-link to="/" class="text-primary text-2xl font-heading font-bold">
                Event Recruitment
              </router-link>
            </div>
            <div>
              <router-link 
                to="/" 
                class="text-text-primary hover:text-primary text-sm font-medium"
              >
                Back to home
              </router-link>
            </div>
          </div>
        </div>
      </header>
  
      <!-- Main content area -->
      <main class="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full">
          <router-view />
        </div>
      </main>
  
      <!-- Simple footer -->
      <footer class="py-4">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p class="text-center text-sm text-text-primary">
            &copy; {{ new Date().getFullYear() }} Event Recruitment Platform. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  </template>
  
  <script setup>
  // AuthLayout doesn't need much logic - it's primarily for structure
  </script>