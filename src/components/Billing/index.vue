<template>
  <div class="invoice">
    <v-container class="my-5">
      <span class="title">Invoices</span>
        <v-layout row justify-right>
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
        <v-data-table
          :headers="headers"
          :items="data"
          :loading="loader"
          class="elevation-1"
        >
        <template v-slot:items="props">
          <td>{{ props.item.id }}</td>
          <td class="text-xs-left">{{ props.item.date }}</td>
          <td @click="viewInvoice(props.item)" class="text-xs-left">{{ props.item.number }}</td>
          <td class="text-xs-left">{{ props.item.patient.name.text }} {{ props.item.patient.name.family }}</td>
          <td class="text-xs-left">{{ props.item.due_date }}</td>
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
              { text: 'Number', align: 'left', value: 'number' },
              { text: 'Patient', align: 'left', value: 'customer' },
              { text: 'Due Date', align: 'left', value: 'due_date' },
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