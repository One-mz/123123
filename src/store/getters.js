import isObject from 'lodash/isObject'
import state from './state';

export default {
	fileList: state => {
		return state.fileList
	},
	userInfo: state => {
		return isObject(state.bpmInfo) && isObject(state.bpmInfo.userInfo)
			? state.bpmInfo.userInfo
			: {}
	},
	departInfo: state => {
		return isObject(state.bpmInfo) && isObject(state.bpmInfo.departInfo)
			? state.bpmInfo.departInfo
			: {}
	},
	pmNodeId: state => {
    console.log(state.taskVars,'state.taskVars.bpmDefNodeInfo')
		return isObject(state.taskVars) &&
			isObject(state.taskVars.bpmDefNodeInfo) &&
			state.taskVars.bpmDefNodeInfo.nodeId
			? state.taskVars.bpmDefNodeInfo.nodeId
			: ''
	},
	invoices: state => state.invoices,
	bpmFormMain: state => {
		return isObject(state.taskVars) && isObject(state.taskVars.bpmFormMain) ? state.taskVars.bpmFormMain : {}
	},
	bpmDefInfo: state => {
		return isObject(state.taskVars) && isObject(state.taskVars.bpmDefInfo) ? state.taskVars.bpmDefInfo : {}
	},
	bpmDefNodeInfo: state => {
		return isObject(state.taskVars) && isObject(state.taskVars.bpmDefNodeInfo) ? state.taskVars.bpmDefNodeInfo : {}
	},
	bpmDefNodeInfoFormConfig: state => {
		return isObject(state.taskVars) && isObject(state.taskVars.bpmDefNodeInfoFormConfig) ? state.taskVars.bpmDefNodeInfoFormConfig : {}
	},
	bpmFormStep: state => {
		return isObject(state.taskVars) && isObject(state.taskVars.bpmFormStep) ? state.taskVars.bpmFormStep : {}
	},
	stepList: state => {
		return isObject(state.taskVars) && isObject(state.taskVars.stepList) ? state.taskVars.stepList : {}
	},
	taskVars: state => {
		return state.taskVars || {};
	},
	// bpmFormStep: state => {
	// 	return state.bpmFormStep || {};
	// },
	selectedInfo: state => state.selectedInfo,
	optObj: state => state.optObj,
	basicBizObj:state=>state.basicBizObj,
	bizObjectData:state=>state.bizObjectData,
	isLoaded:state=>state.isLoaded
}
