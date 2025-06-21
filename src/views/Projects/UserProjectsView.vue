<template>
  <v-container>
    <DeleteConfirmationDialog
      v-model="deleteDialog"
      itemName="proyecto"
      extraInfo="Esta acción eliminará todos los castings asociados a este proyecto."
      @delete-confirmed="confirmDelete"
      @delete-cancelled="deleteDialog = false"
    />
    <v-row>
      <v-col cols="12" class="d-flex justify-space-between align-center">
        <h1 class="projects-title">Mis Proyectos</h1>
        <div class="d-flex">
          <v-btn class="mr-3" rounded @click="reelDialog = true" to="/project/new">            
            <img 
              :src="require('@/assets/project-icon.png')"
              alt="Create Project Icon" 
              class="button-image mr-2"
              height="25"
            />Crear Proyecto
          </v-btn>
        </div>
      </v-col>
    </v-row>
    <v-row v-if="isLoading" justify="center" align="center" style="height: 60vh;">
      <v-container class="text-center">
        <v-progress-circular indeterminate color="cyan"></v-progress-circular>
        <div>Cargando proyectos...</div>
      </v-container>
    </v-row>
    <v-row v-else-if="projects.length > 0" justify="center" align="center">
      <div class="projects-list">
        <v-container class="my-10 mx-16">
          <v-row class="mb-3">
            <v-tooltip text="Ordenar por Fecha de Creación" location="top">
              <template v-slot:activator="{ props }">
                <v-btn small class="text-white ml-2" text style="text-transform: none" color="cyan" v-bind="props" @click="sort('created_at', dateOrderDesc)">
                  <v-icon left small>mdi-calendar-month</v-icon>
                  <span class="caption">Por Fecha</span>
                </v-btn>
              </template>
            </v-tooltip>
            <v-tooltip text="Ordenar por Estado" location="top">
              <template v-slot:activator="{ props }">
                <v-btn small class="text-white ml-2" text style="text-transform: none" color="cyan" v-bind="props" @click="sort('is_used', stateOrderDesc)">
                  <v-icon left small>mdi-list-status</v-icon>
                  <span class="caption">Por Estado</span>
                </v-btn>
              </template>
            </v-tooltip>
          </v-row>

          <v-card flat class="pa-3" v-for="(project, index) in projects" :key="index">
            <v-row :class="`pa-3 project ${translateState(project.is_used)}`"> 
              <v-col cols="3">
                <div class="caption text-grey">Nombre del Proyecto</div>
                <div>{{project.name}}</div>
              </v-col>
              <v-col cols="2">
                <div class="caption text-grey">Categoría</div>
                <div>{{project.category}}</div>
              </v-col>
              <v-col cols="3">
                <div class="caption text-grey">Fecha Creación</div>
                <div>{{formatDateToTextFormat(project.created_at)}}</div>
              </v-col>
              <v-col cols="2">
                <div>
                  <v-chip small variant="elevated" :class="`${translateState(project.is_used)} caption mt-2`">
                    {{project.is_used ? "Publicado" : "Sin Usar"}}
                  </v-chip>
                </div>
              </v-col>
              <v-col cols="2">
                <div justify="space-between" class="mt-2">
                  <v-tooltip text="Ver" location="top">
                    <template v-slot:activator="{ props }">
                      <v-icon v-bind="props" class="edition-icon mr-2" @click="$router.push(`/my-project/${project.id}`)">mdi-eye</v-icon>
                    </template>
                  </v-tooltip>
                  <v-tooltip text="Editar" location="top">
                    <template v-slot:activator="{ props }">
                      <v-icon v-bind="props" class="edition-icon mr-2" @click="editProject(project)">mdi-pencil</v-icon>
                    </template>
                  </v-tooltip>
                  <v-tooltip text="Eliminar" location="top">
                    <template v-slot:activator="{ props }">
                      <v-icon v-bind="props" class="remove-icon" @click="prepareDelete(project, index)">mdi-delete</v-icon>
                    </template>
                  </v-tooltip>
                </div>
              </v-col>
            </v-row>
            <v-row cols="12">
              <v-divider></v-divider>
            </v-row>
          </v-card>
        </v-container>    
      </div>
    </v-row>
    <v-row v-else class="text-h6" justify="center" align="center" style="height: 20vh;">
      <v-container class="text-center">
        Aun no hay Proyectos creados
      </v-container>
    </v-row>
    <InformationSnackbar ref="InformationSnackbar"/>
  </v-container>
</template>

<script>
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog.vue';
import InformationSnackbar from '@/components/InformationSnackbar.vue';
import ProjectService from '@/services/project.service';
import { sortBy } from '@/utils';

export default {
  components: {
    InformationSnackbar,
    DeleteConfirmationDialog
  },
  data() {
    return {
      projects: [],
      isLoading: true, // Estado de carga (para mostrar simbolo de carga hasta que esten cargados los proyectos del usuario)
      dateOrderDesc: false,
      stateOrderDesc: true,
      deleteDialog: false,
      itemToDelete: null,
    }
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    }
  },
  beforeMount() {
      if (!this.currentUser) {
        this.$router.push('/');
      }
  },
  mounted() {
    this.$root.InformationSnackbar = this.$refs.InformationSnackbar;

    if (this.$route.query.name) {
      this.$root.InformationSnackbar.show({message: 'El Proyecto ' + this.$route.query.name + ' se acaba de crear', color: 'green', buttonColor:'white'});
    } else if (this.$route.query.updating) {
      this.$root.InformationSnackbar.show({message: 'El proyecto ha sido actualizado!', color: 'green', buttonColor:'white'});
    }
  },
  created() {
    ProjectService.getUserProjects()
      .then(response => {
        this.projects = response.data;
        this.sort('created_at', this.dateOrderDesc); //Por default están ordenados por fecha 
        this.isLoading = false; 
      })
      .catch(error => {
        console.log('Error al obtener proyectos del usuario', error);
        this.isLoading = false;
      });
  },
  methods: {
    formatDateToTextFormat(dateString) {
      const options = { day: 'numeric', month: 'long', year: 'numeric' };
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', options);
    },
    sort(attribute, orderDesc) {
      sortBy(this.projects, attribute, orderDesc);
      if (attribute == 'created_at') this.dateOrderDesc = !this.dateOrderDesc;
      if (attribute == 'is_used') this.stateOrderDesc = !this.stateOrderDesc;
    },
    translateState(isUsed) {
      if (!isUsed) return "unused";
      else if(isUsed) return "used";
    },
    prepareDelete(project, index) {
      if (project.is_used) {
        this.$root.InformationSnackbar.show({message: 'El Proyecto está en uso. Para eliminarlo frená la publicación del o los castings que lo contengan.', color: 'dark', buttonColor:'red'});
        return;
      }
      this.itemToDelete = project;
      this.deleteIndex = index;
      this.deleteDialog = true;
    },
    async confirmDelete() {
      ProjectService.deleteProject(this.itemToDelete.id)
        .then( () => {
          this.projects.splice(this.deleteIndex, 1);
          this.deleteDialog = false;
        })
        .catch(error => {
          console.error('Error al eliminar proyecto', error);
        });
    },
    editProject(project) {
      if (project.is_used) {
        this.$root.InformationSnackbar.show({message: 'El Proyecto está en uso. Finalizá él o los castings que lo contengan para editarlo.', color: 'dark', buttonColor:'red'});
        return;
      }
      this.$router.push(`/project/${project.id}`);
    }
  },
};
</script>

<style scoped>
.projects-title {
  font-size: 28px;
  font-weight: bold;
}
.projects-list {
  display: flex;
  flex-direction: column;
  align-items: center; 
  justify-content: center; 
  width: 80%;
}
</style>