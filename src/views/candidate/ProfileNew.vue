<template>
  <div class="p-8">
    <Toast position="top-right" />
    <ConfirmDialog />

    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center py-20 w-full">
      <div class="animate-pulse flex flex-col items-center">
        <i class="pi pi-spin pi-spinner text-primary-500 text-4xl mb-2"></i>
        <p class="text-primary-500 mb-4">Loading your profile...</p>
      </div>
    </div>

    <!-- Main content -->
    <div v-else class="max-w-4xl mx-auto">
      <h1 class="text-2xl font-bold mb-6">Your Profile</h1>

      <!-- Navigation -->
      <div class="mb-6 flex border-b">
        <button
          @click="activeSection = 'basic-info'"
          :class="[
            'py-2 px-4',
            activeSection === 'basic-info'
              ? 'border-b-2 border-blue-500 font-medium'
              : '',
          ]"
        >
          Basic Info
        </button>
        <button
          @click="navigateToPhotos"
          :class="[
            'py-2 px-4',
            activeSection === 'photos'
              ? 'border-b-2 border-blue-500 font-medium'
              : '',
          ]"
        >
          Photos
        </button>
        <button
          @click="activeSection = 'experience'"
          :class="[
            'py-2 px-4',
            activeSection === 'experience'
              ? 'border-b-2 border-blue-500 font-medium'
              : '',
          ]"
        >
          Experience
        </button>
      </div>

      <!-- Content Sections -->
      <div v-if="activeSection === 'basic-info'" class="border p-4 rounded">
        <h2 class="text-xl font-bold mb-2">Basic Information</h2>
        <p v-if="profile">Name: {{ profile.name || 'Not provided' }}</p>
        <p v-if="profile">Email: {{ profile.email || 'Not provided' }}</p>
      </div>

      <div v-if="activeSection === 'photos'" class="border p-4 rounded">
        <h2 class="text-xl font-bold mb-2">Photos</h2>
        <p v-if="loadingPhotos">Loading photos...</p>
        <div v-else-if="compcardPhotos.length > 0">
          <p>You have {{ compcardPhotos.length }} photos</p>
        </div>
        <div v-else>
          <p>No photos uploaded yet</p>
          <button
            @click="compcardFileInput?.click()"
            class="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Upload Photo
          </button>
          <input
            type="file"
            ref="compcardFileInput"
            style="display: none"
            accept="image/*"
            @change="handleCompcardUpload"
          />
        </div>
      </div>

      <div v-if="activeSection === 'experience'" class="border p-4 rounded">
        <h2 class="text-xl font-bold mb-2">Experience</h2>
        <p v-if="experiences.length === 0">No work experience added yet</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import Toast from 'primevue/toast';
import ConfirmDialog from 'primevue/confirmdialog';
import candidateService from '@/services/candidate.service';
import { apiClient } from '@/services/api.service';

// Service initialization
const toast = useToast();
const confirmDialog = useConfirm();

// Basic state
const profile = ref(null);
const loading = ref(true);
const activeSection = ref('basic-info');

// Photo related state
const compcardFileInput = ref(null);
const compcardPhotos = ref([]);
const loadingPhotos = ref(false);

// Experience related state
const experiences = ref([]);

// Watch for section changes
watch(activeSection, (newValue, oldValue) => {
  console.log(`Section changed from ${oldValue} to ${newValue}`);

  if (newValue === 'photos') {
    console.log('Photos section is now active, fetching photos');
    fetchCompcardPhotos();
  }
});

// Navigation functions
const navigateToPhotos = () => {
  console.log('Navigating to photos section');
  activeSection.value = 'photos';
  fetchCompcardPhotos();
};

// Fetch the user's profile data
const fetchProfile = async () => {
  try {
    console.log('Fetching profile data...');
    const response = await apiClient.get('/profile');

    if (response && response.data) {
      profile.value = response.data.data || response.data;
      console.log('Profile loaded:', profile.value);
    }
  } catch (error) {
    console.error('Error fetching profile:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load profile. Please try again.',
      life: 5000,
    });
  } finally {
    loading.value = false;
  }
};

// Fetch the user's comp card photos
const fetchCompcardPhotos = async () => {
  if (loadingPhotos.value) return;

  loadingPhotos.value = true;
  try {
    console.log('Fetching comp card photos...');
    const response = await candidateService.getCompcardPhotos();

    if (response.data && response.data.data) {
      const photos = Array.isArray(response.data.data)
        ? response.data.data
        : [response.data.data];

      compcardPhotos.value = photos.map((photo) => ({
        ...photo,
        url: photo.comcardUrl
          ? candidateService.getCompcardFromAssets(photo.comcardUrl)
          : null,
      }));

      console.log('Photos loaded:', compcardPhotos.value);
    }
  } catch (error) {
    console.error('Error fetching photos:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load photos. Please try again.',
      life: 5000,
    });
  } finally {
    loadingPhotos.value = false;
  }
};

// Handle comp card photo upload
const handleCompcardUpload = async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  // Check file type
  if (!file.type.startsWith('image/')) {
    toast.add({
      severity: 'error',
      summary: 'Invalid File',
      detail: 'Please select an image file.',
      life: 3000,
    });
    return;
  }

  // Upload the file
  loadingPhotos.value = true;
  try {
    await candidateService.uploadCompcardPhoto(file);
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Photo uploaded successfully.',
      life: 3000,
    });
    fetchCompcardPhotos();
  } catch (error) {
    console.error('Error uploading photo:', error);
    toast.add({
      severity: 'error',
      summary: 'Upload Failed',
      detail: 'Failed to upload photo. Please try again.',
      life: 5000,
    });
  } finally {
    loadingPhotos.value = false;
    // Reset file input
    if (compcardFileInput.value) {
      compcardFileInput.value.value = '';
    }
  }
};

// Setup on component mount
onMounted(() => {
  console.log('Profile component mounted');
  fetchProfile();

  // If photos section is active, fetch photos
  if (activeSection.value === 'photos') {
    fetchCompcardPhotos();
  }
});
</script>
