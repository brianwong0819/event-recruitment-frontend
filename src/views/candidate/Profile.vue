<template>
  <div
    class="flex flex-col md:flex-row min-h-screen justify-center items-center"
  >
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
    <div v-else class="flex flex-col md:flex-row w-full max-w-7xl shadow-lg">
      <!-- Left Sidebar -->
      <div
        class="w-full md:w-72 lg:w-80 border-r md:sticky md:top-0 md:h-screen md:overflow-y-auto flex flex-col bg-gradient-to-br from-primary-50 via-white to-gray-50 shadow-md"
      >
        <!-- Profile Photo & Name Section -->
        <div
          class="flex flex-col items-center px-6 py-8 border-b bg-gradient-to-b from-primary-100 to-white relative overflow-hidden"
        >
          <div
            class="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-primary-200 to-primary-100 opacity-50"
          ></div>
          <div class="w-24 h-24 relative mb-4 z-10">
            <div
              v-if="profile?.profilePictureUrl"
              class="w-full h-full overflow-hidden rounded-full border-4 border-white shadow-lg"
            >
              <img
                :src="getImageUrl(profile.profilePictureUrl)"
                alt="Profile"
                class="w-full h-full object-cover"
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
          <div class="flex items-center mt-1 text-xs text-gray-500 z-10">
            <i class="pi pi-map-marker mr-1 text-primary-500"></i>
            <p>{{ getLocation(profile) }}</p>
          </div>
          <button
            @click="profilePictureInput.click()"
            class="mt-3 text-sm text-primary-600 flex items-center hover:text-primary-700 hover:bg-primary-50 transition-colors rounded-full px-3 py-1"
          >
            <i class="pi pi-camera mr-1"></i> Change Photo
          </button>
          <input
            type="file"
            ref="profilePictureInput"
            style="display: none"
            accept="image/*"
            @change="handleProfilePictureUpload"
          />
        </div>

        <!-- Navigation Menu -->
        <nav class="py-4 flex-grow">
          <ul class="space-y-1 px-2">
            <li>
              <button
                @click="activeSection = 'basic-info'"
                :class="[
                  'w-full text-left py-2.5 px-4 flex items-center transition-all duration-200 text-base rounded-lg',
                  activeSection === 'basic-info'
                    ? 'bg-primary-100 text-primary-700 font-medium shadow-sm'
                    : 'text-gray-700 hover:bg-white hover:shadow-sm',
                ]"
              >
                <i
                  class="pi pi-user text-lg w-6 mr-3"
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
                Availability
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

        <!-- Profile Completion Card -->
        <div class="px-6 py-4 mt-auto border-t">
          <div class="pt-1">
            <h3
              class="text-sm font-medium mb-2 text-gray-700 flex items-center"
            >
              <i class="pi pi-check-circle text-primary-500 mr-2"></i>
              Profile Completion
            </h3>
            <div class="mb-1 flex justify-between items-center">
              <span class="text-sm font-medium text-gray-800"
                >{{ profileCompletionPercentage }}% Complete</span
              >
              <span
                class="text-sm text-primary-600 font-medium px-2 py-0.5 bg-primary-50 rounded-full text-xs"
                >{{ profileCompletionStatus }}</span
              >
            </div>
            <div class="w-full bg-gray-100 rounded-full h-2.5 shadow-inner">
              <div
                class="bg-gradient-to-r from-primary-400 to-primary-600 h-2.5 rounded-full transition-all duration-500"
                :style="`width: ${profileCompletionPercentage}%`"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Area -->
      <div
        class="flex-1 py-6 px-5 md:py-8 md:px-6 flex justify-center bg-gray-50"
      >
        <!-- Content Container with Max Width -->
        <div class="w-full max-w-4xl">
          <!-- Basic Information Section -->
          <div v-show="activeSection === 'basic-info'" class="animate-fadeIn">
            <div
              class="rounded-xl shadow-md border mb-8 overflow-hidden bg-white transition-all duration-300 hover:shadow-lg"
            >
              <div
                class="flex justify-between items-center p-4 md:p-6 border-b bg-white"
              >
                <h2
                  class="text-xl font-semibold text-gray-800 flex items-center"
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
                <div class="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-6">
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
                      Location
                    </p>
                    <p class="text-base text-gray-800 pl-5">
                      {{ getLocation(profile) }}
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
                      <InputText
                        id="location"
                        v-model="editForm.location"
                        class="w-full shadow-sm"
                        style="
                          border-radius: 0.5rem;
                          background-color: #f9fafb;
                          padding: 0.5rem 0.75rem;
                        "
                        placeholder="e.g., Kuala Lumpur, Malaysia"
                      />
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
                  accept=".pdf,.doc,.docx"
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
                    <div class="bg-primary-100 p-3 rounded-full mr-4 shadow-sm">
                      <i class="pi pi-file-pdf text-primary-600 text-xl"></i>
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
                    class="bg-white inline-flex p-4 rounded-full mb-4 shadow-sm"
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

          <!-- Work Experience Section -->
          <div
            v-show="activeSection === 'work-experience'"
            class="animate-fadeIn"
          >
            <div
              class="rounded-xl shadow-md border mb-5 bg-white overflow-hidden transition-all duration-300 hover:shadow-lg"
            >
              <div
                class="flex justify-between items-center p-4 md:p-5 border-b bg-gradient-to-r from-primary-50 to-white"
              >
                <h2
                  class="text-lg font-semibold text-gray-800 flex items-center"
                >
                  <i class="pi pi-briefcase text-primary-500 mr-2"></i>
                  Work Experience
                </h2>
                <Button
                  icon="pi pi-plus"
                  label="Add Experience"
                  class="p-button-sm"
                  @click="showAddExperienceDialog = true"
                />
              </div>

              <div class="p-6">
                <!-- Experience list -->
                <div
                  v-if="experiences.length === 0"
                  class="text-center p-8 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 transition-all duration-300 hover:border-primary-200"
                >
                  <div
                    class="bg-white inline-flex p-4 rounded-full mb-4 shadow-sm"
                  >
                    <i class="pi pi-briefcase text-gray-400 text-2xl"></i>
                  </div>
                  <p class="text-gray-700 font-medium mb-2 text-base">
                    You haven't added any work experience yet
                  </p>
                  <p class="text-sm text-gray-500 mb-4 max-w-md mx-auto">
                    Add your past event experiences to stand out to employers
                    and improve your chances of getting hired
                  </p>
                  <Button
                    icon="pi pi-plus"
                    label="Add Experience"
                    class="p-button-sm shadow-sm"
                    @click="showAddExperienceDialog = true"
                  />
                </div>

                <div v-else class="space-y-4">
                  <div
                    v-for="(exp, index) in experiences"
                    :key="index"
                    class="border rounded-lg p-4 hover:shadow-md transition-all duration-300 bg-white hover:border-primary-200 group"
                  >
                    <div class="flex justify-between">
                      <div class="flex-1">
                        <div class="flex items-center mb-3">
                          <div
                            class="bg-primary-100 w-10 h-10 rounded-full flex items-center justify-center mr-3 shadow-sm group-hover:bg-primary-200 transition-colors"
                          >
                            <i
                              class="pi pi-briefcase text-primary-600 text-lg"
                            ></i>
                          </div>
                          <h3 class="font-medium text-base text-gray-800">
                            {{ formatJobType(exp.jobType) }}
                          </h3>
                        </div>
                        <div class="pl-12 pr-4">
                          <p
                            class="text-gray-600 leading-relaxed text-sm bg-gray-50 p-3 rounded-lg shadow-sm"
                          >
                            {{ exp.experienceText }}
                          </p>
                        </div>
                      </div>
                      <div class="flex items-start gap-2 ml-4">
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
            <div
              class="rounded-xl shadow-md border mb-5 bg-white overflow-hidden transition-all duration-300 hover:shadow-lg"
            >
              <div
                class="flex justify-between items-center p-4 md:p-5 border-b bg-gradient-to-r from-primary-50 to-white"
              >
                <h2
                  class="text-lg font-semibold text-gray-800 flex items-center"
                >
                  <i class="pi pi-calendar text-primary-500 mr-2"></i>
                  Availability
                </h2>
                <Button
                  icon="pi pi-calendar-plus"
                  label="Set Availability"
                  class="p-button-sm"
                  @click="showAvailabilityDialog = true"
                />
              </div>

              <div class="p-6">
                <!-- Availability display -->
                <div
                  v-if="availableDates.length === 0"
                  class="text-center p-8 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 transition-all duration-300 hover:border-primary-200"
                >
                  <div
                    class="bg-white inline-flex p-4 rounded-full mb-4 shadow-sm"
                  >
                    <i class="pi pi-calendar text-gray-400 text-2xl"></i>
                  </div>
                  <p class="text-gray-700 font-medium mb-2 text-base">
                    You haven't set your availability yet
                  </p>
                  <p class="text-sm text-gray-500 mb-4 max-w-md mx-auto">
                    Let recruiters know when you're available to work to
                    increase your chances of being selected for events
                  </p>
                  <Button
                    icon="pi pi-calendar-plus"
                    label="Set Availability"
                    class="p-button-sm shadow-sm"
                    @click="showAvailabilityDialog = true"
                  />
                </div>

                <div v-else>
                  <div
                    class="bg-gradient-to-br from-primary-50 to-white p-4 rounded-lg mb-4 border border-primary-100"
                  >
                    <p
                      class="text-sm text-primary-700 mb-1 font-medium flex items-center"
                    >
                      <i class="pi pi-info-circle mr-2 text-primary-500"></i>
                      You're available on the following dates:
                    </p>
                  </div>
                  <div
                    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3"
                  >
                    <div
                      v-for="(date, index) in availableDates"
                      :key="index"
                      class="flex items-center bg-green-50 rounded-lg p-3 transition-all duration-300 hover:bg-green-100 hover:shadow-sm border border-green-100"
                    >
                      <i
                        class="pi pi-calendar-check text-green-600 mr-2 text-base"
                      ></i>
                      <p class="text-green-800 font-medium text-sm">
                        {{ formatAvailabilityDate(date) }}
                      </p>
                    </div>
                  </div>
                  <div class="mt-4 flex justify-end">
                    <Button
                      icon="pi pi-pencil"
                      label="Edit Availability"
                      class="p-button-outlined p-button-sm"
                      @click="showAvailabilityDialog = true"
                    />
                  </div>
                </div>
              </div>
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
                      <div v-if="profile?.profilePictureUrl" class="mr-5">
                        <img
                          :src="getImageUrl(profile.profilePictureUrl)"
                          alt="Profile"
                          class="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
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
                            class="bg-primary-100 p-2.5 rounded-full mr-3 shadow-sm"
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
                        class="p-4 flex items-center justify-between border-b bg-white hover:bg-gray-50 transition-colors"
                      >
                        <div class="flex items-center">
                          <div
                            class="bg-primary-100 p-2.5 rounded-full mr-3 shadow-sm"
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

                      <div
                        class="p-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
                      >
                        <div class="flex items-center">
                          <div
                            class="bg-primary-100 p-2.5 rounded-full mr-3 shadow-sm"
                          >
                            <i class="pi pi-bell text-primary-600 text-lg"></i>
                          </div>
                          <div>
                            <h4 class="font-medium text-gray-800 text-sm">
                              Notifications
                            </h4>
                            <p class="text-xs text-gray-500">
                              Control how you receive notifications
                            </p>
                          </div>
                        </div>
                        <Button
                          label="Manage"
                          icon="pi pi-cog"
                          class="p-button-text p-button-sm"
                        />
                      </div>
                    </div>

                    <div class="mt-8">
                      <h3
                        class="text-base font-medium text-red-600 mb-3 flex items-center"
                      >
                        <i
                          class="pi pi-exclamation-triangle text-red-500 mr-2"
                        ></i>
                        Danger Zone
                      </h3>
                      <div
                        class="border border-red-200 rounded-xl p-5 bg-red-50 transition-all duration-300 hover:shadow-md"
                      >
                        <h4
                          class="font-medium text-red-700 text-sm flex items-center"
                        >
                          <i class="pi pi-trash text-red-500 mr-2"></i>
                          Delete Account
                        </h4>
                        <p class="text-sm text-red-600 mb-3 mt-1 pl-6">
                          Permanently delete your account and all associated
                          data. This action cannot be undone.
                        </p>
                        <div class="pl-6">
                          <Button
                            icon="pi pi-trash"
                            label="Delete Account"
                            class="p-button-danger p-button-sm"
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
    </div>

    <!-- Add Experience Dialog -->
    <Dialog
      v-model:visible="showAddExperienceDialog"
      header="Add Work Experience"
      :style="{ width: '500px' }"
      :modal="true"
      class="experience-dialog rounded-xl"
    >
      <div class="p-fluid">
        <div class="field mb-4">
          <label
            for="jobType"
            class="font-medium mb-2 block text-gray-700 text-sm flex items-center"
            ><i class="pi pi-briefcase text-primary-500 mr-2"></i> Job
            Type</label
          >
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
        <div class="field mb-4">
          <label
            for="experienceText"
            class="font-medium mb-2 block text-gray-700 text-sm flex items-center"
            ><i class="pi pi-comment text-primary-500 mr-2"></i>
            Description</label
          >
          <Textarea
            id="experienceText"
            v-model="experienceForm.experienceText"
            rows="5"
            placeholder="Describe your experience, responsibilities, and achievements"
            class="w-full shadow-sm"
            style="
              border-radius: 0.75rem;
              background-color: #f9fafb;
              padding: 0.75rem 1rem;
            "
          />
        </div>
        <div class="flex justify-end gap-3 mt-5 pt-4 border-t border-gray-100">
          <Button
            label="Cancel"
            icon="pi pi-times"
            class="p-button-text"
            @click="showAddExperienceDialog = false"
          />
          <Button
            label="Save Experience"
            icon="pi pi-check"
            @click="saveExperience"
            :loading="savingExperience"
            style="border-radius: 0.75rem"
          />
        </div>
      </div>
    </Dialog>

    <!-- Availability Dialog -->
    <Dialog
      v-model:visible="showAvailabilityDialog"
      header="Set Your Availability"
      :style="{ width: '500px' }"
      :modal="true"
      class="availability-dialog rounded-xl"
    >
      <div class="p-fluid">
        <div class="field mb-4">
          <label
            class="font-medium mb-2 block text-gray-700 text-sm flex items-center"
            ><i class="pi pi-calendar text-primary-500 mr-2"></i> Select Dates
            You're Available</label
          >
          <div
            class="bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-inner"
          >
            <Calendar
              v-model="selectedDates"
              selectionMode="multiple"
              :inline="true"
              :minDate="new Date()"
              class="w-full shadow-sm"
              style="border-radius: 0.75rem"
            />
          </div>
          <p class="text-xs text-gray-500 mt-2 flex items-center">
            <i class="pi pi-info-circle text-primary-400 mr-1"></i>
            Select all dates when you would be available to work
          </p>
        </div>
        <div class="flex justify-end gap-3 mt-5 pt-4 border-t border-gray-100">
          <Button
            label="Cancel"
            icon="pi pi-times"
            class="p-button-text"
            @click="showAvailabilityDialog = false"
          />
          <Button
            label="Save Availability"
            icon="pi pi-check"
            @click="saveAvailability"
            :loading="savingAvailability"
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue';
import { useProfileStore } from '@/stores/profile';
import { useAuthStore } from '@/stores/auth';
import { format, parseISO } from 'date-fns';
import { apiClient } from '@/services/api.service';
import candidateService from '@/services/candidate.service';
import profileMock from '@/mocks/profile.mock';
import experiencesMock from '@/mocks/experiences.mock';
import availabilityMock from '@/mocks/availability.mock';
import Password from 'primevue/password';

// Initialize stores with explicit error handling
let profileStore;
let authStore;

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
    console.log('Falling back to mock data');

    // Fallback to mock data
    profile.value = profileMock;
    experiences.value = experiencesMock;
    availableDates.value = availabilityMock;

    // Try to find a profile picture in assets directory
    if (profile.value && !profile.value.profilePictureUrl) {
      const username = profile.value.username || '';
      if (username) {
        // Try common image formats
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
  } finally {
    // Always set loading to false to prevent getting stuck on loading screen
    loading.value = false;
  }

  // Helper function to load experiences and availability
  async function loadExperiencesAndAvailability() {
    // Try to fetch experiences
    try {
      const expResponse = await apiClient.get('/experiences');
      if (
        expResponse.data &&
        (expResponse.data.data || expResponse.data.length)
      ) {
        experiences.value = expResponse.data.data || expResponse.data;
      }
    } catch (expError) {
      console.warn('Failed to fetch experiences, using mock data:', expError);
      experiences.value = experiencesMock;
    }

    // Try to fetch availability
    try {
      const availResponse = await apiClient.get('/availability');
      if (
        availResponse.data &&
        (availResponse.data.data || availResponse.data.length)
      ) {
        availableDates.value = availResponse.data.data || availResponse.data;
      }
    } catch (availError) {
      console.warn(
        'Failed to fetch availability, using mock data:',
        availError
      );
      availableDates.value = availabilityMock;
    }
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

  try {
    let response;

    // First try: Use auth store if available
    if (typeof authStore?.changePassword === 'function') {
      console.log('Using authStore.changePassword method');
      response = await authStore.changePassword(
        passwordForm.value.currentPassword,
        passwordForm.value.newPassword,
        passwordForm.value.confirmPassword
      );
    }
    // Fallback: Use candidate service directly
    else {
      console.log('Fallback: Using candidateService.changePassword directly');
      response = await candidateService.changePassword(
        passwordForm.value.currentPassword,
        passwordForm.value.newPassword,
        passwordForm.value.confirmPassword
      );
    }

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
    } else {
      throw new Error('Failed to change password. Please try again.');
    }
  } catch (error) {
    console.error('Password change error:', error);

    // Get error message
    let errorMessage = 'Failed to change password. Please try again.';

    // Check for specific error cases
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;

      // Check for common error messages about same password
      if (
        errorMessage.toLowerCase().includes('same as') ||
        errorMessage.toLowerCase().includes('must be different') ||
        errorMessage.toLowerCase().includes('cannot be identical') ||
        errorMessage.toLowerCase().includes('password already used')
      ) {
        errorMessage =
          'New password must be different from your current password';
        passwordFormErrors.value.newPassword = errorMessage;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }

    passwordSubmissionError.value = errorMessage;
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
  if (profile?.preferredLocation) return profile.preferredLocation;

  // Check if location exists in the profile (fallback)
  if (profile?.location) return profile.location;

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
    // Return a default avatar or empty string when no URL is provided
    return '';
  }

  // Handle URLs that start with http or https
  if (url.startsWith('http')) {
    // Check if the URL contains 'undefined' which indicates an error
    if (url.includes('/undefined')) {
      console.warn('Invalid image URL detected:', url);
      return ''; // Return empty string to avoid broken images
    }
    return url;
  }

  // Extract filename from path if it's from profile-pictures
  if (url.includes('profile-pictures/')) {
    const filename = url.split('/').pop();

    // Make sure filename is valid
    if (!filename || filename === 'undefined') {
      console.warn('Invalid filename detected in profile picture path', url);
      return '';
    }

    // Try direct import from assets
    try {
      // Use relative path to assets directory
      return new URL(
        `../../assets/profile-pictures/${filename}`,
        import.meta.url
      ).href;
    } catch (error) {
      console.warn('Could not import profile picture:', error);

      // If not found via import, try as absolute path
      if (url.startsWith('/')) {
        return `${window.location.origin}${url}`;
      }

      return '';
    }
  }

  // Handle relative paths from backend
  if (url.startsWith('/')) {
    return `${window.location.origin}${url}`;
  }

  // Default case
  return url;
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
  { label: 'Malay', value: 'MALAY' },
  { label: 'Chinese', value: 'CHINESE' },
  { label: 'Tamil', value: 'TAMIL' },
  { label: 'Arabic', value: 'ARABIC' },
  { label: 'Cantonese', value: 'CANTONESE' },
  { label: 'French', value: 'FRENCH' },
  { label: 'German', value: 'GERMAN' },
  { label: 'Hakka', value: 'HAKKA' },
  { label: 'Hindi', value: 'HINDI' },
  { label: 'Hokkien', value: 'HOKKIEN' },
  { label: 'Japanese', value: 'JAPANESE' },
  { label: 'Korean', value: 'KOREAN' },
  { label: 'Spanish', value: 'SPANISH' },
  { label: 'Thai', value: 'THAI' },
  { label: 'Vietnamese', value: 'VIETNAMESE' },
  { label: 'Other', value: 'OTHER' },
];

const jobTypeOptions = [
  { label: 'Event Promoter', value: 'PROMOTER' },
  { label: 'Event Assistant', value: 'ASSISTANT' },
  { label: 'Brand Ambassador', value: 'BRAND_AMBASSADOR' },
  { label: 'Registration Staff', value: 'REGISTRATION' },
  { label: 'Emcee', value: 'EMCEE' },
  { label: 'Usher', value: 'USHER' },
  { label: 'Logistics Staff', value: 'LOGISTICS' },
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
  // Get location from profile using helper function
  const locationValue = getLocation(profile.value);

  // Reset error states
  formErrors.value = {};
  formSubmissionError.value = '';

  editForm.value = {
    ...profile.value,
    dateOfBirth: profile.value?.dateOfBirth
      ? parseISO(profile.value.dateOfBirth)
      : null,
    location: locationValue !== 'No location set' ? locationValue : '',
    // Make sure race is explicitly assigned (not undefined)
    race: profile.value?.race || null,
    gender: profile.value?.gender || null,
    employmentStatus: profile.value?.employmentStatus || null,
  };

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
      // Set preferredLocation for API compatibility
      preferredLocation: editForm.value.location || null,
      // Ensure race field is included
      race: editForm.value.race || null,
    };

    // Create a clean request payload
    const requestData = {
      name: formattedData.name,
      bio: formattedData.bio || null,
      phoneNumber: formattedData.phoneNumber || null,
      preferredLocation: formattedData.preferredLocation || null,
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

      // Update local profile state with the response data
      profile.value = { ...profile.value, ...responseData };

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
    const experience = experiences.value[index];
    if (experience.id) {
      // Call API to delete if we have an ID
      await candidateService.deleteExperience(experience.id);
    }
    // Remove from local state
    experiences.value.splice(index, 1);
  } catch (error) {
    console.error('Error deleting experience:', error);
    // Show error toast or notification here
  }
};

// Resume-related functions
const handleResumeUpload = async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  uploadingResume.value = true;
  try {
    const response = await candidateService.uploadResume(file);
    const resumeUrl =
      response.data?.data?.resumeUrl || response.data?.resumeUrl;

    if (resumeUrl) {
      profile.value = { ...profile.value, resumeUrl };
    }
  } catch (error) {
    console.error('Error uploading resume:', error);
    // Show error toast or notification here
  } finally {
    uploadingResume.value = false;
    // Reset file input
    if (resumeFileInput.value) {
      resumeFileInput.value.value = '';
    }
  }
};

const downloadResume = () => {
  if (profile.value?.resumeUrl) {
    window.open(profile.value.resumeUrl, '_blank');
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
      profile.value = { ...profile.value, profilePictureUrl };
    }
  } catch (error) {
    console.error('Error uploading profile picture:', error);
  } finally {
    uploadingProfilePicture.value = false;
    // Reset file input
    if (profilePictureInput.value) {
      profilePictureInput.value.value = '';
    }
  }
};
</script>

<style scoped>
/* Custom form styles */
.form-label {
  @apply block text-sm font-medium text-gray-700 mb-1;
}

.form-group {
  @apply mb-4;
}

:deep(.p-button) {
  border-radius: 0.75rem;
}

:deep(.p-button.p-button-sm) {
  padding: 0.4rem 1rem;
  font-size: 0.875rem;
}

:deep(.p-button.p-button-text) {
  color: var(--primary-600);
}

:deep(.p-button.p-button-text:hover) {
  background: rgba(108, 99, 255, 0.08);
}

:deep(.p-button.p-button-text.p-button-danger) {
  color: #dc2626;
}

:deep(.p-button.p-button-text.p-button-danger:hover) {
  background: rgba(220, 38, 38, 0.08);
}

:deep(.p-progressbar) {
  background: #e2e8f0;
  border-radius: 9999px;
  height: 0.375rem;
}

:deep(.p-progressbar-value) {
  background: var(--primary-600);
  border-radius: 9999px;
}

:deep(.p-inputtext),
:deep(.p-dropdown),
:deep(.p-multiselect),
:deep(.p-calendar .p-inputtext) {
  border-radius: 0.75rem;
  transition: all 0.2s ease;
}

:deep(.p-dropdown:hover),
:deep(.p-multiselect:hover),
:deep(.p-inputtext:hover),
:deep(.p-calendar .p-inputtext:hover) {
  border-color: var(--primary-400);
}

:deep(.p-dropdown:focus),
:deep(.p-multiselect:focus),
:deep(.p-inputtext:focus),
:deep(.p-calendar .p-inputtext:focus) {
  border-color: var(--primary-500);
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
}

:deep(.p-calendar) {
  width: 100%;
}

:deep(.p-calendar .p-button) {
  background-color: transparent;
  border: none;
  color: var(--primary-600);
}

:deep(.p-datepicker-trigger) {
  display: flex !important;
  visibility: visible !important;
  opacity: 1 !important;
  color: var(--primary-600) !important;
}

:deep(.p-calendar .p-datepicker-trigger-icon) {
  color: var(--primary-600) !important;
}

:deep(.p-dialog) {
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

:deep(.p-dialog .p-dialog-header) {
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
  padding: 1.25rem 1.5rem;
  background-color: white;
  border-bottom: 1px solid #e5e7eb;
}

:deep(.p-dialog .p-dialog-content) {
  padding: 1.5rem;
  background-color: white;
}

:deep(.p-chip) {
  background: var(--primary-50);
  color: var(--primary-700);
  border-radius: 9999px;
  padding: 0.25rem 0.75rem;
}

/* MultiSelect token styles */
:deep(.p-multiselect-token) {
  background-color: rgba(99, 102, 241, 0.1);
  color: var(--primary-600);
  border-radius: 9999px;
  margin-right: 0.25rem;
  padding: 0.25rem 0.5rem;
}

:deep(.p-multiselect-token-icon) {
  margin-left: 0.25rem;
}

/* Remove any outlines or focus styles that might show in red */
:deep(.p-dropdown:focus),
:deep(.p-dropdown-item:focus),
:deep(.p-multiselect:focus),
:deep(.p-multiselect-item:focus),
:deep(*:focus) {
  outline: none !important;
}

/* Animation Classes */
.animate-fadeIn {
  animation: fadeIn 0.5s ease-in-out;
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

/* Calendar styles */
:deep(.p-datepicker) {
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

:deep(.p-datepicker table td > span.p-highlight) {
  background: var(--primary-500);
}

:deep(.p-datepicker table td.p-datepicker-today > span) {
  border-color: var(--primary-300);
}

:deep(
    .p-datepicker:not(.p-disabled)
      table
      td
      span:not(.p-highlight):not(.p-disabled):hover
  ) {
  background: var(--primary-100);
}

:deep(.p-datepicker .p-datepicker-header) {
  background: linear-gradient(to right, var(--primary-500), var(--primary-400));
  color: white;
  border-bottom: none;
}

:deep(.p-datepicker .p-datepicker-header .p-datepicker-title) {
  font-weight: 600;
}

:deep(.p-datepicker .p-datepicker-header button) {
  color: white;
}
</style>
