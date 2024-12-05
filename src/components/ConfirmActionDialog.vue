<template>
    <v-dialog v-model="dialogOpened" max-width="400px">
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
      isOpen: {
        type: Boolean,
        default: false
      },
      dialogTitle: {
        type: String,
        required: true
      },
      action: {
        type: String,
        required: true
      }
    },
    data () {
      return {
          dialogOpened: this.isOpen,
      }
    },
    watch: {
      isOpen(newValue) {
          this.dialogOpened = newValue;
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
