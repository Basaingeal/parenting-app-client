<template>
  <div id="app">
    <v-app>
      <the-navbar v-if="!$route.path.includes('auth/')" />
      <v-content>
        <v-container
          fill-height
        >
          <router-view />
        </v-container>
      </v-content>
    </v-app>
  </div>
</template>

<script>
import TheNavbar from '@/components/TheNavbar'
import GET_CHILDREN from '@/graphql/GetChildren.gql'

export default {
  components: {
    TheNavbar
  },
  async created () {
    if (this.$store.getters.authenticated) {
      this.$store.dispatch('scheduleRenewal')
      if (this.$store.state.userProfile == null) {
        this.$store.dispatch('refreshProfile')
      }

      if (!this.$store.getters.childrenCount) {
        this.$store.dispatch('setFetchingChildren', true)
        const result = await this.$apollo.query({
          query: GET_CHILDREN
        })
        const children = result.data.children
        this.$store.dispatch('setChildren', children)
        this.$store.dispatch('setFetchingChildren', false)
        if (!this.$store.getters.childrenCount) {
          this.$router.push({ name: 'newchild' })
        }
      }
    } else {
      this.$store.dispatch('logout')
    }
  }
}
</script>

<style lang="scss">
</style>
