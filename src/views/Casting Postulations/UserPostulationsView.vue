<template>
  <v-container class="py-8">
    <div class="text-center mb-8">
      <h1 class="font-weight-bold mb-2" style="font-size: 30px;">Mis Postulaciones</h1>
      <p class="text-body-1 text-medium-emphasis">
        Acá podés ver todas tus postulaciones a castings y su estado actual
      </p>
    </div>

    <!-- Cargando Postulaciones -->
    <v-row v-if="isLoading" justify="center" align="center" style="height: 60vh;">
      <v-container class="text-center">
          <v-progress-circular indeterminate color="cyan"></v-progress-circular>
          <div>Cargando postulaciones...</div>
      </v-container>
    </v-row>

    <v-card v-else class="mx-auto purple-border" max-width="1200">
      
      <v-tabs
        v-model="activeTab"
        bg-color="white"
        centered
        grow
      >
        <v-tab value="todas">Todas</v-tab>
        <v-tab value="pendientes">Pendientes</v-tab>
        <v-tab value="elegidas">Elegidas</v-tab>
        <v-tab value="rechazadas">Rechazadas</v-tab>
      </v-tabs>

      <v-card-text class="pa-0">
        <v-window v-model="activeTab">
          <v-window-item value="todas">
            <PostulationsTable 
            :postulations="postulations"
            @delete-postulation="handleDeletedPostulation"
             />
          </v-window-item>
          
          <v-window-item value="pendientes">
            <PostulationsTable 
            :postulations="filteredPostulations('Pendiente')"
            @delete-postulation="handleDeletedPostulation"
            />
          </v-window-item>
          
          <v-window-item value="elegidas">
            <PostulationsTable 
            :postulations="filteredPostulations('Elegida')"
            @delete-postulation="handleDeletedPostulation"
            />
          </v-window-item>
          
          <v-window-item value="rechazadas">
            <PostulationsTable 
            :postulations="filteredPostulations('Rechazada')"
            @delete-postulation="handleDeletedPostulation"
            />
          </v-window-item>
        </v-window>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import PostulationsTable from '@/components/PostulationsTable.vue';
import CastingPostulationService from '@/services/casting-postulation.service'

export default {
  name: 'UserPostulationsView',
  components: {
    PostulationsTable
  },
  data() {
    return {
      activeTab:'todas',
      isLoading: true,
      postulations: [],
    };
  },
  beforeMount() {
    if (!this.$store.state.auth.user) {
      this.$router.push('/');
    }
  },
  async mounted() {
    this.$root.InformationSnackbar = this.$refs.InformationSnackbar;
  },
  created() {
    CastingPostulationService.getUserCastingPostulations()
      .then(response => {
        console.log(response.data);
        this.postulations = response.data;
        //this.sort('created_at', this.dateOrderDesc);
        this.isLoading = false; 
      })
      .catch(error => {
        console.log('Error al obtener postulaciones del usuario', error);
        this.isLoading = false;
      });
  },
  methods: {
    filteredPostulations(filter) {
      return this.postulations.filter(p => 
        p.state.includes(filter)
      );
    },
    handleDeletedPostulation(index) {
      this.postulations.splice(index, 1);
    },
  },
  
};

</script>

<style>
.v-tab {
  color: purple;
  padding: 16px;
}
</style>