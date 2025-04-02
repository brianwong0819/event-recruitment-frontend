<template>
  <Toast />
  <router-view />
</template>

<script setup>
import { onBeforeMount } from 'vue'
import { useAuthStore } from './stores/auth'
import { useProfileStore } from './stores/profile'

const authStore = useAuthStore()
const profileStore = useProfileStore()

// When app loads, fetch profile if user is authenticated
onBeforeMount(async () => {
  if (authStore.isAuthenticated) {
    try {
      await profileStore.fetchProfile()
    } catch (error) {
      console.error('Failed to load profile:', error)
      // If we can't load the profile, user may need to log in again
      if (error.includes('401') || error.includes('unauthorized')) {
        authStore.logout()
      }
    }
  }
})
</script>

<style>
/* Import Tailwind base styles */
@import './assets/css/index.css';

/* Import fonts */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Montserrat:wght@600;700&display=swap');

/* Global styles */
html, body {
  font-family: 'Inter', sans-serif;
  color: #333333;
  scroll-behavior: smooth;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  color: #212121;
}
</style>