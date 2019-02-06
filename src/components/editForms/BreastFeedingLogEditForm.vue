<template>
  <v-form
    ref="bfEditForm"
    v-model="valid"
  >
    <v-container>
      <v-layout
        row
        wrap
      >
        <v-flex
          xs12
          sm6
        >
          <v-select
            v-model="leftDuration"
            :items="minuteSelectItems"
            outline
            :color="logThemes.breastFeedingLog.color"
            label="Left Duration"
            :rules="[durationRequiredRule]"
          />
        </v-flex>
        <v-flex
          xs12
          sm6
        >
          <v-select
            v-model="rightDuration"
            :items="minuteSelectItems"
            outline
            :color="logThemes.breastFeedingLog.color"
            label="Right Duration"
            :rules="[durationRequiredRule]"
          />
        </v-flex>
        <v-flex xs12>
          <v-btn
            block
            :color="logThemes.breastFeedingLog.color"
            @click="saveLog"
          >
            Save
          </v-btn>
        </v-flex>
      </v-layout>
    </v-container>
  </v-form>
</template>

<script>
import logThemes from '@/constants/logThemes'
import { mapGetters } from 'vuex'

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
      logThemes,
      leftDuration: Math.round(this.log.leftBreastDuration / 60) * 60,
      rightDuration: Math.round(this.log.rightBreastDuration / 60) * 60
    }
  },
  computed: {
    ...mapGetters(['currentChildId']),
    minuteSelectItems () {
      return [...Array(120).keys()].map(i => ({
        text: i + ' minutes',
        value: i * 60
      }))
    },
    formData () {
      const { feedingType, __typename, dateAdded, ...onlyFormData } = this.log
      return {
        ...onlyFormData,
        childId: this.currentChildId,
        leftBreastDuration: this.leftDuration,
        rightBreastDuration: this.rightDuration
      }
    }
  },
  methods: {
    durationRequiredRule (v) {
      return (!!this.leftDuration || !!this.rightDuration) || 'Some time on at least one side is required.'
    },
    saveLog () {
      this.$refs.bfEditForm.validate()
      if (this.valid) {
        this.$emit('formSubmit', this.formData)
      }
    }
  }
}
</script>

<style>

</style>
