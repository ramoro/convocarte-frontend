<template>
  <v-container>
    <DeleteConfirmationDialog
      :isOpen="deleteDialog"
      itemName="plantilla de formulario"
      @delete-confirmed="confirmDelete"
      @delete-cancelled="deleteDialog = false"
    />
    <v-row>
      <v-col cols="12" class="d-flex justify-space-between align-center">
        <h1 class="forms-title">Mis Formularios</h1>
        <div class="d-flex">
          <v-btn class="mr-3" rounded @click="reelDialog = true" to="/form-builder">            
            <img 
              :src="require('@/assets/form-icon.png')"
              alt="Create Form Icon" 
              class="button-image mr-2"
              height="25"
            />Agregar Formulario
          </v-btn>
        </div>
      </v-col>
    </v-row>
    <v-row v-if="isLoading" justify="center" align="center" style="height: 60vh;">
      <v-container class="text-center">
        <v-progress-circular indeterminate color="cyan"></v-progress-circular>
        <div>Cargando formularios...</div>
      </v-container>
    </v-row>
    <v-row v-else-if="formTemplates.length > 0" justify="center" align="center">
      <div class="forms-list">
        <v-container class="my-10 mx-16">
          <v-row class="mb-3">
            <v-tooltip text="Ordenar por Título" location="top"> 
              <template v-slot:activator="{ props }"> 
                <v-btn small class="text-white" style="text-transform: none" text color="cyan" v-bind="props" @click="sortBy('form_template_title')">
                  <v-icon left small>mdi-form-select</v-icon>
                  <span class="caption">Por Título</span>
                </v-btn>
              </template>
            </v-tooltip>
            <v-tooltip text="Ordenar por Fecha de Creación" location="top">
              <template v-slot:activator="{ props }">
                <v-btn small class="text-white ml-2" text style="text-transform: none" color="cyan" v-bind="props" @click="sortBy('created_at')">
                  <v-icon left small>mdi-list-status</v-icon>
                  <span class="caption">Por Fecha</span>
                </v-btn>
              </template>
            </v-tooltip>
          </v-row>

          <v-card flat class="pa-3" v-for="(form, index) in formTemplates" :key="index">
            <v-row :class="`pa-3 form unused`"> 
              <v-col cols="4">
                <div class="caption text-grey">Título de Formulario</div>
                <div>{{form.form_template_title}}</div>
              </v-col>
              <v-col cols="4">
                <div class="caption text-grey">Fecha Creación</div>
                <div>{{formatDateToTextFormat(form.created_at)}}</div>
              </v-col>
              <v-col cols="2">
                <div><v-chip small :class="`Unused caption mt-2`">Sin uso</v-chip></div>
              </v-col>
              <v-col cols="2">
                <div justify="space-between" class="mt-2">
                  <v-tooltip text="Editar" location="top">
                    <template v-slot:activator="{ props }">
                      <v-icon v-bind="props" class="edition-icon mr-2">mdi-pencil</v-icon>
                    </template>
                  </v-tooltip>
                  <v-tooltip text="Eliminar" location="top">
                    <template v-slot:activator="{ props }">
                      <v-icon v-bind="props" class="remove-icon" @click="prepareDelete(form, index)">mdi-delete</v-icon>
                    </template>
                  </v-tooltip>
                </div>
              </v-col>
            </v-row>
            <v-row cols="12">
              <v-divider></v-divider>
            </v-row>
          </v-card>
        </v-container>    
      </div>
    </v-row>
    <v-row v-else class="text-h6" justify="center" align="center" style="height: 20vh;">
      <v-container class="text-center">
        Aun no hay Formularios creados
      </v-container>
    </v-row>
    <InformationSnackbar ref="InformationSnackbar"/>
  </v-container>
</template>

<script>
import InformationSnackbar from '@/components/InformationSnackbar.vue';
import FormTemplateService from '@/services/form-template.service';
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog.vue';

export default {
  components: {
    InformationSnackbar,
    DeleteConfirmationDialog
  },
  data() {
    return {
      formTemplates: [],
      itemToDelete: null,
      deleteDialog: false,
      deleteIndex: null,
      isLoading: true, // Estado de carga (para mostrar simbolo de carga hasta que esten cargados los formularios del usuario)
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
  mounted() {
      this.$root.InformationSnackbar = this.$refs.InformationSnackbar;
      if (this.$route.query.title) {
        this.$root.InformationSnackbar.show({message: 'El formulario ' + this.$route.query.title + ' se acaba de crear', color: 'green', buttonColor:'white'});
      }
  },
  created() {
    FormTemplateService.getUserFormTemplates()
      .then(response => {
        this.formTemplates = response.data; // `response.data` es  una lista de templates de formularios
        this.isLoading = false; // Cambia el estado a no cargando
      })
      .catch(error => {
        console.log('Error al obtener templates de formularios', error);
        this.isLoading = false;
      });
  },
  methods: {
    formatDateToTextFormat(dateString) {
      const options = { day: 'numeric', month: 'long', year: 'numeric' };
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', options);
    },
    sortBy(attribute) {
      this.formTemplates.sort((a,b) => a[attribute] > b[attribute] ? -1 : 1);
    },
    prepareDelete(form, index) {
      this.itemToDelete = form;
      this.deleteIndex = index;
      this.deleteDialog = true;
    },
    async confirmDelete() {
      FormTemplateService.deleteFormTemplate(this.itemToDelete.id)
        .then( () => {
          this.formTemplates.splice(this.deleteIndex, 1);
          this.deleteDialog = false;
        })
        .catch(error => {
          console.error('Error al eliminar template de formulario', error);
        });
    },
  },
};
</script>

<style scoped>
.forms-title {
  font-size: 28px;
  font-weight: bold;
}
.forms-list {
  display: flex;
  flex-direction: column;
  align-items: center; 
  justify-content: center; 
  width: 80%;
}
.form.unused {
  border-left: 4px solid rgb(194, 192, 192);
}
.form.used {
  border-left: 4px solid rgb(103, 235, 103);
}
.v-chip.unused {
  background: rgb(194, 192, 192);
}
.v-chip.used {
  background: rgb(103, 235, 103);
}
</style>