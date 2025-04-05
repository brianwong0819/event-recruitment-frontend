<template>
    <div class="p-6">
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Welcome, {{ userGreeting }}</h1>
        <p class="text-gray-600">Here's what's happening with your job search</p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <!-- Available Jobs Card -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold">Available Jobs</h2>
            <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <i class="pi pi-briefcase text-blue-600"></i>
            </div>
          </div>
          <div class="text-3xl font-bold mb-2">24</div>
          <p class="text-gray-600 text-sm">Jobs matching your profile</p>
        </div>
        
        <!-- Applications Card -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold">Your Applications</h2>
            <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <i class="pi pi-check-square text-green-600"></i>
            </div>
          </div>
          <div class="text-3xl font-bold mb-2">3</div>
          <p class="text-gray-600 text-sm">Active applications</p>
        </div>
        
        <!-- Upcoming Events Card -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold">Upcoming Events</h2>
            <div class="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <i class="pi pi-calendar text-purple-600"></i>
            </div>
          </div>
          <div class="text-3xl font-bold mb-2">1</div>
          <p class="text-gray-600 text-sm">Scheduled in next 7 days</p>
        </div>
      </div>
      
      <!-- Recommended Jobs Section -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold">Recommended for You</h2>
          <Button label="View All Jobs" class="p-button-text" />
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Job Card 1 -->
          <div class="bg-white rounded-lg shadow overflow-hidden">
            <div class="p-5">
              <div class="flex items-start justify-between mb-3">
                <div>
                  <h3 class="font-semibold text-lg mb-1">Event Promoter</h3>
                  <p class="text-gray-600 text-sm">Brand X Marketing • Kuala Lumpur</p>
                </div>
                <Badge value="New" severity="success" />
              </div>
              <div class="flex items-center text-sm text-gray-600 mb-4">
                <i class="pi pi-dollar mr-2"></i>
                <span class="mr-4">RM 80/day</span>
                <i class="pi pi-calendar mr-2"></i>
                <span>15-16 Apr 2025</span>
              </div>
              <p class="text-gray-700 text-sm mb-4">
                Promote our products at the Tech Expo. Engage with visitors and demonstrate product features.
              </p>
              <div class="flex justify-between items-center">
                <div>
                  <Tag value="Sales" class="mr-2" />
                  <Tag value="Promotion" />
                </div>
                <Button label="Apply" class="p-button-sm" />
              </div>
            </div>
          </div>
          
          <!-- Job Card 2 -->
          <div class="bg-white rounded-lg shadow overflow-hidden">
            <div class="p-5">
              <div class="flex items-start justify-between mb-3">
                <div>
                  <h3 class="font-semibold text-lg mb-1">Event Assistant</h3>
                  <p class="text-gray-600 text-sm">EventPro Solutions • Petaling Jaya</p>
                </div>
                <Badge value="Popular" severity="warning" />
              </div>
              <div class="flex items-center text-sm text-gray-600 mb-4">
                <i class="pi pi-dollar mr-2"></i>
                <span class="mr-4">RM 100/day</span>
                <i class="pi pi-calendar mr-2"></i>
                <span>20-22 Apr 2025</span>
              </div>
              <p class="text-gray-700 text-sm mb-4">
                Assist with event setup, registration, and general support for the Annual Business Summit.
              </p>
              <div class="flex justify-between items-center">
                <div>
                  <Tag value="Customer Service" class="mr-2" />
                  <Tag value="Registration" />
                </div>
                <Button label="Apply" class="p-button-sm" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Complete Your Profile Section -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-start justify-between mb-4">
          <div>
            <h2 class="text-xl font-semibold mb-1">Complete Your Profile</h2>
            <p class="text-gray-600">Improve your chances of getting hired by completing your profile</p>
          </div>
          <ProgressBar :value="profileCompletionPercentage" :style="{ width: '100px' }" />
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Upload Photo Item -->
          <div class="flex items-center p-4 border rounded-lg">
            <div class="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-4">
              <i class="pi pi-camera text-orange-600"></i>
            </div>
            <div class="flex-grow">
              <h3 class="font-medium">Upload your profile photo</h3>
              <p class="text-sm text-gray-600">A professional photo helps recruiters recognize you</p>
            </div>
            <Button icon="pi pi-plus" class="p-button-rounded p-button-outlined" />
          </div>
          
          <!-- Add Work Experience Item -->
          <div class="flex items-center p-4 border rounded-lg">
            <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-4">
              <i class="pi pi-briefcase text-green-600"></i>
            </div>
            <div class="flex-grow">
              <h3 class="font-medium">Add work experience</h3>
              <p class="text-sm text-gray-600">Showcase your past event work to stand out</p>
            </div>
            <Button icon="pi pi-plus" class="p-button-rounded p-button-outlined" />
          </div>
          
          <!-- Set Availability Item -->
          <div class="flex items-center p-4 border rounded-lg">
            <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
              <i class="pi pi-calendar text-blue-600"></i>
            </div>
            <div class="flex-grow">
              <h3 class="font-medium">Set your availability</h3>
              <p class="text-sm text-gray-600">Let recruiters know when you're available to work</p>
            </div>
            <Button icon="pi pi-plus" class="p-button-rounded p-button-outlined" />
          </div>
          
          <!-- Add Skills Item -->
          <div class="flex items-center p-4 border rounded-lg">
            <div class="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-4">
              <i class="pi pi-star text-purple-600"></i>
            </div>
            <div class="flex-grow">
              <h3 class="font-medium">Add your skills</h3>
              <p class="text-sm text-gray-600">Highlight what makes you perfect for event roles</p>
            </div>
            <Button icon="pi pi-plus" class="p-button-rounded p-button-outlined" />
          </div>
        </div>
      </div>
      
      <!-- Upcoming Trainings Section -->
      <div class="mt-8">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold">Upcoming Trainings</h2>
          <Button label="View All" class="p-button-text" />
        </div>
        
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div class="p-5">
            <div class="flex items-start justify-between mb-3">
              <div>
                <h3 class="font-semibold text-lg mb-1">Product Knowledge Training</h3>
                <p class="text-gray-600 text-sm">Required for Tech Expo Event</p>
              </div>
              <Badge value="Required" severity="danger" />
            </div>
            <div class="flex items-center text-sm text-gray-600 mb-4">
              <i class="pi pi-clock mr-2"></i>
              <span class="mr-4">30 minutes</span>
              <i class="pi pi-calendar mr-2"></i>
              <span>Due by Apr 10, 2025</span>
            </div>
            <div class="flex justify-between items-center">
              <div class="flex items-center">
                <div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                  <i class="pi pi-file-pdf text-red-600 text-sm"></i>
                </div>
                <span class="text-sm">Product Manual.pdf</span>
              </div>
              <Button label="Start Training" class="p-button-sm" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useAuthStore } from '@/stores/auth';
  import Badge from 'primevue/badge';
  import Tag from 'primevue/tag';
  import ProgressBar from 'primevue/progressbar';
  
  const authStore = useAuthStore();
  
  // User greeting
  const userGreeting = computed(() => {
    return authStore.displayName || 'Candidate';
  });
  
  // Profile completion percentage
  const profileCompletionPercentage = ref(65);
  
  // Number for cards (would normally be fetched from API)
  const stats = ref({
    availableJobs: 24,
    applications: 3,
    upcomingEvents: 1
  });
  
  // Sample recommended jobs (would normally be fetched from API)
  const recommendedJobs = ref([
    {
      id: 1,
      title: 'Event Promoter',
      company: 'Brand X Marketing',
      location: 'Kuala Lumpur',
      salary: 'RM 80/day',
      dates: '15-16 Apr 2025',
      description: 'Promote our products at the Tech Expo. Engage with visitors and demonstrate product features.',
      tags: ['Sales', 'Promotion'],
      badge: { label: 'New', severity: 'success' }
    },
    {
      id: 2,
      title: 'Event Assistant',
      company: 'EventPro Solutions',
      location: 'Petaling Jaya',
      salary: 'RM 100/day',
      dates: '20-22 Apr 2025',
      description: 'Assist with event setup, registration, and general support for the Annual Business Summit.',
      tags: ['Customer Service', 'Registration'],
      badge: { label: 'Popular', severity: 'warning' }
    }
  ]);
  
  // Sample upcoming trainings
  const upcomingTrainings = ref([
    {
      id: 1,
      title: 'Product Knowledge Training',
      eventName: 'Tech Expo Event',
      duration: '30 minutes',
      dueDate: 'Apr 10, 2025',
      materials: [
        { name: 'Product Manual.pdf', type: 'pdf' }
      ],
      status: 'Required'
    }
  ]);
  
  onMounted(() => {
    // Here you would normally fetch dashboard data from API
    console.log('Dashboard mounted');
  });
  </script>