<template>
<div>
    <div>
        <cell :title="$t('common.messagebox.remind')" v-if="invoiceWarning">
            {{invoiceWarning}}
            <icon type="warn"></icon>
        </cell>
    </div>

    <common-head ref='common-head' />

    <van-cell-group inset :title="$t('common.title.essentialInfo')">
<!--      <van-field  v-model="request.eecFormNo" :precision="2"  :readonly="readOnly" label="报账单编号" input-align="right"/>-->
      <van-field  v-model="request.expenseDate" :precision="2"  :readonly="readOnly" label="报账日期" input-align="right"/>
      <van-field  v-model="request.expensePersonName"  :readonly="readOnly" label="报销人名称" input-align="right"/>
      <van-field  v-model="request.expenseDeptName"  :readonly="readOnly" label="成本中心" input-align="right"/>
      <van-field  v-model="request.budgetTypeEnumId"  :readonly="readOnly" label="预算表项" input-align="right"/>
      <van-field  v-model="request.budgetTypeEnumName"  :readonly="readOnly" label="预算类别名称" input-align="right"/>
      <van-field  v-model="request.expenseAmount"  :readonly="readOnly" label="报账金额" input-align="right"/>
      <van-field  v-model="request.bigBizName"  :readonly="readOnly" label="业务大类" input-align="right"/>
      <van-field  v-model="request.cashFlowMarkEnumName" :readonly="readOnly" label="现金流量标识" input-align="right"/>
      <van-field  v-model="request.currencyTypeEnumId" :readonly="readOnly" label="币种" input-align="right"/>
      <van-field  v-model="request.rate"  :readonly="readOnly" label="汇率" input-align="right"/>
      <van-field  v-model="request.isPreAudit=== '1' ? '是' : '否'"  :readonly="readOnly" label="是否预审批" input-align="right"/>
      <van-field  v-model="request.preAuditorName"   :readonly="readOnly" label="预审批人" input-align="right"/>
      <van-field  v-model="request.applyNoOA"   :readonly="readOnly" label="OA申请单号" input-align="right"/>
      <van-field  v-model="request.statusName"  :readonly="readOnly" label="状态" input-align="right"/>
      <van-field rows="3"  maxlength="256"  type="textarea"  v-model="request.remarks"  :readonly="readOnly" label="摘要" input-align="right"/>
    </van-cell-group>

	</div>
</template>
<script>
import { mapGetters, mapState } from 'vuex'
import {
    Icon,
    TransferDom,
} from 'vux'

import CommonHead from 'components/common/common-head.vue'
import BpmDropdown from 'components/common/bpm-dropdown.vue'
import BpmSelector from 'components/common/bpm-selector.vue'

import BpmApplyFormNoSelector from 'components/common/bpm-selector-apply.vue'


import mixin from './mixin'

export default {
    name: 'base-info',
    mixins: [mixin],
    directives: {
        TransferDom,
    },
    components: {
        CommonHead,
        BpmDropdown,
        BpmSelector,
        Icon,
        BpmApplyFormNoSelector,
    },
    props: {
		formData: {
			type: Object,
			require: true,
		},
	},
    data() {
        return {
          booleanOptions: [
            { label: '是', value: true },
            { label: '否', value: false }
          ],
          invoiceWarning:'',
          request:{
            expenseDate:'',
            expensePersonName:'',
            expenseDeptName:'',
            budgetTypeEnumId:'',
            budgetTypeEnumName:'',
            expenseAmount:'',
            bigBizName:'',
            cashFlowMarkEnumName:'',
            currencyTypeEnumId:'',
            rate:'',
            isPreAudit:'',
            preAuditorName:'',
            applyNoOA:'',
            statusName:'',
            remarks:''
          },
        }
    },
    computed: {
        ...mapGetters(['departInfo', 'userInfo','optObj']),
        ...mapState({
            bpmInfo: (state) => state.bpmInfo,
            readOnly: (state) => state.readOnly,
            amountTotal: state => state.employeeReimburse.amountTotal,
            // 本次核销金额
            currentOffsetAmount: state => state.employeeReimburse.submitData.currentOffsetAmount,
        }),
      editData() {
        return {
          ...this.formData
        }
      },
        requestId() {
            return this.$route.params.id
        },

        applicationVarsParams() {
            const self = this
          console.log(self.userInfo)
            return {
              APPLY_CATEGORY_CODE_EQ:'otherApply',
              ORG_ROOT_CODE_EQ:self.optObj.orgRootCode,
              emailAddress:self.userInfo.emailAddress
               // APPLY_USER_ID_EQ: self.userInfo.userId,
               // BIZ_TYPE_EQ: 'OtherApply'
            }
        },

        shortCode() {
            return this.request.applyFormNo ? this.getFormNoShortCode(this.request.applyFormNo) : ''
        },

        applyInfoKey() {
            return this.applyCategoryNameMap[this.shortCode] && this.applyCategoryNameMap[this.shortCode].prop
        },
        // 收付款区块，是否展示
        isShowIncomeAndPay() {
        return this.request.payAmount != 0
        },
    },
    watch: {
      '$store.state.bizObjectData': function (val) {
        this.bizObjectData=val
        this.request = this.$lodash.assign(this.request, this.bizObjectData);
      },

      'request.currencyTypeCode': {
        async handler(val) {
          this.$EventBus.$emit('changeCurrencyTypeCode', val)
        }
      },
    },
    created() {

    },

    updated() {

    },

  mounted() {
    this.$watch('editData', {
      deep: true,
      immediate: true,
      handler(val = {}) {
        this.request = {
          ...this.request,
          ...val
        }
      }
    })

  },
    methods: {
      getUpdated(){
        this.request = this.$lodash.assign(
          this.request,
          this.submitData,
          {
            claimTypeCode: this.request.claimTypeCode, //报销类型代码
            claimTypeName: this.request.claimTypeName, //报销类型

            claimDepartmentCode: this.request.claimDepartmentCode,  // 报销部门code
            claimDepartmentName: this.request.claimDepartmentName, // 报销部门
            claimPersonName: this.request.claimPersonName, // 报销费用人
            claimPersonCode: this.request.claimPersonCode, // 报销费用人code
            currencyTypeCode:this.request.currencyTypeCode,

            internalOrder: this.request.internalOrder, //内部订单
            extraInfo: this.request.extraInfo, //基建名称/WBS名称
            claimAmount: this.request.claimAmount, //报销总额
            invoiceAmount: this.request.invoiceAmount, //发票总额
            currentOffsetAmount: this.request.currentOffsetAmount, //本次核销总额
            payAmount: this.request.payAmount, //支付金额
            instruction: this.request.instruction, //备注
            paymentInstruction: this.request.paymentInstruction, //付款信息
          }
        );
        this.$store.commit('employeeReimburse/mergeRequest', {
          request: this.request,
        })
      },

        openDetail() {
            this.show = true
        },

        // 根据单号，获取流程简码
        getFormNoShortCode(formNo) {
            // ! 由于公司编码有 3位，也有4位，采取不同的方式
            let startIndex = 0
            if (formNo.length === 20) {
                startIndex = 4
            } else if (formNo.length === 19) {
                startIndex = 3
            }

            const shortCode = formNo.slice(startIndex).replace(/[0-9]/gi, '');
            return shortCode;
        },

        onChangeDeparment(key) {
          if (key) {
            if (this.departmentArrOrign) {
                this.departmentArr = !this.departmentArr.length ? this.departmentArrOrign.map(item => item.userName) : this.departmentArr
                const obj = this.departmentArrOrign.length && this.departmentArrOrign.filter(item => item.departName === key)[0]
                this.request.claimDepartmentCode = obj.departCode || this.request.claimDepartmentCode
            } else {
                this.departmentArr = [this.request.claimDepartmentName]
            }
            this.request.claimDepartmentName = key
          }
        },
        
      doSubmit(action) {
        return new Promise((resolve, reject) => {
          if (action == 'save') return resolve(this.formData)
          return resolve(this.request)
        })
      },
    },
}
</script>
