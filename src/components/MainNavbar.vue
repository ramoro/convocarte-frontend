<template>
    <nav>
      <!-- Navigation Drawer que se superpone -->
      <v-navigation-drawer v-model="drawer" color="white" dark temporary>
        <v-row>
            <v-col class="mt-5 ml-3 d-flex align-center">
                <v-avatar size="43" class="elevation-3">
                    <v-img :src="currentUser?.profile_picture || require('@/assets/empty-photo.png')" alt="" />
                </v-avatar>
                <RouterLink :to="'/user-profile/' + currentUser.id" 
                style="text-decoration: none; color: black">
                    <p v-if="currentUser" class="text-subtitle-1 ml-3">
                        {{ currentUser.fullname }}
                    </p>
                </RouterLink>
            </v-col>
        </v-row>

        <v-divider
              color="purple"
              class="mt-8 mb-4 mx-auto border-opacity-50"
              inset
              style="width: 100%;"
        ></v-divider>       
     
        <v-list>
            <v-list-item
                    class="ml-1"
                    v-for="link in links"
                    :key="link.text"
                    color="primary"
                    rounded="shaped"
                    router
                    :to="link.route"
                >
                <template v-slot:prepend>
                <v-icon :icon="link.icon"></v-icon>
                </template>

                <v-list-item-title v-text="link.text"></v-list-item-title>
            </v-list-item>
        </v-list>
      </v-navigation-drawer>
  
      <!-- App Bar fija -->
      <v-app-bar app color="cyan">

        <v-app-bar-nav-icon color="white" @click="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title class="text-uppercase text-white">
        <router-link to="/casting-call-search" class="text-white" style="text-decoration: none;">
            <span class="font-weight-light">Convoc</span>
            <span>Arte</span>
        </router-link>
    </v-toolbar-title>

        <v-btn class="ml-3 mr-2 font-weight-light" color="white" text @click="logOut()">
            <span>Salir</span>
            <v-icon right>mdi-exit-to-app</v-icon>
        </v-btn>
      </v-app-bar>
  
    </nav>
  </template>
  
  <script>
import { RouterLink } from 'vue-router';

  export default {
    components: RouterLink,
    name: "MainNavbar",
    data() {
        return {
            drawer: false, //El drawer va a servir para manejar visibilidad del navigation drawer
            links: [
                { icon: 'mdi-home', text: 'Inicio', route: '/casting-call-search' },
                { icon: 'mdi-account', text: 'Mi Perfil', route: '/user-profile/' + this.$store.state.auth.user?.id },
                { icon: 'mdi-folder', text: 'Mis Proyectos', route: '/user-projects' },
                { icon: 'mdi-form-select', text: 'Mis Formularios', route: '/user-forms' },
                { icon: 'mdi-bell-ring', text: 'Mis Castings', route: '/user-casting-calls' },
                { icon: 'mdi-card-account-details-outline', text: 'Mis Postulaciones', route: '/user-postulations' },
            ],
            avatarImage: ""
        }
    },
    computed: {
        currentUser() {
            return this.$store.state.auth.user || {};
        }
    },
    methods: {
        logOut() {
            this.$store.dispatch('auth/logout');
            this.$router.push('/');
        }
    },
  };
  </script>
