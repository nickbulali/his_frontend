<template>
  <div class="dashboard">
    
  	<v-container class="my-5">
  		<p>home</p>
  		
  	</v-container>

  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'

  export default {
    created(){
      this.fetchPatients()
      this.fetchAllergies()
      this.fetchConditionTypes()
      this.fetchFamilyRelations()
    },
    methods: {
      ...mapActions([
        'fetchPatients',
        'fetchAllergies',
        'fetchConditionTypes',
        'fetchFamilyRelations',
      ]),
    }
  }
</script>
