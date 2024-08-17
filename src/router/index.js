import { createRouter, createWebHistory } from 'vue-router'
import LoginRegistrationView from '../views/LoginRegistrationView.vue'
import VerifiedAccountView from '../views/VerifiedAccountView.vue'
import ForgotPasswordView from '../views/ForgotPasswordView.vue'
import ResetPasswordView from '../views/ResetPasswordView.vue'

const routes = [
  {
    path: '/',
    name: 'loginregistration',
    component: LoginRegistrationView
  },
  {
    path: '/verified-account/:user_id/:token',
    name: 'verifiedaccount',
    component: VerifiedAccountView
  },
  {
    path: '/forgot-password',
    name: 'forgotpassword',
    component: ForgotPasswordView
  },
  {
    path: '/reset-password/:token',
    name: 'resetpassword',
    component: ResetPasswordView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
