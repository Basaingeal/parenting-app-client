<template>
  <base-timeline-item
    :color="logThemes.breastFeedingLog.color"
    :dense="dense"
    :edit="edit"
    @openEdit="toggleEdit"
    @openDelete="deleteModal = true"
  >
    <template #opposite>
      <span class="title font-weight-light">
        {{ log.startTime | differenceInWords(now) }}
      </span>
    </template>
    <template #icon>
      {{ logThemes.breastFeedingLog.icon }}
    </template>
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
          {{ getMinutesFromSeconds(log.leftBreastDuration + log.rightBreastDuration) }} minutes.
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
    </v-layout>
    <v-dialog v-model="deleteModal">
      <v-card>
        <v-card-actions>
          <v-btn
            flat
            @click="deleteModal = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <template #timestamp>
      {{ log.startTime | toMaterialDateTime(now, true) }}
    </template>
    <template #edit>
      <breast-feeding-log-edit-form :log="log" />
      <v-card-text>
        <v-btn @click="edit = false">
          Close
        </v-btn>
      </v-card-text>
    </template>
    <template #delete>
      <v-card-text>
        <v-btn @click="deleteModal = false">
          Close
        </v-btn>
      </v-card-text>
    </template>
  </base-timeline-item>
</template>

<script>
import logThemes from '@/constants/logThemes'
import { differenceInWords, toMaterialDate, toMaterialDateTime } from '@/services/DateFilters'
import { mapGetters } from 'vuex'
import BaseTimelineItem from '@/components/timelineItems/BaseTimelineItem'
import BreastFeedingLogEditForm from '@/components/editForms/BreastFeedingLogEditForm'

export default {
  name: 'BreastFeedingTimeineItem',
  filters: {
    differenceInWords,
    toMaterialDate,
    toMaterialDateTime
  },
  components: {
    BaseTimelineItem,
    BreastFeedingLogEditForm
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
      logThemes,
      edit: false,
      deleteModal: false
    }
  },
  computed: {
    ...mapGetters(['now'])
  },
  methods: {
    getMinutesFromSeconds (seconds) {
      return Math.round(seconds / 60)
    },
    toggleEdit () {
      this.edit = !this.edit
    }
  }
}
</script>

<style>

</style>
