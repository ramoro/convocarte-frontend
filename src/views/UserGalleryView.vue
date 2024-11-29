<template>
  <div class="gallery mt-1">
    <v-container grid-list-xl>
      <v-row style="margin-bottom:20px;">
        <v-col v-if="currentUser" cols="12" class="d-flex justify-between align-center position-relative">
          <div >
            <h1 class="gallery-title">
              <img 
                :src="require('@/assets/gallery-icon.png')" 
                alt="Gallery Icon" 
                class="button-image mr-2" 
                height="25"
              />
              Galería de {{ currentUser.fullname }}
            </h1>
            <a class="ml-10" :href="require('@/assets/esquema-planos.jpeg')" download="esquema-planos.jpeg" >
              Esquema de Planos
            </a>
          </div>
   
          <v-btn class="position-absolute" style="right: 0;" size="small" rounded to="/user-profile">
            Volver al Perfil
          </v-btn>
        </v-col>
      </v-row>
      
      <v-row>
        <v-col cols="8" style="padding:0px; margin-left:-50px; margin-top: -15px;">
          <v-carousel :show-arrows="true" class="custom-carousel" v-model="carouselIndex" ref="myCarousel"
          >
            <v-carousel-item
              v-for="(item,i) in currentCarrouselItems"
              :key="i"
              :src="item.src"
            ></v-carousel-item>
          </v-carousel>
        </v-col>
        <!-- Columna con botones a la izquierda -->
        <v-col cols="4" class="mt-5 pd-0 justify-center align-center">
          <v-row>
            <v-col cols="12">
              <v-defaults-provider :defaults="{'VIcon':{'color':userShotsInputs[0].iconColor}}">
                <v-file-input
                label="Foto Plano Pecho"
                v-model="userShotsInputs[0].selectedFile"
                accept="image/*"
                prepend-icon="mdi-numeric-1-circle"
                @change="handleImageUpload($event, 0, 'chest_up_shot')"
                @click:clear="handleImageRemove(0, 'chest_up_shot')"
                outlined
                dense
                hide-details="auto"
                ></v-file-input>
              </v-defaults-provider>
            </v-col>
            <v-col cols="12" v-show="userShotsInputs[0].sizeError">
              <div class="text-error ml-10 align-right" style="font-size:14px; padding:1px; margin-bottom: -15px; margin-top:-20px; ">
                <p>Máximo {{ Math.round(maxSize * maxSize / 1024 / 1024)}}MB</p>
              </div> 
            </v-col>
          </v-row>
          
          <v-row>
            <v-col cols="12">
              <v-defaults-provider :defaults="{'VIcon':{'color':userShotsInputs[1].iconColor}}">
                <v-file-input
                label="Foto Plano General"
                v-model="userShotsInputs[1].selectedFile"
                accept="image/*"
                prepend-icon="mdi-numeric-2-circle"
                @change="handleImageUpload($event, 1, 'full_body_shot')"
                @click:clear="handleImageRemove(1, 'full_body_shot')"
                outlined
                dense
                hide-details="auto"
                ></v-file-input>
              </v-defaults-provider>
            </v-col>
            <v-col cols="12" v-show="userShotsInputs[1].sizeError">
              <div class="text-error ml-10 align-right" style="font-size:14px; padding:1px; margin-bottom: -15px; margin-top:-20px; ">
                <p>Máximo {{ Math.round(maxSize * maxSize / 1024 / 1024)}}MB</p>
              </div> 
            </v-col>   
          </v-row>
          
          <v-row>
            <v-col cols="12">
              <v-defaults-provider :defaults="{'VIcon':{'color':userShotsInputs[2].iconColor}}">
                <v-file-input
                class="profile-shot-input"
                label="Foto de un Perfil"
                v-model="userShotsInputs[2].selectedFile"
                accept="image/*"
                prepend-icon="mdi-numeric-3-circle"
                @change="handleImageUpload($event, 2, 'profile_shot')"
                @click:clear="handleImageRemove(2, 'profile_shot')"
                outlined
                dense
                hide-details="auto"
                ></v-file-input>
              </v-defaults-provider>
            </v-col>
            <v-col cols="12" v-show="userShotsInputs[2].sizeError">
              <div class="text-error ml-10 align-right" style="font-size:14px; padding:1px; margin-bottom: -15px; margin-top:-20px; ">
                <p>Máximo {{ Math.round(maxSize * maxSize / 1024 / 1024)}}MB</p>
              </div> 
            </v-col>
          </v-row>
          
          <v-row>
            <v-col cols="12">
              <v-defaults-provider :defaults="{'VIcon':{'color':userShotsInputs[3].iconColor}}">
                <v-file-input
                class="additional-shot-input"
                label="Foto Adicional 1"
                v-model="userShotsInputs[3].selectedFile"
                accept="image/*"
                prepend-icon="mdi-numeric-4-circle"
                @change="handleImageUpload($event, 3, 'additional_shot_1')"
                @click:clear="handleImageRemove(3, 'additional_shot_1')"
                outlined
                dense
                hide-details="auto"
                ></v-file-input>
              </v-defaults-provider> 
            </v-col>
            <v-col cols="12" v-show="userShotsInputs[3].sizeError">
              <div class="text-error ml-10 align-right" style="font-size:14px; padding:1px; margin-bottom: -15px; margin-top:-20px; ">
                <p>Máximo {{ Math.round(maxSize * maxSize / 1024 / 1024)}}MB</p>
              </div> 
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-defaults-provider :defaults="{'VIcon':{'color':userShotsInputs[4].iconColor}}">
                <v-file-input
                class="additional-shot-input"
                label="Foto Adicional 2"
                v-model="userShotsInputs[4].selectedFile"
                accept="image/*"
                prepend-icon="mdi-numeric-5-circle"
                @change="handleImageUpload($event, 4, 'additional_shot_2')"
                @click:clear="handleImageRemove(4, 'additional_shot_2')"
                outlined
                dense
                hide-details="auto"
                ></v-file-input>
              </v-defaults-provider>
            </v-col>
            <v-col cols="12" v-show="userShotsInputs[4].sizeError">
              <div class="text-error ml-10 align-right" style="font-size:14px; padding:1px; margin-bottom: -15px; margin-top:-20px; ">
                <p>Máximo {{ Math.round(maxSize * maxSize / 1024 / 1024)}}MB</p>
              </div> 
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <InformationSnackbar ref="InformationSnackbar"/>
    </v-container>
  </div>
</template>

<script>
import UserService from '../services/user.service';
import InformationSnackbar from '@/components/InformationSnackbar.vue'

export default {
  components : {
    InformationSnackbar,
  },
  mounted() {
      this.$root.InformationSnackbar = this.$refs.InformationSnackbar;
  },
  data() {
    return {
      userShotsInputs: [
        { img_url: null, iconColor: 'blue-grey-lighten-1', selectedFile: null, sizeError: false},
        { img_url: null, iconColor: 'blue-grey-lighten-1', selectedFile: null, sizeError: false},
        { img_url: null, iconColor: 'blue-grey-lighten-1', selectedFile: null, sizeError: false},
        { img_url: null, iconColor: 'blue-grey-lighten-1', selectedFile: null, sizeError: false},
        { img_url: null, iconColor: 'blue-grey-lighten-1', selectedFile: null, sizeError: false},
      ],
      shotsRecentUploadPreviewName : [null, null, null, null, null], //Para guardar y luego recuperar los nombres de las fotos recien subidas 
                                                                    //-> sirve para casos en que se sube una foto, luego se clikea para cambiarla y se cancela
                                                                    //para que no se borre el nombre del input (ya que permite eliminarla) se lo restuara con este array
      currentCarrouselItems: [ {
        src: require('@/assets/gallery-img-default.jpg'),
      }],
      fileError: false,     // Control de errores por tamaño de archivo
      maxSize:  1448.16, //2MB
      carouselIndex: 0 //Para manejar lo que se esta viendo del carrusel
    };
  },
  methods: {
    async handleUploadedGalleryShot(shotFile, fileName, index, shotType, oldFileName) {

      UserService.updateUserImage(shotFile, fileName, shotType, oldFileName)
        .then(response => {
          this.userShotsInputs[index].img_url = response.data.filename;
          this.userShotsInputs[index].iconColor = 'cyan';
          this.shotsRecentUploadPreviewName[index] = fileName;
          this.$root.InformationSnackbar.show({message: "Se agregó una imagen nueva! Desplazá el Carrusel para verla", color: 'green', buttonColor:'white'})

          //No se actualiza selectedFile ya que al subir el archivo automaticamente se actualiza
        })
        .catch(error => {
          if (error.response) {
            console.log('Error de response actualizando foto de galería');
          } else if (error.request) {
            console.log('Error de request actualizando foto de galería');
          }
        });
      },
      async handleImageUpload(e, index, shotType) {
        const files = e.target.files || e.dataTransfer.files;
        let file = files[0];
        //Borro mensajes de error
        this.userShotsInputs.forEach(input => {
          input.sizeError = false;
        });

        if (files.length) {
          let size = file.size / this.maxSize / this.maxSize
          if (size > 1) {
            this.userShotsInputs[index].sizeError = true;
            //Al haber error saco el archivo seleccionado del input
            this.userShotsInputs[index].selectedFile = null;
          } else {
            this.selectedFile = files[0];
            
            let oldFileName = null;
            //Se le pasa al back el nombre del archivo anterior existente para que lo elimine
            if (this.userShotsInputs[index].img_url) oldFileName = this.userShotsInputs[index].img_url.split('/').pop();
            await this.handleUploadedGalleryShot(file, files[0].name, index, shotType, oldFileName);
          }
        } else {
          //Si no selecciono ningun archivo se recupera el nombre anterior para mostrarlo en el input
          //y que de la posibilidad de eliminarlo
          this.userShotsInputs[index].selectedFile = {name: this.shotsRecentUploadPreviewName[index]};
        }
        console.log(`sizeError para el índice ${index}: `, this.userShotsInputs[index].sizeError);

    },
    handleImageRemove(index, shotType) {
      var fileName = this.userShotsInputs[index].img_url.split('/').pop();

      UserService.deleteUserFile({field_name: shotType, file_name: fileName}).then(() => {
          console.log("Se eliminó foto de la galería: ", this.userShotsInputs[index].img_url);
          this.userShotsInputs[index].img_url = null;
          this.userShotsInputs[index].iconColor = 'blue-grey-lighten-1';
          this.userShotsInputs[index].selectedFile = null;
          this.shotsRecentUploadPreviewName[index] = null;

          // Actualizar el índice del carrusel para que no muestre algo en blanco
          this.$nextTick(() => {
            const totalItems = this.currentCarrouselItems.length;
            // Si el índice es mayor que el número de elementos restantes, lo ajustamos
            if (this.carouselIndex >= totalItems) {
              this.carouselIndex = totalItems - 1; // Mostrar el último elemento disponible
            }
          });
        })
        .catch(error => {
          console.log('Error al eliminar foto de la galería', error);
        });
    },
    setShot(index, shotUrl, previewName) {
      this.userShotsInputs[index].img_url = shotUrl;
      //Usamos la variable selectedFile con un archivo fake para indicar que hay un archivo
      //seleccionado (le agregamos la extension para que se entienda que es el archivo)
      //Si viene con archivo se hace el split y se cambia el icono de color
      if (this.userShotsInputs[index].img_url) {
        let extension = ""
        //Si al hacer el split el string tiene menos de 5 caracteres es que es una extension
        //y se debe agregar al string completo del nombre que se muestra en pantalla para la imagen
        if (shotUrl.split('.').pop().length <= 4) {
          extension = shotUrl.split('.').pop()
        }
        this.userShotsInputs[index].selectedFile = {name: previewName + extension};
        this.userShotsInputs[index].iconColor = "cyan";
      } 
    }
  },
  watch: {
    userShotsInputs: {
      handler(newVal) {
        let shotsImgCounter = 0;

        newVal.forEach((shot, index) => {
          // Si el campo img_url tiene un valor, actualizamos el src del carrusel
          if (shot.img_url) {
            shotsImgCounter += 1;
            if (this.currentCarrouselItems[index]) {
              this.currentCarrouselItems[index].src = shot.img_url;
            } else {
              // Si no existe ese índice en currentCarrouselItems, lo creamos
              this.currentCarrouselItems.push({ src: shot.img_url });
            }
          } else { 
            // Si no hay imagen, aseguramos que el valor en currentCarrouselItems esté vacío o se elimine
            if (this.currentCarrouselItems[index]) {
              this.currentCarrouselItems[index].src = null;
            }
          }
        });

        // Eliminar cualquier elemento extra en currentCarrouselItems si hay más que en userShotsInputs
        if (this.currentCarrouselItems.length > newVal.length) {
          this.currentCarrouselItems.splice(newVal.length);
        }

        //Elimino todos los items del carrousel donde el src es null
        this.currentCarrouselItems = this.currentCarrouselItems.filter(item => item.src !== null);
       
        //Si el contador de imagenes es igual a 0 significa que no hay imagenes seleccionadas y que se debe
        //mostrar la imagen default
        if (shotsImgCounter == 0) {
          this.currentCarrouselItems[0] = { src: require('@/assets/gallery-img-default.jpg')};
        }

      },
      deep: true
    }
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
  created() {
    UserService.getUserById(this.$store.state.auth.user.id)
      .then(response => {
        this.setShot(0, response.data['chest_up_shot'], "Seleccion Plano Pecho.")
        this.setShot(1, response.data['full_body_shot'], "Seleccion Plano General.")
        this.setShot(2, response.data['profile_shot'], "Seleccion Foto Perfil.")
        this.setShot(3, response.data['additional_shot_1'], "Seleccion Adicional 1.")
        this.setShot(4, response.data['additional_shot_2'], "Seleccion Adicional 2.")
      })
      .catch(error => {
        console.log('Error al obtener datos del usuario', error);
      });
  }
};
</script>

<style scoped>
.gallery-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 0px;
}

.image-upload-container {
  position: relative;
}

.uploaded-image {
  max-width: 100%;
  max-height: 200px;
  object-fit: contain;
  margin-bottom: 10px;
}

.custom-carousel {
  max-width: 600px;
  max-height: 650px; 
  margin: 0 auto; /* Centrar el carrusel */
}

</style>