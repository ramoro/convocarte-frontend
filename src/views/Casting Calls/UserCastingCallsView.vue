<template>
  <v-container>

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
      <v-col v-for="(casting, index) in castingCalls" :key="index" cols="12" sm="6" class="d-flex justify-center mb-2 custom-col-spacing">
        <!-- Contenedor para el casting -->
        <v-container 
          class="casting-container"
          fluid
        >
          <!-- Contenido del casting -->
          <div class="casting-content">
            <!-- Fila para el título y los iconos -->
            <v-row justify="space-between" align="center" class="casting-header">
              <!-- Título del casting a la izquierda -->
              <v-col class="text-left" cols="auto">
                <span class="headline">{{ casting.title }}</span>
              </v-col>
            </v-row>

            <!-- Estado y iconos (ambos en la misma línea) -->
            <v-row justify="space-between" align="center" class="casting-state-container">
              <v-col class="text-left" cols="auto">
                <span>{{ casting.state }}</span>
              </v-col>
              <!-- Iconos a la derecha, alineados con el estado -->
              <v-col class="text-right d-flex" cols="auto">
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

    <InformationSnackbar ref="InformationSnackbar"/>
  </v-container>
</template>

<script>
import InformationSnackbar from '@/components/InformationSnackbar.vue';
import CastingCallService from '@/services/casting-call.service';

export default {
  components: {
    InformationSnackbar,
  },
  data() {
    return {
      castingCalls: [],
      isLoading: true, 
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
      this.$root.InformationSnackbar.show({message: 'Casting creado en estado Borrador!', color: 'green', buttonColor:'white'} );
    }
  },
  created() {
    CastingCallService.getUserCastingCalls()
      .then(response => {
        console.log(response.data); 
        this.castingCalls = response.data;
        this.isLoading = false; 
      })
      .catch(error => {
        console.log('Error al obtener castings del usuario', error);
        this.isLoading = false;
      });
  },
  methods: {
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
</style>