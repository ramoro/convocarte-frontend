import { createStore } from 'vuex'
import { auth } from './auth.module'
import { VuexPersistence } from 'vuex-persist'

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
});

export default createStore({
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    auth
  },
  plugins: [vuexLocal.plugin],
})
