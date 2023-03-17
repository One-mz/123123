
const state = {
  currencyOptions:[]
}

const mutations = {
  SET_CURRENCYOPTIONS:(state,currencyOptions) =>{
    state.currencyOptions = currencyOptions
  },
}

const actions = {
  
  setCurrencyOptions({commit},data){
    commit('SET_CURRENCYOPTIONS',data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
