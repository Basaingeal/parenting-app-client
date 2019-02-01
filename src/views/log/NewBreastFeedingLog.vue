<template>
  <v-tabs
    v-model="tabsActive"
    color="light-blue lighten-4"
    grow
    slider-color="light-blue darken-4"
  >
    <v-tab
      ripple
    >
      Timer
    </v-tab>
    <v-tab
      ripple
    >
      Manual
    </v-tab>
    <v-tab-item>
      <add-breast-feeding-log-timer-form :last-side-used="lastSideUsed" />
    </v-tab-item>
    <v-tab-item>
      <span>MANUAL</span>
    </v-tab-item>
  </v-tabs>
</template>

<script>
import AddBreastFeedingLogTimerForm from '@/components/AddBreastFeedingLogTimerForm'
import { mapGetters } from 'vuex'
import GET_CHILD_WITH_EVERYTHING from '@/graphql/GetChildWithEverything.gql'

export default {
  name: 'NewBreastFeedingLog',
  components: {
    AddBreastFeedingLogTimerForm
  },
  data () {
    return {
      tabsActive: 0
    }
  },
  computed: {
    ...mapGetters(['currentChildId'])
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
