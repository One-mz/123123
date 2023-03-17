import isNumber from 'lodash/isNumber'
import isNaN from 'lodash/isNaN'

/**
 * 转化为数值类型
 */
export const toNumber = (p) => {
  const num = Number(p)
  return isNumber(num) && !isNaN(num) ? num : 0
}