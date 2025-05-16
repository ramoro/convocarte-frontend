<template>
    <v-container>
      <v-row>
        <v-col cols="12" class="d-flex align-center mt-3">
          <h1 class="castings-title">Búsqueda de Castings</h1>
        </v-col>
      </v-row>
      <v-row justify="center" class="align-center caption text-center text-subtitle-2 mb-2" style="color: gray">
        <p class="text-body-1 text-medium-emphasis">
          Para facilitar tu búsqueda probá aplicando los filtros que más se adecúen a tus necesidades
          <br/>
          ¡ÉXITOS!
        </p>
      </v-row>
        <!-- Cargando Castings -->
        <v-row v-if="isLoading" justify="center" align="center" style="height: 60vh;">
        <v-container class="text-center">
            <v-progress-circular indeterminate color="cyan"></v-progress-circular>
            <div>Cargando castings...</div>
        </v-container>
        </v-row>
        <!-- Castings -->
        <v-row v-else-if="castingCalls.length > 0" justify="center">
          <v-col cols="12" class="d-flex justify-end mr-5">
            <div class="chips-container mr-2">
              <v-chip
                v-for="(filter, index) in filterChips"
                :key="index"
                class="mr-2 ellipsis-chip"
                color="gray"
                outlined
                closable
                @click:close="removeFilter(filter)"
              >
                {{ filter }}
              </v-chip>
            </div>
            <v-btn @click="showFilterDialog = true" color="purple">
              Filtros de Búsqueda
            </v-btn>
          </v-col>
          <v-col v-for="(casting, index) in castingCalls" :key="index" cols="12" sm="6" class="d-flex justify-center mb-2 custom-col-spacing">
              <v-container :class="`casting-container`" fluid @click="goToCasting(casting.id)">
              <div>
                  <v-row justify="space-between" align="center" class="casting-header">
                      <v-col class="text-left" cols="auto">
                        <div class="casting-title-container">
                          <span class="headline">{{ casting.title }} </span>
                        </div>
                          <p style="font-size: 14px; color: gray;margin-right: -25px; margin-top:1px;" >{{ formatDate(casting.publication_date) }}</p>
                      </v-col>
                  </v-row>
                  <v-row justify="space-between" align="center" class="casting-info-container">
                      <v-col class="text-left" cols="auto">
                          <v-chip small variant = "elevated" color="white" :class="` v-chip--active caption my-2`">
                            <v-icon size="small" class="mr-1">{{ categoryIcon(casting.project.category) }}</v-icon>
                            {{ casting.project.category }}
                          </v-chip>
                          <v-chip small variant = "elevated" color="white" :class="` v-chip--active caption my-2 ml-2`">
                            <v-icon size="small" class="mr-1">{{ remunerationIcon(casting.remuneration_type) }}</v-icon>
                            {{ casting.remuneration_type == 'Remuneración Simbólica' ? 'Rem. Simbólica' : casting.remuneration_type}}
                          </v-chip>
                      </v-col>
                      <v-col class="text-right d-flex" cols="auto">
                          <v-btn 
                          size="small"
                          class="no-bg"
                          flat
                          @click.stop
                          @click="showPhotosPreview(casting)"
                          >
                          Preview Fotos
                          </v-btn>
                      </v-col>
                  </v-row>
              </div>
              </v-container>
          </v-col>
        </v-row>
    
        <!-- Mensaje sin castings -->
        <v-row v-else class="text-h6" justify="center" align="center" style="height: 20vh;">
          <v-col cols="12" class="d-flex justify-end mr-5">
            <div class="chips-container mr-2">
              <v-chip
                v-for="(filter, index) in filterChips"
                :key="index"
                class="mr-2 mt-1 ellipsis-chip"
                color="gray"
                outlined
                closable
                @click:close="removeFilter(filter)"
              >
                {{ filter }}
              </v-chip>
            </div>
            <v-btn @click="showFilterDialog = true" color="purple">
              Filtros de Búsqueda
            </v-btn>
          </v-col>
          <v-col class="text-center">
              <p> No se encontraron castings... </p>
          </v-col>
        </v-row>

        <!-- Dialogo para mostrar las fotos del casting -->
        <CastingCallPhotosDialog
        v-model="showDialog"
        :castingPhotos = "currentCastingPhotos"
        @cancel-action="showDialog = false"
        />

        <!-- Dialogo para mostrar filtros -->
         <FiltersDialog
          v-model="showFilterDialog"
          :initialFilters="filtersSettings"
          @save-filters="saveFilters"
          @cancel-action="showFilterDialog = false"
         />
        <InformationSnackbar ref="InformationSnackbar"/>
    </v-container>
</template>

<script>
import CastingCallPhotosDialog from '@/components/CastingCallPhotosDialog.vue';
import FiltersDialog from '@/components/FiltersDialog.vue';
import InformationSnackbar from '@/components/InformationSnackbar.vue';
import CastingCallService from '@/services/casting-call.service';
import { formatDate, sortBy, getCategoryIcon, getRemunerationIcon} from '@/utils';

export default {
  components: {
    InformationSnackbar,
    CastingCallPhotosDialog,
    FiltersDialog
  },
  data() {
    return {
      castingCalls: [],
      buttonLoading: false,
      isLoading: true, 
      showDialog: false, 
      currentCastingPhotos: [],
      dateOrderDesc: false,
      currentCasting: null,
      filtersSettings: {
        remuneration_types: null,
        categories: null,
        age: null,
        height: null,
        hair_colors: null,
        date_order: 'Descendente'
      },
      filterChips: [],
      showFilterDialog: false
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
  },
  mounted() {
    this.$root.InformationSnackbar = this.$refs.InformationSnackbar;
  },
  created() {
    const savedFilters = localStorage.getItem('filtersSettings');
    if (savedFilters) {
      this.filtersSettings = JSON.parse(savedFilters);
    }
    this.updateFilterChips();
    this.searchForCastingCalls(this.filtersSettings);
  },
  methods: {
    // Función para mostrar las fotos del casting
    showPhotosPreview(casting) {
        this.currentCastingPhotos = casting.casting_photos;
        this.showDialog = true;
    },
    sort(attribute, orderDesc) {
        sortBy(this.castingCalls, attribute, orderDesc);

        if (attribute == 'created_at') this.dateOrderDesc = !this.dateOrderDesc;
        if (attribute == 'state') this.stateOrderDesc = !this.stateOrderDesc;
    },
    formatDate(date) {
        return formatDate(date);
    },
    saveFilters(updatedFilters) {
      this.filtersSettings = updatedFilters;
      this.showFilterDialog = false;
      this.isLoading = true;
      const payload = JSON.parse(JSON.stringify(this.filtersSettings));
      this.searchForCastingCalls(payload);
      this.updateFilterChips();
      //Se almacenan los filtros en el local storage para no perderlos una vez que cambia de pagina el usuario
      localStorage.setItem('filtersSettings', JSON.stringify(this.filtersSettings)); 
    },
    searchForCastingCalls(payload) {
      CastingCallService.searchPublishedCastingCalls(payload)
      .then(response => {
        this.castingCalls = response.data;
        this.isLoading = false; 
      })
      .catch(error => {
        console.log('Error al obtener castings publicados', error);
        this.isLoading = false;
      });
    },
    updateFilterChips() {
      this.filterChips = [];
      for (const key in this.filtersSettings) {
        if (key !== 'date_order' && this.filtersSettings[key]) {
          if (Array.isArray(this.filtersSettings[key])) {
            this.filtersSettings[key].forEach(item => {
              this.filterChips.push(item);
            });
          } else {
            let label = this.filtersSettings[key];
            //Agrega la unidad de medida a los filtros de edad y altura
            if (key === 'age') {
              label += ' años';
            } else if (key === 'height') {
              label += ' cm';
            }
            this.filterChips.push(label);
          }
        }
      }
    },
    removeFilter(filter) {
      for (const key in this.filtersSettings) {
        if (Array.isArray(this.filtersSettings[key])) {
          this.filtersSettings[key] = this.filtersSettings[key].filter(item => item !== filter);
        } else if (this.filtersSettings[key] === filter || `${this.filtersSettings[key]} años` === filter || `${this.filtersSettings[key]} cm` === filter) {
          this.filtersSettings[key] = null;
        }
      }
      this.saveFilters(this.filtersSettings);
    },
    goToCasting(castingCallId) {
      this.$router.push(`/published-casting-call/${castingCallId}`);
    },
    categoryIcon(category) {
      return getCategoryIcon(category);
    },
    remunerationIcon(remunerationType) {
      return getRemunerationIcon(remunerationType)
    }
 }
}
</script>

<style scoped>
.castings-title {
  font-size: 30px;
  font-weight: bold;
}

.v-col {
  display: flex;
  justify-content: center;
}

.casting-container {
  background: transparent; 
  border-radius: 8px; 
  width: 90%; 
  height: auto; 
  transition: all 0.3s ease;
  padding: 15px;
  cursor: pointer;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  border: 1px solid #B0BEC5; 
}


.casting-container:hover {
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.2); 
  transform: translateY(-5px); 
}


.casting-content {
  display: flex;
  flex-direction: column;
  height: 100%; 
}

.casting-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.custom-col-spacing {
  padding-left: 2px; 
  padding-right: 2px; 
}


.headline {
  font-size: 16px; 
  font-weight: bold;
}

.v-btn {
  background-color: #009688;
  color: white;
}

.casting-info-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.casting-info-container .text-left {
  font-size: 14px;
  color: gray;
}

.no-bg {
  background-color: transparent !important;
  color: purple;
}

@media (min-width: 1280px) {
  .casting-title-container {
    min-width: 420px;
    min-height: 45px;
  }
}

.chips-container {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto; /* Habilita el desplazamiento horizontal si el contenido excede el ancho */
  padding-bottom: 5px; 
  width: 80%; 
  flex-direction: row-reverse; 

}

.ellipsis-chip {
  flex-shrink: 0; /* Evita que los chips se encojan */
  white-space: nowrap; /* Previene que el texto dentro del chip se divida en varias líneas */
}

.chips-container::-webkit-scrollbar {
  height: 8px;
}

.chips-container::-webkit-scrollbar-thumb {
  background-color: #c1bdbd; /* Color de la barra de desplazamiento */
  border-radius: 10px;
}

.chips-container::-webkit-scrollbar-thumb:hover {
  background-color: #7e7c7c; /* Color de la barra de desplazamiento cuando se pasa el mouse por encima */
}

.category-chip,
.remuneration-chip {
  max-width: 150px; /* Ajusta este valor según necesites */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

</style>