<template>
  <div class="job-application-view py-6">
    <div class="container mx-auto">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">Job Application</h1>
          <p class="text-gray-600 mt-1">
            Complete the steps to apply for this position
          </p>
        </div>
        <router-link
          :to="{ name: 'FindJobs' }"
          class="text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
        >
          <i class="pi pi-arrow-left"></i>
          <span>Back to Jobs</span>
        </router-link>
      </div>

      <div class="bg-white rounded-lg shadow">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

onMounted(() => {
  const jobId = route.params.jobId;

  // If no job ID is provided, navigate back to job listing
  if (!jobId) {
    router.push({ name: 'FindJobs' });
  }
});
</script>

<style scoped>
.job-application-view {
  min-height: calc(100vh - 64px);
  background-color: #f9fafb;
}
</style>
