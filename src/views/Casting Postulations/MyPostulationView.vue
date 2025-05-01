<template>
    <v-container>
      <!-- Cargando Casting Publicado -->
      <v-row v-if="isLoading" justify="center" align="center" style="height: 60vh;">
        <v-container class="text-center">
            <v-progress-circular indeterminate color="cyan"></v-progress-circular>
            <div>Cargando postulación...</div>
        </v-container>
      </v-row>
    <v-container v-else>
        <div align="right">
            <v-btn size="small" rounded to="/user-postulations">
                Mis Postulaciones
            </v-btn>
        </div> 
      <v-row justify="center" align="center" style="width: 100%;">
        <v-col cols="12" md="8">
            <div class="d-flex align-center justify-space-between">
                <div>
                    <h2 class="mt-2">Postulación para {{ postulationData.exposed_role.role.name }}</h2>
                </div>
                <v-chip 
                :color="getStateColor(postulationData.state)"
                class="ml-3 status-chip"
                small
                > <!--Puede estar en Pendiente/Pre-seleccionada, pero al usuario se le va a seguir mostrando como Pendiente-->
                {{ postulationData.state.includes('Pendiente') ? 'Pendiente' : postulationData.state }}
                </v-chip>
            </div>
            <p class="text-body-1 text-medium-emphasis mt-2">
                {{ postulationData.exposed_role.role.description }}
            </p>
            <hr style="border: 1px solid rgba(0, 0, 0, 0.1);">
            
            <div class="mt-3 d-flex">
                <h3>Casting: </h3>
                <p class="ml-2" style="margin-top: 2px;">{{ postulationData.casting_call.title }}</p>
            </div>
            <p v-if="postulationData.casting_call.description" class="text-body-1 text-medium-emphasis mt-2">
                Descripción: {{ postulationData.casting_call.description }}
            </p>
            <v-row>
                <v-col cols="12" class="mt-4">
                    <v-chip small variant = "elevated" color="white" :class="` v-chip--active caption my-2`">
                    <v-icon size="small" class="mr-1">{{ remunerationIcon(postulationData.casting_call.remuneration_type) }}</v-icon>
                    {{ postulationData.casting_call.remuneration_type }}
                    </v-chip>
                    <v-chip small variant = "elevated" color="white" :class="` v-chip--active caption my-2 ml-2`">
                    <v-icon size="small" class="mr-1">{{ categoryIcon(postulationData.casting_call.project.category) }}</v-icon>
                    {{ postulationData.casting_call.project.category }}
                    </v-chip>
                    <v-chip small variant = "elevated" color="white" :class="` v-chip--active caption my-2 ml-2`">
                    <v-icon size="small" class="mr-1">mdi-map-marker</v-icon>
                    {{ postulationData.casting_call.project.region }}
                    </v-chip>
                </v-col>
                <div class="mt-2 ml-3 d-flex">
                    <v-icon class="mr-2">mdi-state-machine</v-icon><p>Estado:</p>
                    <p :class="`${postulationData.casting_call.state} mx-2`">{{ postulationData.casting_call.state}}</p>
                </div>
              <v-col cols="12">
                <v-row align="center" no-gutters>
                <v-col cols="auto">
                    <v-icon class="mr-2">mdi-calendar</v-icon>
                </v-col>
                <v-col cols="auto">
                    <span>Fecha de Postulación:</span>
                </v-col>
                <v-col>
                    <p style="color: grey; margin-bottom: 0; margin-left: 6px;">{{ formatedPublicationDate }}</p>
                </v-col>
                <v-col class="text-right d-flex" cols="auto">
                    <v-btn 
                    size="small"
                    class="photosBtn"
                    @click="showPhotosPreview(postulationData.casting_call)"
                    >
                    Preview Fotos
                    </v-btn>
                </v-col>
                </v-row>
                </v-col>
                </v-row>
          <hr class="mt-4" style="border: 1px solid rgba(0, 0, 0, 0.1);">
        </v-col>
      </v-row>
    
      <v-row justify="center" align="center" style="width: 100%;">
        <v-col cols="12" md="8">
            <div class="d-flex">
                <h3>Nombre del Proyecto:</h3>
                <p class="ml-2" style="margin-top: 2px !important; " >{{ postulationData.casting_call.project.name }}</p>
            </div>
            <div>
                <p class="text-body-1 text-medium-emphasis mt-2">
                    {{ postulationData.casting_call.description }}
                </p>
            </div>
        </v-col>
      </v-row>
      </v-container>
      <!-- Dialogo para mostrar las fotos del casting -->
      <CastingCallPhotosDialog
        v-model="showPhotosDialog"
        :castingPhotos = "postulationData.casting_call?.casting_photos || []"
        @cancel-action="showPhotosDialog = false"
        />
      <InformationSnackbar ref="InformationSnackbar"/>
    </v-container>
  </template>
  
  <script>
  import CastingCallPhotosDialog from '@/components/CastingCallPhotosDialog.vue';
  import InformationSnackbar from '@/components/InformationSnackbar.vue';
  import CastingPostulationService from '@/services/casting-postulation.service';
  import { formatDate, getCategoryIcon, getRemunerationIcon, getPostulationStateColor } from '@/utils';
  
  export default {
    components: {
      InformationSnackbar,
      CastingCallPhotosDialog
    },
    data() {
      return {
        postulationData: {},
        isLoading: true,
        showPhotosDialog: false
      };
    },
    beforeMount() {
      if (!this.$store.state.auth.user) {
        this.$router.push('/');
      }
    },
    async mounted() {
      this.$root.InformationSnackbar = this.$refs.InformationSnackbar;
      const castingPostulationId = this.$route.params.postulationId;
      await this.loadCastingPostulationData(castingPostulationId);
      this.isLoading = false;
    },
    computed:{
        formatedPublicationDate() {
            return formatDate(this.postulationData.created_at.split('T')[0]); //Es un timezone, por lo que se splitea para obtener solo la fecha
        }
    },
    methods: {
      async loadCastingPostulationData(id) {
        try {
          const response = await CastingPostulationService.getCastingPostulationById(id);
          this.postulationData = response.data;
          console.log(this.postulationData);
        } catch (error) {
          console.log('Error al cargar el postulacion:', error);
          this.$root.InformationSnackbar.show({
            message: 'Error al cargar la postulacion.',
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
      remunerationIcon(remunerationType) {
        return getRemunerationIcon(remunerationType);
      },
      getStateColor(state) {
        return getPostulationStateColor(state);
      }
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