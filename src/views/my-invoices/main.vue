<template>
  <!-- 我的发票 -->
  <div>
    <router-view></router-view>
  </div>
</template>

<script>
import { CheckIcon } from 'vux'
export default {
	name: 'my-invoices',

	data() {
		return {
		}
	},
	components: {
		CheckIcon,
	},
	mounted: function() {
		this.$store.dispatch('setHeader', {
			title: '我的发票',
		})
	},
	methods: {
		addInvoice() {
			this.$router.push('/addInvoice')
		},
	}
}
</script>

<style lang="less" scoped>
.invoce-page-header {
	padding: 4px 5px 0px;
	span {
		float: left;
	}
	input {
		float: right;
		background-color: rgb(0, 65, 116);
		border-radius: 5px;
		color: #fff;
	}
}
.list-item {
	border-bottom: 1px solid black;
	padding: 2px 5px;
}
</style>
