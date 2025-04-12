<template>
  <div class="p-8">
    <Toast position="top-right" />
    <ConfirmDialog />

    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center py-20 w-full">
      <div class="animate-pulse flex flex-col items-center">
        <i class="pi pi-spin pi-spinner text-primary-500 text-4xl mb-2"></i>
        <p class="text-primary-500 mb-4">Loading profile data...</p>
      </div>
    </div>

    <!-- Main content -->
    <div v-else class="max-w-6xl mx-auto">
      <!-- Profile header with logo and basic stats -->
      <div class="mb-6 bg-white rounded-lg shadow-md p-6">
        <div
          class="flex flex-col md:flex-row items-start md:items-center gap-6"
        >
          <div class="relative">
            <Avatar
              :image="
                profile.companyLogoUrl
                  ? recruiterService.getLogoUrl(profile.companyLogoUrl)
                  : ''
              "
              class="w-24 h-24 md:w-32 md:h-32"
              v-if="profile.companyLogoUrl"
              alt="Company Logo"
              @error="handleImageError"
            />
            <Avatar
              :icon="
                profile.recruiterType === 'INDIVIDUAL'
                  ? 'pi pi-user'
                  : 'pi pi-building'
              "
              class="w-24 h-24 md:w-32 md:h-32 bg-blue-100"
              :class="
                profile.recruiterType === 'INDIVIDUAL'
                  ? 'text-indigo-600'
                  : 'text-blue-600'
              "
              v-else
              size="xlarge"
            />
            <Button
              icon="pi pi-camera"
              class="p-button-rounded p-button-sm absolute bottom-0 right-0 bg-white text-blue-600 border-blue-300 shadow-md hover:bg-blue-50"
              style="
                width: 2.5rem;
                height: 2.5rem;
                transform: translate(25%, 25%);
              "
              @click="logoFileInput?.click()"
              aria-label="Upload profile picture"
            />
            <input
              type="file"
              ref="logoFileInput"
              style="display: none"
              accept="image/*"
              @change="handleLogoUpload"
            />
          </div>
          <div class="flex-1">
            <div
              class="flex flex-col md:flex-row md:items-center justify-between w-full mb-2"
            >
              <div>
                <h1 class="text-2xl font-bold mb-1">
                  {{ getDisplayName() }}
                </h1>
                <div class="text-gray-600 flex items-center">
                  <i class="pi pi-tag mr-2"></i>
                  <span>{{
                    getRecruiterTypeLabel(profile.recruiterType)
                  }}</span>
                  <span class="flex items-center ml-2">
                    <Tag
                      :value="profile.verificationStatus"
                      :severity="
                        getVerificationSeverity(profile.verificationStatus)
                      "
                    />
                  </span>
                </div>
              </div>
              <Button
                label="Edit Profile"
                icon="pi pi-pencil"
                class="p-button-outlined mt-3 md:mt-0"
                @click="startEdit"
              />
            </div>
            <div class="flex flex-wrap gap-4 mt-4">
              <div class="flex items-center">
                <i class="pi pi-envelope text-gray-500 mr-2"></i>
                <span>{{ profile.email || 'No email provided' }}</span>
              </div>
              <div class="flex items-center">
                <i class="pi pi-phone text-gray-500 mr-2"></i>
                <span>{{
                  profile.phoneNumber || 'No phone number provided'
                }}</span>
              </div>
              <div v-if="profile.companyLocation" class="flex items-center">
                <i class="pi pi-map-marker text-gray-500 mr-2"></i>
                <span>{{
                  displayLocationName(profile.companyLocation) || 'Not provided'
                }}</span>
              </div>
              <div v-if="profile.companyWebsite" class="flex items-center">
                <i class="pi pi-globe text-gray-500 mr-2"></i>
                <a
                  :href="ensureHttpPrefix(profile.companyWebsite)"
                  target="_blank"
                  class="text-blue-600 hover:underline"
                >
                  {{ formatWebsite(profile.companyWebsite) }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Profile Content with Sidebar Navigation -->
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div v-if="!editMode" class="flex flex-col md:flex-row">
          <!-- Sidebar Navigation -->
          <div class="md:w-1/4 border-r border-gray-200">
            <nav class="p-4">
              <ul>
                <li>
                  <button
                    @click="activeTab = 'basic'"
                    class="flex items-center w-full px-4 py-3 rounded-lg text-left mb-2"
                    :class="
                      activeTab === 'basic'
                        ? 'bg-blue-50 text-blue-700'
                        : 'hover:bg-gray-50 text-gray-700'
                    "
                  >
                    <i class="pi pi-user mr-2"></i>
                    <span>Basic Information</span>
                  </button>
                </li>
                <li>
                  <button
                    @click="activeTab = 'portfolio'"
                    class="flex items-center w-full px-4 py-3 rounded-lg text-left mb-2"
                    :class="
                      activeTab === 'portfolio'
                        ? 'bg-blue-50 text-blue-700'
                        : 'hover:bg-gray-50 text-gray-700'
                    "
                  >
                    <i class="pi pi-briefcase mr-2"></i>
                    <span>Portfolio</span>
                  </button>
                </li>
                <li>
                  <button
                    @click="activeTab = 'settings'"
                    class="flex items-center w-full px-4 py-3 rounded-lg text-left"
                    :class="
                      activeTab === 'settings'
                        ? 'bg-blue-50 text-blue-700'
                        : 'hover:bg-gray-50 text-gray-700'
                    "
                  >
                    <i class="pi pi-cog mr-2"></i>
                    <span>Account Settings</span>
                  </button>
                </li>
              </ul>
            </nav>
          </div>

          <!-- Content Area -->
          <div class="md:w-3/4 p-6">
            <!-- Basic Information Tab -->
            <div v-if="activeTab === 'basic'">
              <h2 class="text-xl font-bold mb-6">Basic Information</h2>

              <div class="mb-8">
                <h3 class="text-lg font-semibold mb-4 pb-2 border-b">
                  Personal Details
                </h3>
                <div
                  v-if="hasEditFormErrors"
                  class="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md"
                >
                  <div class="flex items-start">
                    <i
                      class="pi pi-exclamation-triangle text-amber-500 mr-2 mt-0.5"
                    ></i>
                    <div>
                      <h4 class="font-medium text-amber-700">
                        Please complete required fields
                      </h4>
                      <p class="text-sm text-amber-600 mt-1">
                        The following fields are required for your profile:
                        <strong>Full Name, Email Address, Phone Number</strong>
                      </p>
                    </div>
                  </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  <div>
                    <p class="text-gray-500 text-sm mb-1">Full Name</p>
                    <p class="font-medium">
                      {{ profile.recruiterRepName || 'Not provided' }}
                      <span
                        v-if="isEmpty(profile.recruiterRepName)"
                        class="text-amber-500 text-xs ml-1"
                      >
                        (Required)
                      </span>
                    </p>
                  </div>
                  <div>
                    <p class="text-gray-500 text-sm mb-1">Username</p>
                    <p class="font-medium">
                      {{ profile.username || 'Not provided' }}
                      <span
                        v-if="isEmpty(profile.username)"
                        class="text-amber-500 text-xs ml-1"
                      >
                        (Required)
                      </span>
                    </p>
                  </div>
                  <div>
                    <p class="text-gray-500 text-sm mb-1">Email Address</p>
                    <p class="font-medium">
                      {{ profile.email || 'Not provided' }}
                      <span
                        v-if="isEmpty(profile.email)"
                        class="text-amber-500 text-xs ml-1"
                      >
                        (Required)
                      </span>
                    </p>
                  </div>
                  <div>
                    <p class="text-gray-500 text-sm mb-1">Phone Number</p>
                    <p class="font-medium">
                      {{ profile.phoneNumber || 'No phone number provided' }}
                      <span
                        v-if="isEmpty(profile.phoneNumber)"
                        class="text-amber-500 text-xs ml-1"
                      >
                        (Required)
                      </span>
                    </p>
                  </div>
                  <div>
                    <p class="text-gray-500 text-sm mb-1">Account Type</p>
                    <p class="font-medium">
                      {{
                        getRecruiterTypeLabel(profile.recruiterType) ||
                        'Not specified'
                      }}
                    </p>
                  </div>
                  <div>
                    <p class="text-gray-500 text-sm mb-1 flex items-center">
                      Verification Status
                      <button
                        type="button"
                        class="ml-2 text-gray-500 hover:text-blue-600"
                        v-tooltip.right="{
                          value: verificationTooltipContent,
                          escape: false,
                        }"
                        style="
                          display: inline-flex;
                          align-items: center;
                          height: 18px;
                        "
                      >
                        <i class="pi pi-question-circle"></i>
                      </button>
                    </p>
                    <div class="flex items-center">
                      <Tag
                        :value="profile.verificationStatus"
                        :severity="
                          getVerificationSeverity(profile.verificationStatus)
                        "
                      />
                    </div>
                  </div>
                  <div
                    v-if="profile.recruiterType === 'INDIVIDUAL'"
                    class="md:col-span-2"
                  >
                    <p class="text-gray-500 text-sm mb-1">Location</p>
                    <p v-if="profile.companyLocation" class="font-medium">
                      {{
                        displayLocationName(profile.companyLocation) ||
                        'Not provided'
                      }}
                    </p>
                    <p v-else class="text-gray-600 italic">
                      No location provided.
                      <span class="text-amber-500 text-xs ml-1">
                        (Recommended)
                      </span>
                    </p>
                  </div>
                  <div
                    v-if="profile.recruiterType === 'INDIVIDUAL'"
                    class="md:col-span-2 mt-2"
                  >
                    <p class="text-gray-500 text-sm mb-1">Bio</p>
                    <p v-if="profile.companyDescription">
                      {{ profile.companyDescription }}
                    </p>
                    <p v-else class="text-gray-600 italic">
                      No bio provided.
                      <span class="text-amber-500 text-xs">
                        Adding a bio helps candidates learn more about your
                        expertise and experience.
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div v-if="profile.recruiterType !== 'INDIVIDUAL'">
                <h3 class="text-lg font-semibold mb-4 pb-2 border-b">
                  Company Information
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  <div>
                    <p class="text-gray-500 text-sm mb-1">Company Name</p>
                    <p class="font-medium">
                      {{ profile.companyName || 'Not provided' }}
                      <span
                        v-if="!profile.companyName"
                        class="text-amber-500 text-xs ml-1"
                      >
                        (Recommended)
                      </span>
                    </p>
                  </div>
                  <div>
                    <p class="text-gray-500 text-sm mb-1">Company Website</p>
                    <p class="font-medium">
                      <a
                        v-if="profile.companyWebsite"
                        :href="ensureHttpPrefix(profile.companyWebsite)"
                        target="_blank"
                        class="text-blue-600 hover:underline"
                      >
                        {{ formatWebsite(profile.companyWebsite) }}
                      </a>
                      <span v-else class="text-gray-600">
                        Not provided
                        <span class="text-amber-500 text-xs ml-1">
                          (Recommended for verification)
                        </span>
                      </span>
                    </p>
                  </div>
                  <div>
                    <p class="text-gray-500 text-sm mb-1">Company Location</p>
                    <p class="font-medium">
                      {{
                        displayLocationName(profile.companyLocation) ||
                        'Not provided'
                      }}
                      <span
                        v-if="!profile.companyLocation"
                        class="text-amber-500 text-xs ml-1"
                      >
                        (Recommended)
                      </span>
                    </p>
                  </div>
                  <div class="md:col-span-2">
                    <p class="text-gray-500 text-sm mb-1">Description</p>
                    <p v-if="profile.companyDescription">
                      {{ profile.companyDescription }}
                    </p>
                    <p v-else class="text-gray-600 italic">
                      No company description provided.
                      <span class="text-amber-500 text-xs">
                        Adding a description helps candidates learn more about
                        your company.
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div
                v-else
                class="bg-gray-50 rounded-lg p-4 border border-gray-200"
              >
                <div class="flex items-start">
                  <i class="pi pi-info-circle text-blue-500 mr-3 mt-0.5"></i>
                  <div>
                    <h4 class="font-medium">Upgrade your account type</h4>
                    <p class="text-gray-600 text-sm mt-1">
                      To add company information, please change your account
                      type to Agency or Company.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Account Settings Tab -->
            <div v-if="activeTab === 'settings'">
              <h2 class="text-xl font-bold mb-6">Account Settings</h2>

              <div class="mb-6">
                <h3 class="text-lg font-semibold mb-4 pb-2 border-b">
                  Security
                </h3>
                <div class="mb-4">
                  <Button
                    label="Change Password"
                    icon="pi pi-lock"
                    class="p-button-outlined mb-4"
                    @click="showChangePasswordDialog = true"
                  />
                </div>
              </div>

              <div class="mb-6">
                <h3 class="text-lg font-semibold mb-4 pb-2 border-b">
                  Communication Preferences
                </h3>
                <div class="flex flex-col gap-3">
                  <div class="field-checkbox">
                    <Checkbox
                      id="emailNotifications"
                      v-model="communicationPrefs.email"
                      :binary="true"
                    />
                    <label for="emailNotifications" class="ml-2"
                      >Receive Email Notifications</label
                    >
                  </div>
                  <div class="field-checkbox">
                    <Checkbox
                      id="smsNotifications"
                      v-model="communicationPrefs.sms"
                      :binary="true"
                    />
                    <label for="smsNotifications" class="ml-2"
                      >Receive SMS Notifications</label
                    >
                  </div>
                  <div class="field-checkbox">
                    <Checkbox
                      id="marketingEmails"
                      v-model="communicationPrefs.marketing"
                      :binary="true"
                    />
                    <label for="marketingEmails" class="ml-2"
                      >Receive Marketing Communications</label
                    >
                  </div>
                </div>
                <Button
                  label="Save Preferences"
                  icon="pi pi-check"
                  class="mt-4"
                  @click="savePreferences"
                />
              </div>
            </div>

            <!-- Portfolio Tab -->
            <div v-if="activeTab === 'portfolio'">
              <h2 class="text-xl font-bold mb-6">Portfolio</h2>

              <div class="mb-8">
                <div class="flex justify-between items-center mb-4">
                  <h3 class="text-lg font-semibold">Event Collections</h3>
                  <Button
                    label="Create Collection"
                    icon="pi pi-plus"
                    size="small"
                    @click="openNewCollectionDialog"
                  />
                </div>

                <!-- Loading state for portfolios -->
                <div v-if="portfolioLoading" class="flex justify-center py-8">
                  <div class="animate-pulse flex flex-col items-center">
                    <i
                      class="pi pi-spin pi-spinner text-primary-500 text-4xl mb-2"
                    ></i>
                    <p class="text-primary-500">Loading collections...</p>
                  </div>
                </div>

                <div
                  v-else-if="portfolios.length > 0"
                  class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  <div
                    v-for="portfolio in portfolios"
                    :key="portfolio.id"
                    class="border rounded-lg overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md bg-white"
                    :class="{ 'opacity-60': portfolio.isDeleting }"
                  >
                    <div class="relative h-48 bg-gray-100">
                      <img
                        v-if="portfolio.coverImageUrl"
                        :src="mapMediaUrl(portfolio.coverImageUrl)"
                        :alt="portfolio.eventName"
                        class="w-full h-full object-cover"
                        @error="
                          (e) => {
                            console.error(
                              'Failed to load image for',
                              portfolio.eventName
                            );
                            console.log(
                              'Original URL:',
                              portfolio.coverImageUrl
                            );
                            console.log(
                              'Mapped URL:',
                              mapMediaUrl(portfolio.coverImageUrl)
                            );
                          }
                        "
                      />
                      <div
                        v-else
                        class="w-full h-full flex items-center justify-center text-gray-400"
                      >
                        <i class="pi pi-image text-4xl"></i>
                      </div>
                      <div
                        class="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/50"
                      ></div>
                      <div
                        class="absolute bottom-0 left-0 right-0 p-3 text-white"
                      >
                        <h4 class="font-bold text-lg">
                          {{ portfolio.eventName }}
                        </h4>
                        <p class="text-sm opacity-90">
                          {{
                            formatEventDate(
                              portfolio.eventStartDate,
                              portfolio.eventEndDate
                            )
                          }}
                        </p>
                      </div>
                    </div>
                    <div class="p-4">
                      <p
                        v-if="portfolio.eventDescription"
                        class="text-sm text-gray-700 mb-4 line-clamp-2"
                      >
                        {{ portfolio.eventDescription }}
                      </p>
                      <p v-else class="text-sm text-gray-500 italic mb-4">
                        No description provided
                      </p>

                      <div class="flex justify-between items-center">
                        <Badge
                          :value="
                            portfolio.mediaCount
                              ? `${portfolio.mediaCount} media items`
                              : 'Empty'
                          "
                          :severity="portfolio.mediaCount ? 'success' : 'info'"
                          class="mr-2"
                        ></Badge>
                        <div class="flex gap-2">
                          <Button
                            icon="pi pi-pencil"
                            class="p-button-rounded p-button-text p-button-sm"
                            @click="editPortfolio(portfolio)"
                            v-tooltip.top="'Edit collection'"
                            :disabled="portfolio.isDeleting || portfolioLoading"
                          />
                          <Button
                            icon="pi pi-images"
                            class="p-button-rounded p-button-text p-button-sm"
                            @click="viewPortfolioMedia(portfolio)"
                            v-tooltip.top="'Manage media'"
                            :disabled="portfolio.isDeleting || portfolioLoading"
                          />
                          <Button
                            icon="pi pi-trash"
                            class="p-button-rounded p-button-danger p-button-sm"
                            @click.stop="confirmDeletePortfolio(portfolio)"
                            v-tooltip.top="'Delete collection'"
                            :disabled="portfolio.isDeleting || portfolioLoading"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  v-else
                  class="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300"
                >
                  <i class="pi pi-images text-4xl text-gray-400 mb-3"></i>
                  <h4 class="font-medium mb-2">No collections yet</h4>
                  <p class="text-gray-500 mb-4">
                    Showcase your work by creating event collections with photos
                    and videos
                  </p>
                  <Button
                    label="Create Your First Collection"
                    icon="pi pi-plus"
                    @click="openNewCollectionDialog"
                  />
                </div>
              </div>
            </div>

            <!-- Collection Dialog -->
            <Dialog
              v-model:visible="showCollectionDialog"
              :header="
                isEditingPortfolio ? 'Edit Collection' : 'Create New Collection'
              "
              :style="{ width: '500px' }"
              :modal="true"
              :closable="!collectionSaving"
            >
              <div class="p-fluid">
                <div class="field mb-4">
                  <label
                    for="eventName"
                    class="block text-gray-700 text-sm font-medium mb-2"
                  >
                    Event Name*
                  </label>
                  <InputText
                    id="eventName"
                    v-model="collectionForm.eventName"
                    :class="{ 'p-invalid': collectionErrors.eventName }"
                    :disabled="collectionSaving"
                    required
                  />
                  <small class="text-red-500" v-if="collectionErrors.eventName">
                    {{ collectionErrors.eventName }}
                  </small>
                </div>

                <div class="grid grid-cols-2 gap-4 mb-4">
                  <div class="field">
                    <label
                      for="eventStartDate"
                      class="block text-gray-700 text-sm font-medium mb-2"
                    >
                      Start Date
                    </label>
                    <Calendar
                      id="eventStartDate"
                      v-model="collectionForm.eventStartDate"
                      dateFormat="dd/mm/yy"
                      :showIcon="true"
                      :disabled="collectionSaving"
                      placeholder="Optional"
                    />
                  </div>

                  <div class="field">
                    <label
                      for="eventEndDate"
                      class="block text-gray-700 text-sm font-medium mb-2"
                    >
                      End Date
                    </label>
                    <Calendar
                      id="eventEndDate"
                      v-model="collectionForm.eventEndDate"
                      dateFormat="dd/mm/yy"
                      :showIcon="true"
                      :disabled="collectionSaving"
                      placeholder="Optional"
                    />
                  </div>
                </div>

                <div class="field mb-4">
                  <label
                    for="eventDescription"
                    class="block text-gray-700 text-sm font-medium mb-2"
                  >
                    Description
                  </label>
                  <Textarea
                    id="eventDescription"
                    v-model="collectionForm.eventDescription"
                    rows="5"
                    :disabled="collectionSaving"
                    placeholder="Describe your event (optional)"
                  />
                </div>
              </div>

              <template #footer>
                <Button
                  label="Cancel"
                  icon="pi pi-times"
                  class="p-button-text"
                  @click="showCollectionDialog = false"
                  :disabled="collectionSaving"
                />
                <Button
                  :label="collectionSaving ? 'Saving...' : 'Save'"
                  icon="pi pi-check"
                  @click="saveCollection"
                  :loading="collectionSaving"
                />
              </template>
            </Dialog>

            <!-- Media Management Dialog -->
            <Dialog
              v-model:visible="showMediaDialog"
              :header="selectedPortfolio?.eventName + ' - Media Gallery'"
              :style="{ width: '90vw', maxWidth: '1200px' }"
              :modal="true"
              :closable="!mediaUploading"
            >
              <div v-if="mediaLoading" class="flex justify-center py-12">
                <div class="animate-pulse flex flex-col items-center">
                  <i
                    class="pi pi-spin pi-spinner text-primary-500 text-4xl mb-2"
                  ></i>
                  <p class="text-primary-500">Loading media...</p>
                </div>
              </div>

              <div v-else>
                <div class="flex justify-between items-center mb-4">
                  <h3 class="text-lg font-semibold">
                    {{ selectedPortfolio?.mediaCount || 0 }} Media Items
                  </h3>
                  <div class="flex gap-2">
                    <FileUpload
                      mode="basic"
                      name="files"
                      url="http://localhost:8080/api/recruiters/portfolio/upload-placeholder"
                      accept="image/*,video/*"
                      :customUpload="true"
                      @uploader="uploadMedia"
                      :multiple="true"
                      :auto="true"
                      chooseLabel="Upload Media"
                      :disabled="mediaUploading"
                    />
                    <Button
                      icon="pi pi-times"
                      label="Close"
                      class="p-button-text"
                      @click="closeMediaDialog"
                      :disabled="mediaUploading"
                    />
                  </div>
                </div>

                <ProgressBar
                  v-if="mediaUploading"
                  :value="uploadProgress"
                  class="mb-4"
                />

                <div
                  v-if="portfolioMedia.length > 0"
                  class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                >
                  <div
                    v-for="media in portfolioMedia"
                    :key="media.id"
                    class="relative group"
                  >
                    <div
                      class="aspect-square rounded-lg overflow-hidden bg-gray-100 border cursor-pointer"
                      @click="
                        openMediaPreview(media, portfolioMedia.indexOf(media))
                      "
                    >
                      <img
                        v-if="!media.type || media.type === 'IMAGE'"
                        :src="media.url"
                        :alt="media.fileName || 'Media item'"
                        class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                        @error="
                          (e) => {
                            console.error(
                              'Image load error for:',
                              media.fileName
                            );
                            console.log('Attempted URL:', media.url);
                            console.log('Original mediaUrl:', media.mediaUrl);
                          }
                        "
                        @load="
                          () =>
                            console.log(
                              'Image loaded successfully:',
                              media.fileName
                            )
                        "
                      />
                      <div
                        v-else-if="media.type === 'VIDEO'"
                        class="relative w-full h-full"
                      >
                        <video
                          :src="media.url"
                          class="w-full h-full object-cover"
                          controls
                        ></video>
                        <div class="absolute top-2 right-2">
                          <i
                            class="pi pi-video text-white bg-black/50 p-1 rounded"
                          ></i>
                        </div>
                      </div>
                    </div>
                    <div
                      class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Button
                        icon="pi pi-trash"
                        class="p-button-rounded p-button-danger p-button-sm"
                        @click.stop="confirmDeleteMedia(media)"
                      />
                    </div>
                  </div>
                </div>

                <div
                  v-else
                  class="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300"
                >
                  <i class="pi pi-image text-4xl text-gray-400 mb-3"></i>
                  <h4 class="font-medium mb-2">No media uploaded yet</h4>
                  <p class="text-gray-500 mb-4">
                    Upload photos and videos to showcase your event
                  </p>
                </div>
              </div>
            </Dialog>
          </div>
        </div>

        <!-- Edit Mode -->
        <div v-else>
          <div class="border-b px-6 py-4 flex justify-between items-center">
            <h2 class="text-xl font-bold">Edit Profile</h2>
            <Button
              icon="pi pi-times"
              class="p-button-rounded p-button-text"
              @click="cancelEdit"
              aria-label="Cancel"
            />
          </div>

          <div class="p-6">
            <form @submit.prevent="saveProfile">
              <div class="mb-8">
                <h3 class="text-lg font-semibold mb-4 pb-2 border-b">
                  Personal Details
                </h3>
                <div
                  v-if="hasEditFormErrors"
                  class="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md"
                >
                  <div class="flex items-start">
                    <i
                      class="pi pi-exclamation-triangle text-amber-500 mr-2 mt-0.5"
                    ></i>
                    <div>
                      <h4 class="font-medium text-amber-700">
                        Please complete required fields
                      </h4>
                      <p class="text-sm text-amber-600 mt-1">
                        The following fields are required for your profile:
                        <strong>Full Name, Email Address, Phone Number</strong>
                      </p>
                    </div>
                  </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div class="field">
                    <label
                      for="recruiterRepName"
                      class="block text-gray-700 text-sm font-medium mb-2"
                      >Full Name*</label
                    >
                    <InputText
                      id="recruiterRepName"
                      v-model="editedProfile.recruiterRepName"
                      class="w-full"
                      :class="{
                        'p-invalid':
                          !editedProfile.recruiterRepName &&
                          showValidationErrors,
                      }"
                      required
                    />
                    <small
                      class="text-red-500"
                      v-if="
                        !editedProfile.recruiterRepName && showValidationErrors
                      "
                    >
                      Full name is required
                    </small>
                  </div>
                  <div class="field">
                    <label
                      for="username"
                      class="block text-gray-700 text-sm font-medium mb-2"
                      >Username*</label
                    >
                    <InputText
                      id="username"
                      v-model="editedProfile.username"
                      class="w-full"
                      required
                      disabled
                    />
                    <small class="text-gray-500"
                      >Username cannot be changed</small
                    >
                  </div>
                  <div class="field">
                    <label
                      for="email"
                      class="block text-gray-700 text-sm font-medium mb-2"
                      >Email Address*</label
                    >
                    <InputText
                      id="email"
                      v-model="editedProfile.email"
                      class="w-full"
                      :class="{
                        'p-invalid':
                          !editedProfile.email && showValidationErrors,
                      }"
                      required
                      type="email"
                    />
                    <small
                      class="text-red-500"
                      v-if="!editedProfile.email && showValidationErrors"
                    >
                      Email is required
                    </small>
                  </div>
                  <div class="field">
                    <label
                      for="phoneNumber"
                      class="block text-gray-700 text-sm font-medium mb-2"
                      >Phone Number*</label
                    >
                    <InputText
                      id="phoneNumber"
                      v-model="editedProfile.phoneNumber"
                      class="w-full"
                      :class="{
                        'p-invalid':
                          !editedProfile.phoneNumber && showValidationErrors,
                      }"
                      required
                    />
                    <small
                      class="text-red-500"
                      v-if="!editedProfile.phoneNumber && showValidationErrors"
                    >
                      Phone number is required
                    </small>
                  </div>
                  <div class="field">
                    <label
                      for="recruiterType"
                      class="block text-gray-700 text-sm font-medium mb-2"
                      >Account Type*</label
                    >
                    <Dropdown
                      id="recruiterType"
                      v-model="editedProfile.recruiterType"
                      :options="recruiterTypeOptions"
                      optionLabel="label"
                      optionValue="value"
                      class="w-full"
                    />
                  </div>
                  <div
                    class="field"
                    v-if="editedProfile.recruiterType === 'INDIVIDUAL'"
                  >
                    <label
                      for="location"
                      class="block text-gray-700 text-sm font-medium mb-2"
                      >Location</label
                    >
                    <LocationSearch
                      :multiple="false"
                      :show-selections="false"
                      @location-selected="handleLocationSelected"
                      class="w-full"
                      v-model="selectedIndividualLocation"
                    />
                    <!-- Display selected location -->
                    <div
                      v-if="
                        editedProfile.companyLocationId &&
                        editedProfile.companyLocation
                      "
                      class="mt-2 flex items-center bg-primary-50 p-2 rounded-md"
                    >
                      <i
                        class="pi pi-map-marker mr-2 text-primary-500 text-sm"
                      ></i>
                      <span class="text-sm font-medium text-primary-700">
                        {{ editedProfile.companyLocation }}
                      </span>
                    </div>
                  </div>

                  <div
                    v-if="editedProfile.recruiterType === 'INDIVIDUAL'"
                    class="field md:col-span-2"
                  >
                    <label
                      for="bio"
                      class="block text-gray-700 text-sm font-medium mb-2"
                      >Bio</label
                    >
                    <Textarea
                      id="bio"
                      v-model="editedProfile.companyDescription"
                      rows="5"
                      class="w-full"
                      maxlength="255"
                      placeholder="Share information about your expertise, experience, and background"
                    />
                    <small class="text-gray-500">Maximum 255 characters</small>
                  </div>
                </div>
              </div>

              <div v-if="editedProfile.recruiterType !== 'INDIVIDUAL'">
                <h3 class="text-lg font-semibold mb-4 pb-2 border-b">
                  Company Information
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div class="field">
                    <label
                      for="companyName"
                      class="block text-gray-700 text-sm font-medium mb-2"
                      >Company Name</label
                    >
                    <InputText
                      id="companyName"
                      v-model="editedProfile.companyName"
                      class="w-full"
                    />
                  </div>
                  <div class="field">
                    <label
                      for="companyWebsite"
                      class="block text-gray-700 text-sm font-medium mb-2"
                      >Company Website</label
                    >
                    <InputText
                      id="companyWebsite"
                      v-model="editedProfile.companyWebsite"
                      class="w-full"
                      placeholder="https://example.com"
                    />
                  </div>
                  <!-- Only show location in Company Information for non-individual accounts -->
                  <div class="field">
                    <label
                      for="companyLocation"
                      class="block text-gray-700 text-sm font-medium mb-2"
                      >Company Location</label
                    >
                    <LocationSearch
                      :multiple="false"
                      :show-selections="false"
                      @location-selected="handleCompanyLocationSelected"
                      class="w-full"
                      v-model="selectedCompanyLocation"
                    />
                    <!-- Display selected location -->
                    <div
                      v-if="
                        editedProfile.companyLocationId &&
                        editedProfile.companyLocation
                      "
                      class="mt-2 flex items-center bg-primary-50 p-2 rounded-md"
                    >
                      <i
                        class="pi pi-map-marker mr-2 text-primary-500 text-sm"
                      ></i>
                      <span class="text-sm font-medium text-primary-700">
                        {{ editedProfile.companyLocation }}
                      </span>
                    </div>
                  </div>
                  <div class="field md:col-span-2">
                    <label
                      for="companyDescription"
                      class="block text-gray-700 text-sm font-medium mb-2"
                      >Company Description</label
                    >
                    <Textarea
                      id="companyDescription"
                      v-model="editedProfile.companyDescription"
                      rows="5"
                      class="w-full"
                      maxlength="255"
                    />
                    <small class="text-gray-500">Maximum 255 characters</small>
                  </div>
                </div>
              </div>

              <div class="flex justify-end gap-2 mt-6">
                <Button
                  label="Cancel"
                  class="p-button-text"
                  @click="cancelEdit"
                  type="button"
                />
                <Button label="Save Changes" icon="pi pi-check" type="submit" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Change Password Dialog -->
    <Dialog
      v-model:visible="showChangePasswordDialog"
      header="Change Password"
      :style="{ width: '450px' }"
      :modal="true"
    >
      <div class="p-fluid">
        <div class="field mb-4">
          <label
            for="currentPassword"
            class="block text-gray-700 text-sm font-medium mb-2"
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
            class="block text-gray-700 text-sm font-medium mb-2"
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
            class="block text-gray-700 text-sm font-medium mb-2"
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
      </div>
      <template #footer>
        <Button
          label="Cancel"
          icon="pi pi-times"
          class="p-button-text"
          @click="showChangePasswordDialog = false"
          :disabled="changingPassword"
        />
        <Button
          :label="changingPassword ? 'Saving...' : 'Save'"
          icon="pi pi-check"
          @click="changePassword"
          :loading="changingPassword"
        />
      </template>
    </Dialog>

    <!-- Media Preview Dialog -->
    <Dialog
      v-model:visible="showMediaPreview"
      :style="{ width: '90vw', maxWidth: '1000px' }"
      :showHeader="false"
      :modal="true"
      :dismissableMask="true"
      class="media-preview-dialog rounded-xl"
    >
      <div class="relative">
        <!-- Close button -->
        <Button
          icon="pi pi-times"
          class="p-button-rounded p-button-text p-button-plain absolute top-2 right-2 z-10"
          @click="showMediaPreview = false"
        />

        <!-- Navigation buttons -->
        <Button
          v-if="portfolioMedia.length > 1"
          icon="pi pi-chevron-left"
          class="p-button-rounded p-button-text p-button-plain absolute top-1/2 left-2 z-10 transform -translate-y-1/2"
          @click="navigateMedia('prev')"
        />

        <Button
          v-if="portfolioMedia.length > 1"
          icon="pi pi-chevron-right"
          class="p-button-rounded p-button-text p-button-plain absolute top-1/2 right-2 z-10 transform -translate-y-1/2"
          @click="navigateMedia('next')"
        />

        <!-- Media Content -->
        <div class="flex justify-center">
          <img
            v-if="!currentMedia?.type || currentMedia?.type === 'IMAGE'"
            :src="currentMedia?.url"
            :alt="currentMedia?.fileName || 'Media preview'"
            class="max-h-[80vh] object-contain"
          />
          <video
            v-else-if="currentMedia?.type === 'VIDEO'"
            :src="currentMedia?.url"
            class="max-h-[80vh] max-w-full"
            controls
            autoplay
          ></video>
        </div>

        <!-- Media Info -->
        <div
          class="bg-black bg-opacity-50 text-white p-2 absolute bottom-0 left-0 right-0"
        >
          <p class="text-center">
            {{ currentMedia?.fileName || 'Media item' }}
          </p>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useDialog } from 'primevue/usedialog';
import { useConfirm } from 'primevue/useconfirm';
import { format } from 'date-fns';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import { useRoute, useRouter } from 'vue-router';
import recruiterService from '@/services/recruiter.service';
import userService from '@/services/user.service';
import { useProfileStore } from '@/stores/profile';
import { storeToRefs } from 'pinia';
import Avatar from 'primevue/avatar';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Dropdown from 'primevue/dropdown';
import Tag from 'primevue/tag';
import Toast from 'primevue/toast';
import ConfirmDialog from 'primevue/confirmdialog';
import Checkbox from 'primevue/checkbox';
import Dialog from 'primevue/dialog';
import Password from 'primevue/password';
import Rating from 'primevue/rating';
import Tooltip from 'primevue/tooltip';
import LocationSearch from '@/components/shared/LocationSearch.vue';

// Initialize services
const toast = useToast();
const confirm = useConfirm();
const profileStore = useProfileStore();
const auth = useAuthStore();

// Tooltip directive
const vTooltip = Tooltip;

// Helper function to get token
const getToken = () => {
  return localStorage.getItem('accessToken');
};

// Computed properties - moved to top to ensure it's defined before template uses it
const verificationTooltipContent = computed(() => {
  return `• Complete your profile with required information
• Maintain positive ratings to achieve verification status
• Verification may be revoked for:
  - Low ratings
  - Multiple complaints`;
});

// State management
const loading = ref(true);
const editMode = ref(false);
const logoFileInput = ref(null);
const activeTab = ref('basic');
const showChangePasswordDialog = ref(false);
const showValidationErrors = ref(false);

// Computed property for form validation
const hasEditFormErrors = computed(() => {
  return (
    !editedProfile.value.recruiterRepName ||
    !editedProfile.value.email ||
    !editedProfile.value.phoneNumber
  );
});

const communicationPrefs = ref({
  email: true,
  sms: false,
  marketing: true,
});

// Password change form
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
});

// Password form validation and error handling
const passwordFormErrors = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
});
const passwordSubmissionError = ref('');
const changingPassword = ref(false);

// Mock data for profile matching database schema
const profile = ref({
  id: null,
  username: '',
  recruiterRepName: '',
  email: '',
  phoneNumber: '',
  companyName: '',
  companyLogoUrl: null,
  companyDescription: '',
  companyLocation: '',
  companyWebsite: '',
  verificationStatus: 'PENDING',
  createdAt: null,
  isDeleted: false,
  recruiterType: 'INDIVIDUAL',
});

// Create a copy for editing
const editedProfile = ref({ ...profile.value });

// Activity stats
const stats = ref({
  activeJobs: 5,
  applications: 67,
  hired: 28,
  events: 4,
});

// Portfolio and Media Management
const portfolios = ref([]);
const portfolioLoading = ref(false);
const collectionSaving = ref(false);
const showCollectionDialog = ref(false);
const isEditingPortfolio = ref(false);
const collectionForm = ref({
  id: null,
  eventName: '',
  eventStartDate: null,
  eventEndDate: null,
  eventDescription: '',
});
const collectionErrors = ref({
  eventName: '',
});

// Media handling
const showMediaDialog = ref(false);
const selectedPortfolio = ref(null);
const portfolioMedia = ref([]);
const mediaLoading = ref(false);
const mediaUploading = ref(false);
const uploadProgress = ref(0);

// Media preview
const showMediaPreview = ref(false);
const currentMedia = ref(null);
const currentMediaIndex = ref(0);

// Options for dropdowns
const recruiterTypeOptions = [
  { label: 'Individual', value: 'INDIVIDUAL' },
  { label: 'Freelance', value: 'FREELANCE' },
  { label: 'Agency', value: 'AGENCY' },
  { label: 'Company', value: 'COMPANY' },
];

// Methods
const getRecruiterTypeLabel = (type) => {
  const option = recruiterTypeOptions.find((opt) => opt.value === type);
  return option ? option.label : type;
};

const getVerificationSeverity = (status) => {
  switch (status) {
    case 'VERIFIED':
      return 'success';
    case 'PENDING':
      return 'warning';
    case 'REJECTED':
      return 'danger';
    case 'UNDER_REVIEW':
      return 'info';
    case 'SUSPENDED':
      return 'danger';
    default:
      return 'info';
  }
};

const getEventStatusSeverity = (status) => {
  switch (status) {
    case 'COMPLETED':
      return 'success';
    case 'UPCOMING':
      return 'info';
    case 'CANCELLED':
      return 'danger';
    case 'POSTPONED':
      return 'warning';
    default:
      return 'secondary';
  }
};

const formatWebsite = (url) => {
  if (!url) return '';
  return url.replace(/^https?:\/\//, '');
};

// Helper function to check if a field is truly empty
const isEmpty = (value) => {
  return value === null || value === undefined || value === '';
};

const getDisplayName = () => {
  // For company type accounts, show company name if available
  if (
    (profile.value.recruiterType === 'COMPANY' ||
      profile.value.recruiterType === 'AGENCY' ||
      profile.value.recruiterType === 'FREELANCE') &&
    !isEmpty(profile.value.companyName)
  ) {
    return profile.value.companyName;
  }
  // For individual accounts or if company name is empty, show the recruiter's name
  else {
    return profile.value.recruiterRepName || 'Recruiter';
  }
};

const ensureHttpPrefix = (url) => {
  if (!url) return '';
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return 'https://' + url;
  }
  return url;
};

// Direct API call function
const fetchProfileDirectly = async () => {
  try {
    console.log('Attempting to fetch profile directly via fetch API');
    const token = getToken();
    if (!token) {
      console.error('No access token available in localStorage');
      toast.add({
        severity: 'error',
        summary: 'Authentication Error',
        detail: 'No access token found. Please log in again.',
        life: 5000,
      });
      return false;
    }

    console.log('Using token:', token.substring(0, 15) + '...');

    const response = await fetch('http://localhost:8080/api/profile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      credentials: 'include', // Include cookies if they're being used
    });

    console.log('Direct fetch response status:', response.status);

    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem('accessToken');
      throw new Error('Authentication failed. Please log in again.');
    }

    if (!response.ok) {
      throw new Error(
        `API response not OK: ${response.status} ${response.statusText}`
      );
    }

    const responseText = await response.text();
    console.log('Response text:', responseText.substring(0, 100) + '...');

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse JSON response:', e);
      console.log('Full response text:', responseText);
      throw new Error('Invalid response format from server');
    }

    console.log('Direct API response data:', data);

    // Handle different response structures
    if (data && data.data) {
      // Standard API response with data property
      profile.value = { ...profile.value, ...data.data };
    } else if (data && data.user) {
      // Response with user property
      profile.value = { ...profile.value, ...data.user };
    } else if (data && typeof data === 'object') {
      // Direct profile object
      profile.value = { ...profile.value, ...data };
    } else {
      console.warn('Unexpected response structure:', data);
      return false;
    }

    console.log('Set profile data from API:', profile.value);

    // Create a copy for editing
    editedProfile.value = { ...profile.value };
    console.log('Successfully set profile data from direct API call');

    // Update localStorage with latest profile data
    try {
      const userObj = JSON.parse(localStorage.getItem('user') || '{}');
      // Force the edited name to be used in localStorage regardless of what's in profile.value
      userObj.recruiterRepName = editedProfile.value.recruiterRepName;

      // Update other fields from profile.value
      const updatedUserObj = { ...userObj, ...profile.value };

      // Ensure name is still set correctly (in case it was overwritten)
      updatedUserObj.recruiterRepName = editedProfile.value.recruiterRepName;

      localStorage.setItem('user', JSON.stringify(updatedUserObj));
    } catch (e) {
      console.error('Failed to update localStorage:', e);
    }

    return true;
  } catch (error) {
    console.error('Failed to fetch profile directly:', error);
    toast.add({
      severity: 'error',
      summary: 'Profile Error',
      detail: 'Failed to load profile: ' + error.message,
      life: 5000,
    });
    return false;
  }
};

const fetchProfile = async () => {
  try {
    loading.value = true;
    console.log('Starting profile fetch process');

    // First try direct API call
    const profileFetched = await fetchProfileDirectly();

    if (!profileFetched) {
      console.warn(
        'Direct fetch failed, trying to use user data from localStorage'
      );

      // Try to use data from localStorage as fallback
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          console.log('Using user data from localStorage:', parsedUser);

          // Apply user data to profile
          Object.keys(parsedUser).forEach((key) => {
            if (parsedUser[key] !== undefined && parsedUser[key] !== null) {
              profile.value[key] = parsedUser[key];
            }
          });

          editedProfile.value = { ...profile.value };

          // Validate minimum required fields
          if (profile.value && profile.value.username) {
            console.log('Successfully loaded profile from localStorage');
          } else {
            console.warn('Incomplete profile data in localStorage');
            toast.add({
              severity: 'warn',
              summary: 'Limited Data',
              detail:
                'Only partial profile data could be loaded. Some features may be limited.',
              life: 5000,
            });
          }
        } catch (e) {
          console.error('Failed to parse user data from localStorage:', e);
        }
      } else {
        console.error('No profile data available in localStorage');
        toast.add({
          severity: 'error',
          summary: 'Profile Error',
          detail: 'No profile data available. Please log in again.',
          life: 5000,
        });
      }
    }

    // Verify required fields and show notifications if needed
    checkRequiredProfileFields();
  } catch (error) {
    console.error('Error in fetchProfile:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load profile: ' + error.message,
      life: 5000,
    });
  } finally {
    loading.value = false;
  }
};

// Check if required profile fields are populated
const checkRequiredProfileFields = () => {
  const missingFields = [];

  if (isEmpty(profile.value.recruiterRepName)) {
    missingFields.push('Full Name');
    console.warn('recruiterRepName is empty or missing');
  }

  if (isEmpty(profile.value.email)) {
    missingFields.push('Email Address');
  }

  if (isEmpty(profile.value.phoneNumber)) {
    missingFields.push('Phone Number');
  }

  if (missingFields.length > 0) {
    console.warn('Missing required fields:', missingFields);
    toast.add({
      severity: 'warn',
      summary: 'Profile Incomplete',
      detail: `Please complete your profile with the following required information: ${missingFields.join(
        ', '
      )}`,
      life: 7000,
    });
  }
};

// In script setup section, define initialLocationSelection
const selectedIndividualLocation = ref([]);
const selectedCompanyLocation = ref([]);

// Start editing profile
const startEdit = () => {
  editedProfile.value = { ...profile.value };
  showValidationErrors.value = false;

  // Initialize location selections with the existing location
  if (profile.value && profile.value.companyLocation) {
    try {
      // Get a clean location name using our display function
      const locationName = displayLocationName(profile.value.companyLocation);
      const locationId =
        profile.value.companyLocationId || 'existing-location-id';

      // Make sure we only use the clean name string, not an object or JSON
      const cleanLocationObj = {
        id: locationId,
        name: locationName,
      };

      console.log('Setting initial location to:', cleanLocationObj);

      // Set both location arrays with the same value
      selectedIndividualLocation.value = [cleanLocationObj];
      selectedCompanyLocation.value = [cleanLocationObj];
    } catch (error) {
      console.error('Error setting up location:', error);
      selectedIndividualLocation.value = [];
      selectedCompanyLocation.value = [];
    }
  } else {
    selectedIndividualLocation.value = [];
    selectedCompanyLocation.value = [];
  }

  editMode.value = true;
};

const saveProfile = async () => {
  try {
    // Show validation errors if any required fields are missing
    if (hasEditFormErrors.value) {
      showValidationErrors.value = true;
      toast.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fill in all required fields',
        life: 5000,
      });
      return;
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editedProfile.value.email)) {
      showValidationErrors.value = true;
      toast.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please enter a valid email address',
        life: 5000,
      });
      return;
    }

    loading.value = true;
    console.log('Saving profile with data:', editedProfile.value);

    // For location, if no new location was selected, keep the original one
    if (
      selectedIndividualLocation.value.length === 0 &&
      selectedCompanyLocation.value.length === 0 &&
      profile.value.companyLocation
    ) {
      console.log('No new location selected, keeping original');
      editedProfile.value.companyLocation = profile.value.companyLocation;
      editedProfile.value.companyLocationId = profile.value.companyLocationId;
    }

    console.log(
      'Full name value being saved:',
      editedProfile.value.recruiterRepName
    );

    // Prepare data for API - ensure all fields are present
    const profileData = {
      ...editedProfile.value,
      // Make sure recruiterRepName is explicitly set and not undefined
      recruiterRepName: editedProfile.value.recruiterRepName || '',
      // Set default values for optional fields if they're undefined
      companyName: editedProfile.value.companyName || '',
      companyDescription: editedProfile.value.companyDescription || '',
      companyLocation: editedProfile.value.companyLocation || '',
      companyWebsite: editedProfile.value.companyWebsite || '',
    };

    // Save a copy of the edited name to ensure it's preserved
    const editedName = editedProfile.value.recruiterRepName;

    // Use direct fetch for API call
    const token = getToken();
    if (!token) {
      throw new Error('Authentication token not found');
    }

    console.log(
      'Using token for profile update:',
      token.substring(0, 15) + '...'
    );
    console.log('Sending profile data:', JSON.stringify(profileData));

    const response = await fetch('http://localhost:8080/api/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(profileData),
      credentials: 'include',
    });

    console.log('Profile update response status:', response.status);

    if (response.ok) {
      // Parse response data
      const responseText = await response.text();
      console.log('Response text:', responseText.substring(0, 100) + '...');

      let responseData;
      try {
        // Only parse as JSON if there's actual content
        if (responseText && responseText.trim()) {
          responseData = JSON.parse(responseText);
          console.log('Parsed response data:', responseData);

          // Check if the name was properly saved in the response
          if (responseData.data && responseData.data.recruiterRepName) {
            console.log(
              'Server returned recruiterRepName:',
              responseData.data.recruiterRepName
            );
          } else {
            console.warn(
              'Server response does not contain recruiterRepName in the expected location'
            );
          }
        } else {
          console.log('Empty response body, using profileData as response');
          responseData = profileData;
        }
      } catch (e) {
        console.error('Failed to parse JSON response:', e);
        // If parsing fails, just use the data we sent
        responseData = profileData;
      }

      // Update local profile data
      if (responseData.data) {
        // Start with a copy of the profile data we sent
        profile.value = { ...profileData };

        // Update with response data EXCEPT for the name
        const { recruiterRepName, ...otherResponseData } = responseData.data;
        profile.value = { ...profile.value, ...otherResponseData };

        // Always use our edited name instead of what came back from the server
        profile.value.recruiterRepName = editedName;
        console.log('Preserved edited name over server response:', editedName);
      } else {
        // If response doesn't have a data property, just merge everything
        profile.value = { ...profileData, ...responseData };

        // But still ensure our edited name takes priority
        profile.value.recruiterRepName = editedName;
      }

      // Update user data in localStorage to keep it in sync
      try {
        const userObj = JSON.parse(localStorage.getItem('user') || '{}');
        // Force the edited name to be used in localStorage regardless of what's in profile.value
        userObj.recruiterRepName = editedName;

        // Update other fields from profile.value
        const updatedUserObj = { ...userObj, ...profile.value };

        // Ensure name is still set correctly (in case it was overwritten)
        updatedUserObj.recruiterRepName = editedName;

        localStorage.setItem('user', JSON.stringify(updatedUserObj));
      } catch (e) {
        console.error('Failed to update localStorage:', e);
      }

      // Final verification that the name is properly set
      console.log('Final profile data after save:', profile.value);
      console.log(
        'Final recruiterRepName value:',
        profile.value.recruiterRepName
      );

      editMode.value = false;
      showValidationErrors.value = false;

      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Profile updated successfully',
        life: 3000,
      });
    } else {
      // Handle error response
      let errorMessage;
      try {
        const errorText = await response.text();
        console.error('Error response text:', errorText);

        try {
          const errorJson = JSON.parse(errorText);
          errorMessage =
            errorJson.message ||
            errorJson.error ||
            `API request failed with status ${response.status}`;
        } catch (jsonError) {
          errorMessage = `API request failed with status ${response.status}: ${errorText}`;
        }
      } catch (readError) {
        errorMessage = `API request failed with status ${response.status}`;
      }

      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    toast.add({
      severity: 'error',
      summary: 'Update Failed',
      detail: error.message || 'Failed to update profile. Please try again.',
      life: 5000,
    });
  } finally {
    loading.value = false;
  }
};

const cancelEdit = () => {
  editedProfile.value = { ...profile.value };
  showValidationErrors.value = false;
  editMode.value = false;
};

const handleLogoUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Check if the file is an image
  if (!file.type.includes('image')) {
    toast.add({
      severity: 'error',
      summary: 'Invalid File',
      detail: 'Please select an image file.',
      life: 3000,
    });
    return;
  }

  // Check file size (5MB limit)
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  if (file.size > MAX_SIZE) {
    toast.add({
      severity: 'error',
      summary: 'File Too Large',
      detail: 'Please select an image under 5MB.',
      life: 3000,
    });
    return;
  }

  try {
    // Display loading state
    toast.add({
      severity: 'info',
      summary: 'Uploading...',
      detail: 'Uploading your logo, please wait.',
      life: 3000,
    });

    // Upload the file
    const response = await recruiterService.uploadLogo(file);

    // Extract the logoUrl from the response
    let logoUrl = null;

    if (response.data?.data?.companyLogoUrl) {
      logoUrl = response.data.data.companyLogoUrl;

      // Update profile with the logo URL
      profile.value.companyLogoUrl = logoUrl;
      editedProfile.value.companyLogoUrl = logoUrl;

      // Also update the user in localStorage
      try {
        const userObj = JSON.parse(localStorage.getItem('user') || '{}');
        userObj.companyLogoUrl = logoUrl;
        localStorage.setItem('user', JSON.stringify(userObj));
      } catch (e) {
        // Silent catch
      }

      toast.add({
        severity: 'success',
        summary: 'Logo Updated',
        detail: 'Your profile picture has been updated successfully.',
        life: 3000,
      });
    } else {
      toast.add({
        severity: 'warn',
        summary: 'Partial Update',
        detail:
          'Logo upload succeeded but we could not get the updated URL. Refresh may be needed.',
        life: 3000,
      });
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Upload Failed',
      detail: 'Failed to upload profile picture. Please try again.',
      life: 3000,
    });
  } finally {
    // Clear the file input to allow re-uploading the same file
    if (logoFileInput.value) {
      logoFileInput.value.value = '';
    }
  }
};

// Account Settings methods
const savePreferences = () => {
  toast.add({
    severity: 'success',
    summary: 'Success',
    detail: 'Communication preferences saved successfully',
    life: 3000,
  });
};

// Add validation function for password form
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
    if (typeof auth?.changePassword === 'function') {
      console.log('Using authStore.changePassword method');
      response = await auth.changePassword(
        passwordForm.value.currentPassword,
        passwordForm.value.newPassword,
        passwordForm.value.confirmPassword
      );
    }
    // Fallback: Use direct API call
    else {
      console.log('Fallback: Using direct API call for password change');
      // Example of a direct API call if needed
      response = await axios.post(
        'http://localhost:8080/api/auth/change-password',
        {
          currentPassword: passwordForm.value.currentPassword,
          newPassword: passwordForm.value.newPassword,
          confirmPassword: passwordForm.value.confirmPassword,
        },
        {
          headers: { Authorization: getToken() },
        }
      );
    }

    if (response && response.status >= 200 && response.status < 300) {
      // Reset form and close dialog
      passwordForm.value = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      };
      showChangePasswordDialog.value = false;

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
          if (typeof auth?.logout === 'function') {
            auth.logout();
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
    } else if (error.message) {
      errorMessage = error.message;
    }

    passwordSubmissionError.value = errorMessage;

    toast.add({
      severity: 'error',
      summary: 'Password Change Failed',
      detail: errorMessage,
      life: 5000,
    });
  } finally {
    changingPassword.value = false;
  }
};

// Format the event date range for display
const formatEventDate = (startDate, endDate) => {
  if (!startDate && !endDate) return 'No dates specified';

  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // If both dates are on the same day
    if (start.toDateString() === end.toDateString()) {
      return format(start, 'MMMM d, yyyy');
    }

    // If different days but same month and year
    if (
      start.getMonth() === end.getMonth() &&
      start.getFullYear() === end.getFullYear()
    ) {
      return `${format(start, 'MMMM d')}-${format(end, 'd, yyyy')}`;
    }

    // If different months but same year
    if (start.getFullYear() === end.getFullYear()) {
      return `${format(start, 'MMMM d')} - ${format(end, 'MMMM d, yyyy')}`;
    }

    // Different years
    return `${format(start, 'MMMM d, yyyy')} - ${format(end, 'MMMM d, yyyy')}`;
  }

  if (startDate) {
    return `From ${format(new Date(startDate), 'MMMM d, yyyy')}`;
  }

  return `Until ${format(new Date(endDate), 'MMMM d, yyyy')}`;
};

// Portfolio Methods
const fetchPortfolios = async () => {
  try {
    portfolioLoading.value = true;
    const response = await axios.get(
      'http://localhost:8080/api/recruiters/portfolio',
      {
        headers: { Authorization: getToken() },
      }
    );

    console.log('Raw API response:', response);

    // Process portfolios data
    let processedPortfolios = [];

    // Check if the response has data in the expected format
    if (response.data && typeof response.data === 'object') {
      // Handle case where data is in response.data.data
      if (Array.isArray(response.data.data)) {
        processedPortfolios = response.data.data;
      }
      // Handle case where data is directly in response.data
      else if (Array.isArray(response.data)) {
        processedPortfolios = response.data;
      }
      // Handle case where it's a single portfolio object
      else if (response.data.id) {
        processedPortfolios = [response.data];
      }
    }

    // Process each portfolio to ensure coverImageUrl is properly set
    portfolios.value = processedPortfolios.map((portfolio) => {
      console.log('Processing portfolio:', portfolio);

      // If portfolio has coverImageUrl, use it directly
      if (portfolio.coverImageUrl) {
        console.log('Found coverImageUrl:', portfolio.coverImageUrl);
      }

      return {
        ...portfolio,
        // Ensure coverImageUrl is preserved from the API response
        coverImageUrl: portfolio.coverImageUrl || null,
        // Initialize isDeleting state for each portfolio
        isDeleting: false,
      };
    });

    console.log('Processed portfolios:', portfolios.value);
  } catch (error) {
    console.error('Failed to fetch portfolios:', error);
    portfolios.value = [];
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load portfolios. Please try again.',
      life: 3000,
    });
  } finally {
    portfolioLoading.value = false;
  }
};

const openNewCollectionDialog = () => {
  isEditingPortfolio.value = false;
  collectionForm.value = {
    id: null,
    eventName: '',
    eventStartDate: null,
    eventEndDate: null,
    eventDescription: '',
  };
  collectionErrors.value = { eventName: '' };
  showCollectionDialog.value = true;
};

const editPortfolio = (portfolio) => {
  isEditingPortfolio.value = true;
  collectionForm.value = {
    id: portfolio.id,
    eventName: portfolio.eventName,
    eventStartDate: portfolio.eventStartDate
      ? new Date(portfolio.eventStartDate)
      : null,
    eventEndDate: portfolio.eventEndDate
      ? new Date(portfolio.eventEndDate)
      : null,
    eventDescription: portfolio.eventDescription || '',
  };
  collectionErrors.value = { eventName: '' };
  showCollectionDialog.value = true;
};

const validateCollectionForm = () => {
  let isValid = true;
  collectionErrors.value = { eventName: '' };

  if (!collectionForm.value.eventName.trim()) {
    collectionErrors.value.eventName = 'Event name is required';
    isValid = false;
  }

  return isValid;
};

const saveCollection = async () => {
  if (!validateCollectionForm()) return;

  try {
    collectionSaving.value = true;

    // Adjust dates to handle timezone issues
    let startDate = null;
    let endDate = null;

    if (collectionForm.value.eventStartDate) {
      // Create a new date but keep only the year, month, and day parts to prevent timezone issues
      const rawStart = new Date(collectionForm.value.eventStartDate);
      startDate = new Date(
        Date.UTC(
          rawStart.getFullYear(),
          rawStart.getMonth(),
          rawStart.getDate(),
          12,
          0,
          0,
          0 // Set to noon UTC to avoid date shifting
        )
      );
      console.log('Original start date:', rawStart);
      console.log('Adjusted start date:', startDate);
    }

    if (collectionForm.value.eventEndDate) {
      // Create a new date but keep only the year, month, and day parts to prevent timezone issues
      const rawEnd = new Date(collectionForm.value.eventEndDate);
      endDate = new Date(
        Date.UTC(
          rawEnd.getFullYear(),
          rawEnd.getMonth(),
          rawEnd.getDate(),
          12,
          0,
          0,
          0 // Set to noon UTC to avoid date shifting
        )
      );
      console.log('Original end date:', rawEnd);
      console.log('Adjusted end date:', endDate);
    }

    const payload = {
      eventName: collectionForm.value.eventName.trim(),
      eventDescription: collectionForm.value.eventDescription.trim(),
      eventStartDate: startDate,
      eventEndDate: endDate,
    };

    // Log the dates being sent
    console.log('Saving dates:', {
      startDate: payload.eventStartDate
        ? payload.eventStartDate.toISOString()
        : null,
      endDate: payload.eventEndDate ? payload.eventEndDate.toISOString() : null,
    });

    let response;

    if (isEditingPortfolio.value) {
      // Update existing portfolio
      payload.id = collectionForm.value.id;
      response = await axios.put(
        'http://localhost:8080/api/recruiters/portfolio',
        payload,
        {
          headers: { Authorization: getToken() },
        }
      );

      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Collection updated successfully',
        life: 3000,
      });
    } else {
      // Create new portfolio
      response = await axios.post(
        'http://localhost:8080/api/recruiters/portfolio',
        payload,
        {
          headers: { Authorization: getToken() },
        }
      );

      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'New collection created successfully',
        life: 3000,
      });
    }

    showCollectionDialog.value = false;
    await fetchPortfolios();
  } catch (error) {
    console.error('Failed to save collection:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to save collection. Please try again.',
      life: 3000,
    });
  } finally {
    collectionSaving.value = false;
  }
};

const confirmDeletePortfolio = (portfolio) => {
  // Prevent multiple confirmations while loading or if already deleting
  if (portfolioLoading.value) return;

  confirm.require({
    message: `Are you sure you want to delete "${portfolio.eventName}"? This action cannot be undone.`,
    header: 'Delete Collection',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        portfolioLoading.value = true;

        // Disable all portfolio buttons during deletion
        portfolios.value = portfolios.value.map((p) => ({
          ...p,
          isDeleting: p.id === portfolio.id,
        }));

        await axios.delete(
          `http://localhost:8080/api/recruiters/portfolio/${portfolio.id}`,
          {
            headers: { Authorization: getToken() },
          }
        );

        toast.add({
          severity: 'success',
          summary: 'Deleted',
          detail: 'Collection deleted successfully',
          life: 3000,
        });

        await fetchPortfolios();
      } catch (error) {
        console.error('Failed to delete portfolio:', error);
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete collection. Please try again.',
          life: 3000,
        });
      } finally {
        portfolioLoading.value = false;
      }
    },
    reject: () => {
      // Do nothing on reject
    },
  });
};

// Media Management Methods
const viewPortfolioMedia = async (portfolio) => {
  selectedPortfolio.value = portfolio;
  showMediaDialog.value = true;
  await fetchPortfolioMedia(portfolio.id);
};

const fetchPortfolioMedia = async (portfolioId) => {
  try {
    mediaLoading.value = true;
    const response = await axios.get(
      `http://localhost:8080/api/recruiters/portfolio/${portfolioId}`,
      {
        headers: { Authorization: getToken() },
      }
    );

    console.log('Media API response:', response);

    // Handle different response structures
    if (response.data) {
      let mediaItems = [];

      // If response.data.eventMedia exists and is an array
      if (response.data.eventMedia && Array.isArray(response.data.eventMedia)) {
        mediaItems = response.data.eventMedia.map((media) => ({
          id: media.id,
          url: mapMediaUrl(media.mediaUrl),
          type: media.mediaType || 'IMAGE',
          fileName: media.fileName,
        }));
      }
      // If response.data.data.eventMedia exists and is an array
      else if (
        response.data.data &&
        Array.isArray(response.data.data.eventMedia)
      ) {
        mediaItems = response.data.data.eventMedia.map((media) => ({
          id: media.id,
          url: mapMediaUrl(media.mediaUrl),
          type: media.mediaType || 'IMAGE',
          fileName: media.fileName,
        }));
      }
      // If response.data is itself an array of media items
      else if (Array.isArray(response.data)) {
        mediaItems = response.data.map((media) => ({
          id: media.id,
          url: mapMediaUrl(media.mediaUrl),
          type: media.mediaType || 'IMAGE',
          fileName: media.fileName,
        }));
      }

      console.log('Processed media items:', mediaItems);
      portfolioMedia.value = mediaItems;

      // Update the selected portfolio with additional details
      if (response.data.data) {
        selectedPortfolio.value = {
          ...selectedPortfolio.value,
          ...response.data.data,
          mediaCount: mediaItems.length,
        };
      } else {
        selectedPortfolio.value = {
          ...selectedPortfolio.value,
          ...response.data,
          mediaCount: mediaItems.length,
        };
      }

      console.log('Updated portfolio details:', selectedPortfolio.value);
    } else {
      portfolioMedia.value = [];
    }
  } catch (error) {
    console.error('Failed to fetch media:', error);
    portfolioMedia.value = [];
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load media. Please try again.',
      life: 3000,
    });
  } finally {
    mediaLoading.value = false;
  }
};

const uploadMedia = async (event) => {
  if (!selectedPortfolio.value?.id) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Portfolio ID is missing. Please try again.',
      life: 3000,
    });
    return;
  }

  const files = event.files;
  if (!files || files.length === 0) return;

  try {
    mediaUploading.value = true;
    uploadProgress.value = 0;

    // Create FormData for file upload
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    // Upload the files
    const response = await axios.post(
      `http://localhost:8080/api/recruiters/portfolio/${selectedPortfolio.value.id}/media`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: getToken(),
        },
        onUploadProgress: (progressEvent) => {
          uploadProgress.value = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
        },
      }
    );

    toast.add({
      severity: 'success',
      summary: 'Upload Complete',
      detail: `Successfully uploaded ${files.length} file(s)`,
      life: 3000,
    });

    // Refresh media list
    await fetchPortfolioMedia(selectedPortfolio.value.id);

    // Refresh portfolios to update media count
    await fetchPortfolios();
  } catch (error) {
    console.error('Failed to upload media:', error);
    toast.add({
      severity: 'error',
      summary: 'Upload Failed',
      detail: 'Failed to upload media. Please try again.',
      life: 3000,
    });
  } finally {
    mediaUploading.value = false;
  }
};

const confirmDeleteMedia = (media) => {
  if (mediaLoading.value) return; // Prevent multiple confirmations while loading

  confirm.require({
    message:
      'Are you sure you want to delete this media? This action cannot be undone.',
    header: 'Delete Media',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        mediaLoading.value = true;
        await axios.delete(
          `http://localhost:8080/api/recruiters/portfolio/${selectedPortfolio.value.id}/media/${media.id}`,
          {
            headers: { Authorization: getToken() },
          }
        );

        toast.add({
          severity: 'success',
          summary: 'Deleted',
          detail: 'Media deleted successfully',
          life: 3000,
        });

        // Refresh media list
        await fetchPortfolioMedia(selectedPortfolio.value.id);
        // Refresh portfolios to update media count
        await fetchPortfolios();
      } catch (error) {
        console.error('Failed to delete media:', error);
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete media. Please try again.',
          life: 3000,
        });
      } finally {
        mediaLoading.value = false;
      }
    },
    reject: () => {
      // Do nothing on reject
    },
  });
};

const closeMediaDialog = () => {
  if (mediaUploading.value) {
    toast.add({
      severity: 'info',
      summary: 'Upload in Progress',
      detail: 'Please wait for the upload to complete before closing',
      life: 3000,
    });
    return;
  }

  showMediaDialog.value = false;
  selectedPortfolio.value = null;
  portfolioMedia.value = [];
};

const openMediaPreview = (media, index) => {
  currentMedia.value = media;
  currentMediaIndex.value =
    index !== undefined
      ? index
      : portfolioMedia.value.findIndex((m) => m.id === media.id);
  showMediaPreview.value = true;
};

const navigateMedia = (direction) => {
  const totalItems = portfolioMedia.value.length;
  if (totalItems <= 1) return;

  if (direction === 'next') {
    currentMediaIndex.value = (currentMediaIndex.value + 1) % totalItems;
  } else {
    currentMediaIndex.value =
      (currentMediaIndex.value - 1 + totalItems) % totalItems;
  }

  currentMedia.value = portfolioMedia.value[currentMediaIndex.value];
};

// Lifecycle hooks
onMounted(async () => {
  console.log('Profile component mounted');

  // Check authentication status
  const token = localStorage.getItem('accessToken');
  const user = localStorage.getItem('user');
  const userType = localStorage.getItem('userType');

  console.log('Auth check on mount:');
  console.log('- Token exists:', !!token);
  console.log('- User exists:', !!user);
  console.log('- User type:', userType);

  if (!token) {
    console.warn('No authentication token found');
    toast.add({
      severity: 'error',
      summary: 'Authentication Error',
      detail: 'You are not logged in. Please log in to view your profile.',
      life: 5000,
    });
    // Could redirect to login page here
  }

  if (userType && userType.toUpperCase() !== 'RECRUITER') {
    console.warn('User is not a recruiter:', userType);
    toast.add({
      severity: 'warn',
      summary: 'Account Type Mismatch',
      detail: 'This profile is for recruiters only.',
      life: 5000,
    });
  }

  // Try to load profile data
  await fetchProfile();

  // Fetch portfolios when component is mounted
  if (activeTab.value === 'portfolio') {
    await fetchPortfolios();
  }
});

// Watch for tab changes to load tab-specific data
watch(activeTab, async (newValue) => {
  if (newValue === 'portfolio') {
    await fetchPortfolios();
  }
});

// Helper function to map API media URLs to local assets
const mapMediaUrl = (url) => {
  if (!url) return '';

  // Extract just the filename from the URL path
  const parts = url.split('/');
  const filename = parts[parts.length - 1];

  // If the URL starts with /assets/, it's from the API
  if (url.startsWith('/assets/')) {
    return url.replace('/assets/', '/src/assets/');
  }

  // If it's a full URL starting with http or https, use it as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // Otherwise, assume it's a direct filename and map to local assets directory
  return `/src/assets/portfolio-media/${filename}`;
};

const handleImageError = (event) => {
  toast.add({
    severity: 'warn',
    summary: 'Image Loading Issue',
    detail:
      'Could not load company logo. The system will use a default avatar instead.',
    life: 5000,
  });
};

// Add the getLocationDisplay function right before the end of the script
const getLocationDisplay = (location) => {
  // If location is null or undefined
  if (!location) {
    return 'Location not available';
  }

  // If location is already an object with name/address properties
  if (typeof location === 'object' && location !== null) {
    if (location.name) return location.name;
    if (location.address) return location.address;

    // If we have city and state, form a location string
    if (location.city && location.state) {
      return `${location.city}, ${location.state}${
        location.country ? ', ' + location.country : ''
      }`;
    }
  }

  // If location is a string that looks like JSON, try to parse it
  if (typeof location === 'string') {
    if (
      location.includes('"name":') ||
      location.includes('"address":') ||
      location.startsWith('{')
    ) {
      try {
        const parsedLocation = JSON.parse(location);

        if (parsedLocation.name) return parsedLocation.name;
        if (parsedLocation.address) return parsedLocation.address;

        // If we have city and state, form a location string
        if (parsedLocation.city && parsedLocation.state) {
          return `${parsedLocation.city}, ${parsedLocation.state}${
            parsedLocation.country ? ', ' + parsedLocation.country : ''
          }`;
        }
      } catch (error) {
        console.error('Error parsing location JSON:', error);
        // If parsing fails, just return the string
        return location;
      }
    }

    // If it's a regular string, just return it
    return location;
  }

  // Fallback to string representation
  return String(location);
};

// Add a new simple function for displaying location
const displayLocationName = (location) => {
  if (!location) return 'Location not available';

  try {
    // If it's a string that looks like JSON, parse it
    if (typeof location === 'string') {
      if (
        location.includes('{') ||
        location.includes('"name"') ||
        location.includes('"id"')
      ) {
        try {
          const locationObj = JSON.parse(location);
          return locationObj.name || locationObj.address || String(location);
        } catch (e) {
          // If parsing fails, just return the string
          return location;
        }
      }
      // Plain string, return as is
      return location;
    }
    // If it's already an object
    else if (typeof location === 'object' && location !== null) {
      if (location.name) return location.name;
      if (location.address) return location.address;

      // Handle object that might be stringified during display
      if (JSON.stringify(location) === '[object Object]') {
        // Extract any useful property we can find
        const keys = Object.keys(location);
        if (keys.length > 0) {
          for (const key of [
            'name',
            'address',
            'city',
            'state',
            'country',
            'description',
          ]) {
            if (location[key] && typeof location[key] === 'string') {
              return location[key];
            }
          }
          // If we can't find a good property, use the first one
          return String(location[keys[0]]);
        }
      }
      return String(location);
    }
    // For any other type, convert to string
    return String(location);
  } catch (e) {
    console.error('Error parsing location:', e);
    return String(location);
  }
};

const handleLocationSelected = (location) => {
  console.log('Location selected for individual profile:', location);

  // When a location is selected in the component
  if (location && location.length > 0) {
    const selectedLocation = location[0];

    // Update both the ID and the location name in the profile data
    editedProfile.value.companyLocationId = selectedLocation.id;

    // Store location as a simple name property for consistency and readability
    editedProfile.value.companyLocation = selectedLocation.name;

    // Also update the company location selection to stay in sync
    // when account type might change
    selectedCompanyLocation.value = [selectedLocation];
  } else {
    editedProfile.value.companyLocationId = null;
    editedProfile.value.companyLocation = null;
  }
};

const handleCompanyLocationSelected = (location) => {
  console.log('Location selected for company profile:', location);

  // When a location is selected in the component
  if (location && location.length > 0) {
    const selectedLocation = location[0];

    // Update both the ID and the location name in the profile data
    editedProfile.value.companyLocationId = selectedLocation.id;

    // Store location as a simple name property for consistency and readability
    editedProfile.value.companyLocation = selectedLocation.name;

    // Also update the individual location selection to stay in sync
    // when account type might change
    selectedIndividualLocation.value = [selectedLocation];
  } else {
    editedProfile.value.companyLocationId = null;
    editedProfile.value.companyLocation = null;
  }
};

// Add a watch for recruiter type changes to sync location data
watch(
  () => editedProfile.value?.recruiterType,
  (newType) => {
    if (editedProfile.value?.companyLocation) {
      // If changing to individual, make sure individual location is synced
      if (
        newType === 'INDIVIDUAL' &&
        selectedIndividualLocation.value.length === 0
      ) {
        const location = {
          id: editedProfile.value.companyLocationId || 'temp-location-id',
          name:
            typeof editedProfile.value.companyLocation === 'object'
              ? editedProfile.value.companyLocation.name
              : displayLocationName(editedProfile.value.companyLocation),
        };
        selectedIndividualLocation.value = [location];
      }
      // If changing to company/agency, make sure company location is synced
      else if (
        newType !== 'INDIVIDUAL' &&
        selectedCompanyLocation.value.length === 0
      ) {
        const location = {
          id: editedProfile.value.companyLocationId || 'temp-location-id',
          name:
            typeof editedProfile.value.companyLocation === 'object'
              ? editedProfile.value.companyLocation.name
              : displayLocationName(editedProfile.value.companyLocation),
        };
        selectedCompanyLocation.value = [location];
      }
    }
  }
);
</script>

<style scoped>
/* Remove inner border from dropdown component */
:deep(.p-dropdown .p-dropdown-label.p-inputtext) {
  border: none !important;
  box-shadow: none !important;
}

:deep(.p-dropdown-items-wrapper) {
  border: none !important;
}

:deep(.p-dropdown) {
  padding: 0 !important;
}

:deep(.p-dropdown-panel .p-dropdown-items) {
  padding: 0.5rem 0;
}

/* Ensure consistent sizing with other form elements */
:deep(.p-dropdown .p-dropdown-label) {
  padding: 0.75rem 1rem;
  height: auto;
  min-height: 2.75rem;
  line-height: 1.5;
}
</style>
