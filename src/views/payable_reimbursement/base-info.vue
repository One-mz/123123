<template>
	<div>
		<common-head ref="common-head" />
		<van-cell-group inset :title="$t('bpm.desc.basicInformation')">
      <van-field label="报销人名称" readonly :value="form.expensePersonName" input-align="right"></van-field>
      <van-field label="成本中心" readonly :value="form.expenseDeptName" input-align="right"></van-field>
      <van-field label="供应商编号" readonly :value="form.supplierNo" input-align="right"></van-field>
      <van-field label="供应商名称" readonly :value="form.supplierName" input-align="right"></van-field>
      <van-field label="预算表项" readonly :value="form.budgetTypeEnumId" input-align="right"></van-field>
      <van-field label="预算表项名称" readonly :value="form.budgetTypeEnumName" input-align="right"></van-field>
      <van-field label="业务大类" readonly :value="form.bigBizName" input-align="right"></van-field>
      <van-field label="现金流量标识" readonly :value="form.cashFlowMarkEnumName" input-align="right"></van-field>
      <VanDateTime label="GL日期" v-model="form.glDate" disabled></VanDateTime>
      <van-currency-input  label="报账总金额" :precision="2" v-model="form.expenseAmount" readonly />
      <van-currency-input  label="本次支付金额" :precision="2" v-model="form.currentPayAmount" readonly />
      <van-field label="币种" readonly :value="form.currencyTypeEnumName" input-align="right"></van-field>
      <van-field label="汇率" readonly :value="form.rate" input-align="right"></van-field>
      <van-field label="是否预审批" readonly :value="form.isPreAudit==true ? '是' : '否'" input-align="right"></van-field>
      <van-field label="预审批人" readonly :value="form.preAuditorName" input-align="right"></van-field>
      <van-field label="OA申请单号" readonly :value="form.applyNoOA" input-align="right"></van-field>
      <van-field label="是否分摊" readonly :value="form.canProportion==true ? '是' : '否'" input-align="right"></van-field>
      <!--<van-field label="任务来源" readonly :value="form.currencyTypeEnumId" input-align="right"></van-field>-->
      <van-field label="资金计划项" readonly :value="form.fundSchemaName" input-align="right"></van-field>
      <van-field label="是否特殊银行账户支付" readonly :value="form.attribute1==true ? '是' : '否'" input-align="right"></van-field>
      <!--<van-field label="是否有未核销预付" readonly :value="form.currencyTypeEnumId" input-align="right"></van-field>-->
      <van-field label="付款银行" readonly :value="form.bankAccount" input-align="right"></van-field>
      <!--<van-field label="银行付款说明" readonly :value="form.currencyTypeEnumId" input-align="right"></van-field>-->
      <van-field label="摘要" readonly type="textarea" :value="form.remarks" input-align="right"></van-field>
		</van-cell-group>
	</div>
</template>

<script>
import CommonHead from '../../components/common/common-head.vue'
import { mapGetters, mapState } from 'vuex'
import { getDate } from '@/utils'
export default {
	components: {
		CommonHead,
	},
	data() {
		return {
			form: {}
		}
	},
  props: {
    formData: {
      type: Object,
      require: true,
    },
  },
	watch: {
	},
	computed: {
		...mapGetters(['taskVars', 'userInfo']),
		...mapState({
			bpmInfo: (state) => state.bpmInfo,
			info: (state) => state.employeeRepayment.info,
			formStatus: (state) => state.bizObjectData.formStatus,
			readOnly: (state) => state.readOnly,
		}),
    editData() {
      return {
        ...this.formData
      }
    },
    bpmFormMain() {
      return this.taskVars.bpmFormMain;
    },
    isDraftActivity() {
      if(!this.bpmFormMain) return true
      const {
        currentTaskNodeId = '',
        formStateName = ''
      } = this.bpmFormMain
      return (formStateName == '草稿' || currentTaskNodeId == 'DraftActivity')
    }
	},
	created() {

	},
	mounted() {
    this.$watch('editData', {
      deep: true,
      immediate: true,
      handler(val = {}) {
        this.form = {
          ...this.form,
          ...val
        }
      }
    })

	},
	methods: {},
}
</script>

<style></style>
