<template>
  <div>
    <!-- Hero Section -->
    <section class="bg-primary bg-opacity-5 py-16">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="lg:flex lg:items-center lg:justify-between">
          <div class="lg:w-1/2">
            <h1 class="text-4xl font-bold text-text-heading sm:text-5xl">
              Connect with <span class="text-primary">Event Jobs</span> and <span class="text-primary">Talent</span>
            </h1>
            <p class="mt-4 text-xl text-text-primary">
              The intelligent platform that connects event companies with the perfect temporary staff, and helps job seekers find exciting event opportunities.
            </p>
            <div class="mt-8 flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
              <router-link 
                to="/auth/register/candidate" 
                class="btn btn-primary text-center"
              >
                Find Event Jobs
              </router-link>
              <router-link 
                to="/auth/register/recruiter" 
                class="btn btn-outline text-center"
              >
                Hire Event Staff
              </router-link>
            </div>
          </div>
          <div class="mt-10 lg:mt-0 lg:w-1/2 flex justify-center">
            <img src="/src/assets/vue.svg" alt="Event recruitment illustration" class="h-64 w-auto" />
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-16">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-3xl font-bold text-text-heading">Why Choose Our Platform?</h2>
          <p class="mt-4 text-lg text-text-primary max-w-3xl mx-auto">
            Our intelligent recruitment system brings together the best features to make event staffing efficient, reliable, and hassle-free.
          </p>
        </div>

        <div class="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <!-- Feature 1 -->
          <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="h-12 w-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center mb-4">
              <i class="pi pi-search text-primary text-xl"></i>
            </div>
            <h3 class="text-xl font-semibold text-text-heading">Smart Matching</h3>
            <p class="mt-2 text-text-primary">
              AI-powered matching connects the right candidates to your events based on location, skills, and availability.
            </p>
          </div>

          <!-- Feature 2 -->
          <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="h-12 w-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center mb-4">
              <i class="pi pi-check-circle text-primary text-xl"></i>
            </div>
            <h3 class="text-xl font-semibold text-text-heading">Verified Profiles</h3>
            <p class="mt-2 text-text-primary">
              Trusted verification system ensures you're connecting with reliable candidates and legitimate employers.
            </p>
          </div>

          <!-- Feature 3 -->
          <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="h-12 w-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center mb-4">
              <i class="pi pi-calendar text-primary text-xl"></i>
            </div>
            <h3 class="text-xl font-semibold text-text-heading">Streamlined Scheduling</h3>
            <p class="mt-2 text-text-primary">
              Efficient scheduling and availability management with automated reminders to reduce no-shows.
            </p>
          </div>

          <!-- Feature 4 -->
          <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="h-12 w-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center mb-4">
              <i class="pi pi-sync text-primary text-xl"></i>
            </div>
            <h3 class="text-xl font-semibold text-text-heading">Instant Replacements</h3>
            <p class="mt-2 text-text-primary">
              Smart backup system finds instant replacements when staff can't make it, ensuring your events are always fully staffed.
            </p>
          </div>

          <!-- Feature 5 -->
          <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="h-12 w-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center mb-4">
              <i class="pi pi-book text-primary text-xl"></i>
            </div>
            <h3 class="text-xl font-semibold text-text-heading">Digital Training</h3>
            <p class="mt-2 text-text-primary">
              Upload training materials and verify staff knowledge with automated quizzes before events begin.
            </p>
          </div>

          <!-- Feature 6 -->
          <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="h-12 w-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center mb-4">
              <i class="pi pi-star text-primary text-xl"></i>
            </div>
            <h3 class="text-xl font-semibold text-text-heading">Rating System</h3>
            <p class="mt-2 text-text-primary">
              Two-way feedback system helps identify the best talents and the most professional employers.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="bg-primary bg-opacity-5 py-16">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl font-bold text-text-heading">Ready to Transform Your Event Recruitment?</h2>
        <p class="mt-4 text-xl text-text-primary max-w-3xl mx-auto">
          Join thousands of event professionals who have simplified their staffing process with our platform.
        </p>
        <div class="mt-8 flex justify-center">
          <router-link 
            to="/auth/register/recruiter" 
            class="btn btn-primary"
          >
            Get Started Today
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// Home component doesn't need much logic - it's primarily for display
</script>