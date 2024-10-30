<template>
  <div v-show="imageSrc" class="my-2 w-48 h-48 object-cover mx-auto">
    <img class="block max-w-full max-h-full" ref="img" :src="imageSrc" />
  </div>
  <div class="flex text-center content-end mt-2">
    <div v-if="imageError" class="text-error" style="font-size:14px;">
      <div>El archivo es muy grande.</div>
      <div>Por favor elegí otro con un tamaño menor a 1MB.</div>
    </div>    
    <v-btn
      v-if="!imageSrc"
      color="purple"
      class="mt-5"
      @click="imageInput.click()"
    >
      Buscar Imagen
    </v-btn>
    <v-btn v-else size="small" color="purple" class="w-32 mx-2" @click="handleImageCropped">
      Actualizar
    </v-btn>
    <v-btn
      v-if="imageSrc"
      color="purple"
      size="small"
      class="w-32 mx-2"
      @click="fileCleared"
    >
      Cancelar
    </v-btn>
    <input
      type="file"
      ref="imageInput"
      accept=".jpg,.jpeg,.png"
      @change="fileChanged"
      :style="{ display: 'none' }"
    />
  </div>
  <div v-if="selectedFile" class="my-2 align-baseline text-center">
    <p class="mt-4 text-caption text-center text-grey">
    Archivo elegido: {{ selectedFile.name }}
  </p>
  </div>
</template>

<script>
import {
  defineComponent,
  ref,
  watchEffect,
  onMounted,
  onUnmounted,
  watch,
} from 'vue';
import Cropper from 'cropperjs';

export default defineComponent({
  name: 'ImageCropper',
  emits: ['imageCropped'],
  setup(_props, { emit }) {
    const imageInput = ref(null);
    const selectedFile = ref(null);
    const imageSrc = ref(null);
    const img = ref(null);
    let imgName = '';
    const fileReader = new FileReader();
    const imageError = ref(null);
    let cropper = null;
    const maxSize = 1024; //1MB maximo

    fileReader.onload = (event) => {
      imageSrc.value = event.target.result;
    };

    const handleImageCropped = () => {
      cropper
        .getCroppedCanvas({
          width: 256,
          height: 256,
        })
        .toBlob((blob) => {
          emit('imageCropped', blob, imgName);
        }, 'image/jpeg');
      
      selectedFile.value = null;
    };

    const fileChanged = (e) => {
      const files = e.target.files || e.dataTransfer.files;
      let imageFile = files[0];
      if (files.length) {
          let size = imageFile.size / maxSize / maxSize
          if (size > 1) {
            imageError.value = true;
          } else {
            imageError.value = false;
            selectedFile.value = files[0];
            imgName = files[0].name;
          }
      }
    };

    const fileCleared = () => {
      selectedFile.value = null;
    };

    onMounted(() => {
      cropper = new Cropper(img.value, {
        aspectRatio: 1,
        minCropBoxWidth: 128,
        minCropBoxHeight: 128,
        viewMode: 1, // Cambia la vista para ajustar la imagen al contenedor
        dragMode: 'move',
        background: false,
        autoCropArea: 0.65, // Ajusta el área de recorte automática
        cropBoxMovable: true,
        cropBoxResizable: true,
      });
    });

    onUnmounted(() => {
      cropper.destroy();
    });

    watchEffect(() => {
      if (selectedFile.value) {
        fileReader.readAsDataURL(selectedFile.value);
      } else {
        imageSrc.value = null;
      }
    });

    watch(
      imageSrc,
      () => {
        if (imageSrc.value) {
          cropper.replace(imageSrc.value);
        }
      },
      {
        flush: 'post',
      }
    );

    return {
      imageInput,
      selectedFile,
      fileChanged,
      fileCleared,
      imageSrc,
      img,
      handleImageCropped,
      imageError,
      imgName
    };
  },
});
</script>

<style>
@import 'cropperjs/dist/cropper.css';

.cropper-view-box,
.cropper-face {
  border-radius: 50%;
}

.avatar-img {
  border-radius: 50%;
  margin-bottom: 15px;
}

.w-48 {
  width: 12rem;
  height: 12rem;
}
</style>