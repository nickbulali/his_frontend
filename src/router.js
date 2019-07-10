import Vue from 'vue'
import store from './store/index'
import Router from 'vue-router'

import Login from './components/Auth/login.vue'
import Register from './components/Auth/register.vue'

import Dashboard from './views/Dashboard.vue'

import Patient from './components/Patient/index.vue'
import patientProfile from './components/Patient/patientProfile.vue'

import Queue from './components/Queue/index.vue'
import UserAccounts from './components/accesscontrol/useraccounts'

import Permissions from './components/accesscontrol/permissions'
import Role from './components/accesscontrol/role'
import RoleUser from './components/accesscontrol/roleusers'
import Invoice from './components/Billing/index.vue'
import ShowInvoice from './components/Billing/ShowInvoice.vue'
import ShowPayment from './components/Billing/showpayment.vue'
import CreateInvoice from './components/Billing/form.vue'
import ChargeSheet from './components/Billing/chargesheet.vue'
import Payment from './components/Billing/payment.vue'
import Pharmacy from './components/pharmacy/index.vue'
import Prescription from './components/pharmacy/prescriptions.vue'




Vue.use(Router)

const ifNotAuthenticated = (to, from, next) => {
  if (!store.getters.isAuthenticated) {
    next()
    return
  }
    next('/')
}

const ifAuthenticated = (to, from, next) => {
  if (store.getters.isAuthenticated) {
    next()
    return
  }
  next('/login')
}

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login,
      beforeEnter: ifNotAuthenticated,
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
      beforeEnter: ifNotAuthenticated,
    },
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard,
      beforeEnter: ifAuthenticated,
    },
    //Queue
    {
      path: '/queue',
      name: 'queue',
      component: Queue,
      beforeEnter: ifAuthenticated,
    },
    //Patient
    {
      path: '/patients',
      name: 'Patient',
      component: Patient,
      beforeEnter: ifAuthenticated,
    },
    {
      path: '/patient/:id',
      name: 'patientProfile',
      component: patientProfile,
      beforeEnter: ifAuthenticated,
    },
    //Billing
    {
      path: '/billing/invoice',
      name: 'Invoice',
      component: Invoice,
      beforeEnter: ifAuthenticated,
    },
    {
      path: '/billing/invoice/create',
      name: 'CreateInvoice',
      component: CreateInvoice,
      beforeEnter: ifAuthenticated,
    },
    {
      path: '/billing/chargesheet',
      name: 'ChargeSheet',
      component: ChargeSheet,
      beforeEnter: ifAuthenticated,
    },
    {
      path: '/billing/payment',
      name: 'Payment',
      component: Payment,
      beforeEnter: ifAuthenticated,
    },
     {
      path: '/billing/invoice/show/:id',
      name: 'ShowInvoice',
      component: ShowInvoice,
      beforeEnter: ifAuthenticated,
    },
     {
      path: '/billing/payment/show/:id',
      name: 'ShowPayment',
      component: ShowPayment,
      beforeEnter: ifAuthenticated,
     },
     // Access Control
    {
      path: '/accesscontrol/useraccounts',
      name: 'UserAccount',
      component: UserAccounts,
      beforeEnter: ifAuthenticated,
    },
    {
      path: '/accesscontrol/permissions',
      name: 'Permission',
      component: Permissions,
      beforeEnter: ifAuthenticated,
    },
    {
      path: '/accesscontrol/role',
      name: 'Role',
      component: Role,
      beforeEnter: ifAuthenticated,
    },
    {
      path: '/accesscontrol/roleusers',
      name: 'RoleUser',
      component: RoleUser,
      beforeEnter: ifAuthenticated,
    },

    {
      path: '/pharmacy',
      name: 'Pharmacy',
      component: Pharmacy,
      beforeEnter: ifAuthenticated,
    },
    {
      path: '/pharmacy/prescription',
      name: 'Prescription',
      component: Prescription,
      beforeEnter: ifAuthenticated,
    },
 

  ]
})
