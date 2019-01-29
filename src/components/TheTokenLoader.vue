<template>
  <v-dialog
    v-model="showDialog"
    hide-overlay
    persistent
    width="300"
  >
    <v-card>
      <v-card-text>
        Renewing login
        <v-progress-linear
          v-model="progress"
          color="primary"
          class="mb-0"
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: true,
      required: true
    }
  },
  data () {
    return {
      progress: 0
    }
  },
  watch: {
    showDialog (val) {
      if (!val) {
        this.progress = 100
      } else {
        this.progress = 0
      }
    }
  },
  created () {
    const intervalId = window.setInterval(() => {
      this.progress++
      if (this.progress === 100) {
        window.clearInterval(intervalId)
      }
    }, 25)
  }
}
</script>

<style>

</style>
