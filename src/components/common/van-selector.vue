
<template>
	<div >
		<van-field
			:label="label"
			:value="value"
			:placeholder="placeholder || '请选择'"
			input-align="right"
			readonly
			@click="clickField"
			:clearable="clearable"
			@clear="onClear"
			:clickable="!disabled"
			:right-icon="!disabled && value ? 'close' : ''"
			@click-right-icon="onClear"
			is-link
		/>
		<van-popup
			v-model="visible"
			position="top"
			style="height: 100%;background:#f2f2f2"
			get-container="#app"
		>
			<div style="padding-bottom: 60px">
				<van-search
					v-if="searchOptions.searchKey"
					v-model="searchValue"
					@search="onSearch(true)"
					placeholder="请输入"
				/>
				<van-list
					v-model="loading"
					:finished="finished"
					finished-text="没有更多了"
					@load="onSearch"
				>
					<template v-if="useSlotItem">
						<div style="position:relative" v-for="(item,index) in list" @click="choice = { ...item, index: index }" :key="index">
							<slot
								name="item"
								:row="item"

							>
							</slot>
							<van-icon
								style="position:absolute;left:20px;top:2px"
								name="success"
								v-if="choice.index == index"
								size="20"
								color="#66aaaa"
							/>
						</div>

					</template>
					<template v-else>
						<van-cell
							v-for="(item, index) in list"
							:key="index"
							:title="item[showKeys[0]]"
							:label="item[showKeys[1]]"
							@click="choice = { ...item, index: index }"
						>
							<template #right-icon>
								<van-icon
									name="success"
									v-if="choice.index == index"
									size="18"
									color="#66aaaa"
								/>
							</template>
							<template #title v-if="useSlot">
								<slot :data="item" name="title"></slot>
							</template>
							<template #label v-if="useSlot">
								<slot :data="item" name="label"></slot>
							</template>
						</van-cell>
					</template>
				</van-list>
			</div>
			<div class="button">
				<van-button type="default" @click="visible = false">取消</van-button>
				<van-button type="info" @click="getChoice">确定</van-button>
			</div>
		</van-popup>
	</div>
</template>
<script>
import httpService from 'components/httpService'

export default {
	model: {
		prop: 'value',
		event: 'change',
	},
	name: 'VanSelector',
	props: {
		searchOptions: {
			type: Object,
			require: true,
			default: () => {
				return {
					url: '', // 请求地址
					searchKey: '', //搜索字段
				}
			},
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		showKeys: {
			type: Array,
			default: () => {
				return ['name', 'value']
			},
		},
		value: String,
		label: String,
		placeholder: String,
		additionParams: Object, //默认参数
		useSlot: Boolean, //展示内容使用slot
		useSlotItem:Boolean, //展示自定义item
		clearable: {
			type: Boolean,
			default: true,
		},
		// visible:Boolean
	},
	data() {
		return {
			searchValue: '',
			list: [],
			loading: false,
			finished: false,
			choice: {}, // 选择
			pageNo: 1,
			visible: false,
		}
	},
	watch: {
		visible(val) {
			if (val) {
				this.onSearch(true)
			}
		},
	},
	mounted() {},
	methods: {
		clickField() {
			if (this.disabled) {
				return
			} else {
				this.visible = true
			}
		},
		onSearch(isFirst = false) {
			this.pageNo++
			if (isFirst) {
				this.pageNo = 1
				this.list = []
			}
			let params = {}
			// params.append('pageNo', this.pageNo)
			// params.append('pageSize', 10)
			// params.append('dbOrders[0].property', 'id')
			// params.append('dbOrders[0].orderTypeEnum', 'DESC')
			params['dbOrders[0].orderTypeEnum'] = 'DESC'
			params['pageNo'] = this.pageNo
			params['pageSize'] = 10
			params['dbOrders[0].property'] = 'id'
			params['dbOrders[0].orderTypeEnum'] = 'DESC'

			if (this.searchValue) {
				// params.append('_search', true)
				// params.append(
				// 	`vars['${this.searchOptions.searchKey}_CENTERLIKE']`,
				// 	this.searchValue,
				// )
				params['_search'] = true
				params[`vars['${this.searchOptions.searchKey}_CENTERLIKE']`] =
					this.searchValue
			}
			if (this.additionParams) {
				// for(let i in this.additionParams){
				// 	params.append(i,this.additionParams[i])
				// }
				params = {
					...params,
					...this.additionParams,
				}
			}
			console.log('params :>> ', params)
			this.loading = true
			console.log('this.searchOptions :>> ', this.searchOptions)
			httpService(this)
				[this.searchOptions.url](params)
				.then((res) => {
					console.log(res)

					this.list = [...this.list, ...res.data.result]
					if (this.list.length >= res.data.totalCount) {
						this.finished = true
					}
				})
				.finally(() => {
					this.loading = false
				})
		},
		getChoice() {
			let choice = this.choice
			if (JSON.stringify(choice) == '{}') {
				this.$toast('请选择')
				return
			}
			this.$emit('change', choice[this.showKeys[0]])
			this.$emit('onConfirm', choice)
			this.visible = false
		},
		onClear($event) {
			$event.stopPropagation()
			this.choice = {}
			this.$emit('change', this.choice[this.showKeys[0]])
			this.$emit('onConfirm', this.choice)
		},
	},
}
</script>
<style  scoped>
.button {
	position: fixed;
	bottom: 0;
	width: 100%;
	height: 60px;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: #fff;
}
.button button {
	flex: 1;
	height: 60px;
}
</style>
