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
    <v-dialog v-model="dialog" max-width="600px">
<!--       <template v-slot:activator="{ on }">
        <v-btn color="primary" dark v-on="on">Open Dialog</v-btn>
      </template> -->
      <v-card>
        <v-toolbar dark color="primary" class="elevation-0">
          <v-spacer></v-spacer>
            <v-toolbar-title>Add Test</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
       <v-form ref="form" v-model="valid" lazy-validation>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                <v-flex xs12 sm12 md12>
                <v-autocomplete
                    single-line
                    :items="patient"
                    item-text="name.text"
                    item-value="id"
                    label="Patients"
                    :rules="[v => !!v || 'Patient Name is Required']"
                    v-model="testRequest.patient_id"
                    >
                </v-autocomplete>
                </v-flex>

                <v-flex xs12 sm12 md12>
                <v-text-field
                 
                  single-line
                  v-model="generateBill.patient_id"
                  item-text="name.text"
                  item-value="id"
                  :rules="[v => !!v || 'Patient Name is Required']"
                  label="Patient">    
                </v-text-field>
              </v-flex>
                <v-flex xs12 sm12 md12>
                <v-autocomplete
                
                    single-line
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
                
                  single-line
                  v-model="generateBill.quantity"
                  :rules="[v => !!v || 'Quantity is Required']"
                  label="Quantity">    
                </v-text-field>
              </v-flex>

            <v-flex xs12 sm12 md12   v-for="(input, index) in inputs">
                        <v-text-field
                      
                  single-line
                  v-model="input.one"
                  :rules="[v => !!v || 'Quantity is Required']"
                  label="Drug">    
                </v-text-field>
      
                <v-text-field
                      
                  single-line
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
              <v-btn round outline xs12 sm6 color="primary darken-1" :disabled="!valid"  @click="addRow">
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
    <v-dialog v-model="productDialog" max-width="600px">
      <v-card>
        <v-toolbar dark color="primary" class="elevation-0">
          <v-spacer></v-spacer>
            <v-toolbar-title>{{ formTitle }}</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-form ref="productform" v-model="valid" lazy-validation>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                   <v-flex xs12 sm12 md12>
                <v-select
                    single-line
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
                    single-line
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
                  single-line
                  v-model="editedItem.price"
                  :rules="[v => !!v || 'Quantity is Required']"
                  label="Price">    
                </v-text-field>
              </v-flex>
               <v-flex xs12 sm12 md12>
                <v-select
                     single-line
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
                    single-line
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
                  single-line
                  v-model="editedItem.quantity"
                  :rules="[v => !!v || 'Quantity is Required']"
                  label="Quantity">    
                </v-text-field>
                     </v-flex>
                      <v-flex xs12 sm12 md12   v-for="(input, index) in inputs">
                        <v-text-field
                      
                  single-line
                  v-model="input.one"
                  :rules="[v => !!v || 'Quantity is Required']"
                  label="Drug">    
                </v-text-field>
      
                <v-text-field
                      
                  single-line
                  v-model="input.two"
                  :rules="[v => !!v || 'Quantity is Required']"
                  label="Quantity">    
                </v-text-field>

 
              </v-flex>
                 <v-flex xs12 sm12 md12>
                    <v-menu>
                      <v-text-field  single-line :rules="[v => !!v || 'Date Received is Required']" :value="editedItem.start_time" slot="activator" label="Start Time "></v-text-field>
                      <v-date-picker v-model="editedItem.start_time"></v-date-picker>
                    </v-menu>
                  </v-flex>
                  <v-flex xs12 sm12 md12>
                    <v-menu>
                      <v-text-field  single-line :rules="[v => !!v || 'Date Received is Required']" :value="editedItem.end_time" slot="activator" label="End Time "></v-text-field>
                      <v-date-picker v-model="editedItem.end_time"></v-date-picker>
                    </v-menu>
                  </v-flex>
                  <v-flex xs12>
                  <v-textarea
                    v-model="editedItem.drugs"
                   
                    single-line
                    label="Comments"
                    required>
                  </v-textarea>
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
            <v-btn round outline xs12 sm6 color="primary darken-1" :disabled="!valid" @click.native="save" :loading="loading">
              Save <v-icon right dark>cloud_upload</v-icon>
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
    <v-container class="my-5">
      <span class="title">Tests</span>
     <!--  {{  tests}} -->
        <v-layout row justify-right>
          <v-flex sm12 md6>
            <v-layout row wrap>
              <v-flex sm12 md6>
                <v-btn color="primary" @click = "dialog = true" dark class="mb-2" outline>Add Test
                  <v-icon right dark>playlist_add</v-icon>
                </v-btn>
              </v-flex>
      
<!--               <v-flex sm12 md6>
                <v-btn @click = "productDialog = true" color="primary" dark class="mb-2" outline>
                  New Item
                  <v-icon right dark>playlist_add</v-icon>
                </v-btn>
              </v-flex> -->
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
          :items="tests"
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
        loading: false,
        loadingDialog: {
          loading: false,
          message: ""
        },
        dialog: false,
         tests: [],
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
          { text: 'Patient Name', align: 'left', value: 'encounter_id' },
          { text: 'Visit Type', align: 'left', value: 'identifier' },
          { text: 'Location', align: 'left', value: 'requested_by' },
          { text: 'Requested By', align: 'left', value: 'id' },
          { text: 'Test Type', align: 'left', value: 'id' },
          { text: 'Actions', align: 'center', value: 'actions' },
        ],
        item: [],
        categories: [],
        editedIndex: -1,
        category: {
          name: '',
          description: '',
        },
        editedItem: {
          category: '',
          item_code: '',
          description: '',
          unit_price: '',
        },
        defaultItem: {
          category: '',
          item_code: '',
          description: '',
          unit_price: '',
        },
          visitTypes: [],
      testTypes: [],
      locations: [],
      testRequest: {
        patient_id: '',
        bed_no: '',
        location_id: '',
        practitioner_name: '',
        encounter_class_id: '',
        testTypeIds: [],
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
      initialize() {
        this.loader=true
        this.query = 'page='+ this.pagination.page;
        if (this.search != '') {
            this.query = this.query+'&search='+this.search;
        }
        apiCall({ url: "/api/item?" + this.query, method: "GET" })
        .then(resp => {
          console.log("item is",resp);
          this.item = resp.data;
          this.loader=false
          this.pagination.total = resp.total;
          this.pagination.per_page = resp.per_page;
        })
        .catch(error => {
          console.log(error.response);
        });
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

        apiCall({ url: "/api/test?", method: "GET" })
        .then(resp => {
          console.log("Tests are",resp.data);
          this.tests = resp.data;
          this.pagination.total = resp.total;
          this.pagination.per_page = resp.per_page;
        })
        .catch(error => {
          console.log(error.response);
        });

        apiCall({url: '/api/labtesttype', method: 'GET' })
          .then(resp => {
            console.log("Test Types are: ",resp)
            this.testTypes = resp.data;
        }).catch(error => {
            console.log(error.response)
        })

        apiCall({url: '/api/location', method: 'GET' })
          .then(resp => {
            this.locations = resp.data;
            console.log("Locations are: ",resp)
        }).catch(error => {
            console.log(error.response)
        })

        apiCall({url: '/api/encounterclass', method: 'GET' })
          .then(resp => {
            this.visitTypes = resp;
            console.log(resp)
        }).catch(error => {
            console.log(error.response)
        })
      },
      close () {
        this.productDialog = false
        // if not saving reset dialog references to datatables
        if (!this.saving) {
          this.resetDialogReferences();
        }
      },
      editItem (item) {
        this.editedIndex = this.item.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.productDialog = true
      },
      resetDialogReferences() {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      },
      save () {
        if(this.$refs.form.validate()){
            this.loading = true
            apiCall({url: '/api/patient/testrequest', data: this.testRequest, method: 'POST' })
            .then(resp => {
              this.loading = false
              console.log(resp)
              EventBus.$emit('update-test-list', resp);
              this.message = 'New Test Added  Succesfully';
              this.snackbar = true;
            })
            .catch(error => {
              this.loading = false
              console.log(error.response)
            })
          this.close()
          this.resetDialogReferences()
        }
      },
      deleteItem (item) {

        confirm('Are you sure you want to delete this item?') && (this.delete = true)

        if (this.delete) {
          const index = this.item.indexOf(item)
          this.item.splice(index, 1)
          apiCall({url: '/api/item/'+item.id, method: 'DELETE' })
          .then(resp => {
            console.log(resp)
          })
          .catch(error => {
            console.log(error.response)
          })
        }

      },
      saveCategory(){
        if(this.$refs.form.validate()){
            this.loadingMethod(true, "Posting Category")
            this.loading = true
            apiCall({url: '/api/item-category', data: this.category, method: 'POST' })
            .then(resp => {
              this.loading = false
              this.saving = false
              this.categories.push(resp)
              this.dialog = false
              this.message = 'Category Added Succesfully'
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
