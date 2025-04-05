<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero section -->
    <section class="bg-gradient-to-b from-primary-50 to-gray-50 py-16">
      <div class="container mx-auto px-6">
        <div class="flex flex-col md:flex-row items-center">
          <div class="md:w-1/2 mb-10 md:mb-0">
            <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Find the Perfect Staff for Your Events
            </h1>
            <p class="text-lg text-gray-700 mb-8">
              Connect with experienced event staff and find exciting job opportunities in the event industry.
            </p>
            <div class="flex flex-col sm:flex-row gap-4">
              <Button 
                label="Sign Up" 
                icon="pi pi-user-plus" 
                class="p-button-primary" 
                @click="$router.push('/register')"
              />
              <Button 
                label="Log In" 
                icon="pi pi-sign-in" 
                class="p-button-outlined" 
                @click="$router.push('/login')"
              />
            </div>
          </div>
          <div class="md:w-1/2">
            <div class="bg-white p-6 rounded-lg shadow-md">
              <h2 class="text-2xl font-semibold text-gray-800 mb-4">Platform Highlights</h2>
              <ul class="space-y-4">
                <li class="flex">
                  <span class="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-primary-100 text-primary-600">
                    <i class="pi pi-check"></i>
                  </span>
                  <span class="ml-3 text-gray-700">Smart candidate matching using AI technology</span>
                </li>
                <li class="flex">
                  <span class="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-primary-100 text-primary-600">
                    <i class="pi pi-check"></i>
                  </span>
                  <span class="ml-3 text-gray-700">Automated job posting and management</span>
                </li>
                <li class="flex">
                  <span class="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-primary-100 text-primary-600">
                    <i class="pi pi-check"></i>
                  </span>
                  <span class="ml-3 text-gray-700">Built-in training and evaluation tools</span>
                </li>
                <li class="flex">
                  <span class="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-primary-100 text-primary-600">
                    <i class="pi pi-check"></i>
                  </span>
                  <span class="ml-3 text-gray-700">Real-time communication and status updates</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- How it works section -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-6">
        <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- For Recruiters -->
          <div class="bg-gray-50 p-6 rounded-lg">
            <div class="mb-4 text-primary-600">
              <i class="pi pi-building text-3xl"></i>
            </div>
            <h3 class="text-xl font-semibold mb-3">For Recruiters</h3>
            <ul class="space-y-2 text-gray-700">
              <li class="flex items-start">
                <span class="text-sm mr-2">1.</span>
                <span>Create and post job listings for your events</span>
              </li>
              <li class="flex items-start">
                <span class="text-sm mr-2">2.</span>
                <span>Review AI-matched candidates based on experience and location</span>
              </li>
              <li class="flex items-start">
                <span class="text-sm mr-2">3.</span>
                <span>Upload training materials and track candidate preparation</span>
              </li>
              <li class="flex items-start">
                <span class="text-sm mr-2">4.</span>
                <span>Manage scheduling and find fast replacements if needed</span>
              </li>
            </ul>
          </div>
          
          <!-- For Candidates -->
          <div class="bg-gray-50 p-6 rounded-lg">
            <div class="mb-4 text-primary-600">
              <i class="pi pi-user text-3xl"></i>
            </div>
            <h3 class="text-xl font-semibold mb-3">For Candidates</h3>
            <ul class="space-y-2 text-gray-700">
              <li class="flex items-start">
                <span class="text-sm mr-2">1.</span>
                <span>Create a profile highlighting your skills and experience</span>
              </li>
              <li class="flex items-start">
                <span class="text-sm mr-2">2.</span>
                <span>Set your availability and preferred work locations</span>
              </li>
              <li class="flex items-start">
                <span class="text-sm mr-2">3.</span>
                <span>Browse and apply for event jobs matching your profile</span>
              </li>
              <li class="flex items-start">
                <span class="text-sm mr-2">4.</span>
                <span>Complete training and confirm assignments easily</span>
              </li>
            </ul>
          </div>
          
          <!-- Platform Features -->
          <div class="bg-gray-50 p-6 rounded-lg">
            <div class="mb-4 text-primary-600">
              <i class="pi pi-star text-3xl"></i>
            </div>
            <h3 class="text-xl font-semibold mb-3">Platform Features</h3>
            <ul class="space-y-2 text-gray-700">
              <li class="flex items-start">
                <span class="text-sm mr-2">•</span>
                <span>AI-powered matching algorithm</span>
              </li>
              <li class="flex items-start">
                <span class="text-sm mr-2">•</span>
                <span>Real-time notification system</span>
              </li>
              <li class="flex items-start">
                <span class="text-sm mr-2">•</span>
                <span>Two-way rating and review system</span>
              </li>
              <li class="flex items-start">
                <span class="text-sm mr-2">•</span>
                <span>Data-driven recruitment analytics</span>
              </li>
              <li class="flex items-start">
                <span class="text-sm mr-2">•</span>
                <span>Mobile-friendly interface</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
    
    <!-- CTA Section -->
    <section class="py-16 bg-primary-600 text-white">
      <div class="container mx-auto px-6 text-center">
        <h2 class="text-3xl font-bold mb-4">Ready to get started?</h2>
        <p class="text-xl mb-8 max-w-2xl mx-auto">
          Join our platform today and transform your event staffing experience.
        </p>
        <div class="flex flex-col sm:flex-row justify-center gap-4">
          <Button 
            label="Sign Up Now" 
            icon="pi pi-user-plus" 
            class="p-button-lg p-button-outlined p-button-light" 
            @click="$router.push('/register')"
          />
          <Button 
            label="Learn More" 
            icon="pi pi-info-circle" 
            class="p-button-lg p-button-text p-button-light" 
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// Home page component with navigation to auth pages
</script>