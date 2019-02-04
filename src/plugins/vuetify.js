import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import 'vuetify/src/stylus/app.styl'
import '@fortawesome/fontawesome-free/css/all.css'

Vue.use(Vuetify, {
  customProperties: true,
  iconfont: 'fa',
  theme: {
    primary: '#6200ee',
    secondary: '#3700b3',
    accent: '#03dac6',
    error: '#b00020',
    warning: '#ffc107',
    info: '#2196f3',
    success: '#4caf50'
  }
})
