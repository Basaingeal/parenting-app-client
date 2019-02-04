<template>
  <v-container>
    <home-navigator />
    <log-list
      v-if="validCurrentChildId"
      :child-first-name="child.firstName"
      :logs="child.logs"
    />
    <home-speed-dial />
  </v-container>
</template>

<script>
// @ is an alias to /src
import LogList from '@/components/LogList.vue'
import HomeNavigator from '@/components/HomeNavigator.vue'
import HomeSpeedDial from '@/components/HomeSpeedDial.vue'
import GET_CHILDREN from '@/graphql/GetChildren.gql'
import GET_CHILD_WITH_EVERYTHING from '@/graphql/GetChildWithEverything.gql'
import { mapGetters } from 'vuex'

export default {
  name: 'Home',
  components: {
    LogList,
    HomeNavigator,
    HomeSpeedDial
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
