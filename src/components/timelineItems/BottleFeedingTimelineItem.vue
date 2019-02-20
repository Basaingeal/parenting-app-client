<template>
  <base-timeline-item
    :color="logThemes.bottleFeedingLog.color"
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
      {{ logThemes.bottleFeedingLog.icon }}
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
        was bottlefed
        <span
          v-if="units === 'IMPERIAL'"
          class="font-weight-medium"
        >
          {{ log.amount | mlToOz }} oz.
        </span>
        <span
          v-else
          class="font-weight-medium"
        >
          {{ log.amount }} ml.
        </span>
        of
        <span
          v-if="log.bottleContent === 'FORMULA'"
          class="font-weight-medium"
        >
          formula
        </span>
        <span
          v-else
          class="font-weight-medium"
        >
          breast milk
        </span>
        .
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
      <span class="title">COMING SOON</span>
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
        :color="logThemes.bottleFeedingLog.color"
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
import { mlToOz } from '@/services/Conversions'
import BaseTimelineItem from '@/components/timelineItems/BaseTimelineItem'
/// /import BottleFeedingLogEditForm from '@/components/editForms/BottleFeedingLogEditForm'
import DeleteLogCard from '@/components/DeleteLogCard'
/// import UPDATE_BOTTLE_FEEDING_LOG from '@/graphql/UpdateBottleFeedingLog.gql'
export default {
  name: 'BottleFeedingTimelineItem',
  filters: {
    differenceInWords,
    toMaterialDate,
    toMaterialDateTime,
    mlToOz
  },
  components: {
    BaseTimelineItem,
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
    },
    units: {
      type: String,
      required: false,
      default: 'METRIC'
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
    toggleEdit () {
      this.edit = !this.edit
    },
    // // async handleEditFormSubmit (formData) {
    // //   this.edit = false
    // //   await this.$apollo.mutate({
    // //     mutation: UPDATE_BREAST_FEEDING_LOG,
    // //     variables: {
    // //       log: formData
    // //     }
    // //   })
    // //   this.snackbarText = 'Log Updated'
    // //   this.snackbar = true
    // // },
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
