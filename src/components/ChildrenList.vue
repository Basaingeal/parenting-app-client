<template>
  <div class="children-list">
    <div
      v-for="child in children"
      :key="child.id"
      class="child"
    >
      <p>{{ child.firstName }}</p>
      <p>{{ child.lastName }}</p>
    </div>
  </div>
</template>

<script>
import GET_CHILDREN from '@/graphql/GetChildren.gql'
export default {
  name: 'ChildrenList',
  data () {
    return {
    }
  },
  apollo: {
    children: GET_CHILDREN
  }
}
</script>

<style>

</style>
