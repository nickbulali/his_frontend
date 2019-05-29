import apiCall from '../../utils/api'

const state = {
	maritalstatuses: []
};

const getters = {
	allMaritalStatuses: (state) => state.maritalstatuses
};

const actions = {
	async fetchMaritalStatuses({commit}) {
		const response = await apiCall({url: '/api/maritalstatus', method: 'GET' });
		commit('setMaritalStatuses', response.data)
	},
	async fetchMaritalStatus({commit}, id) {
		try {
			const response = await apiCall({url: `/api/maritalstatus/${id}`, method: 'GET' });
			commit('setMaritalStatus', response);
		} catch (error){
			console.log(error.response)
		}
	},
	async addMaritalStatus({commit}, newmaritalstatus) {
		try {
			const response = await apiCall({url: '/api/maritalstatus', data: newmaritalstatus, method: 'POST' });
			commit('newMaritalStatus', response);
		} catch (error){
			console.log(error.response)
		}
	},
	async updateMaritalStatus({commit}, maritalstatus) {
		try {
			const response = await apiCall({url: `/api/maritalstatus/${maritalstatus.id}`, data: maritalstatus, method: 'PUT' });
			commit('setMaritalStatus', response);
		} catch (error) {
			console.log(error.response)
		}
	},
	async deleteMaritalStatus({commit}, id) {
		try {
			await apiCall({url: `/api/maritalstatus/${id}`, method: 'DELETE' });
			commit('removeMaritalStatus', id);
		} catch (error){
			console.log(error.response)
		}
	}
};

const mutations = {
	setMaritalStatuses: (state, maritalstatuses) => (state.maritalstatuses = maritalstatuses),
	setMaritalStatus: (state, updMaritalStatus) => {
		const index = state.maritalstatuses.findIndex(maritalstatus => maritalstatus.id === updMaritalStatus.id);
		if(index !== -1){
			state.maritalstatuses.splice(index, 1, updMaritalStatus);
		}
	},
	newMaritalStatus: (state, maritalstatus) => state.maritalstatuses.unshift(maritalstatus),
	removeMaritalStatus: (state, id) =>  state.maritalstatuses = state.maritalstatuses.filter(maritalstatus => maritalstatus.id !== id),
};

export default {
	state,
	getters,
	actions,
	mutations
}