<template>
  <v-container>
    <v-layout>
      <v-flex>
        <v-layout column>
          <v-flex>
            <p>{{ leftDisplay }}</p>
          </v-flex>
          <v-flex>
            <v-btn @click="leftButtonClick">
              <v-icon
                v-if="!leftTimerRunning"
                v-text="'$vuetify.icons.play'"
              />
              <v-icon
                v-if="leftTimerRunning"
                v-text="'$vuetify.icons.pause'"
              />
              {{ leftTimerRunning ? 'Pause' : 'Start' }}
            </v-btn>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex>
        <v-layout column>
          <v-flex>
            <p>{{ rightDisplay }}</p>
          </v-flex>
          <v-flex>
            <v-btn @click="rightButtonClick">
              <v-icon
                v-if="!rightTimerRunning"
                v-text="'$vuetify.icons.play'"
              />
              <v-icon
                v-if="rightTimerRunning"
                v-text="'$vuetify.icons.pause'"
              />
              {{ rightTimerRunning ? 'Pause' : 'Start' }}
            </v-btn>
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
      rightDurations: []
    }
  },
  computed: {
    leftDisplay () {
      let milliseconds = 0
      for (let duration of this.leftDurations) {
        const startTime = duration.startTime
        const endTime = duration.endTime || this.now
        milliseconds += endTime - startTime
      }

      return this.toTimerString(new Date(milliseconds))
    },
    rightDisplay () {
      let milliseconds = 0
      for (let duration of this.rightDurations) {
        const startTime = duration.startTime
        const endTime = duration.endTime || this.now
        milliseconds += endTime - startTime
      }

      return this.toTimerString(new Date(milliseconds))
    }
  },
  created () {
    window.setInterval(() => { this.now = new Date() }, 16.67)
  },
  methods: {
    startLeftTimer () {
      this.stopRightTimer()

      this.counter++
      this.leftTimerRunning = true
      this.leftDurations.push({
        counter: this.counter,
        startTime: new Date(),
        endTime: null
      })
    },
    stopLeftTimer () {
      this.leftTimerRunning = false
      const currentDuration = this.leftDurations.find(d => d.counter === this.counter)
      if (currentDuration) {
        currentDuration.endTime = new Date()
      }
    },
    startRightTimer () {
      this.stopLeftTimer()

      this.counter++
      this.rightTimerRunning = true
      this.rightDurations.push({
        counter: this.counter,
        startTime: new Date(),
        endTime: null
      })
    },
    stopRightTimer () {
      this.rightTimerRunning = false
      const currentDuration = this.rightDurations.find(d => d.counter === this.counter)
      if (currentDuration) {
        currentDuration.endTime = new Date()
      }
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
