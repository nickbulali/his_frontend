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
    <v-dialog
      v-model="screenDialog"
      hide-overlay
      persistent
      width="300"
    >
      <v-card
        color="primary"
        dark
      >
        <v-card-text>
          {{message}}
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  	<v-container class="my-5">
      <v-layout
        row
        wrap>
        <v-flex sm3 md3>
          <div class="his_card_no_shadow">
            <v-img
              max-width = "250"
              aspect-ratio=1.05
              style="border-radius: 2%;"
              src="http://www.personalbrandingblog.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png"
            >
              <div class="his_card_top_right">
                <v-btn outline fab small color="blue">
                  <v-icon dark>add</v-icon>
                </v-btn>
              </div>
            </v-img>
            <v-card-title>
              <p class="headline">
                {{patient.name.given}} {{patient.name.family}}
              </p>
              <v-spacer></v-spacer>
            </v-card-title>
            <v-divider></v-divider>
              <v-layout
                class="mt-4 pa-1"
                column
                wrap>
                <v-flex sm12 md12>
                  <v-layout
                    row
                    wrap>
                    <v-flex sm4 md4>
                      <p class="his_card_title">Age</p>
                      <p class="his_card_description">{{patient.birth_date | moment("from", true)}}</p>
                    </v-flex>
                    <v-flex sm4 md4>
                      <p class="his_card_title">Gender</p>
                      <p class="his_card_description">{{patient.gender.display}}</p>
                    </v-flex>
                    <v-flex sm4 md4>
                      <p class="his_card_title">Blood Type</p>
                      <p class="his_card_description">{{patient.blood_group.display}}</p>
                    </v-flex>
                  </v-layout>
                </v-flex>
                <v-flex sm12 md12>
                  <v-layout
                    row
                    wrap>
                    <v-flex sm4 md4>
                      <p class="his_card_title">Weight</p>
                      <p class="his_card_description">87kgs</p>
                    </v-flex>
                    <v-flex sm4 md4>
                      <p class="his_card_title">Height</p>
                      <p class="his_card_description">176cms</p>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
          </div>
          <div class="his_card_no_shadow mt-2 text-xs-center">
            <p class="his_card_title">Total</p>
            <p class="his_card_description">{{patient.encounter.length}} Visits</p>
            <v-progress-circular
                :rotate="-90"
                :size="130"
                :width="20"
                :value="visits"
                color="primary"
              >
              </v-progress-circular>
            <div class="his_card_footer">
              <v-btn dark class="his_card_button" small title="Edit" color="black" flat outline round @click="">
                <v-icon left dark>directions_walk</v-icon>
                  View All Visits
              </v-btn>
            </div>
          </div>
        </v-flex>
        <v-flex sm9 md9>
          <v-tabs
            centered
            grow
            v-model="active"
            color="white"
            light
            slider-color="primary"
          >
            <v-tab
              ripple
            >
              Vitals
            </v-tab>
            <v-tab-item
            >
              <div class="his_card_no_shadow mt-3">
                <v-card-title>
                  <p class="headline">
                    Vital Signs
                  </p>
                  <v-spacer></v-spacer>
                  <v-btn class="his_card_button white--text" small title="Edit" color="green" :loading="loading" :disabled="!valid" round @click="">
                    <v-icon left dark>add_circle</v-icon>
                    Add Vital
                  </v-btn>
                </v-card-title>
                <vital-signs 
                  :bodyTemperature="bodyTemperature"
                  :respiratoryRate="respiratoryRate"
                  :heartRate="heartRate"
                  :bloodPressure="bloodPressure"
                />
              </div>
            </v-tab-item>
            <v-tab
              ripple
            >
              Visits
            </v-tab>
            <v-tab-item
            >
            <div class="his_card_no_shadow mt-3">
              <v-card-title>
                <p class="headline">
                  Visits
                </p>
                <v-spacer></v-spacer>
                <v-btn class="his_card_button white--text" small title="Edit" color="green" :loading="loading" :disabled="!valid" round @click="">
                  <v-icon left dark>add_circle</v-icon>
                  Add New
                </v-btn>
              </v-card-title>
                <v-container bg fill-height grid-list-md text-xs-center >
                  <v-layout
                    row
                    >
                    <v-flex xs>
                      <v-card color="blue-grey darken-2" class="white--text pa-1">
                        <v-card-title primary-title>
                          <div>
                            <div class="headline">200</div>
                            <span>Cancelled</span>
                          </div>
                        </v-card-title>
                      </v-card>
                    </v-flex>
                    <v-flex xs2>
                      <v-card color="yellow darken-2" class="white--text pa-1">
                        <v-card-title primary-title>
                          <div>
                            <div class="headline">200</div>
                            <span>Suspended</span>
                          </div>
                        </v-card-title>
                      </v-card>
                    </v-flex>
                    <v-flex xs2>
                      <v-card color="green darken-2" class="white--text pa-1">
                        <v-card-title primary-title>
                          <div>
                            <div class="headline">200</div>
                            <span>Active</span>
                          </div>
                        </v-card-title>
                      </v-card>
                    </v-flex>
                    <v-flex xs2>
                      <v-card color="brown darken-2" class="white--text pa-1">
                        <v-card-title primary-title>
                          <div>
                            <div class="headline">200</div>
                            <span>Deceased</span>
                          </div>
                        </v-card-title>
                      </v-card>
                    </v-flex>
                    <v-flex xs4>
                      <v-card color="purple darken-2" class="white--text pa-1">
                        <v-card-title primary-title>
                          <div>
                            <div class="headline">800</div>
                            <span>Total</span>
                          </div>
                        </v-card-title>
                      </v-card>
                    </v-flex>
                  </v-layout>
                </v-container>
                <v-layout
                  row
                  wrap>
                  <v-flex sm12 md6 v-for="(encounter,index) in encounters" :key="encounter.id">
                    <div class="his_card">
                      <div class="his_card_top_right">
                        <v-btn outline fab small title="View History" color="green" router :to="{ name: 'patientProfile', params: { id: patient.id } }">
                          <v-icon dark>visibility</v-icon>
                        </v-btn>
                      </div>
                      <p class="his_card_main_heading">{{ encounter.encounter_class.display }}</p>
                      <p class="his_card_small_text">{{ encounter.id }}</p>
                      <p class="his_card_title">Location</p>
                      <p class="his_card_description">{{ encounter.location.name }}</p>
                      <p class="his_card_title">Tests Ordered</p>
                      <p class="his_card_description">N/A</p>
                      <p class="his_card_title">Seen By</p>
                      <p class="his_card_description">Staff Name</p>
                      <p class="his_card_title">Visited</p>
                      <p class="his_card_description">{{encounter.created_at | moment("from", true)}}</p>
                      <div class="his_card_footer">
                        <div class="his_card_footer_right">
                          <v-btn dark class="his_card_button" small title="Edit" color="brown" round @click="requestTest(patient)">
                          <v-icon left dark>add_circle</v-icon>
                            Add Notes
                        </v-btn>
                        </div>
                      </div>
                    </div>
                  </v-flex>
                </v-layout>
                <div v-if="visitLength" class="text-xs-center">
                  <v-pagination
                    :length="visitLength"
                    :total-visible="visitsPagination.visible"
                    v-model="visitsPagination.page"
                    @input="getVisits"
                    circle>
                  </v-pagination>
                </div>
            </div>
            </v-tab-item>
            <v-tab
              ripple
            >
              History
            </v-tab>
            <v-tab-item
            >

            </v-tab-item>
            <v-tab
              ripple
            >
              Diagnoses
            </v-tab>
            <v-tab-item
            >

            </v-tab-item>
            <v-tab
              ripple
            >
              Medication
            </v-tab>
            <v-tab-item
            >

            </v-tab-item>
          </v-tabs>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>
<style lang="stylus" scoped>
  .v-progress-circular
    margin: 1rem
</style>
<script>

  import apiCall from '../../utils/api'
  import VitalSigns from '@/components/Charts/VitalSigns.vue'
  import Vue from 'vue'
  import VueMoment from 'vue-moment'
  Vue.use(VueMoment);

  export default {
    components: {
      VitalSigns
    },
    data () {
      return {
        visitQuery: '',
        active: null,
        bodyTemperature: [36.1, 36.0, 36.8, 38, 37, 36.9, 35, 36.6, 37, 36.2, 37.5, 36.0],
        respiratoryRate: [12, 17, 21, 15, 22, 18, 19, 12, 19, 14, 16, 17],
        heartRate: [80, 70, 81, 70, 87, 90, 85, 72, 85, 88, 91, 85],
        bloodPressure: [125, 130, 127, 126, 124, 130, 136, 137, 129, 130, 127, 126],
        loading: false,
        valid: false,
        interval: {},
        visits: 30,
        snackbar: false,
        y: 'top',
        color: 'success',
        message: '',
        screenDialog: false,
        patient:{},
        visitsPagination: {
          page: 1,
          per_page: 0,
          total: 0,
          visible: 10
        },
      }
    },
    created(){
      this.initialize()
    },
    methods:{
      initialize(){
        this.message = "Loading Patient Data"
        this.screenDialog = true
        apiCall({url: '/api/patient/' + this.$route.params.id, method: 'GET' })
        .then(resp => {
          console.log(resp)
          this.patient = resp;
          this.screenDialog = false
          this.getVisits()
        })
        .catch(error => {
          console.log(error.response)
          this.screenDialog = false
        })
      },
      getVisits(){
        this.visitQuery = 'page='+ this.visitsPagination.page;
      
        apiCall({url: '/api/encounter/patient/' + this.patient.id + '?' + this.visitQuery, method: 'GET' })
        .then(resp => {
          console.log(resp)
          this.encounters = resp.data;
          this.visitsPagination.total = resp.total;
          this.visitsPagination.per_page = resp.per_page;
        })
        .catch(error => {
          console.log(error.response)
        })
      }
    },
    computed: {
      visitLength: function() {
        return Math.ceil(this.visitsPagination.total / this.visitsPagination.per_page);
      },
    }
  }
</script>