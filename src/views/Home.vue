<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white">
    <!-- Hero section with enhanced animated gradient -->
    <section class="relative overflow-hidden py-24 md:py-32">
      <!-- Improved animated background gradient -->
      <div
        class="absolute inset-0 bg-gradient-to-tr from-primary-100 via-white to-blue-100 opacity-80"
      ></div>

      <!-- Enhanced decorative shapes -->
      <div
        class="absolute top-20 right-10 w-72 h-72 rounded-full bg-primary-200 blur-3xl opacity-40 animate-pulse"
      ></div>
      <div
        class="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-blue-200 blur-3xl opacity-30"
      ></div>
      <div
        class="absolute top-1/2 left-1/3 w-48 h-48 rounded-full bg-yellow-100 blur-3xl opacity-20 animate-float"
      ></div>

      <div class="container mx-auto px-6 relative z-10">
        <div class="flex flex-col md:flex-row items-center gap-16">
          <div class="md:w-1/2 md:pr-8">
            <div class="animate-fadeIn">
              <!-- Added brand name -->
              <div class="mb-3">
                <span class="text-3xl font-extrabold tracking-tight"
                  ><span class="text-primary-700">Crew</span
                  ><span class="text-gray-800">Connect</span></span
                >
              </div>
              <h1
                class="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6"
              >
                Find <span class="text-gradient">Perfect Staff</span> for Your
                Events
              </h1>
              <p
                class="text-lg md:text-xl text-gray-700 mb-10 leading-relaxed max-w-xl"
              >
                Connect with experienced event staff and discover exciting
                opportunities in the event industry with our AI-powered
                platform.
              </p>
              <div class="flex flex-wrap gap-5">
                <Button
                  label="Get Started"
                  icon="pi pi-user-plus"
                  class="p-button-rounded p-button-lg shadow-xl hover:shadow-primary-lg transition-all duration-300 transform hover:-translate-y-1"
                  @click="$router.push('/register')"
                />
                <Button
                  label="Sign In"
                  icon="pi pi-sign-in"
                  class="p-button-outlined p-button-rounded p-button-lg hover:bg-primary-50 transition-all duration-300"
                  @click="$router.push('/login')"
                />
              </div>
            </div>
          </div>
          <div class="md:w-1/2">
            <div
              class="glassmorphism-card p-1 rounded-2xl shadow-2xl transform transition-all duration-500 hover:scale-[1.02] hover:shadow-primary-lg"
            >
              <Card class="border-0 rounded-2xl overflow-hidden">
                <template #header>
                  <div class="glass-header text-white p-5 text-center">
                    <h2 class="text-2xl font-bold">CrewConnect Highlights</h2>
                  </div>
                </template>
                <template #content>
                  <ul class="space-y-6 p-4">
                    <li
                      class="flex p-3 hover:bg-primary-50 rounded-xl transition-colors duration-300"
                    >
                      <Avatar
                        icon="pi pi-bolt"
                        class="bg-gradient-to-r from-primary-500 to-primary-700 text-white mr-4 shadow-md"
                        size="large"
                        shape="circle"
                      />
                      <div>
                        <h3 class="font-bold text-gray-800 text-lg">
                          Smart Matching
                        </h3>
                        <p class="text-gray-600">
                          AI-powered candidate matching based on skills and
                          location
                        </p>
                      </div>
                    </li>
                    <li
                      class="flex p-3 hover:bg-primary-50 rounded-xl transition-colors duration-300"
                    >
                      <Avatar
                        icon="pi pi-calendar"
                        class="bg-gradient-to-r from-blue-500 to-blue-700 text-white mr-4 shadow-md"
                        size="large"
                        shape="circle"
                      />
                      <div>
                        <h3 class="font-bold text-gray-800 text-lg">
                          Automated Job Management
                        </h3>
                        <p class="text-gray-600">
                          Post and manage event staffing needs efficiently
                        </p>
                      </div>
                    </li>
                    <li
                      class="flex p-3 hover:bg-primary-50 rounded-xl transition-colors duration-300"
                    >
                      <Avatar
                        icon="pi pi-book"
                        class="bg-gradient-to-r from-green-500 to-green-700 text-white mr-4 shadow-md"
                        size="large"
                        shape="circle"
                      />
                      <div>
                        <h3 class="font-bold text-gray-800 text-lg">
                          Training Tools
                        </h3>
                        <p class="text-gray-600">
                          Integrated training and evaluation systems
                        </p>
                      </div>
                    </li>
                    <li
                      class="flex p-3 hover:bg-primary-50 rounded-xl transition-colors duration-300"
                    >
                      <Avatar
                        icon="pi pi-comments"
                        class="bg-gradient-to-r from-purple-500 to-purple-700 text-white mr-4 shadow-md"
                        size="large"
                        shape="circle"
                      />
                      <div>
                        <h3 class="font-bold text-gray-800 text-lg">
                          Real-time Updates
                        </h3>
                        <p class="text-gray-600">
                          Instant communication and status tracking
                        </p>
                      </div>
                    </li>
                  </ul>
                </template>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- How it works section with enhanced modern cards -->
    <section class="py-24 bg-white relative overflow-hidden">
      <!-- Enhanced decorative elements -->
      <div
        class="absolute -right-20 top-20 w-96 h-96 bg-gradient-to-br from-primary-100 to-primary-50 rounded-full blur-3xl opacity-40"
      ></div>
      <div
        class="absolute -left-20 bottom-20 w-96 h-96 bg-gradient-to-tr from-blue-100 to-blue-50 rounded-full blur-3xl opacity-40"
      ></div>
      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border-[40px] border-primary-50 opacity-40 animate-slow-spin"
      ></div>

      <div class="container mx-auto px-6 relative z-10">
        <div class="text-center mb-20">
          <div class="mb-6 inline-block">
            <span
              class="bg-primary-600 text-white text-sm font-medium px-5 py-2 rounded-full"
              >HOW CREWCONNECT WORKS</span
            >
          </div>
          <h2 class="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            How It <span class="text-primary-600">Works</span>
          </h2>
          <p class="text-gray-600 max-w-2xl mx-auto text-lg">
            Our platform streamlines the event staffing process for both
            recruiters and candidates.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- For Recruiters -->
          <Card
            class="shadow-md hover:shadow-lg transition-shadow duration-300 border-0"
          >
            <template #header>
              <div class="bg-primary-600 h-1"></div>
            </template>
            <template #content>
              <div class="p-4">
                <div
                  class="mb-4 bg-primary-100 text-primary-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto"
                >
                  <i class="pi pi-building text-3xl"></i>
                </div>
                <h3 class="text-xl font-bold text-center mb-4">
                  For Recruiters
                </h3>
                <Divider />
                <ul class="space-y-3 text-gray-700">
                  <li class="flex items-start">
                    <Badge
                      value="1"
                      severity="info"
                      class="mr-3 mt-0.5"
                    ></Badge>
                    <span class="flex-1"
                      >Create and post job listings for your events</span
                    >
                  </li>
                  <li class="flex items-start">
                    <Badge
                      value="2"
                      severity="info"
                      class="mr-3 mt-0.5"
                    ></Badge>
                    <span class="flex-1"
                      >Review AI-matched candidates based on experience and
                      location</span
                    >
                  </li>
                  <li class="flex items-start">
                    <Badge
                      value="3"
                      severity="info"
                      class="mr-3 mt-0.5"
                    ></Badge>
                    <span class="flex-1"
                      >Upload training materials and track candidate
                      preparation</span
                    >
                  </li>
                  <li class="flex items-start">
                    <Badge
                      value="4"
                      severity="info"
                      class="mr-3 mt-0.5"
                    ></Badge>
                    <span class="flex-1"
                      >Manage scheduling and find fast replacements if
                      needed</span
                    >
                  </li>
                  <li class="flex items-start">
                    <i
                      class="pi pi-ellipsis-h text-primary-500 mr-3 mt-0.5"
                    ></i>
                    <span class="flex-1 text-gray-500 italic">and more...</span>
                  </li>
                </ul>
              </div>
            </template>
          </Card>

          <!-- For Candidates -->
          <Card
            class="shadow-md hover:shadow-lg transition-shadow duration-300 transform translate-y-0 hover:-translate-y-1 duration-300 border-0"
          >
            <template #header>
              <div class="bg-primary-700 h-1"></div>
            </template>
            <template #content>
              <div class="p-4">
                <div
                  class="mb-4 bg-primary-100 text-primary-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto"
                >
                  <i class="pi pi-user text-3xl"></i>
                </div>
                <h3 class="text-xl font-bold text-center mb-4">
                  For Candidates
                </h3>
                <Divider />
                <ul class="space-y-3 text-gray-700">
                  <li class="flex items-start">
                    <Badge
                      value="1"
                      severity="info"
                      class="mr-3 mt-0.5"
                    ></Badge>
                    <span class="flex-1"
                      >Create a profile showcasing your skills and
                      experience</span
                    >
                  </li>
                  <li class="flex items-start">
                    <Badge
                      value="2"
                      severity="info"
                      class="mr-3 mt-0.5"
                    ></Badge>
                    <span class="flex-1"
                      >Set your availability and preferred work locations</span
                    >
                  </li>
                  <li class="flex items-start">
                    <Badge
                      value="3"
                      severity="info"
                      class="mr-3 mt-0.5"
                    ></Badge>
                    <span class="flex-1"
                      >Browse and apply for event jobs matching your
                      profile</span
                    >
                  </li>
                  <li class="flex items-start">
                    <Badge
                      value="4"
                      severity="info"
                      class="mr-3 mt-0.5"
                    ></Badge>
                    <span class="flex-1"
                      >Complete training and confirm assignments easily</span
                    >
                  </li>
                  <li class="flex items-start">
                    <i
                      class="pi pi-ellipsis-h text-primary-500 mr-3 mt-0.5"
                    ></i>
                    <span class="flex-1 text-gray-500 italic">and more...</span>
                  </li>
                </ul>
              </div>
            </template>
          </Card>

          <!-- Platform Features -->
          <Card
            class="shadow-md hover:shadow-lg transition-shadow duration-300 border-0"
          >
            <template #header>
              <div class="bg-primary-800 h-1"></div>
            </template>
            <template #content>
              <div class="p-4">
                <div
                  class="mb-4 bg-primary-100 text-primary-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto"
                >
                  <i class="pi pi-star text-3xl"></i>
                </div>
                <h3 class="text-xl font-bold text-center mb-4">
                  Platform Features
                </h3>
                <Divider />
                <div class="flex flex-wrap gap-2 justify-center mb-4">
                  <Chip label="AI Matching" icon="pi pi-bolt" />
                  <Chip label="Real-time Updates" icon="pi pi-bell" />
                  <Chip label="AI Training Assessment" icon="pi pi-chart-bar" />
                </div>
                <ul class="space-y-3 text-gray-700">
                  <li class="flex items-start">
                    <i
                      class="pi pi-check-circle text-primary-600 mr-2 mt-1"
                    ></i>
                    <span>Extensive talent pool</span>
                  </li>
                  <li class="flex items-start">
                    <i
                      class="pi pi-check-circle text-primary-600 mr-2 mt-1"
                    ></i>
                    <span>Mobile-friendly interface</span>
                  </li>
                  <li class="flex items-start">
                    <i
                      class="pi pi-check-circle text-primary-600 mr-2 mt-1"
                    ></i>
                    <span>Advanced filtering options</span>
                  </li>
                  <li class="flex items-start">
                    <i class="pi pi-ellipsis-h text-primary-500 mr-2 mt-1"></i>
                    <span class="text-gray-500 italic">and more...</span>
                  </li>
                </ul>
              </div>
            </template>
          </Card>
        </div>
      </div>
    </section>

    <!-- Enhanced CTA Section with gradient background -->
    <section class="relative py-28 overflow-hidden">
      <!-- Animated gradient background -->
      <div
        class="absolute inset-0 bg-gradient-to-r from-primary-700 via-primary-800 to-primary-900"
      ></div>

      <!-- Enhanced decorative elements -->
      <div
        class="absolute top-0 left-0 w-96 h-96 bg-white opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2"
      ></div>
      <div
        class="absolute bottom-0 right-0 w-[500px] h-[500px] bg-white opacity-5 rounded-full translate-x-1/3 translate-y-1/3"
      ></div>
      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border-[30px] border-white opacity-5 rounded-full animate-slow-ping"
      ></div>

      <div class="container mx-auto px-6 relative z-10 text-center">
        <div class="mb-6 inline-block">
          <span
            class="bg-white bg-opacity-20 text-white text-sm font-medium px-5 py-2 rounded-full"
            >JOIN CREWCONNECT</span
          >
        </div>
        <h2 class="text-4xl md:text-5xl font-bold text-white mb-8">
          Ready to Transform Your Event Staffing?
        </h2>
        <p class="text-xl text-white opacity-90 mb-12 max-w-2xl mx-auto">
          Join CrewConnect today and experience the future of event recruitment.
        </p>
        <div class="flex flex-col sm:flex-row justify-center gap-6">
          <Button
            label="Get Started Now"
            icon="pi pi-user-plus"
            class="p-button-rounded p-button-lg p-button-outlined p-button-light shadow-xl hover:shadow-white-lg transition-all duration-300 transform hover:-translate-y-1"
            @click="$router.push('/register')"
          />
          <Button
            label="Learn More"
            icon="pi pi-info-circle"
            class="p-button-rounded p-button-lg p-button-text p-button-light hover:bg-white hover:bg-opacity-10 transition-all duration-300"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import Card from 'primevue/card';
import Divider from 'primevue/divider';
import Badge from 'primevue/badge';
import Chip from 'primevue/chip';
import Avatar from 'primevue/avatar';
// Home page component with navigation to auth pages
</script>

<style scoped>
.animate-fadeIn {
  animation: fadeIn 0.5s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
