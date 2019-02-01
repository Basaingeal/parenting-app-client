<template>
  <div>
    <log-list v-if="validCurrentChildId" />
    <v-speed-dial
      v-model="fab"
      transition="slide-y-reverse-transition"
      bottom
      right
    >
      <v-btn
        slot="activator"
        v-model="fab"
        color="primary"
        dark
        fab
      >
        <v-icon>fas fa-plus</v-icon>
        <v-icon>fas fa-chevron-down</v-icon>
      </v-btn>
      <v-btn
        fab
        dark
        small
        color="light-blue"
        :to="{ name: 'newbreastfeedinglog'}"
      >
        <v-icon>
          fas fa-utensils
        </v-icon>
      </v-btn>
    </v-speed-dial>
  </div>
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
  data () {
    return {
      fab: false
    }
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

<style scoped>
.v-speed-dial {
  position: absolute;
}

.v-btn--floating {
  position: relative;
}
.fas {
  display: flex
}
</style>
