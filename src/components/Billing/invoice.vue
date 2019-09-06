<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on }">
        <v-btn color="primary" dark v-on="on">Generate Invoice</v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">New Invoice</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field label="Invoice Number" :rules="[v => !!v || 'Invoice Number is Required']" v-model="invoice.number" disabled></v-text-field>
                <small>*Auto Generated</small>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-autocomplete
                    :items="patient"
                    item-text="name.text"
                    item-value="id"
                    label="Patients"
                    :rules="[v => !!v || 'Patient Name is Required']"
                    v-model="invoice.patient_id"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-menu>
                      <v-text-field :rules="[v => !!v || 'Date Opened is Required']" :value="invoice.date" slot="activator" label="Date Opened" prepend-icon="date_range"></v-text-field>
                      <v-date-picker v-model="invoice.date"></v-date-picker>
                </v-menu>
              </v-col>

              <v-col cols="12" sm="6" md="4">
                <v-menu>
                      <v-text-field :rules="[v => !!v || 'Date Due is Required']" :value="invoice.due" slot="activator" label="Date Due" prepend-icon="date_range"></v-text-field>
                      <v-date-picker v-model="invoice.due"></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12">
                <v-autocomplete
                    :items="item"
                    item-text="item_category.name"
                    item-value="id"
                    label="Item"
                    :rules="[v => !!v || 'Item is Required']"
                    v-model="invoice.item_id"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12">
                <v-text-field label="Price" :rules="[v => !!v || 'Price is Required']" v-model="invoice.price" disabled></v-text-field>
                <small>*Auto Generated</small>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field label="Quantity" :rules="[v => !!v || 'Quantity is Required']" v-model="invoice.quantity"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
          <v-btn color="blue darken-1" text @click="dialog = false">Generate</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
    import format from 'date-fns/format'
    import apiCall from "../../utils/api"
  export default {
    data() {
      return {
      dialog:false,

      invoice:{
        number: '',
        patient_id: '',
        date: '',
        due: '',
        item_id: '',
        price: '',
        quantity: ''
      },
      items:[],

      inputRules: [
          v => v.length >= !v  || 'Field is required'
        ],

        pagination: {
          page: 1,
          per_page: 0,
          total: 0,
          visible: 10
        }
      }
    },
    created() {
      this.initialize();
    },
    methods:{
    initialize(){
      
        apiCall({url: '/api/patient?' , method: 'GET' })
        .then(resp => {
          console.log(resp.data)
          this.patient = resp.data;
          this.pagination.per_page = resp.per_page;
          this.pagination.total = resp.total;
        })
        .catch(error => {
          console.log(error.response)
        })
        apiCall({url: '/api/item?' , method: 'GET' })
        .then(resp => {
          console.log(resp.data)
          this.item = resp.data;
          this.pagination.per_page = resp.per_page;
          this.pagination.total = resp.total;
        })
        .catch(error => {
          console.log(error.response)
        })
    }
    },
    computed:{

    }
  }
</script>