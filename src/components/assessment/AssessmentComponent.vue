<template>
  <div class="assessment-container">
    <!-- AI Generating Questions State -->
    <div v-if="assessment.isGenerating" class="p-8 text-center">
      <div class="mb-6 relative">
        <ProgressSpinner
          style="width: 100px; height: 100px"
          stroke-width="4"
          stroke="#6366f1"
          fill="transparent"
          animation-duration=".7s"
        />
        <div class="absolute inset-0 flex items-center justify-center">
          <i class="pi pi-cog text-indigo-500 text-3xl animate-spin-slow"></i>
        </div>
      </div>
      <h2 class="text-2xl font-bold text-gray-800 mb-4">
        Generating Your Assessment
      </h2>
      <p class="text-gray-600 mb-6 max-w-md mx-auto">
        Our AI is creating personalized questions based on the training
        materials. This will only take a moment...
      </p>
      <ProgressBar mode="indeterminate" style="height: 6px" class="mb-4" />
      <p class="text-sm text-gray-500 mb-0">
        Please do not close this window during generation
      </p>
    </div>

    <!-- Assessment Introduction -->
    <div v-else-if="!started" class="p-8">
      <div class="text-center mb-8">
        <div
          class="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center"
        >
          <i class="pi pi-check-square text-blue-600 text-2xl"></i>
        </div>
        <h2 class="text-2xl font-bold text-gray-800 mb-2">
          {{ assessment.title }}
        </h2>
        <p class="text-gray-600 max-w-md mx-auto">
          {{ assessment.description }}
        </p>
      </div>

      <div class="bg-blue-50 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
        <h3 class="font-semibold text-gray-800 mb-3 flex items-center">
          <i class="pi pi-info-circle text-blue-500 mr-2"></i>
          Assessment Information
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div class="flex items-center">
            <div
              class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3"
            >
              <i class="pi pi-clock text-blue-600"></i>
            </div>
            <div>
              <div class="text-xs text-gray-500">Time Limit</div>
              <div class="font-medium">{{ assessment.timeLimit }} minutes</div>
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
              <div class="font-medium">{{ assessment.passingScore }}%</div>
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
              <div class="font-medium">{{ assessment.questions.length }}</div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg p-4 border border-blue-200">
          <h4 class="font-medium text-gray-800 mb-2">
            Important Instructions:
          </h4>
          <ul class="list-disc pl-5 space-y-1 text-sm text-gray-700">
            <li>You must complete all questions within the time limit</li>
            <li>
              You need to score at least {{ assessment.passingScore }}% to pass
            </li>
            <li>Once you start, you cannot pause the assessment</li>
            <li>Don't refresh or leave the page during the assessment</li>
          </ul>
        </div>
      </div>

      <div class="text-center">
        <Button
          label="Begin Assessment"
          icon="pi pi-play"
          class="p-button-lg"
          @click="startAssessment"
        />
      </div>
    </div>

    <!-- Assessment Questions -->
    <div v-else-if="!completed" class="p-6">
      <!-- Timer and progress -->
      <div
        class="sticky top-0 bg-white rounded-lg shadow-md p-4 mb-6 flex justify-between items-center"
      >
        <div class="flex items-center">
          <span class="font-medium text-gray-800 mr-2"
            >Question {{ currentQuestionIndex + 1 }}/{{
              assessment.questions.length
            }}</span
          >
          <ProgressBar
            :value="
              ((currentQuestionIndex + 1) / assessment.questions.length) * 100
            "
            style="width: 120px; height: 10px"
          />
        </div>

        <div class="flex items-center">
          <i class="pi pi-clock text-red-500 mr-2"></i>
          <span
            :class="{ 'text-red-500': timeRemaining < 60 }"
            class="font-medium"
          >
            {{ formatTime(timeRemaining) }}
          </span>
        </div>
      </div>

      <!-- Current Question -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          {{ currentQuestion.question }}
        </h3>

        <div class="space-y-3 mb-6">
          <div
            v-for="(option, index) in currentQuestion.options"
            :key="index"
            :class="[
              'border rounded-lg p-4 transition-colors',
              currentQuestionReviewed
                ? userAnswers[currentQuestionIndex] === index
                  ? index === currentQuestion.correctAnswer
                    ? 'border-green-500 bg-green-50'
                    : 'border-red-500 bg-red-50'
                  : index === currentQuestion.correctAnswer
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200'
                : userAnswers[currentQuestionIndex] === index
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/50',
              !currentQuestionReviewed ? 'cursor-pointer' : '',
            ]"
            @click="!currentQuestionReviewed && selectAnswer(index)"
          >
            <div class="flex items-center">
              <div
                class="w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3"
                :class="
                  currentQuestionReviewed
                    ? userAnswers[currentQuestionIndex] === index
                      ? index === currentQuestion.correctAnswer
                        ? 'border-green-500 bg-green-500 text-white'
                        : 'border-red-500 bg-red-500 text-white'
                      : index === currentQuestion.correctAnswer
                      ? 'border-green-500 bg-green-500 text-white'
                      : 'border-gray-300'
                    : userAnswers[currentQuestionIndex] === index
                    ? 'border-indigo-500 bg-indigo-500 text-white'
                    : 'border-gray-300'
                "
              >
                <i
                  v-if="
                    currentQuestionReviewed &&
                    (userAnswers[currentQuestionIndex] === index ||
                      index === currentQuestion.correctAnswer)
                  "
                  :class="
                    index === currentQuestion.correctAnswer
                      ? 'pi pi-check'
                      : 'pi pi-times'
                  "
                  class="text-xs"
                ></i>
                <i
                  v-else-if="userAnswers[currentQuestionIndex] === index"
                  class="pi pi-check text-xs"
                ></i>
              </div>
              <span class="text-gray-800">{{ option }}</span>
            </div>
          </div>
        </div>

        <!-- Answer feedback -->
        <div v-if="currentQuestionReviewed" class="mb-6">
          <div
            class="p-3 rounded-md"
            :class="
              userAnswers[currentQuestionIndex] ===
              currentQuestion.correctAnswer
                ? 'bg-green-100 border border-green-200'
                : 'bg-red-100 border border-red-200'
            "
          >
            <div class="flex items-start">
              <i
                :class="
                  userAnswers[currentQuestionIndex] ===
                  currentQuestion.correctAnswer
                    ? 'pi pi-check-circle text-green-600'
                    : 'pi pi-times-circle text-red-600'
                "
                class="mt-0.5 mr-2 text-lg"
              ></i>
              <div>
                <p
                  class="font-medium"
                  :class="
                    userAnswers[currentQuestionIndex] ===
                    currentQuestion.correctAnswer
                      ? 'text-green-800'
                      : 'text-red-800'
                  "
                >
                  {{
                    userAnswers[currentQuestionIndex] ===
                    currentQuestion.correctAnswer
                      ? 'Correct!'
                      : 'Incorrect'
                  }}
                </p>
                <p
                  class="text-sm"
                  :class="
                    userAnswers[currentQuestionIndex] ===
                    currentQuestion.correctAnswer
                      ? 'text-green-700'
                      : 'text-red-700'
                  "
                >
                  {{ currentQuestion.explanation }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-between">
          <Button
            v-if="currentQuestionIndex > 0"
            label="Previous"
            icon="pi pi-chevron-left"
            class="p-button-outlined"
            @click="previousQuestion"
          />
          <div v-else></div>

          <Button
            v-if="currentQuestionIndex < assessment.questions.length - 1"
            :label="currentQuestionReviewed ? 'Next' : 'Check Answer'"
            :icon="
              currentQuestionReviewed ? 'pi pi-chevron-right' : 'pi pi-check'
            "
            :iconPos="currentQuestionReviewed ? 'right' : 'left'"
            :class="
              currentQuestionReviewed ? 'p-button-primary' : 'p-button-info'
            "
            :disabled="userAnswers[currentQuestionIndex] === null"
            @click="nextQuestion"
          />
          <Button
            v-else
            :label="
              currentQuestionReviewed ? 'Finish Assessment' : 'Check Answer'
            "
            :icon="currentQuestionReviewed ? 'pi pi-check' : 'pi pi-check'"
            :iconPos="currentQuestionReviewed ? 'right' : 'left'"
            :class="
              currentQuestionReviewed ? 'p-button-success' : 'p-button-info'
            "
            :disabled="userAnswers[currentQuestionIndex] === null"
            @click="finishAssessment"
          />
        </div>
      </div>

      <!-- Question Navigator -->
      <div class="bg-white rounded-lg shadow-md p-4">
        <h4 class="text-sm font-medium text-gray-700 mb-3">
          Question Navigator
        </h4>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="(_, index) in assessment.questions"
            :key="index"
            :class="[
              'w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm transition-colors',
              currentQuestionReviewed && index === currentQuestionIndex
                ? 'bg-orange-500 text-white'
                : index === currentQuestionIndex
                ? 'bg-indigo-500 text-white'
                : userAnswers[index] !== null
                ? 'bg-green-100 text-green-800 border border-green-200'
                : 'bg-gray-100 text-gray-600 border border-gray-200',
              !currentQuestionReviewed
                ? 'cursor-pointer'
                : index === currentQuestionIndex
                ? 'cursor-pointer'
                : 'cursor-not-allowed opacity-60',
            ]"
            @click="navigateToQuestion(index)"
            :disabled="
              currentQuestionReviewed && index !== currentQuestionIndex
            "
          >
            {{ index + 1 }}
          </button>
        </div>
      </div>
    </div>

    <!-- Assessment Results -->
    <div v-else class="p-8">
      <div class="text-center mb-8">
        <div
          v-if="passed"
          class="w-20 h-20 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center"
        >
          <i class="pi pi-check-circle text-green-600 text-4xl"></i>
        </div>
        <div
          v-else
          class="w-20 h-20 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center"
        >
          <i class="pi pi-times-circle text-red-600 text-4xl"></i>
        </div>

        <h2
          class="text-2xl font-bold mb-2"
          :class="passed ? 'text-green-700' : 'text-red-700'"
        >
          {{ passed ? 'Assessment Passed!' : 'Assessment Not Passed' }}
        </h2>

        <p class="text-gray-600 max-w-md mx-auto">
          {{
            passed
              ? `Congratulations! You scored ${score}% on the assessment.`
              : `You scored ${score}%. You need ${assessment.passingScore}% to pass.`
          }}
        </p>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto mb-8">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-medium text-gray-800">Assessment Results</h3>
          <div class="relative w-20 h-20">
            <div
              class="assessment-score-circle"
              :style="{ background: scoreCircleBackground }"
            >
              <div class="absolute inset-0 flex items-center justify-center">
                <span class="text-xl font-bold">{{ score }}%</span>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div class="bg-gray-50 p-4 rounded-lg">
            <div class="text-sm text-gray-500 mb-1">Correct Answers</div>
            <div class="text-xl font-semibold text-gray-800">
              {{ correctAnswers }} / {{ assessment.questions.length }}
            </div>
          </div>

          <div class="bg-gray-50 p-4 rounded-lg">
            <div class="text-sm text-gray-500 mb-1">Time Taken</div>
            <div class="text-xl font-semibold text-gray-800">
              {{ formatTime(timeTaken) }}
            </div>
          </div>
        </div>

        <div class="flex justify-center items-center">
          <Button
            label="Return to Training"
            icon="pi pi-arrow-left"
            :class="passed ? 'p-button-success' : 'p-button'"
            @click="emitCompleteEvent"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import Button from 'primevue/button';
import ProgressSpinner from 'primevue/progressspinner';
import ProgressBar from 'primevue/progressbar';

const props = defineProps({
  assessment: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['close', 'complete']);

// State
const started = ref(false);
const completed = ref(false);
const currentQuestionIndex = ref(0);
const userAnswers = ref(
  props.assessment.userAnswers ||
    Array(props.assessment.questions.length).fill(null)
);
const timeRemaining = ref(
  props.assessment.timeRemaining || props.assessment.timeLimit * 60
); // in seconds
const timeTaken = ref(0);
const passed = ref(false);
const score = ref(0);
const correctAnswers = ref(0);
let timerInterval = null;
const currentQuestionReviewed = ref(false);

// Add an array to track which questions have been reviewed
const questionsReviewed = ref(
  Array(props.assessment.questions.length).fill(false)
);

// Computed properties
const currentQuestion = computed(() => {
  return props.assessment.questions[currentQuestionIndex.value] || {};
});

const allQuestionsAnswered = computed(() => {
  return userAnswers.value.every((answer) => answer !== null);
});

const scoreCircleBackground = computed(() => {
  const percentage = score.value;
  const color =
    percentage >= props.assessment.passingScore ? '#22c55e' : '#ef4444';
  return `conic-gradient(${color} ${percentage}%, #f3f4f6 0%)`;
});

// Methods
const startAssessment = () => {
  started.value = true;
  startTimer();
};

const startTimer = () => {
  timerInterval = setInterval(() => {
    if (timeRemaining.value > 0) {
      timeRemaining.value--;
      timeTaken.value++;
    } else {
      // Time's up, finish the assessment
      clearInterval(timerInterval);
      finishAssessment();
    }
  }, 1000);
};

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs
    .toString()
    .padStart(2, '0')}`;
};

const selectAnswer = (index) => {
  if (!currentQuestionReviewed.value) {
    userAnswers.value[currentQuestionIndex.value] = index;
  }
};

const nextQuestion = () => {
  // If the question hasn't been reviewed, show the review first
  if (!currentQuestionReviewed.value) {
    currentQuestionReviewed.value = true;
    // Mark this question as reviewed in our tracking array
    questionsReviewed.value[currentQuestionIndex.value] = true;
    return;
  }

  // Move to next question
  if (currentQuestionIndex.value < props.assessment.questions.length - 1) {
    currentQuestionIndex.value++;
    // Check if the next question was already reviewed
    currentQuestionReviewed.value =
      questionsReviewed.value[currentQuestionIndex.value];
  }
};

const previousQuestion = () => {
  // Reset review state for current question and move to previous question
  if (currentQuestionReviewed.value) {
    // Mark current question as reviewed in our tracking array
    questionsReviewed.value[currentQuestionIndex.value] = true;
  }

  currentQuestionReviewed.value = false;
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--;
    // Check if the previous question was already answered and reviewed
    if (questionsReviewed.value[currentQuestionIndex.value]) {
      currentQuestionReviewed.value = true;
    }
  }
};

const navigateToQuestion = (index) => {
  // Only allow navigation if not in review mode or to a reviewed question
  if (!currentQuestionReviewed.value || questionsReviewed.value[index]) {
    // If current question is in review mode, mark it as reviewed before navigating
    if (currentQuestionReviewed.value) {
      questionsReviewed.value[currentQuestionIndex.value] = true;
    }

    currentQuestionIndex.value = index;
    // Update reviewed state based on the question we navigated to
    currentQuestionReviewed.value = questionsReviewed.value[index];
  }
};

const finishAssessment = () => {
  // If the question hasn't been reviewed, show the review first
  if (!currentQuestionReviewed.value) {
    currentQuestionReviewed.value = true;
    questionsReviewed.value[currentQuestionIndex.value] = true;
    return;
  }

  clearInterval(timerInterval);

  // Calculate results
  calculateResults();

  // Show results
  completed.value = true;
};

const calculateResults = () => {
  // Count correct answers
  correctAnswers.value = userAnswers.value.reduce((count, answer, index) => {
    const question = props.assessment.questions[index];
    return count + (answer === question.correctAnswer ? 1 : 0);
  }, 0);

  // Calculate score as percentage
  score.value = Math.round(
    (correctAnswers.value / props.assessment.questions.length) * 100
  );

  // Check if passed
  passed.value = score.value >= props.assessment.passingScore;
};

const emitCompleteEvent = () => {
  console.log('Return to Training button clicked');
  const result = {
    id: props.assessment.id,
    score: score.value,
    passed: passed.value,
    timeTaken: timeTaken.value,
    correctAnswers: correctAnswers.value,
    totalQuestions: props.assessment.questions.length,
  };
  console.log('Emitting complete event with data:', result);
  emit('complete', result);
  console.log('Complete event emitted');
};

// Lifecycle hooks
onMounted(() => {
  // If we're resuming an assessment that was already started
  if (props.assessment.currentQuestion !== undefined) {
    started.value = true;
    currentQuestionIndex.value = props.assessment.currentQuestion;
    startTimer();
  }
});

onBeforeUnmount(() => {
  // Clear timer when component is destroyed
  if (timerInterval) {
    clearInterval(timerInterval);
  }
});

// Watch for changes to active assessment data
watch(
  () => props.assessment.isGenerating,
  (newVal) => {
    // If no longer generating, set up the assessment
    if (!newVal && props.assessment.questions.length > 0) {
      userAnswers.value = Array(props.assessment.questions.length).fill(null);
    }
  }
);
</script>

<style scoped>
.assessment-container {
  max-height: 80vh;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: thin;
  scrollbar-color: rgba(203, 213, 225, 0.8) transparent;
}

.assessment-container::-webkit-scrollbar {
  width: 6px;
}

.assessment-container::-webkit-scrollbar-track {
  background: transparent;
}

.assessment-container::-webkit-scrollbar-thumb {
  background-color: rgba(203, 213, 225, 0.8);
  border-radius: 20px;
}

.assessment-container::-webkit-scrollbar-thumb:hover {
  background-color: rgba(148, 163, 184, 0.8);
}

.animate-spin-slow {
  animation: spin 3s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.assessment-score-circle {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  position: relative;
}
</style>
