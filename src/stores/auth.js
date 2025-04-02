import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import authService from '../services/auth.service'
import router from '../router'

export const useAuthStore = defineStore('auth', () => {
  // State
  const token = ref(localStorage.getItem('token') || '')
  const refreshToken = ref(localStorage.getItem('refreshToken') || '')
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const isAuthenticated = computed(() => !!token.value)
  const isCandidate = computed(() => user.value?.userType === 'CANDIDATE')
  const isRecruiter = computed(() => user.value?.userType === 'RECRUITER')
  const userRole = computed(() => user.value?.userType || '')
  const username = computed(() => user.value?.username || '')
  const userId = computed(() => user.value?.userId || null)

  // Actions
  async function login(credentials) {
    loading.value = true
    error.value = null
    try {
      const response = await authService.login(credentials)
      
      // Store tokens and user info
      setAuthData(response.data.data)
      
      // Redirect based on user type
      if (isCandidate.value) {
        router.push('/candidate/dashboard')
      } else if (isRecruiter.value) {
        router.push('/recruiter/dashboard')
      } else {
        router.push('/')
      }
      
      return response
    } catch (err) {
      error.value = err.response?.data?.message || 'Login failed'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  async function registerCandidate(candidateData) {
    loading.value = true
    error.value = null
    try {
      const response = await authService.registerCandidate(candidateData)
      return response
    } catch (err) {
      error.value = err.response?.data?.message || 'Registration failed'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  async function registerRecruiter(recruiterData) {
    loading.value = true
    error.value = null
    try {
      const response = await authService.registerRecruiter(recruiterData)
      return response
    } catch (err) {
      error.value = err.response?.data?.message || 'Registration failed'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  function logout() {
    // Clear auth data
    clearAuthData()
    
    // Redirect to home
    router.push('/')
  }

  async function refreshUserToken() {
    if (!refreshToken.value) {
      clearAuthData()
      router.push('/login')
      return
    }

    try {
      const response = await authService.refreshToken({ refreshToken: refreshToken.value })
      setTokens(response.data.token, response.data.refreshToken)
      return response
    } catch (err) {
      clearAuthData()
      router.push('/login')
      throw err
    }
  }

  function setAuthData(authData) {
    token.value = authData.token
    refreshToken.value = authData.refreshToken
    user.value = {
      userId: authData.userId,
      username: authData.username,
      userType: authData.userType
    }
    
    // Persist to localStorage
    localStorage.setItem('token', token.value)
    localStorage.setItem('refreshToken', refreshToken.value)
    localStorage.setItem('user', JSON.stringify(user.value))
  }

  function setTokens(newToken, newRefreshToken) {
    token.value = newToken
    refreshToken.value = newRefreshToken
    
    // Update localStorage
    localStorage.setItem('token', newToken)
    localStorage.setItem('refreshToken', newRefreshToken)
  }

  function clearAuthData() {
    token.value = ''
    refreshToken.value = ''
    user.value = null
    
    // Clear localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
  }

  return { 
    // State
    token,
    user,
    loading,
    error,
    
    // Getters
    isAuthenticated,
    isCandidate,
    isRecruiter,
    userRole,
    username,
    userId,
    
    // Actions
    login,
    registerCandidate,
    registerRecruiter,
    logout,
    refreshUserToken,
    setAuthData,
    clearAuthData
  }
})