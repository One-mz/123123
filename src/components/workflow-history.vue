<template>
	<BaseTable :tableProps="tableProps" :displayData="displayData" />
</template>

<script>
import { mapGetters } from 'vuex'
import BaseTable from 'components/base-table/index'
export default {
	name: 'WorkflowHistory',
	components: {
		BaseTable,
	},
	data() {
		return {
			displayData: [
				{
					activityCnName: '报销申请',
					optType: '提交申请',
					optUser: '王刚',
					nextOptUser: '王刚2',
					optDate: '2022-11-23',
					optDesc: 'OK',
				},
			],
			tableProps: {
				columns: [
					{
						title: '环节名称',
						field: 'activityCnName',
					},
					{
						title: '处理类型',
						field: 'optType',
					},
					{
						title: this.$t('common.table.columnlabel.optUserName'),
						field: 'optUser',
					},
					{
						title: '下一环节处理人',
						field: 'nextOptUser',
					},
					{
						title: this.$t('common.table.columnlabel.optTime'),
						field: 'optDate',
					},
					{
						title: this.$t('common.table.columnlabel.optDesc'),
						field: 'optDesc',
					},
				],
			},
		}
	},
	computed: {
		...mapGetters(['bpmFormMain']),
		procInstId() {
			return this.bpmFormMain && this.bpmFormMain.procInstId
		},
		additionSearchForm() {
			return {
				procInstId: this.procInstId,
			}
		},
	},
	methods: {
		renderOptType({ optTypeName = '', optTypeCode = '' }) {
			return optTypeCode && cnJson['workflow.common.button.' + optTypeCode]
				? this.$t('workflow.common.button.' + optTypeCode)
				: optTypeName
		},
		renderTaskDef({ taskDefName = '', taskDefKey = '' }) {
			return taskDefKey && cnJson['workflow.taskDef.' + taskDefKey]
				? this.$t('workflow.taskDef.' + taskDefKey)
				: taskDefName
		},
	},
}
</script>
