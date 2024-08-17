<template>
    <div class="text-center ma-2">
        <v-snackbar v-model="showSnackbar" :timeout="timer" :color="color">
            <v-icon class="mr-1" v-if="color === 'green'">mdi-check-circle</v-icon>
            <span v-html="message"></span>
        
            <template v-slot:actions>
                <v-btn
                :color="buttonColor"
                variant="text"
                @click="showSnackbar = false"
                >
                Cerrar
                </v-btn>
            </template>
        </v-snackbar>
    </div>
</template>
  
<script>
    export default {
        name: "InformationSnackbar",
        data() {
            return {
            showSnackbar: false,
            message: '',
            color: 'success',
            buttonColor: 'white',
            timer: 5000
            }
        },
        methods:{
            show(data) {
                this.message = data.message || 'missing "message".'
                this.color = data.color || 'success'
                this.timer = data.timer || 5000
                this.buttonColor = data.buttonColor || 'white'
                this.showSnackbar = true
            }
        }
    }
</script>
  