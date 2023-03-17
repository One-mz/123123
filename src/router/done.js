import sync from '@/lazyload'

// 我的办结
const router = {
	path: '/done',
	component: sync('views/done/main'),
}

export default router
