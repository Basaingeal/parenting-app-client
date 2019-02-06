<template>
  <v-timeline-item
    :color="color"
    fill-dot
    :large="!dense"
  >
    <template #icon>
      <slot name="icon" />
    </template>
    <template #opposite>
      <slot name="opposite" />
    </template>
    <v-card raised>
      <v-card-text>
        <slot />
      </v-card-text>
      <v-card-actions>
        <v-layout row>
          <v-flex
            shrink
            class="my-auto ml-2"
          >
            <span class="caption font-weight-light">
              <slot name="timestamp" />
            </span>
          </v-flex>
          <v-flex
            shrink
            class="ml-auto"
          >
            <v-btn
              flat
              icon
              color="#757575"
              @click="$emit('openEdit')"
            >
              <v-icon>fas fa-edit</v-icon>
            </v-btn>
          </v-flex>
          <v-flex
            shrink
          >
            <v-btn
              flat
              icon
              color="#757575"
              @click="$emit('openDelete')"
            >
              <v-icon>fas fa-trash-alt</v-icon>
            </v-btn>
          </v-flex>
        </v-layout>
      </v-card-actions>
      <v-expand-transition>
        <div v-if="edit">
          <slot name="edit" />
        </div>
      </v-expand-transition>
    </v-card>
  </v-timeline-item>
</template>

<script>
export default {
  name: 'BaseTimelineItem',
  props: {
    color: {
      type: String,
      required: true
    },
    dense: {
      type: Boolean,
      required: false,
      default: false
    },
    edit: {
      type: Boolean,
      required: false,
      default: false
    }
  }
}
</script>

<style>

</style>
