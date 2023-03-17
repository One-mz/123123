<template>
<div>
  <div  v-for=" (item, index) in loanUnOffSetJson" :key='index' style="margin-bottom: 10px;">
  <van-cell-group :title="'借款单号' + item.loanFormNo">
    <van-field  input-align="right" label="借款日期"  v-model="item.loanDate" readonly />
    <van-currency-input  title="借款金额" :precision="2" v-model="item.loanAmount" readonly />
    <van-currency-input  title="已核销金额" :precision="2" v-model="item.chargedAmount" readonly />
    <van-currency-input  title="已占用金额" :precision="2" v-model="item.occupancyAmount" readonly />
    <van-currency-input  title="可用金额" :precision="2" v-model="item.availableBalance" readonly />
  </van-cell-group>
  </div>
</div>
</template>

<script>

import { mapGetters } from 'vuex'

export default {
	name: 'arrearsInfo',
  props:{
    loanUnOffSetJson: {
      type: Array,
      default: () => []
    }
  },
	data() {
		return {
			arrearsInfoList: [],

      from: {} ,
      unoffsetAmount:''
		}
	},
  watch: {
	  'formData': function () {
        this.from = {...this.formData}
    },
  },
  computed:{
    ...mapGetters(['departInfo']),
  },
  mounted() {

  },
	methods: {

  },
}
</script>
