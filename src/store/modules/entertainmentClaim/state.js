export default {

	temp: {
		proportions: {}, // 编辑中的分摊
	},

	submitData: {
		formNo: '',
		// 事前申请信息
		applyFormNo: '',

		companyNum: 0,
		receiptNum: 0,
		totalNum: 0,
		entertainmentDetailList:[],
		receiptStartDate: "",
		receiptEndDate: "",
		receiptStandardEnumId: "",
		receiptStandardEnumName: "",
		receiptTypeEnumId: "",
		receiptTypeEnumName: "",
		applyAmount: 0, // 事前申请金额
		
		claimedAmount: 0, // 已报销金额
		claimAmount: 0, //报销总额
		payAmount: 0, //支付金额
		instruction: '', //报销说明

		invoiceAmount: 0, //发票总额

		paymentInstruction: '', //付款信息



		shroffAccountList: [], // 收款信息


		bizRefInvoices: [], // 報銷發票關聯信息
		proportions: [], // 费用分摊信息
		// borrowOffsets: [], // 借款核销信息
	},
}
