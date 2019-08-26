<template>
  <!--   <div class="invoice"> -->
    <div class="invoice-box">
      <table cellpadding="0" cellspacing="0">
        <tr class="top">
          <td colspan="4">
            <table>
              <tr>
                <td class="title">
                  <img src="http://ilabafrica.ac.ke/wp-content/uploads/2016/01/ILABLOGO1.png" style="width:100%; max-width:300px;">
                </td>

                <td>
                  Invoice #: 123<br> Created:  {{ message }}<br> Due:  {{ message }}
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr class="information">
          <td colspan="4">
            <table>
              <tr>
                <td>
              <!--  @ilabAfrica<br> HIS<br> -->
                </td>

                <td>
                                  <v-flex xs12 sm12 md12>
                <v-autocomplete
                    outline
                    :items="patient"
                    item-text="name.text"
                    item-value="id"
                    label="Patients"
                    :rules="[v => !!v || 'Patient Name is Required']"
                    v-model="generateBill.patient_id"
                    >
                </v-autocomplete>
                </v-flex>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr class="heading">
          <td colspan="3">Payment Method</td>
          <td>Check #</td>
        </tr>

        <tr class="details">
          <td colspan="3">Mpesa</td>
          <td>1000</td>
        </tr>

        <tr class="heading">
          <td>Item</td>
          <td>Unit Cost</td>
          <td>Quantity</td>
          <td>Sub Total</td>
        </tr>

        <tr class="item" v-for="(item, index) in items" :key="index"  v-bind:value="item.id">

          <td>
          
            <v-autocomplete

            outline
            :items="details"
            item-text="description"
            item-value="id"
            v-bind:value="details.id"
            v-model="item.description"

            @change="addItem()"

            >
          </v-autocomplete></td>
          <td><v-text-field
       
           :key="details.id"
           outline
           v-model="item.unit_price"

           >    
         </v-text-field></td>
         <td ><v-text-field
            @input="getSubTotal()"
          outline
          v-model="item.quantity"

          >    
        </v-text-field></td>
        <td class="total" >           <v-input
            color="success" loading
          >
         <b>  {{item.unit_price*item.quantity}}</b>
          </v-input></td>
        <!--       <td>${{ item.price * item.quantity | currency }}</td> -->
      </tr>

      <tr >
        <td colspan="4">
          <button class="btn-add-row" @click="addRow">Add Item</button>
        </td>
      </tr>

      <tr class="total">
        <td colspan="3"></td>
        <td>Total: ${{ total }}</td>
      </tr>
          <v-btn round outline xs12 sm6 color="primary darken-1" :disabled="!valid" @click.native="bill">
                  Make Payment <v-icon right dark>payment</v-icon>
                </v-btn>
    </table>
  </div>
</template>
<style >.invoice-box {
  max-width: 800px;
  margin: auto;
  padding: 30px;
  border: 1px solid #eee;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
  font-size: 16px;
  line-height: 24px;
  font-family: "Helvetica Neue", "Helvetica", Helvetica, Arial, sans-serif;
  color: #555;
}

.invoice-box table {
  width: 100%;
  line-height: inherit;
  text-align: left;
}

.invoice-box table td {
  padding: 5px;
  vertical-align: top;
}

.invoice-box table tr td:nth-child(n + 2) {
  text-align: right;
}

.invoice-box table tr.top table td {
  padding-bottom: 20px;
}

.invoice-box table tr.top table td.title {
  font-size: 45px;
  line-height: 45px;
  color: #333;
}

.invoice-box table tr.information table td {
  padding-bottom: 40px;
}

.invoice-box table tr.heading td {
  background: #ffff;
  border-bottom: 1px solid #ddd;
  font-weight: bold;
}

.invoice-box table tr.details td {
  padding-bottom: 20px;
}

.invoice-box table tr.item td {
  border-bottom: 1px solid #ffff;
}

.invoice-box table tr.item.last td {
  border-bottom: none;
}

.invoice-box table tr.item input {
  background: #ffff;
  padding-left: 5px;
}

.invoice-box table tr.item td:first-child input {
  margin-left: -5px;
  width: 100%;
}

.invoice-box table tr.total td:nth-child(2) {
  border-top: 2px solid #eee;
  font-weight: bold;
}

.invoice-box input[type="number"] {
  width: 60px;
}

@media only screen and (max-width: 600px) {
  .invoice-box table tr.top table td {
    width: 100%;
    display: block;
    text-align: center;
  }

  .invoice-box table tr.information table td {
    width: 100%;
    display: block;
    text-align: center;
  }
}

/** RTL **/
.rtl {
  direction: rtl;
  font-family: Tahoma, "Helvetica Neue", "Helvetica", Helvetica, Arial,
  sans-serif;
}

.rtl table {
  text-align: right;
}

.rtl table tr td:nth-child(2) {
  text-align: left;
}
</style>
<script>
  import format from 'date-fns/format'
  import apiCall from "../../utils/api"
  export default {
    data () {
      return {
        search: '',
        query: '',
        valid: true,
        loader: false,
        billDialog:false,
        dialog: false,
        delete: false,
        invoice:[],
       message:new Date().toJSON().slice(0,10).replace(/-/g,'/'),
        selected: {},
        items: [
        { description: "Website design", quantity: 1, price: 300 },
        { description: "Website design", quantity: 1, price: 75 },
        { description: "Website design", quantity: 1, price: 10 }
        ],
        invoice: {
          patient: '',
          number: '',
          reference: '',
          date: null,
          due: null,
        },
        details: [],
        dosages:[],
        prescription:[],
        editedIndex: -1,
        editedItem: {

          patient_id: '',
          medication_status_id: '',
          quantity:'',
          dosage_id:'',
          drugs:[],
          end_time:'',
          start_time:'',
          price:''
        },
        defaultItem: {

          patient_id: '',
          medication_status_id: '',
          quantity:'',
          dosage_id:'',
          drugs:[],
          end_time:'',
          start_time:''
        },
        generateBill: {

          patient_id: '',
          date: '',
          price: '',
          quantity: '',
          date: ''
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
        { text: 'Status', align: 'right', value: 'status' },
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
        callFunction: function () {
   
            var currentDate = new Date();
            console.log(currentDate);
  
            var currentDateWithFormat = new Date().toJSON().slice(0,10).replace(/-/g,'/');
            console.log(currentDateWithFormat);
     
        },
      addRow() {
        this.items.push({ description: "", quantity: 1, unit_price: 0, total:'' });
      },
      addItem(){
        var i =0
        for (i; i <= this.details.length; i++) {
          if(this.details[i].id == this.items[i].description){
            console.log("found")
            this.items[i].unit_price = this.details[i].unit_price
          }
        }
         
      },
      getSubTotal(){
        var i =0
        for (i; i <= this.details.length; i++) {
          if(this.details[i].id == this.items[i].description){
            //console.log("details is", this.details[i])
            console.log("quantity is", this.items[i].quantity*this.details[i].unit_price)
            console.log("result", this.item[i].total)
            this.item[i].total=this.details[i].unit_price*this.item[i].quantity
          }
        }
      },
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
        })
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

        apiCall({url: '/api/medications?' + this.query, method: 'GET' })
        .then(resp => {
          console.log("The Prescriptions are",resp.data)
          this.prescription = resp.data;
          this.loader = false
          this.pagination.per_page = resp.per_page;
          this.pagination.total = resp.total;
        })
        .catch(error => {
          console.log(error.response)
        })
        apiCall({ url: "/api/item", method: "GET" })
        .then(resp => {
          console.log("item is",resp);
          this.details = resp.data;
          this.loader=false

        })
        .catch(error => {
          console.log(error.response);
        });
      },

      save(){

        this.saving = true;
        // update
        if (this.editedIndex > -1) {
          if(this.$refs.form.validate()){
            apiCall({url: '/api/invoice/'+this.editedItem.id, data: this.editedItem, method: 'PUT' })
            .then(resp => {
              Object.assign(this.patient[this.editedIndex], this.editedItem)
              console.log(resp)
              this.resetDialogReferences();
              this.saving = false;
              this.message = 'Patient Invoice Updated Succesfully';
              this.snackbar = true;
            })
            .catch(error => {
              console.log(error.response)
            })
            this.close()
          }
        }
      },
      editItem (item) {
        this.editedIndex = this.patient.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
        this.item.total=this.item*this.quantity
      },

      deleteItem (item) {

        confirm('Are you sure you want to delete this item?') && (this.delete = true)

        if (this.delete) {
          const index = this.patient.indexOf(item)
          this.patient.splice(index, 1)
          apiCall({url: '/api/invoice/'+item.id, method: 'DELETE' })
          .then(resp => {
            this.message = 'Invoice Deleted Succesfully';
            this.snackbar = true;

            console.log(resp)
          })
          .catch(error => {
            console.log(error.response)
          })
        }

      }
    },
        mounted () {
      this.callFunction()
    },
    computed: {
        // total: function(){
        //   console.log(this.data);
        //   return this.data.reduce(function(total, item){
        //     return total + item.total; 
        //   },0);
        // },
        total() {
          return this.items.reduce(
            (acc, item) => acc + item.unit_price * item.quantity,
            0
            );
        },

        formattedDate(){
          return this.invoice.date ? format(this.invoice.date, 'Do MMM YYYY') : ''
        },
        formattedDueDate(){
          return this.invoice.due ? format(this.invoice.due, 'Do MMM YYYY') : ''
        },
        length: function() {
          return Math.ceil(this.pagination.total / this.pagination.per_page);
        }
        

      }


    }
  </script>
