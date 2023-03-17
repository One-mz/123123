import sync from '@/lazyload'

// 员工还款
const router = {
    path: '/payable_reimbursement/:id',
    component: sync('views/payable_reimbursement/main')
}

export default router
