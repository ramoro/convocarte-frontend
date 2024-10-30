<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="d-flex justify-space-between align-center">
        <h1 class="forms-title">Mis Formularios</h1>
        <div class="d-flex">
          <v-btn             
          class="mr-3"
          rounded
          @click="reelDialog = true" to="/form-builder">            
            <img 
              :src="require('@/assets/form-icon.png')"
              alt="Create Form Icon" 
              class="button-image mr-2"
              height="25"
            />Agregar Formulario
          </v-btn>
        </div>
      </v-col>
    </v-row>
    <v-row>

    </v-row>
    <InformationSnackbar ref="InformationSnackbar"/>

  </v-container>
</template>

<script>
import InformationSnackbar from '@/components/InformationSnackbar.vue';

export default {
  components: {
      InformationSnackbar,
    },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    }
  },
  beforeMount() {
      if (!this.currentUser) {
        this.$router.push('/');
      }
  },
  mounted() {
    this.$root.InformationSnackbar = this.$refs.InformationSnackbar;
    // Verifica si se pasa un mensaje a través del estado de la ruta
    if (this.$route.query.title) {
      this.$root.InformationSnackbar.show({message: 'El formulario ' + this.$route.query.title + ' se acaba de crear', color: 'green', buttonColor:'white'});
    }
  },
};
</script>

<style scoped>
.forms-title {
  font-size: 28px;
  font-weight: bold;
}
</style>