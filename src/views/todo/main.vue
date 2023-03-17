<template>
<div>
	<task-list :title="$t('common.title.myTodo')" :url="todoUrl" @go-process="goToTask($event)" :process="process"></task-list>
</div>
</template>
<script type="text/javascript">
import httpService from 'components/httpService'
import TaskList from 'components/common/bpm-list-with-filter.vue'

export default {
	name: 'myTodoList',
	data() {
		return {
      todoUrl:'/getMyTodoTasks',
      process: '',
		}
	},
	components: {
		TaskList,
	},
	methods: {
		goToTask(task) {
			let query = {
				processDefId: task.processDefId,
				procInstId: task.procInstId,
				nextOptUser: this.$store.state.bpmInfo.userInfo.userId,
				currentTaskInsId: task.currentTaskInsId,
				formNo: task.formNo,
			}
			var form_data = new FormData()
			for (var key in query) {
				form_data.append(key, query[key])
			}
			if(this.$store.state.bpmInfo.userInfo.isSharedUser === true || this.$store.state.bpmInfo.userInfo.isSharedUser === 'true'){
				httpService(this).todoMainService(form_data)
				.then(res => {
					this.logger('response in to do', res)
				})
			}
			this.$store.commit('setTargetType',{targetType:'approval'})
			this.$store.dispatch('setFrom', {
				from: 'todo',
			})
		},
	},
	created:function(){
    this.todoUrl=httpService().todoHttp();
    const { process = '' } = this.$route.query;
    // console.log(process);
    this.process = process;
	},
	mounted: function() {
		// this.$store.commit('setHeader', '我的代办');
		this.$store.dispatch('setHeader', {
			title: this.$t('common.title.myTodo'),
    })
	}
}
</script>
