<template>
  <div>
    <task-list :title="$t('common.title.myDraft')" :url="draftUrl" @go-process="goToTask($event)" param="entity"></task-list>
  </div>
</template>
<script type="text/javascript">
import httpService from 'components/httpService'
  import TaskList from 'components/common/bpm-list-with-filter.vue'

  export default {
    name: 'mySendList',
    data() {
      return {
        draftUrl:'/getMySendTasks.do'
      }
    },
    components: {
      TaskList,
    },
    methods: {
      goToTask(task) {
			  this.$store.commit('setTargetType',{targetType:'readonly'})
        this.$store.dispatch('setFrom', {
          from: 'draft',
        })
      },
    },
    created:function(){
      this.draftUrl=httpService().draftHttp()
    },
    mounted: function () {
      this.$store.dispatch('setHeader', {
			title: this.$t('common.title.myDraft'),
		})
    }
  }
</script>
