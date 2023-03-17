<template>
<div class='mt-1 vux-1px-t'>
	<x-input text-align="right" :title="title" :value="selectedShow" placeholder='（请选择）' is-link @click.native="showPopupSelection()" required
	  :show-clear="false"  :readonly="$store.state.readOnly">
		<x-icon slot="right" type="android-arrow-dropdown" size="18" v-show="!this.$store.state.readOnly"></x-icon>
	</x-input>
	<div v-transfer-dom="true">
		<van-popup v-model="showPopup" class="checker-popup" position="bottom" round  :style="{ height: '30%' }">
			<group>
				<group-title slot="title">{{title}}<span style="float:right;color:#1871D1" @click="dismiss()">确定</span></group-title>
				<checker type="checkbox" v-model="transportSelected" default-item-class="transport-item"
				  selected-item-class="transport-item-selected" style="margin-top:0.5rem;padding-left:0.5rem">
					<checker-item :value="item.value" @on-item-click="onItemClick(item)" v-for="item in checkList"
					  :key="item.name"> {{ item.name }} </checker-item>
				</checker>
			</group>
		</van-popup>
	</div>
</div>
</template>
<script type="text/javascript">
import {
	TransferDom,
	Popup,
	Cell,
	Checker,
	CheckerItem,
	XInput,
	Group,
	GroupTitle
} from 'vux'
import _ from 'lodash'
export default {
	name: 'bpm-checkboxes',
	directives: {
		TransferDom,
	},
	data() {
		return {
			selectedShow: '',
			transportSelected: [],
			showPopup: false,
			selected: [],
		}
	},
	methods: {
		onItemClick(event) {
			let index = _.findIndex(this.selected, ['value', event.value])
			if (index < 0) {
				this.selected.push(event)
			} else {
				this.selected.splice(index, 1)
			}
			// this.selectedShow = _.reduce(
			// 	this.selected,
			// 	function (sum, n) {
			// 		return sum + ',' + n.name
			// 	},
			// 	'',
			// ).slice(1)
		},
		dismiss() {
			let codeInOne = ''
			codeInOne = _.reduce(
				this.selected,
				function (sum, n) {
					console.info('n', n)
					return sum + ',' + n.value
				},
				'',
			).slice(1)
				this.selectedShow = _.reduce(
				this.selected,
				function (sum, n) {
					return sum + ',' + n.name
				},
				'',
			).slice(1)
			let event = {
				name: this.selectedShow,
				code: codeInOne,
			}
			this.$emit('checkbox-checked', event)
			this.showPopup = false
		},
		showPopupSelection() {
			if (this.$store.state.readOnly) {
				return
			}
			this.showPopup = true
		},
	},
	props: {
		title: {
			type: String,
			required: true,
		},
		checkList: {
			type: Array,
			required: false,
		},
		checked: {
			type: Object,
			default: '',
		},
    value: {
		  type: String,
      default: ''
    }
	},
	components: {
		Popup,
		Cell,
		Checker,
		CheckerItem,
		XInput,
		Group,
		GroupTitle,
	},
	watch: {
		checked: function (val) {
			if (!val.name) return
			let names = val.name.split(',')
			let values = val.code.split(',')
      this.selected = [];
      this.transportSelected = [];
			for (let i=0; i < names.length; i++) {
				this.selected.push({
					name: names[i],
					value: values[i],
				})
        this.transportSelected.push(values[i]);
			}
			this.selectedShow = val.name
		}
	},
  mounted(){
	  if(this.checked && this.checked.name){
      let names = this.checked.name.split(',')
      let values = this.checked.code.split(',')
      this.selected = [];
      this.transportSelected = [];
      for (let i=0; i < names.length; i++) {
        this.selected.push({
          name: names[i],
          value: values[i],
        })
        this.transportSelected.push(values[i]);
      }
      this.selectedShow = this.checked.name
    }
  }
}
</script>

<style lang='scss' scoped>
.transport-item {
    // width: 4rem;
		padding-left: 1rem;
		padding-right: 1rem;
    height: 26px;
    line-height: 26px;
    text-align: center;
    border-radius: 3px;
    border: 1px solid #ccc;
    background-color: #fff;
    margin-right: 6px;
    margin-bottom: 6px;
}

.transport-item-selected {
    background: #ffffff url("../../assets/active.png") no-repeat right bottom;
    border-color: #ff4a00;
}
.check-popup {
    z-index: 10000000000000;
    position: relative;
}
</style>
