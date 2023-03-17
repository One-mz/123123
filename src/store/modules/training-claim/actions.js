import httpService from '@/components/httpService'

export default {

	initTempInvoices({commit, rootState}, payload) {
		const result = {
			rootState, // 根节点状态
			payload
		}
		commit('initTempInvoices', result)
	},
	invoiceOcrSave({commit ,state},payload){
		const { invoice, vm} = payload
		const trainItem = {
			partnerProfitCode: '',
			partnerProfitName: '',
			partyCategoryCode: '',
			partyCategoryName: '',
			counterpartyCode: '', // 相对方编码
			counterpartyName: '', // 相对方名称
			tradePartner: '', // 贸易伙伴

			bigCategoryCode: '',
			bigCategoryName: '',
			categoryCode: '',
			categoryName: '',
			departName: '',
			departCode: '',
			projectName: '',
			costCenterCode: '',
			costCenterName: '',
			amount: '',
			approtionAmount: '',
			taxAmount: '',

			accountApprotionAmount: '', // 入账金额
			deductAmount: '', // 可抵扣税额

			remarks: '',

			wbsNo: '',
			wbsName: '',

			accountAmount: '',
			accountTypeCode: '',
			accountTypeName: '',
		};
		// 查询供应商
	 var selectSupplierInfo =	async function (vendorName, isStaffFlag) {
			const data = {
				"vars['deletedFlag_NE']": "1",
				"vars['companyCode_EQ']": '1000',
				"vars['vendorName_CENTERLIKE']": vendorName,
			};
	
			if (isStaffFlag) {
				data["empCode_ISNOTNULL"] = "";
			} else {
				data["empCode_ISNULL"] = "";
			}
			const res = await httpService(vm).getVendorData(data);
			console.log('res :>> ', res);
			return res.data && res.data.result && res.data.result.length ? res.data.result[0] : false;
		}
		var  invoiceOcrSaveAdd= async function (val){
			let item = { // 费用明细item
				...trainItem,
				bizRefInvoices:[val]
			};
			item.amount = vm.toFixed(Number(val.invoice.priceTaxAmount) - Number(val.invoice.claimAmount|| 0) + Number(val.invoice.currentClaimAmount || 0))
			item.approtionAmount = vm.toFixed(Number(val.invoice.amount) * (Number(val.invoice.priceTaxAmount||0) - Number(val.invoice.claimAmount||0) + Number(val.invoice.currentClaimAmount || 0)) / Number(val.invoice.priceTaxAmount));
			item.taxAmount = vm.toFixed(item.amount - item.approtionAmount);
			item.deductAmount = vm.toFixed(
					 vm.calculateDeductibleTax(val, Number(val.invoice.priceTaxAmount) - Number(val.invoice.claimAmount) + Number(val.invoice.currentClaimAmount || 0), vm.payTaxName === '小规模纳税人')
			)
			item.accountApprotionAmount = vm.toFixed(item.amount - item.deductAmount)
	
			let result
			// 查询供应商
			 result = await selectSupplierInfo(
				val.invoice.sellerName,
				false
			);
			// 供应商查询有结果则赋值 supplier
			if(result)  item.partyCategoryCode = 'supplier' 
			// 查询员工
			if(!result){
				result = await selectSupplierInfo(
					val.invoice.sellerName,
					true
				);
				// 员工查询有结果则赋值 employee
				if(result) item.partyCategoryCode = 'employee'
			}
			if (result) {
				// 供应商
				item.partyCategoryName = item.partyCategoryCode == 'supplier' ?	'供应商' : '员工';
				item.counterpartyCode = item.partyCategoryCode == 'supplier' ?result.vendorCode : result.empCode;
				item.counterpartyName = result.vendorName;
				item.tradePartner = result.tradePartner;
				item.partnerProfitCode = result.partnerProfitCode;
			}
			let category = await getTSysBigCategoryFn(val)
			item = {
				...item,
				bigCategoryCode:category.bigCategoryCode,
				bigCategoryName:category.bigCategoryName,
				categoryCode:category.categoryCode,
				categoryName:category.categoryName,
			}
			commit("addProportions", {
				proportions: item,
			});
	
			const { bizRefInvoices = [] } = item;
	
			// 更新发票信息列表
			bizRefInvoices.map((e) => {
				const {
					invoice = {},
					claimAmount = 0, // 报销金额
					claimTaxAmount = 0, // 发票税额
					deductibleTax = 0, // 可抵扣税额
				} = e;
				let bizInvoice = state.submitData.bizRefInvoices.find(
					(item) => item.invoice.frontRandomId == invoice.frontRandomId
				);
	
				bizInvoice = {
					...bizInvoice,
					claimAmount: vm.toFixed(
						Number(bizInvoice.claimAmount) + Number(claimAmount)
					),
					claimTaxAmount: vm.toFixed(
						Number(bizInvoice.claimTaxAmount) + Number(claimTaxAmount)
					),
					deductibleTax: vm.toFixed(
						Number(bizInvoice.deductibleTax) + Number(deductibleTax)
					),
				};
	
				commit("editBizRefInvoices", {
					bizRefInvoices: bizInvoice,
				});
			});
		}
		// 获取大类
		var getTSysBigCategoryFn =	async function(invoice) {
			// 发票内的 明细列表
			const str = invoice.invoice.fpItems.map(item=>{
				return item.itemName
			}).join(',')
			// 根据str 确定小类名称 *餐饮服务*餐费 = “伙食费” *会展服务*会务费 =“公杂费” *住宿服务*房费 = “住宿费”
			let smallCategoryName 
			if(str.indexOf('*餐饮服务*餐费') !== -1 || str.indexOf('*餐饮服务*餐饮服务') !== -1 ){
				smallCategoryName = '伙食费'
			} else if(str.indexOf('*会展服务*会务费') !== -1 ){
				smallCategoryName = '公杂费'
			} else if(str.indexOf('*住宿服务*房费') !== -1 || str.indexOf('*住宿服务*住宿费') !== -1 ){
				smallCategoryName = '住宿费'
			} 
			let category={
				bigCategoryName: null,
				bigCategoryCode: null,
				categoryName: null,
				categoryCode: null,
			}
			let bigData = {
				'vars[bizTypeCode_EQ]': 'TrainingClaim',
				// 'vars[companyCode_EQ]': vm.optObj.companyCode,
				'vars[isActive_EQ]': '1'
			}
			
			const bigResult =await httpService(vm).getTSysBigCategory(bigData)
			category.bigCategoryCode = bigResult.data[0].bigCategoryCode
			category.bigCategoryName = bigResult.data[0].bigCategoryName
			const smallData = {
				'vars[bizTypeCode_EQ]': 'TrainingClaim',
				"vars[bigCategoryCode_EQ]": category.bigCategoryCode
			}
			const smallResult = await httpService(vm).getTSysSmallCategory(smallData)
			let smallCategory = smallResult.data.find(item=> item.smallCategoryName === smallCategoryName)
			if(smallCategory){
				category = {
					...category,
					categoryName:smallCategory.smallCategoryName,
					categoryCode:smallCategory.smallCategoryCode,
				}
			}
			return category
		}
		invoiceOcrSaveAdd(invoice)
	},
	
}
