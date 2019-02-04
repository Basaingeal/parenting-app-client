<template>
  <v-card>
    <v-card-actions>
      <v-container
        fluid
        grid-list-xl
      >
        <v-layout
          row
          wrap
        >
          <v-flex shrink>
            <v-btn
              :color="logThemes.breastFeedingLog.color"
              outline
            >
              Feeding
            </v-btn>
          </v-flex>
          <v-flex shrink>
            <v-btn
              :color="logThemes.diaperLog.color"
              outline
            >
              Diapers
            </v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-actions>
  </v-card>
</template>

<script>
import logThemes from '@/constants/logThemes'
export default {
  name: 'HomeNavigator',
  data () {
    return {
      logThemes
    }
  }
}
</script>

<style scoped>
</style>
