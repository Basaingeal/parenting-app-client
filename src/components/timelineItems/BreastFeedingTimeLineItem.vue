<template>
  <v-timeline-item
    :color="logThemes.breastFeedingLog.color"
    fill-dot
    :large="!dense"
  >
    <template #icon>
      {{ logThemes.breastFeedingLog.icon }}
    </template>
    <template #opposite>
      <span class="title font-weight-light">
        {{ log.startTime | differenceInWords(now) }}
      </span>
    </template>
    <v-card
      raised
    >
      <v-card-text>
        <v-layout column>
          <span
            v-if="dense"
            class="title font-weight-light mb-2"
          >
            {{ log.startTime | differenceInWords(now) }}
          </span>
          <div class="mb-1">
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
          </div>
          <span
            class="caption font-weight-light"
          >
            {{ log.startTime | toMaterialDateTime(now, true) }}
          </span>
        </v-layout>
      </v-card-text>
    </v-card>
  </v-timeline-item>
</template>

<script>
import logThemes from '@/constants/logThemes'
import { differenceInWords, toMaterialDate, toMaterialDateTime } from '@/services/DateFilters'
import { mapGetters } from 'vuex'

export default {
  name: 'BreastFeedingTimeLineItem',
  filters: {
    differenceInWords,
    toMaterialDate,
    toMaterialDateTime
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
    },
    dense: {
      type: Boolean,
      required: false,
      default: false
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
