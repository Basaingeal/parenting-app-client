<template>
  <v-list>
    <v-list-tile
      v-for="child in children"
      :key="child.id"
      avatar
      :disabled="child.id === currentChildId"
      @click="setCurrentChild(child.id)"
    >
      <v-list-tile-avatar>
        <v-img
          v-if="child.imageAdded"
          :src="child.src"
        />
      </v-list-tile-avatar>
      <v-list-tile-content>
        <v-list-tile-title>{{ child.firstName }} {{ child.lastName }}</v-list-tile-title>
      </v-list-tile-content>
    </v-list-tile>
    <v-list-tile
      avatar
      to="newchild"
    >
      <v-list-tile-avatar>
        <v-icon
          medium
        >
          fas fa-plus
        </v-icon>
      </v-list-tile-avatar>
      <v-list-tile-content>
        <v-list-tile-title>New Child</v-list-tile-title>
      </v-list-tile-content>
    </v-list-tile>
  </v-list>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import GET_CHILDREN from '@/graphql/GetChildren.gql'
export default {
  name: 'ChildrenList',
  computed: {
    ...mapGetters(['currentChildId', 'canUseWebP'])
  },
  methods: {
    ...mapActions(['setCurrentChild'])
  },
  apollo: {
    children: {
      query: GET_CHILDREN,
      update (data) {
        data.children = data.children.map(child => {
          const pngPath = this.canUseWebP ? '' : 'png/'
          child.src = `${process.env.VUE_APP_SERVER}childImage/${pngPath}${child.id}`
          return child
        })
        return data.children
      }
    }
  }
}
</script>

<style>

</style>
