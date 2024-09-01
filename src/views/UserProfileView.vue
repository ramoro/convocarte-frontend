<template>
  <div class="profile">
    <v-container grid-list-xl>
      <!-- Título del perfil de usuario -->
      <v-row>
        <v-col cols="12">
          <h1 class="profile-title">Perfil de usuario</h1>
        </v-col>
      </v-row>

      <!-- Row con las dos cards -->
      <v-row>
        <!-- Card con la imagen y el cropper -->
        <v-col cols="12" md="3">
          <v-card class="d-flex flex-column align-center pa-4 purple-border">
            <v-img 
              :src="resizedImage || require('@/assets/add-photo.png')"
              v-ripple 
              alt="avatar" 
              class="avatar-img gray-border elevation-4"
              width="120"
              height="120"
              @click="openCropperDialog"
            ></v-img>
            <p v-if="currentUser" class="caption" style="font-weight: bold;">{{ currentUser.fullname }}</p>
            <p v-if="currentUser" class="caption mt-2"><v-icon class="mr-1" color="blue">mdi-email-outline</v-icon>{{ currentUser.email }}</p>
          </v-card>
        </v-col>

        <v-col cols="12" md="9">
          <v-card class="pa-4 purple-border">
            <p>Contenido adicional del perfil de usuario...</p>
          </v-card>
        </v-col>
      </v-row>

      <!-- Dialogo del Image Cropper -->
      <v-dialog v-model="cropperDialog" max-width="400px" max-height="400px">
        <v-card outlined class="primary cyan-border" style="position: relative;">
          <v-btn icon flat @click="cropperDialog = false" style="position: absolute; top: 1px; right: 8px;">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-card-title class="text-center">
            Seleccioná tu Foto de Perfil
          </v-card-title>
          <v-card-text>
            <ImageCropper v-if="cropperDialog"
              @image-cropped="handleCroppedImage"/>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>

<script>
import UserService from '../services/user.service';
import ImageCropper from '@/components/ImageCropper.vue'

export default {
  components: {
    ImageCropper: ImageCropper
  },
  data () {
    return {
      saved: false,
      resizedImage: '',
      cropperDialog: false,
      selectedImage: null,
    }
  },
  methods: {
    openCropperDialog() {
      this.selectedImage = this.resizedImage; // Pasas la imagen actual si ya hay una
      this.cropperDialog = true;
    },
    handleCroppedImage(croppedImageBlob, fileName) {
      this.cropperDialog = false;
      //const imageUrl = URL.createObjectURL(croppedImageBlob);
      //this.resizedImage = imageUrl;
      this.saved = false;

      const formData = new FormData();
      formData.append('file', croppedImageBlob,fileName);

      UserService.updateProfilePicture(formData)
      .then(response => {
          console.log('Se actualizo foto:', response.data);
          this.resizedImage = response.data.filename; //Contiene el fileUrl que apunta a la imagen en el server
          this.$store.dispatch('auth/changeUserPictureProfile', response.data.filename);
        })
        .catch(error => {
          if (error.response) {
            console.log('Error de response actualizando foto');
          } else if (error.request) {
            console.log('Error de request actualizando foto');
          }
        });
    },
    async handleAvatarChange(data) {
      console.log('Nuevo avatar:', data);
      this.avatar = data;
      this.saved = false;

      UserService.updateProfilePicture(data.formData)
      .then(response => {
          console.log('Se actualizo foto:', response.data);
          this.resizedImage = `data:image/jpeg;base64,${response.data.image}`;
        })
        .catch(error => {
          if (error.response) {
            console.log('error');
          } else if (error.request) {
            console.log('error');
          }
        });
    }
  },
  computed: {
    currentUser() {
      console.log("STOREUSER");
      console.log(this.$store.state.auth.user);
      return this.$store.state.auth.user;
    }
  },
  beforeMount() {
    if (!this.currentUser) {
      this.$router.push('/');
    } else if (this.currentUser.profile_picture != "") {
      this.resizedImage = this.currentUser.profile_picture;
    }
  }
};
</script>

<style scoped>
  .my-custom-btn {
    font-size: 12px;
    padding: 4px 8px;
    margin-left: 0px;
  }

  .profile-title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
  }

  .purple-border {
    border-top: 3px solid purple;
  }

  .gray-border {
    border: 1px solid gray !important;
    border-radius: 50%;
  }

  .avatar-img {
    border-radius: 50%;
    margin-bottom: 15px;
    cursor: pointer;
  }

  .cyan-border {
    border-top: 1px solid cyan;
    box-shadow: 0 0 10px rgba(0, 255, 255, 0.5); 
  } 
</style>