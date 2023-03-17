import sync from '@/lazyload'

const router = {
	path: '/draft', // 我的申请
	component: sync('components/draft/main'),
}

export default router
