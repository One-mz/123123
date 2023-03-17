<template>
<div>
	<task-list :title="$t('common.title.myDone')" :url="doneUrl" @go-process="goToTask($event)" :customParams="customParams"></task-list>
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
				"vars['FORM_STATUS_IN']": '2,4,5,6,7,8'
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
		this.$store.commit('setTargetType',{targetType:'readonly'})
		this.$store.dispatch('setHeader', {
			title: this.$t('common.title.myDone'),
		})
	},
	methods: {
		goToTask(task) {
			this.$store.dispatch('setFrom', {
				from: 'done',
			})
		}
	}
}
</script>
