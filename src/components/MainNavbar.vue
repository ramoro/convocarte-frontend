<template>
    <nav>
      <!-- Navigation Drawer que se superpone -->
      <v-navigation-drawer v-model="drawer" color="white" dark temporary>
        <v-row>
            <v-col class="mt-5 ml-3 d-flex align-center">
                <v-avatar size="43">
                <img :src="require('@/assets/logo.png')" alt="" />
                </v-avatar>
                <p v-if="currentUser" class="white--text text-subtitle-1 ml-3">
                    {{ currentUser.fullname }}
                </p>
            </v-col>
        </v-row>
        <v-divider
              class="mt-8 mb-4 mx-auto"
              inset
              color="cyan-darken-4"
              thickness="8px"
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
            <span class="font-weight-light">Convoc</span>
            <span>Arte</span>
        </v-toolbar-title>
            <a class="nav-link" href @click.prevent="logOut">
                <font-awesome-icon icon="sign-out-alt" />LogOut
            </a>
      </v-app-bar>
  
    </nav>
  </template>
  
  <script>
  export default {
    name: "MainNavbar",
    data() {
        return {
            drawer: false, //El drawer va a servir para manejar visibilidad del navigation drawer
            links: [
                { icon: 'mdi-account', text: 'Mi Perfil', route: '/user-profile' },
                { icon: 'mdi-folder', text: 'My Projects', route: '/projects' },
                { icon: 'mdi-account', text: 'Team', route: '/team' },
                { icon: 'mdi-test-tube', text: 'Test', route: '/test' },
            ],
            snackbar: false
        }
    },
    computed: {
        currentUser() {
            return this.$store.state.auth.user;
        }
    },
    methods: {
        logOut() {
            this.$store.dispatch('auth/logout');
            this.$router.push('/');
        }
    }
  };
  </script>
