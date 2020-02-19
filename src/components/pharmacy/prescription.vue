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
            <v-toolbar-title>Add Prescription</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
               <v-flex xs12 sm12 md12>
                <v-select
                    single-line
                    :items="patient"
                    item-text="id"
                    item-value="id"
                    label="Patient_id"
                    :rules="[v => !!v || 'Patient is Required']"
                    v-model="editedItem.Patient_id">
                </v-select>
                </v-flex>
                <v-flex xs12 sm12 md12>
                <v-select
                  single-line
                  :items="medicationstatus"
                  item-text="id"
                  item-value="id"
                  label="Medication status_id"
                  :rules="[v => !!v || 'Medication_status_id is Required']"
                  v-model="editedItem.Medication_status_id">    
                </v-select>
              </v-flex>

               <v-flex xs12 sm12 md12>
                <v-select
                  single-line
                  :items="drugs"
                  item-text="id"
                  item-value="id"
                  label="Drug_id"
                  :rules="[v => !!v || 'Drug_id Value is Required']"
                  v-model="editedItem.Drug_id">   
                </v-select>
              </v-flex>
            <v-flex xs12 sm12 md12>
              <v-select
                  single-line
                  :items="dosage"
                  item-text="id"
                  item-value="id"
                  v-model="editedItem.Dosage_id"
                  :rules="[v => !!v || 'Dosage_id Value is Required']"
                  label="Dosage_id">    
                </v-select>   
              </v-flex>
                <v-flex xs12 sm12 md12>
                <v-text-field
                  single-line
                  v-model="editedItem.Prescribe_By"
                  :rules="[v => !!v || 'Prescribe By is Required']"
                  label="Prescribe By">    
                </v-text-field>
              </v-flex>
                 <v-flex xs12 sm12 md12>
                <v-text-field
                  single-line
                  v-model="editedItem.Quantity"
                  :rules="[v => !!v || 'Quantity Form is Required']"
                  label="Quantity">    
                </v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md12>
                <v-text-field
                  single-line
                  v-model="editedItem.Comments"
                  :rules="[v => !!v || 'Comments is Required']"
                  label="Comments">    
                </v-text-field>
              </v-flex>
               <v-flex xs12 sm12 md12>
                <v-text-field
                  single-line
                  v-model="editedItem.Refill"
                  :rules="[v => !!v || 'Refill Route is Required']"
                  label="Refill ">    
                </v-text-field>
              </v-flex>
               </v-flex>
                 <v-flex xs12 sm12 md12>
                    <v-menu >
                      <v-text-field  single-line :rules="[v => !!v || 'Start_Time is Required']" :value="editedItem.Start_Time" slot="activator" label="Start_Time "></v-text-field>
                      <v-time-picker v-model="editedItem.Start_Time"></v-time-picker>
                    </v-menu>
                  </v-flex>
                 <v-flex xs12 sm12 md12>
                    <v-menu>
                      <v-text-field  single-line :rules="[v => !!v || 'End_Time is Required']" :value="editedItem.End_Time" slot="activator" label="End_Time "></v-text-field>
                      <v-time-picker v-model="editedItem.End_Time"></v-time-picker>
                    </v-menu>
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
            <v-btn round outline xs12 sm6 color="primary darken-1" :disabled="!valid" @click.native="save">
                  Save <v-icon right dark>cloud_upload</v-icon>
                </v-btn>
          </v-card-actions>   
        </v-form>
      </v-card>
    </v-dialog>
    <v-container>
  <v-breadcrumbs :items="items">
      <template v-slot:divider>
        <v-icon>chevron_right</v-icon>
      </template>
    </v-breadcrumbs>
  </v-container>
    <v-container>
      <span class="title">PRESCRIPTION</span>
        <v-layout row justify-right>
          <v-flex sm12 md6>
            <v-layout row wrap>
              <v-flex sm12 md6>
                <v-btn color="primary" @click = "dialog = true" dark class="mb-2" outline>Add Prescriptions
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
          hide-actions
          :headers="headers"
          :items="presciption"
          :loading="loader"
          class="elevation-1"
        >
        <template v-slot:items="props">
          <td>{{ props.item.id }}</td>
         <td class="text-xs-left">{{ props.item.Name_id}}</td>
          <td class="text-xs-left">{{ props.item.Patient_Age}}</td>
          <td class="text-xs-left">{{ props.item.Description }}</td>
         <td class="text-xs-left">{{ props.item.Prescribe_By}}</td>
         <td class="text-xs-left">{{ props.item.dosage_form }}</td>
        <td class="text-xs-left">{{ props.item.genetic_name}}</td>
         <td class="text-xs-left">{{props.item.dosage}}</td>
          <td class="text-xs-left">{{ props.item.administration_route }}</td>
          <td class="text-xs-left">{{ props.item.price }}</td>
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
           <v-btn
            outline
            small
            title="Delete"
            color="pink"
            flat
            @click="deleteItem(props.item)">
            Print
            <v-icon right dark>Print</v-icon>
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
  // import Dashboard from '@/views/Dashboard.vue'
  export default {
    data () {
      return {
        search: '',
        query: '',
        addStock: false,
        snackbar: false,
        message:'',
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
        active: null,
        dialog: false,
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
        receiveDialog: false,
        stock: [],
        suppliers: [],
        headers: [
          {
            text: 'ID',
            align: 'left',
            sortable: false,
            value: 'id'
          },
          { text: 'Patient_id', align: 'left', value: 'Patient_id' },
          { text: 'Medication_status_id', align: 'left', value: 'Medication_status_id' },
          { text: 'Drug_id', align: 'left', value: 'Drug_id' },
          { text: 'Dosage_id', align: 'left', value: 'Dosage_id' },
          { text: 'Quantity', align:'left', value:'Quantity'},
          { text: 'Refill', align: 'right', value: 'Refill' },
          { text: 'Prescribe_By', align:'right', value:'Prescribe_By'},
          { text: 'Comments', align: 'right', value: 'Comments' },
          { text: 'Start_Time', align: 'right', value: 'Start_Time' },
          { text: 'End_Time', align: 'center', value: 'End_Time' },
      ],
      prescription: [],
      editedIndex: -1,
      editedItem: {
        Patient_id:'',
        Medication_status_id:'',
        Drug_id: '',
        Dosage_id:'',
        Quantity:'',
        Prescribe_By:'',
        Refill:'',
        Comments:'',
        Start_Time:'',
        End_Time:''
      },
      items: [
          {
           text: 'Dashboard',
           to: { name: 'dashboard' }
          },
          {
           text: 'Pharmacy',
           to: { name: 'pharmacy' }
          },
          {
           text: 'Pharmacy',
           to: { name: 'Pharmacy' }
          }
      ],
      defaultItem: {
        Name_id: '',
        genetic_name:'',
        Patient_Age: '',
        Description: '',
        Presribe_By:'',
        Dosage:'',
        dosage_form:'',
        administration_route:'',
        price:''
      },
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

        apiCall({url: '/api/medications?', method: 'GET' })
        .then(resp => {
          console.log(resp)
          this.prescription = resp;
          this.loader = false

        })
        .catch(error => {
          console.log(error.response)
        })

        apiCall({url: '/api/dosage', method: 'GET' })
        .then(resp => {
          console.log(resp)
          this.dosage = resp.data;
        })
        .catch(error => {
          console.log(error.response)
        })

        apiCall({url: '/api/drugs', method:'GET'})
        .then(resp=>{
          console.log(resp)
          this.drugs = resp.data;
        }).catch(error=>{
          console.log(error.message)
        })

        apiCall({url: '/api/medicationstatus', method:'GET'})
        .then(resp=>{
          console.log(resp);
          this.medicationstatus = resp.data
        }).catch(error=>{
          console.log(error.message)
        })

        apiCall({url:'/api/patient', method:'GET'})
        .then(resp=>{
          console.log(resp);
          this.patient = resp.data
        }).catch(error=>{
          console.log(error.message)
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
        this.dialog = true
      },
      resetDialogReferences() {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      },
           resetDialogReferences() {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      },
      // resetStockDialogReferences() {
      //   this.stockItem = Object.assign({}, this.defaultstockItem)
      //   this.addStock = false
      // },
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
              this.message = 'prescription Information Updated Succesfully';
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
              console.log(resp)
              this.resetDialogReferences();
              this.saving = false;
              this.message = 'New prescription Added Succesfully';
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
            console.log(resp)
          })
          .catch(error => {
            console.log(error.response)
          })
        }

      },

      next () {
        const active = parseInt(this.active)
        this.active = (active < 2 ? active + 1 : 0)
      }
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
