<template>
  <v-toolbar app>
    <v-toolbar-title>
      <v-layout>
        <v-flex>
          <v-img
            :src="require('@/assets/logo.png')"
            class="my-auto"
            height="24"
            width="24"
          />
        </v-flex>
        <v-flex class="ml-1">
          <span class="font-weight-regular title">
            Nursry.APP
          </span>
        </v-flex>
      </v-layout>
    </v-toolbar-title>
    <v-spacer />
    <v-toolbar-items>
      <v-menu
        class="mr-2"
        offset-y
        left
        nudge-bottom="12"
        open-on-hover
        transition="slide-y-transition"
      >
        <v-btn
          slot="activator"
          icon
        >
          <v-icon
            v-text="'$vuetify.icons.change'"
          />
        </v-btn>
        <children-list />
      </v-menu>
      <v-hover v-if="authenticated">
        <v-menu
          slot-scope="{ hover }"
          offset-y
          left
          nudge-bottom="12"
          transition="slide-y-transition"
        >
          <v-avatar
            slot="activator"
            size="40"
            class="my-auto"
            :class="`elevation-${hover ? 12 : 2}`"
          >
            <v-img
              :src="profileImgSource"
              alt="Profile Image"
            />
          </v-avatar>
          <the-account-card />
        </v-menu>
      </v-hover>

      <v-btn
        v-if="!authenticated"
        @click="login()"
      >
        Sign in
      </v-btn>
      <!-- <v-btn
        v-if="authenticated"
        @click="fullLogout()"
      >
        Sign out
      </v-btn> -->
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import TheAccountCard from './TheAccountCard'
import ChildrenList from './ChildrenList'

export default {
  name: 'TheNavbar',
  components: {
    TheAccountCard,
    ChildrenList
  },
  computed: {
    ...mapGetters(['authenticated', 'profileImgSource', 'childrenCount'])
  },
  methods: {
    ...mapActions(['login', 'fullLogout'])
  }
}
</script>
