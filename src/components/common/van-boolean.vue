<template>
	<van-field
		readonly
		:label="label"
		input-align="right"
		:name="name"
		:rules="rules"
		required
	>
		<template #input>
			<van-switch
				v-model="value"
				:disabled="readonly || disabled"
				size="20"
				@change="change"
			/>
		</template>
	</van-field>
</template>
<script>
export default {
	name: 'VanBoolean',
	model: {
		prop: 'value',
		event: 'change',
	},
	props: {
		require: Boolean,
		name: String,
		rules: Array,
		disabled: {
			type: Boolean,
			default: false,
		},
		readonly: {
			type: Boolean,
			default: false,
		},
		label: {
			type: String,
			default: '',
		},
		value: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {}
	},
	computed: {},
	methods: {
		change(val) {
			this.$emit('change', val)
		},
		validate() {},
	},
}
</script>
