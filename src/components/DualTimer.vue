<template>
  <v-container fill-height>
    <v-layout
      column
      align-center
      justify-center
    >
      <v-flex
        shrink
        class="my-auto"
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
              <v-flex>
                <span class="display-1">
                  {{ leftDisplay }}
                </span>
              </v-flex>
              <v-flex>
                <v-btn
                  :color="leftTimerRunning ? 'primary' : ''"
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
              <v-flex>
                <span class="display-1">
                  {{ rightDisplay }}
                </span>
              </v-flex>
              <v-flex>
                <v-btn
                  :color="rightTimerRunning ? 'primary' : ''"
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

export default {
  name: 'DualTimer',
  data () {
    return {
      leftTimerRunning: false,
      rightTimerRunning: false,

      now: new Date(),
      counter: 0,
      leftDurations: [],
      rightDurations: [],
      timerStarted: false,
      startTime: null,
      lastTimerUsed: null,
      endTime: null
    }
  },
  computed: {
    leftMilliseconds () {
      let milliseconds = 0
      for (let duration of this.leftDurations) {
        const startTime = duration.startTime
        const endTime = duration.endTime || this.now
        milliseconds += endTime - startTime
      }
      return milliseconds
    },
    rightMilliseconds () {
      let milliseconds = 0
      for (let duration of this.rightDurations) {
        const startTime = duration.startTime
        const endTime = duration.endTime || this.now
        milliseconds += endTime - startTime
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
      const leftDuration = Math.floor(this.leftMilliseconds / 1000)
      const rightDuration = Math.floor(this.rightMilliseconds / 1000)
      const endTime = this.endTime
      const lastTimerUsed = this.lastTimerUsed
      const timerRunning = this.leftTimerRunning || this.rightTimerRunning
      return {
        leftDuration,
        rightDuration,
        endTime,
        lastTimerUsed,
        timerRunning
      }
    }
  },
  watch: {
    timerStarted () {
      this.startTime = new Date()
      this.$emit('timerStarted')
    }
  },
  created () {
    window.setInterval(() => { this.now = new Date() }, 500)
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
        startTime: new Date(),
        endTime: null
      })
    },
    stopLeftTimer () {
      this.leftTimerRunning = false
      const currentDuration = this.leftDurations.find(d => d.counter === this.counter)
      const endTime = new Date()
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
        startTime: new Date(),
        endTime: null
      })
    },
    stopRightTimer () {
      this.rightTimerRunning = false
      const currentDuration = this.rightDurations.find(d => d.counter === this.counter)
      const endTime = new Date()
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

<style>

</style>
