import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import 'vuetify/src/stylus/app.styl'
import colors from 'vuetify/es5/util/colors'

Vue.use(Vuetify, {
  customProperties: true,
  iconfont: 'fa',
  theme: {
    primary: colors.purple,
    secondary: colors.purple.lighten3,
    accent: colors.shades.black,
    error: colors.red
  }
})
