<template>
  <v-container>
    <!-- Cargando el formulario -->
    <v-row v-if="isLoading" justify="center" align="center" style="height: 60vh;">
      <v-container class="text-center">
        <v-progress-circular indeterminate color="cyan"></v-progress-circular>
        <div>Cargando formulario...</div>
      </v-container>
    </v-row>
    
    <v-container v-else>
      <v-row justify="center" align="center">
        <v-col cols="12" md="8">
          <h2 class="mt-2">Formulario para el rol: {{ roleName }}</h2>
          <hr style="border: 1px solid rgba(0, 0, 0, 0.1);" class="mb-5">
          
          <!-- Aquí mostramos los campos del formulario -->
          <v-form ref="form" v-model="formValid" @submit.prevent="submitForm">
            <v-row v-for="(field, index) in formFields" :key="index">
              <div class="title">
                <span v-if="field.is_required" class="text-red">* </span>
                {{ field.title }}
                <DownloadFileChip v-if="field.title == 'Curriculum' && field?.default_url" chipText="Curriculum" 
                  chipImageFileName="logo-pdf-2.png" :isClosable="false"
                  chipColor="red" :fileUrl=field?.default_url :isDisabled="!field.has_default_file"
                />
                <v-chip v-else-if="field?.default_url" class="ma-2" :closable="false" :disabled="!field.has_default_file">
                  <img 
                      :src="require('@/assets/gallery-icon.png')"
                      alt="Gallery Icon" 
                      class="button-image mr-2"
                      height="20"
                  />
                  <a @click.prevent="openImgDialog(field?.default_url)" href="#">{{ field.title }}</a>
                </v-chip>
                  <v-btn v-if="field?.default_url != null" size='small' 
                  @click="clickAddFileButton(field)">
                    {{field?.has_default_file ? 'Agregar nuevo' : 'Mantener original'}}
                  </v-btn>
                </div>
              <v-col cols="12">
                <v-text-field 
                  v-if="field.type === 'text'" 
                  :label="field.title" 
                  v-model="formData[field.title]" 
                  :rules="[
                          field.is_required ? requiredRule : true,
                          value => !value || value && value.length <= 100 || 'Máximo 100 caracteres'
                        ]"
                  outlined
                  dense
                  hide-details="auto"
                >
                </v-text-field>

                <v-text-field
                  v-if="field.type === 'number'" 
                  v-model="formData[field.title]" 
                  :label="field.title" 
                  type="number"
                  :rules="[field.is_required ? requiredRule : true,
                    value => !value ||  /^[0-9,\.]+$/.test(value) || 'Debe ser un número válido',
                    value => !value || value && value.toString().length <= 20 || 'Máximo 20 caracteres'
                    ]"
                  required
                  outlined
                  dense
                  hide-details="auto"
                ></v-text-field>
                
                <v-text-field
                  v-if="field.type === 'date'" 
                  :label="field.title"
                  v-model="formData[field.title]"
                  :rules="[field.is_required ? requiredRule : true,
                  value => !value || value.split('-')[0] >= 1900 && value.split('-')[0] <= 3000 || 'La fecha no es valida']"
                  type="date"
                  class="date-field"
                  outlined
                  dense
                  hide-details="auto"
                  >
                </v-text-field>

                <v-textarea
                  v-if="field.type === 'text area'" 
                  :label="field.title"
                  v-model="formData[field.title]"
                  :rules="[field.is_required ? requiredRule : true,
                          value => !value || value && value.length <= 800 || 'Máximo 800 caracteres'
                  ]"
                  outlined
                  dense
                  hide-details="auto"
                ></v-textarea>
                
                <v-select 
                  v-if="field.type === 'select'" 
                  :label="field.title" 
                  :items="field.options" 
                  v-model="formData[field.title]" 
                  :rules="[field.is_required ? requiredRule : true]" 
                  outlined
                  dense
                  hide-details="auto"
                ></v-select>

                <v-select
                  v-if="field.type === 'multiple select'" 
                  :label="field.title" 
                  :items="field.options" 
                  v-model="formData[field.title]" 
                  multiple
                  chips
                  deletable-chips
                  :rules="[field.is_required ? requiredRule : true]" 
                  persistent-hint
                ></v-select>

                <v-file-input
                  v-if="field.type === 'upload file' && !field?.has_default_file" 
                  v-model="this.formData[field.title]"
                  :accept="field.title.includes('Curriculum') ? 'application/pdf' : 'image/*'"
                  :label="field.title" 
                  outlined
                  dense
                  :rules="[field.is_required ? fileRequiredRule : true,
                          file => !file || !file.some(file => file.size > 2_097_152) || 'El tamaño del archivo debe ser menor a 2MB.'
                          ]"
                  :disabled="field?.has_default_file == true"
                  hide-details="auto"
                  prepend-inner-icon="mdi-paperclip"
                  prepend-icon=""
                ></v-file-input>

              </v-col>
            </v-row>
            <!-- Botones de Acción -->
          <v-row justify="end" class="mt-20 mr-2">
            <v-btn
              color="purple"
              class="mr-2"
              type="submit"
            >
              Postularse
            </v-btn>
            <v-btn
              text
              color="grey"
              @click="goBack()"
            >
              Cancelar
            </v-btn>
          </v-row>
          </v-form>

        </v-col>
      </v-row>
      <v-dialog v-model="dialog" max-width="30%">
      <v-card class="pa-0" tile>
        <v-img :src="imageSrc" class="image-modal" />
      </v-card>
    </v-dialog>
    </v-container>
  </v-container>
  <InformationSnackbar ref="InformationSnackbar"/>
</template>

<script>
import FormService from '@/services/form.service';
import { getOptionsFromField, formatDate } from '@/utils';
import InformationSnackbar from '@/components/InformationSnackbar.vue';
import CastingPostulacionService from '@/services/casting-postulation.service';
import UserService from '@/services/user.service';
import AcademicExperienceService from '@/services/academic-experience.service';
import WorkExperienceService from '@/services/work-experience.service';
import DownloadFileChip from '@/components/DownloadFileChip.vue';


export default {
  components: {
    InformationSnackbar,
    DownloadFileChip
  },
  computed: {
    getFileModel() {
      //Como el campo de curriculum o de fotos pueden tomar como valor
      //un string que contenga su url (en el caso de que venga sobrecargado con
      //datos del usuario), para evitar cargar un string en el v-model del
      //v-file-input se hace esta validacion
      return (field) => {
        return typeof this.formData[field.title] === 'string' ? null : this.formData[field.title];
      };
    }
  },
  data() {
    return {
      isLoading: true,
      roleName: '',
      formFields: [], // Campos del formulario
      formData: {}, // Datos a enviar
      formValid: false,
      requiredRule: v => !!v || 'Este campo es obligatorio',
      imageSrc: '',
      dialog: false
    };
  },
  beforeMount() {
    if (!this.$store.state.auth.user) {
      this.$router.push('/');
    }
  },
  async mounted() {
    this.$root.InformationSnackbar = this.$refs.InformationSnackbar;
    const formId = this.$route.params.formId;
    this.roleName = this.$route.params.roleName;
    await this.loadForm(formId);
  },
  methods: {
    openImgDialog(url) {
      this.imageSrc = url;  // Asignamos la URL de la imagen
      this.dialog = true;
    },
    fileRequiredRule(v) {
      if (v.length == 0) {
        return "Se debe seleccionar un archivo";
      } else {
        return true;
      }
    },
    //Carga, no solo campos del formulario, sino
    //la informacion del usuario completada que matchea
    //con los campos del formulario
    async loadForm(formId) {
      try {
        var response = await FormService.getForm(formId);
        const formData = response.data;
        response = await UserService.getUserById(this.$store.state.auth.user.id);
        const userData = response;
        console.log(userData);

        // Mapear los campos del formulario
        this.formFields = formData.form_fields;

        for (let i = 0; i < this.formFields.length; i++) {
          this.formFields[i].options = getOptionsFromField(this.formFields[i].title);
          this.mapFieldWithUserData(this.formFields[i], userData.data);
        }
        
        this.isLoading = false;
      } catch (error) {
        console.error('Error al cargar el formulario:', error);
        this.isLoading = false;
      }
    },

    async mapFieldWithUserData(field, userData) {
      switch (field.title) {
        case 'Nombre y Apellido':
          this.formData[field.title] = userData.fullname?? null;
          break;
        case 'Edad':
          this.formData[field.title] = userData.age?? null;
          break;
        case 'Fecha Nacimiento':
          this.formData[field.title] = userData.birth_date?? null;
          break;
        case 'Género':
          this.formData[field.title] = userData.gender?? null;
          break;
        case 'País de Residencia':
          this.formData[field.title] = userData.residence_country?? null;
          break;
        case 'Localidad':
          this.formData[field.title] = userData.locality?? null;
          break;
        case 'Nacionalidad':
          this.formData[field.title] = userData.nationality?? null;
          break;
        case 'Teléfono':
          this.formData[field.title] = userData.phone_number?? null;
          break;
        case 'Teléfono 2':
          this.formData[field.title] = userData.phone_number_two?? null;
          break;
        case 'Instagram':
          this.formData[field.title] = userData.instagram?? null;
          break;
        case 'Facebook':
          this.formData[field.title] = userData.facebook?? null;
          break;
        case 'Canal Youtube':
          this.formData[field.title] = userData.youtube_channel?? null;
          break;
        case 'Página Web':
          this.formData[field.title] = userData.website?? null;
          break;
        case 'Reel':
          this.formData[field.title] = userData.reel_link?? null;
          break;
        // Mapeo de campos físicos
        case 'Peso (kg)':
          this.formData[field.title] = userData.weight ?? null;
          break;
        case 'Altura (cm)':
          this.formData[field.title] = userData.height ?? null;
          break;
        case 'Color de Ojos':
          this.formData[field.title] = userData.eyes_color ?? null;
          break;
        case 'Color de Piel':
          this.formData[field.title] = userData.skin_color ?? null;
          break;
        case 'Medida Cintura':
          this.formData[field.title] = userData.waist_measurement ?? null;
          break;
        case 'Medida Cadera':
          this.formData[field.title] = userData.hip_measurement ?? null;
          break;
        case 'Medida Busto':
          this.formData[field.title] = userData.bust_measurement ?? null;
          break;
        case 'Color de Pelo':
          this.formData[field.title] = userData.hair_color ?? null;
          break;
        case 'Talle Pantalón':
          this.formData[field.title] = userData.pant_size ?? null;
          break;
        case 'Talle Remera':
          this.formData[field.title] = userData.tshirt_size ?? null;
          break;
        case 'Talle Saco':
          this.formData[field.title] = userData.jacket_size ?? null;
          break;
        case 'Calzado':
          this.formData[field.title] = userData.shoes_size ?? null;
          break;
        case 'Manos':
          this.formData[field.title] = userData.hands ?? null;
          break;
        case 'Pies':
          this.formData[field.title] = userData.feet ?? null;
          break;
        case 'Dientes':
          this.formData[field.title] = userData.teeth ?? null;
          break;
        case 'Brackets':
          this.formData[field.title] = userData.braces === null ? 'No Selecciona' : (userData.braces ? 'Sí' : 'No');
          break;
        case 'Tatuajes':
          this.formData[field.title] = userData.tattoos === null ? 'No Selecciona' : (userData.tattoos ? 'Sí' : 'No');
          break;
        case 'Zona Tatuajes':
          this.formData[field.title] = userData.tattoos_area ?? null;
          break;
        case 'Piercings':
          this.formData[field.title] = userData.piercings === null ? 'No Selecciona' : (userData.piercings ? 'Sí' : 'No');
          break;
        case 'Zona Piercings':
          this.formData[field.title] = userData.piercings_area ?? null;
          break;
        case 'Aclaraciones Datos Físicos':
          this.formData[field.title] = userData.physical_characs_extra_info ?? null;
          break;

        // Mapeo de habilidades
        case 'Idiomas':
          var languagesString = userData.language_skills ?? null;
          this.formData[field.title] = languagesString ? languagesString.split(',').map(item => item.trim()) : null;
          break;
        case 'Deportes':
          var sportsString = userData.sports_skills ?? null;
          this.formData[field.title] = sportsString ? sportsString.split(',').map(item => item.trim()) : null;
          break;
        case 'Instrumentos':
          var instrumentsString = userData.instruments_skills ?? null;
          this.formData[field.title] = instrumentsString ? instrumentsString.split(',').map(item => item.trim()) : null;
          break;
        case 'Habilidades Extras':
          var extrasString = userData.other_skills ?? null;
          this.formData[field.title] = extrasString ? extrasString.split(',').map(item => item.trim()) : null;
          break;
        case 'Canto':
          this.formData[field.title] = userData.is_singer === null ? 'No Selecciona' : (userData.is_singer ? 'Sí' : 'No');
          break;
        case 'Danza':
          this.formData[field.title] = userData.is_dancer === null ? 'No Selecciona' : (userData.is_dancer ? 'Sí' : 'No');
          break;
        case 'Tipos de Danza':
          this.formData[field.title] = userData.dance_types ?? null;
          break;
        case 'Lic. Conducir (Auto)':
          this.formData[field.title] = userData.car_drivers_license === null ? 'No Selecciona' : (userData.car_drivers_license ? 'Sí' : 'No');
          break;
        case 'Lic. Conducir (Moto)':
          this.formData[field.title] = userData.moto_drivers_license === null ? 'No Selecciona' : (userData.moto_drivers_license ? 'Sí' : 'No');
          break;
        case 'Adicionales':
          this.formData[field.title] = userData.skills_additionals ?? null;        
          break;
        //Mapeo de estudios y experiencias laborales
        case 'Estudios':
          var response = await AcademicExperienceService.getUserAcademicExperiences();
          var academicExperienceString = "";
          for (var academicExperience of response.data) {
              const startDateFormatted = formatDate(academicExperience.start_date);
              const endDateFormatted = academicExperience.end_date ? formatDate(academicExperience.end_date) : 'Presente';
              
              const description = academicExperience.description ? academicExperience.description : '';
              
              // Se arma string para mostrar de forma atractiva los estudios del usuario
              academicExperienceString += `• ${academicExperience.institution} - ${academicExperience.field_of_study} (${startDateFormatted} - ${endDateFormatted}), ${description}\n`;
          }
          this.formData[field.title] = academicExperienceString;
      
          break;
        case 'Experiencias Laborales':
          var workExperienceResponse = await WorkExperienceService.getUserWorkExperiences();
          var workExperiencesString = "";
          for (var workExperience of workExperienceResponse.data) {
              const startDateFormatted = formatDate(workExperience.start_date);
              const endDateFormatted = workExperience.end_date ? formatDate(workExperience.end_date) : 'Presente';
              
              const description = workExperience.description ? workExperience.description : '';
              const producer = workExperience.producer ? ' - Productora: ' + workExperience.producer : '';
              const projectUrl = workExperience.project_url ? ' - Link: ' + workExperience.project_url: '';
              
              // Se arma string para mostrar de forma atractiva la experiencia laboral del usuario
              workExperiencesString += `• ${workExperience.work_title}: ${description} ` + 
              `(${startDateFormatted} - ${endDateFormatted}) - Rol: ${workExperience.role}` +
              `${producer}${projectUrl}\n`;
          }
          this.formData[field.title] = workExperiencesString;
      
          break;
        //Mapeo del Curriculum y las fotos de la galeria del usuario
        case 'Curriculum':
          this.setDefaultFileToField(userData.cv, field);
          break;
        case 'Foto Plano Pecho':
          this.setDefaultFileToField(userData.chest_up_shot, field);
          break;
        case 'Foto Plano General':
          this.setDefaultFileToField(userData.full_body_shot, field);
          break;
        case 'Foto un Perfil':
          this.setDefaultFileToField(userData.profile_shot, field);
          break;
        case 'Foto Adicional 1':
          this.setDefaultFileToField(userData.additional_shot_1, field);
          break;
        case 'Foto Adicional 2':
          this.setDefaultFileToField(userData.additional_shot_2, field);
          break;
        default:
          return null;
      }
    },

    setDefaultFileToField(fileUrl, field) {
      if (fileUrl) {
        field.default_url = fileUrl;
        field.has_default_file = true;
        //Se agrega como parte de la info de la postulacion
        //Se carga con un dummy File donde en realidad se tiene
        //la url cargada en el nombre del File
        this.formData[field.title] = new File([], fileUrl);
      }
    },

    async submitForm() {
      if (this.formValid) {
        try {
          //Crear un objeto que contendrá todo lo que no son archivos
          //y una lista que tendrá las fotos que se hayan subido para la
          //postulacion
          const jsonFields = {};
          const postulationPhotos = [];
          var postulationCv = null;
          console.log("FORMDATA: ", this.formData);

          for (const field in this.formData) {
            if (Object.prototype.hasOwnProperty.call(this.formData, field)) {
              const fieldValue = this.formData[field];

              // Si el campo es un archivo, lo separamos del jsonFields
              if (fieldValue instanceof File) {
                const extension = fieldValue.name.split('.').at(-1);
                console.log("Fieldvaluename: ",fieldValue.name);
                console.log("spliteado: ", fieldValue.name.split('.'));
                console.log("field: ", field);
                console.log("field.file : ", fieldValue);
                //Si el tamano del archivo es nulo significa que
                //se esta tomando el archivo sobrecargado del usuario
                // y que se tiene solo la url, y con eso alcanza
                //La url se almacena en el fieldValue.name
                if (fieldValue.size == 0) {
                  jsonFields[field] = fieldValue.name;
                } else {
                  if (field == "Curriculum") {
                    postulationCv = {"file": fieldValue, "fileName": field + '.' + extension};
                  } else {
                    postulationPhotos.push({"file": fieldValue, "fileName": field + '.' + extension});
                  }
                }

              } else if (Array.isArray(fieldValue)) {
                // Si el campo es un array, lo convertimos en un string
                //concatenado por comas
                jsonFields[field] = fieldValue.join(',');
              } else {
                // Si el campo no es archivo, lo agregamos al objeto JSON
                //directamente
                //Para los casos en que el Curriculum o las fotos vengan ya con la url
                //ya que refieren a archivos que el usuario ya habia cargado en su perfil
                //entonces se carga en la postulation_data estos strings, osea en el jsonField
                jsonFields[field] = fieldValue;
              }
            }
          }

          // Ver los datos antes de enviar
          console.log('Datos para enviar (incluyendo JSON y archivos):', jsonFields);
          console.log("cv a enviar: ", postulationCv);
          console.log("photos a enviar: ", postulationPhotos);
          var resp = await CastingPostulacionService.createCastingPostulation(this.$route.params.formId, jsonFields, 
                                                                    postulationCv, postulationPhotos);
          this.$router.push(`/casting-postulation-created/${resp.id}`);

        } catch (error) {
          console.error('Error al enviar la postulación:', error);
          // Si el usuario ya se ha postulado por ese rol se avisa con el Snackbar
          var errorMessage = 'Error en el servidor';
          if (error.response && error.response.status === 400) {
            if (error.response.data.detail.includes('user has already postulated for this role')) {
              errorMessage ='Ya se ha hecho una postulación para este rol.';
              } else if (error.response.data.detail.includes('casting call for this role has already finished')) {
              errorMessage ='El casting al cual pertenece el rol ha finalizado.';
            } else if (error.response.data.detail.includes('casting call for this role is paused')) {
              errorMessage ='El casting al cual pertenece el rol está pausado.';
            } else if (error.response.data.detail.includes('role exposed for this casting call is full')) {
              errorMessage ='El rol tiene los cupos llenos.';
            }
          }
          this.$root.InformationSnackbar.show({
            message: errorMessage,
            color: 'dark',
            buttonColor: 'red'
          });
        }
      } else {
        this.$root.InformationSnackbar.show({
          message: 'El Formulario es Inválido',
          color: 'dark',
          buttonColor: 'red'
        });        
      }
    },

    clickAddFileButton(field) {
      //Si tiene archivo default (el que tiene ya cargado el usuario
      //desde su perfil), significa que, como se clickeo el boton
      //se va a dejar de tener en cuenta el archivo default, por
      //eso se setea en null y se deja limpio para subir un nuevo archivo
      //En cambio si viene de no tener archivo default, significa
      //que al presionar el boton se vuelve a considerar el archivo
      //default
      if(field.has_default_file) {
        this.formData[field.title] = null;
      } else {
        //File dummy donde lo que importa es la url
        //del archivo
        this.formData[field.title] = new File([], field?.default_url);
      }
      field.has_default_file = !field.has_default_file;
    },

    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>
<style>

  .title {
    font-size: 20px; 
    font-weight: bold;
    margin-bottom: 4px; 
    margin-top: 10px;
    margin-left: 15px;
  }
  .image-modal {
  width: 100%;
  height: auto;
  display: block;
  margin: 0 auto;
}

.v-overlay {
  background-color: rgba(0, 0, 0, 0.7) !important; /* Fondo opaco */
}

.v-dialog__content {
  background-color: transparent !important; /* Fondo transparente para la imagen */
}
</style>