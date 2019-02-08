<template>
  <content-loader
    :height="160"
    :width="400"
    :speed="4"
    primary-color="#f3f3f3"
    secondary-color="#ecebeb"
  >
    <circle
      cx="34"
      cy="86"
      r="8"
    />
    <rect
      x="236.5"
      y="142.27"
      rx="0"
      ry="0"
      width="0"
      height="0"
    />
    <rect
      x="32.5"
      y="7.27"
      rx="0"
      ry="0"
      width="2"
      height="70"
    />
    <rect
      x="32.5"
      y="94.27"
      rx="0"
      ry="0"
      width="2"
      height="70"
    />
    <rect
      x="53.5"
      y="9.27"
      rx="0"
      ry="0"
      width="337"
      height="144"
    />
  </content-loader>
</template>

<script>
import { ContentLoader } from 'vue-content-loader'

export default {
  name: 'TimelineLoader',
  components: {
    ContentLoader
  }
}
</script>

<style>

</style>
