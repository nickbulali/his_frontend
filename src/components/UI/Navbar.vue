<template>
	<nav>
		<v-snackbar v-model="snackbar" :timeout="4000" top color="success">
			<span>{{message}}</span>
		</v-snackbar>
		<v-toolbar app>
			<v-toolbar-side-icon class="grey--text" @click="drawer = !drawer"></v-toolbar-side-icon>
			<v-toolbar-title class="primary--text">
				<span>@iLabAfrica</span>
				<span class="font-weight-light grey--text">HIS</span>
			</v-toolbar-title>
			<v-spacer></v-spacer>

			<v-btn icon slot="activator">
				<v-icon left>notifications</v-icon>
			</v-btn>
			<!--dropdown menu-->
			<v-menu left transition="slide-y-reverse-transition">
				<v-avatar color="red" slot="activator">
			      <span class="white--text headline">A</span>
			    </v-avatar>
				<v-list>
					<v-list-tile >
						<v-list-tile-title @click="signOut">
							Sign Out
							<v-icon right>exit_to_app</v-icon>
						</v-list-tile-title>
					</v-list-tile>
				</v-list>
			</v-menu>
		</v-toolbar>
		<v-navigation-drawer
			app
			v-model="drawer"
			absolute
			temporary>
			<sidebar></sidebar>
		</v-navigation-drawer>

	</nav>
	
</template>

<script>
	import Sidebar from '@/components/UI/Sidebar'
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