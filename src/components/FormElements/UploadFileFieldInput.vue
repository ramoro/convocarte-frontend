<template>
    <div class="file-upload">
      <div class="title">{{ fieldTitle }}</div>
      <div class="input-container">
        <v-btn
          class="upload-button text-grey"
          color="grey"
          disabled
          flat
          variant="flat"
          @click="$emit('click')"
        >
          <v-icon left>mdi-upload</v-icon>
          {{placeholder}}
        </v-btn>
      </div>
    </div>
  </template>
  
  <script>
    export default {
      props: {
        placeholder: {
          type: String,
          default: '', 
        },
        fieldTitle: {
          type: String,
          default: '',
        },
      },
    }
  </script>
  
  <style scoped>
    .file-upload {
      margin-bottom: 16px; 
    }
  
    .title {
      font-size: 20px; 
      font-weight: bold;
      margin-bottom: 8px;
    }
  
    .input-container {
      display: flex;
      align-items: center;
    }
  
    .upload-button {
      width: auto; 
      background-color: white !important; 
      border: 1px solid lightgray;
    }
  
    .upload-button:hover {
      background-color: #f5f5f5;
    }
  </style>
  