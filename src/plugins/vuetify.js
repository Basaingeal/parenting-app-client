import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faPersonBooth, faPlus, faChevronDown, faChevronLeft, faChevronRight, faCaretDown, faPlay, faPause } from '@fortawesome/free-solid-svg-icons'
import 'vuetify/src/stylus/app.styl'
import colors from 'vuetify/es5/util/colors'

Vue.component('font-awesome-icon', FontAwesomeIcon) // Register component globally
library.add(faPersonBooth, faPlus, faChevronDown, faChevronLeft, faChevronRight, faCaretDown, faPlay, faPause)

Vue.use(Vuetify, {
  customProperties: true,
  iconfont: 'faSvg',
  icons: {
    'change': {
      component: FontAwesomeIcon,
      props: {
        icon: ['fas', 'person-booth']
      }
    },
    'plus': {
      component: FontAwesomeIcon,
      props: {
        icon: ['fas', 'plus']
      }
    },
    'play': {
      component: FontAwesomeIcon,
      props: {
        icon: ['fas', 'play']
      }
    },
    'pause': {
      component: FontAwesomeIcon,
      props: {
        icon: ['fas', 'pause']
      }
    }
  },
  theme: {
    primary: colors.purple,
    secondary: colors.purple.lighten3,
    accent: colors.shades.black,
    error: colors.red
  }
})
