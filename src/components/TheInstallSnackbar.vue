<template>
  <v-snackbar
    bottom
    color="white"
    :value="installSnackbar"
    class="mb-2 mx-3"
    :timeout="0"
  >
    <v-avatar size="48">
      <img :src="require('@/assets/logo.png')">
    </v-avatar>
    <span class="text--black">
      Add Nursry to Home screen
    </span>
    <v-spacer />
    <v-btn
      flat
      color="primary"
      @click="toggleInstallSnackbar"
    >
      No
    </v-btn>
    <v-btn
      flat
      color="primary"
      @click="prompt"
    >
      Yes
    </v-btn>
  </v-snackbar>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'TheInstallSnackbar',
  computed: {
    ...mapGetters(['installSnackbar'])
  },
  methods: {
    ...mapActions(['toggleInstallSnackbar', 'installPromptEvent']),
    prompt () {
      this.installPromptEvent.prompt()
    }
  }
}
</script>

<style>

</style>
