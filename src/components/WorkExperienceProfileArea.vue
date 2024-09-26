<template>
  <!-- Diálogo para confirmar la eliminación -->
<v-dialog v-model="deleteDialog" max-width="400px">
  <v-card>
    <v-card-title class="text-h6">Confirmación de Eliminación</v-card-title>
    <v-card-text>
      ¿Estás seguro de que deseás eliminar este item de experiencia laboral?
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="red" @click="confirmDelete">Eliminar</v-btn>
      <v-btn color="grey" @click="deleteDialog = false">Cancelar</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>

<!-- Dialogo para agregar estudios -->
<v-dialog v-model="workExperienceDialog" max-width="600px">
  <v-card>
    <v-card-title class="justify-center text-center">
      <span class="text-h5">{{ isEditMode ? 'Editar Experiencia Laboral' : 'Agregar Experiencia Laboral' }}</span>
    </v-card-title>
    <v-form ref="form" @submit.prevent="handleSubmit">
    <v-card-text>
        <v-container class="d-flex flex-wrap ga-1">
          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model="currentWorkExperience.work_title"
                label="Título del Proyecto"
                :rules="requiredAndLengthRules"
                required
                outlined
                dense
                hide-details="auto"
              >
                <template #label>
                  <span class="text-red"><strong>* </strong></span>Título del Proyecto
                </template>
              </v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="currentWorkExperience.role"
                label="Rol"
                :rules="requiredAndLengthRules"
                required
                outlined
                dense
                hide-details="auto"
              ><template #label>
                  <span class="text-red"><strong>* </strong></span>Rol
                </template>
              </v-text-field>   
            </v-col>
            <v-col cols="5">
              <v-text-field
                label="Fecha Inicio"
                v-model="currentWorkExperience.start_date"
                :rules="startDateRules"
                type="date"
                class="date-field"
                outlined
                dense
                hide-details="auto"
              >
                <template #label>
                    <span class="text-red"><strong>* </strong></span>Fecha Inicio
                </template>
              </v-text-field>
            </v-col>
            <v-col cols="5">
              <v-text-field
                label="Fecha Fin"
                v-model="currentWorkExperience.end_date"
                type="date"
                :rules="endDateRules"
                :disabled="isDateFieldDisabled"
                class="date-field mr-1"
                outlined
                dense
                hide-details="auto"
              >
                <template #label>
                  <span class="text-red"><strong>* </strong></span>Fecha Fin
                </template>
              </v-text-field>
            </v-col>
            <v-col cols="2" class="d-flex align-center">
              <v-btn 
                @click="toggleDateField" 
                :class="{'green-bg': isDateFieldDisabled, 'grey--text': !isDateFieldDisabled}"
                style="font-size: 10px"
              >
                En curso
              </v-btn>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="currentWorkExperience.producer"
                label="Productora"
                :rules="onlyLengthRule"
                required
                outlined
                dense
                hide-details="auto"
              >
              </v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="currentWorkExperience.project_url"
                label="Link al Proyecto"
                :append-inner-icon="'mdi-link-variant'"
                :rules="onlyLengthRule"
                required
                outlined
                dense
                hide-details="auto"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12">
              <v-textarea
                :append-inner-icon="'mdi-pencil'"
                v-model="currentWorkExperience.description"
                label="Descripción"
                :rules="descriptionRules"
                outlined
                dense
                hide-details="auto"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-container>
      
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="purple" type="submit">{{ isEditMode ? 'Actualizar' : 'Guardar' }}</v-btn>
      <v-btn color="grey" @click="workExperienceDialog = false">Cancelar</v-btn>
    </v-card-actions>
  </v-form>
  </v-card>
</v-dialog>

<v-row align="center" justify="start">
  <v-col cols="auto">
    <p class="font-weight-bold text-h6">Experiencias Laborales</p>
  </v-col>
  <v-col cols="auto">
    <v-btn @click="openAddWorkExperienceDialog" style="margin-left:0px;" color="cyan" icon size="35" class="text-white">
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </v-col>
</v-row>


<v-card class="pa-3 my-8 elevation-2" variant="tonal" color="cyan-darken-2" v-for="(workExperience, index) in workExperienceItems" :key="index">
  <v-row>
    <v-col cols="3" md="3">
      <div class="caption">Título del Proyecto</div>
      <div style="color:black !important">{{workExperience.work_title}}</div>
    </v-col>
    <v-col cols="3" md="3">
      <div class="caption">Rol</div>
      <div style="color:black !important">{{workExperience.role}}</div>
    </v-col>
    <v-col cols="3" md="3">
      <div class="caption">Fecha de Inicio</div>
      <div style="color:black !important">{{formatDate(workExperience.start_date)}}</div>
    </v-col>
    <v-col cols="2" md="2">
      <div class="caption">Fecha de Fin</div>
      <div style="color:black !important">{{workExperience.end_date ? formatDate(workExperience.end_date) : '-'}}</div>
    </v-col>
    <v-col cols="1" md="1">
      <div style="text-align: right;">
        <v-tooltip text="Editar" location="top">
          <template v-slot:activator="{ props }">
            <v-icon v-bind="props" @click="openEditWorkExperienceDialog(workExperience, index)">mdi-pencil</v-icon>
          </template>
        </v-tooltip>
        <v-tooltip text="Eliminar" location="top">
          <template v-slot:activator="{ props }">
            <v-icon v-bind="props" @click="prepareDelete(workExperience, index)">mdi-delete</v-icon>
          </template>
        </v-tooltip>
      </div>

    </v-col>
    <v-col v-if="workExperience.producer" cols="3">
      <div class="caption">Productora</div>
      <div style="color:black !important">{{workExperience.producer}}</div>
    </v-col>
    <v-col v-if="workExperience.project_url" cols="6">
      <div class="caption">Link al Proyecto</div>
      <div style="color:black !important" >    <a :href="formatUrl(workExperience.project_url)">
      {{ workExperience.project_url }}
    </a></div>
    </v-col>
    <v-col v-if="workExperience.description" cols="12">
      <div class="caption">Descripción</div>
      <div style="color:black !important">{{workExperience.description}}</div>
    </v-col>
  </v-row>  
</v-card>

</template>

<script>
import WorkExperience from '@/models/work-experience'
import UserService from '../services/user.service';
import { formatDate, formatUrl } from '@/utils';

export default {
name: "WorkExperienceProfileArea",
props: {
  workExperienceItems: {
    type: Array,
    default: () => []
  }
},
emits: ['add-work-experience', 'delete-work-experience', 'update-work-experience'],
data() {
  return {
    workExperienceDialog: false,
    isEditMode: false,
    deleteDialog: false,
    itemToDelete: null,
    deleteIndex: null,
    currentWorkExperience: new WorkExperience(null,'', '', '','','','',''),
    isDateFieldDisabled: false,
    indexToUpdate: null,
    requiredAndLengthRules: [
      value => !!value || 'Campo requerido',
      value => (value.length <= 50) || 'Máximo 50 caracteres',
    ],
    onlyLengthRule: [
      value => (value.length <= 50) || 'Máximo 50 caracteres',
    ],
    startDateRules: [
      value => !!value || 'Campo requerido',
      value => value.split('-')[0] >= 1900 && value.split('-')[0] <= 3000 || 'La fecha no es valida' //Validacion de año
    ],
    endDateBaseRules: [
      value => !!value || 'Campo requerido',
      value => value.split('-')[0] >= 1900 && value.split('-')[0] <= 3000 || 'La fecha no es valida', //Validacion de año
      value => (this.currentWorkExperience.start_date && value > this.currentWorkExperience.start_date) || 'La fecha de fin debe ser mayor a la de inicio'
    ],
    endDateRules: [],
    descriptionRules: [
      value => (value.length <= 500) || 'Máximo 500 caracteres',
    ]
  }
},
methods: {
  openAddWorkExperienceDialog() {
    this.isEditMode = false;
    this.workExperienceDialog = true;
    this.currentWorkExperience = new WorkExperience(null, '', '', '','','','','');
    this.isDateFieldDisabled = false;
    this.endDateRules = this.endDateBaseRules;
  },
  openEditWorkExperienceDialog(workExperience, index) {
    this.isEditMode = true;
    this.workExperienceDialog = true;

    this.currentWorkExperience = JSON.parse(JSON.stringify(workExperience));
    this.indexToUpdate = index;
    //Valido que si fecha viene vacia se refiere a que esta en curso y no se
    //debe validar el campo
    if (!this.currentWorkExperience.end_date) {
      this.endDateRules = [];
    }
    this.isDateFieldDisabled = !this.currentWorkExperience.end_date;
  },
  async handleSubmit() {

    this.$refs.form.validate().then(result => {
      if (result.valid) {
        if (this.isEditMode) {
          UserService.updateWorkExperience(this.currentWorkExperience.id, this.currentWorkExperience)
            .then(response => {
              console.log('Se actualizó la experiencia laboral:', response.data);
              this.$emit('update-work-experience', this.currentWorkExperience, this.indexToUpdate);
              this.workExperienceDialog = false;
            })
            .catch(error => {
              console.error('Error al actualizar la experiencia laboral', error);
            });
        } else {
          UserService.addWorkExperience(this.currentWorkExperience)
            .then(response => {
              console.log('Se agregó una nueva experiencia laboral:', response.data);
              this.workExperienceDialog = false;
              this.$emit('add-work-experience', response.data);
            })
            .catch(error => {
              console.error('Error al agregar la experiencia laboral', error);
            });
        }
      } else {
        console.log("FORM INVALIDO");
        console.log(result.errors);
      }
    }).catch(error => {
      console.error("Error al validar el formulario", error);
    });
  },
  toggleDateField() {
    //Si esta deshabilitado el boton de fecha fin se deben remover sus reglas
    this.isDateFieldDisabled = !this.isDateFieldDisabled;
    this.endDateRules = this.endDateBaseRules;
    if (this.isDateFieldDisabled) {
      this.endDateRules = [];
      this.currentWorkExperience.end_date = '';
    }
  },
  formatDate(dateString) {
    return formatDate(dateString);
  },
  formatUrl(url) {
    return formatUrl(url);
  },
  prepareDelete(workExperience, index) {
    this.itemToDelete = workExperience;
    this.deleteIndex = index;
    this.deleteDialog = true;
  },
  async confirmDelete() {
    console.log(this.itemToDelete.id);
    UserService.deleteWorkExperience(this.itemToDelete.id)
      .then( () => {
        this.$emit('delete-work-experience', this.deleteIndex);
        this.deleteDialog = false;
      })
      .catch(error => {
        console.error('Error al eliminar experiencia académica', error);
      });
  },

}
};
</script>

<style scoped>
.v-text-field {
margin: 0;
padding: 0;
}

.green-bg {
background-color: #4caf50 !important;
color: white;
}

.grey--text {
color: #9e9e9e; 
}
</style>