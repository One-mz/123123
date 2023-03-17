<template>
  <div>
    <flexbox :gutter="0" v-if='showCurrentOffsetAmount'>
      <flexbox-item>
        <x-input title="本次核销总额" v-model="currentOffsetAmount" readonly></x-input>
      </flexbox-item>
    </flexbox>
    <group v-for=" (item, index) in request.borrowAgings" :key='index' title="总账科目">
      <x-input title="总账科目" v-model="item.subjectCode" :show-clear="false" readonly></x-input>
      <x-input title="总账名称" v-model="item.subjectName" :show-clear="false" readonly></x-input>
      <x-input title="相对方编码" v-model="item.borrowEntityCode" :show-clear="false" readonly></x-input>
      <x-input title="相对方名称" v-model="item.borrowEntityName" :show-clear="false" readonly></x-input>
      <x-input title="账面余额" v-model="item.currentBalance" :show-clear="false" readonly></x-input>
      <x-input title="本次核销账面金额" @on-blur="onBlur($event, index)"  v-model="item.currentOffsetAmount" v-if='showCurrentOffsetAmount' :readonly="$store.state.readOnly"></x-input>
      <x-input title="备注" v-model="item.remarks" :show-clear="false" :readonly="$store.state.readOnly"></x-input>
    </group>
  </div>
</template>


<script>
  import httpService from 'components/httpService'
  import {
    Flexbox,
    FlexboxItem,
    XInput,
    XTable,
    Group
  } from 'vux'
  import {
    mapGetters
  } from 'vuex'

  export default {
    name: 'ledger-offset',
    components: {
      Flexbox,
      FlexboxItem,
      XInput,
      XTable,
      Group
    },
    props:{
      showCurrentOffsetAmount: {
        type: Boolean,
        default: true,
      },
      propsOffsets: {
        type: Array,
        default () {
          return []
        },
      },
      borrowEntityCode: {
        type: String,
        default: '',
      },
      companyCode: {
        type: String,
        default: ''
      },
      isVendor: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        currentIndex: 0,
        request: {
          borrowAgings: [],
        },
      }
    },
    computed: {
      ...mapGetters(['userInfo']),
      currentOffsetAmount() {
        // 本次核销
        const currentOffsetAmount =
          this.request.borrowAgings.length > 0 ?
            this.request.borrowAgings
              .map(item => item.currentOffsetAmount)
              .reduce((p1, p2) => {
                return Number(p1) + Number(p2)
              }, 0) :
            0
        this.$emit('setCurrentOffsetAmount', currentOffsetAmount)
        return currentOffsetAmount
      }
    },
    mounted() {
      this._getInitData(this.propsOffsets.length);
    },
    methods: {
      _getInitData(size){
        if (size > 0) {
          this.request.borrowAgings = this.propsOffsets
          this.$emit('setOffsets', this.request.borrowAgings)
        } else {
          this._fetchInitData().then(() => {
            this.$emit('setOffsets', this.request.borrowAgings)
          })
        }
      },
      _fetchInitData(){
        let self=this
        return new Promise((resolve, reject) => {
          let formData = new FormData();
          formData.append("borrowEntityCode", this.borrowEntityCode);
          formData.append("queryDate", "");
          formData.append("companyCode", this.companyCode ? this.companyCode : this.userInfo.userScopeCode);
          if(this.isVendor){
            httpService(self).getBorrowVendorAging(formData).then(res =>{
              const {data} = res
              this.request.borrowAgings = Array.isArray(data) ? data : [];
              resolve()
            }).catch(() => {
              reject()
            })
          }else {
            httpService(self).getBorrowStaffAging(formData).then(res =>{
              const {data} = res
              this.request.borrowAgings = Array.isArray(data) ? data : [];
              resolve()
            }).catch(() => {
              reject()
            })
          }

        });
      },
      onBlur(value, index){
        const currentBalance = this.request.borrowAgings[index].currentBalance

        if (Number(value) * Number(currentBalance) < 0) {
          this.$vux.toast.show({
            text: '本次核销金额和未核销金额需要都为正数或负数',
            type: 'warn',
          })
          this.request.borrowAgings[index].currentOffsetAmount = currentBalance
        }

        if (Math.abs(Number(value)) > Math.abs(Number(currentBalance))) {
          this.$vux.toast.show({
            text: '本次核销金额应当小于等于未核销金额',
            type: 'warn',
          })
          this.request.borrowAgings[index].currentOffsetAmount = currentBalance
        }

        // if(Number(value) < 0){
        //   this.$vux.toast.show({
        //     text: '本次核销金额应当大于0',
        //     type: 'warn',
        //   })
        //   this.request.borrowAgings[index].currentOffsetAmount = 0;
        // }
        this.request.borrowAgings[index].currentOffsetAmount = Number(
          this.request.borrowAgings[index].currentOffsetAmount,
        )
        this.$emit('setOffsets', this.request.borrowAgings)
      }
    }
  }
</script>
