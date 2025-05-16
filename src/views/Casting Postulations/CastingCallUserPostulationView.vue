<template>
  <v-container class="postulation-container">
    <!-- Spinner de carga -->
    <v-row v-if="isLoading" justify="center" align="center" class="loading-row">
      <v-container class="text-center">
        <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
        <div class="loading-text mt-4">Cargando datos de la postulación...</div>
      </v-container>
    </v-row>
    
    <!-- Contenido principal -->
    <v-container v-else class="postulation-content">
      <v-row justify="center" class="mb-6">
        <v-col cols="12" md="8">
          <div class="d-flex align-center" style="position: relative;">
            <v-avatar size="65" class="mr-3">
              <v-img 
                :src="postulationData?.['Foto de Perfil'] || require('@/assets/empty-photo.png')" 
                alt="Foto de Perfil"
              />
            </v-avatar>
            <h1 class="postulation-title mb-0 flex-grow-1">{{ postulationData?.['Nombre y Apellido'] ?? '' }}</h1>
            <v-btn 
              rounded 
              @click="goBack()"
              class="ml-auto"
              style="position: absolute; right: 0;"
            >
              Volver
            </v-btn>
          </div>
        </v-col>
      </v-row>

      <!-- Sección de datos de postulación -->
      <v-row justify="center">
        <v-col cols="12" md="8">
          <!-- Encabezado expandible -->
          <div 
            class="section-header" 
            @click="isPostulationDataExpanded = !isPostulationDataExpanded"
          >
            <v-icon class="mr-2" color="cyan-darken-2">
              {{ isPostulationDataExpanded ? 'mdi-chevron-down' : 'mdi-chevron-right' }}
            </v-icon>
            <h2 class="section-title">Datos de la Postulación</h2>
          </div>

          <!-- Contenido expandible -->
          <v-expand-transition>
            <v-card v-show="isPostulationDataExpanded" class="mt-4 data-card" flat>
              <v-card-text>
                <!-- Primera fila especial para el perfil del usuario -->
                <div class="data-row">
                  <div class="field-container">
                    <span class="field-name">Perfil del usuario:</span>
                    <span class="field-value ml-2">
                      <RouterLink :to="'/user-profile/' + postulatedUserId" >
                        Ver perfil completo
                      </RouterLink>
                    </span>
                  </div>
                  <v-divider class="my-2"></v-divider>
                </div>
                <div 
                  v-for="(fieldValue, fieldName) in postulationData" 
                  :key="fieldName"
                  class="data-row"
                >
                  <template v-if="fieldName !== 'Nombre y Apellido' &&
                  fieldName !== 'Foto de Perfil'">
                    <div class="field-container">
                      <span class="field-name">{{ fieldName }}:</span>
                      
                      <DownloadFileChip 
                        v-if="fieldName === 'Curriculum'"
                        chipText="Curriculum" 
                        chipImageFileName="logo-pdf-2.png"
                        chipColor="red"
                        class="ml-2"
                        :isClosable="false"
                        :fileUrl=fieldValue
                      />
                      
                      <v-chip 
                        v-else-if="fieldName.includes('Foto')" 
                        class="file-chip ml-2"
                        @click="openImgDialog(fieldValue)"
                      >
                        <v-img 
                          :src="require('@/assets/gallery-icon.png')"
                          alt="Gallery Icon" 
                          class=" mr-2"
                          height="20"
                          width="20"
                        />
                        <span >{{ fieldName }}</span>
                      </v-chip>
                      
                      <!-- Otros campos -->
                      <span v-else class="field-value ml-2">
                        <a v-if="socialNetworks.includes(fieldName)" :href="fieldValue">{{ fieldValue || 'No especificado' }}</a>
                        <a v-else>{{ fieldValue || 'No especificado' }}</a>
                      </span>
                    </div>
                    <v-divider class="my-2"></v-divider>
                  </template>
                </div>
              </v-card-text>
            </v-card>
          </v-expand-transition>
          
          <v-divider class="my-6"></v-divider>
        </v-col>
      </v-row>

      <v-dialog v-model="dialog" max-width="30%">
      <v-card class="pa-0" tile>
        <v-img :src="imageSrc" class="image-modal" />
      </v-card>
    </v-dialog>
    </v-container>

    <InformationSnackbar ref="InformationSnackbar"/>
  </v-container>
</template>
  
  <script>
  import InformationSnackbar from '@/components/InformationSnackbar.vue';
  import CastingPostulacionService from '@/services/casting-postulation.service';
  import DownloadFileChip from '@/components/DownloadFileChip.vue';  
  
  export default {
    components: {
      InformationSnackbar,
      DownloadFileChip
    },
    data() {
      return {
        isLoading: true,
        postulationData: null,
        isPostulationDataExpanded: true,
        socialNetworks: ['Instagram', 'Facebook', 'Sitio Web', 'Canal de Youtube'],
        formValid: false,
        imageSrc: '',
        dialog: false,
        exposedRoleId: null,
        castingCallId: null,
        postulatedUserId: null
      };
    },
    beforeMount() {
      if (!this.$store.state.auth.user) {
        this.$router.push('/');
      }
    },
    created() {
      this.loadPostulationData();
    },
    methods: {
      async loadPostulationData() {
      try {
        const postulationId = this.$route.params.postulationId;
        const response = await CastingPostulacionService.getCastingPostulationById(postulationId);

        this.postulatedUserId = response.data.owner_id;
        this.exposedRoleId = response.data.exposed_role.id;
        this.castingCallId = response.data.casting_call.id;
        this.postulationData = JSON.parse(response.data.postulation_data);
      } catch (error) {
        console.error('Error al obtener postulación:', error);
        this.$root.InformationSnackbar.show({
          message: 'Error al cargar los datos de la postulación',
          color: 'error'
        });
      } finally {
        this.isLoading = false;
      }
    },

    openImgDialog(url) {
      this.imageSrc = url;  // Asignamos la URL de la imagen
      this.dialog = true;
    },

    goBack() {
      this.$router.push({ name: 'castingcallpostulations', 
      params: { castingCallId: this.castingCallId}, query:{ roleId: this.exposedRoleId } });
    },
    },
  };
  </script>
<style scoped>
.postulation-container {
  max-width: 1200px;
  margin: 0 auto;
}

.loading-text {
  font-size: 1.2rem;
  color: #616161;
}

.postulation-title {
  font-size: 2.2rem;
  font-weight: 500;
  margin-bottom: 1rem;
}

.section-header {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 12px 0;
  transition: all 0.3s ease;
}

.section-header:hover {
  background-color: rgba(25, 118, 210, 0.04);
}

.section-title {
  font-size: 1.5rem;
  font-weight: 500;
  color: #424242;
  margin: 0;
}

.data-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.data-row {
  padding: 8px 0;
}

.field-container {
  display: flex;
  align-items: center;
  padding: 8px 16px;
}

.field-name {
  font-weight: 600;
  color: #424242;
  min-width: 180px;
}

.field-value {
  color: #616161;
  word-break: break-word;
}

.file-chip {
  cursor: pointer;
  transition: all 0.2s ease;
}

.file-chip:hover {
  background-color: #E3F2FD !important;
}

.v-dialog__content {
  background-color: transparent !important; /* Fondo transparente para las imagenes del usuario */
}
</style>