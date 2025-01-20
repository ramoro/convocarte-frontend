<template>
 <v-container style="display: flex; justify-content: center; align-items: center;">
     <!-- Cargando Castings -->
    <v-row v-if="isLoading" justify="center" align="center" style="height: 60vh;">
      <v-container class="text-center">
        <v-progress-circular indeterminate color="cyan"></v-progress-circular>
        <div>Cargando casting...</div>
      </v-container>
    </v-row>

    <v-row v-else justify="center" align="center" style="width: 100%;">
        <v-col cols="12" md="8">
            <h2 class="mt-2 mb-3">Crear Casting</h2>
        </v-col>
        
      <v-col cols="12" md="8">
        <v-form v-model="valid" ref="form" class="mt-2" @submit.prevent="submitForm()">
            <v-row>
                <v-col cols="12">
                    <v-text-field
                        v-model="castingCall.title"
                        label="Título de Búsqueda"
                        :rules="[maxLengthRule, requiredRule].flat()" 
                        required
                    >
                    <template #label>
                    <span class="text-red"><strong>* </strong></span>Título de Búsqueda
                    </template>
                    </v-text-field>
                </v-col>
            </v-row>

          <v-textarea
            v-model="castingCall.description"
            label="Descripción"
            :rules="descriptionRule" 
            required
          ></v-textarea>

          <v-row>
            <v-col cols="6">
                <v-select
                    v-model="castingCall.remuneration_type"
                    :items="castingRemunerationTypes"
                    label="Tipo de Remuneración"
                    :rules="requiredRule"
                    required
                    hide-details="auto"
                >
                <template #label>
                <span class="text-red"><strong>* </strong></span>Tipo de Remuneración
                </template>
                </v-select>
            </v-col>
            <v-col cols="6">
                <!-- Descripción para 'Otro' -->
                <v-text-field
                    v-if="castingCall.remuneration_type === 'Otro'"
                    v-model="otherRemunerationType"
                    label="Descripción de 'Otro'"
                    :rules="[maxLengthRule, requiredRule].flat()" 
                    required
                    hide-details="auto"
                >
                    <template #label>
                    <span class="text-red"><strong>* </strong></span>Descripción de 'Otro'
                    </template>
                </v-text-field>
            </v-col>

            <v-col cols="6">
                <v-select
                    v-if="userProjects.length > 0"
                    v-model="castingCall.project_id"
                    :items="userProjects"
                    item-title="name"
                    item-value="id"
                    label="Proyecto a Castear"
                    :rules="requiredRule"
                    :disabled="editionMode"
                    required
                    hide-details="auto"
                    @update:modelValue="displayRolesForProject"
                >
                <template #label>
                <span class="text-red"><strong>* </strong></span>Proyecto a Castear
                </template>
                </v-select>
            </v-col>
          </v-row>

            <v-row v-if="rolesProjectSelected.length > 0">
                <v-col cols="12">
                    <h4 class="mt-4" v-if="!editionMode">Seleccionar Roles a castear:</h4>
                    <h4 class="mt-4" v-else>Roles a castear:</h4>
                    <v-row class="mt-2" v-for="role in rolesProjectSelected" :key="role.id" align="start">
                    
                        <v-col cols="12">
                            <v-row no-gutters>
                                <!-- Checkbox para seleccionar el rol -->
                                <v-col cols="auto">
                                    <v-checkbox
                                        v-model="selectedRoles"
                                        :label="role.name"
                                        :value="role.id"
                                        hide-details="auto"
                                        :rules="rolesRule"
                                        :disabled="editionMode"
                                        @change="handleRoleSelection(role)"
                                    ></v-checkbox>
                                </v-col>
                        
                                <v-col cols="auto">
                                    <v-btn
                                        v-if="editionMode" 
                                        size="small"
                                        :color="getRoleToCast(role.id).disabled ? 'green' : 'red'"
                                        style="margin-top:13px; margin-left: 15px;"
                                        class="no-bg"
                                        variant="outlined"
                                        @click="getRoleToCast(role.id).disabled = !getRoleToCast(role.id).disabled"
                                    >
                                        {{getRoleToCast(role.id).disabled == true ? 'Habilitar ': 'Deshabilitar'}}
                                    </v-btn>
                                </v-col>
                            </v-row>
                            <!--Se vera el container para agregarle las caracteristicas al rol a exponer en el casting
                            si efectivamente el rol esta elegido (checkbox clickeado) y si no es modo edicion, o si es modo edicion
                            y el rol esta habilitado-->
                            <v-container v-if="rolesToCast.some(item => item.role_id === role.id) && 
                            (!editionMode || (editionMode && !getRoleToCast(role.id).disabled))">
                                <v-row>
                                    <v-col v-if="!editionMode" cols="4">
                                        <v-select
                                            v-model="getRoleToCast(role.id).form_template_id" 
                                            :items="userForms"
                                            item-title="form_template_title"
                                            item-value="id"
                                            label="Asociar Formulario"
                                            :key="'select-' + role.name"
                                            :rules="requiredRule"  
                                        >
                                        <template #label>
                                            <span class="text-red"><strong>* </strong></span>Asociar Formulario
                                        </template>
                                        </v-select>
                                    </v-col>
                                    <v-col v-else cols="12">
                                        <span>
                                        <v-tooltip text="Editar este formulario no afectará al template asignado originalmente" location="top">
                                            <template v-slot:activator="{ props }">
                                                <v-icon color="purple" class="mr-2" v-bind="props">mdi-information</v-icon>
                                            </template>
                                        </v-tooltip> 
                                        <b>Formulario para el rol:</b>
                                         
                                        <v-tooltip text="Editar Formulario" location="top">
                                        <template v-slot:activator="{ props }">
                                            <v-chip v-bind="props" class="ml-3 elevable-chip" @click="editCastingCallForm(getRoleToCast(role.id).form_id, role.name)">
                                               {{ getRoleToCast(role.id).form_title }} 
                                            </v-chip>
                                        </template>
                                        </v-tooltip>
                                        </span>
                                    </v-col>
                                    <v-col cols="4">
                                        <v-select
                                            v-model="getRoleToCast(role.id).has_limited_spots"  
                                            :items="hasLimitedSpotsOptions"
                                            item-title="name"
                                            item-value="id"
                                            label="Límite de Cupos"
                                            :key="'select-' + role.name"
                                            :rules="requiredBooleanValue"  
                                        >
                                        <template #label>
                                            <span class="text-red"><strong>* </strong></span>Límite de Cupos
                                        </template>
                                        </v-select>
                                    </v-col>
                                    <v-col cols="4">
                                        <v-text-field
                                        v-if="getRoleToCast(role.id).has_limited_spots === true"
                                        v-model="getRoleToCast(role.id).spots_amount"
                                        label="Cantidad de Cupos"
                                        :rules="requiredRule" 
                                        required
                                        type="number"
                                        hide-details="auto"
                                        >
                                        <template #label>
                                        <span class="text-red"><strong>* </strong></span>Cantidad de Cupos
                                        </template>
                                        </v-text-field>                                        
                                    </v-col>
                                </v-row>
                                <p style="font-style:italic; font-weight: bold; margin-bottom: 20px; margin-top: 10px">
                                    <v-tooltip text="Estos Requisitos ayudan a los filtros de búsqueda" location="top">
                                        <template v-slot:activator="{ props }">
                                            <v-icon color="cyan" class="mr-2" v-bind="props">mdi-information</v-icon>
                                        </template>
                                    </v-tooltip>
                                    Requisitos
                                </p>

                                <v-row>
                                    <v-col cols="4 text-center">
                                        <h4>Edad</h4>
                                    </v-col>
                                    <v-col cols="4 text-center">
                                        <h4>Altura</h4>
                                    </v-col>
                                </v-row>
                    
                                <v-row style="margin-top: 1px !important;">
                                    <v-col cols="2">
                                        <v-text-field
                                            v-model="getRoleToCast(role.id).min_age_required"
                                            label="Mín."
                                            type="number"
                                            required
                                            hide-details="auto"
                                        >
                                        </v-text-field>
                                    </v-col>
                                    <v-col cols="2">
                                        <v-text-field
                                            v-model="getRoleToCast(role.id).max_age_required"
                                            label="Máx."
                                            type="number"
                                            required
                                            hide-details="auto"
                                        >
                                        </v-text-field>
                                    </v-col>
                                    <v-col cols="2">
                                        <v-text-field
                                            v-model="getRoleToCast(role.id).min_height_required"
                                            label="Mín."
                                            type="number"
                                            required
                                            hide-details="auto"
                                        >
                                        </v-text-field>
                                    </v-col>
                                    <v-col cols="2">
                                        <v-text-field
                                            v-model="getRoleToCast(role.id).max_height_required"
                                            label="Máx."
                                            type="number"
                                            required
                                            hide-details="auto"
                                        >
                                        </v-text-field>
                                    </v-col>
                                    <v-col cols="4">
                                        <v-select
                                            v-model="getRoleToCast(role.id).hair_colors_required"
                                            :items="hairColorsMultipleOptions"
                                            label="Color/es de pelo"
                                            multiple
                                            chips
                                            deletable-chips
                                            persistent-hint
                                        ></v-select>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-text-field
                                            v-model="getRoleToCast(role.id).additional_requirements"
                                            label="Requisitos Adicionales"
                                            :rules="descriptionRule" 
                                        >
                                        </v-text-field>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="12"> 
                    <h4 class="mt-4">                                 
                        <v-tooltip text="Las fotos ser verán en el orden en que fueron subidas" location="top">
                            <template v-slot:activator="{ props }">
                                <v-icon color="cyan" class="mr-2" v-bind="props">mdi-information</v-icon>
                            </template>
                        </v-tooltip>
                        Agregar fotos para la convocatoria (máximo {{maxPhotos}}):
                    </h4>
                </v-col>
                
                <v-col cols="3" class="ml-7">
                    <AddPhotoButton @add-photo="handleAddPhoto" :buttonDisabled="photoButtonDisabled" />
                </v-col>
                <v-col cols="4">
                    <v-btn 
                        size="small"
                        class="no-bg"
                        flat
                        @click="showPhotosPreview()"
                        >
                        Preview Fotos
                    </v-btn>
                </v-col>
            </v-row>

            <!-- Mostrar lista de fotos agregadas -->
            <v-list dense style="background-color: transparent !important;" v-if="castingPhotos.length > 0" class="mt-3 ml-7">
                <v-list-item v-for="(photo, index) in castingPhotos" :key="index">
                    <v-list-item-title>Foto Casting {{index + 1}}  <v-icon class="remove-icon" @click="removePhoto(index, photo)">mdi-delete</v-icon></v-list-item-title>
                    <v-list-item-action>
                        
                    </v-list-item-action>
                </v-list-item>
            </v-list>



            <!-- Botones de Acción -->
            <v-row justify="end" class="mt-20 mb-10 mr-2">
            <v-btn
                :loading="buttonLoading"
                color="purple"
                class="mr-2"
                type="submit"
            >
                {{editionMode ? 'Actualizar' : 'Guardar'}}
            </v-btn>
            <v-btn
                text
                color="grey"
                @click="cancelCastingCallCreation()"
            >
                Cancelar
            </v-btn>
            </v-row>
        </v-form>
    </v-col>
    </v-row>
    <!-- Dialogo para mostrar las fotos del casting -->
    <v-dialog v-model="photosDialog" max-width="1000px">
      <v-card class="rounded-lg">
        <v-card-title>
          <span class="text-h5">Fotos de la Búsqueda</span>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col v-if="castingPhotos.length == 0">
              <span class="text-h6">El Casting no posee fotos...</span>
            </v-col>
            <v-col v-for="(photo, index) in castingPhotos" :key="index" cols="6" class="mb-2">
              <v-img :src="photo.photoUrl" :alt="'Foto ' + index" aspect-ratio="1" contain></v-img>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="photosDialog = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <InformationSnackbar ref="InformationSnackbar"/>
  </v-container>
  </template>
  
  <script>
  import InformationSnackbar from '@/components/InformationSnackbar.vue';
  import { remunerationTypes } from '@/config/remuneration-types';
  import ProjectService from '@/services/project.service';
  import FormTemplateService from '@/services/form-template.service';
  import { hairColors } from '@/config/hair-colors';
  import AddPhotoButton from '@/components/AddPhotoButton.vue';
  import castingCallService from '@/services/casting-call.service';
  
  export default {
    components: {
      InformationSnackbar,
      AddPhotoButton
    },
    async mounted() {
      this.$root.InformationSnackbar = this.$refs.InformationSnackbar;
      if (this.$route.params.id) {
        this.castingCallId = this.$route.params.id;
        this.editionMode = true;
        await this.loadCastingCallData(this.castingCallId);
      } else {
        await this.loadUserProjectsAndFormTemplates();
      }
      if (this.$route.query.updatedRole) {
        this.$root.InformationSnackbar.show({
            message: 'Se actualizó el Formulario asociado al rol ' + this.$route.query.updatedRole,
            color: 'green', 
            buttonColor:'white'} );  
      }
      this.isLoading = false;
    },
    data() {
      return {
        isLoading: true,
        buttonLoading: false,
        photosDialog: false,
        valid: false, // Valida si el formulario es correcto
        castingCall: {
          title: '',
          description: '',
          remuneration_type: null,
          project_id: null,
        },
        castingPhotos: [],
        otherRemunerationType: '',
        requiredRule: [value => !!value || 'Este campo es requerido.'],
        requiredBooleanValue : [value => !!value || value === false || 'Este campo es requerido.'],
        rolesRule: [value => value.length > 0 || 'Se debe seleccionar al menos un rol.'],
        maxLengthRule: [
          value => (value.length <= 100) || 'Máximo 100 caracteres',
        ], 
        descriptionRule: [
          value => (value.length <= 600) || 'Máximo 600 caracteres',
        ],
        castingRemunerationTypes: remunerationTypes,
        userProjects: [], //Tendra por cada proyecto un json con id, nombre y roles asociados
        rolesProjectSelected: [],
        userForms: [], //Tendra ids de form templates o forms segun si se esta creando o si es pantalla para editar
        selectedRoles: [],  //Tendra ids de roles seleccionados
        rolesToCast: [], //Los roles que se van seleccionando para castear se almacenan aca junto a la data de requerimientos seteada
        hairColorsMultipleOptions: hairColors,
        selectedPhoto: null,
        photoButtonDisabled: false,
        maxPhotos: 6,
        hasLimitedSpotsOptions: [
            { id: true, name: 'Sí' },
            { id: false, name: 'No' }
        ],
        castingCallId: null,
        editionMode: false,
        deletedPhotos: [] //Tendra la url de las photos eliminadas, que se mandaran cuando la pantalla se use como edicion

      };
    },
    methods: {
        async loadUserProjectsAndFormTemplates() {
            FormTemplateService.getUserFormTemplates()
                .then(response => {
                    this.userForms = response.data;
                })
                .catch(error => {
                    console.log('Error al obtener templates de formularios del usuario', error);
                });
            
            ProjectService.getUserProjectsWithRoles()
                .then(response => {
                    this.userProjects = response.data; 
                })
                .catch(error => {
                    console.log('Error al obtener proyectos del usuario', error);
                });
        },
        getRoleToCast(roleId) {
            return this.rolesToCast.find(item => item.role_id === roleId) || {};
        },
        addRoleToCast(roleId) {
            // Busca el objeto correspondiente al role_id, si no lo encuentra, lo crea.
            let roleToCast = this.rolesToCast.find(item => item.role_id === roleId);

            if (!roleToCast) {
                // Si no se encuentra, creamos un nuevo objeto con valores por defecto
                roleToCast = {
                    role_id: roleId,
                    form_template_id: null,
                    has_limited_spots: null,
                    spots_amount: null,
                    min_age_required: null,
                    max_age_required: null,
                    hair_colors_required: [],
                    additional_requirements: ""
                };
                // Lo agregamos al array
                this.rolesToCast.push(roleToCast);
            }
        },
        handleRoleSelection(role) {
            // Si el rol es seleccionado, inicializamos sus datos en rolesToCast
            if (this.selectedRoles.includes(role.id)) {
                this.addRoleToCast(role.id); // Nos aseguramos de que el rol esté en rolesToCast
            } else {
                // Si el rol es deseleccionado, eliminamos sus datos
                this.rolesToCast = this.rolesToCast.filter(item => item.role_id !== role.id);
            }
        },
        async submitForm() {
            const validation = await this.$refs.form.validate();
            if (validation.valid) {
                this.buttonLoading = true;
                
                for (let role of this.rolesToCast) {
                    //Transforma los objetos con los colores de pelos a un string de forma: Morocho, Castaño, etc.
                    console.log(role.hair_colors_required);
                    role.hair_colors_required =  role.hair_colors_required ? Object.values(role.hair_colors_required).join(', ') : null;
                }
                if (this.editionMode) {
                    let allRolesDisabled = true;
                    for (let role of this.rolesToCast) {
                        if (role.disabled == false) {
                            allRolesDisabled = false;
                            break;
                        }
                    }
                    
                    //Si no hay al menos un rol habilitado la edicion no se efectua
                    if (allRolesDisabled) {
                        this.$root.InformationSnackbar.show({
                            message: 'Debe haber al menos un rol habilitado para actualizar el casting',
                            color: 'dark', 
                            buttonColor: 'red'
                            });
                        this.buttonLoading = false;
                        return;
                    }
                    //Filtra las photos del casting y se queda con las nuevas agregadas
                    for (let key in this.castingPhotos) {
                        let photo = this.castingPhotos[key];
                        
                        // Si la photo no tiene el atributo 'new' o no es 'true', la eliminamos
                        if (!(photo['new'] && photo['new'] == true)) {
                            delete this.castingPhotos[key];
                        }
                    }

                    try {
                        this.rolesToCast.forEach(role => {
                            delete role.form_title; //No se manda el titulo del form
                        });
                        let deletedPhotosStr = '';
                        console.log(this.deletedPhotos);
                        this.deletedPhotos.forEach(deletedPhoto => {
                            console.log('deleted photo', deletedPhoto)
                            deletedPhotosStr += deletedPhoto + ",";
                        });
                        deletedPhotosStr = deletedPhotosStr.slice(0, -1); //Saco coma extra del final
                        await castingCallService.updateCastingCall(this.castingCallId, this.castingCall, deletedPhotosStr, Object.values(this.castingPhotos), this.rolesToCast);
                        this.$router.push({ path: '/user-casting-calls', query: { title: this.castingCall.title, status: 'updated' } });
                    } catch (error) {
                        console.log('Error al actualizar el casting:', error);
                        this.$root.InformationSnackbar.show({
                        message: 'Error al actualizar el casting.',
                        color: 'dark', 
                        buttonColor: 'red'
                        });
                    }
                } else {
                    try {
                        await castingCallService.createCastingCall(this.castingCall, this.castingPhotos, this.rolesToCast);
                        this.$router.push({ path: '/user-casting-calls', query: { title: this.castingCall.title, status: 'created' } });
                    } catch (error) {
                        console.log('Error al crear el casting:', error);
                        this.$root.InformationSnackbar.show({
                        message: 'Error al crear el casting.',
                        color: 'dark', 
                        buttonColor: 'red'
                        });
                    }
                }
            }
            this.buttonLoading = false;
        },
        cancelCastingCallCreation() {
            this.$router.push({ path: '/user-casting-calls'});
        },
        async displayRolesForProject(projectId) {
            
            if (projectId) {
                const project = this.userProjects.find(p => p.id === projectId);
                this.rolesProjectSelected = project.roles;
            }
        },
        // Agrega la foto seleccionada a la lista (el nombre)
        handleAddPhoto(photo) {
            photo.new = true;
            this.castingPhotos.push(photo);
            if (this.castingPhotos.length >= this.maxPhotos) this.photoButtonDisabled = true;
        },

        // Elimina una foto de la lista
        removePhoto(index, photo) {
            this.castingPhotos.splice(index, 1); // Elimina la foto en el índice indicado
            this.photoButtonDisabled = false;
            //Se pone limite para que no agregue infinitamente (esto sirve para cuando funciona como edicion de casting)
            //Solo podra haber una eliminacion de max 6 photos, q es lo qpuede tener un casting
            //Si la foto fue recien agregada no se pone en deletedPhotos porque no hay que avisarle
            //al back que la tiene que eliminar, porque nunca fue almacenada
            if (this.deletedPhotos.length <= this.maxPhotos && !photo['new']) {
                this.deletedPhotos.push(photo.photoUrl);
            }
        },
        async loadCastingCallData(id) {
            try {
                const response = await castingCallService.getCastingCallById(id);
                const castingData = response.data;
                const projectAssociated = castingData.project;
                const exposedRoles = castingData.exposed_roles;
                this.castingCall.title = castingData.title;
                this.castingCall.description = castingData.description ? castingData.description : '';
                this.castingCall.remuneration_type = castingData.remuneration_type;
                this.castingCall.project_id = projectAssociated.id;
                this.castingCall.state = castingData.state;
                //En roles pondremos los roles que han sido seleccionados para castear en el proyecto
                this.userProjects.push({"id": projectAssociated.id, "name": projectAssociated.name, "roles": []});
                for (const exposedRoleInfo of exposedRoles) {
                    this.userProjects[0].roles.push({"id": exposedRoleInfo.role.id, "name": exposedRoleInfo.role.name});
                    this.rolesProjectSelected.push({"id": exposedRoleInfo.role.id, "name": exposedRoleInfo.role.name});
                    this.userForms.push({"id": exposedRoleInfo.form.id, "form_title": exposedRoleInfo.form.form_title});
                    var roleToCast = {
                        id: exposedRoleInfo.id,
                        role_id: exposedRoleInfo.role.id,
                        form_id: exposedRoleInfo.form.id, //Al ser un casting ya creado este sera el id de un form, no de un form template
                        form_title: exposedRoleInfo.form.form_title,
                        has_limited_spots: exposedRoleInfo.has_limited_spots,
                        spots_amount: exposedRoleInfo.spots_amount,
                        min_age_required: exposedRoleInfo.min_age_required,
                        max_age_required: exposedRoleInfo.max_age_required,
                        hair_colors_required: exposedRoleInfo.hair_colors_required ? exposedRoleInfo.hair_colors_required.split(',').map(item => item.trim()) : null,
                        additional_requirements: exposedRoleInfo.additional_requirements,
                        disabled: exposedRoleInfo.disabled
                    };
                    
                    this.rolesToCast.push(roleToCast);
                    this.selectedRoles.push(exposedRoleInfo.role.id);
                }
                for (let photoUrl of castingData.casting_photos) {
                    this.castingPhotos.push({photoUrl: photoUrl });
                }

            } catch (error) {
                console.log('Error al cargar el casting:', error);
                this.$root.InformationSnackbar.show({
                  message: 'Error al cargar el casting.',
                  color: 'dark', 
                  buttonColor: 'red'
                });
            }
        },
        editCastingCallForm(formId, roleName) {
            this.$router.push({
                path:`/form-builder/${formId}/${this.castingCallId}`, 
                query: { castingTitle: this.castingCall.title, roleName: roleName}
            });
        },
        // Función para mostrar las fotos del casting
        showPhotosPreview() {
            this.photosDialog = true;
        },
    }
  };
  </script>
  
  <style scoped>
  
    .cyan-border {
        border-top: 3px solid rgb(2, 151, 156);
    }

    .elevable-chip {
        cursor: pointer; 
        transition: transform 0.2s ease, box-shadow 0.2s ease; /* Transición suave */
        background-color: purple;
        color: white;
    }

    .elevable-chip:hover {
        transform: translateY(-5px); /* Eleva el chip */
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Agrega sombra al elevarse */
    }

    .no-bg {
    background-color: transparent !important;
    color: purple;
    }
  </style>