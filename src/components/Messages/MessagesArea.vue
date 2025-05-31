<template>
    <v-row justify="center" >
        <v-col cols="12" md="8">
            <!-- Encabezado expandible -->
           <div class="section-header" @click="isMessagesExpanded = !isMessagesExpanded">
            <v-icon class="mr-2" color="cyan-darken-2">
              {{ isMessagesExpanded ? 'mdi-chevron-down' : 'mdi-chevron-right' }}
            </v-icon>
            
            <!-- Título con indicador de no leídos -->
            <h2 class="section-title" :class="{ 'has-unread': hasUnreadMessages }" 
            :style="{ fontSize: titleSize }">
              Mensajes
              <!-- Punto rojo (opcional) -->
              <span v-if="hasUnreadMessages" class="unread-dot"></span>
            </h2>
            
            <v-chip class="ml-2" color="primary" small>
              {{ messages.length }}
            </v-chip>
          </div>

            <!-- Contenido expandible -->
            <v-expand-transition>
            <v-card v-show="isMessagesExpanded" class="mt-4 messages-card" flat>
                <!-- Lista de mensajes -->
                <v-list class="message-list">
                <template v-for="(message, index) in messages" :key="message.id">
                    <v-list-item
                    :class="{
                        'message-item': true,
                        'message-unread': !message.read,
                        'message-sent': message.sentByMe
                    }"
                    @click="toggleMessageExpand(message)"
                    >
                    <template #prepend>
                        <v-avatar size="40" class="mr-3">
                        <v-img :src="message.sentByMe ? currentUserProfilePicture : message.senderProfilePicture" />
                        </v-avatar>
                    </template>

                    <v-list-item-title class="d-flex justify-space-between">
                        <span class="message-sender">
                        {{ message.sentByMe ? 'Yo' : message.senderFullName }}
                        </span>
                        <span class="message-date">
                        {{ formatMessageDate(message.date) }}
                        </span>
                    </v-list-item-title>

                    <v-list-item-subtitle class="message-subject">
                        {{ message.subject }}
                    </v-list-item-subtitle>

                    <v-expand-transition>
                        <div v-show="message.expanded" class="message-container">
                        <div class="message-content" v-html="message.content"></div>
                        
                        <!-- Adjuntos -->
                        <div v-if="message.attachments.length > 0" class="mt-3">
                            <DownloadFileChip v-for="attachment in message.attachments" :key="attachment.id"
                            :chipText="attachment.name" 
                            :addExtension="false"
                            chipImageFileName="clip.png"
                            chipColor="purple" :fileUrl="attachment.url"  :isClosable="false"
                            />   
                            
                        </div>
                        </div>
                    </v-expand-transition>
                    </v-list-item>

                    <v-divider v-if="index < messages.length - 1"></v-divider>
                </template>
                </v-list>
                <hr style="margin: 1rem auto 0; color: purple; width: 90%; 
                border: none; border-top: 1px solid purple ;" />
                <MessageForm
                :isSending="isSending"
                @send-message="sendMessage"
                >
                </MessageForm>             
            </v-card>
            </v-expand-transition>
        </v-col>
    </v-row>
</template>
  
<script>
import DownloadFileChip from '../DownloadFileChip.vue';
import MessageForm from './MessageForm.vue';

    export default {
        props: {
          messages: {
              type: Array,
              required: true
          },
          currentUserProfilePicture : {
            type: String,
            default: ''
          },
          isSending: {
            type: Boolean,
            default: false
          },
          titleSize: {
            type: String,
            default: '1.5rem'
          }
        },
        components: {
            DownloadFileChip,
            MessageForm
        },

        data() {
            return {
                isMessagesExpanded: false,
                newMessage: {
                    content: '',
                    attachments: []
                },
            }

        },
        emits: ['send-message', 'mark-as-read'],
        computed: {
          hasUnreadMessages() {
            return this.messages.some(message => !message.read && !message.sentByMe);
          }
        },
        methods: {
            formatMessageDate(dateString) {
                const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
                return new Date(dateString).toLocaleDateString('es-ES', options);
            },
            toggleMessageExpand(message) {
                if (!message.sentByMe && !message.read) {
                    this.markAsRead(message.id);
                }
                message.expanded = !message.expanded;
            },
            async markAsRead(messageId) {
              this.$emit('mark-as-read', messageId);
            },
            async sendMessage(message) {
                this.$emit('send-message', message);
            },
        }

    }
  
  </script>

<style>
.messages-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.message-list {
  max-height: 500px;
  overflow-y: auto;
}

.message-item {
  cursor: pointer;
  transition: background-color 0.2s ease;
  padding: 12px 16px;
}

.message-item:hover {
  background-color: #f5f5f5;
}

/* Estilo para mensajes no leídos */
.message-unread {
  border-left: 4px solid #ff5252 !important;  /* Borde rojo */
  background-color: rgba(255, 82, 82, 0.05);  /* Fondo sutil opcional */
  position: relative;  /* Para el pseudo-elemento (opcional) */
}

.message-unread::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 2px;
  background-color: #ff5252;
}

.message-sent {
  background-color: #e8f5e9;
}

.message-sender {
  font-weight: 500;
}

.message-date {
  color: #757575;
  font-size: 0.8rem;
}

.message-subject {
  font-weight: 500;
  color: #424242;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.message-container {
  padding: 8px 0;
}

.message-content {
  white-space: pre-wrap;
  color: #616161;
}

.new-ody-form {
  border-top: 1px solid #e0e0e0;
  background-color: #fafafa;
}

.attachments-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 8px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.section-header {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 12px 0;
  transition: all 0.3s ease;
}

.section-header:hover {
  background-color: rgba(25, 118, 210, 0.04);
}

.section-title {
  font-weight: 500;
  color: #424242;
  margin: 0;
}

.v-avatar {
 margin-top: 8px;
 margin-bottom: 8px;
}


/* Punto rojo indicador de mensajes no leidos */
.unread-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  background-color: #ff5252;
  border-radius: 50%;
  margin-left: 8px;
  vertical-align: middle;
}

/*Subrayado animado indicador de mensajes no leidos*/
.section-title.has-unread::after {
  content: "";
  display: block;
  width: 100%;
  height: 2px;
  background-color: #ff5252;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { opacity: 0.5; }
  50% { opacity: 1; }
  100% { opacity: 0.5; }
}
</style>