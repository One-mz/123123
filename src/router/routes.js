import lazyLoad from '@/lazyload.js'

import sync from '@/lazyload'

import LoginRouter from './login' // 登录
import RedirectRouter from './redirect' // 流程版本跳转路径

// 核心发票组件

import HomeRouter from './home' // 主页
import DoneRouter from './done' // 我的办结
import CompletedRouter from './completed' // 我的已办
import DraftRouter from './draft' // 我的申请
import TodoRouter from './todo' // 我的待办
import MyDelegate from './my-delegate' //我的委派
import employeeReimburseRouter from './employee-reimburse' // 员工报销
import employeeLoan from './employeeLoan' // 员工借款

import filetopc from './filetopc' //移动端传附件到PC端
import MyInvoices from './my-invoices' //我的发票

import employee_repayment from './employee_repayment'
import payable_reimbursement from './payable_reimbursement'

export default [
	{
		path: '/',
		component: lazyLoad('components/index'),
		children: [
			{
				path: '',
				component: lazyLoad('views/login/home'),
			},
			HomeRouter,
			RedirectRouter,

			employeeReimburseRouter,
			employeeLoan,
			DoneRouter,
			CompletedRouter,
			TodoRouter,
			DraftRouter,

			MyInvoices,
			MyDelegate,
			filetopc,
			// infomationChartRouter,
			// 提单

			// 纯审批
			employee_repayment,
			payable_reimbursement,
			{
				path: '/nonOperatingPayables/:id',
				component: sync('views/nonOperatingPayables/main')
			},
			{
				path: '/nonOperatingPrepayment/:id',
				component: sync('views/nonOperatingPrepayment/main')
			},
			{
				path: '/signature',
				component: sync('views/signature/index'),
				children: [
					{
						//默认首页
						path: '',
						component: sync('views/signature/index'),
						meta: { bizType: 'signature' },
					},
				],
			},
		],
	},
	LoginRouter,
]
