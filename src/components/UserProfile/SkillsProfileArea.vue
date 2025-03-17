<template>
    <v-container>
        <v-row align="center" justify="space-between">
        <v-col cols="auto">
          <p class="font-weight-bold text-h6">Habilidades</p>
        </v-col>
        <v-col cols="auto" class="text-right">
          <v-btn color="purple" @click="openSkillsDialog">Editar Formulario</v-btn>
        </v-col>
      </v-row>
      <!--- Visualizacion de la data ---->
      <v-card class="pa-3 my-4 elevation-2" variant="tonal" color="grey-darken-2">
        <v-row style="font-size:15px;">
          <v-col cols="3" md="3">
            <div class="caption">Idiomas<v-icon left style="margin-left:4px;" size="16" color="purple">mdi-book-open-page-variant</v-icon></div>
            <div style="display: flex; align-items: center; color: black !important;">
              <span>{{ skills.language_skills || '----------' }}</span>
            </div>
          </v-col>
          <v-col cols="3" md="3">
            <div class="caption">Deportes<v-icon left style="margin-left:4px;" size="16" color="purple">mdi-soccer</v-icon></div>
            <div style="color:black !important">{{ skills.sports_skills || '----------'}}</div>
          </v-col>
          <v-col cols="3" md="3">
            <div class="caption">Instrumentos<v-icon left style="margin-left:4px;" size="16" color="purple">mdi-guitar-acoustic</v-icon></div>
            <div style="color:black !important">{{ skills.instruments_skills || '----------'}}</div>
          </v-col>
          <v-col cols="3" md="3">
            <div class="caption">Habilidades Extras<v-icon left style="margin-left:4px;" size="16" color="purple">mdi-star-circle-outline</v-icon></div>
            <div style="color:black !important">{{ skills.other_skills || '----------'}}</div>
          </v-col>
          <v-col cols="3" md="3">
            <div class="caption">Canto</div>
            <div style="color:black !important">{{ skills.is_singer === null ? '----------' : (skills.is_singer ? 'Sí' : 'No')}}</div>
          </v-col>
          <v-col cols="3" md="3">
            <div class="caption">Danza</div>
            <div style="color:black !important">{{ skills.is_dancer === null ? '----------' : (skills.is_dancer ? 'Sí' : 'No')}}</div>
          </v-col>
          <v-col cols="3" md="3">
            <div class="caption">Tipos de Danza</div>
            <div style="color:black !important">{{ skills.dance_types || '----------'}}</div>
          </v-col>
          <v-col cols="3" md="3">
            <div class="caption">Lic. Conducir (Auto)</div>
            <div style="color:black !important">{{ skills.car_drivers_license === null ? '----------' : (skills.car_drivers_license ? 'Sí' : 'No')}}</div>
          </v-col>
          <v-col cols="3" md="3">
            <div class="caption">Lic. Conducir (Moto)</div>
            <div style="color:black !important">{{ skills.moto_drivers_license === null ? '----------' : (skills.moto_drivers_license ? 'Sí' : 'No')}}</div>
          </v-col>
          <v-col cols="3" md="3">
            <div class="caption">Adicionales</div>
            <div style="color:black !important">{{ skills.skills_additionals || '----------'}}</div>
          </v-col>
        </v-row>
      </v-card>
      <!--- Dialog para llenar la info.-->
      <v-dialog v-model="skillsDialog" max-width="800px">
        <v-card>
          <v-card-title class="justify-center text-center">
            <span class="text-h5">{{ 'Editar Habilidades' }}</span>
          </v-card-title>
          <v-form ref="form" @submit.prevent="handleSubmit">
            <v-card-text>
              <v-row>
                <v-col cols="6">
                  <v-select
                    v-model="formData.language_skills"
                    :items="languageOptions"
                    label="Idiomas"
                    multiple
                    chips
                    deletable-chips
                    hint="Seleccioná los idiomas que manejes fluido"
                    persistent-hint
                    :append-inner-icon="'mdi-book-open-page-variant'"
                  ></v-select>
                </v-col>
                <v-col cols="6">
                  <v-select
                    v-model="formData.sports_skills"
                    :items="sportsOptions"
                    label="Deportes"
                    multiple
                    chips
                    deletable-chips
                    hint="Seleccioná los deportes que practicás usualmente"
                    persistent-hint
                    :append-inner-icon="'mdi-soccer'"
                  ></v-select>
                </v-col>
                <v-col cols="6">
                  <v-select
                    v-model="formData.instruments_skills"
                    :items="instrumentsOptions"
                    label="Instrumentos"
                    multiple
                    chips
                    deletable-chips
                    persistent-hint
                    :append-inner-icon="'mdi-guitar-acoustic'"
                  ></v-select>
                </v-col>
                <v-col cols="6">
                  <v-select
                    v-model="formData.other_skills"
                    :items="otherSkillsOptions"
                    label="Habilidades Extras"
                    multiple
                    chips
                    deletable-chips
                    required
                    persistent-hint
                    :append-inner-icon="'mdi-star-circle-outline'"
                  ></v-select>
                </v-col>
                <v-col cols="3">
                  <v-select
                    v-model="formData.is_singer"
                    :items="yesOrNoOptions"
                    label="Canto"
                    outlined
                    dense
                    hide-details="auto"
                  ></v-select>
                </v-col>
                <v-col cols="3">
                  <v-select
                    v-model="formData.is_dancer"
                    :items="yesOrNoOptions"
                    label="Danza"
                    outlined
                    dense
                    hide-details="auto"
                  ></v-select>
                </v-col>
                <v-col v-if="formData.is_dancer === 'Sí'" cols="6">
                  <v-text-field
                    v-model="formData.dance_types"
                    label="Tipos de danza"
                    :rules="maxLengthRule"
                    hint="Aclará qué tipos de Danza hacés"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
                <v-col cols="3">
                  <v-select
                    v-model="formData.car_drivers_license"
                    :items="yesOrNoOptions"
                    label="Lic. de Conducir (Auto)"
                    outlined
                    dense
                    hide-details="auto"
                  ></v-select>
                </v-col>
                <v-col cols="3">
                  <v-select
                    v-model="formData.moto_drivers_license"
                    :items="yesOrNoOptions"
                    label="Lic. de Conducir (Moto)"
                    outlined
                    dense
                    hide-details="auto"
                  ></v-select>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="formData.skills_additionals"
                    :items="yesOrNoOptions"
                    label="Adicionales (profesión, otros hobbies, etc.)"
                    :rules="maxLengthRule2"
                    outlined
                    dense
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
import { languages } from '@/config/languages';
import { sports } from '@/config/sports';
import { instruments } from '@/config/instruments';
import { otherSkills } from '@/config/other-skills';
import UserService from '@/services/user.service';

export default {
  name: "SkillsProfileArea",
  props: {
    skills: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      formData: {}, //Copia del prop que se recibe del padre para poder modificar los datos
      yesOrNoOptions: ['-----------','Sí', 'No'],
      languageOptions: languages,
      sportsOptions: sports,
      instrumentsOptions: instruments,
      otherSkillsOptions: otherSkills,
      maxLengthRule: [
        value => !value || typeof value === 'string' && value.length <= 80 || 'Máximo 80 caracteres',
      ],
      maxLengthRule2: [
        value => !value || typeof value === 'string' && value.length <= 100 || 'Máximo 100 caracteres',
      ],
      skillsDialog: false,

    };
  },
  methods: {
    cancelEdition() {
      this.skillsDialog = false;
    },
    openSkillsDialog() {
      this.skillsDialog = true;
      this.formData = JSON.parse(JSON.stringify(this.skills));
      for (let field in this.formData) {
        if (['is_singer', 'is_dancer', 'car_drivers_license', 'moto_drivers_license'].includes(field) && this.formData[field] == true) {
          this.formData[field] = 'Sí';
        } else if (['is_singer', 'is_dancer', 'car_drivers_license', 'moto_drivers_license'].includes(field) && this.formData[field] == false) {
          this.formData[field] = 'No';
        } else if (['language_skills', 'sports_skills', 'instruments_skills', 'other_skills'].includes(field)) {
          if (this.formData[field]) {
            this.formData[field] = this.formData[field].split(',').map(item => item.trim());  // Descomponer string
          } else {
            this.formData[field] = [];  // Si el campo está vacío o nulo, inicializar como array vacío
          }
        }
      }
    },
    objectToString(obj) {
      if (!obj) {
        return null;  // Si el objeto es null o undefined, retorna un string vacío.
      }

      return Object.values(obj).join(', ');
    },
    async handleSubmit() {
      this.$refs.form.validate().then(result => {
        if (result.valid) {
          for (let field in this.formData) {
            if (this.formData[field] == '-----------' || this.formData[field] == '') {
              this.formData[field] = null;
            }
          }

          this.formData.language_skills = this.formData.language_skills ? this.objectToString(this.formData.language_skills) : null;
          this.formData.sports_skills = this.formData.sports_skills ? this.objectToString(this.formData.sports_skills) : null;
          this.formData.instruments_skills = this.formData.instruments_skills ? this.objectToString(this.formData.instruments_skills) : null;
          this.formData.other_skills = this.formData.other_skills ? this.objectToString(this.formData.other_skills) : null;
          this.formData.is_singer = this.formData.is_singer === 'Sí' ? true : (this.formData.is_singer === 'No' ? false : null);
          this.formData.is_dancer = this.formData.is_dancer === 'Sí' ? true : (this.formData.is_dancer === 'No' ? false : null);
          this.formData.car_drivers_license = this.formData.car_drivers_license === 'Sí' ? true : (this.formData.car_drivers_license === 'No' ? false : null);
          this.formData.moto_drivers_license = this.formData.moto_drivers_license === 'Sí' ? true : (this.formData.moto_drivers_license === 'No' ? false : null);

          console.log("FormData enviado");
          console.log(this.formData);
          UserService.updateUserData(this.$store.state.auth.user.id, this.formData)
            .then(response => {
              console.log('Se actualizaron las habilidades:', response.data);
              this.$emit('update-skills', this.formData);
            })
            .catch(error => {
              console.error('Error al actualizar las habilidades', error);
            });
            this.skillsDialog = false;
      } else {
        console.log("FORM INVALIDO");
        console.log(result.errors);
      }
    }).catch(error => {
      console.error("Error al validar el formulario", error);
      this.skillsDialog = false;

    });
    }
  }
};
</script>
