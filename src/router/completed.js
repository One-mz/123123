import sync from '@/lazyload'

// 我的已办
const router = {
	path: '/completed',
	component: sync('views/completed/main'),
}

export default router
