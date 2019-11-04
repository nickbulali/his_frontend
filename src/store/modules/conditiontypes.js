import apiCall from '../../utils/api'

const state = {
	conditiontypes: []
};

const getters = {
	allConditionTypes: (state) => state.conditiontypes
};

const actions = {
	async fetchConditionTypes({commit}) {
		const response = await apiCall({url: '/api/conditiontype', method: 'GET' });
		commit('setConditionTypes', response)
	},
	async fetchConditionType({commit}, id) {
		try {
			const response = await apiCall({url: `/api/conditiontype/${id}`, method: 'GET' });
			commit('setConditionType', response);
		} catch (error){
			console.log(error.response)
		}
	},
	async addConditionType({commit}, newconditiontype) {
		try {
			const response = await apiCall({url: '/api/conditiontype', data: newconditiontype, method: 'POST' });
			commit('newConditionType', response);
		} catch (error){
			console.log(error.response)
		}
	},
	async updateConditionType({commit}, conditiontype) {
		try {
			const response = await apiCall({url: `/api/conditiontype/${conditiontype.id}`, data: conditiontype, method: 'PUT' });
			commit('setConditionType', response);
		} catch (error) {
			console.log(error.response)
		}
	},
	async deleteConditionType({commit}, id) {
		try {
			await apiCall({url: `/api/conditiontype/${id}`, method: 'DELETE' });
			commit('removeConditionType', id);
		} catch (error){
			console.log(error.response)
		}
	}
};

const mutations = {
	setConditionTypes: (state, conditiontypes) => (state.conditiontypes = conditiontypes),
	setConditionType: (state, updConditionType) => {
		const index = state.conditiontypes.findIndex(conditiontype => conditiontype.id === updConditionType.id);
		if(index !== -1){
			state.conditiontypes.splice(index, 1, updConditionType);
		}
	},
	newConditionType: (state, conditiontype) => state.conditiontypes.unshift(conditiontype),
	removeConditionType: (state, id) =>  state.conditiontypes = state.conditiontypes.filter(conditiontype => conditiontype.id !== id)
};

export default {
	state,
	getters,
	actions,
	mutations
}