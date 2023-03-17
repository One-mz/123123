import sync from '@/lazyload'

// 移动端上传附件到PC端
const router = {
	path: '/filetopc',
	component: sync('components/filetopc/filetopc'),
}

export default router
