import sync from '@/lazyload'

// 员工借款
const router = {
	path: '/EmployeeLoan_show/:id',
	component: sync('views/EmployeeLoan_show/main'),
	children: [
		{
			//默认首页
			path: '',
			component: sync('views/EmployeeLoan_show/base-info'),
			meta: { bizType: 'EmployeeLoan' },
		},
		{
			//基本信息
			path: 'baseInfo',
			component: sync('views/EmployeeLoan_show/base-info'),
			meta: { bizType: 'EmployeeLoan' },
		},

		{
			//欠款明细
			path: 'arrearsInfo',
			component: sync('views/EmployeeLoan_show/arrearsInfo'),
			meta: { bizType: 'EmployeeLoan' },
		},

    {
    	//收付款信息
    	path: 'incomeAndPay',
    	component: sync('views/EmployeeLoan_show/incomeAndPay'),
    	meta: { bizType: 'EmployeeLoan' },
    },

		{
			//附件下载
			path: 'attachmentInfo',
			component: sync('views/EmployeeLoan_show/attachment-info'),
			meta: { bizType: 'EmployeeLoan' },
		},

		{
			//流程履历
			path: 'processResume',
			component: sync('views/EmployeeLoan_show/process-resume'),
			meta: { bizType: 'EmployeeLoan' },
		  },

	],
}

export default router
