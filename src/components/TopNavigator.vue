<template>
  <v-card>
    <v-card-actions>
      <v-container
        grid-list-lg
      >
        <v-layout
          row
          class="scroll-x"
        >
          <v-flex
            v-for="(route, index) in routes"
            :key="index"
            shrink
          >
            <v-btn
              :color="route.color"
              outline
              rounded
              small
              :to="route.to"
            >
              <v-icon
                v-if="route.icon"
                small
                class="mr-2"
              >
                {{ route.icon }}
              </v-icon>
              {{ route.label }}
            </v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-actions>
  </v-card>
</template>

<script>
import logThemes from '@/constants/logThemes'
export default {
  name: 'TopNavigator',
  props: {
    routes: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  data () {
    return {
      logThemes
    }
  }
}
</script>

<style scoped>
.scroll-x {
  overflow-x: auto;
}
/* .scroll-x::-webkit-scrollbar {
  display: none;
} */
</style>
