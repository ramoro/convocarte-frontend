<template>
    <v-dialog v-model="dialogOpened" max-width="70%">
        <v-card class="rounded-lg">
            <v-card-title>
                <span class="text-h5">Filtros para la búsqueda</span>
            </v-card-title>
            <v-form ref="form" @submit.prevent="handleSubmit">
            <v-card-text>
                <v-row>
                    <v-col cols="4">
                        <v-select
                            v-model="currentFilters.remuneration_types"
                            :items="castingRemunerationTypesOptions"
                            label="Tipo de Remuneración"
                            multiple
                            chips
                            deletable-chips
                            hide-details="auto"
                        >
                            Tipo de Remuneración
                        </v-select>
                    </v-col>
                    <v-col cols="4">
                        <v-select
                            v-model="currentFilters.categories"
                            :items="projectCategoriesOptions"
                            label="Categoría"
                            multiple
                            chips
                            deletable-chips
                            hide-details="auto"
                        >
                            Categoría
                        </v-select>
                    </v-col>
                    <v-col cols="4">
                        <v-select
                            v-model="currentFilters.date_order"
                            :items="dateOrderOptions"
                            label="Orden de Publicación"
                            outlined
                            dense
                            hide-details="auto"
                        ></v-select>
                    </v-col>
                    <v-col cols="2">
                        <v-text-field
                            v-model="currentFilters.age"
                            label="Edad"
                            type="number"
                            required
                            hide-details="auto"
                        >
                        </v-text-field>
                    </v-col>
                    <v-col cols="2">
                        <v-text-field
                            v-model="currentFilters.height"
                            label="Altura"
                            type="number"
                            required
                            hide-details="auto"
                        >
                        </v-text-field>
                    </v-col>
                    <v-col cols="4">
                        <v-select
                            v-model="currentFilters.hair_colors"
                            :items="hairColorsOptions"
                            label="Color de Pelo"
                            multiple
                            chips
                            deletable-chips
                            hide-details="auto"
                        />
                    </v-col>
                </v-row>            
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="purple" type="submit">Guardar</v-btn>
                <v-btn color="grey" @click="cancelAction">Cancelar</v-btn>
            </v-card-actions>
        </v-form>
        </v-card>
    </v-dialog>
</template>

<script>
  import { remunerationTypes } from '@/config/remuneration-types';
  import { projectCategories } from '@/config/project-categories';
  import { hairColors } from '@/config/hair-colors';

  export default {
    name: "FiltersDialog",
    props: {
      isOpen: {
        type: Boolean,
        default: false
      },
      initialFilters: {
        type: Object,
        default: () => ({
            remuneration_types: null,
            categories: null,
            age: null,
            height: null,
            hair_colors: null,
            date_order: 'Descendente'
        })
      }
    },
    data () {
      return {
        dialogOpened: this.isOpen,
        currentFilters: JSON.parse(JSON.stringify(this.initialFilters)), //Copia profunda de initialFilters
        castingRemunerationTypesOptions: remunerationTypes.filter(type => type !== 'Otro'),
        projectCategoriesOptions: projectCategories.filter(category => category !== 'Otro'),
        dateOrderOptions: ['Ascendente', 'Descendente'],
        hairColorsOptions: hairColors
      }
    },
    watch: {
      isOpen(newValue) {
        this.dialogOpened = newValue;
        if (newValue) {
          //Restauro filtros del componente con los datos de filtro que tiene la view
          this.currentFilters = JSON.parse(JSON.stringify(this.initialFilters));
        }
      }
    },
    emits: ['save-filters', 'cancel-action'],
    methods: {
      cancelAction() {
        this.$emit('cancel-action');
      },
      handleSubmit() {
        // Convertir cadenas vacías a null
        Object.keys(this.currentFilters).forEach(key => {
          if (this.currentFilters[key] === '') {
            this.currentFilters[key] = null;
          }
        });
        this.$emit('save-filters', this.currentFilters);
      }
    }
  };
</script>
