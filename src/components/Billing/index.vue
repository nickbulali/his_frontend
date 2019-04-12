<template>
  <div class="invoice">
  	<v-container class="my-5">
        <v-layout column justify-center>
          <v-flex sm12>
  		      <span class="title">Invoices</span>
          </v-flex>
          <v-flex sm12>
            <v-btn color="primary" router to = "/billing/invoice/create">Create New Invoice</v-btn>
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
          <td class="text-xs-left">{{ props.item.number }}</td>
          <td class="text-xs-left">{{ props.item.customer.firstname }} {{ props.item.customer.lastname }}</td>
          <td class="text-xs-left">{{ props.item.due_date }}</td>
          <td class="text-xs-right">{{ props.item.total }}</td>
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
  	</v-container>

  </div>
</template>

<script>
  import format from 'date-fns/format'
  import apiCall from "../../utils/api";
  export default {
    data () {
      return {
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
              { text: 'Customer', align: 'left', value: 'customer' },
              { text: 'Due Date', align: 'left', value: 'due_date' },
              { text: 'Total', align: 'right', value: 'total' },
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
        data: []
      }
    },
    created() {
      this.initialize();
    },
    methods: {
      initialize() {
        this.loader=true
        apiCall({ url: "/api/invoices", method: "GET" })
          .then(resp => {
            console.log(resp);
            this.data = resp.results.data;
            this.loader=false

          })
          .catch(error => {
            console.log(error.response);
          });
      },
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
        }
      }
  }
</script>
