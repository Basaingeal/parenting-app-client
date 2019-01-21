<template>
  <v-toolbar app>
    <v-toolbar-title>
      <img
        src="../assets/logo.png"
        class="my-auto"
        height="24"
      >
      <span class="font-weight-regular title">
        Nursry.APP
      </span>
    </v-toolbar-title>
    <v-spacer />
    <v-toolbar-items>
      <v-menu
        v-if="authenticated"
        offset-y
        nudge-bottom="12"
      >
        <v-avatar
          slot="activator"
          size="40"
          class="my-auto"
        >
          <v-img
            :src="profileImgSource"
            alt="Profile Image"
          />
        </v-avatar>
        <the-account-card />
      </v-menu>

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

export default {
  name: 'TheNavbar',
  components: {
    TheAccountCard
  },
  computed: {
    ...mapGetters(['authenticated', 'profileImgSource'])
  },
  methods: {
    ...mapActions(['login', 'fullLogout'])
  }
}
</script>
