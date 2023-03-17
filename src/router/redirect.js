import sync from '@/lazyload'

const router = {
	path: '/flow/:formNo/:bizType',
	name:'flow',
	component: sync('components/common/flow'),
}

export default router
