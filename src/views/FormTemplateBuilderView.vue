<template>
  <v-container>
    <v-row>
      <v-col cols="4">
        <v-card class="sticky-card purple-border">
          <v-card-title>
            <h3>Campos Para Agregar</h3>
          </v-card-title>
          <v-tabs v-model="tab" bg-color="transparent" color="purple" grow>
            <v-tab v-for="item in items" :key="item">
              {{ item }}
            </v-tab>
          </v-tabs>

          <v-card-text>
            <v-row>
              <v-col v-for="(button, index) in filteredButtons" :key="index">
                <v-btn
                  :color="buttonDisabled(button) ? 'grey' : 'primary'"
                  class="text-none"
                  size="small"
                  variant="flat"
                  :disabled="buttonDisabled(button)"
                  @click="addField(button.type, button.label, button.additionalText)"
                  :prepend-icon="button.icon"
                >
                  {{ button.label }}
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="8">
        <v-card class="purple-border">
          <v-card-title>
            <div class="title-input">
              <input
                type="text"
                v-model="formTitle"
                placeholder="Título del Formulario"
                class="custom-title-input"
              />
            </div>
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item v-for="(field, index) in formFields" :key="index">
                <div class="field-container">
                  <component 
                    :is="getComponent(field.type)" 
                    v-model="field.value" 
                    :placeholder="field.placeholder" 
                    :fieldTitle="field.title"
                    :additionalText="field.additionalText"
                    class="mt-5"
                    style="min-width: 250px;"
                  />
                  
                  <v-switch
                    label="Obligatorio"
                    v-model="field.required"
                    color="purple"
                    style="max-width: 150px"
                    class="mr-25"
                  ></v-switch>
                </div>

                <div class="actions-container">
                  <v-icon 
                    @click="moveField(index, -1)" 
                    :disabled="index === 0" 
                    class="move-icon"
                  >
                    mdi-arrow-up
                  </v-icon>
                  <v-icon 
                    @click="moveField(index, 1)" 
                    :disabled="index === formFields.length - 1" 
                    class="move-icon"
                  >
                    mdi-arrow-down
                  </v-icon>
                  
                  <v-tooltip text="Eliminar" location="top">
                    <template v-slot:activator="{ props }">
                      <v-icon 
                        @click="removeField(index)" 
                        class="remove-icon" 
                        v-bind="props"
                      >
                        mdi-delete
                      </v-icon>
                    </template>
                  </v-tooltip>
                </div>
              </v-list-item>
            </v-list>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn v-if="formFields.length > 0" color="purple" @click="submitForm()">Guardar</v-btn>
            <v-btn v-if="formFields.length > 0" color="cyan" @click="formFields=[]">Limpiar</v-btn>
            <v-btn color="grey" @click="cancelFormCreation()">Cancelar</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <InformationSnackbar ref="InformationSnackbar"/>
  </v-container>
</template>

<script>
import TextFieldInput from '@/components/FormElements/TextFieldInput.vue';
import UploadFileFieldInput from '@/components/FormElements/UploadFileFieldInput.vue';
import SelectFieldInput from '@/components/FormElements/SelectFieldInput.vue';
import DateFieldInput from '@/components/FormElements/DateFieldInput.vue';
import InformationSnackbar from '@/components/InformationSnackbar.vue';
import FormTemplateService from '@/services/form-template.service';
import draggable from 'vuedraggable';


import { useRouter } from 'vue-router';


import { 
  basicInfoFormFields, 
  physicalCharacteristicsFormFields, 
  galleryShotFormFields, 
  skillsFormFields, 
  studiesAndJobsFormFields } 
from '@/config/form-fields.js';

export default {
  components: {
    TextFieldInput,
    UploadFileFieldInput,
    SelectFieldInput,
    DateFieldInput,
    InformationSnackbar,
    draggable
  },
  setup() {
    const router = useRouter();
    return { router };
  },
  mounted() {
      this.$root.InformationSnackbar = this.$refs.InformationSnackbar;
  },
  data() {
    return {
      formFields: [],
      formTitle: '',
      tab: 'Info Básica',
      items: ['Info Básica', 'Fotos', 'Datos Físicos', 'Habilidades', 'Trabajos y Estudios'],
      buttons: {
        0: basicInfoFormFields,
        1: galleryShotFormFields,
        2: physicalCharacteristicsFormFields,
        3: skillsFormFields,
        4: studiesAndJobsFormFields
      },
    };
  },
  computed: {
    filteredButtons() {
      return this.buttons[this.tab] || [];
    },
    currentUser() {
      console.log("STOREUSER");
      console.log(this.$store.state.auth.user);
      return this.$store.state.auth.user;
    }
  },
  methods: {
    cancelFormCreation() {
      this.$router.push({ path: 'user-forms'});
    },
    buttonDisabled(button) {
      return this.formFields.some(field => field.title === button.label);
    },
    addField(type, label, additionalText) {
      const placeholderMap = {
        'text': 'Texto de respuesta breve',
        'text area': 'Texto de respuesta larga',
        'number': 'Respuesta numérica',
        'upload file': 'Agregar archivo',
        'select': 'Elegir Opción',
        'multiple select': 'Elegir Opciones',
        'date': ''
      };

      const newField = { 
        type,
        value: '',
        options: [],
        placeholder: placeholderMap[type] || '',
        title: label,
        additionalText,
        required: false, // Por defecto no es obligatorio
      };
      
      this.formFields.push(newField);
    },
    removeField(index) {
      this.formFields.splice(index, 1);
    },
    moveField(index, direction) {
      const newIndex = index + direction;
      if (newIndex >= 0 && newIndex < this.formFields.length) {
        const [movedField] = this.formFields.splice(index, 1);
        this.formFields.splice(newIndex, 0, movedField);
      }
    },
    getComponent(type) {
      switch (type) {
        case 'text':
        case 'text area':
        case 'number':
          return 'TextFieldInput';
        case 'upload file':
          return 'UploadFileFieldInput'
        case 'select':
        case 'multiple select':
          return 'SelectFieldInput'
        case 'date':
          return 'DateFieldInput'
        default:
          return null;
      }
    },
    async submitForm() {

      // Validar que el título no esté vacío
      if (!this.formTitle.trim()) {
        this.$root.InformationSnackbar.show({message: "El Formulario debe tener un Título", color: 'dark', buttonColor:'red'})
        return;
      }

      const fieldsToSend = this.formFields.map((field, index) => ({
        title: field.title,
        type: field.type,
        order: index, // El orden se basa en la posicion que tiene en formFields
        is_required: field.required,
      }));

      console.log("Fields to send", fieldsToSend);

      const payload = {form_template_title: this.formTitle, form_template_fields: fieldsToSend}

      FormTemplateService.createFormTemplate(payload)
      .then(response => {
          console.log('Se agregó un nuevo template form:', response.data);
          this.$router.push({ path: 'user-forms', query: { title: this.formTitle } });
      })
      .catch(error => {
          if (error.response) {
            if (error.response.status === 409) {
              this.$root.InformationSnackbar.show({message: "Ya existe un Formulario a tu nombre con ese Título", color: 'dark', buttonColor:'red'})
          } else {
              this.$root.InformationSnackbar.show({message: "Hubo un problema con la solicitud", color: 'dark', buttonColor:'red'})
            }
          } else if (error.request) {
              this.$root.InformationSnackbar.show({message: "No se pudo conectar con el servidor", color: 'dark', buttonColor:'red'})
          }
      });

    }
  },
  beforeMount() {
      if (!this.currentUser) {
          this.$router.push('/');
      }
  }
};
</script>

<style scoped>
.title-input {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.custom-title-input {
  border: none;
  border-bottom: 2px solid lightgray;
  outline: none;
  padding: 8px;
  font-size: 24px;
  width: 100%;
}

.custom-title-input:focus {
  border-bottom: 2px solid #9c27b0;
  background: transparent;
}

.remove-icon {
  cursor: pointer;
  margin-left: 8px;
  transition: color 0.3s;
}

.remove-icon:hover {
  color: red;
}

.move-icon {
  cursor: pointer;
  margin-left: 8px;
  transition: color 0.3s;
}

.move-icon:hover {
  color: #9c27b0;
}

.sticky-card {
  position: sticky;
  top: 75px;
  z-index: 1000;
}

.purple-border {
  border-top: 3px solid purple;
}

.field-container {
  display: flex;
  align-items: center;
  flex-grow: 1; 
  justify-content: space-between; 
}

.actions-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 150px; 
}
</style>