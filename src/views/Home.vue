<template>
  <log-list v-if="validCurrentChildId" />
</template>

<script>
// @ is an alias to /src
import LogList from '@/components/LogList.vue'
import GET_CHILDREN from '@/graphql/GetChildren.gql'
import { mapGetters } from 'vuex'

export default {
  name: 'Home',
  components: {
    LogList
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
    }
  }
}
</script>
