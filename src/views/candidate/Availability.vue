<template>
  <div class="py-4 px-4 md:py-8 md:px-6 bg-gray-50 min-h-screen">
    <div class="max-w-5xl mx-auto">
      <h1
        class="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-6 flex items-center"
      >
        <i class="pi pi-calendar text-primary-500 mr-3"></i>
        Manage Your Availability
      </h1>

      <p class="text-gray-600 mb-6 max-w-3xl">
        Set your work availability to help recruiters find the perfect events
        for you. You can choose to be available anytime, on specific days of the
        week, or select custom dates.
      </p>

      <!-- Availability Component -->
      <AvailabilityComponent />
    </div>
  </div>
</template>

<script setup>
import AvailabilityComponent from '@/components/candidate/Availability.vue';
</script>
