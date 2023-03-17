<template>
	<div class="background-image">
		<div class="header">
			<x-icon
				class="arrow"
				type="ios-arrow-left"
				size="30"
				@click="back"
			></x-icon>
		
		</div>

		<flexbox orient="vertical" style="margin-bottom: 15px">
			<flexbox-item style="text-align: center">
				<!-- TODO logo替换 -->
			</flexbox-item>

			<flexbox-item style="text-align: center; margin-top: 20px">
				<h2 class="title">财务共享平台</h2>
		
			</flexbox-item>
		</flexbox>
		<div class="box">
			<div class="content-title">
				{{ $t('common.title.personalTask') }}
			</div>
			<van-row style="padding: 0 10px">
				<van-col span="6">
					<div class="flex-div host-div" @click="myUndo()">
						<i class="iconfont icon-dianzifapiao"></i>
						<div class="link-img primary-bg">
							<img src="../../assets/home/todo.png" />
						</div>
						我的待办
					</div>
				</van-col>
				<van-col span="6">
					<div class="flex-div host-div" @click="myApplication()">
						<div class="link-img warning-bg">
							<img src="../../assets/home/draft.png" />
						</div>
						我的报账
					</div>
				</van-col>
				<van-col span="6">
					<div class="flex-div host-div" @click="myCompleted()">
						<div class="link-img success-bg">
							<img src="../../assets/home/completed.png" />
						</div>
						我的已办
					</div>
				</van-col>
				<van-col span="6">
					<div class="flex-div host-div" @click="myInvoice()">
						<div class="link-img success-bg">
							<img src="../../assets/home/my_invoices.png" />
						</div>
						我的发票
					</div>
				</van-col>
				
			
			</van-row>
		</div>

		<flexbox orient="vertical" :gutter="0" class="footer-group">
			<flexbox-item
				span="12"
				align="center"
				style="font-size: 0.5rem; color: rgb(0, 65, 116)"
			>
				<div class="link-img primary-bg">
					<!--<img src="../../assets/home/footer.png" style="width:40vw;opacity: 0.8">-->
				</div>
				<div>本服务由财务共享运营平台提供</div>
				<!-- <div>联系方式0571-86660131</div> -->
			</flexbox-item>
		</flexbox>
	</div>
</template>

<script>
import { Flexbox, FlexboxItem, Confirm, TransferDom } from 'vux'
import { mapGetters, mapState } from 'vuex'

export default {
	name: 'home',
	components: {
		Flexbox,
		FlexboxItem,
		Confirm,
	},
	directives: {
		TransferDom,
	},
	beforeCreate() {},
	data() {
		return {
			formNoStr: '',
			totalCount: '',
			font: 18,
			font2: 12,
			activeNames: ['1', '2', '3'],
		}
	},
	computed: {
		...mapGetters(['userInfo']),
		...mapState({
			bpmInfo: (state) => state.bpmInfo,
			isShowOvertimeReminder: (state) => state.isShowOvertimeReminder,
		}),

		companyName() {
			return this.bpmInfo.departInfo.companyName
		},
	},
	created() {
		var $dom = document.createElement('div')
		$dom.style = 'font-size:10px;'
		document.body.appendChild($dom)
		// 计算出放大后的字体
		var scaledFontSize = parseInt(
			window.getComputedStyle($dom, null).getPropertyValue('font-size'),
		)
		document.body.removeChild($dom)
		// 计算原字体和放大后字体的比例
		var scaleFactor = 10 / scaledFontSize

		// 取html元素的字体大小
		// 注意，这个大小也经过缩放了
		// 所以下方计算的时候 *scaledFontSize是原来的html字体大小
		// 再次 *scaledFontSize才是我们要设置的大小
		//      var originRootFontSize = parseInt(window.getComputedStyle(document.documentElement, null).getPropertyValue('font-size'));
		//      document.documentElement.style.fontSize = originRootFontSize * scaleFactor*2 + 'px';
		this.font = this.font * scaleFactor
		this.font2 = this.font2 * scaleFactor
	},
	beforeMount() {},
	mounted() {
		this.$store.state.fileList = []
		this.$store.state.invoices = []
		this.$store.commit('setShroffAccount', {})
		localStorage.removeItem('fp_list')
	},
	methods: {
		back() {
			
		},

		
		myApplication() {
			this.$router.push('/draft')
		},
		myUndo(processType = '') {
			if (!processType) {
				this.$router.push('/todo')
			} else {
				this.$router.push({
					path: '/todo',
					query: {
						process: processType,
					},
				})
			}
		},

		myDone() {
			this.$router.push('/done')
		},
		myCompleted() {
			this.$router.push('/completed')
		},
		myInvoice(){
			this.$router.push('/invoicesList/false')

		},

		openInvoiceInfo() {
			this.$router.push('/invoiceBasicInfo')
		},
	},
}
</script>

<style scoped>
.header {
	/* height: 2vh; */
	width: 100%;
	position: fixed;
	left: 0;
	top: 0;
	display: flex;
	justify-content: space-between;
	align-items: center;
	z-index: 10;
	padding: 10px;
}
.title {
	font-size: 18px;
	font-weight: 700;
}
.flex-row-center {
	display: flex;
	align-items: center;
}
.flex-row-center img {
	margin-right: 4px;
}
.box {
	/* padding: ; */
	background: #fff;
	border-radius: 8px;
	margin: 0 16px 10px;
}
.content-title {
	font-size: 16px;
	color: #333333;
	/* font-weight: 700; */
	padding: 10px;
}
.flex-div {
	color: #333;
	height: 10vh;
	margin-bottom: 15px;
	font-size: 12px;
	background-clip: padding-box;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	text-align: center;
	padding: 0 10px;
}
.flex-div .link-img {
	width: 32px;
	height: 32px;
	border-radius: 4px;
	overflow: hidden;
	margin-bottom: 4px;
	display: flex;
	align-items: center;
	justify-content: center;
}
.flex-div .link-img img {
	/* margin-bottom: 3px; */
	width: 16px;
	height: 16px;
}

.background-image {
	/* height: 100%; */
	padding-bottom: 20px;
	/* background: url('../../assets/background.jpeg') no-repeat 100% 100%; */
}

.arrow {
}

.invoice-upload {
	/* float: right; */
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin: 0 16px;
	padding: 0 10px;
	color: #2b61b1;
	background-color: #e4e9f8;
	border-radius: 11px;
	height: 22px;
	max-width: 100px;
}
.invoice-upload div {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	/* margin-right: 50px; */
}

.process-group {
	/* padding-left: 5%;
	padding-right: 5%; */
	/* padding-bottom: 5rem; */
}

.task-group {
	/* padding-left: 5%;
	padding-right: 5%; */
}

.button-div {
	line-height: 30px;
	margin-left: 5vw;
	color: #333;
	text-align: center;
}

.icon {
	display: block;
	fill: #333;
}

.footer-group {
	/* position: fixed; */
	/* bottom: 0.5vh; */
}
.host-div:active,
.host-div:focus {
	position: relative;
	left: -2px;
	top: -2px;
	box-shadow: 0 0 15px 1px rgba(0, 0, 0, 0.2);
}
</style>
