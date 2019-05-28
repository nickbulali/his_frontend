import apiCall from '../../utils/api'

const state = {
	patients: [],
	patient: {}
};

const getters = {
	allPatients: (state) => state.patients,
	individualPatient: (state) => state.patient
};

const actions = {
	async fetchPatients({commit}) {
		const response = await apiCall({url: '/api/patient', method: 'GET' });
		commit('setPatients', response.data)
	},
	async fetchPatient({commit}, id) {
		try {
			const response = await apiCall({url: `/api/patient/${id}`, method: 'GET' });
			console.log('setPatient', response)
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
			commit('editPatients', updPatient)
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
	setPatients: (state, patients) => (state.patients = patients),
	setPatient: (state, patient) => (state.patient = patient),
	newPatient: (state, patient) => state.patients.unshift(patient),
	removePatient: (state, id) =>  state.patients = state.patients.filter(patient => patient.id !== id),
	editPatients: (state, updPatient) => {
		const index = state.patients.findIndex(patient => patient.id === updPatient.id);
		if(index !== -1){
			state.patients.splice(index, 1, updPatient);
		}
	}
};

export default {
	state,
	getters,
	actions,
	mutations
}