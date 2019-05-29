import apiCall from '../../utils/api'

const state = {
	familyrelations: []
};

const getters = {
	allFamilyRelations: (state) => state.familyrelations,
};

const actions = {
	async fetchFamilyRelations({commit}) {
		const response = await apiCall({url: '/api/familyrelation', method: 'GET' });
		commit('setFamilyRelations', response)
	},
	async fetchFamilyRelation({commit}, id) {
		try {
			const response = await apiCall({url: `/api/familyrelation/${id}`, method: 'GET' });
			commit('setFamilyRelation', response);
		} catch (error){
			console.log(error.response)
		}
	},
	async addFamilyRelation({commit}, newfamilyrelation) {
		try {
			const response = await apiCall({url: '/api/familyrelation', data: newfamilyrelation, method: 'POST' });
			commit('newFamilyRelation', response);
		} catch (error){
			console.log(error.response)
		}
	},
	async updateFamilyRelation({commit}, familyrelation) {
		try {
			const response = await apiCall({url: `/api/familyrelation/${familyrelation.id}`, data: familyrelation, method: 'PUT' });
			commit('setFamilyRelation', response);
		} catch (error) {
			console.log(error.response)
		}
	},
	async deleteFamilyRelation({commit}, id) {
		try {
			await apiCall({url: `/api/familyrelation/${id}`, method: 'DELETE' });
			commit('removeFamilyRelation', id);
		} catch (error){
			console.log(error.response)
		}
	}
};

const mutations = {
	setFamilyRelations: (state, familyrelations) => (state.familyrelations = familyrelations),
	setFamilyRelation: (state, updfamilyrelation) => {
		const index = state.familyrelations.findIndex(familyrelation => familyrelation.id === updfamilyrelation.id);
		if(index !== -1){
			state.familyrelations.splice(index, 1, updfamilyrelation);
		}
	},
	newFamilyRelation: (state, familyrelation) => state.familyrelations.unshift(familyrelation),
	removeFamilyRelation: (state, id) =>  state.familyrelations = state.familyrelations.filter(familyrelation => familyrelation.id !== id),
};

export default {
	state,
	getters,
	actions,
	mutations
}