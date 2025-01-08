<template>
    <v-dialog v-model="dialogOpened" max-width="400px">
        <v-card>
        <v-card-title class="text-h6">Confirmación de Eliminación</v-card-title>
        <v-card-text>
            ¿Estás seguro de que deseás eliminar este item de {{itemName}}?
            {{extraInfo}}
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" @click="confirmDelete">Eliminar</v-btn>
            <v-btn color="grey" @click="cancelDelete">Cancelar</v-btn>
        </v-card-actions>
        </v-card>
    </v-dialog>
</template>
  
  <script>
  export default {
    name: "DeleteConfirmationDialog",
    props: {
      isOpen: {
        type: Boolean,
        default: false
      },
      itemName: {
        type: String,
        required: true
      },
      extraInfo: {
        type: String,
        default: ""
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
    emits: ['delete-confirmed', 'delete-cancelled'],
    methods: {
      confirmDelete() {
        this.$emit('delete-confirmed');
      },
      cancelDelete() {
        this.$emit('delete-cancelled');
      }
    }
  };
</script>
