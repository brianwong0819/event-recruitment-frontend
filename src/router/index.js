import { createRouter, createWebHistory } from 'vue-router';

// Import AuthService with a more isolated approach
const AuthService = {
  isAuthenticated() {
    return !!localStorage.getItem('accessToken');
  },
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch (e) {
      console.error('Error parsing user from localStorage', e);
      return null;
    }
  },
  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
  },
};

// Import views
const Home = () => import('../views/Home.vue');
const Login = () => import('../views/auth/Login.vue');
const RecruiterLogin = () => import('../views/auth/RecruiterLogin.vue');
const Register = () => import('../views/auth/Register.vue');
const CandidateRegister = () => import('../views/auth/CandidateRegister.vue');
const RecruiterRegister = () => import('../views/auth/RecruiterRegister.vue');
const RegistrationSuccess = () =>
  import('../views/auth/RegistrationSuccess.vue');
const NotFound = () => import('../views/NotFound.vue');

// Candidate views
const CandidateLayout = () => import('../layouts/CandidateLayout.vue');
const CandidateDashboard = () => import('../views/candidate/Dashboard.vue');
const CandidateProfile = () => import('../views/candidate/Profile.vue');
const CandidateAvailability = () =>
  import('../views/candidate/Availability.vue');

// Recruiter views
const RecruiterLayout = () => import('../layouts/RecruiterLayout.vue');
const RecruiterDashboard = () => import('../views/recruiter/Dashboard.vue');
const RecruiterProfile = () => import('../views/recruiter/Profile.vue');
const ManageJobs = () => import('../views/recruiter/ManageJobs.vue');
const CreateJob = () => import('../views/recruiter/CreateJob.vue');
const ProjectDetails = () => import('../views/recruiter/ProjectDetails.vue');

// Route configuration
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      requiresGuest: true,
    },
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: {
      requiresGuest: true,
    },
  },
  {
    path: '/register/candidate',
    name: 'CandidateRegister',
    component: CandidateRegister,
    meta: {
      requiresGuest: true,
    },
  },
  {
    path: '/register/recruiter',
    name: 'RecruiterRegister',
    component: RecruiterRegister,
    meta: {
      requiresGuest: true,
    },
  },
  {
    path: '/registration-success',
    name: 'RegistrationSuccess',
    component: RegistrationSuccess,
    meta: {
      requiresGuest: true,
    },
  },
  {
    path: '/recruiter-login',
    name: 'RecruiterLogin',
    component: RecruiterLogin,
    meta: {
      requiresGuest: true,
    },
  },
  // Candidate routes
  {
    path: '/candidate',
    component: CandidateLayout,
    meta: {
      requiresAuth: true,
      role: ['CANDIDATE'],
    },
    children: [
      {
        path: 'dashboard',
        name: 'CandidateDashboard',
        component: CandidateDashboard,
      },
      {
        path: 'profile',
        name: 'CandidateProfile',
        component: CandidateProfile,
      },
      {
        path: 'availability',
        name: 'CandidateAvailability',
        component: CandidateAvailability,
      },
    ],
  },
  // Recruiter routes
  {
    path: '/recruiter',
    component: RecruiterLayout,
    meta: {
      requiresAuth: true,
      role: ['RECRUITER'],
    },
    children: [
      {
        path: 'dashboard',
        name: 'RecruiterDashboard',
        component: RecruiterDashboard,
      },
      {
        path: 'profile',
        name: 'RecruiterProfile',
        component: RecruiterProfile,
      },
      {
        path: 'jobs',
        name: 'ManageJobs',
        component: ManageJobs,
      },
      {
        path: 'jobs/create',
        name: 'CreateJob',
        component: CreateJob,
      },
      {
        path: 'projects/:projectId',
        name: 'ProjectDetails',
        component: ProjectDetails,
        props: true,
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
  },
];

// Create router instance
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    // Always scroll to top
    return { top: 0 };
  },
});

// Navigation guard
router.beforeEach((to, from, next) => {
  console.log('Router guard - navigating to:', to.path);
  const isAuthenticated = AuthService.isAuthenticated();
  console.log('Router guard - is authenticated:', isAuthenticated);

  if (isAuthenticated) {
    const currentUser = AuthService.getCurrentUser();
    console.log('Router guard - current user:', currentUser);
  }

  // Routes that require a guest (non-authenticated user)
  if (to.matched.some((record) => record.meta.requiresGuest)) {
    if (isAuthenticated) {
      // If user is already authenticated, redirect to appropriate dashboard
      const currentUser = AuthService.getCurrentUser();
      if (currentUser?.role === 'CANDIDATE') {
        console.log(
          'Router guard - redirecting authenticated candidate to dashboard'
        );
        next('/candidate/dashboard');
      } else if (currentUser?.role === 'RECRUITER') {
        console.log(
          'Router guard - redirecting authenticated recruiter to dashboard'
        );
        next('/recruiter/dashboard');
      } else {
        console.log(
          'Router guard - redirecting authenticated user without role to home'
        );
        next('/');
      }
    } else {
      next(); // Allow access to login/register for guests
    }
  }
  // Routes that require authentication
  else if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      // If not authenticated, redirect to login
      console.log('Router guard - redirecting unauthenticated user to login');
      next({
        path: '/login',
        query: { redirect: to.fullPath },
      });
    } else {
      // Check for role requirements
      const currentUser = AuthService.getCurrentUser();

      // Handle case where role may not be available yet
      if (!currentUser || !currentUser.role) {
        console.log('Router guard - no user or role available, logging out');
        AuthService.logout();
        next('/login');
        return;
      }

      if (to.matched.some((record) => record.meta.role)) {
        // If the route has a role requirement, check if user has that role
        const routeRoles = to.matched.find((record) => record.meta.role).meta
          .role;
        console.log(
          'Router guard - required roles:',
          routeRoles,
          'current role:',
          currentUser.role
        );
        if (!routeRoles.includes(currentUser.role)) {
          // Redirect to appropriate dashboard if user doesn't have required role
          console.log('Router guard - user does not have required role');
          if (currentUser.role === 'CANDIDATE') {
            next('/candidate/dashboard');
          } else if (currentUser.role === 'RECRUITER') {
            next('/recruiter/dashboard');
          } else {
            next('/');
          }
        } else {
          console.log('Router guard - user has required role, allowing access');
          next(); // Allow access if user has required role
        }
      } else {
        next(); // Allow access to routes without role requirements
      }
    }
  } else {
    next(); // Allow access to public routes
  }
});

export default router;
