import Vue from 'vue'
import './plugins/vuetify'
import App from './app.vue'
import router from './router'
import store from './store/index'

import dotenv from 'dotenv'
dotenv.config()
console.log(process.env)

Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
