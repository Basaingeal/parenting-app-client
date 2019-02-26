<template>
  <v-form
    ref="manualBFForm"
    v-model="valid"
  >
    <v-container fill-height>
      <v-layout
        fill-height
        row
        wrap
      >
        <v-flex xs6>
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
              label="Start Date"
              readonly
              required
              outline
              prepend-inner-icon="far fa-calendar"
              :color="logThemes.breastFeedingLog.color"
              :rules="[timeInPast, requiredRule('Start Date')]"
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
        <v-flex xs6>
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
              readonly
              required
              outline
              prepend-inner-icon="far fa-clock"
              :color="logThemes.breastFeedingLog.color"
              :rules="[timeInPast, requiredRule('Start Time')]"
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
        <v-flex xs6>
          <v-select
            v-model="leftDuration"
            :items="minuteSelectItems"
            outline
            :color="logThemes.breastFeedingLog.color"
            label="Left Duration"
            :rules="[durationRequiredRule]"
          />
        </v-flex>
        <v-flex xs6>
          <v-select
            v-model="rightDuration"
            :items="minuteSelectItems"
            outline
            :color="logThemes.breastFeedingLog.color"
            label="Right Duration"
            :rules="[durationRequiredRule]"
          />
        </v-flex>
        <v-flex
          xs12
          md6
        >
          <v-select
            v-model="lastBreastUsed"
            :items="leftRightItems"
            outline
            :color="logThemes.breastFeedingLog.color"
            label="Last Breast Used"
            :rules="[requiredRule('Last Breast Used')]"
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
            :block="$vuetify.breakpoint.smAndDown"
            dark
            :disabled="!authenticated"
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
import { format, parseISO, isBefore, isSameYear } from 'date-fns'
import { toLocalISO } from '@/services/DateFilters'
import logThemes from '@/constants/logThemes'

export default {
  name: 'AddBreastFeedingLogManualForm',
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
      leftRightItems: [
        {
          text: 'Left',
          value: 'LEFT'
        },
        {
          text: 'Right',
          value: 'RIGHT'
        }
      ],
      logThemes
    }
  },
  computed: {
    ...mapGetters(['now', 'authenticated']),
    startDateTimeISO () {
      return toLocalISO(`${this.startDate}T${this.startTime}`)
    },
    readableStartDate () {
      if (!this.startDate) {
        return ''
      }
      const parsedStartDate = parseISO(this.startDate)
      let formatString = 'MMMM d'
      if (!isSameYear(this.now, parsedStartDate)) {
        formatString += ' y'
      }
      return format(parsedStartDate, formatString)
    },
    readableStartTime () {
      if (!this.startTime) {
        return ''
      }
      const dateToUse = this.startDate ? parseISO(this.startDate) : this.now
      const startDateString = format(dateToUse, 'yyy-MM-dd')
      return format(parseISO(`${startDateString}T${this.startTime}`), 'h:mm aa')
    },
    submitData () {
      return {
        details: this.details,
        startTime: this.startDateTimeISO,
        lastBreastUsed: this.lastBreastUsed,
        leftBreastDuration: this.leftDuration,
        rightBreastDuration: this.rightDuration
      }
    },
    minuteSelectItems () {
      return [...Array(120).keys()].map(i => ({
        text: i + ' minutes',
        value: i * 60
      }))
    },
    startDateTimeInPast () {
      return isBefore(parseISO(this.startDateTimeISO), this.now)
    }
  },
  methods: {
    previousDates (value) {
      return isBefore(parseISO(value), this.now)
    },
    timeInPast () {
      return this.startDateTimeInPast || 'Start time must be in the past'
    },
    requiredRule (fieldName) {
      return v => !!v || `${fieldName} is required`
    },
    durationRequiredRule (v) {
      return (!!this.leftDuration || !!this.rightDuration) || 'Some time on at least one side is required.'
    },
    submitForm () {
      this.$refs.manualBFForm.validate()
      if (this.valid) {
        this.$emit('formSubmitted', this.submitData)
      }
    }
  }
}
</script>

<style>

</style>
