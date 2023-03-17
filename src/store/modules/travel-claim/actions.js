import state from "./state";
import httpService from '@/components/httpService'
export default {
	setTemp({ commit }, payload) {
		commit('setTemp', payload)
	},
	travelClaimSetInfo({ commit }, payload) {
		console.log('commit :>> ', payload);
		commit('travelClaimSetInfo', payload)
	},
	addTransport({ commit }, payload) {
		commit('addTransport', payload)
	},
	addAccommodation({ commit }, payload) {
		commit('addAccommodation', payload)
	},
	addOther({ commit }, payload) {
		commit('addOther', payload)
	},
	setShroffAccount({ commit }, payload) {
		commit('setShroffAccount', payload)
	},
	setOffsets({ commit }, payload) {
		commit('setOffsets', payload)
	},
	// 设置收款对象名称
	travelClaimSetInfoName({ commit }, payload) {
		commit('travelClaimSetInfoName', payload)
	},
	// 合并全局的请求参数
	mergeRequest({ commit }, payload) {
		commit('mergeRequest', payload)
	},
	// 设置收费内容
	setCostBreakdownData({ commit }, payload) {
		commit('setCostBreakdownData', payload)
	},
	// 删除
	deleteExpense({ commit }, payload) {
		commit('deleteExpense', payload)
	},
	expSetShowDetail({ commit }, payload) {
		commit('expSetShowDetail', payload)
	},
	expChangeMoney({ commit }, payload) {
		commit('expChangeMoney', payload)
	},
	setInitTravelClamData({ commit }, payload) {
		commit('setInitTravelClamData', payload)
	},
	initTravelClaimTempInvoices({commit, rootState}, payload) {
		const result = {
			rootState,
			payload
    }
		commit('initTravelClaimTempInvoices', result)
	},
	setCalendars({commit}, payload) {
		commit('setCalendars', payload)
	},

	async getLeaders({commit}, data) {
    if (state.leaders && state.leaders.length > 0) return state.leaders;
    let res = await httpService(data).getLeaders()
    commit('setLeaders', res.data)
    return res.data
  }
}
