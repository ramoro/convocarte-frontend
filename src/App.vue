<template>
  <v-app>
    <MainNavbar v-if="!$route.meta.hideNavbar"/>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import MainNavbar from '@/components/MainNavbar'

export default {
  name: 'App',
  components: {MainNavbar},
  data: () => ({
    //
  }),
};
</script>

<style>
.v-application--wrap {
  background-color: inherit; /* Asegura que el fondo se aplique correctamente */
}
</style>
