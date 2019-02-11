<template>
  <v-btn
    v-if="$route.name !== 'home' && $route.name !== 'welcome'"
    icon
    @click="goBack"
  >
    <v-icon>
      fas fa-arrow-left
    </v-icon>
  </v-btn>
</template>

<script>
export default {
  name: 'TheBackButton',
  methods: {
    goBack () {
      if (window.history.length > 2) {
        this.$router.go(-1)
      } else {
        this.$router.push({ name: 'home' })
      }
    }
  }
}
</script>

<style>

</style>
