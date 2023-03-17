<template>
  <div class="main-other-apply">
    <van-tabs v-model="active" animated>
      <van-tab :title="$t('common.title.essentialInfo')" name="BasicInfo">
        <BasicInfo ref="BasicInfo" :formData="formData"></BasicInfo>
      </van-tab>
      <van-tab title="未核销借款">
        <borrowOffset ref="borrowOffset" :repaymentDetailSetJson="propsOffsets"></borrowOffset>
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
import UploadAttachment from 'components/common/upload-attachment.vue'
import bpmFlowSteps from 'components/common/bpm-flowsteps'
import borrowOffset from './borrow-offset'

export default {
	name: 'main',
	mixins: [flowMixin],
  components: {
    BasicInfo,
    UploadAttachment,
    bpmFlowSteps,
    borrowOffset
  },
	data() {
		const self = this
		return {
      formData: {},
      passingFileList: {},
      active: '',
      propsOffsets: []
		}
	},
	mounted() {
    this.$watch('bizObjectData', {
      immediate: true,
      handler(val = {}) {
        val = val || {}
        this.formData = {
          ...this.formData,
          ...val
        }
        this.propsOffsets = val.repaymentDetailSetJson ? JSON.parse(val.repaymentDetailSetJson) : []
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
