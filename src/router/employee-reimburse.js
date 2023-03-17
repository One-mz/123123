import sync from '@/lazyload'

// 员工报销
const router = {
    path: '/employee_reimburse/:id',
    component: sync('views/employee_reimburse/main'),
    children: [
        {
            //默认首页
            path: '',
            component: sync('views/employee_reimburse/base-info'),
            meta: { bizType: 'EmployeeExpenseReimbursement' },
        },
        {
            //基本信息
            path: 'baseInfo',
            component: sync('views/employee_reimburse/base-info'),
            meta: { bizType: 'EmployeeExpenseReimbursement' },
        },
        {
            //成本费用分摊
            path: 'costShare',
            component: sync('views/employee_reimburse/cost-share'),
            meta: { bizType: 'EmployeeExpenseReimbursement' },
        },

            // 新增费用
        {
            path: 'add',
            component: sync('views/employee_reimburse/cost_share/add/index'),
            meta: { bizType: 'EmployeeExpenseReimbursement' },
        },

        {
            //借款核销
            path: 'loanVerification',
            component: sync(
                'views/employee_reimburse/loan_verification/loan-verification',
            ),
            meta: { bizType: 'EmployeeExpenseReimbursement' },
        },

        {
            //收款信息
            path: 'receiveInfo',
            component: sync(
                'views/employee_reimburse/receive-info',
            ),
            meta: { bizType: 'EmployeeExpenseReimbursement' },
        },
        {
            //流程履历
            path: 'flowsteps',
            component: sync('views/employee_reimburse/flowsteps'),
            meta: { bizType: 'EmployeeExpenseReimbursement' },
        },
        {
            //附件信息
            path: 'attachmentInfo',
            component: sync(
                'views/employee_reimburse/attachment-info',
            ),
            meta: { bizType: 'EmployeeExpenseReimbursement' },
        },
    ],
}

export default router
