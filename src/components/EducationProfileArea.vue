<template>
  <!-- Diálogo para confirmar la eliminación -->
<v-dialog v-model="deleteDialog" max-width="400px">
  <v-card>
    <v-card-title class="text-h6">Confirmación de Eliminación</v-card-title>
    <v-card-text>
      ¿Estás seguro de que deseás eliminar este item de estudio?
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="red" @click="confirmDelete">Eliminar</v-btn>
      <v-btn color="grey" @click="deleteDialog = false">Cancelar</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>

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
                v-model="currentEducation.studyField"
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
                v-model="currentEducation.startDate"
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
                v-model="currentEducation.endDate"
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

<div class="text-center ma-1">
  <v-btn @click="openAddEducationDialog" color="purple" icon small class="add-study-btn">
    <v-icon>mdi-plus</v-icon>
  </v-btn>
</div>

</template>

<script>
import Education from '@/models/education'
import UserService from '../services/user.service';

export default {
name: "EducationProfileArea",
props: {
  educationItems: {
    type: Array,
    default: () => []
  }
},
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
      value => (this.currentEducation.startDate && value > this.currentEducation.startDate) || 'La fecha de fin debe ser mayor a la de inicio'
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
    //Hago mapeo entre el nombre de las variables que uso en jscript y 
    //el nombre de variables que uso en el back (python)
    this.currentEducation = {
      id: education.id,
      institution: education.institution,
      studyField: education.field_of_study,
      startDate: education.start_date,
      endDate: education.end_date,
      description: education.description
    };
    console.log("end date")
    console.log(this.currentEducation.endDate)
    this.indexToUpdate = index;
    //Valido que si fecha viene vacia se refiere a que esta en curso y no se
    //debe validar el campo
    if (!this.currentEducation.endDate) {
      this.endDateRules = [];
    }
    this.isDateFieldDisabled = !this.currentEducation.endDate;
  },
  async handleSubmit() {

    this.$refs.form.validate().then(result => {
      if (result.valid) {
        const payload = {
            institution: this.currentEducation.institution,
            field_of_study: this.currentEducation.studyField,
            start_date: this.currentEducation.startDate,
            end_date: this.currentEducation.endDate,
            description: this.currentEducation.description
          };

        if (this.isEditMode) {
          UserService.updateAcademicExperience(this.currentEducation.id, payload)
            .then(response => {
              console.log('Se actualizó la experiencia académica:', response.data);
              payload.id = this.currentEducation.id;
              this.$emit('update-education', payload, this.indexToUpdate);
              this.educationDialog = false;
            })
            .catch(error => {
              console.error('Error al actualizar la experiencia académica', error);
            });
        } else {
          UserService.addAcademicExperience(payload)
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
      this.currentEducation.endDate = '';
    }
  },
  formatDate(dateString) {
    // Crea un objeto Date a partir de la cadena en formato YYYY-MM-DD
    const [year, month, day] = dateString.split('-');
    const date = new Date(year, month - 1, day);

    // Extrae el día, mes y año del objeto Date
    const dayFormatted = String(date.getDate()).padStart(2, '0');
    const monthFormatted = String(date.getMonth() + 1).padStart(2, '0'); // Meses son base 0
    const yearFormatted = date.getFullYear();

    // Devuelve la fecha en formato DD/MM/YYYY
    return `${dayFormatted}/${monthFormatted}/${yearFormatted}`;
  },
  prepareDelete(education, index) {
    this.itemToDelete = education;
    this.deleteIndex = index;
    this.deleteDialog = true;
  },
  async confirmDelete() {
    console.log(this.itemToDelete.id);
    UserService.deleteAcademicExperience(this.itemToDelete.id)
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