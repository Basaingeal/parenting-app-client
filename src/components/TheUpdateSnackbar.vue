<template>
  <v-snackbar
    class="mb-2 mx-3"
    :value="updateSnackbar"
    :timeout="0"
  >
    New version available
    <v-spacer />
    <v-btn
      text
      color="primary"
      @click="toggleUpdateSnackbar"
    >
      Dismiss
    </v-btn>
    <v-btn
      text
      color="primary"
      @click="reload"
    >
      Refresh
    </v-btn>
  </v-snackbar>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'TheUpdateSnackbar',
  computed: {
    ...mapGetters(['serviceWorkerRegistration', 'updateSnackbar'])
  },
  methods: {
    ...mapActions(['toggleUpdateSnackbar']),
    reload () {
      this.toggleUpdateSnackbar()
      window.location.reload()
    }
  }
}
</script>

<style>

</style>
