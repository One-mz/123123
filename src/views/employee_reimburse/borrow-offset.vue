<template>
  <div>
<!--    <van-cell-group inset>-->
<!--      <van-currency-input style='color:red;font-weight:700' label="未核销金额合计" :precision="2" :value="totalAmount.toFixed(2)" readonly />-->
<!--      <van-currency-input style='color:red;font-weight:700' label="还款金额合计" :precision="2" :value="totalRepaymentAmount.toFixed(2)" readonly />-->
<!--    </van-cell-group>-->
    <van-cell-group v-for=" (item, index) in ecLoanOffSetJson" :key='index' inset border>
      <van-field label="借款单号" v-model="item.loanFormNo" input-align="right" readonly></van-field>
      <VanDateTime label="借款日期" v-model="item.loanDate" disabled></VanDateTime>
      <van-currency-input label="借款金额" v-model="item.loanAmount" :precision="2" readonly></van-currency-input>
      <van-currency-input label="已核销金额" v-model="item.chargedAmount" :precision="2" readonly></van-currency-input>
      <van-currency-input label="已占用金额" v-model="item.occupancyAmount" :precision="2" readonly></van-currency-input>
      <van-currency-input label="可用金额" v-model="item.availableBalance" :precision="2" readonly></van-currency-input>
      <van-currency-input label="本次核销金额" v-model="item.currentChargedAmount" :precision="2" readonly></van-currency-input>
    </van-cell-group>
  </div>
</template>

<script>
  export default{
    components:{},
    props: {
      ecLoanOffSetJson: {
        type: Array,
        default: () => []
      }
    },
    data(){
      return{}
    },
    computed: {
      // requestId: function () {
      //   return this.$route.params.id
      // },
      totalAmount() {
        return this.toFixed(this.$lodash.sumBy(this.ecLoanOffSetJson, o => Number(o.availableBalance)))
      },
      totalRepaymentAmount() {
        return this.toFixed(this.$lodash.sumBy(this.ecLoanOffSetJson, o => Number(o.repaymentAmount)))
      }
    },
    mounted() {
    }

  }
</script>

<style>
</style>
