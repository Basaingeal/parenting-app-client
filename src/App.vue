<template>
  <div id="app">
    <v-app>
      <div v-if="authCheckComplete">
        <the-navbar v-if="!isCallbackPage" />
        <v-content>
          <v-container
            fill-height
          >
            <router-view />
          </v-container>
        </v-content>
      </div>
      <v-content v-if="!authCheckComplete">
        <the-token-loader :show-dialog="renewingToken" />
      </v-content>
    </v-app>
  </div>
</template>

<script>
import TheNavbar from '@/components/TheNavbar'
import TheTokenLoader from '@/components/TheTokenLoader'
import { mapActions, mapGetters } from 'vuex'

export default {
  components: {
    TheNavbar,
    TheTokenLoader
  },
  data () {
    return {
      authCheckComplete: false,
      isCallbackPage: this.$route.path.includes('auth/'),
      renewingToken: false
    }
  },
  computed: {
    ...mapGetters(['authenticated'])
  },
  async created () {
    if (!this.isCallbackPage) {
      if (this.authenticated) {
        this.renewingToken = true
        await this.renewToken()
        this.renewingToken = false
      } else {
        this.logout()
      }
    }
    this.authCheckComplete = true
    await this.checkWebPSupport()
  },
  methods: {
    ...mapActions(['checkWebPSupport', 'scheduleRenewal', 'refreshProfile', 'logout', 'renewToken'])
  }
}
</script>

<style lang="scss">
</style>
