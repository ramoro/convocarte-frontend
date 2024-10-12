<template>
  <v-container class="d-flex align-center justify-center" style="text-align: center; height: 100vh;">
    <v-card v-if="verificationApproved" class="pa-5" max-width="600" outlined border="info md">
      <v-card-title class="headline">¡Felicitaciones {{ userFullName }}!</v-card-title>
      <v-card-text>
        <p>Tu cuenta ya está activada.</p> <br>
        <p>Para ingresar al sistema clickeá en el siguiente link: </p>
        <p><a href="http://localhost:8080/">Ingresar</a></p>
      </v-card-text>
    </v-card>
    <v-card v-else-if="verificationRejected" class="pa-5" max-width="600" outlined border="info md">
      <v-card-title class="headline">Link Caducado <v-icon color="red">mdi-close-octagon</v-icon></v-card-title>
      <v-card-text>
        <p>El link ha dejado de funcionar o el servidor está caido.</p> <br>
        <p>Para ir a la aplicación y volver a registrarte clickeá en el siguiente link: </p>
        <p><a href="http://localhost:8080/">ConvocArte</a></p>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import UserService from '../services/user.service';

export default {
  name: 'VerifiedAccountView',
  data () {
    return {
      userFullName: '',
      verificationApproved: false,
      verificationRejected: false, //Necesario xq sino renderiza primero el else por un segundo
    }
  },
  computed: {
    userId() {
      return this.$route.params.user_id;
    }
  },
  async beforeMount() {
    UserService.getUserByIdWithToken(this.$route.params.user_id, this.$route.params.token)
    .then(response => {
      console.log('Request succesfully compelted:', response.data);
      this.userFullName = response.data.fullname;
      this.verificationApproved = true;
    })
    .catch(error => {
      console.log('Request error', error);
      this.verificationRejected = true;
    });
  }
}
</script>