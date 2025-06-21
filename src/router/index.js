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
    path: '/user-profile/:userId',
    name: 'userprofile',
    component: () => import('../views/UserProfileView.vue')
  },
  {
    path: '/user-gallery/:userId',
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
    name: 'createformtemplate',
    component: () => import('../views/Forms/FormTemplateBuilderView.vue')
  },
  {
    path: '/form-builder/:id',
    name: 'editformtemplate',
    component: () => import('../views/Forms/FormTemplateBuilderView.vue'),
  },
  {
    //Aca el id seria ya de un form y no de un form template. Cuando esta ya asignado a un casting es un form
    path: '/form-builder/:id/:castingid', 
    name: 'editcastingform',
    component: () => import('../views/Forms/FormTemplateBuilderView.vue'),
  },
  {
    path: '/user-projects',
    name: 'userprojects',
    component: () => import('../views/Projects/UserProjectsView.vue')
  },
  {
    path: '/project/new',
    name: 'projectcreation',
    component: () => import('../views/Projects/ProjectCreationView.vue')
  },
  {
    path: '/project/:id',
    name: 'projectedition',
    component: () => import('../views/Projects/ProjectCreationView.vue')
  },
  {
    path: '/my-project/:projectId',
    name: 'myprojectview',
    component: () => import('../views/Projects/MyProjectView.vue')
  },
  {
    path: '/user-casting-calls',
    name: 'usercastingcalls',
    component: () => import('../views/Casting Calls/UserCastingCallsView.vue')
  },
  {
    path: '/casting-call',
    name: 'castingcallcreation',
    component: () => import('../views/Casting Calls/CastingCallCreationView.vue')
  },
  {
    path: '/casting-call/:id',
    name: 'castingcalledition',
    component: () => import('../views/Casting Calls/CastingCallCreationView.vue')
  },
  {
    path: '/casting-call-search',
    name: 'castingcallsearch',
    component: () => import('../views/Casting Calls/CastingCallSearchView.vue')
  },
  {
    path: '/published-casting-call/:id',
    name: 'publishedcastingcall',
    component: () => import('../views/Casting Calls/PublishedCastingCallView.vue')
  },
  {
    path: '/role-postulation-form/:roleName/:formId',
    name: 'rolepostulationform',
    component: () => import('../views/Casting Postulations/PostulationFormView.vue'),
    
  },
  {
    path: '/casting-postulation-created/:postulationId',
    name: 'postulationcreated',
    component: () => import('../views/Casting Postulations/PostulationCreatedMessageView.vue')
  },
  {
    path: '/user-postulations',
    name: 'usercastingpostulations',
    component: () => import('../views/Casting Postulations/UserPostulationsView.vue')
  },
  {
    path: '/my-postulation/:postulationId',
    name: 'mycastingpostulation',
    component: () => import('../views/Casting Postulations/MyPostulationView.vue')
  },
  {
    path: '/casting-call-postulations/:castingCallId',
    name: 'castingcallpostulations',
    component: () => import('../views/Casting Postulations/CastingCallPostulationsView.vue')
  },
  {
    path: '/casting-call-user-postulation/:postulationId',
    name: 'castingcalluserpostulation',
    component: () => import('../views/Casting Postulations/CastingCallUserPostulationView.vue')
    
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
