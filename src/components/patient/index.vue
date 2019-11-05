<template>
  <div class="invoice">
  	<v-snackbar
      v-model="snackbar"
      :color="color"
      :timeout="6000"
      :top="y === 'top'"
      >
        {{ message }}
    </v-snackbar>
		<v-layout justify-center row wrap mt-3>
			<p class="his_page_title">Patients</p>
		</v-layout>
  	<v-container class="">
			<v-text-field class="his_search" v-model="search" append-icon="search" label="Search" single-line v-on:keyup.enter="initialize" hide-details>
			</v-text-field>
  	</v-container>
<!--   	<v-container>
			<line-chart title="patients-by-month" :categories="genders" :stats="frequencyOfPatients.monthly" />
  	</v-container> -->
		<v-container class="my-2">
	    <v-layout row wrap>
	    	<v-flex sm12 md6 lg4>
		      <div class="his_card_new_patient pa-4">
		        <p class="his_card_main_heading">Register New Patient</p>
		        	<v-form
			            ref="form"
			            v-model="valid"
			            lazy-validation
			        >
				        <v-layout row wrap>
				        	<v-flex sm12 md12>
					          <v-text-field
					            label="Patient No."
					            :rules="inputRules"
					            v-model="newpatient.identifier"
					          ></v-text-field>
					        </v-flex>
					        <v-flex sm6 md6>
					          <v-text-field
					            label="Given Name"
					            :rules="inputRules"
					            v-model="newpatient.given_name"
					          ></v-text-field>
					        </v-flex>
					        <v-flex sm6 md6>
					          <v-text-field
					            label="Family Name"
					            :rules="inputRules"
					            v-model="newpatient.family_name"
					          ></v-text-field>
					        </v-flex>
					        <v-flex sm6 md6>
						        <v-select
						          :items="allMaritalStatuses"
						          v-model="newpatient.maritalstatus_id"
						          item-value="id"
						          item-text="display"
						          label="Marital Status"
						        ></v-select>
					      	</v-flex>
					      	<v-flex sm6 md6>
			                    <v-menu>
			                      <v-text-field
			                      	:rules="inputRules"
			                        :value="formattedDate"
			                        slot="activator"
			                        label="Date of Birth"
			                        >
			                      </v-text-field>
			                      <v-date-picker v-model="newpatient.birth_date"></v-date-picker>
			                    </v-menu>
			                </v-flex> 
					        <v-flex sm6 md6>
			                	Gender
				                <v-radio-group 
				                	v-model="newpatient.gender_id"
				                	row
				                  	>
				                  <v-radio label="Male" :value="1"></v-radio>
				                  <v-radio label="Female" :value="2"></v-radio>
				                </v-radio-group>
				            </v-flex>
				            
				        </v-layout>
				    </v-form>
		        <div class="his_card_footer">
		          <v-btn class="his_card_button white--text" small title="Edit" color="green" :loading="loading" :disabled="!valid" outline @click="save">
		            <v-icon left dark>add_circle</v-icon>
		            Add
		          </v-btn>
		        </div>
		      </div>
		    </v-flex>
		    <v-flex sm12 md3 lg4 v-for="(patient,index) in allPatients.data" :key="patient.id">
		      <div class="his_card">
		        <div class="his_card_top_right">
		        	<v-btn outline fab small color="red" @click="deletePatient(patient.id)">
		            	<v-icon dark>delete</v-icon>
		          	</v-btn>
		          <v-btn outline fab small title="View History" color="green" router :to="{ name: 'patientProfile', params: { id: patient.id } }">
		            <v-icon dark>visibility</v-icon>
		          </v-btn>
		        </div>
		        <p class="his_card_main_heading">{{ patient.name.given }} {{ patient.name.family }}</p>
		        <p class="his_card_small_text">{{ patient.gender.display }}</p>
		        <p class="his_card_title">Identifier</p>
		        <p class="his_card_description">{{ patient.identifier }}</p>
		        <p class="his_card_title">Date of Birth</p>
		        <p class="his_card_description">{{patient.birth_date}}</p>
		        <p class="his_card_title">Marital Status</p>
		        <p class="his_card_description">{{patient.marital_status.display}}</p>
		        <p class="his_card_title">Number of Tests</p>
		        <p class="his_card_description">!!number!!</p>
		        <p class="his_card_title">Number of Visits</p>
		        <p class="his_card_description">!!x visits!!</p>
		        <div class="his_card_footer">
		          <v-btn dark class="his_card_button" small title="Edit" color="green" outline @click="addToQueue(patient)">
		            <v-icon left dark>launch</v-icon>
		            New Visit
		          </v-btn>
		          <div class="his_card_footer_right">
		            <v-btn dark class="his_card_button" small title="Edit" color="blue" outline @click="requestTest(patient)">
			        	<v-icon left dark>add_circle</v-icon>
			            View Report
			        </v-btn>
		          </div>
		        </div>
		      </div>
		    </v-flex>
		    </v-layout>
		    <!-- <div v-if="length" class="text-xs-center">
		      <v-pagination
		        :length="length"
		        :total-visible="pagination.visible"
		        v-model="pagination.page"
		        @input="initialize"
		        circle>
		      </v-pagination>
		    </div> -->
  	</v-container>
  </div>
</template>

<script>
  import apiCall from '../../utils/api'
  import format from 'date-fns/format'
  import { EventBus } from './../../main.js'
  import {mapGetters, mapActions} from 'vuex'
  import Vue from 'vue'
  import LineChart from '@/components/statistics/lineChart.vue'

  export default {
		components: {
			LineChart,
		},
  	data () {
      return {
      	search: '',
        query: '',
        valid: true,
      	loading: false,
      	snackbar: false,
	    loadingDialog: {
	        loading: false,
	    	message: ""
	    },
	    patient: [],
	    marital: [],
	    
	    message:'',
	    y: 'top',
	    color: 'success',
	    pagination: {
	        page: 1,
	        per_page: 0,
	        total: 0,
	        visible: 10
	    },
	    newpatient: {
	    	identifier: '',
	    	given_name: '',
	    	family_name: '',
	    	gender_id: '',
	    	maritalstatus_id: '',
	    	birth_date: null
	    },
	    items: [
          {
           text: 'Dashboard',
           to: { name: 'dashboard' }
          },
          {
           text: 'Patients',
           to: { name: 'Patient' }
          }
           
        ],
	    defaultpatient: {
	    	identifier: ' ',
	    	given_name: ' ',
	    	family_name: ' ',
	    	gender_id: ' ',
	    	maritalstatus_id: ' ',
	    	birth_date: ' '
	    },
	    inputRules: [
          v => v.length >= !v  || 'Field is required'
        ],
	  }
  	},
  	created () {
      	
    },
    methods: {
    	...mapActions(['fetchPatients','addPatient', 'deletePatient']),
	      save () {
	        if(this.$refs.form.validate()){
	            this.loading = true
	            this.addPatient(this.newpatient);
	            this.loading = false
	            this.message = 'Patient Added Succesfully';
	            this.snackbar = true;
	            this.close()
	        }
	      },
	      close(){
	      	this.newpatient = this.defaultpatient
	      },
	      addToQueue(patient){
	      	apiCall({url: '/api/queue', data: patient, method: 'POST' })
	            .then(resp => {
	              console.log(resp)
	              this.message = 'Patient Sent to Queue Succesfully';
	              this.snackbar = true;
	            })
	            .catch(error => {
	              console.log(error.response)
	            })
	      }
    },
    computed: {
        formattedDate(){
        	return this.newpatient.birth_date ? format(this.newpatient.birth_date, 'Do MMM YYYY') : ''
    	},
    	/*length: function() {
	    	return Math.ceil(this.pagination.total / this.pagination.per_page);
	    },*/
	    ...mapGetters([
	    	'allPatients',
				'allMaritalStatuses',
				'frequencyOfPatients',
				'genders',
	    ]),
		},
		mounted(){
			this.fetchPatients()
			console.log("All Patients are", this.allPatients)
		}
  }
</script>