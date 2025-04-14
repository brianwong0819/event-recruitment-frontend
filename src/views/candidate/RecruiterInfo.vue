@ -0,0 +1,1040 @@
<template>
  <div class="recruiter-info-container">
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
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
      class="flex flex-col items-center justify-center py-12"
    >
      <div
        class="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4"
      >
        <i class="pi pi-exclamation-triangle text-red-500 text-2xl"></i>
      </div>
      <h3 class="text-xl font-semibold text-gray-800 mb-2">
        Unable to load recruiter information
      </h3>
      <p class="text-gray-600 mb-4 text-center max-w-md">
        We encountered an error while loading this recruiter's information.
        Please try again later.
      </p>
      <Button
        label="Go Back"
        icon="pi pi-arrow-left"
        class="p-button-outlined"
        @click="$router.back()"
      />
    </div>

    <!-- Recruiter Information -->
    <div v-else-if="recruiter" class="recruiter-content">
      <!-- Back to Jobs Button -->
      <div class="back-button-container px-4 py-2">
        <Button
          label="Back"
          icon="pi pi-arrow-left"
          class="p-button-text"
          @click="goBack"
        />
      </div>

      <!-- Header Banner -->
      <div
        class="header-banner bg-indigo-700 h-32 md:h-44 relative rounded-t-lg overflow-hidden"
      >
        <!-- Background decoration patterns -->
        <div class="absolute top-0 left-0 w-full h-full opacity-30">
          <div
            class="absolute top-10 right-10 w-16 h-16 rounded-full border-2 border-white"
          ></div>
          <div
            class="absolute bottom-10 right-1/4 w-8 h-8 rounded-full border-2 border-white"
          ></div>
          <div
            class="absolute bottom-20 left-1/4 w-12 h-12 rounded-full border-2 border-white"
          ></div>
        </div>

        <!-- Gradient overlay -->
        <div
          class="absolute inset-0 bg-gradient-to-t from-indigo-800/70 to-transparent"
        ></div>

        <!-- Recruiter Name -->
        <div class="absolute bottom-0 left-0 w-full p-4 md:p-6">
          <div class="flex items-center justify-between">
            <div>
              <h1
                class="text-2xl md:text-3xl font-bold text-white leading-tight"
              >
                {{ recruiter.companyName || recruiter.recruiterRepName }}
              </h1>
              <div class="flex items-center mt-1">
                <span
                  v-if="recruiter.recruiterType"
                  class="text-xs md:text-sm font-medium px-2 py-1 bg-amber-500/60 rounded-full text-white"
                >
                  {{ formatRecruiterType(recruiter.recruiterType) }}
                </span>
                <span
                  v-if="hasLocationData"
                  class="text-gray-200 text-sm ml-2 flex items-center"
                >
                  <i class="pi pi-map-marker mr-1 text-xs"></i>
                  {{
                    recruiter.companyLocation?.city || 'Location not specified'
                  }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recruiter Profile Card -->
      <div class="profile-card bg-white rounded-b-lg shadow-md mb-6">
        <div class="px-6 py-5">
          <div class="flex flex-col md:flex-row gap-6">
            <!-- Company Logo -->
            <div
              class="w-28 h-28 md:w-36 md:h-36 bg-white rounded-lg border border-gray-200 overflow-hidden flex items-center justify-center flex-shrink-0 mx-auto md:mx-0 shadow-sm"
            >
              <img
                v-if="recruiter.companyLogoUrl"
                :src="getImageUrl(recruiter.companyLogoUrl)"
                :alt="`${
                  recruiter.companyName || recruiter.recruiterRepName
                } logo`"
                class="w-full h-full object-contain p-2"
                @error="onImageError"
              />
              <i v-else class="pi pi-building text-gray-400 text-4xl"></i>
            </div>

            <!-- Profile Content -->
            <div class="flex-grow">
              <!-- Description -->
              <p class="text-gray-700 mb-4 leading-relaxed">
                {{
                  recruiter.companyDescription ||
                  'No company description available.'
                }}
              </p>

              <!-- Links Row -->
              <div class="flex flex-wrap items-center gap-6 mt-5">
                <!-- Website Link -->
                <a
                  v-if="recruiter.companyWebsite"
                  :href="getWebsiteUrl(recruiter.companyWebsite)"
                  target="_blank"
                  class="group flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  <div
                    class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center"
                  >
                    <i class="pi pi-globe text-blue-600"></i>
                  </div>
                  <span class="text-blue-700 font-medium">{{
                    recruiter.companyWebsite
                  }}</span>
                </a>

                <!-- Maps Link -->
                <a
                  v-if="recruiter.companyLocation?.googleMapsUrl"
                  :href="recruiter.companyLocation.googleMapsUrl"
                  target="_blank"
                  class="group flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  <div
                    class="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center"
                  >
                    <i class="pi pi-map-marker text-indigo-600"></i>
                  </div>
                  <span class="text-indigo-700 font-medium">View on Maps</span>
                </a>

                <!-- Verification Status -->
                <div
                  v-if="recruiter.verificationStatus"
                  class="ml-auto flex items-center gap-2"
                >
                  <i class="pi pi-shield text-gray-400"></i>
                  <span class="text-gray-500">{{
                    formatVerificationStatus(recruiter.verificationStatus)
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="tabs-section mb-6">
        <TabView v-model:activeIndex="activeTabIndex">
          <!-- About Tab -->
          <TabPanel header="About">
            <div class="about-section p-4">
              <div class="bg-white rounded-lg shadow-sm p-6">
                <h2 class="text-xl font-bold text-gray-800 mb-6 border-b pb-3">
                  About
                  {{ recruiter.companyName || recruiter.recruiterRepName }}
                </h2>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <!-- Company Information -->
                  <div class="bg-indigo-50/50 rounded-xl p-6">
                    <h3
                      class="text-lg font-semibold text-indigo-800 mb-4 flex items-center"
                    >
                      <i class="pi pi-building mr-2"></i> Company Information
                    </h3>

                    <div class="space-y-4">
                      <div class="flex items-start">
                        <div
                          class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0"
                        >
                          <i class="pi pi-user text-indigo-600 text-sm"></i>
                        </div>
                        <div class="ml-3">
                          <p class="text-gray-500 text-sm">Representative</p>
                          <p class="text-gray-800 font-medium">
                            {{ recruiter.recruiterRepName }}
                          </p>
                        </div>
                      </div>

                      <div class="flex items-start">
                        <div
                          class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0"
                        >
                          <i class="pi pi-tag text-indigo-600 text-sm"></i>
                        </div>
                        <div class="ml-3">
                          <p class="text-gray-500 text-sm">Type</p>
                          <p class="text-gray-800 font-medium">
                            {{ formatRecruiterType(recruiter.recruiterType) }}
                          </p>
                        </div>
                      </div>

                      <div v-if="recruiter.email" class="flex items-start">
                        <div
                          class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0"
                        >
                          <i class="pi pi-envelope text-indigo-600 text-sm"></i>
                        </div>
                        <div class="ml-3">
                          <p class="text-gray-500 text-sm">Email</p>
                          <a
                            :href="`mailto:${recruiter.email}`"
                            class="text-indigo-600 hover:text-indigo-800 font-medium"
                          >
                            {{ recruiter.email }}
                          </a>
                        </div>
                      </div>

                      <div
                        v-if="recruiter.phoneNumber"
                        class="flex items-start"
                      >
                        <div
                          class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0"
                        >
                          <i class="pi pi-phone text-indigo-600 text-sm"></i>
                        </div>
                        <div class="ml-3">
                          <p class="text-gray-500 text-sm">Phone</p>
                          <a
                            :href="`tel:${recruiter.phoneNumber}`"
                            class="text-indigo-600 hover:text-indigo-800 font-medium"
                          >
                            {{ recruiter.phoneNumber }}
                          </a>
                        </div>
                      </div>

                      <div
                        v-if="recruiter.companyWebsite"
                        class="flex items-start"
                      >
                        <div
                          class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0"
                        >
                          <i class="pi pi-globe text-indigo-600 text-sm"></i>
                        </div>
                        <div class="ml-3">
                          <p class="text-gray-500 text-sm">Website</p>
                          <a
                            :href="getWebsiteUrl(recruiter.companyWebsite)"
                            target="_blank"
                            class="text-indigo-600 hover:text-indigo-800 font-medium"
                          >
                            {{ recruiter.companyWebsite }}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Location and Description -->
                  <div>
                    <!-- Location -->
                    <div
                      v-if="hasLocationData"
                      class="bg-indigo-50/50 rounded-xl p-6 mb-6"
                    >
                      <h3
                        class="text-lg font-semibold text-indigo-800 mb-4 flex items-center"
                      >
                        <i class="pi pi-map-marker mr-2"></i> Location
                      </h3>

                      <div class="flex items-start mb-4">
                        <div
                          class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0"
                        >
                          <i class="pi pi-home text-indigo-600 text-sm"></i>
                        </div>
                        <div class="ml-3">
                          <p class="text-gray-800">
                            {{ recruiter.companyLocation?.address }}
                          </p>

                          <a
                            v-if="recruiter.companyLocation?.googleMapsUrl"
                            :href="recruiter.companyLocation.googleMapsUrl"
                            target="_blank"
                            class="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 mt-2 text-sm"
                          >
                            <i class="pi pi-external-link"></i>
                            <span>View on Google Maps</span>
                          </a>
                        </div>
                      </div>
                    </div>

                    <!-- Description -->
                    <div class="bg-indigo-50/50 rounded-xl p-6">
                      <h3
                        class="text-lg font-semibold text-indigo-800 mb-4 flex items-center"
                      >
                        <i class="pi pi-info-circle mr-2"></i> Company
                        Description
                      </h3>

                      <p class="text-gray-700 leading-relaxed">
                        {{
                          recruiter.companyDescription ||
                          'No company description available.'
                        }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabPanel>

          <!-- Portfolio Tab (previously Jobs Posted) -->
          <TabPanel header="Portfolio">
            <div class="portfolio-section p-4">
              <div class="bg-white rounded-lg shadow-sm">
                <!-- Portfolio Header -->
                <div class="p-6 border-b border-gray-100">
                  <h2 class="text-2xl font-bold text-gray-800">Portfolio</h2>
                  <p class="text-gray-600 mt-1">
                    View our past events and projects
                  </p>
                </div>

                <!-- Loading State -->
                <div
                  v-if="loadingPortfolios"
                  class="flex justify-center items-center py-20"
                >
                  <ProgressSpinner
                    class="w-12 h-12"
                    strokeWidth="4"
                    fill="var(--surface-ground)"
                    animationDuration=".5s"
                    aria-label="Loading"
                  />
                </div>

                <!-- Error State -->
                <div v-else-if="portfolioError" class="p-6 text-center">
                  <div
                    class="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4"
                  >
                    <i
                      class="pi pi-exclamation-triangle text-red-500 text-xl"
                    ></i>
                  </div>
                  <h3 class="text-lg font-semibold text-gray-800 mb-2">
                    Unable to load portfolios
                  </h3>
                  <p class="text-gray-600 max-w-md mx-auto">
                    We encountered an error while loading this recruiter's
                    portfolio. Please try again later.
                  </p>
                  <Button
                    label="Retry"
                    icon="pi pi-refresh"
                    class="p-button-outlined mt-4"
                    @click="fetchPortfolios"
                  />
                </div>

                <!-- Empty State -->
                <div v-else-if="!portfolios.length" class="p-10 text-center">
                  <div
                    class="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4"
                  >
                    <i class="pi pi-image text-gray-400 text-2xl"></i>
                  </div>
                  <h3 class="text-xl font-semibold text-gray-800 mb-2">
                    No portfolios yet
                  </h3>
                  <p class="text-gray-600 max-w-md mx-auto">
                    This recruiter hasn't added any portfolio items yet. Check
                    back later for updates.
                  </p>
                </div>

                <!-- Portfolio Grid -->
                <div
                  v-else
                  class="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  <!-- Portfolio Card -->
                  <div
                    v-for="portfolio in portfolios"
                    :key="portfolio.id"
                    class="group bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300"
                    @click="viewPortfolioDetails(portfolio.id)"
                  >
                    <!-- Portfolio Image -->
                    <div
                      class="relative aspect-video overflow-hidden bg-gray-100"
                    >
                      <!-- Actual image if exists -->
                      <img
                        v-if="portfolio.coverImageUrl"
                        :src="getImageUrl(portfolio.coverImageUrl)"
                        :alt="portfolio.eventName"
                        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        @error="onPortfolioImageError($event, portfolio)"
                      />

                      <!-- Fallback gradient background design -->
                      <div
                        v-else
                        class="w-full h-full bg-gradient-to-br from-indigo-600 to-indigo-900 flex items-center justify-center"
                      >
                        <div class="relative w-full h-full overflow-hidden">
                          <!-- Decorative elements -->
                          <div
                            class="absolute top-3 right-3 w-12 h-12 rounded-full bg-white/10"
                          ></div>
                          <div
                            class="absolute bottom-3 left-10 w-8 h-8 rounded-full bg-white/10"
                          ></div>
                          <div
                            class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white"
                          >
                            <i class="pi pi-calendar text-4xl opacity-40"></i>
                          </div>
                          <!-- Event name overlay -->
                          <div
                            class="absolute inset-0 flex items-center justify-center bg-indigo-900/20"
                          >
                            <h4
                              class="text-white font-medium text-lg px-4 py-2 text-center"
                            >
                              {{ portfolio.eventName || 'Untitled Event' }}
                            </h4>
                          </div>
                        </div>
                      </div>

                      <!-- Overlay with info -->
                      <div
                        class="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4"
                      >
                        <p class="text-white text-sm">
                          <span
                            v-if="portfolio.mediaCount"
                            class="flex items-center"
                          >
                            <i class="pi pi-images mr-1"></i>
                            {{ portfolio.mediaCount }} images
                          </span>
                        </p>
                      </div>
                    </div>

                    <!-- Portfolio Info -->
                    <div class="p-4">
                      <h3
                        class="text-lg font-bold text-gray-800 line-clamp-1 group-hover:text-indigo-600 transition-colors"
                      >
                        {{ portfolio.eventName }}
                      </h3>

                      <div class="mt-2 flex items-center text-sm text-gray-500">
                        <span
                          v-if="portfolio.eventStartDate"
                          class="flex items-center"
                        >
                          <i class="pi pi-calendar mr-1"></i>
                          {{
                            formatPortfolioDate(
                              portfolio.eventStartDate,
                              portfolio.eventEndDate
                            )
                          }}
                        </span>
                      </div>

                      <p
                        v-if="portfolio.eventDescription"
                        class="mt-2 text-gray-600 text-sm line-clamp-2"
                      >
                        {{ portfolio.eventDescription }}
                      </p>
                      <p v-else class="mt-2 text-gray-500 text-sm italic">
                        No description
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabPanel>
        </TabView>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Button from 'primevue/button';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import ProgressSpinner from 'primevue/progressspinner';
import axios from 'axios';
import fileService from '@/services/file.service';

const route = useRoute();
const router = useRouter();
const recruiterId = computed(() => route.params.recruiterId);

// State
const recruiter = ref(null);
const loading = ref(true);
const error = ref(null);
const previousJobId = ref(null);
const sourcePage = ref('jobDetails'); // Default source page
const portfolios = ref([]);
const loadingPortfolios = ref(false);
const portfolioError = ref(null);
const selectedPortfolio = ref(null);
const portfolioMedia = ref([]);
const loadingPortfolioDetails = ref(false);
const activeTabIndex = ref(0);

// Default company logo (base64 encoded simple building icon)
const defaultCompanyLogo = ref(
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOWNhM2FmIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgY2xhc3M9ImZlYXRoZXIgZmVhdGhlci1idWlsZGluZyI+PHJlY3QgeD0iNCIgeT0iMiIgd2lkdGg9IjE2IiBoZWlnaHQ9IjIwIiByeD0iMiIgcnk9IjIiPjwvcmVjdD48bGluZSB4MT0iOSIgeTE9IjIiIHgyPSI5IiB5Mj0iMjIiPjwvbGluZT48bGluZSB4MT0iMTUiIHkxPSIyIiB4Mj0iMTUiIHkyPSIyMiI+PC9saW5lPjxsaW5lIHgxPSI0IiB5MT0iMTIiIHgyPSIyMCIgeTI9IjEyIj48L2xpbmU+PC9zdmc+'
);

// Default map image (base64 encoded simple map icon)
const defaultMapImage = ref(
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOWNhM2FmIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHJlY3QgeD0iNCIgeT0iMiIgd2lkdGg9IjE2IiBoZWlnaHQ9IjIwIiByeD0iMiIgcnk9IjIiPjwvcmVjdD48bGluZSB4MT0iMTIiIHkxPSI2IiB4Mj0iMTIiIHkyPSIxOCI+PC9saW5lPjxsaW5lIHgxPSI2IiB5MT0iMTIiIHgyPSIxOCIgeTI9IjEyIj48L2xpbmU+PC9zdmc+'
);

// Function to get a map image URL from the location
const getMapImageUrl = (location) => {
  if (!location || !location.latitude || !location.longitude) {
    return defaultMapImage.value;
  }

  // Use Google Static Maps API or similar if available
  // For now, return default image
  return defaultMapImage.value;
};

// Function to format recruiter type
const formatRecruiterType = (type) => {
  if (!type) return '';

  return type.charAt(0) + type.slice(1).toLowerCase();
};

// Function to format verification status
const formatVerificationStatus = (status) => {
  if (!status) return 'Unknown';

  switch (status) {
    case 'PENDING':
      return 'Pending Verification';
    case 'VERIFIED':
      return 'Verified';
    case 'REJECTED':
      return 'Verification Rejected';
    default:
      return status.charAt(0) + status.slice(1).toLowerCase();
  }
};

// Function to get proper website URL
const getWebsiteUrl = (website) => {
  if (!website) return '#';

  if (!website.startsWith('http://') && !website.startsWith('https://')) {
    return `https://${website}`;
  }

  return website;
};

// Function to get proper image URL
const getImageUrl = (url) => {
  if (!url) return null;

  // If it's already a data URL (base64), return as is
  if (url.startsWith('data:')) {
    return url;
  }

  // If it's a company logo
  if (
    url.includes('company-logos') ||
    url.includes('companyLogo') ||
    (recruiter.value && url === recruiter.value.companyLogoUrl)
  ) {
    try {
      return fileService.getCompanyLogoUrl(url);
    } catch (error) {
      console.error('Error loading company logo:', error);
      return defaultCompanyLogo.value;
    }
  }

  // For portfolio-media URLs, use fileService
  if (url.includes('portfolio-media')) {
    try {
      // Extract the filename
      const filename = url.split('/').pop();
      // Use fileService to get the correct backend URL
      return fileService.getPortfolioMediaUrl(filename);
    } catch (error) {
      console.error('Error loading portfolio image:', error);
      // Return default portfolio image
      return 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOWNhM2FmIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHJlY3QgeD0iMyIgeT0iMyIgd2lkdGg9IjE4IiBoZWlnaHQ9IjE4IiByeD0iMiIgcnk9IjIiPjwvcmVjdD48Y2lyY2xlIGN4PSI4LjUiIGN5PSI4LjUiIHI9IjEuNSI+PC9jaXJjbGU+PHBvbHlsaW5lIHBvaW50cz0iMjEgMTUgMTYgMTAgNSAyMSI+PC9wb2x5bGluZT48L3N2Zz4=';
    }
  }

  // If it's a path starting with http(s), return as is
  if (url.startsWith('http')) {
    return url;
  }

  // If it's a path we know is for a company logo, use the company logo service
  if (
    url.includes('/profile-pictures/') ||
    (recruiter.value && recruiter.value.companyLogoUrl === url)
  ) {
    try {
      // Extract just the filename
      const filename = url.split('/').pop();
      return fileService.getCompanyLogoUrl(filename);
    } catch (error) {
      console.error('Error loading from company logo service:', error);
      return defaultCompanyLogo.value;
    }
  }

  // For other relative URLs, try to load from the backend
  try {
    if (url.startsWith('/')) {
      return `http://localhost:8080${url}`;
    } else {
      return `http://localhost:8080/${url}`;
    }
  } catch (error) {
    console.error('Error loading image from backend:', error);
    // If all else fails, use the original URL (may be a server path)
    return url;
  }
};

// Handle image loading errors
const onImageError = (event) => {
  console.log('Image failed to load:', event.target.src);

  // Check if it's a company logo by looking at the alt text or parent container
  if (event.target.alt && event.target.alt.includes('logo')) {
    event.target.src = defaultCompanyLogo.value;
  } else {
    // For other images, use a generic error image
    event.target.src =
      'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOWNhM2FmIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHJlY3QgeD0iNCIgeT0iMiIgd2lkdGg9IjE2IiBoZWlnaHQ9IjIwIiByeD0iMiIgcnk9IjIiPjwvcmVjdD48bGluZSB4MT0iOSIgeTE9IjIiIHgyPSI5IiB5Mj0iMjIiPjwvbGluZT48bGluZSB4MT0iMTUiIHkxPSIyIiB4Mj0iMTUiIHkyPSIyMiI+PC9saW5lPjxsaW5lIHgxPSI0IiB5MT0iMTIiIHgyPSIyMCIgeTI9IjEyIj48L2xpbmU+PC9zdmc+';
  }
};

// Check if we have a previous job ID stored in query params or sessionStorage
onMounted(() => {
  // Get the previous job ID from query parameters or session storage
  previousJobId.value =
    route.query.jobId || sessionStorage.getItem('lastViewedJobId');

  // Determine source page
  sourcePage.value = route.query.source || 'jobDetails';

  // Set active tab based on query parameter
  if (route.query.activeTab === 'portfolio') {
    activeTabIndex.value = 1; // Portfolio tab is at index 1
  }

  // Fetch recruiter data
  fetchRecruiterData();
});

// Function to navigate back to the previous job details or to the jobs listing
const goBack = () => {
  if (sourcePage.value === 'applications') {
    // If coming from applications page
    router.push({ name: 'MyApplications' });
  } else if (previousJobId.value) {
    // If coming from job details with a known job ID
    router.push({
      name: 'FindJobs',
      query: {
        showJob: previousJobId.value,
      },
    });
  } else {
    // Default fallback
    router.back();
  }
};

// Function to fetch portfolios
const fetchPortfolios = async () => {
  if (!recruiter.value || !recruiter.value.id) return;

  loadingPortfolios.value = true;
  portfolioError.value = null;

  try {
    const apiUrl = `http://localhost:8080/api/public/recruiters/${recruiter.value.id}/portfolios`;
    const response = await axios.get(apiUrl);

    if (response.data && response.data.data) {
      portfolios.value = response.data.data;

      // Process portfolio image URLs
      portfolios.value = portfolios.value.map((portfolio) => {
        if (portfolio.coverImageUrl) {
          try {
            portfolio.coverImageUrl = fileService.getPortfolioMediaUrl(
              portfolio.coverImageUrl
            );
          } catch (error) {
            console.warn('Error processing portfolio image URL:', error);
          }
        }
        return portfolio;
      });
    } else {
      throw new Error('Invalid response format');
    }
  } catch (err) {
    console.error('Error loading portfolios:', err);
    portfolioError.value = err.message || 'Failed to load portfolio data';

    // For development - mock data
    if (process.env.NODE_ENV === 'development') {
      portfolios.value = [
        {
          id: 1,
          eventName: 'Summer Product Launch 2025',
          eventStartDate: null,
          eventEndDate: null,
          eventDescription:
            'A successful product launch event showcasing our latest innovations.',
          uploadedAt: '2025-04-13T00:41:54.555495',
          coverImageUrl:
            '/portfolio-media/cc61c36b-08f5-43b3-bee6-773f9dc34f8b.png',
          mediaCount: 6,
        },
        {
          id: 2,
          eventName: 'Tech Conference 2025',
          eventStartDate: '2025-03-15T00:00:00',
          eventEndDate: '2025-03-17T00:00:00',
          eventDescription:
            'Annual tech conference with industry leaders and innovative showcases.',
          uploadedAt: '2025-04-10T14:22:12.123456',
          coverImageUrl: '/portfolio-media/tech-conference.jpg',
          mediaCount: 12,
        },
        {
          id: 3,
          eventName: 'Recruitment Drive - University Malaya',
          eventStartDate: '2025-02-20T00:00:00',
          eventEndDate: '2025-02-20T00:00:00',
          eventDescription:
            'Campus recruitment event targeting top talent in engineering and business.',
          uploadedAt: '2025-03-01T09:30:00.000000',
          coverImageUrl: '/portfolio-media/recruitment-drive.jpg',
          mediaCount: 8,
        },
      ];

      // Process mock portfolio image URLs
      portfolios.value = portfolios.value.map((portfolio) => {
        if (portfolio.coverImageUrl) {
          try {
            portfolio.coverImageUrl = fileService.getPortfolioMediaUrl(
              portfolio.coverImageUrl
            );
          } catch (error) {
            console.warn('Error processing mock portfolio image URL:', error);
          }
        }
        return portfolio;
      });

      portfolioError.value = null;
    }
  } finally {
    loadingPortfolios.value = false;
  }
};

// Function to view portfolio details
const viewPortfolioDetails = async (portfolioId) => {
  selectedPortfolio.value = portfolios.value.find((p) => p.id === portfolioId);
  loadingPortfolioDetails.value = true;

  try {
    const apiUrl = `http://localhost:8080/api/public/recruiters/${recruiter.value.id}/portfolios/${portfolioId}`;
    const response = await axios.get(apiUrl);

    if (response.data && response.data.data) {
      // Update the selected portfolio with full details
      selectedPortfolio.value = response.data.data;
      portfolioMedia.value = response.data.data.eventMedia || [];
    } else {
      throw new Error('Invalid response format');
    }

    // Here you would navigate to the portfolio detail page or open a modal
    // For simplicity in this implementation, we're just logging the data
    console.log('Portfolio details:', selectedPortfolio.value);
    router.push({
      name: 'PortfolioDetail',
      params: {
        recruiterId: recruiter.value.id,
        portfolioId: portfolioId,
      },
    });
  } catch (err) {
    console.error('Error loading portfolio details:', err);
    // Handle error, show notification, etc.
  } finally {
    loadingPortfolioDetails.value = false;
  }
};

// Format date for portfolio
const formatPortfolioDate = (startDate, endDate) => {
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

// Format relative time
const formatRelativeTime = (dateString) => {
  if (!dateString) return '';

  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now - date;
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    return 'Today';
  } else if (diffInDays === 1) {
    return 'Yesterday';
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
};

// Update the onPortfolioImageError function in the script section
const onPortfolioImageError = (event, portfolio) => {
  console.log('Portfolio image failed to load:', event.target.src);
  // Create a fallback design instead of using a placeholder image
  const imageContainer = event.target.parentElement;
  if (imageContainer) {
    event.target.style.display = 'none';

    // Create gradient background element
    const fallbackDiv = document.createElement('div');
    fallbackDiv.className =
      'w-full h-full bg-gradient-to-br from-indigo-600 to-indigo-900 flex items-center justify-center';

    // Add the event name
    fallbackDiv.innerHTML = `
      <div class="relative w-full h-full overflow-hidden">
        <div class="absolute top-3 right-3 w-12 h-12 rounded-full bg-white/10"></div>
        <div class="absolute bottom-3 left-10 w-8 h-8 rounded-full bg-white/10"></div>
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white">
          <i class="pi pi-calendar text-4xl opacity-40"></i>
        </div>
        <div class="absolute inset-0 flex items-center justify-center bg-indigo-900/20">
          <h4 class="text-white font-medium text-lg px-4 py-2 text-center">
            ${portfolio?.eventName || 'Untitled Event'}
          </h4>
        </div>
      </div>
    `;

    imageContainer.appendChild(fallbackDiv);
  }
};

// Fetch recruiter data from API
const fetchRecruiterData = async () => {
  loading.value = true;
  error.value = null;

  try {
    // API URL with the recruiter ID from route params
    const apiUrl = `http://localhost:8080/api/public/recruiters/${recruiterId.value}`;
    console.log(`Fetching recruiter data from: ${apiUrl}`);

    // Make the API call
    const response = await axios.get(apiUrl);

    // Check if response has the expected structure
    if (response.data && response.data.data) {
      recruiter.value = response.data.data;

      // Process company logo URL if exists
      if (recruiter.value.companyLogoUrl) {
        try {
          // Pre-process the company logo URL to ensure it's correctly formatted
          recruiter.value.companyLogoUrl = fileService.getCompanyLogoUrl(
            recruiter.value.companyLogoUrl
          );
        } catch (logoError) {
          console.warn('Error processing company logo URL:', logoError);
        }
      }

      console.log('Recruiter data loaded:', recruiter.value);
    } else {
      throw new Error('Invalid response format');
    }
  } catch (err) {
    console.error('Error loading recruiter data:', err);
    error.value = err.message || 'Failed to load recruiter information';

    // Optional: Fallback to mock data in development environment
    if (process.env.NODE_ENV === 'development') {
      console.warn('Using mock data as fallback');
      recruiter.value = {
        id: recruiterId.value,
        recruiterRepName: 'Recruiter Test',
        recruiterType: 'COMPANY',
        email: 'recruiter@gmail.com',
        phoneNumber: '0123456789',
        companyName: 'Insight Recruitment',
        companyLogoUrl: '/company-logos/company-logo-insight.png', // Updated path for consistency
        companyDescription: 'Insight Recruitment testing description',
        companyLocation: {
          id: 2,
          name: 'Kuala Lumpur',
          address: 'Kuala Lumpur, Federal Territory of Kuala Lumpur, Malaysia',
          city: 'Kuala Lumpur',
          state: 'Federal Territory of Kuala Lumpur',
          country: 'Malaysia',
          postalCode: '',
          latitude: 3.1499222,
          longitude: 101.6944619,
          placeId: 'ChIJ5-rvAcdJzDERfSgcL1uO2fQ',
          googleMapsUrl:
            'https://www.google.com/maps/place/?q=place_id:ChIJ5-rvAcdJzDERfSgcL1uO2fQ',
          distanceFromUser: null,
        },
        companyWebsite: 'https://insight.com',
        verificationStatus: 'PENDING',
      };

      // Process company logo URL for mock data too
      if (recruiter.value.companyLogoUrl) {
        try {
          recruiter.value.companyLogoUrl = fileService.getCompanyLogoUrl(
            recruiter.value.companyLogoUrl
          );
        } catch (logoError) {
          console.warn('Error processing mock company logo URL:', logoError);
        }
      }

      error.value = null; // Clear error if using mock data
    }
  } finally {
    loading.value = false;
  }
};

// Computed value to check if location data exists
const hasLocationData = computed(() => {
  return (
    recruiter.value &&
    recruiter.value.companyLocation &&
    (recruiter.value.companyLocation.city ||
      recruiter.value.companyLocation.address ||
      recruiter.value.companyLocation.country)
  );
});

// Fetch portfolios when the recruiter data is loaded
watch(
  () => recruiter.value,
  (newValue) => {
    if (newValue && newValue.id) {
      fetchPortfolios();
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.recruiter-info-container {
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: 2rem;
}

/* Tab styling */
:deep(.p-tabview .p-tabview-nav) {
  border-bottom: 2px solid #f1f5f9;
}

:deep(.p-tabview .p-tabview-nav li .p-tabview-nav-link) {
  border: none;
  color: #64748b;
  padding: 1rem 1.5rem;
  font-weight: 600;
  transition: all 0.2s;
}

:deep(.p-tabview .p-tabview-nav li.p-highlight .p-tabview-nav-link) {
  border-bottom: 2px solid #4f46e5;
  color: #4f46e5;
}

:deep(
    .p-tabview
      .p-tabview-nav
      li:not(.p-highlight):not(.p-disabled):hover
      .p-tabview-nav-link
  ) {
  color: #334155;
  border-bottom: 2px solid #94a3b8;
}

:deep(.p-tabview-panels) {
  padding: 0;
}
</style>
