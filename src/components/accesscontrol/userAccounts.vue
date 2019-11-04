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
    <v-container>
    <v-breadcrumbs :items="items">
      <template v-slot:divider>
        <v-icon>chevron_right</v-icon>
      </template>
    </v-breadcrumbs>
  </v-container>
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
      <!--   <v-btn color="primary" dark v-on="on">Open Dialog</v-btn> -->
      </template>
      <v-card>
        <v-toolbar dark color="primary" class="elevation-0">
          <v-spacer></v-spacer>
            <v-toolbar-title>Add User</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm12 md12>
                <v-text-field
                  single-line
                  v-model="editedItem.username"
                  :rules="[v => !!v || 'Username is Required']"
                  label="Username"
                  >    
                </v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md12>
                <v-text-field
                  single-line
                 v-model="editedItem.name"
                  :rules="[v => !!v || 'Name is Required',
                  v => /^[a-zA-Z\s]+$/.test(v)  || 'Name should have alphabetic chars only']"
                  label="Name">
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
              <div>
                <v-btn small color="primary" dark @click.native="passordReset">Reset Password</v-btn>
              </div>
              <v-flex xs12 sm12 md12
                v-if="showPasswordField">
                <v-text-field
                  v-model="password"
                    single-line
                  :rules="[v => !!v || 'New Password is Required']"
                  type = "text"
                  append-icon="autorenew"
                  @click:append="generate"
                  label="New Password">
                </v-text-field>
              </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn round outline color="blue lighten-1" flat @click="dialog = false">
              Cancel
              <v-icon right dark>close</v-icon>
            </v-btn>
            <v-btn round outline xs12 sm6 color="primary darken-1" :disabled="!valid" @click.native="save">
                  Save <v-icon right dark>cloud_upload</v-icon>
                </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
    <v-container class="my-5">
      <span class="title">Users</span>
        <v-layout row justify-right>
          <v-flex sm12 md6>
            <v-layout row wrap>
              <v-flex sm12 md6>
                <v-btn color="primary" @click = "dialog = true" dark class="mb-2" outline>Add User
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
          :items="user"
          :loading="loader"
        >
        <template v-slot:items="props">
          <td>{{ props.item.username }}</td>
          <td class="text-xs-left">{{ props.item.name }}</td>
          <td class="text-xs-left">{{ props.item.email }}</td>
      
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
        { text: 'Username', align: 'left', value: 'username' },
        { text: 'Name', value: 'name' },
        { text: 'Email Address', value: 'email' },
        { text: 'Actions', sortable: false, value: 'action' }
      ],
      user: [],
      editedIndex: -1,
      editedItem: {
        username: '',
        name: '',
        email: ''
      },
      items: [
          {
           text: 'Dashboard',
           to: { name: 'dashboard' }
          },
          {
           text: 'Access Control',
           to: { name: 'accesscontrol' }
          },
          {
           text: 'User Account',
           to: { name: 'UserAccount' }
          }
           
        ],
      defaultItem: {
        username: '',
        name: '',
        email: ''
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
     initialize () {
         this.loader = true
        this.query = 'page='+ this.pagination.page;
        if (this.search != '') {
            this.query = this.query+'&search='+this.search;
        }

        apiCall({url: '/api/users?' + this.query, method: 'GET' })
        .then(resp => {
          console.log(resp)
          this.user = resp.data;
          this.loader = false
       
        })
        .catch(error => {
          console.log(error.response)
        })
      },
       close () {
        this.dialog = false

        // if not saving reset dialog references to datatables
        if (!this.saving) {
          this.resetDialogReferences();
        }
      },
      editItem (item) {
        this.editedIndex = this.user.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
        console.log("My Edited Info",item)

      },
      resetDialogReferences() {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      },
           resetDialogReferences() {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
        this.showPasswordField = false
        this.password = ''
      },

      passordReset () {
        if (this.showPasswordField){
          this.showPasswordField = false
          this.password = ''
        }else{
          this.showPasswordField = true;
        }
      },
      generate: function() {
        let charactersArray = this.characters.split(',');  
        let CharacterSet = '';
        let password = '';
        
        if( charactersArray.indexOf('a-z') >= 0) {
          CharacterSet += 'abcdefghijklmnopqrstuvwxyz';
        }
        if( charactersArray.indexOf('A-Z') >= 0) {
          CharacterSet += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        }
        if( charactersArray.indexOf('0-9') >= 0) {
          CharacterSet += '0123456789';
        }
        if( charactersArray.indexOf('#') >= 0) {
          CharacterSet += '![]{}()%&*$#^<>~@|';
        }
        
        for(let i=0; i < this.size; i++) {
          password += CharacterSet.charAt(Math.floor(Math.random() * CharacterSet.length));
        }
        this.password = password;
      },
     
      save () {

        this.saving = true;
        // update
        if (this.editedIndex > -1) {
          if(this.$refs.form.validate()){
            if(this.showPasswordField){
              this.editedItem.adminPasswordChange = true
              this.editedItem.password = this.password
            }
            apiCall({url: '/api/users/'+this.editedItem.id, data: this.editedItem, method: 'PUT' })
            .then(resp => {
              Object.assign(this.user[this.editedIndex], this.editedItem)
              console.log(resp)
              this.resetDialogReferences();
              this.saving = false;
              this.message = 'User Information Updated Succesfully';
              this.snackbar = true;
            })
            .catch(error => {
              console.log(error.response)
            })
            this.close()
          }
        // store
        } else {
          if(this.$refs.form.validate()){
            apiCall({url: '/api/users', data: this.editedItem, method: 'POST' })
            .then(resp => {
              this.user.push(resp)
              console.log(resp)
              this.resetDialogReferences();
              this.saving = false;
              this.message = 'New User Added Succesfully';
              this.snackbar = true;
            })
            .catch(error => {
              console.log(error.response)
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
          apiCall({url: '/api/users/'+item.id, method: 'DELETE' })
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

      length: function() {
        return Math.ceil(this.pagination.total / this.pagination.per_page);
      },
    }
  }
</script>
