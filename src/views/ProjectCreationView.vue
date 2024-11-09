<template>
  <!-- Dialogo para agregar roles al proyecto -->
  <v-dialog v-model="addRoleDialog" max-width="600px">
    <v-card>
      <v-card-title class="justify-center text-center">
        <span class="text-h5">Agregar Rol</span>
        <p class="text-center text-red" style="font-size: 16px;" v-if="sameRoleNameError">El proyecto ya tiene un rol con el nombre {{ roleErrorName }}</p>
      </v-card-title>
      <v-form ref="formRole" @submit.prevent="handleRoleSubmit">
        <v-card-text>
            <v-container class="d-flex flex-wrap ga-1">
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="currentRole.name"
                    label="Nombre"
                    :rules="[maxLengthRule, requiredRule].flat()" 
                    hide-details="auto"
                  >
                    <template #label>
                      <span class="text-red"><strong>* </strong></span>Nombre
                    </template>
                  </v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="currentRole.description"
                    label="Descripción"
                    :rules="descriptionRule"
                    hide-details="auto"
                  >
                  </v-textarea>
                </v-col>
              </v-row>
            </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="purple" type="submit" v-if="!editRoleMode">Guardar</v-btn>
          <v-btn color="purple" type="submit" v-else>Actualizar</v-btn>
          <v-btn color="grey" @click="addRoleDialog = false">Cancelar</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
  <v-container style="max-width: 1200px">
    <h2 class="mb-5">Crear Proyecto</h2>
    <v-row>

      <!-- Formulario principal al costado derecho -->
      <v-col cols="12" md="8">
        <v-form v-model="valid" ref="form" class="mt-2">
          <!-- Nombre del Proyecto -->
          <v-text-field
            v-model="project.name"
            label="Nombre del Proyecto"
            :rules="[maxLengthRule, requiredRule].flat()" 
            required
          >
          <template #label>
            <span class="text-red"><strong>* </strong></span>Nombre del Proyecto
          </template>
        </v-text-field>

          <!-- Descripción del Proyecto -->
          <v-textarea
            v-model="project.description"
            label="Descripción"
            :rules="descriptionRule" 
            required
          ></v-textarea>

          <!-- Región-->
          <v-select
            v-model="project.region"
            label="Región"
            :items="regions"
            :rules="requiredRule" 
            required
          >
            <template #label>
              <span class="text-red"><strong>* </strong></span>Región
            </template>
          </v-select>

          <!-- Categoría del Proyecto -->
          <v-select
            v-model="project.category"
            :items="categories"
            label="Categoría del Proyecto"
            :rules="requiredRule"
            required
          >
          <template #label>
            <span class="text-red"><strong>* </strong></span>Categoría del Proyecto
          </template>
          </v-select>

          <!-- Descripción para 'Otro' -->
          <v-text-field
            v-if="project.category === 'Otro'"
            v-model="otherCategoryDescription"
            label="Descripción de 'Otro'"
            :rules="[maxLengthRule, requiredRule].flat()" 
            required
          >
            <template #label>
              <span class="text-red"><strong>* </strong></span>Descripción de 'Otro'
            </template>
          </v-text-field>

          <!-- Botones de Acción -->
          <v-row justify="end" class="mt-20 mr-2">
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
      </v-col>

      <!-- Card para agregar rol al costado izquierdo -->
      <v-col cols="12" md="4" class="d-flex justify-center">
        <v-card class="pa-4" elevation="2" style="min-width: 350px;" >
          <v-card-title>
            <v-row justify="space-between">
              <h5>Roles del Proyecto</h5>
              <v-btn size="small" color="purple" @click="openAddRoleDialog">Agregar Rol </v-btn>
            </v-row>
          </v-card-title>
          <v-card-text class="mt-5" style=" height: 350px; overflow-y: scroll">
            <!-- Mostrar los roles agregados -->
            <v-col v-for="(role, index) in projectRoles" :key="index" cols="12">
              <v-card elevation="1" class="cyan-border pa-3" style="display: flex; flex-direction: column; height: 90px;">
                <v-card-actions class="d-flex">
                  <!-- Nombre del Rol ocupa el espacio disponible -->
                  <p class="caption" style="flex-grow: 1; margin: 0; min-width:150px">{{ role.name }}</p>
                  
                  <!-- Contenedor para los botones de acción -->
                  <v-container class="d-flex justify-end pa-0">
                    <v-tooltip text="Editar" location="top">
                      <template v-slot:activator="{ props }">
                        <v-icon v-bind="props" class="edition-icon mr-2" @click="editRole(index)">mdi-pencil</v-icon>
                      </template>
                    </v-tooltip>
                    <v-tooltip text="Eliminar" location="top">
                      <template v-slot:activator="{ props }">
                        <v-icon v-bind="props" class="remove-icon" @click="deleteRole(index)">mdi-delete</v-icon>
                      </template>
                    </v-tooltip>
                  </v-container>
                </v-card-actions>
              </v-card>
            </v-col>

          </v-card-text>
        </v-card>
      </v-col>

    </v-row>
    <InformationSnackbar ref="InformationSnackbar"/>
  </v-container>
</template>

<script>
import { projectCategories } from '@/config/project-categories';
import { argentineRegions } from '@/config/regions';
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
      categories: projectCategories,
      regions: argentineRegions,
      addRoleDialog: false,
      currentRole: {
        name: '',
        description: ''
      },
      projectRoles: [],
      sameRoleNameError: false,
      roleErrorName: '',
      editRoleMode: false,
      indexOnEdition: null
    };
  },
  methods: {
    async submitForm() {
      if (this.$refs.form.validate()) {
        try {
            if (this.projectRoles.length == 0) {
              console.log("Entro al if")
              this.$root.InformationSnackbar.show({ message: "El proyecto debe poseer al menos un Rol", color: 'dark', buttonColor: 'red' });
              return;
            }

            //Si eligió como categoría 'Otro' le introduzco al campo category la info puesta en otherCategoryDescription
            if (this.project.category == 'Otro') {
              this.project.category = this.otherCategoryDescription;
            }

            const payload = { 
              name: this.project.name,
              description: this.project.description,
              region: this.project.region,
              category: this.project.category, 
              roles: this.projectRoles 
            };

            const response = await projectService.createProject(payload)

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
    },
    openAddRoleDialog() {
      this.addRoleDialog = true;
      this.editRoleMode = false;
      this.sameRoleNameError = false;
      this.currentRole = { name: '', description: '' };
    },
    async handleRoleSubmit() {

      //Si ya hay algun rol en el proyecto con ese nombre no se debe poder guardar,
      //a menos que este en modo edicion y el nombre sea el mismo del rol que se esta editando
      //en ese caso se saltea la validacion
      for (let index = 0; index < this.projectRoles.length; index++) {
        if (this.editRoleMode && index == this.indexOnEdition) {
          continue;
        } else if(this.projectRoles[index].name === this.currentRole.name) {
          this.sameRoleNameError = true;
          this.roleErrorName = this.currentRole.name;
          return;
        }
      }

      this.sameRoleNameError = false;

      this.$refs.formRole.validate().then(result => {
        if (result.valid) {
          
          //Si esta editando el rol actualizamos el ya existente, sino lo agregamos
          if (this.editRoleMode) {
            this.projectRoles[this.indexOnEdition] = {...this.currentRole};
          } else {
            this.projectRoles.push(this.currentRole);
          }

          this.addRoleDialog = false;

        } else {
          console.log("FORM INVALIDO");
        }
      })
    },
    editRole(index) {
      this.addRoleDialog = true;
      this.sameRoleNameError = false;
      this.currentRole = {...this.projectRoles[index]};
      this.editRoleMode = true;
      this.indexOnEdition = index;
    },
    deleteRole(index) {
      this.projectRoles.splice(index, 1);
    }
  }
};
</script>

<style scoped>

.cyan-border {
  border-top: 3px solid rgb(2, 151, 156);
}
</style>