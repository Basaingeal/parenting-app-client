<template>
  <h2>Authenticating...</h2>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'LoginCallback',
  mounted () {
    this.$nextTick(async () => {
      await this.handleAuthentication()
      this.$router.push({ name: 'home' })
    })
  },
  methods: {
    ...mapActions(['handleAuthentication'])
  }
}
</script>

<style>

</style>
