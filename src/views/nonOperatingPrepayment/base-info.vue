<template>
	<div>
		<common-head ref="common-head" />
		<van-cell-group inset :title="$t('bpm.desc.basicInformation')">
      <van-field label="预付申请人" readonly :value="form.expensePersonName" input-align="right"></van-field>
      <van-field label="成本中心" readonly :value="form.expenseDeptName" input-align="right"></van-field>
      <van-field label="项目编码" readonly :value="form.prjId" input-align="right"></van-field>
      <van-field label="项目名称" readonly :value="form.prjName" input-align="right"></van-field>
      <van-field label="业务大类" readonly :value="form.bigBizName" input-align="right"></van-field>
      <van-field label="供应商编码" readonly :value="form.supplierNo" input-align="right"></van-field>
      <van-field label="供应商名称" readonly :value="form.supplierName" input-align="right"></van-field>
      <van-field label="现金流量标识" readonly :value="form.cashFlowMarkEnumId" input-align="right"></van-field>
      <van-currency-input  label="预付金额" :precision="2" v-model="form.prePayAmount" readonly />
      <van-field label="OA申请单号" readonly :value="form.applyNoOA" input-align="right"></van-field>
      <van-field label="资金计划项" readonly :value="form.fundSchemaName" input-align="right"></van-field>
      <van-field label="币种" readonly :value="form.currencyTypeEnumId" input-align="right"></van-field>
      <van-field label="汇率" readonly :value="form.rate" input-align="right"></van-field>
      <VanDateTime label="GL日期" v-model="form.glDate" disabled></VanDateTime>
      <van-field label="是否预审批" readonly :value="form.isPreAudit==true ? '是' : '否'" input-align="right"></van-field>
      <van-field label="预审批人" readonly :value="form.preAuditorName" input-align="right"></van-field>
      <van-field label="备注" readonly type="textarea" :value="form.remarks" input-align="right"></van-field>
		</van-cell-group>
	</div>
</template>

<script>
import CommonHead from 'components/common/common-head.vue'
import { mapGetters, mapState } from 'vuex'
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
		...mapGetters(['taskVars']),
		...mapState({
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
}
</script>
