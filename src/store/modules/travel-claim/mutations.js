import assign from 'lodash/assign'
import isEmpty from 'lodash/isEmpty'
import isNumber from 'lodash/isNumber'
import isNaN from 'lodash/isNaN'
import cloneDeep from 'lodash/cloneDeep'
import {
  dateFormat
} from 'vux'

export default {
  setShroffAccountList(state, payload) {
    console.log('payload');
    state.submitData.shroffAccountList = payload;
  },
  payAmountTotalChange(state, { payAmountTotal }) {
    state.submitData.payAmount = payAmountTotal;
  },
  setLeaders(state, payload) {
    state.leaders = payload
  },
  travelClaimSetInfo(state, payload) {
    const {
      info
    } = payload
    state.info = assign(state.info, info)
  },
  travelClaimSetInfoName(state, payload) {
    const {
      name
    } = payload
    state.info = assign(state.info, {
      receiverTypeName: name,
    })
  },
  addTransport(state, payload) {
    const {
      t
    } = payload
    if (t.index >= 0) {
      state.info.transports.splice(t.index, 1, t.info)
    } else if (isEmpty(t.info)) {
      state.info.transports = []
    } else {
      state.info.transports.push(t.info)
    }
  },
  addAccommodation(state, payload) {
    const {
      acc
    } = payload
    if (acc.index >= 0) {
      state.info.accommodations.splice(acc.index, 1, acc.info)
    } else if (isEmpty(acc.info)) {
      state.info.accommodations = []
    } else {
      state.info.accommodations.push(acc.info)
    }
  },
  setOffsets(state, payload) {
    const {
      offsets
    } = payload
    state.offsets = []
    state.offsets = offsets
  },
  mergeRequest(state, payload) {
    const {
      request
    } = payload
    state.submitData = assign(state.submitData, request || {})
  },
  setCostBreakdownData(state, payload) {
    const {
      content,
      type,
      index
    } = payload
    let key = ''
    if (type) {
      key = type;
    } else {
      key = Object.keys(content)[0]
    }
    if (isNumber(Number(index)) && !isNaN(Number(index))) {
      state.submitData[key][index] = content[key]
    } else {
      state.submitData[key].push(content[key])
    }
  },
  // 删除差旅信息
  deleteExpense(state, payload) {
    const {
      key,
      value
    } = payload
    state.submitData[key].splice(value, 1)
    state.submitData = cloneDeep({...state.submitData, key: state.submitData[key]})
  },
  // 餐补展示隐藏
  expSetShowDetail(state, payload) {
    const {
      m,
      key,
      type
    } = payload
    state.submitData[m] = state.submitData[m].map(
      (item, index) => {
        if (type === 'hide') {
          item.show = false
        } else if (type === 'open') {
          item.show = false
          if (index === key) {
            item.show = true
          }
        }
        return item
      },
    )
  },
  expChangeMoney(state, payload) {
    const {
      m,
      content
    } = payload;
    state.submitData[m] = content;
  },
  // 设置临时数据
  setExpenseTemp(state, payload) {
    const {
      key,
      value,
      index
    } = payload
    state.temp[key] = value
    state.temp[key].index = index
  },
  deleteExpenseTemp(state, payload) {
    const {
      key
    } = payload
    state.temp[key] = {}
  },
  convertTravelClaim(state) {
    state.request = state.submitData
  },
  setInitTravelClamData(state, payload) {
    let startDate = payload.travelStartDate ? dateFormat(payload.travelStartDate, 'YYYY-MM-DD') : '';
    let endDate = payload.travelEndDate ? dateFormat(payload.travelEndDate, 'YYYY-MM-DD') : '';
    state.submitData = {
      ...payload,
      ...{
        travelStartDate: startDate,
        travelEndDate: endDate,
      }
    }
  },
  setAmount(state, payload) {
    const {
      totalAmount,
      offsetAmount
    } = payload
    state.submitData = Object.assign(state.submitData, {
      totalAmount,
      offsetAmount,
    })
  },
  initTravelClaimTempInvoices(state, result) {
    const {
      rootState
    } = result
    console.log('rootState.invoices :>> ', rootState.invoices);
    console.log('state.tempInvoices :>> ', state.tempInvoices);
    // const arr = rootState.invoices.map((item, index) => {
    //   if (state.tempInvoices.map(v => v.identity).indexOf(item.identity) === -1) {
    //     item.show = true
    //   }
    //   return item
    // })
    state.tempInvoices = [...rootState.invoices]
  },
  setTravelClaimInvoice(state, payload) {
    const {
      value
    } = payload
    if (value.length) {
      state.tempInvoices = state.tempInvoices.map((item, index) => {
        if (value.map(v => v.identity).indexOf(item.identity) > -1) {
          item.show = false
        }
        return item
      })
    }
  },
  
  setTravelApply(state,payload){
    console.log('state ta', payload);
    state.ta = payload
  },
  setCarRequired(state,payload){
    // state.ta.isCarRequiredFlag = true
  },
  setFoodRequired(state,payload){
    // state.ta.isCarRequiredFlag = true
  },
  revertToInit(state){
    state.submitData=  {
      totalAmount: 0,
      offsetAmount: 0,
      payAmount: 0,
      shroffAccount: {},
      calendars: [],
      transports: [], // 差旅费用
      accommodations: [], // 住宿
      // travelerNames:'',
      others: [],
      meets: [],
      trainings: [],
      repasts: [],
      foods: [],
      traffic: [],
      publics: [], // 杂费
      offsets: [],
      borrowAgings: [],
      shroffAccountList:[]
    }
  },
  initFoodsPublic(state, payload){
    state.submitData.foods = [];
    state.submitData.traffic = [];
    state.submitData.publics = [];
  },
  setCalendars(state, payload) {
    state.submitData.calendars = payload
  },
  setBizRefInvoices(state,bizRefInvoices){
    console.log('bizRefInvoices :>> ', bizRefInvoices);
    state.bizRefInvoices = [...bizRefInvoices]
  },
  addBizRefInvoices(state,invoice){
    state.bizRefInvoices.push(invoice)
  },
  deleteBizRefInvoices(state,payload){
    let {invoice,index} = payload
    state.bizRefInvoices.splice(index,1)
  }
}
