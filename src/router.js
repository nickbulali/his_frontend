import Vue from 'vue'
import store from './store/index'
import Router from 'vue-router'

import Home from './components/index.vue'
import Login from './components/Auth/login.vue'
import Register from './components/Auth/register.vue'
import Patient from './components/Patient/index.vue'
import patientProfile from './components/Patient/patientProfile.vue'
import Profile from './components/account/profile'
import Queue from './components/Queue/index.vue'
import UserAccounts from './components/accesscontrol/useraccounts'
import ThirdPartyApps from './components/accesscontrol/thirdpartyapps'
import Permissions from './components/accesscontrol/permissions'
import Role from './components/accesscontrol/role'
import RoleUser from './components/accesscontrol/roleusers'
import Invoice from './components/Billing/index.vue'
import ShowInvoice from './components/Billing/show.vue'
import ShowPayment from './components/Billing/showpayment.vue'
import ChargeSheet from './components/Billing/chargesheet.vue'
import Payment from './components/Billing/payment.vue'
import Bill from './components/Billing/billing.vue'
import Expenses from './components/Billing/expenses.vue'
import Pharmacy from './components/Pharmacy/index.vue'
import Prescription from './components/Pharmacy/prescription.vue'
import InventoryItem from './components/Inventory/supplies'
import InventoryRequest from './components/Inventory/request'
import InventorySupplier from './components/Inventory/supplier'
import Tests from './components/test/index.vue'
import Appointment from './components/appointment/index.vue'
import Radiology from './components/Radiology/index.vue'
import AppointmentReport from './components/Reports/appointments.vue'
import PatientReport from './components/Reports/patients.vue'
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
      name: 'home',
      component: Home,
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
      path: '/billing/billing',
      name: 'Bill',
      component: Bill,
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
      path: '/billing/expenses',
      name: 'Expenses',
      component: Expenses,
      beforeEnter: ifAuthenticated,
    },
    /* {
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
     */
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
      path: '/accesscontrol/thirdpartyapps',
      name: 'ThirdPartyApps',
      component: ThirdPartyApps,
      beforeEnter: ifAuthenticated,
    },
    //Pharmacy
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
    //Appointment
    {
      path: '/appointment',
      name: 'Appointment',
      component: Appointment,
      beforeEnter: ifAuthenticated,

    },
    //Radiology
    {
      path: '/radiology',
      name: 'Radiology',
      component: Radiology,
      beforeEnter: ifAuthenticated,

    },
    //Tests
    {
      path: '/test',
      name: 'Tests',
      component: Tests,
      beforeEnter: ifAuthenticated,
    },
    //Reports
    {
      path: '/reports/appointments',
      name: 'AppointmentReport',
      component: AppointmentReport,
      beforeEnter: ifAuthenticated,

    },
   {
      path: '/reports/patients',
      name: 'PatientReport',
      component: PatientReport,
      beforeEnter: ifAuthenticated,

    },
   //Inventory
    {
      path: '/inventory/supplier',
      name: 'Supplier',
      component: InventorySupplier,
      beforeEnter: ifAuthenticated,
    },
    {
      path: '/inventory/supplies',
      name: 'Supplies',
      component: InventoryItem,
      beforeEnter: ifAuthenticated,
    },
    {
      path: '/inventory/request',
      name: 'Request',
      component: InventoryRequest,
      beforeEnter: ifAuthenticated,
    },
    // User Profile
    {
      path: '/account/profile',
      name: 'Profile',
      component: Profile,
      beforeEnter: ifAuthenticated,
    },
  ]
})