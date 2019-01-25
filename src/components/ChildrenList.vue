<template>
  <v-list>
    <v-list-tile
      v-for="child in children"
      :key="child.id"
      avatar
      :disabled="child.id === currentChild.id"
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
export default {
  name: 'ChildrenList',
  computed: {
    ...mapGetters(['children', 'currentChild'])
  },
  methods: {
    ...mapActions(['setCurrentChild'])
  }
}
</script>

<style>

</style>
