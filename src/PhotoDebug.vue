<template>
  <div class="p-6 max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">Photo API Debug Tool</h1>

    <div class="mb-4 space-x-4">
      <button
        @click="fetchWithDirect"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        Fetch with Direct API
      </button>
      <button
        @click="checkToken"
        class="px-4 py-2 bg-green-600 text-white rounded-lg"
      >
        Check Auth Token
      </button>
    </div>

    <div v-if="loading" class="my-4 flex items-center">
      <div
        class="w-6 h-6 border-t-2 border-blue-600 rounded-full animate-spin mr-2"
      ></div>
      <span>Loading...</span>
    </div>

    <div v-if="tokenInfo" class="my-4 p-4 bg-gray-50 border rounded-lg">
      <h2 class="text-lg font-bold mb-2">Token Info</h2>
      <pre class="text-sm">{{ tokenInfo }}</pre>
    </div>

    <div
      v-if="errorMessage"
      class="my-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700"
    >
      <h2 class="text-lg font-bold mb-2">Error</h2>
      <p>{{ errorMessage }}</p>
    </div>

    <div v-if="apiResponse" class="my-4">
      <h2 class="text-lg font-bold mb-2">API Response</h2>
      <pre class="p-4 bg-gray-100 rounded-lg overflow-x-auto text-sm">{{
        JSON.stringify(apiResponse, null, 2)
      }}</pre>
    </div>

    <div v-if="photos.length > 0" class="my-4">
      <h2 class="text-lg font-bold mb-2">Photos ({{ photos.length }})</h2>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div
          v-for="(photo, index) in photos"
          :key="index"
          class="border rounded-lg overflow-hidden shadow-sm"
        >
          <div class="h-48 bg-gray-100">
            <img
              v-if="photo.url"
              :src="photo.url"
              alt="Photo"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <span class="text-gray-500">No URL</span>
            </div>
          </div>
          <div class="p-3 bg-white">
            <p class="text-sm truncate">ID: {{ photo.id }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const loading = ref(false);
const apiResponse = ref(null);
const errorMessage = ref('');
const photos = ref([]);
const tokenInfo = ref('');

const fetchWithDirect = async () => {
  loading.value = true;
  errorMessage.value = '';
  apiResponse.value = null;
  photos.value = [];

  try {
    const token = localStorage.getItem('accessToken') || '';

    if (!token) {
      errorMessage.value = 'No authentication token found';
      return;
    }

    console.log('Fetching photos with direct API call...');
    console.log('Token available:', !!token);

    const response = await fetch(
      'http://localhost:8080/api/candidate/file/comcard',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      }
    );

    console.log('Response status:', response.status);

    if (!response.ok) {
      errorMessage.value = `API request failed with status ${response.status}`;
      return;
    }

    const data = await response.json();
    console.log('API response data:', data);
    apiResponse.value = data;

    if (data && (data.data || data)) {
      const photoData = Array.isArray(data.data || data)
        ? data.data || data
        : [data.data || data];

      photos.value = photoData.map((photo) => {
        if (photo.comcardUrl) {
          const baseUrl = 'http://localhost:8080';
          const url = photo.comcardUrl.startsWith('http')
            ? photo.comcardUrl
            : photo.comcardUrl.startsWith('/')
            ? baseUrl + photo.comcardUrl
            : baseUrl + '/' + photo.comcardUrl;

          return { ...photo, url };
        }
        return photo;
      });
    }
  } catch (error) {
    console.error('Error fetching photos:', error);
    errorMessage.value = `Error: ${error.message}`;
  } finally {
    loading.value = false;
  }
};

const checkToken = () => {
  try {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      tokenInfo.value = 'No token found in localStorage';
      return;
    }

    // Check if token format is valid (typically JWT)
    const isJwt = token.split('.').length === 3;

    if (isJwt) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      tokenInfo.value = `Token found: ${token.substring(
        0,
        20
      )}...\n\nExpires: ${new Date(
        payload.exp * 1000
      ).toLocaleString()}\nIssued: ${new Date(
        payload.iat * 1000
      ).toLocaleString()}\n\nPayload: ${JSON.stringify(payload, null, 2)}`;
    } else {
      tokenInfo.value = `Token found (not JWT format): ${token}`;
    }
  } catch (error) {
    tokenInfo.value = `Error parsing token: ${error.message}`;
  }
};
</script>

<style>
pre {
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
