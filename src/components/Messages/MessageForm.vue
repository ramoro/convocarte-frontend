<template>       
    <div>
        <v-form ref="form" @submit.prevent="sendMessage" lazy-validation class="pa-4">
            <v-textarea
                v-model="newMessage.content"
                label="Mensaje"
                required
                outlined
                rows="6"
                :rules="[value => !!value || 'El mensaje debe tener un contenido.']"
            ></v-textarea>
            <v-row class="mt-2">
                <UploadFileButton button-text="Adjuntar Archivo" button-size="small"
                class="ml-2 mt-2"
                attachment-icon="mdi-paperclip"
                :maxSize="10" 
                @add-uploaded-file="handleUploadedFile" />
                <v-btn 
                    size="small"
                    outlined
                    color="purple-lighten-2"
                    class="mt-2 ml-2"
                    @click="addRejectionTemplate" 
                >
                    Usar Plantilla de Rechazo
                </v-btn>

            </v-row>
            
            <!-- Lista de archivos adjuntos (chips) -->
            <div v-if="filesToUpload.length > 0" class="mb-2 mt-5">
                <v-chip
                v-for="(file, index) in filesToUpload"
                :key="index"
                class="mr-2 mt-2"
                :closable="true"
                @click:close="removeAttachment(index)"
                >
                {{ file.name }}
                </v-chip>
            </div>

            <div class="d-flex justify-end mt-4">
                <v-btn
                type="submit"
                color="purple"
                :loading="isSending"
                >
                Enviar
                </v-btn>
            </div>
        </v-form>
    </div>  
</template>
  
<script>
import UploadFileButton from '../UploadFileButton.vue';

    export default {
        props: {
          isSending: {
            type: Boolean,
            default: false
          },
          rejectionTemplate: {
            type: String,
            default: ''
          }
        },
        components: {
            UploadFileButton
        },

        data() {
            return {
                newMessage: {
                    content: '',
                },
                filesToUpload: [],
            }

        },
        emits: ['send-message'],
        methods: {
            async sendMessage() {
                const { valid } = await this.$refs.form.validate();
                if (!valid) return;
                
                // Convertir Proxy a array normal
                const filesArray = [...this.filesToUpload];
                
                this.$emit('send-message', {
                    content: this.newMessage.content,
                    filesToUpload: filesArray 
                });
                
                // Limpiar después de enviar
                this.$refs.form.reset();
                this.filesToUpload = [];
                this.newMessage.content = '';
            },
            handleUploadedFile(file, fileName) {
                console.log(fileName);
                this.filesToUpload.push(file);
            },
            removeAttachment(index) {
                this.filesToUpload.splice(index, 1);
            },
            addRejectionTemplate() {
                this.newMessage.content = this.rejectionTemplate;
            }
        }

    }
  
  </script>

<style>

</style>