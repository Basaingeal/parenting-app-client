<template>
  <div id="app">
    <navbar />
    <router-view />
  </div>
</template>

<script>
import Navbar from '@/components/Navbar'

export default {
  components: {
    Navbar
  },
  mounted () {
    if (this.$store.getters.timeUntilExpired > 0) {
      this.$store.dispatch('scheduleRenewal')
      if (this.$store.state.userProfile == null) {
        this.$store.dispatch('refreshProfile')
      }
    } else if (this.$store.getters.authenticated) {
      this.$store.dispatch('logout')
    } else {
      this.$store.dispatch('renewToken')
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
