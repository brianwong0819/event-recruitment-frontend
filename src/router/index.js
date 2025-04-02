import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import Home from '../views/Home.vue'

// Layouts
import MainLayout from '../layouts/MainLayout.vue'
import AuthLayout from '../layouts/AuthLayout.vue'

// Auth views
import Login from '../views/auth/Login.vue'
import CandidateRegister from '../views/auth/CandidateRegister.vue'
import RecruiterRegister from '../views/auth/RecruiterRegister.vue'

// Create router instance
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: MainLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: Home
        },
        // Commenting out About page until we create it
        /* 
        {
          path: 'about',
          name: 'about',
          component: () => import('../views/About.vue')
        } 
        */
      ]
    },
    {
      path: '/auth',
      component: AuthLayout,
      children: [
        {
          path: 'login',
          name: 'login',
          component: Login,
          meta: { requiresGuest: true }
        },
        {
          path: 'register/candidate',
          name: 'candidateRegister',
          component: CandidateRegister,
          meta: { requiresGuest: true }
        },
        {
          path: 'register/recruiter',
          name: 'recruiterRegister',
          component: RecruiterRegister,
          meta: { requiresGuest: true }
        }
      ]
    },
    // Commenting out candidate routes until we implement them
    /*
    {
      path: '/candidate',
      component: MainLayout,
      meta: { requiresAuth: true, role: 'CANDIDATE' },
      children: [
        {
          path: 'dashboard',
          name: 'candidateDashboard',
          component: () => import('../views/candidate/Dashboard.vue')
        },
        {
          path: 'profile',
          name: 'candidateProfile',
          component: () => import('../views/candidate/Profile.vue')
        },
        {
          path: 'job-listings',
          name: 'candidateJobs',
          component: () => import('../views/candidate/JobListings.vue')
        }
      ]
    },
    */
    // Commenting out recruiter routes until we implement them
    /*
    {
      path: '/recruiter',
      component: MainLayout,
      meta: { requiresAuth: true, role: 'RECRUITER' },
      children: [
        {
          path: 'dashboard',
          name: 'recruiterDashboard',
          component: () => import('../views/recruiter/Dashboard.vue')
        },
        {
          path: 'profile',
          name: 'recruiterProfile',
          component: () => import('../views/recruiter/Profile.vue')
        },
        {
          path: 'portfolio',
          name: 'recruiterPortfolio',
          component: () => import('../views/recruiter/Portfolio.vue')
        }
      ]
    },
    */
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      component: () => import('../views/NotFound.vue')
    }
  ]
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest)
  const requiredRole = to.matched.some(record => record.meta.role) 
    ? to.matched.find(record => record.meta.role).meta.role 
    : null

  // Check if route requires authentication
  if (requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login' })
  } 
  // Check if route requires guest access (non-authenticated)
  else if (requiresGuest && authStore.isAuthenticated) {
    // For now, just redirect to home since we haven't created dashboards yet
    next({ name: 'home' })
    
    // Commented out until we implement dashboards
    /*
    // Redirect to appropriate dashboard based on user role
    next(authStore.isCandidate ? { name: 'candidateDashboard' } : { name: 'recruiterDashboard' })
    */
  } 
  // Check if route requires a specific role
  else if (requiresAuth && requiredRole && authStore.userRole !== requiredRole) {
    // For now, just redirect to home since we haven't created dashboards yet
    next({ name: 'home' })
    
    // Commented out until we implement dashboards
    /*
    // Redirect to appropriate dashboard based on user role
    next(authStore.isCandidate ? { name: 'candidateDashboard' } : { name: 'recruiterDashboard' })
    */
  } 
  else {
    next()
  }
})

export default router