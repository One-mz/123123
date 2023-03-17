import axios from 'axios'
import md5 from 'js-md5';
import * as moment from 'moment';
import router from '@/router'
import i18n from '@/lang' // internationalization

function setUpAxios(Vue) {
	Vue.prototype.$http = (function() {

		axios.defaults.withCredentials = true
		let instance = axios.create({
			withCredentials: true,
			crossDomain: true,
			// headers:{
			// 	'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS',
			// 	'Access-Control-Allow-Origin':'*.*',
			// }
		})
		//general monitor for requesting
		instance.interceptors.request.use(
			function(res) {
				// res.headers['Access-Control-Allow-Origin'] =
				// res.headers['Access-Control-Allow-Credentials'] = true;
				// res.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept,Set-Cookie';

        // request头加认证
        const appid = process.env.VUE_APP_ID;
        const secret = '4&&@r*w!gBxm$8oz';
        const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');

        const appsecret = md5(`${appid}:${timestamp}:${secret}`)

        res.headers['appid'] = appid
        res.headers['timestamp'] = timestamp
        res.headers['appsecret'] = appsecret
        res.headers['LANGUAGE'] = i18n.locale

				return res
			},
			function(error) {
				console.error('request error', error)
				return Promise.reject(error)
			},
		)
		instance.interceptors.response.use(
			function(response) {
        let res = response.data

        const {
          message = '',
          success
        } = res;

        if (response.request.status === 200) {
          // 是否是token 失效
          if (message.toLowerCase() === '未提供token' || message.toLowerCase() === 'token已过期' || message.toLowerCase() === 'token无效') {
            // 跳转至登录
            Vue.$Dialog.alert({
              type: 'warn',
              message: `登录失效`,
              beforeClose:(action,done)=>{
                done()
                // router.replace('/login')
              },
              time: 2000,

            })
          }

          // 对于流程结束的提示
          if (!success && message.includes('该环节操作已结束')) {
            Vue.$Dialog.alert({
              type: 'warn',
              message: message,
              beforeClose:(action,done)=>{
                done()
                router.replace('/home')
              },
              time: 2000,

            })
          }
          try {
            res = (res.data ? (typeof res.data === 'string' ? JSON.parse(res.data) : res.data):res.data) || res // 后台统一封装operResult
          } catch (e) {
            res = res.data || res;
          }
        }
        response.data = res
				response.body = response.data
				return response
			},
			function(error) {
				console.error('出现问题：', error)
        if (error.response && error.response.status === 401) {
          Vue.$Dialog.alert({
            type: 'warn',
            message: `401未授权`,
            beforeClose:(action,done)=>{
              done()
            }
          })
          return Promise.reject(error)
        }

				return Promise.reject(error)
			},
		)

		return instance
	})()
}

export default {
	install: setUpAxios,
}
