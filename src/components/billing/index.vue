<template>
  <div class="invoice">
    <v-container class="my-5">
      <span class="title">Invoices</span>
        <v-layout>
          <v-flex sm12 md6>
            <v-btn color="primary" to="/billing/billing" dark class="mb-2" outline>Generate Bill
              <v-icon right dark>payment</v-icon>
            </v-btn>
          </v-flex>
          <v-flex sm12 md6>
            <v-layout row wrap>
              <v-flex sm12 md6>
               
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
              v-on:keyup.enter="initialize"
            ></v-text-field>
             </v-toolbar>
          </v-flex>
        </v-layout>
     <v-dialog v-model="dialog" max-width="600px">
      <template v-slot:activator="{ on }">
      <!--   <v-btn color="primary" dark v-on="on">Open Dialog</v-btn> -->
      </template>
      <v-card>
        <v-toolbar dark color="primary" class="elevation-0">
          <v-spacer></v-spacer>
            <v-toolbar-title>Edit Invoice</v-toolbar-title>
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
                    v-model="editedItem.patient_id"
                    >
                </v-autocomplete>
                </v-flex>
                       <v-flex xs12 sm12 md12>
                <v-text-field
                  outline
                  v-model="editedItem.number"
                  :rules="[v => !!v || 'Number is Required']"
                  label="Number">    
                </v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md12>
                    <v-menu>
                      <v-text-field  outline :rules="[v => !!v || 'Date created is Required']" :value="editedItem.date" slot="activator" label="Date Created"></v-text-field>
                      <v-date-picker v-model="editedItem.date"></v-date-picker>
                    </v-menu>
                  </v-flex>
                  <v-flex xs12 sm12 md12>
                    <v-menu>
                      <v-text-field  outline :rules="[v => !!v || 'Due Date is Required']" :value="editedItem.due_date" slot="activator" label="Due Date"></v-text-field>
                      <v-date-picker v-model="editedItem.due_date"></v-date-picker>
                    </v-menu>
                  </v-flex>
                 <v-flex xs12 sm12 md12>
                <v-text-field
                  outline
                  v-model="editedItem.status"
                  :rules="[v => !!v || 'Status is Required']"
                  label="Status">    
                </v-text-field>
              </v-flex>
              <v-flex xs12>
                  <v-textarea
                    v-model="editedItem.description"
                    outline
                    label="Description"
                    required>
                  </v-textarea>
                </v-flex>
              <v-flex xs12 sm12 md12>
                <v-text-field
                  outline
                  v-model="editedItem.discount"
                  :rules="[v => !!v || 'Discount is Required']"
                  label="Discount">    
                </v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md12>
                <v-text-field
                  outline
                  v-model="editedItem.sub_total"
                  :rules="[v => !!v || 'Sub_total is Required']"
                  label="Sub Total">    
                </v-text-field>
              </v-flex>
                 <v-flex xs12 sm12 md12>
                <v-text-field
                  outline
                  v-model="editedItem.total"
                  :rules="[v => !!v || 'Total is Required']"
                  label="Total">    
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


        <v-data-table
          :headers="headers"
          :items="data"
          :loading="loader"
          class="elevation-1"
        >
        <template v-slot:items="props">
          <td>{{ props.item.id }}</td>
          <td class="text-xs-left">{{ props.item.date }}</td>
           <td class="text-xs-left">{{ props.item.due_date }}</td>
           <td class="text-xs-left">{{ props.item.number }}</td>
          <td class="text-xs-left">{{ props.item.patient.name.text }} {{ props.item.patient.name.family }}</td>
          <td class="text-xs-right">{{ props.item.status }}</td>
          <td class="text-xs-right">{{ props.item.description }}</td>
          <td class="text-xs-right">{{ props.item.discount }}</td>
          <td class="text-xs-right">{{ props.item.sub_total }}</td>
          <td class="text-xs-right">{{ props.item.total }}</td>
          <td class="justify-center layout px-0">

          <v-btn
            outline
            small
            title="Edit"
            color="teal"
            flat
            router :to="{name:'ShowInvoice', params:{id: props.item.id}}"
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
        <template slot="footer">
          <td>
            <strong>Total</strong>
          </td>
          <td class="text-xs-right" :colspan="headers.length-1">
            <strong>{{total}}</strong>
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
        valid: true,
        loader: false,

        invoice: {
          patient: '',
          number: '',
          reference: '',
          date: null,
          due: null,
        },

        dialog: false,
        delete: false,
        invoice:[],

          editedIndex: -1,
        editedItem: {
        
        patient_id: '',
        number: '',
        date:'',
        due_date:'',
        status:'',
        total:'',
        sub_total: '',
        discount: '',
        description: ''

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
              { text: 'Date', align: 'left', value: 'date' },
              { text: 'Due Date', align: 'left', value: 'date' },
              { text: 'Number', align: 'left', value: 'number' },
              { text: 'Patient', align: 'left', value: 'customer' },
              { text: 'Status', align: 'left', value: 'status' },
              { text: 'Description', align: 'left', value: 'description' },
              { text: 'Discount', align: 'left', value: 'discount' },
              { text: 'Sub Total', align: 'right', value: 'sub_total' },
              { text: 'Total', align: 'right', value: 'total' },
               { text: 'Actions', align: 'center', value: 'actions' },
            ],
        invoiceHeaders: [
              {
                text: 'Item Description',
                align: 'left',
                sortable: false,
                value: 'item_description'
              },
              { text: 'Unit Price', align: 'left', value: 'unit_price' },
              { text: 'Quantity', align: 'left', value: 'quantity' },
              { text: 'Total', align: 'left', value: 'total' },
        ],
        data: [],
        pagination: {
          page: 1,
          per_page: 0,
          total: 0,
          visible: 10
        },
        state:['paid','not paid'],
      }
    },
    created() {
      this.initialize();
    },
    methods: {
      initialize() {
        this.loader=true
        this.query = 'page='+ this.pagination.page;
        if (this.search != '') {
            this.query = this.query+'&search='+this.search;
        }
        apiCall({ url: "/api/invoice?" + this.query, method: "GET" })
          .then(resp => {
            console.log(resp);
            this.data = resp.data;
            this.loader=false
            this.pagination.total = resp.total;
            this.pagination.per_page = resp.per_page;
          })
          .catch(error => {
            console.log(error.response);
          });
      },
      viewInvoice(invoice){

        console.log("invoce is",invoice)
      }
    },
    computed: {
        total: function(){
          console.log(this.data);
          return this.data.reduce(function(total, item){
            return total + item.total; 
          },0);
        },
        formattedDate(){
          return this.invoice.date ? format(this.invoice.date, 'Do MMM YYYY') : ''
        },
        formattedDueDate(){
          return this.invoice.due ? format(this.invoice.due, 'Do MMM YYYY') : ''
        },
        length: function() {
          return Math.ceil(this.pagination.total / this.pagination.per_page);
        },
      }
  }
</script>
