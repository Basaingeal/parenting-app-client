<template>
  <add-bottle-feeding-log-form
    v-if="userProfile"
    :units="userProfile.preferredUnitSystem"
    @formSubmitted="submitLog"
  />
</template>

<script>
import GET_USER_PROFILE from '@/graphql/GetUserProfile.gql'
import CREATE_BOTTLE_FEEDING_LOG from '@/graphql/CreateBottleFeedingLog.gql'
import GET_CHILD_WITH_EVERYTHING from '@/graphql/GetChildWithEverything.gql'
import { mapGetters } from 'vuex'
import AddBottleFeedingLogForm from '@/components/AddBottleFeedingLogForm'

export default {
  name: 'NewBottleFeedingLog',
  components: {
    AddBottleFeedingLogForm
  },
  computed: {
    ...mapGetters(['currentChildId'])
  },
  methods: {
    async submitLog (formData) {
      const currentChildId = this.currentChildId
      await this.$apollo.mutate({
        mutation: CREATE_BOTTLE_FEEDING_LOG,
        variables: {
          log: {
            ...formData,
            childId: currentChildId
          }
        },
        update (cache, { data: { createBottleFeedingLog } }) {
          const data = cache.readQuery({
            query: GET_CHILD_WITH_EVERYTHING,
            variables: {
              id: currentChildId
            }
          })
          data.child.logs.push(createBottleFeedingLog)
          cache.writeQuery({
            query: GET_CHILD_WITH_EVERYTHING,
            variables: {
              id: currentChildId
            },
            data
          })
        }
      })
      if (window.history.length > 2) {
        this.$router.go(-1)
      } else {
        this.$router.push({ name: 'home' })
      }
    }
  },
  apollo: {
    userProfile: {
      query: GET_USER_PROFILE
    }
  }
}
</script>

<style>

</style>
