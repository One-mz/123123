import sync from '@/lazyload'

// 我的发票
const router = {
	path: '/myInvoices',
	component: sync('views/my-invoices/main'),
	children: [
		{
			//发票列表
			path: '/invoicesList/:fromFlow',
			name:'invoicesList',
			component: sync('views/my-invoices/invoices-list/invoices-list'),
			// meta: { bizType: 'EmployeeBorrow' },
		},
	],
}

export default router
