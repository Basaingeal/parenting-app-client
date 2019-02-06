<template>
  <v-card>
    <v-card-text class="body-1">
      Are you sure you want to delete this log?
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn
        flat
        :color="color"
        @click="$emit('noDelete')"
      >
        No
      </v-btn>
      <v-btn
        flat
        :color="color"
        @click="deleteLog"
      >
        Yes
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import DELETE_LOG from '@/graphql/DeleteLog.gql'
import GET_CHILD_WITH_EVERYTHING from '@/graphql/GetChildWithEverything.gql'

export default {
  name: 'DeleteLogCard',
  props: {
    logId: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: false,
      default: 'black'
    }
  },
  computed: {
    ...mapGetters(['currentChildId'])
  },
  methods: {
    async deleteLog () {
      const currentChildId = this.currentChildId
      await this.$apollo.mutate({
        mutation: DELETE_LOG,
        variables: {
          logId: this.logId
        },
        update (cache, { data: { deleteLog } }) {
          const data = cache.readQuery({
            query: GET_CHILD_WITH_EVERYTHING,
            variables: {
              id: currentChildId
            }
          })
          data.child.logs = data.child.logs.filter(log => log.id !== deleteLog)
          cache.writeQuery({
            query: GET_CHILD_WITH_EVERYTHING,
            variables: {
              id: currentChildId
            },
            data
          })
        }
      })
      this.$emit('logDeleted')
    }
  }
}
</script>

<style>

</style>
