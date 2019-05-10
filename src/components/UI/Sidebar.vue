<template>
  <div>
    <v-card class="pt-5 pb-3 elevation-0">
        <img src="logo.svg" alt="" style="width:70%; height:auto; margin-left:15px;">
    </v-card>
    <v-list dense dark pt-4>
      <v-list-tile to="/">
        <v-list-tile-action>
          <v-icon>home</v-icon>
        </v-list-tile-action>
        <v-list-tile-title>Home</v-list-tile-title>
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
          icon: 'local_atm'
        },
      ],
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

