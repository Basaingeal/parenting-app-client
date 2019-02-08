<template>
  <content-loader
    :height="160"
    :width="400"
    :speed="2"
    primary-color="#f3f3f3"
    secondary-color="#ecebeb"
  >
    <rect
      x="24"
      y="16"
      rx="5"
      ry="5"
      width="346"
      height="26"
    />
    <rect
      x="24"
      y="52"
      rx="5"
      ry="5"
      width="346"
      height="26.6"
    />
    <rect
      x="24"
      y="88"
      rx="5"
      ry="5"
      width="346"
      height="26.6"
    />
    <rect
      x="24"
      y="123"
      rx="5"
      ry="5"
      width="346"
      height="26.6"
    />
  </content-loader>
</template>

<script>
import { ContentLoader } from 'vue-content-loader'

export default {
  name: 'FormLoader',
  components: {
    ContentLoader
  }
}
</script>

<style>

</style>
