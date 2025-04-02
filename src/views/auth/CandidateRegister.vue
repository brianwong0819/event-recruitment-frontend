<template>
    <div>
      <div class="text-center">
        <h2 class="mt-6 text-3xl font-bold text-text-heading">
          Create a Candidate Account
        </h2>
        <p class="mt-2 text-sm text-text-primary">
          Join our platform to discover exciting event opportunities
        </p>
      </div>
  
      <div class="mt-8">
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form @submit.prevent="handleRegister" class="space-y-6">
            <!-- Error alert -->
            <div v-if="authStore.error" class="bg-red-50 border-l-4 border-red-400 p-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <i class="pi pi-exclamation-triangle text-red-400"></i>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-red-700">
                    {{ authStore.error }}
                  </p>
                </div>
              </div>
            </div>
  
            <!-- Full Name field -->
            <div>
              <label for="name" class="form-label">Full Name</label>
              <div class="mt-1">
                <InputText
                  id="name"
                  v-model="formData.name"
                  type="text"
                  autocomplete="name"
                  required
                  class="form-input"
                  :class="{ 'p-invalid': v$.name.$error }"
                />
                <small v-if="v$.name.$error" class="p-error">{{ v$.name.$errors[0].$message }}</small>
              </div>
            </div>
  
            <!-- Username field -->
            <div>
              <label for="username" class="form-label">Username</label>
              <div class="mt-1">
                <InputText
                  id="username"
                  v-model="formData.username"
                  type="text"
                  autocomplete="username"
                  required
                  class="form-input"
                  :class="{ 'p-invalid': v$.username.$error }"
                />
                <small v-if="v$.username.$error" class="p-error">{{ v$.username.$errors[0].$message }}</small>
              </div>
            </div>
  
            <!-- Email field -->
            <div>
              <label for="email" class="form-label">Email</label>
              <div class="mt-1">
                <InputText
                  id="email"
                  v-model="formData.email"
                  type="email"
                  autocomplete="email"
                  required
                  class="form-input"
                  :class="{ 'p-invalid': v$.email.$error }"
                />
                <small v-if="v$.email.$error" class="p-error">{{ v$.email.$errors[0].$message }}</small>
              </div>
            </div>
  
            <!-- Phone Number field -->
            <div>
              <label for="phoneNumber" class="form-label">Phone Number</label>
              <div class="mt-1">
                <InputText
                  id="phoneNumber"
                  v-model="formData.phoneNumber"
                  type="tel"
                  autocomplete="tel"
                  required
                  class="form-input"
                  :class="{ 'p-invalid': v$.phoneNumber.$error }"
                />
                <small v-if="v$.phoneNumber.$error" class="p-error">{{ v$.phoneNumber.$errors[0].$message }}</small>
              </div>
            </div>
  
            <!-- Gender field -->
            <div>
              <label for="gender" class="form-label">Gender</label>
              <div class="mt-1">
                <Dropdown
                  id="gender"
                  v-model="formData.gender"
                  :options="genderOptions"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Select Gender"
                  class="w-full p-inputtext-sm"
                  :class="{ 'p-invalid': v$.gender.$error }"
                />
                <small v-if="v$.gender.$error" class="p-error">{{ v$.gender.$errors[0].$message }}</small>
              </div>
            </div>
  
            <!-- Date of Birth field -->
            <div>
              <label for="dateOfBirth" class="form-label">Date of Birth</label>
              <div class="mt-1">
                <Calendar
                  id="dateOfBirth"
                  v-model="formData.dateOfBirth"
                  dateFormat="yy-mm-dd"
                  :showIcon="true"
                  :maxDate="maxDate"
                  placeholder="YYYY-MM-DD"
                  class="w-full"
                  :class="{ 'p-invalid': v$.dateOfBirth.$error }"
                />
                <small v-if="v$.dateOfBirth.$error" class="p-error">{{ v$.dateOfBirth.$errors[0].$message }}</small>
              </div>
            </div>
  
            <!-- Race field -->
            <div>
              <label for="race" class="form-label">Race</label>
              <div class="mt-1">
                <Dropdown
                  id="race"
                  v-model="formData.race"
                  :options="raceOptions"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Select Race"
                  class="w-full p-inputtext-sm"
                  :class="{ 'p-invalid': v$.race.$error }"
                />
                <small v-if="v$.race.$error" class="p-error">{{ v$.race.$errors[0].$message }}</small>
              </div>
            </div>
  
            <!-- Languages field -->
            <div>
              <label for="languages" class="form-label">Languages</label>
              <div class="mt-1">
                <MultiSelect
                  id="languages"
                  v-model="formData.languages"
                  :options="languageOptions"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Select Languages"
                  :maxSelectedLabels="3"
                  class="w-full p-inputtext-sm"
                  :class="{ 'p-invalid': v$.languages.$error }"
                />
                <small v-if="v$.languages.$error" class="p-error">{{ v$.languages.$errors[0].$message }}</small>
              </div>
            </div>
  
            <!-- Password field -->
            <div>
              <label for="password" class="form-label">Password</label>
              <div class="mt-1">
                <Password
                  id="password"
                  v-model="formData.password"
                  toggleMask
                  required
                  class="w-full"
                  inputClass="form-input"
                  :class="{ 'p-invalid': v$.password.$error }"
                  :feedback="true"
                />
                <small v-if="v$.password.$error" class="p-error">{{ v$.password.$errors[0].$message }}</small>
              </div>
            </div>
  
            <!-- Confirm Password field -->
            <div>
              <label for="confirmPassword" class="form-label">Confirm Password</label>
              <div class="mt-1">
                <Password
                  id="confirmPassword"
                  v-model="formData.confirmPassword"
                  toggleMask
                  required
                  class="w-full"
                  inputClass="form-input"
                  :feedback="false"
                  :class="{ 'p-invalid': v$.confirmPassword.$error }"
                />
                <small v-if="v$.confirmPassword.$error" class="p-error">{{ v$.confirmPassword.$errors[0].$message }}</small>
              </div>
            </div>
  
            <!-- Terms and Conditions -->
            <div class="flex items-center">
              <Checkbox
                id="terms"
                v-model="formData.agreeToTerms"
                :binary="true"
                :class="{ 'p-invalid': v$.agreeToTerms.$error }"
              />
              <label for="terms" class="ml-2 block text-sm text-text-primary">
                I agree to the <a href="#" class="text-primary hover:underline">Terms and Conditions</a> and <a href="#" class="text-primary hover:underline">Privacy Policy</a>
              </label>
            </div>
            <small v-if="v$.agreeToTerms.$error" class="p-error">{{ v$.agreeToTerms.$errors[0].$message }}</small>
  
            <!-- Submit button -->
            <div>
              <Button
                type="submit"
                class="w-full flex justify-center"
                label="Create Account"
                :loading="authStore.loading"
                :disabled="authStore.loading"
              />
            </div>
          </form>
  
          <!-- Social signup buttons -->
          <div class="mt-6">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-300"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-white text-text-primary">
                  Or sign up with
                </span>
              </div>
            </div>
  
            <div class="mt-6">
              <div>
                <Button
                  type="button"
                  class="w-full flex justify-center items-center bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  label="Sign up with Google"
                  icon="pi pi-google"
                  severity="secondary"
                  text
                />
              </div>
            </div>
          </div>
  
          <!-- Sign in link -->
          <div class="mt-6 text-center">
            <p class="text-sm text-text-primary">
              Already have an account?
              <router-link to="/auth/login" class="font-medium text-primary hover:text-primary-dark">
                Sign in
              </router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '../../stores/auth'
  import { useToast } from 'primevue/usetoast'
  import { useVuelidate } from '@vuelidate/core'
  import { required, email, minLength, sameAs, helpers } from '@vuelidate/validators'
  import Password from 'primevue/password'
  import Checkbox from 'primevue/checkbox'
  import MultiSelect from 'primevue/multiselect'
  import Calendar from 'primevue/calendar'
  
  const router = useRouter()
  const authStore = useAuthStore()
  const toast = useToast()
  
  // Form data
  const formData = ref({
    name: '',
    username: '',
    email: '',
    phoneNumber: '',
    gender: '',
    dateOfBirth: null,
    race: '',
    languages: [],
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  })
  
  // Options for dropdowns
  const genderOptions = [
    { label: 'Male', value: 'MALE' },
    { label: 'Female', value: 'FEMALE' },
    { label: 'Other', value: 'OTHER' }
  ]
  
  const raceOptions = [
    { label: 'Malay', value: 'MALAY' },
    { label: 'Chinese', value: 'CHINESE' },
    { label: 'Indian', value: 'INDIAN' },
    { label: 'Other', value: 'OTHER' }
  ]
  
  const languageOptions = [
    { label: 'English', value: 'ENGLISH' },
    { label: 'Malay', value: 'MALAY' },
    { label: 'Mandarin', value: 'MANDARIN' },
    { label: 'Tamil', value: 'TAMIL' },
    { label: 'Other', value: 'OTHER' }
  ]
  
  // Maximum date for date of birth (18 years ago)
  const maxDate = computed(() => {
    const date = new Date()
    date.setFullYear(date.getFullYear() - 18)
    return date
  })
  
  // Form validation rules
  const rules = {
    name: { required: helpers.withMessage('Name is required', required) },
    username: { 
      required: helpers.withMessage('Username is required', required),
      minLength: helpers.withMessage('Username must be at least 3 characters', minLength(3))
    },
    email: { 
      required: helpers.withMessage('Email is required', required),
      email: helpers.withMessage('Please enter a valid email address', email)
    },
    phoneNumber: { 
      required: helpers.withMessage('Phone number is required', required),
      minLength: helpers.withMessage('Please enter a valid phone number', minLength(8))
    },
    gender: { required: helpers.withMessage('Please select your gender', required) },
    dateOfBirth: { required: helpers.withMessage('Date of birth is required', required) },
    race: { required: helpers.withMessage('Please select your race', required) },
    languages: { required: helpers.withMessage('Please select at least one language', required) },
    password: { 
      required: helpers.withMessage('Password is required', required),
      minLength: helpers.withMessage('Password must be at least 8 characters', minLength(8))
    },
    confirmPassword: { 
      required: helpers.withMessage('Please confirm your password', required),
      sameAs: helpers.withMessage('Passwords do not match', sameAs(formData.value.password))
    },
    agreeToTerms: { 
      sameAs: helpers.withMessage('You must agree to the Terms and Conditions', sameAs(true))
    }
  }
  
  const v$ = useVuelidate(rules, formData)
  
  // Registration handler
  const handleRegister = async () => {
    // Validate form
    const isFormValid = await v$.value.$validate()
    if (!isFormValid) return
  
    try {
      // Format data for API
      const candidateData = {
        name: formData.value.name,
        username: formData.value.username,
        email: formData.value.email,
        phoneNumber: formData.value.phoneNumber,
        gender: formData.value.gender,
        dateOfBirth: formData.value.dateOfBirth ? formData.value.dateOfBirth.toISOString().split('T')[0] : null,
        race: formData.value.race,
        languages: formData.value.languages,
        password: formData.value.password
      }
  
      await authStore.registerCandidate(candidateData)
      
      // Success message
      toast.add({
        severity: 'success',
        summary: 'Registration Successful',
        detail: 'Your account has been created. You can now log in.',
        life: 5000
      })
      
      // Redirect to login
      router.push('/auth/login')
    } catch (error) {
      toast.add({
        severity: 'error',
        summary: 'Registration Failed',
        detail: error,
        life: 5000
      })
    }
  }
  </script>