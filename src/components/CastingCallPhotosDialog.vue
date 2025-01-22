<template>
    <v-dialog max-width="1000px">
        <v-card class="rounded-lg">
        <v-card-title>
          <v-tooltip text="Usá la ruedita para hacer Zoom In!" location="top">
              <template v-slot:activator="{ props }">
                  <v-icon color="purple" class="mr-2 mb-1" v-bind="props">mdi-information</v-icon>
              </template>
          </v-tooltip> 
          <span class="text-h5">Fotos de la Búsqueda</span>
        </v-card-title>
        <v-card-text>
            <v-row>
            <v-col v-if="castingPhotos.length == 0">
                <span class="text-h6">El Casting no posee fotos...</span>
            </v-col>
            <v-col v-for="(photo, index) in castingPhotos" :key="index" cols="6" class="mb-2">
                <v-zoomer style="width: 500px; height: 500px;">
                  <v-img
                    :src="photo"
                    :alt="'Foto ' + index" aspect-ratio="1" contain
                  />
              </v-zoomer>
            </v-col>
            </v-row>
        </v-card-text>
        <v-card-actions>
            <v-btn text @click="cancelAction">Cerrar</v-btn>
        </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import VueZoomer from 'vue-zoomer';

  export default {
    components: {
      VZoomer: VueZoomer.Zoomer
    },
    name: "CastingCallPhotosDialog",
    props: {
      castingPhotos: {
        type: Array,
        default: () => []
      }
    },
    emits: ['cancel-action'],
    methods: {
      cancelAction() {
        this.$emit('cancel-action');
      }
    }
  };
</script>