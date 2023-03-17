<template>
  <div class="main-other-apply">
    <van-tabs v-model="active" animated>
      <van-tab :title="$t('common.title.essentialInfo')" name="BasicInfo">
        <BasicInfo ref="BasicInfo" :formData="formData"></BasicInfo>
      </van-tab>
      <van-tab :title="$t('common.title.expenseDetails')" name="ExpenseDetail">
        <ExpenseDetail ref="ExpenseDetail" :payDetailSetJson="payDetailSetJson"></ExpenseDetail>
      </van-tab>
      <van-tab :title="$t('common.title.preOffset')" name="prepayOffset">
        <PrepayOffset ref="prepayOffset" :payOffsetSetJson="payOffsetSetJson"></PrepayOffset>
      </van-tab>
      <van-tab :title="$t('common.title.paymentList')" name="payList">
        <PayList ref="payList" :payListSetJson="payListSetJson" :labelList="PaylabelList"></PayList>
      </van-tab>
      <van-tab
        title="流程履历"
        v-if="!!(this.$store.state.taskVars.bpmFormMain?
         this.$store.state.taskVars.bpmFormMain.procInstId:
          '')"
        name="bpmFlowSteps"
      >
        <bpmFlowSteps ref="bpmFlowSteps"></bpmFlowSteps>
      </van-tab>
      <van-tab title="附件查看" name="AttachmentInfo">
        <UploadAttachment></UploadAttachment>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import flowMixin from 'components/mixins/set-flow-mixin'
import BasicInfo from './base-info'
import ExpenseDetail from './expense_detail'
import PrepayOffset from './prepay_offset'
import UploadAttachment from 'components/common/upload-attachment.vue'
import bpmFlowSteps from 'components/common/bpm-flowsteps'
import PayList from 'components/common/pay_list.vue'

export default {
	name: 'main',
	mixins: [flowMixin],
  components: {
    BasicInfo,
    ExpenseDetail,
    UploadAttachment,
    bpmFlowSteps,
    PrepayOffset,
    PayList
  },
	data() {
		return {
      formData: {},
      passingFileList: {},
      active: '',
      payDetailSetJson: [],
      payOffsetSetJson: [],
      payListSetJson: [],
      PaylabelList: [
        { label: this.$t('common.formLabel.payWay'), prop: 'payWay' },
        { label: this.$t('common.formLabel.impBankName'), prop: 'impBankName' },
        { label: this.$t('common.formLabel.impBankAddr'), prop: 'impBankAddr' },
        { label: this.$t('common.formLabel.impBankAccount'), prop: 'impBankAccount' },
        { label: '本次申请付款金额', prop: 'payAmount', type: 'Amount' },
        { label: '申请付款日期', prop: 'appPayDate', type: 'Date' },
        { label: '支付状态名称', prop: 'paymentStatusName' }
      ]
		}
	},
	mounted() {
    this.$watch('bizObjectData', {
      immediate: true,
      handler(val = {}) {
        this.formData = {
          ...this.formData,
          ...val
        }
        this.payDetailSetJson = val.payDetailSetJson ? JSON.parse(val.payDetailSetJson) : []
        this.payOffsetSetJson = val.payOffsetSetJson ? JSON.parse(val.payOffsetSetJson) : []
        this.payListSetJson = val.payListSetJson ? JSON.parse(val.payListSetJson) : []
      }
    })
	},
	methods: {
	},
	computed: {
		isDraftActivity() {
			if(!this.$store.state.taskVars.bpmFormMain) return true
			const {
				currentTaskDefKey = '',
				formStatus = ''
			} = this.$store.state.taskVars.bpmFormMain;
			return (formStatus == '草稿' || currentTaskDefKey == 'DraftActivity')
		},
	}
}
</script>
<style lang="less" scoped>
.loan {
	padding-bottom: 4rem;
}
</style>
