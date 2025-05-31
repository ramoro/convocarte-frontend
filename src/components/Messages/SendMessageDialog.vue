<template>
    <v-dialog max-width="800px">
        <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
            <span class="text-h6">Envío de Mensaje</span>
            <v-icon 
            @click="$emit('close-dialog')"
            class="ml-auto"
            depressed
            text>mdi-close</v-icon>
        </v-card-title>
        <v-card-text>
            <p v-if="postulations.length > 1" class="text-body-1">
              El mensaje se enviará a todos los usuarios seleccionados.<br><br>
              En caso de querer enviar un mensaje personalizado, escribir <code>/NombreUsuario/</code>.<br>
              Este texto será reemplazado por el nombre del usuario correspondiente.<br><br>
              <i>Ejemplo: "Hola /NombreUsuario/, espero te encuentres bien."</i>
            </p>
            <p v-else class="text-body-1">
              Estás a punto de enviarle un mensaje a {{ postulations[0]?.postulatedUserName }}.
            </p>
            <MessageForm
                :isSending="isSending"
                @send-message="sendMessage"
            />
        </v-card-text>
        </v-card>
    </v-dialog>
</template>
  
<script>
  import MessageForm from './MessageForm.vue';
  import MessageService from '@/services/message.service';  

  export default {
    name: "DeleteConfirmationDialog",
    props: {
      itemName: {
        type: String,
        required: true
      },
      extraInfo: {
        type: String,
        default: ""
      },
      manyItems: {
        type: Boolean,
        default: false
      },
      postulations: {
        type: Array,
        default () {
          return [];
        }
      }
    },
    components: {
        MessageForm
    },
    emits: ['close-dialog', 'show-message-sent-result'],
    data ()  {
        return {
            isSending: false,
        }

    },
    methods: {
    async sendMessage(message) {
      this.isSending = true;
      let success = true;
      try {

        await MessageService.createMessageForManyUsers(
          message.content,
          message.filesToUpload, 
          this.postulations,
          "/NombreUsuario/" 
        );
        success = true;
        this.$root.InformationSnackbar.show({
          message: 'Mensaje enviado correctamente',
          color: 'success'
        });

      } catch (error) {
        console.error('Error al enviar mensaje:', error);
        success = false;
        this.$root.InformationSnackbar.show({
          message: 'Error al enviar el mensaje',
          color: 'error'
        });
      } finally {
        this.isSending = false;
        this.$emit('show-message-sent-result', success);
      }
    },
    }
  };
</script>
