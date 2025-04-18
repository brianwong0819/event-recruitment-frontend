<template>
  <div
    class="flex flex-col md:flex-row min-h-screen justify-center items-center"
  >
    <!-- Toast for notifications -->
    <Toast position="top-right" />

    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center py-20 w-full">
      <div class="animate-pulse flex flex-col items-center">
        <i class="pi pi-spin pi-spinner text-primary-500 text-4xl mb-2"></i>
        <p class="text-primary-500 mb-4">Loading your profile...</p>

        <!-- Token debug section (only shown in development) -->
        <div
          v-if="tokenError"
          class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg max-w-md"
        >
          <h3 class="text-red-600 font-medium mb-2">Authentication Error</h3>
          <p class="text-sm text-red-700 mb-3">{{ tokenError }}</p>

          <div class="flex flex-col gap-2">
            <button
              @click="tryNewToken"
              class="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm hover:bg-primary-600"
            >
              Try New Token
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Container for the profile content - centers everything and constrains max width -->
    <div
      v-else
      class="flex flex-col md:flex-row w-full max-w-7xl shadow-md rounded-lg overflow-hidden relative md:gap-0 md:shadow-none"
    >
      <!-- Mobile Menu Toggle Button (Only visible on mobile) -->
      <button
        v-if="isClient && windowWidth < 768"
        @click="toggleSidebar"
        class="md:hidden fixed bottom-6 right-6 z-50 bg-primary-500 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-primary-600"
      >
        <i
          :class="sidebarOpen ? 'pi pi-times' : 'pi pi-bars'"
          class="text-xl"
        ></i>
      </button>

      <!-- Left Sidebar -->
      <div
        :class="[
          'w-full md:w-72 lg:w-80 md:sticky md:top-0 md:h-screen md:overflow-y-auto flex flex-col bg-gradient-to-br from-primary-50 via-white to-gray-50 transition-all duration-300 transform relative',
          {
            'fixed inset-0 z-40 h-screen':
              sidebarOpen && isClient && windowWidth < 768,
          },
          { hidden: !sidebarOpen && isClient && windowWidth < 768 },
        ]"
      >
        <!-- Gradient fade effect on the right edge of sidebar -->
        <div
          class="absolute top-0 right-0 w-8 h-full bg-gradient-to-r from-transparent via-primary-50/10 to-gray-50 hidden md:block z-20 pointer-events-none"
        ></div>

        <!-- Profile Photo & Name Section -->
        <div
          class="flex flex-col items-center px-6 py-8 border-b bg-gradient-to-b from-primary-100 to-white relative overflow-hidden"
        >
          <div
            class="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-primary-200 to-primary-100 opacity-50"
          ></div>
          <div class="w-24 h-24 relative mb-4 z-10 sm:w-28 sm:h-28">
            <div
              v-if="hasValidProfilePicture"
              class="w-full h-full overflow-hidden rounded-full border-4 border-white shadow-lg"
            >
              <img
                :src="profilePictureSource"
                alt="Profile"
                class="w-full h-full object-cover"
                @error="handleProfileImageError"
              />
            </div>
            <div
              v-else
              class="w-full h-full rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-lg"
            >
              {{ getInitials(profile?.name) }}
            </div>
          </div>

          <h3 class="text-xl font-semibold text-center text-gray-800 z-10">
            {{ profile?.name || 'Your Name' }}
          </h3>
          <p class="text-gray-600 text-sm text-center z-10">
            {{ profile?.username || '@username' }}
          </p>
          <div
            class="flex justify-center items-center mt-1 text-xs text-gray-600 z-10 text-center px-4"
          >
            <i class="pi pi-map-marker mr-1 text-primary-500 flex-shrink-0"></i>
            <span class="truncate">{{ getLocation(profile) }}</span>
          </div>
          <input
            type="file"
            ref="profilePictureInput"
            style="display: none"
            accept="image/*"
            @change="handleProfilePictureUpload"
          />
        </div>

        <!-- Navigation Menu -->
        <nav class="py-4 flex-grow bg-gray-50">
          <ul class="space-y-1 px-2 md:px-3 flex flex-col md:block">
            <li class="md:w-full w-full">
              <button
                @click="activeSection = 'basic-info'"
                :class="[
                  'w-full text-left py-2 md:py-2.5 px-3 md:px-4 flex items-center transition-all duration-200 text-sm md:text-base rounded-lg',
                  activeSection === 'basic-info'
                    ? 'bg-primary-100 text-primary-700 font-medium shadow-sm'
                    : 'text-gray-700 hover:bg-white hover:shadow-sm',
                ]"
              >
                <i
                  class="pi pi-user text-base md:text-lg w-6 mr-2 md:mr-3"
                  :class="
                    activeSection === 'basic-info'
                      ? 'text-primary-600'
                      : 'text-gray-500'
                  "
                ></i>
                Basic Information
              </button>
            </li>
            <li>
              <button
                @click="activeSection = 'resume'"
                :class="[
                  'w-full text-left py-2.5 px-4 flex items-center transition-all duration-200 text-base rounded-lg',
                  activeSection === 'resume'
                    ? 'bg-primary-100 text-primary-700 font-medium shadow-sm'
                    : 'text-gray-700 hover:bg-white hover:shadow-sm',
                ]"
              >
                <i
                  class="pi pi-file-pdf text-lg w-6 mr-3"
                  :class="
                    activeSection === 'resume'
                      ? 'text-primary-600'
                      : 'text-gray-500'
                  "
                ></i>
                Resume
              </button>
            </li>
            <li>
              <button
                @click="navigateToPhotos"
                :class="[
                  'w-full text-left py-2.5 px-4 flex items-center transition-all duration-200 text-base rounded-lg',
                  activeSection === 'photos'
                    ? 'bg-primary-100 text-primary-700 font-medium shadow-sm'
                    : 'text-gray-700 hover:bg-white hover:shadow-sm',
                ]"
              >
                <i
                  class="pi pi-images text-lg w-6 mr-3"
                  :class="
                    activeSection === 'photos'
                      ? 'text-primary-600'
                      : 'text-gray-500'
                  "
                ></i>
                Photos
              </button>
            </li>
            <li>
              <button
                @click="activeSection = 'work-experience'"
                :class="[
                  'w-full text-left py-2.5 px-4 flex items-center transition-all duration-200 text-base rounded-lg',
                  activeSection === 'work-experience'
                    ? 'bg-primary-100 text-primary-700 font-medium shadow-sm'
                    : 'text-gray-700 hover:bg-white hover:shadow-sm',
                ]"
              >
                <i
                  class="pi pi-briefcase text-lg w-6 mr-3"
                  :class="
                    activeSection === 'work-experience'
                      ? 'text-primary-600'
                      : 'text-gray-500'
                  "
                ></i>
                Work Experience
              </button>
            </li>
            <li>
              <button
                @click="activeSection = 'availability'"
                :class="[
                  'w-full text-left py-2.5 px-4 flex items-center transition-all duration-200 text-base rounded-lg',
                  activeSection === 'availability'
                    ? 'bg-primary-100 text-primary-700 font-medium shadow-sm'
                    : 'text-gray-700 hover:bg-white hover:shadow-sm',
                ]"
              >
                <i
                  class="pi pi-calendar text-lg w-6 mr-3"
                  :class="
                    activeSection === 'availability'
                      ? 'text-primary-600'
                      : 'text-gray-500'
                  "
                ></i>
                Job Preferences
              </button>
            </li>
            <li>
              <button
                @click="activeSection = 'settings'"
                :class="[
                  'w-full text-left py-2.5 px-4 flex items-center transition-all duration-200 text-base rounded-lg',
                  activeSection === 'settings'
                    ? 'bg-primary-100 text-primary-700 font-medium shadow-sm'
                    : 'text-gray-700 hover:bg-white hover:shadow-sm',
                ]"
              >
                <i
                  class="pi pi-cog text-lg w-6 mr-3"
                  :class="
                    activeSection === 'settings'
                      ? 'text-primary-600'
                      : 'text-gray-500'
                  "
                ></i>
                Account Settings
              </button>
            </li>
          </ul>
        </nav>

        <!-- Add close button for mobile sidebar -->
        <button
          @click="toggleSidebar"
          class="md:hidden absolute top-3 right-3 text-gray-500 hover:text-gray-700 bg-white bg-opacity-80 rounded-full w-8 h-8 flex items-center justify-center shadow-sm"
        >
          <i class="pi pi-times"></i>
        </button>
      </div>

      <!-- Main Content Area -->
      <div
        class="flex-1 py-4 px-4 md:py-8 md:px-6 flex justify-center bg-gray-50 relative"
      >
        <!-- Gradient fade effect on the left edge of main content -->
        <div
          class="absolute top-0 left-0 w-8 h-full bg-gradient-to-r from-gray-50 via-gray-50/50 to-transparent hidden md:block z-20 pointer-events-none"
        ></div>

        <!-- Content Container with Max Width -->
        <div class="w-full max-w-4xl">
          <!-- Basic Information Section -->
          <div v-show="activeSection === 'basic-info'" class="animate-fadeIn">
            <!-- AI evaluation notification -->
            <div
              class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 shadow-sm"
            >
              <div class="flex items-start">
                <i
                  class="pi pi-info-circle text-blue-500 mt-0.5 mr-3 text-lg"
                ></i>
                <div>
                  <h4 class="text-blue-700 font-medium mb-1">
                    Profile Optimization Tip
                  </h4>
                  <p class="text-sm text-blue-600">
                    Your profile information will be analyzed by AI when you
                    apply for positions. Complete and detailed information
                    increases your chances of being selected for interviews.
                  </p>
                </div>
              </div>
            </div>
            <div
              class="rounded-xl shadow-md border mb-6 md:mb-8 overflow-hidden bg-white transition-all duration-300 hover:shadow-lg"
            >
              <div
                class="flex justify-between items-center p-4 md:p-6 border-b bg-white"
              >
                <h2
                  class="text-lg md:text-xl font-semibold text-gray-800 flex items-center"
                >
                  <i class="pi pi-user-edit text-primary-500 mr-2"></i>
                  Basic Information
                </h2>
                <Button
                  v-if="!editingBasicInfo"
                  icon="pi pi-pencil"
                  class="p-button-text p-button-rounded text-gray-600 hover:bg-gray-100"
                  @click="startEditingBasicInfo"
                />
              </div>

              <!-- Basic info display mode -->
              <div v-if="!editingBasicInfo" class="p-4 md:p-6 bg-white">
                <div
                  class="grid grid-cols-1 md:grid-cols-2 gap-y-4 md:gap-y-6 gap-x-4 md:gap-x-6"
                >
                  <div
                    class="group bg-gray-50 p-3 rounded-lg transition-all duration-300 hover:bg-primary-50 hover:shadow-sm"
                  >
                    <p
                      class="text-sm text-gray-500 mb-1 font-medium flex items-center"
                    >
                      <i class="pi pi-user text-primary-400 mr-1"></i>
                      Full Name
                    </p>
                    <p class="text-base text-gray-800 pl-5">
                      {{ profile?.name || 'Not provided' }}
                    </p>
                  </div>
                  <div
                    class="group bg-gray-50 p-3 rounded-lg transition-all duration-300 hover:bg-primary-50 hover:shadow-sm"
                  >
                    <p
                      class="text-sm text-gray-500 mb-1 font-medium flex items-center"
                    >
                      <i class="pi pi-briefcase text-primary-400 mr-1"></i>
                      Employment Status
                    </p>
                    <p class="text-base text-gray-800 pl-5">
                      {{ formatEmploymentStatus(profile?.employmentStatus) }}
                    </p>
                  </div>
                  <div
                    class="group bg-gray-50 p-3 rounded-lg transition-all duration-300 hover:bg-primary-50 hover:shadow-sm"
                  >
                    <p
                      class="text-sm text-gray-500 mb-1 font-medium flex items-center"
                    >
                      <i class="pi pi-envelope text-primary-400 mr-1"></i>
                      Email Address
                    </p>
                    <p class="text-base text-gray-800 pl-5">
                      {{ profile?.email || 'Not provided' }}
                    </p>
                  </div>
                  <div
                    class="group bg-gray-50 p-3 rounded-lg transition-all duration-300 hover:bg-primary-50 hover:shadow-sm"
                  >
                    <p
                      class="text-sm text-gray-500 mb-1 font-medium flex items-center"
                    >
                      <i class="pi pi-phone text-primary-400 mr-1"></i>
                      Phone Number
                    </p>
                    <p class="text-base text-gray-800 pl-5">
                      {{ profile?.phoneNumber || 'Not provided' }}
                    </p>
                  </div>
                  <div
                    class="group bg-gray-50 p-3 rounded-lg transition-all duration-300 hover:bg-primary-50 hover:shadow-sm"
                  >
                    <p
                      class="text-sm text-gray-500 mb-1 font-medium flex items-center"
                    >
                      <i class="pi pi-map-marker text-primary-400 mr-1"></i>
                      Preferred Location
                    </p>
                    <p class="text-base text-gray-800 pl-5">
                      <span>{{ getLocation(profile) }}</span>
                    </p>
                  </div>
                  <div
                    class="group bg-gray-50 p-3 rounded-lg transition-all duration-300 hover:bg-primary-50 hover:shadow-sm"
                  >
                    <p
                      class="text-sm text-gray-500 mb-1 font-medium flex items-center"
                    >
                      <i class="pi pi-calendar text-primary-400 mr-1"></i>
                      Date of Birth
                    </p>
                    <p class="text-base text-gray-800 pl-5">
                      {{ formatDate(profile?.dateOfBirth) }}
                    </p>
                  </div>
                  <div
                    class="group bg-gray-50 p-3 rounded-lg transition-all duration-300 hover:bg-primary-50 hover:shadow-sm"
                  >
                    <p
                      class="text-sm text-gray-500 mb-1 font-medium flex items-center"
                    >
                      <i class="pi pi-users text-primary-400 mr-1"></i>
                      Ethnicity
                    </p>
                    <p class="text-base text-gray-800 pl-5">
                      {{ formatRace(profile?.race) }}
                    </p>
                  </div>
                  <div
                    class="group bg-gray-50 p-3 rounded-lg transition-all duration-300 hover:bg-primary-50 hover:shadow-sm"
                  >
                    <p
                      class="text-sm text-gray-500 mb-1 font-medium flex items-center"
                    >
                      <i class="pi pi-user text-primary-400 mr-1"></i>
                      Gender
                    </p>
                    <p class="text-base text-gray-800 pl-5">
                      {{ formatGender(profile?.gender) }}
                    </p>
                  </div>
                </div>

                <div
                  class="mt-8 bg-gray-50 p-4 rounded-lg hover:bg-primary-50 transition-all duration-300 hover:shadow-sm"
                >
                  <p
                    class="text-sm text-gray-500 mb-2 font-medium flex items-center"
                  >
                    <i class="pi pi-globe text-primary-400 mr-1"></i>
                    Languages
                  </p>
                  <div class="flex flex-wrap gap-2 pl-5">
                    <span
                      v-for="lang in profile?.languages"
                      :key="lang"
                      class="inline-block px-3 py-1 bg-primary-100 text-primary-600 rounded-full text-sm shadow-sm hover:bg-primary-200 transition-colors cursor-default"
                    >
                      <i class="pi pi-comment mr-1 text-xs"></i>
                      {{ formatLanguage(lang) }}
                    </span>
                    <p
                      v-if="!profile?.languages?.length"
                      class="text-base text-gray-800"
                    >
                      No languages specified
                    </p>
                  </div>
                </div>

                <div
                  class="mt-8 bg-gray-50 p-4 rounded-lg hover:bg-primary-50 transition-all duration-300 hover:shadow-sm"
                >
                  <p
                    class="text-sm text-gray-500 mb-2 font-medium flex items-center"
                  >
                    <i class="pi pi-user-edit text-primary-400 mr-1"></i>
                    About Me
                  </p>
                  <p
                    class="text-base text-gray-800 p-4 bg-white rounded-lg shadow-sm border border-gray-100"
                  >
                    {{ profile?.bio || 'No bio provided' }}
                  </p>
                </div>
              </div>

              <!-- Basic info edit mode -->
              <div v-else class="p-6 bg-white rounded-lg">
                <form @submit.prevent="saveBasicInfo">
                  <!-- Error alert for form submission errors -->
                  <div
                    v-if="formSubmissionError"
                    class="mb-6 p-4 rounded-md bg-red-50 border border-red-200 text-red-600"
                  >
                    <div class="flex items-center">
                      <i class="pi pi-exclamation-circle text-red-500 mr-2"></i>
                      <span class="font-medium">{{ formSubmissionError }}</span>
                    </div>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                    <div class="form-group">
                      <label
                        for="name"
                        class="font-medium text-gray-700 mb-1 block text-sm"
                        ><i class="pi pi-user text-primary-400 mr-1"></i>Full
                        Name</label
                      >
                      <InputText
                        id="name"
                        v-model="editForm.name"
                        class="w-full shadow-sm"
                        :class="{ 'p-invalid': formErrors.name }"
                        style="
                          border-radius: 0.5rem;
                          background-color: #f9fafb;
                          padding: 0.5rem 0.75rem;
                        "
                      />
                      <small
                        v-if="formErrors.name"
                        class="p-error block mt-1"
                        >{{ formErrors.name }}</small
                      >
                    </div>
                    <div class="form-group">
                      <label
                        for="phoneNumber"
                        class="font-medium text-gray-700 mb-1 block text-sm"
                        ><i class="pi pi-phone text-primary-400 mr-1"></i>Phone
                        Number</label
                      >
                      <InputText
                        id="phoneNumber"
                        v-model="editForm.phoneNumber"
                        class="w-full shadow-sm"
                        :class="{ 'p-invalid': formErrors.phoneNumber }"
                        style="
                          border-radius: 0.5rem;
                          background-color: #f9fafb;
                          padding: 0.5rem 0.75rem;
                        "
                      />
                      <small
                        v-if="formErrors.phoneNumber"
                        class="p-error block mt-1"
                        >{{ formErrors.phoneNumber }}</small
                      >
                    </div>
                    <div class="form-group">
                      <label
                        for="location"
                        class="font-medium text-gray-700 mb-1 block text-sm"
                        ><i class="pi pi-map-marker text-primary-400 mr-1"></i
                        >Location</label
                      >
                      <LocationSearch
                        id="location"
                        :multiple="false"
                        :show-selections="false"
                        @location-selected="handleLocationSelected"
                        class="w-full"
                        v-model="selectedLocation"
                      />
                      <!-- Display selected location -->
                      <div
                        v-if="editForm.locationId && editForm.location"
                        class="mt-2 flex items-center bg-primary-50 p-2 rounded-md"
                      >
                        <i
                          class="pi pi-map-marker mr-2 text-primary-500 text-sm"
                        ></i>
                        <span class="text-sm font-medium text-primary-700">
                          {{ editForm.location }}
                        </span>
                      </div>
                    </div>
                    <div class="form-group">
                      <label
                        for="dateOfBirth"
                        class="font-medium text-gray-700 mb-1 block text-sm"
                        ><i class="pi pi-calendar text-primary-400 mr-1"></i
                        >Date of Birth</label
                      >
                      <Calendar
                        id="dateOfBirth"
                        v-model="editForm.dateOfBirth"
                        dateFormat="yy-mm-dd"
                        :showIcon="true"
                        :maxDate="maxDate"
                        class="w-full shadow-sm"
                        style="border-radius: 0.5rem; background-color: #f9fafb"
                        placeholder="Select date of birth"
                        :pt="{
                          input: {
                            style:
                              'border-radius: 0.5rem; background-color: #f9fafb; padding: 0.5rem 0.75rem;',
                          },
                          trigger: {
                            class: 'visible opacity-100',
                            style: 'color: var(--primary-600); display: flex;',
                          },
                        }"
                      />
                    </div>
                    <div class="form-group">
                      <label
                        for="race"
                        class="font-medium text-gray-700 mb-1 block text-sm"
                        ><i class="pi pi-users text-primary-400 mr-1"></i
                        >Ethnicity</label
                      >
                      <Dropdown
                        id="race"
                        v-model="editForm.race"
                        :options="raceOptions"
                        optionLabel="label"
                        optionValue="value"
                        class="w-full shadow-sm"
                        style="border-radius: 0.5rem; background-color: #f9fafb"
                        placeholder="Select ethnicity"
                        :showClear="false"
                      />
                    </div>
                    <div class="form-group">
                      <label
                        for="gender"
                        class="font-medium text-gray-700 mb-1 block text-sm"
                        ><i class="pi pi-user text-primary-400 mr-1"></i
                        >Gender</label
                      >
                      <Dropdown
                        id="gender"
                        v-model="editForm.gender"
                        :options="genderOptions"
                        optionLabel="label"
                        optionValue="value"
                        class="w-full shadow-sm"
                        style="border-radius: 0.5rem; background-color: #f9fafb"
                        placeholder="Select gender"
                        :showClear="false"
                      />
                    </div>
                    <div class="form-group">
                      <label
                        for="employmentStatus"
                        class="font-medium text-gray-700 mb-1 block text-sm"
                      >
                        <i class="pi pi-briefcase text-primary-400 mr-1"></i>
                        Employment Status
                      </label>
                      <Dropdown
                        id="employmentStatus"
                        v-model="editForm.employmentStatus"
                        :options="employmentStatusOptions"
                        optionLabel="label"
                        optionValue="value"
                        class="w-full shadow-sm"
                        style="border-radius: 0.5rem; background-color: #f9fafb"
                        placeholder="Select employment status"
                        :showClear="false"
                      />
                    </div>
                    <div class="form-group">
                      <label
                        for="languages"
                        class="font-medium text-gray-700 mb-1 block text-sm"
                      >
                        <i class="pi pi-comment text-primary-400 mr-1"></i>
                        Languages
                      </label>
                      <MultiSelect
                        id="languages"
                        v-model="editForm.languages"
                        :options="languageOptions"
                        optionLabel="label"
                        optionValue="value"
                        display="chip"
                        class="w-full shadow-sm"
                        style="border-radius: 0.5rem; background-color: #f9fafb"
                        placeholder="Select languages"
                      />
                    </div>
                  </div>

                  <div class="mt-8">
                    <label
                      for="bio"
                      class="font-medium text-gray-700 mb-1 block text-sm"
                      ><i class="pi pi-user-edit text-primary-400 mr-1"></i
                      >About Me</label
                    >
                    <Textarea
                      id="bio"
                      v-model="editForm.bio"
                      rows="4"
                      class="w-full shadow-sm"
                      style="
                        border-radius: 0.5rem;
                        background-color: #f9fafb;
                        padding: 0.5rem 0.75rem;
                      "
                      placeholder="Tell us about yourself"
                    />
                  </div>

                  <div
                    class="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100"
                  >
                    <Button
                      type="button"
                      label="Cancel"
                      class="p-button-outlined"
                      style="border-radius: 0.5rem; padding: 0.5rem 1rem"
                      @click="cancelEditBasicInfo"
                    />
                    <Button
                      type="submit"
                      label="Save Changes"
                      style="
                        border-radius: 0.5rem;
                        padding: 0.5rem 1rem;
                        font-weight: 500;
                      "
                      :loading="saving"
                      :disabled="saving"
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>

          <!-- Resume Section -->
          <div v-show="activeSection === 'resume'" class="animate-fadeIn">
            <!-- AI evaluation notification -->
            <div
              class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 shadow-sm"
            >
              <div class="flex items-start">
                <i
                  class="pi pi-info-circle text-blue-500 mt-0.5 mr-3 text-lg"
                ></i>
                <div>
                  <h4 class="text-blue-700 font-medium mb-1">
                    Resume Optimization Tip
                  </h4>
                  <p class="text-sm text-blue-600">
                    Your resume will be analyzed by AI when applying for jobs. A
                    well-formatted, clear resume with relevant skills and
                    experience significantly improves your chances of selection.
                  </p>
                </div>
              </div>
            </div>
            <div
              class="rounded-xl shadow-md border mb-5 bg-white overflow-hidden transition-all duration-300 hover:shadow-lg"
            >
              <div
                class="flex justify-between items-center p-4 md:p-5 border-b bg-gradient-to-r from-primary-50 to-white"
              >
                <h2
                  class="text-lg font-semibold text-gray-800 flex items-center"
                >
                  <i class="pi pi-file-pdf text-primary-500 mr-2"></i>
                  Resume
                </h2>
                <Button
                  icon="pi pi-upload"
                  label="Upload Resume"
                  class="p-button-outlined p-button-sm"
                  @click="resumeFileInput.click()"
                />
                <input
                  type="file"
                  ref="resumeFileInput"
                  style="display: none"
                  accept=".pdf,application/pdf"
                  @change="handleResumeUpload"
                />
              </div>

              <div class="p-6">
                <!-- Resume display -->
                <div
                  v-if="profile?.resumeUrl"
                  class="flex flex-col md:flex-row md:items-center md:justify-between p-5 border rounded-lg bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary-200"
                >
                  <div class="flex items-center mb-3 md:mb-0">
                    <div
                      class="bg-primary-100 w-10 h-10 rounded-full flex items-center justify-center mr-4 shadow-sm"
                    >
                      <i class="pi pi-file-pdf text-primary-600 text-lg"></i>
                    </div>
                    <div>
                      <p class="font-medium text-gray-800">Your Resume</p>
                      <p class="text-sm text-gray-500 flex items-center">
                        <i
                          class="pi pi-clock text-primary-400 mr-1 text-xs"
                        ></i>
                        Uploaded {{ formatResumeUploadDate() }}
                      </p>
                    </div>
                  </div>
                  <div class="flex gap-3">
                    <Button
                      icon="pi pi-download"
                      label="Download"
                      class="p-button-outlined p-button-sm bg-white"
                      @click="downloadResume"
                    />
                    <Button
                      icon="pi pi-trash"
                      class="p-button-outlined p-button-danger p-button-sm"
                      @click="deleteResume"
                    />
                  </div>
                </div>

                <!-- No resume state -->
                <div
                  v-else
                  class="text-center p-8 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 transition-all duration-300 hover:border-primary-200"
                >
                  <div
                    class="bg-white w-16 h-16 inline-flex items-center justify-center rounded-full mb-4 shadow-sm"
                  >
                    <i class="pi pi-file-pdf text-gray-400 text-2xl"></i>
                  </div>
                  <p class="text-gray-700 font-medium mb-2 text-base">
                    No resume uploaded yet
                  </p>
                  <p class="text-sm text-gray-500 mb-4 max-w-md mx-auto">
                    Upload your resume to pre-fill job applications and increase
                    your chances of being hired quickly
                  </p>
                  <Button
                    icon="pi pi-upload"
                    label="Upload Resume"
                    class="p-button-sm shadow-sm"
                    @click="resumeFileInput.click()"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Photos Section -->
          <div v-show="activeSection === 'photos'" class="animate-fadeIn">
            <div
              class="rounded-xl shadow-md border mb-4 md:mb-5 bg-white overflow-hidden transition-all duration-300 hover:shadow-lg"
            >
              <div
                class="flex justify-between items-center p-3 md:p-5 border-b bg-gradient-to-r from-primary-50 to-white"
              >
                <h2
                  class="text-base md:text-lg font-semibold text-gray-800 flex items-center"
                >
                  <i class="pi pi-images text-primary-500 mr-2"></i>
                  Comp Card & Self Photos
                  <span
                    v-if="compcardPhotos.length >= 3"
                    class="ml-2 text-xs font-normal bg-gray-100 text-gray-600 py-1 px-2 rounded-full"
                  >
                    Maximum reached (3)
                  </span>
                </h2>
                <Button
                  v-if="compcardPhotos.length < 3"
                  icon="pi pi-upload"
                  label="Upload Photo"
                  class="p-button-outlined p-button-sm"
                  @click="compcardFileInput.click()"
                />
                <Button
                  v-else
                  icon="pi pi-exclamation-circle"
                  label="Maximum reached (3)"
                  class="p-button-sm p-button-secondary"
                  disabled
                />
                <input
                  type="file"
                  ref="compcardFileInput"
                  style="display: none"
                  accept="image/*"
                  @change="handleCompcardUpload"
                />
              </div>

              <div class="p-4 md:p-6">
                <!-- Info Card -->
                <div
                  class="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4 mb-4 md:mb-6"
                >
                  <div class="flex items-start">
                    <i
                      class="pi pi-info-circle text-blue-500 mr-2 md:mr-3 mt-0.5 text-base md:text-lg"
                    ></i>
                    <div>
                      <h3
                        class="text-blue-700 font-medium mb-1 text-sm md:text-base"
                      >
                        Comp Card & Self Photos Guidelines (Maximum 3 Photos)
                      </h3>
                      <p class="text-blue-600 text-xs md:text-sm">
                        You can upload up to 3 photos total:
                        <br />
                        <strong>1. Self Photos:</strong> Recent photos of
                        yourself with a clear face (no masks) for general
                        identification.
                        <br />
                        <strong>2. Comp Card Photos:</strong> Professional
                        photos for modeling and brand ambassador roles.
                        <span
                          class="cursor-pointer text-primary-600 font-medium ml-1 hover:underline"
                          @click="showSampleDialog = true"
                        >
                          See examples
                          <i class="pi pi-external-link text-xs"></i>
                        </span>
                        <br />
                        <strong>Recommendation:</strong> Upload one comp card
                        photo, one full body shot, and one half body shot.
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Photo Gallery Section -->
                <div
                  v-if="loadingPhotos"
                  class="flex justify-center py-8 md:py-12"
                >
                  <div class="animate-pulse flex flex-col items-center">
                    <i
                      class="pi pi-spin pi-spinner text-primary-500 text-2xl md:text-4xl mb-2"
                    ></i>
                    <p class="text-primary-500 text-sm md:text-base">
                      Loading your photos...
                    </p>
                  </div>
                </div>

                <div
                  v-else-if="compcardPhotos.length > 0"
                  class="gallery-container"
                >
                  <!-- Gallery Grid -->
                  <div
                    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4"
                  >
                    <div
                      v-for="(photo, index) in compcardPhotos"
                      :key="index"
                      class="photo-card relative group overflow-hidden rounded-lg bg-gray-100 shadow-sm hover:shadow-md transition-all"
                      @click="openPhotoPreview(photo, index)"
                    >
                      <div class="relative aspect-square overflow-hidden">
                        <img
                          v-if="photo.url"
                          :src="photo.url"
                          :alt="`Comp Card Photo ${index + 1}`"
                          class="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-300"
                          @error="
                            console.error('Image load error');
                            $event.target.src = fileService.getCompcardUrl(
                              photo.comcardUrl
                            );
                          "
                          style="object-fit: cover; width: 100%; height: 100%"
                        />
                        <div
                          v-else
                          class="w-full h-full flex items-center justify-center bg-gray-200"
                        >
                          <i
                            class="pi pi-image text-gray-400 text-2xl md:text-3xl"
                          ></i>
                        </div>
                      </div>

                      <!-- Actions Overlay -->
                      <div
                        class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300"
                      >
                        <div
                          class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0 duration-300"
                        >
                          <Button
                            icon="pi pi-eye"
                            class="p-button-rounded p-button-sm p-button-primary bg-white hover:bg-white text-primary-700 shadow-md border-2 border-white"
                            @click.stop="openPhotoPreview(photo, index)"
                          />
                          <Button
                            icon="pi pi-trash"
                            class="p-button-rounded p-button-sm p-button-danger bg-white hover:bg-white text-danger-600 shadow-md border-2 border-white"
                            @click.stop="confirmPhotoDelete(photo.id)"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  v-else
                  class="text-center py-8 md:py-12 border-2 border-dashed border-gray-200 rounded-xl"
                >
                  <div
                    class="bg-primary-50 inline-flex p-3 md:p-4 rounded-full mb-3 md:mb-4 shadow-sm"
                  >
                    <i
                      class="pi pi-images text-primary-500 text-xl md:text-2xl"
                    ></i>
                  </div>
                  <h3
                    class="text-base md:text-lg font-medium text-gray-700 mb-2"
                  >
                    No photos uploaded yet
                  </h3>
                  <p
                    class="text-xs md:text-sm text-gray-500 mb-3 md:mb-4 max-w-md mx-auto"
                  >
                    Upload photos of yourself to help recruiters recognize you.
                    Clear self photos are great for general identification,
                    while professional comp card photos are ideal for modeling
                    and brand ambassador roles.
                  </p>
                  <Button
                    v-if="compcardPhotos.length < 3"
                    icon="pi pi-upload"
                    label="Upload Your First Photo"
                    class="p-button-sm"
                    @click="compcardFileInput.click()"
                  />
                  <div
                    v-else
                    class="text-yellow-600 flex items-center justify-center gap-2 mt-2 text-sm"
                  >
                    <i class="pi pi-exclamation-circle"></i>
                    <span>Maximum number of photos (3) reached</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Add this section right after the Comp Card & Self Photos section -->
          <!-- Working Photos Section -->
          <div v-show="activeSection === 'photos'" class="animate-fadeIn mt-6">
            <div
              class="rounded-xl shadow-md border mb-5 bg-white overflow-hidden transition-all duration-300 hover:shadow-lg"
            >
              <div
                class="flex justify-between items-center p-4 md:p-5 border-b bg-gradient-to-r from-primary-50 to-white"
              >
                <h2
                  class="text-lg font-semibold text-gray-800 flex items-center"
                >
                  <i class="pi pi-camera text-primary-500 mr-2"></i>
                  Working Photos
                </h2>
                <Button
                  v-if="workingPhotos.length < 3"
                  icon="pi pi-upload"
                  label="Upload Photo"
                  class="p-button-outlined p-button-sm"
                  @click="openWorkingPhotoUploadDialog"
                />
                <Button
                  v-else
                  icon="pi pi-exclamation-circle"
                  label="Maximum reached (3)"
                  class="p-button-sm p-button-secondary"
                  disabled
                />
              </div>

              <div class="p-6">
                <!-- Info Card -->
                <div
                  class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6"
                >
                  <div class="flex items-start">
                    <i
                      class="pi pi-info-circle text-blue-500 mr-3 mt-0.5 text-lg"
                    ></i>
                    <div>
                      <h3 class="text-blue-700 font-medium mb-1">
                        Working Photos Guidelines (Maximum 3 Photos)
                      </h3>
                      <p class="text-blue-600 text-sm">
                        Upload photos of yourself working at events such as:
                        <br />
                        <strong>• Check-in photos</strong> at event venues
                        <br />
                        <strong>• Photos of you serving</strong> or interacting
                        with guests
                        <br />
                        <strong>• Any photos showing you</strong> in action at
                        previous events
                        <br />
                        Each photo can include a description to provide context
                        for recruiters.
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Working Photo Gallery Section -->
                <div
                  v-if="loadingWorkingPhotos"
                  class="flex justify-center py-12"
                >
                  <div class="animate-pulse flex flex-col items-center">
                    <i
                      class="pi pi-spin pi-spinner text-primary-500 text-4xl mb-2"
                    ></i>
                    <p class="text-primary-500">
                      Loading your working photos...
                    </p>
                  </div>
                </div>

                <div
                  v-else-if="workingPhotos.length > 0"
                  class="gallery-container"
                >
                  <!-- Gallery Grid -->
                  <div
                    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                  >
                    <div
                      v-for="(photo, index) in workingPhotos"
                      :key="index"
                      class="photo-card relative group overflow-hidden rounded-lg bg-gray-100 shadow-sm hover:shadow-md transition-all"
                      @click="openWorkingPhotoPreview(photo, index)"
                    >
                      <div class="relative aspect-square overflow-hidden">
                        <img
                          v-if="photo.url"
                          :src="photo.url"
                          :alt="`Working Photo ${index + 1}`"
                          class="w-full h-auto object-cover"
                          @error="handleWorkingPhotoError($event, photo, index)"
                        />
                        <div
                          v-else
                          class="w-full h-full flex items-center justify-center bg-gray-200"
                        >
                          <i class="pi pi-image text-gray-400 text-3xl"></i>
                        </div>
                      </div>

                      <!-- Photo Description -->
                      <div class="p-3 bg-white">
                        <p class="text-sm text-gray-600 line-clamp-2">
                          {{ photo.description || 'No description provided' }}
                        </p>
                      </div>

                      <!-- Actions Overlay -->
                      <div
                        class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300"
                      >
                        <div
                          class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0 duration-300"
                        >
                          <Button
                            icon="pi pi-eye"
                            class="p-button-rounded p-button-sm p-button-primary bg-white hover:bg-white text-primary-700 shadow-md border-2 border-white"
                            @click.stop="openWorkingPhotoPreview(photo, index)"
                          />
                          <Button
                            icon="pi pi-trash"
                            class="p-button-rounded p-button-sm p-button-danger bg-white hover:bg-white text-danger-600 shadow-md border-2 border-white"
                            @click.stop="confirmWorkingPhotoDelete(photo.id)"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  v-else
                  class="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl"
                >
                  <div
                    class="bg-primary-50 inline-flex p-4 rounded-full mb-4 shadow-sm"
                  >
                    <i class="pi pi-camera text-primary-500 text-2xl"></i>
                  </div>
                  <h3 class="text-lg font-medium text-gray-700 mb-2">
                    No working photos uploaded yet
                  </h3>
                  <p class="text-gray-500 mb-4 max-w-md mx-auto">
                    Upload photos of yourself working at events to showcase your
                    experience. These photos help recruiters see your
                    professionalism in action.
                  </p>
                  <Button
                    icon="pi pi-upload"
                    label="Upload Your First Working Photo"
                    class="p-button-sm"
                    @click="openWorkingPhotoUploadDialog"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Work Experience Section -->
          <div
            v-show="activeSection === 'work-experience'"
            class="animate-fadeIn"
          >
            <!-- AI evaluation notification -->
            <div
              class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 shadow-sm"
            >
              <div class="flex items-start">
                <i
                  class="pi pi-info-circle text-blue-500 mt-0.5 mr-3 text-lg"
                ></i>
                <div>
                  <h4 class="text-blue-700 font-medium mb-1">
                    Work Experience Optimization Tip
                  </h4>
                  <p class="text-sm text-blue-600">
                    Your work history will be analyzed by AI during job
                    application assessment. Detailed descriptions of relevant
                    experience and responsibilities significantly improve your
                    match score for similar positions.
                  </p>
                </div>
              </div>
            </div>
            <div
              class="rounded-xl shadow-md border mb-4 md:mb-5 bg-white overflow-hidden transition-all duration-300 hover:shadow-lg"
            >
              <div
                class="flex justify-between items-center p-3 md:p-5 border-b bg-gradient-to-r from-primary-50 to-white"
              >
                <h2
                  class="text-base md:text-lg font-semibold text-gray-800 flex items-center"
                >
                  <i class="pi pi-briefcase text-primary-500 mr-2"></i>
                  Work Experience
                </h2>
                <Button
                  icon="pi pi-plus"
                  label="Add Experience"
                  class="p-button-sm"
                  severity="primary"
                  outlined
                  @click="showAddExperienceDialog = true"
                />
              </div>

              <div class="p-4 md:p-6">
                <!-- Experience list -->
                <div
                  v-if="experiences.length === 0"
                  class="text-center p-4 md:p-8 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 transition-all duration-300 hover:border-primary-200"
                >
                  <div
                    class="bg-white inline-flex p-3 md:p-4 rounded-full mb-3 md:mb-4 shadow-sm"
                  >
                    <i
                      class="pi pi-briefcase text-gray-400 text-xl md:text-2xl"
                    ></i>
                  </div>
                  <p
                    class="text-gray-700 font-medium mb-2 text-sm md:text-base"
                  >
                    You haven't added any work experience yet
                  </p>
                  <p
                    class="text-xs md:text-sm text-gray-500 mb-3 md:mb-4 max-w-md mx-auto"
                  >
                    Add your past event experiences to stand out to employers
                    and improve your chances of getting hired
                  </p>
                  <Button
                    icon="pi pi-plus"
                    label="Add Experience"
                    class="p-button-outlined p-button-primary p-button-sm shadow-sm"
                    @click="showAddExperienceDialog = true"
                  />
                </div>

                <div v-else class="space-y-3 md:space-y-4">
                  <div
                    v-for="(exp, index) in experiences"
                    :key="index"
                    class="border rounded-lg p-3 md:p-4 hover:shadow-md transition-all duration-300 bg-white hover:border-primary-200 group"
                  >
                    <div class="flex flex-col md:flex-row md:justify-between">
                      <div class="flex-1">
                        <div class="flex items-center mb-2 md:mb-3">
                          <div
                            class="bg-primary-100 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center mr-2 md:mr-3 shadow-sm group-hover:bg-primary-200 transition-colors"
                          >
                            <i
                              class="pi pi-briefcase text-primary-600 text-base md:text-lg"
                            ></i>
                          </div>
                          <h3
                            class="font-medium text-sm md:text-base text-gray-800"
                          >
                            {{ formatJobType(exp.jobType) }}
                          </h3>
                        </div>
                        <div class="pl-10 md:pl-12 pr-2 md:pr-4">
                          <p
                            class="text-gray-600 leading-relaxed text-xs md:text-sm bg-gray-50 p-2 md:p-3 rounded-lg shadow-sm"
                          >
                            {{ exp.experienceText }}
                          </p>
                        </div>
                      </div>
                      <div
                        class="flex items-start gap-2 ml-0 md:ml-4 mt-2 md:mt-0 pl-10 md:pl-0"
                      >
                        <Button
                          icon="pi pi-pencil"
                          class="p-button-text p-button-rounded p-button-sm"
                          @click="editExperience(index)"
                        />
                        <Button
                          icon="pi pi-trash"
                          class="p-button-text p-button-rounded p-button-danger p-button-sm"
                          @click="deleteExperience(index)"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Availability Section -->
          <div v-show="activeSection === 'availability'" class="animate-fadeIn">
            <!-- Talent Pool Visibility Component (in a separate card) -->
            <div
              class="rounded-xl shadow-md border mb-8 overflow-hidden bg-white"
            >
              <TalentPoolVisibilityComponent />
            </div>

            <!-- Availability Component (in a separate card) -->
            <div
              class="rounded-xl shadow-md border mb-6 md:mb-8 overflow-hidden bg-white"
            >
              <AvailabilityComponent />
            </div>
          </div>

          <!-- Account Settings Section -->
          <div v-show="activeSection === 'settings'" class="animate-fadeIn">
            <div
              class="rounded-xl shadow-md border mb-5 bg-white overflow-hidden transition-all duration-300 hover:shadow-lg"
            >
              <div
                class="p-4 md:p-5 border-b bg-gradient-to-r from-primary-50 to-white"
              >
                <h2
                  class="text-lg font-semibold text-gray-800 flex items-center"
                >
                  <i class="pi pi-cog text-primary-500 mr-2"></i>
                  Account Settings
                </h2>
              </div>

              <div class="p-6">
                <div class="space-y-6">
                  <div class="border-b pb-6">
                    <h3
                      class="text-base font-medium mb-4 text-gray-800 flex items-center"
                    >
                      <i class="pi pi-user-edit text-primary-500 mr-2"></i>
                      Profile Photo
                    </h3>
                    <div class="flex items-center bg-gray-50 p-4 rounded-xl">
                      <div v-if="hasValidProfilePicture" class="mr-5">
                        <img
                          :src="profilePictureSource"
                          alt="Profile"
                          class="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
                          @error="handleProfileImageError"
                        />
                      </div>
                      <div
                        v-else
                        class="w-20 h-20 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xl font-bold mr-5 border-4 border-white shadow-md"
                      >
                        {{ getInitials(profile?.name) }}
                      </div>

                      <div class="space-y-3">
                        <Button
                          icon="pi pi-camera"
                          label="Change Photo"
                          class="p-button-sm w-full"
                          @click="profilePictureInput.click()"
                        />
                      </div>
                    </div>
                  </div>

                  <div class="space-y-4">
                    <h3
                      class="text-base font-medium mb-2 text-gray-800 flex items-center"
                    >
                      <i class="pi pi-shield text-primary-500 mr-2"></i>
                      Account Management
                    </h3>

                    <div class="border rounded-xl shadow-sm overflow-hidden">
                      <div
                        class="p-4 flex items-center justify-between border-b bg-white hover:bg-gray-50 transition-colors"
                      >
                        <div class="flex items-center">
                          <div
                            class="bg-primary-100 w-10 h-10 rounded-full flex items-center justify-center mr-3 shadow-sm"
                          >
                            <i class="pi pi-lock text-primary-600 text-lg"></i>
                          </div>
                          <div>
                            <h4 class="font-medium text-gray-800 text-sm">
                              Password
                            </h4>
                            <p class="text-xs text-gray-500">
                              Update your password to keep your account secure
                            </p>
                          </div>
                        </div>
                        <Button
                          label="Change"
                          icon="pi pi-pencil"
                          class="p-button-text p-button-sm"
                          @click="showPasswordChangeDialog = true"
                        />
                      </div>

                      <div
                        class="p-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
                      >
                        <div class="flex items-center">
                          <div
                            class="bg-primary-100 w-10 h-10 rounded-full flex items-center justify-center mr-3 shadow-sm"
                          >
                            <i
                              class="pi pi-envelope text-primary-600 text-lg"
                            ></i>
                          </div>
                          <div>
                            <h4 class="font-medium text-gray-800 text-sm">
                              Email Address
                            </h4>
                            <p class="text-xs text-gray-500">
                              Update your email address for notifications
                            </p>
                          </div>
                        </div>
                        <Button
                          label="Update"
                          icon="pi pi-pencil"
                          class="p-button-text p-button-sm"
                          @click="showEmailUpdateDialog = true"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Experience Dialog -->
    <Dialog
      v-model:visible="showAddExperienceDialog"
      :header="
        editingExperienceIndex >= 0
          ? 'Edit Work Experience'
          : 'Add Work Experience'
      "
      :style="{ width: '90vw', maxWidth: '550px' }"
      :modal="true"
      class="experience-dialog rounded-xl p-dialog-mobile"
    >
      <div class="p-fluid">
        <!-- Info Card with Guidelines -->
        <div
          class="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4 mb-4"
          v-if="editingExperienceIndex < 0"
        >
          <div class="flex items-start">
            <i
              class="pi pi-info-circle text-blue-500 mr-2 md:mr-3 mt-0.5 text-base md:text-lg"
            ></i>
            <div>
              <h3 class="text-blue-700 font-medium mb-1 text-sm md:text-base">
                Work Experience Tips
              </h3>
              <p class="text-blue-600 text-xs md:text-sm">
                Adding detailed work experience helps recruiters understand your
                skills and background. Be specific about your role,
                responsibilities, and achievements.
              </p>
            </div>
          </div>
        </div>

        <div class="field mb-3 md:mb-4">
          <label
            for="jobType"
            class="font-medium mb-1 md:mb-2 block text-gray-700 text-xs md:text-sm flex items-center"
          >
            <i class="pi pi-briefcase text-primary-500 mr-2"></i> Job Type
          </label>
          <Dropdown
            id="jobType"
            v-model="experienceForm.jobType"
            :options="jobTypeOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Select job type"
            class="w-full shadow-sm"
            style="border-radius: 0.75rem; background-color: #f9fafb"
          />
        </div>

        <div class="field mb-3 md:mb-4">
          <label
            for="experienceText"
            class="font-medium mb-1 md:mb-2 block text-gray-700 text-xs md:text-sm flex items-center"
          >
            <i class="pi pi-comment text-primary-500 mr-2"></i> Description
          </label>
          <Textarea
            id="experienceText"
            v-model="experienceForm.experienceText"
            rows="5"
            placeholder="Worked as a brand ambassador for Coca-Cola during the Summer Festival 2023. Engaged with customers, distributed samples, and promoted new products."
            class="w-full shadow-sm"
            style="
              border-radius: 0.75rem;
              background-color: #f9fafb;
              padding: 0.75rem 1rem;
            "
          />
          <small class="text-gray-500 mt-1 block text-xs italic">
            Describe your experience, responsibilities, and notable achievements
          </small>
        </div>

        <div
          class="flex justify-end gap-3 mt-4 md:mt-5 pt-3 md:pt-4 border-t border-gray-100"
        >
          <Button
            label="Cancel"
            icon="pi pi-times"
            class="p-button-text p-button-sm md:p-button-md"
            @click="showAddExperienceDialog = false"
          />
          <Button
            label="Save Experience"
            icon="pi pi-check"
            @click="saveExperience"
            :loading="savingExperience"
            class="p-button-sm p-button-primary"
            style="border-radius: 0.75rem"
          />
        </div>
      </div>
    </Dialog>

    <!-- Email Update Dialog -->
    <Dialog
      v-model:visible="showEmailUpdateDialog"
      header="Update Email Address"
      :style="{ width: '500px' }"
      :modal="true"
      class="email-dialog rounded-xl"
    >
      <div class="p-fluid">
        <div class="field mb-4">
          <label
            for="currentEmail"
            class="font-medium mb-2 block text-gray-700 text-sm"
          >
            <i class="pi pi-envelope text-primary-500 mr-2"></i>
            Current Email Address
          </label>
          <div
            class="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700"
          >
            {{ profile?.email || 'No email set' }}
          </div>
        </div>

        <div class="field mb-4">
          <label
            for="newEmail"
            class="font-medium mb-2 block text-gray-700 text-sm"
          >
            <i class="pi pi-envelope-open text-primary-500 mr-2"></i>
            New Email Address
          </label>
          <InputText
            id="newEmail"
            v-model="emailForm.email"
            type="email"
            class="w-full shadow-sm"
            :class="{ 'p-invalid': emailFormErrors.email }"
            style="
              border-radius: 0.5rem;
              background-color: #f9fafb;
              padding: 0.5rem 0.75rem;
            "
            placeholder="Enter your new email address"
          />
          <small v-if="emailFormErrors.email" class="p-error block mt-1">{{
            emailFormErrors.email
          }}</small>
        </div>

        <div
          v-if="emailSubmissionError"
          class="mb-4 p-4 rounded-md bg-red-50 border border-red-200 text-red-600"
        >
          <div class="flex items-center">
            <i class="pi pi-exclamation-circle text-red-500 mr-2"></i>
            <span class="font-medium">{{ emailSubmissionError }}</span>
          </div>
        </div>

        <div class="flex justify-end gap-3 mt-5 pt-4 border-t border-gray-100">
          <Button
            label="Cancel"
            icon="pi pi-times"
            class="p-button-text"
            @click="showEmailUpdateDialog = false"
          />
          <Button
            label="Update Email"
            icon="pi pi-check"
            @click="updateEmail"
            :loading="updatingEmail"
            style="border-radius: 0.75rem"
          />
        </div>
      </div>
    </Dialog>

    <!-- Password Change Dialog -->
    <Dialog
      v-model:visible="showPasswordChangeDialog"
      header="Change Password"
      :style="{ width: '500px' }"
      :modal="true"
      class="password-dialog rounded-xl"
    >
      <div class="p-fluid">
        <div class="field mb-4">
          <label
            for="currentPassword"
            class="font-medium mb-2 block text-gray-700 text-sm"
          >
            <i class="pi pi-lock text-primary-500 mr-2"></i>
            Current Password
          </label>
          <Password
            id="currentPassword"
            v-model="passwordForm.currentPassword"
            toggleMask
            class="w-full shadow-sm"
            :class="{ 'p-invalid': passwordFormErrors.currentPassword }"
            :feedback="false"
            inputClass="w-full"
            :pt="{
              input: {
                style: {
                  borderRadius: '0.5rem',
                  backgroundColor: '#f9fafb',
                  padding: '0.5rem 0.75rem',
                },
              },
            }"
            placeholder="Enter your current password"
          />
          <small
            v-if="passwordFormErrors.currentPassword"
            class="p-error block mt-1"
          >
            {{ passwordFormErrors.currentPassword }}
          </small>
        </div>

        <div class="field mb-4">
          <label
            for="newPassword"
            class="font-medium mb-2 block text-gray-700 text-sm"
          >
            <i class="pi pi-lock-open text-primary-500 mr-2"></i>
            New Password
          </label>
          <Password
            id="newPassword"
            v-model="passwordForm.newPassword"
            toggleMask
            class="w-full shadow-sm"
            :class="{ 'p-invalid': passwordFormErrors.newPassword }"
            :feedback="true"
            inputClass="w-full"
            :pt="{
              input: {
                style: {
                  borderRadius: '0.5rem',
                  backgroundColor: '#f9fafb',
                  padding: '0.5rem 0.75rem',
                },
              },
            }"
            placeholder="Enter your new password"
          />
          <small
            v-if="passwordFormErrors.newPassword"
            class="p-error block mt-1"
          >
            {{ passwordFormErrors.newPassword }}
          </small>
        </div>

        <div class="field mb-4">
          <label
            for="confirmPassword"
            class="font-medium mb-2 block text-gray-700 text-sm"
          >
            <i class="pi pi-check-circle text-primary-500 mr-2"></i>
            Confirm New Password
          </label>
          <Password
            id="confirmPassword"
            v-model="passwordForm.confirmPassword"
            toggleMask
            class="w-full shadow-sm"
            :class="{ 'p-invalid': passwordFormErrors.confirmPassword }"
            :feedback="false"
            inputClass="w-full"
            :pt="{
              input: {
                style: {
                  borderRadius: '0.5rem',
                  backgroundColor: '#f9fafb',
                  padding: '0.5rem 0.75rem',
                },
              },
            }"
            placeholder="Confirm your new password"
          />
          <small
            v-if="passwordFormErrors.confirmPassword"
            class="p-error block mt-1"
          >
            {{ passwordFormErrors.confirmPassword }}
          </small>
        </div>

        <div
          v-if="passwordSubmissionError"
          class="mb-4 p-4 rounded-md bg-red-50 border border-red-200 text-red-600"
        >
          <div class="flex items-center">
            <i class="pi pi-exclamation-circle text-red-500 mr-2"></i>
            <span class="font-medium">{{ passwordSubmissionError }}</span>
          </div>
        </div>

        <div class="flex justify-end gap-3 mt-5 pt-4 border-t border-gray-100">
          <Button
            label="Cancel"
            icon="pi pi-times"
            class="p-button-text"
            @click="showPasswordChangeDialog = false"
          />
          <Button
            label="Change Password"
            icon="pi pi-check"
            @click="changePassword"
            :loading="changingPassword"
            style="border-radius: 0.75rem"
          />
        </div>
      </div>
    </Dialog>

    <!-- Photo Preview Dialog -->
    <Dialog
      v-model:visible="showPhotoPreview"
      :style="{ width: '800px', maxWidth: '95vw' }"
      :showHeader="false"
      :modal="true"
      :dismissableMask="true"
      class="photo-preview-dialog rounded-xl"
    >
      <div class="relative">
        <!-- Close button -->
        <Button
          icon="pi pi-times"
          class="p-button-rounded p-button-text p-button-plain absolute top-2 right-2 z-10"
          @click="showPhotoPreview = false"
        />

        <!-- Navigation buttons -->
        <Button
          v-if="compcardPhotos.length > 1"
          icon="pi pi-chevron-left"
          class="p-button-rounded p-button-text p-button-plain absolute top-1/2 left-2 z-10 transform -translate-y-1/2"
          @click="navigatePhotos('prev')"
        />

        <Button
          v-if="compcardPhotos.length > 1"
          icon="pi pi-chevron-right"
          class="p-button-rounded p-button-text p-button-plain absolute top-1/2 right-2 z-10 transform -translate-y-1/2"
          @click="navigatePhotos('next')"
        />

        <!-- Image -->
        <div class="flex justify-center">
          <img
            :src="currentPhoto?.url"
            alt="Preview"
            class="max-h-[80vh] object-contain"
          />
        </div>
      </div>
    </Dialog>

    <!-- Comp Card Sample Dialog -->
    <Dialog
      v-model:visible="showSampleDialog"
      header="Comp Card Photo Examples"
      :style="{ width: '750px', maxWidth: '95vw' }"
      :modal="true"
      class="sample-dialog rounded-xl"
    >
      <div class="p-6 bg-gradient-to-b from-white to-gray-50">
        <!-- Comp Card Introduction -->
        <div
          class="bg-blue-50 p-5 rounded-xl mb-6 border border-blue-100 shadow-sm"
        >
          <div class="flex items-start">
            <div
              class="bg-blue-500 rounded-full p-2 mr-4 shadow-sm flex-shrink-0"
            >
              <i class="pi pi-info-circle text-white"></i>
            </div>
            <div>
              <h3 class="text-blue-800 font-medium mb-2">
                What is a Comp Card?
              </h3>
              <p class="text-blue-700">
                A comp card (or composite card) is a marketing tool used by
                models and brand ambassadors to showcase their appearance.
                Professional comp card photos highlight your features from
                different angles and demonstrate your versatility.
              </p>
            </div>
          </div>
        </div>

        <!-- Comp Card Example -->
        <div class="mb-6">
          <h3 class="text-gray-800 font-medium mb-4 text-center text-lg">
            Professional Comp Card Example
          </h3>

          <div
            class="bg-white rounded-lg overflow-hidden shadow-md border border-gray-200"
          >
            <div class="p-5 flex justify-center">
              <img
                :src="compCardExampleUrl"
                alt="Comp Card Example"
                class="max-w-full h-auto rounded shadow-sm"
              />
            </div>
            <div class="bg-gray-50 p-3 border-t">
              <p class="text-gray-600 text-sm text-center">
                Professional photos showcasing different angles and expressions
              </p>
            </div>
          </div>
        </div>

        <!-- Professional Tips -->
        <div
          class="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-5 shadow-sm"
        >
          <div class="flex items-start">
            <div
              class="bg-amber-500 rounded-full p-2 mr-4 shadow-sm flex-shrink-0"
            >
              <i class="pi pi-lightbulb text-white"></i>
            </div>
            <div>
              <h4 class="text-amber-800 font-medium mb-3">
                Tips for Professional Comp Card Photos
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="bg-white bg-opacity-60 rounded-lg p-3">
                  <ul class="text-amber-800 space-y-2 pl-5 list-disc">
                    <li>Use professional quality photos with good lighting</li>
                    <li>Ensure clean backgrounds that don't distract</li>
                    <li>Wear professional attire or appropriate styling</li>
                  </ul>
                </div>
                <div class="bg-white bg-opacity-60 rounded-lg p-3">
                  <ul class="text-amber-800 space-y-2 pl-5 list-disc">
                    <li>Show a variety of poses and expressions</li>
                    <li>
                      Choose high-resolution images (at least 1000px tall)
                    </li>
                    <li>Avoid heavy filters or excessive editing</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Close Button -->
        <div class="flex justify-center mt-4">
          <Button
            label="Got it"
            icon="pi pi-check"
            @click="showSampleDialog = false"
            class="p-button-primary px-4"
          />
        </div>
      </div>
    </Dialog>
  </div>

  <!-- Working Photo Upload Dialog -->
  <Dialog
    v-model:visible="showWorkingPhotoUploadDialog"
    modal
    header="Upload Working Photo"
    :style="{ width: '550px' }"
    :closable="true"
    :dismissableMask="true"
    class="working-photo-upload-dialog"
  >
    <div class="p-5">
      <!-- Upload Area -->
      <div class="mb-5">
        <div
          v-if="!selectedWorkingPhotoFile"
          class="border-2 border-dashed border-gray-300 bg-gray-50 rounded-xl p-8 text-center hover:bg-blue-50 hover:border-primary-300 transition-all duration-300 cursor-pointer"
          @click="workingPhotoInput?.click()"
          @dragover.prevent
          @drop.prevent="handleDrop"
        >
          <div class="flex flex-col items-center justify-center">
            <i class="pi pi-cloud-upload text-5xl text-primary-300 mb-4"></i>
            <h3 class="text-lg font-semibold text-gray-700 mb-2">
              Click to select a photo
            </h3>
            <p class="text-gray-500 text-sm mb-3">
              Or drag and drop your file here
            </p>
            <div
              class="bg-white px-4 py-2 rounded-full shadow-sm text-primary-500 text-sm font-medium inline-flex items-center"
            >
              <i class="pi pi-image mr-2"></i>
              Select from device
            </div>
            <div class="mt-4 text-xs text-gray-400">
              Supported formats: JPEG, PNG • Max size: 5MB
            </div>
          </div>
        </div>

        <div v-else class="mb-5">
          <div
            class="relative rounded-xl overflow-hidden shadow-md bg-gray-100"
          >
            <img
              :src="getObjectURL(selectedWorkingPhotoFile)"
              alt="Selected image preview"
              class="w-full max-h-64 object-contain mx-auto"
            />
            <div class="absolute top-2 right-2 flex gap-2">
              <Button
                icon="pi pi-refresh"
                class="p-button-rounded p-button-sm p-button-outlined p-button-secondary"
                @click.stop="workingPhotoInput?.click()"
                v-tooltip.top="'Change photo'"
              />
              <Button
                icon="pi pi-times"
                class="p-button-rounded p-button-sm p-button-outlined p-button-danger"
                @click.stop="selectedWorkingPhotoFile = null"
                v-tooltip.top="'Remove photo'"
              />
            </div>
          </div>
          <div class="flex items-center mt-2 bg-primary-50 p-3 rounded-lg">
            <i class="pi pi-file text-primary-500 mr-2"></i>
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-700 truncate">
                {{ selectedWorkingPhotoFile.name }}
              </p>
              <p class="text-xs text-gray-500">
                {{ (selectedWorkingPhotoFile.size / 1024).toFixed(0) }}KB •
                {{ selectedWorkingPhotoFile.type.split('/')[1].toUpperCase() }}
              </p>
            </div>
          </div>
        </div>

        <input
          ref="workingPhotoInput"
          type="file"
          hidden
          accept="image/*"
          @change="handleWorkingPhotoChange"
        />
      </div>

      <!-- Photo Description Input -->
      <div class="mb-3">
        <label
          for="workingPhotoDescription"
          class="block text-gray-700 font-medium mb-2 flex items-center"
        >
          <i class="pi pi-pencil text-primary-400 mr-2"></i>
          Photo Description
        </label>
        <Textarea
          id="workingPhotoDescription"
          v-model="workingPhotoDescription"
          rows="3"
          placeholder="Describe this photo (e.g., 'Working as a promoter at ABC Event', 'Serving drinks at XYZ event')"
          class="w-full"
          autoResize
        />
        <small class="flex items-center mt-2 text-gray-500">
          <i class="pi pi-info-circle mr-1 text-xs"></i>
          This description helps recruiters understand the context of your photo
        </small>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-between w-full px-3">
        <Button
          label="Cancel"
          icon="pi pi-times"
          @click="showWorkingPhotoUploadDialog = false"
          class="p-button-text"
        />
        <Button
          label="Upload"
          icon="pi pi-upload"
          @click="uploadWorkingPhoto"
          :loading="loadingWorkingPhotos"
          :disabled="!selectedWorkingPhotoFile"
          class="p-button-primary"
        />
      </div>
    </template>
  </Dialog>

  <!-- Working Photo Preview Dialog -->
  <Dialog
    v-model:visible="workingPhotoDialogVisible"
    modal
    :header="`Working Photo ${workingPhotoPreviewIndex + 1}`"
    :style="{ width: '90vw', maxWidth: '768px' }"
    :closable="true"
    :dismissableMask="true"
  >
    <div class="p-4">
      <div v-if="selectedWorkingPhoto" class="flex flex-col">
        <div
          class="relative mx-auto max-w-full max-h-[70vh] overflow-hidden rounded-lg shadow-lg"
        >
          <img
            :src="
              selectedWorkingPhoto.photoUrl ||
              selectedWorkingPhoto.url ||
              selectedWorkingPhoto.imageUrl ||
              selectedWorkingPhoto.backupUrl ||
              ''
            "
            :alt="`Working Photo ${workingPhotoPreviewIndex + 1}`"
            class="max-h-[70vh] max-w-full object-contain"
            @error="
              handleWorkingPhotoError(
                $event,
                selectedWorkingPhoto,
                workingPhotoPreviewIndex
              )
            "
          />
        </div>

        <!-- Photo Description -->
        <div class="mt-4 bg-gray-50 p-4 rounded-lg">
          <h3 class="text-gray-700 font-medium mb-2">Photo Description</h3>
          <p class="text-gray-600">
            {{ selectedWorkingPhoto.description || 'No description provided' }}
          </p>
        </div>
      </div>
    </div>

    <template #footer>
      <Button
        label="Close"
        icon="pi pi-times"
        @click="workingPhotoDialogVisible = false"
        class="p-button-text"
      />
      <Button
        label="Delete"
        icon="pi pi-trash"
        class="p-button-danger p-button-text"
        @click="
          confirmWorkingPhotoDelete(selectedWorkingPhoto.id);
          workingPhotoDialogVisible = false;
        "
      />
    </template>
  </Dialog>
</template>

<script setup>
import {
  ref,
  computed,
  watch,
  onMounted,
  nextTick,
  onBeforeUnmount,
  onBeforeMount,
} from 'vue';
import { useProfileStore } from '@/stores/profile';
import { useAuthStore } from '@/stores/auth';
import { format, parseISO } from 'date-fns';
import { apiClient } from '@/services/api.service';
import candidateService from '@/services/candidate.service';
import Password from 'primevue/password';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import Dialog from 'primevue/dialog';
import Calendar from 'primevue/calendar';
import MultiSelect from 'primevue/multiselect';
import Button from 'primevue/button';
import Textarea from 'primevue/textarea';
import { isTokenExpired } from '@/utils/token-handler';
import { useConfirm } from 'primevue/useconfirm';
import Dropdown from 'primevue/dropdown';
import ProgressBar from 'primevue/progressbar';
import InputText from 'primevue/inputtext';
import ConfirmDialog from 'primevue/confirmdialog';
import { useRoute, useRouter } from 'vue-router';
import AvailabilityComponent from '@/components/candidate/Availability.vue';
import LocationSearch from '@/components/shared/LocationSearch.vue';
import fileService from '@/services/file.service';
import TalentPoolVisibilityComponent from '@/components/candidate/TalentPoolVisibility.vue';

// Initialize toast service
const toast = useToast();

// Initialize confirm dialog service
const confirmDialog = useConfirm();

// Initialize stores with explicit error handling
let profileStore;
let authStore;

// Sidebar state for responsive design
const sidebarOpen = ref(true); // Default to open
const windowWidth = ref(0);
const isClient = ref(false);

// Toggle sidebar for mobile view
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};

// Safely check window size on client side only
const updateWindowWidth = () => {
  if (isClient.value) {
    windowWidth.value = window?.innerWidth || 0;
    // Only change sidebar state based on window width after initial load
    if (windowWidth.value >= 768) {
      sidebarOpen.value = true;
    }
  }
};

// Add resize event listener on component mount, and set isClient
onMounted(() => {
  isClient.value = true;
  updateWindowWidth(); // Initial check
  window?.addEventListener('resize', updateWindowWidth);

  console.log('Profile component mounted, activeSection:', activeSection.value);

  // Always fetch experiences on component mount
  console.log('onMounted - Explicitly fetching experiences');
  fetchExperiences();

  // Force fetch photos on component mount if current section is photos
  if (activeSection.value === 'photos') {
    console.log('onMounted - Explicitly fetching photos');
    fetchCompcardPhotos();
  }
});

// Clean up event listener when component is unmounted
onBeforeUnmount(() => {
  if (isClient.value) {
    window?.removeEventListener('resize', updateWindowWidth);
  }
});

// Add this at the start of the script, after variable declarations but before onMounted
// Preload any cached profile picture
onBeforeMount(() => {
  const cachedProfilePicUrl = localStorage.getItem('cachedProfilePictureUrl');
  if (
    cachedProfilePicUrl &&
    (!profile.value || !profile.value.profilePictureUrl)
  ) {
    // Create a minimal profile if needed
    if (!profile.value) {
      profile.value = {};
    }
    // Set the cached URL as the profile picture
    profile.value.profilePictureUrl = cachedProfilePicUrl;
    console.debug('Preloaded cached profile picture URL:', cachedProfilePicUrl);
  }
});

try {
  profileStore = useProfileStore();
  console.log('Profile store initialized successfully');
} catch (e) {
  console.error('Failed to initialize profile store:', e);
  profileStore = {};
}

try {
  authStore = useAuthStore();
  console.log('Auth store initialized successfully:', {
    hasChangePassword: typeof authStore.changePassword === 'function',
    methods: Object.keys(authStore),
  });
} catch (e) {
  console.error('Failed to initialize auth store:', e);
  authStore = {
    changePassword: async () => {
      throw new Error('Auth store not properly initialized');
    },
  };
}

// Debug auth store
console.debug('Auth store initialization:', {
  authStore,
  hasChangePassword: typeof authStore.changePassword === 'function',
  methods: Object.keys(authStore),
});

// Component state
const profile = ref(null);
const loading = ref(true);
const saving = ref(false);
const editingBasicInfo = ref(false);
const editForm = ref({});
const formErrors = ref({});
const maxDate = new Date(new Date().setFullYear(new Date().getFullYear() - 18));
const activeSection = ref('basic-info'); // Track which section is active
const tokenError = ref(null);
const formSubmissionError = ref('');

// Email update state
const showEmailUpdateDialog = ref(false);
const emailForm = ref({ email: '' });
const emailFormErrors = ref({});
const emailSubmissionError = ref('');
const updatingEmail = ref(false);

// Password change state
const showPasswordChangeDialog = ref(false);
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
});
const passwordFormErrors = ref({});
const passwordSubmissionError = ref('');
const changingPassword = ref(false);

// Experience related state
const experiences = ref([]);
const showAddExperienceDialog = ref(false);
const experienceForm = ref({ jobType: null, experienceText: '' });
const savingExperience = ref(false);
const editingExperienceIndex = ref(-1);

// After the other refs
const compcardFileInput = ref(null);
const compcardPhotos = ref([]);
const loadingPhotos = ref(false);
const showPhotoPreview = ref(false);
const showSampleDialog = ref(false);
const currentPhoto = ref(null);
const currentPhotoIndex = ref(0);
const uploadingPhoto = ref(false);

// Add these reactive variables to the component's script setup
// Place this alongside other reactive state declarations
const workingPhotos = ref([]);
const loadingWorkingPhotos = ref(false);
const workingPhotoInput = ref(null);
const showWorkingPhotoUploadDialog = ref(false);
const workingPhotoDescription = ref('');
const selectedWorkingPhotoFile = ref(null);
const selectedWorkingPhoto = ref(null);
const workingPhotoDialogVisible = ref(false);
const workingPhotoPreviewIndex = ref(0);

// Add this next to other refs
const selectedLocation = ref([]);

// Load profile data on component mount
onMounted(async () => {
  loading.value = true;

  try {
    console.log('Attempting to fetch profile from API using apiClient...');

    // Initialize references safely
    profilePictureInput.value = null;
    resumeFileInput.value = null;

    try {
      // First try: Use the apiClient with the configured interceptors
      const response = await apiClient.get('/profile');

      console.log('API Response status:', response.status);

      if (response.status === 200 && response.data) {
        console.log('Profile data received:', response.data);
        profile.value = response.data.data || response.data;

        // Check if we have a profile picture URL, and if it's a relative path
        // Try to load from assets if needed
        if (profile.value && !profile.value.profilePictureUrl) {
          // Check for cached profile picture URL
          const cachedProfilePicUrl = localStorage.getItem(
            'cachedProfilePictureUrl'
          );
          if (cachedProfilePicUrl) {
            console.log(
              'Using cached profile picture from localStorage:',
              cachedProfilePicUrl
            );
            profile.value.profilePictureUrl = cachedProfilePicUrl;
          } else {
            // Try to load default profile picture for this user
            const username = profile.value.username || '';
            if (username) {
              // Check common image formats
              const formats = ['jpg', 'jpeg', 'png', 'gif'];
              for (const format of formats) {
                try {
                  const imgUrl = new URL(
                    `../../assets/profile-pictures/${username}.${format}`,
                    import.meta.url
                  ).href;
                  profile.value.profilePictureUrl = imgUrl;
                  console.log('Found profile picture:', imgUrl);
                  break;
                } catch (e) {
                  // Continue trying other formats
                }
              }
            }
          }
        } else if (profile.value && profile.value.profilePictureUrl) {
          // Use getImageUrl to resolve and possibly cache the profile picture
          const resolvedUrl = getImageUrl(profile.value.profilePictureUrl);
          if (resolvedUrl) {
            // This will also cache the URL in localStorage if needed
            profile.value.profilePictureUrl = resolvedUrl;
          }
        }

        loadExperiencesAndAvailability();

        // Ensure we set loading to false even if there's an issue loading experiences
        loading.value = false;
        return;
      }
    } catch (apiClientError) {
      console.warn('apiClient failed, trying direct fetch:', apiClientError);

      // Second try: Use direct fetch as fallback
      const token = localStorage.getItem('accessToken') || '';
      const directResponse = await fetch('http://localhost:8080/api/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });

      console.log('Direct fetch response status:', directResponse.status);

      if (directResponse.ok) {
        const data = await directResponse.json();
        console.log('Profile data received via direct fetch:', data);
        profile.value = data.data || data;

        // Check if we have a profile picture URL, and if it's a relative path
        if (profile.value && !profile.value.profilePictureUrl) {
          // Check for cached profile picture URL
          const cachedProfilePicUrl = localStorage.getItem(
            'cachedProfilePictureUrl'
          );
          if (cachedProfilePicUrl) {
            console.log(
              'Using cached profile picture from localStorage:',
              cachedProfilePicUrl
            );
            profile.value.profilePictureUrl = cachedProfilePicUrl;
          } else {
            // Try to load default profile picture for this user
            const username = profile.value.username || '';
            if (username) {
              // Check common image formats
              const formats = ['jpg', 'jpeg', 'png', 'gif'];
              for (const format of formats) {
                try {
                  const imgUrl = new URL(
                    `../../assets/profile-pictures/${username}.${format}`,
                    import.meta.url
                  ).href;
                  profile.value.profilePictureUrl = imgUrl;
                  console.log('Found profile picture:', imgUrl);
                  break;
                } catch (e) {
                  // Continue trying other formats
                }
              }
            }
          }
        } else if (profile.value && profile.value.profilePictureUrl) {
          // Use getImageUrl to resolve and possibly cache the profile picture
          const resolvedUrl = getImageUrl(profile.value.profilePictureUrl);
          if (resolvedUrl) {
            // This will also cache the URL in localStorage if needed
            profile.value.profilePictureUrl = resolvedUrl;
          }
        }

        loadExperiencesAndAvailability();
        loading.value = false;
        return;
      } else {
        console.error(
          'Direct fetch failed with status:',
          directResponse.status
        );
        throw new Error(
          `Direct fetch failed with status ${directResponse.status}`
        );
      }
    }
  } catch (error) {
    console.error('Error fetching profile data:', error);

    // Check if this is a token-related error (401 or 403)
    const isAuthError =
      error.response?.status === 401 || error.response?.status === 403;

    // Check if we have an expired token
    const token = localStorage.getItem('accessToken');
    const hasExpiredToken = token && isTokenExpired(token);

    // Only show error toast if it's not an auth error
    // Auth errors will be handled by the API interceptor
    if (!isAuthError && !hasExpiredToken) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load profile data. Please try again later.',
        life: 5000,
      });
    }

    loading.value = false;
  }

  // Helper function to load experiences and availability
  async function loadExperiencesAndAvailability() {
    // Try to fetch experiences using candidate service
    try {
      await fetchExperiences();
    } catch (expError) {
      console.warn('Failed to fetch experiences:', expError);
      experiences.value = [];
    }

    // Try to fetch availability using candidate service
    try {
      await fetchAvailability();
    } catch (availError) {
      console.warn('Failed to fetch availability:', availError);
      availableDates.value = [];
    }
  }

  // Load comp card photos if 'photos' section is active
  if (activeSection.value === 'photos') {
    console.log('Initial load - photos section is active, fetching photos');
    fetchCompcardPhotos();
    fetchWorkingPhotos(); // Also fetch working photos
  }

  // Load experiences if 'work-experience' section is active
  if (activeSection.value === 'work-experience') {
    console.log(
      'Initial load - work experience section is active, fetching experiences'
    );
    fetchExperiences();
  }

  // Load availability if 'availability' section is active
  if (activeSection.value === 'availability') {
    console.log(
      'Initial load - availability section is active, fetching availability'
    );
    fetchAvailability();
  }

  // Watch for activeSection changes to load data when needed
  watch(activeSection, (newValue, oldValue) => {
    console.log(`Section changed from ${oldValue} to ${newValue}`);

    if (newValue === 'photos') {
      console.log('Photos section is now active, fetching photos');
      fetchCompcardPhotos();
      fetchWorkingPhotos();
    } else if (newValue === 'work-experience') {
      console.log('Work experience section is active, fetching experiences');
      fetchExperiences();
    } else if (newValue === 'availability') {
      console.log('Availability section is active, fetching available dates');
      fetchAvailability();
    }
  });

  // Fetch working photos when photos section is active
  if (activeSection.value === 'photos') {
    fetchWorkingPhotos();
  }
});

// Email update actions
const updateEmail = async () => {
  updatingEmail.value = true;
  emailSubmissionError.value = '';
  emailFormErrors.value = {};

  try {
    // Validate email format
    if (
      !emailForm.value.email ||
      !emailForm.value.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    ) {
      emailFormErrors.value.email = 'Please enter a valid email address';
      throw new Error('Invalid email format');
    }

    // Check if new email is the same as current email
    if (emailForm.value.email === profile.value?.email) {
      emailFormErrors.value.email = 'Please enter a different email address';
      throw new Error('New email is the same as current email');
    }

    // Update email on the API
    const response = await candidateService.updateEmail(emailForm.value.email);

    // Axios returns data object directly
    if (response && response.status >= 200 && response.status < 300) {
      // Update local state with the response data or just the new email
      const updatedProfile = response.data?.data || response.data || {};
      profile.value = {
        ...profile.value,
        email: updatedProfile.email || emailForm.value.email,
      };

      // Show success message
      const successMessage = document.createElement('div');
      successMessage.className =
        'p-4 mb-4 bg-green-50 text-green-700 rounded-lg border border-green-100 flex items-center';
      successMessage.innerHTML =
        '<i class="pi pi-check-circle mr-2 text-green-500"></i> Email updated successfully!';

      // Find container to insert the message
      const container = document.querySelector('.w-full.max-w-4xl');
      if (container) {
        container.insertBefore(successMessage, container.firstChild);

        // Remove after 5 seconds
        setTimeout(() => {
          successMessage.remove();
        }, 5000);
      }

      // Reset form and close dialog
      emailForm.value = { email: '' };
      showEmailUpdateDialog.value = false;
    } else {
      throw new Error('Failed to update email. Please try again.');
    }
  } catch (error) {
    console.error('Email update error:', error);

    // Handle different error formats
    let errorMessage = 'Failed to update email. Please try again.';

    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    emailSubmissionError.value = errorMessage;
  } finally {
    updatingEmail.value = false;
  }
};

// Password change functions
const validatePasswordForm = () => {
  const errors = {};
  let isValid = true;

  // Reset errors
  passwordFormErrors.value = {};

  // Validate current password
  if (!passwordForm.value.currentPassword.trim()) {
    errors.currentPassword = 'Current password is required';
    isValid = false;
  }

  // Validate new password
  if (!passwordForm.value.newPassword.trim()) {
    errors.newPassword = 'New password is required';
    isValid = false;
  } else if (passwordForm.value.newPassword.length < 8) {
    errors.newPassword = 'Password must be at least 8 characters long';
    isValid = false;
  } else if (
    passwordForm.value.newPassword === passwordForm.value.currentPassword
  ) {
    errors.newPassword =
      'New password must be different from your current password';
    isValid = false;
  }

  // Validate confirm password
  if (!passwordForm.value.confirmPassword.trim()) {
    errors.confirmPassword = 'Please confirm your new password';
    isValid = false;
  } else if (
    passwordForm.value.confirmPassword !== passwordForm.value.newPassword
  ) {
    errors.confirmPassword = 'Passwords do not match';
    isValid = false;
  }

  // Update form errors
  passwordFormErrors.value = errors;
  return isValid;
};

const changePassword = async () => {
  // Validate form first
  if (!validatePasswordForm()) {
    return;
  }

  changingPassword.value = true;
  passwordSubmissionError.value = '';
  // Clear any previous error messages
  passwordFormErrors.value = {};

  try {
    // Tell API client not to auto-refresh token for this specific request
    const response = await candidateService.changePassword(
      passwordForm.value.currentPassword,
      passwordForm.value.newPassword,
      passwordForm.value.confirmPassword
    );

    // Success case - only proceed with logout if we get a successful response
    if (response && response.status >= 200 && response.status < 300) {
      // Reset form and close dialog
      passwordForm.value = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      };
      showPasswordChangeDialog.value = false;

      // Create a full-screen overlay
      const overlay = document.createElement('div');
      overlay.className =
        'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity';
      overlay.style.backdropFilter = 'blur(2px)';
      document.body.appendChild(overlay);

      // Create centered success message card
      const successCard = document.createElement('div');
      successCard.className =
        'bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 transform transition-transform animate-fade-in-up';

      // Create a counter variable for countdown
      let secondsLeft = 3;

      // Initial content with countdown
      successCard.innerHTML = `
        <div class="text-center mb-2">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
            <i class="pi pi-check-circle text-3xl"></i>
          </div>
          <h2 class="text-xl font-bold text-gray-800 mb-2">Password Changed Successfully!</h2>
          <p class="text-gray-600 mb-5">Your password has been updated. You'll need to log in again with your new password.</p>
          
          <div class="w-full bg-gray-200 h-2 rounded-full mb-5 overflow-hidden">
            <div id="progress-bar" class="bg-green-500 h-full rounded-full transition-all duration-1000" style="width: 100%;"></div>
          </div>
          
          <div class="flex flex-col space-y-3">
            <p class="text-sm text-gray-500">Automatically logging out in <span id="countdown" class="font-bold text-green-600">${secondsLeft}</span> seconds</p>
            <button id="logout-now" class="w-full py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
              Logout Now
            </button>
          </div>
        </div>
      `;

      // Add the success card to the overlay
      overlay.appendChild(successCard);

      // Get references to dynamic elements
      const countdownEl = successCard.querySelector('#countdown');
      const progressBar = successCard.querySelector('#progress-bar');
      const logoutNowBtn = successCard.querySelector('#logout-now');

      // Define the logout function that also removes the overlay
      const performLogout = () => {
        // Start fade-out animation
        overlay.classList.add('opacity-0');

        // Remove the overlay after animation completes
        setTimeout(() => {
          if (document.body.contains(overlay)) {
            document.body.removeChild(overlay);
          }

          // Perform the actual logout
          if (typeof authStore?.logout === 'function') {
            authStore.logout();
          } else {
            // Manual logout if auth store is not available
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            window.location.href = '/login';
          }
        }, 300); // Match this with CSS transition duration
      };

      // Add event listener to the Logout Now button
      logoutNowBtn.addEventListener('click', performLogout);

      // Start the countdown
      const countdownInterval = setInterval(() => {
        secondsLeft--;
        countdownEl.textContent = secondsLeft;

        // Update progress bar width
        progressBar.style.width = `${(secondsLeft / 3) * 100}%`;

        if (secondsLeft <= 0) {
          clearInterval(countdownInterval);
          performLogout();
        }
      }, 1000);

      // Add a CSS transition for smooth fade-out
      overlay.style.transition = 'opacity 300ms ease-out';
    }
  } catch (error) {
    console.error('Password change error:', error);

    // Handle the specific "Current password is incorrect" error
    if (
      error.response?.status === 401 ||
      error.response?.data?.message === 'Current password is incorrect' ||
      error.isPasswordError
    ) {
      // Set the error directly on the form field
      passwordFormErrors.value.currentPassword =
        'Current password is incorrect';
    } else if (
      error.response?.data?.message &&
      (error.response.data.message.includes('same as') ||
        error.response.data.message.includes('must be different'))
    ) {
      // Handle new password same as old password error
      passwordFormErrors.value.newPassword =
        'New password must be different from your current password';
    } else {
      // Handle other errors
      passwordSubmissionError.value =
        error.response?.data?.message ||
        'Failed to change password. Please try again.';
    }
  } finally {
    changingPassword.value = false;
  }
};

// Availability related state
const availableDates = ref([]);
const showAvailabilityDialog = ref(false);
const selectedDates = ref([]);
const savingAvailability = ref(false);

// File upload refs
const resumeFileInput = ref(null);
const profilePictureInput = ref(null);
const uploadingResume = ref(false);
const uploadingProfilePicture = ref(false);

// Helper functions for formatting and display
const getInitials = (name) => {
  if (!name) return 'U';
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

const formatDate = (dateString) => {
  if (!dateString) return 'Not provided';
  try {
    return format(parseISO(dateString), 'MMMM d, yyyy');
  } catch (e) {
    return dateString;
  }
};

const formatAvailabilityDate = (dateString) => {
  if (!dateString) return '';
  try {
    return format(parseISO(dateString), 'EEE, MMM d, yyyy');
  } catch (e) {
    return dateString;
  }
};

const getLocation = (profile) => {
  // Check if preferredLocation exists in the profile (API response)
  if (profile?.preferredLocation) {
    try {
      // Check if it's a JSON string (starts with {)
      if (
        typeof profile.preferredLocation === 'string' &&
        profile.preferredLocation.trim().startsWith('{')
      ) {
        const locationObj = JSON.parse(profile.preferredLocation);
        return (
          locationObj.name || locationObj.address || 'Location not available'
        );
      }

      // Check if it's already an object
      if (
        typeof profile.preferredLocation === 'object' &&
        profile.preferredLocation !== null
      ) {
        return (
          profile.preferredLocation.name ||
          profile.preferredLocation.address ||
          'Location not available'
        );
      }

      // It's a simple string, return as is
      return profile.preferredLocation;
    } catch (error) {
      console.error('Error parsing location:', error);
      return String(profile.preferredLocation);
    }
  }

  // Check if location exists in the profile (fallback)
  if (profile?.location) {
    try {
      // Check if it's a JSON string (starts with {)
      if (
        typeof profile.location === 'string' &&
        profile.location.trim().startsWith('{')
      ) {
        const locationObj = JSON.parse(profile.location);
        return (
          locationObj.name || locationObj.address || 'Location not available'
        );
      }

      // Check if it's already an object
      if (typeof profile.location === 'object' && profile.location !== null) {
        return (
          profile.location.name ||
          profile.location.address ||
          'Location not available'
        );
      }

      // It's a simple string, return as is
      return profile.location;
    } catch (error) {
      console.error('Error parsing location:', error);
      return String(profile.location);
    }
  }

  // Return default message if neither exists
  return 'No location set';
};

const formatResumeUploadDate = () => {
  if (!profile.value?.resumeUploadedAt) return 'Recently';
  try {
    return format(parseISO(profile.value.resumeUploadedAt), 'MMM d, yyyy');
  } catch {
    return 'Recently';
  }
};

// Format image URLs properly
const getImageUrl = (url) => {
  if (!url) {
    // Check if we have a cached profile picture URL in localStorage
    const cachedProfilePicUrl = localStorage.getItem('cachedProfilePictureUrl');
    if (cachedProfilePicUrl) {
      console.debug('Using cached profile picture URL from localStorage');
      return cachedProfilePicUrl;
    }
    return ''; // Return empty string for null/undefined URLs
  }

  // Check for invalid URL patterns first
  if (
    typeof url === 'string' &&
    (url.includes('/undefined') || url.includes('undefined'))
  ) {
    console.debug('Invalid image URL detected and handled:', url);

    // Check for cached URL if available
    const cachedProfilePicUrl = localStorage.getItem('cachedProfilePictureUrl');
    if (cachedProfilePicUrl) {
      console.debug(
        'Using cached profile picture URL from localStorage instead of invalid URL'
      );
      return cachedProfilePicUrl;
    }

    return ''; // Return empty string to avoid broken images
  }

  // Use the fileService to get the proper URL based on the new backend structure
  return fileService.getFileUrl(url);
};

// Options for dropdowns (needed for formatting methods)
const genderOptions = [
  { label: 'Male', value: 'MALE' },
  { label: 'Female', value: 'FEMALE' },
  { label: 'Other', value: 'OTHER' },
  { label: 'Prefer not to say', value: 'UNDISCLOSED' },
];

const raceOptions = [
  { label: 'Malay', value: 'MALAY' },
  { label: 'Chinese', value: 'CHINESE' },
  { label: 'Indian', value: 'INDIAN' },
  { label: 'Other', value: 'OTHER' },
];

const employmentStatusOptions = [
  { label: 'Full-time', value: 'FULL_TIME' },
  { label: 'Part-time', value: 'PART_TIME' },
  { label: 'Student', value: 'STUDENT' },
  { label: 'Unemployed', value: 'UNEMPLOYED' },
  { label: 'Self-employed', value: 'SELF_EMPLOYED' },
  { label: 'Retired', value: 'RETIRED' },
  { label: 'Other', value: 'OTHER' },
];

const languageOptions = [
  { label: 'English', value: 'ENGLISH' },
  { label: 'Mandarin', value: 'MANDARIN' },
  { label: 'Malay', value: 'MALAY' },
  { label: 'Tamil', value: 'TAMIL' },
  { label: 'Other', value: 'OTHER' },
];

const jobTypeOptions = [
  { label: 'Promoter', value: 'PROMOTER' },
  { label: 'Event Crew', value: 'EVENT_CREW' },
  { label: 'Brand Ambassador', value: 'BRAND_AMBASSADOR' },
  { label: 'Supervisor', value: 'SUPERVISOR' },
  { label: 'Setup Crew', value: 'SETUP_CREW' },
  { label: 'Mascot Crew', value: 'MASCOT_CREW' },
  { label: 'Usher', value: 'USHER' },
  { label: 'Other', value: 'OTHER' },
];

// Format methods used in the template
const formatGender = (gender) => {
  if (!gender) return 'Not specified';
  const option = genderOptions.find((opt) => opt.value === gender);
  return option ? option.label : gender;
};

const formatRace = (race) => {
  if (!race) return 'Not specified';
  const option = raceOptions.find((opt) => opt.value === race);
  return option ? option.label : race;
};

const formatEmploymentStatus = (status) => {
  if (!status) return 'Not specified';
  const option = employmentStatusOptions.find((opt) => opt.value === status);
  return option ? option.label : status;
};

const formatLanguage = (language) => {
  if (!language) return '';
  const option = languageOptions.find((opt) => opt.value === language);
  return option ? option.label : language;
};

const formatJobType = (jobType) => {
  if (!jobType) return '';
  const option = jobTypeOptions.find((opt) => opt.value === jobType);
  return option ? option.label : jobType;
};

// Profile completion calculation
const completionChecklist = computed(() => [
  { label: 'Basic Information', completed: !!profile.value?.name },
  { label: 'Profile Picture', completed: !!profile.value?.profilePictureUrl },
  { label: 'About Me', completed: !!profile.value?.bio },
  {
    label: 'Languages',
    completed: !!(
      profile.value?.languages && profile.value.languages.length > 0
    ),
  },
  { label: 'Work Experience', completed: experiences.value.length > 0 },
  { label: 'Availability', completed: availableDates.value.length > 0 },
  { label: 'Resume Upload', completed: !!profile.value?.resumeUrl },
]);

const profileCompletionPercentage = computed(() => {
  const completed = completionChecklist.value.filter(
    (item) => item.completed
  ).length;
  const total = completionChecklist.value.length;
  return Math.round((completed / total) * 100);
});

const profileCompletionStatus = computed(() => {
  const percentage = profileCompletionPercentage.value;
  if (percentage < 30) return 'Just Started';
  if (percentage < 60) return 'Making Progress';
  if (percentage < 100) return 'Almost There';
  return 'Complete';
});

// Form actions for basic info
const startEditingBasicInfo = () => {
  // Reset error states
  formErrors.value = {};
  formSubmissionError.value = '';

  editForm.value = {
    ...profile.value,
    dateOfBirth: profile.value?.dateOfBirth
      ? parseISO(profile.value.dateOfBirth)
      : null,
    location: profile.value?.preferredLocation || '',
    locationId: profile.value?.preferredLocationId || null,
    // Make sure race is explicitly assigned (not undefined)
    race: profile.value?.race || null,
    gender: profile.value?.gender || null,
    employmentStatus: profile.value?.employmentStatus || null,
  };

  // Initialize location selection with existing location if available
  if (profile.value?.preferredLocation && profile.value?.preferredLocationId) {
    selectedLocation.value = [
      {
        id: profile.value.preferredLocationId,
        name: profile.value.preferredLocation,
      },
    ];
  } else {
    selectedLocation.value = [];
  }

  editingBasicInfo.value = true;
};

const cancelEditBasicInfo = () => {
  editingBasicInfo.value = false;
  formErrors.value = {};
  formSubmissionError.value = '';
};

const validateBasicInfoForm = () => {
  const errors = {};
  let isValid = true;

  // Reset errors
  formErrors.value = {};

  // Validate name
  if (!editForm.value.name || editForm.value.name.trim() === '') {
    errors.name = 'Name is required';
    isValid = false;
  }

  // Validate phone number
  if (
    editForm.value.phoneNumber &&
    !/^\d{10,12}$/.test(editForm.value.phoneNumber.replace(/[^0-9]/g, ''))
  ) {
    errors.phoneNumber = 'Please enter a valid phone number';
    isValid = false;
  }

  // Update form errors
  formErrors.value = errors;
  return isValid;
};

const saveBasicInfo = async () => {
  // Validate form first
  if (!validateBasicInfoForm()) {
    return;
  }

  saving.value = true;
  formSubmissionError.value = '';

  try {
    // Format the data for the API
    const formattedData = {
      ...editForm.value,
      dateOfBirth: editForm.value.dateOfBirth
        ? format(editForm.value.dateOfBirth, 'yyyy-MM-dd')
        : null,
      // Use locationId instead of location name
      preferredLocationId: editForm.value.locationId || null,
      // Ensure race field is included
      race: editForm.value.race || null,
    };

    // Create a clean request payload
    const requestData = {
      name: formattedData.name,
      bio: formattedData.bio || null,
      phoneNumber: formattedData.phoneNumber || null,
      preferredLocationId: formattedData.preferredLocationId || null, // Use locationId here
      dateOfBirth: formattedData.dateOfBirth || null,
      race: formattedData.race || null,
      gender: formattedData.gender || null,
      employmentStatus: formattedData.employmentStatus || null,
      languages: formattedData.languages || [],
    };

    // Use direct fetch to update profile
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const directResponse = await fetch('http://localhost:8080/api/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(requestData),
    });

    if (directResponse.ok) {
      // Direct fetch succeeded
      let responseData;
      try {
        const directData = await directResponse.json();
        responseData = directData.data || directData;
      } catch (e) {
        responseData = requestData;
      }

      // Make sure languages from the form are properly set in the profile
      // This ensures the UI updates immediately even if the response doesn't include languages
      const updatedProfile = {
        ...profile.value,
        ...responseData,
      };

      // Ensure languages are properly set from the form data if not in the response
      if (
        (!updatedProfile.languages || updatedProfile.languages.length === 0) &&
        editForm.value.languages &&
        editForm.value.languages.length > 0
      ) {
        updatedProfile.languages = [...editForm.value.languages];
      }

      profile.value = updatedProfile;

      // Add success message
      const successMessage = document.createElement('div');
      successMessage.className =
        'p-4 mb-4 bg-green-50 text-green-700 rounded-lg border border-green-100 flex items-center';
      successMessage.innerHTML =
        '<i class="pi pi-check-circle mr-2 text-green-500"></i> Profile updated successfully!';

      // Find container to insert the message
      const container = document.querySelector('.w-full.max-w-4xl');
      if (container) {
        // Insert at the top
        container.insertBefore(successMessage, container.firstChild);

        // Remove after 5 seconds
        setTimeout(() => {
          successMessage.remove();
        }, 5000);
      }

      // Exit edit mode
      editingBasicInfo.value = false;
    } else {
      // Get error message
      const errorText = await directResponse.text();
      throw new Error(
        `API request failed with status ${directResponse.status}: ${errorText}`
      );
    }
  } catch (error) {
    // Get a user-friendly error message
    let errorMessage = 'Failed to save profile changes. Please try again.';

    if (typeof error === 'string') {
      errorMessage = error;
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    formSubmissionError.value = errorMessage;
  } finally {
    saving.value = false;
  }
};

// Function to handle trying a new token
const tryNewToken = async () => {
  // Prompt user for a new token
  const newToken = prompt(
    "Enter your new token (include 'Bearer ' prefix if needed):"
  );

  if (newToken) {
    // Save the new token to localStorage
    localStorage.setItem('accessToken', newToken);
    console.log('New token saved to localStorage');

    // Test if the new token works
    try {
      const testResponse = await fetch('http://localhost:8080/api/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: newToken,
        },
      });

      if (testResponse.ok) {
        console.log('New token works! Reloading page...');
        // Reload the page to restart with new token
        window.location.reload();
      } else {
        tokenError.value = `The new token still doesn't work (Status: ${testResponse.status}). Please check that it's valid.`;
      }
    } catch (error) {
      console.error('Test API call error:', error);
      tokenError.value =
        "The new token couldn't be tested. Please check your connection and try again.";
    }
  }
};

// Experience-related functions
const saveExperience = async () => {
  if (!experienceForm.value.jobType || !experienceForm.value.experienceText) {
    // Show validation error
    return;
  }

  savingExperience.value = true;
  try {
    // Save experience to the API
    const response = await candidateService.saveExperience(
      experienceForm.value
    );

    if (editingExperienceIndex.value >= 0) {
      // Update existing experience in local state
      experiences.value[editingExperienceIndex.value] = {
        ...experienceForm.value,
        id: experiences.value[editingExperienceIndex.value].id,
      };
    } else {
      // Add new experience to local state with ID from response
      const savedExperience = response.data?.data || experienceForm.value;
      experiences.value.push(savedExperience);
    }

    showAddExperienceDialog.value = false;
    experienceForm.value = { jobType: null, experienceText: '' };
    editingExperienceIndex.value = -1;
  } catch (error) {
    console.error('Error saving experience:', error);
    // Show error toast or notification here
  } finally {
    savingExperience.value = false;
  }
};

const editExperience = (index) => {
  editingExperienceIndex.value = index;
  experienceForm.value = { ...experiences.value[index] };
  showAddExperienceDialog.value = true;
};

const deleteExperience = async (index) => {
  try {
    // Show confirmation dialog
    confirmDialog.require({
      message:
        'Are you sure you want to delete this work experience? This action cannot be undone.',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      acceptClass: 'p-button-danger',
      accept: async () => {
        try {
          // Show loading toast
          toast.add({
            severity: 'info',
            summary: 'Processing',
            detail: 'Deleting experience...',
            life: 3000,
          });

          const experience = experiences.value[index];
          if (experience.id) {
            // Call API to delete if we have an ID
            await candidateService.deleteExperience(experience.id);
          }

          // Remove from local state
          experiences.value.splice(index, 1);

          // Show success toast
          toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Work experience has been deleted successfully',
            life: 3000,
          });
        } catch (error) {
          console.error('Error deleting experience:', error);
          toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete work experience. Please try again.',
            life: 5000,
          });
        }
      },
      reject: () => {
        // Do nothing when rejected
      },
    });
  } catch (error) {
    console.error('Error in delete experience flow:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'An unexpected error occurred. Please try again.',
      life: 5000,
    });
  }
};

// Resume-related functions
const handleResumeUpload = async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  // Check file type
  const fileType = file.type;
  const fileExtension = file.name.split('.').pop().toLowerCase();

  if (fileType !== 'application/pdf' && fileExtension !== 'pdf') {
    // Reset file input
    if (resumeFileInput.value) {
      resumeFileInput.value.value = '';
    }

    // Show error message to user
    toast.add({
      severity: 'error',
      summary: 'Invalid File Type',
      detail: 'Please upload a PDF file only.',
      life: 5000,
    });

    return;
  }

  uploadingResume.value = true;
  try {
    const response = await candidateService.uploadResume(file);
    const resumeUrl =
      response.data?.data?.resumeUrl || response.data?.resumeUrl;

    if (resumeUrl) {
      profile.value = { ...profile.value, resumeUrl };

      // Show success message
      toast.add({
        severity: 'success',
        summary: 'Resume Uploaded',
        detail: 'Your resume has been successfully uploaded.',
        life: 3000,
      });
    }
  } catch (error) {
    console.error('Error uploading resume:', error);
    // Show error toast
    toast.add({
      severity: 'error',
      summary: 'Upload Failed',
      detail: 'Failed to upload resume. Please try again.',
      life: 5000,
    });
  } finally {
    uploadingResume.value = false;
    // Reset file input
    if (resumeFileInput.value) {
      resumeFileInput.value.value = '';
    }
  }
};

const downloadResume = async () => {
  try {
    console.log('Downloading resume...');
    console.log('Resume URL from profile:', profile.value?.resumeUrl);
    const response = await candidateService.downloadResume();
    console.log('Download response:', response);
  } catch (error) {
    console.error('Error downloading resume:', error);
  }
};

const deleteResume = async () => {
  if (!profile.value?.resumeUrl) return;

  try {
    await candidateService.deleteResume();
    profile.value = { ...profile.value, resumeUrl: null };
  } catch (error) {
    console.error('Error deleting resume:', error);
    // Show error toast or notification here
  }
};

// Profile picture handler
const handleProfilePictureUpload = async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  uploadingProfilePicture.value = true;
  try {
    const response = await candidateService.uploadProfilePicture(file);

    // Extract the profilePictureUrl from the response
    let profilePictureUrl;
    if (response.data?.data?.profilePictureUrl) {
      profilePictureUrl = response.data.data.profilePictureUrl;
    } else if (response.data?.profilePictureUrl) {
      profilePictureUrl = response.data.profilePictureUrl;
    } else if (response.data?.data) {
      profilePictureUrl = response.data.data.profilePictureUrl;
    }

    if (profilePictureUrl) {
      // First, create a direct object URL for the file for immediate display
      const localUrl = URL.createObjectURL(file);

      // Cache the local URL first for immediate display
      localStorage.setItem('cachedProfilePictureUrl', localUrl);

      // Update the profile with the new URL
      profile.value = {
        ...profile.value,
        profilePictureUrl: localUrl,
      };

      // Then, in the background, resolve the server URL
      setTimeout(() => {
        // Get the resolved URL from the server response
        const resolvedUrl = fileService.getFileUrl(profilePictureUrl);

        // Update localStorage with the server URL for persistent storage
        if (resolvedUrl) {
          localStorage.setItem('cachedProfilePictureUrl', resolvedUrl);
        }

        // Update the profile with the server URL
        profile.value = {
          ...profile.value,
          profilePictureUrl: profilePictureUrl,
        };
      }, 1000); // Delay to ensure UI shows the local image first
    }
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    toast.add({
      severity: 'error',
      summary: 'Upload failed',
      detail: 'Failed to upload profile picture. Please try again.',
      life: 3000,
    });
  } finally {
    uploadingProfilePicture.value = false;
    // Reset file input
    if (profilePictureInput.value) {
      profilePictureInput.value.value = '';
    }
  }
};

// Add methods for photo handling
const fetchCompcardPhotos = async () => {
  console.log('fetchCompcardPhotos called');
  if (loadingPhotos.value) {
    console.log('Photos already loading, skipping duplicate fetch');
    return;
  }

  loadingPhotos.value = true;
  console.log('Making API request to /candidate/file/comcard');
  try {
    // Use candidate service if available
    const response = await candidateService.getCompcardPhotos();
    console.log('API response received:', response);

    if (response.data && response.data.data) {
      // Handle array of photos
      let photos = Array.isArray(response.data.data)
        ? response.data.data
        : [response.data.data];

      console.log('Processing photos:', photos);

      // Process each photo to ensure correct URL format
      photos = photos.map((photo) => {
        if (photo.comcardUrl) {
          // Just use the service method - we've updated it to use the direct path
          const url = candidateService.getCompcardFromAssets(photo.comcardUrl);
          console.log(`Resolved URL for photo ${photo.id}: ${url}`);
          return {
            ...photo,
            url: url,
          };
        } else if (photo.url) {
          // Photo already has a url property
          console.log(`Photo ${photo.id} already has URL: ${photo.url}`);
          return photo;
        } else {
          // Fallback in case photo has neither url nor comcardUrl
          console.warn('Photo missing url:', photo);
          return {
            ...photo,
            url: null,
          };
        }
      });

      console.log('Final processed photos:', photos);
      compcardPhotos.value = photos;
    } else {
      console.log('No photos data in response');
      compcardPhotos.value = [];
    }
  } catch (error) {
    console.error('Error fetching comp card photos:', error);
    toast.add({
      severity: 'error',
      summary: 'Failed to load photos',
      detail: 'We could not load your photos. Please try again later.',
      life: 5000,
    });
    compcardPhotos.value = [];
  } finally {
    loadingPhotos.value = false;
    console.log('Finished loading photos');
  }
};

const handleCompcardUpload = async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  // Check if it's an image
  if (!file.type.startsWith('image/')) {
    toast.add({
      severity: 'error',
      summary: 'Invalid file type',
      detail: 'Please select an image file.',
      life: 3000,
    });
    return;
  }

  // Check file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    toast.add({
      severity: 'error',
      summary: 'File too large',
      detail: 'Image must be less than 5MB.',
      life: 3000,
    });
    return;
  }

  // Check if already has 3 photos
  if (compcardPhotos.value.length >= 3) {
    toast.add({
      severity: 'error',
      summary: 'Maximum photos reached',
      detail:
        'You can only upload a maximum of 3 photos. Please delete an existing photo before uploading a new one.',
      life: 5000,
    });
    return;
  }

  uploadingPhoto.value = true;
  try {
    const response = await candidateService.uploadCompcardPhoto(file);

    toast.add({
      severity: 'success',
      summary: 'Photo uploaded',
      detail: 'Your photo has been uploaded successfully.',
      life: 3000,
    });

    // Refresh photo list
    await fetchCompcardPhotos();
  } catch (error) {
    console.error('Error uploading photo:', error);

    toast.add({
      severity: 'error',
      summary: 'Upload failed',
      detail:
        error.response?.data?.message ||
        'Failed to upload photo. Please try again.',
      life: 5000,
    });
  } finally {
    uploadingPhoto.value = false;
    // Reset file input
    if (compcardFileInput.value) {
      compcardFileInput.value.value = '';
    }
  }
};

const openPhotoPreview = (photo, index) => {
  currentPhoto.value = photo;
  currentPhotoIndex.value = index;
  showPhotoPreview.value = true;
};

const confirmPhotoDelete = (photoId) => {
  confirmDialog.require({
    message: 'Are you sure you want to delete this photo?',
    header: 'Delete Confirmation',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: () => deletePhoto(photoId),
    reject: () => {},
  });
};

const deletePhoto = async (photoId) => {
  try {
    console.log(`Attempting to delete photo with ID: ${photoId}`);
    const response = await candidateService.deleteCompcardPhoto(photoId);
    console.log('Delete photo response:', response);

    toast.add({
      severity: 'success',
      summary: 'Photo deleted',
      detail: 'The photo has been deleted successfully.',
      life: 3000,
    });

    // Refresh photo list
    await fetchCompcardPhotos();

    // Close preview if open
    if (showPhotoPreview.value) {
      showPhotoPreview.value = false;
    }
  } catch (error) {
    console.error('Error deleting photo:', error);

    // Detailed error logging
    if (error.response) {
      console.error('Error response:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });
    } else if (error.request) {
      console.error('Error request:', error.request);
    } else {
      console.error('Error message:', error.message);
    }

    toast.add({
      severity: 'error',
      summary: 'Delete failed',
      detail:
        error.response?.data?.message ||
        'Failed to delete photo. Please try again.',
      life: 5000,
    });
  }
};

const navigatePhotos = (direction) => {
  if (direction === 'next') {
    currentPhotoIndex.value =
      (currentPhotoIndex.value + 1) % compcardPhotos.value.length;
  } else {
    currentPhotoIndex.value =
      (currentPhotoIndex.value - 1 + compcardPhotos.value.length) %
      compcardPhotos.value.length;
  }
  currentPhoto.value = compcardPhotos.value[currentPhotoIndex.value];
};

const navigateToPhotos = () => {
  console.log('Navigating to photos section');
  activeSection.value = 'photos';

  // Fetch both types of photos when navigating to the photos section
  nextTick(() => {
    console.log('Fetching photos after navigation');
    fetchCompcardPhotos();
    fetchWorkingPhotos();
  });
};

const handlePhotoError = (event, photo, index) => {
  console.error(`Error loading photo at index ${index}:`, photo);

  if (!photo.comcardUrl) {
    console.error('No compcardUrl available for photo:', photo);
    photo.url = null;
    photo.loadError = true;
    return;
  }

  // Use fileService to get the correct URL for the comp card
  const filenameOnly = photo.comcardUrl.split('/').pop();
  console.log(
    `Attempting to load with fileService for filename: ${filenameOnly}`
  );

  try {
    // Get the URL using fileService
    photo.url = fileService.getCompcardUrl(filenameOnly);
    console.log(`Using fileService URL: ${photo.url}`);
  } catch (error) {
    console.error(`Failed to get comp card URL: ${error}`);
    photo.url = null;
    photo.loadError = true;
  }
};

// Add these methods alongside other component methods
// Place this with other lifecycle hooks like onMounted
const fetchWorkingPhotos = async () => {
  console.log('Fetching working photos...');
  if (loadingWorkingPhotos.value) return;

  loadingWorkingPhotos.value = true;
  try {
    console.log('Making API request to /candidate/file/working');
    const response = await candidateService.getWorkingPhotos();
    console.log('Working photos response:', response);
    console.log('Raw response data:', response.data);

    // Handle different response formats
    let photos = [];
    if (response.data && response.data.data) {
      photos = Array.isArray(response.data.data)
        ? response.data.data
        : [response.data.data];
    } else if (Array.isArray(response.data)) {
      photos = response.data;
    }

    console.log('Processing working photos array:', photos);

    // Check if photos has any elements
    if (photos.length === 0) {
      console.log('No working photos found in the response');
      workingPhotos.value = [];
      return;
    }

    // Map the photos to include URLs - only use fileService URLs directly from backend
    workingPhotos.value = photos.map((photo, index) => {
      // Log the photo object structure for debugging
      console.log(`Processing photo ${index}:`, photo);

      let filename = null;

      // Extract just the filename from any path that might be returned
      if (photo.photoUrl && photo.photoUrl.includes('/')) {
        filename = photo.photoUrl.split('/').pop();
      } else if (photo.photoUrl) {
        filename = photo.photoUrl;
      } else if (photo.id) {
        // Use ID as last resort
        filename = `${photo.id}.jpg`;
      }

      // Only use fileService to get the URL to ensure it points to 8080
      const url = filename ? fileService.getWorkingPhotoUrl(filename) : null;
      console.log(`Final URL for working photo ${index}: ${url}`);

      return {
        ...photo,
        // Override all URL fields to ensure they point to the backend
        url,
        // Make sure these don't contain any reference to 5173
        photoUrl: url,
        imageUrl: url,
        backupUrl: null,
      };
    });

    console.log('Processed working photos:', workingPhotos.value);
  } catch (error) {
    console.error('Error fetching working photos:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load working photos. Please try again.',
      life: 5000,
    });
  } finally {
    loadingWorkingPhotos.value = false;
    console.log('Working photos loading complete');
  }
};

const openWorkingPhotoUploadDialog = () => {
  if (workingPhotos.value.length >= 3) {
    toast.add({
      severity: 'info',
      summary: 'Maximum Reached',
      detail: 'You can only upload up to 3 working photos.',
      life: 5000,
    });
    return;
  }

  workingPhotoDescription.value = '';
  selectedWorkingPhotoFile.value = null;
  showWorkingPhotoUploadDialog.value = true;
};

const handleWorkingPhotoChange = (event) => {
  const file = event.target.files[0];
  validateAndSetWorkingPhoto(file);
};

const validateAndSetWorkingPhoto = (file) => {
  if (!file) return;

  // Validate file type
  const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (!validTypes.includes(file.type)) {
    toast.add({
      severity: 'error',
      summary: 'Invalid File',
      detail: 'Please select a JPEG or PNG image.',
      life: 5000,
    });
    return;
  }

  // Validate file size (5MB max)
  if (file.size > 5 * 1024 * 1024) {
    toast.add({
      severity: 'error',
      summary: 'File Too Large',
      detail: 'Please select an image under 5MB.',
      life: 5000,
    });
    return;
  }

  selectedWorkingPhotoFile.value = file;
};

const uploadWorkingPhoto = async () => {
  if (!selectedWorkingPhotoFile.value) {
    toast.add({
      severity: 'error',
      summary: 'No File Selected',
      detail: 'Please select a photo to upload.',
      life: 5000,
    });
    return;
  }

  loadingWorkingPhotos.value = true;

  try {
    console.log(
      'Uploading working photo with file:',
      selectedWorkingPhotoFile.value.name
    );
    console.log('Description:', workingPhotoDescription.value);

    const response = await candidateService.uploadWorkingPhoto(
      selectedWorkingPhotoFile.value,
      workingPhotoDescription.value
    );

    console.log('Working photo upload response:', response);
    console.log('Response data structure:', JSON.stringify(response.data));

    // Try to find the photo data in the response
    let photoData = null;
    if (response.data && response.data.data) {
      photoData = response.data.data;
    } else if (response.data) {
      photoData = response.data;
    }

    console.log('Extracted photo data:', photoData);

    // Check if we can find the image URL in the response
    if (photoData) {
      // Log the properties of the photo data
      console.log('Photo data properties:', Object.keys(photoData));

      // If we received the photo data directly, we can add it to our local state
      // instead of having to re-fetch all photos
      if (photoData.id) {
        console.log('Adding new photo to local state without re-fetching');

        // Get the appropriate image path
        const imagePath =
          photoData.photoUrl ||
          photoData.imageUrl ||
          photoData.url ||
          photoData.path;

        // Extract just the filename
        let filename = null;
        if (imagePath && imagePath.includes('/')) {
          filename = imagePath.split('/').pop();
        } else if (imagePath) {
          filename = imagePath;
        } else if (photoData.id) {
          filename = `${photoData.id}.jpg`;
        }

        // Use fileService directly to get the proper URL
        const url = fileService.getWorkingPhotoUrl(filename);
        console.log('Using fileService URL:', url);

        const newPhoto = {
          ...photoData,
          description: workingPhotoDescription.value,
          url: url,
          // Make sure these don't contain references to 5173
          photoUrl: url,
          imageUrl: url,
          backupUrl: null,
        };

        console.log('Created new photo object:', newPhoto);

        // Add to local state
        workingPhotos.value.push(newPhoto);

        toast.add({
          severity: 'success',
          summary: 'Photo Uploaded',
          detail: 'Working photo uploaded successfully.',
          life: 3000,
        });

        // Close the dialog
        showWorkingPhotoUploadDialog.value = false;
      } else {
        // If we didn't get the photo data directly, we need to re-fetch
        console.log('Photo data missing ID, refreshing all photos');
        fetchWorkingPhotos();
      }
    } else {
      // If we didn't get the photo data at all, we need to re-fetch
      console.log('No photo data in response, refreshing all photos');
      fetchWorkingPhotos();
    }
  } catch (error) {
    console.error('Error uploading working photo:', error);

    // Detailed error logging for debugging
    if (error.response) {
      console.error('Error response:', error.response);
      console.error('Error response data:', error.response.data);
    }

    toast.add({
      severity: 'error',
      summary: 'Upload Failed',
      detail:
        error.response?.data?.message ||
        'Failed to upload photo. Please try again.',
      life: 5000,
    });
  } finally {
    loadingWorkingPhotos.value = false;
    selectedWorkingPhotoFile.value = null;
    workingPhotoDescription.value = '';
  }
};

const openWorkingPhotoPreview = (photo, index) => {
  selectedWorkingPhoto.value = photo;
  workingPhotoPreviewIndex.value = index;
  workingPhotoDialogVisible.value = true;
};

const confirmWorkingPhotoDelete = (photoId) => {
  confirmDialog.require({
    message: 'Are you sure you want to delete this working photo?',
    header: 'Delete Confirmation',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: () => deleteWorkingPhoto(photoId),
    reject: () => {},
  });
};

const deleteWorkingPhoto = async (photoId) => {
  console.log(`Attempting to delete working photo with ID: ${photoId}`);
  loadingWorkingPhotos.value = true;

  try {
    const response = await candidateService.deleteWorkingPhoto(photoId);
    console.log('Delete working photo response:', response);

    toast.add({
      severity: 'success',
      summary: 'Photo Deleted',
      detail: 'Working photo has been deleted successfully.',
      life: 3000,
    });

    // Remove the photo from the local state
    workingPhotos.value = workingPhotos.value.filter((p) => p.id !== photoId);
  } catch (error) {
    console.error('Error deleting working photo:', error);

    // Detailed error logging
    if (error.response) {
      console.error('Error response:', error.response);
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
    } else if (error.request) {
      console.error('Error request:', error.request);
    } else {
      console.error('Error message:', error.message);
    }

    toast.add({
      severity: 'error',
      summary: 'Deletion Failed',
      detail:
        error.response?.data?.message ||
        'Failed to delete photo. Please try again.',
      life: 5000,
    });
  } finally {
    loadingWorkingPhotos.value = false;
  }
};

// Add these two methods right before the navigateToPhotos method
const fetchExperiences = async () => {
  try {
    console.log('Fetching experiences...');
    const response = await candidateService.getExperiences();
    console.log('Experience data received:', response);

    if (response && response.data) {
      // For the new API, data might be nested differently
      if (response.data.data && Array.isArray(response.data.data)) {
        experiences.value = response.data.data;
      } else if (Array.isArray(response.data)) {
        experiences.value = response.data;
      } else {
        experiences.value = [];
      }
    } else {
      experiences.value = [];
    }
  } catch (error) {
    console.error('Error fetching experiences:', error);
    experiences.value = [];
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load work experiences. Please try again.',
      life: 5000,
    });
  }
};

const fetchAvailability = async () => {
  try {
    console.log('Fetching availability...');
    const response = await candidateService.getAvailability();
    console.log('Availability data received:', response);

    if (response.data && (response.data.data || response.data.length)) {
      availableDates.value = response.data.data || response.data;
    } else {
      availableDates.value = [];
    }
  } catch (error) {
    console.error('Error fetching availability:', error);
    availableDates.value = [];
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load availability. Please try again.',
      life: 5000,
    });
  }
};

// Let's define the loadExperiencesAndAvailability function outside of onMounted
// Add this after the fetchAvailability function
const loadExperiencesAndAvailability = async () => {
  // Try to fetch experiences
  try {
    const expResponse = await apiClient.get('/api/candidate/experiences');
    if (
      expResponse.data &&
      (expResponse.data.data || expResponse.data.length)
    ) {
      experiences.value = expResponse.data.data || expResponse.data;
    }
  } catch (expError) {
    console.warn('Failed to fetch experiences:', expError);
    experiences.value = [];
  }

  // Try to fetch availability
  try {
    const availResponse = await apiClient.get('/api/candidate/availability');
    if (
      availResponse.data &&
      (availResponse.data.data || availResponse.data.length)
    ) {
      availableDates.value = availResponse.data.data || availResponse.data;
    }
  } catch (availError) {
    console.warn('Failed to fetch availability:', availError);
    availableDates.value = [];
  }
};

// Enhance the getObjectURL function with better error handling
const getObjectURL = (file) => {
  try {
    if (!file) return '';
    if (typeof window === 'undefined' || !window.URL) {
      console.error('URL API is not available');
      return '';
    }
    return window.URL.createObjectURL(file);
  } catch (error) {
    console.error('Error creating object URL:', error);
    return '';
  }
};

// Add this function to handle working photo errors
const handleWorkingPhotoError = (event, photo, index) => {
  console.error(`Error loading working photo at index ${index}:`, photo);

  // Log all available information
  console.log('Photo details:', {
    id: photo.id,
    photoUrl: photo.photoUrl,
    imageUrl: photo.imageUrl,
    url: photo.url,
    backupUrl: photo.backupUrl,
  });

  try {
    // Extract the filename from various potential paths
    let filename = null;

    if (photo.photoUrl && photo.photoUrl.includes('/')) {
      // Extract just the filename regardless of path format
      filename = photo.photoUrl.split('/').pop();
      console.log('Extracted filename from photoUrl:', filename);
    } else if (photo.imageUrl && photo.imageUrl.includes('/')) {
      // Format could be any path with a filename at the end
      filename = photo.imageUrl.split('/').pop();
      console.log('Extracted filename from imageUrl:', filename);
    } else if (photo.photoUrl) {
      // photoUrl might be just the filename
      filename = photo.photoUrl;
      console.log('Using photoUrl as filename:', filename);
    } else if (photo.id) {
      // Last resort - use the ID with jpg extension
      filename = `${photo.id}.jpg`;
      console.log('Using ID as filename:', filename);
    }

    if (filename) {
      // Use the fileService to get the properly formatted URL
      const properUrl = fileService.getWorkingPhotoUrl(filename);
      console.log('Attempting to load with fileService URL:', properUrl);
      event.target.src = properUrl;

      // Update the photo object to use the proper URL
      photo.url = properUrl;
    }
  } catch (error) {
    console.error('Failed to create fallback URL:', error);
  }
};

const handleDrop = (event) => {
  event.preventDefault();
  const files = event.dataTransfer.files;
  if (files.length > 0) {
    const file = files[0];
    // Use the existing validation function
    validateAndSetWorkingPhoto(file);
  }
};

const handleLocationSelected = (location) => {
  console.log('Location selected:', location);

  // When a location is selected in the component
  if (location && location.length > 0) {
    const selectedLoc = location[0];

    // Update both the ID and the location name in the profile data
    editForm.value.locationId = selectedLoc.id;
    // Store location as a simple name property for consistency and readability
    editForm.value.location = selectedLoc.name;
  } else {
    editForm.value.locationId = null;
    editForm.value.location = null;
  }
};

const editProfile = () => {
  editMode.value = true;
  editForm.value = {
    fullName: profile.value.fullName || '',
    phoneNumber: profile.value.phoneNumber || '',
    location: profile.value.location || '',
    locationId: profile.value.locationId || null,
    dateOfBirth: profile.value.dateOfBirth
      ? new Date(profile.value.dateOfBirth)
      : null,
    race: profile.value.race || null,
    gender: profile.value.gender || null,
    employmentStatus: profile.value.employmentStatus || null,
    languages: profile.value.languages || [],
    bio: profile.value.bio || '',
  };

  // Initialize location selection with existing location if available
  if (profile.value.location && profile.value.locationId) {
    selectedLocation.value = [
      {
        id: profile.value.locationId,
        name: profile.value.location,
      },
    ];
  } else {
    selectedLocation.value = [];
  }
};

// Add this computed property after other computed properties
const profilePictureSource = computed(() => {
  // First try to get from profile
  if (profile.value?.profilePictureUrl) {
    const url = fileService.getFileUrl(profile.value.profilePictureUrl);
    if (url && url.trim() !== '') {
      // Successfully resolved a URL from the profile data
      return url;
    }
  }

  // If not in profile or invalid, try local storage
  const cachedUrl = localStorage.getItem('cachedProfilePictureUrl');
  if (cachedUrl && cachedUrl.trim() !== '') {
    // Ensure we update the profile value for consistency
    if (profile.value) {
      profile.value.profilePictureUrl = cachedUrl;
    }
    return cachedUrl;
  }

  // No valid URL found
  return '';
});

// Add this computed property to check if we should show the profile picture
const hasValidProfilePicture = computed(() => {
  return !!profilePictureSource.value;
});

// Add this after the computed properties
// Handle profile image error when it fails to load
const handleProfileImageError = (event) => {
  console.debug(
    'Profile image failed to load, removing invalid URL from cache'
  );
  // Remove the invalid URL from cache
  localStorage.removeItem('cachedProfilePictureUrl');

  // Remove the URL from the profile to trigger the fallback
  if (profile.value) {
    profile.value.profilePictureUrl = '';
  }

  // Prevent infinite error events
  event.target.onerror = null;
};

// Add this computed property for the comp card example image
const compCardExampleUrl = computed(() => {
  return fileService.getSampleImageUrl('comp-card-example.jpg');
});
</script>

<style scoped>
/* Custom form styles */
.form-label {
  @apply block text-sm font-medium text-gray-700 mb-1;
}

.form-group {
  @apply mb-4;
}

/* Photo container styles */
.aspect-square {
  position: relative;
  padding-bottom: 100%; /* 1:1 aspect ratio */
}

.aspect-square > * {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  object-position: center;
}

/* Seamless sidebar gradient transition */
@media (min-width: 768px) {
  /* Remove negative margin since we have gradients now */
  [class*='md:border-l'] {
    border-left: none !important;
    margin-left: 0 !important;
  }

  /* Hide any borders that might interfere with gradient effect */
  .md\:border-l,
  .md\:border-r,
  .border-l,
  .border-r {
    border-left-color: transparent !important;
    border-right-color: transparent !important;
  }

  /* Ensure gradients completely overlap */
  .absolute.top-0.right-0,
  .absolute.top-0.left-0 {
    height: 100vh;
  }
}

/* Responsive dialog styles */
:deep(.p-dialog-mobile .p-dialog-header) {
  padding: 1rem;
  font-size: 1.1rem;
}

:deep(.p-dialog-mobile .p-dialog-content) {
  padding: 1rem;
}

:deep(.p-dialog-mobile .p-dialog-footer) {
  padding: 0.75rem 1rem;
}

/* Calendar responsive styling */
:deep(.calendar-responsive .p-datepicker) {
  width: 100%;
  min-width: 100%;
}

:deep(.calendar-responsive .p-datepicker table) {
  font-size: 0.875rem;
}

@media (max-width: 640px) {
  :deep(.calendar-responsive .p-datepicker table) {
    font-size: 0.75rem;
  }

  :deep(.calendar-responsive .p-datepicker .p-datepicker-header) {
    padding: 0.5rem;
  }

  :deep(.calendar-responsive .p-datepicker table td) {
    padding: 0.2rem;
  }

  :deep(.calendar-responsive .p-datepicker table td > span) {
    width: 2rem;
    height: 2rem;
  }
}

/* Responsive styles */
@media (max-width: 768px) {
  /* Mobile styles */
  .md\:flex-row {
    flex-direction: column !important;
  }

  .md\:w-72,
  .md\:w-80 {
    width: 100% !important;
    height: auto !important;
    position: relative !important;
  }

  .md\:sticky {
    position: relative !important;
    top: auto !important;
    height: auto !important;
  }

  .md\:h-screen {
    height: auto !important;
  }

  .grid-cols-1,
  .sm\:grid-cols-2,
  .md\:grid-cols-2,
  .lg\:grid-cols-3 {
    grid-template-columns: repeat(1, minmax(0, 1fr)) !important;
  }

  .md\:grid-cols-3 {
    grid-template-columns: repeat(1, minmax(0, 1fr)) !important;
  }

  .md\:overflow-y-auto {
    overflow-y: visible !important;
  }

  .shadow-lg {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
  }

  /* Improve padding and margins for mobile */
  .p-6,
  .md\:p-6,
  .md\:p-8 {
    padding: 1rem !important;
  }

  .px-6,
  .py-8 {
    padding-left: 1rem !important;
    padding-right: 1rem !important;
    padding-top: 1.5rem !important;
    padding-bottom: 1.5rem !important;
  }

  /* Adjust dialog size for mobile */
  :deep(.p-dialog) {
    width: 95% !important;
    max-width: 95vw !important;
  }

  /* Fix small buttons on mobile */
  :deep(.p-button-sm) {
    padding: 0.4rem 0.75rem !important;
    font-size: 0.75rem !important;
  }

  /* Better touch targets */
  button,
  a,
  .p-button {
    min-height: 40px !important;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  /* Tablet styles */
  .grid-cols-1,
  .sm\:grid-cols-2,
  .md\:grid-cols-2,
  .lg\:grid-cols-3 {
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
  }

  .md\:w-72,
  .md\:w-80 {
    width: 260px !important; /* Slightly narrower sidebar */
  }

  /* Adjust dialog size for tablets */
  :deep(.p-dialog) {
    width: 90% !important;
    max-width: 90vw !important;
  }
}

@media (min-width: 1025px) {
  /* Desktop adjustments - maintain original design */
  .flex-1 {
    flex: 1 1 0% !important;
  }

  .md\:w-72 {
    width: 18rem !important;
  }

  .md\:w-80 {
    width: 20rem !important;
  }
}

/* Additional responsive fixes for all screen sizes */
.flex-wrap {
  flex-wrap: wrap !important;
}

.max-w-7xl {
  max-width: 100% !important;
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Bringing sidebar and main content closer */
@media (min-width: 768px) {
  [class*='md:border-l'] {
    margin-left: -1px;
  }

  .md\:flex-row {
    gap: 0 !important;
  }
}

.working-photo-upload-dialog .p-dialog-content {
  padding: 1rem;
}

.working-photo-upload-dialog .p-dialog-footer {
  padding: 0.75rem 1rem;
}

.working-photo-upload-dialog .p-button-primary {
  padding: 0.4rem 0.75rem !important;
  font-size: 0.75rem !important;
}

.working-photo-upload-dialog .p-button-text {
  padding: 0.4rem 0.75rem !important;
  font-size: 0.75rem !important;
}

/* ... existing styles ... */

.working-photo-upload-dialog .p-dialog-header {
  background: linear-gradient(
    135deg,
    var(--primary-color) 0%,
    var(--primary-600) 100%
  );
  color: white;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  padding: 1rem 1.5rem;
}

.working-photo-upload-dialog .p-dialog-content {
  padding: 0;
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
}

.working-photo-upload-dialog .p-dialog-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #f0f0f0;
  background-color: #fcfcfc;
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
}

/* Remove dropdown inner border and make consistent sizing */
:deep(.p-dropdown .p-dropdown-label.p-inputtext) {
  border: none !important;
  box-shadow: none !important;
}

:deep(.p-dropdown) {
  width: 100%;
  height: auto;
}

:deep(.p-dropdown .p-dropdown-label) {
  padding: 0.5rem 0.75rem;
  min-height: 2.75rem;
  line-height: 1.5;
}

:deep(.p-multiselect) {
  width: 100%;
  height: auto;
}

:deep(.p-multiselect-label) {
  border: none !important;
  box-shadow: none !important;
  padding: 0.5rem 0.75rem;
  min-height: 2.75rem;
  line-height: 1.5;
}
</style>
