import isObject from 'lodash/isObject'
import clone from 'lodash/clone'
import isString from 'lodash/isString'
import difference from 'lodash/difference'
import { getAfterDay } from 'utils/functions'

export const initData = (arr, start, end, initMoney = 0) => {
	const resultArr = []
	arr.map(item => {
		item.excludeTime = isString(item.excludeTime) ? JSON.parse(item.excludeTime) : item.excludeTime
		const value = getAfterDay(
			new Date(start).getTime(),
			new Date(end).getTime(),
		)
		item.value = difference(value, item.excludeTime)
		item.value.map(item2 => {
			resultArr.push({
				attribute1: initMoney,
				excludeTime: item2,
				travelName: item.travelName
			})
		})
	})
	return resultArr
}

// 转换成foods提交的歌声
export const transformFoodsData = arr => {
	const result = []
	arr.map(item => {
		item.valueShow.map(item2 => {
			result.push({
				attribute1: item2.money,
				excludeTime: item2.date,
				travelName: item.travelName,
			})
			return item2
		})
		return item
	})
	return result
}
