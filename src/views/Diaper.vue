<template>
  <div>
    <top-navigator :routes="navigatorRoutes" />
    <v-fade-transition>
      <div v-if="!child">
        <bullet-list-loader
          v-for="index in 10"
          :key="index"
        />
      </div>
    </v-fade-transition>
    <v-fade-transition>
      <div v-if="validCurrentChildId && child">
        <div v-if="!diaperLogs.length">
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
        <log-list
          v-if="diaperLogs.length"
          :child-first-name="child.firstName"
          :logs="diaperLogs"
        />
      </div>
    </v-fade-transition>
  </div>
</template>

<script>
import LogList from '@/components/LogList.vue'
import GET_CHILDREN from '@/graphql/GetChildren.gql'
import GET_CHILD_WITH_EVERYTHING from '@/graphql/GetChildWithEverything.gql'
import { mapGetters } from 'vuex'
import { BulletListLoader } from 'vue-content-loader'
import TopNavigator from '@/components/TopNavigator.vue'
import logThemes from '@/constants/logThemes'

export default {
  name: 'Home',
  components: {
    LogList,
    BulletListLoader,
    TopNavigator
  },
  data () {
    return {
      navigatorRoutes: [{
        label: 'Diaper Change',
        color: logThemes.diaperLog.color,
        to: { name: 'newdiaperlog' },
        icon: 'fas fa-plus'
      }]
    }
  },
  computed: {
    ...mapGetters(['currentChildId']),
    validCurrentChildId () {
      return this.children && this.children.find(c => c.id === this.currentChildId)
    },
    diaperLogs () {
      if (!this.child) {
        return []
      }
      return this.child.logs.filter(l => l.__typename === 'DiaperLog')
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
