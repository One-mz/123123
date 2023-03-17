export default {
  // amountTotal: '', // 报账金额 合计
  // payAmountTotal: '', // 支付金额 合计
  // claimPersonCode: '',
  info: { },
  temp: {
    proportions: {}, // 编辑中的分摊
  },

	submitData: {
		formNo: '', //申请单编号

		// claimAmount: 0, //报销总额
		invoiceAmount: '', //发票总额
		payAmount: '', //支付金额
		instruction: '', //报销说明
		paymentInstruction: '', //付款信息

    // TODO

    // 事前申请信息
		staffApply: '',
    applyFormNo: '',      //事前申请单
		applyCategoryName: "",
		applyCategoryCode: '',
		applyAmount: '',       //事前申请金额
    claimedAmount: '',    // 已报销金额
    claimAmount: '',      // 报销金额
    payAmount: '',        // 支付金额
    accountAmount: '',    // 挂账金额
    meetingLocation: '',  // 会议地点
    instruction: '',      // 事由说明
    meetTypeEnumId: '',   //会议类型
    meetTypeEnumName: '' ,//会议类型名称
    holdStartDate: '',//开始时间
    holdEndDate:'',//结束时间 
    meetingDetailList: [  // 会议明细
      {
        meetExpenseTypeEnumName: '住宿费',
        meetExpenseTypeEnumId: 'hotel',

        meetStandardAmount: 0,
        applyClaimAmount: 0,
        applyStandardAmount: 0,
        applyAvgAmount: 0,
        applyAmount: '',
        isOverStandard: 0,
      },
      {
        meetExpenseTypeEnumName: '伙食费',
        meetExpenseTypeEnumId: 'board',

        meetStandardAmount: 0,
        applyClaimAmount: 0,
        applyStandardAmount: 0,
        applyAvgAmount: 0,
        applyAmount: '',
        isOverStandard: 0,
      },
      {
        meetExpenseTypeEnumName: '杂费(场租费、专家费、租车费等)',
        meetExpenseTypeEnumId: 'incidental',

        meetStandardAmount: 0,
        applyClaimAmount: 0,
        applyStandardAmount: 0,
        applyAvgAmount: 0,
        applyAmount: '',
        isOverStandard: 0,
      },
      {
        meetExpenseTypeEnumName: '其它费用（如资料打印费等）',
        meetExpenseTypeEnumId: 'other',

        meetStandardAmount: 0,
        applyClaimAmount: 0,
        applyStandardAmount: 0,
        applyAvgAmount: 0,
        applyAmount: '',
        isOverStandard: 0,
      },
    ],

		shroffAccountList: [], // 收款信息


		bizRefInvoices: [], // 报销发票关联信息
		proportions: [], // 费用分摊信息
		// borrowOffsets: [], // 借款核销信息
	},
}
