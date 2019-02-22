<template>
  <v-container>
    <v-timeline
      :dense="dense"
    >
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
              <bottle-feeding-timeline-item
                v-if="log.__typename === 'BottleFeedingLog'"
                :key="log.id"
                :log="log"
                :child-first-name="childFirstName"
                :dense="dense"
                :units="units"
              />
            </template>
          </v-slide-y-transition>
        </template>
      </v-slide-y-transition>
    </v-timeline>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { differenceInWords, toMaterialDate } from '@/services/DateFilters'
import { parseISO, isSameDay, subDays, format } from 'date-fns/fp'
import BreastFeedingTimelineItem
  from '@/components/timelineItems/BreastFeedingTimelineItem.vue'
import BottleFeedingTimelineItem
  from '@/components/timelineItems/BottleFeedingTimelineItem.vue'
export default {
  name: 'LogList',
  components: {
    BreastFeedingTimelineItem,
    BottleFeedingTimelineItem
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
    },
    units: {
      type: String,
      required: false,
      default: 'METRIC'
    }
  },
  computed: {
    ...mapGetters(['now']),
    sortedLogs () {
      const logsClone = [...this.logs]
      logsClone.sort((a, b) => {
        const bDate = new Date(b.startTime || b.dateAdded)
        const aDate = new Date(a.startTime || a.dateAdded)
        return bDate - aDate
      })
      return logsClone
    },
    todayLogs () {
      return this.sortedLogs
        .filter(l => isSameDay(this.now)(parseISO(l.startTime || l.dateAdded)))
    },
    yesterdayLogs () {
      return this.sortedLogs
        .filter(l =>
          isSameDay(parseISO(l.startTime || l.dateAdded))(subDays(1)(this.now)))
    },
    otherLogs () {
      return this.sortedLogs
        .filter(l => !this.todayLogs.includes(l) &&
         !this.yesterdayLogs.includes(l))
    },
    logsGroupedByDates () {
      const grouped = new Map()
      this.sortedLogs.forEach(log => {
        const logStartDate = parseISO(log.startTime || log.dateAdded)
        const label =
          toMaterialDate(format('yyy-MM-dd')(logStartDate), this.now)

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
