<template>
  <div class="p-6">
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
              class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400"
            >
              <i class="pi pi-search"></i>
            </span>
            <InputText
              v-model="searchQuery"
              placeholder="    Search projects..."
              class="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-lg"
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

      <!-- Grid View -->
      <div v-if="viewMode === 'grid'" class="p-4">
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
                {{ project.description }}
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
      <div v-if="viewMode === 'list'" class="p-4">
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
              <div class="truncate max-w-xs">{{ data.description }}</div>
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
      header="Create New Project"
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
          label="Create"
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
          <p>Items in trash cannot be restored.</p>
        </div>
      </div>

      <div v-if="deletedProjects.length === 0" class="text-center py-8">
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
              {{ data.description }}
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
              {{ formatDate(data.deletedAt) }}
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

    <!-- Delete Confirmation Dialog -->
    <ConfirmDialog></ConfirmDialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { format } from 'date-fns';

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

const router = useRouter();
const confirm = useConfirm();
const toast = useToast();

// State
const viewMode = ref('grid');
const searchQuery = ref('');
const showNewProjectDialog = ref(false);
const showTrashBin = ref(false);
const submitted = ref(false);
const projectMenuRefs = ref({});

// New project form
const newProject = reactive({
  name: '',
  description: '',
});

// Mock data for projects
const projects = ref([
  {
    id: 1,
    name: 'Summer Sales Campaign',
    description:
      'Promotional events for our summer product line across major malls',
    createdAt: new Date(2024, 3, 15), // April 15, 2024
    jobCount: 3,
    jobs: [
      {
        id: 101,
        title: 'Dry Promoter',
        location: 'MITC Melaka Outlet',
        salary: 'RM 95/day',
        dateRange: '02 May - 03 May 2024',
        status: 'active',
        applicantsCount: 5,
      },
      {
        id: 102,
        title: 'Event Assistant',
        location: 'Kuala Lumpur City Centre',
        salary: 'RM 100/day',
        dateRange: '10 May - 12 May 2024',
        status: 'draft',
        applicantsCount: 0,
      },
      {
        id: 103,
        title: 'Product Demonstrator',
        location: 'Penang Gurney Plaza',
        salary: 'RM 110/day',
        dateRange: '15 May - 16 May 2024',
        status: 'active',
        applicantsCount: 3,
      },
    ],
  },
  {
    id: 2,
    name: 'Tech Expo 2024',
    description:
      'Annual technology exhibition with product showcases and demonstrations',
    createdAt: new Date(2024, 3, 10), // April 10, 2024
    jobCount: 2,
    jobs: [
      {
        id: 201,
        title: 'Tech Product Demonstrator',
        location: 'Kuala Lumpur Convention Centre',
        salary: 'RM 120/day',
        dateRange: '15 Jun - 18 Jun 2024',
        status: 'draft',
        applicantsCount: 0,
      },
      {
        id: 202,
        title: 'Registration Assistant',
        location: 'Kuala Lumpur Convention Centre',
        salary: 'RM 90/day',
        dateRange: '15 Jun - 18 Jun 2024',
        status: 'draft',
        applicantsCount: 0,
      },
    ],
  },
  {
    id: 3,
    name: 'Food Festival',
    description: 'Food sampling and promotion for the annual food festival',
    createdAt: new Date(2024, 2, 20), // March 20, 2024
    jobCount: 5,
    jobs: [],
  },
]);

// Deleted projects for trash bin
const deletedProjects = ref([
  {
    id: 4,
    name: 'Fashion Week 2024',
    description:
      'Runway models and fashion event staff for the annual fashion week',
    createdAt: new Date(2024, 1, 15), // February 15, 2024
    deletedAt: new Date(2024, 3, 5), // April 5, 2024
    jobCount: 4,
    jobs: [
      {
        id: 301,
        title: 'Fashion Assistant',
        location: 'Pavilion Shopping Mall',
        salary: 'RM 150/day',
        dateRange: '05 Mar - 12 Mar 2024',
        status: 'completed',
        applicantsCount: 8,
      },
    ],
  },
]);

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
    command: () => confirmDeleteProject(project),
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

const editProject = (project) => {
  // For now we'll just show a toast since the edit functionality isn't implemented
  toast.add({
    severity: 'info',
    summary: 'Edit Project',
    detail: `Editing project: ${project.name}`,
    life: 3000,
  });
};

const confirmDeleteProject = (project) => {
  confirm.require({
    message: `Are you sure you want to move the project "${project.name}" to trash? You can restore it later from the trash bin.`,
    header: 'Move to Trash',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: () => deleteProject(project),
    reject: () => {
      // No action on reject
    },
  });
};

const deleteProject = (project) => {
  // Move the project to deleted projects
  const deletedProject = { ...project, deletedAt: new Date() };
  deletedProjects.value.unshift(deletedProject);

  // Remove from active projects
  projects.value = projects.value.filter((p) => p.id !== project.id);

  toast.add({
    severity: 'success',
    summary: 'Project Moved to Trash',
    detail: `Project "${project.name}" has been moved to trash`,
    life: 3000,
  });
};

const getDaysRemaining = (deletedDate) => {
  const deleteDate = new Date(deletedDate);
  const expiryDate = new Date(deleteDate);
  expiryDate.setDate(expiryDate.getDate() + 30); // 30 days retention policy

  const today = new Date();
  const diffTime = expiryDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays > 0 ? diffDays : 0;
};

const createProject = () => {
  submitted.value = true;

  if (!newProject.name) {
    return;
  }

  // Here you would typically call an API to create the project
  const project = {
    id: Date.now(), // Temporary ID for mock data
    name: newProject.name,
    description: newProject.description || 'No description provided',
    createdAt: new Date(),
    jobCount: 0,
    jobs: [],
  };

  projects.value.unshift(project);
  showNewProjectDialog.value = false;
  resetNewProjectForm();
  submitted.value = false;

  toast.add({
    severity: 'success',
    summary: 'Project Created',
    detail: `Project "${project.name}" has been created`,
    life: 3000,
  });
};

const cancelNewProject = () => {
  showNewProjectDialog.value = false;
  resetNewProjectForm();
  submitted.value = false;
};

const resetNewProjectForm = () => {
  newProject.name = '';
  newProject.description = '';
};

onMounted(() => {
  // Here you would typically fetch projects from an API
  console.log('ManageJobs component mounted');
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
</style>
