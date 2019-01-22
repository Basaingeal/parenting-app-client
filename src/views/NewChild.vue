<template>
  <v-container fill-height>
    <v-layout
      column
      align-start
      fill-height
      :class="{'pt-5': $vuetify.breakpoint.mdAndUp, 'pl-5': $vuetify.breakpoint.mdAndUp}"
    >
      <v-flex
        class="display-1 mb-2 font-weight-regular"
        shrink
      >
        Add a new child
      </v-flex>
      <v-flex
        shrink
        class="mb-2 font-weight-regular"
      >
        Enter some information about your child, so that we can begin tracking {{ pronoun }} details.
      </v-flex>
      <v-flex shrink>
        <add-child-form
          @childAdded="$router.push({name: 'home'})"
          @genderChanged="updateGender"
        />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import AddChildForm from '@/components/AddChildForm'

export default {
  components: {
    AddChildForm
  },
  data () {
    return {
      pronoun: 'their'
    }
  },
  methods: {
    updateGender (newGender) {
      newGender === 'MALE' ? this.pronoun = 'his' : this.pronoun = 'her'
    }
  }
}
</script>

<style>

</style>
