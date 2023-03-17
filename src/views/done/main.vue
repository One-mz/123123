<template>
<div>
	<task-list :title="$t('common.title.myCompleted')" :url="doneUrl" @go-process="goToTask($event)" :customParams="customParams"></task-list>
</div>
</template>
<script type="text/javascript">
import httpService from 'components/httpService'
import TaskList from 'components/common/bpm-list-with-filter.vue'

export default {
	name: 'mySendList',
	data() {
		return {
			doneUrl:'/getMyCompletedTasks',
			customParams:{
				"vars['FORM_STATUS_EQ']": '3'
			}
		}
	},
	components: {
		TaskList
	},
	created:function(){
		this.doneUrl=httpService().doneHttp()
	},
	mounted: function () {
		this.$store.dispatch('setHeader', {
			title: this.$t('common.title.myCompleted')
		})
		// this.$store.commit('setHeader', '我的办结');
	},
	methods: {
		goToTask(task) {
			this.$store.commit('setTargetType',{targetType:'readonly'})
			this.$store.dispatch('setFrom', {
				from: 'done',
			})
		}
	}
}
</script>
