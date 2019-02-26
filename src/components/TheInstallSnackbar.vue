<template>
  <v-snackbar
    bottom
    color="white"
    :value="installSnackbar"
    class="mb-2 mx-3"
    :timeout="0"
  >
    <v-avatar size="20">
      <img :src="require('@/assets/logo.png')">
    </v-avatar>
    <v-spacer />
    <span class="black--text ml-2">
      Add Nursry to Home screen
    </span>
    <v-spacer />
    <v-btn
      text
      color="primary"
      @click="toggleInstallSnackbar"
    >
      No
    </v-btn>
    <v-btn
      text
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
      // this.installPromptEvent.prompt()
      window.bipEvent.prompt()
      this.toggleInstallSnackbar()
    },
    dismiss () {
      this.toggleInstallSnackbar()
      window.localStorage.setItem('dont_prompt_install', true)
    }
  }
}
</script>

<style>

</style>
