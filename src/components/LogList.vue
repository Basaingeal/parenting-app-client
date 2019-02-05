<template>
  <v-container>
    <v-timeline
      :dense="dense"
    >
      <template #default>
        <template v-for="group in logsGroupedByDates">
          <v-timeline-item
            :key="group[0]"
            hide-dot
          >
            <span class="subheading font-weight-light">
              {{ group[0] }}
            </span>
          </v-timeline-item>
          <template v-for="log in group[1]">
            <breast-feeding-time-line-item
              v-if="log.__typename === 'BreastFeedingLog'"
              :key="log.id"
              :log="log"
              :child-first-name="childFirstName"
              :dense="dense"
            />
          </template>
        </template>
      </template>
    </v-timeline>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { differenceInWords, toMaterialDate } from '@/services/DateFilters'
import { parseISO, isSameDay, subDays, format } from 'date-fns'
import BreastFeedingTimeLineItem from '@/components/timelineItems/BreastFeedingTimeLineItem.vue'

export default {
  name: 'LogList',
  components: {
    BreastFeedingTimeLineItem
  },
  filters: {
    differenceInWords,
    toMaterialDate
  },
  props: {
    childFirstName: {
      type: String,
      required: true,
      default: ''
    },
    logs: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  computed: {
    ...mapGetters(['now']),
    sortedLogs () {
      const logsClone = [...this.logs]
      logsClone.sort((a, b) => new Date(b.startTime || b.dateAdded) - new Date(a.startTime || a.dateAdded))
      return logsClone
    },
    todayLogs () {
      return this.sortedLogs.filter(l => isSameDay(parseISO(l.startTime || l.dateAdded), this.now))
    },
    yesterdayLogs () {
      return this.sortedLogs.filter(l => isSameDay(parseISO(l.startTime || l.dateAdded), subDays(this.now, 1)))
    },
    otherLogs () {
      return this.sortedLogs.filter(l => !this.todayLogs.includes(l) && !this.yesterdayLogs.includes(l))
    },
    logsGroupedByDates () {
      const grouped = new Map()
      this.sortedLogs.forEach(log => {
        const logStartDate = parseISO(log.startTime || log.dateAdded)
        const label = toMaterialDate(format(logStartDate, 'yyy-MM-dd'), this.now)

        if (!grouped.has(label)) {
          grouped.set(label, [])
        }
        grouped.get(label).push(log)
      })

      return Array.from(grouped)
    },
    dense () {
      return this.$vuetify.breakpoint.smAndDown
    }
  }
}
</script>

<style>

</style>
