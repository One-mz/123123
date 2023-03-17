<template>
	<div>
		<flexbox :gutter="0">
			<flexbox-item>
				<cell title="借款总额" :value="borrowAmountTotal.toFixed(2)"></cell>
			</flexbox-item>
			<flexbox-item>
				<cell
					title="已核销总额"
					:value="alreadyOffsetAmountTotal.toFixed(2)"
				></cell>
			</flexbox-item>
		</flexbox>

		<flexbox :gutter="0">
			<flexbox-item>
				<cell title="已占用金额" :value="occupancyAmount.toFixed(2)"></cell>
			</flexbox-item>
			<flexbox-item>
				<cell title="可用金额" :value="availableBalance.toFixed(2)"></cell>
			</flexbox-item>
		</flexbox>

		<flexbox :gutter="0">
			<flexbox-item>
				<cell title="本次核销" :value="currentOffsetAmount.toFixed(2)"></cell>
			</flexbox-item>
			<flexbox-item> </flexbox-item>
		</flexbox>

		<van-cell-group v-for="(item, index) in request.offsets" :key="index">
			<div slot="title">借款单号{{ item.loanFormNo }}</div>
			<div>
				<van-cell-group inset border>
					<van-field
						input-align="right"
						label="借款日期"
						v-model="item.loanDate"
						:show-clear="false"
						readonly
					></van-field>
					<van-currency-input
						:precision="2"
						label="借款金额"
						v-model="item.loanAmount"
						:show-clear="false"
						readonly
					></van-currency-input>
					<van-currency-input
						:precision="2"
						label="已核销金额"
						v-model="item.chargedAmount"
						:show-clear="false"
						readonly
					></van-currency-input>
					<van-currency-input
						:precision="2"
						label="已占用金额"
						v-model="item.occupancyAmount"
						:show-clear="false"
						readonly
					></van-currency-input>

					<van-currency-input
						:precision="2"
						label="可用金额"
						v-model="item.availableBalance"
						:show-clear="false"
						readonly
					></van-currency-input>

					<van-currency-input
						:precision="2"
						label="本次核销金额"
						v-model="item.currentChargedAmount"
						:show-clear="false"
						readonly
					></van-currency-input>
				</van-cell-group>
			</div>
		</van-cell-group>
		<!-- </x-table> -->
	</div>
</template>

<script>
import httpService from 'components/httpService'
import { Flexbox, FlexboxItem, XInput, XTable, Cell, Group } from 'vux'
import { mapGetters } from 'vuex'
import BpmCurrencyInput from './bpm-currency-input.vue'
export default {
	name: 'loan-verification',
	components: {
		Flexbox,
		FlexboxItem,
		XInput,
		XTable,
		Cell,
		Group,
		BpmCurrencyInput,
	},
	props: {
		showCurrentOffsetAmount: {
			type: Boolean,
			default: true,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		propsOffsets: {
			type: Array,
			default() {
				return []
			},
		},
		refFormNo: {
			type: String,
			default: '',
		},
		borrowEntityCode: {
			type: String,
			default: '',
		},
		companyCode: {
			type: String,
			default: '',
		},
		bizType: String,
	},
	data() {
		return {
			currentIndex: 0,
			request: {
				offsets: [],
			},
		}
	},
	mounted() {
		this._getInitData(this.propsOffsets.length)
	},
	computed: {
		...mapGetters(['userInfo', 'departInfo']),
		borrowAmountTotal() {
			// 借款总额
			return this.getAmountTotalByType('loanAmount')
		},
		alreadyOffsetAmountTotal() {
			// 已销核
			return this.getAmountTotalByType('chargedAmount')
		},
		occupancyAmount() {
			//  已占用金额
			return this.getAmountTotalByType('occupancyAmount')
		},
		availableBalance() {
			// 可用金额
			return this.getAmountTotalByType('availableBalance')
		},
		currentOffsetAmount() {
			// 本次核销
			const currentOffsetAmount = this.getAmountTotalByType('currentChargedAmount')
			this.$emit('setCurrentOffsetAmount', currentOffsetAmount)
			return currentOffsetAmount
		},
	},
	methods: {
		getAmountTotalByType(type) {
			return this.propsOffsets.length > 0
				? this.propsOffsets
						.map((item) => item[type])
						.reduce((p1, p2) => {
							return p1 + p2
						}, 0)
				: 0
		},
		_getInitData(size) {
			if (
				(size > 0 || this.$store.state.readOnly) &&
				this.bizType !== 'BIZ_TYPE_EMPLOYEE_LOAN'
			) {
				this.request.offsets = this.propsOffsets
				this.$emit('setOffsets', this.request.offsets)
			} else {
				this._fetchInitData().then(() => {
					this.$emit('setOffsets', this.request.offsets)
				})
			}
		},
		_fetchInitData() {
			let self = this
			return new Promise((resolve, reject) => {
				httpService(self)
					.borrowOffsetService({
						borrowEntityCode: this.borrowEntityCode,
						refFormNo: this.refFormNo,
						companyCode: this.companyCode
							? this.companyCode
							: self.$store.state.bpmInfo.departInfo.companyCode,
					})
					.then((res) => {
						const { data } = res
						const result = Array.isArray(data)
							? data.map((item) => {
									item.currentOffsetAmount = 0
									item.notOffsetAmount =
										item.borrowAmount -
										item.alreadyOffsetAmount -
										item.onTravelOffset
									return item
							  })
							: []

						// ZJ-ENERGY #12587
						// 员工费用报销-未核销金额为0的单据在核销列表中未过滤不显示
						this.request.offsets = result.filter((e) => e.notOffsetAmount != 0)

						resolve()
					})
					.catch(() => {
						reject()
					})
			})
		},
		onBlur(value, index) {
			const notOffsetAmount = this.request.offsets[index].notOffsetAmount

			if (Number(value) * Number(notOffsetAmount) < 0) {
				this.$vux.toast.show({
					text: '本次核销金额和未核销金额需要都为正数或负数',
					type: 'warn',
				})
				this.request.offsets[index].currentOffsetAmount = 0
			}

			if (Math.abs(Number(value)) > Math.abs(Number(notOffsetAmount))) {
				this.$vux.toast.show({
					text: '本次核销金额应当小于等于未核销金额',
					type: 'warn',
				})
				this.request.offsets[index].currentOffsetAmount = 0
			}

			// if (Number(notOffsetAmount) < 0) {
			//   this.$vux.toast.show({
			//     text: '未核销金额应当大于0',
			//     type: 'warn',
			//   })
			// }

			// if(Number(value) < 0){
			//   this.$vux.toast.show({
			//     text: '本次核销金额应当大于0',
			//     type: 'warn',
			//   })
			//   this.request.offsets[index].currentOffsetAmount = 0;
			// }

			this.$nextTick(() => {
				this.request.offsets[index].currentOffsetReimbCurAmount =
					Number(this.request.offsets[index].currentOffsetAmount) *
					Number(this.request.offsets[index].currentOffsetExRate)
			})
			this.$emit('setOffsets', this.request.offsets)
		},
		check() {},

		doSubmit(action) {
			return new Promise((resolve, reject) => {
				console.log(this.request.offsets, 'this.request.offsets')
				if (action == 'save') {
					return resolve({
						offsets: this.request.offsets || [],
						borrowOffsets: this.request.offsets || [],
					})
				}
				resolve({
					offsets: this.request.offsets || [],
					borrowOffsets: this.request.offsets || [],
				})
				//  }

				// if (this.check()) {
				//   resolve({
				//     offsets: this.borrowList || [],
				//     borrowOffsets: this.borrowList || []
				//   });
				// } else {
				//   reject(new Error('核销信息校验失败'));
				// }
			})
		},
	},
}
</script>

<style>
.vux-table {
	font-size: 14px;
	color: gray;
}

.vux-table td {
	padding-left: 3vh;
}

.vux-x-input.disabled .weui-input {
	-webkit-text-fill-color: black;
}
</style>
