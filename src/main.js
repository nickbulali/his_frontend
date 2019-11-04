import Vue from 'vue'
import './plugins/vuetify'
import App from './app.vue'
import router from './router'
import store from './store/index'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUserSecret } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import VueBreadcrumbs from 'vue-breadcrumbs'
import dotenv from 'dotenv'
 
Vue.use(VueBreadcrumbs)
library.add(faUserSecret)
Vue.component('font-awesome-icon', FontAwesomeIcon)
dotenv.config()
console.log(process.env)

Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
