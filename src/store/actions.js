export default {
  setCurrentFlow({ commit }, payload) {
    commit('setCurrentFlow', payload)
  },
  setHeader({ commit }, payload) {
    commit('setHeader', payload)
  },
  setBpmInfo({ commit }, payload) {
    commit('setBpmInfo', payload)
  },
  setOptObj({ commit }, payload) {
    console.log('payload :>> ', payload);
    commit('SET_OPTOBJ', payload)
  },
  setDepartInfo({ commit }, payload) {
    commit('setDepartInfo', payload)
  },
  setTaskVars({ commit }, payload) {
    commit('setTaskVars', payload)
  },
  setFrom({ commit }, payload) {
    commit('setFrom', payload)
  },
  invoicesAction({ commit }, payload) {
    commit('invoicesAction', payload)
  },
  tranInvoice({ commit }, payload) {
    commit('tranInvoice', payload)
  },
  btnStatus({ commit }, payload) {
    commit('btnStatus', payload)
  },
  initState({ commit }, payload) {
    commit('initState', payload)
  },
  setBpmFormStep({ commit }, payload) {
    commit('setBpmFormStep', payload)
  },
  setBasicBizObj({ commit, state }, data) {
    commit("SET_BASICBIZOBJ", data);
  },
  
}
