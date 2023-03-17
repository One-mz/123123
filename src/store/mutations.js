import storejs from 'storejs'
import isArray from 'lodash/isArray'
import {
  SessionStore
} from '@/utils/store'

export default {
  setCurrentFlow(state, payload) {
    const {
      bizType,
      id
    } = payload
    state.currentFlow = {
      bizType,
      id,
    }
  },
  setHeader(state, payload) {
    const {
      title
    } = payload
    state.headTitle = title
  },
  setBpmInfo(state, payload) {
    const {
      code,
      value
    } = payload
    //const obj = SessionStore.get('user') ? SessionStore.get('user') : value
    state.bpmInfo[code] = value
  },
  setDepartInfo(state, payload) {
    const {
      data
    } = payload
    const departInfo = data && isArray(data) && data.length ? data[0] : {}
    state.bpmInfo = Object.assign(state.bpmInfo, {
      departInfo,
    })
  },
  setTaskVars(state, payload) {
    const {
      stepInfo
    } = payload
    state.taskVars = stepInfo
    let bizData = stepInfo.bizObjectData
    // 流程履历
    let stepList = stepInfo.stepList || []
    if (!bizData) {
      state.bizObjectData = {}
      state.readOnly = false
      return
    }
    bizData.formStatus = stepInfo.bpmFormMain.formStatus
    if (stepInfo.bpmDefInfo && stepInfo.bpmDefInfo.activityInstName != 'DraftActivity') {
      state.readOnly = true
    }
    if (state.bpmInfo.userInfo.userId != state.taskVars.bpmFormMain.createdBy) {
      state.readOnly = true
    }
    state.bizObjectData = bizData
    state.stepList = stepList
  },
  setBpmFormStep(state, payload) {
    state.bpmFormStep = payload
  },

  setTaskVarsTravel(state, payload){
    state.bizObjectData = payload
  },
  setUserCompanyOptions(state,payload){
    state.userCompanyOptions = payload
  },
  setFrom(state, payload) {
    const {
      from
    } = payload
    state.from = from
    if (!from) {
      state.readOnly = false
    }
  },

  // 流程中发票管理相关

  // 发票数据操作
  invoicesAction(state, payload) {
    const {
      key,
      value
    } = payload
    switch (key) {
      case 'add':
        state.invoices.push(value)
        break
      case 'delete':
        if(state.invoices[value].invoiceId){
          state.deletedInvoices.push(state.invoices[value].invoiceId);
        }
        state.invoices.splice(value, 1)
        break
      case 'edit':
        // 编辑
        // 根据identity 和 invoiceId作为唯一性
        if(value.identity){
          let index = state.invoices.findIndex(item => item.identity == value.identity);
          state.invoices[index] = {...state.invoices[index], ...value};
        }else if(value.invoiceId){
          let index = state.invoices.findIndex(item => item.invoiceId == value.invoiceId);
          state.invoices[index] = {...state.invoices[index], ...value};
        }
        break;
      default:
        break
    }
  },
  tranInvoice(state, payload) {
    const {
      val
    } = payload
    state.tranInvoiceList.push(val)
  },
  initInvoiceData(state, payload) {
    state.invoiceData = ''
  },

  //点击发票按钮，暂存页面的数据
  setInvoiceData(state, payload) {
    if(payload.data){
      state.invoiceData = payload.data;
    }
    state.fromInvoiceFlag = true;
  },



  btnStatus(state, payload) {
    const {
      status
    } = payload
    state.showBtns = status === 'show' ? true : false
  },
  // 清除提交数据
  clearStore(state, payload) {
    const {
      storeType
    } = payload
    switch (storeType) {
      case 'travelClaim':
        state[storeType].submitData = {
          baseInfo: {},
          claimInfo: {},
          expense: {
            transports: [], // 差旅费用
            accommodations: [], // 住宿
            others: [],
            foods: [],
            publics: [], // 杂费
          },
        }
        break;
      default:
        break;
    }
  },
  // 设置是否只读
  setReadOnly(state, payload) {
    const {
      status
    } = payload
    state.readOnly = status || false
  },
  //设置差旅申请信息
  setTravelInfoInClaim(state, payload) {
    state.travelInfoInClaim = payload
  },
  // 初始化锁
  setLocked(state, payload) {
    const {
      status
    } = payload
    state.locked = status || false
  },
  setShroffAccount(state, payload) {
    state.shroffAccount = payload
  },
  //设置是否从发票点进去的flag
  setInvoiceFlag(state, payload) {
    state.invoiceFlag = payload;
  },
  initState(state) {
    state.isLoaded = false
    state.from = '';
    state.readOnly = false;
    state.taskVars = {};
    state.currentFlow = {bizType: '', id: ''};
    state.bizObjectData = {
      formNo: '',
      formStatus: '新建'
    }
    state.showBtns = true
    state.locked = false
    state.shroffAccount = {}
    state.headTitle = '共享平台';
    state.fileList = [];
    state.travelInfoInClaim = {}
    state.invoices = []
    state.paymentInfoFlag = false
    state.fromInvoiceFlag = false
    state.deletedInvoices = []
    state.tempDetail = {}
    state.isShowTabs = true
    state.initCostShareFlag = false
    state.bpmFormStep = {}
    // state.isShowOvertimeReminder = true
    state.urgencyObj = {
      urgencyFlag: '',
      urgencyLevel: 0,
    },
    state.stepList = []
  },

  setSimpleRangeCode(state, payload){
    state.simpleRangeCode = payload
  },
  setPaymentInfoFlag(state, payload){
    state.paymentInfoFlag = payload
  },
  /**
   * 设置临时数据
   * @param {*} state
   * @param {*} payload
   */
  setDetailTemp(state, payload) {
    const {
      key,
      value,
      index,
      isEdit
    } = payload
    state.tempDetail[key] = value
    state.tempDetail[key].index = index
    state.tempDetail[key].isEdit = isEdit
  },
  deleteDetailTemp(state, payload) {
    const {
      key
    } = payload
    state.tempDetail[key] = {}
  },
  //控制Tab页显示隐藏
  setTabsFlag(state, payload){
    state.isShowTabs = payload.isShowTabs
  },
  initCostShare(state,payload){
    state.initCostShareFlag = payload.flag
  },
  setShowOvertimeReminder(state, payload){
    state.isShowOvertimeReminder = payload.isShowOvertimeReminder
  },

  setUrgencyObj(state, payload){
    state.urgencyObj = payload.urgencyObj
  },
  setTargetType(state,payload){
    state.targetType = payload.targetType
  },
  SET_BASICBIZOBJ: (state, basicBizObj) => {
    state.basicBizObj = basicBizObj;
  },
  SET_OPTOBJ:(state,payload)=>{
    state.optObj = payload
  },
  SET_ISLOADED: (state, isLoaded) => {
    state.isLoaded = isLoaded;
  },
}
