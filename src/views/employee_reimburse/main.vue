<template>
  <!-- 员工费用报销 -->
  <div class="reimburse">
    <!-- 分摊展示的情况下，需要隐藏tab -->
    <van-tabs v-model="active"  animated>
      <van-tab :title="$t('common.title.essentialInfo')">
        <BaseInfo ref="basicInfo" :formData="formData" @changeApplyInfo="changeApplyInfo"></BaseInfo>
      </van-tab>


<!--      <van-tab title="发票信息">-->
<!--        <InvoiceInfo ref="invoiceInfo" :passing-file-list="passingFileList" :formData="formData"></InvoiceInfo>-->
<!--      </van-tab>-->
      <van-tab :title="$t('common.title.expenseDetails')">
        <CostShare ref="consumeReimse" :ecDetailSetJson="ecDetailSetJson"></CostShare>
      </van-tab>

      <van-tab :title="$t('common.title.paymentList')">
        <PayList ref="payList" :payListSetJson="ecPayListJson" :labelList="PaylabelList"></PayList>
      </van-tab>

      <van-tab title="借款核销">
        <borrowOffset ref="borrowOffset" :ecLoanOffSetJson="propsOffsets"></borrowOffset>
      </van-tab>

      <van-tab :title="$t('bpm.desc.processHistory')">
        <bpmFlowSteps :formData="formData"></bpmFlowSteps>
      </van-tab>

      <van-tab :title="$t('bpm.desc.appendixView')">
        <AttachmentInfo :passing-file-list="passingFileList" :formData="formData"></AttachmentInfo>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>

import { mapState } from 'vuex'
import flowMixin from 'components/mixins/set-flow-mixin'
import { validate } from 'utils/functions'
import BaseInfo from './base-info.vue'
import borrowOffset from './borrow-offset'
import AttachmentInfo from './attachment-info.vue'
import ApplyInfo from './apply-info.vue'
import InvoiceInfo from './invoice_info.vue'
import bpmFlowSteps from 'components/common/bpm-flowsteps'
import CostShare from './cost_share/cost-share.vue'
import PayList from 'components/common/pay_list.vue'

export default {
  name: 'main',
  mixins: [flowMixin],
  components: {
    BaseInfo,
    borrowOffset,
    AttachmentInfo,
    InvoiceInfo,
    ApplyInfo,
    bpmFlowSteps,
    CostShare,
    PayList

  },
  data() {
    const paramId = this.$route.params.id
    return {
      tabShow: true,
      currentIndex: 0,
      passingFileList: {},
      paramId,
      active:'',
			formData: {},
      propsOffsets: [],
      ecDetailSetJson:[],
      ecPayListJson:[],
      PaylabelList: [
        { label: this.$t('common.formLabel.employeeName'), prop: 'employeeName' },
        { label: this.$t('common.formLabel.employeeCode'), prop: 'employeeCode' },
        { label: this.$t('common.formLabel.payWay'), prop: 'payWay' },
        { label: this.$t('common.formLabel.accountBank'), prop: 'accountBank' },
        { label: this.$t('common.formLabel.accountName'), prop: 'accountName' },
        { label: this.$t('common.formLabel.accountNumber'), prop: 'accountNumber' },
        { label: this.$t('common.formLabel.loanAmounts'), prop: 'loanAmounts', type: 'Amount' },
        { label: this.$t('common.formLabel.employeeName'), prop: 'paymentStatusName' }
      ]
    }
  },
  computed: {
    ...mapState({
      readOnly: state => state.readOnly,
      submitData: (state) => state.employeeReimburse.submitData,
    }),

    requestId() {
      return this.$route.params.id
    },

    // 收付款区块，是否展示
    isShowIncomeAndPay() {
      return this.submitData.payAmount != 0
    },

 
  },

  watch: {
   
  },
  created() {
  },
  mounted() {
    this.$watch('bizObjectData', {
      immediate: true,
      deep: true,
      handler(val = {}) {
        this.formData = {
          ...val
        }
        const parseJson = (type) => {
         return val[type] ? JSON.parse(val[type]) : []
        }
        this.propsOffsets = parseJson('ecLoanOffSetJson')
        this.ecDetailSetJson = parseJson('ecDetailSetJson')
        this.ecPayListJson = parseJson('ecPayListJson')
      }
    })
  },

  methods: {
    tabClick(index) {
      this.tabShow = false
      this.currentIndex = index

      // this.$router.replace(
      //   '/employeeReimburse/' + this.requestId + '/' + this.steps[index].link,
      // )
    },

    // 提交流程前的校验，status为1继续提交
    beforeRequest() {
      let self = this
      return new Promise(function (resolve, reject) {
        resolve({
          status: 1,
        })
      })
    },

    changeApplyInfo(val){
      this.$set(this.formData,'applyCategoryCode',val.applyCategoryCode)
      this.$set(this.formData,'systemTag',val.systemTag)

        console.log(this.formData)
    },


    validFun(action){
      console.log( this.submitData,' this.submitData')
        const {
          claimAmount, // 报销总额
          payAmount,
          currentOffsetAmount,
          instruction,
          shroffAccount,
          claimDepartmentCode,
          proportions
        } = this.submitData

      let result = 0
        result = proportions.length
          ? proportions
              .map((item) => item.amount)
              .reduce((p1, p2) => Number(p1) + Number(p2), 0)
          : 0
        console.log('result', result)

      if (claimAmount !== result) {
            this.$vux.alert.show({
              content:
                '请验证分摊信息是否正确，分摊金额:' +
                result +
                '与报销金额:' +
                claimAmount +
                '是否相等',
              type: 'warn',
            })
            return
          } else {
            let tempArrs = []
            let flag = false
            proportions.forEach((prop, index) => {
              if (prop['bizRefInvoices'].length == 1) {
                let item = prop['bizRefInvoices'][0]
                item.tempCalAmount = prop.amount
                tempArrs.push(item)
              } else {
                prop['bizRefInvoices'].forEach((item) => {
                  item.tempCalAmount = item.claimAmount
                  tempArrs.push(item)
                })
              }
            })

          }

          let info = this.submitData
          console.log(info)

          let initArr = [
            claimAmount,
            currentOffsetAmount,
            instruction,
            claimDepartmentCode,
            shroffAccount.paymentInstruction,
            shroffAccount.toBankName,
            shroffAccount.toAccount,
          ]

          // 如果不展示 收付款组件，则不校验
          if (!this.isShowIncomeAndPay) {
            initArr = [
              claimAmount,
              currentOffsetAmount,
              instruction,
              claimDepartmentCode,
            ]
          }

          if (payAmount < 0) {
            this.$vux.alert.show({
              content: this.$t('bpm.er.expenseEstimate.message.offsetAmountMoreThanclaimAmount'),
              type: 'warn',
            })
            return false
          }

          // if (
          //   this.submitData['bizRefInvoices'] &&
          //   this.submitData['bizRefInvoices'].length > 500
          // ) {
          //   this.$vux.alert.show({
          //     content: '单张单据录入发票数量不支持超过500，请另外提起单据，谢谢！',
          //     type: 'warn',
          //   })
          //   return false
          // }

          if (validate(initArr)) {
            return this.submitData
          } else {

            if(action !== 'save') {
                if ( this.submitData.proportions.length === 0 ) {
                throw this.$t('bpm.rules.msg.cost')
              } else if (initArr[0] == '0') {
                throw this.$t('bpm.rules.msg.totalMoney')
              } else if (!initArr[2]) {
                  throw this.$t('bpm.rules.msg.remarks')
              } else if (!initArr[3]) {
                throw this.$t('bpm.rules.msg.depart')
              }  else if (!initArr[5]) {
                throw this.$t('bpm.rules.msg.bank')
              } else if (!initArr[6]) {
                throw this.$t('bpm.rules.msg.account')
              }
            }
            return initArr
          }
    },


    /**
     获得页面的request
     */
    doSubmit(action) {
      // console.log(this.validFun(action))
      // return

      const submitArr = [
        this.$refs.basicInfo.doSubmit(action)
      ]
      if (this.formData.systemTag==='FSSP' && this.formData.applyCategoryCode==='CommunicationFees') {
        submitArr.push(this.$refs.applyInfo.doSubmit(action))
      }

       submitArr.push(this.$refs.consumeReimse.doSubmit(action))
       submitArr.push(this.$refs.borrowOffset.doSubmit(action))


      if (this.isShowIncomeAndPay) {
        submitArr.push(this.$refs.incomeAndPayMultiple.doSubmit(action))
      } else {
        submitArr.push(new Promise((resolve, reject) => {
          resolve({
            shroffAccountList: []
          })
        }))
      }

      // if (this.isAccountingStepShow) {
      //   submitArr.push(this.$refs.accountingList.doSubmit())
      // }
      console.log(submitArr,'submitArr')
      return Promise.all(submitArr).then((res) => {
        console.log([this.formData, ...res])
        return [this.formData, ...res]
      })
    },

    async getRequest(action) {
      const res = await this.doSubmit(action)
      console.log(res)
      let result = res.reduce((before, current) => {
        return {
          ...before,
          ...current,
        }
      }, {})
      console.log('this.formData :>> ', this.formData);
      return {
        ...this.formData,
        ...result
      }
    },

    // 获取提交数据
    // getRequest(action) {
    //   this.submitData.shroffAccount = this.$store.state.shroffAccount;
    //   this.submitData.shroffAccount.payApplyAmount = this.submitData.payAmount
    //
    //   const {
    //     claimAmount, // 报销总额
    //     payAmount,
    //     currentOffsetAmount,
    //     instruction,
    //     shroffAccount,
    //     claimDepartmentCode,
    //   } = this.submitData
    //
    //   const { proportions } = this.submitData
    //   let result = 0
    //   result = proportions.length
    //     ? proportions
    //         .map((item) => item.amount)
    //         .reduce((p1, p2) => Number(p1) + Number(p2), 0)
    //     : 0
    //   console.log('result', result)
    //
    //
    //   if (claimAmount !== result) {
    //     this.$vux.alert.show({
    //       content:
    //         '请验证分摊信息是否正确，分摊金额:' +
    //         result +
    //         '与报销金额:' +
    //         claimAmount +
    //         '是否相等',
    //       type: 'warn',
    //     })
    //     return
    //   } else {
    //     let tempArrs = []
    //     let flag = false
    //     proportions.forEach((prop, index) => {
    //       if (prop['bizRefInvoices'].length == 1) {
    //         let item = prop['bizRefInvoices'][0]
    //         item.tempCalAmount = prop.amount
    //         tempArrs.push(item)
    //       } else {
    //         prop['bizRefInvoices'].forEach((item) => {
    //           item.tempCalAmount = item.claimAmount
    //           tempArrs.push(item)
    //         })
    //       }
    //     })
    //
    //   }
    //
    //   let info = this.submitData
    //   console.log(info)
    //
    //   let initArr = [
    //     claimAmount,
    //     currentOffsetAmount,
    //     instruction,
    //     claimDepartmentCode,
    //     shroffAccount.paymentInstruction,
    //     shroffAccount.toBankName,
    //     shroffAccount.toAccount,
    //   ]
    //
    //   // 如果不展示 收付款组件，则不校验
    //   if (!this.isShowIncomeAndPay) {
    //     initArr = [
    //       claimAmount,
    //       currentOffsetAmount,
    //       instruction,
    //       claimDepartmentCode,
    //     ]
    //   }
    //
    //   if (payAmount < 0) {
    //     this.$vux.alert.show({
    //       content: '核销金额应不大于报销金额',
    //       type: 'warn',
    //     })
    //     return false
    //   }
    //
    //   if (
    //     this.submitData['bizRefInvoices'] &&
    //     this.submitData['bizRefInvoices'].length > 500
    //   ) {
    //     this.$vux.alert.show({
    //       content: '单张单据录入发票数量不支持超过500，请另外提起单据，谢谢！',
    //       type: 'warn',
    //     })
    //     return false
    //   }
    //
    //   if (validate(initArr)) {
    //     return this.submitData
    //   } else {
    //     if(action !== 'save') {
    //         if ( this.submitData.proportions.length === 0 ) {
    //         throw '费用分摊未填'
    //       } else if (initArr[0] == '0') {
    //         throw '报销总额为0'
    //       } else if (!initArr[2]) {
    //         throw '报销说明未填'
    //       } else if (!initArr[3]) {
    //         throw '报销部门未填'
    //       } else if (!initArr[4]) {
    //         throw '转账摘要未填'
    //       } else if (!initArr[5]) {
    //         throw '收款银行未填'
    //       } else if (!initArr[6]) {
    //         throw '收款账户未填'
    //       }
    //     }
    //     return initArr
    //   }
    // },

  },
}
</script>


