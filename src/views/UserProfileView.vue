<template>
  <!-- Diálogo para confirmar la eliminación de la cuenta -->
  <DeleteConfirmationDialog
    v-model="openDeleteAccountDialog"
    itemName="cuenta"
    extraInfo="Al borrarla se eliminarán todos los formularios, proyectos, castings y postulaciones asociadas a la misma."
    @delete-confirmed="confirmAccountDelete"
    @delete-cancelled="openDeleteAccountDialog = false"
  />
  <v-row v-if="isLoading" justify="center" align="center" style="height: 60vh;">
    <v-container class="text-center">
        <v-progress-circular indeterminate color="cyan"></v-progress-circular>
        <div>Cargando postulación...</div>
    </v-container>
  </v-row>
  <v-container v-else-if="userDeleted" class="mt-4">
    <v-alert
      type="warning"
      border="left"
      prominent
      elevation="2"
      icon="mdi-account-remove-outline"
      color="red-lighten-4"
      text
    >
      <div class="text-h6 font-weight-medium">Este usuario ha eliminado su cuenta</div>

    </v-alert>
  </v-container>
  <div v-else class="profile mt-2">
    <v-container grid-list-xl>
      <v-dialog v-model="reelDialog" max-width="600px">
      <v-card>
        <v-card-title class="justify-center text-center">
          <span class="text-h5">{{ 'Agregar Reel' }}</span>
        </v-card-title>
        <v-form ref="form" @submit.prevent="handleReelSubmit" lazy-validation>
        <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="currentTypedReelLink"
                  label="Link a Reel"
                  required
                  outlined
                  dense
                  hide-details="auto"
                  :append-inner-icon="'mdi-link-variant'"
                ></v-text-field>
              </v-col>
            </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="purple" type="submit">Guardar</v-btn>
          <v-btn color="grey" @click="cancelReelDialog">Cancelar</v-btn>
        </v-card-actions>
        </v-form>
      </v-card> 
    </v-dialog>
      <v-row>
        <v-col cols="12" class="d-flex justify-space-between align-center">
          <h1 class="profile-title">Perfil de usuario</h1>
          <div class="d-flex">
            <v-btn class="mr-3" rounded :to="'/user-gallery/' + $route.params.userId" >              
              <img 
              :src="require('@/assets/gallery-icon.png')"
              alt="Gallery Icon" 
              class="button-image mr-2"
              height="20"
              />
              Galería de Fotos
            </v-btn>
            <v-btn   
            v-if="editingMode"          
            class="mr-3"
            rounded
            @click="reelDialog = true">            
              <img 
                :src="require('@/assets/camera-recorder.png')"
                alt="Camera Recorder Icon" 
                class="button-image mr-2"
                height="25"
              />Agregar reel
            </v-btn>
            <UploadFileButton v-if="editingMode" 
            button-text="Subir CV" 
            file-extensions=".pdf"
            attachmentIcon=""
            @add-uploaded-file="handleUploadedCV" />
          </div>
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
            <p v-if="currentUser" class="caption" style="font-weight: bold;">{{ basicInfo.fullname }}</p>
            <p v-if="currentUser" class="caption mt-2"><v-icon class="mr-1" color="blue">mdi-email-outline</v-icon>{{ userEmail }}</p>
            <p v-if="currentUser && basicInfo.instagram" class="caption mt-2"><v-icon class="mr-1" color="pink-lighten-1">mdi-instagram</v-icon><a :href="currentInstagram.fullLink">{{ currentInstagram.shortLink }}</a></p>
            <p v-if="currentUser && basicInfo.phone_number" class="caption mt-2"><v-icon class="mr-1" color="blue-darken-4">mdi-phone-outline</v-icon>{{ basicInfo.phone_number }}</p>
            <p v-if="currentUser && cv" class="caption mt-2">   
              <DownloadFileChip v-if="cv" chipText="Curriculum" chipImageFileName="logo-pdf-2.png"
              chipColor="red" :fileUrl=cv  @delete-file="deleteCV" :isClosable="editingMode" :userNameToFileName="basicInfo.fullname"
              />          
            </p>
            <p v-if="currentUser && reelLink" class="caption mt-2">            
                <v-chip v-if="reelLink" color="blue-grey-lighten-2" class="ma-2" :closable="editingMode" @click:close="deleteReel">
                  <img 
                    :src="require('@/assets/camera-recorder.png')"
                    alt="Camera Recorder Icon" 
                    class="button-image mr-2"
                    height="20"
                  />
                  <a :href="formatUrl(reelLink)">Reel</a>
                </v-chip>
            </p>
            <p v-if="currentUser && editingMode" class="caption mt-3" style="font-size: 14px">
                <a 
                  style="color: red; text-decoration: underline; cursor: pointer"
                  @click="openDeleteAccountDialog = true"
                >
                  Eliminar Cuenta
                </a>
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
                      :editingMode="editingMode"
                      :basicInfo = "basicInfo"
                      @update-basic-info="handleUpdatedBasicInfo"
                    />
                    <!-- Mostrar el componente solo si el tab actual es "Habilidades" -->
                    <SkillsProfileArea v-if="items[tab] === 'Habilidades'"
                      :editingMode="editingMode"
                      :skills = "skills"
                      @update-skills="handleUpdatedSkills"
                    />
                    <!-- Mostrar el componente solo si el tab actual es "Estudios" -->
                    <EducationProfileArea v-if="items[tab] === 'Estudios'"
                      :editingMode="editingMode"
                      :educationItems="educationItems" 
                      @add-education="handleAddEducation"
                      @delete-education="handleDeletedEducation"
                      @update-education="handleUpdatedEducation"
                    />
                    <!-- Mostrar el componente solo si el tab actual es "Experiencia Laboral" -->
                    <WorkExperienceProfileArea v-if="items[tab] === 'Experiencia Laboral'"
                      :editingMode="editingMode"
                      :workExperienceItems="workExperienceItems" 
                      @add-work-experience="handleAddWorkExperience"
                      @delete-work-experience="handleDeletedWorkExperience"
                      @update-work-experience="handleUpdatedWorkExperience"
                    />
                    <!-- Mostrar el componente solo si el tab actual es "Caracteristicas fisicas" -->
                    <PhysicalCharacteristicsProfileArea v-if="items[tab] === 'Características Físicas'"
                      :editingMode="editingMode"
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
      <InformationSnackbar ref="InformationSnackbar"/>
    </v-container>
  </div>
</template>

<script>
import UserService from '@/services/user.service';
import AcademicExperienceService from '@/services/academic-experience.service';
import WorkExperienceService from '@/services/work-experience.service';
import ImageCropper from '@/components/UserProfile/ImageCropper.vue';
import EducationProfileArea from '@/components/UserProfile/EducationProfileArea.vue';
import WorkExperienceProfileArea from '@/components/UserProfile/WorkExperienceProfileArea.vue';
import PhysicalCharacteristicsProfileArea from '@/components/UserProfile/PhysicalCharacteristicsProfileArea.vue';
import SkillsProfileArea from '@/components/UserProfile/SkillsProfileArea.vue';
import BasicInfoAndContactProfileArea from '@/components/UserProfile/BasicInfoAndContactProfileArea.vue';
import UploadFileButton from '@/components/UploadFileButton.vue';
import InformationSnackbar from '@/components/InformationSnackbar.vue';
import DownloadFileChip from '@/components/DownloadFileChip.vue';
import { formatUrl } from '@/utils';
import axios from 'axios';
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog.vue';

export default {
  components: {
    ImageCropper,
    EducationProfileArea,
    WorkExperienceProfileArea,
    PhysicalCharacteristicsProfileArea,
    SkillsProfileArea,
    BasicInfoAndContactProfileArea,
    UploadFileButton,
    InformationSnackbar,
    DownloadFileChip,
    DeleteConfirmationDialog
  },
  mounted() {
    this.$root.InformationSnackbar = this.$refs.InformationSnackbar;
  },
  async created(){
    await this.loadUserData(this.$route.params.userId);
    this.isLoading = false;
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
      cv: '',
      reelLink: '',
      currentTypedReelLink: '',
      reelDialog: false,
      requiredRule: [
        value => !!value || 'Campo requerido'
      ],
      userEmail: null,
      editingMode: true,
      openDeleteAccountDialog: false,
      userDeleted: false,
      isLoading: true
    };
  },
  methods: {
    openCropperDialog() {
      if (this.editingMode) {
        this.selectedImage = this.resizedImage; // Pasas la imagen actual si ya hay una
        this.cropperDialog = true;
      }

    },
    async handleCroppedImage(croppedImageBlob, fileName) {
      this.cropperDialog = false;

      const formData = new FormData();
      formData.append('file', croppedImageBlob, fileName);
      formData.append('field_name', 'profile_picture');
      let oldFileName = null;
      //Se le pasa al back el nombre del archivo anterior existente para que lo elimine
      if (this.currentUser.profile_picture) oldFileName = this.currentUser.profile_picture.split('/').pop();
      formData.append('old_file_name', oldFileName);

      UserService.updateUserImage(formData)
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
      //Se manda el nombre del archivo que ya existia si es que habia uno antes
      //para que el back lo elimine
      let oldCVName = null;
      if (this.cv) {
        //Si no corre local se usa endpoint de descarga de google drive que es distinto, entonces
        //el ultimo caracter que esta antes de el id del cv es '='
        let splitCharacter = '=';
        if (process.env.VUE_APP_BACKEND_API_URL.includes("localhost")) {
          splitCharacter = '/';
        }
        oldCVName = this.cv.split(splitCharacter).pop();
      }

      UserService.updateCV(cvFile, fileName, oldCVName)
        .then(response => {
          console.log('Se actualizo CV:', response.data);
          this.cv = response.data.filename; 
          this.$root.InformationSnackbar.show({message: "Nuevo curriculum agregado! Buscalo debajo de la foto de perfil", color: 'green', buttonColor:'white'})
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
        const link = document.createElement('a');
        //Si corre local puedo descargarlo con axios y elegir el nombre con el que descargo el pdf
        //Si no es local, debo descargarlo seteando en href el link porque sino google drive tira error de CORS
        if (process.env.VUE_APP_BACKEND_API_URL.includes("localhost")) {
          const response = await axios({
            url: this.cv, // URL del archivo PDF en mi backend
            method: 'GET',
            responseType: 'blob'
          });

          const url = window.URL.createObjectURL(new Blob([response.data]));
          link.href = url;
        } else {
          link.href = this.cv; // URL del archivo para descargarlo
        }

        link.setAttribute('download', 'Curriculum-' + this.currentUser.fullname.replace(/\s+/g, '') + '.pdf'); // Nombre del archivo a descargar
        document.body.appendChild(link);
        link.click(); // Simula el clic para descargar el archivo
        document.body.removeChild(link); // Elimina el enlace después de hacer clic
        
      } catch (error) {
        console.error("Error al descargar el CV:", error);
      }
    },
    deleteCV() {
      //Si no corre local se usa endpoint de descarga de google drive que es distinto, entonces
      //el ultimo caracter que esta antes de el id del cv es '='
      let splitCharacter = '=';
      if (process.env.VUE_APP_BACKEND_API_URL.includes("localhost")) {
        splitCharacter = '/';
      }
      UserService.deleteUserFile({field_name: 'cv', file_name: this.cv.split(splitCharacter).pop()})
      .then(response => {
        console.log('Se elimino el cv:', response.data);
        this.cv = '';
      })
      .catch(error => {
        console.error('Error al eliminar el cv', error);
      });   
    },
    deleteReel() {
      UserService.updateUserData(this.$store.state.auth.user.id, {reel_link: ''})
      .then(response => {
        console.log('Se actualizo el link del reel a vacio:', response.data);
        this.reelLink = '';
      })
      .catch(error => {
        console.error('Error al actualizar el link del reel a vacio', error);
      });   
    },
    handleReelSubmit() {
      this.$refs.form.validate().then(result => {
        if (result.valid) {
          this.reelLink = this.currentTypedReelLink; 

          UserService.updateUserData(this.$store.state.auth.user.id, {reel_link: this.reelLink})
          .then(response => {
            console.log('Se actualizo el link a reel:', response.data);
            this.reelDialog = false;
            this.$root.InformationSnackbar.show({message: "Nuevo link a reel agregado! Buscalo debajo de la foto de perfil", color: 'green', buttonColor:'white'})
          })
          .catch(error => {
            console.error('Error al actualizar link a reel ', error);
          });   

        } else {
          console.log("FORM INVALIDO");
          console.log(result.errors);
        }
        this.currentTypedReelLink = '';
      }).catch(error => {
        console.error("Error al validar el formulario de reelLink", error);
      });
    },
    cancelReelDialog() {
      this.reelDialog = false;
      this.currentTypedReelLink = '';
    },
    formatUrl(link) {
      return formatUrl(link);
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
        physical_characs_extra_info: data.physical_characs_extra_info,
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
    },
    async loadUserData(userId) {
      try {
        const [academicExp, workExp, userData] = await Promise.all([
          AcademicExperienceService.getUserAcademicExperiences(userId),
          WorkExperienceService.getUserWorkExperiences(userId),
          UserService.getUserById(userId)
        ]);
        
        this.educationItems = academicExp.data;
        this.workExperienceItems = workExp.data;
        this.userEmail = userData.data.email;
        this.resizedImage = userData.data.profile_picture;
        this.setPhysicalCharacteristics(userData.data);
        this.setSkills(userData.data);
        this.setBasicInfo(userData.data);
        this.cv = userData.data.cv;
        this.reelLink = userData.data.reel_link;
        
        // Actualizar el modo de edición
        this.editingMode = this.currentUser?.id == userId;
      } catch (error) {
         if (
            error.response &&
            error.response.status === 400 &&
            error.response.data?.detail?.includes('has been deleted')
          ) {
            this.userDeleted = true;
          } else {
            console.error('Error al cargar los datos del usuario:', error);
          }
      }
    },
    async confirmAccountDelete() {
      UserService.deleteUserAccount(this.currentUser.id)
        .then( () => {
          this.$store.dispatch('auth/logout').then(
            data => {
              console.log('Logout successful:', data);
              this.$router.push({ path: '/' });
            },
            error => {
              var snackbarText = 'No se pudo eliminar la cuenta';
              console.log(error);
              this.$root.InformationSnackbar.show({message: snackbarText, color: 'dark', buttonColor:'red'})
            }
          );
        })
        .catch(error => {
          console.error('Error al eliminar cuenta', error);
        });
    }
  },
  watch: {
  '$route.params.userId': {
      immediate: true, // Para que se ejecute al montar el componente
      handler(newUserId) {
        this.loadUserData(newUserId);
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
        const match = fullLink.match(regex);
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
    console.log("userid", this.$route.params.userId);
    if (!this.currentUser) {
      this.$router.push('/');
    } else if (this.currentUser.id == this.$route.params.userId) {
      if (this.currentUser.profile_picture != "") {
        this.resizedImage = this.currentUser.profile_picture;
      }
    } else {
      this.editingMode = false;
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
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 10px;
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