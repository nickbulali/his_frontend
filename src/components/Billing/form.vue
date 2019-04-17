<template>
  <div class="invoice">
    <v-container class="my-5">

    <v-layout row justify-center>
        <v-card v-if = "completed == false">
          <v-card-title>
            <span class="headline">New Invoice</span>
          </v-card-title>
          
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
          >
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm6 md6>
                    <v-autocomplete
                      :rules="inputRules"
                      :items = "patients"
                      v-model="invoice.patient"
                      outline
                      item-text="name.text"
                      item-value="id"
                      label="Patient"
                      required>
                    </v-autocomplete>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-text-field
                      :rules="inputRules"
                      v-model="invoice.number"
                      label="Number"
                      outline>
                    </v-text-field>
                  </v-flex>
                  <v-flex xs12 sm12 md12>
                    <v-text-field
                      :rules="inputRules"
                      label="Reference"
                      hint="optional"
                      v-model="invoice.reference"
                      persistent-hint
                      outline
                      required
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-menu>
                      <v-text-field
                        :rules="inputRules"
                        :value="formattedDate"
                        slot="activator"
                        label="Date"
                        prepend-inner-icon="date_range"
                        outline>
                      </v-text-field>
                      <v-date-picker v-model="invoice.date"></v-date-picker>
                    </v-menu>
                  </v-flex>
                  <v-flex xs12 sm6 md6 lg6>
                    <v-menu>
                      <v-text-field
                        :rules="inputRules"
                        :value="formattedDueDate"
                        slot="activator"
                        label="Due Date"
                        prepend-inner-icon="hourglass_empty"
                        outline>
                      </v-text-field>
                      <v-date-picker v-model="invoice.due"></v-date-picker>
                    </v-menu>
                  </v-flex>        
                </v-layout>
              </v-container>
            </v-card-text>        
            <v-card-actions>
              <v-spacer></v-spacer>
                <v-btn round outline color="blue lighten-1" flat router to = "/billing/invoice">
                Cancel
                <v-icon right dark>close</v-icon>
              </v-btn>
              <v-btn round outline xs12 sm6 color="primary darken-1" :disabled="!valid" @click.native="" :loading="loading">
              Save <v-icon right dark>cloud_upload</v-icon>
            </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
    </v-layout>
    <v-data-table
      v-if = "completed"
      :headers="invoiceHeaders"
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
        completed: false,
        valid: true,
        loader: false,
        loading:false,
        dialog: false,
        invoice: {
          patient: '',
          number: '',
          reference: '',
          date: null,
          due: null,
          products: []
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
        patients: [],
        products: []
      }
    },
    created() {
      this.initialize();
    },
    methods: {
      initialize() {
        /*this.loader=true*/
        apiCall({ url: "/api/patient", method: "GET" })
          .then(resp => {
            console.log(resp);
            this.patients = resp.data;
            /*this.loader=false*/
          })
          .catch(error => {
            console.log(error.response);
          });

          apiCall({ url: "/api/item", method: "GET" })
          .then(resp => {
            console.log(resp);
            this.products = resp.data;
            /*this.loader=false*/
          })
          .catch(error => {
            console.log(error.response);
          });
      }
    },
    computed: {
        formattedDate(){
          return this.invoice.date ? format(this.invoice.date, 'Do MMM YYYY') : ''
        },
        formattedDueDate(){
          return this.invoice.due ? format(this.invoice.due, 'Do MMM YYYY') : ''
        }
      }
  }
</script>
