<template>
    <v-container style="max-width: 800px">
      <h2>Crear Proyecto</h2>
      <v-form v-model="valid" ref="form" class="mt-2">
        <!-- Nombre del Proyecto -->
        <v-text-field
          v-model="project.name"
          label="Nombre del Proyecto"
          :rules="[maxLengthRule, requiredRule].flat()" 
          required
        ></v-text-field>
  
        <!-- Descripción del Proyecto -->
        <v-textarea
          v-model="project.description"
          label="Descripción"
          :rules="descriptionRule" 
          required
        ></v-textarea>
  
        <!-- Región/Localidad -->
        <v-text-field
          v-model="project.region"
          label="Región/Localidad"
          :rules="[maxLengthRule, requiredRule].flat()" 
          required
        ></v-text-field>
  
        <!-- Categoría del Proyecto -->
        <v-select
          v-model="project.category"
          :items="categories"
          label="Categoría del Proyecto"
          :rules="requiredRule"
          required
        ></v-select>
  
        <!-- Descripción para 'Otro' -->
        <v-text-field
          v-if="project.category === 'Otro'"
          v-model="otherCategoryDescription"
          label="Descripción de 'Otro'"
          :rules="[maxLengthRule, requiredRule].flat()" 
          required
        ></v-text-field>
  
        <v-row justify="end" class="mr-2">
            <v-btn
                color="purple"
                class="mr-2"
                type="submit"
                @click.stop.prevent="submitForm()"
            >
                Guardar
            </v-btn>
            <v-btn
                text
                color="grey"
                @click="cancelProjectCreation()"
            >
                Cancelar
            </v-btn>
        </v-row>
      </v-form>
      <InformationSnackbar ref="InformationSnackbar"/>
    </v-container>
  </template>
  
  <script>
  import { projectCategories } from '@/config/project-categories';
  import projectService from '@/services/project.service';
  import InformationSnackbar from '@/components/InformationSnackbar.vue';


  export default {
    components: {
      InformationSnackbar
    },
    mounted() {
      this.$root.InformationSnackbar = this.$refs.InformationSnackbar;
    },
    data() {
      return {
        valid: false, // Valida si el formulario es correcto
        project: {
          name: '',
          description: '',
          region: '',
          category: '',
        },
        otherCategoryDescription: '',
        requiredRule: [value => !!value || 'Este campo es requerido.'],
        maxLengthRule: [
          value => (value.length <= 50) || 'Máximo 50 caracteres',
        ], 
        descriptionRule: [
          value => (value.length <= 600) || 'Máximo 600 caracteres',
        ],
        categories: projectCategories
      };
    },
    methods: {
      async submitForm() {
        if (this.$refs.form.validate()) {
          try {
              //Si eligio como categoria 'Otro' le introduzco al campo category la info puesta en otherCategoryDescription
              if (this.project.category == 'Otro') {
                this.project.category = this.otherCategoryDescription;
              }
              const response = await projectService.createProject(this.project)
              
              console.log('Se creó un nuevo proyecto', response.data);
              this.$router.push({ path: '/user-projects', query: { name: this.project.name } });
            } catch (error) {
              if (error.response) {
                if (error.response.status === 409) {
                  this.$root.InformationSnackbar.show({ message: "Ya poseés un Proyecto con ese Nombre", color: 'dark', buttonColor: 'red' });
                } else {
                  this.$root.InformationSnackbar.show({ message: "Hubo un problema con la solicitud", color: 'dark', buttonColor: 'red' });
                }
              } else if (error.request) {
                this.$root.InformationSnackbar.show({ message: "No se pudo conectar con el servidor", color: 'dark', buttonColor: 'red' });
              }
            }
        }
      },
      cancelProjectCreation() {
        this.$router.push({ path: '/user-projects'});
      }
    }
  };
  </script>
  
  <style scoped>
  </style>