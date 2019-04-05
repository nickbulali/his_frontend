<template>
  <v-app>
    <Navbar v-if="['Login', 'Register'].indexOf($route.name) == -1"/>
      <v-content class="mx-4 mb-4 mt-1">
        <router-view></router-view>
      </v-content>
    <Footer></Footer>

  </v-app>
</template>

<script>
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

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
  }
}
</script>
