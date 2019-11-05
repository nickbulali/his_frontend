<template>
   <div class="invoice">
    <v-container class="my-5">
      <v-breadcrumbs :items="items">
      <template v-slot:divider>
        <v-icon>chevron_right</v-icon>
      </template>
    </v-breadcrumbs>
      <span class="title">Permissions</span>
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
              outline
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
          :items="permissions"
          :loading="loader"
          class="elevation-1"
        >
        <template v-slot:items="props">
        <tr :key="props.item.id">
          <td class="text-xs-left">{{ props.item.display_name }}</td>
            <td
            v-for="role in roles"
            :key="role.id">
              <v-checkbox
                v-model="permissionRoleIds"
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
    name: 'Permissions',
    data: () => ({
      valid: true,
      search: '',
      query: '',
      loader: false,
      headers: [
        { text: 'Permissions', value: 'permissions' },
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
           text: 'Permission',
           to: { name: 'Permission' }
          }
           
        ],
      permissionsroles: [],
      permissionRoleIds: [],
      permissions: [],
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

        apiCall({url: '/api/permissionrole', method: 'GET' })
        .then(resp => {
          console.log(resp)
          this.permissionsroles = resp;
          this.permissionRoleIds = _.map(this.permissionsroles, 'id');
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

        apiCall({url: '/api/permission?' + this.query, method: 'GET' })
        .then(resp => {
          console.log(resp.data)
          this.permissions = resp.data;
              this.loader=false
          this.pagination.total = resp.total;
          this.pagination.per_page = resp.per_page;
        })
        .catch(error => {
          console.log(error.response)
        })
      },

      getAssignment (permission, role) {
          var value = 0;
          for (var i = this.permissionsroles.length - 1; i >= 0; i--) {
            if (permission.id == this.permissionsroles[i].permission_id &&
              role.id == this.permissionsroles[i].role_id) {

              value = this.permissionsroles[i].id;
              break;
            }else{
              value = permission.id+'_'+role.id;
            }
          }
          return value;
      },

      toggleAssignment (permission,role) {

        this.query = 'permission_id='+ permission.id+'&&role_id='+ role.id;

        var permissionRoleId = this.getAssignment(permission, role);
        // if attached
        if (_.includes(this.permissionRoleIds, permissionRoleId)) {

          console.log('dettach permission-role')
          // detach
          apiCall({
            url: '/api/permissionrole/detach?'+this.query,
            method: 'GET'
          })
          .then(response => {
            console.log(response)
            _.remove(this.permissionRoleIds, item => item === permissionRoleId);
          })
          .catch(error => {
            console.log(error.response)
          })
        } else {

          console.log('attach permission-role')
          // attach
          apiCall({
            url: '/api/permissionrole/attach?'+this.query,
            method: 'GET'
          })
          .then(response => {
            console.log(response)
            this.permissionRoleIds.push(response.id);
          })
          .catch(error => {
            console.log(error.response)
          })

        }
      },

    }
  }
</script>