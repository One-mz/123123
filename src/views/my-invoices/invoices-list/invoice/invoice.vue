<template>
    <div>
        <tab>
            <tab-item :selected="currentStep == 0" @on-item-click="currentStep = 0">发票信息</tab-item>
            <tab-item :selected="currentStep == 1" @on-item-click="currentStep = 1">影像信息</tab-item>
        </tab>
        <!-- <invoice-info v-if="currentStep == 0" ></invoice-info> -->
        <invoice-info  v-if="currentStep == 0"></invoice-info>
        <upload-attachment v-show="currentStep == 1" :readOnly='readOnly' :imageCorrelationId="imageCorrelationId"></upload-attachment>
      <div>
        <x-button type="primary" style="position: absolute; bottom: 20px; width: 60%; left: 20%" @click.native="back">返回</x-button>
      </div>
    </div>
</template>
<script>
import {Tab,TabItem, XButton,Flexbox,FlexboxItem} from 'vux'

import InvoiceInfo from './invoice-info'
export default {
    name:'invoice',
    components:{
        Tab,
        TabItem,
        InvoiceInfo,
        XButton,
        Flexbox,
        FlexboxItem
    },
    data(){
        return {
            currentStep:0,
            readOnly:false,
            imageCorrelationId:''
        }
    },
    methods:{
        cancel(){

        },
        confirm(){

        },
        back() {
          this.$router.go(-1)
        }
    },
    mounted(){
        this.invoice = this.$route.params.dataObj
        this.imageCorrelationId = this.invoice.imageCorrelationId

    }

}
</script>

