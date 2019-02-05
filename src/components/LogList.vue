<template>
  <v-container>
    <v-timeline
      :dense="$vuetify.breakpoint.smAndDown"
    >
      <v-timeline-item
        v-for="log in sortedLogs"
        :key="log.id"
        :color="colorForType(log.__typename)"
        fill-dot
        :large="$vuetify.breakpoint.mdAndUp"
      >
        <template v-slot:icon>
          {{ emojiForType(log.__typename) }}
        </template>
        <v-card elevation="2">
          <v-card-title
            v-if="log.startTime"
            class="title"
          >
            {{ log.startTime | differenceInWords(now) }}
          </v-card-title>
          <v-card-text v-if="log.__typename === 'BreastFeedingLog'">
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
    </v-timeline>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { differenceInWords, toMaterialDate } from '@/services/DateFilters'
import logThemes from '@/constants/logThemes'

export default {
  name: 'LogList',
  filters: {
    differenceInWords,
    toMaterialDate
  },
  props: {
    childFirstName: {
      type: String,
      required: true,
      default: ''
    },
    logs: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  computed: {
    ...mapGetters(['now']),
    sortedLogs () {
      const logsClone = [...this.logs]
      logsClone.sort((a, b) => {
        if (a.startTime && b.startTime) {
          return new Date(b.startTime) - new Date(a.startTime)
        } else {
          return 1
        }
      })
      return logsClone
    }
  },
  methods: {
    colorForType (type) {
      if (type === 'BreastFeedingLog' || type === 'BottleFeedingLog') {
        return logThemes.breastFeedingLog.color
      } else {
        return logThemes.diaperLog.color
      }
    },
    emojiForType (type) {
      if (type === 'BreastFeedingLog') {
        return logThemes.breastFeedingLog.icon
      } else if (type === 'BottleFeedingLog') {
        return logThemes.bottleFeedingLog.icon
      } else {
        return logThemes.diaperLog.icon
      }
    },
    getMinutesFromSeconds (seconds) {
      return Math.round(seconds / 60)
    }
  }
}
</script>

<style>

</style>
