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
        
      </template>
      <v-card>
        <v-toolbar dark color="primary" class="elevation-0">
          <v-spacer></v-spacer>
            <v-toolbar-title>MAKE PAYMENT</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm12 md12>
          <v-text-field
            label="Payment Number"
            v-model="paymentNew.number"
            disabled
          ></v-text-field>
          </v-flex>
                    <v-flex xs12 sm12 md12>
                <v-autocomplete
                    single-line
                    :items="invoice"
                    item-text="number"
                    item-value="id"
                    label="Invoice Number"
                    :rules="[v => !!v || 'Invoice Number is Required']"
                    v-model="paymentNew.invoice_id"
                    >
                </v-autocomplete>
                </v-flex>
                <v-flex xs12 sm12 md12>
                    <v-menu>
                      <v-text-field  single-line :rules="[v => !!v || 'Date is Required']" :value="paymentNew.date" slot="activator" label="Date"></v-text-field>
                      <v-date-picker v-model="paymentNew.date"></v-date-picker>
                    </v-menu>
                  </v-flex>
                <v-flex xs12>
                  <v-textarea
                    v-model="paymentNew.description"
                    :rules="[v => !!v || 'Description is Required']"
                    single-line
                    label="Description"
                    required>
                  </v-textarea>
                </v-flex>
                <v-flex xs12 sm12 md12>
                 <v-select  
                  single-line
                  v-model="paymentNew.method"
                  :rules="[v => !!v || 'Method is Required']"
                  label="Payment Method"
                  :items="paymentMethod">    
                </v-select>
              </v-flex>
                <v-flex xs12 sm12 md12>
          <v-select
            label="Status"
            v-model="paymentNew.status"
            :items="state"
            :rules="[v => !!v || 'Status is Required']"
          ></v-select>
          </v-flex>
          <v-flex xs12 sm12 md12>
                 <v-text-field  
                  single-line
                  v-model="paymentNew.amount"
                  :rules="[v => !!v || 'Amount is Required']"
                  label="Amount">    
                </v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md12>
                 <v-text-field  
                  single-line
                  v-model="paymentNew.balance"
                  :rules="[v => !!v || 'Balance is Required']"
                  label="Balance">    
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
            <v-btn round outline xs12 sm6 :loading="loading" color="primary darken-1" flat @click="save">Save
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
            <v-toolbar-title>Edit Payment</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-form ref="productform" v-model="valid" lazy-validation>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
               <v-flex xs12 sm12 md12>
          <v-text-field
            label="Payment Number"
            v-model="editPayment.number"
            single-line
            disabled
          ></v-text-field>
          </v-flex>
                    <v-flex xs12 sm12 md12>
                <v-autocomplete
                    single-line
                    :items="invoice"
                    item-text="number"
                    item-value="id"
                    label="Invoice Number"
                    :rules="[v => !!v || 'Invoice Number is Required']"
                    v-model="editPayment.invoice_id"
                    >
                </v-autocomplete>
                </v-flex>
                <v-flex xs12 sm12 md12>
                    <v-menu>
                      <v-text-field  single-line :rules="[v => !!v || 'Date is Required']" :value="editPayment.date" slot="activator" label="Date"></v-text-field>
                      <v-date-picker v-model="editPayment.date"></v-date-picker>
                    </v-menu>
                  </v-flex>
                <v-flex xs12>
                  <v-textarea
                    v-model="editPayment.description"
                    :rules="[v => !!v || 'Description is Required']"
                    single-line
                    label="Description"
                    required>
                  </v-textarea>
                </v-flex>
                <v-flex xs12 sm12 md12>
                 <v-select  
                  single-line
                  v-model="editPayment.method"
                  :rules="[v => !!v || 'Method is Required']"
                  label="Payment Method"
                   :items="paymentMethod">    
                </v-select>
              </v-flex>
                <v-flex xs12 sm12 md12>
          <v-select
          single-line
            label="Status"
            v-model="editPayment.status"
            :items="state"
            :rules="[v => !!v || 'Status is Required']"
          ></v-select>
          </v-flex>
          <v-flex xs12 sm12 md12>
                 <v-text-field  
                  single-line
                  v-model="editPayment.amount"
                  :rules="[v => !!v || 'Amount is Required']"
                  label="Amount">    
                </v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md12>
                 <v-text-field  
                  single-line
                  v-model="editPayment.balance"
                  :rules="[v => !!v || 'Balance is Required']"
                  label="Balance">    
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
            <v-btn round outline xs12 sm6 color="primary darken-1" :disabled="!valid" @click.native="saveUpdate" :loading="loading">
              Save <v-icon right dark>cloud_upload</v-icon>
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
    <v-container class="my-5">
      <span class="title">Payment</span>
        <v-layout row justify-right>
          <v-flex sm12 md6>
            <v-layout row wrap>
              <v-flex sm12 md6>
                <v-btn color="primary" @click = "dialog = true" dark class="mb-2" outline>Make Payment
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
          :items="data"
          :loading="loader"
          class="elevation-1"
        >
        <template v-slot:items="props">
          <td>{{ props.item.id }}</td>
          <td class="text-xs-left">{{ props.item.number }}</td>
          <td class="text-xs-left">{{ props.item.invoice.number }}</td>
          <td class="text-xs-left">{{ props.item.date }}</td>
          <td class="text-xs-left">{{ props.item.method }}</td>
          <td class="text-xs-left">{{ props.item.description }}</td>
          <td class="text-xs-left">{{ props.item.status }}</td>
          <td class="text-xs-left">{{ props.item.balance }}</td>
          <td class="text-xs-left">{{ props.item.amount }}</td>
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
          { text: 'Date', align: 'left', value: 'date' },
          { text: 'Method', align: 'left', value: 'method' },
          { text: 'Description', align: 'left', value: 'description' },
          { text: 'Status', align: 'left', value: 'status' },
          { text: 'Balance', align: 'left', value: 'balance' },
          { text: 'Amount', align: 'left', value: 'amount' },
          { text: 'Actions', align: 'center', value: 'actions' },
        ],
        item:[],
        payment:[],
        editedIndex: -1,
        paymentNew: {
          invoice_id: '',
          description: '',
          status: 'not complete',
          date: '',
          method: '',
          number: '',
          amount: '',
          balance: ''
        },
        editPayment: {
          invoice_id: '',
          description: '',
          status: '',
          date: '',
          method: '',
          number: '',
          amount: '',
          balance: ''
        },
        pagination: {
          page: 1,
          per_page: 0,
          total: 0,
          visible: 10
        },
        state:['complete','not complete'],
        paymentMethod:['cash','insurance','credit card','mpesa','bank'],
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
        apiCall({ url: "/api/payment?" + this.query, method: "GET" })
          .then(resp => {
            console.log("payment is",resp);
            this.data = resp.data;
            this.loader=false
            this.pagination.total = resp.total;
            this.pagination.per_page = resp.per_page;
          })
          .catch(error => {
            console.log(error.response);
          });

             apiCall({ url: "/api/payment/create", method: "GET" })
          .then(resp => {
            console.log("payment create", resp.form.number);
            this.paymentNew.number = resp.form.number;
            console
            /*this.loader=false*/
          })
          .catch(error => {
            console.log(error.response);
          });

           apiCall({ url: "/api/invoice?" + this.query, method: "GET" })
          .then(resp => {
            console.log("invoice is",resp);
            this.invoice = resp.data;
            this.loader=false
            this.pagination.total = resp.total;
            this.pagination.per_page = resp.per_page;
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
        this.editPayment = Object.assign({}, item)
        this.productDialog = true
      },
      resetDialogReferences() {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      },
     
          save(){
          this.loadingMethod(true, "Adding Payment")
          if(this.$refs.form.validate()){
            this.loading = true
            apiCall({url: '/api/payment', data: this.paymentNew, method: 'POST' })
            .then(resp => {
          
              // this.item.push(resp)
              // console.log("Post is:",this.item.push(resp))
              this.productDialog = false
              this.resetDialogReferences();
              this.saving = false;
              this.message = 'Payment Added Succesfully';
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

      saveUpdate () {

        this.saving = true;
          this.loadingMethod(true, "Updating Payment")
          if(this.$refs.productform.validate()){

            this.loading = true
            apiCall({url: '/api/payment/'+ this.editPayment.id, data: this.editPayment, method: 'PUT' })
            .then(resp => {
              this.loading = false
              this.productDialog = false
              this.saving = false;
              this.message = 'Payment Updated Succesfully';
              this.snackbar = true;

              this.loadingMethod(false)
            })
            .catch(error => {
              this.loading = false
              console.log(this.item)
              this.loadingMethod(false)
            })
            this.close()
          }

      },
    
 deleteItem (item) {

        confirm('Are you sure you want to delete this Payment Entry?') && (this.delete = true)

        if (this.delete) {
          const index = this.payment.indexOf(item)
         this.payment.splice(index, 1)
          apiCall({url: '/api/payment/'+item.id, method: 'DELETE' })
          .then(resp => {
              this.message = 'Payment Deleted Succesfully';
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
        return this.editedIndex === -1 ? 'New Payment' : 'Edit Payment'
      },

      length: function() {
        return Math.ceil(this.pagination.total / this.pagination.per_page);
      },
    }
  }
</script>