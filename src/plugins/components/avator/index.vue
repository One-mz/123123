<template>
  <div>
		<div v-if='name' class='avator ellipsis-1' :style="{backgroundColor: backgroundColor, width: size + 'px', height: size + 'px' }">
			{{name.substr(0, 1)}}
		</div>
		<div v-else @click='login'>
			登录
		</div>
  </div>
</template>
<script>
export default {
  props: {
		name: {
			type: String,
			default: ''
		},
    backgroundColor: {
			type: String,
			default: 'rgb(0, 65, 116)',
		},
		size: {
			type: Number,
			default: 35,
		},
	},
	methods: {
		login() {
			this.$router.push('/login')
		},
	},
}
</script>

<style lang="scss" scoped>
    .avator {
			display: flex;
			justify-content: center;
			align-items: center;
			border-radius: 50%;
			padding: 2px;
			font-size: 16px;
			color: #fff;
			white-space: nowrap;
    }
</style>

