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
      this.fetchPatients(this.patientPagination.current_page)
      this.fetchAllergies()
      this.fetchConditionTypes()
      this.fetchFamilyRelations()
      this.fetchMaritalStatuses()
    },
    methods: {
      ...mapActions([
        'fetchPatients',
        'fetchAllergies',
        'fetchConditionTypes',
        'fetchFamilyRelations',
        'fetchMaritalStatuses'
      ]),
    },
    computed: mapGetters(['patientPagination'])
  }
</script>
