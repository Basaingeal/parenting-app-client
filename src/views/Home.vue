<template>
  <v-container>
    <home-navigator />
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
        <log-list
          v-if="child.logs.length"
          :child-first-name="child.firstName"
          :logs="child.logs"
        />
      </div>
    </v-fade-transition>

    <home-speed-dial />
  </v-container>
</template>

<script>
import LogList from '@/components/LogList.vue'
import HomeNavigator from '@/components/HomeNavigator.vue'
import HomeSpeedDial from '@/components/HomeSpeedDial.vue'
import GET_CHILDREN from '@/graphql/GetChildren.gql'
import GET_CHILD_WITH_EVERYTHING from '@/graphql/GetChildWithEverything.gql'
import { mapGetters } from 'vuex'
import { BulletListLoader } from 'vue-content-loader'

export default {
  name: 'Home',
  components: {
    LogList,
    HomeNavigator,
    HomeSpeedDial,
    BulletListLoader
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
