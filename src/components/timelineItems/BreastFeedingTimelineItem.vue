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
    <template slot="icon">
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
        <span class="font-weight-medium">
          {{ childFirstName }}
        </span>
        was breastfed for
        <span class="font-weight-medium">
          {{ getMinutesFromSeconds(log.leftBreastDuration + log.rightBreastDuration) }} minutes.
        </span>
        <span v-if="getMinutesFromSeconds(log.leftBreastDuration)">
          <span class="font-weight-medium">
            {{ getMinutesFromSeconds(log.leftBreastDuration) }} minute{{ getMinutesFromSeconds(log.leftBreastDuration) !== 1 ? 's' : '' }}
          </span> on the left side.
        </span>
        <span v-if="getMinutesFromSeconds(log.rightBreastDuration)">
          <span class="font-weight-medium">
            {{ getMinutesFromSeconds(log.rightBreastDuration) }} minute{{ getMinutesFromSeconds(log.rightBreastDuration) !== 1 ? 's' : '' }}
          </span> on the right side.
        </span>
      </div>
      <div v-if="log.details">
        <span class="font-italic">
          {{ log.details }}
        </span>
      </div>
    </v-layout>
    <template #timestamp>
      {{ log.startTime | toMaterialDateTime(now, true) }}
    </template>
    <template #edit>
      <breast-feeding-log-edit-form
        :log="log"
        @formSubmit="handleEditFormSubmit"
      />
    </template>
    <template #delete>
      <v-card-text>
        <v-btn @click="deleteModal = false">
          Close
        </v-btn>
      </v-card-text>
    </template>
    <v-snackbar
      v-model="snackbar"
      bottom
      :timeout="1500"
      class="mb-2 mx-3"
    >
      <v-icon color="success">
        fas fa-check
      </v-icon>
      {{ snackbarText }}
    </v-snackbar>
    <v-dialog
      v-model="deleteModal"
      max-width="290px"
    >
      <delete-log-card
        :color="logThemes.breastFeedingLog.color"
        :log-id="log.id"
        @noDelete="deleteModal = false"
        @logDeleted="handleLogDeleted"
      />
    </v-dialog>
  </base-timeline-item>
</template>

<script>
import logThemes from '@/constants/logThemes'
import { differenceInWords, toMaterialDate, toMaterialDateTime } from '@/services/DateFilters'
import { mapGetters } from 'vuex'
import BaseTimelineItem from '@/components/timelineItems/BaseTimelineItem'
import BreastFeedingLogEditForm from '@/components/editForms/BreastFeedingLogEditForm'
import DeleteLogCard from '@/components/DeleteLogCard'
import UPDATE_BREAST_FEEDING_LOG from '@/graphql/UpdateBreastFeedingLog.gql'

export default {
  name: 'BreastFeedingTimeineItem',
  filters: {
    differenceInWords,
    toMaterialDate,
    toMaterialDateTime
  },
  components: {
    BaseTimelineItem,
    BreastFeedingLogEditForm,
    DeleteLogCard
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
      deleteModal: false,
      snackbar: false,
      snackbarText: ''
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
    },
    async handleEditFormSubmit (formData) {
      this.edit = false
      await this.$apollo.mutate({
        mutation: UPDATE_BREAST_FEEDING_LOG,
        variables: {
          log: formData
        }
      })
      this.snackbarText = 'Log Updated'
      this.snackbar = true
    },
    handleLogDeleted () {
      this.deleteModal = false
      this.snackbarText = 'Log Deleted'
      this.snackbar = true
    }
  }
}
</script>

<style>

</style>
