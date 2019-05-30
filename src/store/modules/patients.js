import apiCall from '../../utils/api'

const state = {
	patients: [],
	patientPagination: {
		current_page: 1,
		per_page: 0,
	    total: 0,
	    visible: 10
	}
};

const getters = {
	allPatients: (state) => state.patients,
	patientPagination: (state) => state.patientPagination
};

const actions = {
	async fetchPatients({commit}, page) {
		const response = await apiCall({url: `/api/patient?page=${page}`, method: 'GET' });
		commit('setPatients', response)
	},
	async fetchPatient({commit}, id) {
		try {
			const response = await apiCall({url: `/api/patient/${id}`, method: 'GET' });
			commit('setPatient', response);
		} catch (error){
			console.log(error.response)
		}
	},
	async addPatient({commit}, newpatient) {
		try {
			const response = await apiCall({url: '/api/patient', data: newpatient, method: 'POST' });
			commit('newPatient', response);
		} catch (error){
			console.log(error.response)
		}
	},
	async updatePatient({commit}, patient) {
		try {
			const response = await apiCall({url: `/api/patient/${patient.id}`, data: patient, method: 'PUT' });
			commit('setPatient', response);
		} catch (error) {
			console.log(error.response)
		}
	},
	async deletePatient({commit}, id) {
		try {
			await apiCall({url: `/api/patient/${id}`, method: 'DELETE' });
			commit('removePatient', id);
		} catch (error){
			console.log(error.response)
		}
	}
};

const mutations = {
	setPatients: (state, patients) => {
		state.patients = patients.data,
		state.patientPagination.current_page = patients.current_page
		state.patientPagination.total = patients.total
		state.patientPagination.per_page = patients.per_page
	},
	setPatient: (state, updPatient) => {
		const index = state.patients.findIndex(patient => patient.id === updPatient.id);
		if(index !== -1){
			state.patients.splice(index, 1, updPatient);
		}
	},
	newPatient: (state, patient) => state.patients.unshift(patient),
	removePatient: (state, id) =>  state.patients = state.patients.filter(patient => patient.id !== id),
};

export default {
	state,
	getters,
	actions,
	mutations
}