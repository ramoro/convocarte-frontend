<template>
    <v-container>
      <!-- Cargando Casting Publicado -->
      <v-row v-if="isLoading" justify="center" align="center" style="height: 60vh;">
        <v-container class="text-center">
            <v-progress-circular indeterminate color="cyan"></v-progress-circular>
            <div>Cargando casting...</div>
        </v-container>
      </v-row>
    <v-container v-else>
      <v-row justify="center" align="center" style="width: 100%;">
        <v-col cols="12" md="8">
          <h2 class="mt-2">{{ castingCall.title }}</h2>
          <hr style="border: 1px solid rgba(0, 0, 0, 0.1);">
          <p class="mt-2">{{ castingCall.description }}</p>

          
          <v-row>
              <v-col cols="12" class="mt-4">
                  <v-chip small variant = "elevated" color="white" :class="` v-chip--active caption my-2`">
                    <v-icon size="small" class="mr-1">{{ remunerationIcon(castingCall.remuneration_type) }}</v-icon>
                    {{ castingCall.remuneration_type }}
                  </v-chip>
                  <v-chip small variant = "elevated" color="white" :class="` v-chip--active caption my-2 ml-2`">
                    <v-icon size="small" class="mr-1">{{ categoryIcon(castingCall.project_category) }}</v-icon>
                    {{ castingCall.project_category }}
                  </v-chip>
                  <v-chip small variant = "elevated" color="white" :class="` v-chip--active caption my-2 ml-2`">
                    <v-icon size="small" class="mr-1">mdi-map-marker</v-icon>
                    {{ castingCall.region }}
                  </v-chip>
              </v-col>
              <v-col cols="12">
          <v-row align="center" no-gutters>
            <v-col cols="auto">
              <v-icon class="mr-2">mdi-calendar</v-icon>
            </v-col>
            <v-col cols="auto">
              <span>Fecha de Expiración:</span>
            </v-col>
            <v-col>
              <p style="color: grey; margin-bottom: 0; margin-left: 6px;">{{ formatedExpirationDate }}</p>
            </v-col>
            <v-col class="text-right d-flex" cols="auto">
              <v-btn 
                size="small"
                class="photosBtn"
                @click="showPhotosPreview(casting)"
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
          <v-row style="margin-top:-34px;" align="center">
            <v-col cols="auto">
              <h3 class="mt-4">Nombre del Proyecto:</h3>
            </v-col>
            <v-col style="margin-left:-12px;">
              <p class="mt-4">{{castingCall.associated_project}}</p>
            </v-col>
          </v-row>
          <p class="mt-7 mb-4" style="font-size: 20px; font-weight: bold; text-decoration: underline;">
            Roles Para Postularse
          </p>
          <v-row >
            <v-col v-for="role in enabledRoles" :key="role.id" class="mt-2" align="start" cols="12" sm="6" md="6"> 
              <v-card class="mb-4" style="display: flex; flex-direction: column; height: 100%;" >
                <v-card-title>
                  <span class="headline">{{ role.name }}</span>
                </v-card-title>
                <v-card-text class="flex-grow-1">
                  <p>
                    <b v-if="role.has_limited_spots">Cupos limitados: {{ role.spots_amount }}</b>
                    <span v-else>Cupos limitados:
                      {{ 'No' }}
                    </span>
                    <span v-if="role.has_limited_spots && role.occupied_spots === role.spots_amount" 
                      class="ml-2" style="color: red; font-size: 12px;">
                      (Cupos llenos)
                    </span>
                  </p>
                  <p v-if="role.min_age_required && role.max_age_required" class="mt-1">
                    Edad: Entre {{ role.min_age_required }} y {{ role.max_age_required }} años
                  </p>
                  <p v-else-if="role.min_age_required" class="mt-1">
                    Edad: A partir de {{ role.min_age_required }} años
                  </p>
                  <p v-else-if="role.max_age_required" class="mt-1">
                    Edad: Hasta {{ role.max_age_required }} años
                  </p>
                  <p v-if="role.min_height_required && role.max_height_required" class="mt-1">
                    Altura: Entre {{ role.min_height_required }} cm y {{ role.max_height_required }} cm
                  </p>
                  <p v-else-if="role.min_height_required" class="mt-1">
                    Altura: A partir de {{ role.min_age_required }} cm
                  </p>
                  <p v-else-if="role.max_height_required" class="mt-1">
                    Altura: Hasta {{ role.max_height_required }} cm
                  </p>
                  <p v-if="role.hair_colors_required.length > 0" class="mt-1">
                    Requisitos Pelo: {{ role.hair_colors_required.join(', ') }}
                  </p>
                  <p v-if="role.additional_requirements.length > 0" class="mt-1">
                    Requisitos Adicionales: {{ role.additional_requirements }} 
                  </p>
                </v-card-text>
                <v-card-actions>
                  <v-btn
                    class="no-bg"
                    flat
                    :disabled="role.has_limited_spots && role.occupied_spots === role.spots_amount"  
                    @click="postulateForRole(role.name, role.form_id)"
                  >
                    Postularse
                  </v-btn>

                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
          <v-row justify="end" class="mt-4 mr-20">
            <v-col cols="auto">
                <v-btn color="grey" to="/casting-call-search">Volver</v-btn>
            </v-col>
        </v-row>
        </v-col>
      </v-row>
      </v-container>
      <!-- Dialogo para mostrar las fotos del casting -->
      <CastingCallPhotosDialog
        v-model="showPhotosDialog"
        :castingPhotos = "castingCall.photos"
        @cancel-action="showPhotosDialog = false"
        />
      <InformationSnackbar ref="InformationSnackbar"/>
    </v-container>
  </template>
  
  <script>
  import CastingCallPhotosDialog from '@/components/CastingCallPhotosDialog.vue';
  import InformationSnackbar from '@/components/InformationSnackbar.vue';
  import castingCallService from '@/services/casting-call.service';
  import { formatDate, getCategoryIcon, getRemunerationIcon } from '@/utils';
  
  export default {
    components: {
      InformationSnackbar,
      CastingCallPhotosDialog
    },
    data() {
      return {
        castingCall: {},
        enabledRoles: [],
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
      const castingCallId = this.$route.params.id;
      await this.loadCastingCallData(castingCallId);
      this.isLoading = false;
    },
    computed:{
        formatedExpirationDate() {
            return formatDate(this.castingCall.expiration_date);
        }
    },
    methods: {
      async loadCastingCallData(id) {
        try {
          const response = await castingCallService.getCastingCallById(id);
          const castingData = response.data;
          this.castingCall = {
            title: castingData.title,
            description: castingData.description,
            remuneration_type: castingData.remuneration_type,
            expiration_date: castingData.expiration_date,
            associated_project: castingData.project.name,
            project_category: castingData.project.category,
            region: castingData.project.region,
            photos: castingData.casting_photos
          };
          this.enabledRoles = castingData.exposed_roles.filter(role => !role.disabled).map(role => ({
            id: role.role.id,
            name: role.role.name,
            has_limited_spots: role.has_limited_spots,
            spots_amount: role.spots_amount,
            occupied_spots: role.occupied_spots,
            min_age_required: role.min_age_required,
            max_age_required: role.max_age_required,
            min_height_required: role.min_height_required,
            max_height_required: role.max_height_required,
            hair_colors_required: role.hair_colors_required ? role.hair_colors_required.split(',').map(item => item.trim()) : [],
            additional_requirements: role.additional_requirements,
            form_id: role.form.id
          }));
        } catch (error) {
          console.log('Error al cargar el casting:', error);
          this.$root.InformationSnackbar.show({
            message: 'Error al cargar el casting.',
            color: 'dark',
            buttonColor: 'red'
          });
        }
      },
      postulateForRole(exposedRoleName, formId) {
        this.$router.push(`/role-postulation-form/${exposedRoleName}/${formId}`);
      },
      showPhotosPreview() {
          this.showPhotosDialog = true;
      },
      categoryIcon(category) {
        return getCategoryIcon(category);
      },
      remunerationIcon(remunerationType) {
        return getRemunerationIcon(remunerationType);
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
  </style>