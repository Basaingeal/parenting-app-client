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
        <v-flex
          xs6
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
            <template #activator>
              <v-text-field
                :value="readableStartDate"
                label="Start Date"
                readonly
                required
                outline
                prepend-inner-icon="far fa-calendar"
                color="light-blue"
                :rules="[timeInPast, requiredRule('Start Date')]"
              />
            </template>

            <v-date-picker
              v-model="startDate"
              :allowed-dates="previousDates"
              color="light-blue"
            >
              <v-spacer />
              <v-btn
                flat
                color="light-blue"
                @click="startDateModal = false"
              >
                Cancel
              </v-btn>
              <v-btn
                flat
                color="light-blue"
                @click="$refs.startDateDialog.save(startDate)"
              >
                OK
              </v-btn>
            </v-date-picker>
          </v-dialog>
        </v-flex>
        <v-flex
          xs6
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
            <template #activator>
              <v-text-field
                :value="readableStartTime"
                label="Start Time"
                readonly
                required
                outline
                prepend-inner-icon="far fa-clock"
                color="light-blue"
                :rules="[timeInPast, requiredRule('Start Time')]"
              />
            </template>

            <v-time-picker
              v-model="startTime"
              color="light-blue"
            >
              <v-spacer />
              <v-btn
                flat
                color="light-blue"
                @click="startTimeModal = false"
              >
                Cancel
              </v-btn>
              <v-btn
                flat
                color="light-blue"
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
            color="light-blue"
            label="Left Duration"
            :rules="[durationRequiredRule]"
          />
        </v-flex>
        <v-flex xs6>
          <v-select
            v-model="rightDuration"
            :items="minuteSelectItems"
            outline
            color="light-blue"
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
            color="light-blue"
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
            color="light-blue"
            label="Details"
            rows="2"
          />
        </v-flex>
        <v-flex
          xs12
          class="mt-auto"
        >
          <v-btn
            color="light-blue"
            :block="$vuetify.breakpoint.smAndDown"
            dark
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
import { toLocalISO } from '@/services/DateFilters'

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
      ]
    }
  },
  computed: {
    ...mapGetters(['now']),
    startDateTimeISO () {
      return toLocalISO(`${this.startDate}T${this.startTime}`)
    },
    readableStartDate () {
      return this.startDate ? format(parseISO(this.startDate), 'MMMM d') : this.startDate
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