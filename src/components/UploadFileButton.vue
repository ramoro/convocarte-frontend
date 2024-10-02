<template>
    <div>
        <!-- 1. Create the button that will be clicked to select a file -->
        <v-btn 
            color="cyan"
            class="text-white"
            rounded
            :loading="isSelecting" 
            @click="handleFileImport"
        >
            <img 
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
            accept=".pdf"
            @change="onFileChanged"
        >
        <div v-if="fileError" class="text-error mt-1 text-center" style="font-size:14px;">
            <div>Máximo {{maxSize / 1024}}MB</div>
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
                default: 1024
            }
        },
        emits: ['add-uploaded-cv'],
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
                let file = files[0];
                if (files.length) {
                    let size = file.size / this.maxSize / this.maxSize
                    if (size > 1) {
                        this.fileError = true;
                    } else {
                        this.fileError = false;
                        this.selectedFile = files[0];
                        //let fileName = files[0].name;
                        this.$emit('add-uploaded-cv', file, files[0].name);

                    }
                }
            },
        }
    }
</script>