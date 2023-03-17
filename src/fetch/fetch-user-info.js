import { post2 } from 'plugins/components/ajax'
import { API_USERINFO } from './api'

/**
  @param
 *  vars[user.userId_EQ] : 20000606
 *  isActive: 1
 */
const fetchUserInfo = (userid, isActive = 1) => {
	const vars = {}
	vars['user.userId_EQ'] = userid
	return new Promise((resolve, reject) => {
		post2(API_USERINFO, {
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

export default fetchUserInfo
