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
			          :color="item.queue_status.color"
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
		          <v-btn dark class="his_card_button" small title="Edit" color="green" :loading="queueLoader" round @click="">
		            <v-icon left dark>launch</v-icon>
		            Button 1
		          </v-btn>
		          <div class="his_card_footer_right">
		            <v-btn dark class="his_card_button" small title="Edit" color="blue" round @click="">
			        	<v-icon left dark>add_circle</v-icon>
			            Button 2
			        </v-btn>
		          </div>
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
      			message:'',
	    		y: 'top',
	    		color: 'success',
	    		dayNames: [
	    			'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
	    		],
	    		monthNames: [
	    			'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
	    		],
	    		time: '',
	    		queue:[],
	    		patient:{}
      		}
  		},
  		created () {
	      this.updateTime()
	      this.initialize()
	    },
  		methods: {
  			updateTime() {
  				this.intervalid1 = setInterval(() => {
				    var cd = new Date();
				    this.time = this.zeroPadding(cd.getHours(), 2) + ':' + this.zeroPadding(cd.getMinutes(), 2) + ':' + this.zeroPadding(cd.getSeconds(), 2);
				}, 1000);
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
			}
  		}
  	}

</script>