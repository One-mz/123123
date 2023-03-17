import isObject from 'lodash/isObject'
import isArray from 'lodash/isArray'
// 由于打包uglifyjs失败，改为从utils中引入
// import { Base64 } from 'js-base64'
import { Base64 } from '@/utils/base64'


export const SessionStore = {
	set(key, value) {
		if (isObject(value) || isArray(value)) {
			let str = JSON.stringify(value)
      str = Base64.encode(str);
			sessionStorage.setItem(key, str)
		}
	},
	get(key) {
		let str = sessionStorage.getItem(key)

		let result
		try {
      str = Base64.decode(str);
			result = JSON.parse(str)
		} catch(err) {
			result = str
		}
		return result
	}
}
