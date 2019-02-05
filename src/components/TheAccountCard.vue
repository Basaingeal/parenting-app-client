<template>
  <v-card>
    <v-card-text>
      <v-layout fill-height>
        <v-flex class="mr-4">
          <v-avatar size="96">
            <v-img
              :src="profileImgSource"
              alt="Profile Image"
            />
          </v-avatar>
        </v-flex>
        <v-flex>
          <v-layout
            column
            fill-height
            align-start
          >
            <v-flex class="font-weight-bold body-1">
              {{ userProfile.name }}
            </v-flex>
            <v-flex class="font-weight-regular body-1">
              {{ userProfile.email }}
            </v-flex>
            <v-flex class="mt-auto">
              <v-btn
                color="info"
                class="ml-0"
              >
                View Profile
              </v-btn>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-card-text>
    <v-card-actions>
      <v-btn
        flat
        color="red"
        class="ml-auto"
        @click="fullLogout"
      >
        Sign out
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'TheAccountCard',
  computed: {
    ...mapGetters(['profileImgSource', 'userProfile'])
  },
  methods: {
    ...mapActions(['fullLogout'])
  }
}
</script>

<style>

</style>
