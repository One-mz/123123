<template>
  <van-field type="tel" :rules="rules" ref="numeric" :name="name" :value="amount" @blur="onBlurHandler" @change="onChangeHandler"
    @focus="onFocusHandler" @input="onInput" :label="label||title" input-align="right" :readonly="readonly"
    :placeholder="placeholder" :disabled="disabled" :required="required" label-width="160">
  </van-field>
</template>


<script type="text/javascript">
  import accounting from 'accounting-big';
  export default {
    name: 'VanCurrencyInput',
    data() {
      return {
        amount: 0,
        inputDom: '', // 原生input
        inputSelection: null,
        minusFlag: false,
        plusFlag: false,
        prePlusFlag: false
      }
    },
    computed: {
      // 判断是否是 Internet Explorer 6-11
      isIE() {
        return /*@cc_on!@*/ false || !!document.documentMode;
      },
      isEdge() {
        return !this.isIE && !!window.StyleMedia;
      },
      isSafari() {
        return navigator.userAgent.indexOf("Safari") > 0;
      },
      /**
       * Number type of formatted value.
       * @return {Number}
       */
      amountNumber() {
        return this.unformat(this.amount)
      },
      /**
       * Number type of value props.
       * @return {Number}
       */
      valueNumber() {
        return this.unformat(this.value)
      },
      /**
       * Define decimal separator based on separator props.
       * @return {String} '.' or ','
       */
      decimalSeparatorSymbol() {
        if (typeof this.decimalSeparator !== 'undefined') return this.decimalSeparator
        if (this.separator === ',') return '.'
        return ','
      },
      /**
       * Define thousand separator based on separator props.
       * @return {String} '.' or ','
       */
      thousandSeparatorSymbol() {
        if (typeof this.thousandSeparator !== 'undefined') return this.thousandSeparator
        if (this.separator === '.') return '.'
        if (this.separator === 'space') return ' '
        return ','
      },
      /**
       * Define format position for currency symbol and value.
       * @return {String} format
       */
      symbolPosition() {
        if (!this.currency) return '%v'
        return this.currencySymbolPosition === 'suffix' ? '%v %s' : '%s %v'
      }
    },
    props: {
      name:String,
      rules:Array,
      /**
       * Currency symbol.
       */
      currency: {
        type: String,
        default: '',
        required: false,
      },
      /**
       * Maximum value allowed.
       */
      max: {
        type: Number,
        default: Number.MAX_SAFE_INTEGER || 9007199254740991,
        required: false,
      },
      /**
       * Minimum value allowed.
       */
      min: {
        type: Number,
        default: Number.MIN_SAFE_INTEGER || -9007199254740991,
        required: false
      },
      /**
       * Enable/Disable minus value.
       */
      minus: {
        type: Boolean,
        default: false,
        required: false
      },
      /**
       * Value when the input is empty
       */
      emptyValue: {
        type: [Number, String, null],
        default: '',
        required: false
      },
      /**
       * Number of decimals.
       * Decimals symbol are the opposite of separator symbol.
       */
      precision: {
        type: [Number,String],
        default: 2,
        required: false
      },
      /**
       * Thousand separator type.
       * Separator props accept either . or , (default).
       */
      separator: {
        type: String,
        default: ',',
        required: false
      },
      /**
       * Forced thousand separator.
       * Accepts any string.
       */
      thousandSeparator: {
        default: undefined,
        required: false,
        type: String
      },
      /**
       * Forced decimal separator.
       * Accepts any string.
       */
      decimalSeparator: {
        default: undefined,
        required: false,
        type: String
      },
      /**
       * The output type used for v-model.
       * It can either be String or Number (default).
       */
      outputType: {
        required: false,
        type: String,
        default: 'Number'
      },
      /**
       * v-model value.
       */
      value: {
        type: [Number, String],
        default: 0,
        required: true
      },
      /**
       * Hide input and show value in text only.
       */
      readonly: {
        type: Boolean,
        default: false,
        required: false
      },
      required:{
        type: Boolean,
        default: false
      },
      /**
       * Class for the span tag when readOnly props is true.
       */
      // readOnlyClass: {
      //   type: String,
      //   default: '',
      //   required: false
      // },
      /**
       * Position of currency symbol
       * Symbol position props accept either 'suffix' or 'prefix' (default).
       */
      currencySymbolPosition: {
        type: String,
        default: 'prefix',
        required: false
      },

      // 显示的时候，是否保留精度，即尾部是否添加0
      keepPrecision: {
        type: Boolean,
        default: true,
        required: false,
      },
      // 输入框的label
      label: {
        type: String,
        default: '',
        required: false,
      },
      title:{
        type: String,
        default: '',
        required: false,
      },
      // 提示语
      placeholder: {
        type: String,
        default: '',
        required: false,
      },
      isEmpty: {
        required: false,
        type: Boolean,
      },
      disabled: Boolean,
    },
    watch: {
      /**
       * Watch for value change from other input with same v-model.
       * @param {Number} newValue
       */
      valueNumber(newValue) {
        if (this.$refs.numeric !== document.activeElement) {
          this.amount = this.format(newValue)
        }
      },
      /**
       * When readOnly is true, replace the span tag class.
       * @param {Boolean} newValue
       * @param {Boolean} oldValue
       */
      // readOnly (newValue, oldValue) {
      //   if (oldValue === false && newValue === true) {
      //     this.$nextTick(() => {
      //       this.$refs.readOnly.className = this.readOnlyClass
      //     })
      //   }
      // },
      /**
       * Immediately reflect separator changes
       */
      separator() {
        this.process(this.valueNumber)
        this.amount = this.format(this.valueNumber)
      },
      /**
       * Immediately reflect currency changes
       */
      currency() {
        this.process(this.valueNumber)
        this.amount = this.format(this.valueNumber)
      },
      /**
       * Immediately reflect precision changes
       */
      precision() {
        this.process(this.valueNumber)
        this.amount = this.format(this.valueNumber)
      },
      // 立即反应最大最小值的变更
      min() {
        this.process(this.valueNumber)
        this.amount = this.format(this.valueNumber)
      },
      max() {
        this.process(this.valueNumber)
        this.amount = this.format(this.valueNumber)
      },
    },
    mounted() {
      // Set default value props when placeholder undefined.
      // if (!this.placeholder) {
      if (this.isEmpty && this.value == 0) {
        this.amount = ""
        return;
      }
      this.process(this.valueNumber)
      this.amount = this.format(this.valueNumber)

      this.inputDom = this.$refs.numeric.$refs.input;
      this.inputDom.blur();

      // In case of delayed props value.
      setTimeout(() => {
        this.process(this.valueNumber)
        this.amount = this.format(this.valueNumber)

        this.inputDom.blur();
      }, 500)
    },
    methods: {
      validate(){
        // this.$refs.numeric.validate().then((res,err)=>{
        //   console.log('res :>> ', res);
        //   console.log('err :>> ', err);
        // })
      },
      /**
       * Handle blur event.
       * @param {Object} e
       */
      onBlurHandler(e) {
        this.$emit('blur', this.amountNumber)
        //if(this.isIE || this.isEdge ) {
        // IE浏览器，js设置千分位后，无法触发change事件，手动触发
        this.process(this.amountNumber)
        //}

        this.amount = this.format(this.valueNumber)
      },
      /**
       * Handle focus event.
       * @param {Object} e
       */
      onFocusHandler(e) {
        if (this.readonly) {
          return;
        }
        this.$emit('focus', e)
        if (this.valueNumber === 0) {
          this.amount = null
        } else {
          this.amount = this.format(this.valueNumber)
        }

      },
      /**
       * Handle input event.
       */
      onChangeHandler() {
      },
      onInput(value) {

        if (!value) {
          return
        }
        // 在 onChange 时记录光标的位置
        let intValue;
        if (value.indexOf('.') !== -1) {
          intValue = value.substring(0, value.indexOf('.'));
        } else {
          intValue = value
        }
        let intStr = intValue + '';

        if (intStr.length % 4 == 1 && intStr.split(',')[0].length == 2) {
          this.prePlusFlag = true
        }
        //千分位刚好增加 1,234
        if (intStr.split(',')[0].length == 1 && intStr.length % 4 == 1 && !this.prePlusFlag) {
          this.plusFlag = true
        }

        //千分位刚好删除如1,34
        if (intStr.length % 4 == 0 && intStr.length > 1) {
          let count = 0;
          intStr.split(',').forEach(item => {
            if (item.length < 3) {
              count++
            }
          })
          if (count > 1) {
            // console.log('intStr22222', intStr);
            this.minusFlag = true

          }
        }

        if (this.inputDom) {
          this.inputSelection = {
            start: this.inputDom.selectionStart,
            end: this.inputDom.selectionEnd,
            beforeStr: value.slice(0, this.inputDom.selectionStart),
            afterStr: value.slice(this.inputDom.selectionStart),
          };

          // 如果在中间编辑，并且删除的是千分位
          if (this.inputSelection.afterStr) {
            const str = `${this.inputSelection.beforeStr},${this.inputSelection.afterStr}`

            const formatStr = accounting.formatMoney(value, {
              symbol: this.currency,
              format: this.symbolPosition,
              precision: 0,
              decimal: this.decimalSeparatorSymbol,
              thousand: this.thousandSeparatorSymbol,
            });
            // 相等代表的是，删除的千分位
            if (str === formatStr) {
              value = this.inputSelection.beforeStr.slice(0, -1) + this.inputSelection.afterStr;
              // console.log('删除千分位', value);
            }
          }
        }


        // console.log('amountChanging', value);
        if (value === '') {
          this.amount = null
        } else {

          if (this.precision === 0) {
            if (value === '-') {
              this.amount = value;
              return
            }

            value = this.unformat(value);
            // console.log('amountUnformat', value);

            this.amount = accounting.formatMoney(value, {
              symbol: this.currency,
              format: this.symbolPosition,
              precision: 0,
              decimal: this.decimalSeparatorSymbol,
              thousand: this.thousandSeparatorSymbol
            })
          } else {

            if (value === '-') {
              this.amount = value;
              return
            }

            // 将中文输入。转为英文小数点
            if (value.indexOf('。') !== -1) {
              value = value.replace(/。/g, '.')
            }

            // 将value中分为两部分，一部分是小数点前部分，另外一部分是小数点之后
            // 有小数点
            if (value.indexOf('.') !== -1) {

              let intValue = value.substring(0, value.indexOf('.'));
              let otherValue = value.substring(value.indexOf('.'));

              intValue = this.unformat(intValue);

              intValue = accounting.formatMoney(intValue, {
                symbol: this.currency,
                format: this.symbolPosition,
                precision: 0,
                decimal: this.decimalSeparatorSymbol,
                thousand: this.thousandSeparatorSymbol
              })

              this.amount = intValue + otherValue;


            } else {
              value = this.unformat(value);
              // console.log('amountUnformat', value);

              this.amount = accounting.formatMoney(value, {
                symbol: this.currency,
                format: this.symbolPosition,
                precision: 0,
                decimal: this.decimalSeparatorSymbol,
                thousand: this.thousandSeparatorSymbol
              })
            }


          }
        }

        this.$nextTick(() => {
          if (this.inputSelection && this.amount) {
            // 在 格式化 时根据情况恢复光标的位置

            // 光标之后的原字符串存在，代表在中间编辑
            if (this.inputSelection.afterStr) {
              // console.log('渲染值,', this.amount);
              const input = this.inputDom;

              let start = this.amount.length - this.inputSelection.afterStr.length;
              if (this.plusFlag) {
                start++
                this.prePlusFlag = false
                this.plusFlag = false
              }
              if (this.minusFlag) {
                start--
                this.minusFlag = false
              }
              // console.log(start);
              input.selectionStart = start < 0 ? 0 : start;
              input.selectionEnd = start < 0 ? 0 : start;

              this.inputSelection = null;
            }
          }
        });

        // console.log('onInput amountChanging', this.amount);
        // console.log('onInput amountNumber', this.amountNumber);
      },

      /**
       * Validate value before update the component.
       * @param {Number} value
       */
      process(value) {
        if (value >= this.max) this.update(this.max)
        if (value <= this.min) this.update(this.min)
        if (value > this.min && value < this.max) this.update(value)
        if (!this.minus && value < 0) this.min >= 0 ? this.update(this.min) : this.update(0)
      },
      /**
       * Update parent component model value.
       * @param {Number} value
       */
      update(value) {
        const fixedValue = accounting.toFixed(value, this.precision)
        const output = this.outputType.toLowerCase() === 'string' ? fixedValue : Number(fixedValue)
        this.$emit('input', output)
      },

      // 去除小数后面多余的0
      deleteZero(moneyStr) {
        // 不是小数
        const index = moneyStr.indexOf('.');
        if (index === -1) {
          return moneyStr;
        }

        const smallValuePart = moneyStr.substring(index + 1);
        let zeroTimes = 0;
        for (let i = smallValuePart.length; i > 0; i--) {
          const zeroString = ''.padEnd(i, '0');
          if (smallValuePart.endsWith(zeroString)) {
            zeroTimes = i;
            break;
          }
        }
        // console.log('小数尾部有几个0', zeroTimes);

        const value = this.unformat(moneyStr);

        return accounting.formatMoney(value, {
          symbol: this.currency,
          format: this.symbolPosition,
          precision: Number(this.precision) - zeroTimes,
          decimal: this.decimalSeparatorSymbol,
          thousand: this.thousandSeparatorSymbol,
        });
      },

      /**
       * Format value using symbol and separator.
       * @param {Number} value
       * @return {String}
       */
      format(value) {
        const result = accounting.formatMoney(value, {
          symbol: this.currency,
          format: this.symbolPosition,
          precision: Number(this.precision),
          decimal: this.decimalSeparatorSymbol,
          thousand: this.thousandSeparatorSymbol
        });
        if (this.keepPrecision) {
          return result;
        }

        return this.deleteZero(result);
      },
      /**
       * Remove symbol and separator.
       * @param {Number} value
       * @return {Number}
       */
      unformat(value) {
        const toUnformat = typeof value === 'string' && value === '' ? this.emptyValue : value
        return accounting.unformat(toUnformat, this.decimalSeparatorSymbol)
      }
    }
  }

</script>

<style>

</style>
