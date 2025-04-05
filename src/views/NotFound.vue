<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6 py-12">
    <div class="text-center">
      <div class="flex justify-center mb-4">
        <router-link to="/">
          <img src="@/assets/logo.png" alt="CrewLink Logo" class="h-16" />
        </router-link>
      </div>
      <h1 class="text-8xl font-bold text-primary-600 mb-4">404</h1>
      <h2 class="text-2xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
      <p class="text-gray-600 mb-8 max-w-lg mx-auto">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <div class="flex flex-col sm:flex-row justify-center gap-4">
        <Button
          label="Back to Home"
          icon="pi pi-home"
          class="p-button-primary"
          @click="$router.push('/')"
        />
        <Button
          label="Contact Support"
          icon="pi pi-envelope"
          class="p-button-outlined"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
// 404 Page component
</script>