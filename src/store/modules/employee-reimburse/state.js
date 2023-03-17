export default {
  // amountTotal: '', // 报账金额 合计
  // payAmountTotal: '', // 支付金额 合计
  // claimPersonCode: '',

  temp: {
    proportions: {}, // 编辑中的分摊
  },
  applyInfo:{},
	submitData: {
		formNo: '', //申请单编号
		claimTypeCode: '', //报销类型代码
		claimTypeName: '', //报销类型

    claimDepartmentCode: '',  // 报销部门code
    claimDepartmentName: '', // 报销部门
    claimPersonName: '', // 报销费用人
    claimPersonCode: '', // 报销费用人code

		internalOrder: '', //内部订单
		extraInfo: '', //基建名称/WBS名称
		claimAmount: 0, //报销总额
		invoiceAmount: 0, //发票总额
		currentOffsetAmount: 0, //本次核销总额
		payAmount: 0, //支付金额
		instruction: '', //报销说明
		paymentInstruction: '', //付款信息


    // 事前申请信息
		staffApply: 0,
    applyFormNo: '',
		applyCategoryName: "",
		applyCategoryCode: '',
		applyAmount: 0,
		useDate: "",
		receiptStandardEnumName: "",
		receiptNum: "",
		totalNum: "",
		shroffAccount: {
			receiver: '', //收款人
			paymentMethodCode: '', //支付方式代码
			paymentMethodName: '', //支付方式名称
			paymentInstruction: '', //转账摘要
			fromBankCode: '', //付款银行代码
			fromBankName: '', //付款银行名称
			fromAccount: '', //付款账户
			fromAccountNumber: '', //付款账号
			toBankCode: '', //收款银行n代码
			toBankName: '', //收款银行名称
			toAccount: '', //收款账户
			toAccountNumber: '', //收款账号
			paymentStatus: '', //支付状态
			paymentCount: '', //支付次数
			refFormNo: '', //关联业务单号
			contractNo: '', //合同编号
			contractName: '', //合同名称
			businessCompanyCode: '', //公司代码
			currency: '', //币种
			businessDeptCode: '', //经办人部门
			expectPayDate: '', //期望付款日期
			payApplyAmount: '', //付款申请金额
			finacialPayAccount: '', //财务公司支付账号
			companyPayAccount: '', //本单位实际支付账号
			payAmount: '', //实际支付金额
			payDate: '', //支付日期
			fundUsage: '', //资金用途
			systemTag: '', //系统来源
			cnapsNo: '', //联行号
		},


		bizRefInvoices: [], // 報銷發票關聯信息
		proportions: [], // 费用分摊信息
		borrowOffsets: [], // 借款核销信息
	},
}
