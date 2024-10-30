<template>
    <div class="text-field">
      <div class="title">{{ fieldTitle }}</div>
      <div class="input-container">
        <v-text-field
          type="date"
          class="input"
          disabled
          append-inner-icon="mdi-calendar"
        />
      </div>
    </div>
  </template>
  
  <script>
    export default {
      props: {
        value: String,
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
    .text-field {
      margin-bottom: 16px; 
    }
  
    .title {
      font-size: 20px; 
      font-weight: bold;
      margin-bottom: 8px; 
    }
  
    .input {
      border-top: 2px dotted lightgray; 
      color: inherit; 
      max-width: 200px;
    }
  </style>
  