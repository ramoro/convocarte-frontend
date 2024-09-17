<template>
  <v-container>
    <v-row v-if="!isEditMode">
      <v-col cols="12">
        <div style="text-align: right;">
          <v-btn color="purple" @click="activateEditMode">Editar Formulario</v-btn>
        </div>
      </v-col>
    </v-row>
    <!--- Visualizacion de la data ---->
    <v-card v-if="!isEditMode" class="pa-3 my-4 elevation-2" variant="tonal" color="grey-darken-2">
      <v-row style="font-size:15px;">
        <v-col cols="3" md="3">
          <div class="caption">Peso</div>
          <div style="color:black !important">{{formData.weight || '----------'}}</div>
        </v-col>
        <v-col cols="3" md="3">
          <div class="caption">Altura</div>
          <div style="color:black !important">{{formData.height || '----------'}}</div>
        </v-col>
        <v-col cols="3" md="3">
          <div class="caption">Color de Ojos</div>
          <div style="color:black !important">{{formData.eyesColor || '----------'}}</div>
        </v-col>
        <v-col cols="3" md="3">
          <div class="caption">Color de Piel</div>
          <div style="color:black !important">{{formData.skinColor || '----------'}}</div>
        </v-col>
        <v-col cols="3" md="3">
          <div class="caption">Medida de Cintura</div>
          <div style="color:black !important">{{formData.waistMeasurement || '----------'}}</div>
        </v-col>
        <v-col cols="3" md="3">
          <div class="caption">Medida de Cadera</div>
          <div style="color:black !important">{{formData.hipMeasurement || '----------'}}</div>
        </v-col>
        <v-col cols="3" md="3">
          <div class="caption">Medida de Busto</div>
          <div style="color:black !important">{{formData.bustMeasurement || '----------'}}</div>
        </v-col>
        <v-col cols="3" md="3">
          <div class="caption">Color de Pelo</div>
          <div style="color:black !important">{{formData.hairColor || '----------'}}</div>
        </v-col>
        <v-col cols="12">
          <p style="font-size: 20px;">  Talles Vestimenta  <v-icon color="purple">mdi-hanger</v-icon></p>
        </v-col>
        <v-col cols="3" md="3">
          <div class="caption">Pantalón</div>
          <div style="color:black !important">{{formData.pantSize || '----------'}}</div>
        </v-col>
        <v-col cols="3" md="3">
          <div class="caption">Remera</div>
          <div style="color:black !important">{{formData.tShirtSize || '----------'}}</div>
        </v-col>
        <v-col cols="3" md="3">
          <div class="caption">Saco</div>
          <div style="color:black !important">{{formData.jacketSize || '----------'}}</div>
        </v-col>
        <v-col cols="3" md="3">
          <div class="caption">Calzado</div>
          <div style="color:black !important">{{formData.shoeSize || '----------'}}</div>
        </v-col>
        <v-col cols="12">
          <p style="font-size: 20px;">  Información Adicional  <v-icon color="purple">mdi-pencil-plus-outline</v-icon></p>
        </v-col>
        <v-col cols="3" md="3">
          <div class="caption">Manos</div>
          <div style="color:black !important">{{formData.hands || '----------'}}</div>
        </v-col>
        <v-col cols="3" md="3">
          <div class="caption">Pies</div>
          <div style="color:black !important">{{formData.feet || '----------'}}</div>
        </v-col>
        <v-col cols="3" md="3">
          <div class="caption">Dientes</div>
          <div style="color:black !important">{{formData.teeth || '----------'}}</div>
        </v-col>
        <v-col cols="3" md="3">
          <div class="caption">Brackets</div>
          <div style="color:black !important">{{formData.braces || '----------'}}</div>
        </v-col>
        <v-col cols="3" md="3">
          <div class="caption">Tatuajes</div>
          <div style="color:black !important">{{formData.tattoos || '----------'}}</div>
        </v-col>
        <v-col cols="3" md="3">
          <div class="caption">Zona de Tatuajes</div>
          <div style="color:black !important">{{formData.tattoosArea || '----------'}}</div>
        </v-col>
        <v-col cols="3" md="3">
          <div class="caption">Piercings</div>
          <div style="color:black !important">{{formData.piercings || '----------'}}</div>
        </v-col>
        <v-col cols="3" md="3">
          <div class="caption">Zona de Piercings</div>
          <div style="color:black !important">{{formData.piercingsArea || '----------'}}</div>
        </v-col>
        <v-col cols="3" md="3">
          <div class="caption">Aclaraciones</div>
          <div style="color:black !important">{{formData.extraInformation || '----------'}}</div>
        </v-col>
      </v-row>
    </v-card>
    

    <v-form v-if="isEditMode" ref="form" @submit.prevent="handleSubmit">
      <v-row>
        <v-col v-if="isEditMode" cols="12">
          <div style="text-align: right;">
            <v-btn color="purple" type="submit" class="mr-2">Guardar</v-btn>
            <v-btn color="gray" @click="cancelEditMode">Cancelar</v-btn>
          </div>
        </v-col>
        <v-col cols="3">
          <v-text-field
            v-model="formData.weight"
            label="Peso (kg)"
            type="number"
            :rules="[numericRule]"
            required
            outlined
            dense
            hide-details="auto"
            :readonly="!isEditMode"
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field
            v-model="formData.height"
            label="Altura (cm)"
            type="number"
            :rules="[numericRule]"
            required
            outlined
            dense
            hide-details="auto"
            :readonly="!isEditMode"
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-select
            v-model="formData.eyesColor"
            :items="eyesColorOptions"
            label="Color de Ojos"
            required
            :menu-props="{ bottom: true }"
            outlined
            dense
            hide-details="auto"
            :readonly="!isEditMode"
          ></v-select>
        </v-col>
        <v-col cols="3">
          <v-select
            v-model="formData.skinColor"
            :items="skinColorOptions"
            label="Color de Piel"
            required
            outlined
            dense
            hide-details="auto"
            :readonly="!isEditMode"
          ></v-select>
        </v-col>
        <v-col cols="3">
          <v-text-field
            v-model="formData.waistMeasurement"
            label="Medida de Cintura"
            type="number"
            :rules="[numericRule]"
            outlined
            dense
            hide-details="auto"
            :readonly="!isEditMode"
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field
            v-model="formData.hipMeasurement"
            label="Medida de Cadera"
            :rules="[numericRule]"
            type="number"
            :readonly="!isEditMode"
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field
            v-model="formData.bustMeasurement"
            label="Medida de Busto"
            :rules="[numericRule]"
            type="number"
            outlined
            dense
            hide-details="auto"
            :readonly="!isEditMode"
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-select
            v-model="formData.hairColor"
            :items="hairColorOptions"
            label="Color de Pelo"
            required
            outlined
            dense
            hide-details="auto"
            :readonly="!isEditMode"
          ></v-select>
        </v-col>
        <v-col cols="12">
          <p class="text-h6">  Talles Vestimenta  <v-icon color="purple">mdi-hanger</v-icon></p>
        </v-col>
        <v-col cols="3">
          <v-text-field
            v-model="formData.pantSize"
            label="Pantalón"
            outlined
            dense
            hide-details="auto"
            :readonly="!isEditMode"
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field
            v-model="formData.tShirtSize"
            label="Remera"
            outlined
            dense
            hide-details="auto"
            :readonly="!isEditMode"
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field
            v-model="formData.jacketSize"
            label="Saco"
            outlined
            dense
            hide-details="auto"
            :readonly="!isEditMode"
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field
            v-model="formData.shoeSize"
            label="Calzado"
            outlined
            dense
            hide-details="auto"
            :readonly="!isEditMode"
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
            :readonly="!isEditMode"
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
            :readonly="!isEditMode"
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
            :readonly="!isEditMode"
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
            :readonly="!isEditMode"
          ></v-select>
        </v-col>
        <v-col v-if="formData.tattoos === 'Sí'" cols="3">
          <v-text-field
            v-model="formData.tattoosArea"
            label="Zona Tatuajes"
            :rules="maxLengthRule"
            outlined
            dense
            hide-details="auto"
            :readonly="!isEditMode"
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
            :readonly="!isEditMode"
          ></v-select>
        </v-col>
        <v-col v-if="formData.piercings === 'Sí'" cols="3">
          <v-text-field
            v-model="formData.piercingsArea"
            label="Zona Piercings"
            :rules="maxLengthRule"
            outlined
            dense
            hide-details="auto"
            :readonly="!isEditMode"
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="formData.extraInformation"
            label="Aclaraciones"
            :rules="maxLengthRule2"
            outlined
            dense
            hide-details="auto"
            :readonly="!isEditMode"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script>
import UserService from '../services/user.service';

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
      originalForm: null, // Para almacenar la copia de los datos originales
      eyesColorOptions: ['-----------','Verdes', 'Azules', 'Celestes', 'Negros', 'Marrones'],
      skinColorOptions: ['-----------', 'Blanca', 'Moreno', 'Negra', 'Amarilla', 'Albino'],
      yesNoOptions: ['-----------','Sí', 'No'],
      hairColorOptions: ['-----------', 'Morocho', 'Castaño', 'Rubio', 'Colorado', 'Teñido - color atípico'],
      handsOptions: ['-----------', 'Muy Malas', 'Malas', 'Regular', 'Buenas', 'Muy Buenas'],
      feetOptions: ['-----------', 'Muy Malos', 'Malos', 'Regular', 'Buenos', 'Muy Buenos'],
      teethOptions: ['-----------', 'Muy Malos', 'Malos', 'Regular', 'Buenos', 'Muy Buenos'],
      isEditMode: false,

      numericRule: {
        numeric: value => /^(0|[1-9][0-9]*)(\.[0-9]+)?$/.test(value) || 'Debe ser un número positivo.'
      },
      maxLengthRule: [
        value => !value || typeof value === 'string' && value.length <= 50 || 'Máximo 50 caracteres',
      ],
      maxLengthRule2: [
        value => !value || typeof value === 'string' && value.length <= 100 || 'Máximo 100 caracteres',
      ]
    };
  },
  methods: {
    activateEditMode() {
      this.originalForm = { ...this.formData }; // Crear una copia de los datos actuales
      this.isEditMode = true;
    },
    cancelEditMode() {
      this.formData = { ...this.originalForm }; // Restaurar los datos originales
      this.isEditMode = false;
    },
    async handleSubmit() {
      this.$refs.form.validate().then(result => {
      if (result.valid) {
        const payload = {
          weight: this.formData.weight || null,
          height: this.formData.height || null,
          eyes_color: this.formData.eyesColor || null,
          skin_color: this.formData.skinColor || null,
          waist_measurement: this.formData.waistMeasurement || null,
          hip_measurement: this.formData.hipMeasurement || null,
          bust_measurement: this.formData.bustMeasurement || null,
          hair_color: this.formData.hairColor || null,
          pant_size: this.formData.pantSize || null,
          tshirt_size: this.formData.tShirtSize || null,
          jacket_size: this.formData.jacketSize || null,
          shoes_size: this.formData.shoeSize || null,
          hands: this.formData.hands || null,
          feet: this.formData.feet || null,
          teeth: this.formData.teeth || null,
          braces: this.formData.braces === 'Sí' ? true : (this.formData.braces === 'No' ? false : null), // Convertir 'Sí' a true, 'No' a false, y mantener null si no está definido
          tattoos: this.formData.tattoos === 'Sí' ? true : (this.formData.tattoos === 'No' ? false : null),
          tattoosArea: this.formData.tattoosArea || null,
          piercings: this.formData.piercings === 'Sí' ? true : (this.formData.piercings === 'No' ? false : null), 
          piercingsArea: this.formData.piercingsArea || null,
          physical_characs_extra_info: this.formData.extraInformation || null
        };

        UserService.updateUserPhysicalCharacteristics(this.$store.state.auth.user.id, payload)
          .then(response => {
            console.log('Se actualizaron las características físicas:', response.data);
            this.$emit('update-physical-characteristics', payload);
          })
          .catch(error => {
            console.error('Error al actualizar las características físicas', error);
          });
      } else {
        console.log("FORM INVALIDO");
        console.log(result.errors);
      }
    }).catch(error => {
      console.error("Error al validar el formulario", error);
    });
    this.isEditMode = false;
    }
  },
  beforeMount() {
    this.formData = this.phCharacteristics;
  }
};

</script>