<template>
    <div>
      <!-- Botón para abrir el diálogo de agregar foto -->
        <v-btn :disabled="buttonDisabled" color="primary" variant="outlined" @click="openDialog" outlined>
                <v-icon class="mr-2">mdi-camera-plus</v-icon>
                Agregar Foto
        </v-btn>
      <!-- Diálogo para seleccionar la foto -->
      <v-dialog v-model="dialog" max-width="500px">
        <v-form ref="form" @submit.prevent="addPhoto">
          <v-card>
            <v-card-title class="headline">Seleccionar Foto</v-card-title>
            <v-card-text>
              <v-file-input
                v-model="selectedFile"
                accept="image/*"
                label="Seleccionar Imagen"
                outlined
                dense
                :rules="[requiredRule, sizeRule].flat()"
                required
              ></v-file-input>
            </v-card-text>
            <v-card-actions>
              <v-btn color="blue darken-1" text type="submit">Agregar Foto</v-btn>
              <v-btn color="gray" text @click="closeDialog">Cancelar</v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-dialog>
    </div>
  </template>
  
  <script>
  export default {
    props: {
        buttonDisabled: {
        type: Boolean,
        default: false
      },
    },
    data() {
      return {
        dialog: false, 
        selectedFile: null,  
        requiredRule: [value => !!value || 'Este campo es requerido.'],
        sizeRule: [files => !files || !files.some(file => file.size > 2_097_152) || 'El tamaño de la foto debe ser menor a 2MB.'],
      };
    },
    methods: {
      // Abre el diálogo para agregar una foto
      openDialog() {
        this.dialog = true;
      },
  
      // Cierra el diálogo sin hacer nada
      closeDialog() {
        this.dialog = false;
        this.selectedFile = null;  // Resetea el archivo seleccionado
      },
  
      // Agrega la foto seleccionada y emite el evento
      async addPhoto() {
      const validationResult = await this.$refs.form.validate();

      // Si el archivo es válido, proceder con el emit
      if (this.selectedFile && validationResult.valid) {
        const photo = {
          file: this.selectedFile,
          name: this.selectedFile.name
        };

        this.$emit('add-photo', photo);
        this.closeDialog();
      } else {
        console.log("Archivo no válido, no se agrega.");
      }
    }
    }
  };
  </script>
  
  <style scoped>
  </style>