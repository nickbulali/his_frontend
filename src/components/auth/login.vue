<template>
	<div class="login" style="margin-top:25vh;"> 
		<v-snackbar v-model="errorsnackbar" :timeout="4000" top color="error">
			<span>Email/Password wrong</span>
		</v-snackbar>
		<v-layout justify-center row wrap mb-4>
			<img src="logo.svg" alt="" style="height:50px; width:auto;">
		</v-layout>
		<v-layout justify-center row wrap>			
			<v-flex xs12 md6 class="radius20">
				<v-card class="elevation-3 radius20">
					<Loading success v-if='authLoading'/>
					<v-form class="px-3" ref="form" v-model="valid" lazy-validation>
						<v-card-text>
							<v-text-field v-model="username" :rules="emailRules" prepend-icon="person" name="username" label="E-mail" required>
							</v-text-field>
							<v-text-field v-model="password" prepend-icon="lock" :rules="passwordRules" name="password" label="Password" type="password">
							</v-text-field>
						</v-card-text>
						<v-card-actions>
							<!-- <div>
								<v-btn flat small to="register">Create an account</v-btn>
							</div> -->
							<v-spacer></v-spacer>
							<v-btn color="primary" round :disabled="!valid" @click="login" :loading="loading">
								Login
								<v-icon dark right>arrow_forward</v-icon>
							</v-btn>
						</v-card-actions>
					</v-form>
				</v-card>
			</v-flex>
		</v-layout>
	</div>
</template>

<script>
  import {AUTH_REQUEST} from '../../store/actions/auth'
  import Loading from './loading'
  import { mapState, mapGetters } from 'vuex'
  export default {
  	name: 'Login',
    components: {
      Loading
    },
    mounted () {
    let self = this
    window.addEventListener('keyup', function (event) {
      if (event.keyCode === 13) {
        self.login()
      }
    })
  },
    data: () => {
    	return {
    	  errorsnackbar: false,
    	  loading: false,
	      valid: true,
	      password: '',
	      passwordRules: [
	        v => !!v || 'Password is required'
	      ],
	      username: '',
	      emailRules: [
	        v => !!v || 'E-mail is required',
	        v => /.+@.+/.test(v) || 'E-mail must be valid'
	      ],
	  };
    },

    methods: {
      reset () {
        this.$refs.form.reset()
      },
      login: function () {
      	console.log(this.$store)
      	if (this.$refs.form.validate()) {
      		this.loading = true
		   const { username, password } = this
		   this.$store.dispatch(AUTH_REQUEST, { username, password })
		   .then((response) => {
		     this.$router.push('/')
		   }).catch((response) => {
		   		this.errorsnackbar = true
		   	 	this.loading = false
		   });
		}
	 }
    },
    computed: {
	    ...mapState({
	      authLoading: state => state.auth.status === 'loading',
	    })
	  },
  }
</script>