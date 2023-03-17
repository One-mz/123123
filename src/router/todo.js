import sync from '@/lazyload'

// 我的代办
const router = {
	path: '/todo',
	component: sync('views/todo/main'),
}

export default router
