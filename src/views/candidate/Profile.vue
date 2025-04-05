<template>
  <div
    class="flex flex-col md:flex-row min-h-screen justify-center items-center"
  >
    <!-- Container for the profile content - centers everything and constrains max width -->
    <div class="flex flex-col md:flex-row w-full max-w-7xl shadow-lg">
      <!-- Left Sidebar -->
      <div
        class="w-full md:w-72 lg:w-80 border-r md:sticky md:top-0 md:h-screen md:overflow-y-auto flex flex-col bg-gray-50 shadow-sm"
      >
        <!-- Profile Photo & Name Section -->
        <div
          class="flex flex-col items-center px-6 py-6 border-b bg-gradient-to-b from-primary-50 to-gray-50"
        >
          <div class="w-20 h-20 relative mb-3">
            <div
              v-if="profile?.profilePictureUrl"
              class="w-full h-full overflow-hidden rounded-full border-2 border-primary-100 shadow-md"
            >
              <img
                :src="profile.profilePictureUrl"
                alt="Profile"
                class="w-full h-full object-cover"
              />
            </div>
            <div
              v-else
              class="w-full h-full rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-3xl font-bold border border-primary-200 shadow-md"
            >
              {{ getInitials(profile?.name) }}
            </div>
          </div>

          <h3 class="text-xl font-semibold text-center text-gray-800">
            {{ profile?.name || 'Your Name' }}
          </h3>
          <p class="text-gray-500 text-sm text-center">
            {{ profile?.username || '@username' }}
          </p>
          <p class="text-xs text-gray-500 mt-1 text-center mb-2">
            {{ profile?.location || 'No location set' }}
          </p>
          <button
            @click="profilePictureInput.click()"
            class="mt-1 text-sm text-primary-600 flex items-center hover:text-primary-700 hover:underline transition-colors"
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
          <ul class="space-y-0.5">
            <li>
              <button
                @click="activeSection = 'basic-info'"
                :class="[
                  'w-full text-left py-2 px-6 flex items-center transition-colors duration-150 text-base',
                  activeSection === 'basic-info'
                    ? 'bg-white text-primary-600 font-medium border-l-4 border-primary-500 shadow-sm'
                    : 'text-gray-700 hover:bg-white hover:bg-opacity-60 border-l-4 border-transparent',
                ]"
              >
                <i class="pi pi-user text-lg w-6 mr-3"></i> Basic Information
              </button>
            </li>
            <li>
              <button
                @click="activeSection = 'resume'"
                :class="[
                  'w-full text-left py-2 px-6 flex items-center transition-colors duration-150 text-base',
                  activeSection === 'resume'
                    ? 'bg-white text-primary-600 font-medium border-l-4 border-primary-500 shadow-sm'
                    : 'text-gray-700 hover:bg-white hover:bg-opacity-60 border-l-4 border-transparent',
                ]"
              >
                <i class="pi pi-file-pdf text-lg w-6 mr-3"></i> Resume
              </button>
            </li>
            <li>
              <button
                @click="activeSection = 'work-experience'"
                :class="[
                  'w-full text-left py-2 px-6 flex items-center transition-colors duration-150 text-base',
                  activeSection === 'work-experience'
                    ? 'bg-white text-primary-600 font-medium border-l-4 border-primary-500 shadow-sm'
                    : 'text-gray-700 hover:bg-white hover:bg-opacity-60 border-l-4 border-transparent',
                ]"
              >
                <i class="pi pi-briefcase text-lg w-6 mr-3"></i> Work Experience
              </button>
            </li>
            <li>
              <button
                @click="activeSection = 'availability'"
                :class="[
                  'w-full text-left py-2 px-6 flex items-center transition-colors duration-150 text-base',
                  activeSection === 'availability'
                    ? 'bg-white text-primary-600 font-medium border-l-4 border-primary-500 shadow-sm'
                    : 'text-gray-700 hover:bg-white hover:bg-opacity-60 border-l-4 border-transparent',
                ]"
              >
                <i class="pi pi-calendar text-lg w-6 mr-3"></i> Availability
              </button>
            </li>
            <li>
              <button
                @click="activeSection = 'settings'"
                :class="[
                  'w-full text-left py-2 px-6 flex items-center transition-colors duration-150 text-base',
                  activeSection === 'settings'
                    ? 'bg-white text-primary-600 font-medium border-l-4 border-primary-500 shadow-sm'
                    : 'text-gray-700 hover:bg-white hover:bg-opacity-60 border-l-4 border-transparent',
                ]"
              >
                <i class="pi pi-cog text-lg w-6 mr-3"></i> Account Settings
              </button>
            </li>
          </ul>
        </nav>

        <!-- Profile Completion Card -->
        <div class="px-6 py-4 mt-auto border-t">
          <div class="pt-1">
            <h3 class="text-sm font-medium mb-2 text-gray-700">
              Profile Completion
            </h3>
            <div class="mb-1 flex justify-between items-center">
              <span class="text-sm font-medium text-gray-800"
                >{{ profileCompletionPercentage }}% Complete</span
              >
              <span class="text-sm text-primary-600 font-medium">{{
                profileCompletionStatus
              }}</span>
            </div>
            <div class="w-full bg-white rounded-full h-3 shadow-sm">
              <div
                class="bg-primary-500 h-3 rounded-full transition-all duration-500"
                :style="`width: ${profileCompletionPercentage}%`"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Area -->
      <div class="flex-1 py-6 px-5 md:py-8 md:px-6 flex justify-center">
        <!-- Content Container with Max Width -->
        <div class="w-full max-w-4xl">
          <!-- Loading state -->
          <div v-if="loading" class="flex justify-center py-20">
            <i class="pi pi-spin pi-spinner text-primary-500 text-4xl"></i>
          </div>

          <div v-else>
            <!-- Basic Information Section -->
            <div v-show="activeSection === 'basic-info'">
              <div
                class="rounded-lg shadow-md border mb-8 overflow-hidden bg-white"
              >
                <div
                  class="flex justify-between items-center p-4 md:p-6 border-b bg-white"
                >
                  <h2 class="text-xl font-semibold text-gray-800">
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
                    <div class="group">
                      <p class="text-sm text-gray-500 mb-1 font-medium">
                        Full Name
                      </p>
                      <p
                        class="text-base text-gray-800 border-b border-gray-100 pb-1"
                      >
                        {{ profile?.name || 'Not provided' }}
                      </p>
                    </div>
                    <div class="group">
                      <p class="text-sm text-gray-500 mb-1 font-medium">
                        Employment Status
                      </p>
                      <p
                        class="text-base text-gray-800 border-b border-gray-100 pb-1"
                      >
                        {{ profile?.employmentStatus || 'Student' }}
                      </p>
                    </div>
                    <div class="group">
                      <p class="text-sm text-gray-500 mb-1 font-medium">
                        Email Address
                      </p>
                      <p
                        class="text-base text-gray-800 border-b border-gray-100 pb-1"
                      >
                        {{ profile?.email || 'Not provided' }}
                      </p>
                    </div>
                    <div class="group">
                      <p class="text-sm text-gray-500 mb-1 font-medium">
                        Phone Number
                      </p>
                      <p
                        class="text-base text-gray-800 border-b border-gray-100 pb-1"
                      >
                        {{ profile?.phoneNumber || 'Not provided' }}
                      </p>
                    </div>
                    <div class="group">
                      <p class="text-sm text-gray-500 mb-1 font-medium">
                        Location
                      </p>
                      <p
                        class="text-base text-gray-800 border-b border-gray-100 pb-1"
                      >
                        {{ profile?.location || 'Not provided' }}
                      </p>
                    </div>
                    <div class="group">
                      <p class="text-sm text-gray-500 mb-1 font-medium">
                        Date of Birth
                      </p>
                      <p
                        class="text-base text-gray-800 border-b border-gray-100 pb-1"
                      >
                        {{ formatDate(profile?.dateOfBirth) }}
                      </p>
                    </div>
                    <div class="group">
                      <p class="text-sm text-gray-500 mb-1 font-medium">
                        Ethnicity
                      </p>
                      <p
                        class="text-base text-gray-800 border-b border-gray-100 pb-1"
                      >
                        {{ formatRace(profile?.race) }}
                      </p>
                    </div>
                    <div class="group">
                      <p class="text-sm text-gray-500 mb-1 font-medium">
                        Gender
                      </p>
                      <p
                        class="text-base text-gray-800 border-b border-gray-100 pb-1"
                      >
                        {{ formatGender(profile?.gender) }}
                      </p>
                    </div>
                  </div>

                  <div class="mt-8">
                    <p class="text-sm text-gray-500 mb-2 font-medium">
                      Languages
                    </p>
                    <div class="flex flex-wrap gap-2">
                      <span
                        v-for="lang in profile?.languages"
                        :key="lang"
                        class="inline-block px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-sm shadow-sm"
                      >
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

                  <div class="mt-8">
                    <p class="text-sm text-gray-500 mb-2 font-medium">
                      About Me
                    </p>
                    <p
                      class="text-base text-gray-800 p-3 bg-gray-50 rounded-lg"
                    >
                      {{ profile?.bio || 'No bio provided' }}
                    </p>
                  </div>
                </div>

                <!-- Basic info edit mode -->
                <div v-else class="p-6 bg-white rounded-lg">
                  <form @submit.prevent="saveBasicInfo">
                    <div
                      class="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6"
                    >
                      <div class="form-group">
                        <label
                          for="name"
                          class="font-medium text-gray-700 mb-1 block text-sm"
                          >Full Name</label
                        >
                        <InputText
                          id="name"
                          v-model="editForm.name"
                          class="w-full shadow-sm"
                          style="
                            border-radius: 0.5rem;
                            background-color: #f9fafb;
                            padding: 0.5rem 0.75rem;
                          "
                        />
                      </div>
                      <div class="form-group">
                        <label
                          for="phoneNumber"
                          class="font-medium text-gray-700 mb-1 block text-sm"
                          >Phone Number</label
                        >
                        <InputText
                          id="phoneNumber"
                          v-model="editForm.phoneNumber"
                          class="w-full shadow-sm"
                          style="
                            border-radius: 0.5rem;
                            background-color: #f9fafb;
                            padding: 0.5rem 0.75rem;
                          "
                        />
                      </div>
                      <div class="form-group">
                        <label
                          for="location"
                          class="font-medium text-gray-700 mb-1 block text-sm"
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
                          >Date of Birth</label
                        >
                        <Calendar
                          id="dateOfBirth"
                          v-model="editForm.dateOfBirth"
                          dateFormat="yy-mm-dd"
                          :showIcon="true"
                          :maxDate="maxDate"
                          class="w-full shadow-sm"
                          style="
                            border-radius: 0.5rem;
                            background-color: #f9fafb;
                          "
                          placeholder="Select date of birth"
                          :pt="{
                            input: {
                              style:
                                'border-radius: 0.5rem; background-color: #f9fafb; padding: 0.5rem 0.75rem;',
                            },
                            trigger: {
                              class: 'visible opacity-100',
                              style:
                                'color: var(--primary-600); display: flex;',
                            },
                          }"
                        />
                      </div>
                      <div class="form-group">
                        <label
                          for="race"
                          class="font-medium text-gray-700 mb-1 block text-sm"
                          >Ethnicity</label
                        >
                        <Dropdown
                          id="race"
                          v-model="editForm.race"
                          :options="raceOptions"
                          optionLabel="label"
                          optionValue="value"
                          class="w-full shadow-sm"
                          style="
                            border-radius: 0.5rem;
                            background-color: #f9fafb;
                          "
                          placeholder="Select ethnicity"
                          :showClear="false"
                        />
                      </div>
                      <div class="form-group">
                        <label
                          for="gender"
                          class="font-medium text-gray-700 mb-1 block text-sm"
                          >Gender</label
                        >
                        <Dropdown
                          id="gender"
                          v-model="editForm.gender"
                          :options="genderOptions"
                          optionLabel="label"
                          optionValue="value"
                          class="w-full shadow-sm"
                          style="
                            border-radius: 0.5rem;
                            background-color: #f9fafb;
                          "
                          placeholder="Select gender"
                          :showClear="false"
                        />
                      </div>
                    </div>

                    <div class="mt-8">
                      <label
                        for="languages"
                        class="font-medium text-gray-700 mb-1 block text-sm"
                        >Languages</label
                      >
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

                    <div class="mt-8">
                      <label
                        for="bio"
                        class="font-medium text-gray-700 mb-1 block text-sm"
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
            <div v-show="activeSection === 'resume'">
              <div
                class="rounded-lg shadow-md border mb-5 bg-white overflow-hidden"
              >
                <div
                  class="flex justify-between items-center p-4 md:p-5 border-b"
                >
                  <h2 class="text-lg font-semibold text-gray-800">Resume</h2>
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

                <div class="p-4">
                  <!-- Resume display -->
                  <div
                    v-if="profile?.resumeUrl"
                    class="flex flex-col md:flex-row md:items-center md:justify-between p-4 border rounded-lg bg-white shadow-sm"
                  >
                    <div class="flex items-center mb-3 md:mb-0">
                      <div class="bg-primary-50 p-2 rounded-lg mr-3 shadow-sm">
                        <i class="pi pi-file-pdf text-primary-600 text-lg"></i>
                      </div>
                      <div>
                        <p class="font-medium text-gray-800">Your Resume</p>
                        <p class="text-sm text-gray-500">
                          Uploaded {{ formatResumeUploadDate() }}
                        </p>
                      </div>
                    </div>
                    <div class="flex gap-3">
                      <Button
                        icon="pi pi-download"
                        label="Download"
                        class="p-button-outlined p-button-sm"
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
                    class="text-center p-6 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50"
                  >
                    <div
                      class="bg-white inline-flex p-3 rounded-full mb-3 shadow-sm"
                    >
                      <i class="pi pi-file-pdf text-gray-400 text-xl"></i>
                    </div>
                    <p class="text-gray-700 font-medium mb-1 text-sm">
                      No resume uploaded yet
                    </p>
                    <p class="text-xs text-gray-500 mb-3 max-w-md mx-auto">
                      Upload your resume to pre-fill job applications and
                      increase your chances of being hired
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
            <div v-show="activeSection === 'work-experience'">
              <div
                class="rounded-lg shadow-md border mb-5 bg-white overflow-hidden"
              >
                <div class="flex justify-between items-center p-4 border-b">
                  <h2 class="text-lg font-semibold text-gray-800">
                    Work Experience
                  </h2>
                  <Button
                    icon="pi pi-plus"
                    label="Add Experience"
                    class="p-button-sm"
                    @click="showAddExperienceDialog = true"
                  />
                </div>

                <div class="p-4">
                  <!-- Experience list -->
                  <div
                    v-if="experiences.length === 0"
                    class="text-center p-6 bg-gray-50 rounded-lg"
                  >
                    <div
                      class="bg-white inline-flex p-3 rounded-full mb-3 shadow-sm"
                    >
                      <i class="pi pi-briefcase text-gray-400 text-xl"></i>
                    </div>
                    <p class="text-gray-700 font-medium mb-1 text-sm">
                      You haven't added any work experience yet
                    </p>
                    <p class="text-xs text-gray-500 mb-3 max-w-md mx-auto">
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

                  <div v-else class="space-y-3">
                    <div
                      v-for="(exp, index) in experiences"
                      :key="index"
                      class="border rounded-lg p-4 hover:shadow-md transition-shadow duration-200 bg-white"
                    >
                      <div class="flex justify-between">
                        <div>
                          <div class="flex items-center mb-2">
                            <div
                              class="bg-primary-50 w-8 h-8 rounded-full flex items-center justify-center mr-2 shadow-sm"
                            >
                              <i
                                class="pi pi-briefcase text-primary-600 text-sm"
                              ></i>
                            </div>
                            <h3 class="font-medium text-base text-gray-800">
                              {{ formatJobType(exp.jobType) }}
                            </h3>
                          </div>
                          <p
                            class="text-gray-600 pl-10 leading-relaxed text-sm"
                          >
                            {{ exp.experienceText }}
                          </p>
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
            <div v-show="activeSection === 'availability'">
              <div class="rounded-lg shadow-sm mb-5">
                <div class="flex justify-between items-center p-4 border-b">
                  <h2 class="text-lg font-semibold">Availability</h2>
                  <Button
                    icon="pi pi-calendar-plus"
                    label="Set Availability"
                    class="p-button-sm"
                    @click="showAvailabilityDialog = true"
                  />
                </div>

                <div class="p-4">
                  <!-- Availability display -->
                  <div
                    v-if="availableDates.length === 0"
                    class="text-center p-6"
                  >
                    <div class="bg-gray-50 inline-flex p-3 rounded-full mb-2">
                      <i class="pi pi-calendar text-gray-400 text-xl"></i>
                    </div>
                    <p class="text-gray-700 font-medium mb-1 text-sm">
                      You haven't set your availability yet
                    </p>
                    <p class="text-xs text-gray-500 mb-3 max-w-md mx-auto">
                      Let recruiters know when you're available to work to
                      increase your chances of being selected for events
                    </p>
                    <Button
                      icon="pi pi-calendar-plus"
                      label="Set Availability"
                      class="p-button-sm"
                      @click="showAvailabilityDialog = true"
                    />
                  </div>

                  <div v-else>
                    <p class="text-xs text-gray-500 mb-3">
                      You're available on the following dates:
                    </p>
                    <div
                      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2"
                    >
                      <div
                        v-for="(date, index) in availableDates"
                        :key="index"
                        class="flex items-center bg-green-50 rounded-lg p-2"
                      >
                        <i
                          class="pi pi-calendar-check text-green-600 mr-2 text-sm"
                        ></i>
                        <p class="text-green-800 font-medium text-xs">
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
            <div v-show="activeSection === 'settings'">
              <div
                class="rounded-lg shadow-md border mb-5 bg-white overflow-hidden"
              >
                <div class="p-4 border-b">
                  <h2 class="text-lg font-semibold text-gray-800">
                    Account Settings
                  </h2>
                </div>

                <div class="p-4">
                  <div class="space-y-5">
                    <div class="border-b pb-4">
                      <h3 class="text-base font-medium mb-3 text-gray-800">
                        Profile Photo
                      </h3>
                      <div class="flex items-center">
                        <div v-if="profile?.profilePictureUrl" class="mr-4">
                          <img
                            :src="profile.profilePictureUrl"
                            alt="Profile"
                            class="w-16 h-16 rounded-full object-cover border-2 border-gray-100 shadow-sm"
                          />
                        </div>
                        <div
                          v-else
                          class="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 text-lg font-bold mr-4 shadow-sm"
                        >
                          {{ getInitials(profile?.name) }}
                        </div>

                        <div class="space-y-2">
                          <Button
                            icon="pi pi-camera"
                            label="Change Photo"
                            class="p-button-sm w-full"
                            @click="profilePictureInput.click()"
                          />
                          <Button
                            v-if="profile?.profilePictureUrl"
                            icon="pi pi-trash"
                            label="Remove Photo"
                            class="p-button-outlined p-button-danger p-button-sm w-full"
                            @click="removeProfilePicture"
                          />
                        </div>
                      </div>
                    </div>

                    <div class="space-y-3">
                      <h3 class="text-base font-medium mb-1 text-gray-800">
                        Account Management
                      </h3>

                      <div class="border rounded-lg shadow-sm">
                        <div
                          class="p-3 flex items-center justify-between border-b bg-white hover:bg-gray-50 transition-colors"
                        >
                          <div class="flex items-center">
                            <div class="bg-primary-50 p-1.5 rounded-full mr-2">
                              <i
                                class="pi pi-lock text-primary-600 text-base"
                              ></i>
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
                            class="p-button-text p-button-sm"
                          />
                        </div>

                        <div
                          class="p-3 flex items-center justify-between border-b bg-white hover:bg-gray-50 transition-colors"
                        >
                          <div class="flex items-center">
                            <div class="bg-primary-50 p-1.5 rounded-full mr-2">
                              <i
                                class="pi pi-envelope text-primary-600 text-base"
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
                            class="p-button-text p-button-sm"
                          />
                        </div>

                        <div
                          class="p-3 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
                        >
                          <div class="flex items-center">
                            <div class="bg-primary-50 p-1.5 rounded-full mr-2">
                              <i
                                class="pi pi-bell text-primary-600 text-base"
                              ></i>
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
                            class="p-button-text p-button-sm"
                          />
                        </div>
                      </div>

                      <div class="mt-6">
                        <h3 class="text-base font-medium text-red-600 mb-2">
                          Danger Zone
                        </h3>
                        <div
                          class="border border-red-200 rounded-lg p-4 bg-red-50"
                        >
                          <h4 class="font-medium text-red-700 text-sm">
                            Delete Account
                          </h4>
                          <p class="text-xs text-red-600 mb-2">
                            Permanently delete your account and all associated
                            data. This action cannot be undone.
                          </p>
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
      :style="{ width: '450px' }"
      :modal="true"
      class="experience-dialog"
    >
      <div class="p-fluid">
        <div class="field mb-3">
          <label
            for="jobType"
            class="font-medium mb-1 block text-gray-700 text-sm"
            >Job Type</label
          >
          <Dropdown
            id="jobType"
            v-model="experienceForm.jobType"
            :options="jobTypeOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Select job type"
            class="w-full shadow-sm"
            style="border-radius: 0.5rem; background-color: #f9fafb"
          />
        </div>
        <div class="field mb-3">
          <label
            for="experienceText"
            class="font-medium mb-1 block text-gray-700 text-sm"
            >Description</label
          >
          <Textarea
            id="experienceText"
            v-model="experienceForm.experienceText"
            rows="4"
            placeholder="Describe your experience, responsibilities, and achievements"
            class="w-full shadow-sm"
            style="
              border-radius: 0.5rem;
              background-color: #f9fafb;
              padding: 0.5rem 0.75rem;
            "
          />
        </div>
        <div class="flex justify-end gap-3 mt-4 pt-3 border-t border-gray-100">
          <Button
            label="Cancel"
            icon="pi pi-times"
            class="p-button-text"
            @click="showAddExperienceDialog = false"
          />
          <Button
            label="Save"
            icon="pi pi-check"
            @click="saveExperience"
            :loading="savingExperience"
            style="border-radius: 0.5rem"
          />
        </div>
      </div>
    </Dialog>

    <!-- Availability Dialog -->
    <Dialog
      v-model:visible="showAvailabilityDialog"
      header="Set Your Availability"
      :style="{ width: '450px' }"
      :modal="true"
      class="availability-dialog"
    >
      <div class="p-fluid">
        <div class="field mb-3">
          <label class="font-medium mb-2 block text-gray-700 text-sm"
            >Select Dates You're Available</label
          >
          <Calendar
            v-model="selectedDates"
            selectionMode="multiple"
            :inline="true"
            :minDate="new Date()"
            class="w-full shadow-sm"
            style="border-radius: 0.5rem"
          />
        </div>
        <div class="flex justify-end gap-3 mt-4 pt-3 border-t border-gray-100">
          <Button
            label="Cancel"
            icon="pi pi-times"
            class="p-button-text"
            @click="showAvailabilityDialog = false"
          />
          <Button
            label="Save"
            icon="pi pi-check"
            @click="saveAvailability"
            :loading="savingAvailability"
            style="border-radius: 0.5rem"
          />
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue';
import { useProfileStore } from '@/stores/profile';
import { format, parseISO } from 'date-fns';
import candidateService from '@/services/candidate.service';

// Component state
const profile = ref(null);
const loading = ref(true);
const saving = ref(false);
const editingBasicInfo = ref(false);
const editForm = ref({});
const maxDate = new Date(new Date().setFullYear(new Date().getFullYear() - 18));
const activeSection = ref('basic-info'); // Track which section is active

// Experience related state
const experiences = ref([]);
const showAddExperienceDialog = ref(false);
const experienceForm = ref({ jobType: null, experienceText: '' });
const savingExperience = ref(false);
const editingExperienceIndex = ref(-1);

// Availability related state
const availableDates = ref([]);
const showAvailabilityDialog = ref(false);
const selectedDates = ref([]);
const savingAvailability = ref(false);

// Profile store
const profileStore = useProfileStore();

// Options for dropdowns
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

const languageOptions = [
  { label: 'English', value: 'ENGLISH' },
  { label: 'Malay', value: 'MALAY' },
  { label: 'Mandarin', value: 'MANDARIN' },
  { label: 'Tamil', value: 'TAMIL' },
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

// Helper functions for formatting
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

const getInitials = (name) => {
  if (!name) return 'U';
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

// Form actions
const startEditingBasicInfo = () => {
  editForm.value = {
    ...profile.value,
    dateOfBirth: profile.value?.dateOfBirth
      ? parseISO(profile.value.dateOfBirth)
      : null,
  };
  editingBasicInfo.value = true;
};

const cancelEditBasicInfo = () => {
  editingBasicInfo.value = false;
};

const saveBasicInfo = async () => {
  saving.value = true;
  try {
    const formattedData = {
      ...editForm.value,
      dateOfBirth: editForm.value.dateOfBirth
        ? format(editForm.value.dateOfBirth, 'yyyy-MM-dd')
        : null,
    };

    // Update profile using the store (which uses the API)
    await profileStore.updateProfile(formattedData);
    profile.value = { ...profile.value, ...formattedData };

    editingBasicInfo.value = false;
  } catch (error) {
    console.error('Error saving profile:', error);
    // Show error toast or notification here
  } finally {
    saving.value = false;
  }
};

// Experience actions
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
      const savedExperience = response.data.data || experienceForm.value;
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

// Availability actions
const saveAvailability = async () => {
  if (!selectedDates.value || selectedDates.value.length === 0) {
    // Show validation error
    return;
  }

  savingAvailability.value = true;
  try {
    // Format dates and send to API
    const dates = selectedDates.value.map((date) => format(date, 'yyyy-MM-dd'));
    await candidateService.updateAvailability(dates);

    // Update local state with formatted dates
    availableDates.value = dates;
    showAvailabilityDialog.value = false;
  } catch (error) {
    console.error('Error saving availability:', error);
    // Show error toast or notification here
  } finally {
    savingAvailability.value = false;
  }
};

// File upload refs
const resumeFileInput = ref(null);
const profilePictureInput = ref(null);
const uploadingResume = ref(false);
const uploadingProfilePicture = ref(false);

// Resume functions
const handleResumeUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  uploadingResume.value = true;
  try {
    const response = await candidateService.uploadResume(file);
    const resumeUrl = response.data.data?.resumeUrl;

    if (resumeUrl) {
      profile.value = { ...profile.value, resumeUrl };
    }
  } catch (error) {
    console.error('Error uploading resume:', error);
    // Show error toast or notification here
  } finally {
    uploadingResume.value = false;
    // Reset file input
    resumeFileInput.value.value = '';
  }
};

const formatResumeUploadDate = () => {
  if (!profile.value?.resumeUploadedAt) return 'Recently';
  try {
    return format(parseISO(profile.value.resumeUploadedAt), 'MMM d, yyyy');
  } catch {
    return 'Recently';
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

// Profile picture functions
const handleProfilePictureUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  uploadingProfilePicture.value = true;
  try {
    const response = await candidateService.uploadProfilePicture(file);
    const profilePictureUrl = response.data.data?.profilePictureUrl;

    if (profilePictureUrl) {
      profile.value = { ...profile.value, profilePictureUrl };
    }
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    // Show error toast or notification here
  } finally {
    uploadingProfilePicture.value = false;
    // Reset file input
    profilePictureInput.value.value = '';
  }
};

const removeProfilePicture = async () => {
  if (!profile.value?.profilePictureUrl) return;

  try {
    // Call API to remove profile picture
    await candidateService.removeProfilePicture();
    profile.value = { ...profile.value, profilePictureUrl: null };
  } catch (error) {
    console.error('Error removing profile picture:', error);
    // Show error toast or notification here
  }
};

// Load profile data on component mount
onMounted(async () => {
  loading.value = true;
  try {
    // Fetch profile from the API
    await profileStore.fetchProfile();
    profile.value = profileStore.profile;

    // If empty profile or API call fails, use mock data for development
    if (!profile.value) {
      console.warn('No profile data returned from API, using mock data');
      profile.value = {
        name: 'Sarah Johnson',
        username: 'sarahj',
        email: 'sarah.j@example.com',
        phoneNumber: '+60123456789',
        gender: 'FEMALE',
        dateOfBirth: '1995-05-15',
        race: 'CHINESE',
        profilePictureUrl: null,
        languages: ['ENGLISH', 'MANDARIN'],
        bio: 'Experienced event staff with a passion for customer engagement and sales promotions. I have worked at various tech expos and consumer fairs over the past 2 years.',
        location: 'Kuala Lumpur, Malaysia',
        resumeUrl: null,
      };
    }

    // Load experiences
    try {
      const experienceResponse = await candidateService.getExperiences();
      experiences.value = experienceResponse.data.data || [];
    } catch (err) {
      console.error('Error loading experiences:', err);
      // Fallback to mock data
      experiences.value = [
        {
          jobType: 'PROMOTER',
          experienceText:
            'Worked as a product promoter at Tech Expo 2023. Engaged with customers and demonstrated new gadgets.',
        },
        {
          jobType: 'BRAND_AMBASSADOR',
          experienceText:
            'Represented Acme Products at the Consumer Fair 2023. Increased brand visibility and collected leads.',
        },
      ];
    }

    // Load availability
    try {
      const availabilityResponse = await candidateService.getAvailability();
      availableDates.value = availabilityResponse.data.data || [];
    } catch (err) {
      console.error('Error loading availability:', err);
      // Fallback to mock data
      availableDates.value = [
        '2025-04-15',
        '2025-04-16',
        '2025-04-22',
        '2025-04-23',
        '2025-04-24',
      ];
    }
  } catch (error) {
    console.error('Error loading profile:', error);
    // Use mock data as fallback
    profile.value = {
      name: 'Sarah Johnson',
      username: 'sarahj',
      email: 'sarah.j@example.com',
      phoneNumber: '+60123456789',
      gender: 'FEMALE',
      dateOfBirth: '1995-05-15',
      race: 'CHINESE',
      profilePictureUrl: null,
      languages: ['ENGLISH', 'MANDARIN'],
      bio: 'Experienced event staff with a passion for customer engagement and sales promotions.',
      location: 'Kuala Lumpur, Malaysia',
      resumeUrl: null,
    };
  } finally {
    loading.value = false;
  }
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

:deep(.p-button) {
  border-radius: 0.5rem;
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
  border-radius: 0.5rem;
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
  box-shadow: 0 0 0 1px rgba(99, 102, 241, 0.2);
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
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

:deep(.p-dialog .p-dialog-header) {
  border-top-left-radius: 0.75rem;
  border-top-right-radius: 0.75rem;
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
</style>
