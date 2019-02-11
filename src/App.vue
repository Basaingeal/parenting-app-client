<template>
  <v-app>
    <the-navbar v-if="authCheckComplete" />
    <v-content>
      <v-scroll-x-reverse-transition mode="out-in">
        <router-view v-if="authCheckComplete" />
      </v-scroll-x-reverse-transition>
      <div v-if="!authCheckComplete">
        <the-token-loader :show-dialog="renewingToken" />
      </div>
    </v-content>
    <the-update-snackbar />
    <the-install-snackbar />
  </v-app>
</template>

<script>
import TheNavbar from '@/components/TheNavbar'
import TheTokenLoader from '@/components/TheTokenLoader'
import TheUpdateSnackbar from '@/components/TheUpdateSnackbar'
import TheInstallSnackbar from '@/components/TheInstallSnackbar'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'App',
  components: {
    TheNavbar,
    TheTokenLoader,
    TheUpdateSnackbar,
    TheInstallSnackbar
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
    this.renewTokenOnVisibilityChange()
    await this.checkWebPSupport()
  },
  methods: {
    ...mapActions(['checkWebPSupport', 'scheduleRenewal', 'refreshProfile', 'logout', 'renewToken', 'startNowTimer', 'renewTokenOnVisibilityChange'])
  }
}
</script>

<style lang="scss">
</style>
