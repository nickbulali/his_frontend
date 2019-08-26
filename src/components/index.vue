<template>
  <div class="dashboard">
  	   <v-container grid-list-xl>
          <v-layout wrap>
          <v-flex  sm6
             xs12
             md6
             lg3 style="padding:10px;">
   <v-card
      class="mx-auto text-center"
      color="green"
      dark
      max-width="600"
    >
      <v-card-text>
        <v-sheet color="rgba(0, 0, 0, .12)">
          <v-card-text>
        <div class="display-1 font-weight-thin">Users</div>
      </v-card-text>
        </v-sheet>
      </v-card-text>
  
      <v-card-text>
        <div class="display-1 font-weight-thin">{{users_count}}</div>
      </v-card-text>
  
      <v-divider></v-divider>
  
      <v-card-actions class="justify-center">
        <v-btn to="accesscontrol/useraccounts" block text>Go to Report</v-btn>
      </v-card-actions>
    </v-card>
            </v-flex>
  
            <v-flex  sm6
             xs12
             md6
             lg3 style="padding:10px;">
 <v-card
      class="mx-auto text-center"
      color="red"
      dark
      max-width="600"
    >
      <v-card-text>
        <v-sheet color="rgba(0, 0, 0, .12)">
            <v-card-text>
        <div class="display-1 font-weight-thin">Patients</div>
      </v-card-text>
        </v-sheet>
      </v-card-text>
  
      <v-card-text>
        <div class="display-1 font-weight-thin">{{patients_count}}</div>
      </v-card-text>

      <v-divider></v-divider>
  
      <v-card-actions class="justify-center">
        <v-btn to="/Reports/patients" block text>Go to Report</v-btn>
      </v-card-actions>
    </v-card>
            </v-flex>
        <v-flex  sm6
        xs12
        md6
        lg3 style="padding:10px;">
 <v-card
      class="mx-auto text-center"
      color="blue"
      dark
      max-width="600"
    >
      <v-card-text>
        <v-sheet color="rgba(0, 0, 0, .12)">
          <v-sparkline
            :value="value"
            color="rgba(255, 255, 255, .7)"
            height="100"
            padding="24"
            stroke-linecap="round"
            smooth
          >
            <template v-slot:label="item">
              ${{ item.value }}
            </template>
          </v-sparkline>
        </v-sheet>
      </v-card-text>
  
      <v-card-text>
        <div class="display-1 font-weight-thin">Revenue</div>
      </v-card-text>
  
      <v-divider></v-divider>
  
      <v-card-actions class="justify-center">
        <v-btn block text>Go to Report</v-btn>
      </v-card-actions>
    </v-card>
            </v-flex>
  
           <v-flex  sm6
        xs12
        md6
        lg3 style="padding:10px;">
       <v-card
      class="mx-auto text-center"
      color="purple"
      dark
      max-width="600"
      >
      <v-card-text>
        <v-sheet color="rgba(0, 0, 0, .12)">
          <v-sparkline
            :value="value"
            color="rgba(255, 255, 255, .7)"
            height="100"
            padding="24"
            stroke-linecap="round"
            smooth
          >
            <template v-slot:label="item">
              ${{ item.value }}
            </template>
          </v-sparkline>
        </v-sheet>
      </v-card-text>
  
      <v-card-text>
        <div class="display-1 font-weight-thin">Expenses</div>
      </v-card-text>
  
      <v-divider></v-divider>
  
      <v-card-actions class="justify-center">
        <v-btn block text>Go to Report</v-btn>
      </v-card-actions>
    </v-card>
            </v-flex>
          </v-layout>
          <v-layout>
          <v-flex  sm6
        xs12
        md6
        lg3 style="padding:10px;">
 <v-card
      class="mx-auto text-center"
      color="orange"
      dark
      max-width="600"
    >
      <v-card-text>
        <v-sheet color="rgba(0, 0, 0, .12)">
              <v-card-text>
        <div class="display-1 font-weight-thin">Appointments</div>
      </v-card-text>
        </v-sheet>
      </v-card-text>
  
      <v-card-text>
        <div class="display-1 font-weight-thin">{{appointment_count}}</div>
      </v-card-text>
  
      <v-divider></v-divider>
  
      <v-card-actions class="justify-center">
        <v-btn to="Reports/appointments" block text>Go to Report</v-btn>
      </v-card-actions>
    </v-card>
            </v-flex>
  
      
          </v-layout>

   
        </v-container>

 

    </div>




</template>

<script>

  import apiCall from '../utils/api'
  import { mapGetters, mapState } from 'vuex'

  export default {
    name:'Dashboard',
    computed: {
      ...mapGetters(['isAuthenticated', 'isProfileLoaded']),
    },
      data: () => ({
          users_count: '',
          patients_count:'',
          appointment_count:'',
          bookings_cancelled:'',
          revenue:'',

          labels: [
      '12am',
      '3am',
      '6am',
      '9am',
      '12pm',
      '3pm',
      '6pm',
      '9pm',
    ],
    value: [
      200,
      675,
      410,
      390,
      310,
      460,
      250,
      240,
    ],
      }),


      created () {
          this.initialize()
      },

      methods: {
          initialize () {
              apiCall({url: '/api/users/count', method: 'GET' })
            .then(resp => {
              console.log(resp.data)
              this.users_count = resp;
            })
            .catch(error => {
              console.log(error.response)
            })
          {
              apiCall({url: '/api/patient/count', method: 'GET' })
            .then(resp => {
              console.log(resp)
              this.patients_count = resp;
            })
            .catch(error => {
              console.log(error.response)
            })
          }
          {
              apiCall({url: '/api/appointment/count', method: 'GET' })
            .then(resp => {
              console.log(resp)
              this.appointment_count = resp;
            })
            .catch(error => {
              console.log(error.response)
            })
          }

           {
              apiCall({url: '/api/fieldReservation/revenue', method: 'GET' })
            .then(resp => {
              console.log(resp)
              this.revenue = resp;
            })
            .catch(error => {
              console.log(error.response)
            })
          }
            {
              apiCall({url: '/api/fieldReservation/cancelled', method: 'GET' })
            .then(resp => {
              console.log(resp)
              this.bookings_cancelled = resp;
            })
            .catch(error => {
              console.log(error.response)
            })
          }
        }

      }



}
</script>
