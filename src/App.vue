<template>
  <div id="app">
    <v-app>
      <the-navbar v-if="!$route.path.includes('auth/')" />
      <v-content>
        <v-container fluid>
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
  mounted () {
    if (this.$store.getters.authenticated) {
      this.$store.dispatch('scheduleRenewal')
      if (this.$store.state.userProfile == null) {
        this.$store.dispatch('refreshProfile')
      }
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
