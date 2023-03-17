import httpService from "./httpService";

function initService(vm) {
  const flowService = {}
  let vuexStore = vm.$store
  let routerService = vm.$router
  let vux = vm.$vux

  let fromObj = {};
  let optTypeName=''

  routerService.afterEach((to, from) => {
    // console.log(from);
    fromObj = from;
  });


  function doSaveOrSubmit(action, request) {
    return new Promise((resolve, reject) => {
      console.log('request', request);
      console.log('action', action);

      let bpmFormMain = {};
      let taskRefVars = vuexStore.state.taskVars;

      if (action === 'SAVE' || action === 'START') {
        const { userInfo, departInfo } = vuexStore.state.bpmInfo;//给到这里面
        console.log('departInfo :>> ', departInfo);
        bpmFormMain = {
          companyCode: departInfo.companyCode,
          companyName: departInfo.companyName,
          sapCompanyCode: taskRefVars.bpmFormMain.sapCompanyCode || departInfo.sapCompanyCode,
          securityCode: departInfo.departCode,
          securityName: departInfo.departName,
          createdBy: userInfo.userId,
          createdByName: userInfo.userName,
          tel: userInfo.tel,
          resourceTag: navigator.userAgent,
  
        }
      } else {
        bpmFormMain = {}
      }



      // if (taskRefVars.bpmFormMain.formNo && ['运行中','撤销','START'].includes(taskRefVars.bpmFormMain.formStatus) && action === 'START') {
      //   action = 'PASS'
      // }
      bpmFormMain = Object.assign(taskRefVars.bpmFormMain, bpmFormMain);

      // if (!bpmFormMain.sapCompanyCode || bpmFormMain.sapCompanyCode === '') {
      //   vux.alert.show({
      //     content: 'SAP公司代码为空!',
      //   })
      //   reject('SAP公司代码为空!')
      //
      //   return
      // }


      // if (!bpmFormMain.securityCode || bpmFormMain.securityCode === '') {
      //   vux.alert.show({
      //     content: '部门为空!',
      //   })
      //   reject('部门为空!')

      //   return
      // }

      const taskInstId=getParams('taskInstId')
      var taskActionVo = {
        bpmFormMain: {
          ...bpmFormMain,
          ...vuexStore.state.basicBizObj
        },
        systemTag: 'FSSP',
        // optOrgCode: this.getOptDepartInfo(null, 'code'),
        // optOrgName: this.getOptDepartInfo(null, 'name'),
        optUserCode: vuexStore.state.bpmInfo.userInfo.userId,
        optUserName: vuexStore.state.bpmInfo.userInfo.userName,
        procInstId: bpmFormMain.procInstId,
        taskInstId,
       // taskInstId: taskRefVars.bpmFormStep ? taskRefVars.bpmFormStep.nextTaskInstId : "",
        optTypeCode: action,
        optTypeName: optTypeName,
        resourceTag: 'mobile',
        bizObjectData: request,
      }
      let formData = {
        taskActionVo: JSON.stringify(taskActionVo)
      }
      // let formData = new FormData()
      // formData.append('taskActionVo', JSON.stringify(taskActionVo))
      console.log('formData :>> ', formData);
      // if(request.formNo&&!taskActionVo.bpmFormMain.formNo){
      //   alert('Error gonna happen')
      //   reject;
      // }

      vux.loading.show({
        text: '正在为您执行操作！',
      })
      console.log('formData :>> ', formData);

      resolve(httpService(vm).bpmFlowHttpService(formData, {
        headers: {
          'isAjax': 'true'
        }
      }))
    })
  }

  function doNext(action, request) {
    //PASS OR REJECT
    console.log('action', action, ' request', request)

    // return new Promise((resolve, reject) => {
    //   vux.confirm.prompt('请输入审批意见', {
    //     title: '审批意见',
    //     'confirm-text': '确定',
    //     'cancel-text': '取消',
    //     onConfirm: function (val) {
    //       doSaveOrSubmit(action, request, val).then(
    //         res => {
    //           vux.loading.hide()
    //           resolve(res)
    //         },
    //         () => {
    //           reject('error during ' + action)
    //         },
    //       )
    //       vux.loading.show()
    //     },
    //     onCancel: function () {
    //       resolve('skip')
    //     },
    //     onShow() {
    //       if (action === 'PASS') {
    //         vux.confirm.setInputValue('同意')
    //       }
    //     }
    //   })
    // })
  }

  function doConfirm(action, request, val) {
    return new Promise((resolve, reject) => {
      doSaveOrSubmit(action, request, val).then(res => {
        vux.loading.hide()
        resolve(res)
      },
        () => {
          reject('error during ' + action)
        },
      )
      vux.loading.show()
    })

  }


  const baseUrl = ''

  function saveFunction(request) {
    console.log('save', request);
    return doSaveOrSubmit('SAVE', request, '')
  }

  function submitFunction(request) {
    return doSaveOrSubmit('START', request, '')
  }

  function closeFunction(request) {
    if (vuexStore.state.from === 'todo') {
      vuexStore.commit('initState', '');
      const { fullPath = '' } = fromObj;

      if (fullPath.indexOf('/todo') !== -1) {
        routerService.replace(fullPath);
      } else {
        routerService.replace('/todo');
      }
    } else if (vuexStore.state.from === 'overtime') {
      vuexStore.commit('initState', '');
      routerService.replace('/overtime');
    } else if (vuexStore.state.from === 'done') {
      vuexStore.commit('initState', '');
      routerService.replace('/done');
    } else if (vuexStore.state.from === 'draft') {
      vuexStore.commit('initState', '');
      routerService.replace('/draft');
    } else {
      vuexStore.commit('initState', '');
      routerService.replace('/home');
    }
    return new Promise((resolve, reject) => {
      resolve('skip')
    })
  }


  function approvalFunction(request, content) {
    //return doNext('PASS', vuexStore.state.bizObjectData)
    request = vuexStore.state.bizObjectData;
    //付款修订环节修改付款信息
    if (vuexStore.state.taskVars.bpmFormMain && vuexStore.state.taskVars.bpmFormMain.currentTaskDefKey == "PaymentInfoActivity") {
      //  shroffaccount 由getrequest获取
      request.shroffAccount = _.assign(
        request.shroffAccount,
        vuexStore.state.shroffAccount
      )
    }
    return doConfirm('PASS', request, content)
  }

  function rejectFunction(request, content) {
    request = vuexStore.state.bizObjectData;
    //付款修订环节修改付款信息
    if (vuexStore.state.taskVars.bpmFormMain && vuexStore.state.taskVars.bpmFormMain.currentTaskDefKey == "PaymentInfoActivity") {
      request.shroffAccount = _.assign(
        request.shroffAccount,
        vuexStore.state.shroffAccount
      )
    }
    //return doNext('REJECT', vuexStore.state.bizObjectData)
    return doConfirm('REJECT', request, content)
  }

  function recoverFunction(request, content) {
    return doConfirm('RECOVER', vuexStore.state.bizObjectData, content)
  }



  function getParams(name) {
    var search = window.location.search.substring(1)
    if (!search) {
      search = window.location.hash.split('?')[1]
    }
    if (search) {
      var obj = JSON.parse('{"' + decodeURIComponent(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
      return name ? obj[name] : obj
    }
  }


  let flowActionMap = (function () {
    return {
      save: saveFunction,
      submit: submitFunction,
      'PASS': approvalFunction,
      'REJECT': rejectFunction,
      'CLOSE': closeFunction,
      'recover': recoverFunction
    }
  })()

  flowService.getProcessFlowAction = function (action,buttonName) {
    console.log(action,'action')
    optTypeName=buttonName
    return flowActionMap[action]
  }

  return flowService
}

export default initService
