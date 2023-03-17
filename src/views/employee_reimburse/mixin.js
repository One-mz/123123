import { mapState } from 'vuex'

export default {
  data() {
    return {
      request: {
        claimTypeCode: '', //报销类型代码
        claimTypeName: '', //报销类型名称
        claimDepartmentCode: '',  // 报销部门code
        claimDepartmentName: '', // 报销部门
        claimPersonName: '', // 报销费用人
        claimPersonCode: '', // 报销费用人code
        internalOrder: '', //内部订单
        extraInfo: '', //基建名称/WBS名称
        claimAmount: 0, //报销总额
        currentOffsetAmount: 0, //本次核销总额
        payAmount: 0, //支付金额
        instruction: '', //报销说明


        // 事前申请信息
        applyFormNo: '',
        staffApply: 0,
        applyCategoryName: "",
        applyCategoryCode: '',
        applyAmount: 0,
        useDate: "",
        receiptStandardEnumName: "",
        receiptNum: "",
        totalNum: "",


        bizRefInvoices: [], // 发票
        shroffAccount: {}, //收款
      },
    }
  },
  computed: {
    ...mapState({
      submitData: (state) => state.employeeReimburse.submitData,
    }),
  },
  watch: {
    // submitData(val) {
    //   console.log('submitData change', val)
    //   this.request = Object.assign(
    //     this.request,
    //     this.submitData || {},
    //   )
    // },
  },

  created() {
    this.request = Object.assign(
      this.request,
      this.submitData || {},
    )
    console.log('进入当前页面的内容', this.request)
  }
}
