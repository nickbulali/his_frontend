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
      component: Login,
      beforeEnter: ifNotAuthenticated,
    },
    {
      path: '/register',
      name: 'register',
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
    //patient
    {
      path: '/patients',
      name: 'patient',
      component: Patient,
      beforeEnter: ifAuthenticated,
    },
    {
      path: '/patient/:id',
      name: 'patientProfile',
      component: PatientProfile,
      beforeEnter: ifAuthenticated,
    },
    //billing
    {
      path: '/billing/invoice',
      name: 'invoice',
      component: Invoice,
      beforeEnter: ifAuthenticated,
    },
    {
      path: '/billing/billing',
      name: 'bill',
      component: Bill,
      beforeEnter: ifAuthenticated,
    },
    {
      path: '/billing/chargesheet',
      name: 'chargeSheet',
      component: ChargeSheet,
      beforeEnter: ifAuthenticated,
    },
    {
      path: '/billing/payment',
      name: 'payment',
      component: Payment,
      beforeEnter: ifAuthenticated,
    },
    {
      path: '/billing/expenses',
      name: 'expenses',
      component: Expenses,
      beforeEnter: ifAuthenticated,
    },
    /* {
      path: '/billing/invoice/show/:id',
      name: 'showInvoice',
      component: ShowInvoice,
      beforeEnter: ifAuthenticated,
    },
     {
      path: '/billing/payment/show/:id',
      name: 'showPayment',
      component: ShowPayment,
      beforeEnter: ifAuthenticated,
     },
     */
     // Access Control
    {
      path: '/accesscontrol/useraccounts',
      name: 'userAccount',
      component: UserAccounts,
      beforeEnter: ifAuthenticated,
    },
    {
      path: '/accesscontrol/permissions',
      name: 'permission',
      component: Permissions,
      beforeEnter: ifAuthenticated,
    },
    {
      path: '/accesscontrol/role',
      name: 'role',
      component: Role,
      beforeEnter: ifAuthenticated,
    },
    {
      path: '/accesscontrol/roleusers',
      name: 'roleUser',
      component: RoleUser,
      beforeEnter: ifAuthenticated,
    },
    //Pharmacy
      {
        path: '/pharmacy/index',
        name: 'pharmacy',
        component: Pharmacy,
        beforeEnter: ifAuthenticated,
      },
      /*
      {
        path: '/pharmacy/prescription',
        name: 'prescription',
        component: Prescription,
        beforeEnter: ifAuthenticated,
      },
      */
    {
      path: '/accesscontrol/thirdpartyapps',
      name: 'thirdPartyApps',
      component: ThirdPartyApps,
      beforeEnter: ifAuthenticated,
    },
    //Appointment
    {
      path: '/appointment',
      name: 'appointment',
      component: Appointment,
      beforeEnter: ifAuthenticated,
    },
    //radiology
    {
      path: '/radiology',
      name: 'radiology',
      component: Radiology,
      beforeEnter: ifAuthenticated,

    },
    //Tests
    {
      path: '/test',
      name: 'tests',
      component: Tests,
      beforeEnter: ifAuthenticated,
    },
    //reports
    {
      path: '/reports/appointments',
      name: 'appointmentReport',
      component: AppointmentReport,
      beforeEnter: ifAuthenticated,

    },
   {
      path: '/reports/patients',
      name: 'patientReport',
      component: PatientReport,
      beforeEnter: ifAuthenticated,

    },
   //inventory
    {
      path: '/inventory/supplier',
      name: 'supplier',
      component: InventorySupplier,
      beforeEnter: ifAuthenticated,
    },
    {
      path: '/inventory/supplies',
      name: 'supplies',
      component: InventoryItem,
      beforeEnter: ifAuthenticated,
    },
    {
      path: '/inventory/request',
      name: 'request',
      component: InventoryRequest,
      beforeEnter: ifAuthenticated,
    },
    // User Profile
    {
      path: '/account/profile',
      name: 'profile',
      component: Profile,
      beforeEnter: ifAuthenticated,
    },
  ]
})