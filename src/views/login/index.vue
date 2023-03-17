<template>
	<div class="container">
		<header class="header">
			<h1 class="header-title">TPV集团共享平台登录</h1>
		</header>
		<div v-if="!showCompanies">
			<group gutter="10px" label-align="left">
				<x-input
					class="mb-20"
					required
					placeholder="请输入用户名"
					text-align="left"
					title="用户名"
					v-model="username"
				>
					<slot name="label"> </slot>
				</x-input>
			</group>
			<group gutter="10px" label-align="left">
				<x-input
					class="mb-20"
					required
					placeholder="请输入密码"
					text-align="left"
					type="password"
					title="密 码"
					v-model="password"
				>
				</x-input>
			</group>

			<group>
				<x-button
					@click.native="userLogin()"
					type="primary"
					:readonly="!isvVerify"
					:show-loading="isLoading"
					>登录
				</x-button>
			</group>
		</div>
		
	</div>
</template>
<script>
import httpService from 'components/httpService'
import _ from 'lodash'
import { SessionStore } from '@/utils/store'
import { Group, Checklist, XInput, XButton, Popup, Divider } from 'vux'
import { Base64 } from '@/utils/base64'
import md5 from 'js-md5'
import Cookies from 'js-cookie'

export default {
	name: 'login',
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
			username: '',
			password: '',
			isLoading: false,
			logtoken: '',
			asyncList: [],
			asyncListValue: [],
			showCompanies: false,

			userInfo: {},
			src: '',
			attribute1: '',
		}
	},
	computed: {
		isvVerify() {
			return this.username && this.password && this.attribute1
		},
	},
	mounted() {
		this.src = httpService().getValidImage()
	},
	methods: {
		handleChange() {
			this.src = httpService().getValidImage() + '?random' + Math.random()
		},
		checkForm() {
			if (!this.name || !this.password || !this.attribute1) {
				return false
			}
			return true
		},

		userLogin() {
			// if (!this.isvVerify) {
			// 	this.$dialog.alert({
			// 		message: '请填写用户名与密码',
			// 	})
			// 	return
			// }
			let formData = new FormData()
			this.isLoading = true
			
			formData.append('userId', '105349')
			formData.append('userPwd.userPwd', 'sph123456')

			return httpService(this)
				.loginIndexService(formData)
				.then((res) => {
					console.log('loginres', res)
					let msg = res.data.message
					let code = res.data.code
					let success = res.data.success
						this.isLoading = false

					if (!success) {
						this.$dialog.alert({
							message: msg,
						})
						reject(msg)
					} else {
						let user = {
							userId:105349,
							userName:''
						}	
						SessionStore.set('user', user)
						this.$store.commit('setBpmInfo', {
							code: 'userInfo',
							value: user,
						})
						this.$router.replace('/home')

					}
				})
				// .then((res) => {
				// 	this.isLoading = false
				// 	console.log('user session', res)

				// 	this.userInfo = res.data.user
				// 	window.localStorage.setItem('user', this.username)

				// 	this.createCookie('LOGIN_FROM_SOURCE', 'FSSC')
				// 	this.createCookie(
				// 		'CURRENT_USER_ACCOUNT',
				// 		encodeURI(Base64.encode(this.username)),
				// 	)
				// 	this.$router.replace('/home')
					
				// })
				.catch((err) => {
					this.isLoading = false
				})
		},

	},
}
</script>

<style lang="scss" scoped>
.container {
	padding: 0 1vh;
	height: 100%;
	background-color: #fff;
}

.header {
	padding-top: 10vh;
	margin-bottom: 8vh;
	text-align: center;
	&-title {
		font-size: 26px;
	}
	&-subTitle {
		font-size: 20px;
	}
}
</style>
