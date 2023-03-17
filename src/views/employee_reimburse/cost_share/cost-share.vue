<template>
	<div>
		<van-cell-group>
			<div slot="title" v-if="proportions.length">
				{{ $t('common.tab.title.expenseInfo') }}
			</div>
			<div v-for="(item, index) in proportions" :key="index">
				<van-cell-group inset border>
					<van-cell title="开始时间" :value="item.startTime"  />
					<van-cell title="结束时间" :value="item.endTime"  />
					<van-cell title="业务小类" :value="item.littleBizName"  />
					<van-cell title="含税金额" :value="item.operatorPhoneNo"  />
					<van-cell title="会计科目" :value="item.accountTitle"  />
					<van-cell title="费用内容描述" :value="item.description" />
					<van-cell title="税额" :value="item.tax"  />
					<van-cell title="税率" :value="item.taxRate"  />
					<van-cell title="明细数量" :value="item.attribute1"  />
					<van-cell title="备注" :value="item.remarks"  />
				</van-cell-group>
			</div>
		</van-cell-group>
	</div>
</template>

<script>
import { mapState } from 'vuex'
import _ from 'lodash'
import LoanVerification from '../loan_verification/loan-verification.vue'
import {mapGetters} from "vuex";

export default {
	name: 'cost-share',
  props:{
    ecDetailSetJson: {
      type: Array,
      default: () => []
    }
  },
  components: {
    LoanVerification,
	},
  data() {
		return {
      modalData:{
        visible:false,
        title:this.$t('common.button.add'),
        data:{}
      }
		}
	},

	computed: {
    ...mapGetters(['userInfo']),
    ...mapState({
      readOnly: state => state.readOnly,
      bizRefInvoices: state => state.employeeReimburse.submitData.bizRefInvoices,
      //proportions: state => state.employeeReimburse.submitData.proportions,
      //proportions: state => state.bizObjectData.proportions || [],
     // claimPersonCode: state => state.employeeReimburse.claimPersonCode,
    }),
    claimPersonCode(){
      console.log(this.userInfo,'this.userInfo')
      this.claimPersonName=this.userInfo.uersName
      return this.userInfo.id
    },
    proportions(){
      return this.ecDetailSetJson
    },

    // 报账金额 合计
    amountTotal() {
      const data = this.toFixed(_.sumBy(this.proportions, o => Number(o.amount)));
      this.$store.commit('employeeReimburse/amountTotalChange', { amountTotal: data });
      return data;
    },
	},
  watch: {
    amountTotal(val) {
      this.$store.commit('employeeReimburse/amountTotalChange', { amountTotal: val });
    },
  },

  mounted() {

  },
  methods: {
    formatMoney(key){
      if(key === null){
        return '0.00'
      }
    },
    init() {

    },
    onDetailModalSubmit(res){

    },
    // 查看或者编辑
    showDetail(index) {
      // 设定分摊临时数据
			console.log('this.proportions :>> ', this.proportions);
      this.$store.commit('employeeReimburse/setCostShareTemp', {
        key: 'proportions',
        value: {
          ...this.proportions[index],
          // 历史 关联发票
          beforeBizRefInvoices: _.cloneDeep(this.proportions[index].bizRefInvoices)
        },
        index,
      })

      this.addItem(index)
    },



    doSubmitProportions() {
      return new Promise((resolve, reject) => {
        resolve({
          proportions: this.proportions,
          bizRefInvoices:this.bizRefInvoices
        })
        // if (this.check()) {
        //   resolve({
        //     proportions: this.proportions
        //   })
        // } else {
        //   reject(new Error('校验失败'))
        // }
      })
    },
    doSubmit() {
      let submitArr = [this.doSubmitProportions()]
      return new Promise((resolve, reject) => {
        Promise.all(submitArr).then((result) => {
          const params = result.reduce((beforeResult, current) => ({ ...beforeResult, ...current }), {})
          resolve(params)
        }).catch((error) => {
          reject(error)
        })
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.list {
	padding: 10px;
	margin: 0;
}

.item {
	margin: 0;
	border: 1px solid #f1f1f1;
	padding: 0 10px 10px;

	&-wrapper {
		display: flex;
	}

	&-left {
		flex: 1;
	}

	&-right {
		width: 30px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	&-atom {
		font-size: 14px;
		margin-bottom: 5px;
		padding-bottom: 5px;
		display: flex;

		&-left {
			width: 150px;
		}

		&-right {
			flex: 1;
		}
	}
}
</style>
