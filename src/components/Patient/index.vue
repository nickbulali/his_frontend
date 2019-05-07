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
  	<v-container class="my-5">
  		<v-card-title>
	      <p class="his_page_title">
	        Patients
	      </p>
	      <v-spacer></v-spacer>
	      <v-text-field class="his_search" v-model="search" append-icon="search" label="Search" single-line v-on:keyup.enter="initialize" hide-details>
	      </v-text-field>
	    </v-card-title>
	    <v-layout row wrap>
	    	<v-flex sm12 md6 lg4>
		      <div class="his_card_new_patient">
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
						          :items="marital"
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
		          <v-btn class="his_card_button white--text" small title="Edit" color="green" :loading="loading" :disabled="!valid" round @click="save">
		            <v-icon left dark>add_circle</v-icon>
		            Add
		          </v-btn>
		        </div>
		      </div>
		    </v-flex>
		    <v-flex sm12 md6 lg4 v-for="(patient,index) in patient" :key="patient.id">
		      <div class="his_card">
		        <div class="his_card_top_right">
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
		          <v-btn dark class="his_card_button" small title="Edit" color="green" :loading="queueLoader" round @click="addToQueue(patient)">
		            <v-icon left dark>launch</v-icon>
		            New Visit
		          </v-btn>
		          <div class="his_card_footer_right">
		            <v-btn dark class="his_card_button" small title="Edit" color="blue" round @click="requestTest(patient)">
			        	<v-icon left dark>add_circle</v-icon>
			            View Report
			        </v-btn>
		          </div>
		        </div>
		      </div>
		    </v-flex>
		    </v-layout>
		    <div v-if="length" class="text-xs-center">
		      <v-pagination
		        :length="length"
		        :total-visible="pagination.visible"
		        v-model="pagination.page"
		        @input="initialize"
		        circle>
		      </v-pagination>
		    </div>
  	</v-container>
  </div>
</template>

<script>
  import apiCall from '../../utils/api'
  import format from 'date-fns/format'
  import { EventBus } from './../../main.js'
  import Vue from 'vue'

  export default {
  	data () {
      return {
      	search: '',
        query: '',
        valid: true,
      	loading: false,
      	snackbar: false,
      	queueLoader: false,
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
      this.initialize()
    },
    methods: {
   		loadingMethod(load, message="") {
        	this.loadingDialog.loading = load;
        	this.loadingDialog.message = message
      	},
      	initialize () {
	        this.loadingMethod(true, "Fetching All Patients")
	        this.query = 'page='+ this.pagination.page;
	        if (this.search != '') {
	            this.query = '&search='+this.search;
	        }
	        apiCall({url: '/api/patient?' + this.query, method: 'GET' })
	        .then(resp => {
	          console.log(resp)
	          this.patient = resp.data;
	          this.pagination.total = resp.total;
	          this.pagination.per_page = resp.per_page;
	          this.loadingMethod(false)
	        })
	        .catch(error => {
	          console.log(error.response)
	          this.loadingMethod(false)
	        })

	        apiCall({url: '/api/maritalstatus', method: 'GET' })
	        .then(resp => {
	          console.log(resp)
	          this.marital = resp;
	        })
	        .catch(error => {
	          console.log(error.response)
	        })
	      },
	      save () {
	          // this.loadingMethod(true, "Adding Patient")
	          if(this.$refs.form.validate()){
	            this.loading = true
	            apiCall({url: '/api/patient', data: this.newpatient, method: 'POST' })
	            .then(resp => {
	              console.log(resp)
	              this.loading = false
	              this.patient.unshift(resp)
	              this.saving = false;
	              this.message = 'Patient Added Succesfully';
	              this.snackbar = true;
	              //this.loadingMethod(false)
	            })
	            .catch(error => {
	              this.loading = false
	              console.log(error.response)
	              this.loadingMethod(false)
	            })
	            this.close()
	        }
	      },
	      close(){
	      	this.newpatient = this.defaultpatient
	      },
	      addToQueue(patient){
	      	this.queueLoader = true
	      	apiCall({url: '/api/queue', data: patient, method: 'POST' })
	            .then(resp => {
	              console.log(resp)
	              this.queueLoader = false
	              this.message = 'Patient Sent to Queue Succesfully';
	              this.snackbar = true;
	            })
	            .catch(error => {
	              this.queueLoader = false
	              console.log(error.response)
	            })
	      }
    },
    computed: {
        formattedDate(){
          return this.newpatient.birth_date ? format(this.newpatient.birth_date, 'Do MMM YYYY') : ''
    	},
    	length: function() {
	        return Math.ceil(this.pagination.total / this.pagination.per_page);
	      },
    }
  }

</script>