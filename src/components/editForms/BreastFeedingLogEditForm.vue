<template>
  <v-form v-model="valid">
    <v-container>
      <v-layout
        row
        wrap
      >
        <v-flex
          xs12
          xl6
        >
          <v-select
            v-model="leftDuration"
            :items="minuteSelectItems"
            outline
            color="light-blue"
            label="Left Duration"
            :rules="[durationRequiredRule]"
          />
        </v-flex>
        <v-flex
          xs12
          xl6
        >
          <v-select
            v-model="rightDuration"
            :items="minuteSelectItems"
            outline
            color="light-blue"
            label="Right Duration"
            :rules="[durationRequiredRule]"
          />
        </v-flex>
      </v-layout>
    </v-container>
  </v-form>
</template>

<script>
export default {
  name: 'BreastFeedingLogEditForm',
  props: {
    log: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      valid: true,
      leftDuration: Math.round(this.log.leftBreastDuration / 60) * 60,
      rightDuration: Math.round(this.log.rightBreastDuration / 60) * 60
    }
  },
  computed: {
    minuteSelectItems () {
      return [...Array(120).keys()].map(i => ({
        text: i + ' minutes',
        value: i * 60
      }))
    }
  },
  methods: {
    durationRequiredRule (v) {
      return (!!this.leftDuration || !!this.rightDuration) || 'Some time on at least one side is required.'
    }
  }
}
</script>

<style>

</style>
