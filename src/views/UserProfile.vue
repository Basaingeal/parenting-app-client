<template>
  <v-container>
    <v-card width="100%">
      <v-card-text>
        <v-layout
          row
          wrap
        >
          <v-flex
            shrink
            :class="{ 'mx-auto': $vuetify.breakpoint.xs, 'mb-4': $vuetify.breakpoint.xs }"
          >
            <v-avatar :size="$vuetify.breakpoint.smAndUp ? 192 : 96">
              <v-img
                :src="profileImgSource"
                alt="Profile Image"
              />
            </v-avatar>
          </v-flex>
          <v-flex
            grow
            :class="{'ml-5': $vuetify.breakpoint.smAndUp}"
          >
            <v-layout column>
              <v-flex grow>
                <v-layout
                  row
                  wrap
                  fill-height
                >
                  <v-flex
                    xs12
                    sm3
                  >
                    <v-select
                      v-model="preferredUnitSystem"
                      :items="unitPicklistItems"
                      label="Preferred Unit System"
                      outline
                    />
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex
                    shrink
                    :class="{ 'mx-auto': $vuetify.breakpoint.xs, 'ml-auto': $vuetify.breakpoint.smAndUp }"
                  >
                    <v-btn
                      color="primary"
                      @click="saveUserProfile"
                    >
                      Save
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import GET_USER_PROFILE from '@/graphql/GetUserProfile.gql'
import UPDATE_USER_PROFILE from '@/graphql/UpdateUserProfile.gql'
export default {
  name: 'UserProfile',
  data () {
    return {
      preferredUnitSystem: null,
      unitPicklistItems: [
        {
          text: 'Imperial',
          value: 'IMPERIAL'
        },
        {
          text: 'Metric',
          value: 'METRIC'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['profileImgSource'])
  },
  methods: {
    async saveUserProfile () {
      await this.$apollo.mutate({
        mutation: UPDATE_USER_PROFILE,
        variables: {
          userProfile: {
            id: this.userProfile.id,
            preferredUnitSystem: this.preferredUnitSystem
          }
        }
      })

      if (window.history.length > 1) {
        this.$router.go(-1)
      } else {
        this.$router.push({ name: 'home' })
      }
    }
  },
  apollo: {
    userProfile: {
      query: GET_USER_PROFILE,
      result (ApolloQueryResult, key) {
        this.preferredUnitSystem = ApolloQueryResult.data.userProfile.preferredUnitSystem
      }
    }
  }
}
</script>

<style>

</style>
