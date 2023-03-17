/**
 * 三个选项
 */
// 0,18->员工费用报账
// 1,19->员工借款
// 2,20->员工还款
// 3->其它收款
// 4->收款管理
// 5->总账报账
// 6->总账报账冲销
// 7->发票导入
// 8,21->非经营性应付报账
// 9,22->非经营性应付付款
// 10,23->非经营性预付
// 11->经营性预付
// 12->借阅申请
// 13->预算新增
// 14->预算调整
// 15->预算批量导入
// 16->其他报账
// 17->其他报账冲销
const flows = [
	// {
	// 	title: '差旅报销',
	// 	link: '/travel-claim/new',
	// 	linkMap: {
	// 		'/workflow/TravelClaim2': '/travel-claim2/new', // 版本2
	// 	},
	// 	storeType: 'travelClaim',
	// 	bizType: 'TravelClaim',
	// 	bizTypeCode: 'BIZ_TYPE_TRAVEL_CLAIM',
	// 	isApproval: true, // TODO 暂时去除
	// },
	{
		title: '员工还款',
		link: '/employee_repayment/',
		storeType: 'employeeRepayment',
		bizType: '2,20',
		// bizTypeCode: 'BIZ_TYPE_TRAVEL_CLAIM',
		isApproval: true, // TODO 暂时去除
	},
	{
		title: '应付报账',
		link: '/payable_reimbursement/',
		storeType: 'payableReimbursement',
		bizType: '8,21',
		// bizTypeCode: 'BIZ_TYPE_TRAVEL_CLAIM',
		isApproval: true, // TODO 暂时去除
	},

  {
    title: '员工报销',
    link: '/employee_reimburse/',
    storeType: 'employeeReimburse',
    bizType: '0,18',
  },

  {
    title: '员工借款',
    link: '/EmployeeLoan_show/',
    storeType: 'EmployeeLoan',
    bizType: '1,19',
    isApproval: true, // TODO 暂时去除
  },
  {
    title: '非经营性应付付款',
    link: '/nonOperatingPayables/',
    storeType: 'nonOperatingPayables',
    bizType: '9,22',
  },
  {
    title: '非经营性预付',
    link: '/nonOperatingPrepayment/',
    storeType: 'nonOperatingPrepayment',
    bizType: '10,23',
  },
]

export default flows
