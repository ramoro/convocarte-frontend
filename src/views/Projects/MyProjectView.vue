<template>
    <v-container>
      <!-- Cargando Proyecto -->
      <v-row v-if="isLoading" justify="center" align="center" style="height: 60vh;">
        <v-container class="text-center">
            <v-progress-circular indeterminate color="cyan"></v-progress-circular>
            <div>Cargando proyecto...</div>
        </v-container>
      </v-row>
    <v-container v-else>
        <div align="right">
            <v-btn size="small" rounded to="/user-projects">
                Mis Proyectos
            </v-btn>
        </div> 
      <v-row justify="center" align="center" style="width: 100%;">
        <v-col cols="12" md="8">
            <div class="d-flex align-center justify-space-between">
                <div>
                    <h2 class="mt-2">Proyecto: {{ projectData?.name }}</h2>
                </div>
                <v-chip small variant="elevated" :class="`${translateState(projectData.is_used)} caption mt-2`">
                  {{projectData.is_used ? "Publicado" : "Sin Usar"}}
                </v-chip>
            </div>
            <p class="text-body-1 text-medium-emphasis mt-2 mb-2">
                {{ projectData?.description }}
            </p>
            <hr style="border: 1px solid rgba(0, 0, 0, 0.1);">

            <div class="mt-3 d-flex">
                <h3>Clasificación </h3>
            </div>

            <v-row>
                <v-col cols="12" class="mt-4">
                    <v-chip small variant = "elevated" color="white" :class="` v-chip--active caption my-2 ml-2`">
                      <v-icon size="small" class="mr-1">{{ categoryIcon(projectData?.category) }}</v-icon>
                      {{ projectData?.category }}
                    </v-chip>
                    <v-chip small variant = "elevated" color="white" :class="` v-chip--active caption my-2 ml-2`">
                      <v-icon size="small" class="mr-1">mdi-map-marker</v-icon>
                      {{ projectData?.region }}
                    </v-chip>
                </v-col>
            </v-row>
            <div class="mt-3 d-flex">
                <h3>Roles </h3>
            </div>
            <v-row class="mt-4">
                <v-col 
                  v-for="(role, index) in projectData.roles" 
                  :key="index" 
                  cols="12" sm="6" md="4" lg="3"
                  class="mx-3"
                >
                  <v-card 
                    elevation="1" 
                    class="cyan-border pa-3" 
                    min-height="150px"
                    min-width="200px"  
                    height="100%"
                  >
                    <!-- Nombre del Rol en negrita -->
                    <p class="font-weight-bold text-body-1 mb-2">
                      {{ role.name }}
                    </p>
                    
                    <!-- Descripción con texto normal y scroll si es muy largo -->
                    <p 
                      class="text-body-2" 
                      style="overflow-y: auto; max-height: 100px;"  
                    >
                      {{ role.description || 'Sin descripción' }}
                    </p>
                    <div
                      v-if="role.assigned_user_name" 
                      class="text-caption text-green text-center mt-auto pt-2" 
                    >
                      <v-chip 
                        color="green"
                        elevated
                        size="small"
                        class="mx-auto mt-3"
                        variant="flat"
                      >
                      <v-icon small class="mr-1 mb-1">mdi-account-check</v-icon>
                      {{ role.assigned_user_name }}

                      </v-chip>
                    </div>
                  </v-card>
                </v-col>
              </v-row>
            <div class="mt-6 d-flex">
                <h3>Castings Publicados </h3>
            </div>
            <div class="mt-2 ml-4">
              <div 
                v-for="(casting, index) in projectData.castings" 
                :key="index"
                class="text-body-1 mb-1"
              >
                - {{ casting.title }}     
                <span :class="casting.state === 'Publicado' ? 'text-green' : 'text-grey'">
                  ({{ casting.state }})
                </span>
              </div>
            </div>
        </v-col>
      </v-row>
      </v-container>

      <InformationSnackbar ref="InformationSnackbar"/>
    </v-container>
  </template>
  
  <script>
  import InformationSnackbar from '@/components/InformationSnackbar.vue';
  import ProjectService from '@/services/project.service';
  import { getCategoryIcon } from '@/utils';
  
  export default {
    components: {
      InformationSnackbar
    },
    data() {
      return {
        projectData: {},
        isLoading: true,
      };
    },
    beforeMount() {
      if (!this.$store.state.auth.user) {
        this.$router.push('/');
      }
    },
    async mounted() {
      this.$root.InformationSnackbar = this.$refs.InformationSnackbar;
      this.isLoading = false;
    },
    async created() {
      const projectId = this.$route.params.projectId;
      await this.loadProjectData(projectId);
    },
    computed:{
      currentUser() {
        return this.$store.state.auth.user;
      }
    },
    methods: {
      async loadProjectData(id) {
        try {
          const response = await ProjectService.getProject(id);
          this.projectData = response.data;
          console.log(this.projectData);
        } catch (error) {
          console.log('Error al cargar el proyecto:', error);
          this.$root.InformationSnackbar.show({
            message: 'Error al cargar el proyecto.',
            color: 'dark',
            buttonColor: 'red'
          });
        }
      },
      showPhotosPreview() {
          this.showPhotosDialog = true;
      },
      categoryIcon(category) {
        return getCategoryIcon(category);
      },
      translateState(isUsed) {
        if (!isUsed) return "unused";
        else if(isUsed) return "used";
      },
    }
  };
  </script>
  
<style scoped>
    .headline {
    font-size: 21px;
    font-weight: bold;
    }

    .photosBtn {
    color: purple;
    }

    .no-bg {
    background-color: transparent !important;
    color: purple;
    }
    .status-chip {
        font-weight: 600;
        letter-spacing: 0.5px;
        min-width: 100px;
        justify-content: center;
        text-transform: uppercase;
        font-size: 0.75rem;
    }
    
</style>