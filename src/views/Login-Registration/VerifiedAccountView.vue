<template>
  <v-container class="d-flex align-center justify-center" style="text-align: center; height: 100vh;">
     <v-progress-circular
      v-if="loading"
      indeterminate
      color="primary"
      size="64"
    ></v-progress-circular>
    <v-card v-else-if="verificationApproved" class="pa-5" max-width="600" outlined border="info md">
      <v-card-title class="headline">¡Felicitaciones {{ userFullName }}!</v-card-title>
      <v-card-text>
        <p>Tu cuenta ya está activada.</p> <br>
        <p>Para ingresar al sistema clickeá en el siguiente link: </p>
        <p><a :href="vueAppUrl">Ingresar</a></p>
      </v-card-text>
    </v-card>
    <v-card v-else-if="verificationRejected" class="pa-5" max-width="600" outlined border="info md">
      <v-card-title class="headline">Link Caducado <v-icon color="red">mdi-close-octagon</v-icon></v-card-title>
      <v-card-text>
        <p>El link ha dejado de funcionar o el servidor está caido.</p> <br>
        <p>Para ir a la aplicación y volver a registrarte clickeá en el siguiente link: </p>
        <p><a :href="vueAppUrl">ConvocArte</a></p>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import UserService from '../../services/user.service';

export default {
  name: 'VerifiedAccountView',
  data () {
    return {
      userFullName: '',
      verificationApproved: false,
      verificationRejected: false, //Necesario xq sino renderiza primero el else por un segundo
      vueAppUrl: process.env.VUE_APP_FRONTEND_API_URL, // Agrega aquí la variable de entorno
      loading: true
    }
  },
  computed: {
    userId() {
      return this.$route.params.user_id;
    }
  },
  async mounted() {  // Cambiado a mounted
    try {
      const response = await UserService.getUserByIdWithToken(
        this.$route.params.user_id, 
        this.$route.params.token
      );
      this.userFullName = response.data.fullname;
      this.verificationApproved = true;
    } catch (error) {
      console.error('Request error', error);
      this.verificationRejected = true;
    } finally {
      this.loading = false;
    }
  }
}
</script>