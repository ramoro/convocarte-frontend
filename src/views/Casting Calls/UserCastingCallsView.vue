<template>
  <v-container>
    <!-- Título y botón para crear casting -->
    <v-row>
      <v-col cols="12" class="d-flex justify-space-between align-center">
        <h1 class="castings-title">Mis Castings</h1>
        <div class="d-flex">
          <v-btn class="mr-3" rounded @click="reelDialog = true" to="/casting-call-creation">            
            <img 
              :src="require('@/assets/casting-call-icon.png')"
              alt="Create Casting Call Icon" 
              class="button-image mr-2"
              height="25"
            />Crear Casting
          </v-btn>
        </div>
      </v-col>
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
      <v-col class="mb-3" cols="12">
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
      </v-col>
      <v-col v-for="(casting, index) in castingCalls" :key="index" cols="12" sm="6" class="d-flex justify-center mb-2 custom-col-spacing">
        <v-container class="casting-container" fluid>
          <div class="casting-content">
            <v-row justify="space-between" align="center" class="casting-header">
              <v-col class="text-left" cols="auto">
                <span class="headline">{{ casting.title }}</span>
              </v-col>
            </v-row>

            <!-- Estado y iconos -->
            <v-row justify="space-between" align="center" class="casting-state-container">
              <v-col class="text-left" cols="auto">
                <span>{{ casting.state }}</span>
              </v-col>
              <!-- Iconos a la derecha -->
              <v-col class="text-right d-flex" cols="auto">
                <v-btn 
                  size="small"
                  class="no-bg"
                  
                  flat
                  @click="showPhotosPreview(casting)"
                >
                  Preview Fotos
                </v-btn>
                <v-tooltip text="Editar" location="top">
                  <template v-slot:activator="{ props }">
                    <v-icon v-bind="props" class="mr-2">mdi-pencil</v-icon>
                  </template>
                </v-tooltip>
                <v-tooltip text="Eliminar" location="top">
                  <template v-slot:activator="{ props }">
                    <v-icon v-bind="props">mdi-delete</v-icon>
                  </template>
                </v-tooltip>

              </v-col>
            </v-row>
          </div>
        </v-container>
      </v-col>
    </v-row>

    <!-- Mensaje sin castings -->
    <v-row v-else class="text-h6" justify="center" align="center" style="height: 20vh;">
      <v-container class="text-center">
        Aun no hay Castings creados
      </v-container>
    </v-row>

    <!-- Dialogo para mostrar las fotos del casting -->
    <v-dialog v-model="showDialog" max-width="1000px">
      <v-card class="rounded-lg">
        <v-card-title>
          <span class="text-h5">Fotos de la Búsqueda</span>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col v-if="currentCastingPhotos.length == 0">
              <span class="text-h6">El Casting no posee fotos...</span>
            </v-col>
            <v-col v-for="(photo, index) in currentCastingPhotos" :key="index" cols="6" class="mb-2">
              <v-img :src="photo" :alt="'Foto ' + index" aspect-ratio="1" contain></v-img>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="showDialog = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <InformationSnackbar ref="InformationSnackbar"/>
  </v-container>
</template>

<script>
import InformationSnackbar from '@/components/InformationSnackbar.vue';
import CastingCallService from '@/services/casting-call.service';
import { sortBy } from '@/utils';


export default {
  components: {
    InformationSnackbar,
  },
  data() {
    return {
      castingCalls: [],
      isLoading: true, 
      showDialog: false, 
      currentCastingPhotos: [],
      dateOrderDesc: false,
      stateOrderDesc: false 
    };
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

    if (this.$route.query.title) {
      this.$root.InformationSnackbar.show({message: 'Casting creado en estado Borrador', color: 'green', buttonColor:'white'} );
    }
  },
  created() {
    CastingCallService.getUserCastingCalls()
      .then(response => {
        console.log(response.data); 
        this.castingCalls = response.data;
        this.sort('created_at', this.dateOrderDesc);
        this.isLoading = false; 
      })
      .catch(error => {
        console.log('Error al obtener castings del usuario', error);
        this.isLoading = false;
      });
  },
  methods: {
    // Función para mostrar las fotos del casting
    showPhotosPreview(casting) {
      this.currentCastingPhotos = casting.casting_photos; // Usamos las fotos del casting
      this.showDialog = true;
    },
    sort(attribute, orderDesc) {
      sortBy(this.castingCalls, attribute, orderDesc);

      if (attribute == 'created_at') this.dateOrderDesc = !this.dateOrderDesc;
      if (attribute == 'state') this.stateOrderDesc = !this.stateOrderDesc;
    },
  },
};
</script>

<style scoped>
.castings-title {
  font-size: 28px;
  font-weight: bold;
}

.v-col {
  display: flex;
  justify-content: center;
}

.casting-container {
  background: transparent; /* Fondo transparente */
  border: 2px solid #B0BEC5; /* Borde gris */
  border-radius: 8px; /* Bordes redondeados */
  width: 90%; /* Ajustar el ancho de los contenedores */
  height: auto; /* Ajustar la altura automáticamente */
  transition: all 0.3s ease; /* Transición suave */
  padding: 15px;
  cursor: pointer;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); /* Sombra suave por defecto */
}

.casting-container:hover {
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.2); /* Efecto de sombra al pasar el mouse */
  transform: translateY(-5px); /* Efecto de levantar el contenedor */
}


.casting-content {
  display: flex;
  flex-direction: column;
  height: 100%; /* Ocupa todo el alto del contenedor */
}

.casting-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.custom-col-spacing {
  padding-left: 2px; /* Ajusta el espaciado izquierdo entre las columnas */
  padding-right: 2px; /* Ajusta el espaciado derecho entre las columnas */
}


.headline {
  font-size: 16px; /* Fuente más pequeña */
  font-weight: bold;
}

.v-btn {
  background-color: #009688;
  color: white;
}

.v-tooltip .v-icon {
  cursor: pointer;
}

.casting-state-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.casting-state-container .text-left {
  font-size: 14px;
  color: gray;
}

.no-bg {
  background-color: transparent !important;
  color: purple;
}
</style>