<template>
   <div class="invoice">
    <v-container class="my-5">
      <v-breadcrumbs :items="items">
      <template v-slot:divider>
        <v-icon>chevron_right</v-icon>
      </template>
    </v-breadcrumbs>
      <span class="title">Assign Role</span>
        <v-layout row justify-right>
          <v-flex sm12 md6>
            <v-layout row wrap>
              <v-flex sm12 md6>
               
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
          :items="users"
          :loading="loader"
          class="elevation-1"
        >
        <template v-slot:items="props">
        <tr :key="props.item.id">
          <td class="text-xs-left">{{ props.item.name }}</td>
         <td
            v-for="role in roles"
            :key="role.id">
              <v-checkbox
                v-model="roleUserIds"
                :value="getAssignment(props.item,role)"
                v-on:click="toggleAssignment(props.item,role)">
              </v-checkbox>
            </td>
      
        </tr>
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
  import apiCall from '../../utils/api'
  import _ from 'lodash';

  export default {
     name: 'RoleUser',
    data: () => ({
      valid: true,
      search: '',
      query: '',
      headers: [
        { text: 'Users', value: 'users' },
      ],
      pagination: {
        page: 1,
        per_page: 0,
        total: 0,
        visible: 10
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
           text: 'Assign Role',
           to: { name: 'RoleUser' }
          }
           
        ],
      rolesusers: [],
      roleUserIds: [],
      users: [],
      roles: [],
    }),

    computed: {

      length: function() {
        return Math.ceil(this.pagination.total / this.pagination.per_page);
      },
    },

   beforeCreate() {
      apiCall({url: '/api/role', method: 'GET' })
        .then(resp => {
          console.log(resp)
          this.roles = resp;
          for (var i = 0; i < resp.length; i++) {
            this.headers.push({
              text: resp[i].name,
              value: resp[i].name
            })
          }
        })
        .catch(error => {
          console.log(error.response)
        })

        apiCall({url: '/api/roleuser', method: 'GET' })
        .then(resp => {
          console.log(resp)
          this.rolesusers = resp;
          this.roleUserIds = _.map(this.rolesusers, 'id');
        })
        .catch(error => {
          console.log(error.response)
        })
    },

    created () {
      this.initialize()
    },
    methods: {

      initialize () {
        this.loader=true
        this.query = 'page='+ this.pagination.page;
        if (this.search != '') {
            this.query = this.query+'&search='+this.search;
        }

        apiCall({url: '/api/users?' + this.query, method: 'GET' })
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
      },

      getAssignment (user, role) {
          var value = 0;
          for (var i = this.rolesusers.length - 1; i >= 0; i--) {
            if (user.id == this.rolesusers[i].user_id &&
              role.id == this.rolesusers[i].role_id) {

              value = this.rolesusers[i].id;
              break;
            }else{
              value = user.id+'_'+role.id;
            }
          }
          return value;
      },

      toggleAssignment (user,role) {

        this.query = 'user_id='+ user.id+'&&role_id='+ role.id;

        var roleUserId = this.getAssignment(user, role);
        // if attached
        if (_.includes(this.roleUserIds, roleUserId)) {

          console.log('dettach role-user')
          // detach
          apiCall({
            url: '/api/roleuser/detach?'+this.query,
            method: 'GET'
          })
          .then(response => {
            console.log(response)
            _.remove(this.roleUserIds, item => item === roleUserId);

          })
          .catch(error => {
            console.log(error.response)
          })
        } else {

          console.log('attach role-user')
          // attach
          apiCall({
            url: '/api/roleuser/attach?'+this.query,
            method: 'GET'
          })
          .then(response => {
            console.log(response)
            let roleUserIds = this.roleUserIds
            roleUserIds.push(response.id)
            Vue.set(this,"roleUserIds",roleUserIds)
          })
          .catch(error => {
            console.log(error.response)
          })

        }
      },

    }
  }
</script>