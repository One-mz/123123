<template>
	<div class="flow-btns-container" v-if="approvalPage">
		<van-button type="info" @click="clickedButton('auditPass','通过')">通过</van-button>
		<van-button type="info" plain  @click="clickedButton('auditReject ','驳回')">驳回</van-button>
	</div>
</template>
<script>
import { XButton, Group, Flexbox, FlexboxItem } from 'vux'
import { mapGetters } from 'vuex'

import availableFlows from 'config/available-flow'

export default {
	name: 'flow-buttons',
	data() {
		return {}
	},
	methods: {
		clickedButton(action, buttonName) {
			this.$emit('perform-action', { action, buttonName })
		},
		setReadOnlyAccordingButtons() {
			if (this.btnShow) {
				if (this.requestId === 'new' ) {
					this.$store.commit('setReadOnly', { status: false })
				} else {
					this.$store.commit('setReadOnly', { status: true })
				}
			}
		},
	},
	computed: {
		...mapGetters(['pmNodeId', 'userInfo', 'bpmFormMain', 'bpmFormStep']),
		requestId() {
			return this.$route.params.id
		},

		btnShow() {
			return this.$route.params.id != null && this.$store.state.isShowTabs
		},

	

		approvalPage: function () {
			return (
				(['todo', 'overtime'].includes(this.$store.state.from))
			)
		},

		// 是否是 纯审批页面
		isOnlyApproval() {
			return availableFlows
				.filter((item) => item.isApproval)
				.map((e) => e.bizType)
				.includes(this.$route.meta.bizType)
		},


	},

	watch: {


		requestId() {
			this.setReadOnlyAccordingButtons()
		},
	},

	mounted() {
		this.setReadOnlyAccordingButtons()
		console.log(
			'this.$store.state.paymentInfoFlag :>> ',
			this.$store.state.paymentInfoFlag,
		)

		// 如果从oa待办进入，没有带from
		if (this.$store.state.from === '' && this.requestId !== 'new') {
			console.log('没有from')
			this.$store.state.from = 'todo'
		}
	},
	components: {
		Group,
		XButton,
		Flexbox,
		FlexboxItem,
	},
}
</script>

<style lang="scss" scoped>
.flow-btns-container {
//   padding: 0.5rem;
	display: flex;
	width: 100%;
	height: 50px;
	background-color: #fff;
	justify-content: space-between;
	align-items: center;
	padding: 5px 10px;
	border-top: 1px solid #f2f2f2;
}
.flow-btns-container button{
	flex:1;
	// border:none;
	margin-right: 10px;
}
.flow-btns-container button:last-of-type{

	margin-right: 0;
}
</style>
