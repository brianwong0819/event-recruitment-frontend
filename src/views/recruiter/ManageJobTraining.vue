<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- Header with back button -->
    <div class="mb-6">
      <div class="flex items-center">
        <Button
          icon="pi pi-arrow-left"
          class="p-button-text p-button-rounded mr-2"
          @click="goBack"
        />
        <div>
          <h1 class="text-2xl font-bold text-gray-900 mb-1">
            Training Management
          </h1>
          <div class="flex items-center text-gray-600">
            <i class="pi pi-briefcase text-primary-500 mr-2"></i>
            <span>{{ job?.title || 'Loading job details...' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="text-center py-8">
      <ProgressSpinner
        style="width: 50px; height: 50px"
        strokeWidth="8"
        fill="var(--surface-ground)"
        animationDuration=".5s"
      />
      <p class="mt-4 text-gray-600">Loading training data...</p>
    </div>

    <!-- Job not found state -->
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

    <!-- Main content -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left column (Training Materials) -->
      <div class="col-span-1">
        <Card class="mb-6 shadow-sm">
          <template #header>
            <div class="bg-primary-50 p-4 border-b border-primary-100">
              <h2
                class="text-xl font-semibold text-primary-800 flex items-center"
              >
                <i class="pi pi-book text-primary-500 mr-2"></i>
                Training Materials
              </h2>
            </div>
          </template>
          <template #content>
            <div class="p-4 space-y-6">
              <!-- Training status toggle -->
              <div
                class="bg-blue-50 p-4 rounded-lg flex justify-between items-center"
              >
                <div>
                  <h3 class="font-medium text-blue-700">Training Status</h3>
                  <p class="text-sm text-blue-600">
                    {{
                      trainingEnabled
                        ? 'Enabled for all hired candidates'
                        : 'Disabled'
                    }}
                  </p>
                </div>
                <InputSwitch
                  v-model="trainingEnabled"
                  @change="toggleTrainingStatus"
                  :disabled="updateStatusLoading || !trainingMaterial"
                />
              </div>

              <!-- Notice about one material allowed -->
              <Message severity="info" :closable="false">
                <span>
                  Only one training material is allowed per job. To replace it,
                  delete the existing material first.
                </span>
              </Message>

              <!-- PDF upload section -->
              <div>
                <h3
                  class="text-lg font-semibold text-gray-800 mb-3 flex items-center justify-between"
                >
                  <span>Training Material</span>
                  <div v-if="materialsLoading" class="flex items-center">
                    <i class="pi pi-spin pi-spinner text-primary-500 mr-2"></i>
                    <span class="text-sm font-normal text-gray-600"
                      >Loading...</span
                    >
                  </div>
                </h3>

                <!-- When no material is uploaded -->
                <div
                  v-if="!trainingMaterial"
                  class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center"
                >
                  <i class="pi pi-cloud-upload text-gray-400 text-4xl mb-3"></i>
                  <h4 class="text-gray-700 font-medium mb-2">
                    No material uploaded
                  </h4>
                  <p class="text-gray-500 text-sm mb-4">
                    Upload a PDF training document that will be available to all
                    hired candidates
                  </p>
                  <div class="flex flex-col gap-3">
                    <div class="w-full">
                      <label
                        for="description"
                        class="block text-left text-sm font-medium text-gray-700 mb-1"
                      >
                        Description
                      </label>
                      <Textarea
                        id="description"
                        v-model="materialDescription"
                        rows="2"
                        class="w-full p-inputtext"
                        placeholder="Add a description for this training material"
                      />
                    </div>
                    <div class="flex justify-center">
                      <Button
                        label="Upload Training Material"
                        icon="pi pi-upload"
                        class="p-button-primary"
                        @click="triggerFileInput"
                        :disabled="uploading"
                      />
                      <input
                        type="file"
                        ref="fileInput"
                        style="display: none"
                        accept=".pdf"
                        @change="handleFileUpload"
                      />
                    </div>
                  </div>
                </div>

                <!-- When material is uploaded -->
                <div v-else class="border rounded-lg">
                  <div class="p-4 border-b bg-gray-50">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center">
                        <i class="pi pi-file-pdf text-red-500 text-xl mr-3"></i>
                        <div>
                          <h4 class="font-medium text-gray-800">
                            {{ trainingMaterial.fileName }}
                          </h4>
                          <p class="text-sm text-gray-500">
                            {{ formatFileSize(trainingMaterial.fileSize) }} •
                            Uploaded
                            {{ formatDate(trainingMaterial.uploadedAt) }}
                          </p>
                        </div>
                      </div>
                      <Button
                        icon="pi pi-trash"
                        class="p-button-rounded p-button-danger p-button-text"
                        @click="confirmDeleteMaterial"
                        :disabled="uploading || updateStatusLoading"
                        v-tooltip="'Delete Material'"
                      />
                    </div>
                  </div>
                  <div class="p-4">
                    <h5 class="font-medium text-sm text-gray-700 mb-2">
                      Description:
                    </h5>
                    <div v-if="isEditingDescription" class="mb-3">
                      <Textarea
                        v-model="materialDescription"
                        rows="3"
                        class="w-full p-inputtext"
                      />
                      <div class="flex justify-end gap-2 mt-2">
                        <Button
                          label="Cancel"
                          icon="pi pi-times"
                          class="p-button-text p-button-sm"
                          @click="cancelEditDescription"
                        />
                        <Button
                          label="Save"
                          icon="pi pi-check"
                          class="p-button-sm"
                          @click="updateMaterialDescription"
                          :loading="updatingDescription"
                        />
                      </div>
                    </div>
                    <div v-else class="flex items-start justify-between mb-3">
                      <p class="text-gray-600 whitespace-pre-line">
                        {{
                          trainingMaterial.description ||
                          'No description provided'
                        }}
                      </p>
                      <Button
                        icon="pi pi-pencil"
                        class="p-button-rounded p-button-text p-button-sm ml-2 flex-shrink-0"
                        @click="editDescription"
                        v-tooltip="'Edit Description'"
                      />
                    </div>
                    <div class="flex gap-2 mt-4">
                      <Button
                        label="Download"
                        icon="pi pi-download"
                        class="p-button-outlined p-button-secondary w-full"
                        @click="downloadMaterial"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </Card>
      </div>

      <!-- Right column (Candidate Training Status) -->
      <div class="col-span-2">
        <Card class="shadow-sm">
          <template #header>
            <div class="bg-primary-50 p-4 border-b border-primary-100">
              <h2
                class="text-xl font-semibold text-primary-800 flex items-center"
              >
                <i class="pi pi-users text-primary-500 mr-2"></i>
                Candidate Training Status
              </h2>
            </div>
          </template>
          <template #content>
            <div class="p-4">
              <!-- Search and filter -->
              <div class="mb-4 flex flex-col sm:flex-row gap-3 items-center">
                <div class="flex-1">
                  <InputText
                    v-model="filters.search"
                    placeholder="Search candidates"
                    class="w-full"
                  />
                </div>
                <div class="sm:w-[220px]">
                  <Dropdown
                    v-model="filters.status"
                    :options="trainingStatusOptions"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="All statuses"
                    class="w-full"
                  />
                </div>
              </div>

              <!-- No candidates message -->
              <div
                v-if="hiredCandidates.length === 0"
                class="text-center py-10"
              >
                <div
                  class="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4"
                >
                  <i class="pi pi-users text-gray-400 text-3xl"></i>
                </div>
                <h3 class="text-xl font-medium text-gray-700 mb-2">
                  No Hired Candidates
                </h3>
                <p class="text-gray-500">
                  There are no hired candidates for this job yet
                </p>
              </div>

              <!-- Candidates table -->
              <DataTable
                v-else
                :value="filteredCandidates"
                :rowHover="true"
                stripedRows
                paginator
                :rows="10"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
                currentPageReportTemplate="{first} to {last} of {totalRecords} candidates"
                responsiveLayout="scroll"
                class="p-datatable-sm"
              >
                <!-- Candidate column -->
                <Column header="Candidate" class="w-1/3">
                  <template #header>
                    <span class="whitespace-nowrap">Candidate</span>
                  </template>
                  <template #body="{ data }">
                    <div class="flex items-center">
                      <div>
                        <div
                          class="font-medium whitespace-nowrap overflow-hidden text-ellipsis"
                        >
                          {{ data.name }}
                        </div>
                        <div class="text-sm text-gray-500">
                          {{ data.email }}
                        </div>
                      </div>
                    </div>
                  </template>
                </Column>

                <!-- Training status column -->
                <Column field="trainingStatus" class="w-1/5">
                  <template #header>
                    <span class="whitespace-nowrap">Training Status</span>
                  </template>
                  <template #body="{ data }">
                    <Tag
                      :value="formatTrainingStatus(data.trainingStatus)"
                      :severity="getTrainingStatusSeverity(data.trainingStatus)"
                    />
                  </template>
                </Column>

                <!-- Last viewed column -->
                <Column style="width: 135px">
                  <template #header>
                    <span class="whitespace-nowrap">Last Viewed</span>
                  </template>
                  <template #body="{ data }">
                    <div v-if="data.lastViewed">
                      {{ formatDate(data.lastViewed) }}
                    </div>
                    <div v-else class="text-gray-400">Never</div>
                  </template>
                </Column>

                <!-- Completion date column -->
                <Column style="width: 135px">
                  <template #header>
                    <span class="whitespace-nowrap">Completion Date</span>
                  </template>
                  <template #body="{ data }">
                    <div v-if="data.completionDate">
                      {{ formatDate(data.completionDate) }}
                    </div>
                    <div v-else class="text-gray-400">-</div>
                  </template>
                </Column>

                <!-- Actions column -->
                <Column style="width: 80px">
                  <template #header>
                    <span class="whitespace-nowrap"></span>
                  </template>
                  <template #body="{ data }">
                    <Button
                      icon="pi pi-user"
                      class="p-button-rounded p-button-text p-button-sm"
                      @click="viewCandidateProfile(data)"
                      v-tooltip="'View Profile'"
                    />
                  </template>
                </Column>
              </DataTable>
            </div>
          </template>
        </Card>
      </div>
    </div>

    <!-- Candidate Profile Dialog -->
    <Dialog
      v-model:visible="profileDialogVisible"
      :modal="true"
      header="Candidate Profile"
      :style="{ width: '600px' }"
    >
      <div v-if="selectedCandidate" class="p-4">
        <div class="flex flex-col items-center mb-5">
          <Avatar
            :image="selectedCandidate.profilePictureUrl"
            size="xlarge"
            shape="circle"
            class="mb-3 border-4 border-white shadow-lg"
          />
          <h2 class="text-xl font-bold text-gray-800">
            {{ selectedCandidate.name }}
          </h2>
          <p class="text-gray-600">{{ selectedCandidate.email }}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          <div class="bg-blue-50 p-3 rounded-lg">
            <div class="text-sm text-blue-700 mb-1">Phone Number</div>
            <div class="font-medium">
              {{ selectedCandidate.phone || 'Not provided' }}
            </div>
          </div>
          <div class="bg-green-50 p-3 rounded-lg">
            <div class="text-sm text-green-700 mb-1">Training Status</div>
            <Tag
              :value="formatTrainingStatus(selectedCandidate.trainingStatus)"
              :severity="
                getTrainingStatusSeverity(selectedCandidate.trainingStatus)
              "
            />
          </div>
        </div>

        <div class="bg-gray-50 p-4 rounded-lg mb-4">
          <h3 class="font-medium text-gray-800 mb-3">Training Activity</h3>
          <div class="space-y-3">
            <div v-if="selectedCandidate.lastViewed" class="flex items-start">
              <div class="bg-blue-100 rounded-full p-2 mr-3">
                <i class="pi pi-eye text-blue-700"></i>
              </div>
              <div>
                <div class="font-medium">Last Viewed</div>
                <div class="text-sm text-gray-600">
                  {{ formatDateWithTime(selectedCandidate.lastViewed) }}
                </div>
              </div>
            </div>
            <div
              v-if="selectedCandidate.completionDate"
              class="flex items-start"
            >
              <div class="bg-green-100 rounded-full p-2 mr-3">
                <i class="pi pi-check-circle text-green-700"></i>
              </div>
              <div>
                <div class="font-medium">Completed</div>
                <div class="text-sm text-gray-600">
                  {{ formatDateWithTime(selectedCandidate.completionDate) }}
                </div>
              </div>
            </div>
            <div
              v-if="selectedCandidate.assessmentScore !== undefined"
              class="flex items-start"
            >
              <div class="bg-amber-100 rounded-full p-2 mr-3">
                <i class="pi pi-star text-amber-700"></i>
              </div>
              <div>
                <div class="font-medium">Assessment Score</div>
                <div class="text-sm text-gray-600">
                  {{ selectedCandidate.assessmentScore }}% ({{
                    selectedCandidate.assessmentScore >= 70
                      ? 'Passed'
                      : 'Failed'
                  }})
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dialog>

    <!-- File upload confirmation dialog -->
    <Dialog
      v-model:visible="fileConfirmDialogVisible"
      :modal="true"
      header="Replace Training Document"
      style="width: 450px"
    >
      <div class="p-4">
        <Message severity="warn" :closable="false" class="mb-4">
          <span
            >Replacing this document will affect all candidates with access to
            training.</span
          >
        </Message>
        <p class="mb-3">
          Are you sure you want to replace the current training document?
        </p>
        <p class="text-sm text-gray-600 mb-4">
          New file: <span class="font-medium">{{ pendingFile?.name }}</span>
        </p>
      </div>
      <template #footer>
        <Button
          label="Cancel"
          icon="pi pi-times"
          class="p-button-text"
          @click="cancelFileUpload"
        />
        <Button
          label="Replace"
          icon="pi pi-check"
          class="p-button-primary"
          @click="confirmFileUpload"
          :loading="uploading"
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import { format } from 'date-fns';
import axios from 'axios';

// PrimeVue components
import Button from 'primevue/button';
import Card from 'primevue/card';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import ProgressBar from 'primevue/progressbar';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import Avatar from 'primevue/avatar';
import ProgressSpinner from 'primevue/progressspinner';
import Dialog from 'primevue/dialog';
import Menu from 'primevue/menu';
import Message from 'primevue/message';
import InputSwitch from 'primevue/inputswitch';
import Textarea from 'primevue/textarea';

const router = useRouter();
const route = useRoute();
const toast = useToast();
const confirm = useConfirm();
const fileInput = ref(null);

// State
const job = ref(null);
const loading = ref(true);
const trainingEnabled = ref(false);
const trainingMaterial = ref(null);
const materialsLoading = ref(false);
const hiredCandidates = ref([]);
const profileDialogVisible = ref(false);
const fileConfirmDialogVisible = ref(false);
const selectedCandidate = ref(null);
const pendingFile = ref(null);
const uploading = ref(false);
const materialDescription = ref('');
const updateStatusLoading = ref(false);
const isEditingDescription = ref(false);
const updatingDescription = ref(false);

// Filters
const filters = ref({
  search: '',
  status: '',
});

// Training status options for dropdown
const trainingStatusOptions = [
  { label: 'All statuses', value: '' },
  { label: 'Viewed', value: 'IN_PROGRESS' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Incompleted', value: 'NOT_STARTED' },
];

// Computed filtered candidates
const filteredCandidates = computed(() => {
  let result = [...hiredCandidates.value];

  // Apply search filter (based on candidateName)
  if (filters.value.search) {
    const searchLower = filters.value.search.toLowerCase();
    result = result.filter(
      (candidate) =>
        (candidate.name &&
          candidate.name.toLowerCase().includes(searchLower)) ||
        (candidate.email && candidate.email.toLowerCase().includes(searchLower))
    );
  }

  // Apply status filter with custom logic
  if (filters.value.status) {
    if (filters.value.status === 'IN_PROGRESS') {
      // "Viewed" means lastViewedAt has data but not completed
      result = result.filter(
        (candidate) =>
          candidate.lastViewed && candidate.trainingStatus !== 'COMPLETED'
      );
    } else if (filters.value.status === 'NOT_STARTED') {
      // "Not Started" means no lastViewedAt
      result = result.filter((candidate) => !candidate.lastViewed);
    } else if (filters.value.status === 'COMPLETED') {
      // "Completed" status
      result = result.filter(
        (candidate) => candidate.trainingStatus === 'COMPLETED'
      );
    }
  }

  return result;
});

// Format training status
const formatTrainingStatus = (status) => {
  if (!status) return 'Incompleted';

  const statusMap = {
    NOT_STARTED: 'Incompleted',
    IN_PROGRESS: 'Viewed',
    COMPLETED: 'Completed',
  };

  return statusMap[status] || status;
};

// Get training status severity
const getTrainingStatusSeverity = (status) => {
  if (!status) return 'secondary';

  const severityMap = {
    NOT_STARTED: 'secondary',
    IN_PROGRESS: 'info',
    COMPLETED: 'success',
  };

  return severityMap[status] || 'secondary';
};

// Format date
const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    return format(new Date(dateString), 'dd MMM yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

// Format date with time
const formatDateWithTime = (dateString) => {
  if (!dateString) return '';
  try {
    return format(new Date(dateString), 'dd MMM yyyy, h:mm a');
  } catch (error) {
    console.error('Error formatting date with time:', error);
    return dateString;
  }
};

// Format file size
const formatFileSize = (bytes) => {
  if (!bytes) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Navigation
const goBack = () => {
  if (route.query.projectId) {
    router.push({
      name: 'JobDetails',
      params: { jobId: route.params.jobId },
      query: { projectId: route.query.projectId },
    });
  } else {
    router.push({ name: 'ManageJobs' });
  }
};

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('accessToken') || '';
};

// Upload related methods
const triggerFileInput = () => {
  fileInput.value.click();
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Check if it's a PDF
  if (file.type !== 'application/pdf') {
    toast.add({
      severity: 'error',
      summary: 'Invalid File',
      detail: 'Please upload a PDF document',
      life: 3000,
    });
    return;
  }

  // Upload directly since we're enforcing single material
  uploadFile(file);

  // Reset the input
  event.target.value = '';
};

const uploadFile = async (file) => {
  uploading.value = true;

  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('description', materialDescription.value);

    const response = await axios.post(
      `http://localhost:8080/api/recruiters/jobs/${route.params.jobId}/training-materials`,
      formData,
      {
        headers: {
          Authorization: getAuthToken(),
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (
      response.data &&
      (response.data.statusCode === 200 || response.data.statusCode === 201)
    ) {
      trainingMaterial.value = response.data.data;
      materialDescription.value = response.data.data.description || '';

      toast.add({
        severity: 'success',
        summary: 'Material Uploaded',
        detail: 'Training material has been uploaded successfully',
        life: 3000,
      });

      // Enable training if it was disabled
      if (!trainingEnabled.value) {
        trainingEnabled.value = true;
        await updateTrainingStatus(true);
      }
    } else {
      toast.add({
        severity: 'error',
        summary: 'Upload Failed',
        detail: response.data?.message || 'Failed to upload material',
        life: 3000,
      });
    }
  } catch (error) {
    console.error('Error uploading file:', error);
    toast.add({
      severity: 'error',
      summary: 'Upload Error',
      detail: 'An error occurred while uploading the material',
      life: 3000,
    });
  } finally {
    uploading.value = false;
  }
};

const downloadMaterial = () => {
  if (!trainingMaterial.value?.id) return;

  const downloadUrl = `http://localhost:8080${trainingMaterial.value.fileUrl}`;
  window.open(downloadUrl, '_blank');
};

const confirmDeleteMaterial = () => {
  if (!trainingMaterial.value) return;

  // Use PrimeVue confirmation service
  confirm.require({
    message: 'Are you sure you want to delete this training material?',
    header: 'Delete Confirmation',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: () => {
      deleteMaterial();
    },
  });
};

const deleteMaterial = async () => {
  if (!trainingMaterial.value) return;

  try {
    const response = await axios.delete(
      `http://localhost:8080/api/recruiters/jobs/${route.params.jobId}/training-materials/${trainingMaterial.value.id}`,
      {
        headers: {
          Authorization: getAuthToken(),
        },
      }
    );

    if (
      response.data &&
      (response.data.statusCode === 200 || response.data.statusCode === 201)
    ) {
      trainingMaterial.value = null;
      materialDescription.value = '';

      toast.add({
        severity: 'success',
        summary: 'Material Deleted',
        detail: 'Training material has been deleted successfully',
        life: 3000,
      });

      // If training was enabled, disable it
      if (trainingEnabled.value) {
        trainingEnabled.value = false;
        await updateTrainingStatus(false);
      }
    } else {
      toast.add({
        severity: 'error',
        summary: 'Delete Failed',
        detail: response.data?.message || 'Failed to delete material',
        life: 3000,
      });
    }
  } catch (error) {
    console.error('Error deleting material:', error);
    toast.add({
      severity: 'error',
      summary: 'Delete Error',
      detail: 'An error occurred while deleting the material',
      life: 3000,
    });
  }
};

// Toggle training status
const toggleTrainingStatus = async () => {
  // If enabling and no material exists, show error
  if (trainingEnabled.value && !trainingMaterial.value) {
    trainingEnabled.value = false;
    toast.add({
      severity: 'error',
      summary: 'Training Error',
      detail: 'Please upload a training material before enabling training',
      life: 3000,
    });
    return;
  }

  await updateTrainingStatus(trainingEnabled.value);
};

const updateTrainingStatus = async (status) => {
  if (!trainingMaterial.value) return;

  updateStatusLoading.value = true;

  try {
    const response = await axios.put(
      `http://localhost:8080/api/recruiters/jobs/${route.params.jobId}/training-materials/${trainingMaterial.value.id}/status`,
      { isEnabled: status },
      {
        headers: {
          Authorization: getAuthToken(),
          'Content-Type': 'application/json',
        },
      }
    );

    if (
      response.data &&
      (response.data.statusCode === 200 || response.data.statusCode === 201)
    ) {
      toast.add({
        severity: 'success',
        summary: 'Status Updated',
        detail: `Training has been ${
          status ? 'enabled' : 'disabled'
        } successfully`,
        life: 3000,
      });
    } else {
      trainingEnabled.value = !status; // Revert the toggle
      toast.add({
        severity: 'error',
        summary: 'Update Failed',
        detail: response.data?.message || 'Failed to update training status',
        life: 3000,
      });
    }
  } catch (error) {
    console.error('Error updating training status:', error);
    trainingEnabled.value = !status; // Revert the toggle
    toast.add({
      severity: 'error',
      summary: 'Update Error',
      detail: 'An error occurred while updating training status',
      life: 3000,
    });
  } finally {
    updateStatusLoading.value = false;
  }
};

// View candidate profile
const viewCandidateProfile = (candidate) => {
  router.push({
    name: 'RecruiterViewCandidateProfile',
    params: { candidateId: candidate.id },
  });
};

// Fetch job data
const fetchJobData = async () => {
  loading.value = true;

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

    if (
      response.data &&
      (response.data.statusCode === 200 || response.data.statusCode === 201)
    ) {
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
  } finally {
    loading.value = false;
  }
};

// Fetch training data
const fetchTrainingData = async () => {
  materialsLoading.value = true;

  try {
    const jobId = route.params.jobId;
    const token = getAuthToken();

    const response = await axios.get(
      `http://localhost:8080/api/recruiters/jobs/${jobId}/training-materials`,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    if (
      response.data &&
      (response.data.statusCode === 200 || response.data.statusCode === 201)
    ) {
      // Check if there's any material
      if (response.data.data && response.data.data.length > 0) {
        // Use the first material (only one allowed per job)
        const material = response.data.data[0];
        trainingMaterial.value = material;
        materialDescription.value = material.description || '';
        trainingEnabled.value = material.isEnabled || false;
      } else {
        trainingMaterial.value = null;
        materialDescription.value = '';
        trainingEnabled.value = false;
      }
    }
  } catch (error) {
    console.error('Error fetching training data:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'An error occurred while fetching training data',
      life: 3000,
    });
  } finally {
    materialsLoading.value = false;
  }
};

// Fetch hired candidates
const fetchHiredCandidates = async () => {
  try {
    const jobId = route.params.jobId;
    const token = getAuthToken();

    // Fetch training records from the new endpoint
    const response = await axios.get(
      `http://localhost:8080/api/recruiters/jobs/${jobId}/training-records`,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    if (
      response.data &&
      (response.data.statusCode === 200 || response.data.statusCode === 201)
    ) {
      hiredCandidates.value = response.data.data.map((record) => ({
        id: record.candidateId,
        name: record.candidateName,
        email: record.candidateEmail,
        phone: record.candidatePhone,
        profilePictureUrl: record.profilePictureUrl,
        trainingStatus: record.isCompleted
          ? 'COMPLETED'
          : record.lastViewedAt
          ? 'IN_PROGRESS'
          : 'NOT_STARTED',
        progress: record.trainingProgress || 0,
        lastViewed: record.lastViewedAt,
        completionDate: record.completionDate,
        assessmentScore: record.assessmentScore,
      }));
    }
  } catch (error) {
    console.error('Error fetching training records:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'An error occurred while fetching training records',
      life: 3000,
    });
  }
};

// Edit description
const editDescription = () => {
  materialDescription.value = trainingMaterial.value.description || '';
  isEditingDescription.value = true;
};

const updateMaterialDescription = async () => {
  if (!trainingMaterial.value) return;

  updatingDescription.value = true;

  try {
    const response = await axios.put(
      `http://localhost:8080/api/recruiters/jobs/${route.params.jobId}/training-materials/${trainingMaterial.value.id}`,
      { description: materialDescription.value },
      {
        headers: {
          Authorization: getAuthToken(),
          'Content-Type': 'application/json',
        },
      }
    );

    if (
      response.data &&
      (response.data.statusCode === 200 || response.data.statusCode === 201)
    ) {
      trainingMaterial.value.description = materialDescription.value;
      toast.add({
        severity: 'success',
        summary: 'Description Updated',
        detail: 'Training description has been updated successfully',
        life: 3000,
      });
    } else {
      toast.add({
        severity: 'error',
        summary: 'Update Failed',
        detail:
          response.data?.message || 'Failed to update training description',
        life: 3000,
      });
    }
  } catch (error) {
    console.error('Error updating training description:', error);
    toast.add({
      severity: 'error',
      summary: 'Update Error',
      detail: 'An error occurred while updating training description',
      life: 3000,
    });
  } finally {
    isEditingDescription.value = false;
    updatingDescription.value = false;
  }
};

const cancelEditDescription = () => {
  materialDescription.value = trainingMaterial.value?.description || '';
  isEditingDescription.value = false;
};

// Initialize component
onMounted(() => {
  fetchJobData();
  fetchTrainingData();
  fetchHiredCandidates();
});
</script>

<style scoped>
/* Card styling */
:deep(.p-card) {
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
}

:deep(.p-card:hover) {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
}

/* Button styling */
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

/* Tag styling */
:deep(.p-tag) {
  border-radius: 6px;
  padding: 0.3rem 0.6rem;
  font-weight: 500;
}

/* DataTable styling */
:deep(.p-datatable .p-datatable-thead > tr > th) {
  background: #f8fafc;
  color: #475569;
  font-weight: 600;
  padding: 12px 16px;
}

:deep(.p-datatable .p-datatable-tbody > tr > td) {
  padding: 12px 16px;
}

:deep(.p-datatable .p-datatable-tbody > tr) {
  transition: all 0.2s ease;
}

:deep(.p-datatable .p-datatable-tbody > tr:hover) {
  background-color: #f1f5f9 !important;
}

/* Progress bar styling */
:deep(.p-progressbar) {
  height: 0.5rem !important;
  border-radius: 1rem;
  background: #edf2f7;
}

:deep(.p-progressbar .p-progressbar-value) {
  border-radius: 1rem;
}

/* Dialog styling */
:deep(.p-dialog .p-dialog-header) {
  border-bottom: 1px solid #e2e8f0;
  padding: 1.25rem 1.5rem;
}

:deep(.p-dialog .p-dialog-content) {
  padding: 0;
  height: 100%;
}

:deep(.p-dialog .p-dialog-footer) {
  border-top: 1px solid #e2e8f0;
  padding: 1.25rem 1.5rem;
}

/* Make the page responsive on smaller screens */
@media (max-width: 768px) {
  .p-6 {
    padding: 1rem;
  }
}

/* Dropdown specific styles */
:deep(.p-dropdown) {
  border-radius: 8px;
  border: 1px solid #ced4da;
  height: 42px;
  font-size: 14px;
  display: flex;
  align-items: center;
}

:deep(.p-dropdown-label) {
  border: none !important;
  box-shadow: none !important;
  padding: 0.5rem 0.75rem;
  display: flex;
  align-items: center;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  line-height: 1.5;
  height: 100%;
}

:deep(.p-dropdown-label.p-placeholder) {
  display: flex;
  align-items: center;
  color: #6c757d;
  padding-top: 0;
  padding-bottom: 0;
  height: 100%;
  justify-content: flex-start;
}

:deep(.p-dropdown-trigger) {
  border: none !important;
  box-shadow: none !important;
}

/* Match input field styles */
:deep(.p-inputtext) {
  height: 42px;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.5;
}

:deep(.p-dropdown-panel) {
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
}

:deep(.p-dropdown-items) {
  padding: 0;
}

:deep(.p-dropdown-item) {
  border: none !important;
  padding: 0.75rem 1rem;
}
</style>
