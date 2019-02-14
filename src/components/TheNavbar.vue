<template>
  <v-toolbar
    app
  >
    <v-toolbar-title>
      <v-layout>
        <v-flex>
          <v-scale-transition mode="out-in">
            <the-back-button
              v-if="$route.name !== 'home' && $route.name !== 'welcome'"
            />

            <v-img
              v-else
              :src="require('@/assets/logo.png')"
              class="my-auto ml-2 mr-3"
              height="24"
              width="24"
            />
          </v-scale-transition>
        </v-flex>
        <v-flex
          class="ml-1 my-auto"
          shrink
          @click="scrollToTop"
        >
          <span
            class="font-weight-regular title"
          >
            Nursry.APP
          </span>
        </v-flex>
      </v-layout>
    </v-toolbar-title>
    <v-spacer />
    <v-toolbar-items>
      <v-menu
        v-if="authenticated"
        class="mr-3"
        offset-y
        left
        nudge-bottom="12"
        open-on-hover
        transition="slide-y-transition"
      >
        <template #activator="data">
          <v-btn
            icon
            v-on="data.on"
          >
            <v-icon
              small
            >
              fas fa-person-booth
            </v-icon>
          </v-btn>
        </template>

        <children-list />
      </v-menu>
      <v-hover
        v-if="authenticated"
      >
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
import TheBackButton from './TheBackButton'

export default {
  name: 'TheNavbar',
  components: {
    TheAccountCard,
    ChildrenList,
    TheBackButton
  },
  computed: {
    ...mapGetters(['authenticated', 'profileImgSource', 'childrenCount'])
  },
  methods: {
    ...mapActions(['login', 'fullLogout']),
    scrollToTop () {
      this.$vuetify.goTo(0, {
        easing: 'easeInOutCubic',
        duration: 500,
        offset: 0
      })
    }
  }
}
</script>
