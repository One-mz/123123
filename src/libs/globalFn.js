/* eslint-disable */
import * as moment from 'moment';
import accounting from 'accounting-big';


import Big from 'big.js/big.mjs';

import Vue from 'vue';




const plugin = {
  install: (Vue, options) => {
    // 将搜索参数转换为 后台支持参数结构
    Vue.prototype.convertDataModel2SubmitObj = obj => {
      const submitObj = {};
      Object.keys(obj).forEach(e => {
        submitObj[`vars['${e}']`] = obj[e];
      });
      return submitObj;
    };

    // 将小驼峰式 转换为 大写下划线
    Vue.prototype.lowerCamel2UpperUnderscore = str => {
      return str.replace(/([A-Z])/g, '_$1').toUpperCase();
    };

    // 将大写下划线 转换为 小驼峰式
    Vue.prototype.upperUnderscore2LowerCamel = str => {
      return str.toLowerCase().replace(/_(\w)/g, function(all, letter) {
        return letter.toUpperCase();
      });
    };

    // 直接使用lodash的工具方法
    // 将对象转换为 实体风格（小驼峰式）
    Vue.prototype.entityParamType = obj => {
      const submitObj = {};
      Object.keys(obj).forEach(e => {
        submitObj[`vars['${e}']`] = obj[e];
      });
      return submitObj;
    };

    // 将对象转换为 数据库风格（大写下划线）
    Vue.prototype.databaseParamType = obj => {
      const ret = {};
      Object.keys(obj).forEach(e => {
        const len = e.split("_").length;
        // 最多分为两部分
        const arr = e.split('_', len);

        const newKey = Vue.prototype.lowerCamel2UpperUnderscore(arr[0]);
        if (arr.length === 1) {
          ret[newKey] = obj[e];
        } else if(arr.length === 2) {
          ret[`${newKey}_${arr[1]}`] = obj[e];
        } else if(arr.length === 3){
          ret[`${newKey}_${arr[1]}_${arr[2]}`] = obj[e];
        }
      });
      return ret;
    };

    // 将 下拉基础数据Key list转换
    Vue.prototype.getEnumParams = (companyCode, enumCodeList) => {
      return enumCodeList.map(e => {
        return {
          companyCode,
          enumCode: e,
        };
      });
    };

    // 将下拉数据 res转换为前台结构 label，value
    Vue.prototype.convertAndSort = (list) => {
      return list.filter(e => e.isActive).map((e) => {
        return {
          ...e,
          value: e.enumValue,
          label: e.enumCnValue,
          text: e.enumCnValue,
          name: e.enumCnValue,
        };
      }).sort((a, b) => a.sortNum - b.sortNum);
    };


    // 查询匹配拼音的数据。 返回位置信息或者false
    Vue.prototype.matchPinyin = (string, input) => {
      return PinyinMatch.match(string, input);
    };

    Vue.prototype.formatTime = function(time, format = 'YYYY-MM-DD') {
      return time ? moment(time).format(format) : '';
    };

    Vue.prototype.formatRatio = function(num) {
      return Number(num) * 100;
    };

    Vue.prototype.formatRatioToFixed = function(num) {
      return (Number(num) * 1000000 / 10000).toFixed(2);
    };

    Vue.prototype.formatMoney = (value, precision = 2) => {
      // 防止后台传null和undefined
      if (value === null || value === undefined) {
        value = '';
      }
      return accounting.formatMoney(Number(value), {
        symbol: '¥',
        format: '%v',
        precision: Number(precision),
        decimal: '.',
        thousand: ',',
      });
    };

    Vue.prototype.unFormatMoney = (value) => {
      // 防止后台传null和undefined
      if (value === null || value === undefined) {
        value = '';
      }
      return accounting.unformat(value, '.');
    };

    Vue.prototype.formatMoney2 = function(
      number,
      decimals = 0,
      decPoint = '.',
      thousandsSep = ',',
    ) {
      number = (number + '').replace(/[^0-9+-Ee.]/g, '');
      let n = !isFinite(+number) ? 0 : +number;
      let prec = !isFinite(+decimals) ? 0 : Math.abs(decimals);
      let sep = typeof thousandsSep === 'undefined' ? ',' : thousandsSep;
      let dec = typeof decPoint === 'undefined' ? '.' : decPoint;
      let s = '';
      let toFixedFix = function(n, prec) {
        let k = Math.pow(10, prec);
        return '' + Math.ceil(n * k) / k;
      };
      s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
      let re = /(-?\d+)(\d{3})/;
      while (re.test(s[0])) {
        s[0] = s[0].replace(re, '$1' + sep + '$2');
      }
      if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
      }
      return s.join(dec);
    };

    Vue.prototype.formatter = value => {
      return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    Vue.prototype.parser = value => {
      return value.replace(/\$\s?|(,*)/g, '');
    };

    // big.js 解决浮点计算精度问题
    Vue.prototype.toFixed = (value, dp = 2) => {
      return Number(Big(value).toFixed(dp));
    };

    // 自定义全局Validator
    Vue.prototype.gtZeroValidator = (value, rule, callback) => {
      // 必须大于0！
      let num = value.split(',').join('')
      
      return num > 0
    };
    Vue.prototype.gtZeroValidator.message = '必须大于0！'
    Vue.prototype.gtEqualZeroValidator = (value, rule, callback) => {
      return value >= 0
    };
    Vue.prototype.gtEqualZeroValidator.message = '必须大于等于0！'
    Vue.prototype.notEqualZeroValidator = (value, rule , callback) => {
      return value != 0
    };
    Vue.prototype.notEqualZeroValidator.message = '不能等于0！'
    // 银行账号验证
    Vue.prototype.bankAccountValid = (rule, value, callback) => {
      const strBin = '10,18,30,35,37,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,58,60,62,65,68,69,84,87,88,94,95,98,99'
      if (!value) {
        callback(new Error('收款账户不能为空'))
      } else if (!Number.isInteger(+value)) {
        callback(new Error('银行卡号必须全为数字'))
      } else if (value.trim().length < 12 || value.trim().length > 19) {
        callback(new Error('银行卡号长度必须在12到19之间'))
      } else if (strBin.indexOf(value.substring(0, 2)) === -1) {
        callback(new Error('银行卡号开头6位不符合规范'))
      } else {
        callback()
      }
    };


    Vue.prototype.uuid = () => {
      let s = [];
      const hexDigits = '0123456789abcdef';
      for (let i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
      }
      s[14] = '4';  // bits 12-15 of the time_hi_and_version field to 0010
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
      s[8] = s[13] = s[18] = s[23] = '-';
      const uuid = s.join('');
      return uuid;
    };

    Vue.prototype.randomId = () => {
      return parseInt(Math.random() * 10000000000);
    };

  },
};

export default plugin;
