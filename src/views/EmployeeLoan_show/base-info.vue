<template>
<div>
	<common-head ref='common-head'/>
	<van-cell-group inset :title="$t('common.title.essentialInfo')">
    <van-field input-align="right" label="借款单编号" v-model="baseInfo.loanFormNo" readonly />
    <van-field input-align="right" label="借款日期" v-model="baseInfo.loanDate" readonly />
    <van-field input-align="right" label="借款人名称" v-model="baseInfo.loanUserName" readonly />
    <van-field input-align="right" label="成本中心" v-model="baseInfo.loanDeptName" readonly />
    <van-field input-align="right" label="项目编码" v-model="baseInfo.prjId" readonly />
    <van-field input-align="right" label="项目名称" v-model="baseInfo.prjName" readonly />
    <van-field input-align="right" label="借款金额" v-model="baseInfo.loanAmount" readonly />
    <van-field input-align="right" label="业务大类" v-model="baseInfo.bigBizName" readonly />
    <van-field input-align="right" label="现金流量标识" v-model="baseInfo.cashFlowMarkEnumName" readonly />
    <van-field input-align="right" label="币种" v-model="baseInfo.currencyTypeEnumId" readonly />
    <van-field input-align="right" label="汇率" v-model="baseInfo.rate" readonly />
    <van-field input-align="right" label="GL日期" v-model="baseInfo.glDate" readonly />
    <van-field input-align="right" label="是否预审批" v-model="baseInfo.isPreAudit=== '1' ? '是' : '否'" readonly />
    <van-field input-align="right" label="备注" v-model="baseInfo.remarks" readonly />
	</van-cell-group>
</div>
</template>

<script>
import CommonHead from 'components/common/common-head.vue'
import {
	XInput,
	Group,
} from 'vux'


export default {
	name: 'base-info',
  components: {
		XInput,
		Group,
		CommonHead,
	},
  props:['formData'],
	data() {
		return {
			baseInfo: {
        loanFormNo: '',
        loanDate: '',
        loanUserName: '',
        loanDeptName:'',
        prjId:'',
        prjName:'',
        loanAmount:'',
        bigBizName:'',
        cashFlowMarkEnumName:'',
        currencyTypeEnumId:'',
        rate:'',
        glDate:'',
        isPreAudit:'',
        remarks:'',
			},

		}
	},
  watch: {
	  'formData': function () {
        this.baseInfo = {...this.baseInfo, ...this.formData}
    },
  },
  computed:{},
	methods: {},
  mounted() {
    this.baseInfo = {...this.baseInfo, ...this.formData}
  },
}
</script>
