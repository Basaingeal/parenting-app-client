<template>
  <v-timeline-item
    :color="logThemes.breastFeedingLog.color"
    fill-dot
    :large="$vuetify.breakpoint.mdAndUp"
  >
    <template #icon>
      {{ logThemes.breastFeedingLog.icon }}
    </template>
    <v-card elevation="2">
      <v-card-title
        v-if="log.startTime"
        class="title"
      >
        {{ log.startTime | differenceInWords(now) }}
      </v-card-title>
      <v-card-text>
        <span class="font-weight-bold">
          {{ childFirstName }}
        </span>
        was breastfed for
        <span class="font-weight-bold">
          {{ getMinutesFromSeconds(log.leftBreastDuration) + getMinutesFromSeconds(log.rightBreastDuration) }} minutes.
        </span>
        <span v-if="getMinutesFromSeconds(log.leftBreastDuration)">
          <span class="font-weight-bold">
            {{ getMinutesFromSeconds(log.leftBreastDuration) }} minute{{ getMinutesFromSeconds(log.leftBreastDuration) !== 1 ? 's' : '' }}
          </span> on the left side.
        </span>
        <span v-if="getMinutesFromSeconds(log.rightBreastDuration)">
          <span class="font-weight-bold">
            {{ getMinutesFromSeconds(log.rightBreastDuration) }} minute{{ getMinutesFromSeconds(log.rightBreastDuration) !== 1 ? 's' : '' }}
          </span> on the right side.
        </span>
      </v-card-text>
    </v-card>
  </v-timeline-item>
</template>

<script>
import logThemes from '@/constants/logThemes'
import { differenceInWords, toMaterialDate } from '@/services/DateFilters'
import { mapGetters } from 'vuex'

export default {
  name: 'BreastFeedingTimeLineItem',
  filters: {
    differenceInWords,
    toMaterialDate
  },
  props: {
    log: {
      type: Object,
      required: true
    },
    childFirstName: {
      type: String,
      required: true,
      default: ''
    }
  },
  data () {
    return {
      logThemes
    }
  },
  computed: {
    ...mapGetters(['now'])
  },
  methods: {
    getMinutesFromSeconds (seconds) {
      return Math.round(seconds / 60)
    }
  }
}
</script>

<style>

</style>
