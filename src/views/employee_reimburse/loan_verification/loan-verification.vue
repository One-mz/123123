<template>
  <!-- 借款核销 -->
	<div class="loan-verification">
		<bpmBorrowOffset
			:propsOffsets="propsOffsets"
			:borrowEntityCode="borrowEntityCode"
			:refFormNo="refFormNo"
			@setOffsets="setOffsets"
			@setCurrentOffsetAmount="setCurrentOffsetAmount"
		/>
	</div>
</template>

<script>
import bpmBorrowOffset from 'components/common/bpm-borrow-offset'
import { mapGetters } from 'vuex'
export default {
	name: 'loan-verification',
	components: {
		bpmBorrowOffset,
	},
  computed: {
		...mapGetters(['userInfo']),
	},
	data() {
		return {
			propsOffsets: [],
			request: {
				borrowOffsets: [],
			},
			borrowEntityCode: '',
			refFormNo: '',
		}
	},
	methods: {
		setOffsets(arr) {
			this.request.borrowOffsets = [...arr]
			this.$store.commit('employeeReimburse/mergeRequest', {
				request: {
					...this.$store.state.employeeReimburse.submitData,
					borrowOffsets: this.request.borrowOffsets
				},
			})
		},

		setCurrentOffsetAmount(currentOffsetAmount) {
			// if(this.requestId === 'new')
			this.$store.commit('employeeReimburse/setCurrentOffsetAmount', {
				mount: currentOffsetAmount,
			})

		},
	},
	created() {
		const { borrowOffsets } = this.$store.state.employeeReimburse.submitData
		this.propsOffsets = borrowOffsets && borrowOffsets.length ? borrowOffsets : []
		this.borrowEntityCode = this.userInfo.userId
	},
}
</script>

