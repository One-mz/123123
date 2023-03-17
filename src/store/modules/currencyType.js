
const state = {
    formCurrencyTypeCode :''
  }
  
  const mutations = {
    SET_FORM_CURRENCYTYPECODE:(state,currencyTypeCode) =>{
      state.formCurrencyTypeCode = currencyTypeCode
    },
  }
  
  const actions = {
    

  }
  
  export default {
    namespaced: true,
    state,
    mutations,
    actions
  }
  