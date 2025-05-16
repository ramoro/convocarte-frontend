<template>
  <v-container>
    <v-row align="center" justify="space-between">
      <v-col cols="auto">
        <p class="font-weight-bold text-h6">Información Básica</p>
      </v-col>
      <v-col cols="auto" class="text-right">
        <v-btn v-if="editingMode" color="purple" @click="openBasicInfoDialog">Editar Formulario</v-btn>
      </v-col>
    </v-row>
    <!--- Visualizacion de la data ---->
    <v-card class="pa-3 my-4 elevation-2" variant="tonal" color="grey-darken-2">
      <v-row style="font-size:15px;">
        <v-col cols="3" md="3">
          <div class="caption">Nombre y Apellido</div>
          <div style="color:black !important">{{basicInfo.fullname || '----------'}}</div>
        </v-col>
        <v-col cols="3" md="3">
          <div class="caption">Edad</div>
          <div style="color:black !important">{{basicInfo.age || '----------'}}</div>
        </v-col>
        <v-col cols="3" md="3">
          <div class="caption">Género</div>
          <div style="color:black !important">{{basicInfo.gender || '----------'}}</div>
        </v-col>
        <v-col cols="3" md="3">
          <div class="caption">Fecha de Nacimiento</div>
          <div style="color:black !important">{{basicInfo.birth_date ? formatDate(basicInfo.birth_date) : '----------'}}</div>
        </v-col>
        <v-col cols="3" md="3">
          <div class="caption">País de Residencia</div>
          <div style="color:black !important">{{basicInfo.residence_country || '----------'}}</div>
        </v-col>
        <v-col cols="3" md="3">
          <div class="caption">Localidad</div>
          <div style="color:black !important">{{basicInfo.locality || '----------'}}</div>
        </v-col>
        <v-col cols="3" md="3">
          <div class="caption">Nacionalidad</div>
          <div style="color:black !important">{{basicInfo.nationality || '----------'}}</div>
        </v-col>
        <v-col cols="12">
          <p style="font-size: 20px;">  Contacto y Redes <v-icon color="purple">mdi-mobile-phone-wireless</v-icon></p>
        </v-col>
        <v-col cols="3" md="3">
          <div class="caption">Nro. Telefónico</div>
          <div style="color:black !important">{{basicInfo.phone_number || '----------'}}</div>
        </v-col>
        <v-col cols="3" md="3">
          <div class="caption">Nro. Telefónico 2</div>
          <div style="color:black !important">{{basicInfo.phone_number_two || '----------'}}</div>
        </v-col>
        <v-col cols="3" md="3">
          <div class="caption">Instagram<v-icon left style="margin-left:4px;" size="16" color="pink-lighten-1">mdi-instagram</v-icon></div>
          <div style="color:black !important" >
            <a v-if="basicInfo.instagram" :href="formatUrl(basicInfo.instagram)">{{ basicInfo.instagram }}</a>
            <a v-else>{{'----------'}} </a>
          </div>
        </v-col>
        <v-col cols="3" md="3">
          <div class="caption">Facebook<v-icon left style="margin-left:4px;" size="16" color="blue">mdi-facebook</v-icon></div>
          <div style="color:black !important" >
            <a v-if="basicInfo.facebook" :href="formatUrl(basicInfo.facebook)">{{ basicInfo.facebook }}</a>
            <a v-else>{{'----------'}} </a>
          </div>
        </v-col>
        <v-col cols="3" md="3">
          <div class="caption">Canal de Youtube<v-icon left style="margin-left:4px;" size="16" color="red">mdi-youtube</v-icon></div>
          <div style="color:black !important" >
            <a v-if="basicInfo.youtube_channel" :href="formatUrl(basicInfo.youtube_channel)">{{ basicInfo.youtube_channel }}</a>
            <a v-else>{{'----------'}} </a>
          </div>
        </v-col>
        <v-col cols="3" md="3">
          <div class="caption">Sitio Web<v-icon left style="margin-left:4px;" size="16" color="blue">mdi-web</v-icon></div>
          <div style="color:black !important" >
            <a v-if="basicInfo.website" :href="formatUrl(basicInfo.website)">{{ basicInfo.website }}</a>
            <a v-else>{{'----------'}} </a>
          </div>
        </v-col>
      </v-row>
    </v-card>
    
    <v-dialog v-model="basicInfoDialog" max-width="800px">
      <v-card>
        <v-card-title class="justify-center text-center">
          <span class="text-h5">{{ 'Editar Información Básica' }}</span>
        </v-card-title>
        <v-form ref="form" @submit.prevent="handleSubmit">
        <v-card-text>
            <v-row>
              <v-col cols="4">
                <v-text-field
                  v-model="formData.fullname"
                  label="Nombre y Apellido"
                  :rules="maxLengthRule"
                  required
                  outlined
                  dense
                  hide-details="auto"
                ></v-text-field>
              </v-col>
              <v-col cols="2">
                <v-text-field
                  v-model="formData.age"
                  label="Edad"
                  type="number"
                  :rules="numericRule"
                  required
                  outlined
                  dense
                  hide-details="auto"
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-select
                  v-model="formData.gender"
                  :items="genderOptions"
                  label="Género"
                  required
                  :menu-props="{ bottom: true }"
                  outlined
                  dense
                  hide-details="auto"
                ></v-select>
              </v-col>
              <v-col cols="3">
                <v-text-field
                label="Fecha de Nacimiento"
                v-model="formData.birth_date"
                :rules="birthDateRules"
                type="date"
                class="date-field"
                outlined
                dense
                hide-details="auto"
                >
                </v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  v-model="formData.residence_country"
                  label="País de Residencia"
                  :rules="maxLengthRule"
                  required
                  outlined
                  dense
                  hide-details="auto"
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  v-model="formData.locality"
                  label="Localidad"
                  :rules="maxLengthRule"
                  required
                  outlined
                  dense
                  hide-details="auto"
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  v-model="formData.nationality"
                  label="Nacionalidad"
                  :rules="maxLengthRule"
                  required
                  outlined
                  dense
                  hide-details="auto"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <p class="text-h6">  Contacto y Redes  <v-icon color="purple">mdi-mobile-phone-wireless</v-icon></p>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  v-model="formData.phone_number"
                  label="Nro. Telefónico"
                  type="number"
                  :rules="numericRule"
                  required
                  outlined
                  dense
                  hide-details="auto"
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  v-model="formData.phone_number_two"
                  label="Nro. Telefónico 2"
                  type="number"
                  :rules="numericRule"
                  required
                  outlined
                  dense
                  hide-details="auto"
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  v-model="formData.instagram"
                  label="Instagram"
                  :rules="maxLengthRule"
                  required
                  outlined
                  dense
                  hide-details="auto"
                  :append-inner-icon="'mdi-instagram'"
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  v-model="formData.facebook"
                  label="Facebook"
                  :rules="maxLengthRule"
                  required
                  outlined
                  dense
                  hide-details="auto"
                  :append-inner-icon="'mdi-facebook'"
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  v-model="formData.youtube_channel"
                  label="Canal de Youtube"
                  :rules="maxLengthRule"
                  required
                  outlined
                  dense
                  hide-details="auto"
                  :append-inner-icon="'mdi-youtube'"
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  v-model="formData.website"
                  label="Sitio Web"
                  :rules="maxLengthRule"
                  required
                  outlined
                  dense
                  hide-details="auto"
                  :append-inner-icon="'mdi-web'"
                ></v-text-field>
              </v-col>
            </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="purple" type="submit">Guardar</v-btn>
          <v-btn color="grey" @click="cancelEdition()">Cancelar</v-btn>
        </v-card-actions>
        </v-form>
      </v-card> 
    </v-dialog>
  </v-container>
</template>

<script>
import { genders } from '@/config/genders';
import UserService from '../../services/user.service';
import { formatDate, formatUrl } from '@/utils';

export default {
  name: "BasicInfoAndContactProfileArea",
  props: {
    basicInfo: {
      type: Object,
      default: () => {}
    },
    editingMode: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      formData: {}, //Copia del prop que se recibe del padre para poder modificar los datos
      genderOptions: ['-----------'].concat(genders),
      basicInfoDialog: false,

      numericRule: [
        value => !value ||  /^[0-9]+$/.test(value) || 'Debe ser un número válido'
      ],
      maxLengthRule: [
        value => !value || typeof value === 'string' && value.length <= 150 || 'Máximo 150 caracteres',
      ],
      birthDateRules: [
        value => !value || value.split('-')[0] >= 1900 && value.split('-')[0] <= 3000 || 'La fecha no es valida' //Validacion de año
      ],
    };
  },
  methods: {
    cancelEdition() {
      this.basicInfoDialog = false;
    },
    openBasicInfoDialog() {
      this.basicInfoDialog = true;
      this.formData = JSON.parse(JSON.stringify(this.basicInfo));
    },
    async handleSubmit() {
      this.$refs.form.validate().then(result => {
      if (result.valid) {
        for (let field in this.formData) {
          if (this.formData[field] == '-----------' || this.formData[field] == '') {
            this.formData[field] = null;
          }
        }
        
        UserService.updateUserData(this.$store.state.auth.user.id, this.formData)
          .then(response => {
            console.log('Se actualizó la info. básica y los datos de contacto:', response.data);
            this.$emit('update-basic-info', this.formData);
          })
          .catch(error => {
            console.error('Error al actualizar info. básica y datos de contacto', error);
          });
          this.basicInfoDialog = false;
      } else {
        console.log("FORM INVALIDO");
        console.log(result.errors);
      }
      }).catch(error => {
        console.error("Error al validar el formulario", error);
        this.basicInfoDialog = false;
      });
    },
    formatDate(dateString) {
      return formatDate(dateString);
    },
    formatUrl(url) {
      return formatUrl(url);
    },
  }
};

</script>