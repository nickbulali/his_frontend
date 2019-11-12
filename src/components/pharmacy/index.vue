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
    <v-dialog v-model="addStock" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Receive New Pharmacy Stock</span>
        </v-card-title>
        <v-form ref="stockform" v-model="valid" lazy-validation>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm12 md12>
                <v-text-field
                  single-line
                  v-model="stockItem.lot_no"
                  :rules="[v => !!v || 'Lot no. is Required']"
                  label="Lot no.">
                </v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md12>
                <v-text-field
                  single-line
                  v-model="stockItem.batch_no"
                  :rules="[v => !!v || 'Batch no. is Required']"
                  label="Batch no.">
                </v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md12>
                <v-menu>
                  <v-text-field :rules="[v => !!v || 'Expiry Date is Required']" :value="stockItem.expiry_date" slot="activator" label="Expiry Date" single-line></v-text-field>
                  <v-date-picker v-model="stockItem.expiry_date"></v-date-picker>
                </v-menu>
              </v-flex>
              <v-flex xs12 sm12 md12>
                <v-text-field
                  single-line
                  v-model="stockItem.manufacturer"
                  :rules="[v => !!v || 'Manufacturer is Required']"
                  label="Manufacturer">
                </v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md12>
                <v-select
                  single-line
                  :items="suppliers"
                  v-model="stockItem.supplier_id"
                  :rules="[v => !!v || 'Supplier is Required']"
                  item-text="name"
                  item-value="id"
                  label="Supplier"
                ></v-select>
              </v-flex>
              <v-flex xs12 sm12 md12>
                <v-text-field
                  single-line
                  v-model="stockItem.quantity_supplied"
                  :rules="[v => !!v || 'Quantity Supplied is Required']"
                  label="Quantity Supplied">
                </v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md12>
                <v-text-field
                  single-line
                  v-model="stockItem.cost_per_unit"
                  :rules="[v => !!v || 'Cost Per Unit is Required']"
                  label="Cost Per Unit">
                </v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md12>
                <v-menu>
                  <v-text-field :rules="[v => !!v || 'Date Received is Required']" :value="stockItem.date_received" slot="activator" label="Date Received" single-line></v-text-field>
                  <v-date-picker v-model="stockItem.date_received"></v-date-picker>
                </v-menu>
              </v-flex>
              <v-flex xs12 sm12 md12>
                <v-text-field
                  single-line
                  v-model="stockItem.remarks"
                  :rules="[v => !!v || 'Remarks is Required']"
                  label="Remarks">
                </v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn outline color="blue darken-1" flat @click.native="resetStockDialogReferences">Cancel</v-btn>
          <v-btn outline color="blue darken-1" :disabled="!valid" flat @click.native="saveStock" :loading="loading">Save</v-btn>
        </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
       <v-dialog v-model="receiveDialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click.native="receiveDialog = false">
            <v-icon>close</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark flat @click.native="addStock = true">Add new Stock</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-data-table
          :headers="stockheaders"
          :items="stock"
          hide-actions
          class="elevation-1"
        >
          <template slot="items" slot-scope="props">
            <td>{{ props.item.lot_no }}</td>
            <td class="text-xs-left">{{ props.item.batch_no }}</td>
            <td class="text-xs-left">{{ props.item.manufacturer }}</td>
            <td class="text-xs-left">{{ props.item.quantity_supplied }}</td>
            <td class="text-xs-left">{{ props.item.quantity_issued}}</td>
            <td class="text-xs-left">{{ props.item.balance }}</td>
            <td class="text-xs-left">{{ props.item.expiry_date }}</td>
            <td class="justify-left layout px-0">
              <v-btn
                outline
                small
                title="Edit"
                color="teal"
                flat
                @click="editStockItem(props.item)">
                Edit
                <v-icon right dark>edit</v-icon>
              </v-btn>
            <v-btn
            outline
            small
            title="Edit"
            color="green"
            flat
            @click="itemStock(props.item)">
            Log Stock Usage
            <v-icon right dark>book</v-icon>
          </v-btn>
              <v-btn
                outline
                small
                title="Edit"
                color="warning"
                flat
                @click="issueItem(props.item)">
                Issue Stock
                <v-icon right dark>done_all</v-icon>
              </v-btn>
            </td>
          </template>
        </v-data-table>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog" max-width="600px">
      <template v-slot:activator="{ on }">
      <!--   <v-btn color="primary" dark v-on="on">Open Dialog</v-btn> -->
      </template>
      <v-card>
        <v-toolbar dark color="primary" class="elevation-0">
          <v-spacer></v-spacer>
            <v-toolbar-title>Add Drug</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm12 md12>
                <v-text-field
                  single-line
                  v-model="editedItem.generic_name"
                  :rules="[v => !!v || 'Generic Name is Required']"
                  label="Generic Name">    
                </v-text-field>
              </v-flex>
                <v-flex xs12 sm12 md12>
                <v-text-field
                  single-line
                  v-model="editedItem.trade_name"
                  :rules="[v => !!v || 'Trade Name is Required']"
                  label="Trade Name">    
                </v-text-field>
              </v-flex>
               <v-flex xs12 sm12 md12>
                <v-text-field
                  single-line
                  v-model="editedItem.strength_value"
                  :rules="[v => !!v || 'Strength Value is Required']"
                  label="Strength Value">    
                </v-text-field>
              </v-flex>
                <v-flex xs12 sm12 md12>
                <v-text-field
                  single-line
                  v-model="editedItem.strength_unit"
                  :rules="[v => !!v || 'Strength Unit is Required']"
                  label="Strength Unit">    
                </v-text-field>
              </v-flex>
                 <v-flex xs12 sm12 md12>
                <v-text-field
                  single-line
                  v-model="editedItem.dosage_form"
                  :rules="[v => !!v || 'Dosage Form is Required']"
                  label="Dosage Form">    
                </v-text-field>
              </v-flex>
               <v-flex xs12 sm12 md12>
                <v-text-field
                  single-line
                  v-model="editedItem.administration_route"
                  :rules="[v => !!v || 'Adminstration Route is Required']"
                  label="Adminstration Route ">    
                </v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md12>
                <v-text-field
                  single-line
                  v-model="editedItem.price"
                  :rules="[v => !!v || 'Price is Required']"
                  label="Price">    
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
      <span class="title">Drugs</span>
        <v-layout row justify-right>
          <v-flex sm12 md6>
            <v-layout row wrap>
              <v-flex sm12 md6>
                <v-btn color="primary" @click = "dialog = true" dark class="mb-2" outline>Add Drugs
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
          :items="drugs"
          :loading="loader"
          class="elevation-1"
        >
        <template v-slot:items="props">
          <td>{{ props.item.id }}</td>
         <td class="text-xs-left">{{ props.item.generic_name}}</td>
          <td class="text-xs-left">{{ props.item.trade_name}}</td>
          <td class="text-xs-left">{{ props.item.strength_value }}</td>
         <td class="text-xs-left">{{ props.item.strength_unit }}</td>
         <td class="text-xs-left">{{ props.item.dosage_form }}</td>
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
            title="Edit"
            color="green"
            flat
            @click="itemStock(props.item)">
            Log Stock Usage
            <v-icon right dark>book</v-icon>
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
          { text: 'Generic Name', align: 'left', value: 'generic_name' },
          { text: 'Trade Name', align: 'left', value: 'trade_name' },
          { text: 'Value', align: 'left', value: 'strength_value' },
          { text: 'Unit', align: 'left', value: 'strength_unit' },
          { text: 'Dosage Form', align: 'right', value: 'dosage_form' },
          { text: 'Adminstration Route', align: 'right', value: 'administration_route' },
          { text: 'Price', align: 'right', value: 'price' },
          { text: 'Actions', align: 'center', value: 'actions' },
      ],
      stockheaders: [
        { text: 'Lot No.', value: 'lot_no' },
        { text: 'Batch No.', value: 'batch_no' },
        { text: 'Manufacturer', value: 'manufacturer' },
        { text: 'Quantity Supplied', value: 'quantity_supplied' },
        { text: 'Quantity Issued', value: 'quantity_issued' },
        { text: 'Balance', value: 'balance' },
        { text: 'Expiry Date', value: 'expiry_date' },
        { text: 'Actions', value: 'name', sortable: false }
      ],
      drugs: [],
      editedIndex: -1,
      editedItem: {
        generic_name: '',
        trade_name: '',
        strength_value: '',
        strength_unit:'',
        dosage_form:'',
        administration_route:'',
        price:''
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
        generic_name: '',
        trade_name: '',
        strength_value: '',
        strength_unit:'',
        dosage_form:'',
        administration_route:'',
        price:''
      },
      stockItem: {
        stock_id: '',
        item_id: '',
        lot_no: '',
        batch_no: '',
        expiry_date: '',
        manufacturer: '',
        supplier_id: '',
        quantity_supplied: '',
        cost_per_unit: '',
        date_received: '',
        remarks: '',
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

        apiCall({url: '/api/drugs?', method: 'GET' })
        .then(resp => {
          console.log(resp)
          this.drugs = resp;
          this.loader = false

        })
        .catch(error => {
          console.log(error.response)
        })
        apiCall({url: '/api/supplier', method: 'GET' })
        .then(resp => {
          console.log(resp)
          this.suppliers = resp.data;
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
      saveStock () {
        if(this.$refs.stockform.validate()){
          this.loading = true
          apiCall({url: '/api/stock', data: this.stockItem, method: 'POST' })
            .then(resp => {
              this.stock.push(resp)
              console.log(resp)
              this.resetStockDialogReferences();
              //this.saving = false;
              this.loading = false
              this.message = 'Stock Added Succesfully';
            this.snackbar = true;
            })
            .catch(error => {
              this.loading = false
              console.log(error.response)
          })
        }
      },
      itemStock(item){
        this.stockItem.item_id = item.id

        apiCall({url: '/api/stockDetails/'+item.id, method: 'GET' })
        .then(resp => {
          let stock = resp
          
          console.log("Stock history response is:",resp) 
          Vue.set(this,"stock",stock)
          //this.request = resp.data.request;
          //console.log('requests')
          //console.log(resp)
          //this.pagination.total = resp.total;
        })
        .catch(error => {
          console.log(error.response)
        })
        this.itemdetails = item
        console.log("item")
        console.log(this.itemdetails)
        this.receiveDialog = true
      },

      editItem (item) {
        this.editedIndex = this.drugs.indexOf(item)
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
         
            apiCall({url: '/api/drugs/'+this.editedItem.id, data: this.editedItem, method: 'PUT' })
            .then(resp => {
              Object.assign(this.drugs[this.editedIndex], this.editedItem)
              console.log(resp)
              this.resetDialogReferences();
              this.saving = false;
              this.message = 'Drugs Information Updated Succesfully';
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
            apiCall({url: '/api/drugs', data: this.editedItem, method: 'POST' })
            .then(resp => {
              this.drugs.push(resp)
              console.log(resp)
              this.resetDialogReferences();
              this.saving = false;
              this.message = 'New Drug Added Succesfully';
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
          const index = this.drugs.indexOf(item)
          this.drugs.splice(index, 1)
          apiCall({url: '/api/drugs/'+item.id, method: 'DELETE' })
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
