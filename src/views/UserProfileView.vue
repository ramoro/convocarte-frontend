<template>
  <div class="profile">
    <v-container grid-list-xl>
      <!-- Título del perfil de usuario -->
      <v-row>
        <v-col cols="12" class="d-flex justify-space-between align-center">
          <h1 class="profile-title">Perfil de usuario</h1>
          <UploadFileButton button-text="Subir CV" @add-uploaded-cv="handleUploadedCV"/>
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
            <p v-if="currentUser && basicInfo.instagram" class="caption mt-2"><v-icon class="mr-1" color="pink-lighten-1">mdi-instagram</v-icon><a :href="currentInstagram.fullLink">{{ currentInstagram.shortLink }}</a></p>
            <p v-if="currentUser && basicInfo.phone_number" class="caption mt-2"><v-icon class="mr-1" color="blue-darken-4">mdi-phone-outline</v-icon>{{ basicInfo.phone_number }}</p>
            <p v-if="currentUser && cv" class="caption mt-2">            
                <v-chip v-if="cv" color="red" class="ma-2" closable @click:close="deleteCV">
                  <a @click="downloadCV" href="#" class="cv-link">Curriculum</a>
                </v-chip>
            </p>
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
                    <!-- Mostrar el componente solo si el tab actual es "Info Básica" -->
                    <BasicInfoAndContactProfileArea v-if="items[tab] === 'Info Básica'"
                      :basicInfo = "basicInfo"
                      @update-basic-info="handleUpdatedBasicInfo"
                    />
                    <!-- Mostrar el componente solo si el tab actual es "Habilidades" -->
                    <SkillsProfileArea v-if="items[tab] === 'Habilidades'"
                      :skills = "skills"
                      @update-skills="handleUpdatedSkills"
                    />
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
import SkillsProfileArea from '@/components/SkillsProfileArea.vue';
import BasicInfoAndContactProfileArea from '@/components/BasicInfoAndContactProfileArea.vue';
import UploadFileButton from '@/components/UploadFileButton.vue';
import { formatUrl } from '@/utils';
import axios from 'axios';

export default {
  components: {
    ImageCropper,
    EducationProfileArea,
    WorkExperienceProfileArea,
    PhysicalCharacteristicsProfileArea,
    SkillsProfileArea,
    BasicInfoAndContactProfileArea,
    UploadFileButton
  },
  data() {
    return {
      resizedImage: '',
      cropperDialog: false,
      selectedImage: null,
      tab: 'Info Básica',
      items: ['Info Básica', 'Características Físicas', 'Habilidades', 'Experiencia Laboral', 'Estudios'],
      educationItems: [],
      workExperienceItems: [],
      physicalCharacteristics: {},
      skills: {},
      basicInfo: {},
      cv: ''
    };
  },
  methods: {
    openCropperDialog() {
      this.selectedImage = this.resizedImage; // Pasas la imagen actual si ya hay una
      this.cropperDialog = true;
    },
    async handleCroppedImage(croppedImageBlob, fileName) {
      this.cropperDialog = false;

      const formData = new FormData();
      formData.append('file', croppedImageBlob, fileName);

      UserService.updateProfilePicture(formData)
        .then(response => {
          console.log('Se actualizo foto de perfil:', response.data);
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
    async handleUploadedCV(cvFile, fileName) {
      const formData = new FormData();
      formData.append('file', cvFile, fileName);

      UserService.updateCV(formData)
        .then(response => {
          console.log('Se actualizo CV:', response.data);
          this.cv = response.data.filename; 
        })
        .catch(error => {
          if (error.response) {
            console.log('Error de response actualizando cv');
          } else if (error.request) {
            console.log('Error de request actualizando cv');
          }
        });
    },
    async downloadCV() {
      try {

        const response = await axios({
          url: this.cv, // URL del archivo PDF en tu backend
          method: 'GET',
          responseType: 'blob'
        });

        // Crear un enlace invisible para descargar el archivo
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'Curriculum-' + this.currentUser.fullname.replace(/\s+/g, '') + '.pdf'); // Nombre del archivo a descargar
        document.body.appendChild(link);
        link.click(); // Simula el clic para descargar el archivo
        document.body.removeChild(link); // Elimina el enlace después de hacer clic
      } catch (error) {
        console.error("Error al descargar el CV:", error);
      }
    },
    deleteCV() {
      UserService.updateUserData(this.$store.state.auth.user.id, {cv: ''})
      .then(response => {
        console.log('Se actualizo el cv a vacio:', response.data);
        this.cv = '';
      })
      .catch(error => {
        console.error('Error al actualizar el cv a vacio', error);
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
    },
    handleUpdatedSkills(updatedSkills) {
      this.skills = { ...updatedSkills };
    },
    handleUpdatedBasicInfo(updatedBasicInfo) {
      this.basicInfo = { ...updatedBasicInfo };

      if (this.currentUser.fullname != this.basicInfo.fullname) {
        this.$store.dispatch('auth/changeUserFullname', this.basicInfo.fullname);
      }
    },
    setBasicInfo(data) {
      this.basicInfo = {
        fullname: data.fullname,
        age: data.age,
        gender: data.gender,
        residence_country: data.residence_country,
        locality: data.locality,
        nationality: data.nationality,
        birth_date: data.birth_date,
        phone_number: data.phone_number,
        phone_number_two: data.phone_number_two,
        instagram: data.instagram,
        facebook: data.facebook,
        youtube_channel: data.youtube_channel,
        website: data.website
      }
    },
    setPhysicalCharacteristics(data) {
      this.physicalCharacteristics = {
        weight: data.weight,
        height: data.height,
        eyes_color: data.eyes_color,
        skin_color: data.skin_color,
        waist_measurement: data.waist_measurement,
        hip_measurement: data.hip_measurement,
        bust_measurement: data.bust_measurement,
        hair_color: data.hair_color,
        pant_size: data.pant_size,
        tshirt_size: data.tshirt_size,
        jacket_size: data.jacket_size,
        shoes_size: data.shoes_size,
        hands: data.hands,
        feet: data.feet,
        teeth: data.teeth,
        braces: data.braces,
        tattoos: data.tattoos,
        tattoos_area: data.tattoos_area,
        piercings: data.piercings,
        piercings_area: data.piercings_area,
        extra_information: data.extra_information,
      };
    },
    setSkills(data) {
      this.skills = {
        language_skills: data.language_skills,
        sports_skills: data.sports_skills,
        instruments_skills: data.instruments_skills,
        other_skills: data.other_skills,
        is_singer: data.is_singer,
        is_dancer: data.is_dancer,
        dance_types: data.dance_types,
        car_drivers_license: data.car_drivers_license,
        moto_drivers_license: data.moto_drivers_license,
        skills_additionals: data.skills_additionals
      }
    }
  },
  computed: {
    currentUser() {
      console.log("STOREUSER");
      console.log(this.$store.state.auth.user);
      return this.$store.state.auth.user;
    },
    currentInstagram() {
      if (this.basicInfo.instagram) {
        var fullLink = formatUrl(this.basicInfo.instagram)
        const regex = /https:\/\/www.instagram.com\/([^]+)\//;
        const match = this.basicInfo.instagram.match(regex);
        // Si se encuentra una coincidencia, devolvemos el nombre de usuario, si no, 
        // devolvemos null o vacío
        var shortLink = match ? match[1] : null;
        return {fullLink: fullLink, shortLink: shortLink} 
      } else {
        return null;
      }
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
        this.setPhysicalCharacteristics(response.data);
        this.setSkills(response.data);
        this.setBasicInfo(response.data);
        this.cv = response.data.cv;
      })
      .catch(error => {
        console.log('Error al obtener datos del usuario', error);
      }
    );
  },
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