<template>
	<van-popup v-model="popupShow" position="top" style="height: 100%">
		<div style="padding-bottom: 60px">
			<!-- <van-search v-model="oldBankName" :placeholder="'请输入名称'" @search="onSearch(true)" /> -->
			<van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onSearch">
				<van-cell v-for="item in list" :key="item.id" :title="item.label" :label="item.value"
					@click="choice = item">
					<template #right-icon>
						<van-icon name="success" v-if="choice.id == item.id" size="18" color="#66aaaa" />
					</template>
				</van-cell>
			</van-list>
		</div>
		<div class="button">
			<van-button type="default" @click="popupShow = false">取消</van-button>
			<van-button type="info" @click="onConfirm">确定</van-button>
		</div>
	</van-popup>
</template>
<script>
import httpService from 'components/httpService'

export default {
	name: 'common-seletor',
	props: {
	},
	data() {
		return {
			oldBankName: '',
			list: [],
			loading: false,
			finished: false,
			choice: {}, // 选择
			pageNo: 1,
			popupShow: false,
			config: {}
		}
	},
	mounted() {
		// this.onSearch(true)
	},
	methods: {
		onSearch(isFirst = false) {
			this.pageNo++
			if (isFirst) {
				this.pageNo = 1
				this.list = []
			}
			let params = new FormData()
			params.append('pageNo', this.pageNo)
			params.append('pageSize', 10)
			params.append('dbOrders[0].property', 'id')
			params.append('dbOrders[0].orderTypeEnum', 'DESC')
			// if(this.oldBankName){
			//   params.append('_search', true)
			//   params.append("vars['oldBankName_CENTERLIKE']", this.oldBankName)
			// }
			// 固定参数
			if (this.config.fixedSearchForm) {
				for (let key in this.config.fixedSearchForm) {
					console.log(key);
					params.append(key, this.config.fixedSearchForm[key])
				}
			}
			this.loading = true
			this.config
				.api(params)
				.then((res) => {
					console.log(res)
					if (res.data.result) {
						this.list = [...this.list, ...res.data.result.map(item => {

							return {
								...item,
								label: item[this.config.format.label],
								value: item[this.config.format.value],
							}
						})]
						if (this.list.length >= res.data.totalCount) {
							this.finished = true
						}
					} else {
						this.finished = true
					}

				}).catch(() => {
					this.finished = true

				})
				.finally(() => {
					this.loading = false
				})
		},
		show(config) {
			this.config = config
			this.popupShow = true
			this.onSearch(true)
		},
		onConfirm() {
			if (!this.choice) {
				this.$toast(`请选择${this.config.name}`)
				return
			}
			this.config.fn(this.choice)
			this.popupShow = false
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
