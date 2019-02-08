<template>
  <v-container fill-height>
    <v-layout fill-height>
      <v-flex shrink>
        <v-card>
          <v-card-text>
            Authenticating
          </v-card-text>
          <v-responsive>
            <v-progress-linear
              indeterminate
              color="primary"
            />
          </v-responsive>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'
import GET_USER_PROFILE from '@/graphql/GetUserProfile.gql'
import CREATE_USER_PROFILE from '@/graphql/CreateUserProfile.gql'
export default {
  name: 'LoginCallback',
  mounted () {
    this.$nextTick(async () => {
      await this.handleAuthentication()

      const { data: { userProfile } } = await this.$apollo.query({
        query: GET_USER_PROFILE
      })

      const preferredUnitSystem = this.getDefaultUnitSystem()

      if (!userProfile) {
        this.$apollo.mutate({
          mutation: CREATE_USER_PROFILE,
          variables: {
            userProfile: {
              preferredUnitSystem
            }
          },
          update (cache, { data: { createUserProfile } }) {
            const data = cache.readQuery({
              query: GET_USER_PROFILE
            })
            data.userProfile = createUserProfile
            cache.writeQuery({
              query: GET_USER_PROFILE,
              data
            })
          }
        })
      }

      this.$router.push({ name: 'home' })
    })
  },
  methods: {
    ...mapActions(['handleAuthentication']),
    getDefaultUnitSystem () {
      const language = window.navigator.language.toLowerCase()
      const imperialCodes = ['en-us', 'my']
      return imperialCodes.includes(language) ? 'IMPERIAL' : 'METRIC'
    }
  }
}
</script>

<style>

</style>
