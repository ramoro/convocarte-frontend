<template>
    <v-chip :color="chipColor" class="ma-2" :closable="isClosable" @click:close="deleteFile"
    :disabled="isDisabled">
        <img 
            :src="require('@/assets/' + chipImageFileName)"
            alt="Download Icon" 
            class="button-image mr-2"
            height="20"
        />
        <a @click.stop.prevent="downloadFile" href="#">{{ chipText }}</a>
    </v-chip>
</template>
  
  <script>
  import axios from 'axios';

  export default {
    name: "DownloadFileChip",
    props: {
        chipText: {
            type: String,
            required: true
        },
        chipImageFileName: {
            type: String,
            required: true
        },
        fileUrl: {
            type: String,
            required: true
        },
        chipColor: {
            type: String,
            default: 'grey'
        },
        isClosable: {
            type: Boolean,
            default: true
        },
        isDisabled: {
            type: Boolean,
            default: false
        },
        userNameToFileName: {
            type: String,
            default: null
        },
        addExtension: {
            type: Boolean,
            default: true
        }
    },
    emits: ['delete-file'],
    methods: {
        getImagePath(path) {
            try {
                return require(`${path}`);
            } catch (e) {
                console.error(`No se puede cargar la imagen desde la ruta: ${path}`, e);
                return ''; 
            }
        },
        async downloadFile() {
            try {
                const link = document.createElement('a');
                //Si corre local puedo descargarlo con axios y elegir el nombre con el que descargo el pdf
                //Si no es local, debo descargarlo seteando en href el link porque sino google drive tira error de CORS
                if (process.env.VUE_APP_BACKEND_API_URL.includes("localhost")) {
                    const response = await axios({
                        url: this.fileUrl,// URL del archivo en mi backend
                        method: 'GET',
                        responseType: 'blob'
                    });
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    link.href = url;
                } else {
                    link.href = this.fileUrl// URL del archivo para descargarlo (deberia venir con el URL de descarga ya)
                }
                const extension = this.fileUrl.split('.').at(-1)
                var fileName = this.chipText;
                if (this.userNameToFileName) {
                    fileName += '-' + this.userNameToFileName.replace(/\s+/g, '')
                }
                if (this.addExtension && extension) {
                    fileName += '.' + extension
                }

                link.setAttribute('download', fileName);
                document.body.appendChild(link);
                link.click(); // Simula el clic para descargar el archivo
                document.body.removeChild(link); // Elimina el enlace después de hacer clic
                
            } catch (error) {
                console.error("Error al descargar el archivo:", error);
            }
        },

        deleteFile() {
            this.$emit('delete-file');
        }
    }
  };
</script>
