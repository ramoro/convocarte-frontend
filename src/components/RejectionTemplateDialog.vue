<template>
    <v-dialog max-width="800px">
        <v-card>
            <v-card-title class="d-flex justify-space-between align-center">
                <span class="text-h6">Plantilla de Rechazo</span>
                <v-icon 
                @click="$emit('close-dialog')"
                class="ml-auto"
                depressed
                text>mdi-close</v-icon>
            </v-card-title>
            <v-card-text>
            <slot name="dialog-text">Esta plantilla no solo se puede usar en cualquier mensaje sino que es <b>la que 
                se enviará automáticamente a las postulaciones que sean eliminadas (rechazadas).</b><br>
                El texto <code>/NombreUsuario/</code> será reemplazado por el nombre del usuario postulado 
                correspondiente.<br>
            </slot>
            <v-form ref="form" @submit.prevent="updateRejectionTemplate" lazy-validation class="pa-4">
                <v-textarea
                    v-model="templateText"
                    label="Texto de la Plantilla"
                    required
                    outlined
                    rows="7"
                    :rules="[value => !!value || 'El mensaje debe tener un contenido.']"
                ></v-textarea>

                <div class="d-flex justify-end mt-4">
                    <v-btn
                    type="submit"
                    color="purple"
                    >
                    Guardar
                    </v-btn>
                </div>
            </v-form>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>
  
<script>
  import CastingCallService from '@/services/casting-call.service';
  export default {
    name: "RejectionTemplateDialog",
    props: {
      currentText: {
        type: String
      },
      castingCallId: {
        type: Number
      }
    },
    data() {
      return {
        templateText: this.currentText || ''
      };
    },
    watch: {
        currentText(newVal) {
            // Actualiza templateText cuando cambia currentText
            this.templateText = newVal || '';
        }
    },
    emits: ['close-dialog', 'update-rejection-template'],
    methods: {
        async updateRejectionTemplate() {
            var success = false;
            try {
                await CastingCallService.updateCastingCallRejectionTemplate(
                    this.castingCallId,
                    this.templateText, 
                );
                success = true;
            } catch (error) {
                console.error('Error al enviar mensaje:', error);
                success = false;
            } finally {
                this.$emit('update-rejection-template', success, this.templateText);
            }
        }
    }
  };
</script>
