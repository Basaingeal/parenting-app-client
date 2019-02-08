<template>
  <h2>Logging out...</h2>
</template>

<script>
export default {
  name: 'LogoutCallback',
  mounted () {
    this.$nextTick(() => {
      this.$apollo.getClient().clearStore()
      this.$router.push({ name: 'welcome' })
    })
  }
}
</script>
