<template>
  <v-form v-model="valid">
    <v-container>
      <v-layout
        row
        wrap
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
              label="Start Date"
              readonly
              required
              outline
              prepend-inner-icon="far fa-calendar"
            />
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
              readonly
              required
              outline
              prepend-inner-icon="far fa-clock"
            />
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
        <v-flex
          xs12
          md12
        >
          <dual-timer
            :last-side-used="lastSideUsed"
            @timerStarted="updateStartDateTime"
          />
        </v-flex>
      </v-layout>
    </v-container>
  </v-form>
</template>

<script>
import { mapGetters } from 'vuex'
import { format, parse, isBefore } from 'date-fns'
import DualTimer from '@/components/DualTimer'

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
      startDate: format(new Date(), 'YYYY-MM-DD'),
      startTime: format(new Date(), 'HH:mm')
    }
  },
  computed: {
    ...mapGetters(['now']),
    readableStartDate () {
      return format(parse(this.startDate), 'MMMM D')
    },
    readableStartTime () {
      return format(parse(`${this.startDate}T${this.startTime}`), 'h:mm A')
    }
  },
  methods: {
    previousDates (value) {
      return isBefore(parse(value), this.now)
    },
    updateStartDateTime () {
      this.startDate = format(this.now, 'YYYY-MM-DD')
      this.startTime = format(this.now, 'HH:mm')
    }
  }
}
</script>

<style>

</style>
