import { createRouter, createWebHistory } from 'vue-router'
import LoginRegistrationView from '../views/Login-Registration/LoginRegistrationView.vue'
import VerifiedAccountView from '../views/Login-Registration/VerifiedAccountView.vue'
import ForgotPasswordView from '../views/Login-Registration/ForgotPasswordView.vue'
import ResetPasswordView from '../views/Login-Registration/ResetPasswordView.vue'

const routes = [
  {
    path: '/',
    name: 'loginregistration',
    component: LoginRegistrationView,
    meta: {
      hideNavbar: true,
    }
  },
  {
    path: '/verified-account/:user_id/:token',
    name: 'verifiedaccount',
    component: VerifiedAccountView,
    meta: {
      hideNavbar: true,
    }
  },
  {
    path: '/forgot-password',
    name: 'forgotpassword',
    component: ForgotPasswordView,
    meta: {
      hideNavbar: true,
    }
  },
  {
    path: '/reset-password/:token',
    name: 'resetpassword',
    component: ResetPasswordView,
    meta: {
      hideNavbar: true,
    }
  },
  {
    path: '/user-profile',
    name: 'userprofile',
    component: () => import('../views/UserProfileView.vue')
  },
  {
    path: '/user-gallery',
    name: 'usergallery',
    component: () => import('../views/UserGalleryView.vue')
  },
  {
    path: '/user-forms',
    name: 'userforms',
    component: () => import('../views/Forms/UserFormsView.vue')
  },
  {
    path: '/form-builder/new',
    name: 'createForm',
    component: () => import('../views/Forms/FormTemplateBuilderView.vue')
  },
  {
    path: '/form-builder/:id',
    name: 'editForm',
    component: () => import('../views/Forms/FormTemplateBuilderView.vue'),
  },
  {
    path: '/user-projects',
    name: 'userprojects',
    component: () => import('../views/Projects/UserProjectsView.vue')
  },
  {
    path: '/project-creation',
    name: 'projectcreation',
    component: () => import('../views/Projects/ProjectCreationView.vue')
  },
  {
    path: '/user-casting-calls',
    name: 'usercastingcalls',
    component: () => import('../views/Casting Calls/UserCastingCallsView.vue')
  },
  {
    path: '/casting-call-creation',
    name: 'castingcallcreation',
    component: () => import('../views/Casting Calls/CastingCallCreationView.vue')
  },

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
