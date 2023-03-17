<template>
  <div class="loan">
      <van-tabs v-model="active" animated>
        <van-tab :title="$t('common.title.essentialInfo')" name="BaseInfo">
          <BaseInfo ref="BaseInfo" :formData="formData"/>
        </van-tab>

        <van-tab
          title="未核销借款"
          name="arrearsInfo">
          <arrearsInfo ref="arrearsInfo" :loanUnOffSetJson="loanUnOffSetJson"/>
        </van-tab>

        <van-tab :title="$t('common.title.paymentList')" name="incomeAndPay">
          <PayList ref="payList" :payListSetJson="loanPayListSetJson" :labelList="PaylabelList"></PayList>

        </van-tab>

        <van-tab :title="$t('bpm.desc.processHistory')" name="bpmFlowSteps">
          <bpmFlowSteps ref="bpmFlowSteps"></bpmFlowSteps>
        </van-tab>

        <van-tab :title="$t('bpm.desc.appendixView')" name="AttachmentInfo">
          <UploadAttachment></UploadAttachment>
        </van-tab>
      </van-tabs>
    </div>
</template>

<script>
  import _ from 'lodash'
  import flowMixin from '@/mixins/set-flow-mixin'
  import availableFlows from 'config/available-flow'
  import BaseInfo from './base-info.vue'
  import arrearsInfo from './arrearsInfo.vue'
  import UploadAttachment from 'components/common/upload-attachment.vue'
  import bpmFlowSteps from 'components/common/bpm-flowsteps'
  import PayList from 'components/common/pay_list.vue'

  import {
    mapState
  } from 'vuex';


  export default {
    name: 'main',
    mixins: [flowMixin],
    components: {
      BaseInfo,
      arrearsInfo,
      UploadAttachment,
      bpmFlowSteps,
      PayList
    },
    data() {
      return {
        currentStep: 'baseInfo',
        index: 0,
        payListSetJson: [],
        loanPayListSetJson: [],
        loanUnOffSetJson: [],
        active: '',
        formData: {},
        PaylabelList: [
          { label: this.$t('common.formLabel.employeeName'), prop: 'employeeName' },
          { label: this.$t('common.formLabel.employeeCode'), prop: 'employeeCode' },
          { label: this.$t('common.formLabel.littleBizName'), prop: 'littleBizName' },
          { label: this.$t('common.formLabel.payWay'), prop: 'payWay' },
          { label: this.$t('common.formLabel.accountBank'), prop: 'accountBank' },
          { label: this.$t('common.formLabel.accountName'), prop: 'accountName' },
          { label: this.$t('common.formLabel.accountNumber'), prop: 'accountNumber' },
          { label: this.$t('common.formLabel.loanAmounts'), prop: 'loanAmounts', type: 'Amount' }
        ]
      }

    },
    computed: {
      ...mapState({
        readOnly: state => state.readOnly,
        bizType: state => state.currentFlow.bizType,
      }),
      requestId() {
        return this.$route.params.id
      },

      currentFlowConfig() {
        return availableFlows.filter(item => this.bizType === item.bizType)[0];
      },

    },
    created() {

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
          this.loanPayListSetJson = val.loanPayListSetJson ? JSON.parse(val.loanPayListSetJson) : []
          this.loanUnOffSetJson = val.loanUnOffSetJson ? JSON.parse(val.loanUnOffSetJson) : []


        }
      })
    },
    methods: {
      // 审批不修改数据
      getRequest() {
        let finalObj
        finalObj = _.cloneDeep(this.$store.state.taskVars.bizObjectData)

        console.log('finalObj',finalObj)
        return finalObj
      },

      tabClick(url) {
        this.currentStep = url;
        if (this.$refs['router-view'].getData) {
          const temp = this.$refs['router-view'].getData();
          this.formData = {...this.formData, ...temp}
        }
        console.log(this.formData)

        let toUrl = this.currentFlowConfig.link.replace('/new', '/' + this.requestId) + '/' + url;

        this.$router.replace(toUrl)
      },
    },
  }
</script>
<style lang="less" scoped>
  .invoice-icon {
    z-index: 1000;
    position: fixed;
  }


  .loan{
    padding-bottom: 4rem;
  }
</style>
