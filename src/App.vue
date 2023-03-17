<template>
	<div id="app">

		<!-- <div v-if="showCompanies"> -->
    	
		<router-view></router-view>
		<van-tabbar route v-show="['/home'].includes(routePath)">
			<!-- <van-tabbar-item replace to="/infomationChart" icon="bar-chart-o">数据</van-tabbar-item> -->
			<van-tabbar-item replace to="/home" icon="apps-o">工作台</van-tabbar-item>
			<!-- <van-tabbar-item replace to="/invoicesList/false" icon="balance-list-o">发票上传</van-tabbar-item> -->

		</van-tabbar>

	</div>
</template>
<script>
import httpService from './components/httpService'
import _ from 'lodash'
import { SessionStore } from '@/utils/store'
import { Group, Checklist, XInput, XButton, Popup, Divider } from 'vux'
import { mapState } from 'vuex'
import { Base64 } from '@/utils/base64'

export default {
	name: 'app',
	components: {
		Group,
		XInput,
		XButton,
		Popup,
		Checklist,
		Divider,
	},
	data() {
		return {
			getToken: '',
			asyncList: [],
			asyncListValue: [],
			showCompanies: false,
			companiesInfo: [],
			userInfo: {},
		}
	},
	computed: {
		...mapState({
			bpmInfo: (state) => state.bpmInfo,
		}),
	
		routePath(){
			return this.$route.path
		}
	},
	watch: {
		
	},
	mounted() {
		
	},
	methods: {
		
	},
}
</script>

<style lang="less">
@import '~vux/src/styles/reset.less';
@import '~vux/src/styles/1px.less';

*,
*:before,
*:after {
	box-sizing: border-box;
}
body {
	background-color: #fff;
	// background-color: #fbf9fe;
}
a {
	text-decoration: none;
	cursor: pointer;
}
html,
body,
#app {
	height: 100%;
	font-size: 14px;
	// padding-bottom: 50px;
}
.vux-tab{
	background: transparent !important;
}
.vux-tab .vux-tab-item{
	background:none !important
}
.weui-cells,
.weui-cell,
.vux-tab .vux-tab-item,
.item-atom,
.com-filter-list,
.uploader-wrapper #uploadbutton #uploadspan,
.vux-table,
.invoice-info .weui-label,
.invoice-info .weui-input  {
	font-size: 16px !important;
}
.vux-tab .vux-tab-item {
	font-size: 16px !important;
}
.item-atom {
	font-size: 16px !important;
}
.weui-cells__title {
	font-size: 18px !important;
}

.scrollable .vux-tab-item {
    -webkit-box-flex: 0;
    -webkit-flex: 0 0 24% !important;
    flex: 0 0 24% !important;
}
.confirmButton{
	position: fixed;
	bottom: 10px;
	left: 50%;
	transform: translateX(-50%);
	width: 85%;
}
</style>
