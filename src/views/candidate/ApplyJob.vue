<template>
  <div class="job-application-process py-6 bg-gray-50 min-h-screen">
    <div class="container mx-auto px-4">
      <!-- Back Button -->
      <div class="mb-4">
        <Button
          icon="pi pi-arrow-left"
          label="Back to Job"
          class="p-button-text"
          @click="goBackToJob"
        />
      </div>

      <!-- Progress Steps -->
      <div class="mb-8">
        <Steps
          :model="steps"
          :readonly="false"
          :activeIndex="activeIndex"
          :key="`steps-${activeIndex}`"
          class="unlocked-steps"
        />
      </div>

      <!-- Page Title -->
      <div class="text-center mb-8">
        <h1 class="text-2xl md:text-3xl font-bold text-gray-800">
          {{ currentStepTitle }}
        </h1>
        <p class="text-gray-600 mt-2">{{ currentStepDescription }}</p>
      </div>

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
          Unable to load job information
        </h3>
        <p class="text-gray-600 mb-4 text-center max-w-md">
          We encountered an error while loading the job information. Please try
          again later.
        </p>
        <Button
          label="Go Back"
          icon="pi pi-arrow-left"
          class="p-button-outlined"
          @click="goBackToJob"
        />
      </div>

      <div v-else class="application-content">
        <!-- Step 1: Location and Date Selection -->
        <div v-if="activeIndex === 0" class="bg-white p-6 rounded-lg shadow-sm">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Left Column: Location Selection -->
            <div>
              <h2 class="text-xl font-semibold text-gray-800 mb-4">
                Available Locations
              </h2>
              <p class="text-gray-600 mb-4">
                Select the location where you'd like to work
              </p>

              <!-- Location Cards -->
              <div class="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                <div
                  v-for="location in availableLocations"
                  :key="location.id"
                  class="border rounded-lg p-4 cursor-pointer transition-all duration-200"
                  :class="
                    selectedLocations[0] === location.id
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-indigo-300'
                  "
                  @click="selectLocation(location.id)"
                >
                  <div class="flex justify-between mb-2">
                    <h3
                      class="font-medium text-gray-800 hover:text-indigo-600 hover:underline cursor-pointer"
                      @click.stop="showLocationDetails(location.id)"
                    >
                      {{ location.name }}
                    </h3>
                    <div
                      class="w-5 h-5 rounded-full border flex items-center justify-center"
                      :class="
                        selectedLocations[0] === location.id
                          ? 'bg-indigo-500 border-indigo-500'
                          : 'border-gray-400'
                      "
                    >
                      <i
                        v-if="selectedLocations[0] === location.id"
                        class="pi pi-check text-white text-xs"
                      ></i>
                    </div>
                  </div>
                  <p class="text-gray-600 text-sm mb-2">
                    {{ location.address }}
                  </p>
                  <div class="flex items-center text-sm text-gray-500 mt-2">
                    <i class="pi pi-users mr-1"></i>
                    <span
                      >{{ location.availablePositions }} positions
                      available</span
                    >
                  </div>

                  <div class="mt-3 flex justify-between items-center">
                    <a
                      :href="location.googleMapsUrl"
                      target="_blank"
                      class="text-indigo-600 text-sm hover:text-indigo-800 flex items-center"
                      @click.stop
                    >
                      <i class="pi pi-map-marker mr-1"></i> View on map
                    </a>
                    <Badge
                      v-if="location.notes"
                      value="Notes"
                      severity="info"
                      class="cursor-pointer"
                      @click.stop="showLocationNotes(location)"
                    ></Badge>
                  </div>
                </div>
              </div>

              <!-- Location Selection Error -->
              <small v-if="showLocationError" class="p-error block mt-2">
                Please select a location
              </small>
            </div>

            <!-- Right Column: Date Selection -->
            <div>
              <h2 class="text-xl font-semibold text-gray-800 mb-4">
                Select Working Dates
              </h2>
              <p class="text-gray-600 mb-4">
                Choose the dates you're available to work at this location
              </p>

              <!-- No Location Selected Message -->
              <div
                v-if="!selectedLocations.length"
                class="bg-gray-50 p-4 rounded-lg text-center"
              >
                <i class="pi pi-map-marker text-gray-300 text-3xl mb-2"></i>
                <p class="text-gray-500">
                  Please select a location first to see available dates
                </p>
              </div>

              <div v-else>
                <!-- Commit Full Event Button -->
                <div class="mb-4">
                  <Button
                    class="p-button-outlined w-full flex items-center"
                    @click="selectAllDates"
                    :disabled="availableDatesForLocation.length === 0"
                  >
                    <i class="pi pi-calendar mr-2"></i>
                    <span>Commit Full Event</span>
                    <Badge
                      :value="availableDatesForLocation.length"
                      severity="info"
                      class="ml-2"
                    ></Badge>
                  </Button>
                  <small class="text-green-600 mt-1 inline-block">
                    <i class="pi pi-info-circle mr-1"></i>
                    Committing to all dates increases your chances of selection
                  </small>
                </div>

                <!-- Calendar View - Use a different approach to highlight and control date selection -->
                <div class="mb-4 bg-white rounded-lg border border-gray-200">
                  <div
                    class="p-3 border-b border-gray-100 flex justify-between items-center"
                  >
                    <button
                      class="p-2 rounded-full hover:bg-gray-100"
                      @click="prevMonth"
                      type="button"
                    >
                      <i class="pi pi-chevron-left"></i>
                    </button>
                    <span class="font-medium">{{ currentMonthYear }}</span>
                    <button
                      class="p-2 rounded-full hover:bg-gray-100"
                      @click="nextMonth"
                      type="button"
                    >
                      <i class="pi pi-chevron-right"></i>
                    </button>
                  </div>

                  <!-- Days of Week Header -->
                  <div class="grid grid-cols-7 text-center p-2">
                    <div
                      v-for="day in ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']"
                      :key="day"
                      class="text-sm font-medium text-gray-700"
                    >
                      {{ day }}
                    </div>
                  </div>

                  <!-- Calendar Days -->
                  <div class="grid grid-cols-7 gap-1 p-2">
                    <!-- Empty cells for days before start of month -->
                    <div
                      v-for="_ in startDayOfMonth"
                      :key="`empty-start-${_}`"
                      class="h-10 rounded-md"
                    ></div>

                    <!-- Actual days of month -->
                    <div
                      v-for="day in daysInMonth"
                      :key="`day-${day}`"
                      class="h-10 flex items-center justify-center rounded-md relative"
                      :class="getDayClass(day)"
                      @click="toggleDateSelection(day)"
                    >
                      <span class="z-10">{{ day }}</span>
                    </div>

                    <!-- Empty cells for days after end of month -->
                    <div
                      v-for="_ in endDayOfMonth"
                      :key="`empty-end-${_}`"
                      class="h-10 rounded-md"
                    ></div>
                  </div>
                </div>

                <!-- Selected Dates Summary -->
                <div
                  v-if="selectedDates.length > 0"
                  class="bg-indigo-50 p-4 rounded-lg"
                >
                  <h3 class="font-medium text-indigo-800 mb-2">
                    Your Selected Dates
                  </h3>
                  <div class="flex flex-wrap gap-2">
                    <Chip
                      v-for="(date, index) in selectedDates"
                      :key="index"
                      :label="formatDate(date)"
                      class="bg-indigo-100 text-indigo-800"
                      aria-describedby="selected-date-chip-desc"
                    />
                  </div>
                  <span id="selected-date-chip-desc" class="sr-only"
                    >Selected dates.</span
                  >
                </div>

                <!-- Date Selection Error -->
                <small v-if="showDateError" class="p-error block mt-2">
                  Please select at least one date
                </small>
              </div>
            </div>
          </div>

          <!-- Next Button -->
          <div class="flex justify-end mt-6">
            <Button
              label="Continue to Review"
              icon="pi pi-arrow-right"
              iconPos="right"
              @click="validateAndProceed"
            />
          </div>
        </div>

        <!-- Step 2: Application Review & Confirmation -->
        <div
          v-else-if="activeIndex === 1"
          class="bg-white p-6 rounded-lg shadow-sm"
        >
          <div class="mb-6">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">
              Review Your Application
            </h2>

            <!-- Application Summary -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Job Details Card -->
              <div class="border border-gray-200 rounded-lg p-5">
                <h3
                  class="font-medium text-lg text-gray-800 mb-4 flex items-center"
                >
                  <i class="pi pi-briefcase text-indigo-500 mr-2"></i>
                  Job Details
                </h3>

                <div class="space-y-3">
                  <div class="flex">
                    <div class="w-28 text-gray-600">Position:</div>
                    <div class="font-medium text-gray-800">
                      {{ job?.title }}
                      <Badge
                        v-if="job?.jobTitleType"
                        :value="job?.jobTitleType"
                        severity="info"
                        class="ml-2"
                      ></Badge>
                    </div>
                  </div>
                  <div class="flex">
                    <div class="w-28 text-gray-600">Company:</div>
                    <div class="font-medium text-gray-800">
                      {{ job?.companyName || job?.company }}
                    </div>
                  </div>
                  <div class="flex">
                    <div class="w-28 text-gray-600">Salary:</div>
                    <div class="font-medium text-gray-800">
                      RM {{ job?.salary }}
                      <span class="text-sm text-gray-500 ml-1">
                        ({{ formatSalaryType(job?.salaryType) }})
                      </span>
                    </div>
                  </div>
                  <div class="flex">
                    <div class="w-28 text-gray-600">Payment Terms:</div>
                    <div class="font-medium text-gray-800 whitespace-nowrap">
                      {{ job?.paymentTerms ? job.paymentTerms : 'No mention' }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Selected Options Card -->
              <div class="border border-gray-200 rounded-lg p-5">
                <h3
                  class="font-medium text-lg text-gray-800 mb-4 flex items-center"
                >
                  <i class="pi pi-check-circle text-indigo-500 mr-2"></i>
                  Your Selections
                </h3>

                <!-- Selected Locations -->
                <div class="mb-4">
                  <h4 class="text-gray-600 font-medium mb-2 flex items-center">
                    <span
                      >Locations ({{ selectedLocationObjects.length }})</span
                    >
                    <span
                      class="text-xs font-normal text-indigo-500 ml-2 flex items-center"
                    >
                      <i class="pi pi-info-circle mr-1 text-indigo-400"></i>
                      click location name for details
                    </span>
                  </h4>
                  <div class="pl-2 space-y-2">
                    <div
                      v-for="location in selectedLocationObjects"
                      :key="location.id"
                      class="text-gray-800"
                    >
                      <i class="pi pi-map-marker text-indigo-400 mr-1"></i>
                      <span
                        class="cursor-pointer hover:text-indigo-600 hover:underline"
                        @click="showLocationDetails(location.id)"
                        >{{ location.name }}</span
                      >
                    </div>
                  </div>
                </div>

                <!-- Selected Dates -->
                <div>
                  <h4 class="text-gray-600 font-medium mb-2">
                    Dates ({{ selectedDates.length }})
                  </h4>
                  <div class="pl-2 flex flex-wrap gap-2">
                    <Chip
                      v-for="(date, index) in selectedDates.slice(0, 5)"
                      :key="index"
                      :label="formatDate(date)"
                      class="bg-indigo-100 text-indigo-800 text-sm"
                      aria-label="Selected date"
                    />
                    <Chip
                      v-if="selectedDates.length > 5"
                      :label="`+${selectedDates.length - 5} more`"
                      class="bg-gray-100 text-gray-800 text-sm"
                      aria-label="Additional selected dates"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Application Notes -->
            <div class="mt-6 border border-gray-200 rounded-lg p-5 bg-white">
              <h3
                class="font-medium text-lg text-gray-800 mb-4 flex items-center"
              >
                <i class="pi pi-comment text-indigo-500 mr-2"></i>
                Application Notes
              </h3>
              <div class="mb-2">
                <p class="text-gray-600 text-sm mb-2">
                  Add any additional information about your availability,
                  skills, or questions for the recruiter:
                </p>
                <Textarea
                  v-model="applicationNotes"
                  rows="4"
                  class="w-full"
                  placeholder="I have previous experience in similar roles. I'm particularly interested in..."
                />
                <small class="text-indigo-600 mt-2 inline-block">
                  <i class="pi pi-info-circle mr-1"></i>
                  Adding personalized notes increases your chances of being
                  selected by recruiters.
                </small>
              </div>
            </div>

            <!-- Profile Stats -->
            <div class="mt-6 p-5 border border-gray-200 rounded-lg bg-white">
              <h3
                class="font-medium text-lg text-gray-800 mb-4 flex items-center"
              >
                <i class="pi pi-user text-indigo-500 mr-2"></i>
                Your Profile Status
              </h3>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div class="flex items-center">
                    <i class="pi pi-file-pdf text-gray-600 mr-2"></i>
                    <span class="text-gray-700">Resume</span>
                  </div>
                  <div class="flex items-center">
                    <i
                      v-if="profileStats.data.hasResume"
                      class="pi pi-check-circle text-green-500 text-xl"
                    ></i>
                    <i
                      v-else
                      class="pi pi-times-circle text-red-500 text-xl"
                    ></i>
                  </div>
                </div>

                <div
                  class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div class="flex items-center">
                    <i class="pi pi-briefcase text-gray-600 mr-2"></i>
                    <span class="text-gray-700">Experience</span>
                  </div>
                  <div class="flex items-center">
                    <span
                      v-if="profileStats.data.experienceCount > 0"
                      class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium"
                    >
                      {{ profileStats.data.experienceCount }}
                    </span>
                    <i
                      v-else
                      class="pi pi-times-circle text-red-500 text-xl"
                    ></i>
                  </div>
                </div>

                <div
                  class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div class="flex items-center">
                    <i class="pi pi-camera text-gray-600 mr-2"></i>
                    <span class="text-gray-700">Work Photos</span>
                  </div>
                  <div class="flex items-center">
                    <span
                      v-if="profileStats.data.workingPhotoCount > 0"
                      class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium"
                    >
                      {{ profileStats.data.workingPhotoCount }}
                    </span>
                    <i
                      v-else
                      class="pi pi-times-circle text-red-500 text-xl"
                    ></i>
                  </div>
                </div>

                <div
                  class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div class="flex items-center">
                    <i class="pi pi-id-card text-gray-600 mr-2"></i>
                    <span class="text-gray-700">Personal Photos</span>
                  </div>
                  <div class="flex items-center">
                    <span
                      v-if="profileStats.data.comcardCount > 0"
                      class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium"
                    >
                      {{ profileStats.data.comcardCount }}
                    </span>
                    <i
                      v-else
                      class="pi pi-times-circle text-red-500 text-xl"
                    ></i>
                  </div>
                </div>
              </div>

              <!-- Location with Tips -->
              <div class="mt-4 flex items-start gap-4">
                <div
                  class="flex-1 flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div class="flex items-center">
                    <i class="pi pi-map-marker text-gray-600 mr-2"></i>
                    <div class="flex flex-col">
                      <span class="text-gray-700">Location</span>
                      <span class="text-xs text-gray-500 mt-0.5">{{
                        profileStats.data.preferredLocation || 'Not set'
                      }}</span>
                    </div>
                  </div>
                  <div class="flex items-center">
                    <i
                      v-if="profileStats.data.preferredLocation"
                      class="pi pi-check-circle text-green-500 text-xl"
                    ></i>
                    <i
                      v-else
                      class="pi pi-times-circle text-red-500 text-xl"
                    ></i>
                  </div>
                </div>
                <div
                  class="flex-1 text-sm text-gray-600 italic bg-blue-50 p-3 rounded-lg"
                >
                  <i class="pi pi-info-circle text-blue-500 mr-1"></i>
                  Our AI ranking system uses the distance between your profile
                  location and job location as one of the ranking indicators
                </div>
              </div>

              <div v-if="!isProfileComplete" class="mt-4 flex justify-center">
                <Button
                  label="Complete Your Profile"
                  icon="pi pi-user-edit"
                  class="p-button-warning"
                  @click="goToProfile"
                />
              </div>
            </div>

            <!-- Profile Completeness Warning -->
            <div
              class="mt-4 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400"
            >
              <h3 class="font-semibold text-yellow-800 mb-2 flex items-center">
                <i class="pi pi-exclamation-triangle text-yellow-500 mr-2"></i>
                Profile Completeness
              </h3>
              <p class="text-yellow-700 mb-2">
                Make sure your profile is complete with all required information
                before submitting:
              </p>
              <ul class="list-disc pl-6 space-y-1 text-yellow-700">
                <li>Professional photos uploaded</li>
                <li>Updated resume with relevant experience</li>
                <li>Work experience details fully completed</li>
                <li>Skills and qualifications added</li>
              </ul>
              <p class="text-yellow-700 mt-2 font-medium">
                A complete profile will increase your ranking in our AI matching
                system and improve your chances of being selected.
              </p>
            </div>

            <!-- No Last-Minute Cancellation Warning -->
            <div
              class="mt-4 p-4 bg-red-50 rounded-lg border-l-4 border-red-400"
            >
              <h3 class="font-semibold text-red-800 mb-2 flex items-center">
                <i class="pi pi-ban text-red-500 mr-2"></i>
                Cancellation Policy
              </h3>
              <p class="text-red-700">
                <span class="font-bold">IMPORTANT:</span> Once your application
                is confirmed by the recruiter, you cannot cancel without
                consequences. Last-minute cancellations or no-shows will
                significantly affect your reputation score in our system and
                reduce future job opportunities.
              </p>
              <p class="text-red-700 mt-2 font-medium">
                You may cancel before recruiter confirmation without penalty.
                After confirmation, your commitment is final.
              </p>
            </div>

            <!-- Terms & Conditions -->
            <div class="mt-6 p-4 bg-gray-50 rounded-lg">
              <div class="flex items-start">
                <Checkbox
                  v-model="termsAccepted"
                  :binary="true"
                  inputId="terms"
                />
                <label for="terms" class="ml-2 text-gray-700">
                  I confirm that I can commit to the dates and location I've
                  selected, and understand that no last-minute cancellations are
                  allowed after job confirmation. I have read and agree to the
                  <a href="#" class="text-indigo-600 hover:underline"
                    >Terms and Conditions</a
                  >
                  and confirm that all information provided is accurate.
                </label>
              </div>
            </div>
          </div>

          <!-- Navigation Buttons -->
          <div class="flex justify-between mt-6">
            <Button
              label="Back to Selection"
              icon="pi pi-arrow-left"
              class="p-button-outlined"
              @click="prevStep"
            />
            <Button
              label="Submit Application"
              icon="pi pi-check"
              :disabled="!termsAccepted"
              @click="handleSubmitClick"
              :loading="submitting"
            />
          </div>
        </div>

        <!-- Step 3: Success Page -->
        <div
          v-else-if="activeIndex === 2"
          class="bg-white p-6 rounded-lg shadow-sm text-center"
        >
          <div class="mb-6 flex flex-col items-center">
            <div
              class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6"
            >
              <i class="pi pi-check-circle text-green-500 text-4xl"></i>
            </div>
            <h2 class="text-2xl font-bold text-gray-800 mb-2">
              Application Submitted Successfully!
            </h2>
            <p class="text-gray-600 mb-6 max-w-lg mx-auto">
              Your application has been received. We'll review it and get back
              to you soon.
            </p>

            <!-- Next Steps -->
            <div
              class="bg-indigo-50 p-5 rounded-lg w-full max-w-lg mx-auto text-left"
            >
              <h3 class="font-semibold text-indigo-800 mb-3">What's Next?</h3>
              <ul class="space-y-3">
                <li class="flex items-start">
                  <i class="pi pi-envelope text-indigo-500 mt-1 mr-2"></i>
                  <span
                    >You'll receive a confirmation email with your application
                    details.</span
                  >
                </li>
                <li class="flex items-start">
                  <i class="pi pi-clock text-indigo-500 mt-1 mr-2"></i>
                  <span
                    >The recruiter will review your application within 1-3
                    business days.</span
                  >
                </li>
                <li class="flex items-start">
                  <i class="pi pi-user text-indigo-500 mt-1 mr-2"></i>
                  <span
                    >You may be contacted for an interview or additional
                    information.</span
                  >
                </li>
              </ul>
            </div>
          </div>

          <!-- Navigation Buttons -->
          <div class="flex justify-center gap-4 mt-6">
            <Button
              label="View My Applications"
              icon="pi pi-list"
              class="p-button-outlined"
              @click="goToMyApplications"
            />
            <Button
              label="Back to Jobs"
              icon="pi pi-search"
              @click="goToJobSearch"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Location Notes Dialog -->
    <Dialog
      v-model:visible="locationNotesVisible"
      header="Location Notes"
      :style="{ width: '450px' }"
      :modal="true"
    >
      <div v-if="selectedLocationNotes" class="p-4">
        <h3 class="font-medium text-lg mb-2">
          {{ selectedLocationNotes.name }}
        </h3>
        <p class="text-gray-700">{{ selectedLocationNotes.notes }}</p>
      </div>
    </Dialog>

    <!-- Location Details Dialog -->
    <Dialog
      v-model:visible="locationDetailDialog"
      header="Location Details"
      :style="{ width: '450px' }"
      :modal="true"
      :closable="true"
      class="location-dialog"
    >
      <div v-if="loadingLocation" class="flex justify-center p-4">
        <i class="pi pi-spin pi-spinner text-indigo-500 text-2xl"></i>
      </div>

      <div v-else-if="selectedLocation" class="p-4">
        <div class="bg-indigo-50 p-4 rounded-lg mb-4">
          <h3 class="text-xl font-semibold text-indigo-800 mb-2">
            {{ selectedLocation.name }}
          </h3>

          <div class="border-t border-indigo-200 pt-3 mt-2">
            <p class="text-gray-700 mb-4 leading-relaxed">
              {{ selectedLocation.address }}
            </p>

            <a
              :href="selectedLocation.googleMapsUrl"
              target="_blank"
              class="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition-colors duration-200 w-fit mt-2"
            >
              <i class="pi pi-map-marker"></i> View on Google Maps
            </a>
          </div>
        </div>
      </div>

      <div v-else class="p-4 text-center text-gray-500">
        Location details not available
      </div>
    </Dialog>

    <!-- Confirmation Dialog -->
    <Dialog
      v-model:visible="confirmDialogVisible"
      header="Confirm Application Submission"
      :style="{ width: '450px' }"
      :modal="true"
    >
      <div class="p-4">
        <p class="text-gray-700 mb-4">
          Are you sure you want to submit your application? This action cannot
          be undone.
        </p>
      </div>
      <div class="flex justify-end gap-4">
        <Button
          label="Cancel"
          icon="pi pi-times"
          class="p-button-outlined"
          @click="confirmDialogVisible = false"
        />
        <Button
          label="Submit"
          icon="pi pi-check"
          class="p-button-outlined p-button-primary"
          @click="submitApplication"
        />
      </div>
    </Dialog>

    <!-- Toast for notifications -->
    <Toast />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import axios from 'axios';

// PrimeVue Components
import Steps from 'primevue/steps';
import Button from 'primevue/button';
import Calendar from 'primevue/calendar';
import Chip from 'primevue/chip';
import ProgressSpinner from 'primevue/progressspinner';
import Dialog from 'primevue/dialog';
import Checkbox from 'primevue/checkbox';
import Badge from 'primevue/badge';
import Toast from 'primevue/toast';
import Textarea from 'primevue/textarea';

// Router and Toast
const route = useRoute();
const router = useRouter();
const toast = useToast();

// Steps definition with direct active property
const steps = ref([
  {
    label: 'Location & Date Selection',
    command: () => {
      activeIndex.value = 0;
    },
    icon: 'pi pi-map-marker',
  },
  {
    label: 'Review & Submit',
    command: () => {
      activeIndex.value = 1;
    },
    icon: 'pi pi-check-square',
  },
  {
    label: 'Confirmation',
    command: () => {
      activeIndex.value = 2;
    },
    icon: 'pi pi-check-circle',
  },
]);

// Make sure active index is reactive
const activeIndex = ref(0);
const loading = ref(true);
const error = ref(null);
const job = ref(null);
const availableLocations = ref([]);
const selectedLocations = ref([]);
const selectedDates = ref([]);
const termsAccepted = ref(false);
const submitting = ref(false);
const applicationReference = ref(
  'APP-' + Math.random().toString(36).substring(2, 10).toUpperCase()
);

// Validation error states
const showLocationError = ref(false);
const showDateError = ref(false);

// Location notes dialog
const locationNotesVisible = ref(false);
const selectedLocationNotes = ref(null);

// Calendar state
const currentMonth = ref(new Date().getMonth());
const currentYear = ref(new Date().getFullYear());

const API_BASE_URL = 'http://localhost:8080/api';

// After the applicationReference ref, replace the mock profile stats with a simple empty initialization
// Profile stats reference - initialized as empty and will be populated from API
const profileStats = ref({
  data: {
    candidateId: 0,
    experienceCount: 0,
    hasResume: false,
    workingPhotoCount: 0,
    comcardCount: 0,
  },
});

const applicationNotes = ref('');

const selectedDateToJobLocationMap = ref(new Map());

const confirmDialogVisible = ref(false);

// Replace the onMounted function
// Load job data from API
onMounted(async () => {
  const jobId = route.params.jobId;

  if (!jobId) {
    error.value = 'No job ID provided';
    loading.value = false;
    return;
  }

  try {
    loading.value = true;

    // Get token from localStorage
    const token = localStorage.getItem('accessToken');
    console.log(
      `Using token: ${token ? token.substring(0, 15) + '...' : 'null or empty'}`
    );

    // Log token format to verify
    console.log('Token format check - token length:', token ? token.length : 0);
    console.log(
      'Token format - first few characters:',
      token ? token.substring(0, 10) : 'none'
    );

    // Create request config with authorization header
    const config = {
      headers: {
        Authorization: token, // No 'Bearer' prefix as mentioned
      },
    };

    // Fetch job details with authorization
    const jobResponse = await axios.get(
      `${API_BASE_URL}/jobs/public/${jobId}`,
      config
    );
    if (jobResponse.data && jobResponse.data.data) {
      job.value = jobResponse.data.data;

      // Extract unique locations from the job schedules
      const locations = new Map();

      if (job.value.jobSchedules && job.value.jobSchedules.length > 0) {
        job.value.jobSchedules.forEach((schedule) => {
          if (schedule.scheduleDates && schedule.scheduleDates.length > 0) {
            schedule.scheduleDates.forEach((scheduleDate) => {
              if (
                scheduleDate.jobLocations &&
                scheduleDate.jobLocations.length > 0
              ) {
                scheduleDate.jobLocations.forEach((jobLocation) => {
                  if (
                    (jobLocation.status === 'OPEN' ||
                      jobLocation.status === 'PARTIAL_FILLED') &&
                    jobLocation.positionsNeeded > jobLocation.positionsFilled
                  ) {
                    if (!locations.has(jobLocation.locationId)) {
                      // Fetch location details if we have the locationId
                      locations.set(jobLocation.locationId, {
                        id: jobLocation.locationId,
                        name: jobLocation.locationName,
                        address: 'Loading address...',
                        googleMapsUrl: 'https://maps.google.com',
                        availablePositions:
                          jobLocation.positionsNeeded -
                          jobLocation.positionsFilled,
                        notes: jobLocation.notes || null,
                      });
                    }
                  }
                });
              }
            });
          }
        });
      }

      // Convert Map to Array
      availableLocations.value = Array.from(locations.values());

      // Fetch additional location details for each location
      await Promise.all(
        availableLocations.value.map(async (location) => {
          try {
            const locationResponse = await axios.get(
              `${API_BASE_URL}/locations/${location.id}`,
              config
            );
            if (locationResponse.data && locationResponse.data.data) {
              const locationDetails = locationResponse.data.data;
              location.address = locationDetails.address || location.address;
              location.googleMapsUrl =
                locationDetails.googleMapsUrl || location.googleMapsUrl;
              location.notes = locationDetails.notes || location.notes;
            }
          } catch (locError) {
            console.error(
              `Error fetching details for location ${location.id}:`,
              locError
            );
          }
        })
      );
    }

    // Also fetch candidate profile stats
    try {
      // Get the correct token key from localStorage - it's 'accessToken' not 'token'
      const token = localStorage.getItem('accessToken');
      console.log(
        'Profile Stats API - Token from localStorage:',
        token ? `${token.substring(0, 10)}...` : 'null or empty'
      );

      // Log all localStorage keys to debug
      console.log('All localStorage keys:', Object.keys(localStorage));

      // Check auth header format - use the correct token
      const authHeader = { Authorization: token };
      console.log('Profile Stats API - Auth header:', authHeader);

      // Use the correct API endpoint for profile stats
      console.log(
        'Profile Stats API - Calling endpoint:',
        `${API_BASE_URL}/candidates/profile-stats`
      );

      const statsResponse = await axios.get(
        `${API_BASE_URL}/candidates/profile-stats`,
        {
          headers: authHeader,
        }
      );

      console.log('Profile Stats API - Response status:', statsResponse.status);
      console.log('Profile Stats API - Response data:', statsResponse.data);

      if (statsResponse.data && statsResponse.data.data) {
        profileStats.value = statsResponse.data;
        console.log('Profile Stats API - Set profile stats successfully');
      }
    } catch (statsError) {
      console.error('Error fetching candidate profile stats:', statsError);
      console.error(
        'Error details:',
        statsError.response?.data || 'No response data'
      );
      console.error(
        'Error status:',
        statsError.response?.status || 'No status code'
      );
      console.error(
        'Error headers:',
        statsError.response?.headers || 'No headers'
      );

      // Handle error gracefully - show error message to user
      toast.add({
        severity: 'warn',
        summary: 'Profile Stats Unavailable',
        detail:
          "We couldn't load your profile statistics. Some features may be limited.",
        life: 5000,
      });
      // profileStats remains with default empty values
    }
  } catch (err) {
    console.error('Error fetching job data:', err);
    error.value = err.message || 'Failed to load job information';
  } finally {
    loading.value = false;
  }
});

watch(
  selectedLocations,
  (newSelectedLocations) => {
    if (newSelectedLocations.length > 0) {
      // Filter out selected dates that are no longer available for the location
      const availableDateStrings = availableDatesForLocation.value.map((date) =>
        date.toDateString()
      );

      // Only filter dates when location changes, not when removing individual dates
      if (selectedDates.value.length > 0) {
        selectedDates.value = selectedDates.value.filter((date) =>
          availableDateStrings.includes(new Date(date).toDateString())
        );
      }
    } else {
      // Clear selected dates if no location is selected
      selectedDates.value = [];
    }
  },
  { deep: true }
);

const isProfileComplete = computed(() => {
  const stats = profileStats.value.data;
  return (
    stats.experienceCount > 0 &&
    stats.hasResume &&
    stats.workingPhotoCount > 0 &&
    stats.comcardCount > 0
  );
});

// Computed properties
const currentStepTitle = computed(() => {
  const titles = [
    'Select Locations & Dates',
    'Review Your Application',
    'Application Submitted!',
  ];
  return titles[activeIndex.value];
});

const currentStepDescription = computed(() => {
  const descriptions = [
    'Choose where and when you would like to work',
    'Confirm your choices before submitting your application',
    'Your application has been successfully submitted',
  ];
  return descriptions[activeIndex.value];
});

const selectedLocationObjects = computed(() => {
  return availableLocations.value.filter((loc) =>
    selectedLocations.value.includes(loc.id)
  );
});

// Date constraints
const minDate = ref(new Date());
const maxDate = computed(() => {
  const date = new Date();
  date.setMonth(date.getMonth() + 3);
  return date;
});

// Available dates for selected location
const availableDatesForLocation = computed(() => {
  if (
    !selectedLocations.value.length ||
    !job.value ||
    !job.value.jobSchedules
  ) {
    return [];
  }

  const locationId = selectedLocations.value[0];
  const availableDates = [];

  job.value.jobSchedules.forEach((schedule) => {
    schedule.scheduleDates.forEach((scheduleDate) => {
      // Check if this location is available for this date
      const hasLocation = scheduleDate.jobLocations.some(
        (jobLocation) =>
          jobLocation.locationId.toString() === locationId.toString() &&
          (jobLocation.status === 'OPEN' ||
            jobLocation.status === 'PARTIAL_FILLED') &&
          jobLocation.positionsFilled < jobLocation.positionsNeeded
      );

      if (hasLocation) {
        availableDates.push(new Date(scheduleDate.workDate));
      }
    });
  });

  return availableDates;
});

// Unavailable dates - all dates except the available ones for the location
const unavailableDates = computed(() => {
  if (
    !selectedLocations.value.length ||
    !job.value ||
    !job.value.jobSchedules
  ) {
    return [];
  }

  // Get all possible dates from the job schedules
  const allPossibleDates = [];
  job.value.jobSchedules.forEach((schedule) => {
    schedule.scheduleDates.forEach((scheduleDate) => {
      allPossibleDates.push(new Date(scheduleDate.workDate).toDateString());
    });
  });

  // Get available dates for the location
  const availableDateStrings = availableDatesForLocation.value.map((date) =>
    date.toDateString()
  );

  // Create dates that are in allPossibleDates but not in availableDateStrings
  return allPossibleDates
    .filter((dateString) => !availableDateStrings.includes(dateString))
    .map((dateString) => new Date(dateString));
});

// Computed properties for the calendar
const currentMonthYear = computed(() => {
  const date = new Date(currentYear.value, currentMonth.value, 1);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
});

const daysInMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value + 1, 0).getDate();
});

const startDayOfMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value, 1).getDay();
});

const endDayOfMonth = computed(() => {
  const totalCells = 42; // 6 weeks x 7 days
  const usedCells = startDayOfMonth.value + daysInMonth.value;
  return totalCells - usedCells > 7
    ? totalCells - 7 - usedCells
    : totalCells - usedCells;
});

// Available days in current month for selected location
const availableDaysInCurrentMonth = computed(() => {
  if (!selectedLocations.value.length) return [];

  return availableDatesForLocation.value
    .filter(
      (date) =>
        date.getMonth() === currentMonth.value &&
        date.getFullYear() === currentYear.value
    )
    .map((date) => date.getDate());
});

// Currently selected days in this month
const selectedDaysInCurrentMonth = computed(() => {
  return selectedDates.value
    .filter((date) => {
      const d = new Date(date);
      return (
        d.getMonth() === currentMonth.value &&
        d.getFullYear() === currentYear.value
      );
    })
    .map((date) => new Date(date).getDate());
});

// Calendar navigation
const prevMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
};

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
};

// Check if a day is available for selection
const isDayAvailable = (day) => {
  return availableDaysInCurrentMonth.value.includes(day);
};

// Check if a day is selected - improve the detection logic
const isDaySelected = (day) => {
  return selectedDates.value.some((dateStr) => {
    const date = new Date(dateStr);
    return (
      date.getDate() === day &&
      date.getMonth() === currentMonth.value &&
      date.getFullYear() === currentYear.value
    );
  });
};

// Get the CSS class for a calendar day
const getDayClass = (day) => {
  const today = new Date();
  const isToday =
    day === today.getDate() &&
    currentMonth.value === today.getMonth() &&
    currentYear.value === today.getFullYear();

  const isAvailable = isDayAvailable(day);
  const isSelected = isDaySelected(day);

  return {
    'cursor-pointer hover:bg-indigo-100': isAvailable,
    'cursor-not-allowed opacity-40': !isAvailable,
    'bg-indigo-500 text-white hover:bg-indigo-600': isSelected,
    'bg-indigo-100': isToday && !isSelected,
    'border border-indigo-200': isAvailable && !isSelected,
  };
};

// Toggle date selection
const toggleDateSelection = (day) => {
  if (!isDayAvailable(day)) {
    console.log(
      `Date ${day}/${currentMonth.value + 1}/${
        currentYear.value
      } is not available for selection`
    );
    return;
  }

  // Create date properly - months in JS are 0-indexed
  const newDate = new Date(currentYear.value, currentMonth.value, day);

  // Format date for display
  const formattedDate = formatDate(newDate);

  // Create consistent date string for API comparison (YYYY-MM-DD format)
  const year = newDate.getFullYear();
  const month = String(newDate.getMonth() + 1).padStart(2, '0');
  const dayStr = String(newDate.getDate()).padStart(2, '0');
  const dateStr = `${year}-${month}-${dayStr}`;

  console.log(
    `Working with date: day=${day}, month=${currentMonth.value + 1}, year=${
      currentYear.value
    }`
  );
  console.log(`Date string for API comparison: ${dateStr}`);

  // Check if date is already selected
  const index = selectedDates.value.findIndex((d) => {
    const selectedDate = new Date(d);
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentMonth.value &&
      selectedDate.getFullYear() === currentYear.value
    );
  });

  // Find the job location ID directly from the job data
  const locationId = selectedLocations.value[0];
  let jobLocationId = null;

  if (locationId && job.value?.jobSchedules) {
    console.log(
      `Searching for job location ID for date=${dateStr} and locationId=${locationId}`
    );

    // Check each schedule date
    for (const schedule of job.value.jobSchedules) {
      for (const scheduleDate of schedule.scheduleDates) {
        // Get the date string in YYYY-MM-DD format for comparison
        const apiDateStr = scheduleDate.workDate.split('T')[0];

        console.log(
          `Comparing with API date: ${apiDateStr}, match: ${
            apiDateStr === dateStr
          }`
        );

        // If date matches
        if (apiDateStr === dateStr) {
          console.log(
            `Found matching date in scheduleDate ID: ${scheduleDate.id}`
          );

          // Log all available locations for this date
          for (const loc of scheduleDate.jobLocations) {
            console.log(
              `Available location: ID=${loc.id}, locationId=${loc.locationId}, name=${loc.locationName}`
            );
          }

          // Find the matching location
          const matchingLocation = scheduleDate.jobLocations.find(
            (loc) =>
              Number(loc.locationId) === Number(locationId) &&
              (loc.status === 'OPEN' || loc.status === 'PARTIAL_FILLED') &&
              loc.positionsFilled < loc.positionsNeeded
          );

          if (matchingLocation) {
            jobLocationId = matchingLocation.id;
            console.log(
              `✅ FOUND MATCH: Job location ID ${jobLocationId} for ${matchingLocation.locationName}`
            );
            break;
          }
        }
      }

      if (jobLocationId) break; 
    }
  }

  if (index >= 0) {
    // Remove date
    console.log(`Removing date: ${formattedDate}`);
    selectedDates.value.splice(index, 1);

    // Remove from mapping
    selectedDateToJobLocationMap.value.delete(dateStr);
    console.log(`Removed date ${dateStr} from mapping`);
  } else {
    // Generate ISO string for adding to selectedDates
    const dateISO = newDate.toISOString();

    // Add date
    console.log(`Adding date: ${formattedDate} (${dateISO})`);
    selectedDates.value.push(dateISO);

    // Add to mapping if job location ID was found
    if (jobLocationId) {
      selectedDateToJobLocationMap.value.set(dateStr, jobLocationId);
      console.log(
        `Added job location ID ${jobLocationId} for date ${dateStr} to mapping`
      );
    } else {
      console.error(
        `❌ FAILED to find job location ID for date ${dateStr} and location ${locationId}`
      );
    }

    showDateError.value = false;
  }

  // Log current state
  console.log(
    'Current selected dates:',
    selectedDates.value.map((d) => formatDate(new Date(d)))
  );
  console.log(
    'Current date-to-job-location mapping:',
    Object.fromEntries(selectedDateToJobLocationMap.value)
  );
};

// Select all available dates for the selected location
const selectAllDates = () => {
  console.log(
    'Selecting all available dates for location:',
    selectedLocations.value[0]
  );

  // Get ISO strings for all available dates for this location
  const availableDatesISO = availableDatesForLocation.value.map((date) =>
    date.toISOString()
  );

  // Set selected dates to all available dates
  selectedDates.value = [...availableDatesISO];
  showDateError.value = false;

  // Clear and rebuild the date-to-job-location mapping
  selectedDateToJobLocationMap.value.clear();

  // Get locationId for mapping
  const locationId = selectedLocations.value[0];

  if (!locationId || !job.value?.jobSchedules) {
    console.warn('Cannot build mapping: missing locationId or job schedules');
    return;
  }

  console.log(
    `Building mapping for ${availableDatesISO.length} dates with locationId=${locationId}`
  );

  // For each selected date, find the corresponding job location ID
  availableDatesISO.forEach((dateISO) => {
    const date = new Date(dateISO);

    // Format date to YYYY-MM-DD string for API comparison
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    // Find matching schedule date and location
    let found = false;

    // Check each schedule date
    for (const schedule of job.value.jobSchedules) {
      for (const scheduleDate of schedule.scheduleDates) {
        // Get date string from API for comparison
        const apiDateStr = scheduleDate.workDate.split('T')[0];

        // If date matches
        if (apiDateStr === dateStr) {
          // Find matching location
          const matchingLocation = scheduleDate.jobLocations.find(
            (loc) =>
              Number(loc.locationId) === Number(locationId) &&
              (loc.status === 'OPEN' || loc.status === 'PARTIAL_FILLED') &&
              loc.positionsFilled < loc.positionsNeeded
          );

          if (matchingLocation) {
            // Add to mapping
            selectedDateToJobLocationMap.value.set(
              dateStr,
              matchingLocation.id
            );
            console.log(
              `Added mapping: ${dateStr} -> Job Location ID ${matchingLocation.id} (${matchingLocation.locationName})`
            );
            found = true;
            break;
          }
        }
      }
      if (found) break;
    }

    if (!found) {
      console.error(
        `❌ Could not find job location ID for date ${dateStr} and location ${locationId}`
      );
    }
  });

  // Log the final mapping
  console.log(
    `Created mapping for ${selectedDateToJobLocationMap.value.size} dates`
  );
  console.log(
    'Complete mapping:',
    Object.fromEntries(selectedDateToJobLocationMap.value)
  );
  console.log(
    'Job location IDs:',
    Array.from(selectedDateToJobLocationMap.value.values())
  );

  toast.add({
    severity: 'success',
    summary: 'Full Event Selected',
    detail: `You've committed to all ${selectedDates.value.length} days of this event`,
    life: 3000,
  });
};

// Methods for location selection - updated for single location selection
const selectLocation = (locationId) => {
  console.log(
    `Location selection changed: ${
      selectedLocations.value[0] ? 'from ' + selectedLocations.value[0] : 'none'
    } to ${locationId}`
  );

  // If selecting a different location, clear the selected dates and mapping
  if (selectedLocations.value[0] !== locationId) {
    if (selectedDates.value.length > 0) {
      console.log(
        `Clearing ${selectedDates.value.length} previously selected dates due to location change`
      );
      console.log('Clearing date-to-job-location mapping');
    }
    // Clear all selected dates when changing location
    selectedDates.value = [];
    // Clear the date-to-job-location mapping
    selectedDateToJobLocationMap.value.clear();
  }

  selectedLocations.value = [locationId]; // Only one location can be selected
  console.log(
    `New selected location: ${locationId}, location name: ${
      availableLocations.value.find((loc) => loc.id === locationId)?.name
    }`
  );
  showLocationError.value = false;
};

const showLocationNotes = (location) => {
  selectedLocationNotes.value = location;
  locationNotesVisible.value = true;
};

// Methods for date selection
const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

const removeDate = (index) => {
  // Store the date being removed to debug
  const dateBeingRemoved = selectedDates.value[index];
  console.log(
    'Removing date at index:',
    index,
    'Date value:',
    dateBeingRemoved
  );

  // Create a copy of the current dates before removing
  const previousDates = [...selectedDates.value];

  // Remove only the specific date at the given index
  selectedDates.value.splice(index, 1);

  console.log('Dates after removal:', selectedDates.value);

  // Force calendar to update by triggering a redraw
  nextTick(() => {
    // Force recomputation of selectedDaysInCurrentMonth
    const currentSelectedDates = selectedDaysInCurrentMonth.value;
    console.log(
      'Selected days in current month after removal:',
      currentSelectedDates
    );
  });
};

// Validate selections and proceed to next step
const validateAndProceed = () => {
  let isValid = true;

  if (selectedLocations.value.length === 0) {
    showLocationError.value = true;
    isValid = false;
  } else {
    showLocationError.value = false;
  }

  if (selectedDates.value.length === 0) {
    showDateError.value = true;
    isValid = false;
  } else {
    showDateError.value = false;
  }

  if (isValid) {
    console.log('Validation passed! Current activeIndex:', activeIndex.value);

    // Force a clean update to step 2 (index 1)
    activeIndex.value = 0; // Reset first to ensure clean state
    setTimeout(() => {
      activeIndex.value = 1; // Then set to step 2
      console.log('Updated activeIndex to:', activeIndex.value);

      // Force reactivity by creating a new steps array
      steps.value = JSON.parse(JSON.stringify(steps.value));
    }, 0);
  } else {
    // Scroll to error
    toast.add({
      severity: 'warn',
      summary: 'Missing Information',
      detail: 'Please select at least one location and one date',
      life: 3000,
    });
  }
};

// Navigation methods
const nextStep = () => {
  if (activeIndex.value < steps.value.length - 1) {
    activeIndex.value++;
    console.log('Advanced to step:', activeIndex.value);
  }
};

const prevStep = () => {
  if (activeIndex.value > 0) {
    activeIndex.value--;
    console.log('Went back to step:', activeIndex.value);
  }
};

const goBackToJob = () => {
  const jobId = route.params.jobId;
  if (jobId) {
    // Navigate back to FindJobs with the specific job selected for display
    router.push({
      name: 'FindJobs',
      query: { showJob: jobId },
    });
  } else {
    // Fallback to standard back navigation if no job ID is available
    router.back();
  }
};

const goToMyApplications = () => {
  router.push({ name: 'MyApplications' });
};

const goToJobSearch = () => {
  router.push({ name: 'FindJobs' });
};

// Update the submitApplication function to first show the confirmation dialog
const handleSubmitClick = () => {
  // Verify terms are accepted first
  if (!termsAccepted.value) {
    toast.add({
      severity: 'warn',
      summary: 'Terms Required',
      detail: 'Please accept the terms and conditions to continue',
      life: 3000,
    });
    return;
  }

  // Get job location IDs and validate
  const jobLocationIds = getJobLocationIds();
  if (jobLocationIds.length === 0) {
    toast.add({
      severity: 'error',
      summary: 'Selection Error',
      detail:
        'No valid job location IDs found for the selected dates and location.',
      life: 3000,
    });
    return;
  }

  // Show confirmation dialog
  confirmDialogVisible.value = true;
};

// Actual submission logic moved to a separate function
const submitApplication = async () => {
  // Hide the confirmation dialog
  confirmDialogVisible.value = false;

  // Set submitting state to show loading indicator
  submitting.value = true;

  try {
    // Get token from localStorage
    const token = localStorage.getItem('accessToken');
    console.log(
      `Using token for submission: ${
        token ? token.substring(0, 15) + '...' : 'null or empty'
      }`
    );
    console.log('Token format check - token length:', token ? token.length : 0);
    console.log(
      'Token format - first few characters:',
      token ? token.substring(0, 10) : 'none'
    );

    // Get job location IDs and validate
    const jobLocationIds = getJobLocationIds();
    if (jobLocationIds.length === 0) {
      throw new Error(
        'No valid job location IDs found for the selected dates and location.'
      );
    }

    if (jobLocationIds.length !== selectedDates.value.length) {
      console.warn(
        `Mismatch between selected dates (${selectedDates.value.length}) and job location IDs (${jobLocationIds.length})`
      );
    }

    // Prepare application data
    const applicationData = {
      jobLocationIds: jobLocationIds,
      notes: applicationNotes.value || '',
    };

    console.log('Submitting application with data:', applicationData);

    // Call the API to submit the application
    const response = await axios.post(
      `${API_BASE_URL}/candidates/applications`,
      applicationData,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    // Show success message
    toast.add({
      severity: 'success',
      summary: 'Application Submitted',
      detail: 'Your job application has been submitted successfully!',
      life: 5000,
    });

    // Store reference number from response if available
    if (
      response.data &&
      response.data.data &&
      response.data.data.referenceNumber
    ) {
      applicationReference.value = response.data.data.referenceNumber;
    } else if (response.data && response.data.data && response.data.data.id) {
      // Use application ID as reference if no specific reference number
      applicationReference.value = `APP-${response.data.data.id}`;
    }

    // Move to the confirmation step with the force-update pattern
    activeIndex.value = 1; // Reset to ensure clean transition
    setTimeout(() => {
      activeIndex.value = 2; // Move to step 3 (confirmation)
      console.log('Advanced to confirmation step:', activeIndex.value);

      // Force reactivity by creating a new steps array
      steps.value = JSON.parse(JSON.stringify(steps.value));
    }, 0);
  } catch (submitError) {
    // Handle error
    console.error('Error submitting application:', submitError);
    toast.add({
      severity: 'error',
      summary: 'Submission Failed',
      detail:
        submitError.response?.data?.message ||
        submitError.message ||
        'Failed to submit your application. Please try again.',
      life: 5000,
    });
  } finally {
    // Reset submitting state
    submitting.value = false;
  }
};

// Copy reference to clipboard
const copyReference = () => {
  navigator.clipboard
    .writeText(applicationReference.value)
    .then(() => {
      toast.add({
        severity: 'info',
        summary: 'Copied!',
        detail: 'Reference number copied to clipboard',
        life: 2000,
      });
    })
    .catch((err) => {
      console.error('Error copying to clipboard:', err);
    });
};

// Update the goToProfile method to correctly redirect to the Profile page
const goToProfile = () => {
  router.push({
    name: 'CandidateProfile', // Update to the correct route name for candidate profile
    params: {},
  });
};

const locationDetailDialog = ref(false);
const selectedLocation = ref(null);
const loadingLocation = ref(false);

// Update showLocationDetails method
const showLocationDetails = async (locationId) => {
  if (!locationId) return;

  loadingLocation.value = true;
  locationDetailDialog.value = true;

  selectedLocation.value = availableLocations.value.find(
    (loc) => loc.id === locationId
  );

  if (
    selectedLocation.value &&
    (!selectedLocation.value.address ||
      selectedLocation.value.address === 'Loading address...')
  ) {
    try {
      // Get the correct token key from localStorage - it's 'accessToken' not 'token'
      const token = localStorage.getItem('accessToken');
      const config = {
        headers: {
          Authorization: token,
        },
      };

      const response = await axios.get(
        `${API_BASE_URL}/locations/${locationId}`,
        config
      );
      if (response.data && response.data.data) {
        const locationDetails = response.data.data;
        selectedLocation.value = {
          ...selectedLocation.value,
          address: locationDetails.address || selectedLocation.value.address,
          googleMapsUrl:
            locationDetails.googleMapsUrl ||
            selectedLocation.value.googleMapsUrl,
          notes: locationDetails.notes || selectedLocation.value.notes,
        };

        const index = availableLocations.value.findIndex(
          (loc) => loc.id === locationId
        );
        if (index !== -1) {
          availableLocations.value[index] = selectedLocation.value;
        }
      }
    } catch (error) {
      console.error('Error fetching location details:', error);
    }
  }

  loadingLocation.value = false;
};

const formatSalaryType = (salaryType) => {
  if (!salaryType) return '';

  // Convert from PER_DAY to Per Day format
  const formatted = salaryType.toLowerCase().replace(/_/g, ' ');
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};

// Watch for activeIndex changes to ensure Steps component updates
watch(activeIndex, (newValue, oldValue) => {
  console.log(`Step changed from ${oldValue} to ${newValue}`);
  // Force a redraw of the steps component
  nextTick(() => {
    steps.value = [...steps.value];
  });
});

// Helper function to get job location IDs based on selected dates and location
const getJobLocationIds = () => {
  console.log('Getting job location IDs for submission...');

  // Get the job location IDs directly from our mapping
  const jobLocationIds = Array.from(
    selectedDateToJobLocationMap.value.values()
  );

  console.log(
    `Found ${jobLocationIds.length} job location IDs from ${selectedDates.value.length} selected dates`
  );
  console.log('Job location IDs to submit:', jobLocationIds);

  return jobLocationIds;
};
</script>

<style scoped>
/* Base styling for the steps component */
:deep(.p-steps) {
  background: white;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

:deep(.p-steps .p-steps-item .p-menuitem-link) {
  background: transparent !important;
  padding: 0.5rem 1rem;
}

:deep(.p-steps .p-steps-item .p-menuitem-link .p-steps-number) {
  background: #f3f4f6;
  color: #4f46e5;
  border-color: #e5e7eb;
}

:deep(.p-steps .p-steps-item.p-highlight .p-steps-number) {
  background: #4f46e5 !important;
  color: white !important;
  border-color: #4f46e5 !important;
}

:deep(.p-steps .p-steps-item.p-highlight .p-steps-title) {
  color: #4f46e5 !important;
  font-weight: 600 !important;
}

/* Force highlight styles for each step when active */
:deep(.p-steps .p-steps-item:nth-child(1)) .p-steps-number {
  background-color: v-bind(
    'activeIndex >= 0 ? "#4f46e5" : "#f3f4f6"'
  ) !important;
  color: v-bind('activeIndex >= 0 ? "white" : "#4f46e5"') !important;
  border-color: v-bind('activeIndex >= 0 ? "#4f46e5" : "#e5e7eb"') !important;
  opacity: 1 !important;
}

:deep(.p-steps .p-steps-item:nth-child(2)) .p-steps-number {
  background-color: v-bind(
    'activeIndex >= 1 ? "#4f46e5" : "#f3f4f6"'
  ) !important;
  color: v-bind('activeIndex >= 1 ? "white" : "#4f46e5"') !important;
  border-color: v-bind('activeIndex >= 1 ? "#4f46e5" : "#e5e7eb"') !important;
  opacity: 1 !important;
}

:deep(.p-steps .p-steps-item:nth-child(3)) .p-steps-number {
  background-color: v-bind(
    'activeIndex >= 2 ? "#4f46e5" : "#f3f4f6"'
  ) !important;
  color: v-bind('activeIndex >= 2 ? "white" : "#4f46e5"') !important;
  border-color: v-bind('activeIndex >= 2 ? "#4f46e5" : "#e5e7eb"') !important;
  opacity: 1 !important;
}

:deep(.p-steps .p-steps-item:nth-child(1)) .p-steps-title {
  color: v-bind('activeIndex >= 0 ? "#4f46e5" : "#64748b"') !important;
  opacity: 1 !important;
}

:deep(.p-steps .p-steps-item:nth-child(2)) .p-steps-title {
  color: v-bind('activeIndex >= 1 ? "#4f46e5" : "#64748b"') !important;
  opacity: 1 !important;
}

:deep(.p-steps .p-steps-item:nth-child(3)) .p-steps-title {
  color: v-bind('activeIndex >= 2 ? "#4f46e5" : "#64748b"') !important;
  opacity: 1 !important;
}

/* Special styling for unlocked steps */
:deep(.unlocked-steps .p-steps-item) {
  opacity: 1 !important;
}

:deep(.unlocked-steps .p-steps-item .p-menuitem-link) {
  pointer-events: auto !important;
  cursor: pointer !important;
  opacity: 1 !important;
}

:deep(.unlocked-steps .p-steps-item .p-steps-title) {
  opacity: 1 !important;
}
</style>
