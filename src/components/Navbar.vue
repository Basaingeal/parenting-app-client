<template>
  <nav class="navbar navbar-dark bg-dark">
    <a
      href="#"
      class="navbar-brand"
    >
      Parenting App
    </a>
    <ul class="navbar-nav ml-auto">
      <li class="nav-item">
        <button
          v-if="!authenticated"
          class="btn btn-primary"
          @click="login()"
        >
          Sign In
        </button>
        <button
          v-if="authenticated"
          class="btn btn-primary"
          @click="logout()"
        >
          Sign Out
        </button>
      </li>
    </ul>
  </nav>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'Navbar',
  computed: {
    ...mapGetters(['authenticated'])
  },
  methods: {
    ...mapActions(['login', 'logout'])
  }
}
</script>
