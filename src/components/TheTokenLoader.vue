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
          indeterminate
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
  }
}
</script>

<style>

</style>
