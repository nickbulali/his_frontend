<template>

  <div class="invoice">
    <v-dialog v-model="productDialog" max-width="600px">
      <v-card>
        <v-toolbar dark color="primary" class="elevation-0">
          <v-spacer></v-spacer>
            <v-toolbar-title>{{ formTitle }}</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-form ref="productform" v-model="valid" lazy-validation>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm12 md12>
                  <v-text-field
                    outline
                    v-model="editedItem.patient_id"
                    :rules="[v => !!v || 'Patient Name is Required']"
                    label="Patient">
                  </v-text-field>
                </v-flex>
                <v-flex xs12 sm12 md12>
                  <v-text-field
                    outline
                    v-model="editedItem.user_id"
                    :rules="[v => !!v || 'Staff Name is Required']"
                    label="Staff">
                  </v-text-field>
                </v-flex>
               
                 <v-flex xs12 sm12 md12>
                    <v-menu>
                      <v-text-field  outline :rules="[v => !!v || 'Time Received is Required']" :value="editedItem.appointment_date" slot="activator" label="Appointment Date "></v-text-field>
                      <v-date-picker v-model="editedItem.appointment_date"></v-date-picker>
                    </v-menu>
                  </v-flex>
                 <v-flex xs12 sm12 md12>
                    <v-menu>
                      <v-text-field  outline :rules="[v => !!v || 'Time Received is Required']" :value="editedItem.appointment_time" slot="activator" label="Appointment Date "></v-text-field>
                      <v-time-picker v-model="editedItem.appointment_time"></v-time-picker>
                    </v-menu>
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
            <v-btn round outline xs12 sm6 color="primary darken-1" :disabled="!valid" @click.native="save" :loading="loading">
              Save <v-icon right dark>cloud_upload</v-icon>
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
    <v-container class="my-5">
    <p>   <span class="title">View Appointments</span></p>
         <v-spacer></v-spacer>
        <v-layout row justify-right>
          <v-flex sm12 md6>
            <v-layout row wrap>
           
              <v-flex sm12 md6>
                <v-btn @click = "productDialog = true" color="primary" dark class="mb-2" outline>
                 Add Appointment
                  <v-icon right dark>playlist_add</v-icon>
                </v-btn>
              </v-flex>
            </v-layout>
          </v-flex>
      
        </v-layout>
  <v-layout wrap>
     <v-flex
        sm4
        xs12
        class="text-sm-left text-xs-center"
      >
        <v-btn @click="$refs.calendar.prev()">
          <v-icon
            dark
            left
          >
            keyboard_arrow_left
          </v-icon>
          Prev
        </v-btn>
      </v-flex>
      <v-flex
        sm4
        xs12
        class="text-xs-center"
      >
        <v-select
          v-model="type"
          :items="typeOptions"
          label="Type"
        ></v-select>
      </v-flex>
      <v-flex
        sm4
        xs12
        class="text-sm-right text-xs-center"
      >
        <v-btn @click="$refs.calendar.next()">
          Next
          <v-icon
            right
            dark
          >
            keyboard_arrow_right
          </v-icon>
        </v-btn>
      </v-flex>

        <v-flex
        xs12
        class="mb-3"
      >
        <v-sheet height="500">
          <v-calendar
            ref="calendar"
            v-model="start"
            :type="type"
           
            color="primary"
            :now="today"
            :value="today"
          >
            
             <template v-slot:day="{ date }">
              <template v-for="(event, index) in item[date]" v-if="index <= 0">
                <v-menu
                  :key="event.id"
                  v-model="event.open"
                  full-width
                  offset-x
                >
                  <template v-slot:activator="{ on }">
                    <div
                      v-if="!event.time"
                      v-ripple
                      class="my-event"
                      v-on="on"
                      v-html="event.title"
                    ></div>
                  </template>
                  <v-card
                    color="grey lighten-4"
                    min-width="350px"
                    flat
                  >
                    <v-toolbar
                      color="primary"
                      dark
                    >
                      <v-btn icon>
                        <v-icon>edit</v-icon>
                      </v-btn>
                      <v-toolbar-title>{{event}}</v-toolbar-title>
                      <v-spacer></v-spacer>
                      <v-btn icon>
                        <v-icon>favorite</v-icon>
                      </v-btn>
                      <v-btn icon>
                        <v-icon>more_vert</v-icon>
                      </v-btn>
                    </v-toolbar>
                    <v-card-title primary-title>
                       <span>{{item[date]}}</span>
           
                    </v-card-title>
                    <v-card-actions>
                      <v-btn
                        flat
                        color="secondary"
                      >
                        Cancel
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-menu>
              </template>
            </template>
          </v-calendar>
        </v-sheet>
      </v-flex>
  
     
 
  </v-layout>
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
        users: [],
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
      
        item: [],
        appointment: [],
        Users: [],
        editedIndex: -1,
        category: {
          name: '',
          description: '',
        },
        editedItem: {
           patient_id:'',
          user_id: '',
          appointment_date: '',
          appointment_time:'',
        },
        defaultItem: {
          patient_id:'',
          user_id: '',
          appointment_date: '',
          appointment_time:'',
         
        },
      
         
   
   type: 'month',
    start: new Date().toISOString().slice(0,10),
   
    typeOptions: [
      { text: 'Day', value: 'day' },
      { text: '4 Day', value: '4day' },
      { text: 'Week', value: 'week' },
      { text: 'Month', value: 'month' },
      { text: 'Custom Daily', value: 'custom-daily' },
      { text: 'Custom Weekly', value: 'custom-weekly' }
    ],
   
   today: new Date().toISOString().slice(0,10),
    events: [
      {
        patient_id:'',
        user_id: '',
        appointment_date: '',
        appointment_time:'',
        open: false
      },
      {
        title: 'Vacation',
        details: 'Going to the beach!',
        date: new Date().toISOString().slice(0,10),
        open: false
      },
     
    ]
  
      }
    },
    created() {
      this.initialize();
    },
    methods: {
       open (event) {
      alert(event.title)
    },
      loadingMethod(load, message="") {
        this.loadingDialog.loading = load;
        this.loadingDialog.message = message
      },
        showIntervalLabel (interval) {
      return interval.minute === 0
    },
      initialize() {
        this.loader=true
        apiCall({ url: "/api/appointment", method: "GET" })
          .then(resp => {
            
            this.item = resp;
            console.log("Appointment is",this.item);
            this.loader=false
          })
          .catch(error => {
            console.log(error.response);
          });
            apiCall({url: '/api/users?', method: 'GET' })
        .then(resp => {
          console.log(resp.data)
          this.users = resp.data;
             this.loader=false
          this.pagination.per_page = resp.per_page;
          this.pagination.total = resp.total;
        })
        .catch(error => {
          console.log(error.response)
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
          this.loadingMethod(true, "Updating Appointments")
          if(this.$refs.productform.validate()){
            this.loading = true
            apiCall({url: '/api/appointment/'+this.editedItem.id, data: this.editedItem, method: 'PUT' })
            .then(resp => {
              this.loading = false
              Object.assign(this.item[this.editedIndex], this.editedItem)
              console.log(resp)
              this.productDialog = false
              this.resetDialogReferences();
              this.saving = false;
              this.message = 'Appointment Information Updated Succesfully';
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
          this.loadingMethod(true, "Appointment Added Succesfully")
          if(this.$refs.productform.validate()){
            this.loading = true
            apiCall({url: '/api/appointment', data: this.editedItem, method: 'POST' })
            .then(resp => {
              this.loading = false
              this.item.push(resp)
              console.log(this.editedItem)
              this.productDialog = false
              this.resetDialogReferences();
              this.saving = false;
              this.message = 'Appointment Added Succesfully';
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
          apiCall({url: '/api/appointment/'+item.id, method: 'DELETE' })
          .then(resp => {
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
        return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
      },
      eventsMap () {
      const map = {}
      this.item.forEach(e => (map[e.appointment_date] = map[e.appointment_date] || []).push(e))
      return map
    },
  
  },
      length: function() {
        return Math.ceil(this.pagination.total / this.pagination.per_page);
      },
    }
  
</script>

<style scoped>

  .my-event {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border-radius: 2px;
  background-color: #1867c0;
  color: #ffffff;
  border: 1px solid #1867c0;
  width: 100%;
  font-size: 12px;
  padding: 3px;
  cursor: pointer;
  margin-bottom: 1px;
}
  .feature-pane {
    position: relative;
    padding-top: 30px;
    box-shadow: 0 0 10px rgba(0,0,0,0.3);
  }
  .day-header {
    margin: 0px 2px 2px 2px;
    padding: 2px 6px;
    background-color: #1867c0;
    color: #ffffff;
    border: 1px solid #1867c0;
    border-radius: 2px;
    user-select: none;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .day-body {
    position: absolute;
    top: 400px;
    height: 36px;
    margin: 2px;
    padding: 2px 6px;
    background-color: #1867c0;
    color: #ffffff;
    border: 1px solid #1867c0;
    border-radius: 2px;
    left: 0;
    right: 0;
    user-select: none;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .day {
    position: relative;
    height: 24px;
    margin: 0px;
    padding: 0px 6px;
    background-color: #1867c0;
    color: #ffffff;
    border: 1px solid #1867c0;
    border-radius: 2px;
    left: 0;
    right: 0;
    user-select: none;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
</style>