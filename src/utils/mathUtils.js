/**
 * 实现功能：JavaScript的加减乘除运算工具类
 * @author Liu, Tang
 * @version 1.0.0
 */
 export var MathUtil = {
  /**
   * @param arg1 乘数
   * @param arg2 被乘数
   */
  accMul : function (arg1, arg2) {
      var m = 0, s1 = arg1 + "", s2 = arg2 + "";
      try {
          m += s1.split(".")[1].length
      } catch (e) {
      }
      try {
          m += s2.split(".")[1].length
      } catch (e) {
      }
      return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
  },
  /**
   * @param arg1 除数
   * @param arg2 被除数
   */
  accDiv : function (arg1, arg2) {
      return this.accMul(arg1, this.scienceNum(1 / arg2));
  },
  /**
   * @param arg1 加数
   * @param arg2 被加数
   */
  accAdd : function (arg1, arg2) {
      var r1, r2, m;
      try {
          r1 = arg1.toString().split(".")[1].length
      } catch (e) {
          r1 = 0
      }
      try {
          r2 = arg2.toString().split(".")[1].length
      } catch (e) {
          r2 = 0
      }
      m = Math.pow(10, Math.max(r1, r2));
      return (this.accMul(arg1, m) + this.accMul(arg2, m)) / m;
  },
  /**
   * @param arg1 减数
   * @param arg2 被减数
   */
  accSub : function (arg1, arg2) {
      return this.accAdd(arg1, -arg2);
  },

  /** 格式化金额 **/
  fmoney : function(s, n) {
      if(s == '' || !s){
          return s;
      }
      n = n > 0 && n <= 20 ? n : 2;
      if(s < 0){
        s = Math.abs(s);
        s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
          var l = s.split(".")[0].split("").reverse(), r = s.split(".")[1];
          var t = "";
          for (var i = 0; i < l.length; i++) {
              t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
          }
          return "-"+t.split("").reverse().join("") + "." + r;
      }else{
        s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
          var l = s.split(".")[0].split("").reverse(), r = s.split(".")[1];
          var t = "";
          for (var i = 0; i < l.length; i++) {
              t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
          }
          return t.split("").reverse().join("") + "." + r;
      }


  },

  /** 格式化分位金额为数字 **/
  rmoney : function(s) {
      return parseFloat(s.replace(/[^\d\.-]/g, ""));
  },
  scienceNum : function(value) {
    value = value + "";
  if(!this.isEmpty(value)) {
    var num = 0;
    if((num = value.indexOf('E')) != -1 || (num = value.indexOf('e')) != -1) {
      var doubleStr = value.substring(0, num);
      var eStr = value.substring(num + 1, value.length);
      eStr = parseInt(eStr);
      var doubleStrList = doubleStr.split('.');
      var doubleStr1 = doubleStrList[0];
              var doubleStr2 = doubleStrList[1] ? doubleStrList[1] : '0';

      if(eStr > 0){
        //eStr大于零向后补位
        if(doubleStr2.length > eStr) {
          var nums = doubleStr2.substring(0, eStr);
          var nume = doubleStr2.substring(eStr, doubleStr2.length);
          doubleStr = doubleStr1 + nums + '.' + nume;
        } else if(doubleStr2.length < eStr) {
          var indexNum = eStr - doubleStr2.length;
          //用0补齐
          var str = '';
          for(var i = 0; i < indexNum; i++) {
            str += '0';
          }
          doubleStr = doubleStr1 + doubleStr2 + str;
        } else {
          doubleStr = doubleStr1 + doubleStr2;
        }
        value = doubleStr;
        //千分位
      }else{
        //eStr小于零向钱补位
        eStr = Math.abs(eStr);
        var doubleStrList = doubleStr.split('.');
        var doubleStr1 = doubleStrList[0];
                  var doubleStr2 = doubleStrList[1] ? doubleStrList[1] : '0';
        var floatStr = "0.";
        for(var i=1; i<eStr; i++){
          floatStr = floatStr + "0";
        }
        value = floatStr + doubleStr1 + doubleStr2;
      }

    }
  }
  return value;
},
  isEmpty : function(value) {
  if(value.length < 1) {
    return true;
  }
  return false;
  },
  /**
   * 校验金额信息
   * @param target
   * @returns {Boolean}
   */
  validDigit: function (target) {
      if (target) {
          var value = $(target).val();
          if (!/^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value)) {
              artDialogWin({
                  title: '提示',
                  content: "请输入合法的数字!"
              });
              $(target).val('');
              return false;
          }
      }
      return true;
  },

};
