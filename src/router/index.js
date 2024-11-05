import { createRouter, createWebHistory } from 'vue-router'
import LoginRegistrationView from '../views/LoginRegistrationView.vue'
import VerifiedAccountView from '../views/VerifiedAccountView.vue'
import ForgotPasswordView from '../views/ForgotPasswordView.vue'
import ResetPasswordView from '../views/ResetPasswordView.vue'

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
  }
  ,
  {
    path: '/user-forms',
    name: 'userforms',
    component: () => import('../views/UserFormsView.vue')
  }
  ,
  {
    path: '/form-builder/new',
    name: 'createForm',
    component: () => import('../views/FormTemplateBuilderView.vue')
  },
  {
    path: '/form-builder/:id',
    name: 'editForm',
    component: () => import('../views/FormTemplateBuilderView.vue'),
  }

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
