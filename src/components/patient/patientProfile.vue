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


        <v-dialog v-model="dialog" max-width="600px">
      <template v-slot:activator="{ on }">
      <!--   <v-btn color="primary" dark v-on="on">Open Dialog</v-btn> -->
      </template>
      <v-card>
        <v-toolbar dark color="primary" class="elevation-0">
          <v-spacer></v-spacer>
            <v-toolbar-title>Diagnosis</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                   
                  <v-flex xs12>
                  <v-textarea
                    v-model="diagnosis.description"
                   
                    outline
                    label="Diagnosis"
                    required>
                  </v-textarea>
                </v-flex>
         <!--              <v-flex xs12>
                  <v-textarea
                    v-model="editedItem.patient_id"
                   
                    outline
                    label="Diagnosis"
                    required>
                  </v-textarea>
                </v-flex> -->
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn round outline color="blue lighten-1" flat @click="dialog = false">
              Cancel
              <v-icon right dark>close</v-icon>
            </v-btn>
            <v-btn round outline xs12 sm6 color="primary darken-1" :disabled="!valid" @click="save(patient)">
                  Save <v-icon right dark>cloud_upload</v-icon>
                </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>


     <v-dialog v-model="meddialog" max-width="600px">
      <template v-slot:activator="{ on }">
      <!--   <v-btn color="primary" dark v-on="on">Open Dialog</v-btn> -->
      </template>
      <v-card>
        <v-toolbar dark color="primary" class="elevation-0">
          <v-spacer></v-spacer>
            <v-toolbar-title>Medications</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                   
              <v-flex sm12 md12>
                <v-select
                    outline
                    v-bind:items="drugs"
                    item-text="generic_name"
                    item-value="generic_name"
                    label="Drugs"
                    :rules="[v => !!v || 'Drug Name is Required']"
                    v-model="editedItem.drugs"
                    multiple chips
                    autocomplete>
                </v-select>
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
            <v-btn round outline xs12 sm6 color="primary darken-1" :disabled="!valid" @click="
  savemed(patient)">
                  Save <v-icon right dark>cloud_upload</v-icon>
                </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>

     <v-dialog v-model="testsdialog" max-width="600px">
      <template v-slot:activator="{ on }">
      <!--   <v-btn color="primary" dark v-on="on">Open Dialog</v-btn> -->
      </template>
      <v-card>
        <v-toolbar dark color="primary" class="elevation-0">
          <v-spacer></v-spacer>
            <v-toolbar-title>Laboratory Tests</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                   
      <v-flex xs12 sm12 md12>
                    <v-autocomplete
                      outline
                      v-bind:items="testTypes"
                      v-model="testRequest.testTypeIds"
                      label="Tests"
                      item-text="name"
                      item-value="id"
                      multiple chips
                      :rules="[value => !!value || 'A test is Required']">
                    </v-autocomplete>
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
            <v-btn round outline xs12 sm6 color="primary darken-1" :disabled="!valid" @click="
  savetests(patient)">
                  Save <v-icon right dark>cloud_upload</v-icon>
                </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
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
        column>
        <v-flex sm12>
          <v-layout row wrap>
            <v-flex xs12 sm12 md3>
              <v-img
              max-width = "250"
              aspect-ratio=1.05
              src="https://image.flaticon.com/icons/svg/1512/1512910.svg"
            >
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
                        <v-flex sm4 md4>
                        <p class="his_card_title">History</p>
                              <p class="his_card_description">{{item.description}}</p>
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
                  <v-btn class="his_card_button white--text" small title="Edit" color="green" :loading="loading" :disabled="!valid" outline @click="">
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
                      :dates="vitalDates"
                    />
                  </v-flex>
                  <v-flex sm12 md3>
                    <body-temp 
                      :bodyTemperature="bodyTemperature"
                      :dates="vitalDates"
                    />
                  </v-flex>
                  <v-flex sm12 md3>
                    <heart-rate 
                      :heartRate="heartRate"
                      :dates="vitalDates"
                    />
                  </v-flex>
                  <v-flex sm12 md3>
                    <respiratory-rate
                      :respiratoryRate="respiratoryRate"
                      :dates="vitalDates"
                    />
                  </v-flex>
                  
                </v-layout>
              </div>
            </v-tab-item>
            <v-tab
              ripple
            >
              Visits
            </v-tab>
            <v-tab-item
            >
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
                    <v-btn class="his_card_button white--text" small title="Edit" color="green" :loading="loading" :disabled="!valid" outline @click="">
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
                              <v-btn dark class="his_card_button" small title="Edit" color="brown" outline @click="requestTest(patient)">
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
                      <v-btn dark class="his_card_button" small title="Edit" color="black" flat outline  @click="">
                        <v-icon left dark>directions_walk</v-icon>
                          View All Visits
                      </v-btn>
                    </div>
                  </div>
              </v-flex>
            </v-layout>
              
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
              Diagnosis
            </v-tab>
            <v-tab-item
            >
  <div class="his_card_no_shadow mt-3 pa-2">
                <v-layout
                  row
                  wrap>
                  <v-flex sm12 md4 lg4>
                    <div class="his_card_new_patient">
                      <p class="his_card_main_heading">Add New</p>

                      <div class="his_card_footer">
                        <v-btn class="his_card_button white--text" small title="Edit" color="green" :loading="loading" :disabled="!valid" outline @click = "vit(patient)">
                          <v-icon left dark>add_circle</v-icon> Add
                        </v-btn>
                      </div>
                    </div>
                  </v-flex>
                <v-flex xs12 sm12 md6 v-for="items in item" :key="items.id" >
                    <div class="his_card">
                      <p class="his_card_main_heading">{{items.description}} </p>
                      <p class="his_card_small_text">Date of Visit:{{items.created_at}}</p>

                    </div>
                  </v-flex>
                </v-layout>
              </div>
            </v-tab-item>
            <v-tab
              ripple
            >
            Lab Tests
            </v-tab>
            <v-tab-item
            >
  <div class="his_card_no_shadow mt-3 pa-2">
                <v-layout
                  row
                  wrap>
                  <v-flex sm12 md4 lg4>
                    <div class="his_card_new_patient">
                      <p class="his_card_main_heading">Add New</p>
                        <v-form
                            ref="form"
                            v-model="valid"
                            lazy-validation
                        >
                          <v-layout row wrap>
                            <v-flex sm12 md12>
          
                            </v-flex>
                          </v-layout>
                      </v-form>
                      <div class="his_card_footer">
                        <v-btn class="his_card_button white--text" small title="Edit" color="green" :loading="loading" :disabled="!valid" outline @click="lab(patient)">
                          <v-icon left dark>add_circle</v-icon>
                          Add
                        </v-btn>
                      </div>
                    </div>
                  </v-flex>
               <v-flex xs12 sm12 md6 v-for="Tests in tests" :key="Tests.id" >
                    <div class="his_card">
                      <p class="his_card_main_heading">Test Type:{{Tests.test_type.name}}</p>
                      <p class="his_card_main_heading">Test Status:{{Tests.test_status.name}}</p>
                      <p class="his_card_small_text">Date of Visit:{{Tests.created_at}}</p>

                    </div>
                  </v-flex>
                </v-layout>
              </div>
            </v-tab-item>

            <v-tab
              ripple
            >
              Medication
            </v-tab>
            <v-tab-item
            >
  <div class="his_card_no_shadow mt-3 pa-2">
                <v-layout
                  row
                  wrap>
                  <v-flex sm12 md4 lg4>
                    <div class="his_card_new_patient">
                      <p class="his_card_main_heading">Add New</p>
                        <v-form
                            ref="form"
                            v-model="valid"
                            lazy-validation
                        >
                          <v-layout row wrap>
                            <v-flex sm12 md12>
          
                            </v-flex>
                          </v-layout>
                      </v-form>
                      <div class="his_card_footer">
                        <v-btn class="his_card_button white--text" small title="Edit" color="green" :loading="loading" :disabled="!valid" outline @click="med(patient)">
                          <v-icon left dark>add_circle</v-icon>
                          Add
                        </v-btn>
                      </div>
                    </div>
                  </v-flex>



               <v-flex xs12 sm12 md6 v-for="meds in prescription" :key="meds.id" >
                    <div class="his_card">
                      <p class="his_card_main_heading">{{meds.drugs}}</p>
                      <p class="his_card_small_text">Date of Visit:{{meds.created_at}}</p>




                    </div>
                  </v-flex>
                </v-layout>
              </div>
            </v-tab-item>
            <v-tab
              ripple
            >
              Allergies
            </v-tab>
            <v-tab-item
            >
              <div class="his_card_no_shadow mt-3 pa-2">
                <v-layout
                  row
                  wrap>
                  <v-flex sm12 md4 lg4>
                    <div class="his_card_new_patient">
                      <p class="his_card_main_heading">Add New</p>
                        <v-form
                            ref="form"
                            v-model="valid"
                            lazy-validation
                        >
                          <v-layout row wrap>
                            <v-flex sm12 md12>
                              <v-select
                                :items="allergies"
                                v-model="newallergy"
                                item-value="id"
                                item-text="substance"
                                label="Allergy"
                              ></v-select>
                            </v-flex>
                          </v-layout>
                      </v-form>
                      <div class="his_card_footer">
                        <v-btn class="his_card_button white--text" small title="Edit" color="green" :loading="loading" :disabled="!valid" outline @click="saveAllergy">
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

            <v-tab
              ripple
            >
              Billing
            </v-tab>
            <v-tab-item
            >
              <div class="his_card_no_shadow mt-3 pa-2">
                <v-layout
                  row
                  wrap>
                   <v-flex sm12 md4 lg4>
                    <v-btn color="primary" to="/billing/billing" dark class="mb-2" outline>Generate Bill
                  <v-icon right dark>payment</v-icon>
                </v-btn>
              </v-flex>
                    <v-data-table
          :headers="headers"
          :items="data"
          :loading="loader"
          class="elevation-1"
        >
        <template v-slot:items="props">
          <td>{{ props.item.id }}</td>
          <td class="text-xs-left">{{ props.item.date }}</td>
          <td @click="viewInvoice(props.item)" class="text-xs-left">{{ props.item.number }}</td>
          <td class="text-xs-left">{{ props.item.patient.name.text }} {{ props.item.patient.name.family }}</td>
          <td class="text-xs-left">{{ props.item.due_date }}</td>
          <td class="text-xs-right">{{ props.item.total }}</td>
          <td class="text-xs-right">{{ props.item.status }}</td>
          <td class="justify-center layout px-0">
          <v-btn
            outline
            small
            title="Edit"
            color="teal"
            flat
            @click="editItem(props.item)">
            Edit
            <v-icon right dark>edit</v-icon>
          </v-btn>
            <v-btn
            outline
            small
            title="Delete"
            color="pink"
            flat
            @click="deleteItem(props.item)">
            Delete
            <v-icon right dark>delete</v-icon>
          </v-btn>
        </td>
        </template>
        <template slot="footer">
          <td>
            <strong>Total</strong>
          </td>
          <td class="text-xs-right" :colspan="headers.length-1">
            <strong>{{total}}</strong>
          </td>
        </template>
      </v-data-table>

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
  import HeartRate from '@/components/Charts/HeartRate.vue'
  import BloodPressure from '@/components/Charts/BloodPressure.vue'
  import BodyTemp from '@/components/Charts/BodyTemp.vue'
  import RespiratoryRate from '@/components/Charts/RespiratoryRate.vue'
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
        tests:[],
        visits: 30,
        snackbar: false,
        y: 'top',
        color: 'primary',
        message: '',
        screenDialog: false,
        billDialog:false,
        dialog: false,
        meddialog:false,
        testsdialog:false,
        patient:{},
        generateBill: {
        
        patient_id: '',
        date: '',
        price: '',
        quantity: '',
        date: ''
      },
          testRequest: {
        patient_id: '',
        testTypeIds: [],
      },
        allergies: [],
        prescription:[],
        diagnosis:{

    patient_id:'',
   description:'',

        },
        vitals:[],
        prescription:[],
          drugs: [],
testTypeIds:[],
testTypes:[],
      item:[],
            editedItem: {
        
        patient_id: '',

        drugs:[],

      },
      description:'',
            headers: [
              {
                text: 'ID',
                align: 'left',
                sortable: false,
                value: 'id'
              },
              { text: 'Date', align: 'left', value: 'date' },
              { text: 'Number', align: 'left', value: 'number' },
              { text: 'Patient', align: 'left', value: 'customer' },
              { text: 'Due Date', align: 'left', value: 'due_date' },
              { text: 'Total', align: 'right', value: 'total' },
              { text: 'Status', align: 'right', value: 'status' },
               { text: 'Actions', align: 'center', value: 'actions' },
            ],
        newallergy: '',
          newdiagnosis: '',
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

        loadingMethod(load, message="") {
        this.loadingDialog.loading = load;
        this.loadingDialog.message = message
      },
          Diagnosis(patient){
        this.dialog = true
        this.editedItem.patient_id = patient.id
      },
      initialize(){
        this.message = "Loading Patient Data"
        this.screenDialog = true
        apiCall({url: '/api/patient/' + this.$route.params.id, method: 'GET' })
        .then(resp => {
          console.log(resp)
          this.patient = resp;
          console.log(   "The patient is",patient.id)
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

          apiCall({url: '/api/labtesttype', method: 'GET' })
          .then(resp => {
            console.log("Test Types are: ",resp)
            this.testTypes = resp.data;
        }).catch(error => {
            console.log(error.response)
        })

          apiCall({url: '/api/diagnosis/' + this.$route.params.id, method: 'GET' })
        .then(resp => {
          console.log("diagnosis", resp)
          this.item = resp;
           console.log("diagnosis item",  this.item)
        })
        .catch(error => {
          console.log(error.response)
        })
         apiCall({url: '/api/medications/' + this.$route.params.id, method: 'GET' })
        .then(resp => {
          console.log("The Prescriptions are",resp)
          this.prescription =  resp;
          this.loader = false
        })
        .catch(error => {
          console.log(error.response)
        })


        apiCall({url: '/api/drugs?', method: 'GET' })
        .then(resp => {
          console.log(resp)
          this.drugs = resp;
          this.loader = false
      
        })
        .catch(error => {
          console.log(error.response)
        })

       
       apiCall({url: '/api/tests?', method: 'GET' })
        .then(resp => {
          console.log(resp)
          this.tests = resp.data;
          this.loader = false
      
        })
        .catch(error => {
          console.log(error.response)
        })
       


         apiCall({url: '/api/vitalsigns/' + this.$route.params.id, method: 'GET' })
        .then(resp => {
          console.log("Vitals", resp)
          this.vitals = resp[0];
          //console.log("bloodPressure is", Object.keys(resp).length)
          var i;
          for (i = 0; i < Object.keys(resp).length; i++) {
            this.bloodPressure[Object.keys(resp)[i]] = resp[Object.keys(resp)[i]].blood_pressure;
            this.heartRate[Object.keys(resp)[i]] = resp[Object.keys(resp)[i]].heart_rate;
            this.respiratoryRate[Object.keys(resp)[i]] = resp[Object.keys(resp)[i]].respiratory_rate;
            this.bodyTemperature[Object.keys(resp)[i]] = resp[Object.keys(resp)[i]].body_temperature;
            this.vitalDates[Object.keys(resp)[i]] = resp[Object.keys(resp)[i]].created_at;
            console.log("The Date is",    this.vitals)
          };

        })
        .catch(error => {
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
      },

      saveDiagnosis(){
        if(this.$refs.form.validate()){
            this.allergyloading = true
            apiCall({url: '/api/patient/'+this.patient.id+'/diagnosis/'+this.description, method: 'GET' })
            .then(resp => {
              console.log("allergy response", resp)
              this.patient.diagnosis =resp.diagnosis
              this.allergyloading = false
              this.message = 'Allergy Added Succesfully';
              this.snackbar = true;
            })
            .catch(error => {
              this.allergyloading = false
              console.log(error.response)
            })
        }
      },

           close () {
        this.dialog = false
 
        this.meddialog= false
        this.testsdialog= false
        // if not saving reset dialog references to datatables
   
      },

        vit(patient){
        this.dialog = true
        this.diagnosis.patient_id = patient.id
      },
        med(patient){
        this.meddialog = true
        this.editedItem.patient_id = patient.id
      },
        lab(patient){
        this.testsdialog = true
        this.testRequest.patient_id = patient.id

              console.log('Test Patient id is',patient.id)
      },
      patientDetails(patient){
        this.patient = patient
        console.log("Patient is",this.patient)
      },
   
      editItem (item) {
        this.editedIndex = this.prescription.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
        this.editedItem.patient_id = this.$route.params.id
       
            console.log("Patient ID is",this.patient.id)
      },
      BillItem (item) {
        this.editedIndex = this.prescription.indexOf(item)
        this.generateBill = Object.assign({}, item)
        this.billDialog = true

      },
      resetDialogReferences() {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      },
  savetests(patient) {
        if(this.$refs.form.validate()){
            this.loading = true
            apiCall({url: '/api/tests', data: this.testRequest, method: 'POST' })
            .then(resp => {
              this.loading = false
              console.log("Patient id is", this.testRequest.patient_id )
              EventBus.$emit('update-test-list', resp);
                 this.resetDialogReferences();
              this.saving = false;
              this.message = 'New Test Added  Succesfully';
              this.snackbar = true;
              this.testsdialog = false
            })
            .catch(error => {
              this.loading = false
              console.log(error.response)
            })
          this.close()
          this.resetDialogReferences()
        }
      },
  savemed(patient) {

        this.saving = true;
        // update
        if (this.editedIndex > -1) {
          if(this.$refs.form.validate()){
            this.loadingMethod(true, "Updating Patient Diagnosis")
            this.loading = true
            apiCall({url: '/api/diagnosis/'+this.editedItem.id, data: this.editedItem, method: 'PUT' })
            .then(resp => {
              Object.assign(this.diagnosis[this.editedIndex], this.editedItem)
              console.log(resp)
              this.resetDialogReferences();
              this.saving = false;
              this.message = 'Patient Prescription Updated Succesfully';
              this.snackbar = true;
            })
            .catch(error => {
              console.log(error.response)
            })
            this.close()
          }
        // store
        } else {
          if(this.$refs.form.validate()){
            apiCall({url: '/api/medications', data: this.editedItem, method: 'POST' })
            .then(resp => {

              this.prescription.push(resp)
              console.log("Post This",    this.editedItem.patient_id)
              this.resetDialogReferences();
              this.saving = false;
              this.meddialog = false
              this.message = 'New Prescription Added Succesfully';
              this.snackbar = true;
            })
            .catch(error => {
              console.log(error.response)
            })
            this.close()
          }
        }
      },








      save (patient) {

        this.saving = true;
        // update
        if (this.editedIndex > -1) {
          if(this.$refs.form.validate()){
            apiCall({url: '/api/diagnosis/'+this.editedItem.id, data: this.editedItem, method: 'PUT' })
            .then(resp => {
              Object.assign(this.diagnosis[this.editedIndex], this.editedItem)
              console.log(resp)
              this.resetDialogReferences();
              this.saving = false;
              this.message = 'Patient Prescription Updated Succesfully';
              this.snackbar = true;
            })
            .catch(error => {
              console.log(error.response)
            })
            this.close()
          }
        // store
        } else {
          if(this.$refs.form.validate()){
            apiCall({url: '/api/diagnosis', data: this.diagnosis, method: 'POST' })
            .then(resp => {

              this.diagnosis.push(resp)
              console.log("Post This",    this.editedItem.patient_id)
              this.resetDialogReferences();
              this.saving = false;
              this.dialog = false
              this.message = 'New Diagnosis Added Succesfully';
              this.snackbar = true;
            })
            .catch(error => {
              console.log(error.response)
            })
            this.close()
          }
        }
      },

    },
    computed: {
      visitLength: function() {
        return Math.ceil(this.visitsPagination.total / this.visitsPagination.per_page);
      },
      frontEndDateFormat: function(date) {
            return moment(this.vitalDates, 'YYYY-MM-DD').format('DD/MM/YYYY');
          },
      startDate () {
    return moment( this.vitalDates).format('YYYY-MM-DD')
  },
    }
  }
</script>
