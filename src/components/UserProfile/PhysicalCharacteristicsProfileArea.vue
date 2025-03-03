<template>
  <v-container>
    <v-row align="center" justify="space-between">
      <v-col cols="auto">
        <p class="font-weight-bold text-h6">Características Físicas</p>
      </v-col>
      <v-col cols="auto" class="text-right">
        <v-btn color="purple" @click="openPhysicalCharacteristicsDialog">Editar Formulario</v-btn>
      </v-col>
    </v-row>
    <!--- Visualizacion de la data ---->
    <v-card class="pa-3 my-4 elevation-2" variant="tonal" color="grey-darken-2">
      <v-row style="font-size:15px;">
        <v-col cols="3" md="3">
          <div class="caption">Peso (kg)</div>
          <div style="color:black !important">{{phCharacteristics.weight || '----------'}}</div>
        </v-col>
        <v-col cols="3" md="3">
          <div class="caption">Altura (cm)</div>
          <div style="color:black !important">{{phCharacteristics.height || '----------'}}</div>
        </v-col>
        <v-col cols="3" md="3">
          <div class="caption">Color de Ojos</div>
          <div style="color:black !important">{{phCharacteristics.eyes_color || '----------'}}</div>
        </v-col>
        <v-col cols="3" md="3">
          <div class="caption">Color de Piel</div>
          <div style="color:black !important">{{phCharacteristics.skin_color || '----------'}}</div>
        </v-col>
        <v-col cols="3" md="3">
          <div class="caption">Medida de Cintura (cm)</div>
          <div style="color:black !important">{{phCharacteristics.waist_measurement || '----------'}}</div>
        </v-col>
        <v-col cols="3" md="3">
          <div class="caption">Medida de Cadera (cm)</div>
          <div style="color:black !important">{{phCharacteristics.hip_measurement || '----------'}}</div>
        </v-col>
        <v-col cols="3" md="3">
          <div class="caption">Medida de Busto (cm)</div>
          <div style="color:black !important">{{phCharacteristics.bust_measurement || '----------'}}</div>
        </v-col>
        <v-col cols="3" md="3">
          <div class="caption">Color de Pelo</div>
          <div style="color:black !important">{{phCharacteristics.hair_color || '----------'}}</div>
        </v-col>
        <v-col cols="12">
          <p style="font-size: 20px;">  Talles Vestimenta  <v-icon color="purple">mdi-hanger</v-icon></p>
        </v-col>
        <v-col cols="3" md="3">
          <div class="caption">Pantalón</div>
          <div style="color:black !important">{{phCharacteristics.pant_size || '----------'}}</div>
        </v-col>
        <v-col cols="3" md="3">
          <div class="caption">Remera</div>
          <div style="color:black !important">{{phCharacteristics.tshirt_size || '----------'}}</div>
        </v-col>
        <v-col cols="3" md="3">
          <div class="caption">Saco</div>
          <div style="color:black !important">{{phCharacteristics.jacket_size || '----------'}}</div>
        </v-col>
        <v-col cols="3" md="3">
          <div class="caption">Calzado</div>
          <div style="color:black !important">{{phCharacteristics.shoes_size || '----------'}}</div>
        </v-col>
        <v-col cols="12">
          <p style="font-size: 20px;">  Información Adicional  <v-icon color="purple">mdi-pencil-plus-outline</v-icon></p>
        </v-col>
        <v-col cols="3" md="3">
          <div class="caption">Manos</div>
          <div style="color:black !important">{{phCharacteristics.hands || '----------'}}</div>
        </v-col>
        <v-col cols="3" md="3">
          <div class="caption">Pies</div>
          <div style="color:black !important">{{phCharacteristics.feet || '----------'}}</div>
        </v-col>
        <v-col cols="3" md="3">
          <div class="caption">Dientes</div>
          <div style="color:black !important">{{phCharacteristics.teeth || '----------'}}</div>
        </v-col>
        <v-col cols="3" md="3">
          <div class="caption">Brackets</div>
          <div style="color:black !important">{{ phCharacteristics.braces === null ? '----------' : (phCharacteristics.braces ? 'Sí' : 'No') }}</div>
        </v-col>
        <v-col cols="3" md="3">
          <div class="caption">Tatuajes</div>
          <div style="color:black !important">{{ phCharacteristics.tattoos === null ? '----------' : (phCharacteristics.tattoos ? 'Sí' : 'No') }}</div>
        </v-col>
        <v-col v-if="formData.tattoos == 'Sí'" cols="3" md="3">
          <div class="caption">Zona de Tatuajes</div>
          <div style="color:black !important">{{phCharacteristics.tattoos_area || '----------'}}</div>
        </v-col>
        <v-col cols="3" md="3">
          <div class="caption">Piercings</div>
          <div style="color:black !important">{{ phCharacteristics.piercings === null ? '----------' : (phCharacteristics.piercings ? 'Sí' : 'No') }}</div>
        </v-col>
        <v-col v-if="formData.piercings == 'Sí'" cols="3" md="3">
          <div class="caption">Zona de Piercings</div>
          <div style="color:black !important">{{phCharacteristics.piercings_area || '----------'}}</div>
        </v-col>
        <v-col cols="3" md="3">
          <div class="caption">Aclaraciones</div>
          <div style="color:black !important">{{phCharacteristics.extra_information || '----------'}}</div>
        </v-col>
      </v-row>
    </v-card>
    
    <v-dialog v-model="physicalCharacteristicsDialog" max-width="800px">
      <v-card>
        <v-card-title class="justify-center text-center">
          <span class="text-h5">{{ 'Editar Características Físicas' }}</span>
        </v-card-title>
        <v-form ref="form" @submit.prevent="handleSubmit">
        <v-card-text>
            <v-row>
              <v-col cols="3">
                <v-text-field
                  v-model="formData.weight"
                  label="Peso (kg)"
                  type="number"
                  :rules="numericRule"
                  required
                  outlined
                  dense
                  hide-details="auto"
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  v-model="formData.height"
                  label="Altura (cm)"
                  type="number"
                  :rules="numericRule"
                  required
                  outlined
                  dense
                  hide-details="auto"
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-select
                  v-model="formData.eyes_color"
                  :items="eyesColorOptions"
                  label="Color de Ojos"
                  required
                  :menu-props="{ bottom: true }"
                  outlined
                  dense
                  hide-details="auto"
                ></v-select>
              </v-col>
              <v-col cols="3">
                <v-select
                  v-model="formData.skin_color"
                  :items="skinColorOptions"
                  label="Color de Piel"
                  required
                  outlined
                  dense
                  hide-details="auto"
                ></v-select>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  v-model="formData.waist_measurement"
                  label="Medida de Cintura (cm)"
                  type="number"
                  :rules="numericRule"
                  outlined
                  dense
                  hide-details="auto"
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  v-model="formData.hip_measurement"
                  label="Medida de Cadera (cm)"
                  :rules="numericRule"
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  v-model="formData.bust_measurement"
                  label="Medida de Busto (cm)"
                  :rules="numericRule"
                  type="number"
                  outlined
                  dense
                  hide-details="auto"
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-select
                  v-model="formData.hair_color"
                  :items="hairColorOptions"
                  label="Color de Pelo"
                  required
                  outlined
                  dense
                  hide-details="auto"
                ></v-select>
              </v-col>
              <v-col cols="12">
                <p class="text-h6">  Talles Vestimenta  <v-icon color="purple">mdi-hanger</v-icon></p>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  v-model="formData.pant_size"
                  label="Pantalón"
                  outlined
                  dense
                  hide-details="auto"
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  v-model="formData.tshirt_size"
                  label="Remera"
                  outlined
                  dense
                  hide-details="auto"
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  v-model="formData.jacket_size"
                  label="Saco"
                  outlined
                  dense
                  hide-details="auto"
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  v-model="formData.shoes_size"
                  label="Calzado"
                  outlined
                  dense
                  hide-details="auto"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <p class="text-h6">  Información Adicional  <v-icon color="purple">mdi-pencil-plus-outline</v-icon></p>
              </v-col>
              <v-col cols="3">
                <v-select
                  v-model="formData.hands"
                  :items="handsOptions"
                  label="Manos"
                  required
                  outlined
                  dense
                  hide-details="auto"
                ></v-select>
              </v-col>
              <v-col cols="3">
                <v-select
                  v-model="formData.feet"
                  :items="feetOptions"
                  label="Pies"
                  required
                  outlined
                  dense
                  hide-details="auto"

                ></v-select>
              </v-col>
              <v-col cols="3">
                <v-select
                  v-model="formData.teeth"
                  :items="teethOptions"
                  label="Dientes"
                  required
                  outlined
                  dense
                  hide-details="auto"
                ></v-select>
              </v-col>
              <v-col cols="3">
                <v-select
                  v-model="formData.braces"
                  :items="yesNoOptions"
                  label="Brackets"
                  required
                  outlined
                  dense
                  hide-details="auto"
                ></v-select>
              </v-col>
              <v-col cols="3">
                <v-select
                  v-model="formData.tattoos"
                  :items="yesNoOptions"
                  label="Tatuajes"
                  required
                  outlined
                  dense
                  hide-details="auto"
                ></v-select>
              </v-col>
              <v-col v-if="formData.tattoos === 'Sí'" cols="3">
                <v-text-field
                  v-model="formData.tattoos_area"
                  label="Zona Tatuajes"
                  :rules="maxLengthRule"
                  outlined
                  dense
                  hide-details="auto"
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-select
                  v-model="formData.piercings"
                  :items="yesNoOptions"
                  label="Piercings"
                  required
                  outlined
                  dense
                  hide-details="auto"
                ></v-select>
              </v-col>
              <v-col v-if="formData.piercings === 'Sí'" cols="3">
                <v-text-field
                  v-model="formData.piercings_area"
                  label="Zona Piercings"
                  :rules="maxLengthRule"
                  outlined
                  dense
                  hide-details="auto"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="formData.extra_information"
                  label="Aclaraciones"
                  :rules="maxLengthRule2"
                  outlined
                  dense
                  hide-details="auto"
                ></v-text-field>
              </v-col>
            </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="purple" type="submit">Guardar</v-btn>
          <v-btn color="grey" @click="cancelEdition()">Cancelar</v-btn>
        </v-card-actions>
        </v-form>
      </v-card> 
    </v-dialog>
  </v-container>
</template>

<script>
import { eyesColors } from '@/config/eyes-color';
import UserService from '../../services/user.service';
import { hairColors } from '@/config/hair-colors';
import { skinColor } from '@/config/skin-color';
import { hands } from '@/config/hands';
import { feethTeeth } from '@/config/feet-teeth';

export default {
  name: "PhysicalCharacteristicsProfileArea",
  props: {
    phCharacteristics: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      formData: {}, //Copia del prop que se recibe del padre para poder modificar los datos
      eyesColorOptions: ['-----------'].concat(eyesColors),
      skinColorOptions: ['-----------'].concat(skinColor),
      yesNoOptions: ['-----------','Sí', 'No'],
      hairColorOptions: ['-----------'].concat(hairColors),
      handsOptions: ['-----------'].concat(hands),
      feetOptions: ['-----------'].concat(feethTeeth),
      teethOptions: ['-----------'].concat(feethTeeth),
      physicalCharacteristicsDialog: false,

      numericRule: [value => !value || /^(0|[1-9][0-9]*)(\.[0-9]+)?$/.test(value) || 'Debe ser un número positivo.'],
      maxLengthRule: [
        value => !value || typeof value === 'string' && value.length <= 50 || 'Máximo 50 caracteres',
      ],
      maxLengthRule2: [
        value => !value || typeof value === 'string' && value.length <= 100 || 'Máximo 100 caracteres',
      ]
    };
  },
  methods: {
    cancelEdition() {
      this.physicalCharacteristicsDialog = false;
    },
    openPhysicalCharacteristicsDialog() {
      this.physicalCharacteristicsDialog = true;
      this.formData = JSON.parse(JSON.stringify(this.phCharacteristics));
      for (let field in this.formData) {
        if (this.formData[field] == true) {
          this.formData[field] = 'Sí';
        } else if (this.formData[field] == false) {
          this.formData[field] = 'No';
        }
      }
    },
    async handleSubmit() {
      this.$refs.form.validate().then(result => {
      if (result.valid) {
        for (let field in this.formData) {
          if (this.formData[field] == '-----------') {
            this.formData[field] = null;
          }
        }
        
        this.formData.braces = this.formData.braces === 'Sí' ? true : (this.formData.braces === 'No' ? false : null);
        this.formData.tattoos = this.formData.tattoos === 'Sí' ? true : (this.formData.tattoos === 'No' ? false : null);
        this.formData.piercings = this.formData.piercings === 'Sí' ? true : (this.formData.piercings === 'No' ? false : null);

        UserService.updateUserData(this.$store.state.auth.user.id, this.formData)
          .then(response => {
            console.log('Se actualizaron las características físicas:', response.data);
            this.$emit('update-physical-characteristics', this.formData);
          })
          .catch(error => {
            console.error('Error al actualizar las características físicas', error);
          });
          this.physicalCharacteristicsDialog = false;
      } else {
        console.log("FORM INVALIDO");
        console.log(result.errors);
      }
    }).catch(error => {
      console.error("Error al validar el formulario", error);
      this.physicalCharacteristicsDialog = false;
    });
    }
  }
};

</script>