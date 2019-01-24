<template>
  <div class="children-list">
    <div
      v-for="child in children"
      :key="child.id"
      class="child"
    >
      <p>{{ child.firstName }}</p>
      <p>{{ child.lastName }}</p>
      <v-avatar size="48">
        <v-img
          height="48"
          width="48"
          :src="child.src"
        />
      </v-avatar>
    </div>
  </div>
</template>

<script>
import GET_CHILDREN from '@/graphql/GetChildren.gql'
import { isWebPSupported } from '@/services/SupportManager'
export default {
  name: 'ChildrenList',
  data () {
    return {
      webPSupport: false,
      children: []
    }
  },
  async created () {
    this.webPSupport = await isWebPSupported()
    const childrenResult = await this.$apollo.query({
      query: GET_CHILDREN
    })
    for (let child of childrenResult.data.children) {
      child.src = this.webPSupport
        ? `${process.env.VUE_APP_SERVER}childImage/${child.id}`
        : `${process.env.VUE_APP_SERVER}childImage/png/${child.id}`
    }
    this.children = childrenResult.data.children
  }
}
</script>

<style>

</style>
