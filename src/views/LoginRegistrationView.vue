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
                        <v-text-field :rules="emailRules" ref="emailField" v-model="loginForm.email" label="Email" variant="outlined" dense color="blue" autocomplete="false" class="mt-16" type="email" @keyup.enter="submitLogin"></v-text-field>
                        <v-text-field :rules="passwordRules" ref="passwordField" v-model="loginForm.password" label="Contraseña" variant="outlined" dense color="blue" autocomplete="false" type="password" class="mt-2" @keyup.enter="submitLogin"></v-text-field>
                        <v-btn color="cyan-darken-2" dark block class="text-white mb-16 mt-2" @click="submitLogin" :loading="loading">Ingresar</v-btn>
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
            <v-text-field :rules="passwordRules" ref="regPasswordField" v-model="registrationForm.password" label="Contraseña" variant="outlined" dense color="blue" autocomplete="false" type="password" class="mt-2" @keyup.enter="submitRegistration"></v-text-field>
            <v-text-field :rules="passwordConfRules" ref="regPasswordField" v-model="registrationForm.passwordConfirmation" label="Confirmar Contraseña" variant="outlined" dense color="blue" autocomplete="false" type="password" class="mt-2" @keyup.enter="submitRegistration"></v-text-field>
            <v-btn color="cyan-darken-2" dark block class="text-white mt-4" @click="submitRegistration" :loading="loading">Registrarme</v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-col>
  </v-row>
</v-window-item>
          </v-window>
        </v-card>
      </v-col>
    </v-row>
    <div class="text-center ma-2">
      <v-snackbar v-model="snackbar" :timeout="5000" :color="snackbarColor">
        <v-icon class="mr-1" v-if="snackbarColor == 'green'">mdi-check-circle</v-icon>
        <span v-html="snackbarText"></span>

        <template v-slot:actions>
          
          <v-btn
            :color="snackbarButtonColor"
            variant="text"
            @click="snackbar = false"
          >
            Cerrar
          </v-btn>
        </template>
      </v-snackbar>
      
    </div>
    
  </v-container>
</template>

<script>
import axios from 'axios'

export default {
  props: ['source'],
  data () {
    return {
      step: 1,
      loginForm: {
        email: '',
        password: ''
      },
      registrationForm: {
        fullname: '',
        email: '',
        password: '',
        passwordConfirmation: ''
      },
      snackbar: false,
      snackbarText: '',
      snackbarColor: '',
      snackbarButtonColor: 'red',
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
      weakPassword: false
    }
  },
  methods: {
    resetRegistrationForm() {
      this.$refs.regFullnameField.reset();
      this.$refs.regEmailField.reset();
      this.$refs.regPasswordField.reset();
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
    showSnackbarSuccess() {
      this.snackbarColor = 'green';
      this.snackbarButtonColor = 'white'; 
      this.snackbar = true;
    },
    showSnackbarError() {
      this.snackbarColor = 'dark'; 
      this.snackbarButtonColor = 'red'; 
      this.snackbar = true;
    },
    validateEmailAndPassword(email, password) {
      const emailValid = this.emailRules.every(rule => rule(email) === true);
      const passwordValid = this.passwordRules.every(rule => rule(password) === true);

      return passwordValid && emailValid;
    },
    submitLogin() {
      if(this.validateEmailAndPassword(this.loginForm.email, this.loginForm.password)) {
        this.loading = true;

        const formData = new FormData();
        formData.append('username', this.loginForm.email);
        formData.append('password', this.loginForm.password);

        formData.forEach(x=> console.log(x));
        
        axios.post('http://localhost/login', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(response => {
          console.log('Login successful:', response.data);
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;  
          if (error.response) {
            if (error.response.status === 403) {
              this.snackbarText = 'El Email o la Contraseña son incorrectos';
            } else {
              this.snackbarText = 'Hubo un problema con la solicitud';
            }
          } else if (error.request) {
              this.snackbarText = 'No se pudo conectar con el servidor';
          }
          this.showSnackbarError();
          
        });
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
    submitRegistration() {
      if(this.validateRegistration()) {
        this.loading = true;
        const payload = {
          fullname: this.registrationForm.fullname,
          email: this.registrationForm.email,
          password: this.registrationForm.password,
          password_confirmation: this.registrationForm.passwordConfirmation
        };

        axios.post('http://localhost/users', payload)
        .then(response => {
          console.log('Registration successful:', response.data);
          this.loading = false;
          this.goToPrevStep();
          
          this.snackbarText = 'Cuenta registrada exitosamente. <strong>Revise su email</strong> para activarla.';
          this.showSnackbarSuccess();

          this.resetRegistrationForm();

        })
        .catch(error => {
          if (error.response) {
            this.loading = false;
            if (error.response.status === 409) {
              this.snackbarText = 'El Email ya se encuentra registrado';
            } else {
              this.snackbarText = 'Hubo un problema con la solicitud';
            }
          } else if (error.request) {
              this.snackbarText = 'No se pudo conectar con el servidor';
          }
          this.showSnackbarError();
        });
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