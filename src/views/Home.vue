<template>
  <div class="home">
    <img
      alt="Vue logo"
      src="../assets/logo.png"
    >
    <HelloWorld msg="Welcome to Your Vue.js App" />
    <children-list />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import ChildrenList from '@/components/ChildrenList.vue'

export default {
  name: 'Home',
  components: {
    HelloWorld,
    ChildrenList
  }
}
</script>
