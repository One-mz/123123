import lazyLoad from '../../lazyload.js'
const router = {
	path:'/todo',
	component:lazyLoad('views/todo/main')
}

export default router
