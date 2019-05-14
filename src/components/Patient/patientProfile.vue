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
        column>
        <v-flex sm12>
          <v-layout row wrap>
            <v-flex xs12 sm12 md3>
              <v-img
              max-width = "250"
              aspect-ratio=1.05
              src="http://www.personalbrandingblog.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png"
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
                              <p class="his_card_description">87kgs</p>
                            </v-flex>
                            <v-flex sm4 md4>
                              <p class="his_card_title">Height</p>
                              <p class="his_card_description">176cms</p>
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
                    />
                  </v-flex>
                  <v-flex sm12 md3>
                    <body-temp 
                      :bodyTemperature="bodyTemperature"
                    />
                  </v-flex>
                  <v-flex sm12 md3>
                    <heart-rate 
                      :heartRate="heartRate"
                    />
                  </v-flex>
                  <v-flex sm12 md3>
                    <respiratory-rate
                      :respiratoryRate="respiratoryRate"
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
            <v-tab
              ripple
            >
              History
            </v-tab>
            <v-tab-item
            >
              <div class="his_card_no_shadow mt-3 pa-2">
                <v-card-title>
                  <p class="headline">
                    Family History
                  </p>
                  <v-spacer></v-spacer>
                </v-card-title>
                  <template>
                    <swiper v-if="patient" :options="swiperOption">
                      <swiper-slide>
                        <div class="his_card_new_patient">
                        <p class="his_card_main_heading">Add New</p>
                          <v-form
                              ref="familyHistoryForm"
                              v-model="valid"
                              lazy-validation
                          >
                            <v-layout row wrap>
                              <v-flex sm6 md6>
                                <v-select
                                  :items="conditiontype"
                                  v-model="familyHistory.condition_type_id"
                                  item-value="id"
                                  item-text="description"
                                  label="Condition Type"
                                ></v-select>
                              </v-flex>
                              <v-flex sm6 md6>
                                <v-select
                                  :items="familyRelations"
                                  v-model="familyHistory.relation_id"
                                  item-value="id"
                                  item-text="display"
                                  label="Relation"
                                ></v-select>
                              </v-flex>
                              <v-flex xs12 sm6 md6>
                                <v-menu>
                                  <v-text-field
                                    :rules="inputRules"
                                    :value="formattedStartDate"
                                    slot="activator"
                                    label="Start Date"
                                    prepend-inner-icon="date_range"
                                  >
                                  </v-text-field>
                                  <v-date-picker v-model="familyHistory.start_date"></v-date-picker>
                                </v-menu>
                              </v-flex>
                              <v-flex xs12 sm6 md6>
                                <v-menu>
                                  <v-text-field
                                    :rules="inputRules"
                                    :value="formattedEndDate"
                                    slot="activator"
                                    label="End Date"
                                    prepend-inner-icon="date_range"
                                  >
                                  </v-text-field>
                                  <v-date-picker v-model="familyHistory.end_date"></v-date-picker>
                                </v-menu>
                              </v-flex>
                              <v-flex sm12 md12>
                                <v-text-field
                                  label="Description"
                                  :rules="inputRules"
                                  v-model="familyHistory.description"
                                ></v-text-field>
                              </v-flex>
                            </v-layout>
                        </v-form>
                        <div class="his_card_footer">
                          <v-btn class="his_card_button white--text" small title="Edit" color="green" :loading="loading" :disabled="!valid" round @click="saveFamilyHistory">
                            <v-icon left dark>add_circle</v-icon>
                            Add
                          </v-btn>
                        </div>
                      </div>
                      </swiper-slide>
                      <swiper-slide v-for="(history,index) in patient.family_history" :key="history.id">
                        <div class="his_card">
                          <p class="his_card_main_heading">{{ history.condition_type.description }}</p>
                          <p class="his_card_title">Relation</p>
                          <p class="his_card_description">{{ history.relation.display }}</p>
                          <p class="his_card_title">Description</p>
                          <p class="his_card_description">{{ history.description }}</p>
                          <p class="his_card_title">Start Date</p>
                          <p class="his_card_description">{{ history.start_date }}</p>
                          <p class="his_card_title">End Date</p>
                          <p class="his_card_description">{{ history.end_date }}</p>
                        </div>
                      </swiper-slide>
                      <div class="swiper-pagination" slot="pagination"></div>
                    </swiper>
                    <div class="swiper-button-prev"></div>
                    <div class="swiper-button-next"></div>
                  </template>
                  <!-- <v-flex xs12 sm12 md4 v-for="(history,index) in patient.family_history" :key="history.id">
                    <div class="his_card">
                      <p class="his_card_main_heading">{{ history.condition_type.description }}</p>
                      <p class="his_card_title">Relation</p>
                      <p class="his_card_description">{{ history.relation.display }}</p>
                      <p class="his_card_title">Description</p>
                      <p class="his_card_description">{{ history.description }}</p>
                    </div>
                  </v-flex> -->
               
              </div>
              <div class="his_card_no_shadow mt-3 pa-2">
                <v-card-title>
                  <p class="headline">
                    Social History
                  </p>
                  <v-spacer></v-spacer>
                </v-card-title>
                  <template>
                    <swiper v-if="patient" :options="swiperSocialOption">
                      <swiper-slide>
                        <div class="his_card_new_patient">
                        <p class="his_card_main_heading">Add New</p>
                          <v-form
                              ref="socialHistoryForm"
                              v-model="valid"
                              lazy-validation
                          >
                            <v-layout row wrap>
                              <v-flex sm12 md12>
                                <v-text-field
                                  label="Social Problem"
                                  :rules="inputRules"
                                  v-model="socialHistory.social_problem"
                                ></v-text-field>
                              </v-flex>
                              <v-flex xs12 sm6 md6>
                                <v-menu>
                                  <v-text-field
                                    :rules="inputRules"
                                    :value="formattedSocialStartDate"
                                    slot="activator"
                                    label="Start Date"
                                    prepend-inner-icon="date_range"
                                  >
                                  </v-text-field>
                                  <v-date-picker v-model="socialHistory.start_date"></v-date-picker>
                                </v-menu>
                              </v-flex>
                              <v-flex xs12 sm6 md6>
                                <v-menu>
                                  <v-text-field
                                    :rules="inputRules"
                                    :value="formattedSocialEndDate"
                                    slot="activator"
                                    label="End Date"
                                    prepend-inner-icon="date_range"
                                  >
                                  </v-text-field>
                                  <v-date-picker v-model="socialHistory.end_date"></v-date-picker>
                                </v-menu>
                              </v-flex>
                            </v-layout>
                        </v-form>
                        <div class="his_card_footer">
                          <v-btn class="his_card_button white--text" small title="Edit" color="green" :loading="socialloading" :disabled="!valid" round @click="saveSocialHistory">
                            <v-icon left dark>add_circle</v-icon>
                            Add
                          </v-btn>
                        </div>
                      </div>
                      </swiper-slide>
                      <swiper-slide v-for="(social,index) in patient.social_history" :key="social.id">
                        <div class="his_card">
                          <p class="his_card_main_heading">{{ social.social_problem }}</p>
                          <p class="his_card_title">Start Date</p>
                          <p class="his_card_description">{{ social.start_date }}</p>
                          <p class="his_card_title">End Date</p>
                          <p class="his_card_description">{{ social.end_date }}</p>
                        </div>
                      </swiper-slide>
                      <div class="swiper-pagination" slot="pagination"></div>
                    </swiper>
                    <div class="swiper-social-button-prev"></div>
                    <div class="swiper-social-button-next"></div>
                  </template>
                  <!-- <v-flex xs12 sm12 md4 v-for="(history,index) in patient.family_history" :key="history.id">
                    <div class="his_card">
                      <p class="his_card_main_heading">{{ history.condition_type.description }}</p>
                      <p class="his_card_title">Relation</p>
                      <p class="his_card_description">{{ history.relation.display }}</p>
                      <p class="his_card_title">Description</p>
                      <p class="his_card_description">{{ history.description }}</p>
                    </div>
                  </v-flex> -->
               
              </div>
              <div class="his_card_no_shadow mt-3 pa-2">
                <v-card-title>
                  <p class="headline">
                    Environmental History
                  </p>
                  <v-spacer></v-spacer>
                </v-card-title>
                  <template>
                    <swiper v-if="patient" :options="swiperSocialOption">
                      <swiper-slide>
                        <div class="his_card_new_patient">
                        <p class="his_card_main_heading">Add New</p>
                          <v-form
                              ref="environmentalHistoryForm"
                              v-model="valid"
                              lazy-validation
                          >
                            <v-layout row wrap>
                              <v-flex sm12 md12>
                                <v-text-field
                                  label="Environmental Problem"
                                  :rules="inputRules"
                                  v-model="environmentalHistory.description"
                                ></v-text-field>
                              </v-flex>
                              <v-flex xs12 sm6 md6>
                                <v-menu>
                                  <v-text-field
                                    :rules="inputRules"
                                    :value="formattedEnvironmentalStartDate"
                                    slot="activator"
                                    label="Start Date"
                                    prepend-inner-icon="date_range"
                                  >
                                  </v-text-field>
                                  <v-date-picker v-model="environmentalHistory.start_date"></v-date-picker>
                                </v-menu>
                              </v-flex>
                              <v-flex xs12 sm6 md6>
                                <v-menu>
                                  <v-text-field
                                    :rules="inputRules"
                                    :value="formattedEnvironmentalEndDate"
                                    slot="activator"
                                    label="End Date"
                                    prepend-inner-icon="date_range"
                                  >
                                  </v-text-field>
                                  <v-date-picker v-model="environmentalHistory.end_date"></v-date-picker>
                                </v-menu>
                              </v-flex>
                            </v-layout>
                        </v-form>
                        <div class="his_card_footer">
                          <v-btn class="his_card_button white--text" small title="Edit" color="green" :loading="environmentalloading" :disabled="!valid" round @click="saveEnvironmentalHistory">
                            <v-icon left dark>add_circle</v-icon>
                            Add
                          </v-btn>
                        </div>
                      </div>
                      </swiper-slide>
                      <swiper-slide v-for="(environmental,index) in patient.environmental_history" :key="environmental.id">
                        <div class="his_card">
                          <p class="his_card_main_heading">{{ environmental.description }}</p>
                          <p class="his_card_title">Start Date</p>
                          <p class="his_card_description">{{ environmental.start_date }}</p>
                          <p class="his_card_title">End Date</p>
                          <p class="his_card_description">{{ environmental.end_date }}</p>
                        </div>
                      </swiper-slide>
                      <div class="swiper-pagination" slot="pagination"></div>
                    </swiper>
                    <div class="swiper-social-button-prev"></div>
                    <div class="swiper-social-button-next"></div>
                  </template>
                  <!-- <v-flex xs12 sm12 md4 v-for="(history,index) in patient.family_history" :key="history.id">
                    <div class="his_card">
                      <p class="his_card_main_heading">{{ history.condition_type.description }}</p>
                      <p class="his_card_title">Relation</p>
                      <p class="his_card_description">{{ history.relation.display }}</p>
                      <p class="his_card_title">Description</p>
                      <p class="his_card_description">{{ history.description }}</p>
                    </div>
                  </v-flex> -->
               
              </div>
              <div class="his_card_no_shadow mt-3 pa-2">
                <v-card-title>
                  <p class="headline">
                    Smoking & Alcohol History
                  </p>
                  <v-spacer></v-spacer>
                </v-card-title>
                  <template>
                    <swiper v-if="patient" :options="swiperSocialOption">
                      <swiper-slide>
                        <div class="his_card_new_patient">
                        <p class="his_card_main_heading">Add New</p>
                          <v-form
                              ref="habitHistoryForm"
                              v-model="valid"
                              lazy-validation
                          >
                            <v-layout row wrap>
                              <v-flex sm12 md12>
                                <v-select
                                  :items="habits"
                                  v-model="habitHistory.type"
                                  item-value="name"
                                  item-text="name"
                                  label="Habit"
                                ></v-select>
                              </v-flex>
                              <v-flex sm12 md12>
                                <v-text-field
                                  label="Kind"
                                  :rules="inputRules"
                                  v-model="habitHistory.kind"
                                ></v-text-field>
                              </v-flex>
                              <v-flex sm12 md6>
                                <v-text-field
                                  label="Frequency"
                                  :rules="inputRules"
                                  v-model="habitHistory.frequency"
                                ></v-text-field>
                              </v-flex>
                              <v-flex sm12 md6>
                                <v-text-field
                                  label="Quantity"
                                  :rules="inputRules"
                                  v-model="habitHistory.quantity"
                                ></v-text-field>
                              </v-flex>
                              <v-flex xs12 sm6 md6>
                                <v-menu>
                                  <v-text-field
                                    :rules="inputRules"
                                    :value="formattedHabitsStartDate"
                                    slot="activator"
                                    label="Start Date"
                                    prepend-inner-icon="date_range"
                                  >
                                  </v-text-field>
                                  <v-date-picker v-model="habitHistory.start_date"></v-date-picker>
                                </v-menu>
                              </v-flex>
                              <v-flex xs12 sm6 md6>
                                <v-menu>
                                  <v-text-field
                                    :rules="inputRules"
                                    :value="formattedHabitsEndDate"
                                    slot="activator"
                                    label="End Date"
                                    prepend-inner-icon="date_range"
                                  >
                                  </v-text-field>
                                  <v-date-picker v-model="habitHistory.end_date"></v-date-picker>
                                </v-menu>
                              </v-flex>
                            </v-layout>
                        </v-form>
                        <div class="his_card_footer">
                          <v-btn class="his_card_button white--text" small title="Edit" color="green" :loading="habitloading" :disabled="!valid" round @click="saveHabitHistory">
                            <v-icon left dark>add_circle</v-icon>
                            Add
                          </v-btn>
                        </div>
                      </div>
                      </swiper-slide>
                      <swiper-slide v-for="(smoking,index) in patient.smoking_history" :key="smoking.id">
                        <div class="his_card">
                          <p class="his_card_main_heading">Smoking</p>
                          <p class="his_card_title">Kind</p>
                          <p class="his_card_description">{{ smoking.kind }}</p>
                          <p class="his_card_title">Frequency</p>
                          <p class="his_card_description">{{ smoking.frequency }}</p>
                          <p class="his_card_title">Quantity</p>
                          <p class="his_card_description">{{ smoking.quantity }}</p>
                          <p class="his_card_title">Start Date</p>
                          <p class="his_card_description">{{ smoking.start_date }}</p>
                          <p class="his_card_title">End Date</p>
                          <p class="his_card_description">{{ smoking.end_date }}</p>
                        </div>
                      </swiper-slide>
                      <swiper-slide v-for="(alcohol,index) in patient.alcohol_history" :key="alcohol.id">
                        <div class="his_card">
                          <p class="his_card_main_heading">Alcohol</p>
                          <p class="his_card_title">Kind</p>
                          <p class="his_card_description">{{ alcohol.kind }}</p>
                          <p class="his_card_title">Frequency</p>
                          <p class="his_card_description">{{ alcohol.frequency }}</p>
                          <p class="his_card_title">Quantity</p>
                          <p class="his_card_description">{{ alcohol.quantity }}</p>
                          <p class="his_card_title">Start Date</p>
                          <p class="his_card_description">{{ alcohol.start_date }}</p>
                          <p class="his_card_title">End Date</p>
                          <p class="his_card_description">{{ alcohol.end_date }}</p>
                        </div>
                      </swiper-slide>
                      <div class="swiper-pagination" slot="pagination"></div>
                    </swiper>
                    <div class="swiper-social-button-prev"></div>
                    <div class="swiper-social-button-next"></div>
                  </template>
                  <!-- <v-flex xs12 sm12 md4 v-for="(history,index) in patient.family_history" :key="history.id">
                    <div class="his_card">
                      <p class="his_card_main_heading">{{ history.condition_type.description }}</p>
                      <p class="his_card_title">Relation</p>
                      <p class="his_card_description">{{ history.relation.display }}</p>
                      <p class="his_card_title">Description</p>
                      <p class="his_card_description">{{ history.description }}</p>
                    </div>
                  </v-flex> -->
               
              </div>
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
              <div class="his_card_no_shadow mt-3 pa-2">
                <v-layout
                  row
                  wrap>
                  <v-flex xs12 sm12 md4 v-for="(medication,index) in patient.medications" :key="medication.id">
                    <div class="his_card">
                      <p class="his_card_main_heading">{{ medication.drugs.trade_name }}</p>
                      <p class="his_card_title">Description</p>
                      <p class="his_card_description">{{ medication.dosage.description }}</p>
                      <p class="his_card_title">Start Date</p>
                      <p class="his_card_description">{{medication.start_time | moment("MMMM Do YYYY, h:mm:ss a")}}</p>
                      <p class="his_card_title">End Date</p>
                      <p class="his_card_description">{{medication.end_time | moment("MMMM Do YYYY")}}</p>
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

  import format from 'date-fns/format'
  import apiCall from '../../utils/api'
  import HeartRate from '@/components/Charts/HeartRate.vue'
  import BloodPressure from '@/components/Charts/BloodPressure.vue'
  import BodyTemp from '@/components/Charts/BodyTemp.vue'
  import RespiratoryRate from '@/components/Charts/RespiratoryRate.vue'
  import 'swiper/dist/css/swiper.css'
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  import Vue from 'vue'
  import VueMoment from 'vue-moment'
  Vue.use(VueMoment);

  export default {
    components: {
      HeartRate,
      BloodPressure,
      BodyTemp,
      RespiratoryRate,
      swiper,
      swiperSlide
    },
    data () {
      return {
        loading: false,
        socialloading: false,
        environmentalloading: false,
        habitloading: false,

        visitQuery: '',
        active: null,
        bodyTemperature: [36.1, 36.0, 36.8, 38, 37, 36.9],
        respiratoryRate: [12, 17, 21, 15, 22, 18],
        heartRate: [80, 70, 81, 70, 87, 90],
        bloodPressure: [125, 130, 127, 126, 124, 130],
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
        allergies: [],
        conditions: [],
        familyRelations: [],
        newallergy: '',
        habits: [
          {name: 'Smoking'},
          {name: 'Alcohol'}
        ],
        habitHistory: {
          patient_id: this.$route.params.id,
          type: '',
          kind: '',
          frequency: '',
          start_date: '',
          end_date: ''
        },
        familyHistory: {
          condition_type_id: '',
          description: '',
          relation_id: '',
          patient_id: this.$route.params.id,
          start_date: '',
          end_date: ''
        },
        socialHistory: {
          patient_id: this.$route.params.id,
          social_problem: '',
          start_date: '',
          end_date: ''
        },
        environmentalHistory: {
          patient_id: this.$route.params.id,
          description: '',
          start_date: '',
          end_date: ''
        },
        visitsPagination: {
          page: 1,
          per_page: 0,
          total: 0,
          visible: 10
        },
        swiperOption: {
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
          breakpoints: {
            // when window width is >= 320px
            320: {
              slidesPerView: 1,
              spaceBetween: 50
            },
            // when window width is >= 480px
            480: {
              slidesPerView: 2,
              spaceBetween: 50
            },
            // when window width is >= 640px
            640: {
              slidesPerView: 2,
              spaceBetween: 50
            }
          },
          slidesPerView: 3,
          spaceBetween: 30,
          pagination: {
            el: '.swiper-pagination'
          }
        },
        swiperSocialOption: {
          navigation: {
            nextEl: '.swiper-social-button-next',
            prevEl: '.swiper-social-button-prev',
          },
          breakpoints: {
            // when window width is >= 320px
            320: {
              slidesPerView: 1,
              spaceBetween: 50
            },
            // when window width is >= 480px
            480: {
              slidesPerView: 2,
              spaceBetween: 50
            },
            // when window width is >= 640px
            640: {
              slidesPerView: 2,
              spaceBetween: 50
            }
          },
          slidesPerView: 3,
          spaceBetween: 30,
          pagination: {
            el: '.swiper-pagination'
          }
        },
        inputRules: [
          v => v.length >= !v  || 'Field is required'
        ],
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
        apiCall({url: '/api/allergy', method: 'GET' })
        .then(resp => {
          console.log("allergies", resp)
          this.allergies = resp;
        })
        .catch(error => {
          console.log(error.response)
        })
        apiCall({url: '/api/conditiontypes', method: 'GET' })
        .then(resp => {
          console.log("conditiontype", resp)
          this.conditiontype = resp;
        })
        .catch(error => {
          console.log(error.response)
        })
        apiCall({url: '/api/familyRelations', method: 'GET' })
        .then(resp => {
          console.log("familyRelations", resp)
          this.familyRelations = resp;
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
            this.loading = true
            apiCall({url: '/api/patient/'+this.patient.id+'/allergy/'+this.newallergy, method: 'GET' })
            .then(resp => {
              console.log("allergy response", resp)
              this.patient.allergies =resp.allergies
              this.loading = false
              this.message = 'Allergy Added Succesfully';
              this.snackbar = true;
            })
            .catch(error => {
              this.loading = false
              console.log(error.response)
            })
        }
      },
      saveHabitHistory(){
        if(this.habitHistory.type == "Smoking"){
          if(this.$refs.habitHistoryForm.validate()){
            this.habitloading = true
            apiCall({url: '/api/smoking', data: this.habitHistory, method: 'POST' })
            .then(resp => {
              console.log("Smoking history response", resp)
              this.patient.smoking_history.unshift(resp)
              this.habitloading = false
              this.message = 'Smoking History Added Succesfully';
              this.snackbar = true;
            })
            .catch(error => {
              this.habitloading = false
              console.log(error.response)
            })
          }
        }else{
          if(this.$refs.habitHistoryForm.validate()){
            this.habitloading = true
            apiCall({url: '/api/alcohol', data: this.habitHistory, method: 'POST' })
            .then(resp => {
              console.log("Alcohol history response", resp)
              this.patient.alcohol_history.unshift(resp)
              this.habitloading = false
              this.message = 'Alcohol History Added Succesfully';
              this.snackbar = true;
            })
            .catch(error => {
              this.habitloading = false
              console.log(error.response)
            })
          }
        }
      },
      saveFamilyHistory(){
        if(this.$refs.familyHistoryForm.validate()){
          this.loading = true
          apiCall({url: '/api/familyhistory', data: this.familyHistory, method: 'POST' })
          .then(resp => {
            console.log("family history response", resp)
            this.patient.family_history.unshift(resp)
            //this.patient.family_history =resp.family_history
            this.loading = false
            this.message = 'Family History Added Succesfully';
            this.snackbar = true;
          })
          .catch(error => {
            this.loading = false
            console.log(error.response)
          })
        }
      },
      saveSocialHistory(){
        if(this.$refs.socialHistoryForm.validate()){
          this.socialloading = true
          apiCall({url: '/api/socialhistory', data: this.socialHistory, method: 'POST' })
          .then(resp => {
            console.log("social history response", resp)
            this.patient.social_history.unshift(resp)
            //this.patient.family_history =resp.family_history
            this.socialloading = false
            this.message = 'Social History Added Succesfully';
            this.snackbar = true;
          })
          .catch(error => {
            this.socialloading = false
            console.log(error.response)
          })
        }
      },
      saveEnvironmentalHistory(){
        if(this.$refs.environmentalHistoryForm.validate()){
          this.environmentalloading = true
          apiCall({url: '/api/environmentalhistory', data: this.environmentalHistory, method: 'POST' })
          .then(resp => {
            console.log("environmental history response", resp)
            this.patient.environmental_history.unshift(resp)
            //this.patient.family_history =resp.family_history
            this.environmentalloading = false
            this.message = 'Environmental History Added Succesfully';
            this.snackbar = true;
          })
          .catch(error => {
            this.socialloading = false
            console.log(error.response)
          })
        }
      }
    },
    computed: {
      visitLength: function() {
        return Math.ceil(this.visitsPagination.total / this.visitsPagination.per_page);
      },
      formattedStartDate(){
        return this.familyHistory.start_date ? format(this.familyHistory.start_date, 'Do MMM YYYY') : ''
      },
      formattedEndDate(){
        return this.familyHistory.end_date ? format(this.familyHistory.end_date, 'Do MMM YYYY') : ''
      },
      formattedSocialStartDate(){
        return this.socialHistory.start_date ? format(this.socialHistory.start_date, 'Do MMM YYYY') : ''
      },
      formattedSocialEndDate(){
        return this.socialHistory.end_date ? format(this.socialHistory.end_date, 'Do MMM YYYY') : ''
      },
      formattedEnvironmentalStartDate(){
        return this.environmentalHistory.start_date ? format(this.environmentalHistory.start_date, 'Do MMM YYYY') : ''
      },
      formattedEnvironmentalEndDate(){
        return this.environmentalHistory.end_date ? format(this.environmentalHistory.end_date, 'Do MMM YYYY') : ''
      },
      formattedHabitsStartDate(){
        return this.habitHistory.start_date ? format(this.habitHistory.start_date, 'Do MMM YYYY') : ''
      },
      formattedHabitsEndDate(){
        return this.habitHistory.end_date ? format(this.habitHistory.end_date, 'Do MMM YYYY') : ''
      }
    }
  }
</script>