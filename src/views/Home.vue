<template>
  <div class="home">
    <img
      alt="Vue logo"
      src="../assets/logo.png"
    >
    <HelloWorld msg="Welcome to Your Vue.js App" />
    <dual-timer />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import DualTimer from '@/components/DualTimer.vue'

export default {
  name: 'Home',
  components: {
    HelloWorld,
    DualTimer
  }
}
</script>
