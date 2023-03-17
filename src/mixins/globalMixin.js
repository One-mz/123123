import Vue from 'vue';
import { mapState, mapGetters } from 'vuex';
import { Dialog } from 'vant'
import _ from 'lodash';
import $httpService from '@/components/httpService'

Vue.mixin({
  data() {
    return {

    };
  },


  mounted() {

  },

  computed: {
    ...mapState({
      payTaxName: state => state.bpmInfo.payTaxName,
    }),

  },

  methods: {
    formatterNum(row, column) {
      return this.formatMoney(row[column.property || column.prop]);
    },
    formatterDay(row, column) {
      return this.formatTime(row[column.property], 'YYYY-MM-DD');
    },
    // 计算可抵扣税额
    calculateDeductibleTax(invoice, claimAmount) {
      let {
        typeCode = '',

        priceTaxAmount = '',
        taxAmount = '',
        ticketPrice = '',
        fuelSurcharge = '',
        taxRatio = '',
        invoiceItems = [],
      } = invoice;

      // 小规模纳税人，可抵扣税额为0
      if (Number(priceTaxAmount) == 0 || this.payTaxName === '小规模纳税人') {
        return 0;
      }

      // UIG-FSSC #14027 通用-滴滴发票计算抵扣逻辑补充
      // 如识别到商品服务为“运输服务*客运服务费”，则该发票视同增值税专票类型，进行可抵扣税的计算
      if (['05'].includes(typeCode)) {
        if (invoiceItems.length === 0 || invoiceItems.some(e => e.commodityName !== '*运输服务*客运服务费')) {
          return 0;
        } else {
          //  金额÷（1+税率）*税率*（报销金额/金额）
          // return this.toFixed((Number(priceTaxAmount) / (1 + Number(taxRatio)) * Number(taxRatio) * 1) *
          //   (Number(claimAmount) / Number(priceTaxAmount)))

          // 如果全额报销，取票面的税额
          // 因为原发票可能有多个发票条目，这边根据总金额的公式算的，会有尾差
          if (Number(claimAmount) === Number(priceTaxAmount)) {
            return this.toFixed(taxAmount)
          }

          // 部分报销的情况下，如果是多明细的税率不相同，计算可抵扣税额，应该按照比例来计算
          let ratio = Number(claimAmount) / Number(priceTaxAmount);
          return this.toFixed(Number(taxAmount) * ratio);
        }
      }

      // 一、不能抵扣
      // 04: 增值税普通发票、
      // 05: 增值税电子普通发票
      // 06: 高速公路通行发票 3%固定税率 --- // UIG-FSSC #14478 2018年7月以后通行费纸质版票据不能抵扣进行税额，目前共享系统自动进行了抵扣
      // 08: 其他通行费发票
      // 10: 其他发票
      // 34: 未注明旅客身份信息的公路、水路等其他客票
      // 50: 二手车销售统一发票
      if (['04', '05', '06', '08', '10', '34', '50'].includes(typeCode)) {
        return 0;
      }

      // 二、计算抵扣
      // 07: 桥、闸通行费发票 5%固定税率
      // 31: 航空运输电子客票行程单 9%固定税率
      // 32: 铁路车票 9%固定税率
      // 33: 注明旅客身份信息的公路、水路等其他客票 3%固定税率
      // 09: 农产品发票

      if (['07', '31', '32', '33', '09'].includes(typeCode)) {
        switch (typeCode) {
          case '07':
            taxRatio = 0.05;
            break;
          case '31':
            // 航空运输电子客票行程单
            // (票价+燃油附加费）÷（1+9%）*9%*（报销金额/合计金额）
            taxRatio = 0.09;
            return this.toFixed(((Number(ticketPrice) + Number(fuelSurcharge)) / (1 + Number(taxRatio)) * Number(taxRatio) * 1) *
              (Number(claimAmount) / Number(priceTaxAmount)))
            break;
          case '32':
          case '09':
            taxRatio = 0.09;
            break;
          case '33':
            taxRatio = 0.03;
            break;
        }

        // 因为这些票，没有票面税额，就不根据比例去计算可抵扣税额，使用公式计算

        //  金额÷（1+税率）*税率*（报销金额/金额）
        return this.toFixed((Number(priceTaxAmount) / (1 + Number(taxRatio)) * Number(taxRatio) * 1) *
          (Number(claimAmount) / Number(priceTaxAmount)))
      }

      // 三、认证抵扣
      // 01: 增值税专用发票
      // 03: 机动车销售统一发票
      // 20: 增值税电子专用发票
      // 11: 通行费电子发票
      // 41: 海关缴款书
      if (['01', '03', '20', '11', '41'].includes(typeCode)) {
        //  金额÷（1+税率）*税率*（报销金额/金额）
        // return this.toFixed((Number(priceTaxAmount) / (1 + Number(taxRatio)) * Number(taxRatio) * 1) *
        //   (Number(claimAmount) / Number(priceTaxAmount)))

        // 如果全额报销，取票面的税额
        // 因为原发票可能有多个发票条目，这边根据总金额的公式算的，会有尾差

        if (Number(claimAmount) === Number(priceTaxAmount)) {
          return this.toFixed(taxAmount)
        }

        // 部分报销的情况下，如果是多明细的税率不相同，计算可抵扣税额，应该按照比例来计算
        let ratio = Number(claimAmount) / Number(priceTaxAmount);
        return this.toFixed(Number(taxAmount) * ratio);
      }

      return 0;
    },
    getSapExchangeRate: _.memoize(async (currencyFrom='',currencyTo='',date)=>{
      console.log('enter :>> ', currencyFrom,currencyTo);
      if(!currencyFrom){
        console.warn('getSapExchangeRate: currencyFrom为空')
        return 0
      }
      if(!currencyTo){
        console.warn('getSapExchangeRate： currencyTo为空')
        return 0
      }
      if(currencyFrom === currencyTo){
        return 1
      }

      // 月份提取
      let time = date? new Date(time): new Date()
      let YYYYMM = time.getFullYear()+'-'+(('0'+(time.getMonth()+1)).slice(-2))
      console.log('this :>> ', this);
      const res = await $httpService().exchangerate({
        // exchangeRateType:'M',
        currencyFrom,
        currencyTo,
        exchangeRateType:'M',
        validForm:YYYYMM
      })
      if(res.data && res.data.exchangeRate){
        let exchangeRate = Number(res.data.exchangeRate)
        if(exchangeRate<0){
          // 负汇率  既是类似人民币=>美元  汇率 = -1/负汇率
          return -1/exchangeRate
        }else{
          return exchangeRate
        }
      }else{
        return 0  // 没有相关汇率
      }
    },(currencyFrom='',currencyTo='',date)=>{
      let time = date? new Date(time): new Date()
      let YYYYMM = time.getFullYear()+'-'+(('0'+(time.getMonth()+1)).slice(-2))
      return currencyFrom+'to'+currencyTo+'-time:'+YYYYMM
    }),
    checkIsOneTimeVendor(vendorTypeCode){
      let oneTimeVendorArr = []
      if(process.env.NODE_ENV === 'production' ){
        oneTimeVendorArr = ['1000','2000','3000','CPD']
      }else{
        oneTimeVendorArr = ['CPD']
      }
      console.log('oneTimeVendorArr :>> ', oneTimeVendorArr);
      return oneTimeVendorArr.includes(vendorTypeCode)
    },
    alertValidateMsg(errObj) {
      if (_.isEmpty(errObj)) {
        return;
      }
      let errInfo = '';
      for (const key in errObj) {
        errInfo += `<div>${errObj[key].message}</div>`
      }

      /*this.$alert(errInfo, "校验失败！", {
        type: "error",
        dangerouslyUseHTMLString: true,
      });*/
      Dialog.alert({
        title: '校验失败！',
        message: errInfo,
      }).then(() => {
        // on close
      });
    },
  },
});
