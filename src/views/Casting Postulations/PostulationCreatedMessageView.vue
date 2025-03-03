<template>
    <v-container>
      <v-row>
        <v-col cols="12" class="d-flex align-center mt-3">
          <h1 class="postulation-created">¡Postulación Creada Correctamente!</h1>
        </v-col>
      </v-row>
      <v-row justify="center" class="align-center caption text-center text-subtitle-2 mb-2 mt-5" >
        <p style="font-size: 15px;">
          Se acaba de crear satisfactoriamente una postulación para el rol '<b>{{ appliedRoleName }}</b>' correspondiente al casting 
          '<b>{{ castingCallTitle }}</b>'.<br>
          Para hacer un seguimiento de tu postulación y revisar si te ha llegado algún mensaje de la persona convocante podés
          buscarla<br> en tu listado de postulaciones.
        </p>
      </v-row>
      
      <!-- Fila centrada con los botones separados por margen -->
      <v-row justify="center" class="mt-5">
        <v-col cols="auto">
          <v-btn color="purple" class="mx-2">IR A LA POSTULACIÓN</v-btn>
        </v-col>
        <v-col cols="auto">
            <v-btn color="cyan" class="mx-2" style="color:white !important;" :to="`/published-casting-call/${castingCallId}`">
                VOLVER AL CASTING
            </v-btn>
        </v-col>
        <v-col cols="auto">
            <v-btn color="cyan" class="mx-2" style="color:white !important;" to="/casting-call-search">
                VOLVER AL INICIO
            </v-btn>
        </v-col>
      </v-row>

    </v-container>
</template>

<script>
import CastingPostulationService from '@/services/casting-postulation.service';

export default {
  data() {
    return {
      isLoading: true,
      castingCallId: null,
      castingCallTitle: '',
      appliedRoleName: '' 
    };
  },
  beforeMount() {
        if (!this.currentUser) {
            this.$router.push('/');
        }
    },
  async mounted() {
      const postulationId = this.$route.params.postulationId;
      await this.loadPostulationData(postulationId);
    },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    }
  },
  methods: {
    async loadPostulationData(postulationId) {
        try {
          const response = await CastingPostulationService.getCastingPostulationById(postulationId);
          const postulationData = response.data;
          this.castingCallTitle = postulationData.casting_call.title;
          this.appliedRoleName = postulationData.exposed_role.role.name;
          this.castingCallId = postulationData.casting_call.id;
          console.log(this.castingCallId);
        } catch (error) {
          console.log('Error al cargar la postulacion:', error);
          this.$root.InformationSnackbar.show({
            message: 'Error al cargar la postulación',
            color: 'dark',
            buttonColor: 'red'
          });
        }
    },
    goToCasting(castingCallId) {
      this.$router.push(`/published-casting-call/${castingCallId}`);
    }
 }
}
</script>

<style scoped>
.postulation-created {
  font-size: 28px;
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

.v-row .v-col .v-btn {
  margin: 0 8px;
}
</style>