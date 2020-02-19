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
      <v-card>
        <v-toolbar dark color="primary" class="elevation-0">
          <v-spacer></v-spacer>
            <v-toolbar-title>Add Wards</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field
                    v-model="category.ward_no"
                    :rules="[v => !!v || 'Ward Number is Required']"
                    single-line
                    label="Ward Number"
                    required>
                  </v-text-field>
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
            <v-btn round outline xs12 sm6 :loading="loading" color="primary darken-1" flat @click="saveCategory">Save
              <v-icon right dark>cloud_upload</v-icon>
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
                    :items="categories"
                    :rules="[v => !!v || 'Ward number is Required']"
                    v-model="editedItem.ward_no"
                    item-text="ward_no"
                    item-value="id"
                    label="Ward Number"
                    single-line
                  ></v-select>
                </v-flex>
                <v-flex xs12 sm12 md12>
                  <v-text-field
                    single-line
                    v-model="editedItem.bed_no"
                    :rules="[v => !!v || 'Bed no is Required']"
                    label="Bed Number">
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
            <v-btn round outline xs12 sm6 color="primary darken-1" :disabled="!valid" @click.native="save" :loading="loading">
              Save <v-icon right dark>cloud_upload</v-icon>
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>

    <!-- discharge float-->

    <!-- <v-dialog v-model="dischargeDialog" max-width="600px">
      <v-card>
        <v-toolbar dark color="primary" class="elevation-0">
          <v-spacer></v-spacer>
            <v-toolbar-title>Discharge Patient</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-form ref="productform" v-model="valid" lazy-validation>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm12 md12>
                  <v-select
                    :items="categories"
                    :rules="[v => !!v || 'Ward number is Required']"
                    v-model="editedItem.ward_no"
                    item-text="ward_no"
                    item-value="id"
                    label="Ward Number"
                    single-line
                  ></v-select>
                </v-flex>
                <v-flex xs12 sm12 md12>
                  <v-select
                    single-line
                    :items="bed_no"
                    v-model="editedItem.bed_no"
                    item-text="bed_no"
                    item-value="id"
                    :rules="[v => !!v || 'Bed no is Required']"
                    label="Bed Number">
                  </v-select>
                </v-flex>
                <v-flex xs12 sm12 md12>
                  <v-select
                    single-line
                    :items="bed_status"
                    v-model="editedItem.status"
                    :rules="[v => !!v || 'Pending/Booked']"
                    
                    label="Status">
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
            <v-btn round outline xs12 sm6 color="primary darken-1" :disabled="!valid" @click.native="dischargeItems" :loading="loading">
              Save <v-icon right dark>cloud_upload</v-icon>
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
 -->
    <!-- Bed Allocation Float -->

    <v-dialog v-model="bedDialog" max-width="600px">
      <v-card>
        <v-toolbar dark color="primary" class="elevation-0">
          <v-spacer></v-spacer>
            <v-toolbar-title>Bed Allocation</v-toolbar-title>
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
                    label="Patient"
                    :rules="[v => !!v || 'Patient Name is Required']"
                    v-model="allocation.patient_id">
                </v-select>
                </v-flex>
               
                 <v-flex xs12 sm12 md12>
                    <v-select
                        single-line
                        :items="item"
                        label="Bed Number"
                        item-text="bed_no"
                        item-value="id"
                        :rules="[v => !!v || 'Bed Number is Required']"
                        v-model="allocation.bed_no"
                        >
                    </v-select>

                </v-flex>
                 <v-flex xs12 sm12 md12>
                    <v-menu>
                      <v-text-field  single-line :rules="[v => !!v || 'Start time is Required']" :value="allocation.start_date" slot="activator" label="Start Date "></v-text-field>
                      <v-date-picker v-model="allocation.start_date"></v-date-picker>
                    </v-menu>
                  </v-flex>
                 <v-flex xs12 sm12 md12>
                    <v-menu>
                      <v-text-field  single-line :rules="[v => !!v || 'Start time is Required']" :value="allocation.start_time" slot="activator" label="Start time "></v-text-field>
                      <v-time-picker v-model="allocation.start_time"></v-time-picker>
                    </v-menu>
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
            
            <v-btn round outline xs12 sm6 color="primary darken-1" :disabled="!valid" @click.native="saveAllocation" :loading="loading"  >
              Save <v-icon right dark>cloud_upload</v-icon>
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>


    <v-container class="my-5">
      <span class="title">Bed Management</span>
        <v-layout row justify-right>
          <v-flex sm12 md6>
            <v-layout row wrap>
              <v-flex sm12 md6>
                <v-btn color="primary" @click = "dialog = true" dark class="mb-2" outline>Add Ward
                  <v-icon right dark>playlist_add</v-icon>
                </v-btn>
              </v-flex>
              <v-flex sm12 md6>
                <v-btn @click = "productDialog = true" color="primary" dark class="mb-2" outline>
                  Add Bed
                  <v-icon right dark>playlist_add</v-icon>
                </v-btn>
              </v-flex>
              <v-flex sm12 md6>
                <v-btn color="primary" @click = "bedDialog = true" dark class="mb-2" outline>Allocate Bed
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
          :items="item"
          :loading="loader"
          hide-actions
          class="elevation-1"
        >
        <template v-slot:items="props">
          <td>{{ props.item.id }}</td>
         <!--  <td class="text-xs-left">{{ props.item.patient_id }}</td> -->
          <td class="text-xs-left">{{ props.item.bed_no }}</td>
          <td class="text-xs-left">{{ props.item.ward_no }}</td>
          <td class="text-xs-left">{{ props.item.status }}</td>
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
          <!-- <v-btn
            outline
            small
            title="Discharge"
            color="green"
            flat
            @click="dischargeItem(props.item)">
            discharge
            <v-icon right dark>delete</v-icon>
          </v-btn> -->

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
        productDialog: false,
        bedDialog:false,
        dischargeDialog:false,
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
          // { text: 'Patient ID', align: 'left', value: 'patient_id' },
          { text: 'Bed Number', align: 'left', value: 'bed_no' },
          { text: 'Ward Number', align: 'left', value: 'ward_no' },
          { text: 'Status', align: 'left', value: 'status' },
          { text: 'Actions', align: 'center', value: 'actions' },
        ],
        item: [],
        categories: [],
        bed_no: ['1','2','3','4'],
        bed_status:['Booked','Pending','Transfered'],
        patient:[],
        bed:[],
        editedIndex: -1,
        category: {
          ward_no: ''
        },
        editedItem: {
          ward_no: '',
          bed_no: '',
        },
        allocation:{
          patient_id:'',
          bed_no:'',
          start_date:'',
          start_time:'',

        },
        defaultItem: {
          category: '',
          item_code: '',
          description: '',
          unit_price: '',
        },
        discharge: {
          ward_no:'',
          bed_no:'',
          status:'',
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
        apiCall({ url: "/api/bed?" + this.query, method: "GET" })
          .then(resp => {
            console.log("item is",resp);
            this.item = resp;
            this.loader=false
            this.pagination.total = resp.total;
            this.pagination.per_page = resp.per_page;
          })
          .catch(error => {
            console.log(error.response);
          });

          apiCall({ url: "/api/ward", method: "GET" })
          .then(resp => {
            console.log("Ward number is",resp);
            this.categories = resp;
          })
          .catch(error => {
            console.log(error.response);
          });

          apiCall({ url: "/api/patient", method: "GET" })
          .then(resp => {
            console.log("Patient is",resp);
            this.patient = resp.data;
          })
          .catch(error => {
            console.log(error.response);
          });

          apiCall({ url: "/api/bed", method: "GET" })
          .then(resp => {
            console.log("Bed number is",resp);
            this.bed = resp.data;
          })
          .catch(error => {
            console.log(error.response);
          });
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

      dischargeItem (item) {
        this.dischargedIndex = this.item.indexOf(item)
        this.dischargedItem = Object.assign({}, item)
        this.dischargeDialog = true
      },

      resetDialogReferences() {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      },
      save (item) {
        this.saving = true;
        // update
        if (this.editedIndex > -1) {
          this.loadingMethod(true, "Updating Beds")
          if(this.$refs.productform.validate()){
            this.loading = true
            apiCall({url: '/api/bed/'+this.editedItem.id, data: this.editedItem, method: 'PUT' })
            .then(resp => {
              this.loading = false
              Object.assign(this.item[this.editedIndex], this.editedItem)
              console.log(resp)
              this.productDialog = false
              this.resetDialogReferences();
              this.saving = false;
              this.message = 'Patient Information Updated Succesfully';
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
        // store
        } else {
          this.loadingMethod(true, "Adding Chargesheet Entry")
          if(this.$refs.productform.validate()){
            this.loading = true
            apiCall({url: '/api/bed', data: this.editedItem, method: 'POST' })
            .then(resp => {
              this.loading = false
              this.item.push(resp)
              console.log(this.editedItem)
              this.productDialog = false
              this.resetDialogReferences();
              this.saving = false;
              this.message = 'Item Added Succesfully';
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
        }
      },

      //bed allocation
      saveAllocation () {
        this.saving = true;
        // update
        if (this.editedIndex > -1) {
          this.loadingMethod(true, "Updating Beds Allocated")
          if(this.$refs.productform.validate()){
            this.loading = true
            apiCall({url: '/api/bedAllocation/'+this.allocation.id, data: this.allocation, method: 'PUT' })
            .then(resp => {
              this.loading = false
              Object.assign(this.item[this.editedIndex], this.editedItem)
              console.log(resp)
              this.productDialog = false
              this.resetDialogReferences();
              this.saving = false;
              this.message = 'Bed Allocation Updated Succesfully';
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
        // store
        } else {
          this.loadingMethod(true, "Adding bed allocation")
          if(this.$refs.productform.validate()){
            this.loading = true
            apiCall({url: '/api/bedAllocation', data: this.allocation, method: 'POST' })
            .then(resp => {
              this.loading = false
              this.item.push(resp)
              console.log(this.allocation)
              this.productDialog = false
              this.resetDialogReferences();
              this.saving = false;
              this.message = 'Bed Allocated Succesfully';
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


      //discharge patient
      dischargeItems (item){
        this.saving = true;
        if (this.dischargedIndex > -1) {
          this.loadingMethod(true, "Updating Beds Allocated")
          if(this.$refs.productform.validate()){
            this.loading = true
            apiCall({url: '/api/bedAllocation/'+this.allocation.id, data: this.allocation, method: 'PUT' })
            .then(resp => {
              this.loading = false
              Object.assign(this.item[this.dischargedIndex], this.dischargedItem)
              console.log(resp)
              this.productDialog = false
              this.resetDialogReferences();
              this.saving = false;
              this.message = 'Discharged Succesfully';
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

        }
      },

      saveCategory(){
        if(this.$refs.form.validate()){
            this.loadingMethod(true, "Posting Category")
            this.loading = true
            apiCall({url: '/api/ward', data: this.category, method: 'POST' })
            .then(resp => {
              this.loading = false
              this.saving = false
              this.categories.push(resp)
              this.dialog = false
              this.message = 'Bed Added Succesfully'
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
        return this.editedIndex === -1 ? 'New bed' : 'Add bed'
      },

      length: function() {
        return Math.ceil(this.pagination.total / this.pagination.per_page);
      },
    }
  }
</script>