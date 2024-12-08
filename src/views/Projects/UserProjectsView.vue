<template>
  <v-container>

    <v-row>
      <v-col cols="12" class="d-flex justify-space-between align-center">
        <h1 class="projects-title">Mis Proyectos</h1>
        <div class="d-flex">
          <v-btn class="mr-3" rounded @click="reelDialog = true" to="/project-creation">            
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
                <v-btn small class="text-white ml-2" text style="text-transform: none" color="cyan" v-bind="props" @click="sort('state', stateOrderDesc)">
                  <v-icon left small>mdi-list-status</v-icon>
                  <span class="caption">Por Estado</span>
                </v-btn>
              </template>
            </v-tooltip>
          </v-row>

          <v-card flat class="pa-3" v-for="(project, index) in projects" :key="index">
            <v-row :class="`pa-3 project ${translateStateName(project.state)}`"> 
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
                <div><v-chip small :class="`${translateStateName(project.state)} caption mt-2`">{{project.state}}</v-chip></div>
              </v-col>
              <v-col cols="2">
                <div justify="space-between" class="mt-2">
                  <v-tooltip text="Editar" location="top">
                    <template v-slot:activator="{ props }">
                      <v-icon v-bind="props" class="edition-icon mr-2">mdi-pencil</v-icon>
                    </template>
                  </v-tooltip>
                  <v-tooltip text="Eliminar" location="top">
                    <template v-slot:activator="{ props }">
                      <v-icon v-bind="props" class="remove-icon">mdi-delete</v-icon>
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
import InformationSnackbar from '@/components/InformationSnackbar.vue';
import ProjectService from '@/services/project.service';
import { sortBy } from '@/utils';

export default {
  components: {
    InformationSnackbar,
  },
  data() {
    return {
      projects: [],
      isLoading: true, // Estado de carga (para mostrar simbolo de carga hasta que esten cargados los proyectos del usuario)
      dateOrderDesc: false,
      stateOrderDesc: true
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
      if (attribute == 'state') this.stateOrderDesc = !this.stateOrderDesc;
    },
    translateStateName(stateName) {
      if (stateName == "Sin Uso") return "unused";
      else if(stateName == "En Uso") return "used";
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
.project.unused {
  border-left: 4px solid rgb(194, 192, 192);
}
.project.used {
  border-left: 4px solid rgb(103, 235, 103);
}
.v-chip.unused {
  background: rgb(194, 192, 192);
}
.v-chip.used {
  background: rgb(103, 235, 103);
}
</style>