<template>
  <div class="job-details-container bg-gray-50 min-h-screen">
    <!-- Hero section with job title and back button -->
    <div class="bg-gradient-to-r from-primary-700 to-primary-900 text-white">
      <div class="container mx-auto px-6 py-8">
        <div class="flex items-center mb-2">
          <Button
            icon="pi pi-arrow-left"
            class="p-button-rounded p-button-text text-white"
            @click="goBack"
            v-tooltip="'Go back'"
          />
          <div class="flex items-center ml-2">
            <i class="pi pi-folder text-primary-200 mr-2"></i>
            <span class="text-primary-100">{{ projectName }}</span>
          </div>
          <Tag
            v-if="job"
            :value="formatJobStatus(job.status)"
            :severity="getJobStatusSeverity(job.status)"
            class="ml-4"
          />
        </div>

        <div
          class="flex flex-col md:flex-row justify-between items-start md:items-center"
        >
          <h1 class="text-3xl font-bold">{{ job?.title || 'Job Details' }}</h1>
          <div class="mt-3 md:mt-0" v-if="job">
            <Tag
              :value="formatJobTitleType(job.jobTitleType)"
              :class="getJobTypeBgColor(job.jobTitleType)"
              class="px-3 py-1.5 rounded-full font-medium text-white job-type-tag"
            />
            <Tag
              v-if="job.status === 'DRAFT'"
              class="ml-2 px-3 py-2"
              icon="pi pi-exclamation-triangle"
              severity="warning"
              value="Draft Mode"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="text-center py-16 container mx-auto">
      <ProgressSpinner
        style="width: 50px; height: 50px"
        strokeWidth="4"
        animationDuration=".7s"
        class="mb-4"
      />
      <p class="text-gray-600">Loading job details...</p>
    </div>

    <!-- Job not found state -->
    <div v-else-if="!job" class="text-center py-16 container mx-auto">
      <div
        class="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6"
      >
        <i class="pi pi-exclamation-circle text-gray-400 text-4xl"></i>
      </div>
      <h3 class="text-2xl font-medium text-gray-700 mb-3">Job Not Found</h3>
      <p class="text-gray-500 mb-6 max-w-md mx-auto">
        The job you're looking for does not exist or has been deleted
      </p>
      <Button
        label="Go Back"
        icon="pi pi-arrow-left"
        @click="goBack"
        class="p-button-primary px-5 py-2"
      />
    </div>

    <!-- Main content -->
    <div
      v-else
      class="container mx-auto px-6 py-8 relative"
      :class="{ 'cancelled-job-container': job && job.status === 'CANCELLED' }"
    >
      <!-- Read-only overlay for cancelled jobs -->
      <div
        v-if="job && job.status === 'CANCELLED'"
        class="absolute inset-0 bg-gray-200 bg-opacity-40 backdrop-filter backdrop-blur-[1px] z-10 pointer-events-none"
      ></div>

      <!-- Cancelled job notice -->
      <div
        v-if="job && job.status === 'CANCELLED'"
        class="mb-6 bg-red-50 border-l-4 border-red-400 p-4 z-20 relative shadow-sm rounded-r-md"
      >
        <div class="flex items-center">
          <i class="pi pi-ban text-red-600 mr-3 text-xl"></i>
          <div>
            <p class="text-red-700 font-medium text-lg">
              This job has been cancelled
            </p>
            <p class="text-red-600 text-sm mt-1">
              This job is no longer active and is in view-only mode. No changes
              can be made.
            </p>
          </div>
        </div>
      </div>

      <!-- Quick action buttons -->
      <div class="flex flex-wrap gap-3 mb-6">
        <!-- Only show Go Back button for cancelled jobs -->
        <template v-if="job && job.status === 'CANCELLED'">
          <Button
            label="Go Back"
            icon="pi pi-arrow-left"
            class="p-button-primary"
            @click="goBack"
          />
          <Button
            label="View Details"
            icon="pi pi-eye"
            class="p-button-outlined p-button-secondary"
            @click="viewCancelledJobDetails"
            v-tooltip="'This job is in read-only mode'"
          />
        </template>

        <!-- Show all action buttons for non-cancelled jobs -->
        <template v-else>
          <Button
            label="Edit Details"
            icon="pi pi-pencil"
            class="p-button-outlined"
            @click="editJob"
          />
          <Button
            v-if="
              jobSchedule &&
              !loadingSchedule &&
              job &&
              job.status !== 'CANCELLED'
            "
            label="Edit Schedule"
            icon="pi pi-calendar"
            class="p-button-outlined"
            @click="editSchedule"
          />
          <Button
            v-else
            label="Create Schedule"
            icon="pi pi-calendar-plus"
            class="p-button-outlined"
            @click="createSchedule"
          />
          <Button
            label="View Applicants"
            icon="pi pi-users"
            class="p-button-outlined"
            @click="viewApplicants"
            :badge="applicantCount.toString()"
            badge-class="p-badge-info"
          />
          <Button
            label="Change Status"
            icon="pi pi-sync"
            class="p-button-outlined"
            @click="openStatusDialog"
          />
          <Button
            label="Manage Training"
            icon="pi pi-book"
            class="p-button-outlined"
            @click="manageTraining"
          />
        </template>
      </div>

      <div class="grid grid-cols-12 gap-6">
        <!-- Left column (Job details) -->
        <div class="col-span-12 lg:col-span-8">
          <!-- Job details card -->
          <Card class="mb-6 shadow-sm">
            <template #header>
              <div class="bg-primary-50 p-4 border-b border-primary-100">
                <h2
                  class="text-xl font-semibold text-primary-800 flex items-center"
                >
                  <i class="pi pi-info-circle text-primary-500 mr-2"></i>
                  Job Information
                </h2>
              </div>
            </template>
            <template #content>
              <div class="p-4 space-y-6">
                <!-- Salary card -->
                <div
                  class="bg-gradient-to-br from-primary-50 to-blue-50 p-5 rounded-xl"
                >
                  <h3
                    class="text-lg font-semibold text-gray-800 mb-4 flex items-center"
                  >
                    <i class="pi pi-money-bill text-primary-500 mr-2"></i>
                    Payment & Benefits
                  </h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p class="text-sm text-gray-500 mb-1">Salary</p>
                      <div class="flex items-center">
                        <span class="text-2xl font-bold text-primary-700"
                          >RM {{ job.salary }}</span
                        >
                        <span class="text-gray-600 ml-2">{{
                          formatSalaryType(job.salaryType)
                        }}</span>
                      </div>
                    </div>
                    <div v-if="job.paymentTerms">
                      <p class="text-sm text-gray-500 mb-1">Payment Terms</p>
                      <p class="text-gray-700">{{ job.paymentTerms }}</p>
                    </div>
                  </div>
                  <div
                    v-if="job.benefits"
                    class="mt-4 pt-4 border-t border-primary-100"
                  >
                    <p class="text-sm text-gray-500 mb-1 font-medium">
                      Benefits
                    </p>
                    <div class="flex flex-wrap gap-2 mt-1">
                      <Tag
                        v-for="(benefit, index) in formatBenefits(job.benefits)"
                        :key="index"
                        :value="benefit"
                        severity="success"
                        icon="pi pi-check"
                      />
                    </div>
                  </div>
                </div>

                <!-- Job scope section -->
                <div>
                  <h3
                    class="text-lg font-semibold text-gray-800 mb-3 flex items-center"
                  >
                    <i class="pi pi-list text-primary-500 mr-2"></i>
                    Job Scope
                  </h3>
                  <div
                    class="whitespace-pre-line text-gray-700 bg-white p-4 rounded-lg border border-gray-200 leading-relaxed"
                  >
                    {{ job.jobScope }}
                  </div>
                </div>

                <!-- Requirements section -->
                <div>
                  <h3
                    class="text-lg font-semibold text-gray-800 mb-3 flex items-center"
                  >
                    <i class="pi pi-check-square text-primary-500 mr-2"></i>
                    Requirements
                  </h3>
                  <div
                    class="whitespace-pre-line text-gray-700 bg-white p-4 rounded-lg border border-gray-200 leading-relaxed"
                  >
                    {{ job.requirements }}
                  </div>
                </div>
              </div>
            </template>
          </Card>

          <!-- Working Schedule Card -->
          <Card class="mb-6 shadow-sm">
            <template #header>
              <div
                class="flex justify-between items-center bg-primary-50 p-4 border-b border-primary-100"
              >
                <h2
                  class="text-xl font-semibold text-primary-800 flex items-center"
                >
                  <i class="pi pi-calendar text-primary-500 mr-2"></i>
                  Working Schedule
                </h2>
                <Button
                  v-if="
                    jobSchedule &&
                    !loadingSchedule &&
                    job &&
                    job.status !== 'CANCELLED'
                  "
                  icon="pi pi-pencil"
                  class="p-button-rounded p-button-text p-button-sm"
                  @click="editSchedule"
                  v-tooltip="'Edit Schedule'"
                />
              </div>
            </template>
            <template #content>
              <div class="p-4">
                <div v-if="loadingSchedule" class="text-center py-4">
                  <ProgressSpinner
                    style="width: 40px; height: 40px"
                    strokeWidth="4"
                    animationDuration=".5s"
                  />
                  <p class="mt-3 text-gray-600">Loading schedule...</p>
                </div>

                <div
                  v-else-if="
                    !jobSchedule ||
                    !jobSchedule.scheduleDates ||
                    jobSchedule.scheduleDates.length === 0
                  "
                  class="text-center py-8"
                >
                  <i class="pi pi-calendar text-6xl text-gray-300 mb-4"></i>
                  <h3 class="text-xl font-medium text-gray-700 mb-2">
                    No Schedule Found
                  </h3>
                  <p class="text-gray-500 mb-4">
                    This job doesn't have a schedule defined yet.
                  </p>
                  <Button
                    v-if="job && job.status !== 'CANCELLED'"
                    label="Create Schedule"
                    icon="pi pi-plus"
                    class="p-button-primary"
                    @click="createSchedule"
                  />
                  <p v-else class="text-red-500 italic">
                    Cannot create schedule for a cancelled job
                  </p>
                </div>

                <div v-else>
                  <!-- Schedule summary -->
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                    <div class="bg-blue-50 p-4 rounded-lg">
                      <h4
                        class="text-sm font-medium text-blue-800 mb-2 flex items-center"
                      >
                        <i class="pi pi-calendar-plus text-blue-600 mr-2"></i>
                        Schedule Period
                      </h4>
                      <p class="font-medium text-blue-900">
                        {{ formatDate(jobSchedule.startDate) }} -
                        {{ formatDate(jobSchedule.endDate) }}
                      </p>
                    </div>
                    <div class="bg-green-50 p-4 rounded-lg">
                      <h4
                        class="text-sm font-medium text-green-800 mb-2 flex items-center"
                      >
                        <i class="pi pi-clock text-green-600 mr-2"></i>
                        Working Hours
                      </h4>
                      <p class="font-medium text-green-900">
                        {{ formatTime(jobSchedule.startTime) }} -
                        {{ formatTime(jobSchedule.endTime) }}
                      </p>
                    </div>
                    <div class="bg-orange-50 p-4 rounded-lg">
                      <h4
                        class="text-sm font-medium text-orange-800 mb-2 flex items-center"
                      >
                        <i class="pi pi-pause text-orange-600 mr-2"></i>
                        Rest Period
                      </h4>
                      <p class="font-medium text-orange-900">
                        {{
                          formatRestTime(jobSchedule.hoursOfRestTime) || 'None'
                        }}
                      </p>
                    </div>
                  </div>

                  <!-- Schedule dates accordion -->
                  <h3
                    class="text-lg font-semibold text-gray-800 mb-3 flex items-center"
                  >
                    <i class="pi pi-calendar text-primary-500 mr-2"></i>
                    Working Dates
                  </h3>

                  <Accordion
                    :activeIndex="job.status === 'CANCELLED' ? 0 : null"
                    class="custom-accordion"
                  >
                    <AccordionTab
                      v-for="(scheduleDate, index) in jobSchedule.scheduleDates"
                      :key="index"
                      :header="formatDateWithDay(scheduleDate.workDate)"
                      :headerClass="'accordion-custom-header'"
                    >
                      <DataTable
                        :value="scheduleDate.jobLocations"
                        class="p-datatable-sm"
                        stripedRows
                        responsiveLayout="scroll"
                      >
                        <Column field="locationName" header="Location">
                          <template #body="slotProps">
                            <div>
                              <div class="font-medium">
                                {{ slotProps.data.locationName }}
                              </div>
                              <div
                                v-if="slotProps.data.address"
                                class="text-sm text-gray-500"
                              >
                                {{ slotProps.data.address }}
                              </div>
                            </div>
                          </template>
                        </Column>
                        <Column
                          field="positionsNeeded"
                          header="Positions"
                          style="width: 120px"
                        >
                          <template #body="slotProps">
                            <Badge
                              :value="slotProps.data.positionsNeeded"
                              severity="info"
                              size="large"
                            />
                          </template>
                        </Column>
                        <Column
                          field="notes"
                          header="Notes"
                          style="width: 150px"
                        >
                          <template #body="slotProps">
                            <span v-if="slotProps.data.notes">{{
                              slotProps.data.notes
                            }}</span>
                            <span v-else class="text-gray-400 italic"
                              >No notes</span
                            >
                          </template>
                        </Column>
                      </DataTable>
                    </AccordionTab>
                  </Accordion>
                </div>
              </div>
            </template>
          </Card>
        </div>

        <!-- Right column (Sidebar info) -->
        <div class="col-span-12 lg:col-span-4">
          <!-- Status Card -->
          <Card class="mb-6 shadow-sm border-l-4" :class="getStatusCardColor()">
            <template #content>
              <div class="p-4">
                <h3 class="text-lg font-semibold text-gray-800 mb-3">
                  Job Status
                </h3>
                <div class="flex items-center">
                  <Tag
                    :value="formatJobStatus(job.status)"
                    :severity="getJobStatusSeverity(job.status)"
                    class="text-base mr-3"
                  />
                  <Button
                    v-if="job.status !== 'CANCELLED'"
                    icon="pi pi-pencil"
                    class="p-button-rounded p-button-text p-button-sm"
                    @click="openStatusDialog"
                    v-tooltip="'Change Status'"
                  />
                </div>

                <p class="mt-3 text-sm text-gray-600">
                  {{ getStatusDescription(job.status) }}
                </p>
              </div>
            </template>
          </Card>

          <!-- Job Stats Card -->
          <Card class="mb-6 shadow-sm">
            <template #header>
              <div class="bg-primary-50 p-4 border-b border-primary-100">
                <h2
                  class="text-xl font-semibold text-primary-800 flex items-center"
                >
                  <i class="pi pi-chart-bar text-primary-500 mr-2"></i>
                  Job Statistics
                </h2>
              </div>
            </template>
            <template #content>
              <div class="p-4">
                <div class="mb-5">
                  <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center text-blue-700">
                      <i class="pi pi-users mr-2"></i>
                      <span>Total Applicants</span>
                    </div>
                    <Badge
                      :value="applicantCount"
                      severity="info"
                      size="large"
                    />
                  </div>
                  <ProgressBar
                    :value="calculateApplicantProgress()"
                    class="h-2"
                    :show-value="false"
                  />
                </div>

                <div class="mb-5">
                  <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center text-green-700">
                      <i class="pi pi-eye mr-2"></i>
                      <span>Job Views</span>
                    </div>
                    <Badge
                      :value="viewStatistics?.totalViewers || 0"
                      severity="success"
                      size="large"
                    />
                  </div>
                  <ProgressBar
                    :value="calculateViewsProgress()"
                    class="h-2"
                    :show-value="false"
                  />
                </div>

                <div class="pt-3 border-t border-gray-200">
                  <div class="flex items-center">
                    <i class="pi pi-calendar text-orange-500 mr-2"></i>
                    <span class="text-gray-700">Created</span>
                    <span class="ml-auto text-gray-600 font-medium">{{
                      formatDate(job.createdAt)
                    }}</span>
                  </div>
                </div>
              </div>
            </template>
          </Card>

          <!-- Project Info Card -->
          <Card class="shadow-sm">
            <template #header>
              <div class="bg-primary-50 p-4 border-b border-primary-100">
                <h2
                  class="text-xl font-semibold text-primary-800 flex items-center"
                >
                  <i class="pi pi-folder text-primary-500 mr-2"></i>
                  Project Information
                </h2>
              </div>
            </template>
            <template #content>
              <div class="p-4">
                <div v-if="loading" class="text-center py-4">
                  <ProgressSpinner
                    style="width: 30px; height: 30px"
                    strokeWidth="4"
                  />
                </div>
                <div v-else class="space-y-3">
                  <div
                    class="flex items-center p-2 rounded-lg hover:bg-gray-50"
                  >
                    <Avatar
                      icon="pi pi-folder"
                      class="bg-blue-100 text-blue-600 mr-3"
                    />
                    <div>
                      <div class="text-sm text-gray-500">Project</div>
                      <div class="font-medium">{{ projectName }}</div>
                    </div>
                  </div>

                  <div
                    class="flex items-center p-2 rounded-lg hover:bg-gray-50"
                  >
                    <Avatar
                      icon="pi pi-briefcase"
                      class="bg-green-100 text-green-600 mr-3"
                    />
                    <div>
                      <div class="text-sm text-gray-500">Total Jobs</div>
                      <div class="font-medium">
                        {{ projectStats?.totalJobs || 0 }}
                      </div>
                    </div>
                  </div>

                  <div
                    class="flex items-center p-2 rounded-lg hover:bg-gray-50"
                  >
                    <Avatar
                      icon="pi pi-map-marker"
                      class="bg-orange-100 text-orange-600 mr-3"
                    />
                    <div>
                      <div class="text-sm text-gray-500">Locations</div>
                      <div class="font-medium">
                        {{ projectStats?.totalUniqueLocations || 0 }}
                      </div>
                    </div>
                  </div>

                  <div class="pt-2 mt-2 border-t border-gray-200">
                    <Button
                      label="View Project Details"
                      icon="pi pi-external-link"
                      class="p-button-text w-full"
                      @click="viewProject"
                    />
                  </div>
                </div>
              </div>
            </template>
          </Card>
        </div>
      </div>
    </div>

    <!-- Status Change Dialog -->
    <Dialog
      v-model:visible="statusDialogVisible"
      header="Change Job Status"
      :style="{ width: '450px' }"
      :modal="true"
      :closable="true"
      class="status-dialog"
    >
      <div class="p-fluid">
        <div class="mb-4">
          <h3 class="text-lg font-semibold mb-1">Current Status</h3>
          <Tag
            :value="formatJobStatus(job?.status)"
            :severity="getJobStatusSeverity(job?.status)"
            class="text-base"
          />
        </div>

        <div class="field">
          <label for="newStatus" class="block text-gray-700 font-medium mb-2">
            New Status <span class="text-red-500">*</span>
          </label>
          <div v-if="availableStatusOptions.length > 0">
            <Dropdown
              id="newStatus"
              v-model="selectedNewStatus"
              :options="availableStatusOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Select new status"
              class="w-full"
            />
            <small class="text-gray-500 mt-1 block">
              This will change the job status and may affect its visibility to
              applicants.
            </small>
          </div>
          <div v-else class="p-4 bg-gray-100 rounded-lg text-center">
            <i class="pi pi-lock text-gray-600 text-2xl mb-2"></i>
            <p class="text-gray-700">
              No status changes are available for jobs with
              <span class="font-medium">{{
                formatJobStatus(job?.status)
              }}</span>
              status.
            </p>
          </div>
        </div>
      </div>

      <template #footer>
        <Button
          label="Cancel"
          icon="pi pi-times"
          class="p-button-text"
          @click="closeStatusDialog"
          :disabled="changingStatus"
        />
        <Button
          label="Change Status"
          icon="pi pi-check"
          class="p-button-primary"
          @click="changeJobStatus"
          :loading="changingStatus"
          :disabled="
            changingStatus ||
            !selectedNewStatus ||
            selectedNewStatus === job?.status ||
            availableStatusOptions.length === 0
          "
        />
      </template>
    </Dialog>

    <!-- New confirmation dialog for cancellation -->
    <Dialog
      v-model:visible="cancelConfirmationVisible"
      header="Warning: Job Cancellation"
      :style="{ width: '500px' }"
      :modal="true"
      :closable="true"
      class="status-dialog cancellation-dialog"
    >
      <div class="p-fluid">
        <div class="text-center mb-4">
          <i class="pi pi-exclamation-triangle text-5xl text-red-500 mb-3"></i>
        </div>

        <div class="mb-4 bg-red-50 p-4 rounded-lg border-left-4 border-red-500">
          <div class="flex align-items-center mb-2">
            <i class="pi pi-exclamation-circle text-red-600 mr-2"></i>
            <h3 class="text-lg font-semibold text-red-700 m-0">
              Important: This action has serious consequences
            </h3>
          </div>
          <ul class="list-disc pl-5 mt-2 mb-0 text-gray-700">
            <li class="mb-2">
              <strong>All applicants</strong> for this job will be automatically
              cancelled
            </li>
            <li class="mb-2">
              Frequently cancelling jobs will
              <strong>lower your recruiter reputation</strong>
            </li>
            <li>This action <strong>cannot be undone</strong></li>
          </ul>
        </div>

        <div class="mb-2">
          <p class="font-medium text-gray-800">
            Are you absolutely sure you want to cancel this job?
          </p>
        </div>
      </div>

      <template #footer>
        <Button
          label="No, Keep Job Active"
          icon="pi pi-times"
          class="p-button-text"
          @click="cancelCancellation"
          :disabled="changingStatus"
        />
        <Button
          label="Yes, Cancel Job"
          icon="pi pi-check"
          class="p-button-danger"
          @click="confirmCancellation"
          :loading="changingStatus"
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { format } from 'date-fns';
import jobService from '@/services/job.service';
import projectService from '@/services/project.service';
import axios from 'axios';

// PrimeVue components
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import Badge from 'primevue/badge';
import ProgressSpinner from 'primevue/progressspinner';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown';
import Card from 'primevue/card';
import ProgressBar from 'primevue/progressbar';
import Avatar from 'primevue/avatar';
// Tooltip is globally registered in main.js

const router = useRouter();
const route = useRoute();
const toast = useToast();

// State
const job = ref(null);
const loading = ref(true);
const projectName = ref('');
const projectStats = ref(null);
const jobSchedule = ref(null);
const loadingSchedule = ref(true);
const statusDialogVisible = ref(false);
const selectedNewStatus = ref('');
const changingStatus = ref(false);
const viewStatistics = ref(null);
const loadingViewStats = ref(true);
const applicantCount = ref(0);

// New confirmation dialog for cancellation
const cancelConfirmationVisible = ref(false);
const showCancellationWarning = ref(false);

// Computed property for available status options based on current job status
const availableStatusOptions = computed(() => {
  if (!job.value) return [];

  const currentStatus = job.value.status;

  switch (currentStatus) {
    case 'CANCELLED':
      // Cannot change status from cancelled
      return [];
    case 'FILLED':
      // From FILLED, can go to CLOSED
      return [{ label: 'Closed', value: 'CLOSED' }];
    case 'CLOSED':
      // From CLOSED, can go to OPEN
      return [{ label: 'Open', value: 'OPEN' }];
    case 'OPEN':
      // From OPEN, can go to CLOSED, CANCELLED
      return [
        { label: 'Closed', value: 'CLOSED' },
        { label: 'Cancelled', value: 'CANCELLED' },
      ];
    case 'DRAFT':
      // From DRAFT, can go to OPEN, CANCELLED
      return [
        { label: 'Open', value: 'OPEN' },
        { label: 'Cancelled', value: 'CANCELLED' },
      ];
    default:
      return [];
  }
});

// Format job status for display
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

// Job status indicator
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

// Get status card border color based on job status
const getStatusCardColor = () => {
  if (!job.value) return 'border-gray-300';

  const colorMap = {
    DRAFT: 'border-blue-400',
    OPEN: 'border-green-400',
    CLOSED: 'border-gray-400',
    FILLED: 'border-purple-400',
    CANCELLED: 'border-red-400',
  };

  return colorMap[job.value.status] || 'border-gray-300';
};

// Get status description
const getStatusDescription = (status) => {
  if (!status) return '';

  const descriptions = {
    DRAFT: 'This job is in draft mode and is not visible to applicants.',
    OPEN: 'This job is currently open and accepting applications.',
    CLOSED: 'This job is closed and no longer accepting applications.',
    FILLED: 'This job has been filled with selected applicants.',
    CANCELLED: 'This job has been cancelled and is no longer active.',
  };

  return descriptions[status] || '';
};

// Calculate applicant progress
const calculateApplicantProgress = () => {
  if (!job.value || !applicantCount.value) return 0;
  // Each applicant contributes 1%
  return Math.min(applicantCount.value, 100);
};

// Calculate job views progress (1 view = 1%)
const calculateViewsProgress = () => {
  if (!job.value || !viewStatistics.value) return 0;
  return Math.min(viewStatistics.value.totalViewers || 0, 100);
};

// Format job title type
const formatJobTitleType = (type) => {
  if (!type) return '';
  const typeMap = {
    PROMOTER: 'Promoter',
    SUPERVISOR: 'Supervisor',
    SETUP_CREW: 'Setup Crew',
    MASCOT_CREW: 'Mascot Crew',
    BRAND_AMBASSADOR: 'Brand Ambassador',
    EVENT_CREW: 'Event Crew',
    USHER: 'Usher',
    OTHER: 'Other',
  };
  return typeMap[type] || type;
};

// Get job type background color
const getJobTypeBgColor = (type) => {
  if (!type) return 'bg-gray-500';

  const colorMap = {
    PROMOTER: 'bg-blue-600',
    SUPERVISOR: 'bg-purple-600',
    SETUP_CREW: 'bg-orange-600',
    MASCOT_CREW: 'bg-pink-600',
    BRAND_AMBASSADOR: 'bg-green-600',
    EVENT_CREW: 'bg-indigo-600',
    USHER: 'bg-teal-600',
    OTHER: 'bg-gray-600',
  };

  return colorMap[type] || 'bg-gray-600';
};

// Format salary type
const formatSalaryType = (type) => {
  if (!type) return '';
  const typeMap = {
    PER_HOUR: 'per hour',
    PER_DAY: 'per day',
    PER_EVENT: 'per event',
    FIXED: 'fixed',
    COMMISSION: 'commission-based',
    NEGOTIABLE: 'negotiable',
  };
  return typeMap[type] || type;
};

// Format benefits list
const formatBenefits = (benefits) => {
  if (!benefits) return [];

  // Split by commas, newlines, or semicolons and trim whitespace
  return benefits
    .split(/[,;\n]/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
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

// Format time
const formatTime = (timeString) => {
  if (!timeString) return 'N/A';
  try {
    // Handle HH:MM:SS format from API
    if (typeof timeString === 'string' && timeString.includes(':')) {
      const [hours, minutes] = timeString.split(':');
      const date = new Date();
      date.setHours(parseInt(hours, 10));
      date.setMinutes(parseInt(minutes, 10));
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    }
    // Handle date objects
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch (error) {
    console.error('Error formatting time:', error);
    return timeString || 'Invalid time';
  }
};

// Format rest time
const formatRestTime = (restTime) => {
  if (!restTime) return 'None';

  try {
    // If restTime is already in hours (decimal format from API)
    const hours = Math.floor(restTime);
    const minutes = Math.round((restTime - hours) * 60);

    let result = '';
    if (hours > 0) {
      result += `${hours} hour${hours !== 1 ? 's' : ''}`;
    }
    if (minutes > 0) {
      if (result) result += ' ';
      result += `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }
    return result || 'None';
  } catch (error) {
    console.error('Error formatting rest time:', error);
    return 'Invalid rest time';
  }
};

// Format date with day
const formatDateWithDay = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return format(new Date(dateString), 'dd MMM yyyy, EEEE');
  } catch (error) {
    console.error('Error formatting date with day:', error);
    return 'Invalid date';
  }
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

// Function to handle View Details click for cancelled jobs (just a no-op placeholder)
const viewCancelledJobDetails = () => {
  toast.add({
    severity: 'info',
    summary: 'Cancelled Job',
    detail: 'This job has been cancelled and is in read-only mode',
    life: 3000,
  });
};

// Action handlers
const editJob = () => {
  router.push({
    name: 'EditJob',
    params: { jobId: job.value.id },
    query: { projectId: route.query.projectId },
  });
};

const editSchedule = () => {
  if (jobSchedule.value) {
    const routeConfig = {
      name: 'EditJobSchedule',
      params: {
        jobId: job.value.id,
        scheduleId: jobSchedule.value.id,
      },
    };

    // Add projectId query parameter if it exists
    if (route.query.projectId) {
      routeConfig.query = { projectId: route.query.projectId };
    }

    router.push(routeConfig);
  } else {
    toast.add({
      severity: 'info',
      summary: 'No Schedule',
      detail: 'No schedule found to edit. Please create one first.',
      life: 3000,
    });
  }
};

const createSchedule = () => {
  const routeConfig = {
    name: 'CreateJobSchedule',
    params: { jobId: job.value.id },
  };

  if (route.query.projectId) {
    routeConfig.query = { projectId: route.query.projectId };
  }

  router.push(routeConfig);
};

const viewApplicants = () => {
  router.push({
    name: 'JobApplicants',
    params: { jobId: job.value.id },
    query: { projectId: route.query.projectId },
  });
};

const viewProject = () => {
  if (route.query.projectId) {
    router.push({
      name: 'ProjectDetails',
      params: { projectId: route.query.projectId },
    });
  }
};

const manageTraining = () => {
  router.push({
    name: 'ManageJobTraining',
    params: { jobId: job.value.id },
    query: { projectId: route.query.projectId },
  });
};

// Fetch job data and related information
const fetchJobData = async () => {
  loading.value = true;

  try {
    const jobId = route.params.jobId;
    const response = await jobService.getJobById(jobId);

    if (response.data && response.data.statusCode === 200) {
      job.value = response.data.data;

      // Fetch project information if we have a project ID
      if (job.value.projectId) {
        await fetchProjectInfo(job.value.projectId);
      }
    } else {
      toast.add({
        severity: 'error',
        summary: 'Job Not Found',
        detail: 'The requested job could not be found',
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
  } finally {
    loading.value = false;
  }
};

// Fetch project information
const fetchProjectInfo = async (projectId) => {
  try {
    // Fetch project details using project service
    const response = await projectService.getProjectById(projectId);

    if (response.data && response.data.statusCode === 200) {
      projectName.value = response.data.data.name;

      // Fetch project statistics using project service
      const statsResponse = await projectService.getProjectStatistics(
        projectId
      );

      if (statsResponse.data && statsResponse.data.statusCode === 200) {
        projectStats.value = statsResponse.data.data;
      }
    }
  } catch (error) {
    console.error('Error fetching project info:', error);
  }
};

// Fetch job schedule
const fetchJobSchedule = async () => {
  loadingSchedule.value = true;

  try {
    const jobId = route.params.jobId;
    const response = await jobService.getJobScheduleByJobId(jobId);

    if (response.data && response.data.statusCode === 200) {
      if (response.data.data && response.data.data.length > 0) {
        // API returns an array of schedules, use the first one
        jobSchedule.value = response.data.data[0];
      } else {
        console.log('Job schedule not found or empty array returned');
        jobSchedule.value = null;
      }
    } else {
      console.log('Job schedule not found or empty');
      jobSchedule.value = null;
    }
  } catch (error) {
    console.error('Error fetching job schedule:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'An error occurred while fetching job schedule',
      life: 3000,
    });
    jobSchedule.value = null;
  } finally {
    loadingSchedule.value = false;
  }
};

// Fetch view statistics
const fetchViewStatistics = async () => {
  try {
    const jobId = route.params.jobId;
    const response = await jobService.getJobViewStatistics(jobId);
    if (response.data && response.data.statusCode === 200) {
      viewStatistics.value = response.data.data;
    }
  } catch (error) {
    console.error('Error fetching view statistics:', error);
  } finally {
    loadingViewStats.value = false;
  }
};

// Fetch applicant count
const fetchApplicantCount = async () => {
  try {
    const jobId = route.params.jobId;
    const response = await jobService.getJobApplicantCount(jobId);
    if (response.data && response.data.statusCode === 200) {
      applicantCount.value = response.data.data;
    }
  } catch (error) {
    console.error('Error fetching applicant count:', error);
  }
};

// Format view date
const formatViewDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return format(new Date(dateString), 'dd MMM yyyy, HH:mm');
  } catch (error) {
    console.error('Error formatting view date:', error);
    return dateString;
  }
};

// Initialize component
onMounted(() => {
  fetchJobData();
  fetchJobSchedule();
  fetchViewStatistics();
  fetchApplicantCount();
});

// Status change handlers
const openStatusDialog = () => {
  statusDialogVisible.value = true;

  // Set the selected status to the first available option if there are any
  if (availableStatusOptions.value.length > 0) {
    selectedNewStatus.value = availableStatusOptions.value[0].value;
  } else {
    selectedNewStatus.value = null;
  }
};

const closeStatusDialog = () => {
  statusDialogVisible.value = false;
};

const changeJobStatus = async () => {
  try {
    // If selecting cancelled status, show confirmation dialog first
    if (selectedNewStatus.value === 'CANCELLED') {
      cancelConfirmationVisible.value = true;
      showCancellationWarning.value = true;
      return;
    }

    // Otherwise proceed with status change
    await processStatusChange();
  } catch (error) {
    console.error('Error changing job status:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.response?.data?.message || 'An unexpected error occurred',
      life: 3000,
    });
  }
};

// Process the actual status change after confirmation if needed
const processStatusChange = async () => {
  changingStatus.value = true;
  try {
    const response = await axios.put(
      `http://localhost:8080/api/jobs/${job.value.id}/status`,
      { newStatus: selectedNewStatus.value },
      {
        headers: {
          Authorization: localStorage.getItem('accessToken'),
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data && response.data.statusCode === 200) {
      job.value.status = selectedNewStatus.value;
      toast.add({
        severity: 'success',
        summary: 'Status Updated',
        detail: `Job status changed to ${formatJobStatus(
          selectedNewStatus.value
        )}`,
        life: 3000,
      });
      statusDialogVisible.value = false;
      cancelConfirmationVisible.value = false;
    } else {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: response.data?.message || 'Failed to change job status',
        life: 3000,
      });
    }
  } catch (error) {
    console.error('Error in processStatusChange:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.response?.data?.message || 'An unexpected error occurred',
      life: 3000,
    });
  } finally {
    changingStatus.value = false;
  }
};

// Cancel confirmation handlers
const confirmCancellation = () => {
  processStatusChange();
};

const cancelCancellation = () => {
  cancelConfirmationVisible.value = false;
  showCancellationWarning.value = false;
};
</script>

<style scoped>
.job-details-container {
  background-image: linear-gradient(to bottom, #f9fafb 0%, #f3f4f6 100%);
}

:deep(.p-button) {
  border-radius: 8px;
  font-weight: 500;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}

:deep(.p-button:hover) {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1);
}

:deep(.p-button.p-button-text:hover) {
  background-color: rgba(var(--primary-color-rgb), 0.08) !important;
}

:deep(.p-button .p-badge) {
  font-weight: 600;
  font-size: 0.85rem;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
  margin-top: -2px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Job type tag styling */
.job-type-tag {
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.job-type-tag:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

:deep(.p-tag) {
  border-radius: 6px;
  padding: 0.3rem 0.6rem;
  font-weight: 500;
}

:deep(.p-badge) {
  border-radius: 12px;
  padding: 0.25rem 0.75rem;
  font-weight: 500;
}

:deep(.p-card) {
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
}

:deep(.p-card:hover) {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
}

:deep(.p-card .p-card-content) {
  padding: 0;
}

:deep(.p-progress-bar) {
  height: 0.5rem !important;
  border-radius: 1rem;
  background: #edf2f7;
}

:deep(.p-progress-bar .p-progress-bar-value) {
  border-radius: 1rem;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
  background: #f8fafc;
  color: #475569;
  font-weight: 600;
  padding: 0.75rem 1rem;
}

:deep(.p-datatable .p-datatable-tbody > tr) {
  transition: all 0.2s ease;
}

:deep(.p-datatable .p-datatable-tbody > tr:hover) {
  background-color: #f1f5f9 !important;
}

:deep(
    .p-accordion
      .p-accordion-header:not(.p-disabled).p-highlight
      .p-accordion-header-link
  ) {
  background: #f0f9ff;
  border-color: #bae6fd;
  color: #0369a1;
}

:deep(
    .p-accordion
      .p-accordion-header:not(.p-disabled)
      .p-accordion-header-link:focus
  ) {
  box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.2);
}

:deep(.custom-accordion .p-accordion-tab) {
  margin-bottom: 0.5rem;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

:deep(.accordion-custom-header) {
  font-weight: 500;
}

:deep(.p-avatar) {
  width: 2.5rem;
  height: 2.5rem;
}

:deep(.p-dialog .p-dialog-header) {
  border-bottom: 1px solid #e2e8f0;
  padding: 1.25rem 1.5rem;
}

:deep(.p-dialog .p-dialog-content) {
  padding: 1.5rem;
}

:deep(.p-dialog .p-dialog-footer) {
  border-top: 1px solid #e2e8f0;
  padding: 1.25rem 1.5rem;
}

/* Customize the dropdown itself */
:deep(.status-dialog .p-dropdown) {
  border-radius: 8px;
  border: 1px solid #ced4da !important;
  height: 42px !important;
}

/* Style the dropdown panel */
:deep(.p-dropdown-panel) {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1) !important;
  border-radius: 8px !important;
  overflow: hidden;
  border: none !important;
}

/* Remove inner border from dropdown */
:deep(.p-dropdown-label) {
  border: none !important;
  box-shadow: none !important;
  padding: 0.5rem 0.75rem !important;
  font-size: 0.95rem !important;
}

:deep(.p-dropdown-trigger) {
  border: none !important;
  box-shadow: none !important;
  width: 2.5rem !important;
}

:deep(.p-dropdown .p-component) {
  border: none !important;
  box-shadow: none !important;
}

/* Remove borders from dropdown items */
:deep(.p-dropdown-items-wrapper),
:deep(.p-dropdown-items),
:deep(.p-dropdown-item),
:deep(.p-dropdown-panel .p-dropdown-item),
:deep(.p-dropdown-panel .p-dropdown-items .p-dropdown-item) {
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
}

/* Zero out padding and margins that could create space for borders */
:deep(.p-dropdown-panel .p-dropdown-items) {
  padding: 0 !important;
  margin: 0 !important;
}

:deep(.p-dropdown-panel .p-dropdown-item) {
  padding: 0.75rem 1.25rem !important;
  margin: 0 !important;
  border-radius: 0 !important;
}

/* Style the dropdown item on hover */
:deep(
    .p-dropdown-panel .p-dropdown-item:not(.p-highlight):not(.p-disabled):hover
  ) {
  background-color: #f3f4f6 !important;
  color: #4b5563 !important;
}

/* Style the highlighted dropdown item */
:deep(.p-dropdown-panel .p-dropdown-item.p-highlight) {
  background-color: rgba(var(--primary-color-rgb), 0.1) !important;
  color: var(--primary-color) !important;
  border: none !important;
  box-shadow: none !important;
}

/* Also target the selected item text to ensure no blue highlighting */
:deep(.p-dropdown-item .p-dropdown-item-text) {
  border: none !important;
  outline: none !important;
  background: transparent !important;
}

/* Remove the divider between input and trigger */
:deep(.p-dropdown .p-dropdown-trigger) {
  background-color: transparent !important;
  border-left: none !important;
}

:deep(.p-dropdown-panel .p-dropdown-items .p-dropdown-item) {
  border-bottom: none !important;
}

:deep(.p-dropdown:focus),
:deep(.p-dropdown-item:focus),
:deep(.p-dropdown-items:focus) {
  box-shadow: none !important;
  outline: none !important;
}

/* Add important rule to completely disable outline for any dropdown element */
:deep(.status-dialog *) {
  outline: none !important;
}

/* Override PrimeVue's default focus style for dropdown items */
:deep(.p-dropdown-item),
:deep(.p-dropdown-item:focus),
:deep(.p-dropdown-item.p-highlight),
:deep(.p-dropdown-item.p-highlight:focus) {
  outline: none !important;
  box-shadow: none !important;
  border-color: transparent !important;
}

/* Ensure the dropdown panel itself has no borders */
:deep(.p-dropdown-panel) {
  border: none !important;
}

/* Apply a reset to the dropdown items wrapper */
:deep(.p-dropdown-items-wrapper) {
  border: none !important;
}

/* Make the page responsive on smaller screens */
@media (max-width: 768px) {
  .job-details-container {
    padding-top: 1rem;
  }

  :deep(.p-card) {
    margin-bottom: 1rem;
  }

  :deep(.p-button) {
    margin-bottom: 0.5rem;
  }
}

/* Cancellation Dialog Styling */
:deep(.cancellation-dialog .p-dialog-header) {
  background-color: #fee2e2;
  color: #b91c1c;
  border-bottom: 1px solid #fecaca;
}

:deep(.cancellation-dialog .border-left-4) {
  border-left: 4px solid;
}

:deep(.cancellation-dialog .border-red-500) {
  border-left-color: #ef4444;
}

:deep(.cancellation-dialog .p-dialog-footer) {
  border-top: 1px solid #fecaca;
}

:deep(.cancellation-dialog .p-button-danger) {
  background: #dc2626;
  border-color: #b91c1c;
}

:deep(.cancellation-dialog .p-button-danger:hover) {
  background: #b91c1c;
  border-color: #991b1b;
}

:deep(.cancellation-dialog .text-red-500) {
  color: #ef4444;
}

:deep(.cancellation-dialog .text-red-600) {
  color: #dc2626;
}

:deep(.cancellation-dialog .text-red-700) {
  color: #b91c1c;
}

:deep(.cancellation-dialog .bg-red-50) {
  background-color: #fef2f2;
}

/* Cancelled Job Styling */
.cancelled-job-container {
  position: relative;
}

.cancelled-job-container :deep(.p-card),
.cancelled-job-container :deep(.p-datatable),
.cancelled-job-container :deep(.p-accordion) {
  opacity: 0.9;
  filter: grayscale(20%);
}

.cancelled-job-container :deep(.p-card:hover) {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
  transform: none !important;
}

/* Disable interaction for all buttons in cancelled jobs */
.cancelled-job-container :deep(.p-button:not(.p-button-primary)) {
  pointer-events: none !important;
  opacity: 0.6 !important;
  cursor: not-allowed !important;
  box-shadow: none !important;
}

.cancelled-job-container :deep(.p-button:not(.p-button-primary):hover) {
  background-color: inherit !important;
  border-color: inherit !important;
  transform: none !important;
  box-shadow: none !important;
}

/* Make the job section accordions non-interactive */
.cancelled-job-container :deep(.p-accordion-header-link) {
  pointer-events: none !important;
  cursor: default !important;
}

/* Disable the click effects on all cards and data tables */
.cancelled-job-container :deep(.p-selectable-row),
.cancelled-job-container :deep(.p-datatable-row),
.cancelled-job-container :deep(.clickable) {
  pointer-events: none !important;
  cursor: default !important;
}

/* Disable all pencil edit icons in cancelled jobs */
.cancelled-job-container :deep(.pi-pencil) {
  display: none !important;
}

/* Additional styling for the accordion tabs to indicate they're not expandable */
.cancelled-job-container :deep(.p-accordion-header) {
  opacity: 0.9;
}

.cancelled-job-container :deep(.p-accordion-header-link) {
  background-color: #f8fafc !important;
}

/* Disable any tooltips in cancelled jobs */
.cancelled-job-container :deep([data-pr-tooltip]) {
  pointer-events: none !important;
}
</style>
