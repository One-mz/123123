import Vue from 'vue'
import Vuex from 'vuex'

import state from './state'
import mutations from './mutations'
import getters from './getters'
import actions from './actions'

import TravelClaimState from './modules/travel-claim'
import TravelState from './modules/travel'
import employeeLoanState from './modules/employee-loan'
import employeeRepaymentState from './modules/employee-repayment'
import employeeReimburseState from './modules/employee-reimburse'
import myInvoices from './modules/my-invoices'
import otherApplyState from './modules/other-apply'
import entertainmentApplyState from './modules/entertainmentApply'
import entertainmentClaimState from './modules/entertainmentClaim'
import partnerListState from './modules/partnerList'
import conferenceState from './modules/conference'
import travelApply from './modules/travel-apply'
import trainingApplyState from './modules/training_apply'
import billingInvoiceState from './modules/billing_invoice'

import meetingClaimState from './modules/meeting-claim'
import trainingClaimState from './modules/training-claim'
import employeeLoanApplyState from './modules/employeeLoanApply'
import commonOptions from './modules/commonOptions.js'
import currencyType from './modules/currencyType.js'

Vue.use(Vuex)

export default new Vuex.Store({
	state,
	mutations,
	getters,
	actions,
	modules: {
		travel: TravelState,
		travelClaim: TravelClaimState,
		employeeLoan: employeeLoanState,
		employeeReimburse: employeeReimburseState,
		myInvoices: myInvoices,
		otherApply: otherApplyState,
		entertainmentApply: entertainmentApplyState,
		entertainmentClaim: entertainmentClaimState,
		partnerList: partnerListState,
		conference: conferenceState,
		travelApply: travelApply,
		meetingClaim: meetingClaimState,
		trainingApply: trainingApplyState,
		trainingClaim: trainingClaimState,
		employeeRepayment: employeeRepaymentState,
		employeeLoanApply: employeeLoanApplyState,
		billingInvoice: billingInvoiceState,
		commonOptions,
		currencyType
	},
})
