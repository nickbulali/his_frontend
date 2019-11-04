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
      <template v-slot:activator="{ on }">
       <!--  <v-btn color="primary" dark v-on="on">Open Dialog</v-btn> -->
      </template>
      <v-card>
        <v-toolbar dark color="primary" class="elevation-0">
          <v-spacer></v-spacer>
            <v-toolbar-title>Add Category</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field
                    v-model="category.name"
                    :rules="[v => !!v || 'Name is Required']"
                    single-line
                    label="Name"
                    required>
                  </v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-textarea
                    v-model="category.description"
                    :rules="[v => !!v || 'Description is Required']"
                    single-line
                    label="Description"
                    required>
                  </v-textarea>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn round single-line color="blue lighten-1" flat @click="dialog = false">
              Cancel
              <v-icon right dark>close</v-icon>
            </v-btn>
            <v-btn round single-line xs12 sm6 :loading="loading" color="primary darken-1" flat @click="saveCategory">Save
              <v-icon right dark>cloud_upload</v-icon>
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
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
                    single-line
                 v-model="editedItem.name"
                  :rules="[v => !!v || 'Name is Required' ,
                  v => /^[a-zA-Z\s]+$/.test(v)  || 'Name should have alphabetic chars only']"
                  label="Name">
                  </v-text-field>
                </v-flex>
                <v-flex xs12 sm12 md12>
                  <v-text-field
                    single-line
                    v-model="editedItem.phone"
                    :rules="[v => !!v || 'Phone is Required']"
                    label="Phone">
                  </v-text-field>
                </v-flex>
                <v-flex xs12 sm12 md12>
                  <v-text-field
                    single-line
                  v-model="editedItem.email"
                  :rules="[v => !!v || 'Email is Required',v => /.+@.+/.test(v)  || 'Email not valid' ]"
                  label="Email Address">
                  </v-text-field>
                </v-flex>
                <v-flex xs12 sm12 md12>
                  <v-text-field
                    single-line
                    v-model="editedItem.address"
                    :rules="[v => !!v || 'Address is Required']"
                    label="Address">
                  </v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn round single-line color="blue lighten-1" flat @click.native="close">
              Cancel
              <v-icon right dark>close</v-icon>
            </v-btn>
            <v-btn round single-line xs12 sm6 color="primary darken-1" :disabled="!valid" @click.native="save" :loading="loading">
              Save <v-icon right dark>cloud_upload</v-icon>
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
    <v-container class="my-5">
      <span class="title">Suppliers</span>
        <v-layout row justify-right>
          <v-flex sm12 md6>
            <v-layout row wrap>
            
              <v-flex sm12 md6>
                <v-btn @click = "productDialog = true" color="primary" dark class="mb-2" single-line>
                  New Supplier
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
          hide-actions
          :headers="headers"
          :items="item"
          :loading="loader"
          class="elevation-1"
        >
        <template v-slot:items="props">
          <td>{{ props.item.id }}</td>
        <td>{{ props.item.name }}</td>
        <td class="text-xs-left">{{ props.item.phone }}</td>
        <td class="justify-left layout px-0">
          <v-btn
            single-line
            small
            title="Edit"
            color="teal"
            flat
            @click="editItem(props.item)">
            Edit
            <v-icon right dark>edit</v-icon>
          </v-btn>
          <v-btn
            single-line
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
          {
            text: 'ID',
            align: 'left',
            sortable: false,
            value: 'id'
          },
        { text: 'Name', value: 'name' },
        { text: 'Phone', value: 'phone' },
        { text: 'Actions', value: 'name', sortable: false },
        ],
        supplier: [],
      
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
        apiCall({ url: "/api/supplier?" + this.query, method: "GET" })
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

          apiCall({ url: "/api/item-category", method: "GET" })
          .then(resp => {
            console.log("item",resp);
            this.categories = resp.data;
          })
          .catch(error => {
            console.log(error.response);
          });
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
          this.loadingMethod(true, "Updating Suppliers")
          if(this.$refs.productform.validate()){
            this.loading = true
            apiCall({url: '/api/supplier/'+this.editedItem.id, data: this.editedItem, method: 'PUT' })
            .then(resp => {
              this.loading = false
              Object.assign(this.item[this.editedIndex], this.editedItem)
              console.log(resp)
              this.productDialog = false
              this.resetDialogReferences();
              this.saving = false;
              this.message = 'Supplier Information Updated Succesfully';
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
          this.loadingMethod(true, "Adding Supplier")
          if(this.$refs.productform.validate()){
            this.loading = true
            apiCall({url: '/api/supplier', data: this.editedItem, method: 'POST' })
            .then(resp => {
              this.loading = false
              this.item.push(resp)
              console.log(this.editedItem)
              this.productDialog = false
              this.resetDialogReferences();
              this.saving = false;
              this.message = 'Supplier Added Succesfully';
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
