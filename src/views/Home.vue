<template>
  <log-list />
</template>

<script>
// @ is an alias to /src
import LogList from '@/components/LogList.vue'
import GET_CHILDREN from '@/graphql/GetChildren.gql'

export default {
  name: 'Home',
  components: {
    LogList
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
