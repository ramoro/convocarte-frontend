<template>
<v-data-table
  :headers="headers"
  :items="postulations"
  :items-per-page="10"
  class="elevation-0 text-caption"
  density="compact"
  items-per-page-text="Ítems por página"
  :items-per-page-options="[
    { value: 10, title: '10' },
    { value: 25, title: '25' },
    { value: 100, title: '100' },
    { value: -1, title: 'Todo' }
  ]"
  no-data-text="No hay datos disponibles"
>
  <template v-slot:item="{ item }">
    <tr class="text-no-wrap" style="height: 60px !important; font-size: 13px;">
      <td>
        <div class="d-flex align-center">
          <v-icon size="small" class="mr-1">mdi-calendar</v-icon>
          {{ formatCreationDate(item.created_at) }}
        </div>
      </td>
      <td>
        <v-chip
          :color="getStateColor(item.state)"
          class="white--text"
          size="small"
          variant="elevated"
        > <!--Puede estar en Pendiente/Pre-seleccionada, pero al usuario se le va a seguir mostrando como Pendiente-->
          {{ item.state.includes('Pendiente') ? 'Pendiente' : item.state }} 
        </v-chip>
      </td>
      <td>
        <div>
          <div class="font-weight-medium">{{ item.project_name }}</div>
        </div>
      </td>
      <td>
        <div class="d-flex align-center">
          <v-icon size="small" class="mr-1">{{ categoryIcon(item.category) }}</v-icon>
          <span>{{ item.category }}</span>
        </div>
      </td>
      <td>
        <div class="d-flex align-center">
          <v-icon size="small" class="mr-1">mdi-map-marker</v-icon>
          <span>{{ item.region }}</span>
        </div>
      </td>
      <td>
        <div class="d-flex align-center">
          <v-icon size="small" class="mr-1">{{ remunerationIcon(item.remuneration_type) }}</v-icon>
          <span>{{ item.remuneration_type }}</span>
        </div>
      </td>
      <td>
        <v-btn
          icon
          variant="text"
          color="purple"
          size="small"
          @click="goToPostulationDetails(item.id)"
        >
          <v-icon>mdi-eye</v-icon>
        </v-btn>
      </td>
    </tr>
  </template>
</v-data-table>
  </template>
  
  <script>
  import { formatDate, getCategoryIcon, getRemunerationIcon, getPostulationStateColor } from '@/utils';
    export default {
        props: {
          postulations: {
              type: Array,
              required: true
          },
        },
        data() {
            return {
                headers: [
                    { title: 'Fecha', key: 'created_at', width: '120px' },
                    { title: 'Estado', key: 'state', sortable: false, width: '120px' },
                    { title: 'Proyecto', key: 'project', sortable: false, width: '200px' },
                    { title: 'Tipo', key: 'category', width: '150px' },
                    { title: 'Región', key: 'region', sortable: false, width: '120px' },
                    { title: 'Remuneración', key: 'remuneration_type', width: '120px' },
                    { title: 'Ver Postulación', key: 'acciones', sortable: false, width: '80px' }
                ]
            }

        },
        methods: {
            getStateColor(state) {
              return getPostulationStateColor(state);
            },
            categoryIcon(category) {
              return getCategoryIcon(category);
            },
            remunerationIcon(remunerationType){
              return getRemunerationIcon(remunerationType);
            },
            goToPostulationDetails(postulationId) {
              this.$router.push(`/my-postulation/${postulationId}`);
            },
            formatCreationDate(date) {
              return formatDate(date.split('T')[0]); //Es un timezone, por lo que se splitea para obtener solo la fecha
            }
        }

    }
  
  </script>

<style>
.v-data-table th {
  font-size: 13px; 
  font-weight: bold; 
}
.white--text {
  color: white !important;
}
</style>