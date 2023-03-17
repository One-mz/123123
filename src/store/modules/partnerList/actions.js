export default {

	initTempInvoices({commit, rootState}, payload) {
		const result = {
			rootState, // 根节点状态
			payload
		}
		commit('initTempInvoices', result)
	}
}
