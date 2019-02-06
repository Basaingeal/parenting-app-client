<template>
  <v-container>
    <v-timeline
      :dense="dense"
    >
      <template #default>
        <v-slide-y-transition
          group
          leave-absolute
        >
          <template v-for="group in logsGroupedByDates">
            <v-timeline-item
              :key="group[0]"
              hide-dot
            >
              <span class="subheading font-weight-light">
                {{ group[0] }}
              </span>
            </v-timeline-item>
            <v-slide-y-transition
              :key="group[0] + ' transition'"
              group
              leave-absolute
            >
              <template v-for="log in group[1]">
                <breast-feeding-timeline-item
                  v-if="log.__typename === 'BreastFeedingLog'"
                  :key="log.id"
                  :log="log"
                  :child-first-name="childFirstName"
                  :dense="dense"
                />
              </template>
            </v-slide-y-transition>
          </template>
        </v-slide-y-transition>
      </template>
    </v-timeline>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { differenceInWords, toMaterialDate } from '@/services/DateFilters'
import { parseISO, isSameDay, subDays, format } from 'date-fns'
import BreastFeedingTimelineItem from '@/components/timelineItems/BreastFeedingTimelineItem.vue'

export default {
  name: 'LogList',
  components: {
    BreastFeedingTimelineItem
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
