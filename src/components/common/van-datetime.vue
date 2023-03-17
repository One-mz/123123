<template>
  <div>
    <van-field
      :value="showText"
      :is-link="!(disabled ||readonly)"
      readonly
      :label="label"
      :placeholder="placeholder"
      @click="clickField"
      input-align="right"
      :name="name"
      :rules="rules"
      :required="required"
    />
    <van-popup v-model="showPicker" round position="bottom" get-container="#app">
      <van-datetime-picker
        :value="dateValue"
        :type="type"
        @cancel="showPicker = false"
        @confirm="onConfirm"
        :show-toolbar="true"
        :fileter="fileter"
        :title="formatObj[type].title"
        :min-date="startDate"
        :max-date="endDate"
      />
    </van-popup>
  </div>
</template>
<script>
  import moment from 'moment'

export default {
  name:'VanDateTime',
  model:{
    prop: 'value',
    event: 'change'
  },
  props:{
    // 时间类型，可选值为 date time year-month month-day datehour
    type:{
      type:String,
      // required:true,
      default: 'date'
    },
    required:Boolean,
    name:String,
    rules:Array,
    disabled:{
      type:Boolean,
      default: false
    },
    readonly:{
      type:Boolean,
      default: false
    },
    label:{
      type: String,
      default: ''
    },
    placeholder:{
      type: String,
      default: '请选择'
    },
    value:{
      type: [Array,Object,String,Number,Date],
      default:null
    },
    minDate:{
      type: [Array,Object,String,Number,Date],
      default:()=>new Date(new Date().getTime()-315360000000)
    },
    maxDate:{
      type: [Array,Object,String,Number,Date],
      default:()=>new Date(new Date().getTime()+315360000000)
    },
    fileter:{
      type : Function,
    },
  },
  data(){
    return {
      showPicker:false , // 弹窗显示
      formatObj:{
        datetime:{
          format:'YYYY-MM-DD hh:mm',
          title:'选择完整时间'
        },
        date:{
          format:'YYYY-MM-DD',
          title:'选择年月日'
        },
        time:{
          format:'hh:mm',
          title:'选择时分'
        },
        'year-month':{
          format:'YYYY-MM',
          title:'选择年月'
        },
        'month-day':{
          format:'MM-DD',
          title:'选择月日'
        },
        'datehour':{
          format:'YYYY-MM-DD hh',
          title:'选择年月日小时'
        },


      },

    }
  },
  computed:{
    showText(){
      if(this.value){
        return moment(this.value).format(this.formatObj[this.type].format)
      }else{
        return ''
      }
    },
    startDate(){
      if(!this.minDate){
        return new Date(new Date().getTime()-315360000000)
      }
      return new Date(this.minDate)
    },
    endDate(){
      if(!this.maxDate){
        return new Date(new Date().getTime()+315360000000)
      }
      return new Date(this.maxDate)
    },
    dateValue(){
      if(!this.value){
        return new Date(new Date().getTime())
      }
      return new Date(this.value)
    }
  },
  methods:{
    clickField(){
      if(this.disabled || this.readonly){
        return
      }else{
        this.showPicker = true
      }
    },
    onConfirm($event){
      // console.log(new Date($event));/
      this.showPicker = false
      this.$emit('change',moment($event).format(this.formatObj[this.type].format))
      this.$emit('onConfirm',moment($event).format(this.formatObj[this.type].format))
    },
    validate(){

    }
  }

}
</script>
