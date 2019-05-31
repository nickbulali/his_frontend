import apiCall from '../../utils/api'

const state = {
	familyhistories: []
};

const getters = {
	allFamilyHistories: (state) => state.familyhistories
};

const actions = {
	async fetchFamilyHistories({commit}) {
		const response = await apiCall({url: '/api/familyhistory', method: 'GET' });
		commit('setFamilyHistories', response.data)
	},
	async fetchFamilyHistory({commit}, id) {
		try {
			const response = await apiCall({url: `/api/familyhistory/${id}`, method: 'GET' });
			commit('setFamilyHistory', response);
		} catch (error){
			console.log(error.response)
		}
	},
	async addFamilyHistory({commit}, newfamilyhistory) {
		try {
			const response = await apiCall({url: '/api/familyhistory', data: newfamilyhistory, method: 'POST' });
			commit('newFamilyHistory', response);
		} catch (error){
			console.log(error.response)
		}
	},
	async updateFamilyHistory({commit}, familyhistory) {
		try {
			const response = await apiCall({url: `/api/familyhistory/${familyhistory.id}`, data: familyhistory, method: 'PUT' });
			commit('setFamilyHistory', response);
		} catch (error) {
			console.log(error.response)
		}
	},
	async deleteFamilyHistory({commit}, id) {
		try {
			await apiCall({url: `/api/familyhistory/${id}`, method: 'DELETE' });
			commit('removeFamilyHistory', id);
		} catch (error){
			console.log(error.response)
		}
	}
};

const mutations = {
	setFamilyHistories: (state, familyhistories) => (state.familyhistories = familyhistories),
	setFamilyHistory: (state, updFamilyHistory) => {
		const index = state.familyhistories.findIndex(familyhistory => familyhistory.id === updFamilyHistory.id);
		if(index !== -1){
			state.familyhistories.splice(index, 1, updFamilyHistory);
		}
	},
	newFamilyHistory: (state, familyhistory) => state.familyhistories.unshift(familyhistory),
	removeFamilyHistory: (state, id) =>  state.familyhistories = state.familyhistories.filter(familyhistory => familyhistory.id !== id),
};

export default {
	state,
	getters,
	actions,
	mutations
}