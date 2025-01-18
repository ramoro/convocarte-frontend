<template>
    <v-dialog v-model="dialogOpened" max-width="1000px">
        <v-card class="rounded-lg">
        <v-card-title>
            <span class="text-h5">Fotos de la Búsqueda</span>
        </v-card-title>
        <v-card-text>
            <v-row>
            <v-col v-if="castingPhotos.length == 0">
                <span class="text-h6">El Casting no posee fotos...</span>
            </v-col>
            <v-col v-for="(photo, index) in castingPhotos" :key="index" cols="6" class="mb-2">
                <v-img :src="photo" :alt="'Foto ' + index" aspect-ratio="1" contain></v-img>
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
  export default {
    name: "CastingCallPhotosDialog",
    props: {
      isOpen: {
        type: Boolean,
        default: false
      },
      castingPhotos: {
        type: Array,
        default: () => []
      }
    },
    data () {
      return {
          dialogOpened: this.isOpen,
      }
    },
    watch: {
      isOpen(newValue) {
          this.dialogOpened = newValue;
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