<template>
  <v-speed-dial
    v-model="fab"
    transition="slide-y-reverse-transition"
    bottom
    right
    fixed
  >
    <v-btn
      slot="activator"
      v-model="fab"
      :color="fab ? 'primary' : ''"
      fab
    >
      <v-icon>fas fa-plus</v-icon>
      <span>&nbsp;</span>
      <v-icon>fas fa-chevron-down</v-icon>
    </v-btn>

    <v-tooltip
      :color="logThemes.breastFeedingLog.color"
      left
    >
      <v-btn
        slot="activator"
        fab
        dark
        small
        :color="logThemes.breastFeedingLog.color"
        :to="{ name: 'newbreastfeedinglog'}"
      >
        {{ logThemes.breastFeedingLog.icon }}
      </v-btn>

      Add Breast-feeding Log
    </v-tooltip>
    <v-tooltip
      :color="logThemes.bottleFeedingLog.color"
      left
    >
      <v-btn
        slot="activator"
        fab
        dark
        small
        :color="logThemes.bottleFeedingLog.color"
        :to="{ name: 'newbreastfeedinglog'}"
      >
        {{ logThemes.bottleFeedingLog.icon }}
      </v-btn>

      Add Bottle-feeding Log
    </v-tooltip>
    <v-tooltip
      color="light-green"
      left
    >
      <v-btn
        slot="activator"
        fab
        dark
        small
        :color="logThemes.diaperLog.color"
        :to="{ name: 'newbreastfeedinglog'}"
      >
        {{ logThemes.diaperLog.icon }}
      </v-btn>
      Add Diaper Log
    </v-tooltip>
  </v-speed-dial>
</template>

<script>
import logThemes from '@/constants/logThemes'
export default {
  name: 'HomeSpeedDial',
  data () {
    return {
      fab: false,
      logThemes
    }
  }
}
</script>

<style>

</style>
