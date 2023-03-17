<template>
	<div class="list-wrapper">
		<!-- <group :title="title" class="list"> -->
		<div v-if="!isLoadingStatus && list.length">
			<div>
				<template v-for="(task, index) in list">
					<van-cell-group inset :key="task.formNo">
						<van-row style="display:flex;align-items:center;">
							<van-col span="21">
								<cell
									class="formNo"
									:title="
										index + 1 + '  ' + task.formNo + '/' + (task.createdByName || '')
									"
									:border-intent="false"
									@click.native="goToProcess(task)"
									:key="task.id"
								></cell>
							</van-col>
							<van-col span="3" >
								<cell
									is-link
									:border-intent="false"
									:arrow-direction="selectedId == task.id ? 'up' : 'down'"
									@click.native="selecting(task)"
									:key="task.id"
								></cell>
							</van-col>
						</van-row>

						<template v-if="selectedId !== task.id">
							<cell-form-preview
								:border-intent="false"
								:list="task.listTest"
								:key="task.id"
							></cell-form-preview>
						</template>
						<template v-if="selectedId == task.id">
							<cell-form-preview
								:border-intent="false"
								:list="task.list"
								:key="task.id"
							></cell-form-preview>
							<!-- <x-button
									type="primary"
									@click.native="goToProcess(task)"
									:key="task.id"
									>进入流程</x-button
								> -->
						</template>
					</van-cell-group>
				</template>
			</div>
			<x-button type="default" @click.native="loadMorePage()">
				<span v-if="!nextLoading" class="size20">{{ loadMore }}</span>
				<spinner v-else type="ios-small" size="30"></spinner>
			</x-button>
		</div>
		<div class="no-more" v-if="!list.length && !isLoadingStatus">
			没有任何内容哦~
		</div>
		<div v-if="isLoadingStatus" class="loading">
			<inline-loading></inline-loading>
			<span
				style="vertical-align: middle; display: inline-block; font-size: 14px"
				>&nbsp;&nbsp;加载中</span
			>
		</div>
		<!-- </group> -->
	</div>
</template>
<script type="text/javascript">
import {
	Cell,
	CellFormPreview,
	Group,
	ViewBox,
	XButton,
	ButtonTab,
	ButtonTabItem,
	InlineLoading,
	Spinner,
	Flexbox,
	FlexboxItem,
} from 'vux'
import availableFlows from 'config/available-flow'
import { transformTohump } from 'utils/functions'
import Fade from 'animation/fade'
import _ from 'lodash'
import debounce from 'lodash/debounce'
import httpService from 'components/httpService'
import moment from 'moment'
import i18n from '@/lang'
let map = [
	{
		field: 'formNo',
		name: '单号',
	},
	{
		field: 'formTitle',
		name: '流程名称',
	},
	{
		field: 'bizTypeName',
		name:'流程类型',
	},

	{
		field: 'createdByName',
		name: '发起人',
	},
	{
		field: 'createdDate',
		name: '发起日期',
	},
	{
		field: 'remarkText',
		name: '摘要',
	},

]
let mapTest = [
	{
		field: 'amount',
		name: '金额',
	},
	{
		field: 'formTitle',
		name: '主题',
	},
	{
		field: 'bizTypeName',
		name: '流程类型',
	},
	{
		field: 'currentActivityName',
		name: '流程环节',
	},
]
//我的待办枚举， 后端不愿意改就前端写死吧
let formStatus = {
	1: '草稿',
	2: '运行中',
	3: '归档',
	4: '撤销',
	5: '删除',
	6: '挂起',
	7: '异常结束',
	8: '驳回',
}

//创建方式枚举
let createMode = {
	0: '手工',
	1: '自动',
}
let timer = null
export default {
	name: 'task-list',
	props: [
		'title',
		'url',
		'param',
		'process',
		'filterList',
		'searchText',
		'customParams',
	],
	data() {
		return {
			nextLoading: false,
			isLoadingStatus: false,
			list: [],
			selectedId: '',
			currentPage: 1,
			totalPage: 0,
			loadMore: '下一页',
			dbOrders: {
				property: 'form_main.last_updated_date',
				orderTypeEnum: 'DESC',
			},
			baseURL: this.$store.state.ctx + 'bpm',

			processType: '',
		}
	},
	computed: {
		query() {
			return this.$route.query
		},
	},
	created() {
		if (this.param === 'entity') {
			this.dbOrders = {
				property: 'LAST_UPDATED_DATE',
				orderTypeEnum: 'DESC',
			}
		}
	},
	async mounted () {
		this.processType = this.process
		await this.getBizType()
		this.loadPage()
	},
	watch: {
		filterList(newVal) {
			newVal.map((item) => {
				let property
				if (item.sort !== 'DEFAULT') {
					if (this.param === 'entity') {
						property = item.name
					} else {
						property = item.name
					}
					this.dbOrders = {
						property,
						orderTypeEnum: item.sort,
					}
				}
			})
			this.loadPage(true)
		},
		searchText(newVal, val) {
			if (newVal !== val) {
				clearTimeout(timer)
				timer = setTimeout(() => {
					this.loadPage(true)
				}, 500)
			}
		},
		query(val) {
			const { process = '' } = val

			this.processType = process
			this.loadPage(true)
		},
	},
	methods: {
		getBizTypeName(item){
			console.log('item :>> ', item);
			let biz = this.bizTypeOptions.find(f => f.value === item.bizType) || {}
			return biz.text
		},
		// 获取发票类型
		async getBizType() {
			const res = await httpService(this)
				.dropDownService({
					vars: {
						enumCode_RIGHTLIKE: "BIZ_TYPE_",
						// isActive_EQ: 1,
					},
				})
					this.bizTypeOptions = res.data.map((e) => {
						return {
							...e,
							value: e.enumValue,
							text: e.enumCnValue,
						}
					})
		},
		/**
		 * 跳转到搜索页面
		 */
		_actionSearch() {
			const fullPath = this.$route.fullPath.substr(1)
			this.$router.push({
				path: 'search',
				query: {
					type: fullPath,
				},
			})
		},
		selecting(task) {
			if (this.selectedId) {
				this.selectedId = ''
			} else {
				this.selectedId = task.id
			}
		},
		_fetchSubmitParams() {
			const self = this
			const property = 'bizType'
			const SEARCH = 'formNo'
			let varParams = 'vars[' + SEARCH + ']'
			let bizParams = 'vars[' + property + ']'
			let temp = {
				pageNo: this.currentPage,
				'dbOrders[0].property': self.dbOrders.property,
				'dbOrders[0].orderTypeEnum': self.dbOrders.orderTypeEnum,
				nd:new Date().getTime()
			}
			temp[varParams] = self.searchText

			if (this.processType) {
				temp[bizParams] = this.processType
			} else {
				temp[bizParams] = availableFlows.map((e) => e.bizType).join(',')
			}
			if (this.customParams) {
				temp = { ...temp, ...this.customParams }
			}
			return temp
		},
		loadPage(isClearList = false, loading = true) {
			const self = this
			this.isLoadingStatus = loading ? true : false
			return new Promise((resolve, reject) => {
				httpService(self)
					.bpmListService(self.url, {
						params: self._fetchSubmitParams(),
						// use before callback
						before(request) {
							// abort previous request, if exists
							if (this.previousRequest) {
								this.isLoadingStatus = loading ? true : false
								this.previousRequest.abort()
							}
							// set previous request on Vue instance
							this.previousRequest = request
						},
					})
					.then((res) => {
						resolve()
						this.isLoadingStatus = false
						if (isClearList) {
							this.list = []
						}
						this.totalPage = res.body.totalPages
						for (let i = 0; i < res.body.result.length; i++) {
							let task = res.body.result[i]
							//筛选过滤资金划拨风控中当前环节为经办人处理的单据
							// if(task['currentTaskName'] == "经办人处理" && task['processDefKey'] == 'FundTransfer'){
							//   continue;
							// }
							if (!task.id) {
								task.id = task.pkId
							}
							task.list = []
							task.listTest = []
							for (let m = 0; m < map.length; m++) {
								let field = map[m].field
								let value = task[field]

								if (['/todo', '/draft', '/done', '/completed'].includes(this.$route.path)) {
									if (field == 'createdDate') {
										value = moment(value).format('YYYY-MM-DD')
									}
									if (field == 'formStatus') {
										value = formStatus[value]
									}
									if (field == 'formCreateMode') {
										value = createMode[value]
									}
									if (field == 'basicOrgRootCode') {
										value = task['basicOrgRootName'] + '(' + task[field] + ')'
									}
									if(field == 'bizTypeName'){
										value = this.getBizTypeName(task)
									}
								}

								task.list.push({
									label: map[m].name,
									value: value,
								})
							}
							for (let m = 0; m < mapTest.length; m++) {
								let field = mapTest[m].field
								let value = task[field]
								if (['/todo', '/draft', '/done', '/completed'].includes(this.$route.path)) {
									if (field == 'createdDate') {
										value = moment(value).format('YYYY-MM-DD')
									}
									if (field == 'formStatus') {
										value = formStatus[value]
									}
									if (field == 'formCreateMode') {
										value = createMode[value]
									}
									if (field == 'basicOrgRootCode') {
										value = task['basicOrgRootName'] + '(' + task[field] + ')'
									}
									if(field == 'bizTypeName'){
										value = this.getBizTypeName(task)
									}
								}

								task.listTest.push({
									label: mapTest[m].name,
									value: value,
								})
							}
							this.list.push(task)
						}
					})
					.catch(() => {
						reject()
						this.isLoadingStatus = false
					})
			})
		},
		loadMorePage() {
			if (this.currentPage >= this.totalPage) {
				this.loadMore = '已经没有更多了！'
				return
			}
			this.currentPage += 1
			this.nextLoading = true
			this.loadPage(false, false)
				.then(() => {
					this.nextLoading = false
				})
				.catch(() => {
					this.nextLoading = false
				})
		},
		goToProcess(task) {
			console.log('taskkk', task)
			this.logger('task:', task)
			this.loadTaskDetail(task)
			this.$emit('go-process', task)
		},
		loadTaskDetail(task) {
			let toFlow = _.filter(availableFlows, function (val) {
				return val.bizType.split(',').includes(task.bizType) 
			})
			if (!toFlow[0]) {
				this.$vux.alert.show({
					content: '该流程请到PC端操作',
				})
				return
			}

			const { link = '' } = toFlow[0]

			let toUrl = `${link}${task.formNo}`

			this.$router.push({
				path: toUrl,
				query: {
					procInstId: task.procInstId,
					currentTaskInsId: task.currentTaskInsId,
          taskInstId:task.taskInstId
				},
			})
		},
	},
	components: {
		Group,
		CellFormPreview,
		Cell,
		ViewBox,
		XButton,
		ButtonTab,
		ButtonTabItem,
		InlineLoading,
		Fade,
		Spinner,
		Flexbox,
		FlexboxItem,
	},
}
</script>
<style lang='scss' scoped>
.toolbar {
	position: absolute;
	right: 1rem;
	margin-top: 0.3rem;
}
.list-wrapper {
	height: 100%;
	display: flex;
	flex-direction: column;
}
.list {
	overflow-y: auto;
}
.loading {
	height: 100%;
	text-align: center;
	padding-top: 1em;
	padding-bottom: 1em;
}
.no-more {
	text-align: center;
	padding-top: 1em;
	padding-bottom: 1em;
	font-size: 14px;
}
.formNo {
	color: #1871d1;
	font-size: 16px;
	font-weight: 700;
	padding-right: 5px;
}
</style>
