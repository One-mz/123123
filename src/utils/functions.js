import { dateFormat } from 'vux'
import divide from 'lodash/divide'
import isObject from 'lodash/isObject'
import isArray from 'lodash/isArray'
import isString from 'lodash/isString'
import isNumber from 'lodash/isNumber'
import isNaN from 'lodash/isNaN'
import every from 'lodash/every'
import some from 'lodash/some'
import reduce from 'lodash/reduce'
import flatten from 'lodash/flatten'

export function transformTohump(str, divider = '-') {
	var strArr = str.split(divider)
	for (var i = 1; i < strArr.length; i++) {
		strArr[i] = strArr[i].charAt(0).toUpperCase() + strArr[i].substring(1)
	}
	return strArr.join('')
}

/**
 *	获取两个时间戳内的日期
 * @param {前一个时间戳} timestamp1
 * @param {后一个时间戳} timestamp2
 */
export function getAfterDay(timestamp1, timestamp2) {
	if (!timestamp1 || !timestamp2) return
	if (timestamp2 - timestamp1 < 0) return
	const oneDayTimestamp = 24 * 60 * 60 * 1000
  let arr = []
	for (let index = timestamp1; index <= timestamp2; index += oneDayTimestamp) {
		arr.push(dateFormat(index, 'YYYY-MM-DD'))
	}
	return arr
}

/**
 * @description 对象中是否有相同key
 */
export function iskeyNotInArray(arr, key) {
	if (isArray(arr)) {
		return arr.some(item => item === key)
	}
	throw new Error('Param is not a legal Array.')
}
/**
 *
 * @param {提交的对象} obj
 */
export function checkRequestRequired(obj, excepts = []) {
	if (isObject(obj)) {
		return every(obj, (value, key) => {
			if (!iskeyNotInArray(excepts, key)) {
				return value !== ''
			}
			return true
		})
	}
	throw new Error('Param is not a legal Object.')
}

export function transform2Arr(arr, type) {
	const resArr = arr.map((item, index) => {
		item.index = index
		return item
	})
	const keys =  Array.from(new Set(arr.map(item => item[type])))
	return keys.map(item => {
		const obj = {}
		obj.key = item
		obj.value = resArr.filter(p => p[type] === item)
		return obj
	})
}

export function objectJoin(array,field, seperator){
	let sep = ',';
	if(seperator){
		sep = seperator;
	}
	return reduce(array,function(sum,n){
		return sum + sep + n[field]
	},'').substr(sep.length)
}



/**
 * 验证提交结果
 * @param {array} arr
 */
export function validate(arr) {
	console.log(arr)
	if (!isArray(arr)) {
		throw new Error('Not a valid Array')
	}
	return arr.every(item => {
		if (isArray(item)) {
			return item.length
		} else if (isString(item)) {
			return item !== ''
		} else if (isNumber(item)) {
			return !isNaN(item)
		}
		return item
	})
}

/**
 * 字符串转化为数组
 */
export function stringToArray(str) {
	let result
	if (isArray(str)) {
		result = str
	}
	if (isString(str)) {
		try {
			result = JSON.parse(str)
		} catch (error) {
			result = {}
		}
	}
	return result
}
