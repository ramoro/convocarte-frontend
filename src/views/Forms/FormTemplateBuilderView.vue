<template>
  <v-container>
    <v-row v-if="viewIsLoading" justify="center" align="center" style="height: 60vh;">
      <v-container class="text-center">
        <v-progress-circular indeterminate color="cyan"></v-progress-circular>
        <div>Cargando campos del formulario...</div>
      </v-container>
    </v-row>
    <v-row v-else>
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
            <v-btn :disabled="formFields.length == 0" justify="flex-end" class="mt-3 ml-auto"  size="small" @click="editOrderMode = !editOrderMode">
              {{ !editOrderMode ? 'Editar Orden' : 'Editar Campos' }}
          </v-btn>
          </v-card-title>
          <v-card-text v-if="!editOrderMode">
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
                    class="ml-10"
                  ></v-switch>
                  <v-tooltip text="Eliminar" location="top">
                    <template v-slot:activator="{ props }">
                      <v-btn
                        icon
                        v-bind="props"
                        @click="removeField(index)"
                        style="margin-top: -25px; margin-left: 25px;"
                        size="small"
                        @mouseover="setHover(index, true)"
                        @mouseleave="setHover(index, false)"
                        :class="{'v-btn--active': isHovered(index)}"
                      >
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </template>
                  </v-tooltip>
                </div>
              </v-list-item>
            </v-list>
          </v-card-text>
          <v-card-text v-else>
            <div class="draggable-scroll-container">
              <draggable
                v-model="formFields"
                :handle="'.drag-handle'"
                @end="updateOrder"
                @move="onDragMove"
                class="draggable-container"
              >
                <template #item="{ element }">
                  <div class="draggable-item">
                    <span class="drag-handle">
                      <span style="color:purple">☰</span> {{ element.title }}
                    </span>
                  </div>
                </template>
              </draggable>
            </div>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <!--Para creacion de Form Template se visualiza boton de guardar-->
            <v-btn v-if="formFields.length > 0 && !formId" color="purple" @click="submitFormTemplate()">Guardar</v-btn>
            <!--Para edicion de Form Template se visualiza boton de actualizar-->
            <v-btn v-if="!associatedCasting && formFields.length > 0 && formId" color="purple" @click="updateFormTemplate()">Actualizar</v-btn>
            <!--Para edicion de Form de casting se visualiza boton de actualizar-->
            <v-btn v-else-if="associatedCasting && formFields.length > 0 && formId" color="purple" @click="updateCastingFormDialog = true">Actualizar</v-btn>
            <!--Para limpiar los campos agregados al template de formulario/formulario-->
            <v-btn v-if="formFields.length > 0" color="cyan" @click="formFields=[]">Limpiar</v-btn>
            <!--Para cancelacion de creacion o edicion de Form Template se visualiza boton de cancelar que llama a cancelFormTemplateCreation-->
            <v-btn v-if="!associatedCasting" variant="flat" color="grey" @click="cancelFormTemplateCreationEdition()">Cancelar</v-btn>
            <!--Para cancelacion de edicion de Form de casting se visualiza boton de cancelar que llama a cancelFormEdition-->
            <v-btn v-else-if="associatedCasting" variant="flat" color="grey" @click="cancelFormEdition()">Cancelar</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <ConfirmActionDialog
      v-model="updateCastingFormDialog"
      dialogTitle="Actualizar Formulario"
      action="Actualizar"
      @confirm-action="handleFormUpdate"
      @cancel-action="updateCastingFormDialog = false"
    >
      <template #dialog-text>
        <div style="text-align:center; font-size:16px;">Se está por actualizar el Formulario generado para el Rol <b>{{associatedRole}}</b> dentro del Casting <b>{{associatedCasting.title}}</b></div>
        <div style="text-align:center; font-size:16px;">¿Confirma la acción?</div>
      </template>
    </ConfirmActionDialog>
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
import FormService from '@/services/form.service';
import ConfirmActionDialog from '@/components/ConfirmActionDialog.vue';
import draggable from 'vuedraggable';


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
    ConfirmActionDialog,
    draggable
  },
  mounted() {
    this.$root.InformationSnackbar = this.$refs.InformationSnackbar;

    //route es diferente de router
    //Si viene con id significa que es pantalla para editar form template
    //Si viene tambien con id de casting significa que es pantalla para editar el form
    //de un casting (el form se crea a partir de un form template)
    if (this.$route.params.id && this.$route.params.castingid) {
      this.formId = this.$route.params.id;
      this.associatedCasting = {"id": this.$route.params.castingid, "title": this.$route.query.castingTitle};
      this.associatedRole = this.$route.query.roleName;
      this.loadFormData(this.formId);
    } else if (this.$route.params.id) {
      this.formId = this.$route.params.id;
      this.loadFormTemplateData(this.formId);
    }
  },
  data() {
    return {
      updateCastingFormDialog: false,
      formFields: [],
      formTitle: '',
      formId: null, //Para cuando la ruta es para la edicion del formulario, sera el id del form template para edicion de form template, y sera id de form para cuando se edita un form de un casting
      associatedCasting: null, //Si es edicion de form va a haber un casting asociado
      associatedRole: null, //Si es edicion de form va a haber un rol al cual el formulario esta asociado dentro del casting
      formCreatedDate: null,
      originalTitle: '', //Esto es para cuando la vista se usa como edicion
      tab: 'Info Básica',
      items: ['Info Básica', 'Fotos', 'Datos Físicos', 'Habilidades', 'Trabajos y Estudios'],
      buttons: {
        0: basicInfoFormFields,
        1: galleryShotFormFields,
        2: physicalCharacteristicsFormFields,
        3: skillsFormFields,
        4: studiesAndJobsFormFields
      },
      placeholderMap: {
        'text': 'Texto de respuesta breve',
        'text area': 'Texto de respuesta larga',
        'number': 'Respuesta numérica',
        'upload file': 'Agregar archivo',
        'select': 'Elegir Opción',
        'multiple select': 'Elegir Opciones',
        'date': ''
      },
      viewIsLoading: false,
      editOrderMode: false,
      hoverStates: []
    };
  },
  computed: {
    filteredButtons() {
      return this.buttons[this.tab] || [];
    },
    currentUser() {
      return this.$store.state.auth.user;
    }
  },
  methods: {
    cancelFormTemplateCreationEdition() {
      this.$router.push({ path: '/user-forms'});
    },
    cancelFormEdition() {
      this.$router.push(`/casting-call/${this.associatedCasting.id}`);
    },
    buttonDisabled(button) {
      return this.formFields.some(field => field.title === button.label);
    },
    addField(type, label, additionalText) {
      const newField = { 
        type,
        value: '',
        options: [],
        placeholder: this.placeholderMap[type] || '',
        title: label,
        additionalText,
        required: false, // Por defecto no es obligatorio
      };
      
      this.formFields.push(newField);
    },
    removeField(index) {
      this.hoverStates.splice(index, 1);
      this.formFields.splice(index, 1);
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
    async submitFormTemplate() {
      // Validar que el título no esté vacío
      if (!this.formTitle.trim()) {
        this.$root.InformationSnackbar.show({ message: "El Formulario debe tener un Título", color: 'dark', buttonColor: 'red' });
        return;
      }

      const fieldsToSend = this.formFields.map((field, index) => ({
        title: field.title,
        type: field.type,
        order: index, // El orden se basa en la posición que tiene en formFields
        is_required: field.required,
      }));

      console.log("Fields to send", fieldsToSend);

      const payload = { form_template_title: this.formTitle, form_template_fields: fieldsToSend };

      try {
        const response = await FormTemplateService.createFormTemplate(payload);
        console.log('Se agregó un nuevo template form:', response.data);
        
        this.$router.push({ path: '/user-forms', query: { title: this.formTitle } });
      } catch (error) {
        if (error.response) {
          if (error.response.status === 409) {
            this.$root.InformationSnackbar.show({ message: "Ya existe un Formulario a tu nombre con ese Título", color: 'dark', buttonColor: 'red' });
          } else {
            this.$root.InformationSnackbar.show({ message: "Hubo un problema con la solicitud", color: 'dark', buttonColor: 'red' });
          }
        } else if (error.request) {
          this.$root.InformationSnackbar.show({ message: "No se pudo conectar con el servidor", color: 'dark', buttonColor: 'red' });
        }
      }
    },
    async loadFormTemplateData(id) {
      this.viewIsLoading = true;
      try {
        const response = await FormTemplateService.getFormTemplate(id);
        const formData = response.data;
        this.formTitle = formData.form_template_title;
        this.originalTitle = formData.form_template_title;
        this.formCreatedDate = formData.created_at;
        this.formFields = formData.form_template_fields.map(field => ({
          type: field.type,
          title: field.title,
          value: '',
          options: [],
          placeholder: this.placeholderMap[field.type] || '',
          required: field.is_required,
          additionalText: ''
        }));
      } catch (error) {
        console.log('Error al cargar el template de formulario:', error);
      } finally {
        this.viewIsLoading = false; 
      }
    },
    async loadFormData(id) {
      this.viewIsLoading = true;
      try {
        const response = await FormService.getForm(id);
        const formData = response.data;
        this.formTitle = formData.form_title;
        this.originalTitle = formData.form_title;
        this.formCreatedDate = formData.created_at;
        this.formFields = formData.form_fields.map(field => ({
          type: field.type,
          title: field.title,
          value: '',
          options: [],
          placeholder: this.placeholderMap[field.type] || '',
          required: field.is_required,
          additionalText: ''
        }));
      } catch (error) {
        console.log('Error al cargar el formulario:', error);
      } finally {
        this.viewIsLoading = false; 
      }
    },
    async updateFormTemplate() {
      const fieldsToSend = this.formFields.map((field, index) => ({
        title: field.title,
        type: field.type,
        order: index, // El orden se basa en la posición que tiene en formFields
        is_required: field.required,
      }));

      const payload = {id: this.formId, original_form_template_title: this.originalTitle, form_template_title: this.formTitle, created_at: this.formCreatedDate, form_template_fields: fieldsToSend };
      
      try {
        const response = await FormTemplateService.updateFormTemplate(payload);
        console.log('Se actualizó un template form:', response.data);
        // Cambia aquí la redirección
        this.$router.push({ path: '/user-forms', query: { updating: this.formTitle } });
      } catch (error) {
        if (error.response) {
          if (error.response.status === 409) {
            this.$root.InformationSnackbar.show({ message: "Ya existe un Formulario a tu nombre con ese Título", color: 'dark', buttonColor: 'red' });
          } else {
            this.$root.InformationSnackbar.show({ message: "Hubo un problema con la solicitud", color: 'dark', buttonColor: 'red' });
          }
        } else if (error.request) {
          this.$root.InformationSnackbar.show({ message: "No se pudo conectar con el servidor", color: 'dark', buttonColor: 'red' });
        }
      }
    },
    async handleFormUpdate() {
      const fieldsToSend = this.formFields.map((field, index) => ({
        title: field.title,
        type: field.type,
        order: index, // El orden se basa en la posición que tiene en formFields
        is_required: field.required,
      }));

      const payload = {id: this.formId, form_title: this.formTitle, created_at: this.formCreatedDate, form_fields: fieldsToSend };
      
      try {
        await FormService.updateForm(payload);
        this.$router.push({ path: `/casting-call/${this.associatedCasting.id}`, query: {updatedRole: this.associatedRole } });
      } catch (error) {
        if (error.response) {
          this.$root.InformationSnackbar.show({ message: "Hubo un problema con la solicitud", color: 'dark', buttonColor: 'red' });
        } else if (error.request) {
          this.$root.InformationSnackbar.show({ message: "No se pudo conectar con el servidor", color: 'dark', buttonColor: 'red' });
        }
      }
    },
    setHover(index, value) {
      this.hoverStates[index] = value;
    },
    isHovered(index) {
      return !!this.hoverStates[index];
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
}

.actions-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 150px; 
}

.draggable-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.draggable-item {
  display: flex;
  align-items: center;
  padding: 10px;
  min-width: 350px;
  max-width: 4990px; /* Ancho fijo */
  border: 1px solid #ccc; /* Borde sutil */
  border-radius: 8px; /* Bordes redondeados */
  background-color: #f9f9f9; /* Fondo ligero */
  cursor: grab;
  margin: 2px 2px 2px 2px;
}

.draggable-item:hover {
  transform: scale(1.05); /* Efecto de aumento */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Sombra */
}

.drag-handle {
  cursor: grab; 
}

.drag-handle:active {
  cursor: grabbing; 
}

.v-btn--active {
  background-color: red !important;
  color: white !important;
}

.draggable-scroll-container {
  max-height: 300px; 
  overflow-y: auto;
  padding-right: 10px; 
}
</style>