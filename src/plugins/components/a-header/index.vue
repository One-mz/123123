<template>
	<div>
		<header class="header">
			<div class="header-left">
				<!-- <Avator @click.native='onShowPopup' :name='name' :size='30'/> -->
				<img
					src="../../../assets/top_arrow.png"
					alt=""
					@click="onShowPopup"
					:class="{ 'is-active': showPopup, hamburger: true }"
				/>
			</div>
			<div class="header-content">{{ title }}</div>
			<!--<div class='header-right' @click='showModel'>-->
			<div class="header-right">
				<!--<x-icon type="ios-plus-empty" size="30"></x-icon>-->
			</div>
		</header>
		<Actionsheet
			v-model="show"
			:menus="menus"
			@on-click-menu="clickMenu"
			show-cancel
		/>
		<div v-transfer-dom>
			<popup v-model="showPopup" position="left" width="50%">
				<group>
					<cell
						value-align="left"
						v-for="(item, index) in urls"
						:key="index"
						@click.native="sendToUrl(item.url)"
					>
						{{ item.title }}
					</cell>
					<x-button type="default" @click.native="logout">{{
						$t('common.user.logout')
					}}</x-button>
				</group>
			</popup>
			<van-popup v-model="showLanguagePicker" round position="bottom">
				<van-picker
					show-toolbar
					:columns="langColumns"
					@cancel="showLanguagePicker = false"
					@confirm="pickLanguage"
				/>
			</van-popup>
		</div>
	</div>
</template>
<script>
import httpService from '../../../components/httpService'
import Avator from 'plugins/components/avator'
import availableFlows from 'config/available-flow'
import Cookies from 'js-cookie'
import {
	Actionsheet,
	XButton,
	Group,
	Cell,
	TransferDom,
	Popup,
	Tabbar,
	TabbarItem,
} from 'vux'

export default {
	props: {
		name: '',
		title: {
			type: String,
			default: '共享平台',
		},
	},
	directives: {
		TransferDom,
	},
	components: {
		XButton,
		Group,
		Cell,
		Popup,
		Tabbar,
		TabbarItem,
		Avator,
		Actionsheet,
	},
	computed: {
		menus() {
			const obj = {}
			availableFlows.map((item, index) => {
				obj[index] = item.title
				return item
			})
			return obj
		},
		langColumns() {
			return [
				{
					text: '中文简体',
					value: 'zh-CN',
					disabled: this.$i18n.locale == 'zh-CN',
				},
				{
					text: '中文繁體',
					value: 'zh-TW',
					disabled: this.$i18n.locale == 'zh-TW',
				},
				{
					text: 'English',
					value: 'en',
					disabled: this.$i18n.locale == 'en',
				},
			]
		},
	},
	data() {
		return {
			showLanguagePicker: false,
			urls: [
				{
					url: '/home',
					title: '首页',
				},
				{
					url: '/draft',
					title: '我的报账',
				},
				{
					url: '/todo',
					title: '我的待办',
				},
				{
					url: '/done',
					title: '我的已办',
				},
				{
					url: '/invoicesList/false',
					title: '我的发票',
				},
			
			],
			showPopup: false,
			show: false,
			isActive: false,
		}
	},
	methods: {
		pickLanguage(lang) {
			console.log(lang)
			this.$i18n.locale = lang.value
			Cookies.set('language', lang.value)
			this.showLanguagePicker = false
			this.showPopup = false
			this.$toast(this.$t('common.langselect.switchlanguage'))
			this.$router.push('/home')
		},
		logout() {
			return httpService(this)
				.logoutIndexService()
				.then((res) => {
					console.log('登出', res)

					sessionStorage.clear()
					this.$store.commit('setBpmInfo', {
						code: 'userInfo',
						value: {},
					})
					this.$store.commit('setDepartInfo', {})
					// this.$router.push('/')
					window.localStorage.setItem('user', '')
					this.eraseCookie('SESSION')

					this.eraseCookie('belongShareCode')
					this.eraseCookie('companyCode')
					this.eraseCookie('sapCompanyCode')
					this.eraseCookie('shareCompanyCodes')
					this.eraseCookie('shareSapCompanyCodes')
					this.eraseCookie('multipleFlag')
					this.showPopup = false
				})
		},
		onShowPopup() {
			this.showPopup = true
		},
		sendToUrl(url) {
			if (url == 'language') {
				this.showLanguagePicker = true
				return
			}
			this.showPopup = false
			this.$store.commit('initState', '')
			this.$store.commit('revertToInit')
			this.$router.push(url)
		},
		clickMenu(index) {
			if (index === 'cancel') {
				return
			}
			const bizType = availableFlows[index].bizTypeCode
			const link = availableFlows[index].link
			this.$store.dispatch('setCurrentFlow', {
				bizType,
				id: 'new',
			})
			// 清除记录
			this.$store.commit('clearStore', {
				storeType: availableFlows[index].storeType,
			})
			this.$store.commit('initState', '')
			this.$router.go(0)

			// 应该跳转的路径
			// /flow/new/:bizType
			this.$router.push(link)
		},
		showModel() {
			this.show = true
		},
	},
}
</script>

<style lang="scss" scoped>
.header {
	display: flex;
	padding: 0 10px;
	justify-content: space-between;
	align-items: center;
	height: 50px;
	background-color: #f5f5f5;
	// border-bottom: 1px solid #ccc;
	// box-shadow: 1px 1px rgba(0, 0, 0, 0.2);
	position: relative;

	&-content {
		font-size: 18px;
		font-weight: 700;
		position: absolute;
		left: 50%;
		transform: translateX(-50%) translateY(-50%);
		top: 50%;
		width: 80%;
		text-align: center;
	}
	&-right {
		height: 100%;
		display: flex;
		align-items: center;
	}
}
.hamburger {
	// display: inline-block;
	// vertical-align: middle;
	width: 20px;
	height: 18px;
}

.hamburger.is-active {
	transform: rotate(180deg);
}
</style>
