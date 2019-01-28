<template>
  <div id="app">
    <v-app>
      <the-navbar v-if="!$route.path.includes('auth/')" />
      <v-content>
        <v-container
          fill-height
        >
          <router-view />
        </v-container>
      </v-content>
    </v-app>
  </div>
</template>

<script>
import TheNavbar from '@/components/TheNavbar'

export default {
  components: {
    TheNavbar
  },
  async created () {
    await this.$store.dispatch('checkWebPSupport')
    if (this.$store.getters.authenticated) {
      this.$store.dispatch('scheduleRenewal')
      if (this.$store.state.userProfile == null) {
        this.$store.dispatch('refreshProfile')
      }
    } else {
      this.$store.dispatch('logout')
    }
  }
}
</script>

<style lang="scss">
</style>
