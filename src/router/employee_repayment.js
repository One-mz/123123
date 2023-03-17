import sync from '@/lazyload'

// 员工还款
const router = {
    path: '/employee_repayment/:id',
    component: sync('views/employee_repayment/main')
}

export default router
