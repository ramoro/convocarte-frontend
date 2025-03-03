<template>
    <v-container>
      <!-- Cargando el formulario -->
      <v-row v-if="isLoading" justify="center" align="center" style="height: 60vh;">
        <v-container class="text-center">
          <v-progress-circular indeterminate color="cyan"></v-progress-circular>
          <div>Cargando formulario...</div>
        </v-container>
      </v-row>
      
      <v-container v-else>
        <v-row justify="center" align="center">
          <v-col cols="12" md="8">
            <h2 class="mt-2">Formulario para el rol: {{ roleName }}</h2>
            <hr style="border: 1px solid rgba(0, 0, 0, 0.1);" class="mb-5">
            
            <!-- Aquí mostramos los campos del formulario -->
            <v-form ref="form" v-model="formValid" @submit.prevent="submitForm">
              <v-row v-for="(field, index) in formFields" :key="index">
                <div class="title">
                  <span v-if="field.is_required" class="text-red">* </span>
                  {{ field.title }}
                </div>
                <v-col cols="12">
                  <v-text-field 
                    v-if="field.type === 'text'" 
                    :label="field.title" 
                    v-model="formData[field.title]" 
                    :rules="[
                            field.is_required ? requiredRule : true,
                            value => !value || value && value.length <= 70 || 'Máximo 70 caracteres'
                          ]"
                    outlined
                    dense
                    hide-details="auto"
                  >
                  </v-text-field>

                  <v-text-field
                    v-if="field.type === 'number'" 
                    v-model="formData[field.title]" 
                    :label="field.title" 
                    type="number"
                    :rules="[field.is_required ? requiredRule : true,
                      value => !value ||  /^[0-9]+$/.test(value) || 'Debe ser un número válido',
                      value => !value || value && value.length <= 20 || 'Máximo 20 caracteres'
                      ]"
                    required
                    outlined
                    dense
                    hide-details="auto"
                  ></v-text-field>
                  
                  <v-text-field
                    v-if="field.type === 'date'" 
                    :label="field.title"
                    v-model="formData[field.title]"
                    :rules="[field.is_required ? requiredRule : true,
                    value => !value || value.split('-')[0] >= 1900 && value.split('-')[0] <= 3000 || 'La fecha no es valida']"
                    type="date"
                    class="date-field"
                    outlined
                    dense
                    hide-details="auto"
                    >
                  </v-text-field>

                  <v-textarea
                    v-if="field.type === 'text area'" 
                    :label="field.title"
                    v-model="formData[field.title]"
                    :rules="[field.is_required ? requiredRule : true,
                            value => !value || value && value.length <= 600 || 'Máximo 600 caracteres'
                    ]"
                    outlined
                    dense
                    hide-details="auto"
                  ></v-textarea>
                  
                  <v-select 
                    v-if="field.type === 'select'" 
                    :label="field.title" 
                    :items="field.options" 
                    v-model="formData[field.title]" 
                    :rules="[field.is_required ? requiredRule : true]" 
                    outlined
                    dense
                    hide-details="auto"
                  ></v-select>

                  <v-select
                    v-if="field.type === 'multiple select'" 
                    :label="field.title" 
                    :items="field.options" 
                    v-model="formData[field.title]" 
                    multiple
                    chips
                    deletable-chips
                    :rules="[field.is_required ? requiredRule : true]" 
                    persistent-hint
                  ></v-select>

                  <v-file-input
                    v-if="field.type === 'upload file'" 
                    v-model="formData[field.title]"
                    :accept="field.title.includes('Curriculum') ? 'application/pdf' : 'image/*'"
                    :label="field.title" 
                    outlined
                    dense
                    :rules="[field.is_required ? fileRequiredRule : true,
                            file => !file || !file.some(file => file.size > 2_097_152) || 'El tamaño del archivo debe ser menor a 2MB.'
                            ]"
                    hide-details="auto"
                    prepend-inner-icon="mdi-paperclip"
                    prepend-icon=""
                  ></v-file-input>

                </v-col>
              </v-row>
              <!-- Botones de Acción -->
            <v-row justify="end" class="mt-20 mr-2">
              <v-btn
                color="purple"
                class="mr-2"
                type="submit"
              >
                Postularse
              </v-btn>
              <v-btn
                text
                color="grey"
                @click="goBack()"
              >
                Cancelar
              </v-btn>
            </v-row>
            </v-form>
  
          </v-col>
        </v-row>
      </v-container>
    </v-container>
    <InformationSnackbar ref="InformationSnackbar"/>
  </template>
  
  <script>
  import FormService from '@/services/form.service';
  import { getOptionsFromField } from '@/utils';
  import InformationSnackbar from '@/components/InformationSnackbar.vue';
  import CastingPostulacionService from '@/services/casting-postulation.service';
  
  export default {
    components: {
      InformationSnackbar
    },
    data() {
      return {
        isLoading: true,
        roleName: '',
        formFields: [], // Campos del formulario
        formData: {}, // Datos a enviar
        formValid: false,
        requiredRule: v => !!v || 'Este campo es obligatorio',
        maxLengthRule: [
          value => (value.length <= 100) || 'Máximo 100 caracteres',
        ], 
      };
    },
    beforeMount() {
      if (!this.$store.state.auth.user) {
        this.$router.push('/');
      }
    },
    async mounted() {
      this.$root.InformationSnackbar = this.$refs.InformationSnackbar;
      const formId = this.$route.params.formId;
      this.roleName = this.$route.params.roleName;
      await this.loadForm(formId);
    },
    methods: {
      fileRequiredRule(v) {
        if (v.length == 0) {
          return "Se debe seleccionar un archivo";
        } else {
          return true;
        }
      },
      async loadForm(formId) {
        try {
          const response = await FormService.getForm(formId);
          const formData = response.data;
  
          // Mapear los campos del formulario
          this.formFields = formData.form_fields;

          for (let i = 0; i < this.formFields.length; i++) {
            this.formFields[i].options = getOptionsFromField(this.formFields[i].title);
          }
          
          // Inicializar los datos del formulario vacío
          console.log("Data de forms: ", this.formFields);
          
          this.isLoading = false;
        } catch (error) {
          console.error('Error al cargar el formulario:', error);
          this.isLoading = false;
        }
      },
  
      async submitForm() {
        console.log("pasa por submitform");

        if (this.formValid) {
          try {
            //Crear un objeto que contendrá todo lo que no son archivos
            //y una lista que tendrá las fotos que se hayan subido para la
            //postulacion
            const jsonFields = {};
            const postulationPhotos = [];
            var postulationCv = null;

            for (const field in this.formData) {
              if (Object.prototype.hasOwnProperty.call(this.formData, field)) {
                const fieldValue = this.formData[field];

                // Si el campo es un archivo, lo separamos del jsonFields
                if (fieldValue instanceof File) {
                  const extension = fieldValue.name.split('.').at(-1);
                  console.log("Fieldvaluename: ",fieldValue.name);
                  console.log("spliteado: ", fieldValue.name.split('.'));
                  console.log("field: ", field);
                  console.log("field + extension: ", field + extension);
                  
                  if (field == "Curriculum") {
                    postulationCv = {"file": fieldValue, "fileName": field + '.' + extension};
                  } else {
                    postulationPhotos.push({"file": fieldValue, "fileName": field + '.' + extension});
                  }
                } else if (Array.isArray(fieldValue)) {
                  // Si el campo es un array, lo convertimos en un string
                  //concatenado por comas
                  jsonFields[field] = fieldValue.join(',');
                } else {
                  // Si el campo no es archivo, lo agregamos al objeto JSON
                  //directamente
                  jsonFields[field] = fieldValue;
                }
              }
            }

            // Ver los datos antes de enviar
            console.log('Datos para enviar (incluyendo JSON y archivos):', jsonFields);
            console.log("cv a enviar: ", postulationCv);
            console.log("photos a enviar: ", postulationPhotos);
            var resp = await CastingPostulacionService.createCastingPostulation(this.$route.params.formId, jsonFields, 
                                                                      postulationCv, postulationPhotos);
            this.$router.push(`/casting-postulation-created/${resp.id}`);

          } catch (error) {
            console.error('Error al enviar la postulación:', error);
            // Si el usuario ya se ha postulado por ese rol se avisa con el Snackbar
            var errorMessage = 'Error en el servidor';
            if (error.response && error.response.status === 400) {
              if (error.response.data.detail.includes('user has already postulated for this role')) {
                errorMessage ='Ya se ha hecho una postulación para este rol.';
                } else if (error.response.data.detail.includes('casting call for this role has already finished')) {
                errorMessage ='El casting al cual pertenece el rol ha finalizado.';
              } else if (error.response.data.detail.includes('casting call for this role is paused')) {
                errorMessage ='El casting al cual pertenece el rol está pausado.';
              } else if (error.response.data.detail.includes('role exposed for this casting call is full')) {
                errorMessage ='El rol tiene los cupos llenos.';
              }
            }
            this.$root.InformationSnackbar.show({
              message: errorMessage,
              color: 'dark',
              buttonColor: 'red'
            });
          }
        } else {
          this.$root.InformationSnackbar.show({
            message: 'El Formulario es Inválido',
            color: 'dark',
            buttonColor: 'red'
          });        
        }
      },

      goBack() {
        this.$router.go(-1);
      },
    },
  };
  </script>
  <style>

    .title {
      font-size: 20px; 
      font-weight: bold;
      margin-bottom: 4px; 
      margin-top: 10px;
      margin-left: 15px;
    }

</style>