import sync from '@/lazyload'

// 我的委托
const router = {
	path: '/myDelegate',
	component: sync('components/my-delegate/main'),
	children: [
		{
			//委托列表
			path: '/delegateList',
			name:'delegateList',
			component: sync('components/my-delegate/delegate-list/delegate-list'),
			// meta: { bizType: 'EmployeeBorrow' },
        },
        {
            //添加委托
            path: '/addDelegate',
            name: 'addDelegate',
            component: sync('components/my-delegate/add-delegate/add-delegate'),
        }
	],
}

export default router
