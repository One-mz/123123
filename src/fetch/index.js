import { post2 } from 'plugins/components/ajax'
import * as api from './api'

/**
 	@description 获取部门信息
  @param
 *  vars[user.userId_EQ] : 20000606
 *  isActive: 1
 */
export const fetchDepartInfo = (userid, isActive = 1) => {
	const vars = {}
	vars['user.userId_EQ'] = userid
	return new Promise((resolve, reject) => {
		post2(api.API_USERINFO, {
			vars,
			isActive,
		})
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}
