<template>
	<VanPopupPicker
		:label="label"
		:required="required"
		:data="options"
		v-model="currency"
		:disabled="disabled"
		@onConfirm="onChangeHandler"
	>
		<template #title>
			<van-search v-model="queryString"
				:placeholder="$t('common.placeholder.currency')"
				autofocus style="padding: 2px 12px; height: 100%; margin-top: 4px"
			/>
		</template>
	</VanPopupPicker>
</template>

<script type="text/javascript">
export default {
	name: 'CurrencySelect',
	model: {
		prop: 'value',
		event: 'change',
	},
	props: {
		name: String,
		required: Boolean,
		disabled: {
			type: Boolean,
			default: false,
		},
		label: {
			type: String,
			default: '',
		},
		placeholder: {
			type: String,
			default: '请选择',
		},
		value: {
			type: [String],
			default: null,
		},
		currencyFilter: {
			type: Array,
			default: () => [],
		},
	},
	data() {
		return {
			currencyTypeOptions: [],
			currency: '',
			queryString: '',
		}
	},
	computed: {
		options() {
			// 支持显示固定的几个币种
			let currencyTypeOptions = this.currencyTypeOptions
			if (this.currencyFilter.length) {
				currencyTypeOptions = currencyTypeOptions.filter((f) => {
					if (this.currencyFilter.length) {
						return this.currencyFilter.includes(f.currency)
					}
					return true
				})
			}

			let lowQueryString = (this.queryString || '').toLowerCase()
			return currencyTypeOptions.filter((item) => {
				return item.currency.toLowerCase().includes(lowQueryString)
			})
		},
	},
	watch: {
		value: {
			immediate: true,
			handler(val) {
				this.currency = val
			},
		},
	},
	async mounted() {
		const cache_fssp_currency = sessionStorage.getItem('cache_fssp_currency')
		if (
			!cache_fssp_currency ||
			this.$lodash.isEmpty(JSON.parse(cache_fssp_currency))
		) {
			// 从未加载过
			let currencyTypeList = []
			const { status = 200, data = [] } =
				await this.$httpService.getCurrencyOptions()
			if (status === 200) {
				this.$store.dispatch('commonOptions/setCurrencyOptions', data)
				currencyTypeList = data
			}

			let currencyTypeOptions = currencyTypeList.map((item) => {
				const { currency = '', shortText = '' } = item
				return {
					...item,
					value: currency,
					text: `${currency}(${shortText})`,
				}
			})

			sessionStorage.setItem(
				'cache_fssp_currency',
				JSON.stringify(currencyTypeOptions),
			)
			this.currencyTypeOptions = currencyTypeOptions
			return
		}
		this.currencyTypeOptions = JSON.parse(cache_fssp_currency)
	},
	methods: {
		onChangeHandler(val) {
			this.$emit('change', val.value)
		},
		remoteMethod(queryString) {
			// 调用 callback 返回建议列表的数据
			if (queryString == '') {
				this.options = this.currencyTypeOptions
			} else {
				let lowQueryString = (queryString || '').toLowerCase()
				this.options = this.currencyTypeOptions.filter((item) => {
					return item.currency.toLowerCase().includes(lowQueryString)
				})
			}
		},
	},
}
</script>

<style></style>
