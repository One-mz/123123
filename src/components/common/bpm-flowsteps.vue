<template>
	<van-panel :title="$t('bpm.desc.processHistory')">
		<van-steps direction="vertical" :active="stepList.length">
			<van-step v-for="item in stepList" :key="item.id" class="flow-item">
				<h4 class="flow-item-title">{{ item.activityCnName }}</h4>
				<p>{{$t('common.formLabel.optType')}}：{{ item.optType }}</p>
				<p>{{$t('common.formLabel.optUserName')}}：{{ item.optUserName }}</p>
				<p>{{$t('common.formLabel.nextOptUserName')}}：{{ item.nextOptUserName }}</p>
				<p>{{$t('common.formLabel.optDate')}}：{{ item.optDate }}</p>
				<p>{{$t('common.formLabel.optDesc')}}：{{ item.optDesc }}</p>
			</van-step>
		</van-steps>
	</van-panel>
</template>
<script>
import { mapState } from 'vuex'
export default {
	name: 'flow-steps',
	data() {
		return {
			stepList: [],
		}
	},
	computed: {
		...mapState({
			taskVars: (state) => state.taskVars,
		}),
	},
	watch: {
		taskVars: {
			handler: function (val = {}) {
				this.stepList = val.stepList
			},
			deep: true,
			immediate: true,
		},
	},
}
</script>

<style lang="scss" scoped>
.flow-item {
	margin: 5px 0;
  &-title, p {
    margin-bottom: 10px;
  }
}
.van-step {
	margin: 5px 0;
}
</style>
