<template>
  <v-app>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    //
  }),
}
</script>

<style>
.v-application--wrap {
  background-color: inherit; /* Asegura que el fondo se aplique correctamente */
}
</style>
