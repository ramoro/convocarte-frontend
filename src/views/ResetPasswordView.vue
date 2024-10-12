<template>
    <v-container class="d-flex align-center justify-center" style="text-align: center; height: 100vh;">
      <v-card class="pa-5" max-width="600" outlined border="info md">
        <v-sheet class="mx-auto" width="400">
          <p class="text-h6 text-center  body-1 grey--text text--darken-2" style="opacity: 0.7;" >Ingresá la nueva contraseña</p>
          <p v-if="weakPassword" class="caption text-center text-red mb-6" style="font-size:12px;">
            La contraseña deben tener al menos 8 caracteres, 1 letra mayúscula, 1 minúscula, 1 número y 1 símbolo (#,-,_,$,%,&,*)
          </p>
          <v-form ref="form" class="mt-4" @submit.prevent="handleSubmit">
            <v-text-field
                v-model="password"
                label="Nueva Contraseña"
                variant="outlined" 
                :rules="passwordRules"
                dense 
                color="blue"
                :append-inner-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                :type="show1 ? 'text' : 'password'"
                @click:append-inner="show1 = !show1"
            ></v-text-field>
            <v-text-field
                v-model="passwordConfirmation"
                label="Confirmar Contraseña"
                variant="outlined" 
                :rules="passwordConfRules"
                dense 
                color="blue"
                :append-inner-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                :type="show2 ? 'text' : 'password'"
                @click:append-inner="show2 = !show2"
            ></v-text-field>
            <v-btn color="cyan-darken-2" dark block class="text-white mb-5 mt-2" type="submit">Restablecer Contraseña</v-btn>
            </v-form>
        </v-sheet>
      </v-card>
      <InformationSnackbar ref="InformationSnackbar"/>
  </v-container>
</template>

<script>
  import InformationSnackbar from '@/components/InformationSnackbar.vue'
  import UserService from '../services/user.service';

  export default {
    name: 'ResetPasswordView',
    components: {
      InformationSnackbar
    },
    data() {
      return {
          email: '',
          password: '',
          passwordConfirmation:'',
          weakPassword: false,
          passwordRules: [
              v => !!v || 'La contraseña es requerida',
          ],
          passwordConfRules: [
              v => !!v || 'Se debe confirmar la contraseña',
              v => v === this.password || 'La contraseña no coincide'
          ],
          show1: false,
          show2: false,
        }
    },
    methods: {
      handleSubmit() {
        this.weakPassword = !(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#,-,_,$,%,&,*]).{8,}$/.test(this.password));
        this.$refs.form.validate().then(result => {
          if (result.valid && !this.weakPassword) {
            const payload = {
              secret_token: this.$route.params.token,
              new_password: this.password,
              password_confirmation: this.passwordConfirmation
            };
            UserService.resetPassword(payload)
            .then(response => {
              console.log('Password reseting successfull:', response.data);
              this.$router.push({ path: '/', query: { message: 'password-recovered' } });
            })
            .catch(error => {
              if (error.response) {
                var snackbarMessage = '';
                if (error.response.status === 500) {
                  snackbarMessage = 'El link ha expirado';
                } else {
                  snackbarMessage = 'Hubo un problema con la solicitud';
                }
              } else if (error.request) {
                snackbarMessage = 'No se pudo conectar con el servidor';
              }
              this.$root.InformationSnackbar.show({message: snackbarMessage, color: 'dark', buttonColor:'red'})
            });
          } else {
            console.log(result.errors);
          }
      }).catch(error => {
        console.error("Error al validar el formulario", error);
      });
      }
    }
  }
</script>