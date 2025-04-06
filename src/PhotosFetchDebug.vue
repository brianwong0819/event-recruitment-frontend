<template>
  <div class="p-5">
    <h1 class="text-2xl mb-4">Photos Fetch Debug</h1>

    <div class="space-y-4">
      <button
        @click="fetchPhotos"
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Fetch Photos
      </button>

      <div v-if="loading" class="text-gray-600">Loading...</div>

      <div v-if="error" class="p-4 bg-red-100 text-red-700 rounded">
        {{ error }}
      </div>

      <div v-if="photos.length > 0" class="border p-4 rounded">
        <h2 class="font-bold mb-2">Photos ({{ photos.length }})</h2>
        <pre class="bg-gray-100 p-4 rounded overflow-auto max-h-96">{{
          JSON.stringify(photos, null, 2)
        }}</pre>
      </div>

      <div v-if="apiResponse" class="border p-4 rounded">
        <h2 class="font-bold mb-2">API Response</h2>
        <pre class="bg-gray-100 p-4 rounded overflow-auto max-h-96">{{
          JSON.stringify(apiResponse, null, 2)
        }}</pre>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { apiClient } from '@/services/api.service';
import candidateService from '@/services/candidate.service';

export default {
  name: 'PhotosFetchDebug',
  setup() {
    const photos = ref([]);
    const loading = ref(false);
    const error = ref(null);
    const apiResponse = ref(null);

    const fetchPhotos = async () => {
      loading.value = true;
      error.value = null;
      apiResponse.value = null;

      try {
        console.log('Fetching photos via candidateService...');
        const response = await candidateService.getCompcardPhotos();
        console.log('Response received:', response);

        apiResponse.value = response;

        if (response.data && response.data.data) {
          // Handle array of photos
          photos.value = Array.isArray(response.data.data)
            ? response.data.data
            : [response.data.data];

          console.log('Processed photos:', photos.value);
        } else {
          photos.value = [];
          console.log('No photos data in response');
        }
      } catch (err) {
        console.error('Error fetching photos:', err);
        error.value = err.message || 'Error fetching photos';
      } finally {
        loading.value = false;
      }
    };

    return {
      photos,
      loading,
      error,
      apiResponse,
      fetchPhotos,
    };
  },
};
</script>
