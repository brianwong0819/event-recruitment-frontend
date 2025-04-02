<template>
    <div>
      <div class="text-center">
        <h2 class="mt-6 text-3xl font-bold text-text-heading">
          Create a Recruiter Account
        </h2>
        <p class="mt-2 text-sm text-text-primary">
          Join our platform to find talented staff for your events
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
  
            <!-- Account Type -->
            <div>
              <label class="form-label">Account Type</label>
              <div class="flex space-x-4 mt-2">
                <div class="flex items-center">
                  <RadioButton
                    id="individual"
                    v-model="formData.recruiterType"
                    value="INDIVIDUAL"
                    :class="{ 'p-invalid': v$.recruiterType.$error }"
                  />
                  <label for="individual" class="ml-2 text-sm text-text-primary">Individual Recruiter</label>
                </div>
                <div class="flex items-center">
                  <RadioButton
                    id="company"
                    v-model="formData.recruiterType"
                    value="COMPANY"
                    :class="{ 'p-invalid': v$.recruiterType.$error }"
                  />
                  <label for="company" class="ml-2 text-sm text-text-primary">Company</label>
                </div>
              </div>
              <small v-if="v$.recruiterType.$error" class="p-error">{{ v$.recruiterType.$errors[0].$message }}</small>
            </div>
  
            <!-- Representative Name field -->
            <div>
              <label for="recruiterRepName" class="form-label">Representative Name</label>
              <div class="mt-1">
                <InputText
                  id="recruiterRepName"
                  v-model="formData.recruiterRepName"
                  type="text"
                  required
                  class="form-input"
                  :class="{ 'p-invalid': v$.recruiterRepName.$error }"
                />
                <small v-if="v$.recruiterRepName.$error" class="p-error">{{ v$.recruiterRepName.$errors[0].$message }}</small>
              </div>
            </div>
  
            <!-- Company details if company is selected -->
            <div v-if="formData.recruiterType === 'COMPANY'">
              <div>
                <label for="companyName" class="form-label">Company Name</label>
                <div class="mt-1">
                  <InputText
                    id="companyName"
                    v-model="formData.companyName"
                    type="text"
                    class="form-input"
                    :class="{ 'p-invalid': v$.companyName.$error }"
                  />
                  <small v-if="v$.companyName.$error" class="p-error">{{ v$.companyName.$errors[0].$message }}</small>
                </div>
              </div>
  
              <div class="mt-4">
                <label for="companyLocation" class="form-label">Company Location</label>
                <div class="mt-1">
                  <InputText
                    id="companyLocation"
                    v-model="formData.companyLocation"
                    type="text"
                    class="form-input"
                    :class="{ 'p-invalid': v$.companyLocation.$error }"
                  />
                  <small v-if="v$.companyLocation.$error" class="p-error">{{ v$.companyLocation.$errors[0].$message }}</small>
                </div>
              </div>
  
              <div class="mt-4">
                <label for="companyWebsite" class="form-label">Company Website</label>
                <div class="mt-1">
                  <InputText
                    id="companyWebsite"
                    v-model="formData.companyWebsite"
                    type="url"
                    class="form-input"
                    :class="{ 'p-invalid': v$.companyWebsite.$error }"
                  />
                  <small v-if="v$.companyWebsite.$error" class="p-error">{{ v$.companyWebsite.$errors[0].$message }}</small>
                </div>
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
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '../../stores/auth'
  import { useToast } from 'primevue/usetoast'
  import { useVuelidate } from '@vuelidate/core'
  import { required, email, minLength, sameAs, helpers, url } from '@vuelidate/validators'
  import Password from 'primevue/password'
  import Checkbox from 'primevue/checkbox'
  import RadioButton from 'primevue/radiobutton'
  
  const router = useRouter()
  const authStore = useAuthStore()
  const toast = useToast()
  
  // Form data
  const formData = ref({
    recruiterType: 'INDIVIDUAL',
    recruiterRepName: '',
    username: '',
    email: '',
    phoneNumber: '',
    companyName: '',
    companyLocation: '',
    companyWebsite: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  })
  
  // Conditional validation based on recruiter type
  const companyValidation = (value) => {
    return formData.value.recruiterType !== 'COMPANY' || !!value
  }
  
  // Form validation rules
  const rules = {
    recruiterType: { required: helpers.withMessage('Account type is required', required) },
    recruiterRepName: { required: helpers.withMessage('Representative name is required', required) },
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
    companyName: { 
      required: helpers.withMessage('Company name is required', companyValidation)
    },
    companyLocation: { 
      required: helpers.withMessage('Company location is required', companyValidation)
    },
    companyWebsite: { 
      url: helpers.withMessage('Please enter a valid URL', url),
      required: helpers.withMessage('Company website is required', companyValidation)
    },
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
      const recruiterData = {
        recruiterType: formData.value.recruiterType,
        recruiterRepName: formData.value.recruiterRepName,
        username: formData.value.username,
        email: formData.value.email,
        phoneNumber: formData.value.phoneNumber,
        password: formData.value.password
      }
  
      // Add company details if company type is selected
      if (formData.value.recruiterType === 'COMPANY') {
        recruiterData.companyName = formData.value.companyName
        recruiterData.companyLocation = formData.value.companyLocation
        recruiterData.companyWebsite = formData.value.companyWebsite
      }
  
      await authStore.registerRecruiter(recruiterData)
      
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