import httpService from '@/components/httpService'
export default {

	initTempInvoices({ commit, rootState }, payload) {
		const result = {
			rootState, // 根节点状态
			payload
		}
		commit('initTempInvoices', result)
	},
	invoiceOcrSave({ commit, state }, payload) {
		const { invoice, vm } = payload
		const claimItem = {

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
		};
		// 查询供应商
		var selectSupplierInfo = async function (vendorName, isStaffFlag) {
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
		var invoiceOcrSaveAdd = async function (val) {
			let item = { // 费用明细item
				...claimItem,
				bizRefInvoices: [val]
			};
			item.amount = vm.toFixed(Number(val.invoice.priceTaxAmount) - Number(val.invoice.claimAmount || 0) + Number(val.invoice.currentClaimAmount || 0))
			item.approtionAmount = vm.toFixed(Number(val.invoice.amount) * (Number(val.invoice.priceTaxAmount || 0) - Number(val.invoice.claimAmount || 0) + Number(val.invoice.currentClaimAmount || 0)) / Number(val.invoice.priceTaxAmount));
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
			if (result) item.partyCategoryCode = 'supplier'
			// 查询员工
			if (!result) {
				result = await selectSupplierInfo(
					val.invoice.sellerName,
					true
				);
				// 员工查询有结果则赋值 employee
				if (result) item.partyCategoryCode = 'employee'
			}
			if (result) {
				// 供应商
				item.partyCategoryName = item.partyCategoryCode == 'supplier' ? '供应商' : '员工';
				item.counterpartyCode = item.partyCategoryCode == 'supplier' ? result.vendorCode : result.empCode;
				item.counterpartyName = result.vendorName;
				item.tradePartner = result.tradePartner;
				item.partnerProfitCode = result.partnerProfitCode;
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

		invoiceOcrSaveAdd(invoice)
	},
}
