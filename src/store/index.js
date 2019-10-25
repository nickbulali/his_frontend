import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import auth from './modules/auth'
import patients from './modules/patients'
import allergies from './modules/allergies'
import conditiontypes from './modules/conditiontypes'
import familyrelations from './modules/familyrelations'
import familyhistories from './modules/familyhistories'
import maritalstatuses from './modules/maritalstatuses'
import VuexPersist from 'vuex-persist'

Vue.use(Vuex)
const vuexLocalStorage = new VuexPersist({
  key: 'his_frontend', // The key to store the state on in the storage provider.
  storage: window.localStorage, // or window.sessionStorage or localForage
  // Function that passes the state and returns the state with only the objects you want to store.
  // reducer: state => state,
  // Function that passes a mutation and lets you decide if it should update the state in localStorage.
  filter: mutation => (true)
})

export default new Vuex.Store({
    plugins: [
    	vuexLocalStorage.plugin
  	],

  modules: {
    user,
    auth,
    patients,
    allergies,
    conditiontypes,
    familyrelations,
    familyhistories,
    maritalstatuses
  },
  strict: false,
})


