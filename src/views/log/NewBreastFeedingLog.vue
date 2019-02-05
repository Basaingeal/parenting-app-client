<template>
  <v-tabs
    v-model="tabsActive"
    color="light-blue lighten-4"
    fixed-tabs
    slider-color="light-blue darken-4"
  >
    <v-tab
      ripple
    >
      Timer
    </v-tab>
    <v-tab
      ripple
      :disabled="timerRunning"
    >
      Manual
    </v-tab>
    <v-tab-item>
      <add-breast-feeding-log-timer-form
        :last-side-used="lastSideUsed"
        @formSubmitted="submitLog"
      />
    </v-tab-item>
    <v-tab-item>
      <add-breast-feeding-log-manual-form
        @formSubmitted="submitLog"
      />
    </v-tab-item>
  </v-tabs>
</template>

<script>
import AddBreastFeedingLogTimerForm from '@/components/AddBreastFeedingLogTimerForm'
import AddBreastFeedingLogManualForm from '@/components/AddBreastFeedingLogManualForm'
import { mapGetters } from 'vuex'
import GET_CHILD_WITH_EVERYTHING from '@/graphql/GetChildWithEverything.gql'
import CREATE_BREAST_FEEDING_LOG from '@/graphql/CreateBreastFeedingLog.gql'

export default {
  name: 'NewBreastFeedingLog',
  components: {
    AddBreastFeedingLogTimerForm,
    AddBreastFeedingLogManualForm
  },
  data () {
    return {
      tabsActive: 0,
      timerRunning: false
    }
  },
  computed: {
    ...mapGetters(['currentChildId'])
  },
  methods: {
    async submitLog (formData) {
      const currentChildId = this.currentChildId
      await this.$apollo.mutate({
        mutation: CREATE_BREAST_FEEDING_LOG,
        variables: {
          log: {
            ...formData,
            childId: currentChildId
          }
        },
        update (cache, { data: { createBreastFeedingLog } }) {
          const data = cache.readQuery({
            query: GET_CHILD_WITH_EVERYTHING,
            variables: {
              id: currentChildId
            }
          })
          data.child.logs.push(createBreastFeedingLog)
          cache.writeQuery({
            query: GET_CHILD_WITH_EVERYTHING,
            variables: {
              id: currentChildId
            },
            data
          })
        }
      })
      if (window.history.length > 1) {
        this.$router.go(-1)
      } else {
        this.$router.push({ name: 'home' })
      }
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
        if (!breastFeedingLogs.length) {
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
.fixed {
  position: fixed
}
</style>
