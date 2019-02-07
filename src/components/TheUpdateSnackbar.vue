<template>
  <v-snackbar
    class="mb-2 mx-3"
    :value="value"
    :timeout="0"
  >
    New version available
    <v-spacer />
    <v-btn
      flat
      color="primary"
      @click="toggleUpdateSnackbar"
    >
      Dismiss
    </v-btn>
    <v-btn
      flat
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
  props: {
    value: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    ...mapGetters(['serviceWorkerRegistration'])
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
