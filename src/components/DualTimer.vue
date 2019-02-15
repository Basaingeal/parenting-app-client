<template>
  <v-container>
    <v-layout
      column
      align-center
      justify-center
    >
      <v-flex
        shrink
        class="my-auto mb-4"
      >
        <span class="display-2">
          {{ toTimerString(new Date(totalMilliseconds)) }}
        </span>
      </v-flex>
      <v-flex
        shrink
        style="width:100%"
      >
        <v-layout
          row
          justify-space-around
        >
          <v-flex>
            <v-layout
              column
              align-center
            >
              <v-flex class="mb-3">
                <v-badge
                  :value="lastSideUsed === 'LEFT' && !timerStarted"
                  :color="`${color} lighten-2`"
                  overlap
                >
                  <span slot="badge">🍼</span>
                  <span class="display-3">
                    {{ logThemes.breastFeedingLog.icon }}
                  </span>
                </v-badge>
              </v-flex>
              <v-flex>
                <span class="display-1">
                  {{ leftDisplay }}
                </span>
              </v-flex>
              <v-flex>
                <v-btn
                  :color="leftTimerRunning ? color : ''"
                  :dark="leftTimerRunning"
                  @click="leftButtonClick"
                >
                  <v-icon
                    v-if="!leftTimerRunning"
                    small
                  >
                    fas fa-play
                  </v-icon>
                  <v-icon
                    v-if="leftTimerRunning"
                    small
                  >
                    fas fa-pause
                  </v-icon>
                  <span class="ml-2">
                    Left
                  </span>
                </v-btn>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex>
            <v-layout
              column
              align-center
            >
              <v-flex class="mb-3">
                <v-badge
                  :value="lastSideUsed === 'RIGHT' && !timerStarted"
                  :color="`${logThemes.breastFeedingLog.color} lighten-2`"
                  overlap
                >
                  <span slot="badge">🍼</span>
                  <span class="display-3 mirror">
                    {{ logThemes.breastFeedingLog.icon }}
                  </span>
                </v-badge>
              </v-flex>
              <v-flex>
                <span class="display-1">
                  {{ rightDisplay }}
                </span>
              </v-flex>
              <v-flex>
                <v-btn
                  :color="rightTimerRunning ? color : ''"
                  :dark="rightTimerRunning"
                  @click="rightButtonClick"
                >
                  <v-icon
                    v-if="!rightTimerRunning"
                    small
                  >
                    fas fa-play
                  </v-icon>
                  <v-icon
                    v-if="rightTimerRunning"
                    small
                  >
                    fas fa-pause
                  </v-icon>
                  <span class="ml-2">
                    Right
                  </span>
                </v-btn>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import logThemes from '@/constants/logThemes'

export default {
  name: 'DualTimer',
  props: {
    lastSideUsed: {
      type: String,
      required: false,
      default: ''
    },
    color: {
      type: String,
      required: false,
      default: 'light-blue'
    }
  },
  data () {
    return {
      leftTimerRunning: false,
      rightTimerRunning: false,

      counter: 0,
      leftDurations: [],
      rightDurations: [],
      timerStarted: false,
      startTime: null,
      lastTimerUsed: null,
      endTime: null,
      logThemes
    }
  },
  computed: {
    ...mapGetters(['now']),
    leftMilliseconds () {
      let milliseconds = 0
      for (let duration of this.leftDurations) {
        const startTime = duration.startTime
        const endTime = duration.endTime || new Date(this.now.getTime())
        milliseconds += Math.round((endTime - startTime) / 1000) * 1000
      }
      return milliseconds
    },
    rightMilliseconds () {
      let milliseconds = 0
      for (let duration of this.rightDurations) {
        const startTime = duration.startTime
        const endTime = duration.endTime || new Date(this.now.getTime())
        milliseconds += Math.round((endTime - startTime) / 1000) * 1000
      }
      return milliseconds
    },
    totalMilliseconds () {
      return this.leftMilliseconds + this.rightMilliseconds
    },
    leftDisplay () {
      return this.toTimerString(new Date(this.leftMilliseconds))
    },
    rightDisplay () {
      return this.toTimerString(new Date(this.rightMilliseconds))
    },
    outputData () {
      return {
        leftDuration: Math.floor(this.leftMilliseconds / 1000),
        rightDuration: Math.floor(this.rightMilliseconds / 1000),
        endTime: this.endTime,
        lastTimerUsed: this.lastTimerUsed,
        timerRunning: this.leftTimerRunning || this.rightTimerRunning
      }
    }
  },
  watch: {
    timerStarted () {
      this.startTime = new Date(this.now.getTime())
      this.$emit('timerStarted')
    }
  },
  methods: {
    startLeftTimer () {
      this.timerStarted = true
      this.leftTimerRunning = true
      this.stopRightTimer()
      this.lastTimerUsed = 'LEFT'

      this.counter++
      this.leftDurations.push({
        counter: this.counter,
        startTime: new Date(this.now.getTime()),
        endTime: null
      })
    },
    stopLeftTimer () {
      this.leftTimerRunning = false
      const currentDuration = this.leftDurations.find(d => d.counter === this.counter)
      const endTime = new Date(this.now.getTime())
      if (currentDuration) {
        currentDuration.endTime = currentDuration.endTime || endTime
      }
      this.endTime = endTime
      this.$emit('timerStopped', this.outputData)
    },
    startRightTimer () {
      this.timerStarted = true
      this.rightTimerRunning = true
      this.stopLeftTimer()
      this.lastTimerUsed = 'RIGHT'

      this.counter++
      this.rightDurations.push({
        counter: this.counter,
        startTime: new Date(this.now.getTime()),
        endTime: null
      })
    },
    stopRightTimer () {
      this.rightTimerRunning = false
      const currentDuration = this.rightDurations.find(d => d.counter === this.counter)
      const endTime = new Date(this.now.getTime())
      if (currentDuration) {
        currentDuration.endTime = currentDuration.endTime || endTime
      }
      this.endTime = endTime
      this.$emit('timerStopped', this.outputData)
    },
    leftButtonClick () {
      if (this.leftTimerRunning) {
        this.stopLeftTimer()
      } else {
        this.startLeftTimer()
      }
    },
    rightButtonClick () {
      if (this.rightTimerRunning) {
        this.stopRightTimer()
      } else {
        this.startRightTimer()
      }
    },
    toTimerString (date) {
      let hours = ''
      if (date.getUTCHours()) {
        hours = `${date.getUTCHours()}:`
      }
      const minutes = date.getUTCMinutes().toString().padStart(2, '0')
      const seconds = date.getUTCSeconds().toString().padStart(2, '0')
      return `${hours}${minutes}:${seconds}`
    }
  }
}
</script>

<style scoped>
.mirror {
  transform: scaleX(-1);
  display: block;
}
</style>
