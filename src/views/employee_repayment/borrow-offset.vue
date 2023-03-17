<template>
  <div>
    <van-cell-group inset>
      <van-currency-input style='color:red;font-weight:700' label="未核销金额合计" :precision="2" :value="totalAmount.toFixed(2)" readonly />
      <van-currency-input style='color:red;font-weight:700' label="还款金额合计" :precision="2" :value="totalRepaymentAmount.toFixed(2)" readonly />
    </van-cell-group>
    <van-cell-group v-for=" (item, index) in repaymentDetailSetJson" :key='index' inset border>
      <van-field label="借款单号" v-model="item.loanFormNo" input-align="right" readonly></van-field>
      <van-field label="借款描述" v-model="item.loanDesc" input-align="right" readonly></van-field>
      <van-field label="项目编码" v-model="item.prjId" input-align="right" readonly></van-field>
      <van-field label="项目名称" v-model="item.prjName" input-align="right" readonly></van-field>
      <VanDateTime label="借款日期" v-model="item.loanDate" disabled></VanDateTime>
      <van-currency-input label="借款金额" v-model="item.loanAmount" :precision="2" readonly></van-currency-input>
      <van-currency-input label="已核销金额" v-model="item.chargedAmount" :precision="2" readonly></van-currency-input>
      <van-currency-input label="已占用金额" v-model="item.occupancyAmount" :precision="2" readonly></van-currency-input>
      <van-currency-input label="可用金额" v-model="item.availableBalance" :precision="2" readonly></van-currency-input>
      <van-currency-input label="还款金额" v-model="item.repaymentAmount" :precision="2" readonly></van-currency-input>
    </van-cell-group>
  </div>
</template>

<script>
  export default{
    components:{},
    props: {
      repaymentDetailSetJson: {
        type: Array,
        default: () => []
      }
    },
    data(){
      return{}
    },
    computed: {
      totalAmount() {
        return this.toFixed(this.$lodash.sumBy(this.repaymentDetailSetJson, o => Number(o.availableBalance)))
      },
      totalRepaymentAmount() {
        return this.toFixed(this.$lodash.sumBy(this.repaymentDetailSetJson, o => Number(o.repaymentAmount)))
      }
    },
    mounted() {
    }

  }
</script>

<style>
</style>
