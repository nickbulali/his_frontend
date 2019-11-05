import Vue from 'vue'
import store from './store/index'
import router from 'vue-router'
import Home from './components/index.vue'
import Login from './components/auth/login.vue'
import Register from './components/auth/register.vue'
import Patient from './components/patient/index.vue'
import PatientProfile from './components/patient/patientProfile.vue'
import Profile from './components/account/profile'
import Queue from './components/queue/index.vue'
import UserAccounts from './components/accessControl/userAccounts'
import ThirdPartyApps from './components/accessControl/thirdPartyApps'
import Permissions from './components/accessControl/permissions'
import Role from './components/accessControl/role'
import RoleUser from './components/accessControl/roleUsers'
import Pharmacy from './components/pharmacy/index.vue'
// import Prescription from './components/pharmacy/prescription.vue'
import Invoice from './components/billing/index.vue'
import ShowInvoice from './components/billing/show.vue'
import ShowPayment from './components/billing/showPayment.vue'
import ChargeSheet from './components/billing/chargeSheet.vue'
import Payment from './components/billing/payment.vue'
import Bill from './components/billing/billing.vue'
import Expenses from './components/billing/expenses.vue'
import InventoryItem from './components/inventory/supplies'
import InventoryRequest from './components/inventory/request'
import InventorySupplier from './components/inventory/supplier'
import Tests from './components/test/index.vue'
import Appointment from './components/appointment/index.vue'
import Radiology from './components/radiology/index.vue'
import AppointmentReport from './components/reports/appointments.vue'
import PatientReport from './components/reports/patients.vue'
Vue.use(router)

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

export default new router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: login,
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
      name: 'Home',
      component: Home,
      beforeEnter: ifAuthenticated,
    },

    //Queue
    {
      path: '/queue',
      name: 'Queue',
      component: Queue,
      beforeEnter: ifAuthenticated,
    },
    //patient
    {
      path: '/patients',
      name: 'Patient',
      component: Patient,
      beforeEnter: ifAuthenticated,
    },
    {
      path: '/patient/:id',
      name: 'PatientProfile',
      component: PatientProfile,
      beforeEnter: ifAuthenticated,
    },
    //billing
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
    //Pharmacy
      {
        path: '/pharmacy/index',
        name: 'Pharmacy',
        component: Pharmacy,
        beforeEnter: ifAuthenticated,
      },
      /*
      {
        path: '/pharmacy/prescription',
        name: 'Prescription',
        component: Prescription,
        beforeEnter: ifAuthenticated,
      },
      */
 
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
    {
      path: '/accesscontrol/thirdpartyapps',
      name: 'ThirdPartyApps',
      component: ThirdPartyApps,
      beforeEnter: ifAuthenticated,
    },
    //pharmacy
    {
      path: '/pharmacy',
      name: 'Pharmacy',
      component: Pharmacy,
      beforeEnter: ifAuthenticated,
    },
    /*
    {
      path: '/pharmacy/prescription',
      name: 'Prescription',
      component: Prescription,
      beforeEnter: ifAuthenticated,
    },
    */
    //Appointment
    {
      path: '/appointment',
      name: 'Appointment',
      component: Appointment,
      beforeEnter: ifAuthenticated,
    },
    //radiology
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
    //reports
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
   //inventory
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