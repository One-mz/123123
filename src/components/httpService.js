import qs from 'qs'
var domain = process.env.VUE_APP_BASE_API;
// var VUE_APP_LOGIN_API = process.env.VUE_APP_LOGIN_API;
import request from '@/components/common/request'

function httpServiceFactory(vm) {

    function wxValid(data) {
        return request.post('/external/common/valid.do', qs.stringify(data), {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
            data: qs.stringify(data)
        });
    }

    function draftHttp() {
        // return esbUrl + '/ESBWeb/servlets/26029.fssc.getMySendTasks@1.0@zn.fssc'
        return domain + '/task/mySendWorkGrid.do'
    };
    function getValidImage() {
        // return esbUrl + '/ESBWeb/servlets/26029.fssc.getMySendTasks@1.0@zn.fssc'
        return domain+'/verifyCode.do'
    };
    // 这几个都依赖userId
    function todoHttp() {
        // return esbUrl + '/ESBWeb/servlets/26030.fssc.getMyTodoTasks@1.0@zn.fssc'
        return domain + '/task/todoWorkGrid.do'
    };

    function doneHttp() {
        // return esbUrl + '/ESBWeb/servlets/26028.fssc.getMyCompletedTasks@1.0@zn.fssc'
        return domain + '/task/completedWorkGrid.do'
    };



    function dropDownService(data) {
        // return request.post(esbUrl + '/ESBWeb/servlets/26004.fssc.bpmEnumCriteria@1.0@zn.fssc', vars)
        return request.post(domain + '/common/dataDictionary/getFiltersAll.do', qs.stringify(data), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;UTF-8'
            }
        })
    };

    function bpmListService(url, params) {
        //return request.get(url, params)
        //"http://10.165.18.52:8081/fssc-pc/bpm/getMySendTasks.do"
        let formData = new FormData();
        Object.keys(params.params).forEach(item => {
            formData.append(item, params.params[item]);
        })
        return request.post(url, formData)
    };

    function borrowOffsetService(params) {
        // return request.post(esbUrl + '/ESBWeb/servlets/26026.fssc.getBorrowOffInfo@1.0@zn.fssc', params)
        let formData = new FormData();
        Object.keys(params).forEach(item => {
            formData.append(item, params[item]);
        })
        return request.post(domain + '/fssc/common/offset/getBorrowOffInfo', formData)
    }


    function selectorService(requestUrl, formdata) {
        return request.post(requestUrl, formdata)
    };

    /* 影像系统涉及接口 - 结束 */

    // employeeLoan
    function getTaskRefVars(formData) {
        // return request.post(esbUrl + '/ESBWeb/servlets/26006.fssc.getTaskRefVars@1.0@zn.fssc', formdata)
        return request.post(domain + '/mobile/task/queryBusinessInfo.do',  qs.stringify(formData), {
            headers: {
                'loading': 'false',
                'Content-Type': 'application/x-www-form-urlencoded;UTF-8'
            },
        })
    };
    function finishStep(data) {
        return request.post(domain + '/mobile/task/finishStep.do',  data, {
            headers: {
                'Content-Type': 'application/json;UTF-8'
            },
            data
        })
    };

    //  login
    function loginIndexService(params) {
        // return request.post(esbUrl + '/ESBWeb/servlets/26013.fssc.loginAjax@1.0@zn.fssc', params)
        return request.post(domain + '/loginAjax.do', params)
    };

    //  logout
    function logoutIndexService() {
        // 目前无对应的  esb
        return request.post(domain + '/logOut.do')
    };

    //recieveInfo
    function recieveInfoBankAccountService(params) {
        // return request.post(esbUrl + '/ESBWeb/servlets/26015.fssc.bankAccountDatagrid@1.0@zn.fssc', params)
        return request.post(domain + '/common/bankAccount/getFiltersAll.do', params)
    };


    function todoMainService(params) {
        // return request.post(esbUrl + '/ESBWeb/servlets/26017.fssc.openTodoTask@1.0@zn.fssc', params)
        return request.post(domain + '/bpm/openTodoTask.do', params)
    }

    //travel

    //我的发票相关
    function getInvoicesList(formdata) {
        return request.post(
            // esbUrl + '/ESBWeb/servlets/26044.fssc.getMyRefInvoiceData@1.0@zn.fssc', formdata)
            domain + '/common/myRefInvoice/getMyRefInvoiceData.do', formdata)
    }

    function getInvoiceItemByInvoiceId(formdata) {
        return request.post(
            domain + '/personal/myRefInvoice/getInvoiceItemByInvoiceId.do', formdata)
    }

    function companyRefTaxnum(formdata) {
        return request.post(
            // esbUrl + '/ESBWeb/servlets/26052.fssc.companyRefTaxnum@1.0@zn.fssc', formdata)
            domain + '/fssc/common/companyRefTaxnum/dataGrid.do', formdata)
    }


    // 获取币种选择
    function getCurrencyOptions(data) {
        return request.post(domain + '/fssc/basic/currency/getFiltersAll.do', qs.stringify(data), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;UTF-8'
            },
            data: qs.stringify(data)
        });
    }


    //   流程图
    function getProcessImageByProcInstId() {
        return domain + '/flow/instance/getProcessImageByProcInstId'
    }


    return {
        getCurrencyOptions,
        getProcessImageByProcInstId,
        bpmListService: bpmListService,
        selectorService: selectorService,
        getTaskRefVars: getTaskRefVars,
        borrowOffsetService: borrowOffsetService,
        dropDownService,
        loginIndexService: loginIndexService,
        logoutIndexService: logoutIndexService,
        recieveInfoBankAccountService: recieveInfoBankAccountService,
        todoMainService: todoMainService,
        draftHttp: draftHttp,
        doneHttp: doneHttp,
        todoHttp: todoHttp,
        //我的发票相关
        getInvoicesList: getInvoicesList,
        getInvoiceItemByInvoiceId: getInvoiceItemByInvoiceId,
        companyRefTaxnum: companyRefTaxnum,
        getValidImage:getValidImage,
        wxValid,
        finishStep
    }
}

export default httpServiceFactory
