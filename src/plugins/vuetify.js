import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/src/stylus/app.styl'
import '@fortawesome/fontawesome-free/css/all.css'

const vuetifyConfig = new Vuetify({
  customProperties: true,
  icons: {
    iconfont: 'fa'
  },
  theme: {
    light: {
      primary: '#ea80fc',
      secondary: '#3700b3',
      accent: '#03dac6',
      error: '#b00020',
      warning: '#ffc107',
      info: '#2196f3',
      success: '#4caf50'
    }
  }
})

Vue.use(Vuetify)

export { vuetifyConfig }
