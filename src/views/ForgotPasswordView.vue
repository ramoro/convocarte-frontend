<template>
  <v-container class="d-flex align-center justify-center" style="text-align: center; height: 100vh;">
    <v-window v-model="step">
      <v-window-item :value="1" class="my-window-item">
        <v-card class="pa-5" max-width="600" outlined border="info md !important">
          <v-sheet class="mx-auto" width="300" >
            <p class="caption text-center mb-6 body-1 grey--text text--darken-2 mb-4" style="opacity: 0.7;" >¿Olvidaste tu contraseña? Ingresá tu email para poder recuperarla.</p>
              <v-form @submit.prevent="handleSubmit">
              <v-text-field
                  v-model="email"
                  :rules="rules"
                  label="Email"
                  variant="outlined" 
                  dense 
                  color="blue"
              ></v-text-field>
              <v-btn color="cyan-darken-2" dark block class="text-white mb-5 mt-2" type="submit" :loading="loading">Recuperar Contraseña</v-btn>
              </v-form>
              <v-divider
              color="cyan"
              class="mt-10 mb-4 mx-auto border-opacity-50"
              inset
              style="width: 100%;"
            ></v-divider>
            <!-- Router Link -->
            <router-link class="text-center" to="/">
                <p style="font-size: 14px">Volver al Inicio</p>
            </router-link>
          </v-sheet>
        </v-card>
      </v-window-item>
      <v-window-item :value="2" class="my-window-item">
        <v-card class="pa-5" max-width="800" outlined border="info md !important">
          <v-sheet class="mx-auto" width="600" >
            <p class="text-h5 text-center mb-6 body-1 text--darken-2 mb-4" >Recuperación de Contraseña</p>
            <p><v-icon class="mr-1" color="green">mdi-check-circle</v-icon>Correo electrónico de restablecimiento de contraseña <strong>enviado</strong></p>
            <br>
            <p style="font-size:15px; opacity: 0.7;">Se ha enviado un correo electrónico de restablecimiento de contraseña a la dirección de correo electrónico de tu cuenta. Si no llegó esperá unos minutos o revisá tu casilla de Spam. </p>
            <v-divider
              color="cyan"
              class="mt-10 mb-4 mx-auto border-opacity-50"
              inset
              style="width: 100%;"
            ></v-divider>
            <!-- Router Link -->
            <router-link class="text-center" to="/">
                <p style="font-size: 14px">Volver al Inicio</p>
            </router-link>
          </v-sheet>
        </v-card>
      </v-window-item>
    </v-window>
    <InformationSnackbar ref="InformationSnackbar"/>
  </v-container>
</template>

<script>
  import axios from 'axios'
  import InformationSnackbar from '@/components/InformationSnackbar.vue'

  export default {
    name: 'ForgotPasswordView',
    components: {
      InformationSnackbar
    },
    mounted() {
      this.$root.InformationSnackbar = this.$refs.InformationSnackbar
    },
    data() {
      return {
        step: 1,
        email: '',
        rules: [
          v => !!v || 'El email es requerido',
          v => /^\S+@\S+\.\S+$/.test(v) || 'El email debe ser válido'
        ],
        loading: false
      }
    },
    methods: {
      handleSubmit() {
        this.loading = true;
        const payload = {
          email: this.email
        };

        axios.post('http://localhost/users/password-recovering', payload)
        .then(response => {
          console.log('Password recovering request successful:', response.data);
          this.loading = false;
          this.step = 2;
        })
        .catch(error => {
          if (error.response) {
            var snackbarMessage = '';
            if (error.response.status === 404) {
              snackbarMessage = 'El Email no se encuentra registrado';
            } else {
              snackbarMessage = 'Hubo un problema con la solicitud';
            }
          } else if (error.request) {
            snackbarMessage = 'No se pudo conectar con el servidor';
          }
          this.loading = false;
          this.$root.InformationSnackbar.show({message: snackbarMessage, color: 'dark', buttonColor:'red'})
        });
      }
    }
  }
  </script>

<style>
.my-window-item {
  border: 1px solid #00bcd4 !important; /* Borde aplicado al v-sheet */
  box-shadow: 0px 0px 15px rgba(0, 188, 212, 0.5);
  border-radius: 3px;
}
</style>