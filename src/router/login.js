import sync from '@/lazyload'

// 登录
const router = {
	path: '/login',
	name:'login',
	component: sync('views/login/index'),
}

export default router
