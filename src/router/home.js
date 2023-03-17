import sync from '@/lazyload'

// 主页
const router = {
  path: '/home',
  component: sync('views/login/home'),
}

export default router
