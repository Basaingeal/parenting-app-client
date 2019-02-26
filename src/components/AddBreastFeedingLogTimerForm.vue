<template>
  <v-form
    v-model="valid"
  >
    <v-container fill-height>
      <v-layout
        row
        wrap
        fill-height
      >
        <v-flex
          xs7
          md6
        >
          <v-dialog
            ref="startDateDialog"
            v-model="startDateModal"
            :return-value.sync="startDate"
            persistent
            lazy
            full-width
            width="290px"
          >
            <v-text-field
              slot="activator"
              :value="readableStartDate"
              :color="logThemes.breastFeedingLog.color"
              label="Start Date"
              readonly
              required
              outline
              prepend-inner-icon="far fa-calendar"
            />

            <v-date-picker
              v-model="startDate"
              :allowed-dates="previousDates"
              :color="logThemes.breastFeedingLog.color"
            >
              <v-spacer />
              <v-btn
                text
                :color="logThemes.breastFeedingLog.color"
                @click="startDateModal = false"
              >
                Cancel
              </v-btn>
              <v-btn
                text
                :color="logThemes.breastFeedingLog.color"
                @click="$refs.startDateDialog.save(startDate)"
              >
                OK
              </v-btn>
            </v-date-picker>
          </v-dialog>
        </v-flex>
        <v-flex
          xs5
          md6
        >
          <v-dialog
            ref="startTimeDialog"
            v-model="startTimeModal"
            :return-value.sync="startTime"
            persistent
            lazy
            full-width
            width="290px"
          >
            <v-text-field
              slot="activator"
              :value="readableStartTime"
              label="Start Time"
              :color="logThemes.breastFeedingLog.color"
              readonly
              required
              outline
              prepend-inner-icon="far fa-clock"
              :rules="[timeInPast]"
            />

            <v-time-picker
              v-model="startTime"
              :color="logThemes.breastFeedingLog.color"
            >
              <v-spacer />
              <v-btn
                text
                :color="logThemes.breastFeedingLog.color"
                @click="startTimeModal = false"
              >
                Cancel
              </v-btn>
              <v-btn
                text
                :color="logThemes.breastFeedingLog.color"
                @click="$refs.startTimeDialog.save(startTime)"
              >
                OK
              </v-btn>
            </v-time-picker>
          </v-dialog>
        </v-flex>
        <v-flex
          xs12
          md12
          grow
        >
          <dual-timer
            :last-side-used="lastSideUsed"
            :color="logThemes.breastFeedingLog.color"
            @timerStarted="updateStartDateTime"
            @timerStopped="updateTimerInfo"
          />
        </v-flex>
        <v-flex
          xs12
          md6
        >
          <v-textarea
            v-model="details"
            outline
            :color="logThemes.breastFeedingLog.color"
            label="Details"
            rows="2"
          />
        </v-flex>
        <v-flex
          xs12
          class="mt-auto"
        >
          <v-btn
            :color="logThemes.breastFeedingLog.color"
            dark
            :block="$vuetify.breakpoint.smAndDown"
            :disabled="!canSubmit"
            @click="submitForm"
          >
            Finish and save
          </v-btn>
        </v-flex>
      </v-layout>
    </v-container>
  </v-form>
</template>

<script>
import { mapGetters } from 'vuex'
import { format, parseISO, isBefore } from 'date-fns'
import DualTimer from '@/components/DualTimer'
import { toLocalISO } from '@/services/DateFilters'
import logThemes from '@/constants/logThemes'

export default {
  name: 'AddBreastFeedingLogTimerForm',
  components: {
    DualTimer
  },
  props: {
    lastSideUsed: {
      type: String,
      required: false,
      default: ''
    }
  },
  data () {
    return {
      valid: false,
      startDateModal: false,
      startTimeModal: false,
      startDate: format(new Date(), 'yyyy-MM-dd'),
      startTime: format(new Date(), 'HH:mm'),
      leftDuration: 0,
      rightDuration: 0,
      lastBreastUsed: null,
      timerRunning: false,
      details: '',
      logThemes
    }
  },
  computed: {
    ...mapGetters(['now', 'authenticated']),
    readableStartDate () {
      return format(parseISO(this.startDate), 'MMMM d')
    },
    readableStartTime () {
      return format(parseISO(`${this.startDate}T${this.startTime}`), 'h:mm aa')
    },
    startDateTimeISO () {
      return toLocalISO(`${this.startDate}T${this.startTime}`)
    },
    startDateTimeInPast () {
      return isBefore(parseISO(this.startDateTimeISO), this.now)
    },
    canSubmit () {
      return ((!!this.leftDuration || !!this.rightDuration) && !this.timerRunning && this.valid && this.authenticated)
    },
    submitData () {
      return {
        details: this.details,
        startTime: this.startDateTimeISO,
        lastBreastUsed: this.lastBreastUsed,
        leftBreastDuration: this.leftDuration,
        rightBreastDuration: this.rightDuration
      }
    }
  },
  methods: {
    previousDates (value) {
      return isBefore(parseISO(value), this.now)
    },
    updateStartDateTime () {
      this.startDate = format(this.now, 'yyyy-MM-dd')
      this.startTime = format(this.now, 'HH:mm')
      this.timerRunning = true
    },
    updateTimerInfo (timerInfo) {
      this.leftDuration = timerInfo.leftDuration
      this.rightDuration = timerInfo.rightDuration
      this.lastBreastUsed = timerInfo.lastTimerUsed
      this.timerRunning = timerInfo.timerRunning
    },
    submitForm () {
      this.$emit('formSubmitted', this.submitData)
    },
    timeInPast () {
      return this.startDateTimeInPast || 'Start time must be in the past'
    }
  }
}
</script>

<style>

</style>
