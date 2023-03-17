import assign from 'lodash/assign'

export default {
	setInfo(state, payload) {
		const { data } = payload
		state.info = assign(state.info, data)
	},
	resetInfo(state, payload) {
		const { data } = payload
		state.info = data
	},
	setPaymentInstruction(state, payload) {
		const { data } = payload
		state.info.paymentInstruction = data
	},
	setloanInstruction(state, payload) {
		const { data } = payload
		state.info.loanReason = data
	},
	setPayApplyAmount(state, payload) {
		const { data } = payload
		state.info.shroffAccount.payApplyAmount = data
	},
	setBusinessDeptCode(state, payload) {
		const { data } = payload
		state.info.shroffAccount.businessDeptCode = data
	},
	// setShroffAccount(state, payload) {
	//   if(!payload) {
	//     return;
    // }
	// 	const { data } = payload
	// 	state.info.shroffAccount = Object.assign(state.info.shroffAccount, data)
	// },
	revertToInit(state){
		state.info = {}
	}
}
