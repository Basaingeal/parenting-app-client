<template>
  <v-container
    fluid
  >
    <log-list v-if="validCurrentChildId" />

    <v-speed-dial
      v-model="fab"
      transition="slide-y-reverse-transition"
      bottom
      right
      app
    >
      <v-btn
        slot="activator"
        v-model="fab"
        :light="!fab"
        :dark="fab"
        :color="fab ? 'primary' : ''"
        fab
      >
        <v-icon>fas fa-plus</v-icon>
        <v-icon>fas fa-chevron-down</v-icon>
      </v-btn>
      <v-tooltip
        color="light-blue"
        left
      >
        <v-btn
          slot="activator"
          fab
          dark
          small
          color="light-blue"
          :to="{ name: 'newbreastfeedinglog'}"
        >
          🤱
        </v-btn>
        <span>Add Breast-feeding Log</span>
      </v-tooltip>
      <v-tooltip
        color="light-blue"
        left
      >
        <v-btn
          slot="activator"
          fab
          dark
          small
          color="light-blue"
          :to="{ name: 'newbreastfeedinglog'}"
        >
          🍼
        </v-btn>
        <span>Add Bottle-feeding Log</span>
      </v-tooltip>
      <v-tooltip
        color="light-green"
        left
      >
        <v-btn
          slot="activator"
          fab
          dark
          small
          color="light-green"
          :to="{ name: 'newbreastfeedinglog'}"
        >
          🧷
        </v-btn>
        <span>Add Diaper Log</span>
      </v-tooltip>
    </v-speed-dial>
  </v-container>
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
