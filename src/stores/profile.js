import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useAuthStore } from './auth';
import candidateService from '../services/candidate.service';
// Recruiter service will be added later when needed

export const useProfileStore = defineStore('profile', () => {
  // State
  const profile = ref(null);
  const loading = ref(false);
  const error = ref(null);
  const authStore = useAuthStore();

  // Getters
  const isProfileLoaded = computed(() => !!profile.value);
  const profileType = computed(() => authStore.userRole);
  const profileName = computed(() => {
    if (!profile.value) return '';
    return profileType.value === 'CANDIDATE'
      ? profile.value.name
      : profile.value.recruiterRepName;
  });

  // Actions
  async function fetchProfile() {
    loading.value = true;
    error.value = null;
    try {
      let response;
      if (profileType.value === 'CANDIDATE') {
        response = await candidateService.getProfile();
      } else {
        console.warn('Recruiter profiles not yet implemented');
        response = { data: { data: null } };
      }

      profile.value = response.data.data;
      return response;
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch profile';
      throw error.value;
    } finally {
      loading.value = false;
    }
  }

  async function updateProfile(profileData) {
    console.log(
      'ProfileStore: Starting profile update with data:',
      profileData
    );
    loading.value = true;
    error.value = null;

    try {
      let response;

      if (profileType.value === 'CANDIDATE') {
        console.log('ProfileStore: Updating candidate profile');
        response = await candidateService.updateProfile(profileData);

        // Log response for debugging
        console.log('ProfileStore: Update successful, response:', response);

        // Check response structure to extract the correct data
        let updatedProfileData;
        if (response.data?.data) {
          // API returns data in a nested data property
          updatedProfileData = response.data.data;
          console.log('ProfileStore: Using nested data from response');
        } else if (response.data) {
          // API returns data directly
          updatedProfileData = response.data;
          console.log('ProfileStore: Using direct data from response');
        } else {
          // Fallback to the provided data if response is empty
          updatedProfileData = profileData;
          console.log('ProfileStore: Using provided data (no response data)');
        }

        // Update local profile data
        profile.value = { ...profile.value, ...updatedProfileData };
        console.log('ProfileStore: Updated profile value:', profile.value);
      } else {
        console.warn('Recruiter profiles not yet implemented');
        // Still update local state for UI consistency in dev environment
        profile.value = { ...profile.value, ...profileData };
        response = { data: { data: null } };
      }

      return response;
    } catch (err) {
      console.error('ProfileStore: Update failed with error:', err);

      // Extract the most useful error message
      if (err.response?.data?.message) {
        error.value = err.response.data.message;
      } else if (err.response?.data) {
        error.value = JSON.stringify(err.response.data);
      } else if (err.message) {
        error.value = err.message;
      } else {
        error.value = 'Failed to update profile';
      }

      throw error.value;
    } finally {
      loading.value = false;
    }
  }

  function clearProfile() {
    profile.value = null;
    error.value = null;
  }

  function setProfile(profileData) {
    profile.value = profileData;
    error.value = null;
  }

  return {
    // State
    profile,
    loading,
    error,

    // Getters
    isProfileLoaded,
    profileType,
    profileName,

    // Actions
    fetchProfile,
    updateProfile,
    clearProfile,
    setProfile,
  };
});
