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
    <v-container>
    <v-breadcrumbs :items="items" large>
      <template v-slot:divider>
        <v-icon>chevron_right</v-icon>
      </template>
    </v-breadcrumbs>
  </v-container>
    <v-dialog
      v-model="screenDialog"
      hide-overlay
      persistent
      width="300">
      <v-card
        color="primary"
        dark>
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
        column>
        <v-flex sm12>
          <v-layout row wrap>
            <v-flex xs12 sm12 md3>
              <v-img
              max-width = "250"
              aspect-ratio=1.05
              src="http://www.personalbrandingblog.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png">
              <div class="his_card_top_right">
                <v-btn outline fab small color="blue">
                  <v-icon dark>add</v-icon>
                </v-btn>
              </div>
            </v-img>
            </v-flex>
            <v-flex xs12 sm12 md9>
              <v-layout column>
                <v-flex xs12 sm12 md12 class="mt-5">
                  <p class="headline">
                    {{patient.name.given}} {{patient.name.family}}
                  </p>
                </v-flex>
                <v-flex xs12 sm12 md12>
                  <v-layout row wrap>
                    <v-flex sm12 md4>
                      <v-layout
                        column
                        wrap>
                        <v-flex xs12 sm12 md12>
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
                        <v-flex xs12 sm12 md12>
                          <v-layout
                            row
                            wrap>
                            <v-flex sm4 md4>
                              <p class="his_card_title">Weight</p>
                              <p class="his_card_description">{{vitals.weight}}kgs</p>
                            </v-flex>
                            <v-flex sm4 md4>
                              <p class="his_card_title">Height</p>
                              <p class="his_card_description">{{vitals.height}}cms</p>
                            </v-flex>
                          </v-layout>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                    <v-flex xs12 sm12 md8>
                      <v-layout row wrap class="mt-5">
                        <v-flex xs12 sm12 md6>
                          <v-card color="brown lighten-4" class="white--text mx-2" elevation="0">
                            <v-card-title primary-title>
                              <div>
                                <div class="headline">Currently On Queue</div>
                                <span>Status</span>
                              </div>
                            </v-card-title>
                          </v-card>
                        </v-flex>
                        <v-flex xs12 sm12 md6>
                          <v-card color="green lighten-4" class="white--text mx-2" elevation="0">
                            <v-card-title primary-title>
                              <div>
                                <div class="headline">Visit Ongoing</div>
                                <span>Location</span>
                              </div>
                            </v-card-title>
                          </v-card>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex xs12 sm12>
          <v-tabs
            class="mt-4"
            centered
            grow
            v-model="active"
            color="white"
            light
            slider-color="primary">
            <v-tab ripple>
              Vitals
            </v-tab>
            <v-tab-item>
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
                <v-layout
                  row
                  wrap
                  >
                  <v-flex sm12 md3>
                    <blood-pressure
                      :bloodPressure="bloodPressure"
                      :dates="vitalDates"/>
                  </v-flex>
                  <v-flex sm12 md3>
                    <body-temp 
                      :bodyTemperature="bodyTemperature"
                      :dates="vitalDates"/>
                  </v-flex>
                  <v-flex sm12 md3>
                    <heart-rate 
                      :heartRate="heartRate"
                      :dates="vitalDates"/>
                  </v-flex>
                  <v-flex sm12 md3>
                    <respiratory-rate
                      :respiratoryRate="respiratoryRate"
                      :dates="vitalDates"/>
                  </v-flex>
                  
                </v-layout>
              </div>
            </v-tab-item>
            <v-tab ripple>
              Tests
            </v-tab>
            <v-tab-item>






              <div class="his_card_no_shadow mt-3 pa-2">
                <v-layout row wrap>
                  <v-flex sm12 md4 lg4>
                    <div class="his_card_new_patient">
                      <p class="his_card_main_heading">Add New</p>
                        <v-form
                            ref="form"
                            v-model="valid"
                            lazy-validation>
                          <v-layout row wrap>

                            <v-flex sm12 md12>
                              <v-select
                                :items="testTypeCategories"
                                v-model="testTypeCategory"
                                item-value="id"
                                item-text="name"
                                label="Test Type Categeroy">
                              </v-select>
                            </v-flex>
                            <v-flex sm12 md12>
                              <v-select
                                :items="testTypeCategory"
                                v-model="testType"
                                item-value="id"
                                item-text="name"
                                label="Test Type">
                              </v-select>
                            </v-flex>
                          </v-layout>
                      </v-form>
                      <div class="his_card_footer">
                        <v-btn class="his_card_button white--text" small title="Edit" color="green" :loading="loading" :disabled="!valid" round @click="saveAllergy">
                          <v-icon left dark>add_circle</v-icon>
                          Add
                        </v-btn>
                      </div>
                    </div>
                  </v-flex>
                  <v-flex xs12 sm12 md4 v-for="(allergy,index) in patient.allergies" :key="allergy.id">
                    <div class="his_card">
                      <p class="his_card_main_heading">{{ allergy.substance }}</p>
                      <p class="his_card_title">Type</p>
                      <p class="his_card_description" v-if="allergy.is_drug == 1">Drug</p>
                      <p class="his_card_description" v-if="allergy.is_drug == 0">Other</p>
                      <p class="his_card_title">Date Added</p>
                      <p class="his_card_description">{{allergy.created_at | moment("from", true)}}</p>
                    </div>
                  </v-flex>
                </v-layout>
              </div>








            </v-tab-item>
            <v-tab ripple>Visits</v-tab>
            <v-tab-item>
            <v-layout
              row
              wrap
              >
              <v-flex sm12 md10>
                <div class="his_card_no_shadow mt-3 pa-2">
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
                          <v-card color="blue-grey darken-2" class="white--text" elevation="0">
                            <v-card-title primary-title>
                              <div>
                                <div class="headline">200</div>
                                <span>Cancelled</span>
                              </div>
                            </v-card-title>
                          </v-card>
                        </v-flex>
                        <v-flex xs2>
                          <v-card color="yellow darken-2" class="white--text" elevation="0">
                            <v-card-title primary-title>
                              <div>
                                <div class="headline">200</div>
                                <span>Suspended</span>
                              </div>
                            </v-card-title>
                          </v-card>
                        </v-flex>
                        <v-flex xs2>
                          <v-card color="green darken-2" class="white--text" elevation="0">
                            <v-card-title primary-title>
                              <div>
                                <div class="headline">200</div>
                                <span>Active</span>
                              </div>
                            </v-card-title>
                          </v-card>
                        </v-flex>
                        <v-flex xs2>
                          <v-card color="brown darken-2" class="white--text" elevation="0">
                            <v-card-title primary-title>
                              <div>
                                <div class="headline">200</div>
                                <span>Deceased</span>
                              </div>
                            </v-card-title>
                          </v-card>
                        </v-flex>
                        <v-flex xs4>
                          <v-card color="purple darken-2" class="white--text" elevation="0">
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
                      <v-flex xs12 sm12 md4 v-for="(encounter,index) in encounters" :key="encounter.id">
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
              </v-flex>
              <v-flex sm12 md2>
                  <div class="his_card_no_shadow mt-3 text-xs-center mx-2">
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
            </v-layout>
              
            </v-tab-item>
            <v-tab ripple>
              History
            </v-tab>
            <v-tab-item>

            </v-tab-item>
            <v-tab ripple>
              Diagnoses
            </v-tab>
            <v-tab-item>

            </v-tab-item>
            <v-tab ripple>
              Medication
            </v-tab>
            <v-tab-item>

            </v-tab-item>
            <v-tab ripple>
              Allergies
            </v-tab>
            <v-tab-item>
              <div class="his_card_no_shadow mt-3 pa-2">
                <v-layout row wrap>
                  <v-flex sm12 md4 lg4>
                    <div class="his_card_new_patient">
                      <p class="his_card_main_heading">Add New</p>
                        <v-form
                            ref="form"
                            v-model="valid"
                            lazy-validation>
                          <v-layout row wrap>
                            <v-flex sm12 md12>
                              <v-select
                                :items="allergies"
                                v-model="newallergy"
                                item-value="id"
                                item-text="substance"
                                label="Allergy">
                              </v-select>
                            </v-flex>
                          </v-layout>
                      </v-form>
                      <div class="his_card_footer">
                        <v-btn class="his_card_button white--text" small title="Edit" color="green" :loading="loading" :disabled="!valid" round @click="saveAllergy">
                          <v-icon left dark>add_circle</v-icon>
                          Add
                        </v-btn>
                      </div>
                    </div>
                  </v-flex>
                  <v-flex xs12 sm12 md4 v-for="(allergy,index) in patient.allergies" :key="allergy.id">
                    <div class="his_card">
                      <p class="his_card_main_heading">{{ allergy.substance }}</p>
                      <p class="his_card_title">Type</p>
                      <p class="his_card_description" v-if="allergy.is_drug == 1">Drug</p>
                      <p class="his_card_description" v-if="allergy.is_drug == 0">Other</p>
                      <p class="his_card_title">Date Added</p>
                      <p class="his_card_description">{{allergy.created_at | moment("from", true)}}</p>
                    </div>
                  </v-flex>
                </v-layout>
              </div>
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
  import HeartRate from '@/components/charts/heartRate.vue'
  import BloodPressure from '@/components/charts/bloodPressure.vue'
  import BodyTemp from '@/components/charts/bodyTemp.vue'
  import RespiratoryRate from '@/components/charts/respiratoryRate.vue'
  import Vue from 'vue'
  import VueMoment from 'vue-moment'
  Vue.use(VueMoment);

  export default {
    components: {
      HeartRate,
      BloodPressure,
      BodyTemp,
      RespiratoryRate
    },
    data () {
      return {
        allergyloading: false,
        visitQuery: '',
        active: null,
        vitalDates: [],
        bodyTemperature: [],
        respiratoryRate: [],
        heartRate: [],
        bloodPressure: [],
        loading: false,
        valid: false,
        interval: {},
        visits: 30,
        testTypeCategories: [],
        testTypeCategory: {},
        testType: {},
        snackbar: false,
        y: 'top',
        color: 'success',
        message: '',
        screenDialog: false,
        patient:{},
        allergies: [],
         items: [
          {
           text: 'Dashboard',
           to: { name: 'dashboard' }
          },
          {
           text: 'Patients',
           to: { name: 'patients' }
          },
           {
           text: 'Patient Profile',
           to: { name: 'patientProfile' }
          },
           
        ],
        vitals:[],
        newallergy: '',
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
// console.log('booh')
          console.log(resp)
          this.patient = resp;
          this.screenDialog = false
          this.getVisits()
        })
        .catch(error => {
          console.log(error.response)
          this.screenDialog = false
        })
        apiCall({url: '/api/allergy', method: 'GET' })
        .then(resp => {
          console.log("allergies", resp)
          this.allergies = resp;
        })
        .catch(error => {
          console.log(error.response)
        })

        apiCall({url: '/api/vitalsigns/' + this.$route.params.id, method: 'GET' })
        .then(resp => {
          console.log("Vitals", resp)
          console.log(resp)
          this.vitals = resp[0];
          //console.log("bloodPressure is", Object.keys(resp).length)
          var i;
          for (i = 0; i < Object.keys(resp).length; i++) {
            this.bloodPressure[Object.keys(resp)[i]] = resp[Object.keys(resp)[i]].blood_pressure;
            this.heartRate[Object.keys(resp)[i]] = resp[Object.keys(resp)[i]].heart_rate;
            this.respiratoryRate[Object.keys(resp)[i]] = resp[Object.keys(resp)[i]].respiratory_rate;
            this.bodyTemperature[Object.keys(resp)[i]] = resp[Object.keys(resp)[i]].body_temperature;
            this.vitalDates[Object.keys(resp)[i]] = resp[Object.keys(resp)[i]].created_at;
            //console.log("bloodPressure is", this.bloodPressure)
          }
        })
        .catch(error => {
          console.log(error.response)
        })
        apiCall({url: '/api/labtesttypecategory', method: 'GET' })
          .then(resp => {
            console.log("Test Type categories are: ",resp.data)
            this.testTypeCategories = resp.data;
        }).catch(error => {
            console.log(error.response)
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
      },
      requestTest(){
        this.requestTestQuery = 'patient_id='+this.patient.id
          'location_id='+this.location.id
          'encounter_class_id='+this.encounter_class_id
          'practitioner_name='+this.practitioner_name
          'testTypeIds='+this.testTypeIds;
        apiCall({url: '/api/patient/testrequest?' + this.requestTestQuery, method: 'GET' })
        .then(resp => {
          console.log(resp)
          // this.encounters = resp.data;
          // this.visitsPagination.total = resp.total;
          // this.visitsPagination.per_page = resp.per_page;
        })
        .catch(error => {
          console.log(error.response)
        })
      },
      saveAllergy(){
        if(this.$refs.form.validate()){
            this.allergyloading = true
            apiCall({url: '/api/patient/'+this.patient.id+'/allergy/'+this.newallergy, method: 'GET' })
            .then(resp => {
              console.log("allergy response", resp)
              this.patient.allergies =resp.allergies
              this.allergyloading = false
              this.message = 'Allergy Added Succesfully';
              this.snackbar = true;
            })
            .catch(error => {
              this.allergyloading = false
              console.log(error.response)
            })
        }
      }
    },
    computed: {
      visitLength: function() {
        return Math.ceil(this.visitsPagination.total / this.visitsPagination.per_page);
      },
    }
  }
</script>