<template>
  <v-container>
    <top-navigator :routes="navigatorRoutes" />
    <v-fade-transition>
      <div v-if="!child">
        <timeline-loader
          v-for="index in 10"
          :key="index"
        />
      </div>
    </v-fade-transition>
    <v-fade-transition>
      <div v-if="validCurrentChildId && child">
        <div v-if="!child.logs.length">
          <v-container
            fill-height
            style="min-height:50vh"
          >
            <v-layout
              align-center
              justify-center
            >
              <v-flex
                class="ma-auto"
                shrink
              >
                <span class="font-weight-thin display-1">
                  No Logs Yet
                </span>
              </v-flex>
            </v-layout>
          </v-container>
        </div>
        <v-fade-transition mode="out-in">
          <log-list
            v-if="child.logs.length"
            :child-first-name="child.firstName"
            :logs="child.logs"
          />
        </v-fade-transition>
      </div>
    </v-fade-transition>

    <home-speed-dial />
  </v-container>
</template>

<script>
import LogList from '@/components/LogList.vue'
import HomeSpeedDial from '@/components/HomeSpeedDial.vue'
import TopNavigator from '@/components/TopNavigator.vue'
import GET_CHILDREN from '@/graphql/GetChildren.gql'
import GET_CHILD_WITH_EVERYTHING from '@/graphql/GetChildWithEverything.gql'
import { mapGetters } from 'vuex'
import TimelineLoader from '@/components/TimelineLoader'
import logThemes from '@/constants/logThemes'

export default {
  name: 'Home',
  components: {
    LogList,
    HomeSpeedDial,
    TimelineLoader,
    TopNavigator
  },
  data () {
    return {
      navigatorRoutes: [
        {
          label: 'Feeding',
          color: logThemes.breastFeedingLog.color,
          to: { name: 'feeding' }
        },
        {
          label: 'Diaper',
          color: logThemes.diaperLog.color,
          to: { name: 'diaper' }
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['currentChildId']),
    validCurrentChildId () {
      return this.children && this.children.find(c => c.id === this.currentChildId)
    }
  },
  apollo: {
    children: {
      query: GET_CHILDREN,
      result (ApolloQueryResult, key) {
        if (ApolloQueryResult.data.children.length === 0) {
          this.$router.push({ name: 'newchild' })
        }
      }
    },
    child: {
      query: GET_CHILD_WITH_EVERYTHING,
      variables () {
        return {
          id: this.currentChildId
        }
      },
      update (data) {
        return data.child
      }
    }
  }
}
</script>
