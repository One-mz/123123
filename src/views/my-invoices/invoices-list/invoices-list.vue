<template>
	<div style="padding-bottom: 80px">
		<sticky>
			<div class="invoce-page-header" style="
					border-bottom: 1px solid #555;
					display: flex;
					align-items: center;
				" v-show="$route.params['fromFlow'] != 'true'">

				<van-tabs v-model="active" color="#1871D1" type="card" @click="showAll" style="flex: 1">
					<van-tab title="未使用" :name="0"></van-tab>
					<van-tab title="全部" :name="1"></van-tab>
				</van-tabs>
			</div>
		</sticky>

		<div>
			<div class="invoice-group" v-if="myInvoicesList.length">
				<van-cell-group inset class="invoice" v-for="(invoice, index) in myInvoicesList" :key="index">
					<van-cell>
						<template #title>
							<span>{{ index + 1 }}</span>

						</template>
					</van-cell>
					<van-field input-align="right" readonly label="来源" :value="invoice.invoiceSource"></van-field>
					<van-field input-align="right" readonly label="发票类型"
						:value="getInvoiceTypeName(invoice)">
					</van-field>
					<van-field input-align="right" readonly label="发票代码" :value="invoice.invoiceCode"></van-field>
					<van-field input-align="right" readonly label="发票号码" :value="invoice.invoiceNo"></van-field>
					<VanDateTime label="开票日期" v-model="invoice.invoiceDate" disabled></VanDateTime>
					<VanCurrencyInput input-align="right" readonly label="含税金额" :value="invoice.priceTaxAmount">
					</VanCurrencyInput>
					<van-field input-align="right" readonly label="税率" :value="invoice.taxRate"></van-field>
					<VanCurrencyInput input-align="right" readonly label="税额" :value="invoice.taxAmount">
					</VanCurrencyInput>
					<VanCurrencyInput input-align="right" readonly label="无税金额" :value="invoice.invoiceAmount">
					</VanCurrencyInput>
					<VanDateTime input-align="right" readonly label="录入日期" :value="invoice.createdDateRef">
					</VanDateTime>

					<van-field input-align="right" readonly label="已使用任务号"
						:value="invoice.refFormNo ? invoice.refFormNo : '还未被使用'"></van-field>
					<van-field input-align="right" readonly label="发票描述" :value="invoice.remarks"></van-field>
				</van-cell-group>
			</div>
		</div>
		<div style="padding-bottom: 8vh">
			<div class="load-button" @click.native="loadMorePage()">
				<span v-if="!nextLoading" class="size20">{{ this.loadMore }}</span>
				<spinner v-else type="ios-small" size="30"></spinner>
			</div>
		</div>


	</div>
</template>
<script>
import {
	CheckIcon,
	XButton,
	XTable,
	Sticky,
	Spinner,
	Checklist,
	Flexbox,
	FlexboxItem,
	TransferDom,
	Popup,
	Divider,
	ButtonTab,
	ButtonTabItem,
} from 'vux'
import httpService from 'components/httpService'
export default {
	name: 'my-invoices',
	directives: {
		TransferDom,
	},
	data() {
		return {
			invoiceTypeOptions:[],
			active: 0,
			myInvoicesList: [],
			nextLoading: false,
			pageNo: 1,
			loadMore: '点击加载更多',
			checkedInvoices: [],
			// 适配支持的流程
			// TODO 暂时屏蔽
			flow: [],
			showFlows: false,
			showAllInvoices: 0,
			ifUsed: '查看全部',
			baseLoc: '/mobile-fs',
		}
	},
	components: {
		CheckIcon,
		XButton,
		XTable,
		Sticky,
		Spinner,
		Checklist,
		Flexbox,
		FlexboxItem,
		Popup,
		Divider,
		ButtonTab,
		ButtonTabItem
	},
	mounted() {
		this.getInvoiceType()
		this.initInvoice()
	},
	computed: {

	},
	methods: {
		goBack() {
			this.$router.go(-1)
		},
		detailClick(invoice) {
			this.$router.push({ name: 'invoiceInfo', params: { dataObj: invoice } })
		},
		getInvoiceTypeName(item){
			let invoice = this.invoiceTypeOptions.find(f => f.value === item.invoiceType) || {}
			return invoice.text
		},
		// 获取发票类型
		getInvoiceType() {
			httpService(this)
				.dropDownService({
					vars: {
						enumCode_RIGHTLIKE: "EXPENSE_INVOICE_TYPE_",
						// isActive_EQ: 1,
					},
				})
				.then((res) => {
					this.invoiceTypeOptions = res.data.map((e) => {
						return {
							...e,
							value: e.enumValue,
							text: e.enumCnValue,
						}
					})
				})
		},
		initInvoice() {
			let form_data = new FormData()
			form_data.append(
				'vars[OPERATE_USER_ID_EQ]',
				'105349'
				//this.$store.state.bpmInfo.userInfo.userId,
			)
			form_data.append('vars[IS_USED_EQ]', this.showAllInvoices)
			form_data.append('pageNo', this.pageNo)
			form_data.append('dbOrders[0].property', 'CREATED_DATE_REF')
			form_data.append('dbOrders[0].orderTypeEnum', 'DESC')
			// 我的发票列表加载
			httpService(this)
				.getInvoicesList(form_data)
				.then((res) => {
					console.log('res', res.data.result)
					this.myInvoicesList = this.myInvoicesList.concat(res.data.result)
					if (
						res.data.result == '' ||
						res.data.totalCount === this.myInvoicesList.length
					) {
						this.loadMore = '没有更多了'
					}
					this.nextLoading = false
				})
		},
		loadMorePage() {
			this.pageNo += 1
			this.nextLoading = true
			this.initInvoice()
		},
		cancel() {
			this.showFlows = false
		},



		showAll(type) {
			console.log('type :>> ', type)
			console.log('this.showAllInvoices', this.showAllInvoices)
			this.myInvoicesList = []
			this.pageNo = 1
			if (type == '1') {
				this.showAllInvoices = ''
			} else {
				this.showAllInvoices = 0
			}
			// this.showAllInvoices == 0 ? this.showAllInvoices = 1 : this.showAllInvoices = 0
			// this.ifUsed == '查看全部' ? this.ifUsed = '查看未使用' this.showAllInvoices = 1  :  this.ifUsed = '查看全部'
			this.initInvoice()
		},

	},
	watch: {},
}
</script>
<style lang="less" scoped>
.invoce-page-header {
	padding: 8px 6px;
	background-color: #fff;

	span {
		float: left;
	}

	input {
		float: right;
		background-color: rgb(0, 65, 116);
		border-radius: 5px;
		color: #fff;
	}
}

.list-item {
	border-bottom: 1px solid black;
	padding: 2px 5px;
}

input[type='checkbox'] {
	-webkit-appearance: none;
	vertical-align: middle;
	margin-top: 0;
	background: #fff;
	border: #999 solid 1px;
	border-radius: 10px;
	min-height: 20px;
	min-width: 20px;
}

input[type='checkbox']:checked {
	background: #3190e8;
}

input[type='checkbox']:disabled {
	background: gray;
}

.vux-button-group>a.vux-button-group-current {
	background: rgb(0, 65, 116);
	color: #fff;
}

.invoice-group {
	padding-top: 10px;
}

.load-button {
	margin: 0 auto;
	font-size: 14px;
	color: #969799;
	text-align: center;
}
</style>
