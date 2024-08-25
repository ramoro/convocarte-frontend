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
        <!-- Card con ImageUploader -->
        <v-col cols="12" md="3">
          <v-card class="d-flex flex-column align-center pa-4 purple-border">
            <ImageUploader @change-avatar="handleAvatarChange">
              <template v-slot:activator>
                <v-avatar size="100px" v-ripple v-if="!avatar" color="white" class="gray-border elevation-3 lighten-3 mb-3" style="cursor: pointer;">
                  <v-img :src="require('@/assets/add-photo.png')" alt="avatar" class="avatar-img2"></v-img>
                  <v-btn style="display:none;"></v-btn>
                </v-avatar>
                <v-avatar size="100px" v-ripple v-else class="mb-3 ml-1 gray-border elevation-3" style="cursor: pointer;">
                  <v-img :src="avatar.imageURL" alt="avatar" class="avatar-img" contain></v-img>
                </v-avatar>
              </template>
            </ImageUploader>
            <v-slide-x-transition>
              <div v-if="avatar && saved == false">
                <v-btn color="purple lighten-1" @click="uploadImage" :loading="saving" small
                       class="my-custom-btn mb-3"
                       style="margin-left: 8px;">Guardar Foto</v-btn>
              </div>
            </v-slide-x-transition>
            <p class="caption" style="font-weight: bold;">{{ currentUser.fullname }}</p>
          </v-card>
        </v-col>

        <v-col cols="12" md="9">
          <v-card class="pa-4 purple-border">
            <p>Contenido adicional del perfil de usuario...</p>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import ImageUploader from '@/components/ImageUploader.vue'
export default {
  components: {
    ImageUploader: ImageUploader
  },
  watch: {
    avatar: {
      handler(newValue) {
        console.log('Nuevo avatar:', newValue); // Verifica que se actualiza correctamente
        this.saved = false;
      },
      deep: true
    }
  },
  data () {
    return {
      avatar: null,
      saving: false,
      saved: false
    }
  },
  methods: {
    uploadImage() {
      this.saving = true
      setTimeout(() => this.savedAvatar(), 1000)
    },
    handleAvatarChange(data) {
      console.log('Nuevo avatar:', data);
      this.avatar = data;
      this.saved = false;
    },
    savedAvatar() {
      this.saving = false
      this.saved = true
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
    object-fit: cover;
    width: 100%;
    height: 100%;
    filter: contrast(1.1) brightness(1.05); /* Aumenta el contraste y brillo para mejorar la claridad */
  }

  .avatar-img {
    width: 50%;
    height: 50%;
    filter: contrast(1.1) brightness(1.05); /* Aumenta el contraste y brillo para mejorar la claridad */
  }
</style>