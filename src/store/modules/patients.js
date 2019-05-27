import apiCall from '../../utils/api'

const state = {
	patients: []
};

const getters = {
	allPatients: (state) => state.patients
};

const actions = {
	async fetchPatients({commit}) {
		const response = await apiCall({url: '/api/patient', method: 'GET' });
		commit('setPatients', response.data)
	}
};

const mutations = {
	setPatients: (state, patients) => (state.patients = patients)
};

export default {
	state,
	getters,
	actions,
	mutations
}