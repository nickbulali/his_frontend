<template>
  <v-progress-linear
    :indeterminate="query"
    :query="true"
    v-model="value"
    :active="show"
  ></v-progress-linear>
</template>

<script>
  export default {
    name: 'Loading',
    data () {
      return {
        value: 0,
        query: false,
        show: true,
        interval: 0
      }
    },

    mounted () {
      this.queryAndIndeterminate()
    },

    beforeDestroy () {
      clearInterval(this.interval)
    },

    methods: {
      queryAndIndeterminate () {
        this.query = true
        this.show = true
        this.value = 0
        this.query = false

        this.interval = setInterval(() => {
          if (this.value === 100) {
            clearInterval(this.interval)
            this.show = false
            return setTimeout(this.queryAndIndeterminate, 2000)
          }
          this.value += 25
        }, 1000)
      }
    }
  }
</script>