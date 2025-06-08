<template>
  <v-app>
    <MainNavbar v-if="!$route.meta.hideNavbar"/>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import MainNavbar from '@/components/MainNavbar'
import axios from 'axios';
import store from './store';
import router from './router';

//Para desloguear al usuario si se le vencio el token
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      store.dispatch('auth/logout');
      router.push('/'); 
    }
    return Promise.reject(error);
  }
);

export default {
  name: 'App',
  components: {MainNavbar},
  data: () => ({
    //
  }),
};
</script>

<style>
.v-application--wrap {
  background-color: inherit; /* Asegura que el fondo se aplique correctamente */
}
.v-chip.Borrador{
  background-color: rgb(116, 104, 104);
}
p.Borrador{
  color:rgb(116, 104, 104);
}

.v-chip.Publicado{
  background-color: rgb(45, 185, 27);
}

p.Publicado {
  color: rgb(45, 185, 27);
}

.v-chip.Pausado {
  background-color: rgb(81, 159, 211); 
}

p.Pausado {
  color: rgb(81, 159, 211);  
}

.v-chip.Finalizado{
  background-color: rgb(218, 154, 59); 
}

p.Finalizado {
  color: rgb(218, 154, 59); 
}

.v-chip.Vencido {
  background-color: rgb(147, 22, 8); 
}

p.Vencido {
  color: rgb(147, 22, 8); 
}

.v-chip.Eliminado {
  background-color: rgb(244, 35, 3); 
}

p.Eliminado {
  color: rgb(244, 35, 3);
}
</style>
