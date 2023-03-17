export default {
  temp: {
    proportions: {}, // 编辑中的分摊
  },

	submitData: {
		formNo: '', //申请单编
		internalOrder: '', //内部订单
		extraInfo: '', //基建名称/WBS名称
		invoiceAmount: 0, //发票总额

		
		instruction: '', //报销说明
		paymentInstruction: '', //付款信息

    // TODO

    // 事前申请信息
		staffApply: 0,
    applyFormNo: '',
		applyCategoryName: "",
		applyCategoryCode: '',
		applyAmount: 0,        // 事前申请金额
    claimedAmount: 0,      // 已报销金额
    claimAmount: '',       // 报销总额
    payAmount: 0,          //支付金额
    accountAmount: 0,    // 挂账金额
		useDate: "",
		receiptStandardEnumName: "",
		receiptNum: "",
		totalNum: "",
    instruction: '',     // 事由说明
    trainingLocation: '', // 培训地点
		shroffAccountList: [], // 收款信息
    trainingDetailList: [
      {
        trainExpenseTypeEnumName: '住宿费',
        trainExpenseTypeEnumId: 'hotel',

        trainStandardAmount: 0,
        applyClaimAmount: 0,
        applyStandardAmount: 0,
        applyAvgAmount: 0,
        applyAmount: '',
        isOverStandard: 0,
      },
      {
        trainExpenseTypeEnumName: '伙食费',
        trainExpenseTypeEnumId: 'board',

        trainStandardAmount: 0,
        applyClaimAmount: 0,
        applyStandardAmount: 0,
        applyAvgAmount: 0,
        applyAmount: '',
        isOverStandard: 0,
      },
      {
        trainExpenseTypeEnumName: '交通费',
        trainExpenseTypeEnumId: 'traffic',

        trainStandardAmount: 0,
        applyClaimAmount: 0,
        applyStandardAmount: 0,
        applyAvgAmount: 0,
        applyAmount: '',
        isOverStandard: 0,
      },
      {
        trainExpenseTypeEnumName: '外聘机构费',
        trainExpenseTypeEnumId: 'foreign',

        trainStandardAmount: 0,
        applyClaimAmount: 0,
        applyStandardAmount: 0,
        applyAvgAmount: 0,
        applyAmount: '',
        isOverStandard: 0,
      },

      {
        trainExpenseTypeEnumName: '杂费(场租费、租车费等)',
        trainExpenseTypeEnumId: 'incidental',

        trainStandardAmount: 0,
        applyClaimAmount: 0,
        applyStandardAmount: 0,
        applyAvgAmount: 0,
        applyAmount: '',
        isOverStandard: 0,
      },
      {
        trainExpenseTypeEnumName: '其它费用（如资料打印费等）',
        trainExpenseTypeEnumId: 'other',

        trainStandardAmount: 0,
        applyClaimAmount: 0,
        applyStandardAmount: 0,
        applyAvgAmount: 0,
        applyAmount: '',
        isOverStandard: 0,
      },
    ],


		bizRefInvoices: [], // 報銷發票關聯信息
		proportions: [], // 费用分摊信息
	},
}
