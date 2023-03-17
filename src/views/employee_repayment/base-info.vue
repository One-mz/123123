<template>
	<div>
		<common-head ref="common-head" />
		<van-cell-group inset :title="$t('bpm.desc.basicInformation')">
      <van-field label="还款人名称" readonly :value="form.repaymentUserName" input-align="right"></van-field>
      <van-field label="成本中心" readonly :value="form.repaymentDeptName" input-align="right"></van-field>
      <van-field label="还款类型" readonly :value="form.bigBizName" input-align="right"></van-field>
      <van-field label="还款方式" readonly :value="form.repaymentWay" input-align="right"></van-field>
      <van-currency-input  label="还款金额" :precision="2" v-model="form.repaymentAmountCount" readonly />
      <van-field label="币种" readonly :value="form.currencyTypeEnumName" input-align="right"></van-field>
      <van-field label="汇率" readonly :value="form.rate" input-align="right"></van-field>
      <!--<van-field label="附件张数" readonly :value="form.currency" input-align="right"></van-field>-->
      <VanDateTime label="GL日期" v-model="form.glDate" disabled></VanDateTime>
      <van-field label="公司银行账号" readonly :value="form.cmpBankAccount" input-align="right"></van-field>
      <van-field label="公司银行名称" readonly :value="form.cmpBankName" input-align="right"></van-field>
      <van-field label="备注" readonly type="textarea" :value="form.remarks" input-align="right"></van-field>
		</van-cell-group>
	</div>
</template>

<script>
import CommonHead from '../../components/common/common-head.vue'
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
	methods: {
	},
}
</script>

<style></style>
