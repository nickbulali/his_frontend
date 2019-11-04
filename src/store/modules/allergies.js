import apiCall from '../../utils/api'

const state = {
	allergies: [],
	allergy: {}
};

const getters = {
	allAllergies: (state) => state.allergies,
	individualAllergy: (state) => state.allergy
};

const actions = {
	async fetchAllergies({commit}) {
		const response = await apiCall({url: '/api/allergy', method: 'GET' });
		commit('setAllergies', response)
	},
	async fetchAllergy({commit}, id) {
		try {
			const response = await apiCall({url: `/api/allergy/${id}`, method: 'GET' });
			console.log('setAllergy', response)
			commit('setAllergy', response);
		} catch (error){
			console.log(error.response)
		}
	},
	async addAllergy({commit}, newallergy) {
		try {
			const response = await apiCall({url: '/api/allergy', data: newallergy, method: 'POST' });
			commit('newAllergy', response);
		} catch (error){
			console.log(error.response)
		}
	},
	async updateAllergy({commit}, allergy) {
		try {
			const response = await apiCall({url: `/api/allergy/${allergy.id}`, data: allergy, method: 'PUT' });
			commit('setAllergy', response);
			commit('editAllergies', updAllergy)
		} catch (error) {
			console.log(error.response)
		}
	},
	async deleteAllergy({commit}, id) {
		try {
			await apiCall({url: `/api/allergy/${id}`, method: 'DELETE' });
			commit('removeAllergy', id);
		} catch (error){
			console.log(error.response)
		}
	}
};

const mutations = {
	setAllergies: (state, allergies) => (state.allergies = allergies),
	setAllergy: (state, allergy) => (state.allergy = allergy),
	newAllergy: (state, allergy) => state.allergies.unshift(allergy),
	removeAllergy: (state, id) =>  state.allergies = state.allergies.filter(allergy => allergy.id !== id),
	editAllergies: (state, updAllergy) => {
		const index = state.allergies.findIndex(allergy => allergy.id === updAllergy.id);
		if(index !== -1){
			state.allergies.splice(index, 1, updAllergy);
		}
	}
};

export default {
	state,
	getters,
	actions,
	mutations
}