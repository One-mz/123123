<template>
  <div>
    <van-cell-group inset>
      <van-currency-input style='color:red;font-weight:700' label="合计含税金额" :precision="2" :value="totalAmount.toFixed(2)" readonly />
      <van-currency-input style='color:red;font-weight:700' label="合计税额" :precision="2" :value="totalTaxAmount.toFixed(2)" readonly />
    </van-cell-group>
    <van-cell-group v-for=" (item, index) in payDetailSetJson" :key='index' inset border>
      <van-field label="业务小类" v-model="item.littleBizName" input-align="right" readonly></van-field>
      <van-currency-input label="含税金额" v-model="item.taxAmount" :precision="2" readonly></van-currency-input>
      <van-field label="会计科目" v-model="item.accountTitle" input-align="right" readonly></van-field>
      <van-field label="会计科目说明" v-model="item.accountTitleDesc" input-align="right" readonly></van-field>
      <van-field label="费用内容描述" v-model="item.description" input-align="right" readonly></van-field>
      <van-currency-input label="税额" v-model="item.tax" :precision="2" readonly></van-currency-input>
      <van-field label="税率" v-model="item.taxRate" input-align="right" readonly></van-field>
      <van-currency-input label="明细数量" v-model="item.attribute1" :precision="0" readonly></van-currency-input>
      <van-field label="备注" v-model="item.remarks" input-align="right" readonly></van-field>
    </van-cell-group>
  </div>
</template>

<script>
  export default{
    components:{},
    props: {
      payDetailSetJson: {
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
        return this.toFixed(this.$lodash.sumBy(this.payDetailSetJson, o => Number(o.operatorPhoneNo)))
      },
      totalTaxAmount() {
        return this.toFixed(this.$lodash.sumBy(this.payDetailSetJson, o => Number(o.tax)))
      }
    },
    mounted() {
    }

  }
</script>

<style>
</style>
