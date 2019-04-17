<template>
  <div>
    <v-card class="ma-1">
        <v-img
          class="white--text"
          height="200px"
          src="https://pbs.twimg.com/profile_images/1553273706/_iLabAfrica_africa_400x400.png"
        >
          <v-container fluid style="background: linear-gradient(to bottom, rgb(241,97,54, 0.1), rgba(241,97,54,0.9)); position: absolute; bottom: 0px; height: 10px">
            <v-layout>
              <v-flex xs12 align-end flexbox>
                <p class="text-xs-center title">@iLabAfrica</p>
              </v-flex>
            </v-layout>
          </v-container>
        </v-img>
    </v-card>
    <v-list dense>
      <v-list-tile to="/">
        <v-list-tile-action>
          <v-icon>home</v-icon>
        </v-list-tile-action>
        <v-list-tile-title>Home</v-list-tile-title>
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
  import { USER_REQUEST } from '../store/actions/user'
  import apiCall from '../utils/api'
  export default {
    name: 'Sidebar',
    data: () => ({
      user: {},
      organization: [],
      billings: [
        {
          path: '/billing/invoices',
          label: 'Invoices',
          icon: 'insert_drive_file'
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

