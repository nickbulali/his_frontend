<template>
  <div>
    <v-card class="pt-5 pb-3 elevation-0">
        <img src="logo.png" alt="" style="width:70%; height:auto; margin-left:15px;">
    </v-card>
    <v-list dense dark pt-4>
           <v-list-tile to="/">
        <v-list-tile-action>
          <v-icon>home</v-icon>
        </v-list-tile-action>
        <v-list-tile-title>Dashboard</v-list-tile-title>
      </v-list-tile>
      <v-list-tile to="/queue">
        <v-list-tile-action>
          <v-icon>list</v-icon>
        </v-list-tile-action>
        <v-list-tile-title>Queue</v-list-tile-title>
      </v-list-tile>
      <v-list-tile to="/patients">
        <v-list-tile-action>
          <v-icon>assignment_ind</v-icon>
        </v-list-tile-action>
        <v-list-tile-title>Patients</v-list-tile-title>
      </v-list-tile>
      
         <v-list-tile to="/appointment">
        <v-list-tile-action>
          <v-icon>event</v-icon>
        </v-list-tile-action>
        <v-list-tile-title>Appointment</v-list-tile-title>
      </v-list-tile>
               <v-list-tile to="/test">
        <v-list-tile-action>
          <v-icon>settings_input_component</v-icon>
        </v-list-tile-action>
        <v-list-tile-title>Tests</v-list-tile-title>
      </v-list-tile>
      <v-list-group prepend-icon="security" no-action>
        <v-list-tile slot="activator">
          <v-list-tile-title>Access Control</v-list-tile-title>
        </v-list-tile>
        <v-list-tile v-for="(access_control, i) in access_controls" :key="i"
          :to="{path:access_control.path}">
          <v-list-tile-action>
            <v-icon v-text="access_control.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-title v-text="access_control.label"></v-list-tile-title>
        </v-list-tile>
      </v-list-group>
        <v-list-group prepend-icon="line_weight" no-action>
        <v-list-tile slot="activator">
          <v-list-tile-title>Inventory</v-list-tile-title>
        </v-list-tile>
        <v-list-tile v-for="(inventory, i) in inventory" :key="i" :to="{path:inventory.path}">
          <v-list-tile-action>
            <v-icon v-text="inventory.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-title v-text="inventory.label"></v-list-tile-title>
        </v-list-tile>
      </v-list-group>
        <v-list-group prepend-icon="local_hospital" no-action>
        <v-list-tile slot="activator">
          <v-list-tile-title>Pharmacy</v-list-tile-title>
        </v-list-tile>
        <v-list-tile v-for="(pharmacy, i) in pharmacy" :key="i" :to="{path:pharmacy.path}">
          <v-list-tile-action>
            <v-icon v-text="pharmacy.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-title v-text="pharmacy.label"></v-list-tile-title>
        </v-list-tile>
      </v-list-group>
      <v-list-group prepend-icon="attach_money" no-action>
        <v-list-tile slot="activator">
          <v-list-tile-title>Billing</v-list-tile-title>
        </v-list-tile>
        <v-list-tile v-for="(billing, i) in billings" :key="i"
          :to="{path:billing.path}">
          <v-list-tile-action>
            <v-icon v-text="billing.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-title v-text="billing.label"></v-list-tile-title>
        </v-list-tile>
      </v-list-group>
            <v-list-tile to="/radiology">
        <v-list-tile-action>
          <v-icon>image</v-icon>
        </v-list-tile-action>
        <v-list-tile-title>Radiology</v-list-tile-title>
      </v-list-tile>
      
        <v-list-group prepend-icon="folder" no-action>
        <v-list-tile slot="activator">
          <v-list-tile-title>Reports</v-list-tile-title>
        </v-list-tile>
        <v-list-tile v-for="(report, i) in report" :key="i"
          :to="{path:report.path}">
          <v-list-tile-action>
            <v-icon v-text="report.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-title v-text="report.label"></v-list-tile-title>
        </v-list-tile>
      </v-list-group>
    </v-list>
  </div>
</template>

<script>
  import { mapGetters, mapState } from 'vuex'
  import { USER_REQUEST } from '../../store/actions/user'
  import apiCall from '../../utils/api'
  export default {
    name: 'Sidebar',
    data: () => ({
      user: {},
      organization: [],
      billings: [
        {
          path: '/billing/invoice',
          label: 'Invoices',
          icon: 'insert_drive_file'
        },
        {
          path: '/billing/chargesheet',
          label: 'Charge Sheet',
          icon: 'assignment_late'
        },
        {
          path: '/billing/payment',
          label: 'Payment',
          icon: 'local_atm'
        },
        {
          path: '/billing/expenses',
          label: 'Expenses',
          icon: 'extension'
        },
      ],
      access_controls: [
          {
          path: '/accesscontrol/thirdpartyapps',
          label: 'Third Party Apps',
          icon: 'extension'
        },
        
        {
          path: '/accesscontrol/useraccounts',
          label: 'User Accounts',
          icon: 'people'
        },
        {
          path: '/accesscontrol/permissions',
          label: 'Permissions',
          icon: 'visibility'
        },
        {
          path: '/accesscontrol/role',
          label: 'Role',
          icon: 'contacts'
        },
        {
          path: '/accesscontrol/roleusers',
          label: 'Assign Roles',
          icon: 'verified_user'
        },
      ],

      inventory: [
        {
          path: '/inventory/supplier',
          label: 'Suppliers',
          icon: 'folder'
        },
        {
          path: '/inventory/supplies',
          label: 'Items',
          icon: 'widgets'
        },
        {
          path: '/inventory/request',
          label: 'Requests',
          icon: 'launch'
        },
      ],
      pharmacy: [
        {
          path: '/pharmacy',
          label: 'Pharmacy',
          icon: 'opacity'
        },
        {
          path: '/pharmacy/prescription',
          label: 'Prescription',
          icon: 'launch'
        },
      ],

      report: [
        {
          path: '/reports/appointments',
          label: 'Appointment',
          icon: 'assignment_turned_in'
        },
        {
          path: '/reports/patients',
          label: 'Patients',
          icon: 'people'
        },
      ]
    }),
    mounted: function () {
      if (this.$store.getters.isAuthenticated) {
        this.$store.dispatch(USER_REQUEST)
      }
    },
    methods: {
      initialize() {
        /*apiCall({ url: "/api/generalconfiguration", method: "GET" })
          .then(resp => {
            this.organization = resp;
            if (resp.logo == null) {
              this.organization.logo = "default.png";
            }
          })
          .catch(error => {
            console.log(error.response);
          });*/
      }
    },
    computed: {
      ...mapGetters(['getProfile', 'isAuthenticated', 'isProfileLoaded']),
      ...mapState({
        authLoading: state => state.auth.status === 'loading',
        home_url:()=>{
          return process.env.VUE_APP_API_URL
        }
        
      })
    },
    created() {
      /*this.initialize();*/
    }
  }
</script>
