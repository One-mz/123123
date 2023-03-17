import cloneDeep from 'lodash/cloneDeep'

import isNumber from 'lodash/isNumber'
import isNaN from 'lodash/isNaN'
import assign from 'lodash/assign'
import { toNumber } from 'utils/type-check'
import MathUtil from 'utils/mathUtil'
import Vue from 'vue';


export default {
  setInfo(state, payload) {
  	const { data } = payload
  	state.info = assign(state.info, data)
  },
	revertToInit(state){
		state.info = {
		}
	},

  claimPersonCodeChange(state, { claimPersonCode }) {
    state.submitData.claimPersonCode = claimPersonCode;
  },
  setShroffAccountList(state, payload) {
    state.submitData.shroffAccountList = payload;
  },
  amountTotalChange(state, { amountTotal }) {
    state.submitData.claimAmount = amountTotal;
  },

  accountAmountTotalChange(state, {accountAmountTotal}) {
    state.submitData.accountAmount = accountAmountTotal;
  },

  // 设定本次借款核销
  setCurrentOffsetAmount(state, payload) {
    state.submitData.currentOffsetAmount = payload.mount

    // const payAmount = Number(state.submitData.claimAmount) - Number(state.submitData.currentOffsetAmount)
    // state.submitData.payAmount = payAmount;

    // state.submitData = Object.assign({}, state.submitData, {
    //   'payAmount': payAmount
    // })
  },

  addBizRefInvoices(state, { bizRefInvoices }) {
    const data = [...state.submitData.bizRefInvoices, bizRefInvoices];
    // state.submitData.bizRefInvoices = data;
    // Vue.set(state.submitData, 'bizRefInvoices', data);
    state.submitData = Object.assign({}, state.submitData, {
      'bizRefInvoices': data
    })
  },

  editBizRefInvoices(state, { bizRefInvoices }) {
    const index = state.submitData.bizRefInvoices.findIndex((item, index) => {
      return item.frontRandomId == bizRefInvoices.frontRandomId;
    });

    if (index !== -1) {
      state.submitData.bizRefInvoices.splice(index, 1, bizRefInvoices);
    }
  },
  deleteBizRefInvoices(state, { bizRefInvoices }) {
    const index = state.submitData.bizRefInvoices.findIndex((item, index) => {
      return item.frontRandomId == bizRefInvoices.frontRandomId;
    });

    if (index !== -1) {
      state.submitData.bizRefInvoices.splice(index, 1);
    }
  },
  bizRefInvoicesChange(state, { bizRefInvoices }) {
    state.submitData.bizRefInvoices = bizRefInvoices;
    // Vue.set(state.submitData, 'bizRefInvoices', bizRefInvoices);

    state.submitData = Object.assign({}, state.submitData, {
      'bizRefInvoices': bizRefInvoices
    })
  },


  addProportions(state, { proportions }) {
    const data = [...state.submitData.proportions, proportions];
    // state.submitData.proportions = data;
    // Vue.set(state.submitData, 'proportions', data);

    state.submitData = Object.assign({}, state.submitData, {
      'proportions': data
    })
  },
  editProportions(state, { proportions, index }) {
    if (index !== -1) {
      state.submitData.proportions.splice(index, 1, proportions);
    }
  },
  deleteProportions(state, { proportions }) {
    const index = state.submitData.proportions.findIndex((item, index) => {
      // 不准确
      // 以大类和小类为唯一标志
      return (
        item.bigCategoryCode == proportions.bigCategoryCode &&
        item.categoryCode == proportions.categoryCode
      );
    });

    if (index !== -1) {
      state.submitData.proportions.splice(index, 1);
    }
  },
  proportionsChange(state, { proportions }) {
    state.submitData.proportions = proportions;
    // Vue.set(state.submitData, 'proportions', proportions);

    state.submitData = Object.assign({}, state.submitData, {
      'proportions': proportions
    })
  },

  /**
   * 设置临时数据
   * @param {*} state
   * @param {*} payload
   */
   setCostShareTemp(state, payload) {
    const {
      key,
      value,
      index
    } = payload
    state.temp[key] = value
    state.temp[key].index = index
  },


  setInitEmployeeReimburseNewData(state, payload) {
    state.submitData = payload
  },


  /**
   * @description 合并请求数据
   * @author aaron
   * @param {*} state
   * @param {*} payload
   */
   mergeRequest(state, payload) {
    const {
      request
    } = payload;
    state.submitData = assign(state.submitData, request || {})

    if (request != null && request.shroffAccount != null && request.shroffAccount.paymentInstruction != null) {
      state.submitData.paymentInstruction = request.shroffAccount.paymentInstruction
    }
  },

  payAmountTotalChange(state, { payAmountTotal }) {
    state.submitData.payAmount = payAmountTotal;
  },
  
  revertToInit(state){
    state.submitData = {
      formNo: '', //申请单编号
      claimTypeCode: '', //报销类型代码
      claimTypeName: '', //报销类型

      internalOrder: '', //内部订单
      extraInfo: '', //基建名称/WBS名称
      claimAmount: 0, //报销总额
      // accountAmount: 0,// 挂账金额
      invoiceAmount: 0, //发票总额
      currentOffsetAmount: 0, //本次核销总额
      payAmount: 0, //支付金额
      instruction: '', //报销说明
      paymentInstruction: '', //付款信息
      bizRefInvoices: [],

      proportions: [],
      borrowOffsets: [],



      // TODO
      // 事前申请信息

      applyCategoryName: "",
      applyCategoryCode: '',
      applyAmount: 0,
      useDate: "",
      receiptStandardEnumName: "",
      receiptNum: "",
      totalNum: "",
      shroffAccountList:[]
    }
  }
}
