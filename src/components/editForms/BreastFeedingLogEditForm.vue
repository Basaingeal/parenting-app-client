<template>
  <v-form
    ref="bfEditForm"
    v-model="valid"
  >
    <v-container>
      <v-layout
        row
        wrap
      >
        <v-flex
          xs12
          sm6
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
        <v-flex
          xs12
          sm6
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
        <v-flex
          xs12
          sm6
        >
          <v-select
            v-model="leftDuration"
            :items="minuteSelectItems"
            outline
            :color="logThemes.breastFeedingLog.color"
            label="Left Duration"
            :rules="[durationRequiredRule]"
          />
        </v-flex>
        <v-flex
          xs12
          sm6
        >
          <v-select
            v-model="log.rightBreastDuration"
            :items="minuteSelectItems"
            outline
            :color="logThemes.breastFeedingLog.color"
            label="Right Duration"
            :rules="[durationRequiredRule]"
          />
        </v-flex>
        <v-flex
          xs12
          sm6
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
          shrink
          class="mx-auto"
        >
          <v-btn
            :color="logThemes.breastFeedingLog.color"
            dark
            @click="saveLog"
          >
            Save
          </v-btn>
        </v-flex>
      </v-layout>
    </v-container>
  </v-form>
</template>

<script>
import logThemes from '@/constants/logThemes'
import { mapGetters } from 'vuex'
import { format, parseISO, isBefore, isSameYear } from 'date-fns/fp'
import { toLocalISO } from '@/services/DateFilters'

export default {
  name: 'BreastFeedingLogEditForm',
  props: {
    log: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      valid: true,
      logThemes,
      leftDuration: Math.round(this.log.leftBreastDuration / 60) * 60,
      rightDuration: Math.round(this.log.rightBreastDuration / 60) * 60,
      startDate: format('yyyy-MM-dd')(parseISO(this.log.startTime)),
      startTime: format('HH:mm')(parseISO(this.log.startTime)),
      lastBreastUsed: this.log.lastBreastUsed,
      details: this.log.details,
      startDateModal: false,
      startTimeModal: false,

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
    ...mapGetters(['currentChildId', 'now']),
    minuteSelectItems () {
      return [...Array(120).keys()].map(i => ({
        text: i + ' minutes',
        value: i * 60
      }))
    },
    formData () {
      const { feedingType, __typename, dateAdded, ...onlyFormData } = this.log
      return {
        ...onlyFormData,
        childId: this.currentChildId,
        leftBreastDuration: this.leftDuration,
        rightBreastDuration: this.rightDuration,
        startTime: this.startDateTimeISO,
        lastBreastUsed: this.lastBreastUsed,
        details: this.details
      }
    },
    readableStartDate () {
      if (!this.startDate) {
        return ''
      }
      const parsedStartDate = parseISO(this.startDate)
      let formatString = 'MMMM d'
      if (!isSameYear(this.now)(parsedStartDate)) {
        formatString += ' y'
      }
      return format(formatString)(parsedStartDate)
    },
    readableStartTime () {
      return format('h:mm aa')(parseISO(`${this.startDate}T${this.startTime}`))
    },
    startDateTimeInPast () {
      return isBefore(this.now)(parseISO(this.startDateTimeISO))
    },
    startDateTimeISO () {
      return toLocalISO(`${this.startDate}T${this.startTime}`)
    }
  },
  methods: {
    durationRequiredRule (v) {
      return (!!this.leftDuration || !!this.rightDuration) || 'Some time on at least one side is required.'
    },
    timeInPast () {
      return this.startDateTimeInPast || 'Start time must be in the past'
    },
    requiredRule (fieldName) {
      return v => !!v || `${fieldName} is required`
    },
    previousDates (value) {
      return isBefore(this.now)(parseISO(value))
    },
    saveLog () {
      this.$refs.bfEditForm.validate()
      if (this.valid) {
        this.$emit('formSubmit', this.formData)
      }
    }
  }
}
</script>

<style>

</style>
