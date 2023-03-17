<template>
    <group class="invoice-info">
        <x-input text-align="right" readonly title="发票说明" required  v-model="invoice.invoiceInstruction"></x-input>
        <x-input text-align="right" readonly title="发票类型" v-model="invoice.type" required ref="type"></x-input>
		<x-input text-align="right" readonly v-model="invoice.travelStartDateRef" title="出发日期"  v-if="availableFields.indexOf('travelStartDate') >= 0" required ref="travelStartDate"></x-input>
		<x-input text-align="right" readonly title="开票日期" v-model="invoice.invoiceDateRef"  v-if="availableFields.indexOf('invoiceDate') >= 0" required ref="invoiceDateRef"></x-input>
		<x-input text-align="right" readonly title="发票总金额"  v-model="invoice.priceTaxAmount"  required ref="amount"></x-input>
        <x-input text-align="right" readonly title="录入时间" v-model="invoice.createdDateRef" required ref="createdDateRef"></x-input>
        <x-input text-align="right" readonly title="出发地"  v-model="invoice.startCity" v-if="availableFields.indexOf('startCity') >= 0" required ref="startCity"></x-input>
		<x-input text-align="right" readonly title="目的地"   v-model="invoice.destinationCity" v-if="availableFields.indexOf('destinationCity') >= 0" required ref="destinationCity"></x-input>
		<x-input text-align="right" readonly title="发票份数" v-model="invoice.invoiceSheetNo"  v-if="availableFields.indexOf('invoiceSheetNo') >= 0" required ref="invoiceSheetNo"></x-input>
	  	<x-input text-align="right" readonly title="其中票价" v-model="invoice.ticketPrice"  v-if="availableFields.indexOf('ticketPrice') >= 0" required ref="ticketPrice"></x-input>
	  	<x-input text-align="right" readonly title="其中燃油附加费" v-model="invoice.fuelSurcharge"  v-if="availableFields.indexOf('fuelSurcharge') >= 0" required ref="fuelSurcharge"></x-input>
		<!-- <x-input text-align="right" readonly title="已使用任务名称" :value="invoice.formNo ?invoice.formNo:'还未被使用'" required ref="type"></x-input> -->
        <x-input text-align="right" readonly title="已使用任务单号" :value="isUsedForm" required ref="type"></x-input>

        <x-input text-align="right" readonly title="发票代码" v-model="invoice.invoiceCode" v-if="availableFields.indexOf('invoiceCode') >= 0" required ref="invoiceCode"></x-input>
        <x-input text-align="right" readonly title="发票号码" v-model="invoice.invoiceNo" v-if="availableFields.indexOf('invoiceNo') >= 0" required ref="invoiceNo"></x-input>
		<x-input text-align="right" readonly title="校验码后六位" v-model="invoice.checkCode" v-if="availableFields.indexOf('checkCode') >= 0" required ref="checkCode"></x-input>

		<divider v-if="['01','04','05','03', '09', '11','20'].indexOf(invoice.typeCode) >= 0 " >发票详情</divider>
		<div style="text-align:center;" v-if="['01','04','05','03', '09', '11','20'].indexOf(invoice.typeCode) >= 0">
			<svg @click="openDetail()" id="loadMore" class="icon" width="20px" height="20.00px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
			<path fill="#000000" d="M50.176 505.193412l79.088941-79.390118 407.792941 409.359059 407.853177-409.359059L1024 505.193412 537.118118 993.882353zM50.176 83.546353L129.264941 4.156235l407.792941 409.359059L944.971294 4.156235 1024 83.546353 537.118118 572.235294z" /></svg>
		</div>

		<x-input text-align="right" title="发票税额" readonly  v-model="invoice.taxAmount" v-if="availableFields.indexOf('taxAmount') >= 0 && detailOpen || taxInfo"  required ref="taxAmount"></x-input>
		<x-input text-align="right" title="税率" readonly :value="(Number(invoice.taxRatio)*100).toFixed(1) + '%'" v-if="availableFields.indexOf('taxRatioShow') >=0  && detailOpen || taxInfo" ref="taxRatioShow"></x-input>

		<div v-if="detailOpen" >
			<x-input text-align="right" readonly title="不含税金额"  v-model="invoice.amount" v-if="availableFields.indexOf('nonTaxAmount') >= 0" required ref="nonTaxAmount"></x-input>

			<x-input text-align="right" readonly title="购方名称"  v-model="invoice.purchaserName" v-if="availableFields.indexOf('purchaserName') >= 0" ref="purchaserName"></x-input>
			<x-input text-align="right" readonly title="纳税人识别号"  v-model="invoice.purchaserTaxno" v-if="availableFields.indexOf('purchaserTaxno') >= 0" ref="purchaserTaxno"></x-input>
			<x-input text-align="right" readonly title="地址，电话"  v-model="invoice.purchaserAddressphone" v-if="availableFields.indexOf('purchaserAddressphone') >= 0 " ref="purchaserAddressphone"></x-input>
			<x-input text-align="right" readonly title="开户行账户"  v-model="invoice.purchaserBank" v-if="availableFields.indexOf('purchaserBank') >= 0 " ref="purchaserBank"></x-input>
			<x-input text-align="right" readonly title="销方名称"  v-model="invoice.salesName" v-if="availableFields.indexOf('salesName') >= 0 " ref="salesName"></x-input>
			<x-input text-align="right" readonly title="纳税人识别号"  v-model="invoice.salesTaxno" v-if="availableFields.indexOf('salesTaxno') >= 0" ref="salesTaxno"></x-input>
			<x-input text-align="right" readonly title="地址，电话"  v-model="invoice.salesAddressphone" v-if="availableFields.indexOf('salesAddressphone') >= 0 " ref="salesAddressphone"></x-input>
			<x-input text-align="right" readonly title="开户行账户"  v-model="invoice.salesBank" v-if="availableFields.indexOf('salesBank') >= 0 " ref="salesBank"></x-input>

		    <div v-if="['01','04','05','03', '09', '11','20'].indexOf(invoice.typeCode) >= 0">
			<divider>开票内容</divider>

			<div style="text-align:center;" >
				<svg  @click="openInvoiceInfo()"  id="invoiceInfoDetail" class="icon" width="20px" height="20.00px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
				<path fill="#000000" d="M0.448 286.848c0-15.616 5.952-31.36 17.984-43.392 23.936-24 62.72-24 86.784 0L512 650.24l406.784-406.72c23.936-24 62.848-24 86.784 0 23.936 23.936 23.936 62.784 0 86.848l-450.24 450.176c-24 23.936-62.848 23.936-86.848 0L18.368 330.368C6.4 318.4 0.448 302.656 0.448 286.848L0.448 286.848zM0.448 286.848" /></svg>
			</div>

			 <x-table full-bordered v-if="invoiceInfo">
				<thead v-if="invoice.invoiceItems">
				<tr>
					<th>名称</th>
					<th>规格型号</th>
					<th>单位</th>
					<th>数量</th>
					<th>单价</th>
					<th>金额</th>
					<th>税率</th>
					<th>税额</th>
				</tr>
				</thead>
				<tbody>
				<tr v-for="(item,index) in invoice.invoiceItems" :key="index" >
					<td>{{item.commodityName}}</td>
					<td>{{item.specificationModel}}</td>
					<td>{{item.unit}}</td>
					<td>{{item.quantity}}</td>
					<td>{{item.unitprice}}</td>
					<td>{{item.amount}}</td>
					<td>{{item.taxRate}}</td>
					<td>{{item.tax}}</td>
				</tr>
				<tr>
					<td colspan="8" v-if="!invoice.invoiceItems">无开票内容</td>
				</tr>
				</tbody>
			</x-table>
			</div>
			</div>
    </group>
</template>
<script>
import {
	XInput,
	Datetime,
	Group,
	GroupTitle,
	XButton,
	Cell,
	Divider,
	Flexbox,
	FlexboxItem,
	XTable,
} from 'vux'
import BpmDropdown from '@/components/common/bpm-dropdown.vue'
import httpService from 'components/httpService'
export default {
	components: {
		XInput,
		BpmDropdown,
		Datetime,
		Group,
		GroupTitle,
		XButton,
		Cell,
		Divider,
		Flexbox,
		FlexboxItem,
		XTable,
	},
	data() {
		return {
			detailOpen: false,
			invoiceInfo: false,
			taxInfo: false,
			invoice: {
				type: '',
				typeCode: '',
				invoiceCode: '',
				invoiceNo: '',
				amount: '',
				nonTaxAmount: 0,
				taxRatio: '',
				taxAmount: '',
				taxRatioShow: '',
				invoiceDate: '',
				checkCode: '',
				identity: '',
				priceTaxAmount: '',
				validateStatus: 'unnecessary',
				startCity:'',
				destinationCity:'',
				travelStartDate:'',
				invoiceSheetNo: '',
				fuelSurcharge: '',
				ticketPrice: '',
			},
			invoiceTypeObject: {},
			taxAmountDisable: false,
			invoiceService: '',
		}
	},
	computed: {
		availableFields: function() {
			if (this.invoice.typeCode == '01' || this.invoice.typeCode == '03' || this.invoice.typeCode == '20') {
				return [
					'invoiceCode',
					'invoiceNo',
					'invoiceDate',
					'nonTaxAmount',
					'taxAmount',
					'amount',
					'taxRatioShow',
					'purchaserName',
					'purchaserTaxno',
					'purchaserTaxno',
					'purchaserAddressphone',
					'purchaserBank',
					'salesName',
					'salesTaxno',
					'salesAddressphone',
					'salesBank',
				]
			} else if (
				this.invoice.typeCode == '04' ||
				this.invoice.typeCode == '05'||
        this.invoice.typeCode == '09'||
				this.invoice.typeCode == '11'
			) {
				return [
					'invoiceCode',
					'invoiceNo',
					'invoiceDate',
					'nonTaxAmount',
					'checkCode',
					'taxAmount',
					'amount',
					'taxRatioShow',
					'purchaserName',
					'purchaserTaxno',
					'purchaserTaxno',
					'purchaserAddressphone',
					'purchaserBank',
					'salesName',
					'salesTaxno',
					'salesAddressphone',
					'salesBank',
				]
			} else if (this.invoice.typeCode == '10' ||
				this.invoice.typeCode == '34') {
				return ['amount']
			} else if (this.invoice.typeCode == '09') {
				return ['amount', 'taxAmount', 'taxRatioShow', 'invoiceDate']
			} else if (this.invoice.typeCode == '06') {
				return ['amount', 'taxAmount', 'taxRatioShow', 'invoiceDate']
			} else if (this.invoice.typeCode == '07') {
				return ['amount', 'taxAmount', 'taxRatioShow', 'invoiceDate']
			} else if (this.invoice.typeCode == '08') {
				return ['amount', 'invoiceDate']
			} else if(this.invoice.typeCode == '13'){
				return ['amount', 'travelStartDate','startCity','destinationCity']
			} else if (this.invoice.typeCode == '31') {
				return ['amount', 'invoiceSheetNo', 'ticketPrice', 'fuelSurcharge']
			} else if (this.invoice.typeCode == '32') {
				return ['amount', 'invoiceSheetNo']
			} else if (this.invoice.typeCode == '33') {
				return ['amount', 'invoiceSheetNo']
			}
			return []
		},
    isUsedForm: function () {
      return this.invoice.formNo ? this.invoice.formNo : '还未被使用'
    }
	},
	methods: {
		openDetail() {
			this.detailOpen = !this.detailOpen
			console.log('open')
			document
				.getElementById('loadMore')
				.setAttribute('style', 'color: #1871D1')
		},
		openInvoiceInfo() {
			this.invoiceInfo = !this.invoiceInfo
			document
				.getElementById('invoiceInfoDetail')
				.setAttribute('style', 'color: #1871D1')
		}
	},
	watch: {
		'invoice.typeCode'(newVal) {
				// if (['06', '07', '08', '09', '10'].indexOf(newVal) >= 0) {
				// 	if (newVal == '06') {
				// 		//通行发票-高速公路通行发票
				// 		this.invoice.taxRatioShow = '3%'
				// 		this.invoice.taxRatio = 0.03
				// 	} else if (newVal == '07') {
				// 		//通行发票-一、二级公路、桥、闸通行发票
				// 		this.invoice.taxRatioShow = '5%'
				// 		this.invoice.taxRatio = 0.05
				// 	} else if (newVal == '09') {
				// 		//农产品发票
				// 		this.invoice.taxRatioShow = '11%'
				// 		this.invoice.taxRatio = 0.11
				// 	} else {
				// 		this.invoice.taxRatioShow = ''
				// 		this.invoice.taxRatio = 0
				// 	}
				// } else {
				// 	console.log('watchNewVal',newVal)
				// 	// this.detailOpen = false
				// }
		},
	},
	mounted() {
			this.invoice = this.$route.params.dataObj
			console.log('this.invoice',this.$route.params.dataObj)

      console.log('3123123',this.invoice.priceTaxAmount)

			if (['06', '07', '09',].indexOf(this.invoice.typeCode) >= 0) {
					this.taxInfo = true
				} else {
					console.log('watchNewVal',this.invoice.typeCode)
					// this.detailOpen = false
				}

    console.log('3123123',this.$route.params.dataObj.priceTaxAmount)
			let form_data = new FormData()
			form_data.append('invoiceId', this.invoice.invoiceId)
            //开票内容加载
			httpService(this)
				.getInvoiceItemByInvoiceId(form_data)
					.then(res=>{
						console.log('itemlist',res)
						this.invoice.invoiceItems = res.data
            console.log('3123123',this.$route.params.dataObj.priceTaxAmount)
					})
	},
}
</script>
<style>
  .invoice-info .weui-input{
    font-size: 14px;
  }
  .invoice-info .weui-label{
    font-size: 14px;
  }
  .invoice-info .vux-table{
    font-size: 14px;
  }
</style>
