<template>
    <div class="text-field">
      <div class="title">{{ fieldTitle }}</div>
      <div class="input-container">
        <input
          type="text"
          :placeholder="placeholder"
          class="input"
          disabled
        />
      </div>
      <div class="mt-3">
        <span class="additional-text">{{additionalText}}</span>
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
      additionalText: {
        type: String,
        default: ''
      }
    },
  };
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
    border-bottom: 2px dotted lightgray; 
    padding: 4px 0; 
  }
  
  .input {
    border: none;
    outline: none; 
    width: 100%;
    background: transparent; 
    color: inherit; 
  }
  
  /* Hacer el texto del placeholder visible */
  .input::placeholder {
    color: lightgray; 
    opacity: 1; 
  }

  .additional-text {
    color: gray; 
    font-size: 14px; 
  }
  </style>