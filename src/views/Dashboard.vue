<template>
  <div>
    <v-container>
    <v-breadcrumbs :items="items">
      <template v-slot:divider>
        <v-icon>chevron_right</v-icon>
      </template>
    </v-breadcrumbs>
  </v-container>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        items: [
          {
           text: 'Dashboard',
           to: { name: 'dashboard' }
          }
           
        ]
      }
    }
  }
</script>