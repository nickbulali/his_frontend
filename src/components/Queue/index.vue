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
     <v-dialog v-model="loadingDialog.loading" hide-overlay persistent width="300">
      <v-card color="primary" dark>
        <v-card-text>
          {{ loadingDialog.message }}
          <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="vt" max-width="600px">
      <template v-slot:activator="{ on }">
        <v-btn color="primary" dark v-on="on">Open Dialog</v-btn>
      </template>
      <v-card>
        <v-toolbar dark color="primary" class="elevation-0">
          <v-spacer></v-spacer>
            <v-toolbar-title>Add Vitals</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field
                    v-model="vitals.body_temperature"
                    :rules="[v => !!v || 'Body Temparature is Required']"
                    outline
                    label="Body Temparature"
                    required>
                  </v-text-field>
                </v-flex>
                    <v-flex xs12>
                  <v-text-field
                    v-model="vitals.respiratory_rate"
                    :rules="[v => !!v || 'Respiratory Rate is Required']"
                    outline
                    label="Respiratory Rate"
                    required>
                  </v-text-field>
                </v-flex>
                   <v-flex xs12>
                  <v-text-field
                    v-model="vitals.heart_rate"
                    :rules="[v => !!v || 'Heart Rate is Required']"
                    outline
                    label="Heart Rate"
                    required>
                  </v-text-field>
                </v-flex>
                   <v-flex xs12>
                  <v-text-field
                    v-model="vitals.blood_pressure"
                    :rules="[v => !!v || 'Blood Pressure is Required']"
                    outline
                    label="Blood Pressure"
                    required>
                  </v-text-field>
                </v-flex>
                  <v-flex xs12>
                  <v-text-field
                    v-model="vitals.height"
                    :rules="[v => !!v || 'Height is Required']"
                    outline
                    label="Height"
                    required>
                  </v-text-field>
                </v-flex>
                 <v-flex xs12>
                  <v-text-field
                    v-model="vitals.weight"
                    :rules="[v => !!v || 'Weight is Required']"
                    outline
                    label="Weight"
                    required>
                  </v-text-field>
                </v-flex>
                   <v-flex xs12>
                  <v-text-field
                    v-model="vitals.body_mass_index"
                    :rules="[v => !!v || 'Body Mass Index is Required']"
                    outline
                    label="Body Mass Index"
                    required>
                  </v-text-field>
                </v-flex>
                   <v-flex xs12>
                  <v-text-field
                    v-model="vitals.body_surface_area"
                    :rules="[v => !!v || 'Body Surface Area is Required']"
                    outline
                    label="Body Surface Area"
                    required>
                  </v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn round outline color="blue lighten-1" flat @click="dialog = false">
              Cancel
              <v-icon right dark>close</v-icon>
            </v-btn>
            <v-btn round outline xs12 sm6 :loading="loading" color="primary darken-1" flat @click="savevitals(patient)">Save
              <v-icon right dark>cloud_upload</v-icon>
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
    <v-layout
    	class="mt-5"
    	row
    	wrap>
    	<v-flex sm12 md4>
    		<v-card
    			class="mx-auto mt-5"
				max-width="400"
		      	dark
		      	flat
		    >
		      <v-card-title class="pa-2 primary lighten-2">
		        <v-btn icon>
		          <v-icon>mdi-menu</v-icon>
		        </v-btn>
		        <h3 class="title font-weight-light text-xs-center grow">{{time}}</h3>
		        <v-btn icon>
		          <v-icon>mdi-menu</v-icon>
		        </v-btn>
		      </v-card-title>
		      <v-img
		        src="https://cdn.vuetifyjs.com/images/cards/forest.jpg"
		        gradient="to top, rgba(0,0,0,.44), rgba(0,0,0,.44)"
		      >
		        <v-container fill-height>
		          <v-layout align-center>
		            <strong class="display-4 font-weight-regular mr-4">{{ new Date().getUTCDate() }}</strong>
		            <v-layout column justify-end>
		              <div class="headline font-weight-light">{{dayNames[new Date().getDay()]}}</div>
		              <div class="text-uppercase font-weight-light">{{ monthNames[new Date().getMonth()] }} {{ new Date().getFullYear() }}</div>
		            </v-layout>
		          </v-layout>
		        </v-container>
		      </v-img>
		    </v-card>
    	</v-flex>
    	<v-flex sm12 md4>
    		<v-card
				class="mx-auto mt-5"
			>
			    
			    <v-card-text class="py-0">
			      <v-timeline
			        align-top
			        dense
			      >
			        <v-timeline-item
			          v-for="item in queue" :key="item.id"
			          color="pink"
			          small
			        >
			          <v-layout pt-3>
			            <v-flex xs3>
			              <strong>{{item.created_at | moment("h:mm a")}}</strong>
			            </v-flex>
			            <v-flex @click="patientDetails(item.patient)">
			              <strong>{{item.patient.name.given}} {{item.patient.name.family}}</strong>
			              <div class="caption green--text" v-if="item.queue_status.display=='Complete'">{{item.queue_status.display}}</div>
			              <div class="caption red--text" v-if="item.queue_status.display=='Pending'">{{item.queue_status.display}}</div>
			              <div class="caption brown--text" v-if="item.queue_status.display=='Triage'">{{item.queue_status.display}}</div>
			              <div class="caption blue--text" v-if="item.queue_status.display=='Consultation'">{{item.queue_status.display}}</div>
			              <div class="caption purple--text" v-if="item.queue_status.display=='Pharmacy'">{{item.queue_status.display}}</div>
			              <div class="caption teal--text" v-if="item.queue_status.display=='Labs'">{{item.queue_status.display}}</div>
			            </v-flex>
			          </v-layout>
			        </v-timeline-item>

			     
			      </v-timeline>
			    </v-card-text>
			</v-card>
    	</v-flex>
    	<v-flex sm12 md4>
    		<div v-if="DetailsVue == true" class="his_card mt-5">
		        <div class="his_card_top_right">
		          <v-btn outline fab small title="View History" color="green"  @click="">
		            <v-icon dark>description</v-icon>
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
		          
		          <v-btn class="his_card_button" small title="Edit" color="green" @click ="vit(patient)">   Enter Vitals
                  <v-icon right dark>playlist_add</v-icon>
                </v-btn>
		        
		        </div>
		      </div>
    	</v-flex>
	</v-layout>
  </div>
</template>

<script>
	import apiCall from '../../utils/api'
	import VueMoment from 'vue-moment'
  Vue.use(VueMoment);
	import Vue from 'vue'
	export default {
  		data () {
      		return {
      			DetailsVue: false,
      			snackbar: false,
      			valid: true,
                delete: false,
		        loader: false,
		        loading: false,
		        loadingDialog: {
		        loading: false,
		          message: ""
		        },
		        vt: false,
      			message:'',
	    		y: 'top',
	    		color: 'success',
	    		dayNames: [
	    			'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
	    		],
	    		monthNames: [
	    			'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
	    		],
	    		 inputRules: [
                v => v.length >= !v  || 'Field is required'
     		     ],
	    		time: '',
	    		queue:[],
	    		vitals:{
		    	patient_id:'',
		        body_temperature: '',
		    	respiratory_rate: '',
		    	heart_rate: '',
		    	blood_pressure: '',
		    	height:'',
		    	weight:'',
		    	body_mass_index:'',
		    	body_surface_area:'',
		    
		    		},
		    		

      		}
  		},
  		created () {
	      this.updateTime()
	      this.initialize()
	    },
	     


  		methods: {

  		
  			  loadingMethod(load, message="") {
        this.loadingDialog.loading = load;
        this.loadingDialog.message = message
      },
         
  			updateTime() {
  				this.intervalid1 = setInterval(() => {
				    var cd = new Date();
				    this.time = this.zeroPadding(cd.getHours(), 2) + ':' + this.zeroPadding(cd.getMinutes(), 2) + ':' + this.zeroPadding(cd.getSeconds(), 2);
				}, 1000);
			},
			vit(patient){
				this.vt = true
				this.vitals.patient_id = patient.id
			},
			zeroPadding(num, digit) {
			    var zero = '';
			    for(var i = 0; i < digit; i++) {
			        zero += '0';
			    }
			    return (zero + num).slice(-digit);
			},
			initialize () {
				apiCall({url: '/api/queue', method: 'GET' })
			        .then(resp => {
			          console.log(resp)
			          this.queue = resp;
			        })
			        .catch(error => {
			          console.log(error.response)
			        })
			},
			patientDetails(patient){
				this.patient = patient
				this.DetailsVue = true
				console.log(this.patient)
			},
			savevitals(patient){
        if(this.$refs.form.validate()){
            this.loadingMethod(true, "Posting Vitals")
            this.loading = true
            apiCall({url: '/api/vitalsigns', data: this.vitals, method: 'POST' })
            .then(resp => {
              this.loading = false
              this.saving = false
              this.vt = false
              this.message = 'Vitals Added Succesfully'
              this.snackbar = true
              this.loadingMethod(false)
            })
            .catch(error => {
              this.loading = false
              console.log(error.response)
              this.loadingMethod(false)
            })
            this.close()
          }
      }
  		}
  	}

</script>