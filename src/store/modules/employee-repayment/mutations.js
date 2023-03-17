import assign from 'lodash/assign'

export default {
	setInfo(state, payload) {
		const { data } = payload
		state.info = assign(state.info, data)
		console.log(state.info);
	},
	resetInfo(state, payload) {
		const { data } = payload
		state.info = data
	},
	revertToInit(state){
		state.info = {
			companyCode:'',
			companyName:'',
			applyUserName:'',  //申请人名称
			applyUserId:'',  //申请人id
			repaymentDay:'',//还款日期
			repaymentAmount: '', 
			toAccountNumber:'', //收款银行账号
			toBankName:'', //收款银行开户行
			fromAccountNumber:'',
			offsets:[],
			gatheringDetails:[]
		}
	}
}
