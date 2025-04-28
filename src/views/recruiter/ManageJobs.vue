<template>
  <div class="p-6">
    <!-- Add Toast component directly in the template -->
    <Toast position="top-right" />

    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-2">Manage Projects</h1>
      <p class="text-gray-600">Create and manage your recruitment projects</p>
    </div>

    <!-- Guidelines -->
    <div class="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
      <div class="flex">
        <i class="pi pi-info-circle text-blue-500 mr-3 mt-0.5"></i>
        <div>
          <h3 class="font-medium text-blue-800 mb-1">Recruiter Guidelines</h3>
          <ul class="text-blue-700 text-sm list-disc pl-5 space-y-1">
            <li>
              All jobs must be created within a project for better organization
            </li>
            <li>
              First create a project, then click on it to manage jobs within
              that project
            </li>
            <li>You can use the trash bin to view the deleted projects</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex mb-6 gap-3">
      <Button
        label="New Project"
        icon="pi pi-plus"
        class="p-button-primary shadow-sm hover:shadow transition-all"
        @click="showNewProjectDialog = true"
      />
      <Button
        label="Trash Bin"
        icon="pi pi-trash"
        class="p-button-outlined p-button-secondary shadow-sm hover:shadow transition-all"
        @click="showTrashBin = true"
      />
    </div>

    <!-- Projects Section -->
    <div class="bg-white rounded-lg shadow mb-6">
      <div class="p-4 border-b flex justify-between items-center">
        <h2 class="text-lg font-semibold">Your Projects</h2>
        <div class="flex items-center">
          <div class="relative w-64">
            <span
              class="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400"
            >
              <i class="pi pi-search"></i>
            </span>
            <InputText
              v-model="searchQuery"
              placeholder="Search projects..."
              class="pl-12 pr-3 py-2 w-full border border-gray-300 rounded-lg search-input"
            />
          </div>
          <Button
            icon="pi pi-th-large"
            class="p-button-text ml-2"
            :class="{ 'p-button-primary': viewMode === 'grid' }"
            @click="viewMode = 'grid'"
          />
          <Button
            icon="pi pi-list"
            class="p-button-text"
            :class="{ 'p-button-primary': viewMode === 'list' }"
            @click="viewMode = 'list'"
          />
        </div>
      </div>

      <!-- Loading Indicator -->
      <div v-if="loading" class="p-6 flex justify-center">
        <div class="flex flex-col items-center">
          <i class="pi pi-spin pi-spinner text-4xl text-primary-500 mb-3"></i>
          <span class="text-gray-600">Loading projects...</span>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="projects.length === 0" class="p-6 flex justify-center">
        <div class="flex flex-col items-center max-w-md text-center">
          <div
            class="bg-gray-50 rounded-full w-20 h-20 flex items-center justify-center mb-4"
          >
            <i class="pi pi-folder-open text-4xl text-gray-300"></i>
          </div>
          <h3 class="text-lg font-medium text-gray-700 mb-2">
            No projects found
          </h3>
          <p class="text-gray-500 mb-4">
            Get started by creating your first recruitment project
          </p>
          <Button
            label="Create Project"
            icon="pi pi-plus"
            class="p-button-primary"
            @click="showNewProjectDialog = true"
          />
        </div>
      </div>

      <!-- Grid View -->
      <div v-else-if="viewMode === 'grid'" class="p-4">
        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          <!-- Add New Project Card -->
          <div
            class="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center h-64 transition-colors hover:border-primary-500 cursor-pointer hover:bg-primary-50"
            @click="showNewProjectDialog = true"
          >
            <div
              class="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center mb-4"
            >
              <i class="pi pi-plus text-2xl text-primary-500"></i>
            </div>
            <h3 class="font-medium text-lg text-gray-700">
              Create New Project
            </h3>
            <p class="text-gray-500 text-center mt-2">
              Start a new recruitment project
            </p>
          </div>

          <!-- Project Cards -->
          <div
            v-for="project in filteredProjects"
            :key="project.id"
            class="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-64 cursor-pointer transform hover:-translate-y-1"
            @click="viewProjectDetails(project)"
          >
            <div
              class="h-32 bg-gradient-to-r from-primary-500 to-primary-700 relative flex items-center justify-center"
            >
              <div class="text-white text-4xl font-light">
                {{ project.name.charAt(0) }}
              </div>
              <div class="absolute top-0 right-0 m-2">
                <Menu
                  :model="projectMenuItems(project)"
                  :popup="true"
                  :ref="(el) => (projectMenuRefs[project.id] = el)"
                />
                <Button
                  icon="pi pi-ellipsis-v"
                  class="p-button-rounded p-button-text p-button-sm text-white"
                  @click.stop="openProjectMenu($event, project.id)"
                />
              </div>
            </div>
            <div class="p-4">
              <h3 class="font-semibold text-lg mb-1 truncate">
                {{ project.name }}
              </h3>
              <p class="text-gray-500 text-sm mb-3 line-clamp-2">
                <span v-if="project.description">{{
                  project.description
                }}</span>
                <i v-else class="text-gray-400">No description</i>
              </p>
              <div class="flex justify-between items-center">
                <span class="flex items-center gap-1">
                  <i class="pi pi-briefcase text-xs text-primary-500"></i>
                  <span class="text-xs font-medium text-gray-700"
                    >{{ project.jobCount }} Jobs</span
                  >
                </span>
                <span class="flex items-center gap-1 text-xs text-gray-500">
                  <i class="pi pi-calendar text-xs"></i>
                  {{ formatDate(project.createdAt) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- List View -->
      <div v-else-if="viewMode === 'list'" class="p-4">
        <DataTable
          :value="filteredProjects"
          class="p-datatable-sm"
          responsiveLayout="scroll"
          dataKey="id"
          stripedRows
          @row-click="viewProjectDetails"
          tableStyle="min-width: 50rem"
        >
          <Column field="name" header="Project Name">
            <template #body="{ data }">
              <div class="flex items-center">
                <div
                  class="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center mr-3"
                >
                  <span class="text-primary-700 font-medium">{{
                    data.name.charAt(0)
                  }}</span>
                </div>
                <span class="font-medium">{{ data.name }}</span>
              </div>
            </template>
          </Column>
          <Column field="description" header="Description">
            <template #body="{ data }">
              <div class="truncate max-w-xs">
                <span v-if="data.description">{{ data.description }}</span>
                <i v-else class="text-gray-400">No description</i>
              </div>
            </template>
          </Column>
          <Column field="createdAt" header="Created At">
            <template #body="{ data }">
              {{ formatDate(data.createdAt) }}
            </template>
          </Column>
          <Column field="jobCount" header="Jobs">
            <template #body="{ data }">
              <Badge :value="data.jobCount" severity="info" />
            </template>
          </Column>
          <Column header="Actions" style="width: 10rem">
            <template #body="{ data }">
              <div class="flex gap-2">
                <Button
                  icon="pi pi-eye"
                  class="p-button-text p-button-sm"
                  tooltip="View Jobs"
                  @click.stop="viewProjectDetails(data)"
                />
                <Button
                  icon="pi pi-pencil"
                  class="p-button-text p-button-sm"
                  tooltip="Edit Project"
                  @click.stop="editProject(data)"
                />
                <Button
                  icon="pi pi-trash"
                  class="p-button-text p-button-sm p-button-danger"
                  tooltip="Delete Project"
                  @click.stop="confirmDeleteProject(data)"
                />
              </div>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>

    <!-- New Project Dialog -->
    <Dialog
      v-model:visible="showNewProjectDialog"
      :header="newProject.id ? 'Edit Project' : 'Create New Project'"
      :style="{ width: '450px' }"
      modal
      :closable="false"
      class="p-dialog-modern"
    >
      <div class="p-fluid">
        <div class="field mb-4">
          <label for="projectName" class="font-medium mb-2 block"
            >Project Name</label
          >
          <InputText
            id="projectName"
            v-model="newProject.name"
            placeholder="Enter project name"
            :class="{ 'p-invalid': submitted && !newProject.name }"
          />
          <small v-if="submitted && !newProject.name" class="p-error"
            >Project name is required</small
          >
        </div>

        <div class="field mb-4">
          <label for="projectDescription" class="font-medium mb-2 block"
            >Description</label
          >
          <Textarea
            id="projectDescription"
            v-model="newProject.description"
            placeholder="Brief description of the project"
            rows="3"
          />
        </div>
      </div>

      <template #footer>
        <Button
          label="Cancel"
          icon="pi pi-times"
          class="p-button-text"
          @click="cancelNewProject"
        />
        <Button
          :label="newProject.id ? 'Update' : 'Create'"
          icon="pi pi-check"
          class="p-button-primary"
          @click="createProject"
        />
      </template>
    </Dialog>

    <!-- Trash Bin Dialog -->
    <Dialog
      v-model:visible="showTrashBin"
      header="Trash Bin"
      :style="{ width: '900px' }"
      modal
      class="p-dialog-modern"
    >
      <div class="p-3 bg-red-50 border-l-4 border-red-400 text-red-800 mb-4">
        <div class="flex">
          <i class="pi pi-info-circle mr-2 mt-0.5"></i>
          <p>
            Items in trash cannot be restored. You can still view the jobs in
            read-only mode.
          </p>
        </div>
      </div>

      <!-- Loading Indicator for Trash -->
      <div v-if="loading" class="text-center py-8">
        <i class="pi pi-spin pi-spinner text-3xl text-gray-400 mb-3"></i>
        <p class="text-gray-500">Loading deleted projects...</p>
      </div>

      <div v-else-if="deletedProjects.length === 0" class="text-center py-8">
        <div
          class="bg-gray-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4"
        >
          <i class="pi pi-trash text-4xl text-gray-300"></i>
        </div>
        <h3 class="text-lg font-medium text-gray-600 mb-2">
          Trash bin is empty
        </h3>
        <p class="text-gray-500">Deleted projects will appear here</p>
      </div>

      <DataTable
        v-else
        :value="deletedProjects"
        class="p-datatable-sm"
        stripedRows
        tableStyle="min-width: 100%"
      >
        <Column field="name" style="width: 25%">
          <template #header>
            <div class="whitespace-nowrap">Project Name</div>
          </template>
          <template #body="{ data }">
            <div class="font-medium text-gray-700 whitespace-nowrap">
              {{ data.name }}
            </div>
          </template>
        </Column>
        <Column field="description" style="width: 35%">
          <template #header>
            <div class="whitespace-nowrap">Description</div>
          </template>
          <template #body="{ data }">
            <div class="truncate text-gray-600">
              <span v-if="data.description">{{ data.description }}</span>
              <i v-else class="text-gray-400">No description</i>
            </div>
          </template>
        </Column>
        <Column field="createdAt" style="width: 15%">
          <template #header>
            <div class="whitespace-nowrap">Created At</div>
          </template>
          <template #body="{ data }">
            <div class="text-gray-600 whitespace-nowrap">
              <i class="pi pi-calendar text-gray-400 mr-1"></i>
              {{ formatDate(data.createdAt) }}
            </div>
          </template>
        </Column>
        <Column field="deletedAt" style="width: 15%">
          <template #header>
            <div class="whitespace-nowrap">Deleted At</div>
          </template>
          <template #body="{ data }">
            <div class="text-gray-600 whitespace-nowrap">
              <i class="pi pi-trash text-red-400 mr-1"></i>
              {{ formatDate(data.deletedAt || data.deletionDate) }}
            </div>
          </template>
        </Column>
        <Column field="jobCount" style="width: 5%">
          <template #header>
            <div class="whitespace-nowrap">Jobs</div>
          </template>
          <template #body="{ data }">
            <div class="flex justify-center">
              <Badge :value="data.jobCount" severity="danger" />
            </div>
          </template>
        </Column>
        <Column style="width: 5%">
          <template #header>
            <div class="whitespace-nowrap">Actions</div>
          </template>
          <template #body="{ data }">
            <div class="flex justify-center">
              <Button
                icon="pi pi-eye"
                class="p-button-text p-button-sm p-button-rounded"
                tooltip="View Details"
                @click="viewDeletedProjectDetails(data)"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </Dialog>

    <!-- Custom Delete Confirmation Dialog -->
    <ConfirmTrashDialog
      v-model:visible="showDeleteDialog"
      :title="'Move to Trash'"
      :message="deleteDialogMessage"
      @confirm="onConfirmDelete"
      @cancel="onCancelDelete"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { format } from 'date-fns';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

// PrimeVue components
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import Badge from 'primevue/badge';
import Dialog from 'primevue/dialog';
import Textarea from 'primevue/textarea';
import Calendar from 'primevue/calendar';
import Dropdown from 'primevue/dropdown';
import Menu from 'primevue/menu';
import ConfirmDialog from 'primevue/confirmdialog';
import Toast from 'primevue/toast';
import ConfirmTrashDialog from '@/components/shared/ConfirmTrashDialog.vue';

const router = useRouter();
const confirm = useConfirm();
const toast = useToast();
const auth = useAuthStore();

// State
const viewMode = ref('grid');
const searchQuery = ref('');
const showNewProjectDialog = ref(false);
const showTrashBin = ref(false);
const submitted = ref(false);
const projectMenuRefs = ref({});
const loading = ref(false);
const showDeleteDialog = ref(false);
const deleteDialogMessage = ref('');
const projectToDelete = ref(null);

// Add a flag to prevent multiple confirmation dialogs
let isConfirmingDelete = false;

// New project form
const newProject = reactive({
  name: '',
  description: '',
});

// Projects data
const projects = ref([]);
const deletedProjects = ref([]);

// Filtered projects based on search query
const filteredProjects = computed(() => {
  if (!searchQuery.value) return projects.value;

  const query = searchQuery.value.toLowerCase();
  return projects.value.filter(
    (project) =>
      project.name.toLowerCase().includes(query) ||
      project.description.toLowerCase().includes(query)
  );
});

// API Functions
const fetchProjects = async () => {
  try {
    console.log('Fetching projects...');
    loading.value = true;
    const token = localStorage.getItem('accessToken');

    console.log(
      'Using authorization token:',
      token ? 'Token exists' : 'No token'
    );

    const response = await axios.get('http://localhost:8080/api/projects', {
      headers: {
        Authorization: token,
      },
    });

    console.log('Projects API response:', response.data);

    if (response.data && response.data.statusCode === 200) {
      console.log('Successfully fetched projects:', response.data.data);

      // Filter projects - active projects (not deleted)
      projects.value = response.data.data.filter(
        (project) => !project.isDeleted
      );
      // Deleted projects for trash bin
      deletedProjects.value = response.data.data.filter(
        (project) => project.isDeleted
      );

      console.log('Active projects:', projects.value.length);
      console.log('Deleted projects:', deletedProjects.value.length);
    } else {
      console.error('API returned unexpected response:', response.data);
      createToast({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to fetch projects',
        life: 3000,
      });
    }
  } catch (error) {
    console.error('Error fetching projects:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    createToast({
      severity: 'error',
      summary: 'Error',
      detail: 'An error occurred while fetching projects',
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
};

// Methods
const formatDate = (date) => {
  return format(new Date(date), 'dd MMM yyyy');
};

const projectMenuItems = (project) => [
  {
    label: 'View Jobs',
    icon: 'pi pi-eye',
    command: () => viewProjectDetails(project),
  },
  {
    label: 'Edit Project',
    icon: 'pi pi-pencil',
    command: () => editProject(project),
  },
  {
    separator: true,
  },
  {
    label: 'Delete Project',
    icon: 'pi pi-trash',
    class: 'text-red-500',
    command: () => {
      // Only proceed if we're not already showing a confirmation dialog
      if (!isConfirmingDelete) {
        confirmDeleteProject(project);
      }
    },
  },
];

const openProjectMenu = (event, projectId) => {
  projectMenuRefs.value[projectId].toggle(event);
};

const viewProjectDetails = (project) => {
  // Navigate to project details page instead of showing inline
  router.push({
    name: 'ProjectDetails',
    params: { projectId: project.id },
  });
};

const viewDeletedProjectDetails = (project) => {
  // Navigate to project details view-only mode
  router.push({
    name: 'ProjectDetails',
    params: { projectId: project.id },
    query: { readOnly: true, deleted: true },
  });
};

const editProject = async (project) => {
  newProject.name = project.name;
  newProject.description = project.description;
  newProject.id = project.id;
  showNewProjectDialog.value = true;
};

const confirmDeleteProject = (project) => {
  // Prevent multiple confirmation dialogs
  if (isConfirmingDelete) return;

  isConfirmingDelete = true;
  projectToDelete.value = project;
  deleteDialogMessage.value = `Are you sure you want to move the project "${project.name}" to trash? This action cannot be undone.`;
  showDeleteDialog.value = true;
};

const onConfirmDelete = () => {
  if (projectToDelete.value) {
    deleteProject(projectToDelete.value);
  }
};

const onCancelDelete = () => {
  // Reset flag when rejected
  isConfirmingDelete = false;
  projectToDelete.value = null;
};

const deleteProject = async (project) => {
  try {
    const token = localStorage.getItem('accessToken');

    const response = await axios.delete(
      `http://localhost:8080/api/projects/${project.id}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    if (response.data.statusCode === 200) {
      // Refresh the projects list
      await fetchProjects();

      showCustomToast(
        'success',
        'Success',
        `Project "${project.name}" has been moved to trash`
      );
    } else {
      showCustomToast(
        'error',
        'Error',
        response.data.message || 'Failed to delete project'
      );
    }
  } catch (error) {
    console.error('Error deleting project:', error);

    // Extract the specific error message from the response if available
    const errorMessage =
      error.response?.data?.message ||
      'An error occurred while deleting the project';

    showCustomToast('error', 'Error', errorMessage);
  } finally {
    // Reset the flag after deletion process completes
    isConfirmingDelete = false;
  }
};

const createToast = (options) => {
  // Convert old format to new format
  const { severity, summary, detail, life } = options;

  // Add slight delay to ensure dialog is closed
  setTimeout(() => {
    showCustomToast(severity, summary, detail);
  }, 300);
};

const showCustomToast = (type, title, message) => {
  // Force 'success' class by manually constructing element and appending to DOM
  const isErrorWithSuccessMessage =
    type === 'success' &&
    (title === 'Error' || message.includes('successfully'));

  console.log(
    `Showing toast: type=${type}, title=${title}, message=${message}`
  );
  console.log(`isErrorWithSuccessMessage = ${isErrorWithSuccessMessage}`);

  // Always force specific titles to ensure proper display
  if (type === 'success') {
    title = 'Success';
  } else if (type === 'error') {
    title = 'Error';
  } else if (type === 'info') {
    title = 'Information';
  } else if (type === 'warn') {
    title = 'Warning';
  }

  // Use the built-in toast service
  toast.add({
    severity: type,
    summary: title,
    detail: message,
    life: 3000,
  });

  // Set up a mutation observer to fix any incorrectly styled toasts
  setTimeout(() => {
    // Look for toasts with incorrect styling
    const toasts = document.querySelectorAll('.p-toast-message');

    toasts.forEach((toast) => {
      // Find toasts with success messages but error styling
      const toastDetail = toast.querySelector('.p-toast-detail');
      const toastSummary = toast.querySelector('.p-toast-summary');

      if (toastDetail && toastSummary) {
        const detailText = toastDetail.textContent || '';
        const summaryText = toastSummary.textContent || '';

        console.log(
          `Found toast: summary=${summaryText}, detail=${detailText}`
        );

        // If this is a success message with error styling
        if (
          (detailText.includes('successfully') || summaryText === 'Success') &&
          !toast.classList.contains('p-toast-message-success')
        ) {
          console.log('Fixing incorrectly styled success toast');

          // Remove error class
          toast.classList.remove('p-toast-message-error');

          // Add success class
          toast.classList.add('p-toast-message-success');

          // Update icon from error to check
          const icon = toast.querySelector('.p-toast-message-icon');
          if (icon) {
            icon.classList.remove('pi-times-circle');
            icon.classList.add('pi-check-circle');
          }

          // Fix any other styling as needed
          const content = toast.querySelector('.p-toast-message-content');
          if (content) {
            content.style.color = '#065f46';
          }

          console.log('Toast styling fixed');
        }
      }
    });
  }, 100);

  // Log toast display for debugging
  console.log(
    `Toast displayed with: severity=${type}, summary=${title}, detail=${message}`
  );
};

const createProject = async () => {
  submitted.value = true;

  if (!newProject.name) {
    return;
  }

  // Store the project info before clearing the form
  const projectName = newProject.name;
  const isUpdate = !!newProject.id;
  const projectId = newProject.id;

  try {
    let response;
    const token = localStorage.getItem('accessToken');
    console.log(
      'Creating/updating project with token:',
      token ? 'Token exists' : 'No token'
    );

    if (isUpdate) {
      // Update existing project
      console.log('Updating existing project:', projectId);
      response = await axios.put(
        'http://localhost:8080/api/projects',
        {
          id: projectId,
          name: projectName,
          description: newProject.description || '',
        },
        {
          headers: {
            Authorization: token,
            'Content-Type': 'application/json',
          },
        }
      );
    } else {
      // Create new project
      console.log('Creating new project:', projectName);
      response = await axios.post(
        'http://localhost:8080/api/projects',
        {
          name: projectName,
          description: newProject.description || '',
        },
        {
          headers: {
            Authorization: token,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Debug: Log the exact response
    console.log('API full response:', response);
    console.log('API response data:', response.data);
    console.log('API response status:', response.status);
    console.log('API response statusCode:', response.data?.statusCode);
    console.log('API response message:', response.data?.message);

    // Clear form and close dialog first to ensure UI responsiveness
    resetNewProjectForm();
    submitted.value = false;
    showNewProjectDialog.value = false;

    // Then handle the response data
    if (
      response.data &&
      (response.data.statusCode === 200 || response.data.statusCode === 201)
    ) {
      console.log('Project saved successfully, refreshing list');

      // Ensure we trigger a fresh reload of projects
      try {
        loading.value = true;
        await fetchProjects();
        console.log('Project list refreshed successfully');
      } catch (refreshError) {
        console.error('Error refreshing project list:', refreshError);
      } finally {
        loading.value = false;
      }

      // Use our custom toast function
      const successMessage = isUpdate
        ? `Project "${projectName}" has been updated successfully`
        : `Project "${projectName}" has been created successfully`;

      showCustomToast('success', 'Success', successMessage);
    } else {
      console.error('API returned non-200 status code:', response.data);

      showCustomToast(
        'error',
        'Error',
        response.data.message || 'Failed to save project'
      );
    }
  } catch (error) {
    console.error('Error saving project:', error);
    // Reset form and close dialog even on error
    resetNewProjectForm();
    submitted.value = false;
    showNewProjectDialog.value = false;

    showCustomToast(
      'error',
      'Error',
      'An error occurred while saving the project'
    );
  }
};

const cancelNewProject = () => {
  showNewProjectDialog.value = false;
  resetNewProjectForm();
  submitted.value = false;
};

const resetNewProjectForm = () => {
  newProject.id = null;
  newProject.name = '';
  newProject.description = '';
};

onMounted(async () => {
  await fetchProjects();
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Modern Dialog styling */
:deep(.p-dialog-modern) {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

:deep(.p-dialog-modern .p-dialog-header) {
  background: #f8fafc;
  border-bottom: 1px solid #f1f5f9;
  padding: 1.25rem 1.5rem;
}

:deep(.p-dialog-modern .p-dialog-content) {
  padding: 1.5rem;
}

:deep(.p-dialog-modern .p-dialog-footer) {
  border-top: 1px solid #f1f5f9;
  padding: 1rem 1.5rem;
}

/* Enhanced button styling */
:deep(.p-button) {
  border-radius: 8px;
  font-weight: 500;
}

:deep(.p-inputtext, .p-dropdown, .p-multiselect, .p-calendar, .p-textarea) {
  border-radius: 8px;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
  background: #f8fafc;
  color: #475569;
  font-weight: 600;
}

/* Fix Toast styling */
:deep(.p-toast) {
  opacity: 1 !important;
}

:deep(.p-toast .p-toast-message) {
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border-width: 0;
  margin-bottom: 1rem;
}

:deep(.p-toast .p-toast-message.p-toast-message-success) {
  background-color: #ecfdf5;
  border-left: 6px solid #10b981;
  color: #065f46;
}

:deep(.p-toast .p-toast-message.p-toast-message-info) {
  background-color: #eff6ff;
  border-left: 6px solid #3b82f6;
  color: #1e40af;
}

:deep(.p-toast .p-toast-message.p-toast-message-warn) {
  background-color: #fffbeb;
  border-left: 6px solid #f59e0b;
  color: #92400e;
}

:deep(.p-toast .p-toast-message.p-toast-message-error) {
  background-color: #fef2f2;
  border-left: 6px solid #ef4444;
  color: #991b1b;
}

:deep(.p-toast .p-toast-message .p-toast-message-content .p-toast-summary) {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

:deep(.p-toast .p-toast-message .p-toast-message-content .p-toast-detail) {
  margin: 0;
  font-size: 0.875rem;
}

:deep(.p-toast .p-toast-icon-close) {
  color: inherit;
  opacity: 0.7;
}

:deep(.p-toast .p-toast-icon-close:hover) {
  opacity: 1;
}
</style>

<style>
/* Override PrimeVue InputText component styling */
.search-input.p-inputtext {
  padding-left: 2.5rem !important;
}
</style>
