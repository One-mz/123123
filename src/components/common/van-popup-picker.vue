<template>
  <div>
    <van-field
      :value="showText"
      :is-link="!disabled"
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
      <van-picker
        :columns="columns"
        @cancel="showPicker = false"
        @confirm="onConfirm"
        :show-toolbar="true"
      >
      <template #title>
        <slot name="title"></slot>
			</template>
      </van-picker>
    </van-popup>
  </div>
</template>
<script>
export default {
  name:'VantPopupPicker',
  model:{
    prop: 'value',
    event: 'change'
  },
  props:{
    name:String,
    rules:Array,
    required:Boolean,
    disabled:{
      type:Boolean,
      default: false
    },
    replace:{
      type: Object,
      default:()=> {return {text:'text',value:'value'}},
      required:false
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
      type: [Array,Object,String,Number],
      default:null
    },
    data:{
      type : Array,
      default : ()=>[]
    }
  },
  data(){
    return {
      showPicker:false , // 弹窗显示
    }
  },
  computed:{
    showText(){
      let obj = this.columns.find(item=>this.value === item.value)
      return obj? obj.text : ''
    },
    columns() {
      return this.data.map(item=>{
        if(typeof item !== 'object'){
          item = {
            text:item,
            value:item
          } 
        }
        return {...item,text:item[this.replace.text],value:item[this.replace.value]}}
      )
    }
  },
  methods:{
    clickField(){
      if(this.disabled){
        return
      }else{
        this.showPicker = true
      }
    },
    onConfirm($event){
      console.log($event);
      this.showPicker = false
      this.$emit('change',$event.value)
      this.$emit('onConfirm',$event)
    }
  }
  
}
</script>