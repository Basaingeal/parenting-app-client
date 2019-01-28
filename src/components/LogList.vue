<template>
  <v-list>
    <v-list-tile
      v-for="log in logs"
      :key="log.id"
    >
      <v-list-tile-content>
        <v-list-tile-title>{{ log.__typename }}: {{ log.startTime }}</v-list-tile-title>
      </v-list-tile-content>
    </v-list-tile>
  </v-list>
</template>

<script>
import GET_CHILD_WITH_EVERYTHING from '@/graphql/GetChildWithEverything.gql'
import { mapGetters } from 'vuex'

export default {
  name: 'LogList',
  computed: {
    ...mapGetters(['currentChildId'])
  },
  apollo: {
    logs: {
      query: GET_CHILD_WITH_EVERYTHING,
      variables () {
        return {
          id: this.currentChildId
        }
      },
      update (data) {
        return data.child.logs
      }
    }
  }
}
</script>

<style>

</style>
