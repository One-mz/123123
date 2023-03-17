export default {
	setInfo({ commit }, payload) {
		commit('setInfo', payload)
	},
	resetInfo({ commit }, payload) {
		commit('resetInfo', payload)
	},
	setPaymentInstruction({ commit }, payload) {
		commit('setPaymentInstruction', payload)
	},
	setPayApplyAmount({ commit }, payload) {
		commit('setPayApplyAmount', payload)
	},
	setBusinessDeptCode({ commit }, payload) {
		commit('setBusinessDeptCode', payload)
	},
	setloanInstruction({ commit }, payload) {
		commit('setloanInstruction', payload)
	}
}
