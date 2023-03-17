import sync from '@/lazyload'

// 差旅报销
const router = {
	path: '/travel-claim2/:id',
	component: sync('views/travel-claim2/claim'),
	children: [
		{
			// 默认首页
			path: '',
			component: sync('views/travel-claim2/travel-claim-basicInfo'),
			meta: { bizType: 'TravelClaim' },
		},
		// 基本信息
		{
			path: 'basic-info',
			component: sync('views/travel-claim2/travel-claim-basicInfo'),
			meta: { bizType: 'TravelClaim' },
		},
    // 出差人及交通工具信息
    {
			path: 'traffic',
			component: sync('views/travel-claim2/traffic'),
			meta: { bizType: 'TravelClaim' },
		},
		// 差旅日历
		{
			path: 'claim-date',
			component: sync('views/travel-claim2/claim-date'),
			meta: { bizType: 'TravelClaim' },
		},
		// 费用明细
		{
			path: 'expense-info',
			component: sync('views/travel-claim2/expense-info/index'),
			meta: { bizType: 'TravelClaim' },
		},
		/**
		 * 费用明细
		 * 城市间交通费
		 * 路由：travel-claim/expense-info?type=transports
		 * 组件：travel-claim/expense-info/cost-breakdown/transport
		 *
		 * 住宿费
		 * 路由：travel-claim/expense-info?type=accommodations
		 * 组件：travel-claim/expense-info/cost-breakdown/accommodations
		 *
		 * 伙食补贴费
		 * 路由：travel-claim/expense-info?type=foods
		 * 组件：travel-claim/expense-info/cost-breakdown/food-support
		 *
		 * 公杂费
		 * 路由：travel-claim/expense-info?type=general
		 * 组件：travel-claim/expense-info/cost-breakdown/general-support
		 *
		 * 其他
		 * 路由：travel-claim/expense-info?type=others
		 * 组件：travel-claim/expense-info/cost-breakdown/other
		 */
		// 新增费用
		{
			path: 'add',
			component: sync('views/travel-claim2/expense-info/add/index'),
			meta: { bizType: 'TravelClaim' },
		},
		/**
		 * 新增费用
		 * 城市间交通费
		 * 路由：travel-claim/new/add?type=transport
		 * 组件：travel-claim/expense-info/add/add-transport-detail
		 *
		 * 住宿费
		 * 路由：travel-claim/new/add?type=accommodations
		 * 组件：travel-claim/expense-info/add/add-accomodation-detail
		 *
		 * 其他
		 * 路由：travel-claim/new/add?type=others
		 * 组件：travel-claim/expense-info/add/add-other-detail
		 */
		// 借款/预付款
		{
			path: 'borrow-offset',
			component: sync('views/travel-claim2/borrow-offset'),
			meta: { bizType: 'TravelClaim' },
		},
    // 账龄信息
    {
      path: 'ledger-offset',
      component: sync('views/travel-claim2/ledger-offset'),
      meta: { bizType: 'TravelClaim' },
    },
		// 收款信息
		{
			path: 'receiver-account',
			component: sync('views/travel-claim2/receiver-account'),
			meta: { bizType: 'TravelClaim' },
		},
		// 流程
		{
			path: 'flowsteps',
			component: sync('views/travel-claim2/flowsteps'),
			meta: { bizType: 'TravelClaim' },
		},
		// 附件信息
		{
			path: 'attachment',
			component: sync('views/travel-claim2/attachment'),
			meta: { bizType: 'TravelClaim' },
		},
	],
}

export default router
