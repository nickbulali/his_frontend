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

    <v-dialog v-model="billDialog" max-width="500px">
      <template v-slot:activator="{ on }">
      <!--   <v-btn color="primary" dark v-on="on">Open Dialog</v-btn> -->
      </template>
      <v-card>
        <v-toolbar dark color="primary" class="elevation-0">
          <v-spacer></v-spacer>
            <v-toolbar-title>Generate Bill</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                   <v-flex xs12 sm12 md12>
                <v-autocomplete
                    outline
                    :items="patient"
                    item-text="name.text"
                    item-value="id"
                    label="Patients"
                    :rules="[v => !!v || 'Patient Name is Required']"
                    v-model="generateBill.patient_id"
                    >
                </v-autocomplete>
                </v-flex>

                <v-flex xs12 sm12 md12>
                <v-text-field
                 
                  outline
                  v-model="generateBill.patient_id"
                  item-text="name.text"
                  item-value="id"
                  :rules="[v => !!v || 'Patient Name is Required']"
                  label="Patient">    
                </v-text-field>
              </v-flex>
                <v-flex xs12 sm12 md12>
                <v-autocomplete
                
                    outline
                    :items="drugs"
                    item-text="generic_name"
                    item-value="id"
                    label="Drugs"
                    :rules="[v => !!v || 'Drug Name is Required']"
                    v-model="generateBill.drug_id"
                    >
                </v-autocomplete>
                </v-flex>
                <v-flex xs12 sm12 md12>
                <v-text-field
                
                  outline
                  v-model="generateBill.quantity"
                  :rules="[v => !!v || 'Quantity is Required']"
                  label="Quantity">    
                </v-text-field>
              </v-flex>

                                    <v-flex xs12 sm12 md12   v-for="(input, index) in inputs">
                        <v-text-field
                      
                  outline
                  v-model="input.one"
                  :rules="[v => !!v || 'Quantity is Required']"
                  label="Drug">    
                </v-text-field>
      
                <v-text-field
                      
                  outline
                  v-model="input.two"
                  :rules="[v => !!v || 'Quantity is Required']"
                  label="Quantity">    
                </v-text-field>

 
              </v-flex>

              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
              <v-btn v-btn round outline xs12 sm6 color="primary darken-1" :disabled="!valid"  @click="addRow">
                  Add row <v-icon right dark>cloud_upload</v-icon>
                </v-btn>
            <v-btn round outline color="blue lighten-1" flat @click="billDialog = false">
              Cancel
              <v-icon right dark>close</v-icon>
            </v-btn>
            <v-btn round outline xs12 sm6 color="primary darken-1" :disabled="!valid" @click.native="bill">
                  Bill <v-icon right dark>payment</v-icon>
                </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>


    <v-dialog v-model="dialog" max-width="600px">
      <template v-slot:activator="{ on }">
      <!--   <v-btn color="primary" dark v-on="on">Open Dialog</v-btn> -->
      </template>
      <v-card>
        <v-toolbar dark color="primary" class="elevation-0">
          <v-spacer></v-spacer>
            <v-toolbar-title>Issue Drug</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                   <v-flex xs12 sm12 md12>
                <v-select
                    outline
                    :items="patient"
                    item-text="name.text"
                    item-value="id"
                    label="Patients"
                    :rules="[v => !!v || 'Patient Name is Required']"
                    v-model="editedItem.patient_id"
                    autocomplete>
                </v-select>
                </v-flex>
                    <v-flex xs12 sm12 md12>
                <v-select
                    outline
                    v-bind:items="drugs"
                    item-text="generic_name"
                    item-value="generic_name"
                    label="Drugs"
                    :rules="[v => !!v || 'Drug Name is Required']"
                    v-model="editedItem.drugs"
                       multiple
                    autocomplete>
                </v-select>
                </v-flex>
                <v-flex xs12 sm12 md12>
                <v-text-field
                  outline
                  v-model="editedItem.price"
                  :rules="[v => !!v || 'Quantity is Required']"
                  label="Price">    
                </v-text-field>
              </v-flex>
               <v-flex xs12 sm12 md12>
                <v-select
                     outline
                    :items="dosages"
                    item-text="description"
                    item-value="id"
                    label="Dosages"
                    :rules="[v => !!v || 'Dosages is Required']"
                    v-model="editedItem.dosage_id"
                    >
                </v-select>
                </v-flex>
                <v-flex xs12 sm12 md12>
                <v-select
                    outline
                    :items="medication"
                    item-text="display"
                    item-value="id"
                    label="Medication Status"
                    :rules="[v => !!v || 'Medication Status is Required']"
                    v-model="editedItem.medication_status_id"
                    >
                </v-select>
                </v-flex>
                <v-flex xs12 sm12 md12>
                <v-text-field
                  outline
                  v-model="editedItem.quantity"
                  :rules="[v => !!v || 'Quantity is Required']"
                  label="Quantity">    
                </v-text-field>
                     </v-flex>
                      <v-flex xs12 sm12 md12   v-for="(input, index) in inputs">
                        <v-text-field
                      
                  outline
                  v-model="input.one"
                  :rules="[v => !!v || 'Quantity is Required']"
                  label="Drug">    
                </v-text-field>
      
                <v-text-field
                      
                  outline
                  v-model="input.two"
                  :rules="[v => !!v || 'Quantity is Required']"
                  label="Quantity">    
                </v-text-field>

 
              </v-flex>
                 <v-flex xs12 sm12 md12>
                    <v-menu>
                      <v-text-field  outline :rules="[v => !!v || 'Date Received is Required']" :value="editedItem.start_time" slot="activator" label="Start Time "></v-text-field>
                      <v-date-picker v-model="editedItem.start_time"></v-date-picker>
                    </v-menu>
                  </v-flex>
                  <v-flex xs12 sm12 md12>
                    <v-menu>
                      <v-text-field  outline :rules="[v => !!v || 'Date Received is Required']" :value="editedItem.end_time" slot="activator" label="End Time "></v-text-field>
                      <v-date-picker v-model="editedItem.end_time"></v-date-picker>
                    </v-menu>
                  </v-flex>
                  <v-flex xs12>
                  <v-textarea
                    v-model="editedItem.drugs"
                   
                    outline
                    label="Comments"
                    required>
                  </v-textarea>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn round outline xs12 sm6 color="primary darken-1" :disabled="!valid" @click.native="save">
                  Save <v-icon right dark>cloud_upload</v-icon>
                </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
    <v-container class="my-8">
      <span class="title">Drugs</span>
        <v-layout row justify-right>
          <v-flex sm12 md6>
            <v-layout row >
              <v-flex sm12 md6>
                <v-btn color="primary" @click = "dialog = true" dark class="mb-2" outline>Issue Drugs
                  <v-icon right dark>playlist_add</v-icon>
                </v-btn>
              </v-flex>
     
            </v-layout>
          </v-flex>
          <v-flex sm12 md6 offset-md2 text-xs-right>
            <v-toolbar
              dense
              floating
            >
            <v-text-field
              hide-details
              prepend-icon="search"
              single-line
              v-model="search"
              label="Search"
              v-on:keyup.enter="initialize()"
            ></v-text-field>
             </v-toolbar>
          </v-flex>
        </v-layout>
        <v-data-table
          :headers="headers"
          :items="prescription"
          :loading="loader"
          class="elevation-1"
        >
        <template v-slot:items="props">
          <td>{{ props.item.id }}</td>
          <td class="text-xs-left">{{ props.item.patient.name.text}}</td>
               <td class="text-xs-left">{{ props.item.drugs.generic_name}}</td>
          <td class="text-xs-left">{{ props.item.medication_status.display }}</td>
          <td class="text-xs-left">{{ props.item.quantity }}</td>
          <td class="text-xs-left">{{ props.item.dosage.description}}</td>
          <td class="text-xs-left">{{ props.item.start_time }}</td>
          <td class="text-xs-left">{{ props.item.end_time }}</td>
      
   
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
          color="primary" 
          @click = "BillItem(props.item)" 
          flat 
          small 
          outline>Bill
                  <v-icon right dark>payment</v-icon>
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
      </v-data-table>
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
  import format from 'date-fns/format'
  import apiCall from "../../utils/api";
  export default {
    data () {
      return {
        search: '',
        query: '',
        snackbar: false,
        message:'',
        y: 'top',
        color: 'success',
        valid: true,
        delete: false,
        loader: false,
        billDialog:false,
        loading: false,
        loadingDialog: {
          loading: false,
          message: ""
        },
        dialog: false,
              generateBill: {
        
        patient_id: '',
        date: '',
        price: '',
        quantity: '',
        date: ''
      },
        showPasswordField: false,
        productDialog: false,
        invoice: {
          patient: '',
          number: '',
          reference: '',
          date: null,
          due: null,
        },
        inputRules: [
          v => v.length >= !v  || 'Field is required'
        ],
   
      
       headers: [
              {
                text: 'ID',
                align: 'left',
                sortable: false,
                value: 'id'
              },
              { text: 'Name', align: 'left', value: 'patient_id' },
              { text: 'Drug', align: 'left', value: 'drugs' },
              { text: 'Medication Status', align: 'left', value: 'medication_status_id' },
              { text: 'Quantity', align: 'left', value: 'quantity' },
              { text: 'Dosage', align: 'right', value: 'dosage_id' },
              { text: 'Start Time', align: 'right', value: 'start_time' },
              { text: 'End Time', align: 'right', value: 'end_time' },
              { text: 'Actions', align: 'center', value: 'actions' },
            ],
      drugs: [],
      dosages:[],
      prescription:[],
      editedIndex: -1,
      editedItem: {
        
        patient_id: '',
        medication_status_id: '',
        quantity:'',
        dosage_id:'',
        drugs:[],
        end_time:'',
        start_time:'',
        price:''
      },
      defaultItem: {
        
        patient_id: '',
        medication_status_id: '',
        quantity:'',
        dosage_id:'',
        drugs:[],
        end_time:'',
        start_time:''
      },
        inputs: [],
        pagination: {
          page: 1,
          per_page: 0,
          total: 0,
          visible: 10
        },
      }
    },
    created() {
      this.initialize();
    },
    methods: {
          addRow() {
      this.inputs.push({
        one: '',
        two: ''
      })

    },
      loadingMethod(load, message="") {
        this.loadingDialog.loading = load;
        this.loadingDialog.message = message
      },
     initialize () {
         this.loader = true
         this.query = 'page='+ this.pagination.page;
        if (this.search != '') {
            this.query = this.query+'&search='+this.search;
        }
      apiCall({url: '/api/patient?' , method: 'GET' })
        .then(resp => {
          console.log(resp.data)
          this.patient = resp.data;
          this.loader=false
          this.pagination.per_page = resp.per_page;
          this.pagination.total = resp.total;
        })
        .catch(error => {
          console.log(error.response)
        })
      apiCall({ url: "/api/dosage", method: "GET" })
        .then(resp => {
          this.dosages = resp;
          console.log("The Dosage is:",this.dosages);
          this.loader=false
      
        })
        .catch(error => {
          console.log(error.response)
        })
        apiCall({ url: "/api/medicationstatus", method: "GET" })
        .then(resp => {
          this.medication = resp;
          console.log("The Dosage is:",this.medication);
          this.loader=false
      
        })
        .catch(error => {
          console.log(error.response)
        })
         apiCall({url: '/api/medications?' + this.query, method: 'GET' })
        .then(resp => {
          console.log("The Prescriptions are",resp.data)
          this.prescription = resp.data;
          this.loader = false
          this.pagination.per_page = resp.per_page;
          this.pagination.total = resp.total;
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
      },
       close () {
        this.dialog = false

        // if not saving reset dialog references to datatables
        if (!this.saving) {
          this.resetDialogReferences();
        }
      },
      editItem (item) {
        this.editedIndex = this.prescription.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.editedItem.drugs=this.drugs.price

        console.log("The Price is", this.editedItem.drugs)
        this.dialog = true
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
      resetDialogReferences() {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
        this.showPasswordField = false
        this.password = ''
      },

           passordReset () {
        if (this.showPasswordField){
          this.showPasswordField = false
          this.password = ''
        }else{
          this.showPasswordField = true;
        }
      },

     
      save () {

        this.saving = true;
        // update
        if (this.editedIndex > -1) {
          if(this.$refs.form.validate()){
            apiCall({url: '/api/medications/'+this.editedItem.id, data: this.editedItem, method: 'PUT' })
            .then(resp => {
              Object.assign(this.prescription[this.editedIndex], this.editedItem)
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
              console.log("Post This",    this.prescription)
              this.resetDialogReferences();
              this.saving = false;
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
      deleteItem (item) {

        confirm('Are you sure you want to delete this item?') && (this.delete = true)

        if (this.delete) {
          const index = this.prescription.indexOf(item)
         this.prescription.splice(index, 1)
          apiCall({url: '/api/medications/'+item.id, method: 'DELETE' })
          .then(resp => {
              this.message = 'Prescription Deleted Succesfully';
              this.snackbar = true;
         
            console.log(resp)
          })
          .catch(error => {
            console.log(error.response)
          })
        }

      },

    },
    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
      },

      length: function() {
        return Math.ceil(this.pagination.total / this.pagination.per_page);
      },
    }
  }
</script>
