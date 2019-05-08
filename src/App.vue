<template>
  <v-app style="backgroundColor: #EDE7F6" :class="{darkened : !isAuthenticated}">
    <Navbar v-if="['Login', 'Register'].indexOf($route.name) == -1"/>
    <v-content class="mx-3 mb-4 mt-1">
      <router-view></router-view>
    </v-content>
    <Footer></Footer>

  </v-app>
</template>

<script>
  import Navbar from '@/components/UI/Navbar'
  import Footer from '@/components/UI/Footer'
  import { mapState, mapGetters } from 'vuex'

  export default {
    name: 'App',
    components: {
      Navbar,
      Footer
    },
    data () {
      return {
        //
      }
    },
    computed: {
      ...mapGetters(['isAuthenticated']),
    }
  }
</script>
<style>
  .radius20{
    border-radius: 20px;
  }
</style>
