<template>
  <div>
    <x-input
      text-align="right" :title="title" :value="date" required v-on:click.native="showPopupSelection()" placeholder="（请选择日期）"
      @on-change="onChange"
      :show-clear="false" readonly
    />
    <div v-transfer-dom>
      <popup v-model="showPopup">
        <group>
          <group-title slot="title">{{title}}<span style="float:right;color:#1871D1" @click="closeConfirm">确定</span>
          </group-title>
          <datetime-view :value="dateShow" @input="onChangeDate" :start-date="startDate" :end-date="endDate"/>
        </group>
      </popup>
    </div>
  </div>
</template>
<script type="text/javascript">
  import {XInput, DatetimeView, Popup, Group, TransferDom, GroupTitle} from 'vux'
  import moment from 'moment'

  export default {
    name: 'bpm-datepicker',
    data() {
      return {
        date: this.value,
        dateShow: this.value,
        showPopup: false
      }
    },
    props: ['title', 'startDate', 'endDate', 'value'],
    directives: {TransferDom},
    components: {XInput, DatetimeView, Popup, Group, GroupTitle},
    watch: {
      date: function (val) {
        this.$emit('input', val)
      },
      value: function (val) {
        if (val) {
          this.date = moment(val).format('YYYY-MM-DD')
        }
      }
    },
    methods: {
      showPopupSelection() {
        if (this.$store.state.readOnly) {
          return
        }

        this.dateShow = this.date;
        this.showPopup = true;
      },
      closeConfirm() {
        if(!this.dateShow){
          this.dateShow = moment().format('YYYY-MM-DD')
        }

        this.date = this.dateShow;

        this.showPopup = false
        this.$emit('close-popup')
      },
      onChangeDate(val) {
        this.dateShow = val;
      },

      onChange(val) {
        console.log('changing date', val)
        this.$emit('on-change', val)
      },
    }

  }
</script>
