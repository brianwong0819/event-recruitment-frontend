<template>
  <div class="p-6">
    <!-- Custom confirmation dialog -->
    <Dialog
      v-model:visible="showConfirmDialog"
      :header="confirmHeader"
      :style="{ width: '450px' }"
      :modal="true"
      :closable="false"
    >
      <div class="flex align-items-center gap-3 mb-4">
        <i
          :class="confirmIcon"
          style="font-size: 1.5rem"
          :style="{ color: confirmIconColor }"
        ></i>
        <p>{{ confirmMessage }}</p>
      </div>
      <template #footer>
        <Button
          label="No"
          icon="pi pi-times"
          @click="cancelConfirmation"
          class="p-button-text"
          :disabled="isLoading"
        />
        <Button
          label="Yes"
          icon="pi pi-check"
          @click="confirmAction"
          :loading="isLoading"
          :disabled="isLoading"
          :class="confirmButtonClass"
        />
      </template>
    </Dialog>

    <div class="mb-6">
      <div class="flex items-center">
        <Button
          icon="pi pi-arrow-left"
          class="p-button-text p-button-rounded mr-2"
          @click="goBack"
        />
        <div>
          <h1 class="text-2xl font-bold text-gray-900 mb-1">Create New Job</h1>
          <div class="flex items-center text-gray-600">
            <i class="pi pi-folder text-primary-500 mr-2"></i>
            <span>{{ projectName }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Steps -->
    <div class="mb-6">
      <div class="custom-steps-container flex justify-between">
        <div
          v-for="(step, index) in steps"
          :key="index"
          class="custom-step-item flex flex-col items-center"
          :class="{ active: index <= activeIndex }"
        >
          <div
            class="step-number flex items-center justify-center h-10 w-10 rounded-full border-2 mb-1"
          >
            <i :class="step.icon + ' text-lg'"></i>
          </div>
          <span class="step-label text-sm font-medium">{{ step.label }}</span>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow p-6 mt-6">
      <!-- Step 1: Job Details -->
      <div v-if="activeIndex === 0">
        <h2 class="text-xl font-bold mb-4">Job Details</h2>
        <p class="text-gray-600 mb-6">
          Enter the basic details for this job listing
        </p>

        <div class="bg-white rounded-lg shadow p-6 mb-6">
          <!-- Basic Info Section -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold flex items-center mb-4">
              <i class="pi pi-info-circle text-primary-500 mr-2"></i>
              Basic Information
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Job Title -->
              <div class="field">
                <label
                  for="jobTitle"
                  class="block text-gray-700 font-medium mb-2 flex items-center"
                >
                  <i class="pi pi-tag text-primary-400 mr-2"></i>
                  Job Title <span class="text-red-500">*</span>
                </label>
                <InputText
                  id="jobTitle"
                  v-model="job.title"
                  class="w-full"
                  placeholder="e.g. Drypers Promoter Needed"
                  :class="{ 'p-invalid': v$.title.$invalid && submitted }"
                />
                <small v-if="v$.title.$invalid && submitted" class="p-error">
                  {{ v$.title.$errors[0].$message }}
                </small>
              </div>

              <!-- Job Title Type -->
              <div class="field">
                <label
                  for="jobTitleType"
                  class="block text-gray-700 font-medium mb-2 flex items-center"
                >
                  <i class="pi pi-briefcase text-primary-400 mr-2"></i>
                  Job Type <span class="text-red-500">*</span>
                </label>
                <Dropdown
                  id="jobTitleType"
                  v-model="job.jobTitleType"
                  :options="jobTitleTypeOptions"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Select job type"
                  class="w-full"
                  :class="{
                    'p-invalid': v$.jobTitleType.$invalid && submitted,
                  }"
                />
                <small
                  v-if="v$.jobTitleType.$invalid && submitted"
                  class="p-error"
                >
                  {{ v$.jobTitleType.$errors[0].$message }}
                </small>
              </div>
            </div>
          </div>

          <!-- Payment & Benefits Section -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold flex items-center mb-4">
              <i class="pi pi-money-bill text-primary-500 mr-2"></i>
              Payment & Benefits
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="field">
                <label
                  for="salary"
                  class="block text-gray-700 font-medium mb-2 flex items-center"
                >
                  <i class="pi pi-dollar text-primary-400 mr-2"></i>
                  Salary <span class="text-red-500">*</span>
                </label>
                <div class="flex">
                  <div class="custom-input-number-wrapper flex-grow">
                    <div class="relative">
                      <span
                        class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium"
                        >RM</span
                      >
                      <InputNumber
                        id="salary"
                        v-model="job.salary"
                        mode="decimal"
                        :minFractionDigits="2"
                        :maxFractionDigits="2"
                        placeholder="0.00"
                        :class="{
                          'p-invalid': v$.salary.$invalid && submitted,
                        }"
                        class="w-full pl-12"
                      />
                    </div>
                  </div>
                  <div class="w-2/5 ml-3">
                    <Dropdown
                      id="salaryType"
                      v-model="job.salaryType"
                      :options="salaryTypeOptions"
                      optionLabel="label"
                      optionValue="value"
                      placeholder="Select salary type"
                      class="w-full"
                      :class="{
                        'p-invalid': v$.salaryType.$invalid && submitted,
                      }"
                    />
                  </div>
                </div>
                <div class="flex mt-1">
                  <small
                    v-if="v$.salary.$invalid && submitted"
                    class="p-error mr-3"
                  >
                    {{ v$.salary.$errors[0].$message }}
                  </small>
                  <small
                    v-if="v$.salaryType.$invalid && submitted"
                    class="p-error"
                  >
                    {{ v$.salaryType.$errors[0].$message }}
                  </small>
                </div>
              </div>

              <!-- Payment Terms -->
              <div class="field">
                <label
                  for="paymentTerms"
                  class="block text-gray-700 font-medium mb-2 flex items-center"
                >
                  <i class="pi pi-calendar-plus text-primary-400 mr-2"></i>
                  Payment Terms
                </label>
                <InputText
                  id="paymentTerms"
                  v-model="job.paymentTerms"
                  class="w-full"
                  placeholder="e.g. Payment within 14 days after event"
                />
              </div>

              <!-- Benefits -->
              <div class="field md:col-span-2">
                <label
                  for="benefits"
                  class="block text-gray-700 font-medium mb-2 flex items-center"
                >
                  <i class="pi pi-gift text-primary-400 mr-2"></i>
                  Benefits (Optional)
                </label>
                <Textarea
                  id="benefits"
                  v-model="job.benefits"
                  rows="2"
                  autoResize
                  class="w-full"
                  placeholder="e.g. Meals provided, Transport allowance"
                />
              </div>
            </div>
          </div>

          <!-- Job Description Section -->
          <div>
            <h3 class="text-lg font-semibold flex items-center mb-4">
              <i class="pi pi-list text-primary-500 mr-2"></i>
              Job Description
            </h3>

            <div class="space-y-5">
              <!-- Job Scope -->
              <div class="field">
                <label
                  for="jobScope"
                  class="block text-gray-700 font-medium mb-2 flex items-center"
                >
                  <i class="pi pi-cog text-primary-400 mr-2"></i>
                  Job Scope <span class="text-red-500">*</span>
                </label>
                <Textarea
                  id="jobScope"
                  v-model="job.jobScope"
                  rows="4"
                  class="w-full"
                  placeholder="Example:
1. Assist in mixing drinks, approach customers to sample drinks.
2. Push for sales."
                  :class="{ 'p-invalid': v$.jobScope.$invalid && submitted }"
                />
                <small v-if="v$.jobScope.$invalid && submitted" class="p-error">
                  {{ v$.jobScope.$errors[0].$message }}
                </small>
              </div>

              <!-- Requirements -->
              <div class="field">
                <label
                  for="requirements"
                  class="block text-gray-700 font-medium mb-2 flex items-center"
                >
                  <i class="pi pi-check-square text-primary-400 mr-2"></i>
                  Requirements <span class="text-red-500">*</span>
                </label>
                <Textarea
                  id="requirements"
                  v-model="job.requirements"
                  rows="6"
                  class="w-full"
                  placeholder="Example:
1. Responsible & Good Attitude
2. Prefer with past promoter experiences
3. No Spec & Colour Lens, only clear lens allowed for Work
4. Promoter need to have own transport, bring items to work & back home"
                  :class="{
                    'p-invalid': v$.requirements.$invalid && submitted,
                  }"
                />
                <small
                  v-if="v$.requirements.$invalid && submitted"
                  class="p-error"
                >
                  {{ v$.requirements.$errors[0].$message }}
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 2: Job Schedule -->
      <div v-if="activeIndex === 1">
        <h2 class="text-xl font-bold mb-4">Job Schedule</h2>
        <p class="text-gray-600 mb-6">
          Add working dates and locations for this job
        </p>

        <!-- Global Job Settings (for all sections) -->
        <div
          class="bg-white rounded-lg shadow p-6 mb-6 transition-shadow hover:shadow-md"
        >
          <h3
            class="text-lg font-semibold flex items-center mb-4 pb-3 border-b border-gray-100"
          >
            <i class="pi pi-cog text-primary-500 mr-2"></i>
            Global Job Settings
          </h3>

          <!-- Number of Positions -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div class="field">
              <label
                class="block text-gray-700 font-medium mb-2 flex items-center"
              >
                <i class="pi pi-users text-primary-400 mr-2"></i>
                Number of Positions <span class="text-red-500">*</span>
              </label>
              <div class="custom-input-number-wrapper">
                <div class="relative">
                  <InputNumber
                    v-model="job.numberOfPositions"
                    placeholder="Enter total number of positions"
                    :min="1"
                    class="w-full"
                  />
                </div>
              </div>
              <div class="text-sm text-gray-500 mt-1">
                Default number of positions for each location
              </div>
            </div>

            <!-- Date Range (Auto calculated) -->
            <div class="field">
              <label
                class="block text-gray-700 font-medium mb-2 flex items-center"
              >
                <i class="pi pi-calendar-plus text-primary-400 mr-2"></i>
                Job Date Range
              </label>
              <div
                class="flex items-center p-3 border border-gray-200 rounded bg-gray-50 h-[42px]"
              >
                <template
                  v-if="calculatedDateRange.start && calculatedDateRange.end"
                >
                  <i class="pi pi-calendar text-primary-400 mr-2"></i>
                  <span class="font-medium">{{
                    formatDate(calculatedDateRange.start)
                  }}</span>
                  <i class="pi pi-arrow-right mx-2 text-gray-400"></i>
                  <span class="font-medium">{{
                    formatDate(calculatedDateRange.end)
                  }}</span>
                </template>
                <span v-else class="text-gray-500 italic">
                  <i class="pi pi-info-circle mr-2 text-gray-400"></i>
                  Auto-calculated from selected working dates
                </span>
              </div>
              <div class="text-sm text-gray-500 mt-1">
                Automatically calculated from working dates
              </div>
            </div>
          </div>

          <!-- Working Hours -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="field">
              <label
                class="block text-gray-700 font-medium mb-2 flex items-center"
              >
                <i class="pi pi-clock text-primary-400 mr-2"></i>
                Start Time <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <Calendar
                  v-model="job.startTime"
                  timeOnly
                  hourFormat="12"
                  placeholder="Select start time"
                  class="w-full"
                />
              </div>
              <div class="text-sm text-gray-500 mt-1">
                Daily start time for this job
              </div>
            </div>

            <div class="field">
              <label
                class="block text-gray-700 font-medium mb-2 flex items-center"
              >
                <i class="pi pi-clock text-primary-400 mr-2"></i>
                End Time <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <Calendar
                  v-model="job.endTime"
                  timeOnly
                  hourFormat="12"
                  placeholder="Select end time"
                  class="w-full"
                />
              </div>
              <div class="text-sm text-gray-500 mt-1">
                Daily end time for this job
              </div>
            </div>

            <div class="field">
              <label
                class="block text-gray-700 font-medium mb-2 flex items-center"
              >
                <i class="pi pi-hourglass text-primary-400 mr-2"></i>
                Rest Time
              </label>
              <div class="flex gap-3">
                <!-- Hours input -->
                <div class="flex-1">
                  <div class="flex items-center border border-gray-300 rounded">
                    <button
                      @click="decrementHours"
                      class="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-primary-500 focus:outline-none"
                      type="button"
                    >
                      <i class="pi pi-minus"></i>
                    </button>
                    <div class="flex-1 text-center">
                      <InputNumber
                        v-model="job.restTimeHours"
                        placeholder="0"
                        :min="0"
                        :max="23"
                        :showButtons="false"
                        class="w-16 text-center border-none p-0"
                        inputClass="border-0 text-center"
                      />
                    </div>
                    <button
                      @click="incrementHours"
                      class="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-primary-500 focus:outline-none"
                      type="button"
                    >
                      <i class="pi pi-plus"></i>
                    </button>
                    <div class="px-3 py-2 text-gray-600">hrs</div>
                  </div>
                </div>

                <!-- Minutes input -->
                <div class="flex-1">
                  <div class="flex items-center border border-gray-300 rounded">
                    <button
                      @click="decrementMinutes"
                      class="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-primary-500 focus:outline-none"
                      type="button"
                    >
                      <i class="pi pi-minus"></i>
                    </button>
                    <div class="flex-1 text-center">
                      <InputNumber
                        v-model="job.restTimeMinutes"
                        placeholder="0"
                        :min="0"
                        :max="59"
                        :step="5"
                        :showButtons="false"
                        class="w-16 text-center border-none p-0"
                        inputClass="border-0 text-center"
                      />
                    </div>
                    <button
                      @click="incrementMinutes"
                      class="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-primary-500 focus:outline-none"
                      type="button"
                    >
                      <i class="pi pi-plus"></i>
                    </button>
                    <div class="px-3 py-2 text-gray-600">mins</div>
                  </div>
                </div>
              </div>
              <div class="text-sm text-gray-500 mt-1">
                Rest period during working hours
              </div>
            </div>
          </div>
        </div>

        <!-- Schedule Sections -->
        <div class="mb-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold flex items-center">
              <i class="pi pi-calendar text-primary-500 mr-2"></i>
              Work Schedule Sections
            </h3>
            <Button
              icon="pi pi-plus"
              label="Add Section"
              class="p-button-primary p-button-sm"
              @click="addScheduleSection"
            />
          </div>

          <!-- Empty state message when no schedule sections exist -->
          <div
            v-if="job.scheduleSections.length === 0"
            class="text-center py-12 bg-white rounded-lg shadow border border-dashed border-gray-300"
          >
            <i class="pi pi-calendar text-5xl text-gray-300 mb-4"></i>
            <h4 class="text-xl font-medium text-gray-700 mb-2">
              No schedules added yet
            </h4>
            <p class="text-gray-500 mb-6 max-w-md mx-auto">
              Add a schedule section to specify working dates and locations for
              this job. You can create multiple sections for different date
              ranges.
            </p>
            <Button
              icon="pi pi-plus"
              label="Add Schedule Section"
              class="p-button-primary"
              @click="addScheduleSection"
            />
          </div>

          <!-- Schedule sections list -->
          <div v-else class="space-y-6">
            <div
              v-for="(section, sectionIndex) in job.scheduleSections"
              :key="sectionIndex"
              class="bg-white rounded-lg shadow p-5 border border-gray-100 transition-all hover:shadow-md"
            >
              <!-- Section header with delete button -->
              <div
                class="flex justify-between items-center mb-4 pb-2 border-b border-gray-100"
              >
                <h4 class="text-lg font-medium flex items-center">
                  <i class="pi pi-calendar-plus text-primary-400 mr-2"></i>
                  Schedule Section {{ sectionIndex + 1 }}
                </h4>
                <Button
                  icon="pi pi-trash"
                  class="p-button-text p-button-danger p-button-sm"
                  @click="removeScheduleSection(sectionIndex)"
                />
              </div>

              <!-- Date selection -->
              <div class="mb-5">
                <label
                  class="block text-gray-700 font-medium mb-2 flex items-center"
                >
                  <i class="pi pi-calendar text-primary-400 mr-2"></i>
                  Working Dates <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <Calendar
                    v-model="section.dates"
                    selectionMode="multiple"
                    :manualInput="false"
                    dateFormat="dd M yy"
                    placeholder="Select working dates"
                    panelClass="date-picker-panel"
                    class="w-full"
                    :minDate="today"
                    @date-select="updateDateRange"
                    @month-change="updateDateRange"
                  />
                </div>
                <div class="flex items-center mt-2">
                  <i class="pi pi-info-circle text-primary-300 mr-2"></i>
                  <div class="text-sm text-gray-600">
                    <span class="font-medium">Selected dates: </span>
                    <span
                      v-if="section.dates && section.dates.length > 0"
                      class="text-gray-700"
                    >
                      {{ formatSelectedDates(section.dates) }}
                    </span>
                    <span v-else class="italic text-gray-500"
                      >None selected</span
                    >
                  </div>
                </div>
              </div>

              <!-- Locations -->
              <div>
                <label
                  class="block text-gray-700 font-medium mb-2 flex items-center"
                >
                  <i class="pi pi-map-marker text-primary-400 mr-2"></i>
                  Locations <span class="text-red-500">*</span>
                </label>

                <!-- Location input with add button -->
                <div class="flex items-center gap-2 mb-3">
                  <div class="relative flex-grow">
                    <InputText
                      v-model="section.newLocation"
                      placeholder="Enter location name"
                      class="w-full"
                      @keyup.enter="addLocation(section)"
                    />
                  </div>
                  <Button
                    icon="pi pi-plus"
                    class="p-button-primary"
                    @click="addLocation(section)"
                    :disabled="!section.newLocation.trim()"
                  />
                </div>

                <!-- Locations list -->
                <div
                  v-if="section.locations.length > 0"
                  class="bg-gray-50 rounded-lg border border-gray-200 p-4 divide-y divide-gray-100"
                >
                  <div
                    v-for="(location, locationIndex) in section.locations"
                    :key="locationIndex"
                    class="py-3 first:pt-0 last:pb-0"
                  >
                    <div class="flex justify-between items-start">
                      <div class="flex items-start">
                        <div
                          class="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-primary-100 text-primary-600 text-xs font-medium mr-3 mt-1"
                        >
                          {{ locationIndex + 1 }}
                        </div>
                        <div>
                          <div class="font-medium text-gray-800">
                            {{ location.name }}
                          </div>
                          <div
                            v-if="location.positions"
                            class="text-sm text-gray-600 mt-1 flex items-center"
                          >
                            <i
                              class="pi pi-users text-primary-300 mr-1 text-xs"
                            ></i>
                            {{ location.positions }} positions
                          </div>
                          <div
                            v-else
                            class="text-sm text-gray-500 mt-1 flex items-center"
                          >
                            <i
                              class="pi pi-info-circle text-gray-300 mr-1 text-xs"
                            ></i>
                            Using default positions
                          </div>
                          <div
                            v-if="location.notes"
                            class="text-sm text-gray-600 mt-1 flex items-center"
                          >
                            <i
                              class="pi pi-comment text-primary-300 mr-1 text-xs"
                            ></i>
                            {{ location.notes }}
                          </div>
                        </div>
                      </div>
                      <div class="flex items-center gap-1">
                        <Button
                          icon="pi pi-pencil"
                          class="p-button-text p-button-rounded p-button-sm"
                          @click="editLocationPositions(section, locationIndex)"
                        />
                        <Button
                          icon="pi pi-trash"
                          class="p-button-text p-button-rounded p-button-danger p-button-sm"
                          @click="removeLocation(section, locationIndex)"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Empty locations state -->
                <div
                  v-else
                  class="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-200"
                >
                  <i class="pi pi-map-marker text-gray-300 text-2xl mb-2"></i>
                  <p class="text-gray-500 text-sm">No locations added yet</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Add a bottom Add Section button for convenience -->
        <div
          v-if="job.scheduleSections.length > 0"
          class="flex justify-center mt-6"
        >
          <Button
            icon="pi pi-plus"
            label="Add Another Section"
            class="p-button-primary"
            @click="addScheduleSection"
          />
        </div>

        <!-- Location Positions Dialog -->
        <Dialog
          v-model:visible="showLocationPositionsDialog"
          header="Edit Location Details"
          :style="{ width: '500px' }"
          :modal="true"
          class="location-edit-dialog"
        >
          <div class="p-4">
            <div
              class="mb-5 bg-indigo-50 p-4 rounded-lg border border-indigo-100 flex items-center"
            >
              <i class="pi pi-map-marker text-indigo-500 text-xl mr-3"></i>
              <div>
                <div class="text-sm text-indigo-600 font-medium mb-1">
                  Location
                </div>
                <div class="text-lg font-bold text-gray-800">
                  {{ editingLocation ? editingLocation.name : '' }}
                </div>
              </div>
            </div>

            <div class="field mb-5">
              <label
                for="locationPositions"
                class="block text-gray-700 font-medium mb-2 flex items-center"
              >
                <i class="pi pi-users text-primary-400 mr-2"></i>
                Number of Positions
              </label>
              <div class="relative">
                <InputNumber
                  id="locationPositions"
                  v-model="editingLocation.positions"
                  placeholder="Enter number of positions"
                  :min="1"
                  class="w-full border-2 border-indigo-200 rounded-lg focus:border-indigo-500"
                />
              </div>
              <small class="text-gray-500 flex items-center mt-2 text-xs">
                <i class="pi pi-info-circle mr-1 text-gray-400"></i>
                Leave empty to use the job's default number of positions
              </small>
            </div>

            <div class="field">
              <label
                for="locationNotes"
                class="block text-gray-700 font-medium mb-2 flex items-center"
              >
                <i class="pi pi-comment text-primary-400 mr-2"></i>
                Special Requirements/Notes
              </label>
              <div class="relative">
                <Textarea
                  id="locationNotes"
                  v-model="editingLocation.notes"
                  placeholder="e.g., 3 female, 2 male or Need typhoid certification"
                  rows="4"
                  class="w-full border-2 border-indigo-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  autoResize
                />
              </div>
              <small class="text-gray-500 flex items-center mt-2 text-xs">
                <i class="pi pi-info-circle mr-1 text-gray-400"></i>
                Add any specific requirements for this location
              </small>
            </div>
          </div>
          <template #footer>
            <div class="flex justify-end gap-3 p-3 bg-gray-50 rounded-b-lg">
              <Button
                label="Cancel"
                icon="pi pi-times"
                @click="closeLocationPositionsDialog"
                class="p-button-text p-button-secondary"
              />
              <Button
                label="Save"
                icon="pi pi-check"
                @click="saveLocationPositions"
                class="p-button-primary"
                style="background-color: #6366f1; border-color: #6366f1"
              />
            </div>
          </template>
        </Dialog>
      </div>

      <!-- Step 3: Review & Submit -->
      <div v-if="activeIndex === 2">
        <h2 class="text-xl font-bold mb-4">Review & Submit</h2>
        <p class="text-gray-600 mb-6">
          Review all job details before submitting
        </p>

        <div
          class="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden"
        >
          <!-- Job Details Section -->
          <div class="border-b border-gray-100">
            <div class="flex justify-between items-center p-6 bg-gray-50">
              <h3 class="text-lg font-semibold text-gray-800 flex items-center">
                <i class="pi pi-file text-primary-500 mr-2"></i>
                Job Details
              </h3>
              <Button
                icon="pi pi-pencil"
                label="Edit"
                class="p-button-text p-button-sm"
                @click="activeIndex = 0"
              />
            </div>

            <div class="p-6">
              <div class="bg-indigo-50 p-4 rounded-lg mb-6 flex items-center">
                <div
                  class="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4"
                >
                  <i class="pi pi-briefcase text-indigo-600 text-xl"></i>
                </div>
                <div>
                  <h4 class="text-lg font-bold text-gray-900">
                    {{ job.title }}
                  </h4>
                  <div class="text-indigo-600 font-medium">
                    {{ getJobTitleTypeLabel(job.jobTitleType) }}
                  </div>
                </div>
                <div class="ml-auto bg-indigo-100 py-2 px-4 rounded-full">
                  <span class="font-semibold text-indigo-800"
                    >RM {{ job.salary.toFixed(2) }}</span
                  >
                  <span class="text-indigo-600 text-sm ml-1">
                    ({{ getSalaryTypeLabel(job.salaryType) }})
                  </span>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div v-if="job.paymentTerms" class="bg-gray-50 p-4 rounded-lg">
                  <div class="text-sm text-gray-500 mb-1 flex items-center">
                    <i class="pi pi-calendar-plus text-primary-500 mr-2"></i>
                    Payment Terms
                  </div>
                  <div class="font-medium text-gray-800">
                    {{ job.paymentTerms }}
                  </div>
                </div>

                <div v-if="job.benefits" class="bg-gray-50 p-4 rounded-lg">
                  <div class="text-sm text-gray-500 mb-1 flex items-center">
                    <i class="pi pi-gift text-primary-500 mr-2"></i>
                    Benefits
                  </div>
                  <div class="font-medium text-gray-800">
                    {{ job.benefits }}
                  </div>
                </div>
              </div>

              <div class="space-y-6">
                <div class="bg-gray-50 p-5 rounded-lg">
                  <div class="text-sm text-gray-500 mb-2 flex items-center">
                    <i class="pi pi-cog text-primary-500 mr-2"></i>
                    Job Scope
                  </div>
                  <div
                    class="whitespace-pre-line text-gray-800 leading-relaxed"
                  >
                    {{ job.jobScope }}
                  </div>
                </div>

                <div class="bg-gray-50 p-5 rounded-lg">
                  <div class="text-sm text-gray-500 mb-2 flex items-center">
                    <i class="pi pi-check-square text-primary-500 mr-2"></i>
                    Requirements
                  </div>
                  <div
                    class="whitespace-pre-line text-gray-800 leading-relaxed"
                  >
                    {{ job.requirements }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Schedule Section -->
          <div class="border-b border-gray-100">
            <div class="flex justify-between items-center p-6 bg-gray-50">
              <h3 class="text-lg font-semibold text-gray-800 flex items-center">
                <i class="pi pi-calendar text-primary-500 mr-2"></i>
                Schedule Information
              </h3>
              <Button
                icon="pi pi-pencil"
                label="Edit"
                class="p-button-text p-button-sm"
                @click="activeIndex = 1"
              />
            </div>

            <div class="p-6">
              <!-- Global Job Info -->
              <div class="bg-gray-50 p-5 rounded-lg mb-6">
                <h4
                  class="text-md font-semibold mb-4 pb-2 border-b border-gray-200 text-gray-700"
                >
                  Global Settings
                </h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="flex items-center">
                    <div
                      class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3"
                    >
                      <i class="pi pi-users text-green-600"></i>
                    </div>
                    <div>
                      <div class="text-sm text-gray-500">Positions</div>
                      <div class="font-semibold text-gray-800">
                        {{ job.numberOfPositions || 'Not specified' }}
                      </div>
                    </div>
                  </div>

                  <div class="flex items-center">
                    <div
                      class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3"
                    >
                      <i class="pi pi-calendar text-blue-600"></i>
                    </div>
                    <div>
                      <div class="text-sm text-gray-500">Date Range</div>
                      <div class="font-semibold text-gray-800">
                        {{
                          calculatedDateRange.start && calculatedDateRange.end
                            ? `${formatDate(
                                calculatedDateRange.start
                              )} - ${formatDate(calculatedDateRange.end)}`
                            : 'Not specified'
                        }}
                      </div>
                    </div>
                  </div>

                  <div class="flex items-center">
                    <div
                      class="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3"
                    >
                      <i class="pi pi-clock text-amber-600"></i>
                    </div>
                    <div>
                      <div class="text-sm text-gray-500">Working Hours</div>
                      <div class="font-semibold text-gray-800">
                        {{
                          job.startTime && job.endTime
                            ? `${formatTime(job.startTime)} - ${formatTime(
                                job.endTime
                              )}`
                            : 'Not specified'
                        }}
                      </div>
                    </div>
                  </div>

                  <div class="flex items-center">
                    <div
                      class="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3"
                    >
                      <i class="pi pi-hourglass text-purple-600"></i>
                    </div>
                    <div>
                      <div class="text-sm text-gray-500">Rest Time</div>
                      <div class="font-semibold text-gray-800">
                        {{
                          formatRestTime(job.restTimeHours, job.restTimeMinutes)
                        }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Schedule Sections -->
              <div class="space-y-6">
                <div
                  v-for="(section, sectionIndex) in job.scheduleSections"
                  :key="sectionIndex"
                  class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
                >
                  <div class="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <div class="font-medium text-gray-800 flex items-center">
                      <i class="pi pi-calendar-plus text-primary-500 mr-2"></i>
                      Schedule Section {{ sectionIndex + 1 }}
                    </div>
                  </div>

                  <div class="p-4">
                    <div class="mb-4 pb-3 border-b border-gray-100">
                      <div class="flex items-start">
                        <i
                          class="pi pi-calendar text-primary-400 mt-1 mr-2"
                        ></i>
                        <div>
                          <div class="text-sm text-gray-500 mb-1">
                            Working Dates
                          </div>
                          <div class="font-medium text-gray-800">
                            {{ formatSelectedDates(section.dates) }}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div class="flex items-start mb-2">
                        <i
                          class="pi pi-map-marker text-primary-400 mt-1 mr-2"
                        ></i>
                        <div class="text-sm text-gray-500">Locations</div>
                      </div>

                      <!-- Updated location display with streamlined design -->
                      <div class="ml-6">
                        <div
                          class="rounded-lg border border-gray-200 overflow-hidden"
                        >
                          <div
                            v-for="(
                              location, locationIndex
                            ) in section.locations"
                            :key="locationIndex"
                            class="flex flex-col border-b border-gray-100 last:border-b-0"
                          >
                            <div class="p-3 bg-white flex items-center">
                              <div
                                class="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs mr-2"
                              >
                                {{ locationIndex + 1 }}
                              </div>
                              <div class="font-medium">{{ location.name }}</div>
                              <div class="ml-auto text-blue-600 text-sm">
                                {{
                                  location.positions || job.numberOfPositions
                                }}
                                positions
                              </div>
                            </div>
                            <div
                              v-if="location.notes"
                              class="bg-gray-50 px-4 py-2 text-sm text-gray-600 ml-8 border-t border-gray-100"
                            >
                              {{ location.notes }}
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
      </div>

      <!-- Navigation Buttons -->
      <div class="flex justify-between mt-6 pt-4 border-t">
        <Button
          label="Back"
          icon="pi pi-arrow-left"
          class="p-button-secondary"
          @click="prevStep"
          :disabled="activeIndex === 0 || isLoading"
        />
        <Button
          v-if="activeIndex < steps.length - 1"
          label="Next"
          icon="pi pi-arrow-right"
          iconPos="right"
          @click="nextStepWithValidation"
          :loading="isLoading"
          :disabled="isLoading"
        />
        <Button
          v-else
          label="Submit"
          icon="pi pi-check"
          @click="submitJob"
          :loading="isLoading"
          :disabled="isLoading"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useVuelidate } from '@vuelidate/core';
import { required, minValue } from '@vuelidate/validators';

// PrimeVue components
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Dropdown from 'primevue/dropdown';
import Textarea from 'primevue/textarea';
import Dialog from 'primevue/dialog';
import Calendar from 'primevue/calendar';

const router = useRouter();
const route = useRoute();
const toast = useToast();

// Extract project information from query params
const projectId = computed(() => route.query.projectId);
const projectName = computed(
  () => route.query.projectName || 'Unknown Project'
);

// Step configuration
const steps = [
  { label: 'Job Details', icon: 'pi pi-file' },
  { label: 'Schedule', icon: 'pi pi-calendar' },
  { label: 'Review & Submit', icon: 'pi pi-check' },
];
const activeIndex = ref(0);

// Job data
const job = reactive({
  projectId: '',
  title: '',
  jobScope: '',
  requirements: '',
  salary: null,
  salaryType: '',
  paymentTerms: '',
  benefits: '',
  jobTitleType: '',
  scheduleSections: [],
  numberOfPositions: 1,
  startTime: null,
  endTime: null,
  restTimeHours: 0,
  restTimeMinutes: 0,
});

// Salary type options
const salaryTypeOptions = [
  { label: 'Per Hour', value: 'PER_HOUR' },
  { label: 'Per Day', value: 'PER_DAY' },
  { label: 'Per Event', value: 'PER_EVENT' },
  { label: 'Fixed', value: 'FIXED' },
  { label: 'Commission', value: 'COMMISSION' },
  { label: 'Negotiable', value: 'NEGOTIABLE' },
];

// Job title type options
const jobTitleTypeOptions = [
  { label: 'Promoter', value: 'PROMOTER' },
  { label: 'Supervisor', value: 'SUPERVISOR' },
  { label: 'Setup Crew', value: 'SETUP_CREW' },
  { label: 'Mascot Crew', value: 'MASCOT_CREW' },
  { label: 'Brand Ambassador', value: 'BRAND_AMBASSADOR' },
  { label: 'Event Crew', value: 'EVENT_CREW' },
  { label: 'Usher', value: 'USHER' },
  { label: 'Other', value: 'OTHER' },
];

// Custom confirmation dialog state
const showConfirmDialog = ref(false);
const confirmHeader = ref('');
const confirmMessage = ref('');
const confirmIcon = ref('pi pi-info-circle');
const confirmIconColor = ref('var(--primary-color)');
const confirmButtonClass = ref('p-button-primary');
const confirmCallback = ref(null);

// Form submission state
const submitted = ref(false);
const isLoading = ref(false);

// Validation rules
const rules = computed(() => ({
  title: { required },
  jobScope: { required },
  requirements: { required },
  salary: { required, minValue: minValue(1) },
  salaryType: { required },
  jobTitleType: { required },
}));

// Create vuelidate object
const v$ = useVuelidate(rules, job);

// Fix the date restriction approach
// Prepare minimum date (today)
const today = ref(new Date());
// Set hours to beginning of today to avoid time issues
today.value.setHours(0, 0, 0, 0);

// Add this for date range calculation
const calculatedDateRange = reactive({
  start: null,
  end: null,
});

// Function to update the date range based on all selected dates
const updateDateRange = () => {
  // Collect all dates from all sections
  const allDates = [];

  job.scheduleSections.forEach((section) => {
    if (section.dates && section.dates.length > 0) {
      allDates.push(...section.dates);
    }
  });

  if (allDates.length > 0) {
    // Sort dates chronologically
    allDates.sort((a, b) => new Date(a) - new Date(b));

    // Set start date to earliest date and end date to latest date
    calculatedDateRange.start = new Date(allDates[0]);
    calculatedDateRange.end = new Date(allDates[allDates.length - 1]);
  } else {
    calculatedDateRange.start = null;
    calculatedDateRange.end = null;
  }
};

// Format date for display
const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

// Format time for display
const formatTime = (time) => {
  if (!time) return '';
  return new Date(time).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

// Validate current step
const validateCurrentStep = async () => {
  // Don't do anything if already loading
  if (isLoading.value) return false;

  // For the first step, validate all fields
  if (activeIndex.value === 0) {
    submitted.value = true;
    const isValid = await v$.value.$validate();

    if (!isValid) {
      toast.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fill in all required fields correctly',
        life: 3000,
      });
      return false;
    }
    return true;
  }

  // For the schedule step, validate schedule sections
  if (activeIndex.value === 1) {
    submitted.value = true;

    // Check if global settings are provided
    if (!job.numberOfPositions || job.numberOfPositions < 1) {
      toast.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please specify the number of positions for this job',
        life: 3000,
      });
      return false;
    }

    if (!job.startTime) {
      toast.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please specify the start time for this job',
        life: 3000,
      });
      return false;
    }

    if (!job.endTime) {
      toast.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please specify the end time for this job',
        life: 3000,
      });
      return false;
    }

    // Check if start time is before end time
    if (job.startTime && job.endTime && job.startTime >= job.endTime) {
      toast.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Start time must be before end time',
        life: 3000,
      });
      return false;
    }

    // Check if there are any schedule sections
    if (job.scheduleSections.length === 0) {
      toast.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please add at least one schedule section',
        life: 3000,
      });
      return false;
    }

    // Check each section for dates and locations
    let isValid = true;
    for (let i = 0; i < job.scheduleSections.length; i++) {
      const section = job.scheduleSections[i];

      if (!section.dates || section.dates.length === 0) {
        toast.add({
          severity: 'error',
          summary: 'Validation Error',
          detail: `Please select working dates for Section ${i + 1}`,
          life: 3000,
        });
        isValid = false;
        break;
      }

      if (!section.locations || section.locations.length === 0) {
        toast.add({
          severity: 'error',
          summary: 'Validation Error',
          detail: `Please add at least one location for Section ${i + 1}`,
          life: 3000,
        });
        isValid = false;
        break;
      }
    }

    return isValid;
  }

  // For other steps, just return true for now
  return true;
};

// Navigate back to the job management page
const goBack = () => {
  router.push({
    name: 'ProjectDetails',
    params: { projectId: projectId.value },
  });
};

// Step navigation
const prevStep = () => {
  if (activeIndex.value > 0) {
    activeIndex.value--;
  }
};

const nextStep = () => {
  activeIndex.value++;
  submitted.value = false;
};

// Next step with validation
const nextStepWithValidation = async () => {
  // Don't do anything if already loading
  if (isLoading.value) return;

  // Validate current step
  const isValid = await validateCurrentStep();
  if (!isValid) return;

  // If validation passes, proceed to next step
  nextStep();
};

// Custom confirmation dialog methods
const showConfirmation = (header, message, callback, options = {}) => {
  confirmHeader.value = header;
  confirmMessage.value = message;
  confirmCallback.value = callback;

  // Optional customizations
  confirmIcon.value = options.icon || 'pi pi-info-circle';
  confirmIconColor.value = options.iconColor || 'var(--primary-color)';
  confirmButtonClass.value = options.buttonClass || 'p-button-primary';

  showConfirmDialog.value = true;
};

const confirmAction = () => {
  if (typeof confirmCallback.value === 'function') {
    isLoading.value = true;
    confirmCallback.value();
  }
};

const cancelConfirmation = () => {
  showConfirmDialog.value = false;
};

// Extract the API call to a separate function
const saveJobDetails = async () => {
  try {
    // Format the selected times for API
    const formatTimeForAPI = (time) => {
      if (!time) return null;
      const t = new Date(time);
      return `${t.getHours().toString().padStart(2, '0')}:${t
        .getMinutes()
        .toString()
        .padStart(2, '0')}`;
    };

    // Format rest time for API (as minutes)
    const restTimeMinutes =
      (job.restTimeHours || 0) * 60 + (job.restTimeMinutes || 0);

    // Prepare job data from form
    const jobData = {
      projectId: parseInt(job.projectId),
      title: job.title,
      jobTitleType: job.jobTitleType,
      jobScope: job.jobScope,
      requirements: job.requirements,
      salary: job.salary,
      paymentTerms: job.paymentTerms || '',
      salaryType: job.salaryType,
      benefits: job.benefits || '',
      numberOfPositions: job.numberOfPositions,
      startTime: formatTimeForAPI(job.startTime),
      endTime: formatTimeForAPI(job.endTime),
      restTimeMinutes: restTimeMinutes,
      startDate: calculatedDateRange.start
        ? calculatedDateRange.start.toISOString().split('T')[0]
        : null,
      endDate: calculatedDateRange.end
        ? calculatedDateRange.end.toISOString().split('T')[0]
        : null,
      scheduleSections: job.scheduleSections.map((section) => ({
        // Format dates as yyyy-MM-dd for API
        dates: section.dates.map(
          (date) => new Date(date).toISOString().split('T')[0]
        ),
        locations: section.locations.map((location) => ({
          name: location.name,
          positions: location.positions || null, // Optional specific positions per location
          notes: location.notes || '', // Location-specific notes
        })),
      })),
    };

    console.log('Saving job with data:', jobData);

    // Get auth token
    const token = localStorage.getItem('accessToken');
    if (!token) {
      toast.add({
        severity: 'error',
        summary: 'Authentication Error',
        detail: 'You are not logged in. Please log in to continue.',
        life: 3000,
      });
      isLoading.value = false;
      showConfirmDialog.value = false;
      return;
    }

    // Make API call to create job
    const response = await fetch('http://localhost:8080/api/jobs', {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jobData),
    });

    const responseData = await response.json();

    if (response.ok && responseData.statusCode === 201) {
      // Show success message
      toast.add({
        severity: 'success',
        summary: 'Job Created',
        detail: `Job "${job.title}" has been created successfully`,
        life: 3000,
      });

      // Hide the confirmation dialog
      showConfirmDialog.value = false;

      // Navigate back to project details
      router.push({
        name: 'ProjectDetails',
        params: { projectId: projectId.value },
      });
    } else {
      // Show error message
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail:
          responseData.message || 'Failed to create job. Please try again.',
        life: 3000,
      });
    }
  } catch (error) {
    console.error('Error creating job:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'An unexpected error occurred. Please try again.',
      life: 3000,
    });
  } finally {
    // Reset loading state
    isLoading.value = false;
    // Hide the confirmation dialog if still visible
    showConfirmDialog.value = false;
  }
};

const submitJob = async () => {
  // Don't do anything if already loading
  if (isLoading.value) return;

  // Validate first
  const isValid = await validateCurrentStep();
  if (!isValid) return;

  // Show custom confirmation dialog
  showConfirmation(
    'Confirm Submission',
    'Are you sure you want to submit this job listing?',
    saveJobDetails,
    {
      icon: 'pi pi-check-circle',
      buttonClass: 'p-button-success',
    }
  );
};

// Add a new schedule section
const addScheduleSection = () => {
  job.scheduleSections.push({
    dates: [],
    locations: [],
    newLocation: '',
  });
};

// Remove a schedule section
const removeScheduleSection = (index) => {
  job.scheduleSections.splice(index, 1);
};

// Add a location to a section
const addLocation = (section) => {
  if (section.newLocation.trim()) {
    section.locations.push({
      name: section.newLocation.trim(),
      positions: null, // Will use global positions if null
      notes: '', // Add empty notes field
    });
    section.newLocation = '';
  }
};

// Remove a location from a section
const removeLocation = (section, index) => {
  section.locations.splice(index, 1);
};

// Format the selected dates for display
const formatSelectedDates = (dates) => {
  if (!dates || dates.length === 0) return '';

  // Sort dates chronologically
  const sortedDates = [...dates].sort((a, b) => new Date(a) - new Date(b));

  return sortedDates
    .map((date) => {
      return new Date(date).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
      });
    })
    .join(', ');
};

// Utility functions for review page labels
const getJobTitleTypeLabel = (value) => {
  const option = jobTitleTypeOptions.find((opt) => opt.value === value);
  return option ? option.label : value;
};

const getSalaryTypeLabel = (value) => {
  const option = salaryTypeOptions.find((opt) => opt.value === value);
  return option ? option.label : value;
};

// Dialog for editing location positions
const showLocationPositionsDialog = ref(false);
const editingLocation = ref(null);
const editingSectionIndex = ref(null);
const editingLocationIndex = ref(null);

// Open dialog to edit location positions
const editLocationPositions = (section, locationIndex) => {
  const sectionIndex = job.scheduleSections.indexOf(section);
  if (sectionIndex !== -1) {
    editingSectionIndex.value = sectionIndex;
    editingLocationIndex.value = locationIndex;
    // Clone the location object to avoid direct reference modification
    editingLocation.value = { ...section.locations[locationIndex] };
    showLocationPositionsDialog.value = true;
  }
};

// Save location positions from dialog
const saveLocationPositions = () => {
  if (
    editingSectionIndex.value !== null &&
    editingLocationIndex.value !== null &&
    editingLocation.value
  ) {
    // Update the location object with new positions value
    job.scheduleSections[editingSectionIndex.value].locations[
      editingLocationIndex.value
    ] = {
      ...editingLocation.value,
    };
    closeLocationPositionsDialog();
  }
};

// Close location positions dialog
const closeLocationPositionsDialog = () => {
  showLocationPositionsDialog.value = false;
  editingLocation.value = null;
  editingSectionIndex.value = null;
  editingLocationIndex.value = null;
};

// Add a function to format rest time
const formatRestTime = (hours, minutes) => {
  let result = '';
  if (hours > 0) {
    result += `${hours} hr${hours !== 1 ? 's' : ''}`;
  }
  if (minutes > 0) {
    if (result) result += ' ';
    result += `${minutes} min${minutes !== 1 ? 's' : ''}`;
  }
  return result || 'None';
};

// Add these helper methods to manage the rest time inputs
const incrementHours = () => {
  if (job.restTimeHours < 23) {
    job.restTimeHours = (job.restTimeHours || 0) + 1;
  }
};

const decrementHours = () => {
  if (job.restTimeHours > 0) {
    job.restTimeHours -= 1;
  }
};

const incrementMinutes = () => {
  if (job.restTimeMinutes < 55) {
    job.restTimeMinutes = (job.restTimeMinutes || 0) + 5;
  } else {
    job.restTimeMinutes = 0;
  }
};

const decrementMinutes = () => {
  if (job.restTimeMinutes >= 5) {
    job.restTimeMinutes -= 5;
  } else if (job.restTimeMinutes > 0) {
    job.restTimeMinutes = 0;
  }
};

onMounted(() => {
  // Set project ID from query parameter
  if (projectId.value) {
    job.projectId = projectId.value;
  } else {
    // If no project ID is provided, show error and redirect back
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No project selected. Please select a project first.',
      life: 3000,
    });
    router.push({ name: 'ManageJobs' });
  }
});
</script>

<style scoped>
/* Custom steps indicator */
.custom-steps-container {
  position: relative;
  padding: 0 2rem;
  margin-bottom: 2rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.custom-steps-container::before {
  content: '';
  position: absolute;
  top: 1.25rem;
  left: 120px;
  right: 120px;
  height: 2px;
  background-color: #e2e8f0;
  z-index: 0;
}

.custom-step-item {
  position: relative;
  z-index: 1;
  width: 120px;
}

.step-number {
  background-color: white;
  border-color: #e2e8f0;
  color: #64748b;
  transition: all 0.3s ease;
  height: 2.5rem;
  width: 2.5rem;
}

.custom-step-item.active .step-number {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.step-label {
  color: #64748b;
  transition: all 0.3s ease;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  white-space: nowrap;
}

.custom-step-item.active .step-label {
  color: var(--primary-color);
  font-weight: 600;
}

/* Form field styling */
.field {
  margin-bottom: 1.5rem;
}

/* Consistent form element styling */
:deep(.p-dropdown),
:deep(.p-inputtext),
:deep(.p-inputnumber),
:deep(.p-textarea) {
  border-radius: 0.375rem;
  width: 100%;
  border: 1px solid #d1d5db;
  outline: none;
  box-shadow: none !important;
  transition: border-color 0.2s;
}

:deep(.p-dropdown),
:deep(.p-inputtext),
:deep(.p-inputnumber) {
  height: 40px;
}

:deep(.p-dropdown:hover),
:deep(.p-inputtext:hover),
:deep(.p-inputnumber:hover),
:deep(.p-textarea:hover) {
  border-color: var(--primary-color);
}

:deep(.p-dropdown:focus),
:deep(.p-inputtext:focus),
:deep(.p-inputnumber:focus),
:deep(.p-textarea:focus) {
  border-color: var(--primary-color);
  box-shadow: none !important;
}

/* Textarea specific styling */
:deep(.p-textarea) {
  padding: 0.75rem;
  font-size: 0.875rem;
  line-height: 1.5;
}

:deep(.p-dropdown-panel) {
  border-radius: 0.375rem;
}

:deep(.p-dropdown-label) {
  height: 40px;
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  border: none !important;
  background: transparent;
  outline: none;
  box-shadow: none !important;
}

:deep(.p-dropdown-trigger) {
  width: 2.5rem;
  background: transparent;
  border: none !important;
  outline: none;
  box-shadow: none !important;
}

:deep(.p-inputwrapper) {
  width: 100%;
}

:deep(.p-dropdown-items-wrapper) {
  padding: 0;
}

:deep(.p-component) {
  font-family: inherit;
}

:deep(.p-dropdown-item) {
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
}

/* Fix specific components */
#jobTitleType,
#salaryType {
  width: 100%;
  box-shadow: none !important;
  outline: none;
  overflow: hidden;
}

:deep(.p-dropdown.p-component) {
  display: flex;
  align-items: center;
  box-shadow: none !important;
  outline: none;
  overflow: hidden;
}

/* Custom styling for salary input */
:deep(.salary-input) {
  border: 1px solid #d1d5db !important;
  border-radius: 0.375rem !important;
  display: flex !important;
  align-items: center !important;
  height: 40px !important;
}

:deep(.salary-input:hover) {
  border-color: var(--primary-color) !important;
}

:deep(.salary-input .p-inputtext) {
  border: none !important;
  box-shadow: none !important;
  height: 100% !important;
}

:deep(.salary-input .p-inputnumber-button) {
  background-color: transparent !important;
  border: none !important;
  color: #6b7280 !important;
}

/* Job Scope and Requirements - specific sizes */
#jobScope {
  min-height: 120px;
  resize: vertical;
}

#requirements {
  min-height: 180px;
  resize: vertical;
}

/* Fix InputNumber component */
:deep(.p-inputnumber) {
  display: flex;
  align-items: center;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  overflow: hidden;
}

:deep(.p-inputnumber-input) {
  height: 40px;
  width: 100%;
  border: none !important;
  outline: none;
  box-shadow: none !important;
  padding: 0.5rem 0.75rem;
}

:deep(.p-inputnumber-button) {
  border: none !important;
  outline: none;
  box-shadow: none !important;
  background-color: transparent;
}

:deep(.p-inputnumber-buttons-stacked) {
  height: 40px;
}

:deep(.p-inputnumber:hover) {
  border-color: var(--primary-color);
}

:deep(.p-inputnumber.p-focus) {
  border-color: var(--primary-color);
}

/* Remove double borders */
:deep(.p-dropdown .p-component) {
  border: none !important;
}

:deep(.p-dropdown-items-wrapper),
:deep(.p-dropdown-panel .p-component) {
  border: 1px solid #d1d5db !important;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .step-label {
    display: none;
  }
}

/* Custom input number wrapper */
.custom-input-number-wrapper {
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  overflow: hidden;
  transition: border-color 0.2s;
}

.custom-input-number-wrapper:hover {
  border-color: var(--primary-color);
}

.custom-input-number-wrapper :deep(.p-inputnumber),
.custom-input-number-wrapper :deep(.p-inputtext) {
  border: none !important;
  box-shadow: none !important;
}

/* Calendar component styling */
:deep(.p-calendar) {
  width: 100%;
}

:deep(.p-calendar .p-inputtext) {
  width: 100%;
  border-radius: 0.375rem;
  border: 1px solid #d1d5db;
  padding: 0.5rem 0.75rem;
  height: 40px;
  transition: border-color 0.2s;
}

:deep(.p-calendar .p-inputtext:hover) {
  border-color: var(--primary-color);
}

:deep(.p-calendar .p-inputtext:focus) {
  border-color: var(--primary-color);
  box-shadow: none !important;
}

:deep(.p-datepicker) {
  border-radius: 0.375rem;
  padding: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

:deep(.p-datepicker-header) {
  padding: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
}

:deep(.p-datepicker-calendar) {
  margin: 0.5rem 0;
}

:deep(.p-datepicker-calendar td) {
  padding: 0.2rem;
}

:deep(.p-datepicker-calendar .p-highlight) {
  background-color: var(--primary-color);
  color: white;
}

:deep(.p-datepicker-calendar .p-highlight:hover) {
  background-color: var(--primary-700);
}

:deep(.p-datepicker-calendar td.p-datepicker-today > span) {
  border-color: var(--primary-300);
}

:deep(.p-datepicker-calendar td.p-highlight > span) {
  background-color: var(--primary-500);
}

:deep(.p-datepicker-calendar td.p-highlight > span:hover) {
  background-color: var(--primary-600);
}

/* Add this to existing styles */
:deep(.location-edit-dialog .p-dialog-header) {
  border-bottom: 1px solid #f0f4f8;
  background-color: #fcfcfc;
  padding: 1.25rem;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
}

:deep(.location-edit-dialog .p-dialog-content) {
  padding: 0;
}

:deep(.location-edit-dialog .p-dialog-header-text) {
  font-weight: 600;
  font-size: 1.25rem;
  color: #374151;
}

:deep(.location-edit-dialog .p-dialog-header-icon) {
  color: #6b7280;
  border-radius: 9999px;
  transition: all 0.2s;
}

:deep(.location-edit-dialog .p-dialog-header-icon:hover) {
  background-color: #f3f4f6;
  color: #374151;
}

:deep(.location-edit-dialog) {
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

:deep(.location-edit-dialog .p-inputtext:focus) {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(var(--primary-500-rgb), 0.1);
}

:deep(.location-edit-dialog .p-inputnumber-input:focus) {
  box-shadow: none;
}

:deep(.location-edit-dialog .p-button) {
  border-radius: 0.375rem;
  transition: all 0.2s;
}

:deep(.location-edit-dialog .p-dialog-footer) {
  border-top: none;
  padding: 0;
}

:deep(.location-edit-dialog .p-button.p-button-primary) {
  background-color: #6366f1;
  border-color: #6366f1;
  padding: 0.6rem 1.25rem;
  font-weight: 500;
}

:deep(.location-edit-dialog .p-button.p-button-primary:hover) {
  background-color: #4f46e5;
  border-color: #4f46e5;
}

:deep(.location-edit-dialog .p-button.p-button-secondary) {
  color: #4b5563;
  padding: 0.6rem 1.25rem;
  font-weight: 500;
}

:deep(.location-edit-dialog .p-button.p-button-secondary:hover) {
  background-color: #f3f4f6;
  color: #1f2937;
}

.custom-textarea-wrapper {
  /* This class is no longer used */
}

.custom-textarea-wrapper:hover {
  /* This class is no longer used */
}

:deep(.custom-textarea-wrapper .p-inputtextarea) {
  /* This class is no longer used */
}

:deep(.custom-textarea-wrapper .p-inputtextarea:focus) {
  /* This class is no longer used */
}

.custom-input-number-wrapper {
  /* This class is no longer used */
}

.custom-input-number-wrapper:hover {
  /* This class is no longer used */
}
</style>
