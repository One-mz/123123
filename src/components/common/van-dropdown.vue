<template>
	<div class="mt-1 vux-1px-t">
		<van-field
			:value="showText"
			:is-link="!(readOnly || disabled || readonly)"
			:readonly="readOnly || disabled || readonly"
			:label="label"
			:placeholder="placeholder"
			@click="showPopUp"
			input-align="right"
			:name="name"
			:rules="rules"
			:required="required"
		/>
		<van-popup v-model="popShow" round position="bottom" get-container="#app">
			<van-picker
				:columns="picker"
				@cancel="showPicker = false"
				@confirm="clickConfirm"
				:show-toolbar="true"
			/>
		</van-popup>
	</div>
</template>
<script type="text/javascript">
import { Group, GroupTitle, Picker, Popup, TransferDom, XInput } from 'vux'
import _ from 'lodash'
import httpService from 'components/httpService'
import AsyncComponent from './async-component'
export default {
	name: 'van-dropdown',
	model: {
		prop: 'value',
		event: 'change',
	},
	directives: {
		TransferDom,
	},
	props: {
		name: String,
		rules: Array,
		required: Boolean,
		criteria: {
			type: Object,
			required: false,
		},
		label: {
			type: String,
			required: true,
		},
		value: {
			type: [Array, Object, String, Number],
			default: null,
		},
		preSet: {
			type: Array,
			required: false,
		},
		data: {
			type: [Array, String],
		},
		ignoredItem: {
			type: [Array, String],
			default: '',
		},
		placeholder: String,
		readOnly: Boolean,
		readonly: Boolean,
		disabled: Boolean,
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
			ajaxData: [],
		}
	},
	computed: {
		showText() {
			let obj = this.picker.find((item) => this.value === item.value)
			return obj ? obj.name : ''
		},
	},
	methods: {
		picking(select) {
			if (!this.hasLoaded) {
				return
			}
			let s = select[0]
			console.log(s)
			let name = _.filter(this.picker, function (v) {
				return v.value == s
			})
			this.$emit('input', name[0])
			this.$emit('on-change', name)

			this.showSelected = name[0] ? name[0].name : ''
		},
		clickConfirm($event) {
			this.popShow = false
			this.$emit('change', $event.value)
			this.$emit('onConfirm', $event)
			this.$emit('close-popup')
		},
		// 初始化加载
		_loadContent() {
			var self = this

			this.picker = []
			this.selectNodes = []

			if (!this.criteria) {
				// console.log('using pre set',this.preSet)
				return new Promise(function (resolve) {
					self.pushing(self.preSet)
					if (self.picker.length) {
						self.selectNodes = [self.picker]
					}
					self.$emit('get-data', self.picker)
					resolve()
				})
			} else {
				let setVars = {}
				for (let i in this.criteria) {
					console.log(i, '------------------')
					setVars[`vars[${i}]`] = this.criteria[i]
				}
				console.log('setVars :>> ', setVars)
				// console.log('using ajax')
				return httpService(this)
					.dropDownService(setVars)
					.then((res) => {
						let data = res.body
						self.ajaxData = data
						if (this.ignoredItem) {
							if (typeof this.ignoredItem == 'string') {
								data = data.filter(
									(item) => item['enumValue'] != this.ignoredItem,
								)
							} else {
								data = data.filter(
									(item) => !this.ignoredItem.includes(item['enumValue']),
								)
							}
						}

						data = this.convertAndSort(data)
						self.pushing(data)

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

			_.forEach(ary, (val) => {
				this.picker.push({
					name: val.enumCnValue,
					value: val.enumValue,
					...val,
				})
			})
		},
		showPopUp() {
			if (this.readOnly || this.disabled || this.readonly) {
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
			this.pushing(val)
			if (this.picker.length) {
				this.selectNodes = [this.picker]
			}
			this.$emit('get-data', this.picker)
		},

		data: {
			immediate: true,
			handler(val) {
        console.log('val :>> ', val);
				if (val) {
					const arr = []
					val.forEach((item) => {
						arr.push({
							name: item.name,
							value: item.value,
							data: item,
						})
					})
					this.picker = arr
					this.selectNodes = [this.picker]
				}
			},
		},
		ignoredItem: function (newVal, oldVal) {
			if (oldVal === newVal || this.ajaxData.length < 1) {
				return
			}
			let self = this
			let data = this.ajaxData
			if (typeof newVal == 'string') {
				data = data.filter((item) => item['enumValue'] != newVal)
			} else {
				data = data.filter((item) => !newVal.includes(item['enumValue']))
			}
			self.picker = []
			self.pushing(data)
			if (self.picker.length) {
				self.selectNodes = [self.picker]
			}
			self.$emit('get-data', self.picker)
		},
	},
}
</script>

<style type="text/css" scoped>
.popup-selector {
	/* padding-bottom: 20rem; */
	height: 30vh;
	overflow-y: auto;
}
</style>
