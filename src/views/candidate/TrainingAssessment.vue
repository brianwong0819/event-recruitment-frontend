<template>
  <div class="p-6 max-w-6xl mx-auto">
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">
            Training & Assessment
          </h1>
          <p class="text-gray-600">
            Prepare for your upcoming job with training materials and
            assessments
          </p>
        </div>
        <Button
          icon="pi pi-arrow-left"
          label="Back to Applications"
          class="p-button-outlined"
          @click="goBack"
        />
      </div>
    </div>

    <!-- Loading state -->
    <div
      v-if="loading"
      class="bg-white rounded-xl shadow-md p-12 flex flex-col items-center justify-center"
    >
      <div class="relative w-20 h-20 mb-6">
        <ProgressSpinner
          style="width: 80px; height: 80px"
          stroke-width="4"
          stroke="#6366f1"
          fill="transparent"
          animation-duration=".7s"
        />
        <div class="absolute inset-0 flex items-center justify-center">
          <i class="pi pi-book text-indigo-500 text-2xl"></i>
        </div>
      </div>
      <h3 class="text-xl font-semibold text-gray-800 mb-2">
        Loading Training Materials
      </h3>
      <p class="text-gray-600 text-center max-w-md">
        Please wait while we load your training materials and assessments...
      </p>
    </div>

    <!-- Error state -->
    <div
      v-else-if="error"
      class="bg-white rounded-xl shadow-md p-12 text-center"
    >
      <div
        class="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6"
      >
        <i class="pi pi-exclamation-triangle text-red-500 text-4xl"></i>
      </div>
      <h3 class="text-2xl font-bold text-gray-800 mb-3">
        Unable to Load Training Materials
      </h3>
      <p class="text-gray-600 mb-8 max-w-md mx-auto">
        {{ errorMessage }}
      </p>
      <Button
        label="Try Again"
        icon="pi pi-refresh"
        @click="fetchTrainingData"
        class="p-button"
      />
    </div>

    <!-- No training available -->
    <div
      v-else-if="!hasTraining"
      class="bg-white rounded-xl shadow-md p-12 text-center"
    >
      <div
        class="w-24 h-24 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-6"
      >
        <i class="pi pi-info-circle text-yellow-500 text-4xl"></i>
      </div>
      <h3 class="text-2xl font-bold text-gray-800 mb-3">
        No Training Currently Available
      </h3>
      <p class="text-gray-600 mb-8 max-w-md mx-auto">
        There are no training materials or assessments available for this
        position at the moment. Please check back later or contact the recruiter
        for more information.
      </p>
      <div class="flex justify-center gap-4">
        <Button
          label="Contact Recruiter"
          icon="pi pi-envelope"
          @click="contactRecruiter"
          class="p-button-outlined"
        />
        <Button
          label="Back to Applications"
          icon="pi pi-arrow-left"
          @click="goBack"
          class="p-button"
        />
      </div>
    </div>

    <!-- Training content -->
    <div v-else class="space-y-8">
      <!-- Training completion notification (added after removing job card) -->
      <div
        v-if="trainingSummary.completed"
        class="p-4 bg-green-50 rounded-lg border border-green-200 mb-4"
      >
        <h4 class="font-semibold text-green-800 mb-2 flex items-center">
          <i class="pi pi-check-circle mr-2"></i>
          Training Complete
        </h4>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-green-700">
              You've successfully completed the required training for this job.
            </p>
            <p class="text-sm text-green-600 mt-1">
              Completed on {{ trainingSummary.lastCompletedDate }}
            </p>
          </div>
        </div>
      </div>

      <!-- Training Required Alert (moved from Job Card) -->
      <div
        v-if="!trainingSummary.completed"
        class="p-4 bg-yellow-50 rounded-lg border border-yellow-200 mb-4"
      >
        <h4 class="font-semibold text-yellow-800 mb-2 flex items-center">
          <i class="pi pi-info-circle mr-2"></i>
          Training Required
        </h4>
        <p class="text-yellow-700">
          Please complete the training materials and assessment below before
          your job starts. You need to score at least 80% on the assessment to
          pass.
        </p>
      </div>

      <!-- Training Materials Section -->
      <div class="bg-white rounded-xl shadow-md overflow-hidden">
        <div class="px-6 py-4 bg-indigo-50 border-b border-indigo-100">
          <h2 class="text-xl font-bold text-gray-800 flex items-center">
            <i class="pi pi-book text-indigo-500 mr-2"></i>
            Training Materials
          </h2>
          <p class="text-gray-600 mt-1">
            Download and review these materials before taking the assessment
          </p>
        </div>

        <div class="p-6">
          <div
            v-if="trainingMaterials.length === 0"
            class="text-center py-8 text-gray-500"
          >
            No training materials are available at this time.
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="material in trainingMaterials"
              :key="material.id"
              class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div class="flex items-start justify-between">
                <div class="flex items-start flex-1">
                  <div class="bg-indigo-100 p-3 rounded-lg mr-4">
                    <i class="pi pi-file-pdf text-indigo-600 text-xl"></i>
                  </div>
                  <div class="flex-1">
                    <h3 class="font-medium text-gray-900">
                      {{ material.title }}
                      <Badge
                        v-if="material.required"
                        value="Required"
                        severity="danger"
                        class="ml-2"
                      ></Badge>
                    </h3>
                    <p class="text-sm text-gray-600 mt-1">
                      {{ material.description }}
                    </p>
                    <div class="flex items-center mt-2 text-xs text-gray-500">
                      <span class="mr-3">{{
                        material.fileType.toUpperCase()
                      }}</span>
                      <span>{{ material.fileSize }}</span>
                    </div>
                  </div>
                </div>
                <div class="flex flex-col gap-2">
                  <Button
                    icon="pi pi-download"
                    label="Download"
                    @click="downloadTrainingMaterial(material)"
                    class="p-button-outlined p-button-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Assessment Section -->
      <div class="bg-white rounded-xl shadow-md overflow-hidden">
        <div class="px-6 py-4 bg-blue-50 border-b border-blue-100">
          <h2 class="text-xl font-bold text-gray-800 flex items-center">
            <i class="pi pi-check-square text-blue-500 mr-2"></i>
            Assessment
          </h2>
          <p class="text-gray-600 mt-1">
            Complete this assessment to verify your understanding
          </p>
        </div>

        <div class="p-6">
          <div
            v-if="assessments.length === 0"
            class="text-center py-8 text-gray-500"
          >
            No assessments are available at this time.
          </div>

          <div v-else class="space-y-6">
            <div
              v-for="assessment in assessments"
              :key="assessment.id"
              class="border border-gray-200 rounded-lg p-6 hover:border-blue-200 transition-colors"
            >
              <div class="flex items-start justify-between">
                <div>
                  <h3 class="text-lg font-medium text-gray-900">
                    {{ assessment.title }}
                  </h3>
                  <p class="mt-1 text-gray-600">{{ assessment.description }}</p>

                  <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="flex items-center">
                      <div
                        class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3"
                      >
                        <i class="pi pi-clock text-blue-600"></i>
                      </div>
                      <div>
                        <div class="text-xs text-gray-500">Time Limit</div>
                        <div class="font-medium">
                          {{ assessment.timeLimit }} minutes
                        </div>
                      </div>
                    </div>

                    <div class="flex items-center">
                      <div
                        class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3"
                      >
                        <i class="pi pi-percentage text-blue-600"></i>
                      </div>
                      <div>
                        <div class="text-xs text-gray-500">Passing Score</div>
                        <div class="font-medium">
                          {{ assessment.passingScore }}%
                        </div>
                      </div>
                    </div>

                    <div class="flex items-center">
                      <div
                        class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3"
                      >
                        <i class="pi pi-question-circle text-blue-600"></i>
                      </div>
                      <div>
                        <div class="text-xs text-gray-500">Questions</div>
                        <div class="font-medium">AI-generated</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="ml-4">
                  <Badge
                    v-if="assessment.status === 'completed'"
                    value="Completed"
                    severity="success"
                    class="mb-2"
                  ></Badge>
                  <Badge
                    v-else-if="assessment.status === 'in_progress'"
                    value="In Progress"
                    severity="info"
                    class="mb-2"
                  ></Badge>
                </div>
              </div>

              <div class="mt-6 flex items-center justify-between">
                <div class="text-sm text-gray-600">
                  <span
                    v-if="assessment.status === 'completed'"
                    class="text-green-600 font-medium"
                  >
                    <i class="pi pi-check-circle mr-1"></i>
                    You've completed this assessment
                  </span>
                  <span v-else class="text-blue-600">
                    <i class="pi pi-info-circle mr-1"></i>
                    Ready to take the assessment
                  </span>
                </div>

                <div>
                  <Button
                    v-if="assessment.status === 'in_progress'"
                    label="Continue"
                    icon="pi pi-play"
                    class="p-button-success"
                    @click="startAssessment(assessment)"
                  />
                  <Button
                    v-else-if="assessment.status === 'failed'"
                    label="Retry"
                    icon="pi pi-refresh"
                    class="p-button-danger"
                    @click="retryAssessment(assessment)"
                  />
                  <Button
                    v-else-if="assessment.status !== 'completed'"
                    label="Start Assessment"
                    icon="pi pi-play"
                    class="p-button-primary"
                    @click="startAssessment(assessment)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Assessment Dialog -->
    <Dialog
      v-model:visible="assessmentDialogVisible"
      modal
      header="Assessment"
      :style="{ width: '90%', maxWidth: '900px' }"
      :closable="!(activeAssessment && activeAssessment.completed)"
      :closeOnEscape="true"
      @hide="closeAssessment"
    >
      <AssessmentComponent
        v-if="activeAssessment"
        :assessment="activeAssessment"
        @close="closeAssessment"
        @complete="completeAssessment"
      />
    </Dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import axios from 'axios';
import authService from '@/services/auth.service';

// PrimeVue components
import Button from 'primevue/button';
import Card from 'primevue/card';
import ProgressSpinner from 'primevue/progressspinner';
import ProgressBar from 'primevue/progressbar';
import Badge from 'primevue/badge';
import Chip from 'primevue/chip';
import Dialog from 'primevue/dialog';
import Toast from 'primevue/toast';
import AssessmentComponent from '@/components/assessment/AssessmentComponent.vue';

const route = useRoute();
const router = useRouter();
const toast = useToast();

// State
const loading = ref(true);
const error = ref(false);
const errorMessage = ref('');
const hasTraining = ref(false);
const jobDetails = ref(null);
const trainingMaterials = ref([]);
const assessments = ref([]);
const activeAssessment = ref(null);
const trainingSummary = ref({
  completed: false,
  score: 0,
  passScore: 80,
  lastCompletedDate: null,
});

// Computed property to check if all required materials are reviewed
const allMaterialsReviewed = computed(() => {
  // Always return true to make assessment available
  return true;
});

// Assessment dialog state
const assessmentDialogVisible = ref(false);

// Function to download training materials
const downloadTrainingMaterial = async (material) => {
  console.log(`Downloading ${material.title} from ${material.downloadUrl}`);

  try {
    // Show download starting notification
    toast.add({
      severity: 'info',
      summary: 'Download Started',
      detail: `${material.title} is being downloaded`,
      life: 3000,
    });

    // Get the file from the API
    const token = authService.getToken();

    // Use the correct API endpoint for downloading materials
    const downloadUrl = `http://localhost:8080/api/training/materials/${material.id}`;

    // Open the URL in a new tab with the token for authentication
    window.open(downloadUrl, '_blank');

    toast.add({
      severity: 'success',
      summary: 'Material Downloaded',
      detail: `${material.title} download initiated.`,
      life: 3000,
    });

    // Removed automatic marking as completed
  } catch (err) {
    console.error('Error downloading material:', err);
    toast.add({
      severity: 'error',
      summary: 'Download Failed',
      detail: 'Failed to download the training material. Please try again.',
      life: 3000,
    });
  }
};

// Function to start an assessment
const startAssessment = async (assessment) => {
  // For in-progress assessments, just continue without showing generation screen
  if (assessment.status === 'in_progress') {
    const index = assessments.value.findIndex((a) => a.id === assessment.id);
    if (index !== -1) {
      activeAssessment.value = {
        ...assessments.value[index],
        isGenerating: false,
        currentQuestion: 0,
        userAnswers: new Array(assessments.value[index].questions.length).fill(
          null
        ),
        timeRemaining: assessments.value[index].timeLimit * 60, // in seconds
      };
      assessmentDialogVisible.value = true;
      return;
    }
  }

  // Always show the "Generating Assessment" state for new or retry assessments
  activeAssessment.value = { ...assessment, isGenerating: true };
  assessmentDialogVisible.value = true;

  try {
    // Simulate AI generating questions with a delay
    await new Promise((resolve) => setTimeout(resolve, 3500));

    // Generate mock questions - always generate new ones for retries
    const mockQuestions = generateMockQuestions();

    // Update the assessment with the questions
    const index = assessments.value.findIndex((a) => a.id === assessment.id);
    if (index !== -1) {
      assessments.value[index].questions = mockQuestions;
      assessments.value[index].status = 'in_progress';

      // Update active assessment
      activeAssessment.value = {
        ...assessments.value[index],
        isGenerating: false,
        currentQuestion: 0,
        userAnswers: new Array(mockQuestions.length).fill(null),
        timeRemaining: assessments.value[index].timeLimit * 60, // in seconds
      };
    }
  } catch (err) {
    console.error('Error generating questions:', err);
    assessmentDialogVisible.value = false;

    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to generate assessment questions. Please try again.',
      life: 3000,
    });
  }
};

// Function to close the assessment dialog
const closeAssessment = () => {
  // Simply close the dialog regardless of status
  assessmentDialogVisible.value = false;

  // Only clear the active assessment after a small delay to prevent UI glitches
  setTimeout(() => {
    activeAssessment.value = null;
  }, 300);
};

// Function to handle assessment completion
const completeAssessment = (result) => {
  console.log('Assessment completed with result:', result);

  // Set completed flag on activeAssessment
  if (activeAssessment.value) {
    activeAssessment.value.completed = true;
    activeAssessment.value.status = result.passed ? 'completed' : 'failed';
  }

  // Update the assessment with the results
  const index = assessments.value.findIndex((a) => a.id === result.id);
  if (index !== -1) {
    assessments.value[index].status = result.passed ? 'completed' : 'failed';
    assessments.value[index].score = result.score;

    // If passed, update the training summary
    if (result.passed) {
      trainingSummary.value.completed = true;
      trainingSummary.value.score = result.score;
      trainingSummary.value.lastCompletedDate = new Date().toLocaleDateString(
        'en-US',
        {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }
      );
    }

    // Show toast notification
    toast.add({
      severity: result.passed ? 'success' : 'error',
      summary: result.passed ? 'Assessment Passed' : 'Assessment Failed',
      detail: result.passed
        ? `Congratulations! You scored ${result.score}% and passed the assessment.`
        : `You scored ${result.score}%. You need ${assessments.value[index].passingScore}% to pass.`,
      life: 5000,
    });

    // Close the dialog after the user clicks "Return to Training"
    assessmentDialogVisible.value = false;

    // Only clear active assessment after a delay to avoid UI glitches
    setTimeout(() => {
      activeAssessment.value = null;
    }, 300);
  }
};

// Function to view assessment results
const viewAssessmentResults = (assessment) => {
  // In a real app, this would show a results page or dialog
  // For now, just show a toast
  toast.add({
    severity: 'info',
    summary: 'Assessment Results',
    detail: `You scored ${assessment.score}% on this assessment.`,
    life: 3000,
  });
};

// Function to generate mock questions for the assessment
const generateMockQuestions = () => {
  return [
    {
      id: 'q1',
      type: 'multiple-choice',
      question: 'Which payment method has the quickest processing time?',
      options: ['Credit Card', 'Mobile Payment', 'Cash', 'Bank Transfer'],
      correctAnswer: 1, // Mobile Payment
      explanation:
        'Mobile payments typically have the quickest processing time as they are processed instantly through digital systems.',
    },
    {
      id: 'q2',
      type: 'multiple-choice',
      question:
        'What should you do if a customer has concerns about payment security?',
      options: [
        'Tell them not to worry about it',
        'Ignore their concerns and continue with the transaction',
        'Address their concerns and explain the security measures in place',
        'Ask them to use a different payment method',
      ],
      correctAnswer: 2,
      explanation:
        'You should always address customer concerns about security and explain the measures in place to protect their information.',
    },
    {
      id: 'q3',
      type: 'multiple-choice',
      question:
        'Which of the following is NOT a benefit of fast payment options?',
      options: [
        'Reduced waiting time',
        'Improved customer satisfaction',
        'Lower transaction fees for the merchant',
        'Quicker processing of orders',
      ],
      correctAnswer: 2,
      explanation:
        'Fast payment options typically do not lower transaction fees for merchants. In fact, they may sometimes have higher fees.',
    },
    {
      id: 'q4',
      type: 'multiple-choice',
      question:
        'What is the best approach when promoting payment options to customers?',
      options: [
        'Focus only on the benefits to the store',
        'Highlight the convenience and benefits for the customer',
        "Don't mention payment options unless asked",
        'Insist that customers use specific payment methods',
      ],
      correctAnswer: 1,
      explanation:
        'When promoting payment options, focus on the convenience and benefits for customers, such as faster checkout or rewards.',
    },
    {
      id: 'q5',
      type: 'multiple-choice',
      question:
        'Which statement about handling customer payment information is correct?',
      options: [
        "It's okay to write down card details for later processing",
        'Customer payment information should be kept strictly confidential',
        'You can share payment details with managers when needed',
        "It's fine to take photos of payment cards for record-keeping",
      ],
      correctAnswer: 1,
      explanation:
        'Customer payment information must be kept strictly confidential and should never be written down, photographed, or shared.',
    },
  ];
};

// Function to mark training material as completed
const markTrainingMaterialCompleted = async (materialId) => {
  try {
    const token = authService.getToken();
    const jobId = route.params.jobId;

    const response = await axios.put(
      `http://localhost:8080/api/candidates/jobs/${jobId}/training/${materialId}/complete`,
      {},
      {
        headers: {
          Authorization: token,
        },
      }
    );

    if (response.data.statusCode === 200) {
      console.log('Training material marked as completed:', response.data);

      // Update the local state
      const index = trainingMaterials.value.findIndex(
        (m) => m.id === materialId.toString()
      );
      if (index !== -1) {
        trainingMaterials.value[index].completed = true;
      }

      // Update training summary
      trainingSummary.value.completed = true;
      trainingSummary.value.lastCompletedDate = new Date().toLocaleDateString(
        'en-US',
        {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }
      );

      toast.add({
        severity: 'success',
        summary: 'Material Completed',
        detail: 'You have successfully completed the training material.',
        life: 3000,
      });
    }
  } catch (err) {
    console.error('Error marking training material as completed:', err);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to mark training material as completed.',
      life: 3000,
    });
  }
};

// Fetch training data
const fetchTrainingData = async () => {
  console.log('Fetching training data for job ID:', route.params.jobId);

  loading.value = true;
  error.value = false;

  try {
    const token = authService.getToken();
    const jobId = route.params.jobId;

    // Call real API to get training materials
    const response = await axios.get(
      `http://localhost:8080/api/candidates/jobs/${jobId}/training`,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    console.log('API response:', response.data);

    if (response.data.statusCode === 200) {
      const data = response.data.data;

      // Set minimal job details directly without making another API call
      jobDetails.value = {
        id: jobId,
        title: 'Job Training',
        company: '',
        location: '',
        dates: '',
        workingHours: '',
      };

      // Map the API training material to our format
      const material = data.material;
      trainingMaterials.value = [
        {
          id: material.id.toString(),
          title: material.fileName.replace(/\.[^/.]+$/, ''), // Remove file extension
          description: material.description || 'Training material for this job',
          fileType: material.fileName.split('.').pop().toUpperCase(),
          fileSize: formatFileSize(material.fileSize),
          downloadUrl: material.fileUrl,
          required: true,
          completed: data.record?.isCompleted || false,
        },
      ];

      // Create a placeholder assessment
      assessments.value = [
        {
          id: 'a1',
          title: 'Assessment',
          description: 'Test your knowledge on the training materials',
          questions: [],
          timeLimit: 15, // minutes
          passingScore: 80,
          available: true,
          completed: false,
          status: 'not_started',
        },
      ];

      // Update training summary
      trainingSummary.value = {
        completed: data.record?.isCompleted || false,
        score: 0,
        passScore: 80,
        lastCompletedDate: data.record?.completionDate
          ? new Date(data.record.completionDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
          : null,
      };

      // Check if we have any training materials
      hasTraining.value = true;
    }
  } catch (err) {
    console.error('Error fetching training data:', err);

    if (
      err.response &&
      err.response.data &&
      err.response.data.statusCode === 404
    ) {
      // No training material found for this job
      hasTraining.value = false;
      errorMessage.value =
        err.response.data.message || 'No training material found for this job.';
    } else {
      error.value = true;
      errorMessage.value =
        'Failed to load training materials. Please try again later.';
    }
  } finally {
    loading.value = false;
  }
};

// Helper function to format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

// Navigation functions
const goBack = () => {
  router.push({ name: 'MyApplications' });
};

const contactRecruiter = () => {
  // Navigate to RecruiterInfo page
  // This would need actual recruiter ID from the job data
  router.push({
    name: 'RecruiterInfo',
    params: { recruiterId: '1' }, // Should be the actual recruiter ID
    query: {
      source: 'training',
      action: 'contact',
      activeTab: 'portfolio',
    },
  });
};

// Add a new function specifically for retrying a failed assessment
const retryAssessment = async (assessment) => {
  // Always show the "Generating Assessment" state for retries
  activeAssessment.value = { ...assessment, isGenerating: true };
  assessmentDialogVisible.value = true;

  try {
    // Simulate AI generating questions with a delay
    await new Promise((resolve) => setTimeout(resolve, 3500));

    // Always generate new questions for retries
    const mockQuestions = generateMockQuestions();

    // Update the assessment with the questions
    const index = assessments.value.findIndex((a) => a.id === assessment.id);
    if (index !== -1) {
      assessments.value[index].questions = mockQuestions;
      assessments.value[index].status = 'in_progress';

      // Update active assessment
      activeAssessment.value = {
        ...assessments.value[index],
        isGenerating: false,
        currentQuestion: 0,
        userAnswers: new Array(mockQuestions.length).fill(null),
        timeRemaining: assessments.value[index].timeLimit * 60, // in seconds
      };
    }
  } catch (err) {
    console.error('Error generating questions:', err);
    assessmentDialogVisible.value = false;

    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to generate assessment questions. Please try again.',
      life: 3000,
    });
  }
};

// Initialize page
onMounted(() => {
  console.log('TrainingAssessment mounted. Route parameters:', {
    jobId: route.params.jobId,
    applicationId: route.query.applicationId,
    groupId: route.query.groupId,
  });

  fetchTrainingData();
});
</script>

<style scoped>
/* Custom styles can be added here */
</style>
