<template>
  <!--   <div class="invoice"> -->
    <div class="invoice-box">
      <table cellpadding="0" cellspacing="0">
        <tr class="top">
          <td colspan="4">
            <table>
              <tr>
                <td class="title">
                 Create Invoice
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
          <v-text-field
            label="Invoice Number"
            v-model="invoice.number"
            
          ></v-text-field>
          </v-flex>
                   <v-flex xs12 sm12 md12>
                <v-autocomplete
                    outline
                    :items="patient"
                    item-text="name.text"
                    item-value="id"
                    label="Patient"
                    :rules="[v => !!v || 'Patient Name is Required']"
                    v-model="invoice.patient_id"
                    >
                </v-autocomplete>
                </v-flex>
                <v-flex xs4 sm4 md4>
                    <v-menu>
                      <v-text-field  outline :rules="[v => !!v || 'Date Created Is Required']" :value="invoice.date" slot="activator" label="Date Created"></v-text-field>
                      <v-date-picker v-model="invoice.date"></v-date-picker>
                    </v-menu>
                  </v-flex>
                  <v-flex xs4 sm4 md4>
                    <v-menu>
                      <v-text-field  outline :rules="[v => !!v || 'Date Due Is Required']" :value="invoice.due_date" slot="activator" label="Date Due"></v-text-field>
                      <v-date-picker v-model="invoice.due_date"></v-date-picker>
                    </v-menu>
                  </v-flex>
                <v-flex xs12>
                  <v-textarea
                    v-model="invoice.description"
                    :rules="[v => !!v || 'Description is Required']"
                    outline
                    label="Description"
                    required>
                  </v-textarea>
                </v-flex>
                <v-flex xs12 sm12 md12>
          <v-select
            label="Status"
            v-model="invoice.status"
            :items="state"
            :rules="[v => !!v || 'Status is Required']"
          ></v-select>
          </v-flex>
                </td>
              </tr>
            </table>
          </td>
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

            :items="details"
            item-text="description"
            
            v-bind:value="details.id"
            v-model="item.description"


            @change="addItem()"

            >
          </v-autocomplete></td>
          <td><v-text-field
       
           :key="details.id"
           v-model="item.unit_price"
    
           >    
         </v-text-field></td>
         <td ><v-text-field
            @input="getSubTotal()"
  
          v-model="item.qty"
          

          >    
        </v-text-field></td>
        <td class="total" >           <v-input
            color="success" loading  v-model="invoice.sub_total" 
          >
         <b>  {{item.unit_price*item.qty}}</b>
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
        <td  v-model="invoice.total">Total: ${{ total }}</td>
      </tr>

          <v-btn round outline xs12 sm6 color="primary darken-1" :disabled="!valid" @click.native="save">
                  Generate Invoice <v-icon right dark>payment</v-icon>
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
  background: #grey;
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
  background: #grey;
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
        dialog: false,
        delete: false,
         message:new Date().toJSON().slice(0,10).replace(/-/g,'/'),
        selected: {},
        items: [],
        invoice: {
        number: '',
        patient_id: '',
        date: '',
        due_date: '',
        description: '',
        status: 'not paid',
        sub_total: '0',
        discount: '0',
        tax: '0',
        total: '0',
        item_id: '',
        unit_price: '',
        qty: ''
        },
      
        details: [],
        state:['paid','not paid'],
        inputRules: [
        v => v.length >= !v  || 'Field is required'
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
        this.items.push({ item_id: "", qty: 1, unit_price: 0, total:'' });
      },
        addItem(){
        var i =0
        for (i; i <= this.details.length; i++) {
          if(this.details[i].id == this.items[i].item_id){
            console.log("found")
            this.items[i].unit_price = this.details[i].unit_price
          }
        }
         
      },

      getSubTotal(){
        var i =0
        for (i; i <= this.details.length; i++) {
          if(this.details[i].id == this.items[i].item_id){
            //console.log("details is", this.details[i])
            console.log("quantity is", this.items[i].qty*this.details[i].unit_price)
            console.log("result", this.item[i].total)
            this.item[i].total=this.details[i].unit_price*this.item[i].qty
          }
        }
      },
      initialize() {
        this.loader=true
        this.query = 'page='+ this.pagination.page;
        if (this.search != '') {
          this.query = this.query+'&search='+this.search;
        }
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

        apiCall({ url: "/api/invoice/create", method: "GET" })
          .then(resp => {
            console.log("invoice create", resp.form.number);
            this.invoice.number = resp.form.number;
            console
            /*this.loader=false*/
          })
          .catch(error => {
            console.log(error.response);
          });

        apiCall({ url: "/api/item?", method: "GET" })
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
          
            this.loading = true
            apiCall({url: '/api/invoice', data: this.invoice, method: 'POST' })
            .then(resp => {
          
              // this.item.push(resp)
              // console.log("Post is:",this.item.push(resp))
              this.productDialog = false
              this.resetDialogReferences();
              this.saving = false;
              this.message = 'Invoice Added Succesfully';
              this.snackbar = true;
              this.loadingMethod(false)
            })
            .catch(error => {
              this.loading = false
              console.log(error.response)
              this.loadingMethod(false)
            })
            this.close()
          
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
            (acc, item) => acc + item.unit_price * item.qty,
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
