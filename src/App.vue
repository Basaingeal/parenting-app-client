<template>
  <div id="app">
    <v-app>
      <the-navbar v-if="authCheckComplete" />
      <v-content>
        <v-slide-x-reverse-transition leave-absolute>
          <router-view v-if="authCheckComplete" />
        </v-slide-x-reverse-transition>
        <div v-if="!authCheckComplete">
          <the-token-loader :show-dialog="renewingToken" />
        </div>
      </v-content>
    </v-app>
  </div>
</template>

<script>
import TheNavbar from '@/components/TheNavbar'
import TheTokenLoader from '@/components/TheTokenLoader'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'App',
  components: {
    TheNavbar,
    TheTokenLoader
  },
  data () {
    return {
      authCheckComplete: false,
      renewingToken: false
    }
  },
  computed: {
    ...mapGetters(['authenticated'])
  },
  async created () {
    this.startNowTimer()
    const isCallbackPage = window.location.href.includes('auth/')
    const hasLoggedInBefore = window.localStorage.getItem('has_logged_in_on_browser')
    if (!isCallbackPage && hasLoggedInBefore) {
      this.renewingToken = true
      await this.renewToken()
      this.renewingToken = false
    } else if (!hasLoggedInBefore) {
      this.$router.push({ name: 'welcome' })
    }
    this.authCheckComplete = true
    await this.checkWebPSupport()
  },
  methods: {
    ...mapActions(['checkWebPSupport', 'scheduleRenewal', 'refreshProfile', 'logout', 'renewToken', 'startNowTimer'])
  }
}
</script>

<style lang="scss">
</style>
