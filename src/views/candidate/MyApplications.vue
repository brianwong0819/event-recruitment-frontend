<template>
  <div class="p-6">
    <!-- Header section -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">My Applications</h1>
          <p class="text-gray-600">Track and manage your job applications</p>
        </div>
        <div class="hidden md:block">
          <Button
            label="Find New Jobs"
            icon="pi pi-search-plus"
            class="p-button-rounded"
            @click="goToJobSearch"
          />
        </div>
      </div>
    </div>

    <!-- Filters and Search -->
    <div
      class="bg-white rounded-xl shadow-md p-6 mb-8 transition-all duration-300 hover:shadow-lg sticky-filters"
      :class="{
        'sticky-active': isScrolled,
        collapsed: isScrolledFar && !isFilterHovered,
      }"
      @mouseenter="isFilterHovered = true"
      @mouseleave="isFilterHovered = false"
    >
      <!-- Main filters - collapsed when scrolled far -->
      <div
        class="main-filters transition-all duration-300"
        :class="{ 'hidden-filters': isScrolledFar && !isFilterHovered }"
      >
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <!-- Search input -->
          <div class="relative">
            <span class="p-input-icon-left w-full">
              <InputText
                v-model="filters.search"
                placeholder="Search jobs, companies, locations..."
                class="w-full p-inputtext-lg shadow-sm border-gray-200 hover:border-indigo-300 focus:border-indigo-500 rounded-lg"
              />
            </span>
          </div>

          <!-- Status filter -->
          <div class="flex items-center">
            <Dropdown
              v-model="filters.status"
              :options="statusOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Filter by status"
              class="w-full improved-dropdown seamless-dropdown"
              :pt="{
                root: {
                  class:
                    'border border-gray-200 hover:border-indigo-300 transition-colors p-inputtext-lg',
                },
                label: { class: 'flex items-center' },
                trigger: { class: 'flex items-center justify-center' },
              }"
            />
          </div>

          <!-- Sort options -->
          <div class="flex items-center">
            <Dropdown
              v-model="filters.sort"
              :options="sortOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Sort applications"
              class="w-full improved-dropdown seamless-dropdown"
              :pt="{
                root: {
                  class:
                    'border border-gray-200 hover:border-indigo-300 transition-colors p-inputtext-lg',
                },
                label: { class: 'flex items-center' },
                trigger: { class: 'flex items-center justify-center' },
              }"
            />
          </div>
        </div>

        <!-- Filter tags and clear button -->
        <div
          class="flex flex-wrap items-center justify-between mt-4 pt-3 border-t border-gray-100"
        >
          <div class="flex flex-wrap gap-2 items-center">
            <span v-if="hasActiveFilters" class="text-sm text-gray-500"
              >Active filters:</span
            >
            <Chip
              v-if="filters.status"
              :label="getStatusLabel(filters.status)"
              class="bg-indigo-50 text-indigo-700 py-1 px-2 text-xs font-medium"
              removable
              @remove="filters.status = ''"
            />
            <Chip
              v-if="filters.sort !== 'newest'"
              :label="getSortLabel(filters.sort)"
              class="bg-indigo-50 text-indigo-700 py-1 px-2 text-xs font-medium"
              removable
              @remove="filters.sort = 'newest'"
            />
            <Chip
              v-if="filters.search"
              :label="`Search: ${filters.search}`"
              class="bg-indigo-50 text-indigo-700 py-1 px-2 text-xs font-medium"
              removable
              @remove="filters.search = ''"
            />
          </div>
          <div v-if="hasActiveFilters">
            <Button
              label="Clear All Filters"
              icon="pi pi-filter-slash"
              class="p-button-text p-button-sm text-indigo-600"
              @click="clearFilters"
            />
          </div>
        </div>
      </div>

      <!-- Jump to section (always visible) -->
      <div
        class="flex items-center justify-between transition-all duration-300 jump-to-container"
        :class="{
          'pt-0': isScrolledFar && !isFilterHovered,
          'pt-3 border-t border-gray-100': !isScrolledFar || isFilterHovered,
        }"
      >
        <div>
          <Button
            v-if="isScrolledFar && !isFilterHovered"
            icon="pi pi-filter"
            class="p-button-text p-button-sm text-indigo-600 mr-2"
            @click="isFilterHovered = true"
          />
        </div>

        <!-- Jump to section dropdown -->
        <div v-if="hasApplications" class="flex items-center ml-auto">
          <span class="text-sm text-gray-500 mr-2">Jump to:</span>
          <Dropdown
            v-model="activeSection"
            :options="jumpToSections"
            optionLabel="label"
            optionValue="value"
            placeholder="Jump to section"
            class="w-40 improved-dropdown seamless-dropdown"
            :pt="{
              root: {
                class:
                  'border border-gray-200 hover:border-indigo-300 transition-colors',
              },
              label: { class: 'flex items-center text-sm' },
              trigger: { class: 'flex items-center justify-center' },
            }"
            @change="jumpToSection"
          />
        </div>
      </div>
    </div>

    <!-- Applications Content -->
    <div class="applications-content">
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
            <i class="pi pi-file-edit text-indigo-500 text-2xl"></i>
          </div>
        </div>
        <h3 class="text-xl font-semibold text-gray-800 mb-2">
          Loading Applications
        </h3>
        <p class="text-gray-600 text-center max-w-md">
          Please wait while we fetch your application history...
        </p>
      </div>

      <!-- Empty state -->
      <div
        v-else-if="applications.length === 0"
        class="bg-white rounded-xl shadow-md p-12 text-center"
      >
        <div
          class="w-24 h-24 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6 transform transition-transform hover:scale-105 duration-300"
        >
          <i class="pi pi-inbox text-indigo-500 text-4xl"></i>
        </div>
        <h3 class="text-2xl font-bold text-gray-800 mb-3">
          No Applications Yet
        </h3>
        <p class="text-gray-600 mb-8 max-w-md mx-auto text-lg">
          You haven't applied to any jobs yet. Discover exciting opportunities
          that match your skills and interests.
        </p>
        <Button
          label="Browse Available Jobs"
          icon="pi pi-search"
          @click="goToJobSearch"
          class="p-button-lg p-button-rounded"
        />
        <div
          class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto"
        >
          <div class="flex flex-col items-center p-4">
            <div
              class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3"
            >
              <i class="pi pi-search text-green-600"></i>
            </div>
            <h4 class="font-semibold mb-1">Find Jobs</h4>
            <p class="text-sm text-gray-500 text-center">
              Search for jobs matching your skills
            </p>
          </div>
          <div class="flex flex-col items-center p-4">
            <div
              class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3"
            >
              <i class="pi pi-send text-blue-600"></i>
            </div>
            <h4 class="font-semibold mb-1">Apply</h4>
            <p class="text-sm text-gray-500 text-center">
              Quick and easy application process
            </p>
          </div>
          <div class="flex flex-col items-center p-4">
            <div
              class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3"
            >
              <i class="pi pi-check-circle text-purple-600"></i>
            </div>
            <h4 class="font-semibold mb-1">Get Hired</h4>
            <p class="text-sm text-gray-500 text-center">
              Start working at exciting events
            </p>
          </div>
        </div>
      </div>

      <!-- Applications list -->
      <div v-else>
        <!-- Applications by status -->
        <div
          v-for="(group, index) in applicationGroups"
          :key="index"
          class="mb-8"
          :id="`section-${group.status}`"
        >
          <div v-if="group.applications.length > 0">
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center">
                <div
                  class="w-2 h-10 rounded-r-md mr-3"
                  :class="getStatusColorClass(group.status)"
                ></div>
                <h2 class="text-xl font-bold text-gray-800">
                  {{ group.title }}
                  <span
                    class="ml-2 text-sm font-normal bg-gray-100 text-gray-700 py-1 px-2 rounded-full"
                  >
                    {{ group.applications.length }}
                  </span>
                </h2>
              </div>

              <div class="flex space-x-4 items-center">
                <div
                  class="text-sm text-gray-500 flex items-center"
                  v-if="group.status === 'PENDING'"
                >
                  <i class="pi pi-info-circle mr-2 text-indigo-400"></i>
                  <span
                    >Pending applications may take 1-3 business days to
                    review</span
                  >
                </div>

                <!-- Group Pagination toggle -->
                <div
                  v-if="group.applications.length > itemsPerPage"
                  class="flex items-center"
                >
                  <InputSwitch
                    v-model="paginationEnabled"
                    class="mr-2"
                    :pt="{ slider: { class: 'bg-indigo-500' } }"
                  />
                  <span class="text-sm text-gray-500">{{
                    paginationEnabled ? 'Paginated' : 'Show All'
                  }}</span>
                </div>
              </div>
            </div>

            <!-- New improved application cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div
                v-for="application in getPaginatedApplications(group.status)"
                :key="application.id"
                class="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col group"
              >
                <!-- Card Header with Status -->
                <div
                  class="px-6 py-4 border-l-4 flex justify-between items-center transition-colors"
                  :class="getStatusBorderClass(application.status)"
                >
                  <h3
                    class="font-semibold text-gray-800 text-lg group-hover:text-indigo-600 cursor-pointer truncate max-w-[70%]"
                    @click="viewApplicationDetails(application.id)"
                  >
                    {{ application.jobTitle }}
                  </h3>
                  <Tag
                    :value="formatStatus(application.status)"
                    :severity="getStatusSeverity(application.status)"
                    :style="{ borderRadius: '20px', padding: '0.3rem 0.8rem' }"
                  />
                </div>

                <!-- Card Content -->
                <div class="p-6 pt-2 flex-grow flex flex-col">
                  <!-- Company Info -->
                  <div class="mb-4 pb-3 border-b border-gray-100">
                    <div
                      class="font-medium text-gray-700 mb-1 flex items-center"
                    >
                      <i class="pi pi-building text-indigo-400 mr-2"></i>
                      <router-link
                        :to="{
                          name: 'RecruiterInfo',
                          params: { recruiterId: application.recruiterId },
                          query: { source: 'applications' },
                        }"
                        class="text-gray-700 hover:text-indigo-600 hover:underline transition-colors flex items-center gap-1"
                      >
                        {{ application.companyName }}
                        <Tag
                          value="Company"
                          severity="warning"
                          class="text-[10px] py-1 px-1 ml-1"
                        />
                      </router-link>
                    </div>
                    <div class="text-sm text-gray-600 flex items-start">
                      <i class="pi pi-map-marker mr-2 mt-1 text-indigo-400"></i>
                      <span>{{ application.location }}</span>
                    </div>
                  </div>

                  <!-- Application Details -->
                  <div class="text-sm text-gray-600 space-y-3 mb-4 flex-grow">
                    <div class="flex items-center">
                      <div
                        class="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center mr-3"
                      >
                        <i class="pi pi-calendar text-indigo-400"></i>
                      </div>
                      <div>
                        <div class="text-gray-500 text-xs">Work Dates</div>
                        <div class="font-medium text-gray-700">
                          {{
                            application.workDates &&
                            application.workDates.length > 0
                              ? formatWorkDatesArray(application.workDates)
                              : formatDateRange(
                                  application.workStartDate,
                                  application.workEndDate
                                )
                          }}
                        </div>
                        <div
                          v-if="application.workTime"
                          class="text-xs text-gray-500 mt-1"
                        >
                          {{ application.workTime }}
                        </div>
                      </div>
                    </div>

                    <div class="flex items-center">
                      <div
                        class="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center mr-3"
                      >
                        <i class="pi pi-dollar text-indigo-400"></i>
                      </div>
                      <div>
                        <div class="text-gray-500 text-xs">Salary</div>
                        <div class="font-medium text-gray-700">
                          RM {{ application.salary }}
                          {{
                            application.salaryType === 'PER_DAY'
                              ? '/ day'
                              : '/ hour'
                          }}
                        </div>
                        <div
                          v-if="application.paymentTerms"
                          class="text-xs text-gray-500 mt-1"
                        >
                          {{ application.paymentTerms }}
                        </div>
                      </div>
                    </div>

                    <div class="flex items-center">
                      <div
                        class="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center mr-3"
                      >
                        <i class="pi pi-send text-indigo-400"></i>
                      </div>
                      <div>
                        <div class="text-gray-500 text-xs">Applied On</div>
                        <div class="font-medium text-gray-700">
                          {{ formatDate(application.appliedAt) }}
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Actions -->
                  <div
                    class="pt-3 border-t border-gray-100 flex justify-between items-center"
                  >
                    <Button
                      icon="pi pi-eye"
                      label="View Details"
                      class="p-button-outlined rounded-full p-button-sm"
                      @click="viewApplicationDetails(application.id)"
                    />
                    <Button
                      v-if="application.status === 'PENDING'"
                      icon="pi pi-times"
                      label="Withdraw"
                      class="p-button-text p-button-danger p-button-sm"
                      @click="confirmWithdraw(application)"
                      :pt="{
                        root: { class: 'hover:bg-red-50' },
                      }"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Pagination controls -->
            <div
              v-if="shouldShowPagination(group.status)"
              class="flex justify-center mt-6"
            >
              <Paginator
                :rows="itemsPerPage"
                :totalRecords="group.applications.length"
                v-model:first="paginationFirsts[group.status]"
                :template="{
                  '639px': 'PrevPageLink PageLinks NextPageLink',
                  '0': 'PrevPageLink NextPageLink',
                }"
                class="p-paginator-sm"
                :pt="{
                  root: {
                    class:
                      'bg-gray-50 rounded-lg border border-gray-200 shadow-sm',
                  },
                  pageButton: { class: 'text-gray-700 hover:bg-indigo-50' },
                  currentPageReport: { class: 'text-gray-600' },
                }"
                @page="(e) => onPageChange(e, group.status)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Application Detail Dialog -->
    <Dialog
      v-model:visible="applicationDetailDialog"
      :modal="true"
      :closable="true"
      :dismissableMask="true"
      :style="{ width: '700px', maxWidth: '95vw' }"
      :showHeader="false"
      contentClass="p-0 rounded-xl overflow-hidden"
      class="application-detail-dialog"
    >
      <div v-if="selectedApplication" class="flex flex-col">
        <!-- Custom Header with Job Title and Status -->
        <div
          class="relative px-6 py-5 border-b border-gray-200 sticky top-0 z-10"
          :class="getStatusBackgroundClass(selectedApplication.status)"
        >
          <div class="flex justify-between items-start">
            <div>
              <h2 class="text-xl font-bold text-white mb-1">
                {{ selectedApplication.jobTitle }}
              </h2>
              <div class="flex items-center text-white text-opacity-90">
                <i class="pi pi-building mr-2"></i>
                <router-link
                  :to="{
                    name: 'RecruiterInfo',
                    params: { recruiterId: selectedApplication.recruiterId },
                    query: { source: 'applications' },
                  }"
                  class="text-white text-opacity-90 hover:text-white hover:underline transition-colors flex items-center gap-1"
                >
                  {{ selectedApplication.companyName }}
                  <Tag
                    value="Company"
                    severity="warning"
                    class="text-[10px] py-1 px-1 ml-1 bg-white bg-opacity-20"
                  />
                </router-link>
              </div>
            </div>

            <div
              class="px-4 py-1 rounded-full text-white text-sm font-medium mr-8"
              :class="getStatusHighlightClass(selectedApplication.status)"
            >
              {{ formatStatus(selectedApplication.status) }}
            </div>
          </div>

          <!-- Close button -->
          <Button
            icon="pi pi-times"
            class="p-button-rounded p-button-text absolute right-2 top-2 text-white"
            @click="applicationDetailDialog = false"
            :pt="{ root: { class: 'hover:bg-white hover:bg-opacity-20' } }"
          />
        </div>

        <!-- Application Content -->
        <div class="p-6 overflow-y-auto" style="max-height: 70vh">
          <!-- Date only (removed reference) -->
          <div class="flex items-center justify-end mb-6 px-2">
            <div class="flex items-center">
              <i class="pi pi-calendar text-indigo-400 mr-2"></i>
              <span class="text-sm text-gray-500"
                >Applied:
                <span class="font-medium text-gray-700">{{
                  formatDate(selectedApplication.appliedAt)
                }}</span></span
              >
            </div>
          </div>

          <!-- Application Details Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <!-- Location Details -->
            <div
              class="bg-gray-50 hover:bg-gray-100 transition-colors duration-300 p-4 rounded-xl border border-gray-100"
            >
              <div class="flex items-start">
                <div
                  class="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center mr-4"
                >
                  <i class="pi pi-map-marker text-indigo-500"></i>
                </div>
                <div>
                  <h4 class="font-medium text-gray-900 mb-1">Location</h4>
                  <p class="text-gray-700">
                    {{ selectedApplication.location }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Salary Details -->
            <div
              class="bg-gray-50 hover:bg-gray-100 transition-colors duration-300 p-4 rounded-xl border border-gray-100"
            >
              <div class="flex items-start">
                <div
                  class="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center mr-4"
                >
                  <i class="pi pi-dollar text-green-500"></i>
                </div>
                <div>
                  <h4 class="font-medium text-gray-900 mb-1">Payment</h4>
                  <p class="text-gray-700">
                    RM {{ selectedApplication.salary }}
                    <span class="text-gray-500 text-sm">
                      {{
                        selectedApplication.salaryType === 'PER_DAY'
                          ? '/ day'
                          : '/ hour'
                      }}
                    </span>
                  </p>
                  <p
                    v-if="selectedApplication.paymentTerms"
                    class="text-gray-500 text-sm mt-1"
                  >
                    {{ selectedApplication.paymentTerms }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Work Schedule -->
          <div class="mb-6">
            <h3 class="font-semibold text-gray-800 mb-4 flex items-center">
              <i class="pi pi-calendar-plus text-indigo-400 mr-2"></i>
              Work Schedule
            </h3>
            <div class="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <!-- Calendar-like visualization -->
              <div class="flex flex-wrap gap-3">
                <div
                  v-for="(date, index) in getWorkDates(
                    selectedApplication.workStartDate,
                    selectedApplication.workEndDate,
                    selectedApplication.workDates
                  )"
                  :key="index"
                  class="flex flex-col items-center justify-center w-14 h-16 bg-white rounded-lg border border-indigo-100 shadow-sm"
                >
                  <div class="text-xs font-medium text-indigo-500 uppercase">
                    {{ formatWorkDateMonth(date) }}
                  </div>
                  <div class="text-xl font-bold text-gray-800">
                    {{ formatWorkDateDay(date) }}
                  </div>
                  <div class="text-xs text-gray-500">
                    {{ formatWorkDateYear(date) }}
                  </div>
                </div>
              </div>

              <div
                v-if="selectedApplication.workTime"
                class="mt-4 text-sm text-gray-600 flex items-center"
              >
                <i class="pi pi-clock mr-2 text-indigo-400"></i>
                <span>Working hours: {{ selectedApplication.workTime }}</span>
              </div>
            </div>
          </div>

          <!-- Job Description -->
          <div class="mb-6">
            <h3 class="font-semibold text-gray-800 mb-4 flex items-center">
              <i class="pi pi-list text-indigo-400 mr-2"></i>
              Job Scope
            </h3>
            <div class="bg-gray-50 p-5 rounded-xl border border-gray-100">
              <p class="text-gray-700 leading-relaxed">
                {{ selectedApplication.jobScope }}
              </p>
            </div>
          </div>

          <!-- Application Notes -->
          <div v-if="selectedApplication.notes" class="mb-6">
            <h3 class="font-semibold text-gray-800 mb-4 flex items-center">
              <i class="pi pi-comment text-indigo-400 mr-2"></i>
              Your Notes
            </h3>
            <div
              class="bg-indigo-50 p-5 rounded-xl border border-indigo-100 relative"
            >
              <div class="absolute top-3 right-3 text-indigo-300">
                <i class="pi pi-quote-right text-4xl opacity-50"></i>
              </div>
              <p class="text-gray-700 leading-relaxed italic text-indigo-900">
                {{ selectedApplication.notes }}
              </p>
            </div>
          </div>

          <div
            v-if="selectedApplication.status === 'PENDING'"
            class="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg"
          >
            <div class="flex">
              <div class="flex-shrink-0">
                <i class="pi pi-info-circle text-yellow-400"></i>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-yellow-800">
                  Your application is under review
                </h3>
                <div class="mt-2 text-sm text-yellow-700">
                  <p>
                    Recruiters typically respond within 1-3 business days. You
                    can withdraw your application at any time before it's
                    approved.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer Actions -->
          <div
            class="flex justify-between items-center mt-8 pt-4 border-t border-gray-200 sticky bottom-0 bg-white z-10"
          >
            <Button
              label="View Recruiter"
              icon="pi pi-user"
              class="p-button-outlined p-button-rounded"
              @click="contactRecruiter(selectedApplication)"
            />
            <Button
              v-if="selectedApplication.status === 'PENDING'"
              label="Withdraw Application"
              icon="pi pi-times"
              class="p-button-danger p-button-rounded"
              @click="confirmWithdraw(selectedApplication)"
            />
          </div>
        </div>
      </div>
    </Dialog>

    <!-- Withdraw confirmation dialog -->
    <Dialog
      v-model:visible="withdrawDialogVisible"
      :modal="true"
      :closable="false"
      :dismissableMask="true"
      :style="{ width: '500px', maxWidth: '95vw' }"
      :showHeader="false"
      contentClass="p-0 rounded-xl overflow-hidden"
      class="withdraw-dialog"
    >
      <div
        class="bg-white rounded-xl overflow-hidden flex flex-col max-h-[85vh]"
      >
        <!-- Header with warning icon - fixed -->
        <div class="bg-red-50 p-6 flex items-center flex-shrink-0">
          <div
            class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mr-4 flex-shrink-0"
          >
            <i class="pi pi-exclamation-triangle text-red-500 text-xl"></i>
          </div>
          <h2 class="text-xl font-bold text-red-800">Withdraw Application</h2>
        </div>

        <!-- Content - scrollable -->
        <div class="p-6 overflow-y-auto">
          <p class="text-gray-700 mb-4">
            You are about to withdraw your application for:
          </p>

          <!-- Job card -->
          <div class="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
            <div class="font-semibold text-lg text-gray-800 mb-2">
              {{ withdrawApplication?.jobTitle }}
            </div>
            <div class="text-gray-600 mb-1">
              {{ withdrawApplication?.companyName }}
            </div>
            <div class="text-sm text-gray-500 flex items-center">
              <i class="pi pi-map-marker mr-2"></i>
              <span>{{ withdrawApplication?.location }}</span>
            </div>
          </div>

          <!-- Withdrawal reason -->
          <div class="mb-6">
            <label
              for="withdrawal-reason"
              class="block text-gray-700 font-medium mb-2"
              >Reason for withdrawal</label
            >
            <Dropdown
              id="withdrawal-reason"
              v-model="withdrawalReason"
              :options="withdrawalReasons"
              optionLabel="label"
              optionValue="value"
              placeholder="Select a reason"
              class="w-full"
            />

            <div v-if="withdrawalReason === 'OTHER'" class="mt-3">
              <label
                for="other-reason-details"
                class="block text-gray-700 text-sm mb-2"
                >Please specify</label
              >
              <Textarea
                id="other-reason-details"
                v-model="otherReasonDetails"
                rows="3"
                placeholder="Tell us more about your reason for withdrawing..."
                class="w-full"
              />
              <small v-if="showOtherReasonError" class="p-error block mt-1">
                Please provide details for your withdrawal reason
              </small>
            </div>

            <small v-if="showReasonError" class="p-error block mt-2">
              Please select a reason for withdrawal
            </small>
          </div>

          <!-- Warning message -->
          <div
            class="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg mb-6"
          >
            <div class="flex">
              <div class="flex-shrink-0">
                <i class="pi pi-info-circle text-red-500"></i>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">Please note:</h3>
                <div class="mt-2 text-sm text-red-700">
                  <ul class="list-disc pl-5 space-y-1">
                    <li>This action cannot be undone</li>
                    <li>You'll need to apply again if you change your mind</li>
                    <li>
                      Repeatedly withdrawing applications may affect your
                      profile ranking
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- Confirmation question -->
          <p class="text-gray-700 mb-6 font-medium text-center">
            Are you sure you want to withdraw this application?
          </p>
        </div>

        <!-- Action buttons - fixed at bottom -->
        <div
          class="flex justify-center gap-4 p-6 pt-0 border-t border-gray-100 flex-shrink-0"
        >
          <Button
            label="Keep Application"
            icon="pi pi-check"
            class="p-button-outlined p-button-rounded"
            @click="withdrawDialogVisible = false"
          />
          <Button
            label="Withdraw Application"
            icon="pi pi-times"
            class="p-button-danger p-button-rounded"
            @click="withdrawApplicationConfirmed"
            :loading="withdrawing"
          />
        </div>
      </div>
    </Dialog>

    <!-- Toast for notifications -->
    <Toast />

    <!-- Scroll to top button -->
    <Button
      v-if="showScrollTopButton"
      icon="pi pi-arrow-up"
      class="p-button-rounded p-button-secondary fixed bottom-6 right-6 shadow-lg"
      @click="scrollToTop"
    />
  </div>
</template>

<script setup>
import {
  ref,
  reactive,
  computed,
  onMounted,
  nextTick,
  onBeforeUnmount,
} from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { format, parseISO } from 'date-fns';
import axios from 'axios';
import authService from '@/services/auth.service';

// PrimeVue components
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import Tag from 'primevue/tag';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ProgressSpinner from 'primevue/progressspinner';
import Dialog from 'primevue/dialog';
import Toast from 'primevue/toast';
import Chip from 'primevue/chip';
import InputSwitch from 'primevue/inputswitch';
import Paginator from 'primevue/paginator';
import Textarea from 'primevue/textarea';

const router = useRouter();
const toast = useToast();

// State
const loading = ref(true);
const applications = ref([]);
const applicationDetailDialog = ref(false);
const selectedApplication = ref(null);
const withdrawDialogVisible = ref(false);
const withdrawApplication = ref(null);
const withdrawing = ref(false);
const withdrawalReason = ref('');
const showReasonError = ref(false);
const otherReasonDetails = ref('');
const showOtherReasonError = ref(false);

// New state for filter collapse behavior
const isScrolled = ref(false);
const isScrolledFar = ref(false);
const isFilterHovered = ref(false);

// Pagination related
const paginationEnabled = ref(true);
const itemsPerPage = ref(6); // Show 6 applications per page (2 rows of 3 cards)
const paginationFirsts = ref({
  PENDING: 0,
  HIRED: 0,
  COMPLETED: 0,
  REJECTED: 0,
  WITHDRAWN: 0,
  BACKUP: 0,
  CANCELLED: 0,
});

// Filters
const filters = reactive({
  search: '',
  status: '',
  sort: 'newest',
});

// Filter options
const statusOptions = [
  { label: 'All Statuses', value: '' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Hired', value: 'HIRED' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Rejected', value: 'REJECTED' },
  { label: 'Withdrawn', value: 'WITHDRAWN' },
  { label: 'Backup', value: 'BACKUP' },
  { label: 'Cancelled', value: 'CANCELLED' },
];

const sortOptions = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Oldest First', value: 'oldest' },
  { label: 'Company (A-Z)', value: 'companyAsc' },
  { label: 'Company (Z-A)', value: 'companyDesc' },
];

// Check if there are active filters
const hasActiveFilters = computed(() => {
  return (
    filters.search !== '' || filters.status !== '' || filters.sort !== 'newest'
  );
});

// Get label for status filter
const getStatusLabel = (status) => {
  const option = statusOptions.find((opt) => opt.value === status);
  return option ? option.label : status;
};

// Get label for sort filter
const getSortLabel = (sort) => {
  const option = sortOptions.find((opt) => opt.value === sort);
  return option ? option.label : sort;
};

// Get status background color class for dialog header
const getStatusBackgroundClass = (status) => {
  switch (status) {
    case 'PENDING':
      return 'bg-gradient-to-r from-yellow-500 to-yellow-600';
    case 'HIRED':
      return 'bg-gradient-to-r from-green-500 to-green-600';
    case 'COMPLETED':
      return 'bg-gradient-to-r from-indigo-500 to-purple-600';
    case 'REJECTED':
      return 'bg-gradient-to-r from-red-500 to-red-600';
    case 'WITHDRAWN':
      return 'bg-gradient-to-r from-gray-500 to-gray-600';
    case 'BACKUP':
      return 'bg-gradient-to-r from-blue-500 to-blue-600';
    case 'CANCELLED':
      return 'bg-gradient-to-r from-red-400 to-orange-500';
    default:
      return 'bg-gradient-to-r from-gray-500 to-gray-600';
  }
};

// Get status highlight color class for dialog header status tag
const getStatusHighlightClass = (status) => {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-400 bg-opacity-30';
    case 'HIRED':
      return 'bg-green-400 bg-opacity-30';
    case 'COMPLETED':
      return 'bg-purple-400 bg-opacity-30';
    case 'REJECTED':
      return 'bg-red-400 bg-opacity-30';
    case 'WITHDRAWN':
      return 'bg-gray-400 bg-opacity-30';
    case 'BACKUP':
      return 'bg-blue-400 bg-opacity-30';
    case 'CANCELLED':
      return 'bg-orange-400 bg-opacity-30';
    default:
      return 'bg-gray-400 bg-opacity-30';
  }
};

// Get status border color class for cards
const getStatusBorderClass = (status) => {
  switch (status) {
    case 'PENDING':
      return 'border-yellow-500';
    case 'HIRED':
      return 'border-green-500';
    case 'COMPLETED':
      return 'border-purple-500';
    case 'REJECTED':
      return 'border-red-500';
    case 'WITHDRAWN':
      return 'border-gray-500';
    case 'BACKUP':
      return 'border-blue-500';
    case 'CANCELLED':
      return 'border-orange-500';
    default:
      return 'border-gray-500';
  }
};

// Get appropriate color classes based on status
const getStatusColorClass = (status) => {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-500';
    case 'HIRED':
      return 'bg-green-500';
    case 'COMPLETED':
      return 'bg-purple-500';
    case 'REJECTED':
      return 'bg-red-500';
    case 'WITHDRAWN':
      return 'bg-gray-500';
    case 'BACKUP':
      return 'bg-blue-500';
    case 'CANCELLED':
      return 'bg-orange-500';
    default:
      return 'bg-gray-500';
  }
};

// Get appropriate PrimeVue severity based on status
const getStatusSeverity = (status) => {
  switch (status) {
    case 'PENDING':
      return 'warning';
    case 'HIRED':
      return 'success';
    case 'COMPLETED':
      return 'help';
    case 'REJECTED':
      return 'danger';
    case 'WITHDRAWN':
      return 'secondary';
    case 'BACKUP':
      return 'info';
    case 'CANCELLED':
      return 'warning';
    default:
      return 'secondary';
  }
};

// Withdrawal reason options
const withdrawalReasons = [
  { label: 'Found another job', value: 'FOUND_ANOTHER_JOB' },
  { label: 'Schedule conflict', value: 'SCHEDULE_CONFLICT' },
  { label: 'Changed my mind', value: 'CHANGED_MIND' },
  { label: 'Travel issues', value: 'TRAVEL_ISSUES' },
  { label: 'Payment too low', value: 'COMPENSATION_ISSUE' },
  { label: 'Health reasons', value: 'HEALTH_REASONS' },
  { label: 'Personal reasons', value: 'PERSONAL_REASONS' },
  { label: 'Other', value: 'OTHER' },
];

// Fetch applications from API
const fetchApplications = async () => {
  loading.value = true;

  try {
    const token = authService.getToken();

    const response = await axios.get(
      'http://localhost:8080/api/candidates/applications',
      {
        headers: {
          Authorization: token,
        },
      }
    );

    if (response.data.statusCode === 200) {
      // Transform API data to our application format
      applications.value = response.data.data.map((app) => {
        const jobDetails = app.jobSummary;

        // Deduplicate location names
        const uniqueLocationNames = [...new Set(app.locationNames)];
        const locationString = uniqueLocationNames.join(', ');

        return {
          id: app.id,
          jobId: app.jobId,
          jobTitle: app.jobTitle,
          companyName: app.companyName,
          location: locationString,
          appliedAt: app.applicationDate,
          status: app.applicationStatus,
          salary: jobDetails.salary,
          salaryType: jobDetails.salaryType,
          workStartDate: jobDetails.earliestStartDate,
          workEndDate: jobDetails.latestEndDate,
          referenceNumber: app.applicationGroupId.substring(0, 8).toUpperCase(),
          applicationGroupId: app.applicationGroupId,
          jobScope: jobDetails.jobScope || 'No description provided',
          notes: app.notes,
          workTime: `${jobDetails.startTime} - ${jobDetails.endTime}`,
          paymentTerms: jobDetails.paymentTerms,
          workDates: app.workDates || [],
          recruiterId: app.recruiterId || jobDetails.recruiterId || '1',
        };
      });
    } else {
      throw new Error(response.data.message || 'Failed to fetch applications');
    }
  } catch (error) {
    console.error('Error fetching applications:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load your applications. Please try again.',
      life: 3000,
    });
    applications.value = []; // Clear applications on error
  } finally {
    loading.value = false;
  }
};

// Filtered applications based on search and status
const filteredApplications = computed(() => {
  let result = [...applications.value];

  // Search filter
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    result = result.filter(
      (app) =>
        app.jobTitle.toLowerCase().includes(searchLower) ||
        app.companyName.toLowerCase().includes(searchLower) ||
        app.location.toLowerCase().includes(searchLower) ||
        app.referenceNumber.toLowerCase().includes(searchLower)
    );
  }

  // Status filter
  if (filters.status) {
    result = result.filter((app) => app.status === filters.status);
  }

  // Sort
  switch (filters.sort) {
    case 'newest':
      result.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));
      break;
    case 'oldest':
      result.sort((a, b) => new Date(a.appliedAt) - new Date(b.appliedAt));
      break;
    case 'companyAsc':
      result.sort((a, b) => a.companyName.localeCompare(b.companyName));
      break;
    case 'companyDesc':
      result.sort((a, b) => b.companyName.localeCompare(a.companyName));
      break;
  }

  return result;
});

// Group applications by status for display
const applicationGroups = computed(() => {
  // Get filtered applications
  const filtered = filteredApplications.value;

  // Create groups with title, status, and applications
  return [
    {
      title: 'Pending Review',
      status: 'PENDING',
      applications: filtered.filter((app) => app.status === 'PENDING'),
    },
    {
      title: 'Hired',
      status: 'HIRED',
      applications: filtered.filter((app) => app.status === 'HIRED'),
    },
    {
      title: 'Completed',
      status: 'COMPLETED',
      applications: filtered.filter((app) => app.status === 'COMPLETED'),
    },
    {
      title: 'Backup',
      status: 'BACKUP',
      applications: filtered.filter((app) => app.status === 'BACKUP'),
    },
    {
      title: 'Rejected',
      status: 'REJECTED',
      applications: filtered.filter((app) => app.status === 'REJECTED'),
    },
    {
      title: 'Withdrawn',
      status: 'WITHDRAWN',
      applications: filtered.filter((app) => app.status === 'WITHDRAWN'),
    },
    {
      title: 'Cancelled',
      status: 'CANCELLED',
      applications: filtered.filter((app) => app.status === 'CANCELLED'),
    },
  ];
});

// Format methods
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return format(parseISO(dateString), 'MMM d, yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

const formatDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return 'Dates TBD';

  try {
    const start = format(parseISO(startDate), 'MMM d');
    const end = format(parseISO(endDate), 'MMM d, yyyy');

    return `${start} - ${end}`;
  } catch (error) {
    console.error('Error formatting date range:', error);
    return `${startDate} - ${endDate}`;
  }
};

const formatStatus = (status) => {
  if (!status) return 'Unknown';

  // Convert from SNAKE_CASE to Title Case
  return status
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

// Action methods
const clearFilters = () => {
  filters.search = '';
  filters.status = '';
  filters.sort = 'newest';
};

const viewApplicationDetails = (applicationId) => {
  const application = applications.value.find(
    (app) => app.id === applicationId
  );
  if (application) {
    selectedApplication.value = application;
    applicationDetailDialog.value = true;
  }
};

const confirmWithdraw = (application) => {
  withdrawApplication.value = application;
  withdrawalReason.value = ''; // Reset the reason
  otherReasonDetails.value = ''; // Reset the other reason details
  showReasonError.value = false; // Reset error states
  showOtherReasonError.value = false;
  withdrawDialogVisible.value = true;
  applicationDetailDialog.value = false; // Close details dialog if open
};

const withdrawApplicationConfirmed = async () => {
  if (!withdrawApplication.value) return;

  // Validate reason is selected
  if (!withdrawalReason.value) {
    showReasonError.value = true;
    return;
  }

  // Validate other reason details if "Other" is selected
  if (withdrawalReason.value === 'OTHER' && !otherReasonDetails.value.trim()) {
    showOtherReasonError.value = true;
    return;
  }

  withdrawing.value = true;

  try {
    const token = authService.getToken();

    // Prepare the withdrawal reason
    let reasonText = '';

    if (withdrawalReason.value === 'OTHER') {
      // For "Other" use what the candidate entered
      reasonText = otherReasonDetails.value.trim();
    } else {
      // For standard reasons, use the exact label text from options
      const selectedOption = withdrawalReasons.find(
        (option) => option.value === withdrawalReason.value
      );
      reasonText = selectedOption ? selectedOption.label : '';
    }

    // Prepare the request data with the exact JSON structure required
    const requestData = {
      withdrawalReason: reasonText,
    };

    // Make the API call to withdraw the application using applicationGroupId with DELETE method
    await axios.delete(
      `http://localhost:8080/api/candidates/applications/group/${withdrawApplication.value.applicationGroupId}`,
      {
        headers: {
          Authorization: token,
        },
        data: requestData,
      }
    );

    // Update the application status for all applications with the same group ID
    applications.value.forEach((app, index) => {
      if (
        app.applicationGroupId === withdrawApplication.value.applicationGroupId
      ) {
        applications.value[index].status = 'WITHDRAWN';
      }
    });

    toast.add({
      severity: 'success',
      summary: 'Application Withdrawn',
      detail: 'Your application has been successfully withdrawn',
      life: 3000,
    });

    withdrawDialogVisible.value = false;
    withdrawApplication.value = null;
    withdrawalReason.value = '';
    otherReasonDetails.value = '';
  } catch (error) {
    console.error('Error withdrawing application:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail:
        error.response?.data?.message ||
        'Failed to withdraw your application. Please try again.',
      life: 3000,
    });
  } finally {
    withdrawing.value = false;
  }
};

const contactRecruiter = (application) => {
  // Close the application detail dialog
  applicationDetailDialog.value = false;

  // Navigate to RecruiterInfo page with the recruiter ID
  router.push({
    name: 'RecruiterInfo',
    params: { recruiterId: application.recruiterId },
    query: { source: 'applications', action: 'contact' },
  });
};

const goToJobSearch = () => {
  router.push({ name: 'FindJobs' });
};

// Fetch data on component mount
onMounted(() => {
  fetchApplications();
});

// Pagination logic
const getPaginatedApplications = (status) => {
  const group = applicationGroups.value.find((g) => g.status === status);
  if (!group) return [];

  if (
    paginationEnabled.value &&
    group.applications.length > itemsPerPage.value
  ) {
    const first = paginationFirsts.value[status] || 0;
    return group.applications.slice(first, first + itemsPerPage.value);
  } else {
    return group.applications;
  }
};

const shouldShowPagination = (status) => {
  const group = applicationGroups.value.find((g) => g.status === status);
  return (
    paginationEnabled.value &&
    group &&
    group.applications.length > itemsPerPage.value
  );
};

const onPageChange = (event, status) => {
  paginationFirsts.value[status] = event.first;

  // Scroll to the top of the section
  nextTick(() => {
    const sectionEl = document.getElementById(`section-${status}`);
    if (sectionEl) {
      sectionEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
};

// New state for scroll to top button
const showScrollTopButton = ref(false);

// Function to scroll to top
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// New state for active section
const activeSection = ref('');

// New state for jump to section
const jumpToSections = [
  { label: 'Pending Review', value: 'PENDING' },
  { label: 'Hired', value: 'HIRED' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Backup', value: 'BACKUP' },
  { label: 'Rejected', value: 'REJECTED' },
  { label: 'Withdrawn', value: 'WITHDRAWN' },
  { label: 'Cancelled', value: 'CANCELLED' },
];

// Function to jump to section
const jumpToSection = () => {
  const section = activeSection.value;
  if (section) {
    const group = applicationGroups.value.find((g) => g.status === section);
    if (group) {
      paginationFirsts.value[section] = 0;
      nextTick(() => {
        const sectionEl = document.getElementById(`section-${section}`);
        if (sectionEl) {
          sectionEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }
  }
};

// Function to handle scroll event
const handleScroll = () => {
  isScrolled.value = window.scrollY > 150;
  isScrolledFar.value = window.scrollY > 250;
  showScrollTopButton.value = window.scrollY > 300;
};

// Add scroll event listener
onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

// Remove scroll event listener on component unmount
onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});

// Check if there are any applications
const hasApplications = computed(() => {
  return applications.value.length > 0;
});

// Modify getWorkDates to use the workDates array if available
const getWorkDates = (startDate, endDate, workDatesArray = []) => {
  // If we have work dates array, use that
  if (workDatesArray && workDatesArray.length > 0) {
    return workDatesArray.map((dateStr) => new Date(dateStr));
  }

  // Fall back to start/end date range calculation
  if (!startDate || !endDate) return [];

  const start = new Date(startDate);
  const end = new Date(endDate);
  const dateArray = [];

  // Create array of dates between start and end (inclusive)
  let currentDate = new Date(start);
  while (currentDate <= end) {
    dateArray.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dateArray;
};

// Format work date month for calendar visualization
const formatWorkDateMonth = (date) => {
  return format(date, 'MMM');
};

// Format work date day for calendar visualization
const formatWorkDateDay = (date) => {
  return format(date, 'd');
};

// Format work date year for calendar visualization
const formatWorkDateYear = (date) => {
  return format(date, 'yyyy');
};

// Format work dates array for display
const formatWorkDatesArray = (workDatesArray) => {
  if (!workDatesArray || workDatesArray.length === 0) return 'Dates TBD';

  try {
    // If there are more than 3 dates, show the first and last with a count
    if (workDatesArray.length > 3) {
      const first = format(new Date(workDatesArray[0]), 'MMM d');
      const last = format(
        new Date(workDatesArray[workDatesArray.length - 1]),
        'MMM d, yyyy'
      );
      return `${first} - ${last} (${workDatesArray.length} days)`;
    }

    // Otherwise, format each date
    return workDatesArray
      .map((date) => {
        const dateObj = new Date(date);
        return format(dateObj, 'MMM d, yyyy');
      })
      .join(', ');
  } catch (error) {
    console.error('Error formatting work dates array:', error);
    return workDatesArray.join(', ');
  }
};

// New function to get image path
const getImagePath = (url) => {
  if (!url) return '';

  // Check if the URL starts with '/assets/profile-pictures'
  if (url.startsWith('/assets/profile-pictures')) {
    // Use importable URLs instead of require
    return new URL(
      `../../assets/profile-pictures${url.substring(
        '/assets/profile-pictures'.length
      )}`,
      import.meta.url
    ).href;
  }

  // If it's already an absolute URL, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // Default case, just return the URL as-is
  return url;
};
</script>

<style scoped>
.application-detail-dialog :deep(.p-dialog-content) {
  padding: 0;
  border-radius: 0.75rem;
  overflow: hidden;
  max-height: 85vh; /* Limit max height to 85% of viewport height */
}

.application-detail-dialog :deep(.p-dialog-mask) {
  backdrop-filter: blur(4px);
  background-color: rgba(17, 24, 39, 0.5);
}

.application-detail-dialog :deep(.p-dialog) {
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  animation: scaleUp 0.2s ease-out forwards;
}

.application-detail-dialog :deep(.p-dialog-footer) {
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

/* Application cards animations and transitions */
.applications-content .grid > div {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.applications-content .grid > div:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #ddd;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #ccc;
}

/* Status headers with animated gradient backgrounds */
.applications-content .flex-grow-enter-active,
.applications-content .flex-grow-leave-active {
  transition: all 0.3s ease;
}

.applications-content .flex-grow-enter-from,
.applications-content .flex-grow-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Badge & Tag styling */
:deep(.p-tag) {
  border-radius: 9999px;
  font-weight: 500;
  font-size: 0.75rem;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
}

/* Reset complete dropdown styling to remove ALL borders */
:deep(.p-dropdown) {
  height: 48px;
  border-radius: 0.375rem;
  box-shadow: none !important;
  border: 1px solid #e5e7eb;
  display: flex !important;
  align-items: center !important;
  padding: 0 !important;
  overflow: hidden;
  background-color: #ffffff;
  background-image: none !important; /* Prevent any gradient backgrounds */
}

:deep(.p-dropdown *) {
  border: none !important;
  box-shadow: none !important;
  outline: none !important;
  background-image: none !important;
}

/* Ensure the placeholder text and dropdown label align properly */
:deep(.p-dropdown .p-dropdown-label) {
  padding: 10px 12px !important;
  display: flex !important;
  align-items: center !important;
  flex: 1 !important;
  border-right: 0 !important;
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
  background: transparent !important;
  position: static !important;
  transform: none !important;
  line-height: 1.5 !important;
  font-size: inherit !important;
}

:deep(.p-dropdown .p-dropdown-trigger) {
  width: 2.5rem !important;
  border-left: 0 !important;
  background-color: transparent !important;
  margin: 0 !important;
  padding: 0 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  position: static !important;
  transform: none !important;
}

:deep(.p-dropdown .p-dropdown-trigger-icon) {
  color: #6b7280;
}

/* Override any potential PrimeVue theme separators */
:deep(.p-dropdown .p-dropdown-trigger::before),
:deep(.p-dropdown .p-dropdown-trigger::after),
:deep(.p-dropdown-trigger-icon::before),
:deep(.p-dropdown-trigger-icon::after) {
  display: none !important;
  border: none !important;
}

:deep(.p-dropdown-panel) {
  margin-top: 5px;
  border-radius: 0.375rem;
  border: 1px solid #e5e7eb;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

:deep(.p-dropdown-items-wrapper) {
  padding: 0;
}

:deep(.p-dropdown .p-placeholder) {
  color: #9ca3af;
}

:deep(.p-dropdown-panel .p-dropdown-items .p-dropdown-item) {
  padding: 10px 12px;
}

:deep(.p-dropdown-panel .p-dropdown-items .p-dropdown-item.p-highlight) {
  background-color: #eef2ff;
  color: #4f46e5;
}

:deep(.p-dropdown:not(.p-disabled).p-focus) {
  border-color: #6366f1;
  box-shadow: none;
  outline: 2px solid rgba(99, 102, 241, 0.2);
  outline-offset: 1px;
}

/* Remove dotted outline on Safari */
:deep(.p-dropdown *:focus) {
  outline: none !important;
}

:deep(.p-inputtext) {
  height: 48px;
  border-radius: 0.375rem;
}

:deep(.p-inputtext::placeholder) {
  color: #9ca3af;
}

/* Button styling */
:deep(.p-button.p-button-rounded) {
  border-radius: 9999px;
}

:deep(.p-button.p-button-outlined:hover) {
  background-color: #eef2ff;
  border-color: #6366f1;
}

:deep(.p-button.p-button-danger.p-button-text:hover) {
  background-color: #fee2e2;
}

/* Sticky filter bar */
.sticky-filters {
  position: relative;
  z-index: 40;
  transition: all 0.3s ease-in-out;
}

.sticky-filters.sticky-active {
  position: sticky;
  top: 16px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  transform: translateY(0);
  transition-delay: 0ms;
  border: 1px solid rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(16px);
  background-color: rgba(255, 255, 255, 0.9);
}

/* New styles for collapsed filter */
.sticky-filters.collapsed {
  padding: 0.75rem 1.5rem;
}

.sticky-filters .main-filters {
  max-height: 500px;
  opacity: 1;
  overflow: hidden;
  transition: all 0.3s ease-in-out;
}

.sticky-filters .main-filters.hidden-filters {
  max-height: 0;
  opacity: 0;
  margin-bottom: 0;
  padding-bottom: 0;
}

.jump-to-container {
  transition: all 0.3s ease;
}

/* Status section transitions */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Pagination styling */
:deep(.p-paginator) {
  padding: 0.5rem;
}

:deep(.p-paginator .p-paginator-pages .p-paginator-page.p-highlight) {
  background-color: #eef2ff;
  color: #4f46e5;
}

/* Scroll to top button animation */
@keyframes pulse {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(99, 102, 241, 0);
  }
}

.p-button-rounded.fixed {
  animation: pulse 2s infinite;
  transition: all 0.3s ease;
}

.p-button-rounded.fixed:hover {
  transform: translateY(-3px);
}

/* Status-specific colors for COMPLETED status */
[class*='status-completed'] {
  background: linear-gradient(135deg, #8b5cf6, #6366f1);
}

.completed-badge {
  background-color: #a78bfa;
  color: #fff;
}

/* Improved dropdown styling */
.improved-dropdown {
  width: 100%;
}

.improved-dropdown :deep(.p-dropdown) {
  display: flex !important;
  flex-direction: row !important;
  border: 1px solid #e5e7eb !important;
  overflow: hidden !important;
}

.improved-dropdown :deep(.p-dropdown:hover) {
  border-color: #6366f1 !important;
}

.improved-dropdown :deep(.p-dropdown-clear-icon) {
  margin: 0 !important;
  padding: 0 !important;
}

.improved-dropdown :deep(.p-dropdown-trigger),
.improved-dropdown :deep(.p-dropdown-label) {
  background-image: none !important;
}

/* Dialog animation */
@keyframes scaleUp {
  0% {
    transform: scale(0.95);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.application-detail-dialog :deep(.p-dialog) {
  animation: scaleUp 0.2s ease-out forwards;
}

.p-dropdown:before,
.p-dropdown:after,
.p-dropdown-trigger:before,
.p-dropdown-trigger:after,
.p-dropdown-label:before,
.p-dropdown-label:after {
  display: none !important;
  content: none !important;
  border: none !important;
  background: none !important;
  box-shadow: none !important;
}

/* Extra override for the specific class that PrimeVue uses for the separator */
:deep(.p-dropdown-trigger) {
  box-shadow: -1px 0 0 transparent !important;
  border-color: transparent !important;
}

/* Create a custom class to specifically apply to our project's dropdowns */
.seamless-dropdown {
  /* Target the specific rendering issue in browsers */
  -webkit-appearance: none;
  -moz-appearance: none;
}

/* Make search field and dropdown fields align perfectly */
.p-inputtext,
:deep(.p-dropdown) {
  line-height: 1.5 !important;
  padding-top: 0.5rem !important;
  padding-bottom: 0.5rem !important;
}

/* Form alignment fixes */
:deep(.p-input-icon-left) {
  height: 48px !important;
  display: flex;
  align-items: center;
}

:deep(.p-input-icon-left) > i {
  top: 50%;
  transform: translateY(-50%);
  left: 12px;
}

:deep(.p-input-icon-left) > .p-inputtext {
  padding-left: 35px;
}

.withdraw-dialog :deep(.p-dialog-content) {
  padding: 0;
  border-radius: 0.75rem;
  overflow: hidden;
}

.withdraw-dialog .overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: rgba(203, 213, 225, 0.8) transparent;
}

.withdraw-dialog .overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.withdraw-dialog .overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.withdraw-dialog .overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(203, 213, 225, 0.8);
  border-radius: 20px;
}

.withdraw-dialog .overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background-color: rgba(148, 163, 184, 0.8);
}
</style>
