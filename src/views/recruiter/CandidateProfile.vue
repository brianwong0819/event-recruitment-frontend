<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <div class="mb-6">
      <div class="flex items-center">
        <Button
          icon="pi pi-arrow-left"
          class="p-button-text p-button-rounded mr-2"
          @click="goBack"
        />
        <h1 class="text-2xl font-bold text-gray-900">Candidate Profile</h1>
      </div>
    </div>

    <div v-if="loading" class="text-center py-8">
      <ProgressSpinner
        style="width: 50px; height: 50px"
        strokeWidth="8"
        fill="var(--surface-ground)"
        animationDuration=".5s"
      />
      <p class="mt-4 text-gray-600">Loading candidate profile...</p>
    </div>

    <div v-else-if="!candidate" class="text-center py-12">
      <div
        class="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6"
      >
        <i class="pi pi-exclamation-circle text-gray-400 text-3xl"></i>
      </div>
      <h3 class="text-xl font-medium text-gray-700 mb-3">
        Candidate Not Found
      </h3>
      <p class="text-gray-500 mb-6 max-w-md mx-auto">
        The candidate you're looking for does not exist or has been deleted
      </p>
      <Button
        label="Go Back"
        icon="pi pi-arrow-left"
        @click="goBack"
        class="p-button-primary px-4 py-2"
      />
    </div>

    <div v-else class="grid grid-cols-12 gap-6">
      <!-- Left Column: Profile Card and Basic Information -->
      <div class="col-span-12 lg:col-span-4 space-y-6">
        <!-- Profile Card -->
        <div class="bg-white rounded-xl shadow-md overflow-hidden">
          <div
            class="bg-gradient-to-r from-indigo-600 to-purple-600 h-28"
          ></div>
          <div class="flex justify-center -mt-12">
            <div
              class="w-24 h-24 rounded-full bg-white p-1 shadow-lg overflow-hidden"
            >
              <img
                v-if="candidate.profilePictureUrl"
                :src="getProfilePictureUrl(candidate.profilePictureUrl)"
                class="w-full h-full object-cover rounded-full"
                alt="Profile"
              />
              <div
                v-else
                class="w-full h-full bg-indigo-100 rounded-full flex items-center justify-center"
              >
                <i class="pi pi-user text-indigo-600 text-4xl"></i>
              </div>
            </div>
          </div>
          <div class="px-6 py-4 text-center">
            <h2 class="text-xl font-bold text-gray-800">
              {{ candidate.name }}
            </h2>
            <div class="text-indigo-600 mb-2 mt-1">
              {{ formatEmploymentStatus(candidate.employmentStatus) }}
            </div>
            <div class="text-gray-600 mb-3">
              <i class="pi pi-map-marker mr-1"></i>
              {{ candidate.preferredLocation || 'Not specified' }}
            </div>
            <div class="flex justify-center space-x-3 mt-4">
              <Button
                icon="pi pi-phone"
                class="p-button-rounded p-button-outlined p-button-secondary"
                v-tooltip="'Call Candidate'"
                @click="callPhone(candidate.phoneNumber)"
              />
              <Button
                icon="pi pi-envelope"
                class="p-button-rounded p-button-outlined p-button-secondary"
                v-tooltip="'Send Email'"
                @click="sendEmail(candidate.email)"
              />
            </div>
          </div>
        </div>

        <!-- Basic Information Card -->
        <div class="bg-white rounded-xl shadow-md overflow-hidden">
          <div class="px-6 py-4">
            <div class="flex items-center mb-4">
              <i class="pi pi-user text-indigo-600 mr-2"></i>
              <h3 class="text-lg font-semibold text-gray-800">
                Basic Information
              </h3>
            </div>
            <div class="space-y-3">
              <div class="flex items-start">
                <div
                  class="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center mr-3"
                >
                  <i class="pi pi-envelope text-blue-600 text-sm"></i>
                </div>
                <div>
                  <div class="text-sm text-gray-500">Email</div>
                  <div class="text-gray-700">{{ candidate.email }}</div>
                </div>
              </div>
              <div class="flex items-start">
                <div
                  class="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center mr-3"
                >
                  <i class="pi pi-phone text-green-600 text-sm"></i>
                </div>
                <div>
                  <div class="text-sm text-gray-500">Phone</div>
                  <div class="text-gray-700">
                    {{ candidate.phoneNumber || 'Not provided' }}
                  </div>
                </div>
              </div>
              <div class="flex items-start">
                <div
                  class="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center mr-3"
                >
                  <i class="pi pi-map-marker text-amber-600 text-sm"></i>
                </div>
                <div>
                  <div class="text-sm text-gray-500">Location</div>
                  <div class="text-gray-700">
                    {{ candidate.preferredLocation || 'Not specified' }}
                  </div>
                </div>
              </div>
              <div class="flex items-start">
                <div
                  class="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center mr-3"
                >
                  <i class="pi pi-calendar text-purple-600 text-sm"></i>
                </div>
                <div>
                  <div class="text-sm text-gray-500">Date of Birth</div>
                  <div class="text-gray-700">
                    {{ formatDate(candidate.dateOfBirth) || 'Not provided' }}
                  </div>
                </div>
              </div>
              <div class="flex items-start">
                <div
                  class="w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center mr-3"
                >
                  <i class="pi pi-comments text-teal-600 text-sm"></i>
                </div>
                <div>
                  <div class="text-sm text-gray-500">Language</div>
                  <div class="text-gray-700">
                    {{
                      formatLanguages(candidate.languages) || 'Not specified'
                    }}
                  </div>
                </div>
              </div>
              <div class="flex items-start">
                <div
                  class="w-7 h-7 rounded-full bg-rose-100 flex items-center justify-center mr-3"
                >
                  <i class="pi pi-user text-rose-600 text-sm"></i>
                </div>
                <div>
                  <div class="text-sm text-gray-500">Race</div>
                  <div class="text-gray-700">
                    {{ formatRace(candidate.race) || 'Not specified' }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Resume Download Card -->
        <div class="bg-white rounded-xl shadow-md overflow-hidden">
          <div class="px-6 py-4">
            <div class="flex items-center mb-4">
              <i class="pi pi-file-pdf text-indigo-600 mr-2"></i>
              <h3 class="text-lg font-semibold text-gray-800">Resume</h3>
            </div>
            <div
              v-if="candidate.resumeUrl"
              class="bg-gray-50 p-4 rounded-lg border border-gray-200"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div
                    class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3"
                  >
                    <i class="pi pi-file-pdf text-red-600"></i>
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-800">
                      {{ candidate.name }}'s Resume
                    </div>
                    <div class="text-xs text-gray-500">PDF Document</div>
                  </div>
                </div>
                <Button
                  icon="pi pi-download"
                  label="Download"
                  class="p-button-sm p-button-primary"
                  @click="downloadResume"
                />
              </div>
            </div>
            <div
              v-else
              class="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center text-gray-500"
            >
              <i
                class="pi pi-exclamation-circle text-amber-500 text-lg mb-2"
              ></i>
              <div>No resume has been uploaded by this candidate</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Experience, Skills, and Photos -->
      <div class="col-span-12 lg:col-span-8 space-y-6">
        <!-- Work Experience Card -->
        <div class="bg-white rounded-xl shadow-md overflow-hidden">
          <div class="px-6 py-4">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-semibold text-gray-800">
                Work Experience
              </h3>
              <div class="flex items-center gap-2">
                <span class="text-sm text-gray-500"
                  >{{ currentExpPage }} of {{ totalExpPages }}</span
                >
                <Button
                  icon="pi pi-chevron-left"
                  class="p-button-rounded p-button-text p-button-sm"
                  :disabled="currentExpPage === 1"
                  @click="prevExpPage"
                />
                <Button
                  icon="pi pi-chevron-right"
                  class="p-button-rounded p-button-text p-button-sm"
                  :disabled="currentExpPage === totalExpPages"
                  @click="nextExpPage"
                />
              </div>
            </div>
            <div v-if="paginatedExperiences.length > 0" class="space-y-5">
              <div
                v-for="(experience, index) in paginatedExperiences"
                :key="index"
                class="border-l-2 border-indigo-200 pl-4 ml-2 relative"
              >
                <div
                  class="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-indigo-600"
                ></div>
                <div class="flex justify-between items-start">
                  <div>
                    <h4 class="text-base font-medium text-gray-800">
                      {{ formatJobType(experience.jobType) }}
                    </h4>
                  </div>
                </div>
                <p class="text-gray-600 mt-2 text-sm">
                  {{ experience.experienceText }}
                </p>
              </div>
            </div>
            <div
              v-else
              class="bg-gray-50 p-4 rounded-lg text-center text-gray-500"
            >
              No work experience has been added by this candidate
            </div>
          </div>
        </div>

        <!-- Photo Sections -->
        <div class="bg-white rounded-xl shadow-md overflow-hidden">
          <div class="px-6 py-4">
            <div class="flex items-center mb-4">
              <i class="pi pi-images text-indigo-600 mr-2"></i>
              <h3 class="text-lg font-semibold text-gray-800">
                Portfolio Photos
              </h3>
            </div>

            <!-- Comp Card & Self Photos Section -->
            <div class="mb-6">
              <h4 class="text-base font-medium text-gray-700 mb-3 px-1">
                Comp Card & Self Photos
              </h4>
              <div
                v-if="candidate.comcards && candidate.comcards.length > 0"
                class="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <div
                  v-for="(photo, index) in candidate.comcards"
                  :key="index"
                  class="relative overflow-hidden rounded-lg shadow-md h-64 group cursor-pointer"
                  @click="
                    getCompcardUrl(photo) &&
                      openPhotoModal(getCompcardUrl(photo), 'Comp Card Photo')
                  "
                >
                  <template v-if="getCompcardUrl(photo)">
                    <img
                      :src="getCompcardUrl(photo)"
                      class="w-full h-full object-cover"
                      :alt="`Comp Card Photo ${index + 1}`"
                    />
                    <div
                      class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-start p-3"
                    >
                      <div class="text-white text-sm font-medium">
                        Comp Card Photo {{ index + 1 }}
                      </div>
                    </div>
                  </template>
                  <div
                    v-else
                    class="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-sm"
                  >
                    Image not available
                  </div>
                </div>
              </div>
              <div
                v-else
                class="bg-gray-50 p-4 rounded-lg text-center text-gray-500"
              >
                No comp card or self photos have been uploaded
              </div>
            </div>

            <!-- Working Photos Section -->
            <div>
              <h4 class="text-base font-medium text-gray-700 mb-3 px-1">
                Working Photos
              </h4>
              <div
                v-if="
                  candidate.workingPhotos && candidate.workingPhotos.length > 0
                "
                class="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <div
                  v-for="(photo, index) in candidate.workingPhotos"
                  :key="index"
                  class="relative overflow-hidden rounded-lg shadow-md h-64 group cursor-pointer"
                  @click="
                    getWorkingPhotoUrl(photo) &&
                      openPhotoModal(getWorkingPhotoUrl(photo), 'Working Photo')
                  "
                >
                  <template v-if="getWorkingPhotoUrl(photo)">
                    <img
                      :src="getWorkingPhotoUrl(photo)"
                      class="w-full h-full object-cover"
                      :alt="`Working Photo ${index + 1}`"
                    />
                    <div
                      class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-start p-3"
                    >
                      <div class="text-white text-sm font-medium">
                        Working Photo {{ index + 1 }}
                      </div>
                    </div>
                  </template>
                  <div
                    v-else
                    class="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-sm"
                  >
                    Image not available
                  </div>
                </div>
              </div>
              <div
                v-else
                class="bg-gray-50 p-4 rounded-lg text-center text-gray-500"
              >
                No working photos have been uploaded
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Photo Modal -->
    <Dialog
      v-model:visible="photoModalVisible"
      :style="{ width: '90vw', maxWidth: '900px' }"
      :modal="true"
      :closable="true"
      :closeOnEscape="true"
      class="photo-modal"
      :header="photoModalTitle"
    >
      <div class="relative">
        <img :src="selectedPhotoUrl" class="w-full rounded-lg" alt="Photo" />
      </div>
      <template #footer>
        <Button
          label="Close"
          icon="pi pi-times"
          @click="photoModalVisible = false"
          class="p-button-outlined"
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { format } from 'date-fns';
import axios from 'axios';
import fileService from '@/services/file.service';

// PrimeVue components
import Button from 'primevue/button';
import ProgressSpinner from 'primevue/progressspinner';
import Dialog from 'primevue/dialog';

const router = useRouter();
const route = useRoute();
const toast = useToast();

// State
const loading = ref(true);
const candidate = ref(null);
const photoModalVisible = ref(false);
const selectedPhotoUrl = ref('');
const photoModalTitle = ref('');

// Add pagination for experiences
const EXPERIENCES_PER_PAGE = 3;
const currentExpPage = ref(1);
const totalExpPages = computed(() => {
  if (!candidate.value?.experiences?.length) return 1;
  return Math.ceil(candidate.value.experiences.length / EXPERIENCES_PER_PAGE);
});

const paginatedExperiences = computed(() => {
  if (!candidate.value?.experiences?.length) return [];
  const startIndex = (currentExpPage.value - 1) * EXPERIENCES_PER_PAGE;
  return candidate.value.experiences.slice(
    startIndex,
    startIndex + EXPERIENCES_PER_PAGE
  );
});

const nextExpPage = () => {
  if (currentExpPage.value < totalExpPages.value) {
    currentExpPage.value++;
  }
};

const prevExpPage = () => {
  if (currentExpPage.value > 1) {
    currentExpPage.value--;
  }
};

// Navigate back
const goBack = () => {
  router.go(-1);
};

// Format date
const formatDate = (dateString) => {
  if (!dateString) return 'Not specified';
  try {
    return format(new Date(dateString), 'MMM dd, yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

// Format employment status
const formatEmploymentStatus = (status) => {
  if (!status) return 'Not specified';

  const statusMap = {
    FULL_TIME: 'Full-time',
    PART_TIME: 'Part-time',
    FREELANCE: 'Freelance',
    STUDENT: 'Student',
    UNEMPLOYED: 'Currently Unemployed',
    OTHER: 'Other',
  };

  return statusMap[status] || status;
};

// Format job type
const formatJobType = (jobType) => {
  if (!jobType) return 'Other';

  const jobTypeMap = {
    PROMOTER: 'Promoter',
    EVENT_CREW: 'Event Crew',
    BRAND_AMBASSADOR: 'Brand Ambassador',
    USHER: 'Usher',
    MC: 'MC/Host',
    SUPERVISOR: 'Supervisor',
    OTHER: 'Other',
  };

  return jobTypeMap[jobType] || jobType;
};

// Format race
const formatRace = (race) => {
  if (!race) return 'Not specified';

  const raceMap = {
    MALAY: 'Malay',
    CHINESE: 'Chinese',
    INDIAN: 'Indian',
    OTHER: 'Other',
  };

  return raceMap[race] || race;
};

// Format languages
const formatLanguages = (languages) => {
  if (!languages || languages.length === 0) return 'Not specified';

  // Define language mapping
  const languageMap = {
    ENGLISH: 'English',
    MANDARIN: 'Mandarin',
    MALAY: 'Malay',
    TAMIL: 'Tamil',
    OTHER: 'Other',
  };

  // If languages is a string, check if it's a valid enum key
  if (typeof languages === 'string') {
    return languageMap[languages] || languages;
  }

  // If languages is an array, map each value and join with commas
  if (Array.isArray(languages)) {
    return languages.map((lang) => languageMap[lang] || lang).join(', ');
  }

  return 'Not specified';
};

// File handlers
const getProfilePictureUrl = (url) => {
  return fileService.getProfilePictureUrl(url);
};

const getWorkingPhotoUrl = (photo) => {
  // If the photo is already a string (the URL), use it directly
  if (typeof photo === 'string') {
    return fileService.getWorkingPhotoUrl(photo);
  }

  // Handle exact object structure from API: {id: 4, photoUrl: '/api/...', description: null, uploadedAt: '...'}
  if (photo && typeof photo === 'object' && photo.photoUrl) {
    return fileService.getWorkingPhotoUrl(photo.photoUrl);
  }

  // Legacy format with url property
  if (photo && typeof photo === 'object' && photo.url) {
    return fileService.getWorkingPhotoUrl(photo.url);
  }

  // Log warning if we can't handle this data type
  console.warn('Unhandled photo data type in getWorkingPhotoUrl:', photo);
  return null;
};

// Fix the method to handle different data types
const getCompcardUrl = (photo) => {
  // If the photo is already a string (the URL), use it directly
  if (typeof photo === 'string') {
    return fileService.getCompcardUrl(photo);
  }

  // Handle exact object structure from API: {id: 4, comcardUrl: '/api/...', uploadedAt: '...'}
  if (photo && typeof photo === 'object' && photo.comcardUrl) {
    return fileService.getCompcardUrl(photo.comcardUrl);
  }

  // Legacy format with url property
  if (photo && typeof photo === 'object' && photo.url) {
    return fileService.getCompcardUrl(photo.url);
  }

  // Log warning if we can't handle this data type
  console.warn('Unhandled photo data type in getCompcardUrl:', photo);
  return null;
};

// Send email
const sendEmail = (email) => {
  if (!email) return;
  window.location.href = `mailto:${email}`;
};

// Call phone
const callPhone = (phone) => {
  if (!phone) return;
  window.location.href = `tel:${phone}`;
};

// Download resume
const downloadResume = () => {
  if (!candidate.value.resumeUrl) return;

  // Get the complete URL for the resume
  const resumeUrl = fileService.getResumeUrl(candidate.value.resumeUrl);

  // Open the resume in a new tab which will either display it or download it
  window.open(resumeUrl, '_blank');

  toast.add({
    severity: 'success',
    summary: 'Resume Download',
    detail: 'Resume download started',
    life: 3000,
  });
};

// Open photo modal
const openPhotoModal = (url, title) => {
  selectedPhotoUrl.value = url;
  photoModalTitle.value = title;
  photoModalVisible.value = true;
};

// Get auth token
const getAuthToken = () => {
  return localStorage.getItem('accessToken');
};

// Fetch candidate data
const fetchCandidateData = async () => {
  loading.value = true;
  try {
    const candidateId = route.params.candidateId;
    const token = getAuthToken();

    const response = await axios.get(
      `http://localhost:8080/api/recruiters/candidates/${candidateId}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    if (response.data && response.data.statusCode === 200) {
      candidate.value = response.data.data;

      // Log the photo structures for debugging
      console.log('Comcards:', candidate.value.comcards);
      console.log('Working Photos:', candidate.value.workingPhotos);
    } else {
      console.error('Failed to fetch candidate details:', response.data);
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to fetch candidate details',
        life: 3000,
      });
    }
  } catch (error) {
    console.error('Error fetching candidate data:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load candidate profile',
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
};

// Initialize component
onMounted(() => {
  fetchCandidateData();
});
</script>

<style scoped>
:deep(.p-button) {
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
}

:deep(.p-button:hover) {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

:deep(.p-button-text:hover) {
  background-color: rgba(79, 70, 229, 0.08);
  color: #4f46e5;
  transform: none;
  box-shadow: none;
}

:deep(.p-button-rounded) {
  border-radius: 9999px;
}

:deep(.p-tag) {
  border-radius: 6px;
  padding: 0.3rem 0.7rem;
  font-weight: 600;
  font-size: 0.75rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

:deep(.p-dialog) {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

:deep(.p-dialog .p-dialog-header) {
  border-bottom: 1px solid #e2e8f0;
  padding: 1.25rem 1.5rem;
}

:deep(.p-dialog .p-dialog-footer) {
  border-top: 1px solid #e2e8f0;
  padding: 1.25rem 1.5rem;
}

/* Photo hover effects */
.group:hover img {
  transform: scale(1.05);
  transition: transform 0.3s ease;
}

img {
  transition: transform 0.3s ease;
}

/* Photo modal specific styles */
.photo-modal :deep(.p-dialog-header) {
  background-color: white;
  color: #1e3a8a;
}

.photo-modal :deep(.p-dialog-content) {
  padding: 0;
  border-radius: 8px;
  overflow: hidden;
}

.photo-modal :deep(.p-dialog-footer) {
  background-color: white;
}
</style>
