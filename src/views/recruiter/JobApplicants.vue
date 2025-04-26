<template>
  <div class="p-6 bg-gray-50 min-h-screen relative">
    <div class="mb-6">
      <div class="flex items-center">
        <Button
          icon="pi pi-arrow-left"
          class="p-button-text p-button-rounded mr-2"
          @click="goBack"
        />
        <div>
          <h1 class="text-2xl font-bold text-gray-900 mb-1">Job Applicants</h1>
          <div class="flex items-center text-gray-600">
            <i class="pi pi-briefcase text-primary-500 mr-2"></i>
            <span>{{ job?.title || 'Loading job details...' }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading" class="text-center py-8">
      <ProgressSpinner
        style="width: 50px; height: 50px"
        strokeWidth="8"
        fill="var(--surface-ground)"
        animationDuration=".5s"
      />
      <p class="mt-4 text-gray-600">Loading applicants...</p>
    </div>

    <div v-else-if="!job" class="text-center py-12">
      <div
        class="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6"
      >
        <i class="pi pi-exclamation-circle text-gray-400 text-3xl"></i>
      </div>
      <h3 class="text-xl font-medium text-gray-700 mb-3">Job Not Found</h3>
      <p class="text-gray-500 mb-6 max-w-md mx-auto">
        The job you're looking for does not exist or has been deleted
      </p>
      <Button
        label="Go Back"
        icon="pi pi-arrow-left"
        @click="goBack"
        class="p-button-primary px-4 py-2"
      />
    </div>

    <div v-else>
      <!-- Cancellation Overlay - Display when job is cancelled -->
      <div
        v-if="job.status === 'CANCELLED'"
        class="fixed inset-0 bg-gray-800 bg-opacity-70 z-50 flex flex-col items-center justify-center backdrop-blur-sm"
      >
        <div class="bg-white p-8 rounded-lg shadow-2xl max-w-lg text-center">
          <div class="bg-red-100 rounded-full p-5 inline-flex mx-auto mb-5">
            <i class="pi pi-exclamation-triangle text-red-500 text-5xl"></i>
          </div>
          <h2 class="text-2xl font-bold text-gray-800 mb-3">
            Job Is Cancelled
          </h2>
          <div
            class="mb-6 bg-red-50 p-4 rounded-lg border-l-4 border-red-500 text-left"
          >
            <p class="text-gray-700 mb-3">
              This job has been cancelled and all applicants have been
              automatically notified. No further actions can be taken on this
              job or its applicants.
            </p>
            <p class="text-gray-700">
              <i class="pi pi-info-circle text-red-500 mr-2"></i>
              Frequently cancelling jobs may lower your recruiter reputation in
              the system.
            </p>
          </div>
          <Button
            label="Return to Previous Page"
            icon="pi pi-arrow-left"
            @click="goBack"
            class="p-button-primary px-5 py-2"
          />
        </div>
      </div>

      <!-- Job Status Card -->
      <div class="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
        <div class="bg-indigo-600 py-3 px-4 flex items-center justify-between">
          <div class="flex items-center">
            <i class="pi pi-briefcase text-white mr-2"></i>
            <span class="text-white font-medium">Job Status</span>
          </div>
          <Tag
            :value="formatJobStatus(job.status)"
            :severity="getJobStatusSeverity(job.status)"
            class="text-xs font-semibold"
          />
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div
              class="bg-blue-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-all"
            >
              <div class="flex items-center">
                <div class="bg-blue-100 rounded-full p-2 mr-3">
                  <i class="pi pi-users text-blue-700"></i>
                </div>
                <div>
                  <h3 class="text-sm font-medium text-blue-700">
                    Total Applicants
                  </h3>
                  <p class="text-2xl font-semibold text-blue-900">
                    {{ totalApplicants }}
                  </p>
                </div>
              </div>
            </div>

            <div
              class="bg-green-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-all"
            >
              <div class="flex items-center">
                <div class="bg-green-100 rounded-full p-2 mr-3">
                  <i class="pi pi-check-circle text-green-700"></i>
                </div>
                <div>
                  <h3 class="text-sm font-medium text-green-700">
                    Shortlisted/Hired
                  </h3>
                  <p class="text-2xl font-semibold text-green-900">
                    {{ getApprovedCount() }}
                  </p>
                </div>
              </div>
            </div>

            <div
              class="bg-amber-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-all"
            >
              <div class="flex items-center">
                <div class="bg-amber-100 rounded-full p-2 mr-3">
                  <i class="pi pi-clock text-amber-700"></i>
                </div>
                <div>
                  <h3 class="text-sm font-medium text-amber-700">
                    Pending/Review
                  </h3>
                  <p class="text-2xl font-semibold text-amber-900">
                    {{ getPendingCount() }}
                  </p>
                </div>
              </div>
            </div>

            <div
              class="bg-red-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-all"
            >
              <div class="flex items-center">
                <div class="bg-red-100 rounded-full p-2 mr-3">
                  <i class="pi pi-times-circle text-red-700"></i>
                </div>
                <div>
                  <h3 class="text-sm font-medium text-red-700">Rejected</h3>
                  <p class="text-2xl font-semibold text-red-900">
                    {{ getRejectedCount() }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Applicant Filters -->
      <div class="bg-white rounded-lg shadow-md mb-4 overflow-hidden">
        <div class="p-4 border-b flex justify-between items-center bg-gray-50">
          <div class="flex items-center">
            <i class="pi pi-filter text-indigo-600 mr-2"></i>
            <h3 class="font-semibold">Filter & Sort Applicants</h3>
          </div>
          <Button
            v-if="hasActiveFilters"
            label="Clear All"
            icon="pi pi-filter-slash"
            class="p-button-outlined p-button-sm p-button-secondary"
            @click="clearFilters"
          />
        </div>

        <div class="p-4">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="col-span-1">
              <label
                for="search"
                class="block text-gray-700 text-sm font-medium mb-1"
              >
                Search
              </label>
              <InputText
                id="search"
                v-model="filters.search"
                placeholder="Search by name or email"
                class="w-full"
              />
            </div>

            <div class="col-span-1">
              <label
                for="status"
                class="block text-gray-700 text-sm font-medium mb-1"
              >
                Status
              </label>
              <Dropdown
                id="status"
                v-model="filters.status"
                :options="statusOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="All Statuses"
                class="w-full"
              />
            </div>

            <div class="col-span-1">
              <label
                for="sortField"
                class="block text-gray-700 text-sm font-medium mb-1"
              >
                Sort By
              </label>
              <Dropdown
                id="sortField"
                v-model="filters.sortField"
                :options="sortFieldOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Sort By"
                class="w-full"
              />
            </div>

            <div class="col-span-1">
              <label
                for="sortOrder"
                class="block text-gray-700 text-sm font-medium mb-1"
              >
                Order
              </label>
              <div class="flex gap-2">
                <Button
                  :class="{
                    'p-button-primary': filters.sortOrder === 'desc',
                    'p-button-outlined p-button-secondary':
                      filters.sortOrder !== 'desc',
                  }"
                  icon="pi pi-sort-amount-down"
                  class="flex-1"
                  @click="filters.sortOrder = 'desc'"
                  tooltip="Highest First"
                />
                <Button
                  :class="{
                    'p-button-primary': filters.sortOrder === 'asc',
                    'p-button-outlined p-button-secondary':
                      filters.sortOrder !== 'asc',
                  }"
                  icon="pi pi-sort-amount-up-alt"
                  class="flex-1"
                  @click="filters.sortOrder = 'asc'"
                  tooltip="Lowest First"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- AI Disclaimer Card -->
      <div
        class="mb-6 bg-white rounded-lg shadow-md overflow-hidden border-l-4 border-indigo-500"
      >
        <div class="p-4">
          <div class="flex items-start">
            <div class="bg-indigo-100 rounded-full p-2 mr-3 mt-1 flex-shrink-0">
              <i class="pi pi-info-circle text-indigo-600"></i>
            </div>
            <div>
              <h3 class="font-medium text-gray-800 mb-1">
                AI-Powered Candidate Ranking
              </h3>
              <p class="text-sm text-gray-600 mb-2">
                Candidates are ranked using an AI algorithm that evaluates
                multiple factors. While our AI provides sophisticated analysis,
                please note:
              </p>
              <ul
                class="text-xs text-gray-600 space-y-1 list-disc list-inside ml-1"
              >
                <li>
                  <span class="font-medium">Score estimates</span> should be
                  verified with manual review
                </li>
                <li>
                  <span class="font-medium">Location distance</span> is based on
                  geographical distance in kilometers calculated using
                  longitude/latitude coordinates and may not account for actual
                  travel options (train, bus, etc.)
                </li>
                <li>
                  <span class="font-medium">AI can make mistakes</span> - your
                  professional judgment remains essential
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Applicants List -->
      <div class="mb-6 bg-white rounded-lg shadow-md overflow-hidden">
        <div class="bg-indigo-600 py-3 px-4 flex items-center justify-between">
          <div class="flex items-center">
            <i class="pi pi-users text-white mr-2"></i>
            <span class="text-white font-medium">Applicants</span>
          </div>
          <div class="text-white text-sm bg-indigo-700 py-1 px-3 rounded-full">
            <span v-if="applicants.length > 0"
              >{{ totalApplicants }} result{{
                totalApplicants !== 1 ? 's' : ''
              }}</span
            >
          </div>
        </div>

        <div v-if="loading" class="text-center py-16">
          <ProgressSpinner
            style="width: 40px; height: 40px"
            strokeWidth="4"
            animationDuration=".5s"
          />
          <p class="mt-3 text-gray-600">Loading applicants...</p>
        </div>

        <div v-else-if="applicants.length === 0" class="text-center py-12">
          <div
            class="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6"
          >
            <i class="pi pi-search text-gray-400 text-3xl"></i>
          </div>
          <h3 class="text-xl font-medium text-gray-700 mb-3">
            No Applicants Found
          </h3>
          <p class="text-gray-500 mb-6 max-w-md mx-auto">
            There are no applicants for this job listing yet{{
              hasActiveFilters ? ' matching your filters' : ''
            }}
          </p>
          <Button
            v-if="hasActiveFilters"
            label="Clear Filters"
            icon="pi pi-filter-slash"
            class="p-button-outlined p-button-secondary"
            @click="clearFilters"
          />
        </div>

        <div v-else class="px-4 py-2">
          <DataTable
            :value="applicants"
            class="p-datatable-sm"
            :rowHover="true"
            paginator
            :rows="pageSize"
            :totalRecords="totalApplicants"
            :lazy="true"
            @page="onPageChange"
            :first="currentPage * pageSize"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
            currentPageReportTemplate="{first} to {last} of {totalRecords} applicants"
            responsiveLayout="scroll"
            tableStyle="min-width: 50rem"
          >
            <Column
              field="rank"
              header="Rank"
              headerClass="w-16 text-left"
              bodyClass="text-left"
            >
              <template #body="{ data, index }">
                <div class="flex">
                  <div
                    class="w-8 h-8 rounded-full flex items-center justify-center"
                    :class="[
                      index === 0
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : index === 1
                        ? 'bg-slate-100 text-slate-800 border border-slate-300'
                        : index === 2
                        ? 'bg-orange-100 text-orange-800 border border-orange-300'
                        : 'bg-gray-50 text-gray-600 border border-gray-200',
                    ]"
                  >
                    {{ currentPage * pageSize + index + 1 }}
                  </div>
                </div>
              </template>
            </Column>

            <Column
              field="candidateName"
              header="Candidate"
              headerClass="w-64 text-left"
            >
              <template #body="{ data }">
                <div class="flex items-center">
                  <div
                    class="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3 overflow-hidden border border-indigo-200"
                  >
                    <img
                      v-if="data.profilePictureUrl"
                      :src="getProfilePictureUrl(data.profilePictureUrl)"
                      :alt="data.candidateName"
                      class="w-full h-full object-cover"
                      @error="handleProfileImageError($event, data)"
                    />
                    <i v-else class="pi pi-user text-indigo-600"></i>
                  </div>
                  <div>
                    <div class="font-medium text-gray-800">
                      {{ data.candidateName }}
                    </div>
                    <div class="text-xs text-gray-500">
                      {{ data.email }}
                    </div>
                  </div>
                </div>
              </template>
            </Column>

            <Column
              field="finalScore"
              header="Final Score"
              headerClass="w-40 text-left"
              bodyClass="text-left"
            >
              <template #body="{ data }">
                <div class="flex flex-col items-start">
                  <div class="flex items-center gap-2">
                    <Rating
                      :modelValue="
                        Math.round(
                          (data.finalScore - data.reputationScore) * 0.4
                        )
                      "
                      readonly
                      :cancel="false"
                    />
                    <span class="font-semibold text-gray-700">{{
                      data.finalScore.toFixed(1)
                    }}</span>
                  </div>
                  <div class="ml-1">
                    <Button
                      text
                      @click="showScoreDetails(data)"
                      class="p-0 text-xs text-left underline text-indigo-600 mt-1"
                      label="View breakdown"
                    />
                  </div>
                </div>
              </template>
            </Column>

            <Column
              field="applicationStatus"
              header="Status"
              headerClass="w-28 text-left"
              bodyClass="text-left"
            >
              <template #body="{ data }">
                <div class="relative">
                  <Tag
                    :value="formatApplicationStatus(data.applicationStatus)"
                    :severity="
                      getApplicationStatusSeverity(data.applicationStatus)
                    "
                    class="text-xs"
                  />
                  <div
                    v-if="
                      updatingStatus &&
                      selectedApplication &&
                      selectedApplication.applicationGroupId ===
                        data.applicationGroupId
                    "
                    class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70"
                  >
                    <i class="pi pi-spin pi-spinner text-indigo-600"></i>
                  </div>
                </div>
              </template>
            </Column>

            <Column
              field="applicationDate"
              header="Applied On"
              headerClass="w-32 text-left"
              bodyClass="text-left"
            >
              <template #body="{ data }">
                <div class="flex items-center">
                  <i class="pi pi-calendar text-blue-500 mr-2"></i>
                  <span class="text-sm">{{
                    formatDate(data.applicationDate)
                  }}</span>
                </div>
              </template>
            </Column>

            <Column
              header="Actions"
              headerClass="w-24 text-left"
              bodyClass="text-left"
            >
              <template #body="{ data }">
                <div class="flex gap-2">
                  <Button
                    icon="pi pi-eye"
                    class="p-button-sm p-button-outlined p-button-rounded"
                    tooltip="View Application Details"
                    tooltipOptions="bottom"
                    @click="viewApplicantDetails(data)"
                    :tabindex="0"
                    aria-label="View Application Details"
                  />
                  <Button
                    icon="pi pi-user"
                    class="p-button-sm p-button-outlined p-button-rounded"
                    tooltip="View Candidate Profile"
                    tooltipOptions="bottom"
                    @click="viewCandidateProfile(data.candidateId)"
                    :tabindex="0"
                    aria-label="View Candidate Profile"
                  />
                  <Menu
                    ref="menu"
                    :model="menuItems"
                    :popup="true"
                    appendTo="body"
                    :tabindex="-1"
                  />
                  <Button
                    icon="pi pi-ellipsis-v"
                    class="p-button-sm p-button-outlined p-button-rounded p-button-secondary"
                    @click="(event) => toggleMenu(event, data)"
                    aria-haspopup="true"
                    tooltip="More Actions"
                    tooltipOptions="bottom"
                    :tabindex="0"
                    aria-label="More Actions"
                  />
                </div>
              </template>
            </Column>
          </DataTable>
        </div>
      </div>
    </div>

    <!-- Score Details Dialog -->
    <Dialog
      v-model:visible="scoreDetailsVisible"
      header="Score Breakdown"
      :style="{ width: '550px' }"
      :modal="true"
      :closable="true"
      class="score-details-dialog"
    >
      <div v-if="selectedCandidate" class="score-dialog-content">
        <!-- AI Notice Banner -->
        <div class="bg-indigo-50 border-l-4 border-indigo-500 p-4 mb-6">
          <div class="flex">
            <div class="flex-shrink-0">
              <i class="pi pi-info-circle text-indigo-600"></i>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-indigo-800">
                AI-Powered Assessment
              </h3>
              <p class="text-sm text-indigo-700 mt-1">
                AI scores are calculated based on how well the candidate's
                profile matches this job's scope and requirements. Please verify
                through manual review as AI evaluations may have limitations.
              </p>
            </div>
          </div>
        </div>

        <!-- Candidate Info -->
        <div class="flex items-center mb-6 pb-4 border-b border-gray-200">
          <div
            class="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mr-4 overflow-hidden border border-indigo-200"
          >
            <img
              v-if="selectedCandidate.profilePictureUrl"
              :src="getProfilePictureUrl(selectedCandidate.profilePictureUrl)"
              :alt="selectedCandidate.candidateName"
              class="w-full h-full object-cover"
              @error="handleProfileImageError($event, selectedCandidate)"
            />
            <i v-else class="pi pi-user text-indigo-600 text-xl"></i>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-800">
              {{ selectedCandidate.candidateName }}
            </h3>
            <p class="text-sm text-gray-600">{{ selectedCandidate.email }}</p>
          </div>
        </div>

        <!-- Final Score Section -->
        <div
          class="mb-6 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg overflow-hidden"
        >
          <div class="p-4">
            <div class="flex justify-between items-center mb-2">
              <h4 class="font-semibold text-indigo-900">Final Score</h4>
              <div class="flex items-center">
                <Rating
                  :modelValue="
                    Math.round(
                      (selectedCandidate.finalScore -
                        selectedCandidate.reputationScore) *
                        0.4
                    )
                  "
                  readonly
                  :cancel="false"
                  class="mr-2"
                />
                <span class="text-lg font-bold text-indigo-900">
                  {{ selectedCandidate.finalScore.toFixed(1) }}
                </span>
              </div>
            </div>

            <!-- Score Breakdown -->
            <div class="mt-3 grid grid-cols-2 gap-3">
              <div class="bg-white/50 rounded p-2">
                <div class="text-sm text-gray-600">AI Model Score</div>
                <div class="text-lg font-semibold text-indigo-700">
                  {{
                    (
                      selectedCandidate.finalScore -
                      selectedCandidate.reputationScore
                    ).toFixed(1)
                  }}
                </div>
              </div>
              <div class="bg-white/50 rounded p-2">
                <div class="text-sm text-gray-600">Reputation Score</div>
                <div class="text-lg font-semibold text-indigo-700">
                  {{ selectedCandidate.reputationScore.toFixed(1) }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- AI Analysis Section -->
        <div
          class="mb-6 bg-white rounded-lg border border-gray-200 overflow-hidden"
        >
          <div class="bg-indigo-50 px-4 py-3 border-b border-indigo-100">
            <div class="flex items-center">
              <i class="pi pi-chart-line text-indigo-600 mr-2"></i>
              <h4 class="font-semibold text-indigo-900">AI Analysis</h4>
            </div>
          </div>
          <div class="p-4">
            <div
              class="prose prose-sm max-w-none max-h-[300px] overflow-y-auto custom-scrollbar"
            >
              <p class="text-gray-700 whitespace-pre-line leading-relaxed">
                {{ selectedCandidate.aiFeedback }}
              </p>
            </div>
          </div>
        </div>

        <!-- Score Categories -->
        <div class="space-y-3">
          <!-- Experience Score -->
          <div
            class="bg-white border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-sm transition-all"
          >
            <div class="p-3">
              <div class="flex justify-between items-center">
                <div class="flex items-center">
                  <div
                    class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3"
                  >
                    <i class="pi pi-briefcase text-blue-600 text-sm"></i>
                  </div>
                  <div>
                    <h5 class="font-medium text-gray-800">Experience</h5>
                    <p class="text-xs text-gray-500">
                      Based on relevance and years
                    </p>
                  </div>
                </div>
                <span
                  class="font-semibold"
                  :class="{
                    'text-green-600': selectedCandidate.experienceScore >= 8,
                    'text-orange-500':
                      selectedCandidate.experienceScore >= 5 &&
                      selectedCandidate.experienceScore < 8,
                    'text-red-600': selectedCandidate.experienceScore < 5,
                  }"
                >
                  {{ selectedCandidate.experienceScore.toFixed(1) }}/10
                </span>
              </div>
            </div>
          </div>

          <!-- Skills Score -->
          <div
            class="bg-white border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-sm transition-all"
          >
            <div class="p-3">
              <div class="flex justify-between items-center">
                <div class="flex items-center">
                  <div
                    class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3"
                  >
                    <i class="pi pi-cog text-green-600 text-sm"></i>
                  </div>
                  <div>
                    <h5 class="font-medium text-gray-800">Skills Match</h5>
                    <p class="text-xs text-gray-500">
                      Required skills alignment
                    </p>
                  </div>
                </div>
                <span
                  class="font-semibold"
                  :class="{
                    'text-green-600': selectedCandidate.skillsScore >= 8,
                    'text-orange-500':
                      selectedCandidate.skillsScore >= 5 &&
                      selectedCandidate.skillsScore < 8,
                    'text-red-600': selectedCandidate.skillsScore < 5,
                  }"
                >
                  {{ selectedCandidate.skillsScore.toFixed(1) }}/10
                </span>
              </div>
            </div>
          </div>

          <!-- Location Score -->
          <div
            class="bg-white border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-sm transition-all"
          >
            <div class="p-3">
              <div class="flex justify-between items-center">
                <div class="flex items-center">
                  <div
                    class="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-3"
                  >
                    <i class="pi pi-map-marker text-red-600 text-sm"></i>
                  </div>
                  <div>
                    <h5 class="font-medium text-gray-800">Location</h5>
                    <p class="text-xs text-gray-500">
                      Distance to job location
                    </p>
                  </div>
                </div>
                <span
                  v-if="selectedCandidate.distanceToJob !== null"
                  class="font-semibold"
                  :class="{
                    'text-green-600': selectedCandidate.distanceToJob < 15,
                    'text-orange-500':
                      selectedCandidate.distanceToJob >= 15 &&
                      selectedCandidate.distanceToJob <= 20,
                    'text-red-600': selectedCandidate.distanceToJob > 20,
                  }"
                >
                  {{ selectedCandidate.distanceToJob.toFixed(1) }} km
                </span>
                <span v-else class="font-semibold text-gray-500"
                  >No location set</span
                >
              </div>
            </div>
          </div>

          <!-- Location distance info message -->
          <div
            class="mt-3 mb-3 text-xs text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 flex items-start"
          >
            <i class="pi pi-info-circle mr-2 text-gray-500 mt-0.5"></i>
            <p v-if="selectedCandidate.distanceToJob !== null">
              Distance calculated based on longitude/latitude coordinates.
              Actual travel time may vary (e.g., public transport options).
            </p>
            <p v-else>
              This candidate hasn't set their location yet. Distance cannot be
              calculated.
            </p>
          </div>

          <!-- Availability Score -->
          <div
            class="bg-white border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-sm transition-all"
          >
            <div class="p-3">
              <div class="flex justify-between items-center">
                <div class="flex items-center">
                  <div
                    class="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3"
                  >
                    <i class="pi pi-calendar text-purple-600 text-sm"></i>
                  </div>
                  <div>
                    <h5 class="font-medium text-gray-800">Availability</h5>
                    <p class="text-xs text-gray-500">Schedule alignment</p>
                  </div>
                </div>
                <span
                  class="font-semibold"
                  :class="{
                    'text-green-600': selectedCandidate.availabilityScore >= 8,
                    'text-orange-500':
                      selectedCandidate.availabilityScore >= 5 &&
                      selectedCandidate.availabilityScore < 8,
                    'text-red-600': selectedCandidate.availabilityScore < 5,
                  }"
                >
                  {{ selectedCandidate.availabilityScore.toFixed(1) }}/10
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer Note -->
        <div class="mt-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div class="flex items-start">
            <i class="pi pi-info-circle text-gray-500 mr-2 mt-0.5"></i>
            <p class="text-xs text-gray-600">
              The final score combines AI model assessment ({{
                (
                  selectedCandidate.finalScore -
                  selectedCandidate.reputationScore
                ).toFixed(1)
              }}) and reputation score ({{
                selectedCandidate.reputationScore.toFixed(1)
              }}).
            </p>
          </div>
        </div>
      </div>
      <template #footer>
        <Button
          label="Close"
          icon="pi pi-times"
          @click="scoreDetailsVisible = false"
          class="p-button-outlined"
        />
      </template>
    </Dialog>

    <!-- Application Details Dialog -->
    <Dialog
      v-model:visible="applicationDetailsVisible"
      header="Application Details"
      :style="{ width: '600px' }"
      :modal="true"
      :closable="true"
      class="application-details-dialog"
    >
      <div v-if="selectedApplication" class="application-dialog-content">
        <!-- Candidate Header -->
        <div
          class="flex items-center p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg mb-6"
        >
          <div
            class="w-16 h-16 rounded-full bg-white flex items-center justify-center mr-4 overflow-hidden border-2 border-indigo-200"
          >
            <img
              v-if="selectedApplication.profilePictureUrl"
              :src="getProfilePictureUrl(selectedApplication.profilePictureUrl)"
              :alt="selectedApplication.candidateName"
              class="w-full h-full object-cover"
              @error="handleProfileImageError($event, selectedApplication)"
            />
            <i v-else class="pi pi-user text-indigo-600 text-2xl"></i>
          </div>
          <div>
            <h3 class="text-xl font-semibold text-gray-800 mb-1">
              {{ selectedApplication.candidateName }}
            </h3>
            <p class="text-sm text-gray-600">{{ selectedApplication.email }}</p>
          </div>
        </div>

        <!-- Application Info -->
        <div class="space-y-6">
          <!-- Status Section -->
          <div
            class="bg-white rounded-lg border border-gray-200 overflow-hidden"
          >
            <div class="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h4 class="font-semibold text-gray-700">Application Status</h4>
            </div>
            <div class="p-4">
              <Tag
                :value="
                  formatApplicationStatus(selectedApplication.applicationStatus)
                "
                :severity="
                  getApplicationStatusSeverity(
                    selectedApplication.applicationStatus
                  )
                "
                class="text-sm"
              />
            </div>
          </div>

          <!-- Work Dates Section -->
          <div
            class="bg-white rounded-lg border border-gray-200 overflow-hidden"
          >
            <div class="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h4 class="font-semibold text-gray-700">Available Work Dates</h4>
            </div>
            <div class="p-4">
              <div
                v-if="
                  selectedApplication.locationWorkDates &&
                  Object.keys(selectedApplication.locationWorkDates).length > 0
                "
              >
                <div
                  v-for="(
                    dates, location
                  ) in selectedApplication.locationWorkDates"
                  :key="location"
                  class="mb-4 last:mb-0"
                >
                  <div class="flex items-center mb-2">
                    <i class="pi pi-map-marker text-indigo-600 mr-2"></i>
                    <span class="font-medium text-gray-700">{{
                      location
                    }}</span>
                  </div>
                  <div class="ml-6 grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <div
                      v-for="(date, index) in dates"
                      :key="index"
                      class="bg-indigo-50 rounded-lg px-3 py-2 text-sm text-indigo-700 flex items-center"
                    >
                      <i
                        class="pi pi-calendar text-indigo-500 mr-2 text-xs"
                      ></i>
                      {{ formatDate(date) }}
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="flex items-center text-gray-500">
                <i class="pi pi-info-circle mr-2"></i>
                <span>No work dates specified</span>
              </div>
            </div>
          </div>

          <!-- Notes Section -->
          <div
            class="bg-white rounded-lg border border-gray-200 overflow-hidden"
          >
            <div class="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h4 class="font-semibold text-gray-700">Candidate Notes</h4>
            </div>
            <div class="p-4">
              <div
                v-if="
                  selectedApplication.notes && selectedApplication.notes.trim()
                "
                class="prose prose-sm max-w-none"
              >
                <p class="text-gray-600 whitespace-pre-line">
                  {{ selectedApplication.notes }}
                </p>
              </div>
              <div v-else class="flex items-center text-gray-500">
                <i class="pi pi-info-circle mr-2"></i>
                <span>No notes provided by the candidate</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-3">
          <Button
            label="Close"
            icon="pi pi-times"
            @click="closeApplicationDetails"
            class="p-button-outlined !px-6 !py-2 !text-sm font-medium"
          />
          <Button
            label="View Full Profile"
            icon="pi pi-user"
            @click="viewCandidateProfile(selectedApplication.candidateId)"
            class="p-button-primary !px-6 !py-2 !text-sm font-medium"
          />
        </div>
      </template>
    </Dialog>

    <!-- Custom Status Update Confirmation Dialog -->
    <div
      v-if="confirmDialogVisible"
      class="fixed inset-0 flex items-center justify-center z-50"
    >
      <div
        class="fixed inset-0 bg-black bg-opacity-30"
        @click="closeConfirmDialog"
      ></div>
      <div
        class="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 relative overflow-hidden"
      >
        <!-- Dialog Header -->
        <div
          class="p-5 flex items-center justify-between border-b border-gray-200"
        >
          <h3 class="text-lg font-medium text-gray-900">
            {{ confirmDialog.header }}
          </h3>
          <button
            @click="closeConfirmDialog"
            class="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <i class="pi pi-times"></i>
          </button>
        </div>

        <!-- Dialog Content -->
        <div class="p-6">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <i
                :class="confirmDialog.icon"
                class="text-2xl text-amber-500 mr-4"
              ></i>
            </div>
            <div class="text-gray-700">{{ confirmDialog.message }}</div>
          </div>
        </div>

        <!-- Dialog Footer -->
        <div class="p-4 bg-gray-50 flex justify-end gap-3">
          <button
            @click="closeConfirmDialog"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            :disabled="updatingStatus"
          >
            No
          </button>
          <button
            @click="confirmAccept"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            :disabled="updatingStatus"
          >
            <i v-if="updatingStatus" class="pi pi-spin pi-spinner mr-2"></i>
            {{ updatingStatus ? 'Updating...' : 'Yes' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { format } from 'date-fns';
import axios from 'axios';
import fileService from '@/services/file.service';

// PrimeVue components
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import ProgressBar from 'primevue/progressbar';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import ProgressSpinner from 'primevue/progressspinner';
import Message from 'primevue/message';
import Dialog from 'primevue/dialog';
import Menu from 'primevue/menu';
import Rating from 'primevue/rating';
import Avatar from 'primevue/avatar';
import AvatarGroup from 'primevue/avatargroup';
import Chip from 'primevue/chip';
import Tooltip from 'primevue/tooltip';

const router = useRouter();
const route = useRoute();
const toast = useToast();

// State
const job = ref(null);
const applicants = ref([]);
const loading = ref(true);
const scoreDetailsVisible = ref(false);
const selectedCandidate = ref(null);
const totalApplicants = ref(0);
const currentPage = ref(0);
const pageSize = ref(10);
const totalPages = ref(0);

// Filters
const filters = ref({
  search: '',
  status: '',
  sortField: 'finalScore',
  sortOrder: 'desc',
});

// Status options for dropdown
const statusOptions = [
  { label: 'All Statuses', value: '' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Hired', value: 'HIRED' },
  { label: 'Rejected', value: 'REJECTED' },
  { label: 'Withdrawn', value: 'WITHDRAWN' },
  { label: 'Cancelled', value: 'CANCELLED' },
];

// Sort options for dropdown
const sortFieldOptions = [
  { label: 'Final Score', value: 'finalScore' },
  { label: 'Application Date', value: 'applicationDate' },
  { label: 'Candidate Name', value: 'candidateName' },
  { label: 'Location Score', value: 'locationScore' },
  { label: 'Experience Score', value: 'experienceScore' },
];

// Check if filters are active
const hasActiveFilters = computed(() => {
  return filters.value.search !== '' || filters.value.status !== '';
});

// Applicant statistics
const applicantStats = computed(() => {
  const stats = {
    TOTAL: totalApplicants.value,
    PENDING: 0,
    SHORTLISTED: 0,
    HIRED: 0,
    REJECTED: 0,
    WITHDRAWN: 0,
    CANCELLED: 0,
  };

  applicants.value.forEach((applicant) => {
    if (applicant.applicationStatus) {
      stats[applicant.applicationStatus] =
        (stats[applicant.applicationStatus] || 0) + 1;
    }
  });

  return stats;
});

// Helper methods for counts
const getApprovedCount = () => {
  return (
    (applicantStats.value.SHORTLISTED || 0) + (applicantStats.value.HIRED || 0)
  );
};

const getPendingCount = () => {
  return applicantStats.value.PENDING || 0;
};

const getRejectedCount = () => {
  return (
    (applicantStats.value.REJECTED || 0) +
    (applicantStats.value.WITHDRAWN || 0) +
    (applicantStats.value.CANCELLED || 0)
  );
};

// Format job status
const formatJobStatus = (status) => {
  if (!status) return '';
  const statusMap = {
    DRAFT: 'Draft',
    OPEN: 'Open',
    CLOSED: 'Closed',
    FILLED: 'Filled',
    CANCELLED: 'Cancelled',
  };
  return statusMap[status] || status;
};

// Get job status severity
const getJobStatusSeverity = (status) => {
  if (!status) return 'info';
  const severities = {
    DRAFT: 'info',
    OPEN: 'success',
    CLOSED: 'secondary',
    FILLED: 'info',
    CANCELLED: 'danger',
  };
  return severities[status] || 'info';
};

// Format application status
const formatApplicationStatus = (status) => {
  if (!status) return 'Pending';
  const statusMap = {
    PENDING: 'Pending',
    SHORTLISTED: 'Shortlisted',
    HIRED: 'Hired',
    REJECTED: 'Rejected',
    WITHDRAWN: 'Withdrawn',
    CANCELLED: 'Cancelled',
  };
  return statusMap[status] || status;
};

// Get application status severity
const getApplicationStatusSeverity = (status) => {
  if (!status) return 'info';
  const severities = {
    PENDING: 'warning',
    SHORTLISTED: 'info',
    HIRED: 'success',
    REJECTED: 'danger',
    WITHDRAWN: 'secondary',
    CANCELLED: 'danger',
  };
  return severities[status] || 'info';
};

// Format date
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return format(new Date(dateString), 'dd MMM yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

// Format date and time
const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return format(new Date(dateString), 'dd MMM yyyy, HH:mm');
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

// Format distance
const formatDistance = (distance) => {
  if (distance === null || distance === undefined) return 'N/A';
  return `${distance.toFixed(1)} km`;
};

// Get auth token
const getAuthToken = () => {
  return localStorage.getItem('accessToken');
};

// Navigation
const goBack = () => {
  if (route.query.projectId) {
    router.push({
      name: 'ProjectDetails',
      params: { projectId: route.query.projectId },
    });
  } else {
    router.push({ name: 'ManageJobs' });
  }
};

// Reset filters
const clearFilters = () => {
  filters.value = {
    search: '',
    status: '',
    sortField: 'finalScore',
    sortOrder: 'desc',
  };

  // Fetch all applicants again
  fetchApplicants();
};

// Fetch job data
const fetchJobData = async () => {
  try {
    const jobId = route.params.jobId;
    const token = getAuthToken();

    const response = await axios.get(
      `http://localhost:8080/api/jobs/${jobId}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    if (response.data && response.data.statusCode === 200) {
      job.value = response.data.data;
    } else {
      console.error('Failed to fetch job details:', response.data);
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to fetch job details',
        life: 3000,
      });
    }
  } catch (error) {
    console.error('Error fetching job data:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'An error occurred while fetching job data',
      life: 3000,
    });
  }
};

// Fetch applicants
const fetchApplicants = async () => {
  loading.value = true;
  try {
    const jobId = route.params.jobId;
    const token = getAuthToken();

    // Build query parameters
    let queryParams = new URLSearchParams();
    queryParams.append('page', currentPage.value);
    queryParams.append('size', pageSize.value);

    // Never include search parameter for API calls
    if (filters.value.status) {
      queryParams.append('status', filters.value.status);
    }

    if (filters.value.sortField) {
      queryParams.append('sortBy', filters.value.sortField);
    }

    if (filters.value.sortOrder) {
      queryParams.append('sortDir', filters.value.sortOrder);
    }

    const response = await axios.get(
      `http://localhost:8080/api/recruiters/jobs/${jobId}/applicants?${queryParams.toString()}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    if (response.data && response.data.statusCode === 200) {
      const responseData = response.data.data;

      // Store all applicants for client-side filtering
      allApplicants.value = responseData.applicants;

      // If there's an active search, filter the results locally
      if (filters.value.search && filters.value.search.trim() !== '') {
        filterApplicantsLocally();
      } else {
        // Otherwise, use the API results directly
        applicants.value = responseData.applicants;
        totalApplicants.value = responseData.totalApplicants;
      }

      // Always update pagination from API
      currentPage.value = responseData.currentPage;
      pageSize.value = responseData.pageSize;
      totalPages.value = responseData.totalPages;
    } else {
      console.error('Failed to fetch applicants:', response.data);
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to fetch applicants',
        life: 3000,
      });
    }
  } catch (error) {
    console.error('Error fetching applicants:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'An error occurred while fetching applicants',
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
};

// Handle page change
const onPageChange = (event) => {
  currentPage.value = event.page;
  fetchApplicants();
};

// Watch for filter changes
watch(
  filters,
  () => {
    if (
      filters.value.sortField !== prevFilters.sortField ||
      filters.value.sortOrder !== prevFilters.sortOrder ||
      filters.value.status !== prevFilters.status
    ) {
      // Only fetch from API when non-search filters change
      currentPage.value = 0; // Reset to first page
      fetchApplicants();
    } else if (filters.value.search !== prevFilters.search) {
      // Always use client-side filtering for search
      filterApplicantsLocally();
    }

    // Update previous filters
    prevFilters = { ...filters.value };
  },
  { deep: true }
);

const prevFilters = ref({
  search: '',
  status: '',
  sortField: 'finalScore',
  sortOrder: 'desc',
});

// Initialize component
onMounted(() => {
  fetchJobData();
  fetchApplicants();
});

// Update the showScoreDetails function to include profilePictureUrl
const showScoreDetails = (candidate) => {
  selectedCandidate.value = {
    candidateName: candidate.candidateName,
    email: candidate.email,
    profilePictureUrl: candidate.profilePictureUrl,
    finalScore: candidate.finalScore || 0,
    experienceScore: candidate.experienceScore || 0,
    skillsScore: candidate.skillsScore || 0,
    locationScore: candidate.distanceToJob, // Use the original distanceToJob value
    distanceToJob: candidate.distanceToJob, // Store the raw distanceToJob value as well
    availabilityScore: candidate.availabilityScore || 0,
    reputationScore: candidate.reputationScore || 0,
    aiFeedback: candidate.aiFeedback?.replace(/\\n/g, '\n') || '',
  };
  scoreDetailsVisible.value = true;
};

// View applicant details
const viewApplicantDetails = (applicant) => {
  // Close any open menus first
  if (menu.value) {
    menu.value.hide();
  }

  // Log the notes field to verify it's being received
  console.log('Applicant notes:', applicant.notes);

  selectedApplication.value = {
    ...applicant,
    lastStatusUpdate: applicant.lastStatusUpdate || null,
    notes: applicant.notes || '',
  };
  applicationDetailsVisible.value = true;
};

// Open status update dialog
const openStatusUpdateDialog = (applicant) => {
  // Implement the logic to open the status update dialog
  console.log('Opening status update dialog for applicant:', applicant);
};

// Get initials from candidate name
const getInitials = (name) => {
  if (!name) return '';
  const parts = name.split(' ');
  return parts.map((part) => part.charAt(0)).join('');
};

const viewCandidateProfile = (candidateId) => {
  // Navigate to candidate profile view
  router.push({
    name: 'RecruiterViewCandidateProfile',
    params: { candidateId },
  });
};

// Add these functions for profile picture handling
const getProfilePictureUrl = (url) => {
  if (!url) return null;
  return fileService.getFileUrl(url);
};

const handleProfileImageError = (event, data) => {
  console.error('Error loading profile picture for:', data.candidateName);
  event.target.onerror = null; // Prevent infinite error loop
  event.target.src = ''; // Clear the src to show the fallback icon
};

// Add after the handleProfileImageError function
const menu = ref(null);
const menuItems = ref([]);

// Add a loading state for status updates
const updatingStatus = ref(false);

const toggleMenu = (event, applicant) => {
  // Close any open dialogs first to avoid focus conflicts
  applicationDetailsVisible.value = false;

  // Make sure a clicked button doesn't stay focused
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }

  const currentStatus = applicant.applicationStatus;
  let statusItems = [];

  // Define possible transitions based on current status
  if (currentStatus === 'PENDING') {
    statusItems = [
      {
        label: 'Hire',
        icon: 'pi pi-check-circle',
        command: () => {
          menu.value.hide(); // Hide menu before showing confirmation
          setTimeout(() => {
            showConfirmDialog({
              message: 'Are you sure you want to hire this applicant?',
              header: 'Update Application Status',
              icon: 'pi pi-exclamation-triangle',
              accept: () => updateApplicationStatus(applicant, 'HIRED'),
            });
          }, 100);
        },
      },
      {
        label: 'Reject',
        icon: 'pi pi-times',
        command: () => {
          menu.value.hide(); // Hide menu before showing confirmation
          setTimeout(() => {
            showConfirmDialog({
              message: 'Are you sure you want to reject this applicant?',
              header: 'Update Application Status',
              icon: 'pi pi-exclamation-triangle',
              accept: () => updateApplicationStatus(applicant, 'REJECTED'),
            });
          }, 100);
        },
      },
    ];
  } else if (currentStatus === 'HIRED') {
    statusItems = [
      {
        label: 'Mark as Cancelled',
        icon: 'pi pi-ban',
        command: () => {
          menu.value.hide(); // Hide menu before showing confirmation
          setTimeout(() => {
            showConfirmDialog({
              message: 'Are you sure you want to cancel this hired applicant?',
              header: 'Update Application Status',
              icon: 'pi pi-exclamation-triangle',
              accept: () => updateApplicationStatus(applicant, 'CANCELLED'),
            });
          }, 100);
        },
      },
    ];
  } else if (currentStatus === 'REJECTED') {
    statusItems = [
      {
        label: 'Hire',
        icon: 'pi pi-check-circle',
        command: () => {
          menu.value.hide(); // Hide menu before showing confirmation
          setTimeout(() => {
            showConfirmDialog({
              message: 'Are you sure you want to hire this applicant?',
              header: 'Update Application Status',
              icon: 'pi pi-exclamation-triangle',
              accept: () => updateApplicationStatus(applicant, 'HIRED'),
            });
          }, 100);
        },
      },
    ];
  } else if (currentStatus === 'CANCELLED') {
    statusItems = [
      {
        label: 'Mark as Pending',
        icon: 'pi pi-clock',
        command: () => {
          menu.value.hide(); // Hide menu before showing confirmation
          setTimeout(() => {
            showConfirmDialog({
              message:
                'Are you sure you want to mark this cancelled applicant as pending?',
              header: 'Update Application Status',
              icon: 'pi pi-exclamation-triangle',
              accept: () => updateApplicationStatus(applicant, 'PENDING'),
            });
          }, 100);
        },
      },
    ];
  }

  menuItems.value = [
    {
      label: 'Update Status',
      icon: 'pi pi-sync',
      items: statusItems,
    },
  ];

  menu.value.toggle(event);
};

const updateApplicationStatus = async (applicant, newStatus) => {
  updatingStatus.value = true;
  try {
    const token = getAuthToken();

    // Console log the application ID and request details
    console.log(
      'Updating application status with applicationGroupId:',
      applicant.applicationGroupId
    );
    console.log('Application data:', applicant);
    console.log('New status:', newStatus);
    console.log(
      'API URL:',
      `http://localhost:8080/api/jobs/applications/group/${applicant.applicationGroupId}/status`
    );

    // Store the applicant being updated
    selectedApplication.value = applicant;

    // Use the correct API endpoint with applicationGroupId
    const response = await axios.put(
      `http://localhost:8080/api/jobs/applications/group/${applicant.applicationGroupId}/status`,
      { status: newStatus },
      {
        headers: {
          Authorization: token,
        },
      }
    );

    console.log('API Response:', response.data);

    if (response.data && response.data.statusCode === 200) {
      // Close any open menus or dialogs
      if (menu.value) {
        menu.value.hide();
      }
      applicationDetailsVisible.value = false;
      confirmDialogVisible.value = false;

      // Show success message and refresh data
      toast.add({
        severity: 'success',
        summary: 'Status Updated',
        detail: `Application status has been updated to ${newStatus.toLowerCase()}`,
        life: 3000,
      });
      await fetchApplicants(); // Refresh the applicants list
    } else {
      throw new Error(response.data.message || 'Failed to update status');
    }
  } catch (error) {
    console.error('Error updating application status:', error);
    console.error(
      'Error details:',
      error.response ? error.response.data : 'No response data'
    );
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.message || 'Failed to update application status',
      life: 3000,
    });
  } finally {
    updatingStatus.value = false;
    selectedApplication.value = null;
  }
};

// Add these to handle dialog visibility
const closeApplicationDetails = () => {
  applicationDetailsVisible.value = false;
  selectedApplication.value = null;
};

// Add these refs after other refs
const applicationDetailsVisible = ref(false);
const selectedApplication = ref(null);
const allApplicants = ref([]); // Store all applicants for client-side filtering

// Add new function for local filtering
const filterApplicantsLocally = () => {
  // If search is empty, just use all applicants
  if (!filters.value.search || filters.value.search.trim() === '') {
    applicants.value = [...allApplicants.value];
    totalApplicants.value = allApplicants.value.length;
    return;
  }

  // Convert search term to lowercase for case-insensitive matching
  const searchTerm = filters.value.search.toLowerCase().trim();

  // Filter applicants by name or email
  const filteredApplicants = allApplicants.value.filter((applicant) => {
    const nameMatch =
      applicant.candidateName &&
      applicant.candidateName.toLowerCase().includes(searchTerm);
    const emailMatch =
      applicant.email && applicant.email.toLowerCase().includes(searchTerm);
    return nameMatch || emailMatch;
  });

  // Update the applicants list with filtered results
  applicants.value = filteredApplicants;

  // Update count for display
  totalApplicants.value = filteredApplicants.length;
};

// Add custom confirmation dialog state and functions
const confirmDialogVisible = ref(false);
const confirmDialog = ref({
  message: '',
  header: 'Confirmation',
  icon: 'pi pi-exclamation-triangle',
  accept: null,
  reject: null,
});

const showConfirmDialog = (options) => {
  confirmDialog.value = {
    message: options.message || 'Are you sure?',
    header: options.header || 'Confirmation',
    icon: options.icon || 'pi pi-exclamation-triangle',
    accept: options.accept || (() => {}),
    reject: options.reject || (() => {}),
  };
  confirmDialogVisible.value = true;
};

const closeConfirmDialog = () => {
  if (confirmDialog.value.reject) {
    confirmDialog.value.reject();
  }
  confirmDialogVisible.value = false;
};

const confirmAccept = async () => {
  if (confirmDialog.value.accept) {
    // Don't close the dialog yet - will close after action completes
    await confirmDialog.value.accept();

    // Dialog will be closed by the action completion if successful
    // If we get here and we're not updating, close it
    if (!updatingStatus.value) {
      confirmDialogVisible.value = false;
    }
  }
};
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

:deep(.p-datatable) {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
  background: #f8fafc;
  color: #4b5563;
  font-weight: 600;
  padding: 0.75rem 1rem;
  border-bottom: 2px solid #e2e8f0;
  font-size: 0.875rem;
}

:deep(.p-datatable .p-datatable-tbody > tr) {
  transition: background-color 0.2s;
}

:deep(.p-datatable .p-datatable-tbody > tr:hover) {
  background-color: #f1f5f9;
}

:deep(.p-datatable .p-datatable-tbody > tr > td) {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #f1f5f9;
}

:deep(.p-progressbar) {
  border-radius: 4px;
  height: 6px;
  background: #e2e8f0;
}

:deep(.p-progressbar-value) {
  border-radius: 4px;
}

:deep(.p-dropdown) {
  border-radius: 8px;
  height: 46px; /* Match input height */
}

:deep(.p-dropdown:hover) {
  border-color: #4f46e5;
}

/* Remove dropdown inner borders */
:deep(.p-dropdown-trigger) {
  border-left: none !important;
  width: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.p-dropdown-label) {
  border: none !important;
  background: transparent;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  height: 100%;
}

:deep(.p-dropdown-items-wrapper) {
  border: none;
}

:deep(.p-dropdown-panel .p-dropdown-items) {
  padding: 0.5rem 0;
}

:deep(.p-dropdown-panel .p-dropdown-items .p-dropdown-item) {
  padding: 0.75rem 1rem;
}

/* Ensure consistent sizing across all input elements */
:deep(.p-inputtext),
:deep(.p-dropdown),
:deep(.p-button) {
  font-size: 0.875rem;
}

:deep(.p-inputtext) {
  border-radius: 8px;
  padding: 0.75rem 1rem;
}

:deep(.p-inputtext:hover) {
  border-color: #4f46e5;
}

:deep(.p-inputtext:focus) {
  box-shadow: 0 0 0 1px #4f46e5;
  border-color: #4f46e5;
}

:deep(.p-menu) {
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  min-width: 12rem;
}

:deep(
    .p-menu
      .p-menuitem:not(.p-highlight):not(.p-disabled)
      > .p-menuitem-content:hover
  ) {
  background: rgba(79, 70, 229, 0.08);
}

:deep(.p-dialog) {
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

:deep(.p-dialog .p-dialog-header) {
  border-bottom: 1px solid #e2e8f0;
  padding: 1.25rem 1.5rem;
  background-color: #f8fafc;
}

:deep(.p-dialog .p-dialog-content) {
  padding: 0;
}

:deep(.p-dialog .p-dialog-footer) {
  border-top: 1px solid #e2e8f0;
  padding: 1.25rem 1.5rem;
  background-color: #f8fafc;
}

:deep(.p-rating .p-rating-item.p-rating-item-active .p-rating-icon) {
  color: #f59e0b;
}

:deep(.p-message) {
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

:deep(.p-paginator) {
  padding: 1rem;
  background-color: #f8fafc;
  border-top: 1px solid #e2e8f0;
}

:deep(.p-paginator .p-paginator-element) {
  margin: 0 0.125rem;
  min-width: 2.25rem;
  height: 2.25rem;
}

:deep(.p-paginator .p-paginator-page.p-highlight) {
  background-color: #4f46e5;
  color: white;
}

/* Card transitions */
.transition-all {
  transition: all 0.3s ease;
}

.hover\:shadow-md:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transform: translateY(-2px);
}

/* Score dialog specific styles */
.score-details-dialog :deep(.p-dialog-header) {
  background-color: white;
  color: #1e3a8a;
  border-bottom: none;
}

.score-details-dialog :deep(.p-dialog-header-icon) {
  color: #64748b;
}

.score-details-dialog :deep(.p-dialog-header-close:hover) {
  background-color: #f1f5f9;
  color: #0f172a;
}

.score-details-dialog :deep(.p-dialog-title) {
  font-weight: 600;
}

.score-details-dialog :deep(.p-dialog-footer) {
  border-top: none;
}

.score-details-dialog :deep(.p-button.p-button-outlined) {
  border-color: #4f46e5;
  color: #4f46e5;
}

.score-details-dialog :deep(.p-button.p-button-outlined:hover) {
  background-color: rgba(79, 70, 229, 0.08);
  border-color: #4338ca;
  color: #4338ca;
}

/* Fix for action menu */
:deep(.action-menu.p-menu) {
  min-width: 12rem;
  z-index: 1000;
}

:deep(.action-menu .p-menuitem-link) {
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
}

:deep(.action-menu .p-menuitem-icon) {
  margin-right: 0.5rem;
}

/* Add these styles */
.score-dialog-content {
  padding: 1.5rem;
}

:deep(.score-details-dialog) {
  border-radius: 12px;
  overflow: hidden;
  max-height: 90vh;
}

:deep(.score-details-dialog .p-dialog-content) {
  max-height: calc(90vh - 120px);
  overflow-y: auto;
}

:deep(.score-details-dialog .p-dialog-content::-webkit-scrollbar) {
  width: 8px;
}

:deep(.score-details-dialog .p-dialog-content::-webkit-scrollbar-track) {
  background: #f1f5f9;
  border-radius: 4px;
}

:deep(.score-details-dialog .p-dialog-content::-webkit-scrollbar-thumb) {
  background: #cbd5e1;
  border-radius: 4px;
}

:deep(.score-details-dialog .p-dialog-content::-webkit-scrollbar-thumb:hover) {
  background: #94a3b8;
}

:deep(.score-details-dialog .p-dialog-header) {
  background: linear-gradient(to right, #4f46e5, #6366f1);
  color: white;
}

:deep(.score-details-dialog .p-dialog-header-icon) {
  color: white;
}

/* Add these new styles for the AI Analysis section */
:deep(.prose) {
  max-width: none;
}

:deep(.prose p) {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.6;
}

/* Update dialog content styling */
:deep(.score-details-dialog .p-dialog-content) {
  max-height: calc(90vh - 120px);
  overflow-y: auto;
  padding: 0; /* Remove default padding */
}

.score-dialog-content {
  padding: 1.5rem;
}

/* Add styles for better text readability */
.whitespace-pre-line {
  white-space: pre-line;
}

.leading-relaxed {
  line-height: 1.75;
}

/* Add custom scrollbar styles */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 #f1f5f9;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #94a3b8;
}

/* Update dialog content padding */
.score-dialog-content {
  padding: 1.5rem;
}

/* Ensure the dialog content doesn't scroll unnecessarily */
:deep(.score-details-dialog .p-dialog-content) {
  max-height: 90vh;
  overflow-y: auto;
}

/* Add smooth scrolling */
.prose {
  scroll-behavior: smooth;
}

/* Application Details Dialog Styles */
.application-details-dialog :deep(.p-dialog-header) {
  background: linear-gradient(to right, #4f46e5, #6366f1);
  color: white;
  padding: 1.25rem 1.5rem;
}

.application-details-dialog :deep(.p-dialog-header-icon) {
  color: white;
}

.application-details-dialog :deep(.p-dialog-content) {
  padding: 0;
}

.application-dialog-content {
  padding: 1.5rem;
}

.application-details-dialog :deep(.p-dialog-footer) {
  padding: 1.25rem 1.5rem;
  background-color: #f8fafc;
  border-top: 1px solid #e2e8f0;
}

/* Prose styles for notes */
.prose-sm {
  font-size: 0.875rem;
  line-height: 1.7142857;
}

.prose-sm p {
  margin-top: 0;
  margin-bottom: 0;
}

/* Custom scrollbar for dialog content */
.application-dialog-content {
  max-height: calc(90vh - 200px);
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 #f1f5f9;
}

.application-dialog-content::-webkit-scrollbar {
  width: 6px;
}

.application-dialog-content::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.application-dialog-content::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 3px;
}

.application-dialog-content::-webkit-scrollbar-thumb:hover {
  background-color: #94a3b8;
}

/* Card hover effects */
.application-dialog-content .rounded-lg {
  transition: all 0.2s ease-in-out;
}

.application-dialog-content .rounded-lg:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style>
