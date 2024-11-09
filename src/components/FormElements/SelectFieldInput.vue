<template>
    <div class="text-field">
      <div class="title">{{ fieldTitle }}</div>
      <div class="input-container">
        <v-select
          :placeholder="placeholder"
          class="input"
          style="margin-bottom:-20px"
          disabled
        />
      </div>
      <span class="options-text">{{additionalText}}</span>
    </div>
  </template>
  
  <script> 
  export default {
    props: {
      value: String,
      placeholder: {
        type: String,
        default: 'Selecciona una opción',
      },
      fieldTitle: {
        type: String,
        default: 'Título del campo',
      },
      additionalText: {
        type: String,
        default: ''
      }
    },
  }
  </script>
  
  <style scoped>
  .text-field {
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
    padding: 4px 0; 
  }
  
  .input {
    border-top: 2px dotted lightgray; 
    outline: none; 
    background: transparent; 
    color: inherit; 
    margin-right: 10px; 
    flex: 1; 
    max-width:300px; 

  }
  
  .options-text {
    color: gray; 
    font-size: 14px; 
    margin-top: 2px;
  }
  </style>