<template>
  <div id="anc">
    <div class="content">
      <div class="top-bar">

        <template>
    
            <div class="navigation">
                <v-btn class="tablink" @click ="registrationDialog = true">Out-Patient Registration</v-btn>
                <v-btn class="tablink" @click ="signsDialog = true" >Screening and Vital Signs</v-btn>
                <v-btn class="tablink" >Investigation</v-btn>
                <v-btn class="tablink" @click ="serviceDialog = true">Out-Patient Services</v-btn>
            </div>

          </template>


      </div>

      <!-- Out patient registration -->
        <v-dialog v-model="registrationDialog" max-width="600px">  
              <v-card>
                <v-toolbar dark color="primary" class="elevation-0">
                  <v-spacer></v-spacer>
                    <v-toolbar-title>Out-Patient Registration</v-toolbar-title>
                  <v-spacer></v-spacer>
                </v-toolbar>
                <v-form ref="registration
                form" v-model="valid" lazy-validation>
                  <v-card-text>
                    <v-container grid-list-md>
                      <v-layout wrap>
                     
                      <v-flex xs12 sm12 md12>
                            <v-select
                              single-line
                              :items="type"
                              v-model="register.ptype"
                              :rules="[v => !!v || 'New/Repeat']"  
                              label="Patient type">
                            </v-select>
                         </v-flex>
                                                      
                       
                         <v-flex xs12 sm12 md12>
                            <v-select
                              single-line
                              :items="type"
                              v-model="register.vtype"
                              :rules="[v => !!v || 'New/Repeat']"
                              
                              label="Type of visit for this condition/illness">
                            </v-select>
                        
                          </v-flex>                       

                      </v-layout>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn round outline color="blue lighten-1" flat @click.native="close">
                      Cancel
                      <v-icon right dark>close</v-icon>
                    </v-btn>
                    
                    <v-btn round outline xs12 sm6 color="primary darken-1" :disabled="!valid" @click.native="save" :loading="loading"  >
                      Save <v-icon right dark>cloud_upload</v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card>           

        </v-dialog>

        <!-- Screening and vital signs -->
         <v-dialog v-model="signsDialog" max-width="600px">  
              <v-card>
                <v-toolbar dark color="primary" class="elevation-0">
                  <v-spacer></v-spacer>
                    <v-toolbar-title>Screening and vital signs</v-toolbar-title>
                  <v-spacer></v-spacer>
                </v-toolbar>
                <v-form ref="signsform" v-model="valid" lazy-validation>
                  <v-card-text>
                    <v-container grid-list-md>
                      <v-layout wrap>
                        <v-flex xs12>
                          <v-text-field
                            v-model="signs.s_pressure"
                            :rules="[v => !!v || 'Blood pressure is Required']"
                            single-line
                            label="Blood pressure systolic reading"
                            required>
                          </v-text-field>
                        </v-flex>

                        <v-flex xs12>
                          <v-text-field
                            v-model="signs.d_pressure"
                            :rules="[v => !!v || 'Diastolic Pressure Reading is Required']"
                            single-line
                            label="Blood pressure diastolic reading"
                            required>
                          </v-text-field>
                        </v-flex>  

                        <v-flex xs12>
                          <v-text-field
                            v-model="signs.temperature"
                            :rules="[v => !!v || 'Temperature is required']"
                            single-line
                            label="Temperature(C)"
                            required>
                          </v-text-field>
                        </v-flex>

                        <v-flex xs12>
                          <v-text-field
                            v-model="signs.height"
                            :rules="[v => !!v || 'Height is Required']"
                            single-line
                            label="Height"
                            required>
                          </v-text-field>
                        </v-flex> 

                        <v-flex xs12>
                          <v-text-field
                            v-model="signs.weight"
                            :rules="[v => !!v || 'Weight is Required']"
                            single-line
                            label="Weight"
                            required>
                          </v-text-field>
                        </v-flex>

                         <v-flex xs12>
                          <v-text-field
                            v-model="signs.notes"
                            :rules="[v => !!v || 'Screening clinical notes Required']"
                            single-line
                            label="Screening Clinical Notes"
                            required>
                          </v-text-field>
                        </v-flex> 
                      

                      <v-flex xs12 sm12 md12>
                            <v-select
                              single-line
                              :items="supplement"
                              v-model="signs.supplementation"
                              :rules="[v => !!v || 'Supplementation provided is required']"
                              
                              label="Supplementation provided">
                            </v-select>
                        
                          </v-flex>

                          <v-flex xs12 sm12 md12>
                            <v-select
                              single-line
                              :items="eye"
                              v-model="signs.visual"
                              :rules="[v => !!v || 'Visual Deficit Required']"  
                              label="Visual Acuity Deficit">
                            </v-select>
                        </v-flex> 

                      <v-flex xs12 sm12 md12>
                            <v-select
                              single-line
                              :items="choice"
                              v-model="signs.fever"
                              :rules="[v => !!v || 'Yes/No']"  
                              label="Fever">
                            </v-select>
                        </v-flex>

                        <v-flex xs12 sm12 md12>
                            <v-select
                              single-line
                              :items="choice"
                              v-model="signs.hiv"
                              :rules="[v => !!v || 'Response is Required']"  
                              label="HIV test performed">
                            </v-select>
                        </v-flex>
                                                      
                       <v-flex xs12 sm12 md12>
                            <v-select
                              single-line
                              :items="choice"
                              v-model="signs.tb"
                              :rules="[v => !!v || 'Yes/No']"  
                              label="Screened for TB">
                            </v-select>
                        </v-flex> 



                      </v-layout>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn round outline color="blue lighten-1" flat @click.native="close">
                      Cancel
                      <v-icon right dark>close</v-icon>
                    </v-btn>
                    
                    <v-btn round outline xs12 sm6 color="primary darken-1" :disabled="!valid" @click.native="save" :loading="loading"  >
                      Save <v-icon right dark>cloud_upload</v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card>           

        </v-dialog>


        <!-- Out-Patient service Dialog -->
        <v-dialog v-model="serviceDialog" max-width="600px">  
              <v-card>
                <v-toolbar dark color="primary" class="elevation-0">
                  <v-spacer></v-spacer>
                    <v-toolbar-title>Out-Patient Service</v-toolbar-title>
                  <v-spacer></v-spacer>
                </v-toolbar>
                <v-form ref="serviceform" v-model="valid" lazy-validation>
                  <v-card-text>
                    <v-container grid-list-md>
                      <v-layout wrap>
                     
                      <v-flex xs12>
                          <v-text-field
                            v-model="service.condition"
                            :rules="[v => !!v || 'Condition assessment is Required']"
                            single-line
                            label="Assessment of Condition Presented"
                            required>
                          </v-text-field>
                        </v-flex> 

                        <v-flex xs12>
                          <v-text-field
                            v-model="service.m_diagnosis"
                            :rules="[v => !!v || 'Diagnosis is Required']"
                            single-line
                            label="Main Diagnosis"
                            required>
                          </v-text-field>
                        </v-flex>

                        <v-flex xs12>
                          <v-text-field
                            v-model="service.o_diagnosis"
                            :rules="[v => !!v || 'Other Diagnosis']"
                            single-line
                            label="Other Diagnosis"
                            required>
                          </v-text-field>
                        </v-flex>

                        <v-flex xs12>
                          <v-text-field
                            v-model="service.classification"
                            :rules="[v => !!v || 'Classification of Condition is Required']"
                            single-line
                            label="Condition Classification"
                            required>
                          </v-text-field>
                        </v-flex>


                        <v-flex xs12>
                          <v-text-field
                            v-model="service.treatment"
                            :rules="[v => !!v || 'Treatment is Required']"
                            single-line
                            label="Treatment"
                            required>
                          </v-text-field>
                        </v-flex>

                        <v-flex xs12>
                          <v-text-field
                            v-model="service.prescription_no"
                            :rules="[v => !!v || 'Prescription Number is Required']"
                            single-line
                            label="Prescription Number"
                            required>
                          </v-text-field>
                        </v-flex>

                        <v-flex xs12 sm12 md12>
                            <v-select
                              single-line
                              :items="outcome"
                              v-model="service.outcome"
                              :rules="[v => !!v || 'Treatment outcome is required']"
                              
                              label="Treatment Outcome">
                            </v-select>
                        </v-flex>

                      <v-flex xs12 sm12 md12>
                            <v-select
                              single-line
                              :items="choice"
                              v-model="service.referral_from"
                              :rules="[v => !!v || 'Yes/No']"  
                              label="Referred from another facility">
                            </v-select>
                         </v-flex>

                      <v-flex xs12 sm12 md12>
                            <v-select
                              single-line
                              :items="choice"
                              v-model="service.refer"
                              :rules="[v => !!v || 'Yes/No']"  
                              label="Was the patient referred?">
                            </v-select>
                         </v-flex>
                      
                      <!-- Referral to  -->
                      <v-flex xs12 sm12 md12>
                            <v-select
                              single-line
                              :items="referral"
                              v-model="service.referral_to"
                               
                              label="Referral to">
                            </v-select>
                         </v-flex>

                       <v-flex xs12 sm12 md12>
                            <v-select
                              single-line
                              :items="users"
                              item-text="username"
                              item-value="id"
                              v-model="service.user_id"
                        
                              label="Referred by">
                            </v-select>
                         </v-flex>
                                   
                      <v-flex xs12 sm12 md12>
                        <v-menu>
                          <v-text-field  single-line  :value="service.referred_date" slot="activator" label="Referral Date"></v-text-field>
                          <v-date-picker v-model="service.referred_date"></v-date-picker>
                        </v-menu>
                      </v-flex>                   
                       
                      <v-flex xs12>
                          <v-text-field
                            v-model="service.notes"
                            :rules="[v => !!v || 'Clinical Notes are Required']"
                            single-line
                            label="Clinical Notes"
                            required>
                          </v-text-field>
                        </v-flex> 


                      </v-layout>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn round outline color="blue lighten-1" flat @click.native="close">
                      Cancel
                      <v-icon right dark>close</v-icon>
                    </v-btn>
                    
                    <v-btn round outline xs12 sm6 color="primary darken-1" :disabled="!valid" @click.native="saveService" :loading="loading"  >
                      Save <v-icon right dark>cloud_upload</v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card>           

        </v-dialog>

        

      
    </div>
  </div>
</template>



<script>

  import format from 'date-fns/format';
  import apiCall from "../../utils/api";

  export default {
          data () {
            return {
              search: '',
              query: '',
              users: [],
              snackbar: false,
              message:'',
              user: [],
              y: 'top',
              color: 'success',
              valid: true,
              delete: false,
              loader: false,
              loading: false,
              loadingDialog: {
                loading: false,
                message: ""
              },
              dialog: false,
              productDialog: false,
              DetailsVue: false,
              registrationDialog: false,
              signsDialog: false,
              serviceDialog: false,
              referralDialog: false,
          
              inputRules: [
                v => v.length >= !v  || 'Field is required'
              ],
            

          type:['New','Repeat'],
          supplement:['Nutrition Education', 'Nutrition supplement', 'None'],
          choice:['Yes', 'No'],
          eye:['Right Eye', 'Left Eye', 'None'],
          outcome:['Continued', 'Cured', 'Treatment Continued', 'Treatment Success', 'Treatment Failure', 'Died'],
          referral:['Admit(inpatient)', 'Hospital', 'ObGyn', 'TB Clinic'],
          Users: [],
              
          register: {
                ptype:'',
                vtype:'',

              },

          signs: {
            s_pressure:'',
            temperature:'',
            weight:'',
            supplementation:'',
            fever:'',
            tb:'',
            d_pressure:'',
            height:'',
            notes:'',
            visual:'',
            hiv:'',
          },

          service: {
            condition:'',
            m_diagnosis:'',
            o_diagnosis:'',
            classification:'',
            treatment:'',
            prescription_no:'',
            outcome:'',
            referral_from:'',
            refer:'',
            referral_to:'',
            user_id:'',
            referred_date:'',
            notes:'',
          },   
       
  
      }
    },

  methods: {
        handleView(){
        },

         loadingMethod(load, message="") {
          this.loadingDialog.loading = load;
          this.loadingDialog.message = message
         },

        initialize(){

          this.loader=true
        
          apiCall({url: '/api/users', method: 'GET' })
          .then(resp => {
          console.log("users are")
          this.users = resp.data;
             this.loader=false
          this.pagination.per_page = resp.per_page;
          this.pagination.total = resp.total;
        })
        .catch(error => {
          console.log(error.response)
        });
         

        }


      },

      close () {
        this.productDialog = false
        // if not saving reset dialog references to datatables
        if (!this.saving) {
          this.resetDialogReferences();
        }
      },

      // components:{
      //   navigation,
      //   content 
      //   }, 
        created() {
          this.handleView();
        },

        save () {

        this.saving = true;
        // update
        // if (this.editedIndex > -1) {
          // this.loadingMethod(true, "Updating Screening and Vital Signs")
          if(this.$refs.signsform.validate()){

            this.loading = true
            apiCall({url: '/api/anc_signs', data:this.signs, method: 'POST' })
            .then(resp => {
              this.loading = false
              this.signsDialog = false
              this.saving = false;
              this.message = 'Signs Information Updated Succesfully';
              this.snackbar = true;

              // this.loadingMethod(false)
            })
            .catch(error => {
              this.loading = false
              console.log(this.item)
              // this.loadingMethod(false)
            })
            this.close()
          }
        // store
        // } 

      },


      //Service save function
      saveService () {

        this.saving = true;
        // update
        // if (this.editedIndex > -1) {
          // this.loadingMethod(true, "Updating Screening and Vital Signs")
          if(this.$refs.serviceform.validate()){

            this.loading = true
            apiCall({url: '/api/anc_service', data:this.service, method: 'POST' })
            .then(resp => {
              this.loading = false
              this.serviceDialog = false
              this.saving = false;
              this.message = 'Out-Patient service saved Succesfully';
              this.snackbar = true;

              // this.loadingMethod(false)
            })
            .catch(error => {
              this.loading = false
              // console.log(this.item)
              // this.loadingMethod(false)
            })
            this.close()
          }
        // store
        // } 

      },

      add(){
          this.loadingMethod(true, "Adding Screening and Vital Signs")
          if(this.$refs.signsform.validate()){
            this.loading = true
            apiCall({url: '/api/anc_signs', data: this.defaultSign, method: 'POST' })
            .then(resp => {
          
              // this.item.push(resp)
              // console.log("Post is:",this.item.push(resp))
              this.signsDialog = false
              this.resetDialogReferences();
              this.saving = false;
              this.message = 'Screening and Vital Signs Added Succesfully';
              this.snackbar = true;
              this.loadingMethod(false)
            })
            .catch(error => {
              this.loading = false
              console.log(error.response)
              this.loadingMethod(false)
            })
            this.close()
          }
      },

  
 
}  
</script>

