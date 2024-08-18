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
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
