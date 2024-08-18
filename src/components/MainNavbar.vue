<template>
    <nav>
      <!-- Navigation Drawer que se superpone -->
      <v-navigation-drawer v-model="drawer" color="white" dark temporary>
        <v-row>
                <v-col class="mt-5 text-center" >
                    <v-avatar size="100">
                        <img src="/avatar-1.png" alt="" />
                    </v-avatar>
                    <p class="white--text text-subtitle-1 mt-1">
                        The Net Ninja
                    </p>
                </v-col>
            </v-row>
            <v-list>
                <v-list-item
                        v-for="link in links"
                        :key="link.text"
                        :value="item"
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
      </v-app-bar>
  
    </nav>
  </template>
  
  <script>
  export default {
    data() {
        return {
            drawer: false, //El drawer va a servir para manejar visibilidad del navigation drawer
            links: [
                { icon: 'mdi-account', text: 'Mi Perfil', route: '/' },
                { icon: 'mdi-folder', text: 'My Projects', route: '/projects' },
                { icon: 'mdi-account', text: 'Team', route: '/team' },
                { icon: 'mdi-test-tube', text: 'Test', route: '/test' },
            ],
            snackbar: false
        }
    },
  };
  </script>