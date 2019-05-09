<template>
  <div class="payment">
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
      <template v-slot:activator="{ on }">
        <v-btn color="primary" dark v-on="on">Open Dialog</v-btn>
      </template>
      <v-card>
        <v-toolbar dark color="primary" class="elevation-0">
          <v-spacer></v-spacer>
            <v-toolbar-title>Add Payment</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-form ref="paymentForm" v-model="valid" lazy-validation>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                       <v-autocomplete
                      :items = "invoices"
                      v-model="payment.invoice_id"
                      outline
                      item-text="number"
                      item-value="id"
                      label="Invoice"
                      required>
                    </v-autocomplete>                
                </v-flex>
                 <v-flex xs12>
                  <v-text-field
                    v-model="payment.number"
                    :rules="[v => !!v || 'Payment Number is Required']"
                    outline
                    disabled
                    label="Number"
                     hint="Auto Generated"
                    required>
                  </v-text-field>
                </v-flex>
                 <v-flex xs12>
                  <v-menu>
                      <v-text-field
                        :rules="inputRules"
                        :value="formattedDate"
                        slot="activator"
                        label="Date"
                        prepend-inner-icon="date_range"
                        outline>
                      </v-text-field>
                      <v-date-picker v-model="payment.date"></v-date-picker>
                    </v-menu>
                </v-flex>
                 <v-flex xs12>
                  <v-text-field
                    v-model="payment.method"
                    :rules="[v => !!v || 'Method Of Payment is Required']"
                    outline
                    label="Payment Method"
                    required>
                  </v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-textarea
                    v-model="payment.description"
                    :rules="[v => !!v || 'Description is Required']"
                    outline
                    label="Description"
                    required>
                  </v-textarea>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    v-model="payment.amount"
                    :rules="[v => !!v || 'Amount is Required']"
                    outline
                    label="Amount"
                     hint="Auto Generated"
                    required>
                  </v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    v-model="payment.balance"
                    :rules="[v => !!v || 'Balance is Required']"
                    outline
                    label="Balance"
                     hint="Auto Generated"
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
            <v-btn round outline xs12 sm6 :loading="loading" color="primary darken-1" flat @click="savePayment">Save
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
      </v-card>
    </v-dialog>
  	<v-container class="my-5">
      <span class="title">Payment</span>
        <v-layout row justify-right>
          <v-flex sm12 md6>
            <v-layout row wrap>
              <v-flex sm12 md6>
                <v-btn color="primary" @click = "dialog = true" dark class="mb-2" outline>Add Payment
                  <v-icon right dark>add</v-icon>
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
          class="elevation-1"
        >
        <template v-slot:items="props">
          <td>{{ props.item.id }}</td>
          <td class="text-xs-left">{{ props.item.number }}</td>
            <td class="text-xs-left">{{ props.item.invoice_id }}</td>
          <td class="text-xs-left">{{ props.item.method }}</td>
          <td class="text-xs-left">{{ props.item.date}}</td>
          <td class="text-xs-left">{{ props.item.amount }}</td>
           <td class="text-xs-left">{{ props.item.balance }}</td>
            <td class="text-xs-left">{{ props.item.description }}</td>
           
          <td class="justify-center layout px-0">
          <v-btn
            outline
            small
            title="Edit"
            color="teal"
            flat
            router :to="{name:'ShowPayment', params:{id: props.item.id}}"
           >
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
        form:{},
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
        invoice: {
         
          number: '',
      
        },
        payment: {
           invoice_id: '',
          number: '',
          description: '',
          method: '',
          amount: '',
          balance: '',
          date: null,
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
          { text: 'Payment Number', align: 'left', value: 'number' },
          { text: 'Invoice Number', align: 'left', value: 'invoice_id' },
          { text: 'Method', align: 'left', value: 'method' },
          { text: 'Date', align: 'left', value: 'date' },
          { text: 'Amount', align: 'left', value: 'amount' },
          { text: 'Balance', align: 'left', value: 'balance' },
          { text: 'Description', align: 'left', value: 'description' },
          { text: 'Actions', align: 'center', value: 'actions' },
        ],
        item: [],
        categories: [],
        editedIndex: -1,
        category: {
          
        },
        editedItem: {
          category: '',
        
        },
        defaultItem: {
          category: '',
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
        apiCall({ url: "/api/payments?" + this.query, method: "GET" })
          .then(resp => {
            console.log("item is",resp);
            this.item = resp.data;
            this.loader=false
            this.pagination.total = resp.total;
            this.pagination.per_page = resp.per_page;
          })
           apiCall({ url: "/api/invoice", method: "GET" })
          .then(resp => {
            console.log(resp);
            this.invoices = resp.data;
            /*this.loader=false*/
          })
           apiCall({ url: "/api/payments/create", method: "GET" })
          .then(resp => {
            console.log("payment create", resp.form.number);
            this.payment.number = resp.form.number;
            /*this.loader=false*/
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
      resetDialogReferences() {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      },
      save () {
        this.saving = true;
        // update
        if (this.editedIndex > -1) {
          this.loadingMethod(true, "Updating Chargesheet")
          if(this.$refs.productform.validate()){
            this.loading = true
            apiCall({url: '/api/item/'+this.editedItem.id, data: this.editedItem, method: 'PUT' })
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
            apiCall({url: '/api/item', data: this.editedItem, method: 'POST' })
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
      savePayment(){
        if(this.$refs.paymentForm.validate()){
            this.loadingMethod(true, "Adding Payment")
            this.loading = true
            apiCall({url: '/api/payment', data: this.payment, method: 'POST' })
            .then(resp => {
              this.loading = false
              this.saving = false
              this.categories.push(resp)
              this.dialog = false
              this.message = 'Payment Added Succesfully'
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
    formattedDate(){
          return this.payment.date ? format(this.payment.date, 'Do MMM YYYY') : ''
        },
      length: function() {
        return Math.ceil(this.pagination.total / this.pagination.per_page);
      },
    }
  }
</script>
