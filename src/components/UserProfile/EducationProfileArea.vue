<template>
  <!-- Diálogo para confirmar la eliminación -->
  <DeleteConfirmationDialog
      v-model="deleteDialog"
      itemName="estudio"
      @delete-confirmed="confirmDelete"
      @delete-cancelled="deleteDialog = false"
  />

<!-- Dialogo para agregar estudios -->
<v-dialog v-model="educationDialog" max-width="600px">
  <v-card>
    <v-card-title class="justify-center text-center">
      <span class="text-h5">{{ isEditMode ? 'Editar Estudio' : 'Agregar Estudio' }}</span>
    </v-card-title>
    <v-form ref="form" @submit.prevent="handleSubmit">
    <v-card-text>
        <v-container class="d-flex flex-wrap ga-1">
          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model="currentEducation.institution"
                label="Institución"
                :rules="classicRules"
                required
                outlined
                dense
                hide-details="auto"
              >
                <template #label>
                  <span class="text-red"><strong>* </strong></span>Institución
                </template>
              </v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="currentEducation.field_of_study"
                label="Disciplina"
                :rules="classicRules"
                required
                outlined
                dense
                hide-details="auto"
              ><template #label>
                  <span class="text-red"><strong>* </strong></span>Disciplina
                </template>
              </v-text-field>   
            </v-col>
            <v-col cols="5">
              <v-text-field
                label="Fecha Inicio"
                v-model="currentEducation.start_date"
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
                v-model="currentEducation.end_date"
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
            <v-col cols="12">
              <v-textarea
                :append-inner-icon="'mdi-pencil'"
                v-model="currentEducation.description"
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
      <v-btn color="grey" @click="educationDialog = false">Cancelar</v-btn>
    </v-card-actions>
  </v-form>
  </v-card>
</v-dialog>

<v-row align="center" justify="start">
  <v-col cols="auto">
    <p class="font-weight-bold text-h6">Estudios</p>
  </v-col>
  <v-col cols="auto">
    <v-btn @click="openAddEducationDialog" style="margin-left:0px;" color="purple" icon size="35">
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </v-col>
</v-row>

<v-card class="pa-3 my-8 elevation-2" variant="tonal" color="purple-lighten-2" v-for="(education, index) in educationItems" :key="index">
  <v-row>
    <v-col cols="3" md="3">
      <div class="caption">Institución</div>
      <div style="color:black !important">{{education.institution}}</div>
    </v-col>
    <v-col cols="3" md="3">
      <div class="caption">Disciplina</div>
      <div style="color:black !important">{{education.field_of_study}}</div>
    </v-col>
    <v-col cols="3" md="3">
      <div class="caption">Fecha de Inicio</div>
      <div style="color:black !important">{{formatDate(education.start_date)}}</div>
    </v-col>
    <v-col cols="2" md="2">
      <div class="caption">Fecha de Fin</div>
      <div style="color:black !important">{{education.end_date ? formatDate(education.end_date) : '-'}}</div>
    </v-col>
    <v-col cols="1" md="1">
      <div style="text-align: right;">
        <v-tooltip text="Editar" location="top">
          <template v-slot:activator="{ props }">
            <v-icon v-bind="props" @click="openEditEducationDialog(education, index)">mdi-pencil</v-icon>
          </template>
        </v-tooltip>
        <v-tooltip text="Eliminar" location="top">
          <template v-slot:activator="{ props }">
            <v-icon v-bind="props" @click="prepareDelete(education, index)">mdi-delete</v-icon>
          </template>
        </v-tooltip>
      </div>

    </v-col>
    <v-col v-if="education.description" cols="12">
      <div class="caption">Descripción</div>
      <div style="color:black !important">{{education.description}}</div>
    </v-col>
  </v-row>  
</v-card>

</template>

<script>
import Education from '@/models/education'
import AcademicExperienceService from '@/services/academic-experience.service';
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog.vue';
import { formatDate } from '@/utils';

export default {
name: "EducationProfileArea",
components: {
  DeleteConfirmationDialog
},
props: {
  educationItems: {
    type: Array,
    default: () => []
  }
},
emits: ['add-education', 'delete-education', 'update-education'],
data() {
  return {
    educationDialog: false,
    isEditMode: false,
    deleteDialog: false,
    itemToDelete: null,
    deleteIndex: null,
    currentEducation: new Education(null,'','','','',''),
    isDateFieldDisabled: false,
    indexToUpdate: null,
    classicRules: [
      value => !!value || 'Campo requerido',
      value => (value.length <= 50) || 'Máximo 50 caracteres',
    ],
    startDateRules: [
      value => !!value || 'Campo requerido',
      value => value.split('-')[0] >= 1900 && value.split('-')[0] <= 3000 || 'La fecha no es valida' //Validacion de año
    ],
    endDateBaseRules: [
      value => !!value || 'Campo requerido',
      value => value.split('-')[0] >= 1900 && value.split('-')[0] <= 3000 || 'La fecha no es valida', //Validacion de año
      value => (this.currentEducation.start_date && value > this.currentEducation.start_date) || 'La fecha de fin debe ser mayor a la de inicio'
    ],
    endDateRules: [],
    descriptionRules: [
      value => (value.length <= 500) || 'Máximo 500 caracteres',
    ]
  }
},
methods: {
  openAddEducationDialog() {
    this.isEditMode = false;
    this.educationDialog = true;
    this.currentEducation = new Education(null, '','','','','');
    this.isDateFieldDisabled = false;
    this.endDateRules = this.endDateBaseRules;
  },
  openEditEducationDialog(education, index) {
    this.isEditMode = true;
    this.educationDialog = true;

    this.indexToUpdate = index;
    this.currentEducation = JSON.parse(JSON.stringify(education));
    //Valido que si fecha viene vacia se refiere a que esta en curso y no se
    //debe validar el campo
    if (!this.currentEducation.end_date) {
      this.endDateRules = [];
    }
    this.isDateFieldDisabled = !this.currentEducation.end_date;
  },
  async handleSubmit() {
    this.$refs.form.validate().then(result => {
      if (result.valid) {
        if (this.isEditMode) {
          AcademicExperienceService.updateAcademicExperience(this.currentEducation.id, this.currentEducation)
            .then(response => {
              console.log('Se actualizó la experiencia académica:', response.data);
              this.$emit('update-education', this.currentEducation, this.indexToUpdate);
              this.educationDialog = false;
            })
            .catch(error => {
              console.error('Error al actualizar la experiencia académica', error);
            });
        } else {
          AcademicExperienceService.addAcademicExperience(this.currentEducation)
            .then(response => {
              console.log('Se agregó una nueva experiencia académica:', response.data);
              this.educationDialog = false;
              this.$emit('add-education', response.data);
            })
            .catch(error => {
              console.error('Error al agregar la experiencia académica', error);
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
      this.currentEducation.end_date = '';
    }
  },
  formatDate(dateString) {
    return formatDate(dateString);
  },
  prepareDelete(education, index) {
    this.itemToDelete = education;
    this.deleteIndex = index;
    this.deleteDialog = true;
  },
  async confirmDelete() {
    console.log(this.itemToDelete.id);
    AcademicExperienceService.deleteAcademicExperience(this.itemToDelete.id)
      .then( () => {
        this.$emit('delete-education', this.deleteIndex);
        this.deleteDialog = false;
      })
      .catch(error => {
        console.error('Error al eliminar experiencia académica', error);
      });
  }
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