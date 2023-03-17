<template>
  <div>
    <van-cell-group v-for="(item) in payOffsetSetJson" inset border :key="item.id">
      <van-field label="预付单号" v-model="item.prePayNo" input-align="right" readonly></van-field>
      <VanDateTime label="预付日期" v-model="item.prePayDate" disabled></VanDateTime>
      <van-currency-input label="预付款金额" v-model="item.prePayAmount" :precision="2" readonly></van-currency-input>
      <van-currency-input label="已核销金额" v-model="item.chargedAmount" :precision="2" readonly></van-currency-input>
      <van-currency-input label="已占用金额" v-model="item.occupancyAmount" :precision="0" readonly></van-currency-input>
      <van-currency-input label="可用金额" v-model="item.availableBalance" :precision="0" readonly></van-currency-input>
    </van-cell-group>
  </div>
</template>

<script>
  export default{
    components:{},
    props: {
      payOffsetSetJson: {
        type: Array,
        default: () => []
      }
    },
    data(){
      return{}
    },
    computed: {
      totalAmount() {
        return this.toFixed(this.$lodash.sumBy(this.payOffsetSetJson, o => Number(o.currentChargedAmount)))
      }
    },
    mounted() {
    }
  }
</script>

<style>
</style>
