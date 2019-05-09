<template>
<div class="invoice-box">
  <v-container class="my-5">
  <table cellpadding="0" cellspacing="0">
    <tr class="top">
      <td colspan="4">
        <table>
          <tr>
            <td class="title">
              <img src="http://ilabafrica.ac.ke/wp-content/uploads/2016/01/ILABLOGO1.png" style="width:100%; max-width:300px;">
            </td>

            <td>
              Payment Number: {{info.number}}<br> Payment Method: {{ info.method }}<br> Description: {{ info.description }}
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
              Patient Address: {{ info.invoice[0].patient.address }}
            </td>
             <td>
              Patient Name: {{ info.invoice[0].patient.name.text }}<br> Patient Identifier: {{ info.invoice[0].patient.identifier }}<br>Patient Birth Date: {{ info.invoice[0].patient.birth_date }}<br>Gender: {{ }}
            </td>
          </tr>
        </table>
      </td>
    </tr>

     <v-data-table
    :headers="headers"
    :items="data"
    class="elevation-1"
  >
    <template v-slot:items="props">
      <td class="text-xs-right">{{ props.item.invoice_id }}</td>
      <td class="text-xs-right">{{ props.item.date }}</td>
      <td class="text-xs-right">{{ props.item.amount }}</td>
      <td class="text-xs-right">{{ props.item.balance }}</td>
    </template>
  
  </v-data-table>

  </table>
  </v-container>
</div>
</template>
<script>
import apiCall from "../../utils/api";
export default {
  data() {
    return{

 headers: [
          {
            text: 'Invoice Number',
            align: 'left',
            sortable: false,
            value: 'invoice_id'
          },
          { text: 'Date', value: 'date' },
          { text: 'Amount', value: 'amount' },
          { text: 'Balance', value: 'balance' }
         
        ],
        data:[],
        info:[]

    }
  },
 created() {
      this.initialize();
    },
    methods: {
      initialize() {
        this.loader=true
        apiCall({ url: "/api/payment/" + this.$route.params.id, method: "GET" })
          .then(resp => {
          console.log("response", resp);
          this.info = resp[0];
           this.data = resp;
            this.loader=false
          })
          .catch(error => {
            console.log(error.response);
          });

          
      },

}
}
</script>
<style>
.invoice-box {
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
  background: #eee;
  border-bottom: 1px solid #ddd;
  font-weight: bold;
}

.invoice-box table tr.details td {
  padding-bottom: 20px;
}

.invoice-box table tr.item td {
  border-bottom: 1px solid #eee;
}

.invoice-box table tr.item.last td {
  border-bottom: none;
}

.invoice-box table tr.item input {
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