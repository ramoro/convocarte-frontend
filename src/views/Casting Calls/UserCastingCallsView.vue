<template>
  <v-container>
    <!-- Título y botón para crear casting -->
    <v-row>
      <v-col cols="12" class="d-flex justify-space-between align-center">
        <h1 class="castings-title">Mis Castings</h1>
        <div class="d-flex">
          <v-btn class="mr-3" rounded @click="reelDialog = true" to="/casting-call">            
            <img 
              :src="require('@/assets/casting-call-icon.png')"
              alt="Create Casting Call Icon" 
              class="button-image mr-2"
              height="25"
            />Crear Casting
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- Cargando Castings -->
    <v-row v-if="isLoading" justify="center" align="center" style="height: 60vh;">
      <v-container class="text-center">
        <v-progress-circular indeterminate color="cyan"></v-progress-circular>
        <div>Cargando castings...</div>
      </v-container>
    </v-row>

    <!-- Castings -->
    <v-row v-else-if="castingCalls.length > 0" justify="center">
      <v-col class="mb-3" cols="12">
        <v-tooltip text="Ordenar por Fecha de Creación" location="top">
          <template v-slot:activator="{ props }">
            <v-btn small class="text-white ml-2" text style="text-transform: none" color="cyan" v-bind="props" @click="sort('created_at', dateOrderDesc)">
              <v-icon left small>mdi-calendar-month</v-icon>
              <span class="caption">Por Fecha</span>
            </v-btn>
          </template>
        </v-tooltip>
        <v-tooltip text="Ordenar por Estado" location="top">
          <template v-slot:activator="{ props }">
            <v-btn small class="text-white ml-2" text style="text-transform: none" color="cyan" v-bind="props" @click="sort('state', stateOrderDesc)">
              <v-icon left small>mdi-list-status</v-icon>
              <span class="caption">Por Estado</span>
            </v-btn>
          </template>
        </v-tooltip>
      </v-col>
      <v-col v-for="(casting, index) in castingCalls" :key="index" cols="12" sm="6" class="d-flex justify-center mb-2 custom-col-spacing">
        <v-container :class="`casting-container ${casting.state}`" fluid>
          <div>
            <v-row justify="space-between" align="center" class="casting-header">
              <v-col class="text-left" cols="auto">
                <span class="headline">{{ casting.title }}</span>
              </v-col>
            </v-row>

            <!-- Estado y iconos -->
            <v-row justify="space-between" align="center" class="casting-state-container">
              <v-col class="text-left" cols="auto">
                <v-chip small :class="` ${casting.state} v-chip--active caption my-2`">{{ casting.state }}</v-chip>
              </v-col>
              <!-- Iconos a la derecha -->
              <v-col class="text-right d-flex" cols="auto">

                <v-btn
                  v-if="casting.state == 'Borrador' || casting.state == 'Pausado'" 
                  size="small"
                  color="green"
                  class="no-bg"
                  variant="outlined"
                  @click="openPublishDialog(casting)"
                >
                  {{casting.state == 'Borrador' ? 'Publicar ': 'Reanudar'}}
                </v-btn>
                <v-btn
                  v-if="casting.state == 'Publicado'" 
                  size="small"
                  style="color: rgb(81, 159, 211)"
                  class="no-bg"
                  variant="outlined"
                  @click="openPauseDialog(casting)"
                >
                  Pausar
                </v-btn>
                <div class="ml-2" v-if="casting.state == 'Publicado' || casting.state == 'Pausado'">
                  
                  <v-btn
                      size="small"
                      style="color: rgb(218, 154, 59)"
                      class="no-bg"
                      variant="outlined"
                      @click="openCompletionDialog(casting)"
                  >
                    Finalizar
                  </v-btn>
                </div>
                <v-btn 
                  size="small"
                  class="no-bg"
                  flat
                  @click="showPhotosPreview(casting)"
                >
                  Preview Fotos
                </v-btn>
                <v-tooltip text="Editar" location="top">
                  <template v-slot:activator="{ props }">
                    <v-icon v-bind="props" class="mr-2" @click="editCastingCall(casting.id)">mdi-pencil</v-icon>
                  </template>
                </v-tooltip>
                <v-tooltip text="Eliminar" location="top">
                  <template v-slot:activator="{ props }">
                    <v-icon v-bind="props">mdi-delete</v-icon>
                  </template>
                </v-tooltip>

              </v-col>
            </v-row>
          </div>
        </v-container>
      </v-col>
    </v-row>

    <!-- Mensaje sin castings -->
    <v-row v-else class="text-h6" justify="center" align="center" style="height: 20vh;">
      <v-container class="text-center">
        Aun no hay Castings creados
      </v-container>
    </v-row>

    <!-- Dialogo para mostrar las fotos del casting -->
    <v-dialog v-model="showDialog" max-width="1000px">
      <v-card class="rounded-lg">
        <v-card-title>
          <span class="text-h5">Fotos de la Búsqueda</span>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col v-if="currentCastingPhotos.length == 0">
              <span class="text-h6">El Casting no posee fotos...</span>
            </v-col>
            <v-col v-for="(photo, index) in currentCastingPhotos" :key="index" cols="6" class="mb-2">
              <v-img :src="photo" :alt="'Foto ' + index" aspect-ratio="1" contain></v-img>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="showDialog = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Dialog para publicar casting -->
    <v-dialog v-model="publishDialog" max-width="700px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{currentCasting.state == "Pausado" ? 'Reanudar Casting' : 'Publicar Casting'}}</span>
        </v-card-title>
        <v-form ref="form" @submit.prevent="handlePublication">
          <v-card-text>
            <v-row>
              <v-col cols="8" class="d-flex justify-center">
                <v-text-field
                  label="Título de Búsqueda"
                  v-model="titleToPublish"
                  :rules="[maxLengthRule, requiredRule].flat()" 
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  label="Fecha de Expiración"
                  v-model="publishExpirationDate"
                  type="date"
                  :rules="expirationDateRules"
                  outlined
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn color="purple" class="no-bg" flat type="submit">
              Publicar
            </v-btn>
            <v-btn color="grey" class="no-bg" flat @click="publishDialog = false">
              Cancelar
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
    <!-- Dialog para pausar casting -->
    <ConfirmActionDialog
      :isOpen="pauseDialog"
      dialogTitle="Pausar Casting"
      action="Pausar"
      @confirm-action="handlePause"
      @cancel-action="pauseDialog = false"
    >
      <template #dialog-text>
        <div style="text-align:center; font-size:16px;">La publicación del Casting se está por pausar.</div>
        <div style="text-align:center; font-size:16px;">¿Confirma la acción?</div>
      </template>
    </ConfirmActionDialog>
    <!-- Dialog para finalizar casting -->
    <ConfirmActionDialog
      :isOpen="completionDialog"
      dialogTitle="Finalizar Casting"
      action="Finalizar"
      @confirm-action="handleCompletion"
      @cancel-action="completionDialog = false"
    >
      <template #dialog-text>
        <div style="text-align:center; font-size:16px;">Se está por finalizar el casting, esta decisión no tiene retorno.</div>
        <div style="text-align:center; font-size:16px;">¿Confirma la acción?</div>
      </template>
    </ConfirmActionDialog>
    <InformationSnackbar ref="InformationSnackbar"/>
  </v-container>
</template>

<script>
import InformationSnackbar from '@/components/InformationSnackbar.vue';
import CastingCallService from '@/services/casting-call.service';
import ConfirmActionDialog from '@/components/ConfirmActionDialog.vue';
import { sortBy } from '@/utils';


export default {
  components: {
    InformationSnackbar,
    ConfirmActionDialog
  },
  data() {
    return {
      castingCalls: [],
      isLoading: true, 
      showDialog: false, 
      currentCastingPhotos: [],
      dateOrderDesc: false,
      stateOrderDesc: false,
      publishDialog: false,
      pauseDialog: false,
      completionDialog: false,
      currentCasting: null,
      publishExpirationDate: '',
      titleToPublish: '', //Maneja el titulo con el que se va a publicar, ya que antes de la publicacion se permite cambiar el titulo por si ya existe alguna publicacion con ese titulo
      expirationDateRules: [
        value => !!value || 'Campo requerido',
        value => value.split('-')[0] >= 1900 && value.split('-')[0] <= 3000 || 'La fecha no es válida', 
        value =>  {
          const today = new Date();
          const argentineTime = new Date(today.toLocaleString("en-US", { timeZone: "America/Argentina/Buenos_Aires" }));
          const selectedDate = new Date(value);

          return selectedDate > argentineTime || 'La fecha de expiración debe ser mayor a la fecha actual';
        }
      ],
      requiredRule: [value => !!value || 'Este campo es requerido.'],
      maxLengthRule: [
          value => (value.length <= 100) || 'Máximo 100 caracteres',
      ]
    };
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
  mounted() {
    this.$root.InformationSnackbar = this.$refs.InformationSnackbar;

    if (this.$route.query.title) {
      this.$root.InformationSnackbar.show({message: 'Casting creado en estado Borrador', color: 'green', buttonColor:'white'} );
    }
  },
  created() {
    CastingCallService.getUserCastingCalls()
      .then(response => {
        console.log(response.data); 
        this.castingCalls = response.data;
        this.sort('created_at', this.dateOrderDesc);
        this.isLoading = false; 
      })
      .catch(error => {
        console.log('Error al obtener castings del usuario', error);
        this.isLoading = false;
      });
  },
  methods: {
    // Función para mostrar las fotos del casting
    showPhotosPreview(casting) {
      this.currentCastingPhotos = casting.casting_photos; // Usamos las fotos del casting
      this.showDialog = true;
    },
    sort(attribute, orderDesc) {
      sortBy(this.castingCalls, attribute, orderDesc);

      if (attribute == 'created_at') this.dateOrderDesc = !this.dateOrderDesc;
      if (attribute == 'state') this.stateOrderDesc = !this.stateOrderDesc;
    },
    openPublishDialog(casting) {
      this.currentCasting = casting;
      this.publishExpirationDate = "";
      this.publishDialog = true;
      this.titleToPublish = this.currentCasting.title;
    },
    openPauseDialog(casting) {
      this.currentCasting = casting;
      this.pauseDialog = true;
    },
    openCompletionDialog(casting) {
      this.currentCasting = casting;
      this.completionDialog = true;
    },
    async handlePublication() {
      this.$refs.form.validate().then(result => {
        if (result.valid) {
          const payload = {
            "title": this.titleToPublish,
            "state": this.currentCasting.state,
            "expiration_date": this.publishExpirationDate
          };

          CastingCallService.publishCasting(this.currentCasting.id, payload)
          .then(() => {
            this.$root.InformationSnackbar.show({
              message: 'Casting publicado exitosamente.',
              color: 'green',
            });
            this.publishDialog = false;
            this.currentCasting.state = 'Publicado';
            this.currentCasting.title = this.titleToPublish;
          })
          .catch((error) => {
            // Si error es 400
            console.log(error.response)
            console.log(error.response.status)
            if (error.response && error.response.status === 400) {
              console.log(error.response.data.detail)
              // Mostramos mensajes de error segun el error generado
              if (error.response.data.detail && error.response.data.detail.includes("there is already a published casting with the title")) {
                this.$root.InformationSnackbar.show({
                  message: 'Error al publicar el casting: ya existe un casting publicado con ese título.',
                  color: 'dark', 
                  buttonColor: 'red'
                });
              } else if (error.response.data.detail && error.response.data.detail.includes("cannot be published because it has already ended")) {
                this.$root.InformationSnackbar.show({
                  message: 'Error al publicar el casting: el casting está finalizado.',
                  color: 'dark', 
                  buttonColor: 'red'
                });
              } else {
                this.$root.InformationSnackbar.show({
                  message: 'Error al publicar el casting.',
                  color: 'dark',
                  buttonColor: 'red'
                });
              }
            } else {
              console.error('Error al publicar el casting:', error);
              this.$root.InformationSnackbar.show({
                message: 'Error al publicar el casting.',
                color: 'dark', 
                buttonColor: 'red'
              });
            }
          });
        }
      }).catch(error => {
        console.error("Error al validar el formulario", error);
      });
    },
    async handlePause() {
      const payload = {
        "title": this.currentCasting.title,
        "state": this.currentCasting.state,
      };

      CastingCallService.pauseCasting(this.currentCasting.id, payload)
      .then(() => {
        this.$root.InformationSnackbar.show({
          message: 'Casting pausado exitosamente.',
          color: 'rgb(81, 159, 211)',
        });
        this.pauseDialog = false;
        this.currentCasting.state = 'Pausado';
      })
      .catch((error) => {
        console.error('Error al pausar el casting:', error);
        this.$root.InformationSnackbar.show({
          message: 'Error al pausar el casting.',
          color: 'dark', 
          buttonColor: 'red'
        });
      });
    },
    handleCompletion() {
      const payload = {
        "title": this.currentCasting.title,
        "state": this.currentCasting.state,
      };

      CastingCallService.finishCasting(this.currentCasting.id, payload)
      .then(() => {
        this.$root.InformationSnackbar.show({
          message: 'Casting finalizado exitosamente.',
          color: 'rgb(218, 154, 59)',
        });
        this.completionDialog = false;
        this.currentCasting.state = 'Finalizado';
      })
      .catch((error) => {
        console.error('Error al finalizar el casting:', error);
        this.$root.InformationSnackbar.show({
          message: 'Error al finalizar el casting.',
          color: 'dark', 
          buttonColor: 'red'
        });
      });
    },
    editCastingCall(castingCallId) {
      this.$router.push(`/casting-call/${castingCallId}`);
    }
  },
};
</script>

<style scoped>
.castings-title {
  font-size: 28px;
  font-weight: bold;
}

.v-col {
  display: flex;
  justify-content: center;
}

.casting-container {
  background: transparent; 
  border-radius: 8px; 
  width: 90%; 
  height: auto; 
  transition: all 0.3s ease;
  padding: 15px;
  cursor: pointer;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  border: 1px solid #B0BEC5; 
}


.casting-container:hover {
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.2); 
  transform: translateY(-5px); 
}

.v-chip.Publicado{
  color: rgb(45, 185, 27);
}

.v-chip.Pausado{
  color: rgb(81, 159, 211); 
}

.v-chip.Finalizado{
  color: rgb(218, 154, 59); 
}

.casting-content {
  display: flex;
  flex-direction: column;
  height: 100%; 
}

.casting-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.custom-col-spacing {
  padding-left: 2px; 
  padding-right: 2px; 
}


.headline {
  font-size: 16px; 
  font-weight: bold;
}

.v-btn {
  background-color: #009688;
  color: white;
}

.v-tooltip .v-icon {
  cursor: pointer;
}

.casting-state-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.casting-state-container .text-left {
  font-size: 14px;
  color: gray;
}

.no-bg {
  background-color: transparent !important;
  color: purple;
}
</style>