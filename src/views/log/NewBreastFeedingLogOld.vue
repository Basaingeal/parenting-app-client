<template>
  <v-container>
    <v-layout
      v-if="!modeChosen"
      row
    >
      <v-flex>
        <v-btn @click="chooseTimer">
          Timer
        </v-btn>
      </v-flex>
      <v-flex>
        <v-btn @click="choseManual">
          Manual
        </v-btn>
      </v-flex>
    </v-layout>
    <div v-if="modeChosen">
      <v-form v-if="mode === 'MANUAL'">
        <v-container>
          <v-layout
            row
            wrap
          >
            <v-flex
              v-if="mode === 'MANUAL'"
              xs6
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
                  :value="startDateFormatted"
                  label="Date of feeding"
                  readonly
                />
                <v-date-picker
                  v-model="startDate"
                  :allowed-dates="allowStartDate"
                  scrollable
                >
                  <v-spacer />
                  <v-btn
                    flat
                    color="startDateModal"
                    @click="startDateModal = false"
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                    flat
                    color="primary"
                    @click="$refs.startDateDialog.save(startDate)"
                  >
                    OK
                  </v-btn>
                </v-date-picker>
              </v-dialog>
            </v-flex>
            <v-flex
              v-if="mode === 'MANUAL'"
              xs6
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
                  :value="startTimeFormatted"
                  label="Begin time"
                  readonly
                />
                <v-time-picker
                  v-if="startTimeModal"
                  v-model="startTime"
                  full-width
                >
                  <v-spacer />
                  <v-btn
                    flat
                    color="startDateModal"
                    @click="startTimeModal = false"
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                    flat
                    color="primary"
                    @click="$refs.startTimeDialog.save(startTime)"
                  >
                    OK
                  </v-btn>
                </v-time-picker>
              </v-dialog>
            </v-flex>
          </v-layout>
        </v-container>
      </v-form>
      <v-form v-if="mode === 'TIMER'">
        <v-container>
          <v-layout
            row
            wrap
          >
            <v-flex
              v-if="mode === 'TIMER'"
              xs12
              grow
            >
              <dual-timer
                :last-side-used="lastSideUsed"
                @timerStarted="setStart"
                @timerStopped="updateDataFromTimer"
              />
            </v-flex>
            <v-flex
              shrink
              class="mx-auto"
            >
              <v-btn
                :disabled="!showTimerSave"
                color="primary"
                @click="saveLog"
              >
                Save Timer
              </v-btn>
            </v-flex>
          </v-layout>
        </v-container>
      </v-form>
    </div>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { format, parse, isBefore } from 'date-fns'
import DualTimer from '@/components/DualTimer.vue'
import CREATE_BREAST_FEEDING_LOG from '@/graphql/CreateBreastFeedingLog.gql'
import GET_CHILD_WITH_EVERYTHING from '@/graphql/GetChildWithEverything.gql'

export default {
  name: 'NewBreastFeedingLog',
  components: {
    DualTimer
  },
  data () {
    return {
      modeChosen: false,
      mode: null,
      timerRunning: false,

      startDateModal: false,
      startTimeModal: false,

      startDate: null,
      startTime: null,
      endDate: null,
      endTime: null,
      leftDuration: 0,
      rightDuration: 0,
      lastSideUsed: null
    }
  },
  computed: {
    ...mapGetters(['currentChildId']),
    startDateFormatted () {
      if (!this.startDate) {
        return ''
      }
      return format(parse(this.startDate), 'MMMM Do YYYY')
    },
    startTimeFormatted () {
      if (!this.startTime) {
        return ''
      }
      return format(this.dateFromTime(this.startTime), 'h:mm a')
    },
    showTimerSave () {
      return this.mode === 'TIMER' && this.endDate && !this.timerRunning
    },
    logToSave () {
      const startDateISO = format(parse(`${this.startDate}T${this.startTime}`))
      const endDateISO = format(parse(`${this.endDate}T${this.endTime}`))
      return {
        details: '',
        childId: this.currentChildId,
        startTime: startDateISO,
        endTime: endDateISO,
        leftBreastDuration: this.leftDuration,
        rightBreastDuration: this.rightDuration,
        lastBreastUsed: this.lastSideUsed
      }
    }
  },
  methods: {
    chooseTimer () {
      this.mode = 'TIMER'
      this.modeChosen = true
    },
    choseManual () {
      this.mode = 'MANUAL'
      this.modeChosen = true
    },
    dateFromTime (time) {
      const date = new Date()
      const index = time.indexOf(':')

      let hours = time.substring(0, index)
      const minutes = time.substring(index + 1, index + 3)

      date.setHours(hours)
      date.setMinutes(minutes)
      date.setSeconds('00')

      return date
    },
    allowStartDate: (value) => isBefore(parse(value), new Date()),
    setStart () {
      this.startDate = format(new Date(), 'YYYY-MM-DD')
      this.startTime = format(new Date(), 'HH:mm')
      this.timerRunning = true
    },
    updateDataFromTimer (data) {
      this.lastSideUsed = data.lastTimerUsed
      this.leftDuration = data.leftDuration
      this.rightDuration = data.rightDuration
      this.endDate = format(data.endTime, 'YYYY-MM-DD')
      this.endTime = format(data.endTime, 'HH:mm')
      this.timerRunning = data.timerRunning
    },
    async saveLog () {
      await this.$apollo.mutate({
        mutation: CREATE_BREAST_FEEDING_LOG,
        variables: {
          log: this.logToSave
        },
        update (cache, { data: { createBreastFeedingLog } }) {
          const data = cache.readQuery({
            query: GET_CHILD_WITH_EVERYTHING,
            variables () {
              return {
                id: this.currentChildId
              }
            }
          })
          data.child.logs.push(createBreastFeedingLog)
          cache.writeQuery({
            query: GET_CHILD_WITH_EVERYTHING,
            data
          })
        }
      })
      this.$router.push({ name: 'home' })
    }
  },
  apollo: {
    lastSideUsed: {
      query: GET_CHILD_WITH_EVERYTHING,
      variables () {
        return {
          id: this.currentChildId
        }
      },
      update (data) {
        const breastFeedingLogs = data.child.logs.filter(log => log.feedingType === 'BREAST')
        if (!breastFeedingLogs) {
          return ''
        }
        const mostRecentLog = breastFeedingLogs.sort((a, b) => a.startTime < b.startTime ? 1 : 0)[0]
        return mostRecentLog.lastBreastUsed
      }
    }
  }
}
</script>

<style>

</style>
