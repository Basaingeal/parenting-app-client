<template>
  <v-form
    ref="bottleFeedingForm"
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
              :color="logThemes.bottleFeedingLog.color"
              :rules="[timeInPast, requiredRule('Start Date')]"
            />

            <v-date-picker
              v-model="startDate"
              :allowed-dates="previousDates"
              :color="logThemes.bottleFeedingLog.color"
            >
              <v-spacer />
              <v-btn
                text
                :color="logThemes.bottleFeedingLog.color"
                @click="startDateModal = false"
              >
                Cancel
              </v-btn>
              <v-btn
                text
                :color="logThemes.bottleFeedingLog.color"
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
              :color="logThemes.bottleFeedingLog.color"
              :rules="[timeInPast, requiredRule('Start Time')]"
            />

            <v-time-picker
              v-model="startTime"
              :color="logThemes.bottleFeedingLog.color"
            >
              <v-spacer />
              <v-btn
                text
                :color="logThemes.bottleFeedingLog.color"
                @click="startTimeModal = false"
              >
                Cancel
              </v-btn>
              <v-btn
                text
                :color="logThemes.bottleFeedingLog.color"
                @click="$refs.startTimeDialog.save(startTime)"
              >
                OK
              </v-btn>
            </v-time-picker>
          </v-dialog>
        </v-flex>
        <v-flex xs-6>
          <v-text-field
            v-if="units === 'IMPERIAL'"
            :value="mlToOz(ml)"
            type="number"
            step="0.01"
            outline
            :color="logThemes.bottleFeedingLog.color"
            label="Amount (oz)"
            :rules="[v => v <= 32 || 'Amount must be less than or equal to 32oz.',
                     requiredRule('Amount')]"
            @input="setMlFromOz"
          />
          <v-text-field
            v-else
            v-model="ml"
            type="number"
            step="1"
            outline
            :color="logThemes.bottleFeedingLog.color"
            label="Amount (ml)"
            :rules="[v => v < 1000 || 'Amount must be less than 1000ml.',
                     requiredRule('Amount')]"
          />
        </v-flex>
        <v-flex xs6>
          <v-select
            v-model="bottleContent"
            :items="contentItems"
            outline
            :color="logThemes.bottleFeedingLog.color"
            :rules="[requiredRule('Bottle Contents')]"
            label="Bottle Contents"
          />
        </v-flex>
        <v-flex
          xs12
          md6
        >
          <v-textarea
            v-model="details"
            outline
            :color="logThemes.bottleFeedingLog.color"
            label="Details"
            rows="2"
          />
        </v-flex>
        <v-flex
          xs12
          class="mt-auto"
        >
          <v-btn
            :color="logThemes.bottleFeedingLog.color"
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
import logThemes from '@/constants/logThemes'
import { format, isBefore, parseISO, isSameYear } from 'date-fns/fp'
import { mapGetters } from 'vuex'
import { toLocalISO } from '@/services/DateFilters'
import { ozToMl, mlToOz } from '@/services/Conversions'

export default {
  name: 'AddBottleFeedingLogForm',
  props: {
    units: {
      type: String,
      required: false,
      default: 'METRIC'
    }
  },
  data () {
    return {
      valid: false,
      logThemes,

      startDateModal: false,
      startTimeModal: false,

      startDate: format('yyyy-MM-dd')(new Date()),
      startTime: format('HH:mm')(new Date()),

      ml: 0,
      details: '',
      bottleContent: '',

      contentItems: [
        {
          value: 'BREAST_MILK',
          text: 'Breast Milk'
        },
        {
          value: 'FORMULA',
          text: 'Formula'
        }
      ]
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
      if (!isSameYear(this.now)(parsedStartDate)) {
        formatString += ' y'
      }
      return format(formatString)(parsedStartDate)
    },
    readableStartTime () {
      if (!this.startTime) {
        return ''
      }
      const dateToUse = this.startDate ? parseISO(this.startDate) : this.now
      const startDateString = format('yyyy-MM-dd')(dateToUse)
      return format('h:mm aa')(parseISO(`${startDateString}T${this.startTime}`))
    },
    startDateTimeInPast () {
      return isBefore(this.now)(parseISO(this.startDateTimeISO))
    },
    submitData () {
      return {
        details: this.details,
        startTime: this.startDateTimeISO,
        amount: this.ml,
        bottleContent: this.bottleContent
      }
    }
  },
  methods: {
    previousDates (value) {
      return isBefore(this.now)(parseISO(value))
    },
    timeInPast () {
      return this.startDateTimeInPast || 'Start time must be in the past'
    },
    requiredRule (fieldName) {
      return v => !!v || `${fieldName} is required`
    },
    setMlFromOz (value) {
      this.ml = ozToMl(value)
    },
    mlToOz,
    submitForm () {
      this.$refs.bottleFeedingForm.validate()
      if (this.valid) {
        this.$emit('formSubmitted', this.submitData)
      }
    }
  }
}
</script>

<style>

</style>
