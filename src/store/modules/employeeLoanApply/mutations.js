import assign from 'lodash/assign'
export default {
  setInfo(state, payload) {
  	const { data } = payload
  	state.info = assign(state.info, data)
  },
	revertToInit(state){
		state.info = {
		}
	},
  setAmount(state, payload) {
  	const { data } = payload
  	state.totalAmount = data
  },
}
