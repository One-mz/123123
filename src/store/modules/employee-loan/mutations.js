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
		state.info = {
			loanTypeCode: '', //借款类别编号
			loanTypeName: '', //借款类别
			borrowerNo: '', //借款人编号
			borrower: '', //借款人
			businessDeptCode: '', //借款部门编号
			businessDeptName: '', //借款部门
			loanAmount: 0, //借款金额
			loanReason:'',//借款说明 YD
			plannedRepaymentDay: '', //计划还款日
			loanInArrear: 0, //前欠借款余额}
			paymentInstruction: '', //转账摘要
			shroffAccount: {
				finacialPayAccount: "",//DY
				paymentMethodCode: '', //支付方式代码
				paymentMethodName: '', //支付方式名称
				paymentInstruction: '', //转账摘要
				toBankCode: '', //收款银行代码
				toBankName: '', //收款银行
				toAccount: '', //收款账户
				toAccountNumber: '', //收款账号
				payApplyAmount: 0, //付款申请金额
				businessDeptCode: '', //经办人部门
			}
		}
	}
}
