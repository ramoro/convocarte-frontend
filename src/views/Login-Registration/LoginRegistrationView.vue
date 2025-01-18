<template>
  <v-container>
    <v-row class="align-center" justify="center">
      <v-col cols="12" sm="10" xl="7">
        <v-card class="elevation-6 mt-10">
          <v-window v-model="step">
            <v-window-item :value="1">
              <v-row>
                <v-col cols="12" sm="6" xl="6">
                  <v-card-text class="mt-12">
                    <p class="text-h6 text-center">Ingresá con tu cuenta</p>
                    <p class="text-caption text-center text-grey">Ingresá con tu cuenta para poder encontrar castings
                      <br> y crear tus propias convocatorias
                    </p>
                    <v-row class="align-center" justify="center">
                      <v-col cols="12" sm="8" xl="9">
                        <v-text-field :rules="emailRules" ref="emailField" v-model="user.email" label="Email" variant="outlined" dense color="blue" autocomplete="false" class="mt-16" type="email" @keyup.enter="submitLogin"></v-text-field>
                        <v-text-field :rules="passwordRules" ref="passwordField" v-model="user.password" label="Contraseña" variant="outlined" dense color="blue" autocomplete="false" class="mt-2" @keyup.enter="submitLogin"
                        :append-inner-icon="showPassLogin ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="showPassLogin ? 'text' : 'password'"
                        @click:append-inner="showPassLogin = !showPassLogin">
                        </v-text-field>
                        <v-btn color="cyan-darken-2" dark block class="text-white mb-5 mt-2" @click="submitLogin" :loading="loading">Ingresar</v-btn>
                        <p class="forgot password text-center">
                          <router-link to="forgot-password">Olvidé mi contraseña</router-link>
                        </p>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-col>
                <v-col cols="12" sm="6" xl="6" class="cyan-background rounded-bl-xl">
                  <div style="text-align:center; padding: 180px 0;">
                    <v-card-text class="text-white">
                      <p class="text-h6 text-center mb-2">¿No tenés tu cuenta aún?</p>
                      <p class="caption text-center">
                        Crea tu propia cuenta para empezar a encontrar las<br/>
                        convocatorias que más te interesen
                      </p>
                    </v-card-text>
                    <div class="text-center">
                      <v-btn variant="outlined" class="text-white" @click="goToNextStep">Registrarme</v-btn>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-window-item>
            <v-window-item :value="2">
              <v-row>
                <v-col cols="12" sm="6" xl="6" class="cyan-background rounded-br-xl">
                  <div style="text-align:center; padding: 120px 0;">
                    <v-card-text class="text-white">
                      <p class="text-h6 text-center mb-2">¿Ya te registraste?</p>
                      <p class="caption text-center">
                        Ingresá con tu cuenta para seguir buscando las mejores<br/>
                        convocatorias que se adecúen a tu perfil
                      </p>
                    </v-card-text>
                    <div class="text-center">
                      <v-btn variant="outlined" class="text-white" @click="goToPrevStep">Ingresar</v-btn>
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-card-text class="mt-6">
                    <p class="text-h6 text-center">Crea tu cuenta</p>
                    <p v-if="weakPassword" class="caption text-center text-red" style="font-size:12px;">
                      La contraseña deben tener al menos 8 caracteres, 1 letra mayúscula, 1 minúscula, 1 número y 1 símbolo (#,-,_,$,%,&,*)
                    </p>
                    <v-row class="align-center" justify="center">
                      <v-col cols="12" sm="10" md="8" xl="9">
                        <v-text-field :rules="fullnameRules" ref="regFullnameField" v-model="registrationForm.fullname" label="Nombre y Apellido" variant="outlined" dense color="blue" autocomplete="false" class="mt-6"></v-text-field>
                        <v-text-field :rules="emailRules" ref="regEmailField" v-model="registrationForm.email" label="Email" variant="outlined" dense color="blue" autocomplete="false" class="mt-2"></v-text-field>
                        <v-text-field :rules="passwordRules" ref="regPasswordField" v-model="registrationForm.password" label="Contraseña" variant="outlined" dense color="blue" autocomplete="false" class="mt-2" @keyup.enter="submitRegistration" 
                        :append-inner-icon="showPass1 ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="showPass1 ? 'text' : 'password'"
                        @click:append-inner="showPass1 = !showPass1"></v-text-field>
                        <v-text-field :rules="passwordConfRules" ref="regPasswordConfirmationField" v-model="registrationForm.passwordConfirmation" label="Confirmar Contraseña" variant="outlined" dense color="blue" autocomplete="false" class="mt-2" @keyup.enter="submitRegistration"
                        :append-inner-icon="showPass2 ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="showPass2 ? 'text' : 'password'"
                        @click:append-inner="showPass2 = !showPass2"></v-text-field>
                        <v-btn color="cyan-darken-2" dark block class="text-white mt-4" @click="submitRegistration" :loading="loading">Registrarme</v-btn>
                      </v-col>
                    </v-row>
                  </v-card-text>
                  <v-dialog v-model="accountRegisteredDialog" max-width="500">
                    <v-card>
                      <v-card-title class="headline text-center">Cuenta creada correctamente</v-card-title>

                      <v-card-text class="text-center">
                        Gracias por registrarte en Convocarte. Se ha enviado un mail al correo electrónico: <br><br><v-icon class="mr-1" color="cyan">mdi-email</v-icon>{{auxEmail}}<br><br><strong>Revisá tu correo para activar la cuenta</strong>
                      </v-card-text>

                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="accountRegisteredDialog = false">Cerrar</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-col>
              </v-row>
            </v-window-item>
          </v-window>
        </v-card>
      </v-col>
    </v-row>
    <InformationSnackbar ref="InformationSnackbar"/>
  </v-container>
</template>

<script>
import InformationSnackbar from '@/components/InformationSnackbar.vue'
import User from '@/models/user'

export default {
  props: ['source'],
  components: {
    InformationSnackbar
  },
  mounted() {
      this.$root.InformationSnackbar = this.$refs.InformationSnackbar
      // Verifica si se pasa un mensaje a través del estado de la ruta
      if (this.$route.query.message == 'password-recovered') {
        this.$root.InformationSnackbar.show({message: 'Tu contraseña ya ha sido restaurada. Ya podés logearte con la nueva contraseña.', color: 'green', buttonColor:'white', timer:100000})
      }
  },
  data () {
    return {
      accountRegisteredDialog: false,
      step: 1,
      user: new User('', ''),
      registrationForm: {
        fullname: '',
        email: '',
        password: '',
        passwordConfirmation: ''
      },
      auxEmail: '',
      emailRules: [
        v => !!v || 'El email es requerido',
        v => /^\S+@\S+\.\S+$/.test(v) || 'El email debe ser válido'
      ],
      passwordRules: [
        v => !!v || 'La contraseña es requerida',
      ],
      passwordConfRules: [
        v => !!v || 'Se debe confirmar la contraseña',
        v => v === this.registrationForm.password || 'La contraseña no coincide'
      ], 
      fullnameRules: [
        v => !!v || 'El nombre y apellido son requeridos',
      ],
      loading: false,
      weakPassword: false,
      showPassLogin: false,
      showPass1: false,
      showPass2: false
    }
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    }
  },
  created() {
    if (this.loggedIn) {
      this.$router.push('/casting-call-search');
    }
  },
  methods: {
    resetRegistrationForm() {
      this.$refs.regFullnameField.reset();
      this.$refs.regEmailField.reset();
      this.$refs.regPasswordField.reset();
      this.$refs.regPasswordConfirmationField.reset();
      this.weakPassword = false;
    },
    goToNextStep() {
      this.$refs.emailField.reset();
      this.$refs.passwordField.reset();
      this.step++;
    },
    goToPrevStep() {
      this.step--;
      this.resetRegistrationForm();
    },
    showSnackbarSuccess(snackbarMessage) {
      this.$root.InformationSnackbar.show({message: snackbarMessage, color: 'green', buttonColor:'white'})
    },
    showSnackbarError(snackbarMessage) {
      this.$root.InformationSnackbar.show({message: snackbarMessage, color: 'dark', buttonColor:'red'})
    },
    validateEmailAndPassword(email, password) {
      const emailValid = this.emailRules.every(rule => rule(email) === true);
      const passwordValid = this.passwordRules.every(rule => rule(password) === true);

      return passwordValid && emailValid;
    },
    async submitLogin() {
      if(this.validateEmailAndPassword(this.user.email, this.user.password)) {
        this.loading = true;

        this.$store.dispatch('auth/login', this.user).then(
          data => {
            console.log('Login successful:', data);
            this.loading = false;
            this.$router.push({ path: '/casting-call-search' });
          },
          error => {
            this.loading = false;  
            var snackbarText = '';
            if (error.response) {
              if (error.response.status === 403) {
                snackbarText = 'El Email o la Contraseña son incorrectos';
              } else {
                snackbarText = 'Hubo un problema con la solicitud';
              }
            } else if (error.request) {
              snackbarText = 'No se pudo conectar con el servidor';
            }
            this.showSnackbarError(snackbarText);
          }
        );
      }
    },
    isStrongPassword(password) {
      return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#,-,_,$,%,&,*]).{8,}$/.test(password);
    },
    validateRegistration() {
      const fullnameValid = this.fullnameRules.every(rule => rule(this.registrationForm.fullname) === true);
      const passConfValid = this.passwordConfRules.every(rule => rule(this.registrationForm.passwordConfirmation) === true);
      const strongPassword = this.isStrongPassword(this.registrationForm.password);

      if (!strongPassword) {
        this.weakPassword = true;
      }

      return fullnameValid && passConfValid && 
      this.validateEmailAndPassword(this.registrationForm.email, this.registrationForm.password) && strongPassword;
    },
    async submitRegistration() {
      if(this.validateRegistration()) {
        this.loading = true;
        this.$store.dispatch('auth/register', this.registrationForm).then(
          data => {
            console.log('Registration successful:', data);
            this.loading = false;
            this.accountRegisteredDialog = true;
            this.auxEmail = this.registrationForm.email;
            this.resetRegistrationForm();
          },
          error => {
            if (error.response) {
              var snackbarText = '';
              if (error.response.status === 409) {
                snackbarText = 'El Email ya se encuentra registrado';
              } else {
                snackbarText = 'Hubo un problema con la solicitud';
              }
            } else if (error.request) {
              snackbarText = 'No se pudo conectar con el servidor';
            }
            this.showSnackbarError(snackbarText);
            this.loading = false;
          }
        );
      }
    }
  }
}
</script>

<style scoped>
.v-application .rounded-bl-xl {
  border-bottom-left-radius: 300px !important;
}
.v-application .rounded-br-xl {
  border-bottom-right-radius: 300px !important;
}

.cyan-background {
  background-color: #0097A7;
  border-bottom-left-radius: 1rem; 
  border-bottom-right-radius: 1rem; 
}


</style>