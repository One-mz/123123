export default {
	showWarning:false,
	showItems:'',
	dates: [],
	temp: {},
	calendarsdate: {
		travelStartDate: '',
		travelEndDate: '',
		traveler: [],
		travelApplicationId: '',
		calendars: [],
	},
	foodSupInfo: {
		foods: [],
		travelApplicationId: '',
	},
	trafficSupInfo: {
		traffic: [],
		travelApplicationId: '',
	},
	publicsInfo: {
		publics: [],
		travelApplicationId: '',
	},
	info: {
		formNo: '', //申请单编号
		claimTypeCode: '', //报销类型代码
		claimTypeName: '', //报销类型名称
		costTypeCode: '', //费用类型代码
		costTypeName: '', //费用类型名称
		internalOrder: '', //内部订单
		infraNo: '', //基建编号
		calculateNode: '', //概算节点
		wbsNo: '', //WBS编号
		projectType: '', //项目类型
		totalAmount: '', //报账总额
		offsetAmount: '', //本次核销金额
		payAmount: '', //支付金额
		receiverTypeCode: '', //收款对象代码
		receiverTypeName: '', //收款对象名称
		vendorCode: '', //供应商代码
		travelEndDate: '', //出差结束时间
		travelStartDate: '', //出差开始时间
		travelerNames: '', //出差人
		vendorName: '', //供应商名称
		paymentInstruction: '', //划拨转账摘要
		fromNumber: '', //划拨收款账号
		fromBankName: '', //划拨收款银行名称
		fromBankCode: '', //划拨收款银行代码
		fromAccount: '', //划拨收款账户
		instruction: '', //报销说明
		travelApplicationId: '', //差旅申请单号
		/*差旅日历
    * travelName:出差人,String
      excludeTime:去除的日期,String
      refFormNo:关联主表单号String
    * */
		calendars: [],
		/*伙食补助费信息无 发票 List
     * travelName:旅行人姓名,String
     * excludeTime:去除的日期列表,String
     * refFormNo:关联主表单号String
     * */
		foods: [],
		/*交通补助费信息无 发票 List
     * travelName:旅行人姓名,String
     * excludeTime:去除的日期列表,String
     * refFormNo:关联主表单号String
     * */
		traffic: [],
		/*公杂费信息   无发票	List
     *travelName:旅行人姓名,String
     *excludeTime:去除的日期列表,String
     *refFormNo:关联主表单号String
     * */
		publics: [],
		/*城市交通费信息  无发票	List
     *startCity:出发地,String
     *arrivalCity:到达地,String
     *travelDate:出发日期,Date
     *transportMethodCode:交通方式代码,String
     *transportMethodName:交通方式名称,String
     *traveler:人员,String
     *claimAmount:报销金额,BigDecimal
     *instruction:备注,String
     *refFormNo:参考主表单号String
     * */
		transports: [],
		/*住宿信息 有发票 list
     *"city":"住宿地",
     *"checkin":"入住日期",
     *"checkout":"离店日期",
     *"claimAmount":"报销金额",
     *"taxOffsetAmount":"可抵扣税额",
     *"traveler":"入住人",
     *"halfDayExtra":"是否延住半天",
     *"halfDayDate":"延住日期",
     *"extraTraveler":"延住人",
     * "refFormNo":"关联主表单号",
     * "remarks":"备注",
     * bizRefInvoiceList:发票信息
     * */
		accommodations: [],
		/*其他信息  有发票	List
     *instruction:费用说明,String
     *claimAmount:报销金额,BigDecimal
     *taxOffsetAmount:可抵扣税额,BigDe
     *refFormNo:关联主表单号String
     *bizRefInvoiceList:发票信息
     * */
		others: [],
		repasts: [],
		meets: [],
		trainings: [],
		shroffAccountList:[],

	},
	other: [],
	borrow: [],
	shroffAccount: {
		//收款信息
		paymentMethodCode: '', //支付方式代码
		paymentMethodName: '', //支付方式名称
		paymentInstruction: '', //转账摘要
		toBankCode: '', //收款银行代码
		toBankName: '', //收款银行
		toAccount: '', //收款账户
		toAccountNumber: '', //收款账号
		payApplyAmount: 0, //付款申请金额
		businessDeptCode: '"30002007"', //经办人部门
	},
	offsets: [],
	temp: {
		transports: {},
		accommodations: {},
		publics: {},
	},
	extraTemp: {},
	tempInvoices: [],
	bizRefInvoices:[],
	submitData: {
		totalAmount: 0,
		offsetAmount: 0,
		payAmount: 0,
		calendars: [],
		transports: [], // 差旅费用
		accommodations: [], // 住宿
		// travelerNames:'',
		others: [],
		meets: [],
		trainings: [],
		repasts: [],
		foods: [],
		publics: [], // 杂费
		offsets: [],
    borrowAgings:[],
		feeSummaries:[],
		shroffAccountList:[],
	},
	request: {},
	ta: {},
	leaders: {},
	defaultValue: [],
	defaultOptions: [],
}
