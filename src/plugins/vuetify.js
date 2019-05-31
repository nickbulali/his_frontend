import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import 'vuetify/src/stylus/app.styl'

Vue.use(Vuetify, {
  iconfont: 'md',
  theme: {
  	primary: '#F16136',
  	darkened: '#932D0E',
  	success: '#3cd1c2',
  	info: '#ffaa2c',
  	error: '#8D0000'
  }
})
