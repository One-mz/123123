<template>
	<div style="overflow-y: scroll;max-height: 28rem" id="chartBox">
		<van-image :src="src"  v-if="src" @click="preview"/>
		<div style="height:100px;width:100%;overflow:scroll"></div>
		<!-- <div id="container"></div>
		<div v-show="isShowPanel" class="hover-panel" :style="{ top: top + 'px', left: left + 'px' }">
			<div class="box-card">
				<div slot="header" class="clearfix header">
					<span style="font-weight: bold;">{{currentDisplayNode && currentDisplayNode.taskDefName}}详细信息</span>
				</div>
				<div v-for="(o, index) in roleList" :key="index" class="text item">
					<div><b>规则：</b>{{o.map(e => e.name).join(',')}}</div>
					<div><b>审核人：</b>{{auditor[index].map(e => e.USER_NAME).join(',')}}</div>

					<el-divider v-if="index !== roleList.length - 1" content-position="right"></el-divider>
				</div>
			</div>
		</div> -->
	</div>
</template>
<script>
import httpService from 'components/httpService'
import _ from 'lodash'
import LogicFlow, {
	CircleNodeModel,
	CircleNode,
	RectNode,
	RectNodeModel,
	DiamondNode,
	DiamondNodeModel,
	EllipseNode,
	EllipseNodeModel,
	PolygonNode,
	PolygonNodeModel,
	PolylineEdge,
	PolylineEdgeModel,
	h,
} from '@logicflow/core'

import '@logicflow/core/dist/style/index.css'
import { mapGetters } from 'vuex'
import { ImagePreview } from 'vant';
export default {
	name: 'flow-chart',
	data() {
		return {
			statusColor: {
				default: 'grey',
				done: 'green',
				doing: 'red',
			},
			isShowPanel: false,
			currentDisplayNode: {},
			top: 0,
			left: 0,
			display: 'none',
			totalList: [],
			beforeNode: {},
			lf: undefined,
			src:''
		}
	},
	mounted: function () {
		// console.log('imgLocationimgLocationimgLocation', this.imgLocation)
		// this.$nextTick(() => {
		// 	if (this.formNo) {
		// 		this.getAllFormNodeAndRender(this.formNo)
		// 	}
		// })
		this.getImage()
	},
	computed: {
		...mapGetters([
			'bpmFormMain',
			'bpmFormStep'
		]),
		roleList() {
			const {
				participantValue = []
			} = this.currentDisplayNode || {};
			return participantValue || [];
		},
		auditor() {
			const {
				auditor = []
			} = this.currentDisplayNode || {};
			return auditor || [];
		},

		formNo() {
			return this.bpmFormMain && this.bpmFormMain.formNo
		},
		// 支付金额
		paymentAmount() {
			return this.bpmFormMain && this.bpmFormMain.paymentAmount;
		},
	},
	watch:{
		bpmFormMain:{
			immediate:true,
			handler(val){
				if(val && val.procInstId){
					this.getImage()
				}
			}
		}
	},
	components: {

	},
	methods: {
		preview(){
			ImagePreview({
				images:[this.src],
				overlayStyle:{'backgroundColor':'rgba(255,255,255,.99'}
			})
		},
		getImage(){
			this.src = httpService().getProcessImageByProcInstId() +
              "?random" +
              Math.random() +
              "&procInstId=" +
              this.bpmFormMain.procInstId;
		},
		getAllFormNodeAndRender(formNo) {
			httpService(this)
				.getAllFormNode({
					'vars[formNo_EQ]': formNo,
				})
				.then((res) => {
					console.log(res)
					this.renderNodes(res.body)
				})
		},

		wordLimit(str, maxNum) {
			if (!str) {
				return ''
			}

			if (str.length > maxNum) {
				return str.slice(0, maxNum) + '...'
			}
			return str
		},

		setHoverStyle({ top, left, display }) {
			// console.log(top, left, display);
			this.top = top
			this.left = left
			this.display = display
		},

		renderNodes(data) {
			const self = this


			let staticStepName = [
				'通知开票', // UIG-FSSC #14647 开票申请单的审批环节图中没有“通知开票”节点
				'财务补充信息', // 资产卡片新增流程，独有环节
				'财务审批', // 资产卡片新增流程，独有环节
				'填写付款账户',
				'影像审核',
				'共享审核', // 资产卡片新增流程，独有环节
				'本地补充信息',
				'共享初审',
				'共享复核',
				'付款审核',
				'共享账务处理',
				'资金二级审核'

				// 这两个节点
				// '财务稽核',
				// '等待过账'
			]

			// UIG-FSSC #14611
			// 支付金额为0时，跳过付款审核、共享账务处理环节
			if (Number(this.paymentAmount) === 0) {
				staticStepName = [
					'通知开票',
					'财务补充信息', // 资产卡片新增流程，独有环节
					'财务审批', // 资产卡片新增流程，独有环节
					'填写付款账户',
					'影像审核',
					'共享审核', // 资产卡片新增流程，独有环节
					'本地补充信息',
					'共享初审',
					'共享复核',
					// '付款审核',
					// '共享账务处理',
					// '资金二级审核'
				]
			}

			data = data.map((e) => {
				return {
					...e,
					participantValue: e.participantValue
						? JSON.parse(e.participantValue)
						: '',
					auditor: e.auditor ? JSON.parse(e.auditor) : '',
				}
			})

			// 提交单据
			const submitList = data.filter((e) => e.taskDefName === '提交单据')

			// 合理性审批
			const reasonList = _.sortBy(
				data.filter((e) => e.taskDefName === '业务合理性审批'),
				(e) => e.auditIndex,
			).map((e) => {
				return {
					...e,
					participantValue: [e.participantValue],
					participantType: [e.participantType],
					auditor: [e.auditor],
				}
			})
			// console.log('合理性审批环节', reasonList);

			// 共享审批环节
			const shareList = []

			staticStepName.forEach((name) => {
				const list = data.filter((e) => e.taskDefName === name)
				// 可能每个环节有多个同名的，合并

				const participantValue = list.map((e) => e.participantValue)
				const participantType = list.map((e) => e.participantType)

				const auditor = list.map((e) => e.auditor)

				if (!_.isEmpty(list)) {
					shareList.push({
						...list[0],
						participantValue,
						participantType,
						auditor,
					})
				}
			})
			// console.log('共享审批环节', shareList);

			this.totalList = [...submitList, ...reasonList, ...shareList]

			// console.log('排序好的节点', this.totalList);

			// 判断是当前节点
			const currentNode =
				this.totalList.find((e) => e.attribute6 === 'currentTask') || {}

			const currentNodeIndex = this.totalList.findIndex(
				(e) => e.attribute6 === 'currentTask',
			)
			// attribute6 == currentTask

			console.log('当前节点', currentNode && currentNode.taskDefName)
			console.log('当前节点', currentNode);

			if (currentNode && currentNode.taskDefName === '业务合理性审批') {

				let participantValueCode = ''
				let participantValueName = ''
				let participantValueType = ''

				if (currentNode.participantValue) {
					if (_.isArray(currentNode.participantValue[0])) {
						participantValueName = currentNode.participantValue[0].map(e => e.name).join(',')
						participantValueCode = currentNode.participantValue[0].map(e => e.code).join(',')
						participantValueType = currentNode.participantValue[0].map(e => e.type).join(',')
					} else {
						participantValueName = currentNode.participantValue[0].name
						participantValueCode = currentNode.participantValue[0].code
						participantValueType = currentNode.participantValue[0].type
					}
				}

				console.log('业务合理性审批修改字段', participantValueCode, participantValueName, participantValueType)

				this.$store.dispatch('setBpmFormStep', {
					...this.bpmFormStep,
					participantValueCode,
					participantValueName,
					participantValueType,
				})
			}

			// 判断是否归档
			const isAchived = _.isEmpty(currentNode)

			// 计算nodes
			// 去掉开始节点
			// let nodes = [
			//   {
			//     id: 1,
			//     type: 'circle',
			//     text: '开始',
			//     x: 40,
			//     y: 180,
			//   },
			// ];
			let nodes = []

			// 第一行数据
			const firstLine = [...submitList, ...reasonList]
			// 合理性环节大于3，并且存在共享环节，即存在第二行
			const isSecondLine = firstLine.length > 4 && shareList.length
			let length = shareList.length + firstLine.length

			const lf = new LogicFlow({
				container: document.querySelector('#container'),
				isSilentMode: true,
				stopScrollGraph: true, // 禁止鼠标滚动移动画布
				stopZoomGraph: true, // 禁止缩放画布
				width: 300,
				height: length > 2 ? length * 160 + 100 : 400,
				grid: false, // 网格关闭
				// grid: {
				//   type: 'dot',
				//   size: 20,
				// },
			})

			this.lf = lf

			this.lf.setTheme({
				rect: {
					width: 120,
					height: 80,
					radius: 6,
					// fill: 'rgb(62, 175, 124)',
					// fill: '#5981dd',
					// fill: '#9dbafb',
					// fill: '#b6c6f3',
					strokeWidth: 2,
				},
				ellipse: {
					rx: 60,
					ry: 40,
					radius: 6,
					// fill: '#6edd97',
					// fill: '#c0edb8',
					strokeWidth: 2,
				},
				diamond: {
					rx: 60,
					ry: 40,
					radius: 6,
					// fill: '#6edd97',
					// fill: '#f5f572',
					strokeWidth: 2,
				},
				circle: {
					r: 20,
					// fill: '#FFFFFF',
					// fill: '#f1afaf',
					strokeWidth: 2,
				},
				nodeText: {
					fontSize: 14,
					color: '#34415b',
				},
				edgeText: {
					fontSize: 16,
					color: '#34415b',
				},
				anchor: {
					fill: '#6edd97',
				},
			})

			// 自定义节点
			class StartModel extends DiamondNodeModel {
				constructor(data, graphModel) {
					super(data, graphModel)
					const property = data.properties
					// @ts-ignore
					this.stroke = self.statusColor[property.status]
					this.fill = property.fillColor || 'white'
				}
			}

			lf.register({
				type: 'start',
				view: DiamondNode,
				model: StartModel,
			})

			class ReasonalApprovalModel extends EllipseNodeModel {
				constructor(data, graphModel) {
					super(data, graphModel)
					const property = data.properties
					// @ts-ignore
					this.stroke = self.statusColor[property.status]
					this.fill = property.fillColor || 'white'
				}
			}

			lf.register({
				type: 'reasonal',
				view: EllipseNode,
				model: ReasonalApprovalModel,
			})

			class ApprovalModel extends RectNodeModel {
				constructor(data, graphModel) {
					super(data, graphModel)
					console.log(data, graphModel)

					const property = data.properties
					// @ts-ignore
					this.stroke = self.statusColor[property.status]
					this.fill = property.fillColor || 'white'
				}
			}

			lf.register({
				type: 'approve',
				view: RectNode,
				model: ApprovalModel,
			})

			class FinshModel extends CircleNodeModel {
				constructor(data, graphModel) {
					super(data, graphModel)
					console.log(data, graphModel)
					const property = data.properties
					// @ts-ignore
					this.stroke = self.statusColor[property.status]
					this.fill = property.fillColor || 'white'
				}
			}

			lf.register({
				type: 'finish',
				view: CircleNode,
				model: FinshModel,
			})

			firstLine.forEach((value, index) => {
				let gapWidth = 0
				let type = ''
				let text = ''
				if (index === 0) {
					// r / 2 + 40 + width / 2
					gapWidth = 120
					type = 'start'
					text = value.taskDefName
				} else {
					// width / 2 + 40 + width / 2
					gapWidth = 160
					type = 'reasonal'

					if (value.participantValue) {
						if (_.isArray(value.participantValue[0])) {
							text = value.participantValue[0].map((e) => e.name).join(',')
						} else {
							text = value.participantValue[0].name
						}
					} else {
						text = value.taskDefName
					}

					let user = ''
					if (value.auditor) {
						if (_.isArray(value.auditor[0])) {
							user = value.auditor[0].map((e) => e.USER_NAME).join(',')
						} else {
							user = value.auditor[0].USER_NAME
						}
					}

					text = this.wordLimit(text, 8) + '\n' + this.wordLimit(user, 8)
				}

				let status = ''
				if (isAchived) {
					status = 'done'
				} else {
					if (index < currentNodeIndex) {
						status = 'done'
					} else if (index == currentNodeIndex) {
						status = 'doing'
					} else {
						status = 'default'
					}
				}

				nodes.push({
					id: value.id,
					type: type,
					properties: {
						status,
					},
					x: 180,
					y: nodes.length - 1 >= 0 ? nodes[nodes.length - 1].y + gapWidth : 60,
					text: text,
				})
			})

			// 共享环节开始换行
			// console.log(nodes)



			shareList.forEach((value, index) => {
				// width / 2 + 40 + width / 2
				let gapWidth = 160

				let text = value.taskDefName
				if (index === 0) {
					gapWidth = 0
				} else {
					gapWidth = 160
				}

				const user = value.auditor
					? value.auditor
						.reduce((previousValue, currentValue) => {
							return previousValue.concat(currentValue)
						}, [])
						.map((e) => e.USER_NAME)
						.join(',')
					: ''

				text = this.wordLimit(text, 8) + '\n' + this.wordLimit(user, 8)

				let status = ''
				if (isAchived) {
					status = 'done'
				} else {
					if (firstLine.length + index < currentNodeIndex) {
						status = 'done'
					} else if (firstLine.length + index == currentNodeIndex) {
						status = 'doing'
					} else {
						status = 'default'
					}
				}


				gapWidth = 160

				nodes.push({
					id: value.id,
					type: 'approve',
					x: 180,
					y: nodes[nodes.length - 1].y + gapWidth,
					text: text,
					properties: {
						status,
					},
				})
			})

			let status = ''
			if (isAchived) {
				status = 'doing'
			} else {
				status = 'default'
			}


			nodes.push({
				id: 9999,
				type: 'finish',
				text: '归档',
				x: 180,
				y: nodes.length - 1 >= 0 ? nodes[nodes.length - 1].y + 120 : 60,
				properties: {
					status,
				},
			})

			// 计算edges
			let edges = []
			nodes.forEach((value, index) => {
				if (index + 1 < nodes.length) {
					edges.push({
						type: 'polyline',
						sourceNodeId: value.id,
						targetNodeId: nodes[index + 1].id,
					})
				}
			})
			// console.log(edges)

			const renderData = {
				nodes,
				edges,
			}

			this.lf.render(renderData)
			// 滚动到当前节点位置
			const container = document.querySelector('#chartBox')
			container.scrollTo({
				top: currentNodeIndex * 120,
				behavior: 'smooth'
			})
			this.lf.on('node:click', ({ data, e, position }) => {
				// console.log(e, data, position);

				this.currentDisplayNode = this.totalList.find((e) => e.id === data.id)

				if (!_.isEqual(this.beforeNode, data)) {
					this.isShowPanel = true
				} else {
					this.isShowPanel = !this.isShowPanel
				}

				this.beforeNode = data

				if (data.type === 'circle' || data.type === 'diamond') {
					this.isShowPanel = false
				} else {
					this.setHoverStyle({ top: e.clientY - 60, left: e.clientX - 100 })
				}
			})

			this.lf.on('blank:click', ({ e }) => {
				this.isShowPanel = false

				this.setHoverStyle({ top: e.clientY - 60, left: e.clientX - 100 })
			})
		},
	},
}
</script>
<style>
.xpendable .weui-cells {
	max-height: 30rem;
	overflow-y: auto;
}

.hover-panel {
	z-index: 200;
	position: absolute;
}

.box-card {
	background-color: #fff;
	padding: .8rem;
	box-shadow: 0 .2rem 1rem 0 rgb(0 0 0 / 10%);
}

.box-card .header {
	padding-bottom: .8rem;
	border-bottom: 0.1rem solid #f2f2f2;
	margin-bottom: .8rem;
}
</style>
