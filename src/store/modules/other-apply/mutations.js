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

	revertToInit(state){
		state.info = {
		}
	}
}
