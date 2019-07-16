<template>
  <div class="invoice">
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
   
      <v-card>
        <v-toolbar dark color="primary" class="elevation-0">
          <v-toolbar-title>{{ formTitle }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn round outline color="blue lighten-1" flat @click.native="close">
            Cancel
            <v-icon right dark>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm12 md12>
                  <v-select
                     outline
                     :items="items"
                    :rules="[v => !!v || 'Instrument is Required']"
                    v-model="editedItem.item_id"
                    item-text="name"
                    item-value="id"
                    label="Item"
                  ></v-select>
                </v-flex>
                <v-flex xs12 sm12 md12>
                  <v-text-field
                    outline
                    v-model="editedItem.curr_bal"
                    :rules="[v => !!v || 'Current Balance is Required']"
                    label="Current Balance">
                  </v-text-field>
                </v-flex>

                <v-flex xs12 sm12 md12>
                  <v-text-field
                    outline
                    v-model="editedItem.quantity_requested"
                    :rules="[v => !!v || 'Quantity Requested. is Required']"
                    label="Quantity Requested.">
                  </v-text-field>
                </v-flex>
                <v-flex xs12 sm12 md12>
                  <v-text-field 
                   outline
                    v-model="editedItem.remarks"
                    :rules="[v => !!v || 'Remarks is Required']"
                    label="Remarks">
                  </v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>          
            <v-btn round outline xs12 sm6 color="blue darken-1" :disabled="!valid" @click.native="save">
              Save <v-icon right dark>cloud_upload</v-icon>
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  <v-container class="my-5">
      <span class="title">Requests</span>
        <v-layout row justify-right>
          <v-flex sm12 md6>
            <v-layout row wrap>
              <v-flex sm12 md6>
                <v-btn color="primary" @click = "dialog = true" dark class="mb-2" outline>Add Request
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
      :headers="headers"
      :items="item"
      hide-actions
      class="elevation-1"
    >
      <template slot="items" slot-scope="props">
              <td>{{ props.item.created_at }}</td>
        <td class="text-xs-left">{{ props.item.user.name }}</td>
        <td class="text-xs-left">{{ props.item.supplies.name }}</td>
        <td class="text-xs-left">{{ props.item.quantity_requested }}</td>
        <td class="text-xs-left">{{ props.item.curr_bal }}</td>
        <td class="text-xs-left">{{ props.item.remarks }}</td>
        <td class="text-xs-left">
          <v-btn small color="primary" dark>{{ props.item.status.name }}</v-btn>
        </td>
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
        { text: 'Requested Date', value: 'date' },
        { text: 'Name', value: 'name' },
        { text: 'Item', value: 'item' },
        { text: 'Current Balance', value: 'curr_bal' },
        { text: 'Quantity Requested', value: 'quantity_requested' },
        { text: 'Remarks', value: 'remarks' },
        { text: 'Status', value: 'status' },
        { text: 'Actions', value: 'name', sortable: false }
        ],
        item: [],
      
        editedIndex: -1,
        category: {
          name: '',
          description: '',
        },
         editedItem: {
        name: '',
        phone: '',
        email: '',
        address: '',
      },
      defaultItem: {
        name: '',
        phone: '',
        email: '',
        address: '',
      },
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
        apiCall({ url: "/api/request?" + this.query, method: "GET" })
          .then(resp => {
            console.log("item is",resp);
            this.item = resp.data;
            this.loader=false
            this.pagination.total = resp.total;
            this.pagination.per_page = resp.per_page;
          })
          .catch(error => {
            console.log(error.response);
          });

        apiCall({ url: "/api/supplies", method: "GET" })
          .then(resp => {
            console.log("item",resp);
            this.items = resp.data;
          })
          .catch(error => {
            console.log(error.response);
          });
      },
      close () {
        this.dialog = false
        // if not saving reset dialog references to datatables
        if (!this.saving) {
          this.resetDialogReferences();
        }
      },
      editItem (item) {
        this.editedIndex = this.item.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },
        viewItem (item) {
        this.editedIndex = this.request.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.detailsdialog = true
      }, 
      resetDialogReferences() {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      },
      save () {
         this.saving = true;
        // update
        if (this.editedIndex > -1) {
          if(this.$refs.form.validate()){
            this.loadingMethod(true, "Updating Requests")
            this.loading = true
            apiCall({url: '/api/request/'+this.editedItem.id, data: this.editedItem, method: 'PUT' })
            .then(resp => {
              Object.assign(this.request[this.editedIndex], resp)
              console.log(resp)
              this.resetDialogReferences();
              this.saving = false;
              this.loading = false
              this.message = 'Request Updated Succesfully';
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
          this.loadingMethod(true, "Adding Request")
          if(this.$refs.form.validate()){
            this.loading = true
            apiCall({url: '/api/request', data: this.editedItem, method: 'POST' })
            .then(resp => {
              this.request.push(resp)
              this.resetDialogReferences();
              this.saving = false;
              this.message = 'Request Created Succesfully';
              this.snackbar = true;
              this.loading = false
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
          apiCall({url: '/api/supplier/'+item.id, method: 'DELETE' })
          .then(resp => {
            console.log(resp)
          })
          .catch(error => {
            console.log(error.response)
          })
        }

      },
      saveCategory(){
        if(this.$refs.form.validate()){
            this.loadingMethod(true, "Posting Category")
            this.loading = true
            apiCall({url: '/api/item-category', data: this.category, method: 'POST' })
            .then(resp => {
              this.loading = false
              this.saving = false
              this.categories.push(resp)
              this.dialog = false
              this.message = 'Category Added Succesfully'
              this.snackbar = true
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
    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
      },

      length: function() {
        return Math.ceil(this.pagination.total / this.pagination.per_page);
      },
    }
  }
</script>
