<template>
  <div class="queue">
  	<v-snackbar
      v-model="snackbar"
      :color="color"
      :timeout="6000"
      :top="y === 'top'"
      >
        {{ message }}
    </v-snackbar>
    <v-container class="my-5">
    	<v-dialog v-model="loadingDialog.loading" hide-overlay persistent width="300">
      	<v-card color="primary" dark>
        	<v-card-text>
          	{{ loadingDialog.message }}
          	<v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
        	</v-card-text>
      	</v-card>
    	</v-dialog>
    	<v-dialog v-model="vt" max-width="600px">
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
											single-line
											label="Body Temparature"
											required>
										</v-text-field>
									</v-flex>
									<v-flex xs12>
										<v-text-field
											v-model="vitals.respiratory_rate"
											:rules="[v => !!v || 'Respiratory Rate is Required']"
											single-line
											label="Respiratory Rate"
											required>
										</v-text-field>
									</v-flex>
									<v-flex xs12>
										<v-text-field
											v-model="vitals.heart_rate"
											:rules="[v => !!v || 'Heart Rate is Required']"
											single-line
											label="Heart Rate"
											required>
										</v-text-field>
									</v-flex>
									<v-flex xs12>
										<v-text-field
											v-model="vitals.blood_pressure"
											:rules="[v => !!v || 'Blood Pressure is Required']"
											single-line
											label="Blood Pressure"
											required>
										</v-text-field>
									</v-flex>
									<v-flex xs12>
										<v-text-field
											v-model="vitals.height"
											:rules="[v => !!v || 'Height is Required']"
											single-line
											label="Height"
											required>
										</v-text-field>
									</v-flex>
									<v-flex xs12>
										<v-text-field
											v-model="vitals.weight"
											:rules="[v => !!v || 'Weight is Required']"
											single-line
											label="Weight"
											required>
										</v-text-field>
									</v-flex>
									<v-flex xs12>
										<v-text-field
											v-model="vitals.body_mass_index"
											:rules="[v => !!v || 'Body Mass Index is Required']"
											single-line
											label="Body Mass Index"
											required>
										</v-text-field>
									</v-flex>
									<v-flex xs12>
										<v-text-field
											v-model="vitals.body_surface_area"
											:rules="[v => !!v || 'Body Surface Area is Required']"
											single-line
											label="Body Surface Area"
											required>
										</v-text-field>
									</v-flex>
								</v-layout>
							</v-container>
						</v-card-text>
						<v-card-actions>
							<v-spacer></v-spacer>
							<v-btn round single-line color="blue lighten-1" flat @click="dialog = false">
								Cancel
								<v-icon right dark>close</v-icon>
							</v-btn>
							<v-btn round single-line xs12 sm6 :loading="loading" color="primary darken-1" flat @click="savevitals(patient)">Save
								<v-icon right dark>cloud_upload</v-icon>
							</v-btn>
						</v-card-actions>
					</v-form>
				</v-card>
    </v-dialog>
    <v-dialog v-model="DetailsVue" max-width="600px">
    	<div v-if="DetailsVue == true">
    		<v-card class="pa-3">
    			<v-card-text>
		        <div class="his_card_top_right">
		          <v-btn single-line fab small title="View History" color="green"  @click="">
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
		          <v-btn dark class="his_card_button" small title="Edit" color="green" @click ="vit(patient)">
		          	<v-icon left>playlist_add</v-icon> Enter Vitals		          
		        	</v-btn>
		        </div>
		    	</v-card-text>
				</v-card>
	    </div>
    </v-dialog>
    <v-layout
    	class="mt-5"
    	row
    	wrap>
    	<v-flex sm12 md6>
    		<div class="his_card_no_shadow">
    			<v-layout
			    	row
			    	wrap>
			    	<v-flex sm12 md3>
			    		<h3 class="title text-xs-left grow mx-3 mt-4">{{dayNames[new Date().getDay()]}}</h3>
			    		<h3 class="body-2 font-weight-light text-xs-left grow my-1 mx-3 mb-4 grey--text">{{time}}</h3>
			    		<v-divider></v-divider>
			    		<h3 class="body-2 font-weight-light text-xs-left grow my-1 mx-3 mt-4 grey--text">Date</h3>
			    		<h3 class="title text-xs-left grow mx-3">{{ new Date().getUTCDate() }} {{ monthNames[new Date().getMonth()] }} {{ new Date().getFullYear() }}</h3>
			    	</v-flex>
			    	<v-flex sm12 md9>
		    			<v-card-text class="py-0">
					      <v-timeline
					        align-top
					        dense
					      >
					      	<v-timeline-item
					          color="yellow"
					          small
					        >
										<v-layout pt-1>
												<v-flex xs8>
													<strong>Add Patient to Queue</strong>
													<div class="caption orange--text" >Pending</div>
												</v-flex>
												<v-flex xs4>
													<v-btn class="his_card_button white--text" small title="Edit" color="green" :loading="loading" round @click="">
														<v-icon left dark>add_circle</v-icon>
														Add
													</v-btn>
												</v-flex>
										</v-layout>
					        </v-timeline-item>
					        <v-timeline-item
					          v-for="item in queue" :key="item.id"
					          :color="item.queue_status.color"
					          small
					        >
					        <v-divider></v-divider>
									<v-layout pt-3>
										<v-flex xs3>
											<strong>{{item.created_at | moment("h:mm a")}}</strong>
											<div class="caption grey--text">{{item.created_at | moment("from", true)}}</div>
										</v-flex>
										<v-flex xs7>
											<strong>{{item.patient.name.given}} {{item.patient.name.family}}</strong>
											<div class="caption green--text" v-if="item.queue_status.code=='complete'">{{item.queue_status.display}}</div>
											<div class="caption red--text" v-if="item.queue_status.code=='pending'">{{item.queue_status.display}}</div>
											<div class="caption brown--text" v-if="item.queue_status.code=='triage'">{{item.queue_status.display}}</div>
											<div class="caption blue--text" v-if="item.queue_status.code=='consultation_pending'">{{item.queue_status.display}}</div>
											<div class="caption teal--text" v-if="item.queue_status.code=='consultation_started'">{{item.queue_status.display}}</div>
											<div class="caption orange--text" v-if="item.queue_status.code=='pharmacy'">{{item.queue_status.display}}</div>
											<div class="caption purple--text" v-if="item.queue_status.code=='lab'">{{item.queue_status.display}}</div>
										</v-flex>
										<v-flex xs2>
											<v-btn single-line fab small color="brown" @click="patientDetails(item.patient)">
												<v-icon dark>visibility</v-icon>
											</v-btn>
										</v-flex>
									</v-layout>
					        </v-timeline-item>			     
					      </v-timeline>
					    </v-card-text>
					    <infinite-loading @distance="20" @infinite="infiniteHandler"></infinite-loading>
					</v-flex>
				</v-layout>
		    </v-card>
			</div>
    	</v-flex>
    	<v-flex sm12 md6>
    		<v-layout
		    	row
		    	wrap>
		    	<v-flex sm12 md12>
	    			<div class="his_card_no_shadow mx-2">
	    				<v-card-title>
								<p class="headline">
									Total on Queue
								</p>
								<v-spacer></v-spacer>
							</v-card-title>
	    				<patient-queue
	    					v-if="dataready"
		            :dataset="dataset"
		          />
	    			</div>
	    		</v-flex>
	    		<v-flex sm12 md12>
	    			<v-layout
				    	row
				    	wrap>
				    	<v-flex sm12 md6>
		    				<div class="his_card_no_shadow text-xs-center mt-3 mx-2">
		    					<p class="his_card_title">Statistic by Status</p>
					        <p class="his_card_description">Number of Total</p>
										<v-progress-circular
											:rotate="-90"
											:size="130"
											:width="20"
											:value="stat1"
											color="primary"
										>
										</v-progress-circular>
										<div class="his_card_footer">
											<v-btn dark class="his_card_button" small title="Edit" color="black" flat single-line round @click="">
												<v-icon left dark>directions_walk</v-icon>
													View All Visits
											</v-btn>
										</div>
		    				</div>
		    			</v-flex>
		    			<v-flex sm12 md6>
		    				<div class="his_card_no_shadow text-xs-center mt-3 mx-3">
		    					<p class="his_card_title">Statistic by Location</p>
					        <p class="his_card_description">Number of Total</p>
										<v-progress-circular
											:rotate="-90"
											:size="130"
											:width="20"
											:value="stat2"
											color="primary"
										>
										</v-progress-circular>
										<div class="his_card_footer">
											<v-btn dark class="his_card_button" small title="Edit" color="black" flat single-line round @click="">
												<v-icon left dark>directions_walk</v-icon>
													View All Visits
											</v-btn>
										</div>
		    				</div>
		    			</v-flex>
			    	</v-layout>
	    		</v-flex>
	    	</v-layout>
    	</v-flex>
	</v-layout>
</v-container>
  </div>
</template>

<script>
	import apiCall from '../../utils/api'
	import PatientQueue from '@/components/Charts/PatientQueue.vue'
	import Vue from 'vue'
	import VueMoment from 'vue-moment'
  	Vue.use(VueMoment);
  	import InfiniteLoading from 'vue-infinite-loading'
	export default {
		components: {
			InfiniteLoading,
			PatientQueue
		},
  		data () {
				return {
					dataready: false,
					dataset: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					stat1: 10,
					stat2: 30,
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
	    		page: 1,
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
				apiCall({url: '/api/queuestats', method: 'GET' })
					.then(resp => {
						this.queuestats = resp;
						var i;
						for (i = 0; i < Object.keys(this.queuestats).length; i++) {
							this.dataset[Object.keys(this.queuestats)[i].replace(/^0/, '')] = this.queuestats[Object.keys(this.queuestats)[i]].length;
							console.log(this.queuestats[Object.keys(this.queuestats)[i]].length)
						}
						console.log("dataset", this.dataset)
						this.dataready = true
					})
					.catch(error => {
						console.log(error.response)
					})
			},
			infiniteHandler($state) {
				apiCall({url: '/api/queue?page='+this.page, method: 'GET' })
					.then(response => {
						if (response.data.length) {
							this.queue = this.queue.concat(response.data);
							$state.loaded();
							if (this.queue.length / 20 === 10) {
								$state.complete();
							}
						} else {
							$state.complete();
						}
					})
					.catch(error => {
						console.log(error.response)
					})
					this.page = this.page + 1;
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