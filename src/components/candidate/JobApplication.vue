<template>
  <div class="job-application-container">
    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="loading-animation">
        <ProgressSpinner style="width: 60px; height: 60px" strokeWidth="4" />
      </div>
      <p class="loading-text">Loading job details...</p>
    </div>

    <div v-else>
      <!-- Main Content -->
      <div class="card-container">
        <!-- Header Section with Company Logo -->
        <div class="app-header">
          <div class="company-banner">
            <div class="company-logo-container">
              <img
                v-if="job.companyLogoUrl"
                :src="job.companyLogoUrl"
                :alt="`${job.company} logo`"
                class="company-logo"
                @error="$event.target.src = defaultCompanyLogo"
              />
              <i v-else class="pi pi-building company-logo-fallback"></i>
            </div>
            <div class="company-info">
              <h1 class="job-title">{{ job.title }}</h1>
              <div class="company-location">
                <span class="company-name">{{ job.company }}</span>
                <span class="divider">|</span>
                <span class="location">{{ job.location }}</span>
              </div>
            </div>
          </div>

          <div class="job-tags">
            <Tag :value="job.type" class="tag-type" />
            <Tag :value="formatSalary(job.salary)" class="tag-salary" />
            <Tag
              :value="`${job.availablePositions} positions`"
              class="tag-positions"
            />
          </div>
        </div>

        <!-- Content Sections -->
        <div class="app-content">
          <!-- Two columns on desktop, single column on mobile -->
          <div class="content-grid">
            <!-- Left Column: Job & Event Details -->
            <div class="content-section">
              <!-- Key Details Card -->
              <Card class="details-card">
                <template #title>
                  <div class="card-title">
                    <i class="pi pi-calendar-plus title-icon"></i>
                    <span>Event Details</span>
                  </div>
                </template>
                <template #content>
                  <div class="details-grid">
                    <!-- Dates -->
                    <div class="detail-item">
                      <div class="detail-icon">
                        <i class="pi pi-calendar"></i>
                      </div>
                      <div class="detail-content">
                        <h3>Working Dates</h3>
                        <p>{{ job.dates }}</p>
                      </div>
                    </div>

                    <!-- Hours -->
                    <div class="detail-item">
                      <div class="detail-icon">
                        <i class="pi pi-clock"></i>
                      </div>
                      <div class="detail-content">
                        <h3>Working Hours</h3>
                        <p v-if="job.schedules && job.schedules.length > 0">
                          {{
                            formatTimeRange(
                              job.schedules[0].startTime,
                              job.schedules[0].endTime
                            )
                          }}
                        </p>
                        <p v-else>Hours to be confirmed</p>
                      </div>
                    </div>

                    <!-- Payment -->
                    <div class="detail-item">
                      <div class="detail-icon">
                        <i class="pi pi-dollar"></i>
                      </div>
                      <div class="detail-content">
                        <h3>Payment Terms</h3>
                        <p>{{ job.paymentTerms || 'To be discussed' }}</p>
                      </div>
                    </div>

                    <!-- Location -->
                    <div class="detail-item">
                      <div class="detail-icon">
                        <i class="pi pi-map-marker"></i>
                      </div>
                      <div class="detail-content">
                        <h3>Location</h3>
                        <p>{{ job.fullAddress || job.location }}</p>
                        <a
                          v-if="job.googleMapsUrl"
                          :href="job.googleMapsUrl"
                          target="_blank"
                          class="map-link"
                        >
                          <i class="pi pi-external-link"></i> View on Google
                          Maps
                        </a>
                      </div>
                    </div>

                    <!-- Notes -->
                    <div v-if="job.locationNotes" class="detail-item notes">
                      <div class="detail-icon">
                        <i class="pi pi-info-circle"></i>
                      </div>
                      <div class="detail-content">
                        <h3>Important Notes</h3>
                        <p>{{ job.locationNotes }}</p>
                      </div>
                    </div>
                  </div>
                </template>
              </Card>

              <!-- Benefits Card -->
              <Card class="details-card benefits-card">
                <template #title>
                  <div class="card-title">
                    <i class="pi pi-star-fill title-icon benefits-icon"></i>
                    <span>Benefits</span>
                  </div>
                </template>
                <template #content>
                  <ul class="benefits-list">
                    <li
                      v-for="(benefit, index) in job.benefits"
                      :key="index"
                      class="benefit-item"
                    >
                      <i class="pi pi-check-circle"></i>
                      <span>{{ benefit }}</span>
                    </li>
                    <li
                      v-if="!job.benefits || job.benefits.length === 0"
                      class="empty-state"
                    >
                      <i class="pi pi-info-circle"></i>
                      <span>No specific benefits listed</span>
                    </li>
                  </ul>
                </template>
              </Card>
            </div>

            <!-- Right Column: Requirements & Application -->
            <div class="content-section">
              <!-- Requirements Card -->
              <Card class="details-card requirements-card">
                <template #title>
                  <div class="card-title">
                    <i
                      class="pi pi-check-square title-icon requirements-icon"
                    ></i>
                    <span>Requirements</span>
                  </div>
                </template>
                <template #content>
                  <ul class="requirements-list">
                    <li
                      v-for="(req, index) in job.requirements"
                      :key="index"
                      class="requirement-item"
                    >
                      <i class="pi pi-check"></i>
                      <span>{{ req }}</span>
                    </li>
                    <li
                      v-if="!job.requirements || job.requirements.length === 0"
                      class="empty-state"
                    >
                      <i class="pi pi-info-circle"></i>
                      <span>No specific requirements listed</span>
                    </li>
                  </ul>
                </template>
              </Card>

              <!-- AI Ranking System Card -->
              <Card class="ai-ranking-card">
                <template #title>
                  <div class="card-title">
                    <i class="pi pi-cog title-icon ai-icon"></i>
                    <span>AI Application Ranking</span>
                  </div>
                </template>
                <template #content>
                  <div class="ranking-content">
                    <div class="ranking-header">
                      <Avatar
                        icon="pi pi-star"
                        class="ranking-avatar"
                        size="large"
                      />
                      <p>Your application will be ranked based on:</p>
                    </div>

                    <div class="ranking-factors">
                      <div class="factor">
                        <i class="pi pi-user-plus"></i>
                        <span>Profile completeness</span>
                      </div>
                      <div class="factor">
                        <i class="pi pi-briefcase"></i>
                        <span>Relevant experience</span>
                      </div>
                      <div class="factor">
                        <i class="pi pi-chart-line"></i>
                        <span>Past performance</span>
                      </div>
                      <div class="factor">
                        <i class="pi pi-calendar-check"></i>
                        <span>Availability match</span>
                      </div>
                    </div>

                    <div class="ranking-tip">
                      <i class="pi pi-info-circle"></i>
                      <p>Complete your profile to increase your chances!</p>
                    </div>
                  </div>
                </template>
              </Card>
            </div>
          </div>

          <!-- Full Width Section for Important Notices -->
          <div class="full-width-section">
            <!-- Reputation System Card -->
            <Card class="reputation-card">
              <template #title>
                <div class="card-title">
                  <i class="pi pi-shield title-icon reputation-icon"></i>
                  <span>Candidate Reputation System</span>
                </div>
              </template>
              <template #content>
                <div class="reputation-content">
                  <div class="reputation-header">
                    <i class="pi pi-exclamation-triangle"></i>
                    <p>
                      Cancellations and no-shows affect your reputation score
                      differently based on job status.
                    </p>
                  </div>

                  <div class="reputation-stages">
                    <div class="reputation-stage before-confirmation">
                      <div class="stage-header">
                        <i class="pi pi-info-circle"></i>
                        <h3>Before Job Confirmation</h3>
                      </div>
                      <div class="stage-content">
                        <p>
                          You may withdraw your application without any impact
                          on your reputation score. Recruiters have not yet
                          confirmed your assignment.
                        </p>
                      </div>
                    </div>

                    <div class="reputation-stage after-confirmation">
                      <div class="stage-header">
                        <i class="pi pi-exclamation-circle"></i>
                        <h3>After Job Confirmation</h3>
                      </div>
                      <div class="stage-content">
                        <p>
                          Once a recruiter has confirmed your assignment, you
                          are expected to attend as scheduled. Cancellations
                          after confirmation, especially within 48 hours of the
                          event, will significantly impact your reputation score
                          and affect future job opportunities.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div class="reputation-warning">
                    <i class="pi pi-exclamation-triangle"></i>
                    <p>
                      Only apply if you're certain you can commit to the event
                      dates if selected.
                    </p>
                  </div>
                </div>
              </template>
            </Card>

            <!-- Profile Completeness Card -->
            <Card class="profile-completeness-card">
              <template #title>
                <div class="card-title">
                  <i class="pi pi-user-edit title-icon profile-icon"></i>
                  <span>Profile Completeness Check</span>
                </div>
              </template>
              <template #content>
                <div class="profile-content">
                  <p class="profile-intro">
                    Before proceeding, ensure your profile is complete to
                    maximize your chances:
                  </p>

                  <div class="completeness-checks">
                    <div
                      class="check-item"
                      :class="{ incomplete: !profileInfo.photo }"
                    >
                      <div class="check-status">
                        <i
                          class="pi"
                          :class="
                            profileInfo.photo
                              ? 'pi-check-circle'
                              : 'pi-times-circle'
                          "
                        ></i>
                      </div>
                      <div class="check-details">
                        <span class="check-label">Profile Photo</span>
                        <span class="check-message" v-if="!profileInfo.photo"
                          >Missing - Add a professional photo</span
                        >
                        <span class="check-message" v-else>Uploaded</span>
                      </div>
                    </div>

                    <div
                      class="check-item"
                      :class="{ incomplete: !profileInfo.resume }"
                    >
                      <div class="check-status">
                        <i
                          class="pi"
                          :class="
                            profileInfo.resume
                              ? 'pi-check-circle'
                              : 'pi-times-circle'
                          "
                        ></i>
                      </div>
                      <div class="check-details">
                        <span class="check-label">Resume</span>
                        <span class="check-message" v-if="!profileInfo.resume"
                          >Missing - Upload your resume</span
                        >
                        <span class="check-message" v-else>Uploaded</span>
                      </div>
                    </div>

                    <div
                      class="check-item"
                      :class="{ incomplete: !profileInfo.experience }"
                    >
                      <div class="check-status">
                        <i
                          class="pi"
                          :class="
                            profileInfo.experience
                              ? 'pi-check-circle'
                              : 'pi-times-circle'
                          "
                        ></i>
                      </div>
                      <div class="check-details">
                        <span class="check-label">Work Experience</span>
                        <span
                          class="check-message"
                          v-if="!profileInfo.experience"
                          >Missing - Add your work experience</span
                        >
                        <span class="check-message" v-else>Added</span>
                      </div>
                    </div>
                  </div>

                  <div v-if="!profileComplete" class="profile-action">
                    <Button
                      label="Complete Your Profile"
                      icon="pi pi-user-edit"
                      @click="navigateToProfile"
                    />
                  </div>
                </div>
              </template>
            </Card>

            <!-- Confirmation & Submit Section -->
            <Card class="confirmation-card">
              <template #title>
                <div class="card-title">
                  <i
                    class="pi pi-check-circle title-icon confirmation-icon"
                  ></i>
                  <span>Confirmation</span>
                </div>
              </template>
              <template #content>
                <div class="confirmation-content">
                  <div class="confirmation-items">
                    <div class="confirmation-item">
                      <Checkbox
                        v-model="confirmAvailability"
                        :binary="true"
                        inputId="confirmAvailability"
                      />
                      <label for="confirmAvailability"
                        >I confirm that I am available for all the dates and
                        times specified for this job.</label
                      >
                    </div>

                    <div class="confirmation-item">
                      <Checkbox
                        v-model="confirmCancel"
                        :binary="true"
                        inputId="confirmCancel"
                      />
                      <label for="confirmCancel"
                        >I understand that cancellations after job confirmation,
                        especially within 48 hours of the event, will
                        significantly impact my reputation score.</label
                      >
                    </div>

                    <div class="confirmation-item">
                      <Checkbox
                        v-model="confirmTerms"
                        :binary="true"
                        inputId="confirmTerms"
                      />
                      <label for="confirmTerms"
                        >I agree to the
                        <a href="#" class="terms-link">terms and conditions</a>
                        for this job application.</label
                      >
                    </div>
                  </div>

                  <div class="action-buttons">
                    <Button
                      label="Cancel"
                      icon="pi pi-times"
                      class="cancel-button p-button-outlined"
                      @click="cancelApplication"
                    />
                    <Button
                      label="Submit Application"
                      icon="pi pi-send"
                      class="submit-button"
                      :disabled="
                        !confirmAvailability || !confirmCancel || !confirmTerms
                      "
                      :loading="submitting"
                      @click="submitApplication"
                    />
                  </div>
                </div>
              </template>
            </Card>
          </div>
        </div>
      </div>

      <!-- Success Dialog -->
      <Dialog
        v-model:visible="applicationSubmitted"
        modal
        :closable="false"
        :dismissableMask="false"
        :style="{ width: '30rem' }"
        class="success-dialog"
      >
        <template #header>
          <div class="success-header">
            <i class="pi pi-check-circle"></i>
            <h2>Application Submitted!</h2>
          </div>
        </template>

        <div class="success-content">
          <p class="success-message">
            Your application for <strong>{{ job.title }}</strong> at
            <strong>{{ job.company }}</strong> has been successfully submitted.
          </p>

          <div class="reference-number">
            <i class="pi pi-id-card"></i>
            <span>Reference Number: #{{ applicationId }}</span>
          </div>

          <div class="next-steps">
            <h3><i class="pi pi-directions"></i> What's Next?</h3>
            <p>
              The recruiter will review your application and our AI will rank it
              against other candidates. You'll receive a notification if you're
              selected for this position.
            </p>
          </div>
        </div>

        <template #footer>
          <div class="success-actions">
            <Button
              label="Back to Jobs"
              icon="pi pi-search"
              class="p-button-outlined"
              @click="backToJobSearch"
            />
            <Button
              label="View Dashboard"
              icon="pi pi-home"
              @click="viewDashboard"
            />
          </div>
        </template>
      </Dialog>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  reactive,
  onMounted,
  defineProps,
  defineEmits,
  computed,
} from 'vue';
import { useRouter } from 'vue-router';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Checkbox from 'primevue/checkbox';
import Panel from 'primevue/panel';
import Tag from 'primevue/tag';
import ProgressSpinner from 'primevue/progressspinner';
import JobService from '@/services/JobService';
import axios from 'axios';
import Dialog from 'primevue/dialog';
import Card from 'primevue/card';
import Avatar from 'primevue/avatar';

const props = defineProps({
  jobId: {
    type: String,
    required: true,
  },
});

const emits = defineEmits(['cancel']);

// Job data
const job = ref({});
const loading = ref(true);
const submitting = ref(false);
const applicationSubmitted = ref(false);
const applicationId = ref('APP' + Math.floor(Math.random() * 1000000));

// Confirmation checkboxes
const confirmAvailability = ref(false);
const confirmCancel = ref(false);
const confirmTerms = ref(false);

// Default company logo (fallback)
const defaultCompanyLogo =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOWNhM2FmIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgY2xhc3M9ImZlYXRoZXIgZmVhdGhlci1idWlsZGluZyI+PHJlY3QgeD0iNCIgeT0iMiIgd2lkdGg9IjE2IiBoZWlnaHQ9IjIwIiByeD0iMiIgcnk9IjIiPjwvcmVjdD48bGluZSB4MT0iOSIgeTE9IjIiIHgyPSI5IiB5Mj0iMjIiPjwvbGluZT48bGluZSB4MT0iMTUiIHkxPSIyIiB4Mj0iMTUiIHkyPSIyMiI+PC9saW5lPjxsaW5lIHgxPSI0IiB5MT0iMTIiIHgyPSIyMCIgeTI9IjEyIj48L2xpbmU+PC9zdmc+';

// Router for navigation
const router = useRouter();

// Profile information check
const profileInfo = reactive({
  photo: false,
  resume: false,
  experience: false,
});

// Check if profile is complete
const profileComplete = computed(() => {
  return profileInfo.photo && profileInfo.resume && profileInfo.experience;
});

// Fetch job data
const fetchJobData = async () => {
  loading.value = true;
  try {
    // mock data for fallback
    await new Promise((resolve) => setTimeout(resolve, 500));

    job.value = {
      id: props.jobId,
      title: 'Event Coordinator',
      company: 'GlobalEvents Ltd',
      companyLogoUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
      location: 'London, UK',
      fullAddress: '25 Exhibition Road, Kensington, London SW7 2PA',
      googleMapsUrl: 'https://maps.google.com',
      locationNotes:
        'Staff entrance is at the back of the building. Check in at security desk.',
      salary: '£150-200 per day',
      paymentTerms:
        'Payment within 7 days after event completion via bank transfer',
      type: 'Temporary',
      dates: 'March 15-20, 2023',
      availablePositions: 5,
      schedules: [
        {
          startDate: '2023-03-15',
          endDate: '2023-03-20',
          startTime: '09:00:00',
          endTime: '18:00:00',
          hoursOfRestTime: 1.5,
        },
      ],
      requirements: [
        'Previous experience in event coordination',
        'Excellent communication skills',
        'Ability to work under pressure',
        'Problem-solving skills',
      ],
      benefits: [
        'Competitive daily rate',
        'Networking opportunities',
        'Meal allowance',
        'Transportation allowance',
      ],
    };

    // Check user profile completeness
    await checkProfileCompleteness();
  } catch (error) {
    console.error('Error fetching job data:', error);
  } finally {
    loading.value = false;
  }
};

// Check profile completeness
const checkProfileCompleteness = async () => {
  try {
    // In a real app, this would call an API to get profile status
    // Here we'll simulate a check with some mock data

    // Get user data from localStorage if available
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        // Check if user has a photo
        profileInfo.photo = !!user.photoUrl;
        // Check if user has a resume
        profileInfo.resume = !!user.resumeUrl;
        // Check if user has experience entries
        profileInfo.experience = user.experience && user.experience.length > 0;
      } catch (e) {
        console.error('Error parsing user data', e);
      }
    }

    // For demo purposes, we'll set some mock values if not found in localStorage
    if (!userStr) {
      // Mock values for demonstration
      profileInfo.photo = Math.random() > 0.5;
      profileInfo.resume = Math.random() > 0.3;
      profileInfo.experience = Math.random() > 0.4;
    }
  } catch (error) {
    console.error('Error checking profile completeness:', error);
  }
};

// Format salary from string
const formatSalary = (salary) => {
  return salary || 'Salary not specified';
};

// Format time range
const formatTimeRange = (startTime, endTime) => {
  if (!startTime || !endTime) return 'Hours to be confirmed';

  try {
    const formatTime = (timeString) => {
      const [hours, minutes] = timeString.split(':');
      const date = new Date();
      date.setHours(parseInt(hours, 10));
      date.setMinutes(parseInt(minutes, 10));
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    };

    return `${formatTime(startTime)} - ${formatTime(endTime)}`;
  } catch (error) {
    console.error('Error formatting time range:', error);
    return `${startTime} - ${endTime}`;
  }
};

// Navigate to profile
const navigateToProfile = () => {
  router.push({ name: 'CandidateProfile' });
};

// Application actions
const cancelApplication = () => {
  emits('cancel');
};

const submitApplication = async () => {
  if (
    !confirmAvailability.value ||
    !confirmCancel.value ||
    !confirmTerms.value
  ) {
    return;
  }

  // Simulate API call
  try {
    submitting.value = true;

    // Create form data for submission
    const applicationData = {
      jobId: job.value.id,
      candidateAcceptance: {
        confirmedAvailability: confirmAvailability.value,
        confirmedCancellationPolicy: confirmCancel.value,
        confirmedTerms: confirmTerms.value,
      },
    };

    console.log('Submitting application:', applicationData);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Show success dialog
    applicationSubmitted.value = true;
  } catch (error) {
    console.error('Error submitting application:', error);
  } finally {
    submitting.value = false;
  }
};

const viewDashboard = () => {
  router.push({ name: 'CandidateDashboard' });
};

const backToJobSearch = () => {
  router.push({ name: 'FindJobs' });
};

// Fetch job data on component mount
onMounted(() => {
  fetchJobData();
});
</script>

<style scoped>
/* Main container styles */
.job-application-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 1.5rem;
  color: #333;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* Loading state styles */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 0;
}

.loading-animation {
  margin-bottom: 1rem;
}

.loading-text {
  color: #6366f1;
  font-size: 1.1rem;
  font-weight: 500;
}

/* Card container */
.card-container {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

/* Header section */
.app-header {
  background: linear-gradient(to right, #4f46e5, #7e22ce);
  padding: 2rem;
  color: white;
}

.company-banner {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
}

.company-logo-container {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1.5rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.company-logo {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 0.75rem;
}

.company-logo-fallback {
  font-size: 2rem;
  color: #6366f1;
}

.company-info {
  flex: 1;
}

.job-title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.5rem;
}

.company-location {
  display: flex;
  align-items: center;
  font-size: 1.1rem;
}

.company-name {
  font-weight: 600;
}

.divider {
  margin: 0 0.5rem;
  opacity: 0.7;
}

.job-tags {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.job-tags :deep(.p-tag) {
  border-radius: 2rem;
  padding: 0.35rem 1rem;
  font-weight: 600;
}

.tag-type {
  background-color: rgba(255, 255, 255, 0.2) !important;
  color: white !important;
}

.tag-salary {
  background-color: #10b981 !important;
}

.tag-positions {
  background-color: #f59e0b !important;
}

/* Main content area */
.app-content {
  padding: 2rem;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

@media (max-width: 992px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}

.content-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Card styles */
:deep(.p-card) {
  border-radius: 0.75rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

:deep(.p-card-title) {
  margin-bottom: 0 !important;
}

:deep(.p-card-body) {
  padding: 0;
}

:deep(.p-card-content) {
  padding: 1.25rem;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
}

.title-icon {
  font-size: 1.25rem;
  color: #6366f1;
}

.benefits-icon {
  color: #10b981;
}

.requirements-icon {
  color: #f59e0b;
}

.ai-icon {
  color: #7c3aed;
}

.reputation-icon {
  color: #ef4444;
}

.profile-icon {
  color: #3b82f6;
}

.confirmation-icon {
  color: #6366f1;
}

/* Details card styling */
.details-grid {
  display: grid;
  gap: 1.5rem;
}

.detail-item {
  display: flex;
  align-items: flex-start;
}

.detail-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  flex-shrink: 0;
}

.detail-icon i {
  color: #6366f1;
  font-size: 1rem;
}

.detail-content {
  flex: 1;
}

.detail-content h3 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.25rem;
  color: #4b5563;
}

.detail-content p {
  margin: 0;
  color: #111827;
  font-size: 1rem;
  line-height: 1.5;
}

.detail-item.notes {
  margin-top: 0.5rem;
  padding-top: 1rem;
  border-top: 1px dashed #e5e7eb;
}

.map-link {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  color: #6366f1;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  text-decoration: none;
  transition: color 0.2s;
}

.map-link:hover {
  color: #4f46e5;
  text-decoration: underline;
}

/* Benefits and Requirements styling */
.benefits-list,
.requirements-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.benefit-item,
.requirement-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 0.75rem;
  line-height: 1.5;
}

.benefit-item i,
.requirement-item i {
  margin-right: 0.75rem;
  margin-top: 0.25rem;
  font-size: 1rem;
  color: #10b981;
  flex-shrink: 0;
}

.requirement-item i {
  color: #f59e0b;
}

.empty-state {
  display: flex;
  align-items: center;
  color: #94a3b8;
  font-style: italic;
}

.empty-state i {
  color: #94a3b8 !important;
}

/* AI Ranking styling */
.ranking-content {
  padding: 0.5rem 0;
}

.ranking-header {
  display: flex;
  align-items: center;
  margin-bottom: 1.25rem;
}

:deep(.ranking-avatar) {
  margin-right: 1rem;
  background-color: #7c3aed !important;
}

.ranking-header p {
  margin: 0;
  font-weight: 500;
}

.ranking-factors {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.factor {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.95rem;
}

.factor i {
  color: #7c3aed;
  font-size: 1rem;
}

.ranking-tip {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background-color: #f1f5f9;
  padding: 0.75rem;
  border-radius: 0.5rem;
  margin-top: 0.5rem;
}

.ranking-tip i {
  color: #6366f1;
  font-size: 1.25rem;
}

.ranking-tip p {
  margin: 0;
  font-weight: 500;
  color: #6366f1;
}

/* Full width section */
.full-width-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Reputation styling */
.reputation-content {
  padding: 0.5rem 0;
}

.reputation-header {
  display: flex;
  align-items: flex-start;
  margin-bottom: 1.25rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f1f5f9;
}

.reputation-header i {
  color: #ef4444;
  font-size: 1.5rem;
  margin-right: 1rem;
  margin-top: 0.25rem;
  flex-shrink: 0;
}

.reputation-header p {
  margin: 0;
  font-weight: 600;
  line-height: 1.5;
}

.reputation-stages {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.reputation-stage {
  background-color: #f8fafc;
  border-radius: 0.75rem;
  padding: 1.25rem;
  border-left: 4px solid #6366f1;
}

.reputation-stage.after-confirmation {
  border-left-color: #ef4444;
}

.stage-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.stage-header i {
  color: #6366f1;
  font-size: 1.25rem;
}

.stage-header h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.after-confirmation .stage-header i {
  color: #ef4444;
}

.stage-content p {
  margin: 0;
  line-height: 1.6;
}

.reputation-warning {
  display: flex;
  align-items: center;
  gap: 1rem;
  background-color: #fef2f2;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-top: 1rem;
}

.reputation-warning i {
  color: #ef4444;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.reputation-warning p {
  margin: 0;
  font-weight: 600;
  color: #ef4444;
}

/* Profile completeness styling */
.profile-content {
  padding: 0.5rem 0;
}

.profile-intro {
  margin: 0 0 1.25rem;
  line-height: 1.5;
}

.completeness-checks {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.check-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  background-color: #f0fdf4;
}

.check-item.incomplete {
  background-color: #fef2f2;
}

.check-status {
  flex-shrink: 0;
}

.check-status i {
  font-size: 1.25rem;
  color: #10b981;
}

.check-item.incomplete .check-status i {
  color: #ef4444;
}

.check-details {
  display: flex;
  flex-direction: column;
}

.check-label {
  font-weight: 600;
}

.check-message {
  font-size: 0.875rem;
  color: #4b5563;
}

.check-item.incomplete .check-message {
  color: #ef4444;
  font-weight: 500;
}

.profile-action {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.profile-action :deep(.p-button) {
  background-color: #3b82f6;
  border-color: #3b82f6;
}

/* Confirmation styling */
.confirmation-content {
  padding: 0.5rem 0;
}

.confirmation-items {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-bottom: 2rem;
}

.confirmation-item {
  display: flex;
  align-items: flex-start;
}

.confirmation-item :deep(.p-checkbox) {
  margin-right: 1rem;
  margin-top: 0.25rem;
}

.confirmation-item :deep(.p-checkbox .p-checkbox-box.p-highlight) {
  background-color: #6366f1;
  border-color: #6366f1;
}

.confirmation-item label {
  line-height: 1.5;
  color: #374151;
}

.terms-link {
  color: #6366f1;
  text-decoration: none;
}

.terms-link:hover {
  text-decoration: underline;
}

.action-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
}

.submit-button {
  background-color: #6366f1 !important;
  border-color: #6366f1 !important;
}

.cancel-button {
  color: #ef4444 !important;
  border-color: #ef4444 !important;
}

/* Success dialog styling */
:deep(.success-dialog) {
  border-radius: 1rem;
  overflow: hidden;
}

:deep(.success-dialog .p-dialog-header) {
  background-color: #6366f1;
  color: white;
  padding-bottom: 1rem;
}

.success-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding-top: 1rem;
}

.success-header i {
  font-size: 3rem;
  color: white;
  margin-bottom: 0.75rem;
}

.success-header h2 {
  margin: 0;
  font-size: 1.75rem;
  text-align: center;
}

.success-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem 0;
}

.success-message {
  text-align: center;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.reference-number {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background-color: #f1f5f9;
  padding: 0.75rem 1.25rem;
  border-radius: 2rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.reference-number i {
  color: #6366f1;
}

.next-steps {
  background-color: #fffbeb;
  border-radius: 0.75rem;
  padding: 1rem;
  width: 100%;
}

.next-steps h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 0.5rem;
  font-size: 1.1rem;
  color: #92400e;
}

.next-steps h3 i {
  color: #f59e0b;
}

.next-steps p {
  margin: 0;
  line-height: 1.5;
  color: #92400e;
}

.success-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

/* Responsive styles */
@media (max-width: 768px) {
  .job-application-container {
    padding: 1rem;
  }

  .app-header {
    padding: 1.5rem;
  }

  .company-banner {
    flex-direction: column;
    text-align: center;
  }

  .company-logo-container {
    margin-right: 0;
    margin-bottom: 1rem;
  }

  .job-title {
    font-size: 1.5rem;
  }

  .company-location {
    justify-content: center;
  }

  .job-tags {
    justify-content: center;
    margin-top: 1rem;
  }

  .app-content {
    padding: 1.5rem;
  }

  .ranking-factors {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    flex-direction: column-reverse;
    gap: 1rem;
  }

  .action-buttons .p-button {
    width: 100%;
  }

  .success-actions {
    flex-direction: column;
  }

  .success-actions .p-button {
    width: 100%;
  }
}
</style>
