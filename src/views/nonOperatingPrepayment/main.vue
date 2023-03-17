<template>
  <div class="main-other-apply">
    <van-tabs v-model="active" animated>
      <van-tab :title="$t('common.title.essentialInfo')" name="BasicInfo">
        <BasicInfo ref="BasicInfo" :formData="formData"></BasicInfo>
      </van-tab>
      <van-tab title="未核销预付款" name="prepayOffset">
        <PrepayOffset ref="prepayOffset" :payOffsetSetJson="payOffsetSetJson"></PrepayOffset>
      </van-tab>
      <van-tab :title="$t('common.title.paymentList')" name="payList">
        <PayList ref="payList" :payListSetJson="payListSetJson" :labelList="PaylabelList"></PayList>
      </van-tab>
      <van-tab
        :title="$t('bpm.desc.processHistory')"
        v-if="!!(this.$store.state.taskVars.bpmFormMain?
         this.$store.state.taskVars.bpmFormMain.procInstId:
          '')"
        name="bpmFlowSteps"
      >
        <bpmFlowSteps ref="bpmFlowSteps"></bpmFlowSteps>
      </van-tab>
      <van-tab :title="$t('bpm.desc.appendixView')" name="AttachmentInfo">
        <UploadAttachment></UploadAttachment>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import flowMixin from 'components/mixins/set-flow-mixin'
import BasicInfo from './base-info'
import PrepayOffset from './prepay_offset'
import PayList from 'components/common/pay_list.vue'
import bpmFlowSteps from 'components/common/bpm-flowsteps'
import UploadAttachment from 'components/common/upload-attachment.vue'

export default {
	name: 'main',
	mixins: [flowMixin],
  components: {
    BasicInfo,
    PrepayOffset,
    PayList,
    bpmFlowSteps,
    UploadAttachment
  },
	data() {
		return {
      formData: {},
      active: '',
      payOffsetSetJson: [],
      payListSetJson: [],
      PaylabelList: [
        { label: '业务小类', prop: 'littleBizName' },
        { label: this.$t('common.formLabel.payWay'), prop: 'payWayName' },
        { label: '开票银行', prop: 'accountBank' },
        { label: this.$t('common.formLabel.impBankAccount'), prop: 'impBankAccount' },
        { label: this.$t('common.formLabel.impBankName'), prop: 'impBankName' },
        { label: this.$t('common.formLabel.impBankAddr'), prop: 'impBankAddr' },
        { label: '付款金额', prop: 'payAmount', type: 'Amount' },
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
        this.payOffsetSetJson = val.prePayUnOffSetJson ? JSON.parse(val.prePayUnOffSetJson) : []
        this.payListSetJson = val.prePayListSetJson ? JSON.parse(val.prePayListSetJson) : []
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
