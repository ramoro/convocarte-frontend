<template>
    <div>
        <!-- 1. Create the button that will be clicked to select a file -->
        <v-btn 
            color="cyan"
            class="text-white"
            :size="buttonSize"
            rounded
            :loading="isSelecting" 
            @click="handleFileImport"
            :prepend-icon="attachmentIcon ? attachmentIcon : ''"
        >
            <img 
                v-if="!attachmentIcon"
                :src="require('@/assets/logo-pdf-2.png')"
                alt="Upload Icon" 
                class="button-image mr-2"
                height="25"
            />
            {{ buttonText }}
        </v-btn>

        <!-- Create a File Input that will be hidden but triggered with JavaScript -->
        <input 
            ref="uploader" 
            class="d-none" 
            type="file"
            :accept=fileExtensions
            @change="onFileChanged"
        >
        <div v-if="fileError" class="text-error mt-1 text-center" style="font-size:14px;">
            <p>Máximo {{ maxSize }}MB</p>
        </div>  
    </div>
</template>

<script>
    export default {
        name: 'UploadFileButton',
        props: {
            buttonText: {
                type: String,
                default: 'Subir Archivo'
            },
            maxSize: {
                type: Number,
                default: 1
            },
            attachmentIcon: {
                type: String,
                default: 'mdi-paperclip'
            },
            buttonSize: {
                type: String,
                default: 'default'
            },
            fileExtensions: {
                type: String,
                default: '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.rtf,.odt,.ods,.odp,.jpg,.jpeg,.png,.gif,.bmp,.svg,.zip,.rar,.7z,.tar,.gz'
            }
        },
        emits: ['add-uploaded-file'],
        data(){
            return {
                isSelecting: false,
                selectedFile: null,
                fileError: false
            }
        },
        methods: {
            handleFileImport() {
                this.isSelecting = true;
                this.fileError = false;

                // After obtaining the focus when closing the FilePicker, return the button state to normal
                window.addEventListener('focus', () => {
                    this.isSelecting = false
                }, { once: true });
                
                // Trigger click on the FileInput
                this.$refs.uploader.click();
            },
            onFileChanged(e) {
                const files = e.target.files || e.dataTransfer.files;
                if (files.length) {
                    const file = files[0];
                    const maxSizeBytes = this.maxSize * 1024 * 1024;  // Convertir MB a bytes
                    if (file.size > maxSizeBytes) {
                        this.fileError = true;
                    } else {
                        this.fileError = false;
                        this.selectedFile = file;
                        this.$emit('add-uploaded-file', file, file.name);
                    }
                }
            }
        }
    }
</script>