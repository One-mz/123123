import cloneDeep from 'lodash/cloneDeep'

import isNumber from 'lodash/isNumber'
import isNaN from 'lodash/isNaN'
import assign from 'lodash/assign'
import { toNumber } from 'utils/type-check'
import MathUtil from 'utils/mathUtil'
import Vue from 'vue';


export default {
  setShroffAccountList(state, payload) {
    state.submitData.shroffAccountList = payload;
  },
  applyFormNoChange(state, { info }) {
    state.submitData.companyNum = info.companyNum
    state.submitData.receiptNum = info.receiptNum
    state.submitData.totalNum = info.totalNum
    state.submitData.entertainmentDetailList = info.entertainmentDetailList
    state.submitData.receiptStartDate = info.receiptStartDate
    state.submitData.receiptEndDate = info.receiptEndDate
    state.submitData.receiptStandardEnumId = info.receiptStandardEnumId
    state.submitData.receiptTypeEnumId = info.receiptTypeEnumId
    state.submitData.receiptTypeEnumName = info.receiptTypeEnumName
  },

  amountTotalChange(state, { amountTotal }) {
    state.submitData.claimAmount = amountTotal;

    // const payAmount = Number(state.submitData.claimAmount) - Number(state.submitData.currentOffsetAmount)
    // state.submitData.payAmount = payAmount;

    // state.submitData = Object.assign({}, state.submitData, {
    //   'payAmount': payAmount
    // })
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

  payAmountTotalChange(state, { payAmountTotal }) {
    state.submitData.payAmount = payAmountTotal;
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
    console.log(data)
    state.submitData = Object.assign({}, state.submitData, {
      'proportions': data
    })
    console.log(state.submitData)
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
  shroffAccountListChange(state, {shroffAccountList}) {
    state.submitData.shroffAccountList = shroffAccountList
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


  revertToInit(state) {
    state.submitData = {
      formNo: '', //申请单编号
      claimTypeCode: '', //报销类型代码
      claimTypeName: '', //报销类型

      internalOrder: '', //内部订单
      extraInfo: '', //基建名称/WBS名称
      claimAmount: 0, //报销总额
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
      applyFormNo: '',

      companyNum: 0,
      receiptNum: 0,
      totalNum: 0,
      entertainmentDetailList: [],
      receiptStartDate: "",
      receiptEndDate: "",
      receiptStandardEnumId: "",
      receiptStandardEnumName: "",
      receiptTypeEnumId: "",
      receiptTypeEnumName: "",
      applyAmount: 0, // 事前申请金额
      shroffAccountList:[]
    }
  }
}
