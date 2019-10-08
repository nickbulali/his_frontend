import apiCall from '../../utils/api'
import {monthName} from '@/utils/basics'

const state = {
	patients: [],
	genders:["none","Male","Female","Both","Unknown"]
};

const getters = {
    genders:(state)=>{
        return state.genders
    },
	allPatients: (state) => state.patients,
	frequencyOfPatients:(state)=>{
        let by_gender = {total:[],monthly:[],yearly:[]};
        state.genders.forEach((gender,index) => {
            by_gender.total[index] = 0
            by_gender.monthly[index] = {}
        });
        
        if(state.patients.meta){
            state.patients.meta.frequency.forEach(element => {
                if(by_gender.total[element.gender_id]!=null){
                    by_gender.total[element.gender_id] += element.num
                }else{
                    by_gender.total[element.gender_id] = element.num
                }
                
                if(by_gender.yearly[element.gender_id]==null){
                    by_gender.yearly[element.gender_id] = {}
                    for (let monthLoop = 1; monthLoop < 13; monthLoop++) {
                        if(by_gender.monthly[element.gender_id]==null){
                            by_gender.monthly[element.gender_id] = {}
                        }
                        by_gender.monthly[element.gender_id][element.year+"-"+monthName(monthLoop).code]=0;      
                    }
                }                
                if(by_gender.yearly[element.gender_id][element.year]==null){
                    by_gender.yearly[element.gender_id][element.year] =0
                }
                by_gender.yearly[element.gender_id][element.year] += element.num


                if(by_gender.monthly[element.gender_id][element.year+"-"+monthName(element.month).code]==null){
                    by_gender.monthly[element.gender_id][element.year+"-"+monthName(element.month).code] =0
                }
                by_gender.monthly[element.gender_id][element.year+"-"+monthName(element.month).code] += element.num

            });            
        }
        console.log(by_gender)
        return by_gender
        
    },
};

const actions = {
	async fetchPatients({commit}) {
		const response = await apiCall({url: '/api/patient', method: 'GET' });
		console.log("Queried patients get response ", response)
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
	setPatients: (state, patients) => (state.patients = patients),
	setPatient: (state, updPatient) => {
		const index = state.patients.data.findIndex(patient => patient.id === updPatient.id);
		if(index !== -1){
			state.patients.data.splice(index, 1, updPatient);
		}
	},
	newPatient: (state, patient) => state.patients.data.unshift(patient),
	removePatient: (state, id) =>  state.patients = state.patients.data.filter(patient => patient.id !== id),
};

export default {
	state,
	getters,
	actions,
	mutations
}