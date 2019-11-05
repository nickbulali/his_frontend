<template>
	<nav>
		<v-snackbar v-model="snackbar" :timeout="4000" top color="success">
			<span>{{message}}</span>
		</v-snackbar>
		<v-toolbar app flat color="rgba(0, 0, 0, 0)">
			<v-toolbar-side-icon color="white" class="brown--text elevation-5" @click="drawer = !drawer"></v-toolbar-side-icon>
			
			<v-spacer></v-spacer>

			<v-btn icon slot="activator">
				<v-icon left>notifications</v-icon>
			</v-btn>
			<!--dropdown menu-->
   	<v-menu left transition="slide-y-reverse-transition">
        <v-btn primary flat slot="activator">
          <v-flex
            xs12
            sm6
            md8
            align-center
            justify-center
            layout
            text-xs-center
          >
            <v-avatar
       
              color="red"
            
            >
            <span class="white--text headline">A</span>
        <!--       <img :src="home_url+'/storage/profile_pictures/'+pic" alt=""> -->
            </v-avatar>
          </v-flex>
          {{name}}
        </v-btn>
        <v-list>
          <v-list-tile to="/account/profile">
            <v-list-tile-title>Edit Profile</v-list-tile-title>
          </v-list-tile>
          <v-list-tile @click="signOut">
            <v-list-tile-title>Logout</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>



			<!-- <v-menu left transition="slide-y-reverse-transition">
				<v-layout  slot="activator">
					<v-avatar color="red">
						<span class="white--text headline">A</span>
					</v-avatar>
					<div class="ml-2">
            <div class="subheading">User Name</div>
            <span class="grey--text">Other Info</span>
          </div>
				</v-layout>
				<v-list>
					<v-list-tile >
						<v-list-tile-title @click="signOut">
							Sign Out
							<v-icon right>exit_to_app</v-icon>
						</v-list-tile-title>
					</v-list-tile>
				</v-list>
			</v-menu> -->
		</v-toolbar>
		<v-navigation-drawer app v-model="drawer" absolute temporary class="darkened white--text" style="position:fixed">
			<sidebar></sidebar>
		</v-navigation-drawer>
	</nav>
	
</template>

<script>
	import Sidebar from '@/components/UI/sidebar'
  	import { AUTH_LOGOUT } from '../../store/actions/auth'
export default {
	components: {
		Sidebar
	},
	data(){
		return{
			drawer: false,
			snackbar: false,
			message: '',
		}
	},
	methods: {
      signOut: function () {
        this.$store.dispatch(AUTH_LOGOUT).then(() => this.$router.push('/login'))
      },
    },
}
</script>