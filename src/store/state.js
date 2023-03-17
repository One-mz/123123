import { domain } from '../config/domain.js'

export default {
	fileList: [],
	selectedInfo: {},
	locked: false,
	bpmInfo: {
		userInfo: {},
		departInfo: {},
	},
	taskVars: {},
	currentFlow: {
		bizType: '',
		id: '',
	},
	bizObjectData: {
		formNo: '',
		formStatus: '新建',
	},
	bpmFormStep: {

	},
	showBtns: true,
	invoices: [], // 全局的invoice
	readOnly: false,
	headTitle: '共享平台',
	ctx: domain,
	from: '',
	shroffAccount: {},
	travelInfoInClaim: {},
	paymentInfoFlag: false, // 付款修订环节可以修改付款信息
	fromInvoiceFlag: false,
	deletedInvoices: [],
	tempDetail: {},
	isShowTabs: true,

	initCostShareFlag: false,
	isShowOvertimeReminder: true,
	urgencyObj: {
		urgencyFlag: '',
		urgencyLevel: 0,
	},
	userCompanyOptions: [],
	targetType: '',
	tranInvoiceList: [],
	basicBizObj: {},
	optObj: {},
	isLoaded: false, // 没有加载完流程数据前，页面不加载具体的业务流程页面
	stepList:[]
}
