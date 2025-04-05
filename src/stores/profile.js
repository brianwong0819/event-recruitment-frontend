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
    loading.value = true;
    error.value = null;
    try {
      let response;
      if (profileType.value === 'CANDIDATE') {
        response = await candidateService.updateProfile(profileData);
      } else {
        console.warn('Recruiter profiles not yet implemented');
        response = { data: { data: null } };
      }

      // Update local profile data
      profile.value = { ...profile.value, ...profileData };

      return response;
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to update profile';
      throw error.value;
    } finally {
      loading.value = false;
    }
  }

  function clearProfile() {
    profile.value = null;
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
  };
});
