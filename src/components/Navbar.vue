<template>
  <b-navbar
    type="dark"
    variant="dark"
  >
    <router-link :to="{name: 'home'}">
      <b-navbar-brand>
        Parenting App
      </b-navbar-brand>
    </router-link>

    <b-img
      v-if="authenticated"
      :src="profileImgSource"
      rounded="circle"
      width="48"
      height="48"
      alt="Profile Image"
      class="my-1 ml-auto mr-3"
    />
    <b-navbar-nav>
      <b-nav-item v-if="!authenticated">
        <b-btn
          @click="login()"
        >
          Sign in
        </b-btn>
      </b-nav-item>
      <b-nav-item v-if="authenticated">
        <b-btn
          @click="fullLogout()"
        >
          Sign out
        </b-btn>
      </b-nav-item>
    </b-navbar-nav>
  </b-navbar>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'Navbar',
  computed: {
    ...mapGetters(['authenticated', 'profileImgSource'])
  },
  methods: {
    ...mapActions(['login', 'fullLogout'])
  }
}
</script>
