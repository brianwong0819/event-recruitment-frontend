<template>
  <div class="portfolio-detail-container">
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <ProgressSpinner
        class="w-12 h-12"
        strokeWidth="4"
        fill="var(--surface-ground)"
        animationDuration=".5s"
        aria-label="Loading"
      />
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="flex flex-col items-center justify-center py-20"
    >
      <div
        class="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4"
      >
        <i class="pi pi-exclamation-triangle text-red-500 text-2xl"></i>
      </div>
      <h2 class="text-xl font-semibold text-gray-800 mb-2">
        Unable to load portfolio
      </h2>
      <p class="text-gray-600 mb-4 text-center max-w-md">
        We encountered an error while loading this portfolio. Please try again
        later.
      </p>
      <div class="flex gap-3">
        <Button
          label="Go Back"
          icon="pi pi-arrow-left"
          class="p-button-outlined"
          @click="$router.back()"
        />
        <Button
          label="Retry"
          icon="pi pi-refresh"
          @click="fetchPortfolioDetails"
        />
      </div>
    </div>

    <!-- Portfolio Detail Content -->
    <div v-else-if="portfolio" class="portfolio-content pb-12">
      <!-- Back Button -->
      <div class="back-button-container px-4 py-3">
        <Button
          label="Back to Recruiter"
          icon="pi pi-arrow-left"
          class="p-button-text p-button-rounded hover:bg-gray-100 transition-colors"
          @click="$router.back()"
        />
      </div>

      <!-- Portfolio Header -->
      <div class="relative">
        <!-- Cover Photo -->
        <div class="h-72 md:h-96 w-full bg-gray-900 relative overflow-hidden">
          <img
            v-if="portfolio.coverImageUrl"
            :src="getImageUrl(portfolio.coverImageUrl)"
            :alt="portfolio.eventName"
            class="w-full h-full object-cover opacity-90"
            @error="onImageError"
          />

          <!-- Fallback design when no cover image -->
          <div
            v-else
            class="absolute inset-0 bg-gradient-to-br from-indigo-800 via-indigo-900 to-gray-900"
          >
            <!-- Decorative elements -->
            <div class="absolute top-0 left-0 w-full h-full">
              <div
                class="absolute top-10 right-10 w-32 h-32 rounded-full bg-indigo-700/20"
              ></div>
              <div
                class="absolute bottom-20 right-1/4 w-48 h-48 rounded-full bg-indigo-600/10"
              ></div>
              <div
                class="absolute top-1/3 left-1/3 w-64 h-64 rounded-full bg-indigo-500/5"
              ></div>
              <div
                class="absolute -top-10 -left-10 w-40 h-40 rounded-full border-4 border-indigo-600/10"
              ></div>

              <!-- Wave pattern at bottom -->
              <svg
                class="absolute bottom-0 w-full"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1440 320"
              >
                <path
                  fill="rgba(255,255,255,0.05)"
                  d="M0,96L48,122.7C96,149,192,203,288,213.3C384,224,480,192,576,176C672,160,768,160,864,176C960,192,1056,224,1152,224C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                ></path>
              </svg>

              <!-- Event icon -->
              <div
                class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white/10"
              >
                <i class="pi pi-calendar text-9xl"></i>
              </div>
            </div>
          </div>

          <!-- Decorative patterns -->
          <div class="absolute top-0 left-0 w-full h-full pointer-events-none">
            <svg
              class="absolute left-0 top-0 h-full w-1/3 text-white/10"
              viewBox="0 0 150 800"
              preserveAspectRatio="none"
            >
              <path d="M0,0 L150,0 L100,800 L0,800 Z" fill="currentColor" />
            </svg>
            <svg
              class="absolute right-0 top-0 h-full w-1/4 text-white/5"
              viewBox="0 0 150 800"
              preserveAspectRatio="none"
            >
              <path d="M0,0 L150,0 L150,800 L50,800 Z" fill="currentColor" />
            </svg>
            <div
              class="absolute top-12 right-12 w-24 h-24 rounded-full border-4 border-white/10"
            ></div>
            <div
              class="absolute bottom-24 left-1/4 w-16 h-16 rounded-full border-4 border-white/10"
            ></div>
          </div>

          <!-- Gradient overlay -->
          <div
            class="absolute inset-0 bg-gradient-to-t from-indigo-900/90 via-gray-900/70 to-transparent"
          ></div>
        </div>

        <!-- Portfolio Info Overlay -->
        <div
          class="absolute bottom-0 left-0 w-full p-8 transform translate-y-1/3"
        >
          <div class="max-w-5xl mx-auto flex flex-col md:flex-row gap-6">
            <!-- Event title and info card -->
            <div
              class="flex-1 bg-white rounded-xl shadow-xl p-6 border border-gray-100"
            >
              <div class="flex flex-col">
                <!-- Date badge -->
                <div class="mb-3">
                  <span
                    v-if="portfolio.eventStartDate"
                    class="inline-flex items-center px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium"
                  >
                    <i class="pi pi-calendar mr-2"></i>
                    {{
                      formatDate(
                        portfolio.eventStartDate,
                        portfolio.eventEndDate
                      )
                    }}
                  </span>
                </div>

                <!-- Event title -->
                <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                  {{ portfolio.eventName }}
                </h1>

                <!-- Divider -->
                <div class="w-16 h-1 bg-indigo-600 rounded-full mb-4"></div>

                <!-- Description -->
                <p
                  v-if="portfolio.eventDescription"
                  class="text-gray-700 text-lg"
                >
                  {{ portfolio.eventDescription }}
                </p>
                <p v-else class="text-gray-500 italic text-lg">
                  No event description available
                </p>
              </div>
            </div>

            <!-- Stats card -->
            <div
              class="md:w-64 bg-indigo-900 text-white rounded-xl shadow-xl p-6 self-stretch flex flex-col justify-between"
            >
              <h3 class="text-xl font-bold mb-6 flex items-center">
                <i class="pi pi-chart-bar mr-2"></i> Event Stats
              </h3>

              <div class="space-y-4">
                <div>
                  <p class="text-indigo-200 mb-1 text-sm">Photo Collection</p>
                  <p class="text-2xl font-bold">{{ mediaCount }} images</p>
                </div>

                <div v-if="portfolio.uploadedAt">
                  <p class="text-indigo-200 mb-1 text-sm">Last Updated</p>
                  <p class="text-lg font-medium">
                    {{ formatLastUpdated(portfolio.uploadedAt) }}
                  </p>
                </div>
              </div>

              <div class="mt-6 pt-6 border-t border-indigo-800">
                <Button
                  icon="pi pi-images"
                  label="View Gallery"
                  class="p-button-rounded p-button w-full justify-center"
                  @click="scrollToGallery"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Spacer for content positioning -->
      <div class="h-32 md:h-40"></div>

      <!-- Gallery Section -->
      <div class="max-w-6xl mx-auto px-4 py-12 gallery-section">
        <!-- Gallery Header -->
        <div class="mb-8 border-b border-gray-200 pb-4">
          <div
            class="flex flex-col md:flex-row md:justify-between md:items-center gap-3"
          >
            <h2 class="text-2xl font-bold text-gray-800 flex items-center">
              Gallery
              <span
                class="ml-3 text-base font-medium px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full"
              >
                {{ mediaCount }} photo{{ mediaCount !== 1 ? 's' : '' }}
              </span>
            </h2>

            <!-- View Options -->
            <div
              class="flex items-center gap-2 bg-gray-100 p-1 rounded-lg self-start"
            >
              <button
                class="px-3 py-2 rounded-md flex items-center gap-2 transition-colors"
                :class="
                  viewMode === 'grid'
                    ? 'bg-white shadow-sm text-indigo-700'
                    : 'text-gray-600 hover:text-gray-900'
                "
                @click="viewMode = 'grid'"
              >
                <i class="pi pi-th-large"></i>
                <span class="text-sm font-medium">Grid</span>
              </button>
              <button
                class="px-3 py-2 rounded-md flex items-center gap-2 transition-colors"
                :class="
                  viewMode === 'masonry'
                    ? 'bg-white shadow-sm text-indigo-700'
                    : 'text-gray-600 hover:text-gray-900'
                "
                @click="viewMode = 'masonry'"
              >
                <i class="pi pi-images"></i>
                <span class="text-sm font-medium">Masonry</span>
              </button>
            </div>
          </div>
        </div>

        <!-- No Images State -->
        <div
          v-if="!mediaCount"
          class="py-12 text-center bg-gray-50 rounded-xl border border-gray-200"
        >
          <div
            class="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4"
          >
            <i class="pi pi-image text-gray-400 text-2xl"></i>
          </div>
          <h3 class="text-xl font-semibold text-gray-800 mb-2">
            No images available
          </h3>
          <p class="text-gray-600 max-w-md mx-auto">
            This portfolio doesn't have any media items yet.
          </p>
        </div>

        <!-- Image Grid -->
        <div
          v-else-if="viewMode === 'grid'"
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          <div
            v-for="(media, index) in portfolio.eventMedia"
            :key="media.id"
            class="group aspect-square overflow-hidden bg-gray-100 rounded-xl shadow-sm border border-gray-200 cursor-pointer transition-all duration-300 hover:shadow-md hover:border-indigo-200"
            @click="openGallery(index)"
          >
            <div class="w-full h-full relative">
              <img
                :src="getImageUrl(media.mediaUrl)"
                :alt="`${portfolio.eventName} photo ${index + 1}`"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                @error="onImageError"
              />
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3"
              >
                <div class="text-white text-sm font-medium">
                  <i class="pi pi-search mr-1"></i> View
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Image Masonry Layout -->
        <div
          v-else
          class="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6"
        >
          <div
            v-for="(media, index) in portfolio.eventMedia"
            :key="media.id"
            class="group break-inside-avoid overflow-hidden bg-gray-100 rounded-xl shadow-sm border border-gray-200 cursor-pointer transition-all duration-300 hover:shadow-md hover:border-indigo-200"
            @click="openGallery(index)"
          >
            <div class="relative">
              <img
                :src="getImageUrl(media.mediaUrl)"
                :alt="`${portfolio.eventName} photo ${index + 1}`"
                class="w-full h-auto transition-transform duration-500 group-hover:scale-105"
                @error="onImageError"
              />
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3"
              >
                <div class="text-white text-sm font-medium">
                  <i class="pi pi-search mr-1"></i> View
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Image Lightbox Dialog -->
    <Dialog
      v-model:visible="galleryVisible"
      :modal="true"
      :dismissableMask="true"
      :closable="true"
      :showHeader="false"
      :contentStyle="{
        padding: 0,
        maxWidth: '90vw',
        height: '90vh',
        backgroundColor: 'transparent',
        border: 'none',
        boxShadow: 'none',
      }"
      :maskStyle="{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }"
    >
      <div class="h-full flex flex-col justify-center items-center relative">
        <!-- Gallery Navigation -->
        <Button
          v-if="currentImageIndex > 0"
          icon="pi pi-chevron-left"
          class="absolute left-4 top-1/2 transform -translate-y-1/2 p-button-rounded p-button-text text-white text-xl w-14 h-14 bg-black/40 hover:bg-black/60 backdrop-blur-sm shadow-lg"
          @click="prevImage"
        />

        <!-- Image Display -->
        <div
          class="max-h-full max-w-full overflow-hidden flex items-center justify-center"
        >
          <img
            v-if="currentImage"
            :src="getImageUrl(currentImage.mediaUrl)"
            :alt="`${portfolio?.eventName} photo ${currentImageIndex + 1}`"
            class="max-h-full max-w-full object-contain shadow-2xl"
            @error="onImageError"
          />
        </div>

        <Button
          v-if="currentImageIndex < mediaCount - 1"
          icon="pi pi-chevron-right"
          class="absolute right-4 top-1/2 transform -translate-y-1/2 p-button-rounded p-button-text text-white text-xl w-14 h-14 bg-black/40 hover:bg-black/60 backdrop-blur-sm shadow-lg"
          @click="nextImage"
        />

        <!-- Close Button -->
        <Button
          icon="pi pi-times"
          class="absolute top-4 right-4 p-button-rounded p-button-text text-white bg-black/40 hover:bg-black/60 backdrop-blur-sm shadow-lg"
          @click="galleryVisible = false"
        />

        <!-- Image Counter -->
        <div class="absolute bottom-6 left-0 right-0 text-center">
          <div
            class="inline-flex items-center px-4 py-2 bg-black/50 backdrop-blur-sm rounded-full text-white text-sm font-medium shadow-lg"
          >
            <span class="mr-2">{{ currentImageIndex + 1 }}</span>
            <div class="w-16 h-1 bg-gray-700 rounded-full overflow-hidden">
              <div
                class="h-full bg-white rounded-full"
                :style="{
                  width: `${((currentImageIndex + 1) / mediaCount) * 100}%`,
                }"
              ></div>
            </div>
            <span class="ml-2">{{ mediaCount }}</span>
          </div>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Button from 'primevue/button';
import ProgressSpinner from 'primevue/progressspinner';
import Dialog from 'primevue/dialog';
import axios from 'axios';

const route = useRoute();
const router = useRouter();

// State
const portfolio = ref(null);
const loading = ref(true);
const error = ref(null);
const viewMode = ref('grid'); // 'grid' or 'masonry'
const galleryVisible = ref(false);
const currentImageIndex = ref(0);

// Default image placeholder
const defaultImage = ref(
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOWNhM2FmIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHJlY3QgeD0iMyIgeT0iMyIgd2lkdGg9IjE4IiBoZWlnaHQ9IjE4IiByeD0iMiIgcnk9IjIiPjwvcmVjdD48Y2lyY2xlIGN4PSI4LjUiIGN5PSI4LjUiIHI9IjEuNSI+PC9jaXJjbGU+PHBvbHlsaW5lIHBvaW50cz0iMjEgMTUgMTYgMTAgNSAyMSI+PC9wb2x5bGluZT48L3N2Zz4='
);

// Computed properties
const recruiterId = computed(() => route.params.recruiterId);
const portfolioId = computed(() => route.params.portfolioId);
const mediaCount = computed(() => portfolio.value?.eventMedia?.length || 0);
const currentImage = computed(() => {
  if (!portfolio.value?.eventMedia || !portfolio.value.eventMedia.length)
    return null;
  return portfolio.value.eventMedia[currentImageIndex.value];
});

// Format date
const formatDate = (startDate, endDate) => {
  if (!startDate) return '';

  const start = new Date(startDate);
  const options = { year: 'numeric', month: 'short', day: 'numeric' };

  if (!endDate || startDate === endDate) {
    return start.toLocaleDateString('en-US', options);
  }

  const end = new Date(endDate);
  // If same month and year, only show day for start date
  if (
    start.getMonth() === end.getMonth() &&
    start.getFullYear() === end.getFullYear()
  ) {
    return `${start.getDate()} - ${end.toLocaleDateString('en-US', options)}`;
  }

  return `${start.toLocaleDateString(
    'en-US',
    options
  )} - ${end.toLocaleDateString('en-US', options)}`;
};

// Function to get proper image URL
const getImageUrl = (url) => {
  if (!url) return defaultImage.value;

  // If it's already an absolute URL, return it
  if (url.startsWith('http')) {
    return url;
  }

  // If it's a data URL (base64), return as is
  if (url.startsWith('data:')) {
    return url;
  }

  // If it comes from portfolio-media folder
  if (url.includes('portfolio-media')) {
    try {
      // Extract the filename
      const filename = url.split('/').pop();
      // Import directly from assets
      return `/src/assets/portfolio-media/${filename}`;
    } catch (error) {
      console.error('Error loading image:', error);
      return defaultImage.value;
    }
  }

  // For other relative URLs (starts with /), prepend API base URL
  const baseUrl = 'http://localhost:8080'; // Replace with your actual API base URL
  return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};

// Handle image loading errors
const onImageError = (event) => {
  console.log('Image failed to load:', event.target.src);
  event.target.src = defaultImage.value;
};

// Fetch portfolio details
const fetchPortfolioDetails = async () => {
  loading.value = true;
  error.value = null;

  try {
    const apiUrl = `http://localhost:8080/api/public/recruiters/${recruiterId.value}/portfolios/${portfolioId.value}`;
    console.log(`Fetching portfolio details from: ${apiUrl}`);

    const response = await axios.get(apiUrl);

    if (response.data && response.data.data) {
      portfolio.value = response.data.data;
      console.log('Portfolio data loaded:', portfolio.value);
    } else {
      throw new Error('Invalid response format');
    }
  } catch (err) {
    console.error('Error loading portfolio details:', err);
    error.value = err.message || 'Failed to load portfolio details';

    // For development - mock data
    if (process.env.NODE_ENV === 'development') {
      console.warn('Using mock data as fallback');
      portfolio.value = {
        id: portfolioId.value,
        eventName: 'Summer Product Launch 2025',
        eventStartDate: '2025-04-10T00:00:00',
        eventEndDate: '2025-04-12T00:00:00',
        eventDescription:
          'A successful product launch event showcasing our latest innovations to industry partners and media representatives. Featuring product demos, networking sessions, and interactive displays.',
        uploadedAt: '2025-04-13T00:41:54.555495',
        eventMedia: [
          {
            id: 1,
            mediaUrl: '/assets/portfolio-media/event1-1.jpg',
            uploadedAt: '2025-04-13T00:41:59.273303',
          },
          {
            id: 2,
            mediaUrl: '/assets/portfolio-media/event1-2.jpg',
            uploadedAt: '2025-04-13T00:42:05.112345',
          },
          {
            id: 3,
            mediaUrl: '/assets/portfolio-media/event1-3.jpg',
            uploadedAt: '2025-04-13T00:42:15.998765',
          },
          {
            id: 4,
            mediaUrl: '/assets/portfolio-media/event1-4.jpg',
            uploadedAt: '2025-04-13T00:42:22.556677',
          },
          {
            id: 5,
            mediaUrl: '/assets/portfolio-media/event1-5.jpg',
            uploadedAt: '2025-04-13T00:42:30.112233',
          },
          {
            id: 6,
            mediaUrl: '/assets/portfolio-media/event1-6.jpg',
            uploadedAt: '2025-04-13T00:42:40.445566',
          },
        ],
      };
      error.value = null;
    }
  } finally {
    loading.value = false;
  }
};

// Gallery navigation functions
const openGallery = (index) => {
  currentImageIndex.value = index;
  galleryVisible.value = true;
};

const nextImage = () => {
  if (currentImageIndex.value < mediaCount.value - 1) {
    currentImageIndex.value++;
  }
};

const prevImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--;
  }
};

// Load portfolio data on component mount
onMounted(() => {
  fetchPortfolioDetails();
});

// Function to format last updated date
const formatLastUpdated = (dateString) => {
  if (!dateString) return 'N/A';

  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

// Function to scroll to gallery section
const scrollToGallery = () => {
  const gallerySection = document.querySelector('.gallery-section');
  if (gallerySection) {
    gallerySection.scrollIntoView({ behavior: 'smooth' });
  }
};
</script>

<style scoped>
.portfolio-detail-container {
  max-width: 100%;
  margin: 0 auto;
}

/* Lightbox styling */
:deep(.p-dialog-mask) {
  backdrop-filter: blur(2px);
}

:deep(.p-dialog-content) {
  overflow: visible;
}

/* Masonry layout */
@media (min-width: 640px) {
  .columns-2 {
    column-count: 2;
  }
}

@media (min-width: 768px) {
  .columns-3 {
    column-count: 3;
  }
}

@media (min-width: 1024px) {
  .columns-4 {
    column-count: 4;
  }
}
</style>
