<template></template>
<script>
import httpService from 'components/httpService'
import availableFlows from 'config/available-flow'

export default {
	name: 'flow',
	components: {},
	computed: {
		isvVerify() {
			return this.username && this.password
		},
	},
	data() {
		return {}
	},
	created() {
		const { params, query } = this.$route
		const { formNo = '', bizType = '' } = params

		this.getTaskInfo(formNo, bizType, query)
	},
	mounted() { },
	methods: {
		// 获取流程信息
		getTaskInfo(formNo, bizTypeCode, query) {
			console.log(bizTypeCode)
			const { bizType } = availableFlows.find(
				(e) => e.bizTypeCode === bizTypeCode,
			)
			let formData = {
				processDefKey: bizType,
				formNo: formNo == 'new' ? '' : formNo,
				doFlag: 1,
				procInstId: ""
			}
			// formData.append('businessType', bizType)
			// formData.append('formNo', formNo)

			this.$vux.loading.show()
			httpService(this)
				.getTaskRefVars(formData)
				.then((res) => {
					// loading延时退出，避免用户手动点击
					setTimeout(() => {
						this.$vux.loading.hide()
					}, 1000)

					let taskVars = res.body

					const { bpmDefNodeInfoFormConfig, bpmFormMain } = taskVars

					// const bpmNodeViewSet = bpmNodeSetList.filter(
					// 	(e) => e.nodeSetType === 'FORM',
					// )[0]
					const loadAddress = bpmDefNodeInfoFormConfig.loadAddress

					// 获取流程表单配置地址
					console.log(loadAddress)

					const { processDefKey = '' } = bpmFormMain

					const { linkMap = {} } = availableFlows.find(
						(e) => e.bizType === processDefKey,
					)
					// 移动端静态处理
					let jumpUrl = linkMap[loadAddress]
					jumpUrl = jumpUrl.replace('/new', '')
					console.log('前端跳转地址', jumpUrl)

					if (formNo === 'new') {
						this.$store.commit('setReadOnly', {
							status: false,
						})
						this.$store.dispatch('setFrom', {
							from: '',
						})

						this.$store.dispatch('setTaskVars', {
							stepInfo: taskVars,
						})
					}

					this.$router.replace({ path: `${jumpUrl}/${formNo}`, query })
				})
		},
	},
}
</script>
