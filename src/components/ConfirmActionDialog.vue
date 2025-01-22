<template>
    <v-dialog max-width="400px">
        <v-card>
        <v-card-title class="text-h6">{{dialogTitle}}</v-card-title>
        <v-card-text>
          <slot name="dialog-text"></slot>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="purple" @click="confirmAction">{{action}}</v-btn>
            <v-btn color="grey" @click="cancelAction">Cancelar</v-btn>
        </v-card-actions>
        </v-card>
    </v-dialog>
</template>
  
  <script>
  export default {
    name: "ConfirmActionDialog",
    props: {
      dialogTitle: {
        type: String,
        required: true
      },
      action: {
        type: String,
        required: true
      }
    },
    emits: ['confirm-action', 'cancel-action'],
    methods: {
      confirmAction() {
        this.$emit('confirm-action');
      },
      cancelAction() {
        this.$emit('cancel-action');
      }
    }
  };
</script>
