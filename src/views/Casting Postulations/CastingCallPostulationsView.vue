<template>
    <!-- Diálogo para confirmar la eliminación -->
    <DeleteConfirmationDialog
      v-model="deleteDialog"
      itemName="postulación"
      :manyItems="manyPostulationsToDelete"
      extraInfo="Al eliminar una o varias postulaciones significa que están siendo RECHAZADAS. 
      Las personas Rechazadas serán notificadas mediante un mensaje en su postulación."
      @delete-confirmed="confirmDelete"
      @delete-cancelled="deleteDialog = false"
  />
    <v-container class="py-8">
      <div class="d-flex justify-space-between align-center mb-6">
        <h1 class="text-h4 font-weight-bold mb-0">Gestión de Postulaciones</h1>
        <v-btn rounded to="/user-casting-calls">
          Volver
        </v-btn>
      </div>
      <!-- Cargando Postulaciones -->
      <v-row v-if="isLoading" justify="center" align="center" style="height: 60vh;">
        <v-container class="text-center">
            <v-progress-circular indeterminate color="cyan"></v-progress-circular>
            <div>Cargando postulaciones...</div>
        </v-container>
      </v-row>
     
      <v-row v-else>
        <!-- Columnas de Postulaciones -->
        <v-col cols="12" md="6" v-for="(column, columnId) in columns" :key="columnId">
          <div class="d-flex flex-column h-100">
            <!-- Encabezado de la columna -->
            <div class="d-flex align-center justify-space-between mb-4">
              <div class="d-flex align-center">
                <h2 class="text-h5 font-weight-medium">{{ column.title }}</h2>
                <v-chip class="ml-2" size="small" color="grey-lighten-3" text-color="grey-darken-2">
                  {{ column.items.length }}
                </v-chip>
              </div>
  
              <div class="d-flex align-center">
                <v-checkbox
                  :model-value="selected[columnId].length === column.items.length && column.items.length > 0"
                  @update:model-value="selectAll(columnId)"
                  hide-details
                  density="compact"
                  class="mr-2"
                ></v-checkbox>
                <span class="text-body-2">Seleccionar todo</span>
              </div>
            </div>
  
            <!-- Barra de acciones para seleccionados -->
            <v-sheet
              v-if="selected[columnId].length > 0"
              color="grey-lighten-4"
              rounded
              class="d-flex align-center pa-2 mb-4"
            >
              <span class="text-body-2">{{ selected[columnId].length }} seleccionados</span>
              <v-spacer></v-spacer>
              <v-btn
                variant="outlined"
                size="small"
                prepend-icon="mdi-message-outline"
                class="mr-2"
                @click="alert(`Enviar mensaje a seleccionados`)"
              >
                Mensaje
              </v-btn>
              <v-btn
                variant="outlined"
                size="small"
                color="error"
                prepend-icon="mdi-delete-outline"
                @click="prepareDelete(columnId, true)"
              >
                Eliminar
              </v-btn>
            </v-sheet>
  
            <!-- Lista de postulaciones con drag and drop -->
            <v-sheet
              color="grey-lighten-4"
              rounded
              class="flex-grow-1 pa-4 overflow-y-auto"
              style="min-height: 500px"
            >
              <draggable
                :list="column.items"
                :group="{ name: 'postulaciones', pull: true, put: true }"
                item-key="id"
                @change="onDragChange"
                class="min-height-100"
              >
                <template #item="{ element: item }">
                  <v-card class="mb-3 cursor-move" elevation="1">
                    <v-card-text class="pa-4">
                      <div class="d-flex align-center">
                        <v-checkbox
                          :model-value="selected[columnId].includes(item.id)"
                          @update:model-value="toggleSelect(columnId, item.id)"
                          hide-details
                          density="compact"
                          class="mr-3"
                        ></v-checkbox>
  
                        <v-avatar size="40" class="mr-3">
                          <v-img :src="item.photo_url || require('@/assets/empty-photo.png')" :alt="item.name"></v-img>
                        </v-avatar>
  
                        <div class="flex-grow-1">
                          <div class="font-weight-medium">
                            {{ item.name }}
                            <v-chip
                              :color="getStateColor(item.state)"
                              class="white--text ml-2"
                              size="small"
                              variant="elevated"
                            > <!--El caso de preseleccionada se muestra tambien como pendiente-->
                            {{ item.state?.includes('Pendiente') ? 'Pendiente' : item.state }} 
                          </v-chip>
                          </div>
                          <div class="d-flex text-body-2 text-grey-darken-1">
                            <span v-if="item.age" class="mr-3">{{ item.age }} años</span>
                            <span>{{ item.date }}</span>
                          </div>
                        </div>
  
                        <v-menu location="end">
                          <template v-slot:activator="{ props }">
                            <v-btn
                              icon
                              variant="text"
                              size="small"
                              v-bind="props"
                            >
                              <v-icon>mdi-dots-vertical</v-icon>
                            </v-btn>
                          </template>
                          <v-list density="compact">
                            <v-list-item @click="alert(`Enviar mensaje a ${item.name}`)">
                              <template v-slot:prepend>
                                <v-icon size="small" class="mr-2">mdi-message-outline</v-icon>
                              </template>
                              <v-list-item-title>Enviar mensaje</v-list-item-title>
                            </v-list-item>
                            <v-list-item @click="prepareDelete(columnId, false, item.id)" class="text-error">
                              <template v-slot:prepend>
                                <v-icon size="small" class="mr-2" color="error">mdi-delete-outline</v-icon>
                              </template>
                              <v-list-item-title>Eliminar</v-list-item-title>
                            </v-list-item>
                          </v-list>
                        </v-menu>
                      </div>
                    </v-card-text>
                  </v-card>
                </template>
  
                <template #footer v-if="column.items.length === 0">
                  <div class="d-flex align-center justify-center text-grey-darken-1 text-body-2 font-italic h-100" style="height: 200px">
                    No hay postulaciones
                  </div>
                </template>
              </draggable>
            </v-sheet>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  import {  reactive } from 'vue';
  import draggable from 'vuedraggable';
  import CastingCallPostulationService from '@/services/casting-postulation.service'
  import { sortBy, formatDate, getPostulationStateColor } from '@/utils';
  import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog.vue';

  export default {
    components: {
      draggable,
      DeleteConfirmationDialog
    },
    data() {
      return {
        columns: reactive({
          postulations: {
            id: 'postulations',
            title: 'Postulaciones',
            items: [  
            ],
          },
          preSelectedPostulations: {
            id: 'preselectedpostulations',
            title: 'Postulaciones Pre Seleccionadas',
            items: [
            ],
          },
        }),
        selected: reactive({
          postulations: [],
          preSelectedPostulations: [],
        }),
        isLoading: true,
        manyPostulationsToDelete: false,
        deleteDialog: false,
        columnIdToDelete: null,
        postulationIdToDelete: null
      }
    },
    created() {
      const castingPostulationId = this.$route.params.castingCallId;
      CastingCallPostulationService.getCastingPostulationsByCastingCallId(castingPostulationId)
        .then(response => {
          const postulations = response.data;
          this.sort(postulations, 'created_at', true);
          this.organizePostulations(postulations);
          this.isLoading = false; 
        })
        .catch(error => {
          console.log('Error al obtener postulaciones del casting', error);
          this.isLoading = false;
        });
    },
    methods: {
      organizePostulations(postulations) {
        postulations.forEach(postulation => {
          postulation.data = JSON.parse(postulation.postulation_data);
          const item = {
            id: postulation.id,
            name: postulation.data['Nombre y Apellido'],
            age: postulation.data['Edad'],
            date: this.formatPublicationDate(postulation.created_at),
            photo_url: postulation.data['Foto de Perfil'],
            postulation_data: postulation.postulation_data,
            state: postulation.state
          };

          if (postulation.state.includes('Pre-seleccionada')) {
            this.columns.preSelectedPostulations.items.push(item);
          } else {
            this.columns.postulations.items.push(item);
          }
        });
      },
      formatPublicationDate(postulationDate) {
        return formatDate(postulationDate.split('T')[0]); //Es un timezone, por lo que se splitea para obtener solo la fecha
      },
      sort(postulations, attribute, orderDesc) {
        sortBy(postulations, attribute, orderDesc);
      },
      
      // Función para manejar el cambio en el arrastrar y soltar
      async onDragChange(event) {
        // Esta función se llama automáticamente cuando hay cambios en las listas
        if (event.added) {
          var newState = '';
          if (event.added.element.state.includes('Pre-seleccionada')) {
            newState = 'Pendiente';
          } else if (event.added.element.state == 'Pendiente') {
            newState = 'Pendiente/Pre-seleccionada'
          } 
          
          if (newState) {
            CastingCallPostulationService.updatePostulation(event.added.element.id, 
            {'state': newState, 'postulation_data': JSON.stringify(event.added.element.postulation_data)})
            event.added.element.state = newState;
          }

        }
      },
      
      // Seleccionar o deseleccionar un ítem
      toggleSelect(columnId, itemId){
        const isSelected = this.selected[columnId].includes(itemId);
        if (isSelected) {
          this.selected[columnId] = this.selected[columnId].filter(id => id !== itemId);
        } else {
          this.selected[columnId].push(itemId);
        }
      },
      
      // Seleccionar todos los ítems de una columna
      selectAll(columnId) {
        if (this.selected[columnId].length === this.columns[columnId].items.length) {
          // Si todos están seleccionados, deseleccionar todos
          this.selected[columnId] = [];
        } else {
          // Seleccionar todos
          this.selected[columnId] = this.columns[columnId].items.map(item => item.id);
        }
      },

      prepareDelete(columnId, manyPostulationsToDelete, postulationId = null) {
        //Si eligió eliminar de la seleccion de postulaciones y no selecciono nada, no sucede nada
        if (manyPostulationsToDelete && this.selected[columnId].length === 0) return;

        this.columnIdToDelete = columnId;
        this.postulationIdToDelete = postulationId;
        this.manyPostulationsToDelete = manyPostulationsToDelete;
        this.deleteDialog = true;
      },
      async confirmDelete() {
        if (this.manyPostulationsToDelete) {
          this.rejectSelectedPostulations(this.columnIdToDelete);
        } else {
          this.rejectPostulation(this.columnIdToDelete, this.postulationIdToDelete);
        }
      },
      
      // Rechaza postulaciones seleccionadas
      async rejectSelectedPostulations(columnId) {
        
        let postulationsIdsToDelete = this.columns[columnId].items.filter(
          item => this.selected[columnId].id != item.id
        ).map(item => item.id);

        let payload = {"ids": postulationsIdsToDelete};

        console.log(payload);

        CastingCallPostulationService.rejectPostulations(payload)
          .then( () => {
            this.columns[columnId].items = this.columns[columnId].items.filter(
              item => !this.selected[columnId].includes(item.id)
            );
        
            // Limpiar selecciones
            this.selected[columnId] = [];
                this.deleteDialog = false;
              })
          .catch(error => {
            console.error('Error al eliminar las postulaciones', error);
          });
        
    
      },
      
      // Rechaza una postulación individual
      async rejectPostulation(columnId, itemId) {

        var payload = {"ids": [itemId] };
        
        CastingCallPostulationService.rejectPostulations(payload)
          .then( () => {
            this.columns[columnId].items = this.columns[columnId].items.filter(item => item.id !== itemId);
        
            // Si estaba seleccionado, quitarlo de la selección
            if (this.selected[columnId].includes(itemId)) {
              this.selected[columnId] = this.selected[columnId].filter(id => id !== itemId);
            }
            this.deleteDialog = false;
          })
          .catch(error => {
            console.error('Error al rechazar la postulación', error);
          });
      
      },
      
      // Función de alerta simple (en una aplicación real, usarías un sistema de notificaciones de Vuetify)
      alert(message) {
        window.alert(message);
      },
      getStateColor(state) {
        return getPostulationStateColor(state);
      },
    }
  }

  
 
</script>
  
<style scoped>
.cursor-move {
  cursor: move;
}

.min-height-100 {
  min-height: 100%;
}
</style>