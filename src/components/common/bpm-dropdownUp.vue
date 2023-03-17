<template>
  <div class='mt-1 vux-1px-t'>
    <div @click="showPopUp">
      <x-input text-align="right" v-model="showSelected" :title="title" @on-focus="showPopUp" :show-clear="false"
        readonly>
        <x-icon slot="right" type="android-arrow-dropdown" v-show="!this.$store.state.readOnly" @click="showPopUp"
          size="18"></x-icon>
      </x-input>
    </div>

    <div v-transfer-dom="true">
      <popup v-model="popShow">
        <div class="popup-selector">
          <group>
            <group-title slot="title">请选择
              <span style="float:right;color:#1871D1" @click="clickConfirm()">确定</span>
            </group-title>
            <picker :data="selectNodes" class="popuppicker" v-model="selected" @on-change="picking" />
          </group>
        </div>
      </popup>
    </div>
  </div>
</template>
<script type="text/javascript">
  import {
    Group,
    GroupTitle,
    Picker,
    Popup,
    TransferDom,
    XInput
  } from 'vux'
  import _ from 'lodash'
  import httpService from 'components/httpService'
  import AsyncComponent from './async-component'
  export default {
    name: 'bpm-dropdown',
    directives: {
      TransferDom,

    },
    props: {
      criteria: {
        type: Object,
        required: false,
      },
      title: {
        type: String,
        required: true,
      },
      value: {
        type: [Object],
        default () {
          return {}
        },
      },
      preSet: {
        type: Array,
        required: false
      },
      data: {
        type: [Array, String]
      },
      ignoredItem: {
        type: [Array, String],
        default: ''
      }
    },
    mixins: [AsyncComponent],
    components: {
      XInput,
      Popup,
      Picker,
      Group,
      GroupTitle,
    },

    data() {
      return {
        selectNodes: [],
        popShow: false,
        selected: [],
        showSelected: '',
        picker: [],
        ajaxData: []
      }
    },
    methods: {
      picking(select) {

      },
      clickConfirm() {
        this.popShow = false
        if (!this.hasLoaded) {
          return
        }
        let s = this.selected[0]
        let name = _.filter(this.picker, function (v) {
          return v.value == s
        })
        this.$emit('input', name[0])
        this.$emit('on-change', name)
        this.showSelected = name[0] ? name[0].name : ''
      },
      // 初始化加载
      _loadContent() {
        var self = this;

        this.picker = []
        this.selectNodes = []

        if (!this.criteria) {
          // console.log('using pre set',this.preSet)
          return new Promise(function (resolve) {
            self.pushing(self.preSet);
            if (self.picker.length) {
              self.selectNodes = [self.picker]
            }
            self.$emit('get-data', self.picker);
            resolve();
          })
        } else {
          let setVars = {  }
        for (let i in this.criteria){
          console.log(i,'------------------')
          setVars[`vars[${i}]`] = this.criteria[i]
        }
          // console.log('using ajax')
          return httpService(this)
            .getSelectorTypeData(setVars)
            .then(res => {
              let data = res.body;
              self.ajaxData = data;
              if (this.ignoredItem) {
                if (typeof (this.ignoredItem) == 'string') {
                  data = data.filter(item => item['enumValue'] != this.ignoredItem)
                } else {
                  data = data.filter(item => !this.ignoredItem.includes(item['enumValue']))
                }
              }
              self.pushing(data);
              if (self.picker.length) {
                self.selectNodes = [self.picker]
              }
              self.$emit('get-data', self.picker)
            })
        }

      },
      pushing(ary) {
        // console.log('setting picker', ary)
        // 设定 this.picker

        _.forEach(ary, val => {
          this.picker.push({
            name: val.enumCnValue,
            value: val.enumValue,
            data: val
          })
        })
      },
      showPopUp() {
        if (this.$store.state.readOnly) {
          return
        }

        this.popShow = true
      },
      _initComponent() {
        if (this.value && this.value.value) {
          // console.log('init in dropdown!', this.value)

          this.selected = []
          this.selected.push(this.value.value)
          this.showSelected = this.value.name
        }
      },
    },
    watch: {
      value: function (val) {
        if (val.value && val.value) {

          this.selected = []
          this.selected.push(val.value)
          this.showSelected = val.name
        }
      },

      preSet(val) {
        this.pushing(val);
        if (this.picker.length) {
          this.selectNodes = [this.picker]
        }
        this.$emit('get-data', this.picker);
      },

      data: function (val) {
        if (val) {
          const arr = new Array();
          _.forEach(val, item => {
            arr.push({
              name: item.name,
              value: item.value,
              data: item
            })
          })
          this.picker = arr;
          this.selectNodes = [this.picker];
        }
      },

      ignoredItem: function (newVal, oldVal) {
        if (oldVal === newVal || this.ajaxData.length < 1) {
          return;
        }
        let self = this;
        let data = this.ajaxData;
        if (typeof (newVal) == 'string') {
          data = data.filter(item => item['enumValue'] != newVal)
        } else {
          data = data.filter(item => !newVal.includes(item['enumValue']))
        }
        self.picker = [];
        self.pushing(data);
        if (self.picker.length) {
          self.selectNodes = [self.picker]
        }
        self.$emit('get-data', self.picker)
      }
    },
  }

</script>
<style type="text/css">
  .popup-selector {
    /* padding-bottom: 20rem; */
    height: 30vh;
    overflow-y: auto;
  }

</style>
