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

        <!-- Card con las secciones de perfil de usuario -->
        <v-col cols="12" md="9">
          <v-card class="pa-4 purple-border">
            <!-- Tabs para navegación -->
            <v-tabs v-model="tab" bg-color="transparent" color="purple" grow>
              <v-tab style="font-size: 12px" v-for="item in items" :key="item">
                {{ item }}
              </v-tab>
            </v-tabs>

            <!-- Contenido de cada sección -->
            <v-tabs-window v-model="tab">
                <v-card flat>
                  <v-card-text>

                    <!-- Mostrar el componente solo si el tab actual es "Estudios" -->
                    <EducationProfileArea v-if="items[tab] === 'Estudios'"
                      :educationItems="educationItems" 
                      @add-education="handleAddEducation"
                      @delete-education="handleDeletedEducation"
                      @update-education="handleUpdatedEducation"
                    />
                    <!-- Mostrar el componente solo si el tab actual es "Experiencia Laboral" -->
                    <WorkExperienceProfileArea v-if="items[tab] === 'Experiencia Laboral'"
                      :workExperienceItems="workExperienceItems" 
                      @add-work-experience="handleAddWorkExperience"
                      @delete-work-experience="handleDeletedWorkExperience"
                      @update-work-experience="handleUpdatedWorkExperience"
                    />
                    <!-- Mostrar el componente solo si el tab actual es "Caracteristicas fisicas" -->
                    <PhysicalCharacteristicsProfileArea v-if="items[tab] === 'Características Físicas'"
                      :phCharacteristics = "physicalCharacteristics"
                      @update-physical-characteristics="handleUpdatedPhysicalCharacteristics"
                    />
                  </v-card-text>
                </v-card>
            </v-tabs-window>
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
            <ImageCropper v-if="cropperDialog" @image-cropped="handleCroppedImage" />
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>

<script>
import UserService from '../services/user.service';
import ImageCropper from '@/components/ImageCropper.vue';
import EducationProfileArea from '@/components/EducationProfileArea.vue';
import WorkExperienceProfileArea from '@/components/WorkExperienceProfileArea.vue';
import PhysicalCharacteristicsProfileArea from '@/components/PhysicalCharacteristicsProfileArea.vue';

export default {
  components: {
    ImageCropper,
    EducationProfileArea,
    WorkExperienceProfileArea,
    PhysicalCharacteristicsProfileArea
  },
  data() {
    return {
      saved: false,
      resizedImage: '',
      cropperDialog: false,
      selectedImage: null,
      tab: 'Info Básica',
      items: ['Info Básica', 'Características Físicas', 'Habilidades', 'Experiencia Laboral', 'Estudios'],
      educationItems: [],
      workExperienceItems: [],
      physicalCharacteristics: {
        weight: null,
        height: null,
        eyes_color: null,
        skin_color: null,
        waist_measurement: null,
        hip_measurement: null,
        bust_measurement: null,
        hair_color: null,
        pant_size: null,
        tshirt_size: null,
        jacket_size: null,
        shoes_size: null,
        hands: null,
        feet: null,
        teeth: null,
        braces: null,
        tattoos: null,
        tattoos_area: null,
        piercings: null,
        piercings_area: null,
        extra_information: null,
      }
    };
  },
  methods: {
    openCropperDialog() {
      this.selectedImage = this.resizedImage; // Pasas la imagen actual si ya hay una
      this.cropperDialog = true;
    },
    async handleCroppedImage(croppedImageBlob, fileName) {
      this.cropperDialog = false;
      this.saved = false;

      const formData = new FormData();
      formData.append('file', croppedImageBlob, fileName);

      UserService.updateProfilePicture(formData)
        .then(response => {
          console.log('Se actualizo foto:', response.data);
          this.resizedImage = response.data.filename; // Contiene el fileUrl que apunta a la imagen en el server
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
    handleAddEducation(newEducation) {
      this.educationItems.push(newEducation);
    },
    handleDeletedEducation(index) {
      this.educationItems.splice(index, 1);
    },
    handleUpdatedEducation(updatedEducation, index) {
      this.educationItems.splice(index, 1, updatedEducation);
    },
    handleAddWorkExperience(newWorkExperience) {
      this.workExperienceItems.push(newWorkExperience);
    },
    handleDeletedWorkExperience(index) {
      this.workExperienceItems.splice(index, 1);
    },
    handleUpdatedWorkExperience(updatedWorkExperience, index) {
      this.workExperienceItems.splice(index, 1, updatedWorkExperience);
    },
    handleUpdatedPhysicalCharacteristics(updatedCharacteristics) {
      this.physicalCharacteristics = { ...updatedCharacteristics };
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

    // Cargar la lista de estudios del usuario
    UserService.getUserAcademicExperiences()
      .then(response => {
        this.educationItems = response.data; // `response.data` es  una lista de experiencias academicas
      })
      .catch(error => {
        console.log('Error al obtener experiencias académicas', error);
      }
    );

    // Cargar la lista de experiencias laborales del usuario
    UserService.getUserWorkExperiences()
      .then(response => {
        this.workExperienceItems = response.data; // `response.data` es  una lista de experiencias laborales
      })
      .catch(error => {
        console.log('Error al obtener experiencias laborales', error);
      }
    );

    UserService.getUserById(this.$store.state.auth.user.id)      
    .then(response => {
        this.physicalCharacteristics = { ...response.data};
      })
      .catch(error => {
        console.log('Error al obtener caracteristicas del usuario', error);
      }
    );
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