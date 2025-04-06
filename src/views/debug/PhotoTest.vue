<template>
  <div class="p-6 max-w-6xl mx-auto">
    <div class="bg-white shadow-lg rounded-xl p-6 mb-6">
      <h1 class="text-2xl font-bold mb-4 text-gray-800">
        Photos API Test Tool
      </h1>
      <p class="text-gray-600 mb-6">
        This tool helps diagnose issues with loading photos from the API
      </p>

      <div class="flex flex-wrap gap-4 mb-8">
        <button
          @click="fetchWithDirectFetch"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          :disabled="loading"
        >
          <span v-if="loading && method === 'direct'">
            <i class="pi pi-spin pi-spinner mr-2"></i>Loading...
          </span>
          <span v-else>Fetch with Direct API</span>
        </button>

        <button
          @click="fetchWithApiClient"
          class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          :disabled="loading"
        >
          <span v-if="loading && method === 'apiClient'">
            <i class="pi pi-spin pi-spinner mr-2"></i>Loading...
          </span>
          <span v-else>Fetch with apiClient</span>
        </button>

        <button
          @click="fetchWithCandidateService"
          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          :disabled="loading"
        >
          <span v-if="loading && method === 'service'">
            <i class="pi pi-spin pi-spinner mr-2"></i>Loading...
          </span>
          <span v-else>Fetch with candidateService</span>
        </button>

        <button
          @click="testDirectImagePath"
          class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          :disabled="loading"
        >
          <span v-if="loading && method === 'direct-image'">
            <i class="pi pi-spin pi-spinner mr-2"></i>Loading...
          </span>
          <span v-else>Test Direct Image Path</span>
        </button>

        <button
          @click="clearResults"
          class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          :disabled="loading"
        >
          Clear Results
        </button>
      </div>

      <!-- Token information -->
      <div class="bg-gray-50 p-4 rounded-lg mb-6">
        <h2 class="font-bold mb-2 flex items-center">
          <i class="pi pi-key mr-2 text-amber-600"></i>
          Authentication Status
        </h2>

        <div v-if="token" class="text-sm">
          <div class="text-green-600 mb-2">✓ Token found in localStorage</div>
          <div class="text-gray-600">
            Token preview: {{ token.substring(0, 15) }}...
            <button
              @click="showFullToken = !showFullToken"
              class="text-blue-600 hover:underline ml-2"
            >
              {{ showFullToken ? 'Hide' : 'Show' }}
            </button>
          </div>
          <pre
            v-if="showFullToken"
            class="mt-2 p-2 bg-gray-100 rounded text-xs overflow-x-auto"
            >{{ token }}</pre
          >
        </div>
        <div v-else class="text-red-600">
          ✗ No authentication token found in localStorage
        </div>
      </div>

      <!-- Add image path explanation -->
      <div
        v-if="method === 'direct-image'"
        class="bg-purple-50 p-4 rounded-lg mb-4 text-sm"
      >
        <h3 class="font-bold mb-2 text-purple-800">
          Testing Direct Image Path
        </h3>
        <p class="text-purple-700 mb-2">
          This tests loading the image directly from the Vite dev server using
          the path:
        </p>
        <code
          class="bg-white p-2 block rounded border border-purple-200 text-purple-800 mb-2"
        >
          http://localhost:5173/src/assets/comcards/99b3205c-0871-4269-8099-64bffcb3c7ba.jpg
        </code>
        <p class="text-purple-700">
          This should match the physical path on your filesystem at:<br />
          <code class="bg-white p-1 rounded text-xs"
            >C:\Users\Acer\OneDrive\Desktop\fyp\Frontend
            Code\event-recruitment-frontend\src\assets\comcards\99b3205c-0871-4269-8099-64bffcb3c7ba.jpg</code
          >
        </p>
      </div>
    </div>

    <!-- Results section -->
    <div
      v-if="error"
      class="bg-red-50 border border-red-200 rounded-xl p-6 mb-6"
    >
      <h2 class="text-xl font-bold mb-2 text-red-800 flex items-center">
        <i class="pi pi-exclamation-circle mr-2"></i>Error
      </h2>
      <p class="text-red-700">{{ error }}</p>

      <div v-if="errorDetails" class="mt-4">
        <h3 class="font-medium mb-2 text-red-800">Details</h3>
        <pre class="bg-white p-3 rounded text-xs overflow-x-auto">{{
          errorDetails
        }}</pre>
      </div>
    </div>

    <div
      v-if="apiResponse"
      class="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6"
    >
      <h2 class="text-xl font-bold mb-2 text-blue-800 flex items-center">
        <i class="pi pi-check-circle mr-2"></i>API Response
      </h2>
      <div class="text-blue-700 mb-4">
        <div><strong>Method:</strong> {{ methodLabel }}</div>
        <div><strong>Status:</strong> {{ responseStatus }}</div>
        <div><strong>Time:</strong> {{ new Date().toLocaleTimeString() }}</div>
      </div>

      <div class="mt-4">
        <button
          @click="showRawResponse = !showRawResponse"
          class="px-3 py-1 bg-blue-600 text-white rounded text-sm mb-2"
        >
          {{ showRawResponse ? 'Hide Raw Response' : 'Show Raw Response' }}
        </button>
        <pre
          v-if="showRawResponse"
          class="bg-white p-3 rounded text-xs overflow-x-auto"
          >{{ JSON.stringify(apiResponse, null, 2) }}</pre
        >
      </div>
    </div>

    <!-- Photos section -->
    <div
      v-if="photos.length > 0"
      class="bg-white shadow-lg rounded-xl p-6 mb-6"
    >
      <h2 class="text-xl font-bold mb-4 text-gray-800 flex items-center">
        <i class="pi pi-images mr-2 text-indigo-600"></i>
        Photos ({{ photos.length }})
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="(photo, index) in photos"
          :key="index"
          class="border rounded-lg overflow-hidden shadow-sm bg-white"
        >
          <div class="relative aspect-square bg-gray-100">
            <img
              v-if="photo.url"
              :src="photo.url"
              :alt="`Photo ${index + 1}`"
              class="absolute inset-0 w-full h-full object-cover"
              @error="handleImageError($event, index)"
            />
            <div
              v-else
              class="absolute inset-0 flex items-center justify-center"
            >
              <i class="pi pi-image text-4xl text-gray-400"></i>
            </div>
          </div>

          <div class="p-4">
            <div class="text-sm font-medium mb-1">ID: {{ photo.id }}</div>
            <div class="text-xs text-gray-500 mb-2 truncate">
              Raw URL: {{ photo.comcardUrl || 'N/A' }}
            </div>
            <div class="text-xs text-gray-500 truncate">
              Display URL: {{ photo.url || 'N/A' }}
            </div>

            <div v-if="photo.errorLoading" class="mt-2 text-xs text-red-600">
              <i class="pi pi-exclamation-triangle mr-1"></i>
              Failed to load image
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-else-if="!loading && apiResponse"
      class="bg-yellow-50 border border-yellow-200 rounded-xl p-6 flex items-center justify-center"
    >
      <div class="text-center">
        <i class="pi pi-image-slash text-4xl text-yellow-600 mb-2"></i>
        <p class="text-yellow-700">No photos found in the response</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { apiClient } from '@/services/api.service';
import candidateService from '@/services/candidate.service';

// State
const photos = ref([]);
const loading = ref(false);
const error = ref(null);
const errorDetails = ref(null);
const apiResponse = ref(null);
const method = ref('');
const responseStatus = ref('');
const token = ref('');
const showFullToken = ref(false);
const showRawResponse = ref(false);

// Computed
const methodLabel = ref('');

// Initialization
onMounted(() => {
  token.value = localStorage.getItem('accessToken') || '';
});

// Methods
const clearResults = () => {
  photos.value = [];
  error.value = null;
  errorDetails.value = null;
  apiResponse.value = null;
  responseStatus.value = '';
  method.value = '';
  methodLabel.value = '';
  showRawResponse.value = false;
};

const fetchWithDirectFetch = async () => {
  clearResults();
  loading.value = true;
  method.value = 'direct';
  methodLabel.value = 'Direct Fetch API';

  try {
    const token = localStorage.getItem('accessToken') || '';

    if (!token) {
      error.value = 'Authentication required. No token found.';
      return;
    }

    console.log('Fetching photos with direct fetch...');
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

    responseStatus.value = `${response.status} ${response.statusText}`;
    console.log('Direct fetch response status:', responseStatus.value);

    if (!response.ok) {
      error.value = `API request failed with status ${response.status}`;
      try {
        const errorText = await response.text();
        errorDetails.value = errorText;
      } catch (err) {
        // Ignore if we can't parse the error
      }
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
          // Try multiple possible URL formats
          const possibleUrls = [];

          const baseUrl = 'http://localhost:8080';

          // 1. Original path from API (might be complete)
          if (photo.comcardUrl.startsWith('http')) {
            possibleUrls.push(photo.comcardUrl);
          }

          // 2. Direct append to base URL
          if (photo.comcardUrl.startsWith('/')) {
            possibleUrls.push(`${baseUrl}${photo.comcardUrl}`);
          } else {
            possibleUrls.push(`${baseUrl}/${photo.comcardUrl}`);
          }

          // 3. Try with /src/ path included
          if (photo.comcardUrl.startsWith('/')) {
            possibleUrls.push(`${baseUrl}/src${photo.comcardUrl}`);
          } else {
            possibleUrls.push(`${baseUrl}/src/${photo.comcardUrl}`);
          }

          // 4. Try with /api/ path included
          if (photo.comcardUrl.startsWith('/')) {
            possibleUrls.push(`${baseUrl}/api${photo.comcardUrl}`);
          } else {
            possibleUrls.push(`${baseUrl}/api/${photo.comcardUrl}`);
          }

          console.log('Possible URLs for photo:', possibleUrls);

          return {
            ...photo,
            url: possibleUrls[0], // Start with the first URL
            possibleUrls: possibleUrls,
            urlIndex: 0,
          };
        } else if (photo.url) {
          return photo;
        } else {
          return { ...photo, url: null };
        }
      });
    } else {
      photos.value = [];
    }
  } catch (err) {
    console.error('Error fetching photos with direct fetch:', err);
    error.value = `Error: ${err.message || 'Unknown error'}`;
    errorDetails.value = err.stack;
  } finally {
    loading.value = false;
  }
};

const fetchWithApiClient = async () => {
  clearResults();
  loading.value = true;
  method.value = 'apiClient';
  methodLabel.value = 'API Client Library';

  try {
    console.log('Fetching photos with apiClient...');
    const response = await apiClient.get('/candidate/file/comcard');

    responseStatus.value = `${response.status}`;
    console.log('apiClient response:', response);
    apiResponse.value = response.data;

    if (response.data && response.data.data) {
      let photoData = Array.isArray(response.data.data)
        ? response.data.data
        : [response.data.data];

      photos.value = photoData.map((photo) => {
        if (photo.comcardUrl) {
          // Try multiple possible URL formats
          const possibleUrls = [];

          const baseUrl = 'http://localhost:8080';

          // 1. Original path from API (might be complete)
          if (photo.comcardUrl.startsWith('http')) {
            possibleUrls.push(photo.comcardUrl);
          }

          // 2. Direct append to base URL
          if (photo.comcardUrl.startsWith('/')) {
            possibleUrls.push(`${baseUrl}${photo.comcardUrl}`);
          } else {
            possibleUrls.push(`${baseUrl}/${photo.comcardUrl}`);
          }

          // 3. Try with /src/ path included
          if (photo.comcardUrl.startsWith('/')) {
            possibleUrls.push(`${baseUrl}/src${photo.comcardUrl}`);
          } else {
            possibleUrls.push(`${baseUrl}/src/${photo.comcardUrl}`);
          }

          // 4. Try with /api/ path included
          if (photo.comcardUrl.startsWith('/')) {
            possibleUrls.push(`${baseUrl}/api${photo.comcardUrl}`);
          } else {
            possibleUrls.push(`${baseUrl}/api/${photo.comcardUrl}`);
          }

          console.log('Possible URLs for photo:', possibleUrls);

          return {
            ...photo,
            url: possibleUrls[0], // Start with the first URL
            possibleUrls: possibleUrls,
            urlIndex: 0,
          };
        } else if (photo.url) {
          return photo;
        } else {
          return { ...photo, url: null };
        }
      });
    } else {
      photos.value = [];
    }
  } catch (err) {
    console.error('Error fetching photos with apiClient:', err);
    error.value = `Error: ${err.message || 'Unknown error'}`;

    if (err.response) {
      responseStatus.value = `${err.response.status}`;
      errorDetails.value = JSON.stringify(err.response.data || {}, null, 2);
    } else if (err.request) {
      errorDetails.value = 'No response received from server';
    }
  } finally {
    loading.value = false;
  }
};

const fetchWithCandidateService = async () => {
  clearResults();
  loading.value = true;
  method.value = 'service';
  methodLabel.value = 'Candidate Service';

  try {
    console.log('Fetching photos with candidateService...');
    const response = await candidateService.getCompcardPhotos();

    responseStatus.value = `${response.status}`;
    console.log('candidateService response:', response);
    apiResponse.value = response.data;

    if (response.data && response.data.data) {
      let photoData = Array.isArray(response.data.data)
        ? response.data.data
        : [response.data.data];

      photos.value = photoData.map((photo) => {
        if (photo.comcardUrl) {
          // Try multiple possible URL formats
          const possibleUrls = [];

          // First try the service's built-in method if available
          if (typeof candidateService.getCompcardFromAssets === 'function') {
            possibleUrls.push(
              candidateService.getCompcardFromAssets(photo.comcardUrl)
            );
          }

          const baseUrl = 'http://localhost:8080';

          // Original path from API (might be complete)
          if (photo.comcardUrl.startsWith('http')) {
            possibleUrls.push(photo.comcardUrl);
          }

          // Direct append to base URL
          if (photo.comcardUrl.startsWith('/')) {
            possibleUrls.push(`${baseUrl}${photo.comcardUrl}`);
          } else {
            possibleUrls.push(`${baseUrl}/${photo.comcardUrl}`);
          }

          // Try with /src/ path included
          if (photo.comcardUrl.startsWith('/')) {
            possibleUrls.push(`${baseUrl}/src${photo.comcardUrl}`);
          } else {
            possibleUrls.push(`${baseUrl}/src/${photo.comcardUrl}`);
          }

          // Try with /api/ path included
          if (photo.comcardUrl.startsWith('/')) {
            possibleUrls.push(`${baseUrl}/api${photo.comcardUrl}`);
          } else {
            possibleUrls.push(`${baseUrl}/api/${photo.comcardUrl}`);
          }

          // Direct path to the frontend source assets via Vite dev server
          const viteDevUrl = 'http://localhost:5173';
          possibleUrls.push(
            `${viteDevUrl}/src/assets/comcards/${photo.comcardUrl
              .split('/')
              .pop()}`
          );

          console.log('Possible URLs for photo:', possibleUrls);

          return {
            ...photo,
            url: possibleUrls[0], // Start with the first URL
            possibleUrls: possibleUrls,
            urlIndex: 0,
          };
        } else if (photo.url) {
          return photo;
        } else {
          return { ...photo, url: null };
        }
      });
    } else {
      photos.value = [];
    }
  } catch (err) {
    console.error('Error fetching photos with candidateService:', err);
    error.value = `Error: ${err.message || 'Unknown error'}`;

    if (err.response) {
      responseStatus.value = `${err.response.status}`;
      errorDetails.value = JSON.stringify(err.response.data || {}, null, 2);
    }
  } finally {
    loading.value = false;
  }
};

const handleImageError = (event, index) => {
  console.error(`Failed to load image at index ${index}`);
  const photo = photos.value[index];

  if (
    photo &&
    photo.possibleUrls &&
    photo.possibleUrls.length > photo.urlIndex + 1
  ) {
    // Try the next URL
    photo.urlIndex++;
    photo.url = photo.possibleUrls[photo.urlIndex];
    console.log(`Trying alternative URL for photo ${index}:`, photo.url);
  } else {
    // If we've tried all URLs, mark as failed
    if (photos.value[index]) {
      photos.value[index].errorLoading = true;
      photos.value[index].url = null; // Clear the URL to show placeholder
    }
  }
};

// Also add a function to explicitly test a direct path to the image file
const testDirectImagePath = async () => {
  clearResults();
  loading.value = true;
  method.value = 'direct-image';
  methodLabel.value = 'Direct Image Path';

  try {
    // Simulate a successful API response for UI
    apiResponse.value = {
      statusCode: 200,
      message: 'Testing direct path to image file',
    };
    responseStatus.value = '200 OK';

    // Create a test photo using the direct path
    const filename = '99b3205c-0871-4269-8099-64bffcb3c7ba.jpg';
    const directUrl = `http://localhost:5173/src/assets/comcards/${filename}`;

    photos.value = [
      {
        id: 'test',
        comcardUrl: `/assets/comcards/${filename}`,
        url: directUrl,
        uploadedAt: new Date().toISOString(),
      },
    ];

    console.log('Testing direct image URL:', directUrl);
  } catch (err) {
    console.error('Error in direct image test:', err);
    error.value = `Error: ${err.message || 'Unknown error'}`;
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
pre {
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
